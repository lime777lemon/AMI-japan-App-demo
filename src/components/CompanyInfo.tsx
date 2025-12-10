interface Officer {
  name: string;
  position: string;
}

interface CompanyData {
  companyName: string;
  legalForm: string;
  establishmentDate: string;
  state: string;
  ein: string;
  einDate: string;
  officers: Officer[];
  businessPurposes: string[];
}

const companyData: CompanyData = {
  companyName: "American Medical Intelligence Inc.",
  legalForm: "Corporation (C-Corp)",
  establishmentDate: "2025年9月16日",
  state: "デラウェア州",
  ein: "39-4387819",
  einDate: "2025年9月17日",
  officers: [
    {
      name: "Alfredo Almeida",
      position: "CEO兼取締役"
    },
    {
      name: "Julian Heppekausen",
      position: "取締役"
    }
  ],
  businessPurposes: [
    "医療ソフトウェア、サーバーアーキテクチャ及びモバイルアプリケーションの開発",
    "AIシステム及びモデルの開発と提供",
    "メディカルクリニック、画像診断クリニックや病院へのソフトウェアの統合と展開",
    "メディカルクリニックや医師へのコンサルティングサービスの提供",
    "前各号に附帯又は関連する一切の事業"
  ]
};

function CompanyInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b-2 border-ami-light-blue">
          会社情報
        </h2>
        
        <div className="space-y-6">
          <InfoCard
            label="会社名"
            value={companyData.companyName}
            icon="🏢"
          />
          
          <InfoCard
            label="法人形態"
            value={companyData.legalForm}
            icon="📋"
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard
              label="設立日"
              value={`${companyData.establishmentDate}（${companyData.state}にて設立）`}
              icon="📅"
            />
            
            <InfoCard
              label="EIN（雇用者識別番号）"
              value={`${companyData.ein}（${companyData.einDate}付でIRSより付与）`}
              icon="🔢"
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🎯</span>
              事業目的（定款上の目的）
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-ami-blue">
              <ol className="space-y-3 list-decimal list-inside">
                {companyData.businessPurposes.map((purpose, index) => (
                  <li key={index} className="text-gray-800 leading-relaxed pl-2">
                    {purpose}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">👥</span>
              役員
            </h3>
            <div className="space-y-4">
              {companyData.officers.map((officer, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-ami-blue hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {officer.name}
                      </p>
                      <p className="text-gray-600 mt-1">{officer.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  label: string;
  value: string;
  icon: string;
}

function InfoCard({ label, value, icon }: InfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
      <div className="flex items-start">
        <span className="text-2xl mr-4">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2">{label}</p>
          <p className="text-lg text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyInfo;

