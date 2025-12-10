import { Clinic } from '../types/clinic';

const STORAGE_KEY = 'ami-clinics';

export const saveClinic = (clinic: Clinic): void => {
  const clinics = getClinics();
  const existingIndex = clinics.findIndex(c => c.id === clinic.id);
  
  if (existingIndex >= 0) {
    clinics[existingIndex] = clinic; // 更新
  } else {
    clinics.unshift(clinic); // 新規追加
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clinics));
};

export const saveClinics = (clinics: Clinic[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clinics));
};

export const getClinics = (): Clinic[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const deleteClinic = (id: string): void => {
  const clinics = getClinics();
  const filtered = clinics.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const searchClinics = (query: string): Clinic[] => {
  const clinics = getClinics();
  const lowerQuery = query.toLowerCase();
  
  return clinics.filter(clinic => 
    clinic.name.toLowerCase().includes(lowerQuery) ||
    clinic.address?.toLowerCase().includes(lowerQuery) ||
    clinic.specialties?.some(s => s.toLowerCase().includes(lowerQuery)) ||
    clinic.description?.toLowerCase().includes(lowerQuery)
  );
};

