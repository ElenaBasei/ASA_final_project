import { default as config } from "./config.js";
import { DeliverooApi } from "@unitn-asa/deliveroo-js-client";
import * as pddlClient from "@unitn-asa/pddl-client";
import {Beliefs} from './belief_revision.js';
import {EnvMap} from './map.js';
import {AStar} from './astar.js';
import {Agent} from './agent.js';
import { Planner } from "./planner.js";

const client = new DeliverooApi(
    config.host,
    config.token
);

client.onConnect( () => console.log( "socket", client.socket.id ) );
client.onDisconnect( () => console.log( "disconnected", client.socket.id ) );

const server_config = []

// await new Promise(res => {
//     client.onConfig((config) => {
//         server_config = config;
//         console.log(server_config.PARCEL_DECADING_INTERVAL);
//         if(server_config.PARCEL_DECADING_INTERVAL != 'infinite')
//             server_config.PARCEL_DECADING_INTERVAL = parseInt(config.PARCEL_DECADING_INTERVAL.replace('s',''));
    
//         console.log(server_config.PARCEL_DECADING_INTERVAL);

//         res()
//     } )
// }) 

// Retrive server configuration
client.onConfig((config) => {
    server_config.push(config);
    if(server_config[0].PARCEL_DECADING_INTERVAL != 'infinite')
        server_config[0].PARCEL_DECADING_INTERVAL = parseInt(config.PARCEL_DECADING_INTERVAL.replace('s',''));
} )

// Creation of beliefs db, enviroment map, planner and single agent
const beliefs = new Beliefs(client, server_config);
const env_map = new EnvMap();
await env_map.retrieve_map(client);
const planner = new Planner(client, beliefs)
await planner.setDomain('./game-domain.pddl');

const agent = new Agent(server_config, beliefs, env_map, planner);

function distance( {x:x1, y:y1}, {x:x2, y:y2}) {
    const dx = Math.abs( Math.round(x1) - Math.round(x2) )
    const dy = Math.abs( Math.round(y1) - Math.round(y2) )
    return dx + dy;
}

// new parcel detection and new predicate generation
client.onParcelsSensing( async (parcels) => {    
    /**
     * Options
    */
    const options = [];
    const now = Date.now();

    for(const p of parcels){
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
    let best_utility = Number.MIN_VALUE;
    for (const option of options) {
        let current_i = option.desire;
        let current_d = distance( option.args[0], beliefs.me );
        if ( option.args[0].reward - current_d > best_utility ) {
            best_option = option;
            best_utility = option.args[0].reward - current_d;
        }
    }

    /**
     * Revise/queue intention 
    */
    if(best_option){
        beliefs.dbParcels.set( best_option.args[0].id, best_option.args[0]);
        var status = await agent.push( best_option )
        .catch( error => {
            console.error('push', error);
            beliefs.dbParcels.delete( best_option.args[0].id);
            return false;
        });

        if(!status){
            beliefs.dbParcels.delete( best_option.args[0].id);
        }
    }
})

agent.intentionLoop();

