require('dotenv').config();
const express     = require('express');
const mongoose    = require('mongoose');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const path        = require('path');

const app = express();

// ── Security middleware ────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ── Rate limiting ──────────────────────────────────────────────
const bookingLimit = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { error: 'Too many bookings. Try again in an hour.' } });
const loginLimit   = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' } });

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Static files (admin panel) ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ─────────────────────────────────────────────────
app.use('/api/bookings', bookingLimit, require('./routes/bookings'));
app.use('/api/auth',     loginLimit,   require('./routes/auth'));
app.use('/api/admin',                  require('./routes/admin'));

// ── Admin panel SPA fallback ───────────────────────────────────
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// ── Health check ───────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ── Connect MongoDB & start server ────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
