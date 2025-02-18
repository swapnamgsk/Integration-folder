"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../utils/auth';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getUser();
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <div className="space-y-2">
                <p className="text-gray-600">Welcome to your dashboard!</p>
                {/* Add more profile information here */}
              </div>
            </div>

            {/* Activity Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-2">
                <p className="text-gray-600">No recent activity</p>
                {/* Add activity list here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
