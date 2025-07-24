// game.js

document.addEventListener('DOMContentLoaded', () => {
  let score = 0;
  let isGameRunning = false;
  const noteSpeed = 3000; // milliseconds note takes to fall
  const gameDuration = 60000; // 60 seconds game length
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
    console.log('Game started');
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
    if (!isGameRunning) return;

    const laneIndex = Math.floor(Math.random() * lanes.length);
    const lane = lanes[laneIndex];

    const note = document.createElement('div');
    note.classList.add('note');
    note.style.animationDuration = `${noteSpeed / 1000}s`;

    lane.appendChild(note);

    // Remove note after it falls off screen
    setTimeout(() => {
      if (lane.contains(note)) {
        lane.removeChild(note);
        // Optionally: penalize for missed note here
      }
    }, noteSpeed);

    console.log('Note spawned in lane', laneIndex);
  }

  function handleKeyPress(e) {
    if (!isGameRunning) return;

    const keyMap = {
      'a': 0,
      's': 1,
      'd': 2,
      'f': 3
    };

    const laneIndex = keyMap[e.key.toLowerCase()];
    if (laneIndex === undefined) return;

    const lane = lanes[laneIndex];
    const notes = lane.querySelectorAll('.note');
    const hitbox = lane.querySelector('.hitbox');

    if (notes.length === 0) return;

    const note = notes[0];
    const noteRect = note.getBoundingClientRect();
    const hitboxRect = hitbox.getBoundingClientRect();

    // Check if note is inside hitbox vertically
    if (noteRect.top >= hitboxRect.top && noteRect.top <= hitboxRect.bottom) {
      note.remove();
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      console.log(`Hit note in lane ${laneIndex}, score: ${score}`);
    }
  }

  function endGame() {
    console.log('Game ended');
    isGameRunning = false;
    clearInterval(noteInterval);
    clearTimeout(gameTimeout);
    audio.pause();
    audio.currentTime = 0;
    alert(`Game Over! Final Score: ${score}`);
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
  }
});
