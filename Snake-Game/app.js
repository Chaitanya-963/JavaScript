// Selections

const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startButton = document.querySelector(".btnStart");
const restartButton = document.querySelector(".btnRestart");
const startGameModal = document.querySelector(".startGame");
const gameOverModal = document.querySelector(".gameOver");

const highScoreElem = document.querySelector("#highScore");
const timeElem = document.querySelector("#time");
const scoreElem = document.querySelector("#score");

// Variables and Constants declarations
const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScore.innertHTML = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

const blocks = [];
let snake = [{ x: 2, y: 3 }];
let direction = "down";

let timerIntervalId = 0;
let intervalId = 0;

// Iteration

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row},${col}`] = block;
  }
}

// Functional Logic

function render() {
  let head = null;

  blocks[`${food.x},${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  // wall collision logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    // alert("Game Over");
    clearInterval(intervalId);
    modal.style.display = "flex";
    gameOverModal.style.display = "flex";
    startGameModal.style.display = "none";
    return;
  }

  // Food consume logic
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x},${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x},${food.y}`].classList.add("food");
    snake.push(head);

    score++;
    scoreElem.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.add("fill");
  });
}

function restartGame() {
  score = 0;
  time = `00:00`;
  timeElem.textContent = time;
  scoreElem.textContent = score;
  highScoreElem.textContent = highScore;

  blocks[`${food.x},${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x},${segment.y}`].classList.remove("fill");
  });

  modal.style.display = "none";
  direction = "down";
  snake = [{ x: 2, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  intervalId = setInterval(() => {
    render();
  }, 300);
}

// Event

addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  } else if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  }
});

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
      let [min,sec]= time.split(":").map(Number);

      if(sec===59){
          min++;
          sec=0;
      }else{
          sec++;
      }
      time = `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
      timeElem.textContent = time;
  },1000)
});

restartButton.addEventListener("click", restartGame);
