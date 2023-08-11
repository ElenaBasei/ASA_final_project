//Agent intention revision and execution loop
import { Intention } from "./intention.js";
import {PddlProblem} from "@unitn-asa/pddl-client"
import { AStar } from "./astar.js";
import { Beliefs } from "./belief_revision.js";
import { Planner } from "./planner.js";

class Agent {

    #intention_queue = [];
    get intention_queue () {
        return this.#intention_queue;
    }

    revising_queue = false;
    intention = null;

    constructor(config, client, beliefs, env_map, planner){
        this.config = config;
        this.env_map = env_map;
        this.astar_search = new AStar(this.env_map);
        this.beliefs = beliefs;
        this.planner = planner;
        this.client = client;
    }

    async intentionLoop ( ) {
        while ( true ) {
            var stopped = false;
            var failed = false;
            var success = false;
            var achieve_trial = 0;
            
            // Consumes intention_queue if not empty
            if ( this.intention_queue.length > 0 && !this.revising_queue) {
                console.log( 'Agent', this.beliefs.me.name, 'intention.loop', this.intention_queue.map(i=>i.element.predicate) );
            
                // Current intention
                this.intention = this.intention_queue[0];

                //check validity of first intention
                if(this.config[0].PARCEL_DECADING_INTERVAL != 'infinite'){
                    let distance = this.compute_best_distance(this.intention, this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y));

                    const now = Date.now();

                    for(let i=0; i<this.intention.element.predicate.args.length; i++){
                        let time_diff = parseFloat((now - this.intention.element.predicate.args[i].observtion_time)/1000);
                        time_diff /= this.config[0].PARCEL_DECADING_INTERVAL;

                        let reward = parseInt(this.intention.element.predicate.args[i].reward - time_diff - (distance *
                            this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL));

                        if(reward <= 0){
                            console.log('Agent', this.beliefs.me.name, 'skipping intention', this.intention.element.predicate.desire, this.intention.element.predicate.args)
                            this.intention.element.predicate.args.splice(i,1);

                            if(this.intention.element.predicate.args.length == 0){
                                this.intention_queue.shift();
                                await new Promise( res => setImmediate( res ) )
                                    .catch(error => {
                                        console.log('Agent', this.beliefs.me.name, 'unknown error', error);
                                    });
                                continue;
                            }
                            distance = this.compute_best_distance(this.intention, this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y));
                        }
                    }
                }

                this.resume();

                while(!success && achieve_trial<5 && !stopped){
                    console.log('Agent', this.beliefs.me.name, 'Try number', achieve_trial+1)
                    var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                                        .catch( error => {
                                            console.error('Agent', this.beliefs.me.name, 'intention.element.achieve', error);
                                            return ['failed intention'];
                                        })
                    console.log('Agent', this.beliefs.me.name, status);
                    if(status[0] == 'stopped intention' || this.intention.element.stopped){
                        stopped = true;
                    }
                    else if(status[0] == 'failed intention' || status[0] == 'plan not found'){
                        failed = true;
                        achieve_trial+=1;
                        this.intention.element.resume();
                    }
                    else if(status[0] == 'succesful intention'){
                        success = true;
                    }
                    else if(status[0] == 'give intention to ally'){
                        let predicate = {desire: 'go_pick_up', args: [this.intention.element.predicate.args[status[1]]]}

                        let ret = this.client.ask( this.beliefs.ally.id, {
                            information_type: 'send_unreachable_parcel',
                            info: predicate
                        } );

                        if(ret == false){
                            this.beliefs.dbParcels.delete(this.intention.element.predicate.args[status[1]].id)
                        }
                        else{
                            let parcel = this.intention.element.predicate.args[status[1]];
                            parcel.carriedBy = 'ally';
                            this.beliefs.dbParcels.set(parcel.id, parcel);
                        }
                        this.intention.element.predicate.args.splice(status[1],1);
                        this.intention.element.resume();
                        if(this.intention.element.predicate.args.length == 0)
                            success = true;

                    }
                    else{
                        throw 'stop';
                    }
                }

                // Remove from the queue
                if(success || failed){
                    if(failed){
                        for(const p of this.intention.element.predicate.args){
                            this.beliefs.dbParcels.delete(p.id);
                        }
                    }

                    this.intention_queue.shift();
                }

                console.log("int" + this.intention.element)
                    
            }
            else if(!this.revising_queue){ //random move if the agent do not percive any parcel
                if(this.beliefs.holding.length != 0){
                    let predicate = {desire: 'go_put_down', args: this.beliefs.holding}
                    this.intention = new QElement(new Intention(this,predicate))

                    while(!success && achieve_trial<5 && !stopped){
                        console.log('Agent', this.beliefs.me.name, 'Try number', achieve_trial+1)
                        var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                                            .catch( error => {
                                                console.error('Agent', this.beliefs.me.name, 'intention.element.achieve', error);
                                                return ['failed intention'];
                                            })
                        console.log('Agent', this.beliefs.me.name, status);
                        if(status[0] == 'stopped intention' || this.intention.element.stopped){
                            stopped = true;
                        }
                        else if(status[0] == 'failed intention' || status[0] == 'plan not found'){
                            failed = true;
                            achieve_trial+=1;
                            this.intention.element.resume();
                        }
                        else if(status[0] == 'succesful intention'){
                            success = true;
                        }
                        else{
                            throw 'stop';
                        }
                    }

                    if(failed){
                        this.beliefs.holding = [];
                    }
                }
                else{
                    let found = false;
                    var x = 0;
                    var y = 0;

                    if(this.env_map.spawn_tiles.length > 0){
                        var rand_tile = Math.floor(Math.random() * (this.env_map.spawn_tiles.length-1));
                        x = this.env_map.spawn_tiles[rand_tile].x;
                        y = this.env_map.spawn_tiles[rand_tile].y;
                    }
                    else{
                        while(!found){
                            x = Math.floor(Math.random() * (this.env_map.map_width-1));
                            y = Math.floor(Math.random() * (this.env_map.map_height-1));
        
                            if(this.env_map.map.get(x).get(y) != 'not_tile' && (x != this.beliefs.me.x || y != this.beliefs.me.y))
                                found = true;
                        }
                    }

                    let predicate = {desire: 'random_move', args: [{x: x, y: y}]}
                    this.intention = new QElement(new Intention(this,predicate))

                    // Start achieving intention
                    var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                                        .catch( error => {
                                            console.error('Agent', this.beliefs.me.name, 'intention.element.achieve', error);
                                            return 'failed intention';
                                        })
                    console.log('Agent', this.beliefs.me.name, 'here',status);
                    if(status[0] == 'stopped intention'){
                        stopped = true;
                    }
                    else if(status[0] == 'failed intention'  || status[0] == 'plan not found'){
                        failed = true;
                    }
                }

            }

            // Postpone next iteration at setImmediate
            await new Promise( res => setImmediate( res ) )
            .catch(error => {
                console.log('Agent', this.beliefs.me.name, 'unknown error', error);
            });
        }
    }

    async validity_check(){
        while(true){
            if (!this.revising_queue) {
                this.revising_queue = true;

                //check validity of intentions
                for(let index=0; index<this.intention_queue.length; index++){
                    var intention = this.intention_queue[index].deep_copy();
                    var changed = false;

                    if(intention.element.predicate.desire == 'go_pick_up'){
                        for(let i=0; i<intention.element.predicate.args.length; i++){
                            var predicate = intention.element.predicate.args[i];

                            if(!this.beliefs.dbParcels.has(predicate.id) || (predicate.carriedBy != null && predicate.carriedBy != this.beliefs.me.id)){
                                intention.element.predicate.args.splice(i,1);
                                i--;
                                changed = true;
                            }
                        }

                        if(intention.element.predicate.args.length == 0){
                            if(index == 0){
                                console.log('here')
                                this.stop();
                            }
                            this.intention_queue.splice(index, 1);
                            index--;
                        }
                        else if(changed){
                            if(index == 0){
                                console.log('here2')
                                this.stop();
                            }
                            this.intention_queue[index] = intention;
                        }
                    }
                }

                //check order of intentions
                if(this.config[0].PARCEL_DECADING_INTERVAL != 'infinite' && this.intention_queue.length > 0){
                    let start = this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y);
                    let prev_intention = this.intention_queue[0].deep_copy();
                    var total_distance = this.compute_best_distance(prev_intention, start);

                    //console.log("intention queue" + this.intention_queue.length)

                    for(let i=1; i<this.intention_queue.length; i++){
                        console.log(this.intention_queue[i])
                        start = prev_intention.delivery;

                        let intention_copy = this.intention_queue[i].deep_copy();
                        let best_distance = this.compute_best_distance(intention_copy, start);
                        let best_utility = this.compute_reward(intention_copy, best_distance + total_distance)[0];
                        let best_step = i;
                        let next_intention = intention_copy;

                        for(let j=i+1; j<this.intention_queue.length; j++){
                            intention_copy = this.intention_queue[j].deep_copy();
                            let distance = this.compute_best_distance(intention_copy, start);
                            let act_utility = this.compute_reward(intention_copy, distance + total_distance)[0];

                            if(act_utility > best_utility){
                                best_step = j;
                                best_utility = act_utility;
                                next_intention = intention_copy;
                                best_distance = distance;
                            }
                        }

                        let swap = this.intention_queue[i];
                        this.intention_queue[i] = this.intention_queue[best_step];
                        this.intention_queue[best_step] = swap;

                        prev_intention = next_intention;
                        total_distance += best_distance;
                    }
                }

                this.revising_queue = false;
            }
            await new Promise( res => setImmediate( res ) )
            .catch(error => {
                console.log('Agent', this.beliefs.me.name, 'unknown error', error);
            });
        }
    }

    // Add new intention
    async push ( predicate ) {
        if(!this.revising_queue){
            console.log( 'Agent', this.beliefs.me.name, 'Revising intention queue. Received', predicate );        
            this.revising_queue = true;

            // intention queue revision is case of random_move as first intention queued
            if(this.intention == null || ((this.intention != null && this.intention.element.predicate.desire == 'random_move')) && predicate){
                this.stop();
                console.log('Agent', this.beliefs.me.name, 'random')
                var new_intention = new QElement(new Intention(this,predicate));
                var best_distance = this.compute_best_distance(new_intention.deep_copy(), this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y));

                if(best_distance != -1){
                    this.intention_queue.push(new_intention);

                    this.beliefs.dbParcels.set( predicate.args[0].id, predicate.args[0]);
                    if(this.beliefs.ally!=null){
                        await this.client.say( this.beliefs.ally.id, {
                            information_type: 'confirm_pick_up',
                            info: predicate,
                        } );
                    }  
                }
                this.revising_queue = false;
                //this.intention = null;
                await new Promise( res => setImmediate( res ) );
                return true;
            }
            else if(predicate && this.intention != null && this.intention.element.predicate.desire != 'go_put_down') { //order intention based on utility function (reward - cost)                
                
                let insertion_index = this.find_best_utility(predicate)[0];
                
                if(insertion_index == -1){
                    this.revising_queue = false;
                    await new Promise( res => setImmediate( res ) );
                    return false;
                }

                if(insertion_index == this.intention_queue.length){
                    var new_intention = new QElement(new Intention(this,predicate));
                    this.intention_queue.push(new_intention);
                }
                else{
                    // - eventually stop current one
                    if(insertion_index == 0){
                        this.stop();
                    }
                    this.intention_queue[insertion_index].element.predicate.args.push(predicate.args[0]);
                }                
            }
            else{
                console.log('Agent', this.beliefs.me.name, 'Revision finished')
                this.revising_queue = false;
                await new Promise( res => setImmediate( res ) );
                return false;
            }

            this.beliefs.dbParcels.set( predicate.args[0].id, predicate.args[0]);
            if(this.beliefs.ally!=null){
                await this.client.say( this.beliefs.ally.id, {
                    information_type: 'confirm_pick_up',
                    info: predicate,
                } );
            }

            console.log('Agent', this.beliefs.me.name, 'Revision finished')
            this.revising_queue = false;
            await new Promise( res => setImmediate( res ) );
            return true;
        }
        else{
            return false
        }
    }

    async stop ( motive = null) {
        if(motive == null){
            console.log( 'Agent', this.beliefs.me.name, 'stop agent queued intentions');
            if (this.intention)
                this.intention.element.stop();
            for (const intention of this.intention_queue) {
                intention.element.stop();
            }
        }
        else{
            console.log( 'Agent', this.beliefs.me.name, 'stop agent queued intentions');
            if (this.intention != null){
                if(this.intention.element.predicate.desire != 'go_put_down')
                    this.intention.element.stop();
            }
                
            for (const intention of this.intention_queue) {
                if(this.intention.element.predicate.desire != 'go_put_down')
                    intention.element.stop();
            }

            this.revising_queue = true;
            var predicate = false;
            while(predicate == false){
                predicate = await this.client.ask( this.beliefs.ally.id, {
                    information_type: 'new_pick_up'
                } );
            }

            console.log(predicate)

            this.intention_queue.unshift(new QElement(new Intention(this,predicate)));
            this.beliefs.dbParcels.set(predicate.args[0].id, predicate.args[0]);

            console.log("predicate" + this.intention_queue[0].element.predicate)

            this.revising_queue = false;
        }
    }

    async resume ( ) {
        console.log( 'Agent', this.beliefs.me.name, 'resume agent queued intentions');
        if (this.intention)
            this.intention.element.resume();
        for (const intention of this.intention_queue) {
            intention.element.resume();
        }
    }

    h( {x:x1, y:y1}, {x:x2, y:y2}) {
        const dx = Math.abs( Math.round(x1) - Math.round(x2) )
        const dy = Math.abs( Math.round(y1) - Math.round(y2) )
        return dx + dy;
    }

    find_best_utility(predicate){
        let insertion_index=-1;

        if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
            var best_utility = Number.MAX_VALUE;    
        }
        else{
            var best_utility = Number.MIN_VALUE;
        }

        let act_utility;
        let new_intention = new QElement(new Intention(this,predicate))

        for(var i=1; i<=this.intention_queue.length; i++){

            act_utility = this.compute_utility(i, new_intention);

            if(act_utility != false){
                if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                    if(best_utility > act_utility){
                        best_utility = act_utility;
                        insertion_index = i;
                    }
                }
                else{
                    if(best_utility < act_utility){
                        best_utility = act_utility;
                        insertion_index = i;
                    }
                }
            }
        }

        return [insertion_index, best_utility];
    }

    compute_utility(step, new_intention){
        let total_distance = 0;
        let total_reward = 0;
        let prev_position = this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y);

        for(let i=1; i<=this.intention_queue.length; i++){
            if(i == step){
                if(i == this.intention_queue.length){
                    let distance = this.compute_best_distance(new_intention, prev_position);

                    if(distance != -1)
                        total_distance += distance;
                    else
                        return false;

                    let reward = this.compute_reward(new_intention, total_distance);

                    if(reward[0] <= 0 || reward[1])
                        return false;

                    total_reward += reward[0];
                }
                else{
                    let intention_copy = this.intention_queue[i].deep_copy();
                    intention_copy.element.predicate.args.push(new_intention.element.predicate.args[0]);
                    let distance = this.compute_best_distance(intention_copy, prev_position)

                    if(distance != -1)
                        total_distance += distance;
                    else
                        return false;

                    let reward = this.compute_reward(intention_copy, total_distance);

                    if(reward[0] <= 0 || reward[1])
                        return false;
                    
                    total_reward += reward[0];

                    prev_position = intention_copy.delivery;
                }
            }
            else if(i != this.intention_queue.length){
                let intention_copy = this.intention_queue[i].deep_copy();
                let distance = this.compute_best_distance(intention_copy, prev_position)

                if(distance != -1)
                        total_distance += distance;
                    else
                        return false;

                total_reward += this.compute_reward(intention_copy, total_distance)[0];

                prev_position = intention_copy.delivery;
            }
        }

        return total_reward;
    }

    compute_best_distance(intention, start){
        let total_distance = 0;
        let best_step_cost = Number.MAX_VALUE;
        let best_step = -1;

        for(let i=0; i<intention.element.predicate.args.length; i++){
            if(i == 0)
                best_step_cost = this.astar_search.search(start, this.env_map.map.get(intention.element.predicate.args[i].x).get(intention.element.predicate.args[i].y), this.h);
            else
                best_step_cost = this.astar_search.search(this.env_map.map.get(intention.element.predicate.args[i-1].x).get(intention.element.predicate.args[i-1].y),
                    this.env_map.map.get(intention.element.predicate.args[i].x).get(intention.element.predicate.args[i].y), this.h);

            if(best_step_cost == -1)
                return -1;

            best_step = i;
            for(var j=i+1; j<intention.element.predicate.args.length; j++){
                if(i == 0){
                    var act_step_cost = this.astar_search.search(start, this.env_map.map.get(intention.element.predicate.args[j].x).get(intention.element.predicate.args[j].y), this.h);
                }
                else{
                    var act_step_cost = this.astar_search.search(this.env_map.map.get(intention.element.predicate.args[i-1].x).get(intention.element.predicate.args[i-1].y),
                        this.env_map.map.get(intention.element.predicate.args[j].x).get(intention.element.predicate.args[j].y), this.h);
                }

                if(act_step_cost == -1)
                    return -1;

                if(best_step_cost > act_step_cost){
                    best_step = j;
                    best_step_cost = act_step_cost
                }
                    
            }

            total_distance += best_step_cost +1;

            var swap = intention.element.predicate.args[i];
            intention.element.predicate.args[i] = intention.element.predicate.args[best_step];
            intention.element.predicate.args[best_step] = swap;
        }

        let delivery_distance = this.get_best_delivery(intention);

        if(delivery_distance != -1)
            total_distance += delivery_distance +1;
        else
            return -1;

        return total_distance;
    }

    get_best_delivery(intention){
        let best_step_cost=Number.MAX_VALUE;
        let best_step = -1;

        for(var i=0; i<this.env_map.delivery_tiles.length; i++){
            let act_step_cost = this.astar_search.search(this.env_map.map.get(intention.element.predicate.args[intention.element.predicate.args.length-1].x)
                .get(intention.element.predicate.args[intention.element.predicate.args.length-1].y),
                this.env_map.delivery_tiles[i], this.h);
            
            if(act_step_cost != -1 && best_step_cost > act_step_cost){
                best_step = i;
                best_step_cost = act_step_cost;
                intention.delivery = this.env_map.delivery_tiles[i];
            }
        }

        if(best_step != -1)
            return best_step_cost;
        else
            return -1;
    }

    compute_reward(intention, distance){
        if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite')
            return [distance, false];
        else{
            let total_reward = 0;
            let zero_flag = false;
            const now = Date.now();

            for(let i=0; i<intention.element.predicate.args.length; i++){
                let time_diff = parseFloat((now - intention.element.predicate.args[i].observtion_time)/1000);
                time_diff /= this.config[0].PARCEL_DECADING_INTERVAL;

                let reward = parseInt(intention.element.predicate.args[i].reward - time_diff - (distance *
                    this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL));

                if(reward > 0)
                    total_reward += reward;
                else
                    zero_flag = true;
            }

            return [total_reward, zero_flag];
        }
    }
}

class QElement {
    constructor(element)
    {
        this.element = element;
        this.cost = 0;
        this.reward = 0;
        this.delivery = null;
    }

    deep_copy(){
        return new QElement(this.element.deep_copy());
    }
}

export {Agent as Agent};