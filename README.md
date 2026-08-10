# 🗳️ Secure Voting App (MERN Stack)

A robust, full-stack, role-based voting application built using the MERN stack. It features a secure authentication system, a modern glassmorphism UI powered by Tailwind CSS v4, and accurate vote tracking.

## ✨ Features

- **Role-Based Access Control (RBAC):** Distinct permissions and dashboards for **Admins** and **Voters**.
- **Secure Authentication:** JWT-based login and signup using 12-digit Aadhar Card numbers.
- **Admin Panel:** Full CRUD functionality allowing admins to manage candidates (Add, Edit, Delete).
- **Voting System:** Voters can securely cast a single vote for their preferred candidate. Admins are restricted from voting.
- **Live Results:** A dedicated results page displaying real-time voting data, automatically sorted by the highest vote counts.
- **Account Settings:** Secure password update functionality for logged-in users.
- **Modern UI:** A responsive, dark-themed "glassmorphism" design providing a premium user experience.

## 🛠️ Tech Stack

**Frontend:**

- React.js (Vite)
- Tailwind CSS v4
- React Router DOM
- Axios

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Bcrypt (for password hashing)

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed locally or a MongoDB Atlas connection string

### 1. Backend Setup

Navigate to the backend directory and set up the server:

```bash
# Install dependencies
npm install

# Create a .env file and add your configuration
# Example:
# PORT=5001
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key

# Start the backend server
npm run dev
```

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and start the React app:

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
