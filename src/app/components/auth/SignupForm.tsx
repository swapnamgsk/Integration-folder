"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles/signup.css';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { registerUser } from '@/lib/actions/authApi';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      const errorMessage = 'An error occurred during registration';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        {/* Left Section - Welcome Message */}
        <div className="signup-welcome">
          <h1 className="text-white text-5xl font-bold mb-4">
            Welcome<br />back!
          </h1>
          <p className="text-gray-200 text-lg">
            Discover amazing features<br />
            by signing in.
          </p>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="signup-form-section">
          <h2>Sign up</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="signup-input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="signup-input"
                value={formData.username}
                onChange={handleChange}
              />
              <i className="fa fa-user signup-icon"></i>
            </div>

            <div className="signup-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="signup-input"
                value={formData.email}
                onChange={handleChange}
              />
              <i className="fa fa-envelope signup-icon"></i>
            </div>

            <div className="signup-input-wrapper">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="signup-input"
                value={formData.password}
                onChange={handleChange}
              />
              <i className="fa fa-lock signup-icon"></i>
            </div>

            <button type="submit" className="signup-button">
              Sign Up
            </button>

            <Link href="/login" className="signup-link">
              Already have an Account?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}