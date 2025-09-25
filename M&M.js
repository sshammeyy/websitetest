const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let dog = { x: 50, y: 220, width: 50, height: 50, dy: 0, gravity: 1.5, jumpPower: -20, grounded: true };
let obstacles = [];
let score = 0;
let gameOver = false;
let dogImg = new Image();

// Choose character
function startGame(choice) {
  document.getElementById("characterSelect").style.display = "none";
  canvas.style.display = "block";

  if (choice === "mango") {
    dogImg.src = "images/mango.png"; // Mango sprite
  } else if (choice === "mocha") {
    dogImg.src = "images/mocha.png"; // Mocha sprite
  }

  gameLoop();
}

// Load obstacle image
const obstacleImg = new Image();
obstacleImg.src = "images/bone.png";

// Jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && dog.grounded) {
    dog.dy = dog.jumpPower;
    dog.grounded = false;
  }
});

// Spawn obstacles
setInterval(() => {
  if (!gameOver && canvas.style.display !== "none") {
    obstacles.push({ x: canvas.width, y: 240, width: 40, height: 40 });
  }
}, 2000);

// Main loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over! Final Score: " + score, 200, 150);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#6c4c3f";
  ctx.fillRect(0, 270, canvas.width, 30);

  // Dog physics
  dog.y += dog.dy;
  if (dog.y + dog.height >= 270) {
    dog.y = 220;
    dog.dy = 0;
    dog.grounded = true;
  } else {
    dog.dy += dog.gravity;
  }

  // Draw dog
  ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

  // Obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 6;
    ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);

    // Collision detection
    if (
      dog.x < obs.x + obs.width &&
      dog.x + dog.width > obs.x &&
      dog.y < obs.y + obs.height &&
      dog.height + dog.y > obs.y
    ) {
      gameOver = true;
    }
  }

  // Clean up old obstacles
  obstacles = obstacles.filter(obs => obs.x > -obs.width);

  // Score
  score++;
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  requestAnimationFrame(gameLoop);
}
