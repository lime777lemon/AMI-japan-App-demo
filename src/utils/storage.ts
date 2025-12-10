import { PatientRecord } from '../types/patientRecord';

const STORAGE_KEY = 'ami-patient-records';

export const saveRecord = (record: PatientRecord): void => {
  const records = getRecords();
  records.unshift(record); // 最新のものを先頭に追加
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecords = (): PatientRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

