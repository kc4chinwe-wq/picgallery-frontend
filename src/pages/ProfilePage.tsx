import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import FeedNavbar from '../components/Feed/FeedNavbar';
import ImageCard from '../components/Feed/ImageCard';
import { fetchUserProfile } from '../services/api';
import { IImage } from '../types';

const ProfilePage: React.FC = () => {
    const [userPosts, setUserPosts] = useState<IImage[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<IImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUsername(user.username || 'User');
        loadUserPosts();
    }, []);

    const loadUserPosts = async () => {
        try {
            setLoading(true);
            const response = await fetchUserProfile();
            setUserPosts(response.posts || []);
            setFilteredPosts(response.posts || []);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await loadUserPosts();
    };

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredPosts(userPosts);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = userPosts.filter(post =>
            post.caption?.toLowerCase().includes(lowercaseQuery)
        );
        setFilteredPosts(filtered);
    };

    return (
        <DashboardLayout>
            <FeedNavbar 
                username={username}
                onSearch={handleSearch}
                onRefresh={handleRefresh}
            />
            <div className="pt-24 p-24">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Posts</h1>
                    <p className="text-gray-600">Manage your shared photos</p>
                </div>

                {/* Loading State with Skeleton Loaders */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg animate-pulse"
                            >
                                {/* Image skeleton */}
                                <div className="h-64 bg-gray-300" />
                                
                                {/* Content skeleton */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                                        <div className="flex-1">
                                            <div className="h-3 bg-gray-300 rounded mb-1" />
                                            <div className="h-2 bg-gray-300 rounded w-20" />
                                        </div>
                                    </div>
                                    
                                    <div className="h-2 bg-gray-300 rounded" />
                                    <div className="h-2 bg-gray-300 rounded w-3/4" />
                                    
                                    <div className="flex gap-2 pt-2">
                                        <div className="h-8 bg-gray-300 rounded flex-1" />
                                        <div className="h-8 bg-gray-300 rounded flex-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📷</div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No posts yet</h2>
                        <p className="text-gray-600">Start by uploading your first photo</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                            <ImageCard
                                key={post._id}
                                image={post}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;