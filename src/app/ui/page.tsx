'use client';

import { useState, useEffect } from 'react';
import { createCrud, getRecordsByProjectName } from '@/lib/actions/plumberActions';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type ProjectWithStartReading = {
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  startReading: {
    readingPressure: number;
    date: string;
  };
};

export default function PostingForm({ onRecordCreated }: { onRecordCreated: () => void }) {
  const router = useRouter();
  const [projectsWithStartOnly, setProjectsWithStartOnly] = useState<ProjectWithStartReading[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    projectName: '',
    locationAddress: '',
    technicianName: '',
    floorName: '',
    readingPressure: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  // Fetch projects that have only start readings
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const startReadings = await getRecordsByProjectName('start');
        const endReadings = await getRecordsByProjectName('end');

        if (startReadings.success && endReadings.success) {
          const endReadingProjects = new Set(endReadings.cruds.map((crud: any) => crud.projectName));
          const projectsNeedingEnd = startReadings.cruds.filter(
            (crud: any) => !endReadingProjects.has(crud.projectName)
          );

          setProjectsWithStartOnly(projectsNeedingEnd);

          if (projectsNeedingEnd.length === 1) {
            const project = projectsNeedingEnd[0];
            setFormData({
              projectName: project.projectName,
              locationAddress: project.locationAddress,
              technicianName: project.technicianName,
              floorName: project.floorName,
              readingPressure: '',
              date: format(new Date(), 'yyyy-MM-dd'),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setMessage('Failed to load projects');
      }
    };

    fetchProjects();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('❌ Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result as string;
      const currentTime = format(new Date(), 'HH:mm');

      const result = await createCrud(
        formData.projectName,
        formData.locationAddress,
        formData.technicianName,
        formData.floorName,
        projectsWithStartOnly.length === 0 ? 'start' : 'end', // Determine record type based on existing projects
        formData.date,
        currentTime,
        Number(formData.readingPressure),
        imageData
      );

      if (result.success) {
        setMessage(`✅ ${projectsWithStartOnly.length === 0 ? 'Start' : 'End'} reading recorded successfully!`);
        if (onRecordCreated) onRecordCreated();
        setTimeout(() => {
          router.push('/records');
        }, 1000);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const renderStartReadingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Start New Project Reading</h2>
      
      <input
        type="text"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Location Address"
        value={formData.locationAddress}
        onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Technician Name"
        value={formData.technicianName}
        onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Floor Name"
        value={formData.floorName}
        onChange={(e) => setFormData({ ...formData, floorName: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="number"
        placeholder="Start Reading Pressure"
        value={formData.readingPressure}
        onChange={(e) => setFormData({ ...formData, readingPressure: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <div className="space-y-2">
        <label className="block">Upload Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="w-full p-2 border rounded"
          required 
        />
        {previewImage && (
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Start Reading
      </button>

      {message && (
        <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );

  const renderEndReadingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Record End Reading</h2>

      {projectsWithStartOnly.length > 1 ? (
        <select
          value={formData.projectName}
          onChange={(e) => {
            const selectedProject = projectsWithStartOnly.find(
              p => p.projectName === e.target.value
            );
            if (selectedProject) {
              setFormData({
                ...formData,
                projectName: selectedProject.projectName,
                locationAddress: selectedProject.locationAddress,
                technicianName: selectedProject.technicianName,
                floorName: selectedProject.floorName,
              });
            }
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Project</option>
          {projectsWithStartOnly.map((project) => (
            <option key={project.projectName} value={project.projectName}>
              {project.projectName}
            </option>
          ))}
        </select>
      ) : (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold">Project Details:</h3>
          <p>Project: {formData.projectName}</p>
          <p>Location: {formData.locationAddress}</p>
          <p>Technician: {formData.technicianName}</p>
          <p>Floor: {formData.floorName}</p>
        </div>
      )}

      <input
        type="number"
        placeholder="End Reading Pressure"
        value={formData.readingPressure}
        onChange={(e) => setFormData({ ...formData, readingPressure: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />

      <div className="space-y-2">
        <label className="block">Upload Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="w-full p-2 border rounded"
          required 
        />
        {previewImage && (
          <img 
            src={previewImage} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <button 
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit End Reading
      </button>

      {message && (
        <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );

  // Render the appropriate form based on whether there are projects needing end readings
  return projectsWithStartOnly.length === 0 ? renderStartReadingForm() : renderEndReadingForm();
}