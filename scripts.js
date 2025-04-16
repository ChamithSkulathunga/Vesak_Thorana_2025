const pixelContainers = document.querySelectorAll('.pixel-container');
const speedSlider = document.createElement("input");
speedSlider.type = "range";
speedSlider.min = 1;
speedSlider.max = 10;
speedSlider.value = 1;
const speedValue = document.createElement("span");
speedValue.textContent = "1s";

const patterns = [
  'pattern1', 'pattern2', 'pattern3', 'pattern4', 'pattern5',
  'pattern6', 'pattern7', 'pattern8', 'pattern9', 'pattern10',
  'pattern11', 'pattern12', 'pattern13', 'pattern14', 'pattern15'
];

let currentPattern = 0;
let currentColorIndex = 0;
const pattern1Colors = ['white', 'green', 'yellow', 'blue', 'red'];
let interval;
let autoLoopInterval;

const audio = new Audio("audio/ස්වර්ණ මයුර ජාතකය.mp3");
audio.loop = true;

let isMuted = false;

function applyBackground() {
  const bgShapes = document.querySelectorAll('.bgshape');
  bgShapes.forEach((bgShape, index) => {
    bgShape.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.4))`;
  });
}

function createGrid() {
  pixelContainers.forEach(container => {
    const shapeWidth = container.clientWidth;
    const shapeHeight = container.clientHeight;
    const dotSize = 13;
    const gap = 1;
    const totalSize = dotSize + gap;

    const cols = Math.floor(shapeWidth / totalSize);
    const rows = Math.floor(shapeHeight / totalSize);

    container.style.gridTemplateColumns = `repeat(${cols}, ${dotSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${dotSize}px)`;

    const numDots = cols * rows;

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.style.width = `${dotSize}px`;
      dot.style.height = `${dotSize}px`;
      container.appendChild(dot);
    }
  });
}

function applyPattern1() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.style.animation = 'none';
    dot.style.backgroundColor = pattern1Colors[currentColorIndex];
  });
  currentColorIndex = (currentColorIndex + 1) % pattern1Colors.length;
}

function applyCSSPattern(patternName, duration) {
  const dots = document.querySelectorAll('.dot');
  const cols = Math.sqrt(dots.length);

  dots.forEach((dot, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    dot.style.setProperty('--row', row);
    dot.style.setProperty('--col', col);

    let delay = 0;
    if (patternName === 'pattern2') delay = (row + col) * 0.05;
    else if (patternName === 'pattern4') delay = (dots.length - index) * 0.005;
    else if (patternName === 'pattern7') delay = row * 0.1;
    else if (patternName === 'pattern8') delay = col * 0.1;
    else if (patternName === 'pattern9') delay = Math.abs(row - cols / 2) * 0.05 + Math.abs(col - cols / 2) * 0.05;
    else if (patternName === 'pattern10') delay = Math.random() * 1;
    else if (patternName === 'pattern11') delay = ((row + col) % 2) * 0.2;
    else if (patternName === 'pattern12') {
      const dist = Math.max(Math.abs(row - cols / 2), Math.abs(col - cols / 2));
      delay = dist * 0.07;
    }
    else if (patternName === 'pattern13') delay = ((row * cols + col) % 10) * 0.1;
    else if (patternName === 'pattern14') delay = index * 0.005;
    else if (patternName === 'pattern15') {
      const borderDist = Math.min(row, col, cols - row - 1, cols - col - 1);
      delay = borderDist * 0.1;
    }

    dot.style.animation = `${patternName} ${duration}s infinite`;
    dot.style.animationDelay = `${delay}s`;
  });
}

function updatePattern() {
  clearInterval(interval);

  if (patterns[currentPattern] === 'pattern1') {
    currentColorIndex = 0;
    applyPattern1();
    interval = setInterval(applyPattern1, speedSlider.value * 1000);
  } else if (
    patterns[currentPattern] === 'pattern5' ||
    patterns[currentPattern] === 'pattern10'
  ) {
    applyCSSPattern(patterns[currentPattern], 5);
  } else {
    applyCSSPattern(patterns[currentPattern], speedSlider.value);
  }
}

function startAutoPatternLoop() {
  updatePattern();
  autoLoopInterval = setInterval(() => {
    currentPattern = (currentPattern + 1) % patterns.length;
    updatePattern();
  }, speedSlider.value * 1000 * 5);
}

function stopAutoPatternLoop() {
  clearInterval(interval);
  clearInterval(autoLoopInterval);
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => {
    dot.style.backgroundColor = 'black';
    dot.style.animation = 'none';
  });
}







let hasAudioStarted = false;

function toggleSound() {
  if (!hasAudioStarted || audio.paused) {
    audio.muted = false;
    audio.play().then(() => {
      hasAudioStarted = true; // Track that we've started the audio
      console.log("Audio started.");
    }).catch(err => {
      console.log("Audio play failed:", err);
    });
  } else {
    audio.pause();
    console.log("Audio paused.");
  }
}



document.getElementById("startText").addEventListener("click", () => {
  const introScreen = document.getElementById("introScreen");
  introScreen.style.display = "none"; // Hide blue overlay
  document.querySelector(".controls").style.display = "block"; // Show control buttons
  startWithSound(); // Start the main lights and audio
});

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}



window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded.");
  applyBackground();
  createGrid();
  document.getElementById('onBtn').classList.add('active');
});

let isAnimationRunning = false;

function startAnimation() {
  if (!isAnimationRunning) {
    isAnimationRunning = true;
    currentPattern = 0;
    startAutoPatternLoop();
  }
  document.getElementById('onBtn').classList.add('active');
}

function startWithSound() {
  startAnimation();
  toggleSound();  // Ensure sound is toggled when starting
}

function stopAnimation() {
  if (isAnimationRunning) {
    isAnimationRunning = false;
    stopAutoPatternLoop();
  }
  document.getElementById('offBtn').classList.add('active');
  document.getElementById('onBtn').classList.remove('active');
}

document.getElementById('onBtn').addEventListener('click', startWithSound);

speedSlider.addEventListener('input', () => {
  speedValue.textContent = `${speedSlider.value}s`;
  if (isAnimationRunning) {
    stopAutoPatternLoop();
    startAutoPatternLoop();
  }
});
