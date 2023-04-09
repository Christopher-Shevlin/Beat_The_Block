const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0,0, canvas.width, canvas.height);

const BALL_RADIUS = 10;
const BLOCK_SIZE = 50;
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
  context.fillStyle = block.colour;
  context.fillRect(block.x, block.y, BLOCK_SIZE, BLOCK_SIZE);
}

function generateBlock() {
  let x = Math.random() * (canvas.width - BLOCK_SPEED * 10);
  let y = -Math.random() * canvas.height;
  let width = Math.random() * (canvas.width / 1) + 1;
  let height = Math.random() * (canvas.height / 1) + 1;
  let color = "#" + ((1 << 24) * Math.random() | 0).toString(16); // random color in hexadecimal format
  blockList.push({ x: x, y: y, width: width, height: height, color: color });

  let blockCount =1;
  if (blockSpeedFactor >= 10) {
    blockCount = blockSpeedFactor / 10;
  }

  for (let i = 0; i < blockCount; i++) {
    blockList.push({ x: x + i * BLOCK_SIZE, y: y, width: width, height: height, color: color})
  }
}

let blockSpeedFactor = 1;

function moveBlocks() {
  // Increase block speed every 20 seconds
  let elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedSeconds > 0 && elapsedSeconds % 20 == 0) {
    blockSpeedFactor += 0.01;
  }

  // Update block speed
  const speed = BLOCK_SPEED * blockSpeedFactor;

  // Move blocks
  for (let i = 0; i < blockList.length; i++) {
    blockList[i].y += speed;
  }
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
      ballX - BALL_RADIUS < block.x + BLOCK_SIZE &&
      ballY + BALL_RADIUS > block.y &&
      ballY - BALL_RADIUS < block.y + BLOCK_SIZE
    ) {
      alert("Game over!");
      document.location.reload();
    }
  }
    // calculate score based on elapsed time
    let elapsedSeconds = Math.floor((Date.now() - startTime) / 10000);
    let score = elapsedSeconds * 5;

  // draw time tracker
  context.fillStyle = "black";
  //context.font = "30px Arial";
  //context.fillText("Time: " + elapsedSeconds, 10, 50);

  // draw score tracker
  context.fillStyle = "blue";
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
