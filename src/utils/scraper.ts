import { Clinic, ScrapingConfig } from '../types/clinic';

/**
 * 注意: ブラウザのCORS制限により、直接的なWebスクレイピングは制限されます。
 * 本番環境では、バックエンドAPI経由でスクレイピングを行うことを推奨します。
 */

export const scrapeClinicData = async (
  config: ScrapingConfig
): Promise<Clinic | null> => {
  try {
    // CORSプロキシを使用（デモ用）
    // 本番環境ではバックエンドAPIを使用してください
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(config.url)}`;
    
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    // HTMLをパース（簡易版）
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    
    const clinic: Clinic = {
      id: Date.now().toString(),
      name: extractText(doc, config.selectors.name) || 'Unknown Clinic',
      address: extractText(doc, config.selectors.address),
      phone: extractText(doc, config.selectors.phone),
      description: extractText(doc, config.selectors.description),
      specialties: extractArray(doc, config.selectors.specialties),
      scrapedAt: new Date().toISOString(),
      sourceUrl: config.url,
    };
    
    return clinic;
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
};

const extractText = (doc: Document, selector?: string): string | undefined => {
  if (!selector) return undefined;
  const element = doc.querySelector(selector);
  return element?.textContent?.trim();
};

const extractArray = (doc: Document, selector?: string): string[] | undefined => {
  if (!selector) return undefined;
  const elements = doc.querySelectorAll(selector);
  return Array.from(elements).map(el => el.textContent?.trim()).filter(Boolean) as string[];
};

/**
 * CSV/JSON形式のデータをインポート
 */
export const importClinicData = (data: any[]): Clinic[] => {
  return data.map((item, index) => ({
    id: item.id || `imported-${Date.now()}-${index}`,
    name: item.name || item['クリニック名'] || item['Clinic Name'] || 'Unknown',
    address: item.address || item['住所'] || item['Address'],
    phone: item.phone || item['電話'] || item['Phone'],
    email: item.email || item['メール'] || item['Email'],
    website: item.website || item['ウェブサイト'] || item['Website'],
    specialties: item.specialties || item['診療科目'] || item['Specialties'] || [],
    description: item.description || item['説明'] || item['Description'],
    openingHours: item.openingHours || item['診療時間'] || item['Opening Hours'],
    services: item.services || item['サービス'] || item['Services'] || [],
    doctors: item.doctors || item['医師'] || item['Doctors'] || [],
    scrapedAt: item.scrapedAt || new Date().toISOString(),
    sourceUrl: item.sourceUrl || item['URL'],
  }));
};

