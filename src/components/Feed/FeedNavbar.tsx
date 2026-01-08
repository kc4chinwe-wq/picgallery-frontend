import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface FeedNavbarProps {
    username: string;
    onSearch: (query: string) => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

const FeedNavbar: React.FC<FeedNavbarProps> = ({ username, onSearch, onRefresh, isRefreshing = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="fixed top-0 right-0 left-64 z-40 shadow-lg bg-white">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section - Welcome Message */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome, <span className="text-gray-900">{username}</span>
                        </h1>
                    </div>

                    {/* Right Section - Search and Refresh */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            {showSearch ? (
                                <div className="flex items-center rounded-lg shadow-md">
                                    <Search size={18} className="text-gray-400 ml-3" />
                                    <input
                                        type="text"
                                        placeholder="Search by caption or tags..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="px-4 py-2 rounded-lg focus:outline-none text-gray-700 w-64"
                                        autoFocus
                                        onBlur={() => {
                                            if (!searchQuery) setShowSearch(false);
                                        }}
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowSearch(true)}
                                    className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-red"
                                    title="Search"
                                >
                                    <Search size={22} />
                                </button>
                            )}
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className={`p-2 rounded-lg transition-all text-black ${
                                isRefreshing
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-blue-500'
                            }`}
                            title="Refresh feed"
                        >
                            <RefreshCw 
                                size={22} 
                                className={isRefreshing ? 'animate-spin' : ''}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedNavbar;