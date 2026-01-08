// src/components/Auth/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const logoUrl = '/logo.png'; 

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#234388' }}
    >
      <div className="w-full max-w-md p-10 rounded-2xl shadow-xl" style={{ backgroundColor: '#d2d8e3' }}>
        <div className="flex flex-col items-center space-y-2">
          <img
            src={logoUrl}
            alt="PicGallery logo"
            className="h-56 w-auto object-contain"
          />
        </div>

        <div className="mt-8 text-center">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: '#234388' }}
          >
            {title}
          </h2>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;