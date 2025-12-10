import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Clinic } from '../types/clinic';
import { getClinics, saveClinics, deleteClinic, searchClinics } from '../utils/clinicStorage';
import { scrapeClinicData, importClinicData } from '../utils/scraper';

function ClinicDataManager() {
  const { t } = useLanguage();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = () => {
    const allClinics = getClinics();
    if (searchQuery.trim()) {
      setClinics(searchClinics(searchQuery));
    } else {
      setClinics(allClinics);
    }
  };

  useEffect(() => {
    loadClinics();
  }, [searchQuery]);

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      alert(t.clinic.scrapeUrl + ' is required');
      return;
    }

    setIsScraping(true);
    try {
      const clinic = await scrapeClinicData({
        url: scrapeUrl,
        selectors: {
          name: 'h1, .clinic-name, [class*="name"]',
          address: '.address, [class*="address"]',
          phone: '.phone, [class*="phone"]',
          description: '.description, [class*="description"]',
        },
      });

      if (clinic) {
        const clinics = getClinics();
        clinics.unshift(clinic);
        saveClinics(clinics);
        loadClinics();
        alert(t.clinic.scrapingSuccess);
        setScrapeUrl('');
      } else {
        alert(t.clinic.scrapingError);
      }
    } catch (error) {
      console.error(error);
      alert(t.clinic.scrapingError);
    } finally {
      setIsScraping(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let data: any[];

        if (file.name.endsWith('.csv')) {
          data = parseCSV(text);
        } else {
          data = JSON.parse(text);
        }

        const importedClinics = importClinicData(data);
        const existingClinics = getClinics();
        const updatedClinics = [...importedClinics, ...existingClinics];
        saveClinics(updatedClinics);
        loadClinics();
        alert(t.clinic.importSuccess);
        setShowImport(false);
      } catch (error) {
        console.error(error);
        alert(t.clinic.importError);
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.clinic.deleteConfirm)) {
      deleteClinic(id);
      loadClinics();
    }
  };

  const formatDateTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString('ja-JP', {
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
          <span className="mr-2">🏥</span>
          {t.clinic.title}
        </h2>
        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {t.clinic.import}
        </button>
      </div>

      {/* 検索バー */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.clinic.searchPlaceholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
        />
      </div>

      {/* インポートパネル */}
      {showImport && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-gray-700 mb-3">{t.clinic.importJson}</p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileImport}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-ami-blue file:text-white hover:file:bg-ami-light-blue"
          />
        </div>
      )}

      {/* スクレイピングフォーム */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">{t.clinic.scrape}</h3>
        <div className="flex gap-2">
          <input
            type="url"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder={t.clinic.scrapeUrlPlaceholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
            disabled={isScraping}
          />
          <button
            onClick={handleScrape}
            disabled={isScraping || !scrapeUrl.trim()}
            className="px-6 py-2 bg-ami-blue hover:bg-ami-light-blue text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScraping ? t.clinic.scraping : t.clinic.scrape}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          ⚠️ 注意: CORS制限により、一部のサイトはスクレイピングできません。本番環境ではバックエンドAPIを使用してください。
        </p>
      </div>

      {/* クリニック一覧 */}
      {clinics.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t.clinic.empty}</p>
          <p className="text-gray-400 text-sm mt-2">{t.clinic.emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-ami-blue hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{clinic.name}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    {clinic.address && (
                      <div>
                        <span className="font-semibold text-gray-600">{t.clinic.address}:</span>
                        <span className="ml-2 text-gray-800">{clinic.address}</span>
                      </div>
                    )}
                    {clinic.phone && (
                      <div>
                        <span className="font-semibold text-gray-600">{t.clinic.phone}:</span>
                        <span className="ml-2 text-gray-800">{clinic.phone}</span>
                      </div>
                    )}
                    {clinic.website && (
                      <div>
                        <span className="font-semibold text-gray-600">{t.clinic.website}:</span>
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-ami-blue hover:underline"
                        >
                          {clinic.website}
                        </a>
                      </div>
                    )}
                    {clinic.specialties && clinic.specialties.length > 0 && (
                      <div>
                        <span className="font-semibold text-gray-600">{t.clinic.specialties}:</span>
                        <span className="ml-2 text-gray-800">
                          {clinic.specialties.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {clinic.description && (
                    <p className="mt-3 text-gray-700 text-sm">{clinic.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>{t.clinic.scrapedAt}: {formatDateTime(clinic.scrapedAt)}</span>
                    {clinic.sourceUrl && (
                      <span>• {t.clinic.sourceUrl}: 
                        <a href={clinic.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-ami-blue hover:underline">
                          {clinic.sourceUrl}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(clinic.id)}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors p-2"
                  title={t.clinic.delete}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClinicDataManager;

