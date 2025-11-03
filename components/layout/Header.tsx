'use client';

import { useRouter } from 'next/navigation';

/**
 * 헤더 컴포넌트
 *
 * 햄버거 메뉴 버튼, 홈 이동 로고
 */

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center px-4">
      {/* 햄버거 메뉴 버튼 */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="메뉴 열기"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 로고 (중앙 또는 좌측) - 클릭 시 대시보드로 이동 */}
      <div className="flex-1 flex justify-center lg:justify-start lg:ml-4">
        <button
          onClick={handleLogoClick}
          className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          🏠 peaceHub
        </button>
      </div>
    </header>
  );
}
