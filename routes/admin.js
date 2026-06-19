const express   = require('express');
const router    = express.Router();
const Booking   = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const { sendPatientConfirmation } = require('../utils/email');

// All admin routes require auth
router.use(authMiddleware);

// GET /api/admin/bookings — get all bookings with filters
router.get('/bookings', async (req, res) => {
  try {
    const { status, branch, date, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all')  query.status = status;
    if (branch && branch !== 'all')  query.branch = branch;
    if (date)                        query.date   = date;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { phone:     { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } }
      ];
    }

    const total    = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats — dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [total, pending, confirmed, completed, cancelled, mainBranch, gorgBranch, today] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'pending' }),
        Booking.countDocuments({ status: 'confirmed' }),
        Booking.countDocuments({ status: 'completed' }),
        Booking.countDocuments({ status: 'cancelled' }),
        Booking.countDocuments({ branch: 'Main Branch' }),
        Booking.countDocuments({ branch: 'Gorgorious Branch' }),
        Booking.countDocuments({ createdAt: { $gte: new Date().setHours(0,0,0,0) } })
      ]);

    res.json({ total, pending, confirmed, completed, cancelled, mainBranch, gorgBranch, today });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/bookings/:id — single booking
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/bookings/:id — update status
router.patch('/bookings/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // If confirmed, send confirmation email
    if (status === 'confirmed') {
      sendPatientConfirmation(booking).catch(console.error);
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/bookings/:id — delete booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
