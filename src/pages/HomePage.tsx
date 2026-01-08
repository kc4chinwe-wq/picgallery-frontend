import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import FeedNavbar from '../components/Feed/FeedNavbar';
import ImageGrid from '../components/Feed/ImageGrid';
import { fetchImages } from '../services/api';

const HomePage: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [filteredImages, setFilteredImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Get logged-in user info
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUsername(user.username || 'User');
        
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            setLoading(true);
            const response = await fetchImages();
            setImages(response);
            setFilteredImages(response);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadImages();
        setIsRefreshing(false);
    };

    const handleSearch = (query: string) => {
        if (!query.trim()) {
            setFilteredImages(images);
            return;
        }

        const lowercaseQuery = query.toLowerCase();
        const filtered = images.filter(image =>
            image.caption?.toLowerCase().includes(lowercaseQuery) ||
            image.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
        );
        setFilteredImages(filtered);
    };

    return (
        <DashboardLayout>
            <FeedNavbar 
                username={username}
                onSearch={handleSearch}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
            <div className="pt-24 p-24">
                <ImageGrid images={filteredImages} isLoading={loading} />
            </div>
        </DashboardLayout>
    );
};

export default HomePage;