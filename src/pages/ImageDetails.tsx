import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchImageDetails } from '../services/api';
import { IImage, IComment } from '../types';
import Loading from '../components/common/Loading';

const ImageDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [image, setImage] = useState<IImage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            try {
                if (!id) return;
                setLoading(true);
                const data = await fetchImageDetails(id);
                setImage(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch image details');
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [id]);

    const getImageUrl = (image: IImage) => {
        if (image.imageUrl) return image.imageUrl;
        if (typeof image.image === 'string') return image.image;
        return 'https://via.placeholder.com/800x600?text=Image+Not+Available';
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;
    if (!image) return <div className="text-center mt-4">Image not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex justify-center bg-gray-100">
                    <img 
                        src={getImageUrl(image)} 
                        alt={image.caption} 
                        className="max-h-[600px] w-auto object-contain"
                        onError={(e) => {
                            console.error('Image failed to load');
                            e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                        }}
                    />
                </div>
                <div className="p-8">
                    {/* Caption with line breaks preserved */}
                    <h2 className="text-2xl font-bold mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                        {image.caption}
                    </h2>
                    <p className="text-gray-600 mb-2">
                        Uploaded by: {image.uploaderId?.username || 'Unknown User'}
                    </p>
                    <p className="text-gray-600 mb-4">
                        Likes: {image.likes?.length || 0}
                    </p>
                    
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">
                            Comments ({image.comments?.length || 0})
                        </h3>
                        {image.comments && image.comments.length > 0 ? (
                            image.comments.map((comment: IComment) => (
                                <div 
                                    key={comment._id} 
                                    className="bg-gray-50 p-4 rounded-lg mb-2"
                                >
                                    <p className="text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
                                        {comment.text}
                                    </p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        By: {comment.user?.username || 'Unknown User'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageDetails;