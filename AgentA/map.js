//Environment map

class EnvMap{

    /**
     * @type {Map<x,Map<y,{x,y,delivery}>}
    */
    map = new Map()

    map_domain_string = [];
    spawn_tiles = [];
    delivery_tiles = [];

    map_width = 0
    map_height = 0

    // Retrive map
    async retrieve_map(client){
        return new Promise( res => {
            client.socket.on( 'map' , (width, height, tiles) => {
                this.map_width = width;
                this.map_height = height;
        
                for (let i=0; i < this.map_width; i++){
                    for (let j=0; j < this.map_height; j++){
                        if ( ! this.map.has(i) )
                            this.map.set(i, new Map);
                        this.map.get(i).set(j, 'not_tile');
                    }   
                }
        
                for(const tile of tiles){
                    this.map.get(tile.x).set(tile.y, tile);
                    this.map_domain_string.push('is-tile tile' + tile.x + '_' + tile.y);
                    if(tile.delivery){
                        this.map_domain_string.push('is-delivery-tile tile' + tile.x + '_' + tile.y);
                        this.delivery_tiles.push(tile)
                    }
                    if(tile.parcelSpawner)
                        this.spawn_tiles.push(tile);
                }

                for (let i=0; i < this.map_width; i++){
                    for (let j=0; j < this.map_height; j++){
                        const tile = this.map.get(i).get(j);
                        if(tile != 'not_tile'){
                            if(tile.x != 0 && tile.x != this.map_width-1){
                                if(this.map.get(i+1).get(j) != 'not_tile')
                                    this.map_domain_string.push('is-right tile' + tile.x + '_' + tile.y +  ' tile' + (tile.x+1) + '_' + tile.y);
                                if(this.map.get(i-1).get(j) != 'not_tile')
                                    this.map_domain_string.push('is-left tile' + tile.x + '_' + tile.y +  ' tile' + (tile.x-1) + '_' + tile.y);
                            }
                            else if(tile.x != 0){
                                if(this.map.get(i-1).get(j) != 'not_tile')
                                    this.map_domain_string.push('is-left tile' + tile.x + '_' + tile.y +  ' tile' + (tile.x-1) + '_' + tile.y);
                            }
                            else if(tile.x != this.map_width-1){
                                if(this.map.get(i+1).get(j) != 'not_tile')
                                    this.map_domain_string.push('is-right tile' + tile.x + '_' + tile.y +  ' tile' + (tile.x+1) + '_' + tile.y);
                            }
    
                            if(tile.y != 0 && tile.y != this.map_height-1){
                                if(this.map.get(i).get(j+1) != 'not_tile')
                                    this.map_domain_string.push('is-up tile' + tile.x + '_' + tile.y +  ' tile' + tile.x + '_' + (tile.y+1));
                                if(this.map.get(i).get(j-1) != 'not_tile')
                                    this.map_domain_string.push('is-down tile' + tile.x + '_' + tile.y +  ' tile' + tile.x + '_' + (tile.y-1));
                            }
                            else if(tile.y != 0){
                                if(this.map.get(i).get(j-1) != 'not_tile')
                                    this.map_domain_string.push('is-down tile' + tile.x + '_' + tile.y +  ' tile' + tile.x + '_' + (tile.y-1));
                            }
                            else if(tile.y != this.map_height-1){
                                if(this.map.get(i).get(j+1) != 'not_tile')
                                    this.map_domain_string.push('is-up tile' + tile.x + '_' + tile.y +  ' tile' + tile.x + '_' + (tile.y+1));
                            }
                        }  
                    }   
                }
                res();
            });
        } );
    }

    // Add map info to beliefs set
    update_belief_set(myBeliefset){
        for(let s of this.map_domain_string){
            myBeliefset.declare(s);
        }
        return myBeliefset;
    }

}

export {EnvMap as EnvMap};