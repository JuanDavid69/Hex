const Agent = require('ai-agents').Agent;
var AlphaBetaConstructor = require('alphabeta')
const Graph = require('node-dijkstra');
const getEmptyHex = require('./getEmptyHex');

var config = {
    scoreFunction: boardPath,
    generateMoves: posibleMovements,
    checkWinConditions: goalTest,
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
        let alphabeta = AlphaBetaConstructor(config)
        alphabeta.incrementDepthForMilliseconds(500, function (beststate) {
            console.log(beststate.alphabeta.best())
            return
        })

        if (nTurn % 0 == 0) { // First move

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
    let player = "1"
    if (nTurn % 2 !== 0) {
        player = "2"
    }

    for (let i = 0; i < movements.length; i++) {
        let newBoard = _copyBoard(board)
        let movement = movements[i]
        newBoard[Math.floor(movement / size)][movement % size] = player
        nextPosibleMovements.push(newBoard)
    }

    return nextPosibleMovements
}

function boardPath(board, callbackPuntuation) {
    let player = "1";
    let size = board.length;
    let movements = getEmptyHex(board)
    let nTurn = size * size - movements.length;
    let boardC = _copyBoard(board)
    if (nTurn % 0 !== 0) {
        player = "2"
        boardC = transpose(boardC)
    }

    const route = new Graph();

    // Build the graph out of the hex board
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let key = i * size + j;
            let list = getNeighborhood(key, player, boardC);
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
        if (boardC[i][0] === 0) {
            neighborsT[(i * size) + ''] = 1;
        }
        if (boardC[i][size - 1] === 0) {
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

function _copyBoard(board) {
    return JSON.parse(JSON.stringify(board))
}

/**
 * Return an array of the neighbors of the currentHex that belongs to the same player. The 
 * array contains the id of the hex. id = row * size + col
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function getNeighborhood(currentHex, player, board) {
    let size = board.length;
    let row = Math.floor(currentHex / size);
    let col = currentHex % size;
    let result = [];
    let currentValue = board[row][col];
    board[row][col] = 'x';
    // Check the six neighbours of the current hex
    pushIfAny(result, board, player, row - 1, col);
    pushIfAny(result, board, player, row - 1, col + 1);
    pushIfAny(result, board, player, row, col + 1);
    pushIfAny(result, board, player, row, col - 1);
    pushIfAny(result, board, player, row + 1, col);
    pushIfAny(result, board, player, row + 1, col - 1);

    board[row][col] = currentValue;

    return result;
}

function pushIfAny(result, board, player, row, col) {
    let size = board.length;
    if (row >= 0 && row < size && col >= 0 && col < size) {
        if (board[row][col] === player) {
            result.push(...getNeighborhood(col + row * size, player, board));
        } else if (board[row][col] === 0) {
            result.push(col + row * size);
        }
    }
}

/**
 * Chech if there exist a path from the currentHex to the target side of the board
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Matrix} board 
 */
function check(currentHex, player, board) {
    if (isEndHex(currentHex, player, board.length)) {
        return true;
    }
    let neighbors = getNeighborhood(currentHex, player, board);
    for (let neighbor of neighbors) {
        let size = board.length;
        let row = Math.floor(neighbor / size);
        let col = neighbor % size;
        // setVisited(neighbor, player, board);
        board[row][col] = -1;
        let res = check(neighbor, player, board);
        // resetVisited(neighbor, player, board);
        board[row][col] = player;
        if (res == true) {
            return true;
        }
    }
    return false;
}

/**
 * Chech if the current hex is a the opposite border of the board
 * @param {Number} currentHex 
 * @param {Number} player 
 * @param {Number} size 
 */
function isEndHex(currentHex, player, size) {
    if (player === "1") {
        if ((currentHex + 1) % size === 0) {
            return true;
        }
    } else if (player === "2") {
        if (Math.floor(currentHex / size) === size - 1) {
            return true;
        }
    }
}
