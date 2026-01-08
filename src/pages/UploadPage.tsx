import React, { useState } from 'react';
import ImageUpload from '../components/Upload/ImageUpload';

const UploadPage: React.FC = () => {
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

    const handleUploadSuccess = () => {
        setUploadSuccess(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
            <ImageUpload onUploadSuccess={handleUploadSuccess} />
            {uploadSuccess && <p className="text-green-500 mt-4">Image uploaded successfully!</p>}
        </div>
    );
};

export default UploadPage;