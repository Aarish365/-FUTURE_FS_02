// ============================================================
// LeadFlow CRM – Express Backend (server.js)
// Stack: Node.js + Express + MongoDB (Mongoose) + JWT Auth
// ============================================================

const express      = require('express');
const mongoose     = require('mongoose');
const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests.' });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// ─── MongoDB Connection ───────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/leadflow-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Schemas & Models ─────────────────────────────────────────────────────

const noteSchema = new mongoose.Schema({
  text:      { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 120 },
  email:     { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  phone:     { type: String, trim: true, default: '' },
  company:   { type: String, trim: true, default: '' },
  source:    {
    type: String,
    enum: ['Website','Contact Form','Referral','Social Media','Email Campaign','Cold Outreach','Event'],
    default: 'Website',
  },
  status:    { type: String, enum: ['new','contacted','converted'], default: 'new' },
  notes:     [noteSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin','agent'], default: 'admin' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Lead = mongoose.model('Lead', leadSchema);
const User = mongoose.model('User', userSchema);

// ─── Auth Middleware ──────────────────────────────────────────────────────

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// ─── Auth Routes ──────────────────────────────────────────────────────────

// POST /api/auth/register (first-run only, or admin only in production)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'Username already taken.' });
    const user = await User.create({ username, password, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// ─── Lead Routes ──────────────────────────────────────────────────────────

// GET /api/leads  — list with filtering, sorting, pagination
app.get('/api/leads', authenticate, async (req, res) => {
  try {
    const { status, source, search, sort = 'newest', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (source)  filter.source = source;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ name: re }, { email: re }, { company: re }];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt:  1 },
      name:   { name: 1 },
    };

    const [leads, total] = await Promise.all([
      Lead.find(filter)
          .sort(sortMap[sort] || sortMap.newest)
          .skip((+page - 1) * +limit)
          .limit(+limit)
          .lean(),
      Lead.countDocuments(filter),
    ]);

    // Stats summary
    const [newCount, contactedCount, convertedCount] = await Promise.all([
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ status: 'contacted' }),
      Lead.countDocuments({ status: 'converted' }),
    ]);

    res.json({
      leads,
      pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
      stats: { total: await Lead.countDocuments(), new: newCount, contacted: contactedCount, converted: convertedCount },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads  — create lead
app.post('/api/leads', authenticate, async (req, res) => {
  try {
    const { name, email, phone, company, source, status } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });
    const lead = await Lead.create({ name, email, phone, company, source, status, createdBy: req.user.id });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/:id
app.get('/api/leads/:id', authenticate, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/leads/:id  — update lead (partial update)
app.patch('/api/leads/:id', authenticate, async (req, res) => {
  try {
    const allowed = ['name','email','phone','company','source','status'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const lead = await Lead.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leads/:id
app.delete('/api/leads/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json({ message: 'Lead deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Notes Sub-routes ─────────────────────────────────────────────────────

// POST /api/leads/:id/notes
app.post('/api/leads/:id/notes', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Note text required.' });
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { text: text.trim() } } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.status(201).json(lead.notes.slice(-1)[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leads/:id/notes/:noteId
app.delete('/api/leads/:id/notes/:noteId', authenticate, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Analytics Route ──────────────────────────────────────────────────────

// GET /api/analytics
app.get('/api/analytics', authenticate, async (req, res) => {
  try {
    const [statusBreakdown, sourceBreakdown, monthlyTrend] = await Promise.all([
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Lead.aggregate([
        { $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);
    res.json({ statusBreakdown, sourceBreakdown, monthlyTrend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 LeadFlow CRM API running on port ${PORT}`));
