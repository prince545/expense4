import React from 'react';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Home from './pages/Auth/Dashboard/Home';
import Income from './pages/Auth/Dashboard/Income';
import Expense from './pages/Auth/Dashboard/Expense';
import UploadImage from './components/layouts/UploadImage';
import { UserProvider } from './context/userContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// Root component handles redirect based on authentication
const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

// Main App component
const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Router>
          <UserProvider>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/upload-image" element={<UploadImage />} />
            </Routes>
          </UserProvider>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
