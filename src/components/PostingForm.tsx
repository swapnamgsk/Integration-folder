'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createCrud } from '@/lib/actions/plumberActions'

export default function PostingForm({ onRecordCreated }: { onRecordCreated: () => void }) {
  const [formData, setFormData] = useState({
    technicianName: '',
    floorName: '',
    recordType: 'start' as 'start' | 'end',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'hh:mm a'),
    readingPressure: '',
    pipingImageUrl: ''
  })
  const [message, setMessage] = useState('')

  // Update time every second with AM/PM
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setFormData(prev => ({
        ...prev,
        time: format(now, 'hh:mm a'),
        date: format(now, 'yyyy-MM-dd')
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = new Date()
    const currentDate = format(now, 'yyyy-MM-dd')
    const currentTime = format(now, 'hh:mm a')

    const response = await createCrud(
      formData.technicianName,
      formData.floorName,
      formData.recordType,
      currentDate,
      currentTime,
      Number(formData.readingPressure),
      formData.pipingImageUrl
    )

    if (response.success) {
      setMessage(`✅ ${formData.recordType.toUpperCase()} record created at ${currentTime}`)
      setFormData(prev => ({
        technicianName: '',
        floorName: '',
        recordType: prev.recordType,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'hh:mm a'),
        readingPressure: '',
        pipingImageUrl: ''
      }))
      onRecordCreated()
    } else {
      setMessage('❌ Failed to create record')
    }
  }

  const handleRecordTypeChange = (type: 'start' | 'end') => {
    const now = new Date()
    setFormData(prev => ({
      ...prev,
      recordType: type,
      time: format(now, 'hh:mm a'),
      date: format(now, 'yyyy-MM-dd')
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#150D29] p-8 rounded-xl shadow-2xl border border-[#4A2189] backdrop-blur-lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-[#8540EC] to-[#4A2189] bg-clip-text text-transparent">
            Create New Record
          </h2>
          <div className="p-3 rounded-lg bg-[#1A1033] border border-[#4A2189]">
            <div className="text-sm font-medium text-gray-300">
              {format(new Date(), 'MMMM dd, yyyy')}
            </div>
            <div className="text-lg font-bold text-white">
              {format(new Date(), 'hh:mm a')}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Technician Name</label>
              <input
                type="text"
                placeholder="Enter technician name"
                value={formData.technicianName}
                onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
                className="w-full p-4 rounded-lg bg-[#1A1033] border border-[#4A2189] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8540EC] focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Floor Name</label>
              <input
                type="text"
                placeholder="Enter floor name"
                value={formData.floorName}
                onChange={(e) => setFormData({...formData, floorName: e.target.value})}
                className="w-full p-4 rounded-lg bg-[#1A1033] border border-[#4A2189] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8540EC] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Record Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRecordTypeChange('start')}
                className={`p-4 rounded-lg border ${
                  formData.recordType === 'start'
                    ? 'bg-green-600 border-green-500 text-white'
                    : 'bg-[#1A1033] border-[#4A2189] text-gray-300'
                } hover:bg-opacity-80 transition-all`}
              >
                Start Record
              </button>
              <button
                type="button"
                onClick={() => handleRecordTypeChange('end')}
                className={`p-4 rounded-lg border ${
                  formData.recordType === 'end'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-[#1A1033] border-[#4A2189] text-gray-300'
                } hover:bg-opacity-80 transition-all`}
              >
                End Record
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Reading Pressure (PSI)</label>
            <input
              type="number"
              placeholder="Enter pressure reading"
              value={formData.readingPressure}
              onChange={(e) => setFormData({...formData, readingPressure: e.target.value})}
              className="w-full p-4 rounded-lg bg-[#1A1033] border border-[#4A2189] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8540EC] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Piping Image URL</label>
            <input
              type="text"
              placeholder="Enter image URL"
              value={formData.pipingImageUrl}
              onChange={(e) => setFormData({...formData, pipingImageUrl: e.target.value})}
              className="w-full p-4 rounded-lg bg-[#1A1033] border border-[#4A2189] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8540EC] focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-[#8540EC] to-[#4A2189] text-white rounded-lg font-medium hover:opacity-90 transform hover:scale-[0.99] transition-all duration-200 focus:ring-2 focus:ring-[#8540EC] focus:ring-offset-2 focus:ring-offset-[#150D29]"
          >
            Save Record
          </button>
        </form>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-600/20 border-green-500' : 'bg-red-600/20 border-red-500'
        } border text-white text-center animate-fade-in`}>
          {message}
        </div>
      )}
    </div>
  )
} 