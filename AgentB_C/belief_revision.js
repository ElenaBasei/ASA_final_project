//Belief revision functions
import {Beliefset} from "@unitn-asa/pddl-client"
import { AStar } from "./astar.js";


class Beliefs {

    config = {};
    me = {};
    holding = [];
    act_path = [];

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
        this.ally = null;
        this.client = client;


        this.client.onYou(( {id, name, x, y, score} ) => {
            this.me.id = id;
            this.me.name = name;
            this.me.x = ((x%1 == 0.4) ? parseInt(x) : ((x%1 == 0.6) ? parseInt(x)+1 : parseInt(x)));
            this.me.y = ((y%1 == 0.4) ? parseInt(y) : ((y%1 == 0.6) ? parseInt(y)+1 : parseInt(y)))
            this.me.score = score;

            if(this.ally == null){
                this.client.shout( {
                    information_type: 'establish_alliance',
                    info: this.me
                } );
            }
            else{
                this.client.say( this.ally.id, {
                    information_type: 'ally_info',
                    info: this.me
                } );
            }
        } );

        this.client.onAgentsSensing( async (agents) => {
            for (const a of agents) {
                this.dbAgents.set(a.id, a);
            }

            if(this.ally != null){
                await this.client.say( this.ally.id, {
                    information_type: 'agents_info',
                    info: agents
                } );
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

            //keep ally info only in this.ally
            if(this.ally != null)
                this.dbAgents.delete(this.ally.id)

        });

        this.client.onParcelsSensing( async ( perceived_parcels ) => {
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
                if(this.dbParcels.has(p.id) && p.carriedBy != null && (p.carriedBy != this.me.id || (this.ally != null && p.carriedBy != this.ally.id)))
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

    send_first_info(){
        this.client.shout( {
            information_type: 'establish_alliance',
            info: this.me
        } );
    }

    define_on_message(agent){
        //manage incoming messages
        this.client.onMsg( async (id, name, msg, reply) => {
            switch(msg.information_type){
                //update other agents info
                case 'agents_info':
                    //console.log('Agent', this.me.name, 'received agents info', msg.info)
                    var agents = msg.info;

                    for (const a of agents) {
                        this.dbAgents.set(a.id, a);
                    }

                    //remove possible info of this agent incoming from the ally
                    this.dbAgents.delete(this.me.id)
                    break;

                //parcel pick up check
                case 'parcel_pick_up':
                    //console.log('Agent', this.me.name, 'received parcel info', msg.info)
                    let best_utility = agent.find_best_utility(msg.info)[1];

                    var parcel = {
                        id:msg.info.args[0].id, 
                        x:msg.info.args[0].x, 
                        y:msg.info.args[0].y, 
                        carriedBy:null, 
                        reward:msg.info.args[0].reward, 
                        observtion_time:msg.info.args[0].observtion_time
                    }
                    
                    if(this.config[0].PARCEL_DECADING_INTERVAL == 'infinite'){
                        var choice_condition = ((best_utility < msg.utility) ? true : false);
                    }
                    else{
                        var choice_condition = ((best_utility > msg.utility) ? true : false);
                    }

                    agent.revising_queue = true;
                    if(choice_condition){
                        var status = await agent.push( {desire: 'go_pick_up', args: [parcel]} )
                        .catch( error => {
                            console.log('push', error);
                            //this.dbParcels.delete( msg.info.args[0].id);
                            agent.revising_queue = false;
                            return false;
                        });
        
                        if(!status){
                            //this.dbParcels.delete( msg.info.args[0].id);
                            agent.revising_queue = false;
                            parcel.carriedBy='ally';
                            this.dbParcels.set( parcel.id, parcel);
                            reply(false)
                        }
                        else{
                            agent.revising_queue = false;
                            reply(true)
                        }
                        
                    }
                    else{
                        agent.revising_queue = false;
                        parcel.carriedBy = 'ally'
                        this.dbParcels.set( parcel.id, parcel);
                        reply(false)
                    }

                    break;

                //communicate to the ally the intention of picking up a parcel
                case 'confirmed_pick_up':
                    var parcel = {
                        id:msg.info.args[0].id, 
                        x:msg.info.args[0].x, 
                        y:msg.info.args[0].y, 
                        carriedBy:'ally', 
                        reward:msg.info.args[0].reward, 
                        observtion_time:msg.info.args[0].observtion_time
                    }
                    this.dbParcels.set( parcel.id, parcel);
                    break;

                //update ally info
                case 'ally_info':
                    this.ally = msg.info;
                    //console.log('Agent', this.me.name, 'received ally information', this.ally);
                    break;

                //receive new ally information
                case 'establish_alliance':
                    this.ally = msg.info;
                    console.log('Agent', this.me.name, 'received ally information', this.ally);
                    break;

                //ally current intention
                case 'stop_for_pick_up':
                    //console.log('Agent', this.me.name, 'received stop for new pick-up')
                    agent.stop('new_pick_up');
                    break;

                //check if the new pick-up intention for the collaboration is ready
                case 'new_pick_up':
                    //console.log('Agent', this.me.name, 'received new pick-up')
                    if(agent.intention.element.new_predicate != null){
                        reply(agent.intention.element.new_predicate)
                    }
                    else{
                        reply(false);
                    }
                    break;

                //check if the ally can reach the sent parcel
                case 'send_unreachable_parcel':
                    //console.log('Agent', this.me.name, 'received new parcel to pick-up')

                    var parcel = {
                        id:msg.info.args[0].id, 
                        x:msg.info.args[0].x, 
                        y:msg.info.args[0].y, 
                        carriedBy:null, 
                        reward:msg.info.args[0].reward, 
                        observtion_time:msg.info.args[0].observtion_time
                    }

                    agent.revising_queue = true;
                    var status = await agent.push( {desire: 'go_pick_up', args: [parcel]} )
                    .catch( error => {
                        console.log('push', error);
                        //this.dbParcels.delete( msg.info.args[0].id);
                        agent.revising_queue = false;
                        return false;
                    });
    
                    if(!status){
                        //this.dbParcels.delete( msg.info.args[0].id);
                        agent.revising_queue = false;
                    }
                    else{
                        agent.revising_queue = false;
                    }

                    reply(status);
                    break;

                //used to communicate the succesful delivery of a parcel
                case 'delivery':
                    this.dbParcels.delete(msg.info)
                    break;

                //communicate the decision to drop a pick-up intention
                case 'drop_pick_up_intention':
                    this.dbParcels.delete(msg.info)
                    break;

                default:
                    break;
            }
        });
    }

    async communicate_stop_for_pick_up(){
        if (this.ally != null)
            await this.client.say( this.ally.id, {
                information_type: 'stop_for_pick_up'
            } );
    }

    async communicate_delivery(id){
        if (this.ally != null)
            await this.client.say( this.ally.id, {
                information_type: 'delivery',
                info: id
            } );
    }

    async communicate_drop_pick_up_intention(id){
        if (this.ally != null)
            await this.client.say( this.ally.id, {
                information_type: 'drop_pick_up_intention',
                info: id
            } );
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
            if(this.ally == null || a[0] != this.ally.id){
                let x = ((a[1].x%1 == 0.4) ? parseInt(a[1].x) : ((a[1].x%1 == 0.6) ? parseInt(a[1].x)+1 : parseInt(a[1].x)))
                let y = ((a[1].y%1 == 0.4) ? parseInt(a[1].y) : ((a[1].y%1 == 0.6) ? parseInt(a[1].y)+1 : parseInt(a[1].y)))
                myBeliefset.declare('obstacle tile' + x + '_' + y)
            }
        }

        return myBeliefset;
    }

    h( {x:x1, y:y1}, {x:x2, y:y2}) {
        const dx = Math.abs( Math.round(x1) - Math.round(x2) )
        const dy = Math.abs( Math.round(y1) - Math.round(y2) )
        return dx + dy;
    }
}

export {Beliefs as Beliefs};
