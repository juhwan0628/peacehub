/**
 * User 추가 정보 로컬 스토리지 관리
 *
 * 백엔드에 country, language 필드가 추가될 때까지 임시 사용
 * 백엔드 User 모델에 해당 필드가 추가되면 이 유틸리티는 제거 예정
 */

interface UserLocalData {
  country: string;
  language: string;
}

const STORAGE_KEY = 'peacehub_user_extra';

/**
 * 사용자 추가 정보 저장
 * @param userId 사용자 ID
 * @param data country, language 정보
 */
export function saveUserLocalData(userId: string, data: UserLocalData): void {
  if (typeof window === 'undefined') return;

  const allData = getAllUserLocalData();
  allData[userId] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

/**
 * 사용자 추가 정보 조회
 * @param userId 사용자 ID
 * @returns UserLocalData 또는 null
 */
export function getUserLocalData(userId: string): UserLocalData | null {
  if (typeof window === 'undefined') return null;

  const allData = getAllUserLocalData();
  return allData[userId] || null;
}

/**
 * 전체 사용자 데이터 조회 (내부 헬퍼)
 */
function getAllUserLocalData(): Record<string, UserLocalData> {
  if (typeof window === 'undefined') return {};

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * 사용자 추가 정보 삭제
 * @param userId 사용자 ID
 */
export function clearUserLocalData(userId: string): void {
  if (typeof window === 'undefined') return;

  const allData = getAllUserLocalData();
  delete allData[userId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

/**
 * 전체 로컬 데이터 삭제 (로그아웃 시 사용)
 */
export function clearAllUserLocalData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY);
}
