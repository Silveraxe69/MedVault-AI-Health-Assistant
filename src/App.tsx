import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import UploadRecord from './pages/UploadRecord';
import MyRecords from './pages/MyRecords';
import RecordDetail from './pages/RecordDetail';
import HealthTimeline from './pages/HealthTimeline';
import CareReminders from './pages/CareReminders';
import AIHealthAnalysis from './pages/AIHealthAnalysis';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const handleNavigate = (page: string, recordId?: string) => {
    setCurrentPage(page);
    if (recordId) {
      setSelectedRecordId(recordId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'signup') {
      return <SignUp onNavigate={handleNavigate} />;
    } else if (currentPage === 'forgot-password') {
      return <ForgotPassword onNavigate={handleNavigate} />;
    } else {
      return <Login onNavigate={handleNavigate} />;
    }
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard onNavigate={handleNavigate} />;
    case 'upload':
      return <UploadRecord onNavigate={handleNavigate} />;
    case 'records':
      return <MyRecords onNavigate={handleNavigate} />;
    case 'record-detail':
      return selectedRecordId ? (
        <RecordDetail recordId={selectedRecordId} onNavigate={handleNavigate} />
      ) : (
        <Dashboard onNavigate={handleNavigate} />
      );
    case 'timeline':
      return <HealthTimeline onNavigate={handleNavigate} />;
    case 'reminders':
      return <CareReminders onNavigate={handleNavigate} />;
    case 'ai-analysis':
      return <AIHealthAnalysis onNavigate={handleNavigate} />;
    default:
      return <Dashboard onNavigate={handleNavigate} />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
