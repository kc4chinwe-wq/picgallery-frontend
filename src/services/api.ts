import axios from 'axios';
import { IImage, IUser } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const fetchImages = async (): Promise<IImage[]> => {
    try {
        const response = await api.get('/api/images');
        return response.data;
    } catch (error: any) {
        console.error('Fetch images error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch images');
    }
};

export const fetchImageDetails = async (id: string): Promise<IImage> => {
  const response = await api.get(`/api/images/${id}`);
  return response.data;
};

export const uploadImage = async (formData: FormData): Promise<IImage> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await axios.post(`${API_URL}/api/images/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Upload error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
};

export const likeImage = async (imageId: string): Promise<IImage> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await axios.post(`${API_URL}/api/images/${imageId}/like`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const image = response.data;
        return {
            ...image,
            imageUrl: `data:${image.image.contentType};base64,${image.image.data}`
        };
    } catch (error: any) {
        console.error('Like error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update like');
    }
};

export const commentOnImage = async (imageId: string, text: string): Promise<IImage> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await api.post(
            `/api/images/${imageId}/comments`,
            { text },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Comment error:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to post comment');
    }
};

export const fetchUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await axios.get(`${API_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Profile error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to load profile');
    }
};