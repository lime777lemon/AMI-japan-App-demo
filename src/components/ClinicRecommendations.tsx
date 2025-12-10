import { Clinic } from '../types/clinic';
import { useLanguage } from '../contexts/LanguageContext';
import { saveClinic } from '../utils/clinicStorage';

interface ClinicRecommendationsProps {
  clinics: Clinic[];
  symptom: string;
  onClinicSaved?: () => void;
}

function ClinicRecommendations({ clinics, symptom, onClinicSaved }: ClinicRecommendationsProps) {
  const { language } = useLanguage();

  if (clinics.length === 0) return null;

  const handleSaveClinic = (clinic: Clinic) => {
    saveClinic(clinic);
    if (onClinicSaved) {
      onClinicSaved();
    }
    alert(language === 'ja' ? 'クリニック情報を保存しました' : 'Clinic information saved');
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-2">🏥</span>
        <h3 className="font-bold text-gray-800">
          {language === 'ja' 
            ? `「${symptom}」に最適なクリニック候補`
            : `Recommended Clinics for "${symptom}"`}
        </h3>
      </div>
      
      <div className="space-y-3">
        {clinics.map((clinic, index) => (
          <div
            key={clinic.id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-ami-blue text-white px-2 py-1 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-lg text-gray-800">{clinic.name}</h4>
                </div>
                
                <div className="space-y-1 text-sm text-gray-700">
                  {clinic.address && (
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">📍</span>
                      <span>{clinic.address}</span>
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">📞</span>
                      <a href={`tel:${clinic.phone}`} className="text-ami-blue hover:underline">
                        {clinic.phone}
                      </a>
                    </div>
                  )}
                  {clinic.specialties && clinic.specialties.length > 0 && (
                    <div className="flex items-start flex-wrap gap-1 mt-2">
                      {clinic.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                  {clinic.description && (
                    <p className="text-gray-600 text-xs mt-2">{clinic.description}</p>
                  )}
                </div>

                {clinic.website && (
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-ami-blue hover:underline text-sm"
                  >
                    🌐 {language === 'ja' ? 'ウェブサイトを見る' : 'Visit Website'}
                  </a>
                )}
              </div>

              <button
                onClick={() => handleSaveClinic(clinic)}
                className="ml-4 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-colors"
                title={language === 'ja' ? '保存' : 'Save'}
              >
                {language === 'ja' ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {language === 'ja'
          ? '※ クリニック情報は参考として表示されています。実際の診療については各クリニックに直接お問い合わせください。'
          : '* Clinic information is displayed for reference. Please contact each clinic directly for actual medical consultation.'}
      </p>
    </div>
  );
}

export default ClinicRecommendations;

