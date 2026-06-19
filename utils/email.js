const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ── Patient confirmation email ──────────────────────────────────
const sendPatientConfirmation = async (booking) => {
  if (!booking.email) return;

  const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#f4fafa;font-family:'Helvetica Neue',Arial,sans-serif;">
    <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#004b49,#00c4ba);padding:40px 32px;text-align:center;">
        <div style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Happy Optics</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Optometry Clinic · ኦፕቶሜትሪ ክሊኒክ</div>
      </div>
      <!-- Body -->
      <div style="padding:40px 32px;">
        <h2 style="color:#004b49;font-size:22px;margin:0 0 8px;">Appointment Confirmed ✅</h2>
        <p style="color:#666;font-size:14px;line-height:1.6;margin:0 0 28px;">
          Dear <strong>${booking.firstName}</strong>, your appointment has been received. We'll contact you shortly to confirm your time slot.
        </p>
        <!-- Booking details card -->
        <div style="background:#f4fafa;border-radius:12px;padding:24px;margin-bottom:28px;border-left:4px solid #00c4ba;">
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#00c4ba;margin-bottom:16px;">Booking Details</div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:13px;color:#999;width:120px;">Name</td><td style="padding:6px 0;font-size:13px;color:#333;font-weight:600;">${booking.firstName} ${booking.lastName}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999;">Service</td><td style="padding:6px 0;font-size:13px;color:#333;font-weight:600;">${booking.service}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999;">Date</td><td style="padding:6px 0;font-size:13px;color:#333;font-weight:600;">${booking.date}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999;">Branch</td><td style="padding:6px 0;font-size:13px;color:#333;font-weight:600;">${booking.branch}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#999;">Phone</td><td style="padding:6px 0;font-size:13px;color:#333;font-weight:600;">${booking.phone}</td></tr>
          </table>
        </div>
        <p style="color:#888;font-size:13px;line-height:1.6;">
          Need to reschedule? Call us at <strong style="color:#004b49;">+251 115 584293</strong> or <strong style="color:#004b49;">+251 912 509666</strong>
        </p>
      </div>
      <!-- Footer -->
      <div style="background:#f4fafa;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
        <p style="color:#aaa;font-size:12px;margin:0;">© 2025 Happy Optics Optometry Clinic · Addis Ababa, Ethiopia</p>
      </div>
    </div>
  </body>
  </html>`;

  await transporter.sendMail({
    from: `"Happy Optics Clinic" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: `Appointment Confirmed — Happy Optics`,
    html
  });
};

// ── Clinic notification email ───────────────────────────────────
const sendClinicNotification = async (booking) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family:Arial,sans-serif;background:#f4fafa;padding:20px;">
    <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      <div style="background:#004b49;color:#fff;padding:16px 24px;border-radius:8px;margin-bottom:24px;">
        <strong style="font-size:16px;">🔔 New Booking — ${booking.branch}</strong>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;width:120px;">Patient</td><td style="padding:10px 0;font-weight:600;">${booking.firstName} ${booking.lastName}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;">Phone</td><td style="padding:10px 0;font-weight:600;">${booking.phone}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;">Email</td><td style="padding:10px 0;">${booking.email || 'Not provided'}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;">Service</td><td style="padding:10px 0;font-weight:600;">${booking.service}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;">Date</td><td style="padding:10px 0;font-weight:600;">${booking.date}</td></tr>
        <tr style="border-bottom:1px solid #eee;"><td style="padding:10px 0;color:#666;">Branch</td><td style="padding:10px 0;font-weight:600;">${booking.branch}</td></tr>
        <tr><td style="padding:10px 0;color:#666;">Notes</td><td style="padding:10px 0;">${booking.notes || 'None'}</td></tr>
      </table>
      <div style="margin-top:24px;padding:12px;background:#e0f4f3;border-radius:8px;font-size:12px;color:#004b49;">
        Submitted: ${new Date().toLocaleString('en-ET', { timeZone: 'Africa/Addis_Ababa' })} (Addis Ababa Time)
      </div>
    </div>
  </body>
  </html>`;

  await transporter.sendMail({
    from: `"Happy Optics System" <${process.env.EMAIL_USER}>`,
    to: process.env.CLINIC_EMAIL,
    subject: `📋 New Booking: ${booking.firstName} ${booking.lastName} — ${booking.service}`,
    html
  });
};

module.exports = { sendPatientConfirmation, sendClinicNotification };
