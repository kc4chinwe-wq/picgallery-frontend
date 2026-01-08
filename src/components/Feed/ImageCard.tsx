import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, X } from 'lucide-react';
import { format } from 'date-fns';
import { IImage } from '../../types';
import { commentOnImage, likeImage } from '../../services/api';

interface ImageCardProps {
    image: IImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(image.likes?.length || 0);
    const [showComments, setShowComments] = useState(false);
    const [showFullView, setShowFullView] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(image.comments || []);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [currentImage, setCurrentImage] = useState(image);
    const [isSubmittingLike, setIsSubmittingLike] = useState(false);

    const formatDate = (date: string) => {
        return format(new Date(date), 'MMM d, yyyy');
    };

    const getImageUrl = () => {
        if (currentImage.imageUrl) return currentImage.imageUrl;
        if (typeof currentImage.image === 'string') return currentImage.image;
        return 'https://via.placeholder.com/400x300?text=Error';
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSubmittingLike) return;

        try {
            setIsSubmittingLike(true);
            // Optimistic update
            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);

            // Call backend API
            const updatedImage = await likeImage(currentImage._id);
            setCurrentImage(updatedImage);
            setLikeCount(updatedImage.likes?.length || 0);
            setIsLiked(true);
        } catch (error: any) {
            // Revert on error
            setIsLiked(prev => !prev);
            setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
            console.error('Error liking image:', error);
            alert(error.message || 'Failed to like image');
        } finally {
            setIsSubmittingLike(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setIsSubmittingComment(true);
            const updatedImage = await commentOnImage(currentImage._id, commentText);
            setComments(updatedImage.comments || []);
            setCommentText('');
            setCurrentImage(updatedImage);
        } catch (error: any) {
            console.error('Error adding comment:', error);
            alert(error.message || 'Failed to add comment');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        setShowFullView(true);
    };

    return (
        <>
            <div 
                onClick={handleCardClick} 
                className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                        src={getImageUrl()}
                        alt={currentImage.caption}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error';
                        }}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Header with user info */}
                    {/* <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div style={{ color: '#234388', border: '1px solid #234388' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {currentImage.uploaderId.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{currentImage.uploaderId.username}</p>
                                <p className="text-xs text-gray-500">{formatDate(currentImage.createdAt)}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 transition">
                            <MoreVertical size={18} />
                        </button>
                    </div> */}

                    {/* Caption */}
                    <div className="mb-4">
                        <p className="text-xs text-gray-600 line-clamp-2">{currentImage.caption}</p>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                            <Heart size={14} className="text-red-500" />
                            <span>{likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle size={14} className="text-blue-500" />
                            <span>{comments?.length || 0}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-around gap-2">
                        <button
                            onClick={handleLike}
                            disabled={isSubmittingLike}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors duration-200 ${
                                isLiked
                                    ? 'bg-red-50 text-red-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                            <span className="text-xs font-medium">{isSubmittingLike ? 'Liking...' : 'Like'}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowComments(!showComments);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <MessageCircle size={18} />
                            <span className="text-xs font-medium">Comment</span>
                        </button>
                        {/* <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200">
                            <Share2 size={18} />
                            <span className="text-xs font-medium">Share</span>
                        </button> */}
                    </div>

                    {/* Comments Section Modal */}
                    {showComments && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowComments(false)}>
                            <div 
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-hidden flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Comments ({comments?.length || 0})</h3>
                                    <button
                                        onClick={() => setShowComments(false)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Comments List */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment: any, index: number) => (
                                            <div key={comment._id || index} className="flex gap-3">
                                                <div style={{ backgroundColor: '#234388' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {(comment.user?.username || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {comment.user?.username || 'Anonymous'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d') : ''}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <MessageCircle size={32} className="mx-auto text-gray-300 mb-2" />
                                            <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Comment Input */}
                                <div className="border-t border-gray-200 p-4">
                                    <form onSubmit={handleAddComment} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={isSubmittingComment}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmittingComment || !commentText.trim()}
                                            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmittingComment ? 'Posting...' : 'Post'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Full View Modal - Bigger with Single Scrollbar */}
            {showFullView && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={() => setShowFullView(false)}>
                    <div 
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[95vh] overflow-y-auto flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowFullView(false)}
                            className="absolute top-4 right-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-2 transition z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Section - Full Width */}
                        <div className="w-full bg-gray-100 flex items-center justify-center py-8">
                            <img
                                src={getImageUrl()}
                                alt={currentImage.caption}
                                className="max-h-96 max-w-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Error';
                                }}
                            />
                        </div>

                        {/* User Info */}
                        <div className="px-8 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div style={{ backgroundColor: '#234388' }} className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {currentImage.uploaderId.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-lg">{currentImage.uploaderId.username}</p>
                                    <p className="text-sm text-gray-500">{formatDate(currentImage.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="px-8 py-6 border-b border-gray-200">
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{currentImage.caption}</p>
                        </div>

                        {/* Engagement Stats */}
                        <div className="px-8 py-4 border-b border-gray-200 flex gap-8 text-base">
                            <div className="flex items-center gap-2">
                                <Heart size={20} className="text-red-500" fill="currentColor" />
                                <span className="font-medium text-gray-900">{likeCount} likes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageCircle size={20} className="text-blue-500" />
                                <span className="font-medium text-gray-900">{comments?.length || 0} comments</span>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="px-8 py-6 space-y-6">
                            {comments && comments.length > 0 ? (
                                comments.map((comment: any, index: number) => (
                                    <div key={comment._id || index} className="flex gap-4">
                                        <div style={{ backgroundColor: '#234388' }} className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {(comment.user?.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="font-semibold text-gray-900">
                                                    {comment.user?.username || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, HH:mm') : ''}
                                                </p>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-lg text-gray-500">No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Sticky */}
                        <div className="sticky bottom-0 px-8 py-4 border-t border-gray-200 flex gap-3 bg-white">
                            <button
                                onClick={handleLike}
                                disabled={isSubmittingLike}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors duration-200 text-base font-medium ${
                                    isLiked
                                        ? 'bg-red-50 text-red-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                                {isSubmittingLike ? 'Liking...' : 'Like'}
                            </button>
                            {/* <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-base font-medium">
                                <Share2 size={20} />
                                Share
                            </button> */}
                        </div>

                        {/* Comment Input - Sticky */}
                        <div className="sticky bottom-16 px-8 py-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleAddComment} className="flex gap-3">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isSubmittingComment}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmittingComment || !commentText.trim()}
                                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingComment ? 'Posting...' : 'Post'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageCard;