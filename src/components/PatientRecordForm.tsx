import { useState } from 'react';
import { PatientRecord } from '../types/patientRecord';
import { saveRecord } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

interface PatientRecordFormProps {
  onRecordAdded: () => void;
}

function PatientRecordForm({ onRecordAdded }: PatientRecordFormProps) {
  const { t } = useLanguage();
  const [patientWords, setPatientWords] = useState('');
  const [recordedBy, setRecordedBy] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📝</span>
        {t.form.title}
      </h2>
      
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

