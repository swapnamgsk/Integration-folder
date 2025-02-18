"use client";

import { useEffect, useState } from "react";
import { getTestRecords } from "@/lib/actions/plumberActions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ✅ Define the correct type for records
type TestRecordType = {
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

type GroupedRecordType = {
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  startReading?: {
    date: string;
    time: string;
    readingPressure: number;
    image: string;
    _id: string;
  };
  endReading?: {
    date: string;
    time: string;
    readingPressure: number;
    image: string;
    _id: string;
  };
};

export default function RecordsPage() {
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecordType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchAndGroupRecords() {
      try {
        const response = await getTestRecords();
        
        if (!response || !Array.isArray(response)) {
          console.error('Invalid response format:', response);
          setGroupedRecords([]);
          return;
        }

        // Get user info from localStorage
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        // Set admin status
        setIsAdmin(userRole === 'admin');

        // Filter records based on user role and email
        const filteredRecords = userRole === 'admin' 
          ? response // Admin sees all records
          : response.filter((record: TestRecordType) => 
              record.technicianName.toLowerCase() === userEmail?.toLowerCase()
            );

        // Group records by project
        const grouped = filteredRecords.reduce((acc: { [key: string]: GroupedRecordType }, record) => {
          if (!acc[record.projectName]) {
            acc[record.projectName] = {
              projectName: record.projectName,
              locationAddress: record.locationAddress,
              technicianName: record.technicianName,
              floorName: record.floorName,
            };
          }

          const readingData = {
            date: record.date,
            time: record.time,
            readingPressure: record.readingPressure,
            image: record.image,
            _id: record._id,
          };

          if (record.recordType === 'start') {
            acc[record.projectName].startReading = readingData;
          } else {
            acc[record.projectName].endReading = readingData;
          }

          return acc;
        }, {});

        setGroupedRecords(Object.values(grouped));
      } catch (error) {
        console.error('Error fetching records:', error);
        setGroupedRecords([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAndGroupRecords();
  }, []);

  const generatePDF = async () => {
    const pdf = new jsPDF();
    let currentPage = 1;
    let yOffset = 10;
    
    for (const record of groupedRecords) {
      // Add a new page for each record except the first one
      if (currentPage > 1) {
        pdf.addPage();
        yOffset = 10;
      }

      // Add text content
      pdf.setFontSize(16);
      pdf.text(`Project: ${record.projectName}`, 10, yOffset);
      
      pdf.setFontSize(12);
      yOffset += 10;
      pdf.text(`Location: ${record.locationAddress}`, 10, yOffset);
      yOffset += 7;
      pdf.text(`Technician: ${record.technicianName}`, 10, yOffset);
      yOffset += 7;
      pdf.text(`Floor: ${record.floorName}`, 10, yOffset);
      yOffset += 15;

      // Start Reading Section
      if (record.startReading) {
        pdf.setFontSize(14);
        pdf.text('Start Reading', 10, yOffset);
        pdf.setFontSize(12);
        yOffset += 7;
        pdf.text(`Date: ${record.startReading.date}`, 10, yOffset);
        yOffset += 7;
        pdf.text(`Time: ${record.startReading.time}`, 10, yOffset);
        yOffset += 7;
        pdf.text(`Pressure: ${record.startReading.readingPressure} bar`, 10, yOffset);
        yOffset += 15;

        // Add start reading image
        if (record.startReading.image) {
          try {
            const img = new Image();
            img.src = record.startReading.image;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            pdf.addImage(img, 'JPEG', 10, yOffset, 90, 60);
            yOffset += 70;
          } catch (error) {
            console.error('Error adding start reading image:', error);
          }
        }
      }

      // End Reading Section
      if (record.endReading) {
        pdf.setFontSize(14);
        pdf.text('End Reading', 10, yOffset);
        pdf.setFontSize(12);
        yOffset += 7;
        pdf.text(`Date: ${record.endReading.date}`, 10, yOffset);
        yOffset += 7;
        pdf.text(`Time: ${record.endReading.time}`, 10, yOffset);
        yOffset += 7;
        pdf.text(`Pressure: ${record.endReading.readingPressure} bar`, 10, yOffset);
        yOffset += 15;

        // Add end reading image
        if (record.endReading.image) {
          try {
            const img = new Image();
            img.src = record.endReading.image;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            pdf.addImage(img, 'JPEG', 10, yOffset, 90, 60);
          } catch (error) {
            console.error('Error adding end reading image:', error);
          }
        }
      }

      currentPage++;
    }

    // Save the PDF
    const userEmail = localStorage.getItem('userEmail');
    const fileName = isAdmin ? 'all-records.pdf' : `records-${userEmail}.pdf`;
    pdf.save(fileName);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (groupedRecords.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Test Records</h1>
        <div className="p-6 border rounded-lg shadow-lg bg-white">
          <p className="text-gray-600">No projects found. Create a new project to get started!</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdmin ? 'All Records' : 'Your Records'}
        </h1>
        {isAdmin && (
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download All Records PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {groupedRecords.map((record) => (
          <div
            key={record.projectName}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Project name: {record.projectName}
            </h2>
            <p className="text-gray-600 mb-2">
              📍 Location: {record.locationAddress} | 👷 Technician: {record.technicianName}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Start Reading Section */}
              {record.startReading && (
                <div className="border-r pr-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block mb-2">
                    Start Reading
                  </div>
                  <p className="text-gray-500">
                    📅 {record.startReading.date} | ⏰ {record.startReading.time}
                  </p>
                  <p className="text-blue-600 font-medium">
                    🔹 Pressure: {record.startReading.readingPressure} bar
                  </p>
                  {record.startReading.image && (
                    <div className="mt-2">
                      <img
                        src={record.startReading.image}
                        alt="Start Reading"
                        className="w-full h-40 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(record.startReading?.image, "_blank")}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* End Reading Section */}
              {record.endReading && (
                <div className="pl-4">
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm inline-block mb-2">
                    End Reading
                  </div>
                  <p className="text-gray-500">
                    📅 {record.endReading.date} | ⏰ {record.endReading.time}
                  </p>
                  <p className="text-blue-600 font-medium">
                    🔹 Pressure: {record.endReading.readingPressure} bar
                  </p>
                  {record.endReading.image && (
                    <div className="mt-2">
                      <img
                        src={record.endReading.image}
                        alt="End Reading"
                        className="w-full h-40 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(record.endReading?.image, "_blank")}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

