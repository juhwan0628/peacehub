import type { DayOfWeek } from '@/types';

/**
 * 주의 시작일(월요일) 계산
 * @param date 기준 날짜
 * @returns YYYY-MM-DD 형식의 월요일 날짜 문자열
 */
export function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 일요일인 경우 이전 주 월요일로
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

/**
 * 날짜에서 요일 추출
 * @param date 기준 날짜
 * @returns DayOfWeek 타입의 요일
 */
export function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[date.getDay()];
}

/**
 * 날짜를 "YYYY.MM.DD" 형식으로 포맷
 * @param date 포맷할 날짜
 * @returns YYYY.MM.DD 형식의 문자열
 */
export function formatDateDots(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}.${month}.${day}`;
}

/**
 * 날짜를 "M월 D일" 형식으로 포맷
 * @param date 포맷할 날짜
 * @returns M월 D일 형식의 문자열
 */
export function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 날짜를 "YYYY년 M월" 형식으로 포맷
 * @param date 포맷할 날짜
 * @returns YYYY년 M월 형식의 문자열
 */
export function formatYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * ISO 날짜 문자열 (YYYY-MM-DD)을 Date 객체로 변환
 * @param isoDateStr YYYY-MM-DD 형식의 문자열
 * @returns Date 객체
 */
export function parseISODate(isoDateStr: string): Date {
  return new Date(isoDateStr + 'T00:00:00');
}

/**
 * 두 날짜가 같은 날인지 확인
 * @param date1 첫 번째 날짜
 * @param date2 두 번째 날짜
 * @returns 같은 날이면 true
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 오늘 날짜인지 확인
 * @param date 확인할 날짜
 * @returns 오늘이면 true
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * 날짜에 일수를 더함
 * @param date 기준 날짜
 * @param days 더할 일수
 * @returns 새로운 Date 객체
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 다음 일요일 23:59:59 계산 (배정 마감일)
 * @param fromDate 기준 날짜 (기본값: 오늘)
 * @returns 다음 일요일 23:59:59의 Date 객체
 */
export function getNextSunday(fromDate: Date = new Date()): Date {
  const d = new Date(fromDate);
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * 남은 시간을 문자열로 포맷 (예: "2일 5시간 30분")
 * @param deadline 마감 시간
 * @returns 포맷된 남은 시간 문자열
 */
export function formatTimeRemaining(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return '마감';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes}분`);

  return parts.join(' ');
}
