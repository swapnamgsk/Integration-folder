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

    // Validate inputs
    if (!credentials.email || !credentials.password) {
      setError('Please provide both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(credentials);
      
      if (response.success) {
        // Store auth data including email
        localStorage.setItem('token', response.token);
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('username', response.user.username);
        localStorage.setItem('isAuthenticated', 'true');
        
        toast.success('Login successful!');
        
        // Redirect to dashboard instead of landing page
        router.push('/dashboard');
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
      <div className="login-box">
        <div className="login-content">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            
            {error && (
              <div className="error-message text-red-500 mb-4">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <Link href="/signup" className="signup-link">
              Don't have an Account?
            </Link>
          </form>
        </div>

        <div className="login-image">
          <h1 className="text-white text-3xl mb-2">
            Welcome <br />back!
          </h1>
          <p className="text-white">
            Discover amazing features <br />
            by signing in.
          </p>
        </div>
      </div>
    </div>
  );
}