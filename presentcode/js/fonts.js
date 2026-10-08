// PresentCode - 50+ Google Fonts Collection
const PRESENT_FONTS = [
  // Modern Sans-Serif (24)
  { name: 'Roboto', category: 'Sans-Serif', family: "'Roboto', sans-serif" },
  { name: 'Poppins', category: 'Sans-Serif', family: "'Poppins', sans-serif" },
  { name: 'Montserrat', category: 'Sans-Serif', family: "'Montserrat', sans-serif" },
  { name: 'Inter', category: 'Sans-Serif', family: "'Inter', sans-serif" },
  { name: 'Open Sans', category: 'Sans-Serif', family: "'Open Sans', sans-serif" },
  { name: 'Lato', category: 'Sans-Serif', family: "'Lato', sans-serif" },
  { name: 'Oswald', category: 'Sans-Serif', family: "'Oswald', sans-serif" },
  { name: 'Raleway', category: 'Sans-Serif', family: "'Raleway', sans-serif" },
  { name: 'Nunito', category: 'Sans-Serif', family: "'Nunito', sans-serif" },
  { name: 'Rubik', category: 'Sans-Serif', family: "'Rubik', sans-serif" },
  { name: 'Work Sans', category: 'Sans-Serif', family: "'Work Sans', sans-serif" },
  { name: 'DM Sans', category: 'Sans-Serif', family: "'DM Sans', sans-serif" },
  { name: 'Plus Jakarta Sans', category: 'Sans-Serif', family: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Outfit', category: 'Sans-Serif', family: "'Outfit', sans-serif" },
  { name: 'Quicksand', category: 'Sans-Serif', family: "'Quicksand', sans-serif" },
  { name: 'Urbanist', category: 'Sans-Serif', family: "'Urbanist', sans-serif" },
  { name: 'Space Grotesk', category: 'Sans-Serif', family: "'Space Grotesk', sans-serif" },
  { name: 'Syne', category: 'Sans-Serif', family: "'Syne', sans-serif" },
  { name: 'Manrope', category: 'Sans-Serif', family: "'Manrope', sans-serif" },
  { name: 'Sora', category: 'Sans-Serif', family: "'Sora', sans-serif" },
  { name: 'Lexend', category: 'Sans-Serif', family: "'Lexend', sans-serif" },
  { name: 'Cabin', category: 'Sans-Serif', family: "'Cabin', sans-serif" },
  { name: 'Ubuntu', category: 'Sans-Serif', family: "'Ubuntu', sans-serif" },
  { name: 'Jost', category: 'Sans-Serif', family: "'Jost', sans-serif" },

  // Elegant Serif (14)
  { name: 'Playfair Display', category: 'Serif', family: "'Playfair Display', serif" },
  { name: 'Merriweather', category: 'Serif', family: "'Merriweather', serif" },
  { name: 'Lora', category: 'Serif', family: "'Lora', serif" },
  { name: 'PT Serif', category: 'Serif', family: "'PT Serif', serif" },
  { name: 'Cinzel', category: 'Serif', family: "'Cinzel', serif" },
  { name: 'Cormorant Garamond', category: 'Serif', family: "'Cormorant Garamond', serif" },
  { name: 'EB Garamond', category: 'Serif', family: "'EB Garamond', serif" },
  { name: 'Bodoni Moda', category: 'Serif', family: "'Bodoni Moda', serif" },
  { name: 'Crimson Text', category: 'Serif', family: "'Crimson Text', serif" },
  { name: 'Libre Baskerville', category: 'Serif', family: "'Libre Baskerville', serif" },
  { name: 'Arvo', category: 'Serif', family: "'Arvo', serif" },
  { name: 'Spectral', category: 'Serif', family: "'Spectral', serif" },
  { name: 'DM Serif Display', category: 'Serif', family: "'DM Serif Display', serif" },
  { name: 'Prata', category: 'Serif', family: "'Prata', serif" },

  // Display & Bold Titles (10)
  { name: 'Bebas Neue', category: 'Display', family: "'Bebas Neue', sans-serif" },
  { name: 'Anton', category: 'Display', family: "'Anton', sans-serif" },
  { name: 'Righteous', category: 'Display', family: "'Righteous', sans-serif" },
  { name: 'Bangers', category: 'Display', family: "'Bangers', cursive" },
  { name: 'Cinzel Decorative', category: 'Display', family: "'Cinzel Decorative', serif" },
  { name: 'Press Start 2P', category: 'Display', family: "'Press Start 2P', cursive" },
  { name: 'Bungee', category: 'Display', family: "'Bungee', cursive" },
  { name: 'Abril Fatface', category: 'Display', family: "'Abril Fatface', cursive" },
  { name: 'Lobster', category: 'Display', family: "'Lobster', cursive" },
  { name: 'Alfa Slab One', category: 'Display', family: "'Alfa Slab One', cursive" },

  // Handwritten & Script (8)
  { name: 'Pacifico', category: 'Handwriting', family: "'Pacifico', cursive" },
  { name: 'Satisfy', category: 'Handwriting', family: "'Satisfy', cursive" },
  { name: 'Caveat', category: 'Handwriting', family: "'Caveat', cursive" },
  { name: 'Dancing Script', category: 'Handwriting', family: "'Dancing Script', cursive" },
  { name: 'Great Vibes', category: 'Handwriting', family: "'Great Vibes', cursive" },
  { name: 'Kalam', category: 'Handwriting', family: "'Kalam', cursive" },
  { name: 'Sacramento', category: 'Handwriting', family: "'Sacramento', cursive" },
  { name: 'Permanent Marker', category: 'Handwriting', family: "'Permanent Marker', cursive" },

  // Monospace & Code (5)
  { name: 'JetBrains Mono', category: 'Monospace', family: "'JetBrains Mono', monospace" },
  { name: 'Fira Code', category: 'Monospace', family: "'Fira Code', monospace" },
  { name: 'Source Code Pro', category: 'Monospace', family: "'Source Code Pro', monospace" },
  { name: 'Space Mono', category: 'Monospace', family: "'Space Mono', monospace" },
  { name: 'Inconsolata', category: 'Monospace', family: "'Inconsolata', monospace" }
];

// Dynamically load Google Font on demand when selected
const loadedFonts = new Set();

function loadGoogleFont(fontName) {
  if (loadedFonts.has(fontName)) return;
  loadedFonts.add(fontName);
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&display=swap`;
  document.head.appendChild(link);
}

// Pre-load top 8 common fonts initially
['Poppins', 'Montserrat', 'Roboto', 'Playfair Display', 'Bebas Neue', 'Dancing Script', 'JetBrains Mono', 'Inter'].forEach(loadGoogleFont);
