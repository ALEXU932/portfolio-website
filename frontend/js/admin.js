// Initialize admin page behavior when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication first
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;
  
  // Initialize theme
  initializeTheme();
  
  // Initialize language
  updatePageLanguage();
  
  // Load projects
  loadProjects();
  
  // Setup logout
  setupLogout();

  // Setup language selector
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.value = getCurrentLanguage();
    languageSelector.addEventListener('change', (e) => {
      setLanguage(e.target.value);
      loadProjects(); // Reload to update translations
    });
  }
  
  // Setup theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Preview image when URL is entered
  const imageUrlInput = document.getElementById('image_url');
  if (imageUrlInput) {
    imageUrlInput.addEventListener('input', function(e) {
      const url = e.target.value;
      const previewImg = document.getElementById('preview-img');
      const imagePreview = document.getElementById('image-preview');
      if (url && url.trim() !== '') {
        if (previewImg) previewImg.src = url;
        if (imagePreview) imagePreview.classList.remove('hidden');
      } else {
        if (imagePreview) imagePreview.classList.add('hidden');
      }
    });
  }

  // Handle project form submission
  const projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const projectData = {
        title: formData.get('title'),
        description: formData.get('description'),
        technologies: formData.get('technologies'),
        github_url: formData.get('github_url') || null,
        live_url: formData.get('live_url') || null,
        image_url: formData.get('image_url') || null
      };

      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });

        if (response.status === 401) {
          window.location.href = '/admin-login.html';
          return;
        }

        const result = await response.json();

        if (response.ok) {
          showMessage(t('admin_success'), 'success');
          e.target.reset();
          const imagePreview = document.getElementById('image-preview');
          if (imagePreview) imagePreview.classList.add('hidden');
          loadProjects();
        } else {
          showMessage(result.error || 'Failed to add project', 'error');
        }
      } catch (error) {
        showMessage('Error: ' + error.message, 'error');
      }
    });
  }

  // Close modal when clicking outside
  const imageModal = document.getElementById('image-modal');
  if (imageModal) {
    imageModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeImageSelector();
      }
    });
  }
});

// Check authentication
async function checkAuth() {
  try {
    const response = await fetch('/api/admin/check-auth');
    const data = await response.json();
    
    if (!data.authenticated) {
      window.location.href = '/admin-login.html';
      return false;
    }
    return true;
  } catch (error) {
    window.location.href = '/admin-login.html';
    return false;
  }
}

// Setup logout
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin-login.html';
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  }
}

// Load all projects
async function loadProjects() {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    const container = document.getElementById('projects-list');
    if (!container) return;
    
    if (projects.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
          <i class="fas fa-folder-open text-4xl mb-2"></i>
          <p data-i18n="admin_no_projects">${t('admin_no_projects')}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = projects.map(project => `
      <div class="border rounded-lg p-4 hover:shadow-md transition">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg">${escapeHtml(project.title)}</h3>
          <button 
            onclick="deleteProject(${project.id}, '${escapeHtml(project.title)}')" 
            class="text-red-600 hover:text-red-800"
            title="${t('admin_delete')}"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
        
        ${project.image_url ? `
          <img src="${project.image_url}" alt="${escapeHtml(project.title)}" class="w-full h-32 object-cover rounded mb-2">
        ` : ''}
        
        <p class="text-gray-700 text-sm mb-2">${escapeHtml(project.description)}</p>
        
        <div class="flex flex-wrap gap-1 mb-2">
          ${(project.technologies || '').split(',').map(tech => 
            `<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${escapeHtml(tech.trim())}</span>`
          ).join('')}
        </div>
        
        <div class="flex gap-3 text-sm">
          ${project.github_url ? `
            <a href="${project.github_url}" target="_blank" class="text-blue-600 hover:underline">
              <i class="fab fa-github"></i> ${t('projects_code')}
            </a>
          ` : ''}
          ${project.live_url ? `
            <a href="${project.live_url}" target="_blank" class="text-blue-600 hover:underline">
              <i class="fas fa-external-link-alt"></i> ${t('projects_live')}
            </a>
          ` : ''}
        </div>
        
        <p class="text-xs text-gray-500 mt-2">
          <span data-i18n="admin_added">${t('admin_added')}</span> ${new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    const container = document.getElementById('projects-list');
    if (container) {
      container.innerHTML = `
        <div class="text-center text-red-500 py-8">
          <i class="fas fa-exclamation-circle text-4xl mb-2"></i>
          <p>${t('projects_error')}</p>
        </div>
      `;
    }
  }
}

// Delete project
async function deleteProject(id, title) {
  if (!confirm(`${t('admin_delete_confirm')} "${title}"?`)) return;

  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    });

    if (response.status === 401) {
      window.location.href = '/admin-login.html';
      return;
    }

    if (response.ok) {
      showMessage(t('admin_delete_success'), 'success');
      loadProjects();
    } else {
      const result = await response.json();
      showMessage(result.error || 'Failed to delete project', 'error');
    }
  } catch (error) {
    showMessage('Error: ' + error.message, 'error');
  }
}

// Show message
function showMessage(message, type) {
  const messageDiv = document.getElementById('form-message');
  if (!messageDiv) return;
  
  messageDiv.innerHTML = `
    <div class="p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    messageDiv.innerHTML = '';
  }, 5000);
}

// Open image selector modal
async function openImageSelector() {
  try {
    const response = await fetch('/api/images/type/project');
    
    if (response.status === 401) {
      window.location.href = '/admin-login.html';
      return;
    }
    
    const images = await response.json();
    
    const modal = document.getElementById('image-modal');
    const container = document.getElementById('modal-images');
    
    if (!modal || !container) return;
    
    if (images.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center text-gray-500 py-8">
          <i class="fas fa-images text-4xl mb-2"></i>
          <p data-i18n="admin_no_images">${t('admin_no_images')}</p>
          <a href="/upload.html" class="text-blue-600 hover:underline" data-i18n="admin_upload_first">${t('admin_upload_first')}</a>
        </div>
      `;
    } else {
      container.innerHTML = images.map(img => `
        <div 
          class="cursor-pointer border-2 border-transparent hover:border-blue-600 rounded-lg overflow-hidden"
          onclick="selectImage('${img.file_path}')"
        >
          <img src="${img.file_path}" alt="${img.original_name}" class="w-full h-32 object-cover">
          <p class="text-xs p-2 text-center truncate">${img.original_name}</p>
        </div>
      `).join('');
    }
    
    modal.classList.remove('hidden');
  } catch (error) {
    console.error('Error loading images:', error);
    alert('Error loading images. Please try again.');
  }
}

// Close image selector modal
function closeImageSelector() {
  const modal = document.getElementById('image-modal');
  if (modal) modal.classList.add('hidden');
}

// Select image from modal
function selectImage(path) {
  const imageUrlEl = document.getElementById('image_url');
  const previewImg = document.getElementById('preview-img');
  const imagePreview = document.getElementById('image-preview');
  
  if (imageUrlEl) imageUrlEl.value = path;
  if (previewImg) previewImg.src = path;
  if (imagePreview) imagePreview.classList.remove('hidden');
  
  closeImageSelector();
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally
window.deleteProject = deleteProject;
window.openImageSelector = openImageSelector;
window.closeImageSelector = closeImageSelector;
window.selectImage = selectImage;