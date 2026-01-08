// src/components/Auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import AuthLayout from './AuthLayout';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    }
  };

  return (
    <AuthLayout title="Welcome back">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-600 text-center text-sm font-medium">{error}</p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#234388] focus:outline-none focus:ring-2 focus:ring-[#234388] focus:ring-offset-1 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#234388] focus:outline-none focus:ring-2 focus:ring-[#234388] focus:ring-offset-1 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl px-4 py-3 text-white font-semibold transition hover:bg-[#1a3370] focus:outline-none focus:ring-2 focus:ring-[#234388] focus:ring-offset-2"
          style={{ backgroundColor: '#234388' }}
        >
          Sign in
        </button>
      </form>

      <div className="mt-8 text-center">
        <span className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="font-medium text-[#234388] hover:text-[#1a3370] transition"
          >
            Sign up
          </a>
        </span>
      </div>
    </AuthLayout>
  );
};

export default Login;