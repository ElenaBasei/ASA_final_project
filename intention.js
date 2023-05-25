//Intention class
import { PddlProblem } from "@unitn-asa/pddl-client";

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

        // set of consecutive pick-up and single put-down actions
        if(this.predicate.desire == 'go_pick_up'){

            var holding_string = [];
            for(const parc of this.predicate.args){
                holding_string.push('(holding ' + parc.id + ')');
            }
            console.log(holding_string);

            var myBeliefset = beliefs.generate_beliefs_set();
            myBeliefset = map.update_belief_set(myBeliefset);

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and (exists (?t) (and (on ?t) (is-delivery-tile ?t) ' + holding_string.join(' ') + '))'
            );

            //pddlProblem.saveToFile();
            var plan = await planner.find_plan(pddlProblem);
            
            var ret = await this.execute_plan(plan, planner);
            if(ret[0] == 'succesful intention'){
                plan = plan[plan.length-1];
                plan = plan.args[1].replace('tile','');
                plan = plan.split('_')

                var myBeliefset = beliefs.generate_beliefs_set(false);
                myBeliefset = map.update_belief_set(myBeliefset);
                myBeliefset.declare('on tile' + parseInt(plan[0]) + '_' + parseInt(plan[1]));

                var pddlProblem = new PddlProblem(
                    'game_domain',
                    myBeliefset.objects.join(' '),
                    myBeliefset.toPddlString(),
                    'and (free)'
                );

                //pddlProblem.saveToFile()
                plan = await planner.find_plan(pddlProblem);

                return await this.execute_plan(plan, planner);
            }
            else{
                return ret;
            }
            
        }
        else{ //random move when there are no parcels
            var myBeliefset = beliefs.generate_beliefs_set();
            myBeliefset = map.update_belief_set(myBeliefset);

            var pddlProblem = new PddlProblem(
                'game_domain',
                myBeliefset.objects.join(' '),
                myBeliefset.toPddlString(),
                'and  (on tile' + this.predicate.args[0].x + '_' + this.predicate.args[0].y + ')'
            );

            var plan = await planner.find_plan(pddlProblem);

            return await this.execute_plan(plan, planner);
        }
    }

    // Execute plan
    async execute_plan(plan, planner){
        if(!plan){
            return ['plan not found', this.predicate ]
        }

        console.log('achieving intention', this.predicate);
        for(const step of plan){
            if ( this.stopped ){
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

}
export {Intention as Intention};