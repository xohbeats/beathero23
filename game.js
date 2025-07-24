const gameArea = document.getElementById('game');
const lanes = document.querySelectorAll('.lane');
const scoreDisplay = document.getElementById('score');
let score = 0;
let lives = 3;
let speed = 2;
let spawnRate = 1200;
let gameInterval;
let spawnInterval;

// Responsive lane dimensions
const laneHeight = window.innerHeight;
const noteHeight = 80;

function createNote(laneIndex) {
  const note = document.createElement('div');
  note.classList.add('note');
  note.style.height = noteHeight + 'px';
  note.style.top = '0px';
  lanes[laneIndex].appendChild(note);

  let position = 0;

  const moveNote = setInterval(() => {
    position += speed;
    note.style.top = position + 'px';

    if (position >= laneHeight - noteHeight) {
      clearInterval(moveNote);
      // Missed note
      note.remove();
      loseLife();
    }
  }, 16);

  note.dataset.moveInterval = moveNote;
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    endGame();
  }
}

function updateScore() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  if (score % 10 === 0) {
    speed += 0.5;
    spawnRate = Math.max(400, spawnRate - 100);
    restartSpawning();
  }
}

function startGame() {
  score = 0;
  lives = 3;
  speed = 2;
  spawnRate = 1200;
  scoreDisplay.textContent = 'Score: 0';

  lanes.forEach((lane, index) => {
    const hitbox = lane.querySelector('.hitbox');
    hitbox.addEventListener('click', () => hitLane(index));
    hitbox.addEventListener('touchstart', () => hitLane(index));
  });

  spawnInterval = setInterval(() => {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    createNote(laneIndex);
  }, spawnRate);

  gameInterval = setInterval(updateNotes, 16);
}

function restartSpawning() {
  clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    createNote(laneIndex);
  }, spawnRate);
}

function updateNotes() {
  document.querySelectorAll('.note').forEach(note => {
    const moveInterval = note.dataset.moveInterval;
    if (!document.body.contains(note)) {
      clearInterval(moveInterval);
    }
  });
}

function hitLane(index) {
  const lane = lanes[index];
  const notes = lane.querySelectorAll('.note');
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const rect = note.getBoundingClientRect();
    const hitbox = lane.querySelector('.hitbox').getBoundingClientRect();
    if (
      rect.bottom >= hitbox.top &&
      rect.top <= hitbox.bottom
    ) {
      note.remove();
      updateScore();
      return;
    }
  }
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  alert('Game Over! Your score: ' + score);
  window.location.reload();
}
