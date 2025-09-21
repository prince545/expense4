import React from 'react';
import { LuPiggyBank, LuTrendingUpDown } from 'react-icons/lu';
import Image from '../../assets/images/image2.jpg';

const AuthLayout = ({ children }) => {
  // StatsInfoCard component with matching design
  const StatsInfoCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm bg-white/80">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${color} text-white shadow-md`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">${value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel - Auth Content */}
      <div className="w-full md:w-[55vw] px-6 md:px-16 py-12 flex flex-col">
        <div className="mb-8 flex items-center gap-3">
          <LuPiggyBank className="text-3xl text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">ExpenseTracker</h2>
        </div>
        
        <div className="flex-grow flex items-center">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Financial Clarity Awaits
              </h1>
              <p className="text-gray-600">
                Take control of your spending with our intuitive tools
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Right Panel - Abstract Design with Image and Stats Card */}
      <div className="hidden md:block w-[45vw] h-screen bg-gradient-to-b from-violet-50 to-purple-50 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="w-64 h-64 rounded-[40px] bg-purple-600/10 absolute -top-12 -left-12 rotate-12" />
        <div className="w-72 h-72 rounded-[40px] border-[20px] border-fuchsia-600/15 absolute top-1/4 right-12 -rotate-6" />
        <div className="w-64 h-64 rounded-[40px] bg-violet-500/10 absolute -bottom-12 right-24 rotate-45" />
        
        {/* Content container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 gap-6">
          {/* Image with decorative frame */}
          <div className="relative z-10 w-full max-w-md">
            <img 
              src={Image} 
              alt="Dashboard preview" 
              className="rounded-2xl shadow-xl border-8 border-white/80 transform rotate-1 w-full h-auto"
            />
            {/* Decorative corner accents */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-fuchsia-500 rounded-tr-lg" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-violet-500 rounded-bl-lg" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-lg" />
          </div>
          
          {/* StatsInfoCard */}
          <div className="grid grid-cols-1 z-20 w-full max-w-md">
            <StatsInfoCard
              icon={<LuTrendingUpDown className="text-xl" />}
              label="Track Your Income & Expenses"
              value="430,000"
              color="bg-purple-600"
            />
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-purple-500 rounded-full" />
        <div className="absolute bottom-1/5 right-1/4 w-3 h-3 bg-fuchsia-500 rounded-full" />
        <div className="absolute top-3/4 right-1/2 w-2 h-2 bg-violet-500 rounded-full" />
        <div className="w-24 h-24 rounded-[20px] bg-fuchsia-500/10 absolute top-1/5 right-1/4 rotate-45" />
      </div>
    </div>
  );
};

export default AuthLayout;