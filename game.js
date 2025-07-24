// game.js
let score = 0;
let isGameRunning = false;
let noteSpeed = 3000;
const gameDuration = 60000; // 60 seconds
let noteInterval;
let gameTimeout;

const lanes = document.querySelectorAll('.lane');
const scoreDisplay = document.getElementById('score');
const audio = document.getElementById('audio');
const startBtn = document.getElementById('start-btn');
const gameScreen = document.getElementById('game');
const startScreen = document.getElementById('start-screen');

startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', handleKeyPress);

function startGame() {
  isGameRunning = true;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';

  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  audio.currentTime = 0;
  audio.play();

  noteInterval = setInterval(spawnNote, 600);
  gameTimeout = setTimeout(endGame, gameDuration);
}

function spawnNote() {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const note = document.createElement('div');
  note.classList.add('note');
  note.style.animationDuration = `${noteSpeed / 1000}s`;

  lanes[laneIndex].appendChild(note);

  setTimeout(() => {
    if (lanes[laneIndex].contains(note)) {
      note.remove();
    }
  }, noteSpeed);
}

function handleKeyPress(e) {
  if (!isGameRunning) return;

  const keyMap = {
    'a': 0,
    's': 1,
    'd': 2,
    'f': 3
  };

  const laneIndex = keyMap[e.key];

  if (laneIndex === undefined) return;

  const lane = lanes[laneIndex];
  const notes = lane.querySelectorAll('.note');
  const hitbox = lane.querySelector('.hitbox');

  notes.forEach(note => {
    const noteTop = note.getBoundingClientRect().top;
    const hitTop = hitbox.getBoundingClientRect().top;
    const hitBottom = hitbox.getBoundingClientRect().bottom;

    if (noteTop >= hitTop && noteTop <= hitBottom) {
      note.remove();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });
}

function endGame() {
  isGameRunning = false;
  clearInterval(noteInterval);
  clearTimeout(gameTimeout);
  audio.pause();
  audio.currentTime = 0;
  alert(`Game Over! Final Score: ${score}`);
  gameScreen.style.display = 'none';
  startScreen.style.display = 'flex';
}
