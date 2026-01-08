import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../../services/api';

interface ImageUploadProps {
    onUploadSuccess?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
    const [caption, setCaption] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB');
                return;
            }
            setImageFile(file);
            setError('');
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!caption.trim()) {
            setError('Please enter a caption');
            return;
        }
        if (!imageFile) {
            setError('Please select an image');
            return;
        }

        try {
            setIsUploading(true);
            setError('');
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('caption', caption.trim());

            // Upload
            await uploadImage(formData);
            
            // Reset form
            setCaption('');
            setImageFile(null);
            setImagePreview('');
            
            // Callback
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image
                    </label>
                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview('');
                                    setImageFile(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload size={40} className="text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Caption Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caption
                    </label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write a caption for your image..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {caption.length} characters
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading || !imageFile || !caption.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                    {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        'Upload Post'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ImageUpload;