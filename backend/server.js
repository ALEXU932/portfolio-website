const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET not set in .env — server cannot start securely');
  process.exit(1);
}

// Define paths
const rootDir = path.join(__dirname, '..'); // Portfolio Website/
const frontendDir = path.join(rootDir, 'frontend');
const uploadsDir = path.join(frontendDir, 'uploads');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent. Please try again later.' }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // CSP disabled to allow CDN scripts (Tailwind, FontAwesome)
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Serve static files from frontend directory
app.use(express.static(frontendDir));

// Serve css and js subfolders explicitly
app.use('/css', express.static(path.join(frontendDir, 'css')));
app.use('/js', express.static(path.join(frontendDir, 'js')));

// Serve images folder
app.use('/images', express.static(path.join(frontendDir, 'images')));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Serve contact attachments (dir created later but path is known)
const contactAttachmentsDir = path.join(frontendDir, 'contact_attachments');
if (!fs.existsSync(contactAttachmentsDir)) {
  fs.mkdirSync(contactAttachmentsDir, { recursive: true });
}
app.use('/contact_attachments', express.static(contactAttachmentsDir));

// Email transporter setup
let transporter = null;

// Only set up email if credentials are provided
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify email connection
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error.message);
      console.log('💡 To fix: Generate an App Password at https://myaccount.google.com/apppasswords');
      transporter = null; // Disable email if verification fails
    } /* else {
      console.log('✅ Email server is ready');
    } */
  });
} else {
  console.log('ℹ️  Email notifications disabled (EMAIL_USER or EMAIL_PASS not configured)');
}

// Database connection
let db = null;

function connectToDatabase() {
  if (!process.env.DB_USER || process.env.DB_PASSWORD === undefined) {
    console.error('❌ DB_USER or DB_PASSWORD not set in .env');
    return;
  }

  try {
    db = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'portfolio'
    });

    db.connect((err) => {
      if (err) {
        console.error('Database connection failed:', err.message);
        console.log('Continuing without database...');
        db = null;
      } else {
        console.log('Connected to MySQL database');
        createTables();
      }
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    db = null;
  }
}

function createTables() {
  // Create admin table
  const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      notification_email VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create contacts table
  const createContactsTable = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      subject VARCHAR(200),
      message TEXT NOT NULL,
      status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
      admin_response TEXT,
      attachments TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  // Create projects table
  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      technologies VARCHAR(255),
      github_url VARCHAR(255),
      live_url VARCHAR(255),
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create images table
  const createImagesTable = `
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Execute table creation sequentially
  db.query(createAdminTable, (err) => {
    if (err) console.error('Error creating admin table:', err.message);
    /* else {
      console.log('✅ Admin table ready');
    } */
    
    db.query(createContactsTable, (err) => {
      if (err) console.error('Error creating contacts table:', err.message);
      
      db.query(createProjectsTable, (err) => {
        if (err) console.error('Error creating projects table:', err.message);
        
        db.query(createImagesTable, (err) => {
          if (err) console.error('Error creating images table:', err.message);
        });
      });
    });
  });
}

connectToDatabase();

// ==================== EMAIL NOTIFICATION FUNCTION ====================

// Send email notification
function escapeHtmlEmail(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendEmailNotification(contact, attachedFiles = []) {
  // Skip if email is not configured
  if (!transporter) {
    console.log('ℹ️  Email notification skipped (not configured)');
    return;
  }
  
  try {
    if (!db) return;
    
    const [rows] = await db.promise().query('SELECT notification_email FROM admins LIMIT 1');
    if (rows.length === 0) return;
    
    const adminEmail = rows[0].notification_email || process.env.EMAIL_USER;
    if (!adminEmail) return;

    // Build nodemailer attachments from uploaded files
    const emailAttachments = attachedFiles.map(f => ({
      filename: f.originalname,
      path: f.path
    }));
    
    const mailOptions = {
      from: `"Portfolio Website" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `📬 New Contact Message: ${contact.subject || 'No Subject'}`,
      attachments: emailAttachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">� New Contact Form Submission</h2>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 25px; padding: 20px; background: #f0f4ff; border-radius: 8px;">
              <p style="margin: 10px 0;"><strong>👤 Name:</strong> ${escapeHtmlEmail(contact.name)}</p>
              <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${escapeHtmlEmail(contact.email)}" style="color: #4f46e5;">${escapeHtmlEmail(contact.email)}</a></p>
              ${contact.subject ? `<p style="margin: 10px 0;"><strong>📝 Subject:</strong> ${escapeHtmlEmail(contact.subject)}</p>` : ''}
              <p style="margin: 10px 0;"><strong>⏰ Date:</strong> ${new Date().toLocaleString()}</p>
              ${emailAttachments.length > 0 ? `<p style="margin: 10px 0;"><strong>📎 Attachments:</strong> ${emailAttachments.map(a => a.filename).join(', ')}</p>` : ''}
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📄 Message:</h3>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">
                ${contact.message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <div style="text-align: center;">
              <a href="http://localhost:${PORT}/admin-login.html" 
                 style="display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                🔐 Login to Admin Panel
              </a>
            </div>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ==================== ADMIN AUTHENTICATION ====================

// Middleware to check if admin is authenticated
function authenticateAdmin(req, res, next) {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin login
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { username, password } = req.body;
  
  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const admin = results[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, message: 'Login successful' });
  });
});

// Admin logout
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// Check admin authentication status
app.get('/api/admin/check-auth', (req, res) => {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }
  
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.json({ authenticated: false });
  }
});

// Get admin profile
app.get('/api/admin/profile', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  db.query('SELECT id, username, email, notification_email FROM admins WHERE id = ?', [req.admin.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// Update notification email
app.put('/api/admin/notification-email', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { email } = req.body;
  
  db.query('UPDATE admins SET notification_email = ? WHERE id = ?', [email, req.admin.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Notification email updated' });
  });
});

// Change admin password
app.put('/api/admin/change-password', authenticateAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }
  
  try {
    const [rows] = await db.promise().query('SELECT password FROM admins WHERE id = ?', [req.admin.id]);
    const validPassword = await bcrypt.compare(currentPassword, rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.admin.id]);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROJECTS API ====================

// Get all projects (public)
app.get('/api/projects', (req, res) => {
  if (!db) return res.json([]);
  
  db.query('SELECT * FROM projects ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Add new project (protected)
app.post('/api/projects', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { title, description, technologies, github_url, live_url, image_url } = req.body;
  
  if (!title || !description || !technologies) {
    return res.status(400).json({ error: 'Title, description, and technologies are required' });
  }

  db.query(
    'INSERT INTO projects (title, description, technologies, github_url, live_url, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, technologies, github_url || null, live_url || null, image_url || null],
    (err, result) => {
      if (err) {
        console.error('Error adding project:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true, 
        message: 'Project added successfully!',
        id: result.insertId 
      });
    }
  );
});

// Delete project (protected)
app.delete('/api/projects/:id', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { id } = req.params;
  
  db.query('DELETE FROM projects WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  });
});

// ==================== CONTACT ATTACHMENTS MULTER ====================

const contactUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, contactAttachmentsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Only allow safe extensions regardless of what client sends
      const safeExts = { 'application/pdf': '.pdf', 'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'image/jpeg': '.jpg', 'image/png': '.png', 'video/mp4': '.mp4' };
      const ext = safeExts[file.mimetype] || '.bin';
      cb(null, uniqueSuffix + ext);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf','application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg','image/png','video/mp4'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  }
});

// ==================== CONTACT API ====================

// Submit contact form (public) — supports optional file attachments
app.post('/api/contact', contactLimiter, contactUpload.array('attachments', 5), (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Validate lengths and email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });
  if (name.length > 100) return res.status(400).json({ error: 'Name too long' });
  if (subject && subject.length > 200) return res.status(400).json({ error: 'Subject too long' });
  if (message.length > 5000) return res.status(400).json({ error: 'Message too long (max 5000 chars)' });

  // Collect saved file paths
  const attachmentPaths = (req.files || []).map(f => `/contact_attachments/${f.filename}`);
  const attachmentsJson = attachmentPaths.length > 0 ? JSON.stringify(attachmentPaths) : null;

  db.query(
    'INSERT INTO contacts (name, email, subject, message, status, attachments) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, subject || null, message, 'unread', attachmentsJson],
    (err, result) => {
      if (err) {
        console.error('Error saving contact:', err);
        return res.status(500).json({ error: err.message });
      }
      
      // Send email notification (with attachments)
      sendEmailNotification({ name, email, subject, message, id: result.insertId }, req.files || []);
      
      res.json({ success: true, message: 'Message sent successfully!' });
    }
  );
});

// Get all contacts (protected)
app.get('/api/contacts', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  db.query('SELECT * FROM contacts ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching contacts:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get unread contacts count (public)
app.get('/api/contacts/unread/count', (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  db.query("SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'", (err, results) => {
    if (err) {
      console.error('Error counting unread contacts:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: results[0].count });
  });
});

// Get single contact by ID (protected)
app.get('/api/contacts/:id', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { id } = req.params;
  db.query('SELECT * FROM contacts WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching contact:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(results[0]);
  });
});

// Update contact status (protected)
app.patch('/api/contacts/:id/status', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['unread', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.query(
    'UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id],
    (err, result) => {
      if (err) {
        console.error('Error updating contact status:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Status updated successfully' });
    }
  );
});

// Save admin response to contact (protected)
app.patch('/api/contacts/:id/response', authenticateAdmin, async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { id } = req.params;
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ error: 'Response is required' });
  }

  try {
    // First, get the contact details
    const [contacts] = await db.promise().query('SELECT * FROM contacts WHERE id = ?', [id]);
    
    if (contacts.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const contact = contacts[0];
    
    // Update the database
    await db.promise().query(
      'UPDATE contacts SET admin_response = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [response, 'replied', id]
    );
    
    // Send email response to the sender
    if (transporter) {
      try {
        const mailOptions = {
          from: `"Portfolio Website" <${process.env.EMAIL_USER}>`,
          to: contact.email,
          subject: `Re: ${contact.subject || 'Your Contact Message'}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
                .response-box { background: #f0f4ff; padding: 20px; border-left: 4px solid #4f46e5; margin: 20px 0; border-radius: 5px; }
                .original-message { background: #f9fafb; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">📧 Response to Your Message</h1>
                </div>
                
                <div class="content">
                  <p>Hello <strong>${contact.name}</strong>,</p>
                  
                  <p>Thank you for contacting us. Here is our response to your message:</p>
                  
                  <div class="response-box">
                    <p style="margin: 0; white-space: pre-wrap;">${response}</p>
                  </div>
                  
                  <div class="original-message">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #666;">Your Original Message:</p>
                    <p style="margin: 0; white-space: pre-wrap;">${contact.message}</p>
                  </div>
                  
                  <p>If you have any further questions, feel free to reply to this email.</p>
                  
                  <p>Best regards,<br>Portfolio Team</p>
                </div>
                
                <div class="footer">
                  <p>This is an automated response from the portfolio contact form.</p>
                  <p>© ${new Date().getFullYear()} Portfolio Website. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`📧 Response email sent to ${contact.email}`);
      } catch (emailError) {
        console.error('Error sending response email:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    res.json({ success: true, message: 'Response sent successfully' });
  } catch (err) {
    console.error('Error saving response:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete contact (protected)
app.delete('/api/contacts/:id', authenticateAdmin, (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not connected' });
  
  const { id } = req.params;
  
  db.query('DELETE FROM contacts WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting contact:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Contact deleted successfully' });
  });
});

// ==================== IMAGES API ====================

// Upload image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { type, name } = req.body;
  const filename = req.file.filename;
  const originalName = name || req.file.originalname;
  const filePath = `/uploads/${filename}`;

  console.log(`File uploaded: ${filename}, type: ${type}`);

  if (!db) {
    return res.json({ 
      success: true, 
      message: 'Image uploaded successfully!',
      filename: filename,
      path: filePath
    });
  }

  db.query(
    'INSERT INTO images (filename, original_name, type, file_path) VALUES (?, ?, ?, ?)',
    [filename, originalName, type, filePath],
    (err, result) => {
      if (err) {
        console.error('Error saving image record:', err);
        return res.json({ 
          success: true, 
          message: 'Image uploaded but database record failed',
          filename: filename,
          path: filePath
        });
      }
      res.json({ 
        success: true, 
        message: 'Image uploaded successfully!',
        filename: filename,
        path: filePath
      });
    }
  );
});

// Get all images
app.get('/api/images', (req, res) => {
  if (!db) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const images = files.map(file => ({
        filename: file,
        original_name: file,
        type: 'unknown',
        file_path: `/uploads/${file}`
      }));
      return res.json(images);
    } catch (error) {
      return res.json([]);
    }
  }
  
  db.query('SELECT * FROM images ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get images by type
app.get('/api/images/type/:type', (req, res) => {
  if (!db) return res.json([]);
  
  const { type } = req.params;
  db.query('SELECT * FROM images WHERE type = ? ORDER BY created_at DESC', [type], (err, results) => {
    if (err) {
      console.error('Error fetching images by type:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Download CV
app.get('/resume.pdf', (req, res) => {
  const cvPath = path.join(frontendDir, 'resume.pdf');
  if (fs.existsSync(cvPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="Tewelde_Birhan_CV.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(cvPath);
  } else {
    res.status(404).json({ error: 'CV not found. Please upload your resume.pdf to the public folder.' });
  }
});

// Upload CV (PDF only)
const cvUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, frontendDir),
    filename: (req, file, cb) => cb(null, 'resume.pdf')
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for CV'));
    }
  }
});

app.post('/api/upload-cv', authenticateAdmin, cvUpload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
  res.json({ success: true, message: 'CV uploaded successfully!' });
});

// Check if CV exists
app.get('/api/cv-status', (req, res) => {
  const cvPath = path.join(frontendDir, 'resume.pdf');
  res.json({ exists: fs.existsSync(cvPath) });
});

// Get latest logo
app.get('/api/logo', (req, res) => {
  if (!db) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const logoFiles = files.filter(file => 
        file.toLowerCase().includes('logo') || file.match(/logo/i)
      );
      
      if (logoFiles.length > 0) {
        const latestLogo = logoFiles.sort().reverse()[0];
        return res.json({ 
          success: true, 
          path: `/uploads/${latestLogo}` 
        });
      }
    } catch (error) {
      console.error('Error finding logo:', error);
    }
    return res.json({ success: false, path: null });
  }
  
  db.query("SELECT * FROM images WHERE type = 'logo' ORDER BY created_at DESC LIMIT 1", (err, results) => {
    if (err) {
      console.error('Error fetching logo:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json({ success: true, path: results[0].file_path });
    } else {
      res.json({ success: false, path: null });
    }
  });
});

// Get latest profile image
app.get('/api/profile', (req, res) => {
  if (!db) {
    try {
      const files = fs.readdirSync(uploadsDir);
      const profileFiles = files.filter(file => 
        file.toLowerCase().includes('profile') || file.match(/profile/i)
      );
      
      if (profileFiles.length > 0) {
        const latestProfile = profileFiles.sort().reverse()[0];
        return res.json({ 
          success: true, 
          path: `/uploads/${latestProfile}` 
        });
      }
    } catch (error) {
      console.error('Error finding profile image:', error);
    }
    return res.json({ success: false, path: null });
  }
  
  db.query("SELECT * FROM images WHERE type = 'profile' ORDER BY created_at DESC LIMIT 1", (err, results) => {
    if (err) {
      console.error('Error fetching profile image:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json({ success: true, path: results[0].file_path });
    } else {
      res.json({ success: false, path: null });
    }
  });
});

// Delete image
app.delete('/api/images/:filename', (req, res) => {
  const { filename } = req.params;
  
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  }
  
  if (!db) {
    return res.json({ success: true, message: 'Image deleted successfully' });
  }
  
  db.query('DELETE FROM images WHERE filename = ?', [filename], (err, result) => {
    if (err) {
      console.error('Error deleting image record:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Handle favicon silently
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Handle 404
app.use((req, res) => {
  console.log(`404 - Page not found: ${req.url}`);
  res.status(404).send(`
    <html>
      <head>
        <title>404 - Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #e74c3c; }
          a { color: #3498db; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p>Requested URL: ${req.url}</p>
        <a href="/">Go to Home</a>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('='.repeat(50));
  console.log('\n🌐 Available pages:');
  console.log(`   - Home: http://localhost:${PORT}/`);
  console.log(`   - Admin Login: http://localhost:${PORT}/admin-login.html`);
 /*  console.log(`   - Admin Panel: http://localhost:${PORT}/admin.html`);
   console.log(`   - Upload: http://localhost:${PORT}/upload.html`);  */
  console.log('='.repeat(50));
  console.log('='.repeat(50));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please free the port or set PORT in your environment.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
