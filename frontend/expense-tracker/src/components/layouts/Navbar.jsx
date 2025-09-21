import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  LuSun, 
  LuMoon, 
  LuBell, 
  LuSearch,
  LuMenu,
  LuX,
  LuUser,
  LuSettings,
  LuLogOut
} from 'react-icons/lu';

const Navbar = ({ onMobileMenuToggle, showMotivation }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.success(`Searching for: ${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LuMenu size={20} />
            </button>
          </div>
          {/* Decorative Element if sidebar is collapsed */}
          {showMotivation && (
            <div className="flex flex-col items-center mx-6">
              <div className="w-16 h-2 rounded-full bg-gradient-to-r from-primary-500 via-pink-400 to-yellow-400 mb-1 animate-pulse"></div>
              <span className="text-xs text-gray-500 italic whitespace-nowrap">Keep crushing your goals! 🚀</span>
            </div>
          )}

          {/* Center Section - Search */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Search transactions..."
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <LuSun size={20} /> : <LuMoon size={20} />}
            </button>

            {/* Notifications */}
            <button
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 relative"
              title="Notifications"
            >
              <LuBell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {user ? user.fullName?.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:block">
                  {user ? user.fullName : 'User'}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 z-50 animate-slide-up">
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-600 shadow-lg">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {user ? user.fullName?.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user ? user.fullName : 'User'}
                      </span>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/upload-image')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <LuUser size={16} />
                        Change Photo
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <LuSettings size={16} />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LuLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
