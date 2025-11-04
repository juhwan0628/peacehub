/**
 * 집안일 이모지 매핑
 *
 * 업무 ID와 이모지를 매핑하는 중앙화된 상수
 * DailyTasks, MonthlyCalendar 등에서 공통으로 사용
 */

export const TASK_EMOJIS: Record<string, string> = {
  bathroom: '🚽',
  trash: '🗑️',
  vacuum: '🧹',
  laundry: '👔',
  dishes: '🍽️',
  grocery: '🛒',
  fridge: '🧊',
  mopping: '🧽',
};
