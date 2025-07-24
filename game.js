window.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");
  const gameContainer = document.getElementById("game-container");
  const audio = document.getElementById("beat-audio");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  let score = 0;
  let lives = 3;
  let gameRunning = false;
  let notes = [];

  // Simple note object
  class Note {
    constructor(x, speed) {
      this.x = x;
      this.y = -40;
      this.width = 50;
      this.height = 20;
      this.speed = speed;
      this.hit = false;
    }

    update() {
      this.y += this.speed;
    }

    draw() {
      ctx.fillStyle = "#0ff";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = "#00cccc";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  function resetGame() {
    score = 0;
    lives = 3;
    notes = [];
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
  }

  function spawnNote() {
    // Four lanes: 0,1,2,3; canvas width 800, so lane width ~200
    const lane = Math.floor(Math.random() * 4);
    const x = lane * 200 + 75; // position note roughly center of lane
    const speed = 4; // adjust for difficulty
    notes.push(new Note(x, speed));
  }

  function drawLanes() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#444";
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 200, 0);
      ctx.lineTo(i * 200, canvas.height);
      ctx.stroke();
    }
    // Draw hit line
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();
    ctx.lineWidth = 1;
  }

  function gameLoop() {
    if (!gameRunning) return;

    drawLanes();

    notes.forEach((note, index) => {
      note.update();
      note.draw();

      if (note.y > canvas.height) {
        // Missed note
        notes.splice(index, 1);
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        if (lives <= 0) {
          endGame();
        }
      }
    });

    requestAnimationFrame(gameLoop);
  }

  function handleKey(e) {
    if (!gameRunning) return;
    const keyMap = {
      'a': 0,
      's': 1,
      'd': 2,
      'f': 3,
    };
    const lane = keyMap[e.key.toLowerCase()];
    if (lane === undefined) return;

    // Check if any note is in hit range on that lane
    // Hit line Y is canvas.height - 100
    const hitRange = 30;
    const laneX = lane * 200 + 75;

    for (let i = 0; i < notes.length; i++) {
      let note = notes[i];
      if (
        !note.hit &&
        Math.abs(note.x - laneX) < 20 &&
        Math.abs(note.y - (canvas.height - 100)) < hitRange
      ) {
        note.hit = true;
        notes.splice(i, 1);
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        break;
      }
    }
  }

  function startGame() {
    resetGame();
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    gameRunning = true;
    audio.currentTime = 0;
    audio.play();

    // Spawn notes every 700ms
    const noteSpawner = setInterval(() => {
      if (!gameRunning) {
        clearInterval(noteSpawner);
        return;
      }
      spawnNote();
    }, 700);

    gameLoop();
  }

  function endGame() {
    gameRunning = false;
    audio.pause();
    alert(`Game Over! Your final score: ${score}`);
    startScreen.style.display = "flex";
    gameContainer.style.display = "none";
  }

  startBtn.addEventListener("click", startGame);
  window.addEventListener("keydown", handleKey);
});
