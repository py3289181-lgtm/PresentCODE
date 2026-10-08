// PresentCode - Fullscreen Presentation Slideshow Engine

let isPresenting = false;
let presentSlideIndex = 0;
let laserActive = false;

window.startPresentation = function(fromBeginning = false) {
  isPresenting = true;
  presentSlideIndex = fromBeginning ? 0 : window.deck.currentSlideIndex;

  const overlay = document.getElementById('presentationOverlay');
  if (!overlay) return;

  overlay.classList.add('active');

  // Request browser full screen if available
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  renderPresentationSlide();
};

window.exitPresentation = function() {
  isPresenting = false;
  const overlay = document.getElementById('presentationOverlay');
  if (overlay) overlay.classList.remove('active');

  const laser = document.getElementById('laserPointer');
  if (laser) laser.style.display = 'none';

  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
};

function renderPresentationSlide() {
  const stage = document.getElementById('presentationStage');
  const counter = document.getElementById('presentCounter');
  if (!stage) return;

  const slide = window.deck.slides[presentSlideIndex];
  if (!slide) return;

  if (counter) {
    counter.innerText = `${presentSlideIndex + 1} / ${window.deck.slides.length}`;
  }

  // Clear stage
  stage.innerHTML = '';
  stage.style.backgroundColor = slide.background || '#ffffff';

  // Apply slide transition animation
  const transitionClass = slide.transition || 'trans-fade';
  stage.className = 'presentation-stage ' + transitionClass;

  // Render elements with their animations
  slide.elements.forEach(data => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    // Scale positioning proportionally to stage dimensions
    el.style.left = `${(data.x / 960) * 100}%`;
    el.style.top = `${(data.y / 540) * 100}%`;
    el.style.width = `${(data.width / 960) * 100}%`;
    el.style.height = `${(data.height / 540) * 100}%`;
    el.style.transform = `rotate(${data.rotate || 0}deg)`;

    // Apply animation
    if (data.animation && data.animation !== 'none') {
      el.className = data.animation;
    }

    if (data.type === 'text') {
      const textDiv = document.createElement('div');
      textDiv.style.width = '100%';
      textDiv.style.height = '100%';
      textDiv.innerText = data.content;
      if (data.styles) {
        Object.assign(textDiv.style, data.styles);
        // Responsive font scaling
        const baseSize = parseInt(data.styles.fontSize) || 24;
        textDiv.style.fontSize = `calc(${baseSize}px * (100vw / 960))`;
        textDiv.style.maxFontSize = `${baseSize * 1.5}px`;
      }
      el.appendChild(textDiv);
    } else if (data.type === 'shape') {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      const fill = data.styles?.fill || '#d83b01';
      
      if (data.shapeType === 'circle') {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('rx', '48%');
        circle.setAttribute('ry', '48%');
        circle.setAttribute('fill', fill);
        svg.appendChild(circle);
      } else {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('rx', data.shapeType === 'rounded' ? '16' : '0');
        rect.setAttribute('fill', fill);
        svg.appendChild(rect);
      }
      el.appendChild(svg);
    } else if (data.type === 'image') {
      const img = document.createElement('img');
      img.src = data.content;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      el.appendChild(img);
    }

    stage.appendChild(el);
  });

  // Render drawings if any
  if (slide.drawingData) {
    const drawImg = document.createElement('img');
    drawImg.src = slide.drawingData;
    drawImg.style.position = 'absolute';
    drawImg.style.top = '0';
    drawImg.style.left = '0';
    drawImg.style.width = '100%';
    drawImg.style.height = '100%';
    drawImg.style.pointerEvents = 'none';
    stage.appendChild(drawImg);
  }
}

window.presentNext = function() {
  if (presentSlideIndex < window.deck.slides.length - 1) {
    presentSlideIndex++;
    renderPresentationSlide();
  }
};

window.presentPrev = function() {
  if (presentSlideIndex > 0) {
    presentSlideIndex--;
    renderPresentationSlide();
  }
};

window.toggleLaserPointer = function() {
  laserActive = !laserActive;
  const laser = document.getElementById('laserPointer');
  const btn = document.getElementById('btnPresentLaser');
  if (laser) {
    laser.style.display = laserActive ? 'block' : 'none';
  }
  if (btn) {
    btn.style.color = laserActive ? '#ff0033' : '#ffffff';
  }
};

// Keyboard listener for slideshow
document.addEventListener('keydown', (e) => {
  if (!isPresenting) {
    if (e.key === 'F5') {
      e.preventDefault();
      window.startPresentation(e.shiftKey ? false : true);
    }
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
    case 'n':
    case 'N':
      e.preventDefault();
      window.presentNext();
      break;

    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
    case 'p':
    case 'P':
      e.preventDefault();
      window.presentPrev();
      break;

    case 'Escape':
      window.exitPresentation();
      break;

    case 'l':
    case 'L':
      window.toggleLaserPointer();
      break;

    case 'b':
    case 'B':
      // Toggle black screen
      const stageB = document.getElementById('presentationStage');
      if (stageB) {
        stageB.style.backgroundColor = stageB.style.backgroundColor === 'rgb(0, 0, 0)' ? (window.deck.slides[presentSlideIndex].background || '#ffffff') : '#000000';
      }
      break;
  }
});

// Laser pointer mousemove
document.addEventListener('mousemove', (e) => {
  if (isPresenting && laserActive) {
    const laser = document.getElementById('laserPointer');
    if (laser) {
      laser.style.left = `${e.clientX - 6}px`;
      laser.style.top = `${e.clientY - 6}px`;
    }
  }
});
