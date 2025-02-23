"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PostingForm from '../ui/page';
import { getTestRecords } from "@/lib/actions/plumberActions";
import { isAuthenticated, getUserRole } from '@/lib/actions/authApi';

type TestRecord = {
  _id: string;
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  recordType: "start" | "end";
  date: string;
  time: string;
  readingPressure: number;
  image: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleRecordCreated = async () => {
    // Refresh records after new record is created
    const response = await getTestRecords();
    if (response.success) {
      if (isAdmin) {
        setRecords(response.cruds);
      } else {
        const userEmail = localStorage.getItem('userEmail');
        const userRecords = response.cruds.filter(
          (record: TestRecord) => record.technicianName === userEmail
        );
        setRecords(userRecords);
      }
    }
  };

  useEffect(() => {
    const checkAuthAndFetchRecords = async () => {
      try {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        if (!isAuth) {
          router.push('/login');
          return;
        }

        const userEmail = localStorage.getItem('userEmail');
        const response = await getTestRecords();
        
        if (response.success) {
          const userRecords = response.cruds.filter(
            (record: TestRecord) => record.technicianName === userEmail
          );
          setRecords(userRecords);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchRecords();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
        </h1>
        
        {/* New Project Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <PostingForm onRecordCreated={handleRecordCreated} />
        </div>

        {/* Records List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isAdmin ? 'All Records' : 'Your Records'}
          </h2>
          <div className="grid gap-6">
            {records.map((record) => (
              <div key={record._id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{record.projectName}</h3>
                <p>Location: {record.locationAddress}</p>
                <p>Technician: {record.technicianName}</p>
                <p>Floor: {record.floorName}</p>
                <p>Reading Type: {record.recordType}</p>
                <p>Pressure: {record.readingPressure}</p>
                <p>Date: {record.date} {record.time}</p>
                {record.image && (
                  <img 
                    src={record.image} 
                    alt="Record" 
                    className="w-32 h-32 object-cover mt-2 rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
