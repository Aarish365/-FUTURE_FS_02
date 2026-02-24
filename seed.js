// scripts/seed.js — Run once to create the default admin user
// Usage: node scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/leadflow-crm';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'admin' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ username: 'admin' });
  if (existing) {
    console.log('Admin user already exists. Skipping.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 12);
  await User.create({ username: 'admin', password: hashed, role: 'admin' });
  console.log('✅ Admin user created: admin / admin123');
  console.log('⚠️  Change the password after first login!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
