const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const { sendPatientConfirmation, sendClinicNotification } = require('../utils/email');

// POST /api/bookings — submit new booking
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, service, date, branch, notes } = req.body;

    if (!firstName || !lastName || !phone || !service || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const booking = await Booking.create({ firstName, lastName, phone, email, service, date, branch, notes });

    // Send emails (non-blocking)
    Promise.allSettled([
      sendPatientConfirmation(booking),
      sendClinicNotification(booking)
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') console.error(`Email ${i} failed:`, r.reason);
      });
    });

    res.status(201).json({ success: true, message: 'Booking received', bookingId: booking._id });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

module.exports = router;
