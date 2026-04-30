// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initializeTheme();
  
  // Initialize language
  updatePageLanguage();
  
  // Initialize event listeners
  initializeEventListeners();
  loadImages();
  
  // Setup language selector
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.value = getCurrentLanguage();
    languageSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      loadImages(); // Reload to update translations
    });
  }
  
  // Setup theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});

function initializeEventListeners() {
  // Preview logo
  const logoInput = document.getElementById('logo-input');
  if (logoInput) {
    logoInput.addEventListener('change', function(e) {
      previewImage(e, 'logo');
    });
  }

  // Preview profile image
  const profileInput = document.getElementById('profile-input');
  if (profileInput) {
    profileInput.addEventListener('change', function(e) {
      previewImage(e, 'profile');
    });
  }

  // Preview project image
  const projectInput = document.getElementById('project-input');
  if (projectInput) {
    projectInput.addEventListener('change', function(e) {
      previewImage(e, 'project');
    });
  }

  // Upload logo
  const logoForm = document.getElementById('logo-form');
  if (logoForm) {
    logoForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleUpload('logo');
    });
  }

  // Upload profile image
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleUpload('profile');
    });
  }

  // Upload project image
  const projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleUpload('project');
    });
  }
}

function previewImage(event, type) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(`${type}-preview-img`);
      const preview = document.getElementById(`${type}-preview`);
      if (img) img.src = e.target.result;
      if (preview) preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

async function handleUpload(type) {
  const fileInput = document.getElementById(`${type}-input`);
  const file = fileInput.files[0];
  
  if (!file) {
    showMessage(`${type}-message`, 'Please select a file', 'error');
    return;
  }

  let projectName = '';
  if (type === 'project') {
    projectName = document.getElementById('project-name').value;
    if (!projectName) {
      showMessage('project-message', 'Please enter project name', 'error');
      return;
    }
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', type);
  if (projectName) {
    formData.append('name', projectName);
  }

  await uploadImage(formData, `${type}-message`, `${type}-form`);
}

async function uploadImage(formData, messageId, formId) {
  try {
    console.log('Uploading image...');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      showMessage(messageId, t('upload_success') + ' ' + (result.path || ''), 'success');
      const formEl = document.getElementById(formId);
      if (formEl) formEl.reset();
      
      // Hide previews
      document.querySelectorAll('[id$="-preview"]').forEach(el => {
        el.classList.add('hidden');
      });
      
      // Reload images gallery
      loadImages();
    } else {
      showMessage(messageId, result.error || t('upload_error'), 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showMessage(messageId, t('upload_error') + ': ' + error.message, 'error');
  }
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <p class="${type === 'success' ? 'text-green-600' : 'text-red-600'} font-semibold">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </p>
  `;
  
  setTimeout(() => {
    element.innerHTML = '';
  }, 5000);
}

async function loadImages() {
  try {
    const response = await fetch('/api/images');
    const images = await response.json();
    
    const gallery = document.getElementById('images-gallery');
    if (!gallery) return;
    
    if (images.length === 0) {
      gallery.innerHTML = `<p class="text-gray-600 col-span-full text-center py-8" data-i18n="upload_no_images">${t('upload_no_images')}</p>`;
      return;
    }

    gallery.innerHTML = images.map(img => `
      <div class="border rounded-lg p-2 relative">
        <img src="${img.file_path}" alt="${img.type}" class="w-full h-32 object-cover rounded mb-2" onerror="this.src='https://via.placeholder.com/300x200?text=Error'">
        <p class="text-sm font-semibold capitalize">${img.type}</p>
        <p class="text-xs text-gray-600 truncate">${img.original_name}</p>
        <p class="text-xs text-blue-600 mt-1 font-mono break-all">${img.file_path}</p>
        <button onclick="deleteImage('${img.filename}')" class="text-red-600 text-sm mt-2 hover:underline">
          <i class="fas fa-trash"></i> <span data-i18n="upload_delete">${t('upload_delete')}</span>
        </button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading images:', error);
    const gallery = document.getElementById('images-gallery');
    if (gallery) {
      gallery.innerHTML = '<p class="text-red-600 col-span-full text-center py-8">Error loading images</p>';
    }
  }
}

async function deleteImage(filename) {
  if (!confirm(t('upload_delete_confirm'))) return;

  try {
    const response = await fetch(`/api/images/${filename}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadImages();
      showMessage('logo-message', t('upload_delete_success'), 'success');
    } else {
      showMessage('logo-message', t('upload_delete_error'), 'error');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    showMessage('logo-message', t('upload_delete_error'), 'error');
  }
}

// Make deleteImage available globally
window.deleteImage = deleteImage;