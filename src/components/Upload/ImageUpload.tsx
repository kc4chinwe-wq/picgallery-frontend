import React, { useState } from 'react';
import { uploadImage } from '../../services/api';

interface ImageUploadProps {
    onUploadSuccess: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select an image');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('caption', caption);

            await uploadImage(formData);
            onUploadSuccess();
            setFile(null);
            setCaption('');
        } catch (err: any) {
            setError(err.message || 'Failed to upload image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500">{error}</div>}
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Select Image
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full"
                    required
                />
            </div>
            <div>
                <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
                    Caption
                </label>
                <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={!file || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default ImageUpload;