'use client';

import { useState, useRef } from 'react';
import type { WeeklySchedule, DayOfWeek, TimeSlot } from '@/types';
import { DAY_NAMES } from '@/types';

/**
 * 주간 타임테이블 그리드 컴포넌트
 *
 * 편의 기능:
 * 1. Paint 모드: 타입 선택 후 드래그로 칠하기
 * 2. 요일 복사: 한 요일을 다른 요일로 복사
 * 3. 빠른 선택: 드래그로 여러 시간대 한번에 선택
 */

interface WeeklyGridProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

// 시간대 색상 매핑
const SLOT_COLORS: Record<string, string> = {
  quiet: 'bg-blue-200 hover:bg-blue-300 border-blue-300',
  sleep: 'bg-purple-200 hover:bg-purple-300 border-purple-300',
  busy: 'bg-red-200 hover:bg-red-300 border-red-300',
  null: 'bg-white hover:bg-gray-100 border-gray-200',
};

// 시간대 라벨
const SLOT_LABELS: Record<string, string> = {
  quiet: '조용',
  sleep: '수면',
  busy: '바쁨',
  null: '지우기',
};

export default function WeeklyGrid({ schedule, onChange }: WeeklyGridProps) {
  // 현재 선택된 Paint 모드
  const [paintMode, setPaintMode] = useState<TimeSlot>('sleep');

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);

  // 요일 복사 소스
  const [copySource, setCopySource] = useState<DayOfWeek | null>(null);

  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  /**
   * 셀 클릭 핸들러
   */
  const handleCellClick = (day: DayOfWeek, hour: number) => {
    const newSchedule = { ...schedule };
    newSchedule[day] = { ...newSchedule[day], [hour]: paintMode };
    onChange(newSchedule);
  };

  /**
   * 드래그 시작
   */
  const handleMouseDown = (day: DayOfWeek, hour: number) => {
    setIsDragging(true);
    handleCellClick(day, hour);
  };

  /**
   * 드래그 중
   */
  const handleMouseEnter = (day: DayOfWeek, hour: number) => {
    if (isDragging) {
      handleCellClick(day, hour);
    }
  };

  /**
   * 드래그 종료
   */
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  /**
   * 요일 전체 복사
   */
  const handleCopyDay = (sourceDay: DayOfWeek, targetDay: DayOfWeek) => {
    const newSchedule = { ...schedule };
    newSchedule[targetDay] = { ...schedule[sourceDay] };
    onChange(newSchedule);
    setCopySource(null);
  };

  /**
   * 요일 전체 지우기
   */
  const handleClearDay = (day: DayOfWeek) => {
    const newSchedule = { ...schedule };
    const hours: { [hour: number]: null } = {};
    for (let i = 0; i < 24; i++) {
      hours[i] = null;
    }
    newSchedule[day] = hours;
    onChange(newSchedule);
  };

  /**
   * 평일 전체 적용
   */
  const handleApplyWeekdays = () => {
    if (!schedule.mon) return;
    const newSchedule = { ...schedule };
    ['tue', 'wed', 'thu', 'fri'].forEach((day) => {
      newSchedule[day as DayOfWeek] = { ...schedule.mon };
    });
    onChange(newSchedule);
  };

  /**
   * 주말 적용
   */
  const handleApplyWeekend = () => {
    if (!schedule.sat) return;
    const newSchedule = { ...schedule };
    newSchedule.sun = { ...schedule.sat };
    onChange(newSchedule);
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Paint 모드 선택 툴바 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">
          브러시 모드 선택 (클릭/드래그로 시간대 선택)
        </p>
        <div className="flex gap-2 flex-wrap">
          {(['sleep', 'busy', 'quiet', null] as TimeSlot[]).map((mode) => (
            <button
              key={mode || 'null'}
              onClick={() => setPaintMode(mode)}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                paintMode === mode
                  ? 'ring-2 ring-primary-500 ring-offset-2'
                  : ''
              } ${SLOT_COLORS[mode || 'null']}`}
            >
              {SLOT_LABELS[mode || 'null']}
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <div className="flex gap-1">
          {/* 시간 라벨 열 */}
          <div className="flex flex-col gap-0.5">
            <div className="h-8 text-xs font-medium text-gray-600 flex items-center justify-center">
              시간
            </div>
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="h-6 w-12 text-xs text-gray-600 flex items-center justify-end pr-2"
              >
                {i}시
              </div>
            ))}
          </div>

          {/* 요일 열들 */}
          {days.map((day) => (
            <div key={day} className="flex flex-col gap-0.5 flex-1 min-w-[60px]">
              {/* 요일 헤더 */}
              <div className="h-8 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">
                  {DAY_NAMES[day]}
                </span>
              </div>

              {/* 시간 셀들 */}
              {Array.from({ length: 24 }, (_, hour) => {
                const slotValue = schedule[day]?.[hour];
                return (
                  <div
                    key={hour}
                    onMouseDown={() => handleMouseDown(day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                    className={`h-6 border cursor-pointer select-none transition-colors ${
                      SLOT_COLORS[slotValue || 'null']
                    }`}
                    title={`${DAY_NAMES[day]} ${hour}시 - ${
                      slotValue ? SLOT_LABELS[slotValue] : '비는 시간'
                    }`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 요일 관리 버튼 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">빠른 설정</p>

        {/* 요일별 액션 */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day) => (
            <div key={day} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600 text-center">
                {DAY_NAMES[day]}
              </span>
              <button
                onClick={() =>
                  copySource === day
                    ? setCopySource(null)
                    : setCopySource(day)
                }
                className={`text-xs px-2 py-1 rounded ${
                  copySource === day
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copySource === day ? '취소' : '복사'}
              </button>
              {copySource && copySource !== day && (
                <button
                  onClick={() => handleCopyDay(copySource, day)}
                  className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                >
                  붙여넣기
                </button>
              )}
              <button
                onClick={() => handleClearDay(day)}
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                지우기
              </button>
            </div>
          ))}
        </div>

        {/* 일괄 적용 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleApplyWeekdays}
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium"
          >
            월요일 → 평일 전체 적용
          </button>
          <button
            onClick={handleApplyWeekend}
            className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-medium"
          >
            토요일 → 일요일 적용
          </button>
        </div>
      </div>

      {/* 범례 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">범례</p>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-200 border border-purple-300 rounded"></div>
            <span className="text-sm text-gray-700">수면 시간</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-200 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-700">바쁜 시간</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="text-sm text-gray-700">조용한 시간</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">비는 시간</span>
          </div>
        </div>
      </div>
    </div>
  );
}
