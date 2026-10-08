// PresentCode - Canvas Engine (Selection, Drag, Resize, Rotate, Text & Drawing)

let isDragging = false;
let isResizing = false;
let isRotating = false;
let currentResizeHandle = null;
let dragStartX = 0;
let dragStartY = 0;
let initialElemX = 0;
let initialElemY = 0;
let initialElemW = 0;
let initialElemH = 0;
let initialAngle = 0;

// Drawing mode state
let isDrawingMode = false;
let isPainting = false;
let drawTool = 'pen'; // 'pen', 'highlighter', 'eraser'
let drawColor = '#d83b01';
let drawSize = 3;

window.renderSlideCanvas = function() {
  const viewport = document.getElementById('slideViewport');
  if (!viewport) return;

  const currentSlide = window.deck.getCurrentSlide();
  viewport.style.backgroundColor = currentSlide.background || '#ffffff';

  // Clear existing element nodes except drawing canvas
  const drawingCanvas = document.getElementById('drawingCanvas');
  viewport.querySelectorAll('.slide-element').forEach(el => el.remove());

  // Render elements
  currentSlide.elements.forEach(data => {
    const el = document.createElement('div');
    el.className = `slide-element ${data.id === window.deck.selectedElementId ? 'selected' : ''}`;
    el.id = data.id;
    el.style.left = `${data.x}px`;
    el.style.top = `${data.y}px`;
    el.style.width = `${data.width}px`;
    el.style.height = `${data.height}px`;
    el.style.transform = `rotate(${data.rotate || 0}deg)`;

    // Apply animation if specified
    if (data.animation && data.animation !== 'none') {
      el.classList.add(data.animation);
    }

    // Element Content based on type
    if (data.type === 'text') {
      const textDiv = document.createElement('div');
      textDiv.className = 'text-box-content';
      textDiv.contentEditable = 'true';
      textDiv.spellcheck = false;
      textDiv.innerText = data.content;
      
      // Apply styles
      if (data.styles) {
        Object.assign(textDiv.style, data.styles);
      }

      // Sync edits
      textDiv.addEventListener('input', () => {
        data.content = textDiv.innerText;
        window.renderSlideThumbnails();
      });

      // Avoid dragging while typing inside text
      textDiv.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        window.deck.selectedElementId = data.id;
        highlightActiveElement();
        updateToolbarStyles(data.styles);
      });

      el.appendChild(textDiv);
    } else if (data.type === 'shape') {
      const shapeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      shapeSvg.setAttribute('width', '100%');
      shapeSvg.setAttribute('height', '100%');
      shapeSvg.style.overflow = 'visible';

      const fill = data.styles?.fill || '#d83b01';
      const stroke = data.styles?.stroke || 'transparent';
      const strokeWidth = data.styles?.strokeWidth || 0;

      if (data.shapeType === 'circle') {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        circle.setAttribute('cx', '50%');
        circle.setAttribute('cy', '50%');
        circle.setAttribute('rx', '48%');
        circle.setAttribute('ry', '48%');
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', strokeWidth);
        shapeSvg.appendChild(circle);
      } else if (data.shapeType === 'triangle') {
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        poly.setAttribute('points', '50,5 95,95 5,95');
        poly.setAttribute('transform', 'scale(' + (data.width/100) + ',' + (data.height/100) + ')');
        poly.setAttribute('fill', fill);
        poly.setAttribute('stroke', stroke);
        shapeSvg.appendChild(poly);
      } else if (data.shapeType === 'star') {
        const star = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        star.setAttribute('points', '50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36');
        star.setAttribute('transform', 'scale(' + (data.width/100) + ',' + (data.height/100) + ')');
        star.setAttribute('fill', fill);
        star.setAttribute('stroke', stroke);
        shapeSvg.appendChild(star);
      } else if (data.shapeType === 'arrow') {
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        arrow.setAttribute('points', '0,35 60,35 60,10 100,50 60,90 60,65 0,65');
        arrow.setAttribute('transform', 'scale(' + (data.width/100) + ',' + (data.height/100) + ')');
        arrow.setAttribute('fill', fill);
        arrow.setAttribute('stroke', stroke);
        shapeSvg.appendChild(arrow);
      } else {
        // Default Rectangle
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('rx', data.shapeType === 'rounded' ? '16' : '0');
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', strokeWidth);
        shapeSvg.appendChild(rect);
      }
      el.appendChild(shapeSvg);
    } else if (data.type === 'image') {
      const img = document.createElement('img');
      img.src = data.content;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      img.draggable = false;
      el.appendChild(img);
    }

    // Append 8 Resizing Handles
    ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(h => {
      const handle = document.createElement('div');
      handle.className = `resize-handle handle-${h}`;
      handle.dataset.handle = h;
      el.appendChild(handle);
    });

    // Append Rotate Handle
    const rotHandle = document.createElement('div');
    rotHandle.className = 'rotate-handle';
    el.appendChild(rotHandle);

    // Click to select & drag
    el.addEventListener('mousedown', (e) => {
      if (isDrawingMode) return;
      if (e.target.classList.contains('resize-handle')) {
        startResize(e, data, e.target.dataset.handle);
        return;
      }
      if (e.target.classList.contains('rotate-handle')) {
        startRotate(e, data, el);
        return;
      }
      startDrag(e, data);
    });

    viewport.appendChild(el);
  });

  // Load drawing strokes if exist
  restoreDrawingOnCanvas();
};

function highlightActiveElement() {
  document.querySelectorAll('.slide-element').forEach(el => {
    el.classList.toggle('selected', el.id === window.deck.selectedElementId);
  });
}

function updateToolbarStyles(styles) {
  if (!styles) return;
  const fontSelect = document.getElementById('fontFamilySelect');
  const sizeSelect = document.getElementById('fontSizeInput');
  const colorInput = document.getElementById('textColorInput');
  if (fontSelect && styles.fontFamily) {
    const rawName = styles.fontFamily.replace(/['",]/g, '').split(' ')[0];
    fontSelect.value = rawName;
  }
  if (sizeSelect && styles.fontSize) sizeSelect.value = parseInt(styles.fontSize);
  if (colorInput && styles.color) colorInput.value = styles.color;
}

// DRAGGING
function startDrag(e, data) {
  isDragging = true;
  window.deck.selectedElementId = data.id;
  highlightActiveElement();
  updateToolbarStyles(data.styles);

  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialElemX = data.x;
  initialElemY = data.y;

  const onMouseMove = (moveEvt) => {
    if (!isDragging) return;
    const dx = moveEvt.clientX - dragStartX;
    const dy = moveEvt.clientY - dragStartY;
    data.x = Math.round(initialElemX + dx);
    data.y = Math.round(initialElemY + dy);
    
    const el = document.getElementById(data.id);
    if (el) {
      el.style.left = `${data.x}px`;
      el.style.top = `${data.y}px`;
    }
  };

  const onMouseUp = () => {
    isDragging = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.renderSlideThumbnails();
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

// RESIZING
function startResize(e, data, handle) {
  e.stopPropagation();
  isResizing = true;
  currentResizeHandle = handle;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialElemX = data.x;
  initialElemY = data.y;
  initialElemW = data.width;
  initialElemH = data.height;

  const onMouseMove = (moveEvt) => {
    if (!isResizing) return;
    const dx = moveEvt.clientX - dragStartX;
    const dy = moveEvt.clientY - dragStartY;

    if (handle.includes('e')) data.width = Math.max(30, initialElemW + dx);
    if (handle.includes('s')) data.height = Math.max(20, initialElemH + dy);
    if (handle.includes('w')) {
      const newW = Math.max(30, initialElemW - dx);
      data.x = initialElemX + (initialElemW - newW);
      data.width = newW;
    }
    if (handle.includes('n')) {
      const newH = Math.max(20, initialElemH - dy);
      data.y = initialElemY + (initialElemH - newH);
      data.height = newH;
    }

    const el = document.getElementById(data.id);
    if (el) {
      el.style.left = `${data.x}px`;
      el.style.top = `${data.y}px`;
      el.style.width = `${data.width}px`;
      el.style.height = `${data.height}px`;
    }
  };

  const onMouseUp = () => {
    isResizing = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.renderSlideThumbnails();
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

// ROTATING
function startRotate(e, data, el) {
  e.stopPropagation();
  isRotating = true;
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const onMouseMove = (moveEvt) => {
    if (!isRotating) return;
    const rad = Math.atan2(moveEvt.clientY - centerY, moveEvt.clientX - centerX);
    let deg = Math.round(rad * (180 / Math.PI)) + 90;
    data.rotate = deg;
    el.style.transform = `rotate(${deg}deg)`;
  };

  const onMouseUp = () => {
    isRotating = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.renderSlideThumbnails();
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}

// DRAWING CANVAS SETUP
function setupDrawingEngine() {
  const canvas = document.getElementById('drawingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;

  canvas.addEventListener('mousedown', (e) => {
    if (!isDrawingMode) return;
    isPainting = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = drawSize * 4;
    } else if (drawTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor + '55'; // translucent
      ctx.lineWidth = drawSize * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = drawSize;
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isPainting || !isDrawingMode) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  const stopPaint = () => {
    if (isPainting) {
      isPainting = false;
      ctx.closePath();
      // Save data URL to current slide
      window.deck.getCurrentSlide().drawingData = canvas.toDataURL();
      window.renderSlideThumbnails();
    }
  };

  canvas.addEventListener('mouseup', stopPaint);
  canvas.addEventListener('mouseleave', stopPaint);
}

function restoreDrawingOnCanvas() {
  const canvas = document.getElementById('drawingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const drawingData = window.deck.getCurrentSlide().drawingData;
  if (drawingData) {
    const img = new Image();
    img.onload = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);
    };
    img.src = drawingData;
  }
}

// Deselect on empty canvas click
document.addEventListener('DOMContentLoaded', () => {
  setupDrawingEngine();
  const viewport = document.getElementById('slideViewport');
  if (viewport) {
    viewport.addEventListener('mousedown', (e) => {
      if (e.target === viewport) {
        window.deck.selectedElementId = null;
        highlightActiveElement();
      }
    });
  }
});
