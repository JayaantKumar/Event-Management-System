# Event Management System 

A complete full-stack Event Management System built with the MERN stack (MongoDB, Express, React, Node.js). This application features strict role-based access control (Admin, Vendor, User) and custom UI layouts.

## 🚀 Features

* **Role-Based Authorization:** Secure routing and UI elements restricted by user roles using JWT (JSON Web Tokens).
* **Admin Module:** Manage system maintenance, extend/cancel user memberships, and oversee vendors.
* **Vendor Module:** Vendors can insert new products, manage inventory, and toggle product availability status.
* **User Module:** Browse vendor shops, add items to a shopping cart, simulate checkout, and manage a guest list with RSVP status.
* **Custom UI:** Dual-mode authentication screen matching specific client wireframes, built with Tailwind CSS v4.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS v4, Lucide React, Axios, React Router DOM.
* **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), BcryptJS.
* **Database:** MongoDB Atlas.

## 📂 Project Structure

```text
event-management-system/
├── backend/               # Express server, MongoDB models, APIs
│   ├── config/            # Database connection
│   ├── controllers/       # Route logic (Auth, Admin, Vendor, User)
│   ├── middleware/        # JWT & Role validation
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   └── server.js          # Entry point
└── frontend/              # Vite React app
    ├── src/
    │   ├── components/    # Reusable components & ProtectedRoutes
    │   ├── context/       # AuthContext (State management)
    │   ├── pages/         # Login, Admin, Vendor, and User Dashboards
    │   └── utils/         # Axios interceptors (api.js)

💻 Local Setup Instructions
Clone the repository

Setup Backend:

cd backend

npm install

Create a .env file and add:

Code snippet
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
Start the server: npm run dev

Setup Frontend:

cd frontend

npm install

Start the client: npm run dev
