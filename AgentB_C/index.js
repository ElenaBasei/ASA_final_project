import { default as config } from "./config.js";
import { DeliverooApi } from "@unitn-asa/deliveroo-js-client";
import * as pddlClient from "@unitn-asa/pddl-client";
import {Beliefs} from './belief_revision.js';
import {EnvMap} from './map.js';
import {AStar} from './astar.js';
import {Agent} from './agentA.js';
import { Planner } from "./planner.js";

const clientB = new DeliverooApi(
    config.host,
    config.token
);

const clientC = new DeliverooApi(
    config.host,
    config.token2
);

clientB.onConnect( () => console.log( "socket", clientB.socket.id ) );
clientB.onDisconnect( () => console.log( "disconnected", clientB.socket.id ) );

clientC.onConnect( () => console.log( "socket", clientC.socket.id ) );
clientC.onDisconnect( () => console.log( "disconnected", clientC.socket.id ) );

const server_config = []

// Retrive server configuration
clientB.onConfig((config) => {
    server_config.push(config);
    if(server_config[0].PARCEL_DECADING_INTERVAL != 'infinite')
        server_config[0].PARCEL_DECADING_INTERVAL = parseInt(config.PARCEL_DECADING_INTERVAL.replace('s',''));
} )

// Creation of enviroment map and agents
const env_map = new EnvMap();
await env_map.retrieve_map(clientB);

const agentB = new Agent(server_config, clientB, env_map, ally_id);
const agentC = new Agent(server_config, clientC, env_map, ally_id);

agentB.intentionLoop();
agentB.validity_check();
agentC.intentionLoop();
agentC.validity_check();
