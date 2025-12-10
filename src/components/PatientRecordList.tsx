import { PatientRecord } from '../types/patientRecord';
import { deleteRecord } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

interface PatientRecordListProps {
  records: PatientRecord[];
  onRecordDeleted: () => void;
}

function PatientRecordList({ records, onRecordDeleted }: PatientRecordListProps) {
  const { t, language } = useLanguage();
  
  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.list.deleteConfirm)) {
      deleteRecord(id);
      onRecordDeleted();
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          {t.list.title}
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t.list.empty}</p>
          <p className="text-gray-400 text-sm mt-2">{t.list.emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📋</span>
          {t.list.title}
          <span className="ml-3 text-lg font-normal text-gray-500">
            ({records.length} {t.list.recordsCount})
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-ami-blue hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {record.patientName && (
                    <span className="bg-ami-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {record.patientName}
                    </span>
                  )}
                  {record.patientId && (
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                      ID: {record.patientId}
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    {formatDateTime(record.recordedAt)}
                  </span>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {record.patientWords}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold">{t.list.recordedBy}</span>
                  <span className="ml-2">{record.recordedBy}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(record.id)}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors p-2"
                title={t.list.delete}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientRecordList;

