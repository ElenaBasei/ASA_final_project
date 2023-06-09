//Intention class
import { PddlProblem } from "@unitn-asa/pddl-client";
import { AStar } from "./astar.js";

class Intention {
    
    // This is used to stop the intention
    #stopped = false;
    get stopped () {
        return this.#stopped;
    }
    stop () {
        // this.log( 'stop intention', ...this.#predicate );
        this.#stopped = true;
    }

    resume (){
        this.#stopped = false;
        this.#started = false;
    }

    /**
     * #parent refers to caller
     */
    #parent;

    /**
     * predicate is in the form ['go_to', x, y]
     */
    get predicate () {
        return this.#predicate;
    }
    #predicate;

    constructor ( parent, predicate ) {
        this.#parent = parent;
        this.#predicate = predicate;
    }

    #started = false;
    /**
     * Using a planner to achieve an intention
     */
    async achieve (planner, beliefs, map) {
        // Cannot start twice
        if ( this.#started)
            return this;
        else
            this.#started = true;

        this.astar_search = new AStar(map)
        this.env_map=map;
        this.new_predicate = null;
        var parcel = null;

        // set of consecutive pick-up and single put-down actions
        if(this.predicate.desire == 'go_pick_up'){
            console.log('Agent', beliefs.me.name, 'achieving intention', this.predicate);

            this.update_order(beliefs.me);

            var prev_position = beliefs.me;
            for(var i=0; i<this.predicate.args.length; i++){
                if(beliefs.dbParcels.get(this.predicate.args[i].id).carriedBy == null){
                    var myBeliefset = beliefs.generate_beliefs_set(false);
                    myBeliefset = map.update_belief_set(myBeliefset);
                    myBeliefset.declare('on tile' + prev_position.x + '_' + prev_position.y);
                    if(beliefs.ally != null){
                        myBeliefset.declare('obstacle tile' + beliefs.ally.x + '_' + beliefs.ally.y);
                    }                    
    
                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (holding ' + this.predicate.args[i].id + ')'
                    );
    
                    var plan = await planner.find_plan(pddlProblem)
                    .catch( error => {
                        return null;
                    });
    
                    if(!plan && beliefs.ally != null){
                        var myBeliefset = beliefs.generate_beliefs_set(false);
                        myBeliefset = map.update_belief_set(myBeliefset);
                        myBeliefset.declare('on tile' + prev_position.x + '_' + prev_position.y);             
        
                        var pddlProblem = new PddlProblem(
                            'game_domain',
                            myBeliefset.objects.join(' '),
                            myBeliefset.toPddlString(),
                            'and (holding ' + this.predicate.args[i].id + ')'
                        );
        
                        var plan = await planner.find_plan(pddlProblem)
                        .catch( error => {
                            return null;
                        });

                        if(!plan)
                            return ['plan not found', this.predicate ]
                        else{
                            return ['give intention to ally', i]
                        }
                    }
                    else if(!plan){
                        return ['plan not found', this.predicate ]
                    }

                    var ret = await this.execute_plan(plan, planner)
                    .catch( error => {
                        console.log( 'Agent', beliefs.me.name, 'failed intention', this.predicate, 'with error:', error);
                        return [ 'failed intention', this.predicate ];
                    });

                    if(ret[0] != 'succesful intention')
                        return ret

                    prev_position = this.predicate.args[i];
                }                
            }

            this.predicate.desire = 'go_put_down';

            var myBeliefset = beliefs.generate_beliefs_set(false);
            myBeliefset = map.update_belief_set(myBeliefset);
            myBeliefset.declare('on tile' + prev_position.x + '_' + prev_position.y);
            if(beliefs.ally != null){
                myBeliefset.declare('obstacle tile' + beliefs.ally.x + '_' + beliefs.ally.y);
            }  

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and (free)'
            );

            var plan = await planner.find_plan(pddlProblem)
            .catch( error => {
                return null;
            });  
            
            if(!plan && beliefs.ally != null){
                var myBeliefset = beliefs.generate_beliefs_set(false);
                myBeliefset = map.update_belief_set(myBeliefset);
                myBeliefset.declare('on tile' + prev_position.x + '_' + prev_position.y);

                var pddlProblem = new PddlProblem(
                    'game_domain',
                    myBeliefset.objects.join(' '),
                    myBeliefset.toPddlString(),
                    'and (free)'
                );

                var plan = await planner.find_plan(pddlProblem)
                .catch( error => {
                    return null;
                });

                if(!plan){
                    return ['plan not found', this.predicate ]
                }
                else{
                    beliefs.communicate_stop_for_pick_up();

                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (exist (?t) (and (on ?t) (or (is-up ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-right ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-down ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-left t tile' + beliefs.ally.x + '_' + beliefs.ally.y +'))))'
                    );
    
                    var plan = await planner.find_plan(pddlProblem)
                    .catch( error => {
                        return null;
                    });

                    delivery_tile = plan[plan.length-1];
                    delivery_tile = delivery_tile.args[1];
                    delivery_tile = delivery_tile.replace('tile','')
                    delivery_tile = delivery_tile.split('_')

                    plan.push('(put_down tile' + delivery_tile[0] + '_' + delivery_tile[1] + ')')

                    var parcel = {
                        id:this.predicate.args[0].id, 
                        x:parseInt(delivery_tile[0]), 
                        y:parseInt(delivery_tile[1]), 
                        carriedBy:null, 
                        reward:this.predicate.args[0].reward, 
                        observtion_time:this.predicate.args[0].observtion_time
                    }
                }
            }
            else if(!plan){
                return ['plan not found', this.predicate ]
            }

            var ret = await this.execute_plan(plan, planner)
            .catch( error => {
                console.log( 'Agent', beliefs.me.name, 'failed intention', this.predicate, 'with error:', error);
                return [ 'failed intention', this.predicate ];
            });

            this.new_predicate = {desire : 'go_pick_up', args : [parcel]};

            return ret;
            
        }
        else if(this.predicate.desire == 'go_put_down'){
            console.log('Agent', beliefs.me.name, 'achieving intention', this.predicate);

            var myBeliefset = beliefs.generate_beliefs_set();
            myBeliefset = map.update_belief_set(myBeliefset);
            if(beliefs.ally != null){
                myBeliefset.declare('obstacle tile' + beliefs.ally.x + '_' + beliefs.ally.y);
            } 

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and (free)'
            );

            //pddlProblem.saveToFile();
            var plan = await planner.find_plan(pddlProblem)
            .catch( error => {
                return null;
            });

            if(!plan && beliefs.ally != null){
                var myBeliefset = beliefs.generate_beliefs_set();
                myBeliefset = map.update_belief_set(myBeliefset);

                var pddlProblem = new PddlProblem(
                    'game_domain',
                    myBeliefset.objects.join(' '),
                    myBeliefset.toPddlString(),
                    'and (free)'
                );

                var plan = await planner.find_plan(pddlProblem)
                .catch( error => {
                    return null;
                });

                if(!plan){
                    return ['plan not found', this.predicate ]
                }
                else{
                    beliefs.communicate_stop_for_pick_up();
                    
                    var pddlProblem = new PddlProblem(
                        'game_domain',
                        myBeliefset.objects.join(' '),
                        myBeliefset.toPddlString(),
                        'and (exist (?t) (and (on ?t) (or (is-up ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-right ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-down ?t tile' + beliefs.ally.x + '_' + beliefs.ally.y +') ' + 
                        '(is-left t tile' + beliefs.ally.x + '_' + beliefs.ally.y +'))))'
                    );
    
                    var plan = await planner.find_plan(pddlProblem)
                    .catch( error => {
                        return null;
                    });

                    delivery_tile = plan[plan.length-1];
                    delivery_tile = delivery_tile.args[1];
                    delivery_tile = delivery_tile.replace('tile','')
                    delivery_tile = delivery_tile.split('_')

                    plan.push('(put_down tile' + delivery_tile[0] + '_' + delivery_tile[1] + ')')

                    parcel = {
                        id:this.predicate.args[0].id, 
                        x:parseInt(delivery_tile[0]), 
                        y:parseInt(delivery_tile[1]), 
                        carriedBy:null, 
                        reward:this.predicate.args[0].reward, 
                        observtion_time:this.predicate.args[0].observtion_time
                    }
                }
            }
            else if(!plan){
                return ['plan not found', this.predicate ]
            }

            var ret = await this.execute_plan(plan, planner)
            .catch( error => {
                console.log( 'Agent', beliefs.me.name, 'failed intention', this.predicate, 'with error:', error);
                return [ 'failed intention', this.predicate ];
            });

            this.new_predicate = {desire : 'go_pick_up', args : [parcel]};

            return ret;
        }
        else{ //random move when there are no parcels
            console.log('Agent', beliefs.me.name, 'achieving intention', this.predicate);

            var myBeliefset = beliefs.generate_beliefs_set();
            myBeliefset = map.update_belief_set(myBeliefset);

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and  (on tile' + this.predicate.args[0].x + '_' + this.predicate.args[0].y + ')'
            );

            pddlProblem.saveToFile()
            var plan = await planner.find_plan(pddlProblem)
            .catch( error => {
                return null;
            });

            var ret = await this.execute_plan(plan, planner)
            .catch( error => {
                console.log( 'Agent', beliefs.me.name, 'failed intention', this.predicate, 'with error:', error);
                return [ 'failed intention', this.predicate ];
            });

            return ret;
        }
    }

    // Execute plan
    async execute_plan(plan, planner){
        if(!plan){
            return ['plan not found', this.predicate ]
        }

        for(const step of plan){
            if ( this.stopped ){
                console.log('stopped')
                return [ 'stopped intention', this.predicate ];
            }

            // and plan is executed and result returned
            try {
                await planner.exec_plan(step);
            // or errors are caught so to continue with next plan
            } catch (error) {
                console.log( 'failed intention', this.predicate, 'with error:', error);
                return [ 'failed intention', this.predicate ];
            }
        }

        return ['succesful intention', this.predicate];
    }

    update_order(me){
        for(var j=0; j<this.predicate.args.length; j++){
            if(j == 0)
                var best_step_cost = this.astar_search.search(this.env_map.map.get(me.x).get(me.y), this.predicate.args[j], this.h);
            else
                var best_step_cost = this.astar_search.search(this.predicate.args[j-1], this.predicate.args[j], this.h);

            var best_step = j;
            for(var z=j+1; z<this.predicate.args.length; z++){
                if(j == 0){
                    var act_step_cost = this.astar_search.search(this.env_map.map.get(me.x).get(me.y), this.predicate.args[z], this.h);
                }
                else{
                    var act_step_cost = this.astar_search.search(this.predicate.args[j-1], this.predicate.args[z], this.h);
                }

                if(best_step_cost > act_step_cost){
                    best_step = z;
                    best_step_cost = act_step_cost;
                }
                    
            }

            var swap = this.predicate.args[j];
            this.predicate.args[j] = this.predicate.args[best_step];
            this.predicate.args[best_step] = swap;
        }
    }

    h( {x:x1, y:y1}, {x:x2, y:y2}) {
        const dx = Math.abs( Math.round(x1) - Math.round(x2) )
        const dy = Math.abs( Math.round(y1) - Math.round(y2) )
        return dx + dy;
    }

    deep_copy(){
        let predicate_copy = {desire: this.predicate.desire, args: []}
        for(let i=0; i<this.predicate.args.length; i++){
            predicate_copy.args.push(this.predicate.args[i]);
        }

        return new Intention(this.parent, predicate_copy);
    }

}
export {Intention as Intention};