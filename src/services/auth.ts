import axios from 'axios';
import { AuthResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const signup = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/signup`, { username, email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || 'Signup failed');
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};