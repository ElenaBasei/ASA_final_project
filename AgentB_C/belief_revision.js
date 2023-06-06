//Belief revision functions
import {Beliefset} from "@unitn-asa/pddl-client"


class Beliefs {

    config = {}
    me = {};
    holding = [];

    /**
     * @type {Map{id:string, name:string, x:number, y:number, score:number}}
    */
    dbAgents = new Map();

    /**
     * @type {Map{id:string, x:number, y:number, carriedBy:string, reward:number, observtion_time:number}}
    */
    dbParcels = new Map();

    constructor ( client , config, ally_id, agent) {
        this.config = config;

        client.onYou( async ( {id, name, x, y, score} ) => {
            this.me.id = id;
            this.me.name = name;
            this.me.x = ((x%1 == 0.4) ? parseInt(x) : ((x%1 == 0.6) ? parseInt(x)+1 : parseInt(x)));
            this.me.y = ((y%1 == 0.4) ? parseInt(y) : ((y%1 == 0.6) ? parseInt(y)+1 : parseInt(y)))
            this.me.score = score;

            await client.say( ally_id, {
                information_type: 'me_info',
                info: this.me
            } );
        } );

        client.onAgentsSensing( async (agents) => {
            for (const a of agents) {
                this.dbAgents.set(a.id, a);
            }

            await client.say( ally_id, {
                information_type: 'agents_info',
                info: agents
            } );
            

            var remove_agents = [];
            for (const a of this.dbAgents){
                if(! agents.map( ag=>ag.id ).includes( a[1].id ) ){
                    remove_agents.push(a[1]);
                }
            }

            for(const a of remove_agents){
                this.dbAgents.delete(a.id)
            }

        });

        client.onParcelsSensing( async ( perceived_parcels ) => {
            if(this.config[0].PARCEL_DECADING_INTERVAL != 'infinite'){
                const now = Date.now();

                var remove_parcels = [];
                for (const p of this.dbParcels) {
                    var time_diff = parseFloat((now - p[1].observtion_time)/1000);
                    time_diff /= this.config[0].PARCEL_DECADING_INTERVAL;
                    var act_reward = p[1].reward - time_diff;
                    if(act_reward <= 0)
                        remove_parcels.push(p[1]);
                }

                for(const p of remove_parcels){
                    this.dbParcels.delete(p.id);
                    this.holding.splice(this.holding.indexOf(p),1);
                }

                for(const p in perceived_parcels){
                    if(this.dbParcels.has(p.id) && p.carriedBy != null && p.carriedBy != this.me.id)
                        this.dbParcels.delete(p.id);
                    else if ( this.dbParcels.has(p.id) ) {
                        const par = this.dbParcels.get(p.id);
                        par.observtion_time = now;
                        par.reward = p.reward;
                        par.x = p.x;
                        par.y = p.y;
                        this.dbParcels.set(p.id, par);
                    }
                }
            }

            /**
             * Options generation
            */
            const options = [];
            const now = Date.now();

            for(const p of perceived_parcels){
                if ( ! this.dbParcels.has(p.id) && !p.carriedBy) {
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
                let current_d = astar_search.search(env_map.map.get(this.me.x).get(this.me.y), option.args[0], h);

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
                let reply = await client.ask( ally_id, {
                    information_type: 'parcel_pick_up',
                    info: predicate,
                    utility: best_utility
                } );

                if(!reply){
                    this.dbParcels.set( best_option.args[0].id, best_option.args[0]);
                    var status = await agent.push( best_option )
                    .catch( error => {
                        console.error('push', error);
                        this.dbParcels.delete( best_option.args[0].id);
                        agent.revising_queue = false;
                        return false;
                    });
    
                    if(!status){
                        this.dbParcels.delete( best_option.args[0].id);
                        agent.revising_queue = false;
                    }
                }
            }
        });

        client.onMsg( async (id, name, msg, reply) => {
            switch(msg.information_type){
                case 'agents_info':
                    agents = msg.info;

                    for (const a of agents) {
                        this.dbAgents.set(a.id, a);
                    }                    
        
                    var remove_agents = [];
                    for (const a of this.dbAgents){
                        if(! agents.map( ag=>ag.id ).includes( a[1].id ) ){
                            remove_agents.push(a[1]);
                        }
                    }
        
                    for(const a of remove_agents){
                        this.dbAgents.delete(a.id)
                    }
                    break;

                case 'parcel_pick_up':
                    let best_utility = agent.find_best_utility(msg.info)[1];

                    
                    if(config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                        var choice_condition = ((best_utility > msg.utility) ? true : false);
                    }
                    else{
                        var choice_condition = ((best_utility > msg.utility) ? false : true);
                    }

                    if(choice_condition){
                        reply(true)

                        this.dbParcels.set( best_option.args[0].id, best_option.args[0]);
                        var status = false;

                        while(!status){
                            status = await agent.push( best_option )
                            .catch( error => {
                                console.error('push', error);
                                this.dbParcels.delete( best_option.args[0].id);
                                agent.revising_queue = false;
                                return false;
                            });
            
                            if(!status){
                                this.dbParcels.delete( best_option.args[0].id);
                                agent.revising_queue = false;
                            }
                        }
                        
                    }
                    else{
                        reply(false)
                    }

                    break;

                case 'ally_info':
                    break;
            }
        });
    }

    generate_beliefs_set(me_position=true){
        const myBeliefset = new Beliefset();

        if(me_position){
            myBeliefset.declare('on tile' + parseInt(this.me.x) + '_' + parseInt(this.me.y));
        }
            
        var holding_flag = false;

        for(const p of this.dbParcels){
            if(!p[1].carriedBy){
                myBeliefset.declare('is-pack ' + p[1].id);
                myBeliefset.declare('pack-in ' + p[1].id + ' tile' + p[1].x + '_' + p[1].y);
            }
            else if(p[1].carriedBy = this.me.id){
                myBeliefset.declare('is-pack ' + p[1].id);
                myBeliefset.declare('holding ' + p[1].id);
                myBeliefset.declare('is-carried ' + p[1].id);

                holding_flag = true;
            }
        }

        for(let i=0; i<this.holding.length; i++){
            myBeliefset.declare('is-pack ' + this.holding[i].id);
            myBeliefset.declare('holding ' + this.holding[i].id);
            myBeliefset.declare('is-carried ' + this.holding[i].id);

            holding_flag = true;
        }

        if(!holding_flag){
            myBeliefset.declare('free')
        }

        for(const a of this.dbAgents){
            let x = ((a[1].x%1 == 0.4) ? parseInt(a[1].x) : ((a[1].x%1 == 0.6) ? parseInt(a[1].x)+1 : parseInt(a[1].x)))
            let y = ((a[1].y%1 == 0.4) ? parseInt(a[1].y) : ((a[1].y%1 == 0.6) ? parseInt(a[1].y)+1 : parseInt(a[1].y)))
            myBeliefset.declare('obstacle tile' + x + '_' + y)
        }

        return myBeliefset;
    }

    distance( {x:x1, y:y1}, {x:x2, y:y2}) {
        const dx = Math.abs( Math.round(x1) - Math.round(x2) )
        const dy = Math.abs( Math.round(y1) - Math.round(y2) )
        return dx + dy;
    }
}

export {Beliefs as Beliefs};
