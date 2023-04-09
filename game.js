const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");

const BALL_RADIUS = 10;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 20;
const BLOCK_SPEED = 3;
const BLOCK_SPAWN_INTERVAL = 1000; // milliseconds
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const GROUND_Y = canvas.height - BALL_RADIUS; // ground plane moved up

let ballX = canvas.width / 2;
let ballY = GROUND_Y - BALL_RADIUS; // ball starts at the ground plane
let ballDY = 0;
let blockList = [];
let spaceBarPressed = false;

let startTime = Date.now();

function drawBall() {
  context.beginPath();
  context.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  context.fillStyle = "blue";
  context.fill();
  context.closePath();
}

function drawBlock(block) {
  context.fillStyle = "red";
  context.fillRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT);
}

function generateBlock() {
  let x = Math.random() * (canvas.width - BLOCK_WIDTH);
  let y = -BLOCK_HEIGHT;
  blockList.push({ x: x, y: y });
}

function moveBlocks() {
  for (let i = 0; i < blockList.length; i++) {
    blockList[i].y += BLOCK_SPEED;
  }
  blockList = blockList.filter((block) => block.y < canvas.height);
}

function draw() {
  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // apply gravity to the ball
  ballDY += GRAVITY;
  ballY += ballDY;

  // keep the ball at the ground plane
  if (ballY + BALL_RADIUS > GROUND_Y) {
    if (spaceBarPressed) {
      alert("Game over!");
      document.location.reload();
    } else {
      ballY = GROUND_Y - BALL_RADIUS;
      ballDY = 0;
    }
  }

  // draw ball
  drawBall();

  // move and draw blocks
  moveBlocks();
  blockList.forEach(drawBlock);

  // check collision
  for (let i = 0; i < blockList.length; i++) {
    let block = blockList[i];
    if (
      ballX + BALL_RADIUS > block.x &&
      ballX - BALL_RADIUS < block.x + BLOCK_WIDTH &&
      ballY + BALL_RADIUS > block.y &&
      ballY - BALL_RADIUS < block.y + BLOCK_HEIGHT
    ) {
      alert("Game over!");
      document.location.reload();
    }
  }
    // calculate score based on elapsed time
    let elapsedSeconds = Math.floor((Date.now() - startTime) / 10000);
    let score = elapsedSeconds * 5;

  // draw time tracker
  //context.fillStyle = "black";
  //context.font = "30px Arial";
  //context.fillText("Time: " + elapsedSeconds, 10, 50);

  // draw score tracker
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.fillText("Score: " + score, canvas.width - 150, 90);


  // request next frame
  requestAnimationFrame(draw);
}





setInterval(generateBlock, BLOCK_SPAWN_INTERVAL);

document.addEventListener("keydown", (event) => {
  if (event.keyCode === 32) {
    ballDY = JUMP_FORCE;
    spaceBarPressed = true;
  } else if (event.keyCode === 37) {
    ballX -= 50;
  } else if (event.keyCode === 39) {
    ballX += 50;
  }
});

draw();
