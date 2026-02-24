# 🎯 LeadFlow CRM - Setup & Run Guide

Your project is now fully configured and ready to run!

## ✨ What's Been Done

✅ Installed all backend dependencies (Node.js packages)  
✅ Installed all frontend dependencies (React)  
✅ Created `.env` configuration file  
✅ Set up proper project structure with `/client` folder  

## 🚀 Quick Start

### Option 1: Run Both Frontend & Backend Together (Recommended)

```bash
npm run dev
```

This will start both the server (port 5000) and the React client (port 3000) concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run server
# OR with auto-reload on changes:
npm run dev:server
```

**Terminal 2 - Frontend Client:**
```bash
npm run client
```

## 📋 Prerequisites

### 1. MongoDB Setup

You need MongoDB running locally or in the cloud. Choose one:

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or manually run:
mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Create a cluster
4. Get your connection string
5. Update the `MONGO_URI` in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/leadflow-crm
   ```

#### Option C: Docker
```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo

# Update .env:
MONGO_URI=mongodb://admin:password@localhost:27017/leadflow-crm
```

## 📝 First Run Setup

1. **Start MongoDB** (choose one option above)

2. **From the root directory**, run:
   ```bash
   npm run dev
   ```

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

4. **Login credentials:**
   - Username: `admin`
   - Password: `admin123`

5. **(Optional) Seed sample data:**
   ```bash
   node seed.js
   ```

## 📁 Project Structure

```
crm-app/
├── server.js              ← Express backend API
├── package.json           ← Backend dependencies
├── .env                   ← Configuration (created for you)
├── seed.js                ← Sample data script
│
└── client/
    ├── package.json       ← React dependencies
    ├── public/
    │   └── index.html     ← HTML entry point
    └── src/
        ├── index.js       ← React entry point
        └── App.jsx        ← Main CRM component
```

## 🔑 API Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

## 🛠️ Environment Variables

Edit `.env` to configure:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection URL
- `JWT_SECRET` - Authentication secret (change in production!)
- `CLIENT_URL` - Frontend URL for CORS

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify `MONGO_URI` in `.env`
- Check MongoDB logs for errors

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Find process on port 5000
lsof -i :5000

# Kill process (replace PID)
kill -9 PID
```

### Dependency Issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Same for client
cd client
rm -rf node_modules package-lock.json
npm install
```

## 📚 Features

✅ Lead management (CRUD)  
✅ Status tracking (New → Contacted → Converted)  
✅ Notes & follow-ups  
✅ Analytics dashboard  
✅ Search & filter  
✅ Responsive design  
✅ JWT authentication  
✅ Rate limiting  

## 🎓 Next Steps

1. Change admin password in production
2. Update JWT_SECRET in `.env`
3. Configure CORS for your domain
4. Deploy to hosting (Heroku, Render, Railway, etc.)

---

**Need help?** Check the original README.md for more details or run `npm run --help` for available scripts.
