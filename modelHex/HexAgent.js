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
        /*initMinimeTable(true,board);
        console.log(minimeTable);
        for (var i  = 0; i < size; i++){
            for (var j = 0; j < size; j++){
                console.log((minimeTable[i][j][0]));
            }
        }*/
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

var size = 5;
//var board = new Array(size);
var minimeTable = new Array(size);
var leftEdge = new Array(2);
var topEdge = new Array(2);
var rightEdge = new Array(3);
var bottomEdge = new Array(3);

for (var i  = 0; i < size; i++){
    //board[i] = new Array(size);
    minimeTable[i] = new Array(size);
}

for (var i  = 0; i < size; i++){
    for (var j = 0; j < size; j++){
        //board[i][j] = 0;
        minimeTable[i][j] = new Array(3);
    }
}

//Pruebas:
/*
board[4][0] = 0;
board[3][1] = 0;
board[2][2] = 0;
board[0][2] = 0;
board[1][3] = 0;
board[2][4] = 0;
board[3][4] = 0;
board[0][3] = 0;
board[4][1] = 0;
board[3][2] = 0;
board[0][0] = 0;
board[0][1] = 0;
board[0][2] = 0;
board[0][3] = 0;
board[2][4] = 0;

 

for (var i  = 0; i < size; i++){
    for (var j = 0; j < size; j++){
        console.log((minimeTable[i][j][0]));
    }
}*/

//console.log(minimax(0, true, -Infinity, Infinity));
console.log(calculateHeuristic());


function initMinimeTable(red,board){
    rightEdge[0] = Infinity;
    bottomEdge[0] = Infinity;
    for (var i  = 0; i < size; i++){
        for (var j = 0; j < size; j++){
            minimeTable[i][j][0] = Infinity;
            if (red){
                let value = isAvaible(board[i][j], red);
                if ((j == 0) && (value)){
                    minimeTable[i][j][0] = obtainValue(board[i][j], red);
                }
            }
            else{
                let value = isAvaible(board[i][j], red);
                if ((i == 0) && (value)){
                    minimeTable[i][j][0] = obtainValue(board[i][j], red);
                }
            }
        }
    }
}

function isAvaible(item, red){
    if(red){
        if ((item == 0) || (item == "1")){
            return true;
        }
        else return false;
    }
    else {
        if ((item == 0) || (item == "2")){
            return true;
        }
        else return false;
    } 
}

function obtainValue(item, red){
    if (item == 0){
        return 1;
    }
    if ((item == "1") && (red)){
        return 0;
    }
    if ((item == "2") && (!red)){
        return 0;
    }
}

function shortestPath(red,board){
    initMinimeTable(red);
    for (var i = 0; i < size - 1; i++){
        for (var j = 0; j < size - 1; j++){

            let crrentVal = minimeTable[i][j][0];

            //Izquierda
            if((j - 1 >= 0) && isAvaible(board[i][j-1], red)){
                let num = crrentVal + obtainValue(board[i][j-1], red);
                if (num < minimeTable[i][j-1][0]){
                    minimeTable[i][j-1][0] = num;
                    minimeTable[i][j-1][1] = i;
                    minimeTable[i][j-1][2] = j;
                }
            }

            //Arriba-izquierda
            if((i - 1 >= 0) && (j - 1 >= 0) && isAvaible(board[i-1][j-1], red)){
                let num = crrentVal + obtainValue(board[i-1][j-1], red);
                if (num < minimeTable[i-1][j-1][0]){
                    minimeTable[i-1][j-1][0] = num;
                    minimeTable[i-1][j-1][1] = i;
                    minimeTable[i-1][j-1][2] = j;
                }
            }

            //Arriba
            if((i - 1 >= 0) && isAvaible(board[i-1][j], red)){
                let num = crrentVal + obtainValue(board[i-1][j], red);
                if (num < minimeTable[i-1][j][0]){
                    minimeTable[i-1][j][0] = num;
                    minimeTable[i-1][j][1] = i;
                    minimeTable[i-1][j][2] = j;
                }
            }

            //Derecha
            if((j + 1 < size) && isAvaible(board[i][j+1], red)){
                let num = crrentVal + obtainValue(board[i][j+1], red);
                if (num < minimeTable[i][j+1][0]){
                    minimeTable[i][j+1][0] = num;
                    minimeTable[i][j+1][1] = i;
                    minimeTable[i][j+1][2] = j;

                    if (red && (j == size -2)){
                        if (num < rightEdge[0]){
                            rightEdge[0] = num;
                            rightEdge[1] = i;
                            rightEdge[2] = j + 1;
                        }
                    }
                }
            }

            //Abajo derecha
            if((i + 1 < size) && (j + 1 < size) && isAvaible(board[i+1][j+1], red)){
                let num = crrentVal + obtainValue(board[i+1][j+1], red);
                if (num < minimeTable[i+1][j+1][0]){
                    minimeTable[i+1][j+1][0] = num;
                    minimeTable[i+1][j+1][1] = i;
                    minimeTable[i+1][j+1][2] = j;

                    if (red && (j == size -2)){
                        if (num < rightEdge[0]){
                            rightEdge[0] = num;
                            rightEdge[1] = i + 1;
                            rightEdge[2] = j + 1;
                        }
                    }
                    else if (!red && (i == size -2)){
                        if (num < bottomEdge[0]){
                            bottomEdge[0] = num;
                            bottomEdge[1] = i + 1;
                            bottomEdge[2] = j + 1;
                        }
                    }
                }
            }

            //Abajo
            if((i + 1 < size) && isAvaible(board[i+1][j], red)){
                let num = crrentVal + obtainValue(board[i+1][j], red);
                if (num < minimeTable[i+1][j][0]){
                    minimeTable[i+1][j][0] = num;
                    minimeTable[i+1][j][1] = i;
                    minimeTable[i+1][j][2] = j;

                    if (!red && (i == size -2)){
                        if (num < bottomEdge[0]){
                            bottomEdge[0] = num;
                            bottomEdge[1] = i + 1;
                            bottomEdge[2] = j;
                        }
                    }
                }
            }
        }
    }

    if (red){
        return rightEdge[0];
    }
    else {
        return bottomEdge[0];
    }
}

function calculateHeuristic(){
    let blueShorPath = shortestPath(true);
    let redShorPath = shortestPath(false);

    return redShorPath - blueShorPath
}

function minimax(depth, isMaximizing, alpha, beta){ //Aún no funciona
    if (depth == 3){
        return calculateHeuristic();
    }

    if (isMaximizing){
        let bestVal = -Infinity;
        for (var i = 0; i < size - 1; i++){
            for (var j = 0; j < size - 1; j++){
                let value = minimax(depth++, false, alpha, beta);
                bestVal = Math.max(bestVal, value);
                alpha = max(alpha, bestVal);
                if (beta <= alpha){
                    break;
                }
            }
        }
        return bestVal;
    }

    else {
        bestVal = Infinity;
        
        for (var i = 0; i < size - 1; i++){
            for (var j = 0; j < size - 1; j++){
                let value = minimax(depth++, true, alpha, beta);
                bestVal = Math.min(bestVal, value);
                alpha = max(alpha, bestVal);
                if (beta <= alpha){
                    break;
                }
            }
        }
        return bestVal;
    }
}