import { default as config } from "./config.js";
import { DeliverooApi } from "@unitn-asa/deliveroo-js-client";
import * as pddlClient from "@unitn-asa/pddl-client";
import {Beliefs} from './belief_revision.js';
import {EnvMap} from './map.js';
import {AStar} from './astar.js';
import {Agent} from './agentB_C.js';
import { Planner } from "./planner.js";

const clientB = new DeliverooApi(
    config.host,
    config.token1
);

const clientC = new DeliverooApi(
    config.host,
    config.token2
);

clientB.onConnect( () => console.log( "socket", clientB.socket.id ) );
clientB.onDisconnect( () => console.log( "disconnected", clientB.socket.id ) );

clientC.onConnect( () => console.log( "socket", clientC.socket.id ) );
clientC.onDisconnect( () => console.log( "disconnected", clientC.socket.id ) );

const server_configB = []
const server_configC = []

// Retrive server configuration
clientB.onConfig((config) => {
    server_configB.push(config);
    if(server_configB[0].PARCEL_DECADING_INTERVAL != 'infinite')
        server_configB[0].PARCEL_DECADING_INTERVAL = parseInt(config.PARCEL_DECADING_INTERVAL.replace('s',''));
} )

clientC.onConfig((config) => {
    server_configC.push(config);
    if(server_configC[0].PARCEL_DECADING_INTERVAL != 'infinite')
        server_configC[0].PARCEL_DECADING_INTERVAL = parseInt(config.PARCEL_DECADING_INTERVAL.replace('s',''));
} )

// Creation of enviroment map and agents
const beliefsB = new Beliefs(clientB, server_configB);
const beliefsC = new Beliefs(clientC, server_configC);

const env_mapB = new EnvMap();
await env_mapB.retrieve_map(clientB);

const env_mapC = new EnvMap();
await env_mapC.retrieve_map(clientC);


const plannerB = new Planner(clientB, beliefsB)
await plannerB.setDomain('./game-domain.pddl');
const plannerC = new Planner(clientC, beliefsC)
await plannerC.setDomain('./game-domain.pddl');

const agentB = new Agent(server_configB, clientB, beliefsB, env_mapB, plannerB);
const agentC = new Agent(server_configC, clientC, beliefsC, env_mapC, plannerC);

beliefsB.define_on_message(agentB);
beliefsC.define_on_message(agentC);

function h( {x:x1, y:y1}, {x:x2, y:y2}) {
    const dx = Math.abs( Math.round(x1) - Math.round(x2) )
    const dy = Math.abs( Math.round(y1) - Math.round(y2) )
    return dx + dy;
}

// new parcel detection and new predicate generation
function define_new_parcel_sensing(client, beliefs, agent, config, astar_search, env_map){
    client.onParcelsSensing( async (perceived_parcels) => { 
        /**
         * Options generation
        */
        const options = [];
        const now = Date.now();
    
        for(const p of perceived_parcels){
            if ( ! beliefs.dbParcels.has(p.id) && !p.carriedBy) {
                var p_time = {
                    ...p,
                    'observtion_time' : now
                };
                options.push( { desire: 'go_pick_up', args: [p_time] } );
            }
        }
    
        /**
         * Select best intention
        */
    
        let best_option;
        let best_utility = ((config[0].PARCEL_DECADING_INTERVAL == 'infinite') ? Number.MAX_VALUE : Number.MIN_VALUE);
        
        for (const option of options) {
            let current_i = option.desire;
            let current_d = astar_search.search(env_map.map.get(beliefs.me.x).get(beliefs.me.y),
                env_map.map.get(option.args[0].x).get(option.args[0].y), h);
    
            if(config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                if ( current_d < best_utility ) {
                    best_option = option;
                    best_utility = current_d;
                }
            }
            else{
                let reward = option.args[0].reward - (current_d*config[0].MOVEMENT_DURATION / 1000 / config[0].PARCEL_DECADING_INTERVAL)
                if ( reward > best_utility ) {
                    best_option = option;
                    best_utility = reward;
                }
            }
        }
    
        /**
         * Revise/queue intention 
        */
        if(best_option){
            let best_utility = agent.find_best_utility(best_option)[1];
            console.log('Agent', beliefs.me.name, best_utility)
    
            //check if it is better that the ally pick up the parcel
            let reply = false;

            if(beliefs.ally != null){
                reply = await client.ask( beliefs.ally.id, {
                    information_type: 'parcel_pick_up',
                    info: best_option,
                    utility: best_utility
                } );
            }
    
            if(!reply){
                var status = await agent.push( best_option )
                .catch( error => {
                    console.log('push', error);
                    //beliefs.dbParcels.delete( best_option.args[0].id);
                    agent.revising_queue = false;
                    return false;
                });
    
                if(!status){
                    //beliefs.dbParcels.delete( best_option.args[0].id);
                    await client.say( beliefs.ally.id, {
                        information_type: 'drop_ally_intention',
                        info: best_option,
                    } );
                    agent.revising_queue = false;
                }
            }
            else{
                best_option.args[0].carriedBy = 'ally'
                beliefs.dbParcels.set( best_option.args[0].id, best_option.args[0]);
            }
        }
    })    
}

define_new_parcel_sensing(clientB, beliefsB, agentB, server_configB, new AStar(env_mapB), env_mapB);
define_new_parcel_sensing(clientC, beliefsC, agentC, server_configC, new AStar(env_mapC), env_mapC);

agentB.intentionLoop();
agentC.intentionLoop();
agentB.validity_check();
agentC.validity_check();
