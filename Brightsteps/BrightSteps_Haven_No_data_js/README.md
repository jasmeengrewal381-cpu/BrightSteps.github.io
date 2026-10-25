# BrightSteps Haven — easy project guide

This project uses HTML/CSS/JavaScript concepts with React for the website, and Node.js + Express + MongoDB for the backend.

## Where to find things

- **Navbar/menu:** `frontend/src/components/Layout.jsx` — look for `const links` near the top.
- **Website pages and routes:** `frontend/src/App.jsx`.
- **Website design:** `frontend/src/styles.css` and each page's CSS file.
- **Appointment/contact form saving:** `backend/routes/enquiryRoutes.js`.
- **Admin login, appointments, status changes, contact messages:** `backend/routes/adminRoutes.js`.
- **Appointment emails:** `backend/utils/emailService.js`.
- **MongoDB connection and server:** `backend/server.js`.
- **Environment settings:** create `backend/config.env` by copying `backend/config.env.example` and filling in your own values.
- **Your pictures:** `frontend/src/images/`.

## Start the website

Open two terminals in VS Code.

Terminal 1 — backend:

```bash
cd backend
npm install
npm run dev
```

Terminal 2 — frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend address shown by Vite, usually `http://localhost:5173`.

## Important environment settings

1. Copy `backend/config.env.example` and name the copy `config.env`.
2. Add your MongoDB connection string to `MONGO_URI`.
3. Add your Gmail address, Gmail App Password, and admin email for appointment emails.
4. Set the admin username, password hash, and a private session secret for admin login.
5. Set `CENTRE_ADDRESS` if you want the address included in appointment confirmation emails.

Do not share your real `config.env` file or upload it publicly. It contains private credentials.

## Database collections

- `appointment` stores appointment requests and their status.
- `enquiries` stores contact form messages. Contact form messages are saved to MongoDB only; they do not send email.
