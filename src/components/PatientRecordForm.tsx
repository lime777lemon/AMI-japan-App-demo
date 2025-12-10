import { useState, useEffect } from 'react';
import { PatientRecord } from '../types/patientRecord';
import { saveRecord, getRecords } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

interface PatientRecordFormProps {
  onRecordAdded: () => void;
}

function PatientRecordForm({ onRecordAdded }: PatientRecordFormProps) {
  const { t, language } = useLanguage();
  const [patientWords, setPatientWords] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatbotHistory, setChatbotHistory] = useState<PatientRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadChatbotHistory = () => {
    const records = getRecords();
    const chatbotRecords = records.filter(r => r.recordedBy === 'AI Chatbot');
    setChatbotHistory(chatbotRecords.slice(0, 5)); // 最新5件
  };

  useEffect(() => {
    loadChatbotHistory();
  }, []);

  // 定期的に履歴を更新（カルテが追加された場合に備えて）
  useEffect(() => {
    const interval = setInterval(() => {
      loadChatbotHistory();
    }, 2000); // 2秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientWords.trim() || !recordedBy.trim()) {
      alert(t.validation.requiredFields);
      return;
    }

    setIsSubmitting(true);

    const newRecord: PatientRecord = {
      id: Date.now().toString(),
      patientWords: patientWords.trim(),
      recordedBy: recordedBy.trim(),
      recordedAt: new Date().toISOString(),
      patientId: patientId.trim() || undefined,
      patientName: patientName.trim() || undefined,
    };

    saveRecord(newRecord);
    onRecordAdded();

    // フォームをリセット
    setPatientWords('');
    setPatientId('');
    setPatientName('');
    setIsSubmitting(false);
  };

  const handleSelectHistory = (record: PatientRecord) => {
    setPatientWords(record.patientWords);
    if (record.patientId) setPatientId(record.patientId);
    if (record.patientName) setPatientName(record.patientName);
    setShowHistory(false);
  };

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">📝</span>
          {t.form.title}
        </h2>
        {chatbotHistory.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-ami-blue hover:bg-ami-light-blue text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {language === 'ja' 
              ? `💬 チャット履歴 (${chatbotHistory.length})`
              : `💬 Chat History (${chatbotHistory.length})`}
          </button>
        )}
      </div>

      {/* チャットボット履歴表示 */}
      {showHistory && chatbotHistory.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-3">
            {language === 'ja' ? 'チャットボットの履歴から選択' : 'Select from Chatbot History'}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {chatbotHistory.map((record) => (
              <div
                key={record.id}
                onClick={() => handleSelectHistory(record)}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:border-ami-blue hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                      {record.patientWords}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDateTime(record.recordedAt)}</span>
                      {record.patientName && (
                        <>
                          <span>•</span>
                          <span>{record.patientName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-ami-blue text-xs font-semibold">
                    {language === 'ja' ? '選択' : 'Select'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="patientId" className="block text-sm font-semibold text-gray-700 mb-2">
              {t.form.patientId}
            </label>
            <input
              type="text"
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
              placeholder={t.form.patientIdPlaceholder}
            />
          </div>
          
          <div>
            <label htmlFor="patientName" className="block text-sm font-semibold text-gray-700 mb-2">
              {t.form.patientName}
            </label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
              placeholder={t.form.patientNamePlaceholder}
            />
          </div>
        </div>

        <div>
          <label htmlFor="patientWords" className="block text-sm font-semibold text-gray-700 mb-2">
            {t.form.patientWords} <span className="text-red-500">{t.form.required}</span>
          </label>
          <textarea
            id="patientWords"
            value={patientWords}
            onChange={(e) => setPatientWords(e.target.value)}
            rows={6}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent resize-none"
            placeholder={t.form.patientWordsPlaceholder}
          />
          <p className="mt-2 text-sm text-gray-500">
            {t.form.patientWordsHint}
          </p>
        </div>

        <div>
          <label htmlFor="recordedBy" className="block text-sm font-semibold text-gray-700 mb-2">
            {t.form.recordedBy} <span className="text-red-500">{t.form.required}</span>
          </label>
          <input
            type="text"
            id="recordedBy"
            value={recordedBy}
            onChange={(e) => setRecordedBy(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
            placeholder={t.form.recordedByPlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ami-blue hover:bg-ami-light-blue text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? t.form.submitting : t.form.submit}
        </button>
      </form>
    </div>
  );
}

export default PatientRecordForm;

