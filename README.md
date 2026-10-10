# ដ្រូនកសិកម្មព្រៃតូច (SpraySystem)

Agricultural Drone Spray & Payment Management System built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- **Agricultural Spraying Records**: Track drone spraying operations with area measured in hectares (ហិចតា).
- **Payment & Invoice Management**: Track collected payments, remaining balance due, and partial payments with overpayment protection.
- **Customer Management**: Register farmers and plantation owners with contact details.
- **Mobile Responsive Design**: Fully responsive card layouts and modern drawer navigation for smartphones.
- **Multi-language Support**: Khmer (default) and English.
- **Role-based Authentication**: JWT authentication with user and super admin management.

## Project Structure
```
SpraySystem/
├── client/          # Frontend (React 19, Vite, Tailwind CSS v4)
│   ├── .env.example
│   └── src/
├── server/          # Backend (Node.js, Express, MongoDB Mongoose)
│   ├── .env.example
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── scripts/     # Admin database seed script
└── README.md
```

## Getting Started

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env     # Update your database & secrets
node scripts/seedAdmin.js # Seed default super admin
npm run dev              # or: node server.js
```

### 2. Client Setup
```bash
cd client
npm install
cp .env.example .env     # Configures VITE_API_BASE_URL
npm run dev
```
