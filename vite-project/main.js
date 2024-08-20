const gameBoard = document.getElementById("game");
const rowCount = document.getElementById("rowCount");
const columnCount = document.getElementById("columnCount");
const mineCount = document.getElementById("mineCount");
const start = document.getElementById("start");
const result = document.getElementById("result");

let squares = [];
let gameOver = false;

let clickedCount = 0;
let totalSquareNonMines = 0;

function startGame() {
  let rowCountValue = parseInt(rowCount.value);
  let columnCountValue = parseInt(columnCount.value);
  let mineCountValue = parseInt(mineCount.value);

  if (rowCountValue < 10 && columnCountValue < 10) {
    result.innerText = "Row and Column is not enough";
    return;
  }

  gameOver = false;
  gameBoard.innerHTML = "";
  result.innerText = "";
  clickedCount = 0;
  totalSquareNonMines = rowCountValue * columnCountValue - mineCountValue;

  gameBoard.style.gridTemplateColumns = `repeat(${columnCountValue}, 1fr)`;

  createGameBoard(rowCountValue, columnCountValue);
  setMines(rowCountValue, columnCountValue, mineCountValue);

  rowCount.value = "";
  columnCount.value = "";
  mineCount.value = "";
}

function createGameBoard(rowCountValue, columnCountValue) {
  squares = [];
  for (let r = 0; r < rowCountValue; r++) {
    let row = [];
    for (let c = 0; c < columnCountValue; c++) {
      let square = document.createElement("div");
      square.className = "square";
      square.id = `${r}-${c}`;
      gameBoard.append(square);
      row.push(square);
      // console.log(square);

      square.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (!gameOver) {
          showFlag(square);
        }
      });
      square.addEventListener("click", () => {
        if (!gameOver) {
          if (square.classList.contains("flag")) {
            square.classList.remove("flag");
          }

          if (checkMine(r, c)) {
            showMines();
          } else {
            showNumber(r, c);
            winner();
          }
        }
      });
    }
    // console.log(row);
    squares.push(row);
  }
  // console.log(squares);
}

start.addEventListener("click", startGame);

function showFlag(square) {
  if (
    square.classList.contains("square-clicked") &&
    square.classList.contains("flag")
  ) {
    square.classList.remove("flag");
  } else if (!square.classList.contains("square-clicked")) {
    square.classList.toggle("flag");
  }
}

let mineLocations = [];

function setMines(rowCountValue, columnCountValue, mineCountValue) {
  mineLocations = [];
  while (mineCountValue > 0) {
    let row = Math.floor(Math.random() * rowCountValue);
    let column = Math.floor(Math.random() * columnCountValue);
    let id = `${row}-${column}`;
    if (!mineLocations.includes(id)) {
      mineLocations.push(id);
      squares[row][column].dataset.mine = "true";
      mineCountValue--;
    }
    // console.log(id);
  }
  // console.log(mineLocations);
}

function checkMine(row, column) {
  if (squares[row][column].dataset.mine === "true") {
    squares[row][column].classList.add("mine");
    gameOver = true;
    result.innerText = "You Lost...";
    return true;
  }
  return false;
}

function showMines() {
  mineLocations.forEach((id) => {
    let coords = id.split("-");
    let row = parseInt(coords[0]);
    let column = parseInt(coords[1]);
    squares[row][column].classList.add("mine");
  });
}

function showNumber(row, column) {
  if (
    !squares[row] ||
    !squares[row][column] ||
    squares[row][column].classList.contains("square-clicked")
  ) {
    return;
  }

  squares[row][column].classList.add("square-clicked");

  let minesFound = 0;
  let directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (let i = 0; i < directions.length; i++) {
    let newRow = row + directions[i][0];
    let newColumn = column + directions[i][1];
    if (
      squares[newRow] &&
      squares[newRow][newColumn] &&
      squares[newRow][newColumn].dataset.mine === "true"
    ) {
      minesFound++;
    }
  }

  if (minesFound > 0) {
    squares[row][column].innerText = minesFound;
  } else {
    squares[row][column].innerText = "";
  }

  if (minesFound === 0) {
    for (let i = 0; i < directions.length; i++) {
      let newRow = row + directions[i][0];
      let newColumn = column + directions[i][1];
      showNumber(newRow, newColumn);
    }
  }

  if (!squares[row][column].dataset.mine) {
    clickedCount++;
    winner();
  }
  // console.log(clickedCount);
}

function winner() {
  if (clickedCount === totalSquareNonMines) {
    gameOver = true;
    result.innerText = "You Won👏";
    showMines();
  }
}
