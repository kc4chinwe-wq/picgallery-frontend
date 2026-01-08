import React from 'react';
import ImageCard from './ImageCard';
import { IImage } from '../../types';

interface ImageGridProps {
    images: IImage[];
    onImageUpdate?: (image: IImage) => void;
    isLoading?: boolean;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading = false }) => {
    const getImageUrl = (image: IImage) => {
        if (image.imageUrl) return image.imageUrl;
        if (typeof image.image === 'string') return image.image;
        return 'https://via.placeholder.com/400x300?text=Image+Not+Available';
    };

    // Loading state
    if (isLoading) {
        return (
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
        );
    }

    // No images state
    if (!isLoading && images.length === 0) {
        return (
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover</h1>
                <p className="text-gray-600 mb-8">Explore amazing photos from our community</p>
                
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">📷</div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No images yet</h2>
                    <p className="text-gray-600">Start exploring by uploading your first image</p>
                </div>
            </div>
        );
    }

    // Images loaded successfully
    return (
        <>
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover</h1>
                <p className="text-gray-600">Explore amazing photos from our community</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((image) => (
                    <ImageCard
                        key={image._id}
                        image={image}
                    />
                ))}
            </div>
        </>
    );
};

export default ImageGrid;