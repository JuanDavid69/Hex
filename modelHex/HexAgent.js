const Agent = require('ai-agents').Agent;
const Graph = require('node-dijkstra');

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }
    
    send() {
        let board = this.perception;
        let available = getEmptyHex(board);
        let move = available[Math.round(Math.random() * ( available.length -1 ))];
        console.log(move);
        let path = dijkstra();
        console.log(path);
        console.log(Math.floor (move / board.length));
        console.log(move % board.length);
        return [Math.floor (move / board.length), move % board.length];
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push(k * size + j);
            }
        }
    }
    return result;
}

function dijkstra(){
        const route = new Graph();
 
        route.addNode('A', { B:8, E:4, D:5 });
        route.addNode('B', { A:8, C:3, F:4, E:12 });
        route.addNode('C', { B:3, F:9, G:11 });
        route.addNode('D', { A:5, E:9, H:6 });
        route.addNode('E', { A:4, B:12, D:9, F:3, I:8, J:5 });
        route.addNode('F', { B:4, C:9, E:3, G:1, K:8 });
        route.addNode('G', { C:11, F:1, K:8, L:7 });
        route.addNode('H', { D:6, I:2, M:7 });
        route.addNode('I', { E:8, H:2, J:10, M:6 });
        route.addNode('J', { E:5, I:10, K:6, N:9 });
        route.addNode('K', { F:8 , G:8, J:6, L:5, P:7 });
        route.addNode('L', { G:7, K:5, P:6 });
        route.addNode('M', { H:7, I:6, N:2 });
        route.addNode('N', { J:9, M:2, P:12 });
        route.addNode('P', { K:7, L:6, N:12 });
 
        return route.path('A', 'P');
}
