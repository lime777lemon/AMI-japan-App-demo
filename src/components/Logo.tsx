import { useLanguage } from '../contexts/LanguageContext';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

function Logo({ size = 'medium', showText = true }: LogoProps) {
  const { language } = useLanguage();
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const textSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-3">
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* メディカルクロス（医療のシンボル） */}
        <circle cx="50" cy="50" r="45" fill="#1e40af" />
        <path
          d="M50 25 L50 75 M30 50 L70 50"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* AIを表す波線 */}
        <path
          d="M25 35 Q35 30, 45 35 T65 35"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M25 65 Q35 60, 45 65 T65 65"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-ami-blue ${textSizes[size]}`}>
            AMI
          </span>
          <span className="text-xs text-gray-600 font-semibold">
            {language === 'ja' ? 'ジャパン' : 'JAPAN'}
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

