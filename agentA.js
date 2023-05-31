//Agent intention revision and execution loop
import { Intention } from "./intention.js";
import {PddlProblem} from "@unitn-asa/pddl-client"
import { AStar } from "./astar.js";

class Agent {

    #intention_queue = new Array();
    get intention_queue () {
        return this.#intention_queue;
    }

    revising_queue = false;
    intention = null;

    constructor(config, beliefs, env_map, planner){
        this.config = config;
        this.beliefs = beliefs;
        this.env_map = env_map;
        this.planner = planner;
        this.astar_search = new AStar(this.env_map);
    }

    async intentionLoop ( ) {
        while ( true ) {
            var stopped = false;
            var failed = false;
            var success = false;
            var achive_trial = 0;
            
            // Consumes intention_queue if not empty
            if ( this.intention_queue.length > 0 && !this.revising_queue) {
                console.log( 'intention.loop', this.intention_queue.map(i=>i.element.predicate) );
            
                // Current intention
                this.intention = this.intention_queue[0];
                
                //Is queued intention still valid? Do I still want to achieve it?                
                var intention_to_drop = [];
                
                for(const p of this.intention.element.predicate.args){
                    if(!this.beliefs.dbParcels.has(p.id)){
                        console.log( 'Skipping intention because no more valid', {desire: 'go_pick_up', args: this.intention.element.predicate} )
                        intention_to_drop.push(p);
                    }
                }

                for(const p of intention_to_drop){
                    this.intention.element.predicate.args.splice(this.intention.element.predicate.args.indexOf(p),1);
                }
                this.intention_queue[0] = this.intention;

                if(this.intention.element.predicate.args.length == 0){
                    this.intention_queue.shift();
                    console.log('skip');
                    continue;
                }

                this.resume();

                while(!success && achive_trial<5 && !stopped){
                    console.log('Try number', achive_trial+1)
                    var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                                        .catch( error => {
                                            console.error('intention.element.achieve', error);
                                            return ['failed intention'];
                                        })
                    console.log(status);
                    if(status[0] == 'stopped intention'){
                        stopped = true;
                    }
                    else if(status[0] == 'failed intention' || status[0] == 'plan not found'){
                        failed = true;
                        achive_trial+=1;
                        this.intention.element.resume();
                    }
                    else if(status[0] == 'succesful intention'){
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

                    if(this.intention == this.intention_queue[0]){
                        this.intention_queue.shift();
                    }
                    else{
                        this.intention_queue.splice(this.intention_queue.indexOf(this.intention), 1);
                    }
                }
                    
            }
            else if(!this.revising_queue){ //random move if the agent do not percive any parcel
                if(this.beliefs.holding.length != 0){
                    let predicate = {desire: 'go_put_down', args: []}
                    this.intention = new QElement(new Intention(this,predicate))

                    // Start achieving intention
                    var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                                        .catch( error => {
                                            console.error('intention.element.achieve', error);
                                            return 'failed intention';
                                        })
                    console.log('here',status);
                    if(status[0] == 'stopped intention'){
                        stopped = true;
                    }
                    else if(status[0] == 'failed intention'  || status[0] == 'plan not found'){
                        failed = true;
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
                                            console.error('intention.element.achieve', error);
                                            return 'failed intention';
                                        })
                    console.log('here',status);
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
                console.log('unknown error', error);
            });
        }
    }

    // Add new intention
    async push ( predicate ) {
        if(!this.revising_queue){
            console.log( 'Revising intention queue. Received', predicate );        
            this.revising_queue = true;

            this.stop();

            // intention queue revision is case of random_move as first intention queued
            if(this.intention != null && (this.intention.element.predicate.desire == 'random_move' || this.intention.element.predicate.desire == 'go_put_down') && predicate){

                console.log('random')
                var new_intention = new QElement(new Intention(this,predicate));

                this.intention_queue.push(new_intention);

                this.revising_queue = false;
                this.intention = null;
                await new Promise( res => setImmediate( res ) );
                return true;
            }
            else if(predicate) { //order intention based on utility function (reward - cost)
                const total_distance = await this.update_distance()
                                            .catch( error => {
                                                console.error('update_distance', error);
                                                return -1;
                                            });
                if(total_distance == -1){
                    this.revising_queue = false;
                    await new Promise( res => setImmediate( res ) );
                    return false;
                }
                
                var insertion_index=0;
                var best_utility;
                var act_utility;
                var new_intention = new QElement(new Intention(this,predicate))

                for(var i=0; i<=this.intention_queue.length; i++){
                    if(i==0 && this.intention_queue.length!=0){
                        if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                            var new_step_cost = this.astar_search.search(this.intention_queue[i].element.predicate.args[this.intention_queue[i].element.predicate.args.length-1],
                                predicate.args[0], this.h);

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h(this.intention_queue[i].element.predicate.args[this.intention_queue[i].element.predicate.args.length-1], predicate.args[0]);

                            best_utility = total_distance + new_step_cost;
                        }
                        else{
                            var new_step_cost = this.astar_search.search(this.intention_queue[i].element.predicate.args[this.intention_queue[i].element.predicate.args.length-1],
                                predicate.args[0], this.h);

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h(this.intention_queue[i].element.predicate.args[this.intention_queue[i].element.predicate.args.length-1], predicate.args[0]);
                            var total_reward = this.get_step_reward(i, this.intention_queue[i].cost + new_step_cost);

                            best_utility = total_reward + predicate.args[0].reward - ((new_step_cost) *
                                this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);
                        }
                    }
                    else if(i==this.intention_queue.length){
                        if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                            if(i == 0){
                                var new_step_cost = this.astar_search.search(this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y), predicate.args[0], this.h);
                            }
                            else{
                                var new_step_cost = this.astar_search.search(this.intention_queue[i-1].delivery, predicate.args[0], this.h);
                            }

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h({x: this.intention_queue[i-1].delivery_x, y: this.intention_queue[i-1].delivery_y}, predicate.args[0]);
                            act_utility = total_distance + new_step_cost + 1

                            if( best_utility > act_utility){
                                best_utility = act_utility;
                                insertion_index = i;
                            }
                        }
                        else{
                            if(i == 0){
                                var new_step_cost = this.astar_search.search(this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y), predicate.args[0], this.h);
                            }
                            else{
                                var new_step_cost = this.astar_search.search(this.intention_queue[i-1].delivery, predicate.args[0], this.h);
                            }

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h({x: this.intention_queue[i-1].delivery_x, y: this.intention_queue[i-1].delivery_y}, predicate.args[0]);
                            var total_reward = this.get_step_reward(i, this.intention_queue[i-1].cost + new_step_cost);

                            act_utility = total_reward + predicate.args[0].reward - ((total_distance + new_step_cost) *
                                this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);

                            if( best_utility < act_utility){
                                best_utility = act_utility;
                                insertion_index = i;
                            }
                        }


                    }
                    else {
                        if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                            var new_step_cost = this.astar_search.search(this.intention_queue[i].delivery, predicate.args[0], this.h);

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h({x: this.intention_queue[i].delivery_x, y: this.intention_queue[i].delivery_y}, predicate.args[0]);
                            act_utility = total_distance - this.intention_queue[i].cost + new_step_cost;

                            if( best_utility > act_utility){
                                best_utility = act_utility;
                                insertion_index = i;
                            }
                        }
                        else{
                            var new_step_cost = this.astar_search.search(this.intention_queue[i].delivery, predicate.args[0], this.h);

                            if(new_step_cost == -1){
                                this.revising_queue = false;
                                await new Promise( res => setImmediate( res ) );
                                return false;
                            }
                            //this.h({x: this.intention_queue[i-1].delivery_x, y: this.intention_queue[i-1].delivery_y}, predicate.args[0]);
                            var total_reward = this.get_step_reward(i, this.intention_queue[i].cost + new_step_cost);
                            var step_cost = 0
                            for(var j=0; j<i; j++){
                                step_cost += this.intention_queue[j].cost;
                            }

                            act_utility = total_reward + predicate.args[0].reward - ((step_cost + new_step_cost) *
                                this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);

                            if( best_utility < act_utility){
                                best_utility = act_utility;
                                insertion_index = i;
                            }
                        }
                    }
                }

                if(insertion_index == this.intention_queue.length){
                    this.intention_queue.push(new_intention);
                }
                else{
                    this.intention_queue[insertion_index].element.predicate.args.push(predicate.args[0]);
                }
            }

            // // - eventually stop current one
            // if(this.intention_queue[0] != first_intention){
            //     this.stop();
            // }

            //TODO: check validity

            this.revising_queue = false;
            await new Promise( res => setImmediate( res ) );
            return true;
        }
        else{
            return false
        }
    }

    async stop ( ) {
        console.log( 'stop agent queued intentions');
        if (this.intention)
            this.intention.element.stop();
        for (const intention of this.intention_queue) {
            intention.element.stop();
        }
    }

    async resume ( ) {
        console.log( 'resume agent queued intentions');
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

    // compute optimal path for every set of pick-up_put-down action
    async update_distance(){
        var total_distance = 0

        for(var i=0; i<this.intention_queue.length; i++){
            this.intention_queue[i].cost = 0;

            for(var j=0; j<this.intention_queue[i].element.predicate.args.length; j++){
                if(j == 0){
                    var best_step_cost = this.astar_search.search(this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y), this.intention_queue[i].element.predicate.args[j], this.h)
                }
                else{
                    var best_step_cost = this.astar_search.search(this.intention_queue[i].element.predicate.args[j-1], this.intention_queue[i].element.predicate.args[j], this.h)    
                }

                if(best_step_cost == -1)
                        return -1;

                var best_step = j;
                for(var z=j+1; z<this.intention_queue[i].element.predicate.args.length; z++){
                    if(j == 0){
                        var act_step_cost = this.astar_search.search(this.env_map.map.get(this.beliefs.me.x).get(this.beliefs.me.y), this.intention_queue[i].element.predicate.args[z], this.h)
                    }
                    else{
                        var act_step_cost = this.astar_search.search(this.intention_queue[i].element.predicate.args[j-1], this.intention_queue[i].element.predicate.args[z], this.h)
                    }

                    if(act_step_cost == -1)
                        return -1;

                    if(best_step_cost > act_step_cost){
                        best_step = z;
                        best_step_cost = act_step_cost;
                    }
                }

                var swap = this.intention_queue[i].element.predicate.args[j];
                this.intention_queue[i].element.predicate.args[j] = this.intention_queue[i].element.predicate.args[best_step];
                this.intention_queue[i].element.predicate.args[best_step] = swap;

                total_distance += best_step_cost +1;
                this.intention_queue[i].cost += best_step_cost +1;
            }

            var best_delivery_cost = this.get_best_delivery(i);
            if(best_delivery_cost == -1)
                return -1;

            total_distance += best_delivery_cost + 1;
            this.intention_queue[i].cost += best_delivery_cost + 1;
        }
        return total_distance;
    }

    get_best_delivery(index){
        var best_step_cost=0;
        var best_step = 0;
        for(var j=0; j<this.env_map.delivery_tiles.length; j++){
            if(j == 0){
                var best_step_cost = this.astar_search.search(this.intention_queue[index].element.predicate.args[this.intention_queue[index].element.predicate.args.length-1],
                    this.env_map.delivery_tiles[j], this.h);

                if(best_step_cost == -1)
                    return -1;     
                
                    this.intention_queue[index].delivery = this.env_map.delivery_tiles[j];              
            }
            else{
                var act_step_cost = this.astar_search.search(this.intention_queue[index].element.predicate.args[this.intention_queue[index].element.predicate.args.length-1],
                    this.env_map.delivery_tiles[j], this.h);
                if(act_step_cost == -1)
                    return -1;
                
                if(best_step_cost > act_step_cost){
                    best_step = j;
                    best_step_cost = act_step_cost;
                    this.intention_queue[index].delivery = this.env_map.delivery_tiles[j];
                }
                    

            }
        }

        return best_step_cost;
    }

    // retrive cumulative reward
    get_step_reward(step, distance){
        var total_reward = 0;
        var step_cost = 0;

        for(var i=0; i<this.intention_queue.length; i++){
            var act_reward = 0;

            if(i != step){
                step_cost += this.intention_queue[i].cost
                for(var j=0; j<this.intention_queue[i].element.predicate.args.length; j++){
                    act_reward += this.intention_queue[i].element.predicate.args[j].reward - 
                        (step_cost * this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);
                }
            }
            else{
                step_cost += distance;

                for(var j=0; j<this.intention_queue[i].element.predicate.args.length; j++){
                    act_reward += this.intention_queue[i].element.predicate.args[j].reward - 
                        (step_cost * this.config[0].MOVEMENT_DURATION / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);
                }
            }
            
            total_reward += act_reward;
            this.intention_queue[i].reward = act_reward;

        }

        return total_reward;
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
}

export {Agent as Agent};