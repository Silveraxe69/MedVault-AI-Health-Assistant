import { useState } from 'react';
import { Camera, FileImage, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/useAuth';

interface UploadRecordProps {
  onNavigate: (page: string) => void;
}

export default function UploadRecord({ onNavigate }: UploadRecordProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    'Uploading',
    'Scanning',
    'Reading Report',
    'Extracting Medical Data',
    'Structuring Timeline',
    'Completed'
  ];

  const simulateProcessing = async (recordId: string) => {
    setProcessing(true);

    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const mockData = {
      disease: 'Type 2 Diabetes',
      doctor: 'Dr. Kumar',
      hospital: 'City Care Clinic',
      medicine: 'Metformin 500mg',
      lab_value: 'HbA1c 7.2%',
      is_processed: true
    };

    await supabase
      .from('medical_records')
      .update(mockData)
      .eq('id', recordId);

    await supabase
      .from('health_timeline')
      .insert([{
        user_id: user?.id,
        event_date: new Date().toISOString(),
        event_type: 'Diagnosis',
        title: 'Diabetes Diagnosis',
        description: 'HbA1c level: 7.2%, prescribed Metformin 500mg',
        record_id: recordId
      }]);

    await supabase
      .from('care_reminders')
      .insert([
        {
          user_id: user?.id,
          reminder_type: 'Medicine',
          title: 'Take Metformin',
          description: 'Morning dose - 500mg',
          reminder_time: '8:00 AM'
        },
        {
          user_id: user?.id,
          reminder_type: 'Medicine',
          title: 'Take Metformin',
          description: 'Evening dose - 500mg',
          reminder_time: '8:00 PM'
        }
      ]);

    setProcessing(false);
    setUploadComplete(true);
  };

  const handleFileUpload = async (fileType: string) => {
    if (!user) return;

    setUploading(true);

    const fileName = `${fileType}_report_${Date.now()}.${fileType === 'pdf' ? 'pdf' : 'jpg'}`;

    const { data, error } = await supabase
      .from('medical_records')
      .insert([{
        user_id: user.id,
        file_name: fileName,
        file_type: fileType,
        record_type: 'Lab Report'
      }])
      .select()
      .single();

    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    await simulateProcessing(data.id);
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-3 text-blue-600 mb-8"
          >
            <ArrowLeft size={32} />
            <span className="text-2xl font-medium">Back to Dashboard</span>
          </button>

          <div className="bg-green-100 border-4 border-green-400 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">Upload Complete!</h2>
            <p className="text-xl text-green-700 mb-8">
              Record securely saved in your Health Vault
            </p>
            <p className="text-lg text-gray-700 mb-2">(Prototype Mode)</p>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => onNavigate('records')}
                className="w-full bg-blue-600 text-white py-5 px-6 rounded-xl text-2xl font-bold hover:bg-blue-700"
              >
                View My Records
              </button>
              <button
                onClick={() => {
                  setUploadComplete(false);
                  setProcessingStep(0);
                }}
                className="w-full bg-gray-200 text-gray-900 py-5 px-6 rounded-xl text-2xl font-bold hover:bg-gray-300"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Processing Your Record</h2>

          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div
                key={step}
                className={`p-6 rounded-xl border-4 ${
                  index < processingStep
                    ? 'bg-green-100 border-green-400'
                    : index === processingStep
                    ? 'bg-blue-100 border-blue-400 animate-pulse'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                    index < processingStep
                      ? 'bg-green-600 text-white'
                      : index === processingStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index < processingStep ? '✓' : index + 1}
                  </div>
                  <span className="text-2xl font-medium">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-3 text-blue-600 mb-8"
        >
          <ArrowLeft size={32} />
          <span className="text-2xl font-medium">Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Medical Record</h1>
        <p className="text-xl text-gray-600 mb-8">Choose how you want to upload your medical document</p>

        <div className="space-y-4">
          <button
            onClick={() => handleFileUpload('pdf')}
            disabled={uploading}
            className="w-full bg-red-600 text-white p-8 rounded-2xl flex items-center space-x-6 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FileText size={48} strokeWidth={2.5} />
            <div className="text-left flex-1">
              <div className="text-2xl font-bold">Upload PDF</div>
              <div className="text-lg">Lab reports, prescriptions, etc.</div>
            </div>
          </button>

          <button
            onClick={() => handleFileUpload('image')}
            disabled={uploading}
            className="w-full bg-green-600 text-white p-8 rounded-2xl flex items-center space-x-6 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FileImage size={48} strokeWidth={2.5} />
            <div className="text-left flex-1">
              <div className="text-2xl font-bold">Upload Image</div>
              <div className="text-lg">JPG, PNG photos of documents</div>
            </div>
          </button>

          <button
            onClick={() => handleFileUpload('photo')}
            disabled={uploading}
            className="w-full bg-blue-600 text-white p-8 rounded-2xl flex items-center space-x-6 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Camera size={48} strokeWidth={2.5} />
            <div className="text-left flex-1">
              <div className="text-2xl font-bold">Take Photo</div>
              <div className="text-lg">Capture document with camera</div>
            </div>
          </button>
        </div>

        {uploading && (
          <div className="mt-8 bg-blue-100 border-4 border-blue-400 rounded-xl p-6 text-center">
            <p className="text-2xl font-bold text-blue-800">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
