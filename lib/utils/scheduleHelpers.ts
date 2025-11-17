import type { WeeklySchedule, DayOfWeek, HourlySchedule, TimeSlot } from '@/types';

/**
 * 빈 스케줄 생성 (모든 시간대가 null인 주간 스케줄)
 * @returns 초기화된 WeeklySchedule 객체
 */
export function createEmptySchedule(): WeeklySchedule {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const schedule = {} as WeeklySchedule;

  days.forEach((day) => {
    const hours: HourlySchedule = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = null;
    }
    schedule[day] = hours;
  });

  return schedule;
}

/**
 * 스케줄이 비어있는지 확인 (모든 시간대가 null인지 체크)
 * @param schedule 확인할 스케줄
 * @returns 비어있으면 true
 */
export function isEmptySchedule(schedule: WeeklySchedule): boolean {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  for (const day of days) {
    const daySchedule = schedule[day];
    if (!daySchedule) continue;

    for (let hour = 0; hour < 24; hour++) {
      if (daySchedule[hour] !== null) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 스케줄 검증 (필수 구조가 있는지 확인)
 * @param schedule 검증할 스케줄
 * @returns 유효하면 true
 */
export function validateSchedule(schedule: WeeklySchedule): boolean {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  // 모든 요일이 존재하는지 확인
  for (const day of days) {
    if (!schedule[day]) return false;

    // 각 요일에 0-23시가 모두 있는지 확인
    for (let hour = 0; hour < 24; hour++) {
      if (schedule[day][hour] === undefined) return false;
    }
  }

  return true;
}

/**
 * 스케줄 복사 (깊은 복사)
 * @param schedule 복사할 스케줄
 * @returns 새로운 스케줄 객체
 */
export function cloneSchedule(schedule: WeeklySchedule): WeeklySchedule {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const cloned = {} as WeeklySchedule;

  days.forEach((day) => {
    cloned[day] = { ...schedule[day] };
  });

  return cloned;
}

/**
 * 특정 요일의 특정 시간대에 TimeSlot 설정
 * @param schedule 수정할 스케줄
 * @param day 요일
 * @param hour 시간 (0-23)
 * @param slot 설정할 TimeSlot
 * @returns 수정된 스케줄 (불변성 유지를 위해 새 객체 반환)
 */
export function setTimeSlot(
  schedule: WeeklySchedule,
  day: DayOfWeek,
  hour: number,
  slot: TimeSlot
): WeeklySchedule {
  const newSchedule = cloneSchedule(schedule);
  newSchedule[day][hour] = slot;
  return newSchedule;
}

/**
 * 특정 요일의 시간 범위에 TimeSlot 일괄 설정
 * @param schedule 수정할 스케줄
 * @param day 요일
 * @param startHour 시작 시간 (포함)
 * @param endHour 종료 시간 (미포함)
 * @param slot 설정할 TimeSlot
 * @returns 수정된 스케줄
 */
export function setTimeRange(
  schedule: WeeklySchedule,
  day: DayOfWeek,
  startHour: number,
  endHour: number,
  slot: TimeSlot
): WeeklySchedule {
  const newSchedule = cloneSchedule(schedule);

  for (let hour = startHour; hour < endHour; hour++) {
    if (hour >= 0 && hour < 24) {
      newSchedule[day][hour] = slot;
    }
  }

  return newSchedule;
}

/**
 * 특정 요일의 TASK 시간(null이 아닌 quiet, out 제외) 개수 계산
 * @param schedule 확인할 스케줄
 * @param day 요일
 * @returns 사용 가능한 시간 개수
 */
export function getAvailableHours(schedule: WeeklySchedule, day: DayOfWeek): number {
  let count = 0;
  const daySchedule = schedule[day];

  for (let hour = 0; hour < 24; hour++) {
    if (daySchedule[hour] === null) {
      count++;
    }
  }

  return count;
}

/**
 * 전체 주간 스케줄에서 TASK 가능 시간 총합 계산
 * @param schedule 확인할 스케줄
 * @returns 전체 사용 가능한 시간 개수
 */
export function getTotalAvailableHours(schedule: WeeklySchedule): number {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return days.reduce((total, day) => total + getAvailableHours(schedule, day), 0);
}
