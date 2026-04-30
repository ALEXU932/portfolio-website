// Typing Animation
const typedText = document.getElementById('typed-text');
const words = ['Frontend Developer', 'Web Designer', 'UI/UX Enthusiast', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Get translated words for typing animation
function getTypingWords() {
  const lang = getCurrentLanguage();
  return [
    t('role_frontend', lang),
    t('role_designer', lang),
    t('role_ux', lang)
  ];
}

function typeEffect() {
  if (!typedText) return;

  const currentWords = getTypingWords();
  const currentWord = currentWords[wordIndex];

  if (isDeleting) {
    typedText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % currentWords.length;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? 100 : 200);
  }
}

// Restart typing animation when language changes
function restartTypingAnimation() {
  charIndex = 0;
  wordIndex = 0;
  isDeleting = false;
  if (typedText) {
    typedText.textContent = '';
    setTimeout(typeEffect, 500);
  }
}

// Start typing animation
if (typedText) {
  setTimeout(typeEffect, 1000);
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .hover-lift, .glass-effect').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Active Navigation Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Scroll Animations for Fade In Elements
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger-container').forEach(el => {
  observer.observe(el);
});

// Animate skill bars when they come into view
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');

  skillBars.forEach(bar => {
    const targetPercent = parseInt(bar.dataset.percent);
    const percentElement = document.getElementById(bar.dataset.skillId);
    let currentPercent = 0;

    // Animate the bar width
    bar.style.width = targetPercent + '%';

    // Animate the percentage number
    const interval = setInterval(() => {
      if (currentPercent < targetPercent) {
        currentPercent++;
        if (percentElement) {
          percentElement.textContent = currentPercent;
        }
      } else {
        clearInterval(interval);
      }
    }, 20);
  });
}

// Intersection Observer for skill section
const skillSection = document.getElementById('skills');
let skillsAnimated = false;

if (skillSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        // Reset all bars to 0 first
        document.querySelectorAll('.skill-progress').forEach(bar => {
          bar.style.width = '0%';
        });
        document.querySelectorAll('[id$="-percent"]').forEach(el => {
          el.textContent = '0';
        });

        // Small delay before animation starts
        setTimeout(() => {
          animateSkillBars();
        }, 300);

        skillsAnimated = true;
      }
    });
  }, { threshold: 0.3 });

  skillObserver.observe(skillSection);
}

// Reset animation when page is refreshed
window.addEventListener('beforeunload', () => {
  skillsAnimated = false;
});

// Particles Background
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  // Clear existing particles
  particlesContainer.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 5 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = `particle ${Math.random() * 10 + 10}s linear infinite`;
    particle.style.animationDelay = Math.random() * 5 + 's';

    particlesContainer.appendChild(particle);
  }
}

// Load logo - FIXED for new logo structure
async function loadLogo() {
  try {
    const response = await fetch('/api/logo');
    const data = await response.json();

    // Update the logo image inside the circle
    const logoImage = document.getElementById('logo-image');
    if (logoImage && data.success && data.path) {
      logoImage.src = data.path;
      logoImage.onerror = function () {
        console.log('Logo failed to load, using fallback');
        this.src = 'https://via.placeholder.com/100/1f242d/00eeff?text=TB';
        this.style.display = 'block';
      };
      logoImage.style.display = 'block';
    } else if (logoImage) {
      // Use fallback if no logo found
      logoImage.src = 'https://via.placeholder.com/100/1f242d/00eeff?text=TB';
    }
  } catch (error) {
    console.error('Error loading logo:', error);
    // Use fallback on error
    const logoImage = document.getElementById('logo-image');
    if (logoImage) {
      logoImage.src = 'https://via.placeholder.com/100/1f242d/00eeff?text=TB';
    }
  }
}

// Load profile image
async function loadProfileImage() {
  try {
    const response = await fetch('/api/profile');
    const data = await response.json();

    const heroImage = document.getElementById('profile-image');
    if (heroImage && data.success && data.path) {
      heroImage.src = data.path;
      heroImage.onerror = function () {
        console.error('Error loading hero profile image');
        this.src = 'https://via.placeholder.com/400';
      };
    }

    const aboutImage = document.getElementById('about-image');
    if (aboutImage && data.success && data.path) {
      aboutImage.src = data.path;
      aboutImage.onerror = function () {
        console.error('Error loading about profile image');
        this.src = 'https://via.placeholder.com/400';
      };
    }
  } catch (error) {
    console.error('Error loading profile image:', error);
  }
}

// Load profile name from database (optional)
async function loadProfileName() {
  try {
    // You can add an API endpoint to get profile name if needed
    const profileNameElement = document.getElementById('profile-name');
    if (profileNameElement) {
      // For now, it's static, but you can fetch from API
      // const response = await fetch('/api/profile/name');
      // const data = await response.json();
      // profileNameElement.textContent = data.name;
    }
  } catch (error) {
    console.error('Error loading profile name:', error);
  }
}

// Load projects
async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();

    const container = document.getElementById('projects-container');
    if (!container) return;

    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center text-gray-400 py-12">
          <i class="fas fa-folder-open text-4xl mb-2"></i>
          <p data-i18n="projects_no_projects">${t('projects_no_projects')}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = projects.map(project => {
      const description = project.description || '';
      const truncatedDescription = description.length > 100
        ? description.substring(0, 100) + '...'
        : description;

      return `
        <div class="glass-effect rounded-xl overflow-hidden hover-lift">
          <img src="${project.image_url || 'https://via.placeholder.com/400x250'}" 
               alt="${escapeHtml(project.title)}" 
               class="w-full h-48 object-cover"
               onerror="this.src='https://via.placeholder.com/400x250'">
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2 text-gradient">${escapeHtml(project.title)}</h3>
            <p class="text-gray-400 mb-4">${escapeHtml(truncatedDescription)}</p>
            <p class="text-sm text-gray-500 mb-4">
              <span class="text-[#00eeff]" data-i18n="projects_tech">${t('projects_tech')}</span> ${escapeHtml(project.technologies || '')}
            </p>
            <div class="flex gap-4">
              ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="text-[#00eeff] hover:text-white transition"><i class="fab fa-github"></i> <span data-i18n="projects_code">${t('projects_code')}</span></a>` : ''}
              ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="text-[#00eeff] hover:text-white transition"><i class="fas fa-external-link-alt"></i> <span data-i18n="projects_live">${t('projects_live')}</span></a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    const container = document.getElementById('projects-container');
    if (container) {
      container.innerHTML = `
        <div class="col-span-full text-center text-red-500 py-12">
          <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
          <p data-i18n="projects_error">${t('projects_error')}</p>
        </div>
      `;
    }
  }
}

// ==================== FILE ATTACHMENT HANDLING ====================
const attachmentInput = document.getElementById('attachment-input');
const filePreviewList = document.getElementById('file-preview-list');
const fileDropZone = document.getElementById('file-drop-zone');
let selectedFiles = [];

const ALLOWED_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg', 'image/png', 'video/mp4'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

function getFileIcon(type) {
  if (type === 'application/pdf') return 'fa-file-pdf text-red-400';
  if (type.includes('word')) return 'fa-file-word text-blue-400';
  if (type.startsWith('image/')) return 'fa-file-image text-green-400';
  if (type.startsWith('video/')) return 'fa-file-video text-purple-400';
  return 'fa-file text-gray-400';
}

function renderFileList() {
  if (!filePreviewList) return;

  // Clear existing content
  filePreviewList.innerHTML = '';

  selectedFiles.forEach((file, i) => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-3 border border-gray-700 rounded-lg p-3 text-sm';

    const isImage = file.type.startsWith('image/');

    if (isImage) {
      // Image preview thumbnail
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        img.className = 'w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-600';
        li.prepend(img);
      };
      reader.readAsDataURL(file);
    } else {
      // Icon for non-image files
      const iconWrap = document.createElement('div');
      iconWrap.className = 'w-16 h-16 flex items-center justify-center rounded-lg flex-shrink-0 border border-gray-600';
      iconWrap.innerHTML = `<i class="fas ${getFileIcon(file.type)} text-2xl"></i>`;
      li.appendChild(iconWrap);
    }

    // File info
    const info = document.createElement('div');
    info.className = 'flex-1 min-w-0';
    info.innerHTML = `
      <p class="text-gray-200 truncate font-medium">${escapeHtml(file.name)}</p>
      <p class="text-gray-500 text-xs mt-1">${(file.size / 1024).toFixed(1)} KB</p>
    `;
    li.appendChild(info);

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-red-500 transition';
    removeBtn.title = 'Remove file';
    removeBtn.innerHTML = '<i class="fas fa-times text-xs"></i>';
    removeBtn.addEventListener('click', () => removeFile(i));
    li.appendChild(removeBtn);

    filePreviewList.appendChild(li);
  });
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

function validateAndAddFiles(files) {
  const messageDiv = document.getElementById('form-message');
  for (const file of files) {
    if (selectedFiles.length >= MAX_FILES) {
      messageDiv.innerHTML = `<p class="text-red-500 text-sm">Max ${MAX_FILES} files allowed.</p>`;
      setTimeout(() => { messageDiv.innerHTML = ''; }, 4000);
      break;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      messageDiv.innerHTML = `<p class="text-red-500 text-sm">"${escapeHtml(file.name)}" is not an allowed file type.</p>`;
      setTimeout(() => { messageDiv.innerHTML = ''; }, 4000);
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      messageDiv.innerHTML = `<p class="text-red-500 text-sm">"${escapeHtml(file.name)}" exceeds 10MB limit.</p>`;
      setTimeout(() => { messageDiv.innerHTML = ''; }, 4000);
      continue;
    }
    // Avoid duplicates
    if (!selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
      selectedFiles.push(file);
    }
  }
  renderFileList();
}

if (attachmentInput) {
  attachmentInput.addEventListener('change', (e) => {
    validateAndAddFiles(Array.from(e.target.files));
    e.target.value = ''; // reset so same file can be re-added after removal
  });
}

if (fileDropZone) {
  fileDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropZone.classList.add('border-[#00eeff]');
  });
  fileDropZone.addEventListener('dragleave', () => {
    fileDropZone.classList.remove('border-[#00eeff]');
  });
  fileDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('border-[#00eeff]');
    validateAndAddFiles(Array.from(e.dataTransfer.files));
  });
}

// Handle contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rawData = new FormData(e.target);
    const formData = new FormData();
    formData.append('name', rawData.get('name'));
    formData.append('email', rawData.get('email'));
    formData.append('message', rawData.get('message'));
    formData.append('subject', rawData.get('subject') || 'Contact Form Submission');

    // Append selected files
    selectedFiles.forEach(file => formData.append('attachments', file));

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> <span>${t('contact_sending')}</span>`;
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData  // No Content-Type header — browser sets multipart boundary
      });

      const result = await response.json();
      const messageDiv = document.getElementById('form-message');

      if (response.ok) {
        messageDiv.innerHTML = `<p class="text-green-500 font-semibold">✓ ${t('contact_success')}</p>`;
        contactForm.reset();
        selectedFiles = [];
        renderFileList();
        setTimeout(() => { messageDiv.innerHTML = ''; }, 5000);
      } else {
        messageDiv.innerHTML = `<p class="text-red-500 font-semibold">✗ ${result.error || t('contact_error')}</p>`;
        setTimeout(() => { messageDiv.innerHTML = ''; }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      const messageDiv = document.getElementById('form-message');
      messageDiv.innerHTML = `<p class="text-red-500 font-semibold">✗ ${t('contact_network_error')}</p>`;
      setTimeout(() => { messageDiv.innerHTML = ''; }, 5000);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add keyframe animation for particles to stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes particle {
    from {
      transform: translateY(100vh) rotate(0deg);
    }
    to {
      transform: translateY(-100vh) rotate(360deg);
    }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();

  // Initialize language
  updatePageLanguage();

  // Load content
  loadLogo();
  loadProfileImage();
  loadProfileName();
  loadProjects();
  createParticles();

  // Add animation to profile image border
  const profileBorder = document.querySelector('.profile-border');
  if (profileBorder) {
    profileBorder.classList.add('animate-spin-slow');
  }

  // Setup language selector
  const languageSelector = document.getElementById('language-selector');
  const languageSelectorMobile = document.getElementById('language-selector-mobile');

  if (languageSelector) {
    languageSelector.value = getCurrentLanguage();
    languageSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      restartTypingAnimation();
      loadProjects();
      // Sync mobile selector
      if (languageSelectorMobile) languageSelectorMobile.value = e.target.value;
    });
  }

  if (languageSelectorMobile) {
    languageSelectorMobile.value = getCurrentLanguage();
    languageSelectorMobile.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      restartTypingAnimation();
      loadProjects();
      // Sync desktop selector
      if (languageSelector) languageSelector.value = e.target.value;
    });
  }

  // Setup theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});

// Add scroll to top button functionality (optional)
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#00eeff] text-[#1f242d] shadow-lg opacity-0 invisible transition-all duration-300 hover:scale-110 z-50';
scrollTopBtn.style.opacity = '0';
scrollTopBtn.style.visibility = 'hidden';
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.opacity = '1';
    scrollTopBtn.style.visibility = 'visible';
  } else {
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
  }
});