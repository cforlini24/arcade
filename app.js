/*TODO:
take in player names
MAYBE: expand grid
MAYBE: increase computer difficulty
MAYBE: implement wonGame funciton for better usability
*/

const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
]
const startingPlayer = "X";
let currentPlayer = startingPlayer;


let playerOne = "";
let oneWins = 0;
let oneWinsElt = document.getElementById("xWinCounter");

let playerTwo = "";
let twoWins = 0;
let twoWinsElt = document.getElementById("oWinCounter");

let currentPlayerElt = document.getElementById("currentPlayerText");

let gameActive = false;
let gamesPlayed = 0;

let gameContainerElt = document.getElementById("gameContainer")

let overlayElt = document.getElementById("overlay");
let overlayTextElt = document.getElementById("overlayText");

let playerSelection = "twoPlayer"
let playerSelectionElt = document.getElementById("playerSelection");


playerSelectionElt.addEventListener("change",function(event){    //check player selection
    playerSelection = event.target.value;
    currentPlayer = startingPlayer;
    currentPlayerElt.textContent = currentPlayer;
    gamesPlayed++
    gameActive = false;
    fillBoard();
})

function fillBoard(){
    if(!gameActive && gamesPlayed == 0){                //build from scratch
        for(let i = 0; i < 3; i++){
            let row = document.createElement("div");
            row.className = "row"
            row.id = "row" + i;
            gameContainerElt.appendChild(row);
            for(let n =0; n < 3; n++){
                let column = document.createElement("span");
                column.className = "column" + n;
                column.classList.add("column");
                column.classList.add("row" + i);
                row.append(column);
                column.textContent= "‎"
                column.addEventListener("click", function(){
                    fillSquare(i, n)
                })
            }
        }
        playerOne = "X";
        playerTwo = "O";
        gameActive = true;
    }else{                                              //clear board
        let textArray = document.getElementsByClassName("column")
        for(i = 0; i <textArray.length; ++i){
            textArray[i].textContent = "‎";
        }
        for(i = 0; i < board.length; ++i){
            for(n = 0; n < board[i].length; ++n){
                board[i][n] = null;
            }
        }
        gameActive = true;
    }
}

function fillSquare(row, column){
    let square = document.getElementsByClassName("row" + row)[column];
    if(board[row][column] == null && gameActive && playerSelection == "twoPlayer"){ //twoplayer
        square.textContent = currentPlayer
        let rowArray = board[row]
        rowArray[column] = currentPlayer;
        if (currentPlayer == "X"){
            currentPlayer = "O";
        }else {
            currentPlayer = "X";
        }
        currentPlayerElt.textContent = currentPlayer;
        checkWin();
    }
    else if(board[row][column] == null && gameActive && playerSelection == "onePlayer"){ //singleplayer
        square.textContent = currentPlayer
        let rowArray = board[row]
        rowArray[column] = currentPlayer;
        checkWin();
        let computerPlayed = false;
        while(computerPlayed == false  && gameActive){              //CPU selector loop
            let randomRow = getRandomInt(3);
            let randomColumn = getRandomInt(3);
            if(board[randomRow][randomColumn] == null){
                board[randomRow][randomColumn] = "O"
                document.getElementsByClassName("row" + randomRow)[randomColumn].textContent = "O"
                computerPlayed = true;
            }
        }
        checkWin();
        
    }
}

function checkWin(){
    let noWinner = true;
    for(let i =0; i < board.length; i++){               //check rows
        let rowCheck = board[i];
        for( n = 0; n <rowCheck.length; n++){
            if (rowCheck[n] == null){
                noWinner = false;
                continue;
            } else if(rowCheck[0] == rowCheck[1] && rowCheck[0] == rowCheck[2]){
                overlayTextElt.textContent = rowCheck[0] + " has won the game!"
                overlayElt.style.display = "flex";
                gameActive = false;
                noWinner = false;
                if(rowCheck[0] == "X"){
                    oneWins++
                }else{
                    twoWins++
                }
                break;
            }
      }
    } 
    for(let n = 0; n < board.length; n++){          //check columns
        if(board[0][n] == null){
            noWinner = false;
            continue;
        }else if(board[0][n] == board[1][n] && board[0][n] == board[2][n]){
            overlayTextElt.textContent = board[0][n] + " has won the game!"
            overlayElt.style.display = "flex";
            gameActive = false;
            noWinner = false;
            if(board[0][n] == "X"){
                oneWins++
            }else{
                twoWins++
            }
            break;
        }
    }
    for(let i = 0; i < 1; i++){             //check top to bottom diagonal
        if(board[i][i] == null){
            noWinner = false;
            break;
        }else if(board[i][i] == board[i+1][i+1] && board[i][i] == board[i+2][i+2]){
            overlayTextElt.textContent = board[i][i] + " has won the game!";
            overlayElt.style.display = "flex";
            gameActive = false;
            noWinner = false;
            if(board[i][i] == "X"){
                oneWins++
            }else{
                twoWins++
            }
            break;
        }
    }
    for(let i = 0; i < 1; i++){              //check bottom to top diagonal
        if(board[i][2] == null){
            noWinner = false;
            break;
        }else if(board[i][2] == board[i+1][1] && board[i][2] == board[i+2][0]){
            overlayTextElt.textContent = board[i][2] + " has won the game!";
            overlayElt.style.display = "flex";
            gameActive = false;
            noWinner = false;
            if(board[i][2] == "X"){
                oneWins++
            }else{
                twoWins++
            }
            break;
        }
    }
    let boardFull = false
    for(let i = 0; i < board.length; i++){          //check for fullboard
       if(!board[i].includes(null)){
        boardFull = true;
       }else{
        boardFull = false;
       }
    }
    if(boardFull && noWinner){               //check fullboard and no winner
        overlayTextElt.textContent = "No player has won.";
        overlayElt.style.display = "flex";
        gameActive = false;
    }

    oneWinsElt.textContent = oneWins;               //update win tracker
    twoWinsElt.textContent = twoWins;
}


overlayElt.addEventListener("click", function(){
    overlayElt.style.display = "none";
})


window.addEventListener("DOMContentLoaded", fillBoard);

newGameElt = document.getElementById("newGameButton");
newGameElt.addEventListener("click", function() {               //start new game
    gamesPlayed++
    fillBoard()
    }
)

//Math
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }