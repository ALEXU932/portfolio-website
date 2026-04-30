# 🌐 Portfolio Website

A modern, full-stack portfolio website with admin panel, contact form, and project management system.

## ✨ Features

- 🎨 **Modern UI** - Responsive design with dark/light theme support
- 🔐 **Admin Panel** - Secure authentication with JWT
- 📧 **Contact Form** - Email notifications with file attachments
- 📁 **Project Management** - Add, edit, and delete portfolio projects
- 🖼️ **Image Upload** - Manage logos, profile pictures, and project images
- 🌍 **Multi-language** - Support for multiple languages (i18n)
- 🔒 **Security** - Bcrypt password hashing, rate limiting, input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- XAMPP (MySQL) running
- Git (optional)

### Installation

1. **Install Dependencies**
   ```bash
   cd "Portfolio Website/backend"
   npm install
   ```

2. **Configure Environment**
   
   Edit `.env` file in the root directory:
   ```env
   # Database (XAMPP default)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=portfolio
   
   # Email (optional - for contact form notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Security
   JWT_SECRET=your-secret-key-here
   
   # Server
   PORT=3000
   ```

3. **Setup Database**
   
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Click **Import** tab
   - Choose file: `database/database.sql`
   - Click **Go**
   
   ✅ This creates the database and default admin account

4. **Start Server**
   ```bash
   npm start
   ```

5. **Access Application**
   - **Website**: http://localhost:3000
   - **Admin Login**: http://localhost:3000/admin-login.html

## 🔐 Default Admin Credentials

```
Username: admin
Password: Admin123!
```

**⚠️ IMPORTANT:** Change the password immediately after first login at:
`http://localhost:3000/change-password.html`

## 📁 Project Structure

```
Portfolio Website/
├── backend/
│   └── server.js              # Express server with all API routes
├── database/
│   └── database.sql           # Database schema with default admin
├── frontend/
│   ├── css/
│   │   ├── animations.css     # Animation styles
│   │   └── theme.css          # Theme variables
│   ├── images/                # Static images
│   ├── js/
│   │   ├── admin.js           # Admin panel logic
│   │   ├── contacts.js        # Contact form handling
│   │   ├── i18n.js            # Internationalization
│   │   ├── script.js          # Main website logic
│   │   ├── theme.js           # Theme switcher
│   │   └── upload.js          # Image upload logic
│   ├── uploads/               # Uploaded images (auto-created)
│   ├── contact_attachments/   # Contact form files (auto-created)
│   ├── index.html             # Main portfolio page
│   ├── admin-login.html       # Admin login page
│   ├── admin.html             # Admin dashboard
│   ├── change-password.html   # Password change page
│   ├── upload.html            # Image upload page
│   └── resume.pdf             # Your CV/resume
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## 🗄️ Database Schema

### Tables

1. **admins** - Admin user accounts
   - id, username, email, password (bcrypt), notification_email, created_at

2. **contacts** - Contact form submissions
   - id, name, email, subject, message, status, admin_response, attachments, created_at, updated_at

3. **projects** - Portfolio projects
   - id, title, description, technologies, github_url, live_url, image_url, created_at

4. **images** - Uploaded images metadata
   - id, filename, original_name, type, file_path, created_at

## 🔧 Configuration

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character App Password in `.env` file

### JWT Secret

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add it to your `.env` file.

## 📝 Usage

### Admin Panel Features

- **Dashboard**: View and manage contact messages
- **Projects**: Add, edit, delete portfolio projects
- **Images**: Upload and manage images (logo, profile, projects)
- **Settings**: Change password, configure notification email

### Contact Form

- Supports file attachments (PDF, DOC, DOCX, images, videos)
- Email notifications to admin
- Status tracking (unread, read, replied)
- Admin can reply directly from the panel

### Theme Support

- Light/Dark mode toggle
- Persistent theme preference
- Smooth transitions

## 🔒 Security Features

- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT authentication with HTTP-only cookies
- ✅ Rate limiting on login and contact form
- ✅ Input validation and sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ File upload restrictions (type and size)
- ✅ CORS configuration
- ✅ Helmet.js security headers

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start server (with nodemon for auto-reload)
npm run dev        # Same as npm start
```

### Adding New Features

1. **Backend**: Edit `backend/server.js` to add new API routes
2. **Frontend**: Add HTML/CSS/JS files in `frontend/` directory
3. **Database**: Update `database/database.sql` for schema changes

## 📦 Dependencies

### Backend
- express - Web framework
- mysql2 - MySQL database driver
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- multer - File upload handling
- nodemailer - Email sending
- express-rate-limit - Rate limiting
- helmet - Security headers
- cors - CORS handling
- dotenv - Environment variables
- cookie-parser - Cookie parsing

### Frontend
- Tailwind CSS (CDN) - Utility-first CSS
- Font Awesome (CDN) - Icons
- Vanilla JavaScript - No framework dependencies

## 🐛 Troubleshooting

### Database Connection Failed

**Problem**: `Database connection failed: Access denied`

**Solution**:
1. Verify XAMPP MySQL is running
2. Check `.env` credentials match XAMPP settings
3. Ensure database `portfolio` exists in phpMyAdmin

### Admin Login Failed

**Problem**: Cannot login with default credentials

**Solution**:
1. Verify database was imported correctly
2. Check if admin exists: `SELECT * FROM admins;` in phpMyAdmin
3. Re-import `database/database.sql` if needed

### Email Not Sending

**Problem**: Contact form emails not received

**Solution**:
1. Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`
2. Use Gmail App Password (not regular password)
3. Check server logs for email errors

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**:
1. Change `PORT` in `.env` to another port (e.g., 3001)
2. Or stop the process using port 3000

## 📄 License

This project is open source and available for personal and commercial use.

## 👤 Author

**Tewelde Birhan**

- Email: temesgentaddesse5@gmail.com
- Portfolio: http://localhost:3000 (after setup)

## 🙏 Acknowledgments

- Tailwind CSS for the amazing utility-first CSS framework
- Font Awesome for the comprehensive icon library
- Express.js community for excellent documentation

---

**Last Updated**: April 30, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
