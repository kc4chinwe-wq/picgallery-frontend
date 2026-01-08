import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link to="/">PicGallery</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/upload">Upload</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;