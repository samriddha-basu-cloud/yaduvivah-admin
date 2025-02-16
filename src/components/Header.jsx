import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';

const Header = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    navigate("/");
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center justify-center w-full md:w-auto">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide text-center md:text-left">
              Admin Dashboard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-900 hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </nav>

          {/* Mobile Logout Button */}
          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 transition-colors duration-200"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={handleCloseModal} 
        onConfirm={handleConfirmLogout} 
      />
    </header>
  );
};

export default Header;