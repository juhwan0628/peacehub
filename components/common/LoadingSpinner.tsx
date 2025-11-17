import React from 'react';

interface LoadingSpinnerProps {
  /**
   * 로딩 텍스트
   * @default '로딩 중...'
   */
  text?: string;

  /**
   * 전체 화면 사용 여부
   * @default false
   */
  fullScreen?: boolean;

  /**
   * 스피너 크기 ('sm' | 'md' | 'lg')
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 배경 그라데이션 사용 여부 (fullScreen일 때만 적용)
   * @default true
   */
  withGradient?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 border-2',
  md: 'h-12 w-12 border-b-2',
  lg: 'h-16 w-16 border-b-3',
};

/**
 * 공통 로딩 스피너 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <LoadingSpinner text="데이터를 불러오는 중..." />
 *
 * // 전체 화면 로딩
 * <LoadingSpinner fullScreen text="스케줄을 불러오는 중..." />
 *
 * // 크기 조절
 * <LoadingSpinner size="lg" />
 * ```
 */
export default function LoadingSpinner({
  text = '로딩 중...',
  fullScreen = false,
  size = 'md',
  withGradient = true,
}: LoadingSpinnerProps) {
  const spinnerClasses = `animate-spin rounded-full border-primary-600 ${sizeClasses[size]}`;

  const content = (
    <div className="text-center">
      <div className={`${spinnerClasses} mx-auto mb-4`}></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );

  if (fullScreen) {
    const backgroundClasses = withGradient
      ? 'bg-gradient-to-br from-primary-50 to-primary-100'
      : 'bg-white';

    return (
      <div className={`min-h-screen flex items-center justify-center ${backgroundClasses}`}>
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

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

/**
 * 인라인 스피너 (텍스트 옆에 작게 표시)
 *
 * @example
 * ```tsx
 * <button disabled>
 *   <InlineSpinner /> 저장 중...
 * </button>
 * ```
 */
export function InlineSpinner() {
  return (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
  );
}
