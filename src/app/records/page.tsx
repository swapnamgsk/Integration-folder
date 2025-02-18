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

  useEffect(() => {
    async function fetchAndGroupRecords() {
      const records = await getTestRecords();
      
      // Group records by project
      const grouped = records.reduce((acc: { [key: string]: GroupedRecordType }, record) => {
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
    }

    fetchAndGroupRecords();
  }, []);

  const generatePDF = async (recordId: string) => {
    const element = document.getElementById(`record-${recordId}`);
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    
    pdf.text("Test Record Details", 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 180, 120);
    pdf.save(`record_${recordId}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Test Records
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {groupedRecords.map((record) => (
          <div
            key={record.projectName}
            id={`record-${record.startReading?._id || record.endReading?._id}`}
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

            <button
              onClick={() => generatePDF(record.startReading?._id || record.endReading?._id || '')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

