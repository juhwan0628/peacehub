import React from 'react';

interface OnboardingProgressProps {
  /**
   * 현재 단계 (1부터 시작)
   */
  currentStep: number;

  /**
   * 전체 단계 수
   */
  totalSteps: number;

  /**
   * 단계별 라벨 (선택사항)
   */
  stepLabels?: string[];

  /**
   * 크기
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 추가 className
   */
  className?: string;
}

const sizeClasses = {
  sm: {
    dot: 'w-2 h-2',
    gap: 'gap-2',
    label: 'text-xs',
  },
  md: {
    dot: 'w-3 h-3',
    gap: 'gap-3',
    label: 'text-sm',
  },
  lg: {
    dot: 'w-4 h-4',
    gap: 'gap-4',
    label: 'text-base',
  },
};

/**
 * 온보딩 프로세스 진행 상태 표시 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용 (점 3개)
 * <OnboardingProgress currentStep={2} totalSteps={3} />
 *
 * // 라벨 포함
 * <OnboardingProgress
 *   currentStep={2}
 *   totalSteps={3}
 *   stepLabels={['프로필', '방 참여', '스케줄']}
 * />
 * ```
 */
export default function OnboardingProgress({
  currentStep,
  totalSteps,
  stepLabels,
  size = 'md',
  className = '',
}: OnboardingProgressProps) {
  const classes = sizeClasses[size];

  // stepLabels가 제공되지 않으면 점만 표시
  if (!stepLabels) {
    return (
      <div className={`flex justify-center items-center ${classes.gap} ${className}`}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div
              key={index}
              className={`${classes.dot} rounded-full transition-colors ${
                isActive
                  ? 'bg-primary-600'
                  : isCompleted
                  ? 'bg-primary-400'
                  : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>
    );
  }

  // 라벨이 있으면 단계와 함께 표시
  return (
    <div className={`${className}`}>
      {/* 점 표시 */}
      <div className={`flex justify-center items-center ${classes.gap} mb-2`}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div
              key={index}
              className={`${classes.dot} rounded-full transition-colors ${
                isActive
                  ? 'bg-primary-600'
                  : isCompleted
                  ? 'bg-primary-400'
                  : 'bg-gray-300'
              }`}
            />
          );
        })}
      </div>

      {/* 라벨 표시 */}
      <div className={`flex justify-center items-center ${classes.gap}`}>
        {stepLabels.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <span
              key={index}
              className={`${classes.label} transition-colors ${
                isActive
                  ? 'text-primary-600 font-semibold'
                  : isCompleted
                  ? 'text-primary-400'
                  : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 숫자 형태의 진행 상태 표시
 *
 * @example
 * ```tsx
 * <NumberedProgress currentStep={2} totalSteps={3} />
 * // 출력: "2 / 3"
 * ```
 */
export function NumberedProgress({
  currentStep,
  totalSteps,
  className = '',
}: Pick<OnboardingProgressProps, 'currentStep' | 'totalSteps' | 'className'>) {
  return (
    <div className={`text-center text-sm text-gray-500 ${className}`}>
      <span className="font-semibold text-primary-600">{currentStep}</span>
      <span className="mx-1">/</span>
      <span>{totalSteps}</span>
    </div>
  );
}

/**
 * 프로그레스 바 형태의 진행 상태
 *
 * @example
 * ```tsx
 * <ProgressBar currentStep={2} totalSteps={3} />
 * ```
 */
export function ProgressBar({
  currentStep,
  totalSteps,
  className = '',
}: Pick<OnboardingProgressProps, 'currentStep' | 'totalSteps' | 'className'>) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-center text-xs text-gray-500 mt-1">
        {currentStep} / {totalSteps}
      </div>
    </div>
  );
}
