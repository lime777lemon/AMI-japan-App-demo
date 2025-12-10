import { useState, useEffect } from 'react';
import Logo from './components/Logo';
import Chatbot from './components/Chatbot';
import PatientRecordForm from './components/PatientRecordForm';
import PatientRecordList from './components/PatientRecordList';
import ClinicDataManager from './components/ClinicDataManager';
import { PatientRecord } from './types/patientRecord';
import { getRecords } from './utils/storage';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const { t, language, setLanguage } = useLanguage();
  const [records, setRecords] = useState<PatientRecord[]>([]);

  const loadRecords = () => {
    setRecords(getRecords());
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <div className="flex gap-2 bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setLanguage('ja')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                language === 'ja'
                  ? 'bg-ami-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              日本語
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-ami-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="large" showText={true} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ami-blue mb-3">
            {t.header.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {t.header.subtitle}
          </p>
          <div className="mt-4 w-24 h-1 bg-ami-light-blue mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">
            {t.header.description}
          </p>
        </header>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <Chatbot onRecordAdded={loadRecords} onClinicSaved={() => {}} />
          <ClinicDataManager />
          <PatientRecordForm onRecordAdded={loadRecords} />
          <PatientRecordList records={records} onRecordDeleted={loadRecords} />
        </div>
        
        <footer className="mt-16 text-center text-gray-600 text-sm">
          <p>{t.footer.copyright}</p>
        </footer>
      </div>
    </div>
  )
}

export default App

