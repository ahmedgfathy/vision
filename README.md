# Vision CRM - Real Estate Management System

A comprehensive Real Estate CRM built with Vue 3, Express.js, and MySQL featuring advanced RBAC (Role-Based Access Control) with module and field-level permissions.

## ✨ Features

- 🏢 **Property Management** - Complete property lifecycle management
- 👥 **Lead Management** - Track and manage potential clients
- 🏗️ **Company & Agent Management** - Organize your real estate network
- ✅ **Task Management** - Track activities and follow-ups
- 🔐 **Advanced RBAC** - Module and field-level access control
- 🌍 **Bilingual Support** - Arabic & English (RTL/LTR)
- 📊 **Audit Logging** - Complete activity tracking
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide Icons

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone <your-repo-url>
cd vision

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Setup database
cd database
./restore-db.sh

# 4. Configure environment
cd ../backend
cp .env.example .env
# Edit .env with your database credentials

# 5. Start application
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm run dev
```

Access the application at **http://localhost:5173**

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup instructions
- **[RBAC_INDEX.md](./RBAC_INDEX.md)** - RBAC documentation index
- **[RBAC_DOCUMENTATION.md](./RBAC_DOCUMENTATION.md)** - Comprehensive RBAC guide
- **[RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md)** - Code examples & API reference
- **[INSTALLATION.md](./INSTALLATION.md)** - RBAC installation guide
- **[database/README.md](./database/README.md)** - Database documentation

## 🏗️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Pinia** - Vue state management
- **Vue Router** - Official routing
- **Vue-i18n** - Internationalization
- **Tailwind CSS** - Utility-first CSS
- **Lucide Vue** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework
- **MySQL 2** - Database driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Dotenv** - Environment management

## 📁 Project Structure

```
vision/
├── src/                    # Frontend source
│   ├── components/        # Vue components
│   ├── views/            # Page views
│   ├── stores/           # Pinia stores
│   ├── router/           # Vue Router
│   ├── composables/      # Vue composables
│   ├── locales/          # i18n translations
│   └── api/              # API client
├── backend/              # Backend source
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── migrations/       # Database migrations
│   └── utils/            # Utilities
├── database/             # Database dumps & scripts
├── docs/                 # Documentation
└── public/               # Static assets
```

## 🔐 RBAC System

Vision CRM includes a comprehensive permission system:

### Module-Level Permissions
- **View** - Can see the module
- **Create** - Can add new records
- **Edit** - Can modify existing records  
- **Delete** - Can remove records

### Field-Level Permissions
- **View** - Field is visible
- **Edit** - Field can be modified
- **Hidden** - Field is completely removed

### Default Profiles

| Profile | Description | Access Level |
|---------|-------------|--------------|
| **Admin** | Full system access | All modules, all fields |
| **Sales** | View properties & leads | View only, no edits |
| **Agent** | Manage properties & leads | Create/Edit properties, limited fields |

## 🗄️ Database

### Quick Restore
```bash
cd database
./restore-db.sh
```

### Manual Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE vision_crm;"

# Import dump
mysql -u root -p vision_crm < database/vision_crm_dump.sql

# Or setup RBAC from scratch
cd backend
npm run setup-rbac
```

## 🔧 Configuration

### Backend Environment

Create `backend/.env`:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=vision_crm
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

## 🧪 Development

### Available Scripts

**Frontend**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend**
```bash
npm run dev          # Start with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed-profiles # Seed default profiles
npm run setup-rbac   # Complete RBAC setup
```

**Database**
```bash
./restore-db.sh      # Restore database
./create-dump.sh     # Create new dump
```

## 👥 Default Users

After database restoration, login credentials will be in the seeded data. Default admin:
- Email: Check your database or seed scripts
- Password: Check your database or seed scripts

⚠️ **Important**: Change default passwords in production!

## 🌍 Internationalization

Vision CRM supports Arabic (default) and English:

```javascript
// In Vue components
{{ $t('properties.title') }}
{{ $t('leads.addNew') }}

// In JavaScript
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
```

Translation files:
- `src/locales/ar.json`
- `src/locales/en.json`

## 🎨 UI Components

Built with Tailwind CSS and organized in:
- `components/admin/` - Admin panel components
- `components/crud/` - Reusable CRUD components
- `components/properties/` - Property-specific components
- `components/common/` - Shared components

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ RBAC enforcement at API level
- ✅ Field-level data filtering
- ✅ Audit logging
- ✅ CORS protection
- ✅ SQL injection prevention (parameterized queries)

## 📊 API Documentation

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
```

### Properties
```
GET    /api/properties
POST   /api/properties
GET    /api/properties/:id
PUT    /api/properties/:id
DELETE /api/properties/:id
```

### Profiles (RBAC)
```
GET    /api/profiles
POST   /api/profiles
GET    /api/profiles/:id
PUT    /api/profiles/:id
DELETE /api/profiles/:id
POST   /api/profiles/:id/modules
POST   /api/profiles/:id/fields
GET    /api/profiles/my-permissions
```

See [RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md) for complete API reference.

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Check MySQL is running: `mysql.server status`
- Verify credentials in `backend/.env`
- Test connection: `mysql -u root -p`

**RBAC tables not found**
```bash
cd backend
npm run migrate
npm run seed-profiles
```

**Frontend blank page**
- Check console for errors
- Verify backend is running on port 3000
- Clear browser cache

**Permission denied errors**
- Assign profile to user: `UPDATE users SET profile_id = 1 WHERE id = X;`
- Verify profile has permissions
- Check audit_log for denied access

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

For issues and questions:
1. Check documentation in `/docs` folder
2. Review [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. Check [RBAC_QUICK_REFERENCE.md](./RBAC_QUICK_REFERENCE.md)
4. Review database logs and audit_log table

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Mobile application
- [ ] WhatsApp integration
- [ ] Document management
- [ ] Advanced search filters
- [ ] Export to PDF/Excel
- [ ] Calendar integration

## 📈 Project Status

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: November 25, 2025

---

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Custom Object Formatter](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Custom Object Formatter](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

---

Made with ❤️ for Real Estate Professionals
