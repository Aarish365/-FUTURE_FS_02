# 🎯 LeadFlow CRM

A full-stack Customer Relationship Management system for managing leads generated from website contact forms.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Lead Management** | Add, view, edit, and delete leads with name, email, phone, company, source |
| **Status Tracking** | Three-stage pipeline: New → Contacted → Converted |
| **Notes & Follow-ups** | Timestamped notes attached to each lead |
| **Analytics Dashboard** | Conversion rates, source breakdown, monthly trends |
| **Secure Admin Auth** | JWT-based login with bcrypt password hashing |
| **Rate Limiting** | Express rate limiter on all API routes |
| **Search & Filter** | Real-time search + filter by status/source + sort |
| **Pagination** | Server-side pagination for large datasets |

---

## 🗂️ Project Structure

```
leadflow-crm/
├── server.js              ← Express API server
├── package.json           ← Backend dependencies
├── .env.example           ← Environment template
│
└── client/                ← React frontend (Create React App)
    ├── src/
    │   ├── App.jsx        ← Main CRM application
    │   └── index.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/leadflow-crm.git
cd leadflow-crm

# Install backend deps
npm install

# Install frontend deps
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Seed Initial Admin User

```bash
npm run seed
# Creates admin user: admin / admin123
```

### 4. Run Development Servers

```bash
npm run dev
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

---

## 📡 API Reference

All routes require `Authorization: Bearer <token>` header except auth endpoints.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new admin |
| `POST` | `/api/auth/login` | Login → returns JWT token |
| `GET` | `/api/auth/me` | Get current user info |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leads` | List leads (filter, sort, paginate) |
| `POST` | `/api/leads` | Create a new lead |
| `GET` | `/api/leads/:id` | Get a single lead |
| `PATCH` | `/api/leads/:id` | Update lead fields |
| `DELETE` | `/api/leads/:id` | Delete a lead (admin only) |

#### Query params for `GET /api/leads`:
- `status` — `new` | `contacted` | `converted`
- `source` — any source name
- `search` — full-text search on name/email/company
- `sort` — `newest` | `oldest` | `name`
- `page` — page number (default: 1)
- `limit` — per page (default: 20)

### Notes
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/leads/:id/notes` | Add a note to a lead |
| `DELETE` | `/api/leads/:id/notes/:noteId` | Remove a note |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Status breakdown, source breakdown, monthly trend |

---

## 🗄️ Database Schema

### Lead
```js
{
  name:      String (required),
  email:     String (required, unique-ish),
  phone:     String,
  company:   String,
  source:    Enum ['Website','Contact Form','Referral','Social Media','Email Campaign','Cold Outreach','Event'],
  status:    Enum ['new','contacted','converted'],
  notes:     [{ text: String, createdAt: Date }],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### User
```js
{
  username: String (unique),
  password: String (bcrypt hashed),
  role:     Enum ['admin','agent']
}
```

---

## 🌐 Deploying to GitHub

```bash
# Initialize git repo
git init
git add .
git commit -m "feat: initial LeadFlow CRM"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/leadflow-crm.git
git branch -M main
git push -u origin main
```

### Production Deployment Options
- **Backend**: [Railway](https://railway.app), [Render](https://render.com), [Fly.io]
- **Frontend**: [Vercel](https://vercel.com), [Netlify](https://netlify.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)

---

## 🔒 Security Features

- **JWT Authentication** with 8-hour token expiry
- **Bcrypt** password hashing (cost factor 12)
- **Helmet.js** HTTP security headers
- **Rate limiting** — 200 req/15min global, 20 req/15min on auth
- **CORS** configured to specific client origin
- **Admin-only** delete operations
- **Input validation** on all endpoints

---

## 🛠️ Skills Demonstrated

- **CRUD Operations** — Full Create, Read, Update, Delete with Mongoose
- **Backend Integration** — RESTful API design with Express
- **Database Management** — MongoDB schemas, indexes, aggregation pipelines
- **Business Workflows** — Lead status pipeline, notes system, analytics
- **Security** — JWT auth, bcrypt hashing, rate limiting, helmet
- **Frontend State** — React hooks, localStorage persistence
- **UI/UX** — Responsive design, animations, dark theme

---

## 📄 License

MIT © 2024 LeadFlow CRM
