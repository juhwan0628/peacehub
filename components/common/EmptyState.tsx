import React from 'react';

interface EmptyStateProps {
  /**
   * 메시지 텍스트
   */
  message: string;

  /**
   * 이모지 또는 아이콘
   * @default '📭'
   */
  icon?: string;

  /**
   * 액션 버튼 (선택사항)
   */
  action?: {
    label: string;
    onClick: () => void;
  };

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
    container: 'py-6',
    icon: 'text-3xl',
    message: 'text-sm',
  },
  md: {
    container: 'py-8',
    icon: 'text-4xl',
    message: 'text-base',
  },
  lg: {
    container: 'py-12',
    icon: 'text-5xl',
    message: 'text-lg',
  },
};

/**
 * 빈 상태를 표시하는 공통 컴포넌트
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <EmptyState message="이 날짜에는 배정된 업무가 없습니다" />
 *
 * // 액션 버튼 포함
 * <EmptyState
 *   message="룸메이트를 초대해보세요"
 *   icon="👥"
 *   action={{
 *     label: "초대 코드 복사",
 *     onClick: handleCopy
 *   }}
 * />
 * ```
 */
export default function EmptyState({
  message,
  icon = '📭',
  action,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`text-center ${classes.container} ${className}`}>
      <div className={`${classes.icon} mb-3`}>{icon}</div>
      <p className={`text-gray-500 ${classes.message} mb-4`}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * 카드 스타일의 빈 상태 컴포넌트
 *
 * @example
 * ```tsx
 * <EmptyStateCard message="아직 배정된 업무가 없습니다" />
 * ```
 */
export function EmptyStateCard({
  message,
  icon = '📭',
  action,
  size = 'md',
}: EmptyStateProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <EmptyState message={message} icon={icon} action={action} size={size} />
    </div>
  );
}

/**
 * 리스트 아이템 스타일의 빈 상태
 *
 * @example
 * ```tsx
 * <div className="space-y-2">
 *   {tasks.length === 0 ? (
 *     <EmptyStateListItem message="업무가 없습니다" />
 *   ) : (
 *     tasks.map(task => <TaskItem key={task.id} task={task} />)
 *   )}
 * </div>
 * ```
 */
export function EmptyStateListItem({
  message,
  icon = '📭',
}: Pick<EmptyStateProps, 'message' | 'icon'>) {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center">
      <span className="text-2xl mr-2">{icon}</span>
      <span className="text-gray-500">{message}</span>
    </div>
  );
}
