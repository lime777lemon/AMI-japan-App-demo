export type Language = 'ja' | 'en';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    description: string;
  };
  form: {
    title: string;
    patientId: string;
    patientIdPlaceholder: string;
    patientName: string;
    patientNamePlaceholder: string;
    patientWords: string;
    patientWordsPlaceholder: string;
    patientWordsHint: string;
    recordedBy: string;
    recordedByPlaceholder: string;
    submit: string;
    submitting: string;
    required: string;
  };
  list: {
    title: string;
    empty: string;
    emptyDescription: string;
    recordedBy: string;
    delete: string;
    deleteConfirm: string;
    recordsCount: string;
  };
  footer: {
    copyright: string;
  };
  validation: {
    requiredFields: string;
  };
  chatbot: {
    title: string;
    placeholder: string;
    send: string;
    sending: string;
    aiGreeting: string;
    aiResponse: string;
    saveToRecord: string;
    savedToRecord: string;
    patientInfo: string;
    enterPatientInfo: string;
  };
  clinic: {
    title: string;
    search: string;
    searchPlaceholder: string;
    scrape: string;
    scrapeUrl: string;
    scrapeUrlPlaceholder: string;
    import: string;
    importJson: string;
    importCsv: string;
    name: string;
    address: string;
    phone: string;
    website: string;
    specialties: string;
    description: string;
    scrapedAt: string;
    sourceUrl: string;
    delete: string;
    deleteConfirm: string;
    empty: string;
    emptyDescription: string;
    scraping: string;
    scrapingSuccess: string;
    scrapingError: string;
    importSuccess: string;
    importError: string;
  };
}

export const translations: Record<Language, Translations> = {
  ja: {
    header: {
      title: 'AMI Japan カルテ管理システム',
      subtitle: 'American Medical Intelligence Inc.',
      description: '患者の言葉をそのまま記録し、医療従事者全員で共有するプラットフォーム',
    },
    form: {
      title: '患者の言葉をカルテに追記',
      patientId: '患者ID（任意）',
      patientIdPlaceholder: '例: P-001',
      patientName: '患者名（任意）',
      patientNamePlaceholder: '例: 山田 太郎',
      patientWords: '患者の言葉',
      patientWordsPlaceholder: '患者の言葉をそのまま記録してください...',
      patientWordsHint: '患者の言葉をそのまま、編集せずに記録します',
      recordedBy: '記録者名',
      recordedByPlaceholder: '例: 医師 田中',
      submit: 'カルテに追記',
      submitting: '記録中...',
      required: '*',
    },
    list: {
      title: 'カルテ記録一覧',
      empty: 'まだ記録がありません',
      emptyDescription: '患者の言葉を記録すると、ここに表示されます',
      recordedBy: '記録者:',
      delete: '削除',
      deleteConfirm: 'この記録を削除しますか？',
      recordsCount: '件',
    },
    footer: {
      copyright: '© 2025 American Medical Intelligence Inc. All rights reserved.',
    },
    validation: {
      requiredFields: '患者の言葉と記録者名は必須です。',
    },
    chatbot: {
      title: 'AIチャットボット - お話しください',
      placeholder: 'メッセージを入力してください...',
      send: '送信',
      sending: '送信中...',
      aiGreeting: 'こんにちは。どのような症状でお困りですか？お気軽にお話しください。',
      aiResponse: 'ありがとうございます。その症状について詳しく教えていただけますか？',
      saveToRecord: 'カルテに保存',
      savedToRecord: 'カルテに保存しました',
      patientInfo: '患者情報',
      enterPatientInfo: '患者IDと患者名を入力してください（任意）',
    },
    clinic: {
      title: 'クリニックデータ管理',
      search: '検索',
      searchPlaceholder: 'クリニック名、住所、診療科目で検索...',
      scrape: 'Webスクレイピング',
      scrapeUrl: 'URL',
      scrapeUrlPlaceholder: 'https://example.com/clinic',
      import: 'データインポート',
      importJson: 'JSONファイルをインポート',
      importCsv: 'CSVファイルをインポート',
      name: 'クリニック名',
      address: '住所',
      phone: '電話番号',
      website: 'ウェブサイト',
      specialties: '診療科目',
      description: '説明',
      scrapedAt: '取得日時',
      sourceUrl: '元のURL',
      delete: '削除',
      deleteConfirm: 'このクリニックデータを削除しますか？',
      empty: 'クリニックデータがありません',
      emptyDescription: 'Webスクレイピングまたはデータインポートでクリニック情報を追加できます',
      scraping: 'スクレイピング中...',
      scrapingSuccess: 'スクレイピングが完了しました',
      scrapingError: 'スクレイピングに失敗しました。CORS制限の可能性があります。',
      importSuccess: 'データのインポートが完了しました',
      importError: 'データのインポートに失敗しました',
    },
  },
  en: {
    header: {
      title: 'AMI Japan Medical Record System',
      subtitle: 'American Medical Intelligence Inc.',
      description: 'A platform to record patient words as-is and share with all medical staff',
    },
    form: {
      title: 'Add Patient Words to Medical Record',
      patientId: 'Patient ID (Optional)',
      patientIdPlaceholder: 'e.g., P-001',
      patientName: 'Patient Name (Optional)',
      patientNamePlaceholder: 'e.g., John Doe',
      patientWords: 'Patient Words',
      patientWordsPlaceholder: 'Record the patient\'s words as-is...',
      patientWordsHint: 'Record the patient\'s words exactly as spoken, without editing',
      recordedBy: 'Recorded By',
      recordedByPlaceholder: 'e.g., Dr. Tanaka',
      submit: 'Add to Record',
      submitting: 'Recording...',
      required: '*',
    },
    list: {
      title: 'Medical Record List',
      empty: 'No records yet',
      emptyDescription: 'Records will appear here when you add patient words',
      recordedBy: 'Recorded by:',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this record?',
      recordsCount: 'records',
    },
    footer: {
      copyright: '© 2025 American Medical Intelligence Inc. All rights reserved.',
    },
    validation: {
      requiredFields: 'Patient words and recorder name are required.',
    },
    chatbot: {
      title: 'AI Chatbot - Please tell me',
      placeholder: 'Type your message...',
      send: 'Send',
      sending: 'Sending...',
      aiGreeting: 'Hello. What symptoms are you experiencing? Please feel free to tell me.',
      aiResponse: 'Thank you. Could you tell me more about that symptom?',
      saveToRecord: 'Save to Record',
      savedToRecord: 'Saved to record',
      patientInfo: 'Patient Information',
      enterPatientInfo: 'Enter Patient ID and Name (Optional)',
    },
    clinic: {
      title: 'Clinic Data Management',
      search: 'Search',
      searchPlaceholder: 'Search by name, address, specialties...',
      scrape: 'Web Scraping',
      scrapeUrl: 'URL',
      scrapeUrlPlaceholder: 'https://example.com/clinic',
      import: 'Import Data',
      importJson: 'Import JSON File',
      importCsv: 'Import CSV File',
      name: 'Clinic Name',
      address: 'Address',
      phone: 'Phone',
      website: 'Website',
      specialties: 'Specialties',
      description: 'Description',
      scrapedAt: 'Scraped At',
      sourceUrl: 'Source URL',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this clinic data?',
      empty: 'No clinic data',
      emptyDescription: 'Add clinic information by web scraping or data import',
      scraping: 'Scraping...',
      scrapingSuccess: 'Scraping completed successfully',
      scrapingError: 'Scraping failed. CORS restrictions may apply.',
      importSuccess: 'Data import completed successfully',
      importError: 'Data import failed',
    },
  },
};

