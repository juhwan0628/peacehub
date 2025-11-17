import type { TimeRange } from '@/types';

/**
 * 업무별 권장 시간대
 *
 * 각 집안일의 특성에 맞는 기본 수행 시간을 정의
 */

export const TASK_TIME_RANGES: Record<string, TimeRange> = {
  bathroom: { start: 18, end: 20 }, // 화장실 청소 - 저녁 6-8시
  trash: { start: 9, end: 10 }, // 쓰레기 버리기 - 오전 9-10시
  vacuum: { start: 15, end: 17 }, // 청소기 돌리기 - 오후 3-5시
  laundry: { start: 19, end: 21 }, // 빨래하기 - 저녁 7-9시
  dishes: { start: 20, end: 22 }, // 설거지 - 저녁 8-10시
  grocery: { start: 11, end: 13 }, // 장보기 - 점심 11-1시
  fridge: { start: 10, end: 11 }, // 냉장고 관리 - 오전 10-11시
  mopping: { start: 14, end: 16 }, // 걸레질 - 오후 2-4시
};

/**
 * 시간대 이름 반환
 */
export function getTimeOfDayLabel(hour: number): string {
  if (hour >= 6 && hour < 12) return '오전';
  if (hour >= 12 && hour < 18) return '오후';
  if (hour >= 18 && hour < 22) return '저녁';
  return '밤';
}

/**
 * 시간 범위를 한글로 포맷팅
 * 예: (18, 20) → "저녁 6-8시"
 */
export function formatTimeRange(start: number, end: number): string {
  const label = getTimeOfDayLabel(start);
  const startHour = start > 12 ? start - 12 : start === 0 ? 12 : start;
  const endHour = end > 12 ? end - 12 : end === 0 ? 12 : end;

  return `${label} ${startHour}-${endHour}시`;
}
