import React from 'react';

interface PageContainerProps {
  /**
   * 페이지 컨텐츠
   */
  children: React.ReactNode;

  /**
   * 배경 그라데이션 사용 여부
   * @default true
   */
  withGradient?: boolean;

  /**
   * 최대 너비 설정
   * @default 'none' (제한 없음)
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';

  /**
   * 패딩 크기
   * @default 'default'
   */
  padding?: 'none' | 'sm' | 'default' | 'lg';

  /**
   * 추가 className
   */
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  none: '',
};

const paddingClasses = {
  none: '',
  sm: 'px-2 py-4',
  default: 'px-4 py-8',
  lg: 'px-6 py-12',
};

/**
 * 메인 앱 레이아웃 페이지 컨테이너
 *
 * 헤더(h-16) 높이를 고려한 min-height 자동 적용
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <h1>Dashboard</h1>
 *   {/* content *\/}
 * </PageContainer>
 * ```
 */
export default function PageContainer({
  children,
  withGradient = true,
  maxWidth = 'none',
  padding = 'default',
  className = '',
}: PageContainerProps) {
  const backgroundClass = withGradient
    ? 'bg-gradient-to-br from-primary-50 to-primary-100'
    : 'bg-white';

  const maxWidthClass = maxWidthClasses[maxWidth];
  const paddingClass = paddingClasses[padding];

  return (
    <div className={`min-h-[calc(100vh-4rem)] ${backgroundClass} ${paddingClass} ${className}`}>
      {maxWidth !== 'none' ? (
        <div className={`${maxWidthClass} mx-auto`}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/**
 * 온보딩 페이지용 컨테이너 (헤더 없음)
 *
 * @example
 * ```tsx
 * <OnboardingContainer>
 *   <h1>프로필 설정</h1>
 *   {/* content *\/}
 * </OnboardingContainer>
 * ```
 */
export function OnboardingContainer({
  children,
  maxWidth = 'md',
  className = '',
}: Pick<PageContainerProps, 'children' | 'maxWidth' | 'className'>) {
  const maxWidthClass = maxWidthClasses[maxWidth];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12 ${className}`}>
      <div className={`${maxWidthClass} mx-auto`}>
        {children}
      </div>
    </div>
  );
}

/**
 * 섹션 컨테이너 (카드 스타일)
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <SectionContainer>
 *     <h2>할 일</h2>
 *     {/* content *\/}
 *   </SectionContainer>
 * </PageContainer>
 * ```
 */
export function SectionContainer({
  children,
  title,
  className = '',
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
