//Agent intention revision and execution loop
import { Intention } from "./intention.js";
import {PddlProblem} from "@unitn-asa/pddl-client"

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
                    intention.splice(this.intention.indexOf(p),1);
                }
                this.intention_queue[0] = this.intention;

                if(this.intention.element.predicate.args.length == 0){
                    this.intention_queue.shift();
                    console.log('skip');
                    continue;
                }

                //while(!success && achive_trial<5 && !stopped){
                    var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                    console.log(status);
                    if(status[0] == 'stopped intention'){
                        stopped = true;
                    }
                    else if(status[0] == 'failed intention' || status[0] == 'plan not found'){
                        failed = true;
                        //achive_trial+=1;
                        //this.intention.element.resume();
                    }
                    else if(status[0] == 'succesful intention'){
                        success = true;
                    }
                //}

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
            else if(!this.revising_queue){ //random move if the agent do not percive any parcel (change to spown tiles)
                let found = false;
                var x = 0;
                var y = 0;
                while(!found){
                    x = Math.floor(Math.random() * (this.env_map.map_width-1));
                    y = Math.floor(Math.random() * (this.env_map.map_height-1));

                    if(this.env_map.map.get(x).get(y) != 'not_tile' && (x != this.beliefs.me.x || y != this.beliefs.me.y))
                        found = true;
                }

                let predicate = {desire: 'random_move', args: [{x: x, y: y}]}
                this.intention = new QElement(new Intention(this,predicate))

                // Start achieving intention
                var status = await this.intention.element.achieve(this.planner, this.beliefs, this.env_map)
                console.log('here',status);
                if(status[0] == 'stopped intention'){
                    stopped = true;
                }
                else if(status[0] == 'failed intention'  || status[0] == 'plan not found'){
                    failed = true;
                }

            }
            // Postpone next iteration at setImmediate
            console.log('control print 1');
            await new Promise( res => setImmediate( res ) )
            .catch(error => {
                console.log('unknown error', error);
            });
            console.log('control print 2');
        }
    }

    // Add new intention
    async push ( predicate ) {
        console.log( 'Revising intention queue. Received', predicate );        
        this.revising_queue = true;

        const first_intention = this.intention_queue[0];
        this.stop();

        // intention queue revision is case of random_move as first intention queued
        // TODO: change to spown tiles
        if(this.intention != null && this.intention.element.predicate.desire == 'random_move' && predicate){

            console.log('random')
            var new_intention = new QElement(new Intention(this,predicate));

            this.intention_queue.push(new_intention);

            this.revising_queue = false;
            return new Promise( res => setImmediate( res ) );
        }
        else if(predicate) { //order intention based on utility function (reward - cost)
            const total_distance = await this.update_distance();
            const total_reward = this.update_reward();
            
            var insertion_index=0;
            var best_utility;
            var act_utility;
            var new_intention = new QElement(new Intention(this,predicate))

            for(var i=0; i<=this.intention_queue.length; i++){
                if(i==0){
                    var holding_string = [];
                    for(const parc of this.intention_queue[i].element.predicate.args){
                        holding_string.push('(holding ' + parc.id + ')');
                    }
                    holding_string.push('(holding ' + predicate.args[0].id + ')');

                    var myBeliefset = this.beliefs.generate_beliefs_set();
                    myBeliefset = this.env_map.update_belief_set(myBeliefset);

                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (exists (?t) (and (on ?t) (is-delivery-tile ?t) ' + holding_string.join(' ') + '))'
                    );

                    var plan = await this.planner.find_plan(pddlProblem);
                    var plan_lenght = plan.length;
                    plan = plan[plan_lenght-1];
                    plan = plan.args[1].replace('tile','');
                    plan = plan.split('_')
                    var delivery_difference = this.h({x:this.intention_queue[i].delivery_x, y:this.intention_queue[i].delivery_y}, {x:parseInt(plan[0]), y:parseInt(plan[1])});

                    if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                        best_utility = total_distance - this.intention_queue[i].cost + delivery_difference + plan_lenght + 1
                    }
                    else{
                        best_utility = total_reward + predicate.args[0].reward - ((total_distance - this.intention_queue[i].cost + delivery_difference + plan.length + 1) *
                            this.config[0].MOVEMENT_STEPS / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);
                    }
                }
                else if(i==this.intention_queue.length){


                    var myBeliefset = this.beliefs.generate_beliefs_set(false);
                    myBeliefset = this.env_map.update_belief_set(myBeliefset);
                    myBeliefset.declare('on tile' + this.intention_queue[i-1].delivery_x + '_' + this.intention_queue[i-1].delivery_y);

                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (exists (?t) (and (on ?t) (is-delivery-tile ?t) (holding ' + predicate.args[0].id + ')))'
                    );

                    //pddlProblem.saveToFile();
                    var plan = await this.planner.find_plan(pddlProblem);
                    var plan_lenght = plan.length;

                    if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                        act_utility = total_distance + plan_lenght + 1

                        if( best_utility > act_utility){
                            best_utility = act_utility;
                            insertion_index = i;
                        }
                    }
                    else{
                        delivery_difference = h({x:x1, y:y1}, {x:x2, y:y2})
                        act_utility = total_reward + predicate.args[0].reward - ((total_distance + plan_lenght + 1) *
                            this.config[0].MOVEMENT_STEPS / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);

                        if( best_utility < act_utility){
                            best_utility = act_utility;
                            insertion_index = i;
                        }
                    }


                }
                else {
                    var holding_string = [];
                    for(const parc of this.intention_queue[i].element.predicate.args){
                        holding_string.push('(holding ' + parc.id + ')');
                    }
                    holding_string.push('(holding ' + predicate.args[0].id + ')');

                    var myBeliefset = this.beliefs.generate_beliefs_set(false);
                    myBeliefset = this.env_map.update_belief_set(myBeliefset);
                    myBeliefset.declare('on tile' + this.intention_queue[i-1].delivery_x + '_' + this.intention_queue[i-1].delivery_y);

                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (exists (?t) (and (on ?t) (is-delivery-tile ?t) ' + holding_string.join(' ') + '))'
                    );

                    var plan = await this.planner.find_plan(pddlProblem);
                    var plan_lenght = plan.length;
                    plan = plan[plan_lenght-1];
                    plan = plan.args[1].replace('tile','');
                    plan = plan.split('_')
                    var delivery_difference = this.h({x:this.intention_queue[i].delivery_x, y:this.intention_queue[i].delivery_y}, {x:parseInt(plan[0]), y:parseInt(plan[1])});

                    if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                        act_utility = total_distance - this.intention_queue[i].cost + delivery_difference + plan_lenght + 1

                        if( best_utility > act_utility){
                            best_utility = act_utility;
                            insertion_index = i;
                        }
                    }
                    else{
                        act_utility = total_reward + predicate.args[0].reward - ((total_distance - this.intention_queue[i].cost + delivery_difference + plan.length + 1) *
                            this.config[0].MOVEMENT_STEPS / 1000 / this.config[0].PARCEL_DECADING_INTERVAL);

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

        console.log('finished')
        this.revising_queue = false;
        this.resume();
        return new Promise( res => setImmediate( res ) );
    }

    async stop ( ) {
        console.log( 'stop agent queued intentions');
        this.intention.element.stop();
        for (const intention of this.intention_queue) {
            intention.element.stop();
        }
    }

    async resume ( ) {
        console.log( 'resume agent queued intentions');
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
            var holding_string = [];
            for(const parc of this.intention_queue[i].element.predicate.args){
                holding_string.push('(holding ' + parc.id + ')');
            }

            if(i==0){
                var myBeliefset = this.beliefs.generate_beliefs_set();
                myBeliefset = this.env_map.update_belief_set(myBeliefset);
            }
            else{
                var myBeliefset = this.beliefs.generate_beliefs_set(false);
                myBeliefset = this.env_map.update_belief_set(myBeliefset);
                myBeliefset.declare('on tile' + this.intention_queue[i-1].delivery_x + '_' + this.intention_queue[i-1].delivery_y);
            }

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and (exists (?t) (and (on ?t) (is-delivery-tile ?t) ' + holding_string.join(' ') + '))'
            );

            var plan = await this.planner.find_plan(pddlProblem);
            this.intention_queue[i].cost = plan.length + 1;
            plan = plan[plan.length-1];
            plan = plan.args[1].replace('tile','');
            plan = plan.split('_')
            this.intention_queue[i].delivery_x = parseInt(plan[0]);
            this.intention_queue[i].delivery_y = parseInt(plan[1]);

            total_distance += this.intention_queue[i].cost;
        }

        console.log('end');
        return total_distance;
    }

    // retrive cumulative reward
    update_reward(){
        var total_reward = 0
        for(var i=0; i<this.intention_queue.length; i++){
            total_reward += this.intention_queue[i].reward;
        }

        return total_reward;
    }

}

class QElement {
    constructor(element)
    {
        this.element = element;
        this.cost = 0;
        this.delivery_x = 0;
        this.delivery_y = 0;
    }
}

export {Agent as Agent};