import { TASKS } from '@/types';
import { TASK_EMOJIS } from '@/lib/constants/taskEmojis';
import type { User, Task } from '@/types';

/**
 * Task ID로 task 정보 조회
 * @param taskId Task ID
 * @returns Task 정보 (이름, 이모지, 가중치 포함)
 */
export function getTaskInfo(taskId: string): {
  id: string;
  name: string;
  emoji: string;
  weight: number;
} {
  const task = TASKS.find((t) => t.id === taskId);
  return {
    id: taskId,
    name: task?.name || taskId,
    emoji: TASK_EMOJIS[taskId] || '📋',
    weight: task?.weight || 0,
  };
}

/**
 * Task ID로 task 전체 객체 조회
 * @param taskId Task ID
 * @returns Task 객체 또는 undefined
 */
export function getTask(taskId: string): Task | undefined {
  return TASKS.find((t) => t.id === taskId);
}

/**
 * User ID로 사용자 이름 조회
 * @param userId User ID
 * @param users 사용자 목록
 * @returns 사용자 이름 또는 '알 수 없음'
 */
export function getUserName(userId: string, users: User[]): string {
  const user = users.find((u) => u.id === userId);
  return user?.realName || '알 수 없음';
}

/**
 * User ID로 사용자 전체 객체 조회
 * @param userId User ID
 * @param users 사용자 목록
 * @returns User 객체 또는 undefined
 */
export function getUser(userId: string, users: User[]): User | undefined {
  return users.find((u) => u.id === userId);
}

/**
 * Task 목록을 가중치 기준으로 정렬
 * @param tasks Task 목록
 * @param order 정렬 순서 ('asc' | 'desc')
 * @returns 정렬된 Task 목록
 */
export function sortTasksByWeight(tasks: Task[], order: 'asc' | 'desc' = 'desc'): Task[] {
  return [...tasks].sort((a, b) => {
    return order === 'desc' ? b.weight - a.weight : a.weight - b.weight;
  });
}

/**
 * Task ID 목록에서 총 가중치 계산
 * @param taskIds Task ID 배열
 * @returns 총 가중치
 */
export function calculateTotalWeight(taskIds: string[]): number {
  return taskIds.reduce((total, taskId) => {
    const task = getTask(taskId);
    return total + (task?.weight || 0);
  }, 0);
}

/**
 * Task 이름으로 Task ID 조회
 * @param taskName Task 이름
 * @returns Task ID 또는 undefined
 */
export function getTaskIdByName(taskName: string): string | undefined {
  const task = TASKS.find((t) => t.name === taskName);
  return task?.id;
}

/**
 * 모든 Task ID 목록 반환
 * @returns Task ID 배열
 */
export function getAllTaskIds(): string[] {
  return TASKS.map((t) => t.id);
}

/**
 * Task가 존재하는지 확인
 * @param taskId Task ID
 * @returns 존재하면 true
 */
export function taskExists(taskId: string): boolean {
  return TASKS.some((t) => t.id === taskId);
}
