# Vision CRM - Project Structure

## 📁 Root Directory

```
vision/
├── README.md                    # Main project documentation
├── package.json                 # Frontend dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── index.html                  # Entry HTML file
├── jsconfig.json               # JavaScript config
├── postcss.config.js           # PostCSS config
│
├── backend/                    # Backend source code
│   ├── server.js              # Express server entry
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (not in git)
│   ├── .env.example           # Environment template
│   ├── config/                # Database config
│   ├── controllers/           # Request handlers
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── migrations/            # Database migrations
│   ├── uploads/               # File uploads
│   └── utils/                 # Production utilities
│       ├── runMigration.js
│       ├── seedProfiles.js
│       ├── generateBackendModules.js
│       ├── generateFrontendModules.js
│       └── ... (other production utils)
│
├── src/                       # Frontend source code
│   ├── main.js               # Vue app entry
│   ├── App.vue               # Root component
│   ├── i18n.js               # Internationalization
│   ├── api/                  # API client
│   ├── assets/               # CSS, images
│   ├── components/           # Vue components
│   ├── composables/          # Vue composables
│   ├── layouts/              # Layout components
│   ├── locales/              # Translations (ar.json, en.json)
│   ├── router/               # Vue Router
│   ├── stores/               # Pinia stores
│   └── views/                # Page views
│
├── database/                  # Database files
│   └── vision_crm_dump.sql   # Database dump
│
├── scripts/                   # Utility scripts
│   ├── README.md             # Scripts documentation
│   ├── setup-rbac.sh         # RBAC setup
│   ├── diagnose.sh           # System diagnostics
│   ├── backup_db.sh          # DB backup
│   ├── create-dump.sh        # Create DB dump
│   ├── restore-db.sh         # Restore DB
│   └── backend-utils/        # Test & diagnostic tools
│       ├── checkSchema.js
│       ├── checkUsers.js
│       ├── testConnection.js
│       ├── testProfileSave.js
│       ├── resetPassword.js
│       └── fixProfileTables.js
│
├── technical-documentation/   # All documentation
│   ├── README.md             # Documentation index
│   ├── SETUP_GUIDE.md        # Complete setup
│   ├── INSTALLATION.md       # RBAC installation
│   ├── RBAC_INDEX.md         # RBAC docs index
│   ├── RBAC_DOCUMENTATION.md # Full RBAC guide
│   ├── RBAC_QUICK_REFERENCE.md
│   ├── RBAC_SUMMARY.md
│   ├── DATABASE_README.md
│   ├── GIT_COMMIT_CHECKLIST.md
│   └── ... (troubleshooting docs)
│
└── public/                    # Static assets

```

## 🎯 Key Directories

### Production Code
- `/src` - Frontend Vue 3 application
- `/backend` - Express.js backend API
- `/database` - Database dump

### Development Tools
- `/scripts` - Maintenance & setup scripts
- `/scripts/backend-utils` - Testing & diagnostic tools
- `/technical-documentation` - All guides & docs

### Configuration
- Root: `package.json`, `vite.config.js`, `tailwind.config.js`
- Backend: `.env`, `package.json`

## 🚫 Excluded from Git
- `node_modules/`
- `dist/`
- `backend/.env`
- `backend/uploads/`
- `.DS_Store`

## 📝 Important Files

### Essential for Running
- `backend/server.js` - Backend entry
- `src/main.js` - Frontend entry
- `database/vision_crm_dump.sql` - Database
- `backend/.env` - Configuration (create from .env.example)

### Essential for Setup
- `scripts/setup-rbac.sh` - RBAC setup
- `scripts/restore-db.sh` - Database restore
- `technical-documentation/SETUP_GUIDE.md` - Setup instructions

### Essential for Development
- `src/router/index.js` - Routes
- `src/stores/` - State management
- `backend/routes/` - API endpoints
- `backend/controllers/` - Business logic

---

Last Updated: November 25, 2025
