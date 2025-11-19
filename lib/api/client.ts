/**
 * API Client
 *
 * 백엔드 미구현 API들을 위한 빈 데이터 반환 레이어
 * Real API는 lib/api/endpoints.ts에서 직접 import 사용
 *
 * 이 파일은 404 방지를 위해 빈 데이터를 반환하는 함수만 포함합니다.
 */

import type {
  User,
  Room,
  WeeklySchedule,
  Preference,
  Assignment,
  Task
} from '@/types';
import { TASKS } from '@/types';

// ============================================
// 방(Room) 관련 API
// ============================================

/**
 * 내 방 정보 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getMyRoom(): Promise<Room | null> {
  return null;
}

/**
 * 방 멤버 목록 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getRoomMembers(roomId: string): Promise<User[]> {
  return [];
}

// ============================================
// 타임테이블 관련 API
// ============================================

/**
 * 모든 사용자의 스케줄 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getAllSchedules(userIds: string[]): Promise<Map<string, WeeklySchedule>> {
  return new Map();
}

// ============================================
// 업무 선호도 관련 API
// ============================================

/**
 * 업무 목록 가져오기 (고정 데이터)
 * 프론트엔드 상수 반환
 */
export async function getTasks(): Promise<Task[]> {
  return TASKS;
}

/**
 * 내 선호도 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getMyPreference(): Promise<Preference | null> {
  return null;
}

/**
 * 선호도 저장
 * ⚠️ 백엔드 미구현 - no-op
 */
export async function savePreference(first: string, second: string): Promise<void> {
  return;
}

/**
 * 방의 모든 멤버 선호도 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getRoomPreferences(roomId: string): Promise<Preference[]> {
  return [];
}

// ============================================
// 배정 결과 관련 API
// ============================================

/**
 * 이번 주 배정 결과 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getCurrentAssignments(): Promise<Assignment[]> {
  return [];
}

/**
 * 특정 주의 배정 결과 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getAssignmentsByWeek(weekStart: string): Promise<Assignment[]> {
  return [];
}

/**
 * 내 배정 결과만 가져오기
 * ⚠️ 백엔드 미구현 - 빈 데이터 반환
 */
export async function getMyAssignments(): Promise<Assignment[]> {
  return [];
}
