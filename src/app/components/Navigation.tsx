"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check authentication status whenever component mounts or localStorage changes
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const userRole = localStorage.getItem('userRole');
      
      setIsLoggedIn(isAuth);
      setIsAdmin(userRole === 'admin');
    };

    checkAuth();
    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    // Check auth status periodically
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    
    setIsLoggedIn(false);
    setUsername('');
    router.push('/login');
  };

  return (
    <nav className="fixed w-full z-50 bg-[#08040e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            FieldData
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-300">Welcome, {username}</span>
                <button
                  onClick={handleDashboardClick}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}