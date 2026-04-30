// Contact Messages Management
let allContacts = [];
let currentFilter = 'all';

// Show notification toast
function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existing = document.getElementById('notification-toast');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'notification-toast';
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 9999;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
  `;
  
  // Set colors based on type
  if (type === 'success') {
    notification.style.backgroundColor = '#10b981';
    notification.style.color = '#ffffff';
    notification.innerHTML = '<i class="fas fa-check-circle"></i><span>' + message + '</span>';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#ef4444';
    notification.style.color = '#ffffff';
    notification.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>' + message + '</span>';
  } else {
    notification.style.backgroundColor = '#3b82f6';
    notification.style.color = '#ffffff';
    notification.innerHTML = '<i class="fas fa-info-circle"></i><span>' + message + '</span>';
  }
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Helper to handle API responses
async function handleResponse(response) {
  if (response.status === 401) {
    window.location.href = '/admin-login.html';
    return null;
  }
  return response;
}

// Load unread count
async function loadUnreadCount() {
  try {
    const response = await fetch('/api/contacts/unread/count');
    const data = await response.json();
    const count = data.count || 0;
    
    // Update badges
    const unreadBadge = document.getElementById('unread-badge');
    const unreadBadgeTab = document.getElementById('unread-badge-tab');
    const filterUnreadCount = document.getElementById('filter-unread-count');
    
    if (unreadBadge) {
      if (count > 0) {
        unreadBadge.textContent = count;
        unreadBadge.classList.remove('hidden');
      } else {
        unreadBadge.classList.add('hidden');
      }
    }
    
    if (unreadBadgeTab) {
      if (count > 0) {
        unreadBadgeTab.textContent = count;
        unreadBadgeTab.classList.remove('hidden');
      } else {
        unreadBadgeTab.classList.add('hidden');
      }
    }
    
    if (filterUnreadCount) {
      if (count > 0) {
        filterUnreadCount.textContent = count;
        filterUnreadCount.classList.remove('hidden');
      } else {
        filterUnreadCount.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error loading unread count:', error);
  }
}

// Load all contacts
async function loadContacts() {
  console.log('loadContacts() called');
  const container = document.getElementById('contacts-list');
  
  if (!container) {
    console.error('contacts-list container not found!');
    return;
  }
  
  // Show loading state
  container.innerHTML = `
    <div class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
      <p class="text-gray-600">Loading messages...</p>
    </div>
  `;
  
  try {
    const response = await fetch('/api/contacts');
    
    if (!(await handleResponse(response))) return;
    
    allContacts = await response.json();
    console.log('Loaded contacts:', allContacts);
    
    displayContacts(currentFilter);
    loadUnreadCount();
  } catch (error) {
    console.error('Error loading contacts:', error);
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <p class="text-red-500">Error loading messages. Please try again.</p>
        <p class="text-sm text-gray-500 mt-2">${error.message}</p>
      </div>
    `;
  }
}

// Display contacts based on filter
function displayContacts(filter) {
  console.log('displayContacts called with filter:', filter);
  currentFilter = filter;
  
  const container = document.getElementById('contacts-list');
  if (!container) return;
  
  let filteredContacts = allContacts;
  if (filter !== 'all') {
    filteredContacts = allContacts.filter(contact => contact.status === filter);
  }
  
  if (filteredContacts.length === 0) {
    let emptyMessage = 'No contact messages yet.';
    if (filter === 'unread') emptyMessage = 'No unread messages.';
    if (filter === 'read') emptyMessage = 'No read messages.';
    if (filter === 'replied') emptyMessage = 'No replied messages.';
    
    container.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500">${emptyMessage}</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  filteredContacts.forEach(contact => {
    html += createContactCard(contact);
  });
  
  container.innerHTML = html;
}

// Create contact card HTML with Tailwind classes
function createContactCard(contact) {
  const date = new Date(contact.created_at).toLocaleString();
  
  // Status styles
  let statusClasses = '';
  let borderClass = '';
  
  switch(contact.status) {
    case 'unread':
      statusClasses = 'bg-blue-100 text-blue-800';
      borderClass = 'border-l-4 border-l-blue-600';
      break;
    case 'read':
      statusClasses = 'bg-gray-100 text-gray-800';
      borderClass = '';
      break;
    case 'replied':
      statusClasses = 'bg-green-100 text-green-800';
      borderClass = 'border-l-4 border-l-green-600';
      break;
  }
  
  const statusText = contact.status.charAt(0).toUpperCase() + contact.status.slice(1);
  
  return `
    <div class="contact-card ${borderClass} bg-white border border-gray-200 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-all">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <h3 class="text-lg font-bold text-gray-900">${escapeHtml(contact.name)}</h3>
            <span class="status-badge ${statusClasses} px-3 py-1 rounded-full text-xs font-semibold">${statusText}</span>
          </div>
          
          <p class="text-sm text-gray-600 mb-2">
            <i class="fas fa-envelope mr-2 text-gray-400"></i>
            ${escapeHtml(contact.email)}
          </p>
          
          ${contact.subject ? `
            <p class="text-sm text-gray-600 mb-2">
              <i class="fas fa-tag mr-2 text-gray-400"></i>
              ${escapeHtml(contact.subject)}
            </p>
          ` : ''}
          
          <p class="text-xs text-gray-500">
            <i class="fas fa-clock mr-2"></i>
            ${date}
          </p>
        </div>
        
        <div class="flex gap-2">
          <button onclick="toggleContactDetails(${contact.id})" 
            class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition"
            title="View Details">
            <i class="fas fa-eye"></i>
          </button>
          <button onclick="deleteContact(${contact.id})" 
            class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
            title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <!-- Message Details -->
      <div id="contact-details-${contact.id}" class="hidden mt-6 pt-6 border-t border-gray-200">
        <div class="mb-6">
          <p class="font-semibold text-gray-700 mb-3">Message:</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="whitespace-pre-wrap text-gray-800">${escapeHtml(contact.message)}</p>
          </div>
        </div>
        
        ${contact.attachments ? (() => {
          try {
            const files = JSON.parse(contact.attachments);
            if (files.length === 0) return '';
            return `<div class="mb-6">
              <p class="font-semibold text-gray-700 mb-3"><i class="fas fa-paperclip mr-2 text-blue-500"></i>Attachments (${files.length}):</p>
              <div class="flex flex-wrap gap-2">
                ${files.map(fp => {
                  const name = fp.split('/').pop();
                  const ext = name.split('.').pop().toLowerCase();
                  const icon = ext === 'pdf' ? 'fa-file-pdf text-red-500' : ['jpg','jpeg','png'].includes(ext) ? 'fa-file-image text-green-500' : ext === 'mp4' ? 'fa-file-video text-purple-500' : 'fa-file-word text-blue-500';
                  return `<a href="${fp}" target="_blank" class="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition">
                    <i class="fas ${icon}"></i><span class="truncate max-w-[150px]">${escapeHtml(name)}</span>
                  </a>`;
                }).join('')}
              </div>
            </div>`;
          } catch(e) { return ''; }
        })() : ''}
        
        ${contact.admin_response ? `
          <div class="mb-6">
            <p class="font-semibold text-green-600 mb-3">
              <i class="fas fa-reply mr-2"></i>
              Your Response:
            </p>
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="whitespace-pre-wrap text-gray-800">${escapeHtml(contact.admin_response)}</p>
            </div>
          </div>
        ` : ''}
        
        ${contact.status !== 'replied' ? `
          <div class="mb-6">
            <label class="font-semibold text-gray-700 mb-3 block">Your Response:</label>
            <textarea 
              id="response-${contact.id}" 
              class="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-y"
              placeholder="Type your response here..."></textarea>
          </div>
        ` : ''}
        
        <div class="flex gap-3 flex-wrap">
          ${contact.status !== 'replied' ? `
            <button onclick="sendResponse(${contact.id})" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
              <i class="fas fa-paper-plane mr-2"></i>
              Send Response
            </button>
          ` : ''}
          
          ${contact.status === 'unread' ? `
            <button onclick="markAsRead(${contact.id})" 
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
              <i class="fas fa-check mr-2"></i>
              Mark as Read
            </button>
          ` : ''}
          
          ${contact.status !== 'unread' ? `
            <button onclick="markAsUnread(${contact.id})" 
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
              <i class="fas fa-envelope mr-2"></i>
              Mark as Unread
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Toggle contact details
function toggleContactDetails(id) {
  const details = document.getElementById(`contact-details-${id}`);
  if (details) {
    details.classList.toggle('hidden');
    
    // Mark as read when opening
    if (!details.classList.contains('hidden')) {
      const contact = allContacts.find(c => c.id === id);
      if (contact && contact.status === 'unread') {
        markAsRead(id, false);
      }
    }
  }
}

// Send response
async function sendResponse(id) {
  const textarea = document.getElementById(`response-${id}`);
  if (!textarea) return;
  
  const response = textarea.value.trim();
  if (!response) {
    showNotification('Please enter a response', 'error');
    return;
  }
  
  try {
    const res = await fetch(`/api/contacts/${id}/response`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response })
    });
    
    if (!(await handleResponse(res))) return;
    
    if (res.ok) {
      showNotification('Response sent successfully!', 'success');
      loadContacts();
    } else {
      const data = await res.json();
      showNotification(data.error || 'Error sending response', 'error');
    }
  } catch (error) {
    console.error('Error sending response:', error);
    showNotification('Error sending response', 'error');
  }
}

// Mark as read
async function markAsRead(id, reload = true) {
  try {
    const res = await fetch(`/api/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' })
    });
    
    if (!(await handleResponse(res))) return;
    
    if (res.ok) {
      if (reload) {
        showNotification('Message marked as read', 'success');
        loadContacts();
      } else {
        const contact = allContacts.find(c => c.id === id);
        if (contact) contact.status = 'read';
        displayContacts(currentFilter);
        loadUnreadCount();
      }
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Mark as unread
async function markAsUnread(id) {
  try {
    const res = await fetch(`/api/contacts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'unread' })
    });
    
    if (!(await handleResponse(res))) return;
    
    if (res.ok) {
      showNotification('Message marked as unread', 'success');
      loadContacts();
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}

// Delete contact
async function deleteContact(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  
  try {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'DELETE'
    });
    
    if (!(await handleResponse(res))) return;
    
    if (res.ok) {
      showNotification('Message deleted successfully', 'success');
      loadContacts();
    } else {
      const data = await res.json();
      showNotification(data.error || 'Error deleting message', 'error');
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    showNotification('Error deleting message', 'error');
  }
}

// Helper function
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Contacts.js initialized');
  
  loadUnreadCount();
  setInterval(loadUnreadCount, 30000);
  
  const projectsTab = document.getElementById('projects-tab');
  const contactsTab = document.getElementById('contacts-tab');
  const projectsSection = document.getElementById('projects-section');
  const contactsSection = document.getElementById('contacts-section');
  
  if (projectsTab && contactsTab && projectsSection && contactsSection) {
    projectsTab.addEventListener('click', () => {
      projectsTab.classList.add('active');
      contactsTab.classList.remove('active');
      projectsSection.classList.remove('hidden');
      contactsSection.classList.add('hidden');
    });
    
    contactsTab.addEventListener('click', () => {
      contactsTab.classList.add('active');
      projectsTab.classList.remove('active');
      projectsSection.classList.add('hidden');
      contactsSection.classList.remove('hidden');
      loadContacts();
    });
  }
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      displayContacts(this.getAttribute('data-filter'));
    });
  });
  
  const messagesTabBtn = document.getElementById('messages-tab-btn');
  if (messagesTabBtn && contactsTab) {
    messagesTabBtn.addEventListener('click', () => contactsTab.click());
  }
});

// Make functions global
window.toggleContactDetails = toggleContactDetails;
window.sendResponse = sendResponse;
window.markAsRead = markAsRead;
window.markAsUnread = markAsUnread;
window.deleteContact = deleteContact;