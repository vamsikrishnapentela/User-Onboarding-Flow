# User Onboarding Flow

A full-stack web application that takes a new user through a seamless, smart, and secure onboarding experience. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Live Demo
- **Frontend (Vercel):** https://user-onboarding-flow.vercel.app/
- **Backend (Render):** https://user-onboarding-flow.onrender.com/

---

## 👨‍💻 Admin Access (For Testing)
To review the fully-featured CRM Admin Dashboard (which includes user statistics and a global Security Audit Activity Log), you can log in using the pre-configured admin account stored in MongoDB Atlas:
- **Email:** `admin@test.com`
- **Password:** `admin@123`

---

## ✨ Features & User Journey
1. **Sign Up:** Users create an account with a name, email, and securely hashed password. *(Auto-login redirects immediately to the next step).*
2. **Payment Simulation:** A simple mock payment step to unlock onboarding.
3. **Onboarding Form:** Data collection for College Name, Graduation Year, and Career Goal.
4. **Dynamic Dashboard:** A welcoming dashboard displaying the user's data, an activity timeline, and their security audit logs.
5. **CRM Admin Panel:** A secure admin route displaying metrics, user tables, and a real-time system activity feed.

---

## 🛡️ Edge Cases Handled
- **Duplicate Email Registration:** Backend prevents and elegantly alerts users if an email is already in use.
- **Direct URL Access Protection:** Unauthenticated users cannot bypass the login screen.
- **Double Payment Prevention:** Users are instantly redirected if they try to access the payment page after already paying.
- **Double Onboarding Prevention:** Users are redirected to the dashboard if they try to submit onboarding again.
- **Session Persistence:** State is securely managed via LocalStorage JWTs. Refreshing the page maintains state securely.
- **User Data Isolation:** The backend explicitly checks the `req.user.id` on every request. Users can absolutely never access each other's data.
- **Token Validation:** Secure routing ensures only valid, unexpired tokens are accepted.

---

## 🚦 Smart Route Protection
Our routing logic is intelligent and context-aware:
- ✓ Cannot access onboarding before payment is complete
- ✓ Cannot access dashboard before onboarding is complete
- ✓ Cannot pay twice (instantly redirected to onboarding)
- ✓ Cannot onboard twice (instantly redirected to dashboard)
- ✓ React Router SPA refresh 404s fixed gracefully via `vercel.json` rewrites.

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite) + Ant Design + React Router DOM
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Security:** bcryptjs (password hashing), jsonwebtoken (JWT auth), CORS

---

## ⚙️ Installation & Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/vamsikrishnapentela/User-Onboarding-Flow.git
cd User-Onboarding-Flow
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder using the provided `.env.example` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

The app will now be running on `http://localhost:5173`.
