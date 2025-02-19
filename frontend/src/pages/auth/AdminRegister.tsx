import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RegisterFormInputs } from '../../types/auth';

const AdminRegister: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required admin fields
      if (!data.phoneNumber) {
        throw new Error('Phone number is required');
      }
      if (!data.address) {
        throw new Error('Address is required');
      }
      
      const response = await fetch('http://localhost:5000/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
          address: data.address,
          role: 'admin'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      // Store the token and user data
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: result.data._id,
        name: result.data.name,
        email: result.data.email,
        role: result.data.role
      }));

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mb-8">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Your Logo"
          />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Register as Admin
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/admin/login"
              className="font-medium text-emerald-500 hover:text-emerald-400"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Admin Name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number field */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                  type="tel"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Address field */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Address
              </label>
              <div className="mt-1">
                <textarea
                  {...register('address', { required: 'Address is required' })}
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="Your office address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>
                )}
              </div>
            </div>

            {/* Password fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'The passwords do not match',
                  })}
                  type="password"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister; 