# Happy Optics Backend — Setup Guide

## What's included
- Express.js REST API
- MongoDB database (via MongoDB Atlas)
- Email notifications (Gmail SMTP)
- JWT-protected Admin Dashboard
- Rate limiting & security headers

---

## Step 1: Install Node.js
Download from https://nodejs.org (LTS version)

---

## Step 2: Set up MongoDB Atlas (free)
1. Go to https://mongodb.com/atlas and create a free account
2. Create a free cluster (M0 Sandbox)
3. Create a database user (username + password)
4. Go to Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)
5. Go to your cluster → Connect → Connect your application
6. Copy the connection string (looks like: mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/)

---

## Step 3: Set up Gmail App Password
1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Go to Security → App Passwords
4. Create a new app password for "Mail"
5. Copy the 16-character password

---

## Step 4: Configure environment
1. Copy `.env.example` to `.env`
2. Fill in:
   - MONGODB_URI (from Step 2)
   - EMAIL_USER = happy.optics21@gmail.com
   - EMAIL_PASS (from Step 3 — the 16-char app password)
   - JWT_SECRET = any long random string
   - ADMIN_PASSWORD = your chosen admin password
   - FRONTEND_URL = your website URL

---

## Step 5: Install & run locally
```bash
cd happy-optics-backend
npm install
npm run dev
```
Server starts at http://localhost:3000
Admin panel at http://localhost:3000/admin

---

## Step 6: Connect frontend
In your happy-optics-final.html, update the booking form's submit handler:
Change the API_URL to your server URL.

The form already submits to: POST /api/bookings
Fields: firstName, lastName, phone, email, service, date, branch, notes

---

## Step 7: Deploy to Render.com (free hosting)
1. Create account at https://render.com
2. New → Web Service → Connect your GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add all environment variables from your .env file
6. Deploy!

Your API will be at: https://happy-optics-api.onrender.com

---

## Admin Dashboard
URL: https://your-api-url.com/admin
Username: admin (or what you set in ADMIN_USERNAME)
Password: what you set in ADMIN_PASSWORD

### Features:
- View all bookings with filters (status, branch, date, search)
- Confirm / Complete / Cancel bookings
- Auto-sends confirmation email when you confirm a booking
- Statistics: total, pending, confirmed, completed, today's count
- Filter by branch (Main / Gorgorious)
- Auto-refreshes every 60 seconds
- Pagination (15 per page)

---

## API Endpoints
POST   /api/bookings              → Submit new booking
POST   /api/auth/login            → Admin login
GET    /api/admin/bookings        → List bookings (auth required)
GET    /api/admin/bookings/:id    → Single booking (auth required)
PATCH  /api/admin/bookings/:id    → Update status (auth required)
DELETE /api/admin/bookings/:id    → Delete booking (auth required)
GET    /api/admin/stats           → Dashboard stats (auth required)
GET    /health                    → Server health check
