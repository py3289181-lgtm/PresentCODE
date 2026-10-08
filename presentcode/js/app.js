// PresentCode - Application Controller & Event Wiring

document.addEventListener('DOMContentLoaded', () => {
  initRibbonTabs();
  initFontPicker();
  initAnimationPickers();
  initTransitionPickers();
  initLeftQuickToolbar();
  initKeyboardShortcuts();

  // Initial render
  window.deck.render();
});

// RIBBON TABS SWITCHING
function initRibbonTabs() {
  const tabs = document.querySelectorAll('.ribbon-tab');
  const panels = document.querySelectorAll('.ribbon-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      tab.classList.add('active');
      const targetId = 'ribbonPanel_' + tab.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.style.display = 'flex';
      }

      // Turn off drawing mode if leaving DRAW tab
      if (tab.dataset.tab !== 'draw' && isDrawingMode) {
        toggleDrawingMode(false);
      }
    });
  });
}

// 50+ FONTS SELECTOR
function initFontPicker() {
  const fontSelect = document.getElementById('fontFamilySelect');
  if (!fontSelect) return;

  fontSelect.innerHTML = '';
  const categories = {};
  PRESENT_FONTS.forEach(f => {
    if (!categories[f.category]) categories[f.category] = [];
    categories[f.category].push(f);
  });

  Object.entries(categories).forEach(([cat, fonts]) => {
    const optGroup = document.createElement('optgroup');
    optGroup.label = cat;
    fonts.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.name;
      opt.innerText = f.name;
      opt.style.fontFamily = f.family;
      optGroup.appendChild(opt);
    });
    fontSelect.appendChild(optGroup);
  });

  fontSelect.addEventListener('change', (e) => {
    const fontName = e.target.value;
    loadGoogleFont(fontName);
    applyStyleToSelected({ fontFamily: `'${fontName}', sans-serif` });
  });
}

// 30+ ANIMATIONS SELECTOR
function initAnimationPickers() {
  const animSelect = document.getElementById('elementAnimSelect');
  if (!animSelect) return;

  animSelect.innerHTML = '<option value="none">None (No Animation)</option>';
  
  const categories = {};
  ELEMENT_ANIMATIONS.forEach(a => {
    if (!categories[a.category]) categories[a.category] = [];
    categories[a.category].push(a);
  });

  Object.entries(categories).forEach(([cat, anims]) => {
    const group = document.createElement('optgroup');
    group.label = cat + ' Animations';
    anims.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a.id;
      opt.innerText = `${a.icon} ${a.name}`;
      group.appendChild(opt);
    });
    animSelect.appendChild(group);
  });

  animSelect.addEventListener('change', (e) => {
    const animId = e.target.value;
    const selectedElData = getSelectedElementData();
    if (selectedElData) {
      selectedElData.animation = animId;
      const elNode = document.getElementById(selectedElData.id);
      applyElementAnimation(elNode, animId);
    }
  });
}

// 15+ SLIDE TRANSITIONS SELECTOR
function initTransitionPickers() {
  const transSelect = document.getElementById('slideTransitionSelect');
  if (!transSelect) return;

  transSelect.innerHTML = '';
  SLIDE_TRANSITIONS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.innerText = `${t.name} (${t.desc})`;
    transSelect.appendChild(opt);
  });

  transSelect.addEventListener('change', (e) => {
    const current = window.deck.getCurrentSlide();
    current.transition = e.target.value;
    // Preview transition on canvas
    const viewport = document.getElementById('slideViewport');
    if (viewport) {
      viewport.className = 'slide-viewport ' + e.target.value;
      setTimeout(() => viewport.className = 'slide-viewport', 800);
    }
  });
}

// RENDER SLIDE THUMBNAILS IN RIGHT PANEL
window.renderSlideThumbnails = function() {
  const container = document.getElementById('slidesListContainer');
  if (!container) return;

  container.innerHTML = '';

  window.deck.slides.forEach((slide, idx) => {
    const card = document.createElement('div');
    card.className = `slide-thumbnail-card ${idx === window.deck.currentSlideIndex ? 'active' : ''}`;
    
    // Slide Number Badge
    const badge = document.createElement('div');
    badge.className = 'slide-number-badge';
    badge.innerText = `${idx + 1}`;
    card.appendChild(badge);

    // Mini preview
    const preview = document.createElement('div');
    preview.className = 'slide-thumb-preview';
    preview.style.backgroundColor = slide.background || '#ffffff';

    // Find first text element to preview title
    const firstText = slide.elements.find(el => el.type === 'text');
    if (firstText && firstText.content) {
      const titleSpan = document.createElement('div');
      titleSpan.style.fontWeight = '700';
      titleSpan.style.color = '#333';
      titleSpan.style.fontSize = '9px';
      titleSpan.style.lineHeight = '1.2';
      titleSpan.style.overflow = 'hidden';
      titleSpan.style.textOverflow = 'ellipsis';
      titleSpan.style.maxHeight = '30px';
      titleSpan.innerText = firstText.content.split('\n')[0].substring(0, 30);
      preview.appendChild(titleSpan);
    } else {
      preview.innerHTML = `<span style="opacity:0.4;">Slide ${idx + 1}</span>`;
    }

    card.appendChild(preview);

    card.addEventListener('click', () => {
      window.deck.selectSlide(idx);
    });

    container.appendChild(card);
  });
};

window.updateStatusBar = function() {
  const statusSlide = document.getElementById('statusSlideCounter');
  if (statusSlide) {
    statusSlide.innerText = `Slide ${window.deck.currentSlideIndex + 1} of ${window.deck.slides.length}`;
  }
};

// LEFT QUICK TOOLBAR ACTION WIRING
function initLeftQuickToolbar() {
  document.getElementById('btnQuickNewSlide')?.addEventListener('click', () => window.deck.addSlide());
  document.getElementById('btnQuickAddText')?.addEventListener('click', () => addTextBox());
  document.getElementById('btnQuickAddShape')?.addEventListener('click', () => addShape('rectangle'));
  document.getElementById('btnQuickDraw')?.addEventListener('click', () => {
    // Switch to Draw tab
    document.querySelector('.ribbon-tab[data-tab="draw"]')?.click();
  });
  document.getElementById('btnQuickPresent')?.addEventListener('click', () => window.startPresentation(false));
}

// FORMATTING & ELEMENT ACTIONS
function getSelectedElementData() {
  if (!window.deck.selectedElementId) return null;
  return window.deck.getCurrentSlide().elements.find(el => el.id === window.deck.selectedElementId);
}

function applyStyleToSelected(styleObj) {
  const data = getSelectedElementData();
  if (!data) return;
  if (!data.styles) data.styles = {};
  Object.assign(data.styles, styleObj);

  const elNode = document.getElementById(data.id);
  if (elNode) {
    const textDiv = elNode.querySelector('.text-box-content');
    if (textDiv) Object.assign(textDiv.style, styleObj);
    else Object.assign(elNode.style, styleObj);
  }
  window.renderSlideThumbnails();
}

window.toggleBold = function() {
  const data = getSelectedElementData();
  const current = data?.styles?.fontWeight;
  applyStyleToSelected({ fontWeight: current === '700' || current === 'bold' ? '400' : '700' });
};

window.toggleItalic = function() {
  const data = getSelectedElementData();
  const current = data?.styles?.fontStyle;
  applyStyleToSelected({ fontStyle: current === 'italic' ? 'normal' : 'italic' });
};

window.toggleUnderline = function() {
  const data = getSelectedElementData();
  const current = data?.styles?.textDecoration;
  applyStyleToSelected({ textDecoration: current === 'underline' ? 'none' : 'underline' });
};

window.setTextAlign = function(align) {
  applyStyleToSelected({ textAlign: align });
};

window.changeFontSize = function(delta) {
  const data = getSelectedElementData();
  const current = parseInt(data?.styles?.fontSize) || 24;
  const newSize = Math.max(8, current + delta);
  applyStyleToSelected({ fontSize: newSize + 'px' });
  const input = document.getElementById('fontSizeInput');
  if (input) input.value = newSize;
};

window.setTextColor = function(color) {
  applyStyleToSelected({ color: color });
};

window.setTextBgColor = function(color) {
  applyStyleToSelected({ backgroundColor: color });
};

window.setSlideBackground = function(color) {
  window.deck.getCurrentSlide().background = color;
  window.renderSlideCanvas();
  window.renderSlideThumbnails();
};

// ADD ELEMENTS
window.addTextBox = function() {
  const id = 'el_text_' + Date.now();
  const newEl = {
    id: id,
    type: 'text',
    content: 'Type your text here...',
    x: 200,
    y: 180,
    width: 400,
    height: 100,
    rotate: 0,
    animation: 'anim-fade-in-up',
    styles: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '28px',
      color: '#242424',
      backgroundColor: 'transparent'
    }
  };
  window.deck.getCurrentSlide().elements.push(newEl);
  window.deck.selectedElementId = id;
  window.renderSlideCanvas();
  window.renderSlideThumbnails();
};

window.addShape = function(shapeType) {
  const id = 'el_shape_' + Date.now();
  const newEl = {
    id: id,
    type: 'shape',
    shapeType: shapeType,
    x: 350,
    y: 160,
    width: 220,
    height: 180,
    rotate: 0,
    animation: 'anim-zoom-in',
    styles: {
      fill: '#d83b01',
      stroke: 'transparent',
      strokeWidth: 0
    }
  };
  window.deck.getCurrentSlide().elements.push(newEl);
  window.deck.selectedElementId = id;
  window.renderSlideCanvas();
  window.renderSlideThumbnails();
};

window.addImageFromUrl = function() {
  const url = prompt("Enter Image URL (e.g. Unsplash or direct web link):");
  if (!url) return;
  insertImageElement(url);
};

window.handleImageUpload = function(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    insertImageElement(e.target.result);
  };
  reader.readAsDataURL(file);
};

function insertImageElement(src) {
  const id = 'el_img_' + Date.now();
  const newEl = {
    id: id,
    type: 'image',
    content: src,
    x: 250,
    y: 120,
    width: 460,
    height: 300,
    rotate: 0,
    animation: 'anim-zoom-in',
    styles: {}
  };
  window.deck.getCurrentSlide().elements.push(newEl);
  window.deck.selectedElementId = id;
  window.renderSlideCanvas();
  window.renderSlideThumbnails();
}

window.deleteSelectedElement = function() {
  if (!window.deck.selectedElementId) return;
  const current = window.deck.getCurrentSlide();
  current.elements = current.elements.filter(el => el.id !== window.deck.selectedElementId);
  window.deck.selectedElementId = null;
  window.renderSlideCanvas();
  window.renderSlideThumbnails();
};

// DRAWING TOGGLE
window.toggleDrawingMode = function(enabled, tool = 'pen') {
  isDrawingMode = enabled;
  drawTool = tool;
  const canvas = document.getElementById('drawingCanvas');
  if (canvas) {
    canvas.classList.toggle('active', enabled);
  }
};

window.setDrawColor = function(color) {
  drawColor = color;
};

window.setDrawSize = function(size) {
  drawSize = parseInt(size);
};

window.clearSlideDrawings = function() {
  window.deck.getCurrentSlide().drawingData = null;
  const canvas = document.getElementById('drawingCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  window.renderSlideThumbnails();
};

// KEYBOARD SHORTCUTS
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // If typing inside contenteditable or input, ignore global shortcuts
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      window.deleteSelectedElement();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      window.savePresentationFile();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
      e.preventDefault();
      window.deck.addSlide();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      window.deck.duplicateCurrentSlide();
    }
  });

  // Presentation title edit
  const titleInput = document.getElementById('presentationTitle');
  if (titleInput) {
    titleInput.addEventListener('input', (e) => {
      window.deck.presentationTitle = e.target.value;
    });
  }
}
