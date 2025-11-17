import React from 'react';

interface LoadingSpinnerProps {
  /**
   * 로딩 텍스트
   * @default '로딩 중...'
   */
  text?: string;

  /**
   * 스피너 크기 ('sm' | 'md' | 'lg')
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-b-2',
  lg: 'h-16 w-16 border-b-3',
};

/**
 * 메인 앱 레이아웃에서 사용하는 로딩 스피너 (헤더 높이 고려)
 *
 * @example
 * ```tsx
 * <MainLoadingSpinner text="업무 배정을 불러오는 중..." />
 * ```
 */
export function MainLoadingSpinner({
  text = '로딩 중...',
  size = 'md',
}: Omit<LoadingSpinnerProps, 'fullScreen' | 'withGradient'>) {
  const spinnerClasses = `animate-spin rounded-full border-primary-600 ${sizeClasses[size]}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <div className={`${spinnerClasses} mx-auto mb-4`}></div>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}
