/**
 * 시간대 색상 상수 (통합)
 *
 * TimelineBar, WeeklyGrid, CombinedTimelineBar 등에서 공통으로 사용하는
 * 시간대별 색상 정의
 */

import type { TimeSlot } from '@/types';

/**
 * TimeSlot별 배경 색상 클래스
 *
 * - quiet (조용시간): 어두운 회색 (bg-gray-600)
 * - out (외출/바쁨): 빨간색 (bg-red-400)
 * - null (비는 시간/TASK 가능): 연한 회색 (bg-gray-100)
 * - task (실제 배정된 업무): 초록색 (bg-green-500)
 */
export const TIME_SLOT_COLORS: Record<string, string> = {
  quiet: 'bg-gray-600',
  out: 'bg-red-400',
  free: 'bg-gray-100', // null TimeSlot (비는 시간)
  task: 'bg-green-500', // 실제 배정된 업무
} as const;

/**
 * TimeSlot → 색상 클래스 매핑 함수
 * @param slot TimeSlot ('quiet' | 'out' | null)
 * @returns Tailwind 색상 클래스
 */
export function getTimeSlotColor(slot: TimeSlot): string {
  if (slot === 'quiet') return TIME_SLOT_COLORS.quiet;
  if (slot === 'out') return TIME_SLOT_COLORS.out;
  return TIME_SLOT_COLORS.free;
}

/**
 * TimeSlot 라벨
 */
export const TIME_SLOT_LABELS: Record<string, string> = {
  quiet: '조용시간',
  out: '외출',
  free: '비는 시간',
  task: '업무',
} as const;

/**
 * 레전드(범례) 표시용 TimeSlot 정보
 */
export const TIME_SLOT_LEGEND = [
  { key: 'quiet', color: TIME_SLOT_COLORS.quiet, label: TIME_SLOT_LABELS.quiet },
  { key: 'out', color: TIME_SLOT_COLORS.out, label: TIME_SLOT_LABELS.out },
  { key: 'task', color: TIME_SLOT_COLORS.task, label: TIME_SLOT_LABELS.task },
  { key: 'free', color: TIME_SLOT_COLORS.free, label: TIME_SLOT_LABELS.free },
] as const;

/**
 * 페인트 모드별 색상 (WeeklyGrid 편집 모드용)
 */
export const PAINT_MODE_COLORS: Record<NonNullable<TimeSlot>, string> = {
  quiet: TIME_SLOT_COLORS.quiet,
  out: TIME_SLOT_COLORS.out,
} as const;

/**
 * 페인트 모드 라벨
 */
export const PAINT_MODE_LABELS: Record<NonNullable<TimeSlot>, string> = {
  quiet: TIME_SLOT_LABELS.quiet,
  out: TIME_SLOT_LABELS.out,
} as const;

// ==================== 기타 UI 색상 ====================

/**
 * 상태별 색상
 */
export const STATUS_COLORS = {
  primary: 'bg-primary-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  disabled: 'bg-gray-300',
} as const;

/**
 * 테두리 색상
 */
export const BORDER_COLORS = {
  default: 'border-gray-200',
  primary: 'border-primary-500',
  active: 'border-primary-600',
  hover: 'border-primary-400',
  error: 'border-red-500',
} as const;

/**
 * 텍스트 색상
 */
export const TEXT_COLORS = {
  primary: 'text-primary-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-500',
  error: 'text-red-500',
  success: 'text-green-600',
} as const;

// ==================== 배경 그라데이션 ====================

/**
 * 페이지 배경 그라데이션
 */
export const PAGE_GRADIENT = 'bg-gradient-to-br from-primary-50 to-primary-100' as const;

/**
 * 카드 배경
 */
export const CARD_BACKGROUND = 'bg-white' as const;

/**
 * 호버 배경
 */
export const HOVER_BACKGROUND = 'hover:bg-gray-50' as const;
