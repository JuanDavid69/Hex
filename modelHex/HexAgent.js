const Agent = require('ai-agents').Agent;
const AlphaBetaConstructor = require('alphabeta')
const Graph = require('node-dijkstra');
const getEmptyHex = require('./getEmptyHex');

var config = {
    scoreFunction: scoreFunction,
    generateMoves: posibleMovements,
    checkWinConditions: goalTest,
    depth: 3,
}

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }

    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        let size = board.length;
        let available = getEmptyHex(board);
        let nTurn = size * size - available.length;
        config.state = board;
        let alphabeta = AlphaBetaConstructor( config )

        if (nTurn%0 == 0) { // First move
            return [Math.floor(size / 2), Math.floor(size / 2) - 1];
        } 
            return [Math.floor(size / 2), Math.floor(size / 2)];
    }

}

module.exports = HexAgent;

/**
     * Check if the given solution solves the problem. You must override
     * @param {Object} solution 
     */
function goalTest(board) {
    let size = board.length;
    for (let player of ['1', '2']) {
        for (let i = 0; i < size; i++) {
            let hex = -1;
            if (player === "1") {
                if (board[i][0] === player) {
                    hex = i * size;
                }
            } else if (player === "2") {
                if (board[0][i] === player) {
                    hex = i;
                }
            }
            if (hex >= 0) {
                let row = Math.floor(hex / size);
                let col = hex % size;
                // setVisited(neighbor, player, board);
                board[row][col] = -1;
                let status = check(hex, player, board);
                board[row][col] = player;
                if (status) {
                    return true;
                }
            }
        }
    }
    return false;
}

function posibleMovements(board) {
    let movements = getEmptyHex(board)
    let nextPosibleMovements = []
    let size = board.length;
    let nTurn = size * size - movements.length;
    let player = 1
    if (nTurn%2 !== 0) {
        player = 2
    }

    for(i=0; i < movements.length; i++) {
        let newBoard = _copyBoard(board)
        let movement = movements[i]
        newBoard[movement/size + movement%size] = player
        nextPosibleMovements.push(newBoard)
    }

    return nextPosibleMovements
}

function boardPath(board, callbackPuntuation) {
    let player = '1';
    let size = board.length;

    const route = new Graph();

    // Build the graph out of the hex board
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let key = i * size + j;
            let list = getNeighborhood(key, player, board);
            let neighbors = {};
            list.forEach(x => {
                neighbors[x + ''] = 1;
            });
            if (j === 0) { //Add edge to T
                neighbors[player + 'T'] = 1;
            }
            if (j === size - 1) { //Add edge to R
                neighbors[player + 'X'] = 1;
            }
            route.addNode(key + '', neighbors);
        }
    }

    let neighborsT = {};
    let neighborsX = {};

    for (let i = 0; i < size; i++) {
        if (board[i][0] === 0) {
            neighborsT[(i * size) + ''] = 1;
        }
        if (board[i][size - 1] === 0) {
            neighborsX[(i * size + size - 1) + ''] = 1;
        }
    }

    route.addNode(player + 'T', neighborsT);
    route.addNode(player + 'X', neighborsX);

    return callbackPuntuation(route.path(player + 'T', player + 'X').length);
}

/**
 * Transpose and convert the board game to a player 1 logic
 * @param {Array} board 
 */
function transpose(board) {
    let size = board.length;
    let boardT = new Array(size);
    for (let j = 0; j < size; j++) {
        boardT[j] = new Array(size);
        for (let i = 0; i < size; i++) {
            boardT[j][i] = board[i][j];
            if (boardT[j][i] === '1') {
                boardT[j][i] = '2';
            } else if (boardT[j][i] === '2') {
                boardT[j][i] = '1';
            }
        }
    }
    return boardT;
}

function _copyBoard( board ) {
    return JSON.parse(JSON.stringify(board))
}