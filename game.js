document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const gameArea = document.getElementById('game-area');
  const lanes = document.querySelectorAll('.lane');

  let audioContext;
  let sourceNode;
  let analyser;
  let dataArray;
  let audio;
  let animationId;

  function initAudio() {
    audio = new Audio('audio/beathero.mp3');
    audio.crossOrigin = 'anonymous';
    audio.loop = false;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sourceNode = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  function generateNote() {
    const laneIndex = Math.floor(Math.random() * lanes.length);
    const note = document.createElement('div');
    note.className = 'note';
    lanes[laneIndex].appendChild(note);

    let top = -20;
    const fallInterval = setInterval(() => {
      top += 5;
      note.style.top = `${top}px`;

      if (top > gameArea.offsetHeight) {
        note.remove();
        clearInterval(fallInterval);
      }
    }, 30);
  }

  function syncNotesToBeat() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    if (average > 100) generateNote();
  }

  function gameLoop() {
    syncNotesToBeat();
    animationId = requestAnimationFrame(gameLoop);
  }

  function startGame() {
    initAudio();
    audio.play();
    startScreen.style.display = 'none';
    gameArea.style.display = 'flex';
    gameLoop();
  }

  startButton.addEventListener('click', () => {
    startGame();
  });
});
