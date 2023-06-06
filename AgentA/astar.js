//AStar search algorithm
import { EnvMap } from "./map.js";
import { BinaryHeap } from "./BinaryHeap.js";

class AStar {
    /**
     * 
     * @param {EnvMap} env_map 
     */
    constructor(env_map){
        this.graph = new Graph(env_map);
    }

    /**
    * Perform an A* Search on a graph given a start and end node.
    */
    search(s, g, h) {
        var graph = this.graph;
        graph.cleanDirty();
        var heuristic = h
        var start =  new GridNode(s, s.x, s.y)
        var end =  new GridNode(g, g.x, g.y)
    
        var openHeap = new BinaryHeap(function(node) {
            return node.f;
        });
        var closestNode = start; // set the start node to be the closest if required
    
        start.h = heuristic(start.tile, end.tile);
        graph.markDirty(start);
    
        openHeap.push(start);
    
        while (openHeap.size() > 0) {
    
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();
    
            // End case -- result has been found, return the traced path.
            if (currentNode.x == end.x && currentNode.y == end.y) {
                return this.pathTo(currentNode).length;
            }
    
            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;
    
            // Find all neighbors for the current node.
            var neighbors = graph.neighbors(currentNode);

            for (var i = 0; i < neighbors.length; ++i) {
                var neighbor = neighbors[i];
        
                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }
        
                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbor.getCost(currentNode);
                var beenVisited = neighbor.visited;
        
                if (!beenVisited || gScore < neighbor.g) {
        
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.tile, end.tile);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    graph.markDirty(neighbor);
        
                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    } else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }
        
        // No result was found
        return -1;
    }

    pathTo(node) {
        var curr = node;
        var path = [];
        while (curr.parent) {
            path.unshift(curr.tile);
            curr = curr.parent;
        }
        return path;
    }
}
  
class Graph{
    /**
     * 
     * @param {EnvMap} env_map 
     */
    constructor(env_map) {
        this.nodes = [];
        this.grid = [];
        for (var x = 0; x < env_map.map_width; x++) {
            this.grid[x] = [];
        
            for (var y = 0, row = env_map.map.get(x); y < env_map.map_height; y++) {
                var node = new GridNode(row.get(y), x, y);
                this.grid[x][y] = node;
                this.nodes.push(node);
            }
        }

        this.dirtyNodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            this.cleanNode(this.nodes[i]);
        }
    }

    cleanDirty() {
        for (var i = 0; i < this.dirtyNodes.length; i++) {
            this.cleanNode(this.dirtyNodes[i]);
        }
        this.dirtyNodes = [];
    }

    cleanNode(node) {
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.visited = false;
        node.closed = false;
        node.parent = null;
    }

    markDirty(node) {
        this.dirtyNodes.push(node);
    }

    neighbors(node) {
        var ret = [];
        var x = node.x;
        var y = node.y;
        var grid = this.grid;
      
        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            ret.push(grid[x - 1][y]);
        }
      
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            ret.push(grid[x + 1][y]);
        }
      
        // South
        if (grid[x] && grid[x][y - 1]) {
            ret.push(grid[x][y - 1]);
        }
      
        // North
        if (grid[x] && grid[x][y + 1]) {
            ret.push(grid[x][y + 1]);
        }
      
        return ret;
    }
}

class GridNode{
    /**
     * Grid node class
     */
    constructor(tile, x, y) {
        this.tile = tile;
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.closed = false;
        this.parent = null;
    }

    getCost() {
        return 1;
    }

    isWall = function() {
        return this.tile == 'not_tile';
    }
}

export {AStar as AStar};