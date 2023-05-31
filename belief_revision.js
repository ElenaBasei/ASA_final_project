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

        // client.onAgentsSensing( async (agents) => {
        //     for (const a of agents) {
        //         this.dbAgents.set(a.id, a);
        //     }
        // });

        client.onParcelsSensing( async ( perceived_parcels ) => {
            if(this.config[0].PARCEL_DECADING_INTERVAL != 'infinite'){
                const now = Date.now();
                for (const p of this.dbParcels) {
                    var time_diff = parseFloat((now - p[1].observtion_time)/1000);
                    time_diff /= this.config[0].PARCEL_DECADING_INTERVAL;
                    p[1].reward -= parseInt(time_diff);
                    p[1].observtion_time = now;
                    if(p[1].reward <= 0)
                        this.dbParcels.delete(p.id);
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
        });
    }

    generate_beliefs_set(me_position=true){
        const myBeliefset = new Beliefset();

        if(me_position){
            myBeliefset.declare('on tile' + parseInt(this.me.x) + '_' + parseInt(this.me.y));
        }
            
        var holding = false;

        for(const p of this.dbParcels){
            if(!p[1].carriedBy){
                myBeliefset.declare('is-pack ' + p[1].id);
                myBeliefset.declare('pack-in ' + p[1].id + ' tile' + p[1].x + '_' + p[1].y);
            }
            else if(p[1].carriedBy = this.me.id){
                myBeliefset.declare('is-pack ' + p[1].id);
                myBeliefset.declare('holding ' + p[1].id);
                myBeliefset.declare('is-carried ' + p[1].id);

                holding = true;
            }
        }

        if(!holding){
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
