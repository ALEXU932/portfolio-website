// Theme Management - Light/Dark Mode
const themes = {
  dark: {
    '--bg-primary': '#1f242d',
    '--bg-secondary': '#1a1f29',
    '--bg-tertiary': '#2a313c',
    '--text-primary': '#ffffff',
    '--text-secondary': '#b0b0b0',
    '--text-tertiary': '#808080',
    '--border-color': 'rgba(255, 255, 255, 0.1)',
    '--glass-bg': 'rgba(255, 255, 255, 0.05)',
    '--scrollbar-track': '#1f242d',
    '--scrollbar-thumb': '#00eeff',
    '--neon-primary': '#00eeff',
    '--neon-secondary': '#00ff88',
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--bg-tertiary': '#e0e0e0',
    '--text-primary': '#000000',
    '--text-secondary': '#4a4a4a',
    '--text-tertiary': '#6a6a6a',
    '--border-color': 'rgba(0, 0, 0, 0.1)',
    '--glass-bg': 'rgba(0, 0, 0, 0.05)',
    '--scrollbar-track': '#f5f5f5',
    '--scrollbar-thumb': '#0088cc',
    '--neon-primary': '#0088cc',
    '--neon-secondary': '#00aa66',
  }
};

// Get current theme from localStorage or default to dark
function getCurrentTheme() {
  return localStorage.getItem('portfolio_theme') || 'dark';
}

// Set theme
function setTheme(themeName) {
  localStorage.setItem('portfolio_theme', themeName);
  applyTheme(themeName);
}

// Apply theme to document
function applyTheme(themeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.keys(theme).forEach(property => {
    root.style.setProperty(property, theme[property]);
  });
  
  // Update body class
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(`theme-${themeName}`);
  
  // Update theme toggle button
  updateThemeToggle(themeName);
}

// Toggle between light and dark theme
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Update theme toggle button icon
function updateThemeToggle(themeName) {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const iconClass = themeName === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = iconClass;
    }
  }
  
  if (themeToggleMobile) {
    const icon = themeToggleMobile.querySelector('i');
    if (icon) {
      icon.className = iconClass;
    }
  }
}

// Initialize theme on page load
function initializeTheme() {
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getCurrentTheme, setTheme, toggleTheme, initializeTheme };
}
