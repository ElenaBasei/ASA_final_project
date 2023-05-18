//Belief revision functions
import {Beliefset} from "@unitn-asa/pddl-client"


class Beliefs {

    config = {}
    me = {};

    /**
     * @type {Map[{id:string, name:string, x:number, y:number, score:number}]}
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
            this.me.x = x;
            this.me.y = y;
            this.me.score = score;
        } );

        // client.onAgentsSensing( async (agents) => {
        //     for (const a of agents) {
        
        //         if ( ! this.dbAgents.has( a.id) ) {
        
        //             this.dbAgents.set( a.id, [a] );
        
        //         } else {
        
        //             const history = this.dbAgents.get( a.id );
        //             history.push(a);
        
        //         }
        //     }
        
        //     for ( const [id,history] of this.dbAgents.entries() ) {
        
        //         const last = history[history.length-1];
        //         const second_last = (history.length>1 ? history[history.length-2] : 'no knowledge');
        
        //         if ( ! agents.map( a=>a.id ).includes( id ) ) {
        //             // If I am not seeing him anymore
                    
        //             if ( last != 'lost' ) {
        //                 // Just went off
        
        //                 history.push( 'lost' );
        
        //             } else {
        //                 // A while since last time I saw him
                        
        //                 if ( distance(me, second_last) <= 3 ) {
        //                     this.dbAgents.delete(id);
        //                 }
        
        //             }
        
        //         } else { // If I am still seing him ... see above
        //             // console.log( 'still seing him', last.name )
        //         }
        
        //     }
        // });

        client.onParcelsSensing( async ( perceived_parcels ) => {
            if(this.config[0].PARCEL_DECADING_INTERVAL != 'infinite'){
                const now = Date.now();
                for (const p of this.dbParcels) {
                    var time_diff = parseInt((now - p.observtion_time)/1000);
                    time_diff /= this.config[0].PARCEL_DECADING_INTERVAL;
                    p[1].reward -= parseInt(time_diff);

                    if(p[1].reward <= 0)
                        this.dbParcels.delete(p.id);
                }

                for(const p in perceived_parcels){
                    if(this.dbParcels.has(p.id) && p.carriedBy != null && p.carriedBy != this.me.id)
                        this.dbParcels.delete(p.id);
                    else if ( this.dbParcels.has(p.id) ) {
                        var p_time = {
                            ...p,
                            'observtion_time' : now
                        };
                        this.dbParcels.set(p_time.id, p_time);
                    }
                }
            }  
        });
    }

    generate_beliefs_set(me_position=true){
        const myBeliefset = new Beliefset();

        if(me_position){
            let x = ((this.me.x%1 == 0.4) ? parseInt(this.me.x) : ((this.me.x%1 == 0.6) ? parseInt(this.me.x)+1 : parseInt(this.me.x)))
            let y = ((this.me.y%1 == 0.4) ? parseInt(this.me.y) : ((this.me.y%1 == 0.6) ? parseInt(this.me.y)+1 : parseInt(this.me.y)))
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

        return myBeliefset;
    }

    distance( {x:x1, y:y1}, {x:x2, y:y2}) {
        const dx = Math.abs( Math.round(x1) - Math.round(x2) )
        const dy = Math.abs( Math.round(y1) - Math.round(y2) )
        return dx + dy;
    }
}

export {Beliefs as Beliefs};
