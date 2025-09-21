import React, { useState } from 'react';
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="relative">
        <SideMenu 
          activeMenu={activeMenu} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar onMobileMenuToggle={handleMobileMenuToggle} showMotivation={isCollapsed} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
