"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../utils/auth';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getUser();
    if (user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Stats Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Total Users: 0</p>
                <p className="text-gray-600">Active Users: 0</p>
                {/* Add more admin statistics */}
              </div>
            </div>

            {/* Admin Controls Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
              <div className="space-y-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Manage Users
                </button>
                {/* Add more admin controls */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
