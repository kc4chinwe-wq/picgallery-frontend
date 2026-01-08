import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ImageDetails from './pages/ImageDetails';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            {!isAuthenticated}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/images/:id"
                    element={
                        <ProtectedRoute>
                            <ImageDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;