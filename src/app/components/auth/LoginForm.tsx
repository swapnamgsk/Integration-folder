"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles/login.css';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { loginUser } from '@/lib/actions/authApi';

export default function LoginForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!credentials.email || !credentials.password) {
      setError('Please provide both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(credentials);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful!');
        
        if (response.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(response.message || 'Login failed');
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      setError('An error occurred during login');
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <form onSubmit={handleSubmit} className="w-80">
            <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
            
            {error && (
              <div className="error-message text-red-500 mb-4">
                {error}
              </div>
            )}

            <div className="login-input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="login-input"
                placeholder="Email"
                required
              />
              <label htmlFor="email" className="login-label">
                Email
              </label>
            </div>

            <div className="login-input-container">
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="login-input"
                placeholder="Password"
                required
              />
              <label htmlFor="password" className="login-label">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <Link href="/signup" className="login-link">
              Don't have an Account?
            </Link>
          </form>
        </div>

        <div className="login-welcome">
          <h1 className="text-white text-3xl mb-2">
            Welcome <br />back!
          </h1>
          <p className="text-white text-sm opacity-80">
            Discover amazing features <br />
            by signing in.
          </p>
        </div>
      </div>
    </div>
  );
}
