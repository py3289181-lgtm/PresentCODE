// PresentCode - Export, Import & Standalone HTML Generation

window.savePresentationFile = function() {
  const data = {
    title: window.deck.presentationTitle,
    createdAt: new Date().toISOString(),
    slides: window.deck.slides
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (window.deck.presentationTitle.replace(/[^a-zA-Z0-9_-]/g, '_') || 'presentation') + '.present';
  a.click();
  URL.revokeObjectURL(url);
};

window.loadPresentationFile = function(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.slides && Array.isArray(data.slides)) {
        window.deck.slides = data.slides;
        window.deck.currentSlideIndex = 0;
        window.deck.presentationTitle = data.title || 'Loaded Presentation';
        
        const titleInput = document.getElementById('presentationTitle');
        if (titleInput) titleInput.value = window.deck.presentationTitle;
        
        window.deck.render();
        alert('Presentation loaded successfully! 🎉');
      } else {
        alert('Invalid presentation file format.');
      }
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    }
  };
  reader.readAsText(file);
};

window.exportStandaloneHTML = function() {
  const title = window.deck.presentationTitle || 'PresentCode Slide Deck';
  const slidesJson = JSON.stringify(window.deck.slides);

  // Self-contained standalone HTML presentation!
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - PresentCode</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;600&family=Playfair+Display:wght@700&family=Bebas+Neue&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#000; font-family:'Segoe UI',sans-serif; height:100vh; overflow:hidden; display:flex; align-items:center; justify-content:center; }
    #stage { width:100vw; height:56.25vw; max-height:100vh; max-width:177.78vh; position:relative; overflow:hidden; background:#fff; }
    .controls { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(20,20,20,0.8); backdrop-filter:blur(6px); color:#fff; border-radius:30px; padding:8px 20px; display:flex; gap:16px; align-items:center; z-index:9999; font-size:14px; opacity:0.2; transition:opacity 0.2s; }
    .controls:hover { opacity:1; }
    .btn { background:none; border:none; color:#fff; font-size:20px; cursor:pointer; }
    /* Slide transitions */
    @keyframes transFade { from { opacity:0; } to { opacity:1; } }
    .trans-fade { animation: transFade 0.6s ease; }
    @keyframes transPushLeft { from { transform:translateX(100%); } to { transform:translateX(0); } }
    .trans-push-left { animation: transPushLeft 0.5s ease; }
    @keyframes transZoomIn { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }
    .trans-zoom-in { animation: transZoomIn 0.5s ease; }
  </style>
</head>
<body>
  <div id="stage"></div>
  <div class="controls">
    <button class="btn" onclick="prev()">❮</button>
    <span id="counter">1 / 1</span>
    <button class="btn" onclick="next()">❯</button>
    <button class="btn" onclick="toggleFullscreen()">⛶</button>
  </div>
  <script>
    const slides = ${slidesJson};
    let currentIdx = 0;
    const stage = document.getElementById('stage');
    const counter = document.getElementById('counter');

    function render() {
      const s = slides[currentIdx];
      if (!s) return;
      stage.innerHTML = '';
      stage.style.backgroundColor = s.background || '#ffffff';
      stage.className = s.transition || 'trans-fade';
      counter.innerText = (currentIdx + 1) + ' / ' + slides.length;

      (s.elements || []).forEach(el => {
        const d = document.createElement('div');
        d.style.position = 'absolute';
        d.style.left = ((el.x / 960) * 100) + '%';
        d.style.top = ((el.y / 540) * 100) + '%';
        d.style.width = ((el.width / 960) * 100) + '%';
        d.style.height = ((el.height / 540) * 100) + '%';
        if (el.rotate) d.style.transform = 'rotate(' + el.rotate + 'deg)';
        if (el.type === 'text') {
          const t = document.createElement('div');
          t.innerText = el.content;
          if (el.styles) Object.assign(t.style, el.styles);
          const baseSize = parseInt(el.styles?.fontSize) || 24;
          t.style.fontSize = 'calc(' + baseSize + 'px * (100vw / 960))';
          d.appendChild(t);
        } else if (el.type === 'image') {
          const img = document.createElement('img');
          img.src = el.content;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          d.appendChild(img);
        }
        stage.appendChild(d);
      });

      if (s.drawingData) {
        const dimg = document.createElement('img');
        dimg.src = s.drawingData;
        dimg.style.position = 'absolute';
        dimg.style.top = '0';
        dimg.style.left = '0';
        dimg.style.width = '100%';
        dimg.style.height = '100%';
        stage.appendChild(dimg);
      }
    }

    function next() { if (currentIdx < slides.length - 1) { currentIdx++; render(); } }
    function prev() { if (currentIdx > 0) { currentIdx--; render(); } }
    function toggleFullscreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }

    window.addEventListener('keydown', e => {
      if (['ArrowRight', ' ', 'PageDown', 'n'].includes(e.key)) next();
      if (['ArrowLeft', 'PageUp', 'p'].includes(e.key)) prev();
    });

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'presentation') + '.html';
  a.click();
  URL.revokeObjectURL(url);
};

window.printSlidesToPdf = function() {
  window.print();
};
