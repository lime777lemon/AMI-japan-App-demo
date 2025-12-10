export interface Clinic {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  specialties?: string[];
  description?: string;
  scrapedAt: string;
  sourceUrl?: string;
  // 追加のフィールド
  email?: string;
  openingHours?: string;
  services?: string[];
  doctors?: string[];
}

export interface ScrapingConfig {
  url: string;
  selectors: {
    name?: string;
    address?: string;
    phone?: string;
    description?: string;
    specialties?: string;
    [key: string]: string | undefined;
  };
}

