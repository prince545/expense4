# Expense Tracker Application

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB. Track your income and expenses with a beautiful, responsive interface.

## Features

- 🔐 User authentication (register/login)
- 💰 Add and manage income sources
- 💸 Add and manage expenses with categories
- 📊 Dashboard with financial overview
- 📈 Recent transactions display
- 📥 Export data to Excel
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 JWT-based authentication
- 📱 Mobile-friendly design

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- React Icons
- Moment.js
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- ExcelJS (Excel export)
- bcryptjs (password hashing)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd expense
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=8000
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../frontend/expense-tracker
npm install
```

### 4. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:8000`

#### Start Frontend (Terminal 2)
```bash
cd frontend/expense-tracker
npm run dev
```
The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get user info (protected)

### Income
- `POST /api/v1/income/add` - Add income (protected)
- `GET /api/v1/income/get` - Get all income (protected)
- `DELETE /api/v1/income/:id` - Delete income (protected)
- `GET /api/v1/income/downloadexcel` - Download income as Excel (protected)

### Expenses
- `POST /api/v1/expense/add` - Add expense (protected)
- `GET /api/v1/expense/all` - Get all expenses (protected)
- `DELETE /api/v1/expense/:id` - Delete expense (protected)
- `GET /api/v1/expense/download/excel` - Download expenses as Excel (protected)

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard data (protected)

## Project Structure

```
expense/
├── backend/
│   ├── config/
│   │   └── db.js
│   │   
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── expenseController.js
│   │   └── incomeController.js
│   │   
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │   
│   ├── models/
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   └── User.js
│   │   
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── incomeRoutes.js
│   │   
│   ├── uploads/
│   │   
│   ├── .env
│   │   
│   ├── package.json
│   │   
│   └── server.js
│   
└── frontend/
    └── expense-tracker/
        ├── src/
        │   ├── components/
        │   │   
│   │   ├── pages/
        │   │   
│   │   ├── utils/
        │   │   
│   │   ├── context/
        │   │   
│   │   └── hooks/
        │   │   
│   │   ├── package.json
        │   │   
│   │   └── vite.config.js
        │   │   
        └── 