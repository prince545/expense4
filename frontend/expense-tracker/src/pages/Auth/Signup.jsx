 import React, { useState } from 'react';
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosinstance";
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!fullName.trim()) validationErrors.fullName = "Full name is required";
    if (!validateEmail(email)) validationErrors.email = "Invalid email address";
    if (password.length < 6) validationErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords don't match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password
      });

      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        fullName: response.data.fullName,
        email: response.data.email
      }));

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      
      if (errorMessage.includes('already exists')) {
        setErrors({ email: 'Email is already registered' });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="hidden"
              />
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-purple-500">
                {profilePic ? (
                  <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">+ Photo</span>
                )}
              </div>
            </label>
          </div>

          <Input label="Full Name" type="text" value={fullName} onChange={setFullName} error={errors.fullName} placeholder="John Doe" />
          <Input label="Email Address" type="email" value={email} onChange={setEmail} error={errors.email} placeholder="your@email.com" />
          <Input label="Password" type="password" value={password} onChange={setPassword} error={errors.password} placeholder="••••••••" />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword} placeholder="••••••••" />

          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
