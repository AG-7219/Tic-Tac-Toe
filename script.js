const radios = document.querySelectorAll("input[type=radio]");
const fields = document.querySelectorAll("#start>div");
const textBoxes = document.querySelectorAll("input[type=text");
const turnLabel = document.querySelectorAll("#turn label")[1];
const startButton = document.querySelector("#Start_button");
const restartButton = document.querySelector("#restartButton");
const Windows = document.getElementsByTagName("section");
const cellElements = document.querySelectorAll(".cells");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector("[data-winning-message-text]");

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

var singleMode,
  player1Name,
  player2Name = "Doge",
  cur_turn,
  cur_mark,
  player1,
  player2,
  b = [
      ["_","_","_"],
      ["_","_","_"],
      ["_","_","_"]
    ];


function isMovesLeft(b)
{
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (b[i][j] == '_')
                return true;
                 
    return false;
}

 function evaluate(b)
 {
      
     for(let row = 0; row < 3; row++)
     {
         if (b[row][0] == b[row][1] &&
             b[row][1] == b[row][2])
         {
             if (b[row][0] == player2)
                 return +10;
                  
             else if (b[row][0] == player1)
                 return -10;
         }
     }
   
     for(let col = 0; col < 3; col++)
     {
         if (b[0][col] == b[1][col] &&
             b[1][col] == b[2][col])
         {
             if (b[0][col] == player2)
                 return +10;
   
             else if (b[0][col] == player1)
                 return -10;
         }
     }
   
     if (b[0][0] == b[1][1] && b[1][1] == b[2][2])
     {
         if (b[0][0] == player2)
             return +10;
              
         else if (b[0][0] == player1)
             return -10;
     }
   
     if (b[0][2] == b[1][1] &&
         b[1][1] == b[2][0])
     {
         if (b[0][2] == player2)
             return +10;
              
         else if (b[0][2] == player1)
             return -10;
     }
   
     return 0;
 }


 function minimax(b, depth, isMax)
 {
     let score = evaluate(b);
   
     if (score == 10)
         return score;
   
     if (score == -10)
         return score;
   
     if (isMovesLeft(b) == false)
         return 0;
   
     if (isMax)
     {
         let best = -1000;
   
         for(let i = 0; i < 3; i++)
         {
             for(let j = 0; j < 3; j++)
             {
                  
                 if (b[i][j]=='_')
                 {
                      
                     b[i][j] = player2;
   
                     best = Math.max(best, minimax(b, depth + 1, !isMax));
   
                     b[i][j] = '_';
                 }
             }
         }
         return best;
     }
   
     else
     {
         let best = 1000;
   
         for(let i = 0; i < 3; i++)
         {
             for(let j = 0; j < 3; j++)
             {
                  
                 if (b[i][j] == '_')
                 {
                      
                     b[i][j] = player1;
   
                     best = Math.min(best, minimax(b,depth + 1, !isMax));
   
                     b[i][j] = '_';
                 }
             }
         }
         return best;
     }
 }
  
 function findBestMove(b)
 {
     let bestVal = -1000;
     let bestRow = -1;
     let bestCol = -1;

     for(let i = 0; i < 3; i++)
     {
         for(let j = 0; j < 3; j++)
         {
              
             if (b[i][j] == '_')
             {
                  
                 b[i][j] = player2;
   
                 let moveVal = minimax(b, 0, false);
   
                 b[i][j] = '_';
   
                 if (moveVal > bestVal)
                 {
                     bestRow = i;
                     bestCol = j;
                     bestVal = moveVal;
                 }
             }
         }
     }
   
     return [bestRow,bestCol];
 }
  



function startGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove("x");
    cell.classList.remove("circle");
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
    for(let i=0; i<3; i++)
    {
      for(let j=0; j<3; j++)
      {
        b[i][j]="_";
      }
    }
  });
  if(singleMode && cur_turn===2)
  {
    let bestMove = findBestMove(b);
    let i=bestMove[0], j=bestMove[1];
    placeMark(cellElements[3*i+j],player2);
    b[i][j]=player2;
    swapTurns();
  }
  setBoardHoverClass();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = (cur_turn === 1) ? player1 : player2;
  placeMark(cell, currentClass);
  let index;
  for(let i=0; i<9; i++)
  {
    if(cellElements[i]===cell)
    {
      index=i;
      break;
    }
  }
  b[Math.floor(index/3)][index%3]=(cur_turn===1) ? player1 : player2;
  if(singleMode)
  {
    if(isDraw())
    {
      endGame(true);
    }
    else
    {
      let bestMove = findBestMove(b);
      let i=bestMove[0], j=bestMove[1];
      placeMark(cellElements[3*i+j],player2);
      b[i][j]=player2;
      swapTurns();
      if (checkWin(player2)) {
        endGame(false);
      } else if (isDraw()) {
        endGame(true);
      } else {
        swapTurns();
        setBoardHoverClass();
      }
    }

  }
  else
  {
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Uh! It is a Draw!!";
  } else {
    winningMessageTextElement.innerText = `${cur_turn===1 ? player1Name : player2Name} Wins!`;
  }
  Windows[1].classList.remove("hide");
  Windows[2].classList.add("hide");
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains("x") || cell.classList.contains("circle")
    );
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() 
{
  console.log("fired1");
  if(cur_turn===1) { cur_turn=2; } 
  else { cur_turn=1; }
  console.log(cur_turn);
}

function setBoardHoverClass() {
  console.log(cur_turn);
  board.classList.remove("x");
  board.classList.remove("circle");
  if (cur_turn===1) {
    board.classList.add(player1);
    console.log("fired2");
  } else {
    board.classList.add(player2);
    console.log("fired3");
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

radios[0].addEventListener("click", () => {
  fields[3].classList.add("hide");
  fields[2].firstElementChild.innerText = "Player's Name:";
  fields[4].firstElementChild.innerText = "Player's Mark:";
  turnLabel.lastElementChild.innerHTML = "<strong>Computer</strong>";
});

radios[1].addEventListener("click", () => {
  fields[3].classList.remove("hide");
  fields[2].firstElementChild.innerText = "Player 1's Name:";
  fields[4].firstElementChild.innerText = "Player 1's Mark:";
  turnLabel.lastElementChild.innerHTML = "<strong>Player 2</strong>";
});

startButton.addEventListener("click", () => {
  singleMode = radios[0].checked;
  if (radios[2].checked) Windows[2].classList.remove("Lawrencium");
  else Windows[2].classList.add("Lawrencium");
  player1Name = textBoxes[0].value;
  document.getElementById("name1").innerText=player1Name;
  if (!singleMode) 
  {
    player2Name = textBoxes[1].value;
    document.getElementById("name2").innerText=player2Name;
  }
  cur_turn = (radios[6].checked) ? 1 : 2;
  player1 = (radios[4].checked) ? "x" : "circle";
  player2 = (player1 === "x") ? "circle" : "x";
  console.log(player1);
  console.log(player2);
  console.log(cur_turn);
  Windows[0].classList.add("hide");
  Windows[2].classList.remove("hide");
  startGame();
});

restartButton.addEventListener("click",()=>
{
    Windows[1].classList.add("hide");
    Windows[2].classList.remove("hide");
    startGame();
});
  
 
  
 
  
 
  
  
  