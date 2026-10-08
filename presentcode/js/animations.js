// PresentCode - Animations & Transitions Metadata & Helpers

const ELEMENT_ANIMATIONS = [
  // Entrance (16)
  { id: 'anim-fade-in', name: 'Fade In', category: 'Entrance', icon: '✨' },
  { id: 'anim-fade-in-up', name: 'Fade In Up', category: 'Entrance', icon: '⬆️' },
  { id: 'anim-fade-in-down', name: 'Fade In Down', category: 'Entrance', icon: '⬇️' },
  { id: 'anim-fade-in-left', name: 'Fade In Left', category: 'Entrance', icon: '⬅️' },
  { id: 'anim-fade-in-right', name: 'Fade In Right', category: 'Entrance', icon: '➡️' },
  { id: 'anim-zoom-in', name: 'Zoom In', category: 'Entrance', icon: '🔍' },
  { id: 'anim-zoom-in-up', name: 'Zoom In Up', category: 'Entrance', icon: '🚀' },
  { id: 'anim-zoom-in-down', name: 'Zoom In Down', category: 'Entrance', icon: '🪂' },
  { id: 'anim-bounce-in', name: 'Bounce In', category: 'Entrance', icon: '🏀' },
  { id: 'anim-bounce-in-up', name: 'Bounce Up', category: 'Entrance', icon: '⬆️' },
  { id: 'anim-bounce-in-down', name: 'Bounce Down', category: 'Entrance', icon: '⬇️' },
  { id: 'anim-flip-in-x', name: 'Flip X', category: 'Entrance', icon: '🔄' },
  { id: 'anim-flip-in-y', name: 'Flip Y', category: 'Entrance', icon: '🔃' },
  { id: 'anim-rotate-in', name: 'Rotate In', category: 'Entrance', icon: '🌀' },
  { id: 'anim-roll-in', name: 'Roll In', category: 'Entrance', icon: '🎳' },
  { id: 'anim-light-speed', name: 'Light Speed', category: 'Entrance', icon: '⚡' },

  // Emphasis (9)
  { id: 'anim-pulse', name: 'Pulse', category: 'Emphasis', icon: '💓' },
  { id: 'anim-heartbeat', name: 'Heartbeat', category: 'Emphasis', icon: '❤️' },
  { id: 'anim-shake', name: 'Shake', category: 'Emphasis', icon: '👋' },
  { id: 'anim-swing', name: 'Swing', category: 'Emphasis', icon: '🪃' },
  { id: 'anim-tada', name: 'Tada 🎉', category: 'Emphasis', icon: '🎉' },
  { id: 'anim-wobble', name: 'Wobble', category: 'Emphasis', icon: '〰️' },
  { id: 'anim-jello', name: 'Jello', category: 'Emphasis', icon: '🍮' },
  { id: 'anim-rubber-band', name: 'Rubber Band', category: 'Emphasis', icon: '🫧' },
  { id: 'anim-flash', name: 'Flash', category: 'Emphasis', icon: '💡' },

  // Exit (7)
  { id: 'anim-fade-out', name: 'Fade Out', category: 'Exit', icon: '💨' },
  { id: 'anim-fade-out-down', name: 'Fade Down', category: 'Exit', icon: '📉' },
  { id: 'anim-zoom-out', name: 'Zoom Out', category: 'Exit', icon: '🔎' },
  { id: 'anim-bounce-out', name: 'Bounce Out', category: 'Exit', icon: '🏀' },
  { id: 'anim-flip-out-x', name: 'Flip Out X', category: 'Exit', icon: '🔄' },
  { id: 'anim-roll-out', name: 'Roll Out', category: 'Exit', icon: '🎳' },
  { id: 'anim-hinge', name: 'Hinge Drop', category: 'Exit', icon: '🚪' }
];

const SLIDE_TRANSITIONS = [
  { id: 'trans-none', name: 'None', desc: 'Instant cut' },
  { id: 'trans-fade', name: 'Fade', desc: 'Smooth crossfade' },
  { id: 'trans-push-left', name: 'Push Left', desc: 'Pushes from right' },
  { id: 'trans-push-right', name: 'Push Right', desc: 'Pushes from left' },
  { id: 'trans-push-up', name: 'Push Up', desc: 'Pushes upwards' },
  { id: 'trans-push-down', name: 'Push Down', desc: 'Pushes downwards' },
  { id: 'trans-wipe-left', name: 'Wipe Left', desc: 'Linear left reveal' },
  { id: 'trans-wipe-right', name: 'Wipe Right', desc: 'Linear right reveal' },
  { id: 'trans-zoom-in', name: 'Zoom In', desc: 'Zooms into view' },
  { id: 'trans-zoom-out', name: 'Zoom Out', desc: 'Zooms out into view' },
  { id: 'trans-flip-h', name: '3D Flip H', desc: '3D Horizontal card flip' },
  { id: 'trans-flip-v', name: '3D Flip V', desc: '3D Vertical card flip' },
  { id: 'trans-circle-reveal', name: 'Circle Reveal', desc: 'Radial iris expansion' },
  { id: 'trans-diamond', name: 'Diamond Mask', desc: 'Geometric diamond wipe' },
  { id: 'trans-split-h', name: 'Split Horizontal', desc: 'Opens like elevator doors' },
  { id: 'trans-split-v', name: 'Split Vertical', desc: 'Opens top & bottom' },
  { id: 'trans-swirl', name: 'Swirl Rotate', desc: 'Rotates & zooms in' }
];

function applyElementAnimation(el, animClass) {
  if (!el) return;
  // Clear any existing animation classes
  ELEMENT_ANIMATIONS.forEach(a => el.classList.remove(a.id));
  if (animClass && animClass !== 'none') {
    void el.offsetWidth; // Trigger reflow
    el.classList.add(animClass);
  }
}
