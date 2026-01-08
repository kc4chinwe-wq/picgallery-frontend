import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600">
                        PicGallery
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;