// src/components/Dashboard/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import ImageUpload from '../Feed/ImageUpload';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.email === 'admin@gmail.com');
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    navigate('/', { replace: true });
  };

  const logoUrl = '/white-logo.png';

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="fixed inset-y-0 left-0 w-64 shadow-lg"
        style={{ backgroundColor: '#234388' }}
      >
        <div className="flex flex-col h-full text-white">
          <div className="flex flex-col items-center p-6 space-y-2">
            <img
              src={logoUrl}
              alt="PicGallery"
              className="h-56 w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#3b5998] text-white'
                    : 'text-gray-200 hover:bg-[#2a4a9e]'
                }`
              }
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home</span>
            </NavLink>

            {/* Show Create Post button only for admin */}
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-200 hover:bg-[#2a4a9e]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Create Post</span>
              </button>
            )}

            {/* Show Profile button only for admin */}
            {isAdmin && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#3b5998] text-white'
                      : 'text-gray-200 hover:bg-[#2a4a9e]'
                  }`
                }
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profile</span>
              </NavLink>
            )}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 m-4 text-red-300 hover:bg-red-900 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="ml-64">{children}</div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold text-gray-900">Create New Post</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <ImageUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;