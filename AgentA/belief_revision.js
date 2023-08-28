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

    constructor ( client , config) {
        this.config = config;

        client.onYou( ( {id, name, x, y, score} ) => {
            this.me.id = id;
            this.me.name = name;
            this.me.x = ((x%1 == 0.4) ? parseInt(x) : ((x%1 == 0.6) ? parseInt(x)+1 : parseInt(x)));
            this.me.y = ((y%1 == 0.4) ? parseInt(y) : ((y%1 == 0.6) ? parseInt(y)+1 : parseInt(y)))
            this.me.score = score;
        } );

        client.onAgentsSensing( async (agents) => {
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
