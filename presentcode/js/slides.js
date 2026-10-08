// PresentCode - Slides Management State & Operations

class SlideDeck {
  constructor() {
    this.slides = [];
    this.currentSlideIndex = 0;
    this.selectedElementId = null;
    this.presentationTitle = 'Untitled Presentation';
    this.initDefaultDeck();
  }

  initDefaultDeck() {
    // Default Slide 1 (Matching User's sketch with "Click to add title" & "Click to add subtitle")
    const slide1 = {
      id: 'slide_' + Date.now(),
      background: '#ffffff',
      transition: 'trans-fade',
      drawingData: null,
      elements: [
        {
          id: 'el_title_' + Date.now(),
          type: 'text',
          isTitle: true,
          content: 'Click to add title',
          x: 80,
          y: 80,
          width: 800,
          height: 140,
          rotate: 0,
          animation: 'anim-fade-in-down',
          styles: {
            fontFamily: "'Poppins', sans-serif",
            fontSize: '52px',
            fontWeight: '700',
            color: '#242424',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderStyle: 'none'
          }
        },
        {
          id: 'el_sub_' + Date.now(),
          type: 'text',
          isSubtitle: true,
          content: 'Click to add subtitle',
          x: 130,
          y: 280,
          width: 700,
          height: 100,
          rotate: 0,
          animation: 'anim-fade-in-up',
          styles: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '26px',
            fontWeight: '400',
            color: '#666666',
            textAlign: 'center',
            backgroundColor: 'transparent',
            borderStyle: 'none'
          }
        }
      ]
    };

    this.slides.push(slide1);
    this.currentSlideIndex = 0;
  }

  getCurrentSlide() {
    return this.slides[this.currentSlideIndex] || this.slides[0];
  }

  addSlide(layout = 'title-content') {
    const newSlideId = 'slide_' + Date.now();
    let elements = [];

    if (layout === 'title-content') {
      elements = [
        {
          id: 'el_' + Date.now() + '_1',
          type: 'text',
          content: 'Slide Title Here',
          x: 60,
          y: 40,
          width: 840,
          height: 80,
          rotate: 0,
          animation: 'anim-fade-in-down',
          styles: {
            fontFamily: "'Poppins', sans-serif",
            fontSize: '40px',
            fontWeight: '700',
            color: '#242424',
            textAlign: 'left'
          }
        },
        {
          id: 'el_' + Date.now() + '_2',
          type: 'text',
          content: '• Point 1: Add key takeaway\n• Point 2: Present ideas clearly\n• Point 3: Customize fonts & animations',
          x: 60,
          y: 150,
          width: 840,
          height: 320,
          rotate: 0,
          animation: 'anim-fade-in-up',
          styles: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '24px',
            fontWeight: '400',
            color: '#444444',
            textAlign: 'left',
            lineHeight: '1.6'
          }
        }
      ];
    }

    const newSlide = {
      id: newSlideId,
      background: '#ffffff',
      transition: 'trans-push-left',
      drawingData: null,
      elements: elements
    };

    this.slides.splice(this.currentSlideIndex + 1, 0, newSlide);
    this.currentSlideIndex++;
    this.selectedElementId = null;
    this.render();
  }

  duplicateCurrentSlide() {
    const current = this.getCurrentSlide();
    const cloned = JSON.parse(JSON.stringify(current));
    cloned.id = 'slide_' + Date.now();
    cloned.elements.forEach(el => el.id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
    this.slides.splice(this.currentSlideIndex + 1, 0, cloned);
    this.currentSlideIndex++;
    this.render();
  }

  deleteCurrentSlide() {
    if (this.slides.length <= 1) {
      alert("A presentation must have at least one slide!");
      return;
    }
    this.slides.splice(this.currentSlideIndex, 1);
    if (this.currentSlideIndex >= this.slides.length) {
      this.currentSlideIndex = this.slides.length - 1;
    }
    this.selectedElementId = null;
    this.render();
  }

  selectSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlideIndex = index;
      this.selectedElementId = null;
      this.render();
    }
  }

  moveSlide(direction) {
    const targetIdx = this.currentSlideIndex + direction;
    if (targetIdx >= 0 && targetIdx < this.slides.length) {
      const temp = this.slides[this.currentSlideIndex];
      this.slides[this.currentSlideIndex] = this.slides[targetIdx];
      this.slides[targetIdx] = temp;
      this.currentSlideIndex = targetIdx;
      this.render();
    }
  }

  render() {
    if (window.renderSlideCanvas) window.renderSlideCanvas();
    if (window.renderSlideThumbnails) window.renderSlideThumbnails();
    if (window.updateStatusBar) window.updateStatusBar();
  }
}

// Global slide deck instance
window.deck = new SlideDeck();
