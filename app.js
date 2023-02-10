/*TODO:
take in player names
MAYBE: expand grid
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
    else if(board[row][column] == null && gameActive && playerSelection == "onePlayer"){ //singleplayer simple
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
    else if(board[row][column] == null && gameActive && playerSelection == "onePlayerAdv"){  //singleplayer advanced 
        square.textContent = currentPlayer
        let rowArray = board[row]
        rowArray[column] = currentPlayer;
        checkWin();
        let computerPlayed = false;
        let rowMatchFound = false;
        let columnMatchFound = false;
        let diagMatchFound = false;
        while(computerPlayed == false  && gameActive){  
            if(board[1][1] == null){                                        // fill in center by default
                board[1][1] = "O";
                document.getElementsByClassName("row1")[1].textContent = "O"
                computerPlayed = true;
                break;
            }
            for(let i = 0; i < board.length; i++){                          //block rows
                    if(board[i][0] == board[i][1] || board[i][1] == board[i][2] || board[i][0] == board[i][2] ){ //if 2 matches in row
                        let nullCounter = 0;
                        for (let n = 0; n < board[i].length; n++){
                            if(board[i][n] == null){
                                nullCounter++;
                            }
                        }
                        let index = board[i].indexOf(null);
                        if(nullCounter > 1 || index == -1){
                            continue;
                        }
                        board[i][index] = "O"
                        document.getElementsByClassName("row" + i)[index].textContent = "O";
                        computerPlayed = true;
                        rowMatchFound = true;
                        break;    
                    }else{
                        continue;
                    }   
            }
            if(!rowMatchFound){                                             //block columns
                for(let i = 0; i < board[0].length; i++){                  
                    if(board[0][i] == board[1][i] || board[0][i] == board[2][i] || board[1][i] == board[2][i]){ //if two matchs in columns
                        let nullCounter = 0;
                        for( let n = 0;n < board.length; ++n){
                            if(board[n][i] == null){
                                nullCounter++
                            }
                        }
                        let index = undefined;
                        if(nullCounter < 2){
                            for( let n = 0;n < board.length; ++n){      //find empty square
                                if(board[n][i] == null){
                                    index = n;
                                    break;
                                }else{
                                    continue;
                                }
                            }
                        }else{
                            continue;
                        }
                        if(index >= 0){             //checks for empty space
                            board[index][i] = "O"
                            document.getElementsByClassName("row" + index)[i].textContent = "O";
                            computerPlayed = true;
                            columnMatchFound = true;
                            break;
                        }
                        else{
                            continue;
                        }
                    }
                    else{
                        continue;
                    }
                }
            }
            if(!rowMatchFound && !columnMatchFound){                        //block diagonals
                let tToB = [board[0][0], board[1][1], board[2][2]]
                let index = undefined;
                if(board[0][0] == board[1][1] || board[1][1] == board[2][2] || board[0][0] == board[2][2]){   //top to bottom
                    let nullCounter = 0;
                    for (let i = 0; i < tToB.length; i++){
                        if(tToB[i] == null){
                            nullCounter++
                        }else{
                            continue;
                        }
                    }
                    index = tToB.indexOf(null);
                    if(nullCounter < 2 && index != -1){         //checks for empty space
                        board[index][index] = "O";
                        computerPlayed = true;
                        diagMatchFound = true;
                        document.getElementsByClassName("row" + index)[index].textContent = "O";
                    }
                }
                let bToT = [board[0][2], board[1][1], board[2][0]]
                if(board[0][2] == board[1][1] || board[0][2] == board[2][0] || board[1][1] == board[2][0]){       //bottom to top
                    let nullCounter = 0;
                    for (let i = 0; i < bToT.length; i++){
                        if(bToT[i] == null){
                            nullCounter++
                        }else{
                            continue;
                        }
                    }
                    index = bToT.indexOf(null);
                    if(nullCounter < 2 && index != -1){         //checks for empty space
                        board[index][2 - index] = "O";
                        diagMatchFound = true;
                        computerPlayed = true;
                        document.getElementsByClassName("row" + index)[2 - index].textContent = "O";
                    }
                   
                } 
            }
            if(!rowMatchFound && !columnMatchFound && !diagMatchFound){     //play random if no matches found
                let randomRow = getRandomInt(3);
                let randomColumn = getRandomInt(3);
                if(board[randomRow][randomColumn] == null){
                    board[randomRow][randomColumn] = "O"
                    document.getElementsByClassName("row" + randomRow)[randomColumn].textContent = "O"
                    computerPlayed = true;
                }
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