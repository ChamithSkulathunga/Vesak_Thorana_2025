const pixelContainers = document.querySelectorAll('.pixel-container');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

const patterns = [
  'pattern1', 'pattern2', 'pattern3', 'pattern4', 'pattern5',
  'pattern6', 'pattern7', 'pattern8', 'pattern9', 'pattern10',
  'pattern11', 'pattern12', 'pattern13', 'pattern14', 'pattern15'
];

let currentPattern = 0;
let currentColorIndex = 0;
const pattern1Colors = ['white', 'green', 'yellow', 'blue', 'red'];
let interval;

function applyBackground() {
  const bgShapes = document.querySelectorAll('.bgshape');
  bgShapes.forEach((bgShape, index) => {
    // Set different backgrounds for each .bgshape element if needed
    bgShape.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.4))`; // Example
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

// function applySinhalaWishPattern() {
//   const dots = document.querySelectorAll('.dot');
//   const cols = Math.floor(Math.sqrt(dots.length)); // use same logic as grid creation
//   const rows = Math.floor(dots.length / cols);

//   const message = 'සුභ වෙසක් මංගල්‍යයක් වේවා';

//   // Clear grid
//   dots.forEach(dot => {
//     dot.style.animation = 'none';
//     dot.style.backgroundColor = 'black';
//   });

//   // Use Canvas to draw text and map pixels to grid
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   canvas.width = cols;
//   canvas.height = rows;

//   ctx.fillStyle = 'white';
//   ctx.font = 'bold 10px sans-serif';
//   ctx.textAlign = 'center';
//   ctx.fillText(message, canvas.width / 2, canvas.height / 2);

//   const imageData = ctx.getImageData(0, 0, cols, rows).data;

//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const pixelIndex = (row * cols + col);
//       const dataIndex = pixelIndex * 4;
//       const brightness = imageData[dataIndex]; // just R is enough for white text

//       if (brightness > 100) {
//         dots[pixelIndex].style.backgroundColor = 'yellow';
//         dots[pixelIndex].style.animation = 'blink 1s infinite';
//       }
//     }
//   }
// }

function updatePattern() {
  clearInterval(interval);
  const dots = document.querySelectorAll('.dot');

  if (patterns[currentPattern] === 'sinhalaWish') {
    applySinhalaWishPattern();
    return;
  }

  if (patterns[currentPattern] === 'pattern1') {
    currentColorIndex = 0;
    applyPattern1();
    interval = setInterval(applyPattern1, speedSlider.value * 1000);
  } else if (
    patterns[currentPattern] === 'pattern5' ||
    patterns[currentPattern] === 'pattern10'
  ) {
    applyFixedSpeedPattern(patterns[currentPattern], 5);
  } else {
    applyCSSPattern(patterns[currentPattern], speedSlider.value);
  }
}


const soundButton = document.getElementById("soundButton");
const audio = new Audio("audio/ස්වර්ණ මයුර ජාතකය.mp3"); // Replace with your actual file
audio.loop = true; // optional: loops the sound

let isMuted = false;

// Autoplay on page load
window.addEventListener("DOMContentLoaded", () => {
  audio.play().catch(err => {
    console.log("Autoplay blocked by browser. User interaction required.");
  });
});

function toggleSound() {
  if (isMuted) {
    audio.play();
    soundButton.src = "Image/sound.png";
  } else {
    audio.pause();
    soundButton.src = "image/sound-cut.png";
  }
  isMuted = !isMuted;
}



// Button Event Listeners
document.getElementById('pattern1Btn').addEventListener('click', () => {
  currentPattern = 0;
  updatePattern();
});
document.getElementById('pattern2Btn').addEventListener('click', () => {
  currentPattern = 1;
  updatePattern();
});
document.getElementById('pattern3Btn').addEventListener('click', () => {
  currentPattern = 2;
  updatePattern();
});
document.getElementById('pattern4Btn').addEventListener('click', () => {
  currentPattern = 3;
  updatePattern();
});
document.getElementById('pattern5Btn').addEventListener('click', () => {
  currentPattern = 4;
  updatePattern();
});
document.getElementById('pattern6Btn').addEventListener('click', () => {
  currentPattern = 5;
  updatePattern();
});
document.getElementById('pattern7Btn').addEventListener('click', () => {
  currentPattern = 6;
  updatePattern();
});
document.getElementById('pattern8Btn').addEventListener('click', () => {
  currentPattern = 7;
  updatePattern();
});
document.getElementById('pattern9Btn').addEventListener('click', () => {
  currentPattern = 8;
  updatePattern();
});
document.getElementById('pattern10Btn').addEventListener('click', () => {
  currentPattern = 9;
  updatePattern();
});
document.getElementById('pattern11Btn').addEventListener('click', () => {
  currentPattern = 10;
  updatePattern();
});
document.getElementById('pattern12Btn').addEventListener('click', () => {
  currentPattern = 11;
  updatePattern();
});
document.getElementById('pattern13Btn').addEventListener('click', () => {
  currentPattern = 12;
  updatePattern();
});
document.getElementById('pattern14Btn').addEventListener('click', () => {
  currentPattern = 13;
  updatePattern();
});
document.getElementById('pattern15Btn').addEventListener('click', () => {
  currentPattern = 14;
  updatePattern();
});
// document.getElementById('sinhalaWishBtn').addEventListener('click', () => {
//   currentPattern = 15;
//   updatePattern();
// });

let isAnimationRunning = false; // Flag to check if the animation is running

function startAnimation() {
  if (!isAnimationRunning) {
    isAnimationRunning = true;
    updatePattern(); // Start the animation when On button is clicked
  }
}

function stopAnimation() {
  if (isAnimationRunning || interval) {
    isAnimationRunning = false;
    clearInterval(interval); // Stop the animation

    // Set all dot colors to black and stop animations
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.style.backgroundColor = 'black'; // Set background color to black for all dots
      dot.style.animation = 'none'; // Stop any animations
    });
  }
}

// Button Event Listeners for On/Off buttons
document.getElementById('onBtn').addEventListener('click', startAnimation); // Start animation on "On" button click
document.getElementById('offBtn').addEventListener('click', stopAnimation); // Stop animation on "Off" button click

speedSlider.addEventListener('input', () => {
  speedValue.textContent = `${speedSlider.value}s`;
  updatePattern();
});

window.addEventListener('DOMContentLoaded', () => {
  applyBackground(); // Apply the background on DOM load
  createGrid();
  updatePattern();
});