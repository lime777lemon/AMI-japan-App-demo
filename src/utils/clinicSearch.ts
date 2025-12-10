import { Clinic } from '../types/clinic';

/**
 * 症状から適切な診療科目を判断
 */
export const analyzeSymptom = (symptom: string): string[] => {
  const lowerSymptom = symptom.toLowerCase();
  const specialties: string[] = [];

  // 痛み関連
  if (lowerSymptom.includes('頭痛') || lowerSymptom.includes('headache')) {
    specialties.push('神経内科', '脳神経外科', '内科');
  }
  if (lowerSymptom.includes('腹痛') || lowerSymptom.includes('stomach') || lowerSymptom.includes('abdominal')) {
    specialties.push('消化器内科', '内科', '胃腸科');
  }
  if (lowerSymptom.includes('腰痛') || lowerSymptom.includes('back pain') || lowerSymptom.includes('腰')) {
    specialties.push('整形外科', 'リハビリテーション科', 'ペインクリニック');
  }
  if (lowerSymptom.includes('関節痛') || lowerSymptom.includes('joint pain')) {
    specialties.push('整形外科', 'リウマチ科', 'リハビリテーション科');
  }

  // 発熱・風邪関連
  if (lowerSymptom.includes('熱') || lowerSymptom.includes('fever') || lowerSymptom.includes('発熱')) {
    specialties.push('内科', '小児科', '感染症内科');
  }
  if (lowerSymptom.includes('咳') || lowerSymptom.includes('cough') || lowerSymptom.includes('くしゃみ')) {
    specialties.push('呼吸器内科', '内科', 'アレルギー科');
  }
  if (lowerSymptom.includes('鼻水') || lowerSymptom.includes('鼻づまり') || lowerSymptom.includes('runny nose')) {
    specialties.push('耳鼻咽喉科', 'アレルギー科', '内科');
  }

  // 皮膚関連
  if (lowerSymptom.includes('かゆみ') || lowerSymptom.includes('発疹') || lowerSymptom.includes('rash') || lowerSymptom.includes('itch')) {
    specialties.push('皮膚科', 'アレルギー科');
  }

  // 目関連
  if (lowerSymptom.includes('目') || lowerSymptom.includes('眼') || lowerSymptom.includes('eye') || lowerSymptom.includes('視力')) {
    specialties.push('眼科');
  }

  // 歯関連
  if (lowerSymptom.includes('歯') || lowerSymptom.includes('tooth') || lowerSymptom.includes('歯茎')) {
    specialties.push('歯科', '口腔外科');
  }

  // 心臓・循環器
  if (lowerSymptom.includes('胸痛') || lowerSymptom.includes('動悸') || lowerSymptom.includes('chest pain') || lowerSymptom.includes('heart')) {
    specialties.push('循環器内科', '心臓血管外科', '内科');
  }

  // 精神・心理
  if (lowerSymptom.includes('うつ') || lowerSymptom.includes('不安') || lowerSymptom.includes('depression') || lowerSymptom.includes('anxiety') || lowerSymptom.includes('ストレス')) {
    specialties.push('精神科', '心療内科', 'メンタルクリニック');
  }

  // 婦人科
  if (lowerSymptom.includes('生理') || lowerSymptom.includes('月経') || lowerSymptom.includes('menstrual') || lowerSymptom.includes('婦人科')) {
    specialties.push('婦人科', '産婦人科');
  }

  // 小児
  if (lowerSymptom.includes('子供') || lowerSymptom.includes('小児') || lowerSymptom.includes('child') || lowerSymptom.includes('baby')) {
    specialties.push('小児科', '小児外科');
  }

  // デフォルト
  if (specialties.length === 0) {
    specialties.push('内科', '総合診療科');
  }

  // 重複を削除
  return [...new Set(specialties)];
};

/**
 * 診療科目に基づいてクリニックを検索
 */
export const searchClinicsBySpecialty = (
  clinics: Clinic[],
  specialties: string[]
): Clinic[] => {
  if (specialties.length === 0) return clinics;

  return clinics.filter(clinic => {
    const clinicSpecialties = clinic.specialties || [];
    return specialties.some(specialty =>
      clinicSpecialties.some(cs =>
        cs.toLowerCase().includes(specialty.toLowerCase()) ||
        specialty.toLowerCase().includes(cs.toLowerCase())
      )
    );
  });
};

/**
 * クリニック検索エンジンからスクレイピング（デモ用）
 * 実際の実装では、Google Maps API、医療機関検索サイトのAPIなどを使用
 */
export const scrapeClinicsFromWeb = async (
  specialty: string,
  location?: string
): Promise<Clinic[]> => {
  // デモ用のモックデータ
  // 実際の実装では、医療機関検索サイト（例: 病院検索、クリニック検索サイト）をスクレイピング
  const mockClinics: Clinic[] = [
    {
      id: `clinic-${Date.now()}-1`,
      name: `${specialty}専門クリニック`,
      address: location || '東京都渋谷区',
      phone: '03-1234-5678',
      website: 'https://example.com/clinic1',
      specialties: [specialty],
      description: `${specialty}の専門治療を行っています。`,
      scrapedAt: new Date().toISOString(),
      sourceUrl: 'https://example.com/search',
    },
    {
      id: `clinic-${Date.now()}-2`,
      name: `総合${specialty}クリニック`,
      address: location || '東京都新宿区',
      phone: '03-2345-6789',
      website: 'https://example.com/clinic2',
      specialties: [specialty, '内科'],
      description: `経験豊富な医師による${specialty}治療を提供しています。`,
      scrapedAt: new Date().toISOString(),
      sourceUrl: 'https://example.com/search',
    },
  ];

  // 実際のスクレイピング処理（デモ用に遅延を追加）
  await new Promise(resolve => setTimeout(resolve, 1500));

  return mockClinics;
};

/**
 * 複数の診療科目に対応するクリニックを検索
 */
export const findBestClinics = async (
  symptom: string,
  existingClinics: Clinic[],
  location?: string
): Promise<Clinic[]> => {
  // 症状から診療科目を分析
  const specialties = analyzeSymptom(symptom);

  // 既存のクリニックデータから検索
  const matchedClinics = searchClinicsBySpecialty(existingClinics, specialties);

  // 既存データに十分な候補がない場合、Webからスクレイピング
  if (matchedClinics.length < 3) {
    const scrapedClinics = await Promise.all(
      specialties.slice(0, 2).map(specialty =>
        scrapeClinicsFromWeb(specialty, location)
      )
    );
    return [...matchedClinics, ...scrapedClinics.flat()].slice(0, 5);
  }

  return matchedClinics.slice(0, 5);
};

