'use client';

/**
 * 헤더 컴포넌트
 *
 * 햄버거 메뉴 버튼
 */

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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

      {/* 로고 (중앙 또는 좌측) */}
      <div className="flex-1 flex justify-center lg:justify-start lg:ml-4">
        <h1 className="text-xl font-bold text-primary-600">🏠 peaceHub</h1>
      </div>
    </header>
  );
}
