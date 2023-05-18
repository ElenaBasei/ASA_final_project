//Planner support class
import {PddlDomain, PddlAction, PddlExecutor, onlineSolver} from "@unitn-asa/pddl-client"
import fs from 'fs';

class Planner {

    constructor(client, beliefs){

        const pick_up = new PddlAction(
            'pick-up',
            '?p ?t',
            'and (is-tile ?t) (is-pack ?p) (not (is-carried ?p)) (on ?t) (pack-in ?p ?t)',
            'and (holding ?p) (is-carried ?p) (not (pack-in ?p ?t)) (not (free))',
            async ( args ) => {
                await client.pickup();
                
                var parcel = beliefs.dbParcels.get(args);
                parcel.carriedBy = beliefs.me.id;
                beliefs.dbParcels.set(args, parcel);
            }
        );

        const put_down = new PddlAction(
            'put-down',
            '?t',
            'and (is-tile ?t) (is-delivery-tile ?t) (on ?t) (not (free))',
            'and (forall (?p) (and (not (holding ?p)) (not (is-carried ?p)) (not (is-pack ?p)))) (free)',
            async ( args ) => {
                await client.putdown();

                var carriedParcels = [];
                for(const p of beliefs.dbParcels){
                    if(p[1].carriedBy){
                        carriedParcels.push(p[1])
                    }
                }

                for(const p of carriedParcels){
                    beliefs.dbParcels.delete(p.id)
                }
            }
        );

        const move_up = new PddlAction(
            'move-up',
            '?t1 ?t2',
            'and (is-tile ?t1) (is-tile ?t2) (is-up ?t1 ?t2) (on ?t1)',
            'and (not (on ?t1)) (on ?t2)',
            async ( args ) => {
                let status = await client.move('up');
                if(!status)
                    throw [ 'failed movement']
            }
        );

        const move_right = new PddlAction(
            'move-right',
            '?t1 ?t2',
            'and (is-tile ?t1) (is-tile ?t2) (is-right ?t1 ?t2) (on ?t1)',
            'and (not (on ?t1)) (on ?t2)',
            async ( args ) => {
                let status = await client.move('right');
                if(!status)
                    throw [ 'failed movement']
            }
        );

        const move_down = new PddlAction(
            'move-down',
            '?t1 ?t2',
            'and (is-tile ?t1) (is-tile ?t2) (is-down ?t1 ?t2) (on ?t1)',
            'and (not (on ?t1)) (on ?t2)',
            async ( args ) => {
                let status = await client.move('down');
                if(!status)
                    throw [ 'failed movement']
            }
        );

        const move_left = new PddlAction(
            'move-left',
            '?t1 ?t2',
            'and (is-tile ?t1) (is-tile ?t2) (is-left ?t1 ?t2) (on ?t1)',
            'and (not (on ?t1)) (on ?t2)',
            async ( args ) => {
                let status = await client.move('left');
                if(!status)
                    throw [ 'failed movement']
            }
        );

        this.actions = [pick_up, put_down, move_up, move_right, move_down, move_left];

        this.pddlExecutor = new PddlExecutor(this.actions[0]);
        for(let i=1; i<this.actions.length; i++){
            this.pddlExecutor.addAction(this.actions[i]);
        }
    }

    async find_plan(pddlProblem){
        let problem = pddlProblem.toPddlString();
        //pddlProblem.saveToFile();
        //var plan = onlineSolver( this.pddlDomain, problem );
        var plan = null;
        await onlineSolver( this.pddlDomain, problem )
        .then(ret => {
            plan = ret;
        })
        .catch (error => {
            console.log(error);
            plan = null;
        })

        return plan;
    }

    async exec_plan(plan){
        try{
            await this.pddlExecutor.exec( plan );
        }
        catch (error) {
            throw[error];
        }
        
    }

    async setDomain ( path ) {
    
        return new Promise( (res, rej) => {

            fs.readFile( path, 'utf8', (err, data) => {
                if (err) rej(err);
                else{
                    this.pddlDomain = data;
                    res();
                } 
            })
    
        })
    
    }

}

export {Planner as Planner};