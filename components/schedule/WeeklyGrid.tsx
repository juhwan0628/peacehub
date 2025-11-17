'use client';

import { useState } from 'react';
import type { WeeklySchedule, DayOfWeek, TimeSlot } from '@/types';
import { DAY_NAMES } from '@/types';
import { TimeLabels, TimelineRow, TimelineLegend, scheduleToHourlyBlocks } from '@/components/common/TimelineRenderer';

/**
 * 주간 타임테이블 그리드 컴포넌트 (개선됨)
 *
 * TimelineRenderer를 사용하여 재사용성 향상
 * globals.css의 timeline 클래스 활용
 * - 토글 로직: 같은 색 클릭 시 지우기, 다른 색 클릭 시 덮어쓰기
 * - 2가지 상태: 조용시간, 외출
 */

interface WeeklyGridProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

// 시간대 라벨
const SLOT_LABELS: Record<NonNullable<TimeSlot>, string> = {
  quiet: '조용시간',
  out: '외출',
};

export default function WeeklyGrid({ schedule, onChange }: WeeklyGridProps) {
  // 현재 선택된 Paint 모드
  const [paintMode, setPaintMode] = useState<TimeSlot>('quiet');

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);

  // 복사 소스 요일
  const [copySource, setCopySource] = useState<DayOfWeek | null>(null);

  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  /**
   * 셀 클릭 핸들러 (토글 로직)
   */
  const handleCellClick = (day: DayOfWeek, hour: number) => {
    const currentValue = schedule[day]?.[hour];
    const newSchedule = { ...schedule };

    // 토글 로직: 같은 값이면 null로 변경, 다르면 paintMode로 변경
    if (currentValue === paintMode) {
      newSchedule[day] = { ...newSchedule[day], [hour]: null };
    } else {
      newSchedule[day] = { ...newSchedule[day], [hour]: paintMode };
    }

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
   * 요일 전체 복사
   */
  const handleCopyDay = (sourceDay: DayOfWeek, targetDay: DayOfWeek) => {
    const newSchedule = { ...schedule };
    newSchedule[targetDay] = { ...schedule[sourceDay] };
    onChange(newSchedule);
    setCopySource(null); // 복사 후 초기화
  };

  /**
   * 평일 전체 적용 (월요일 기준)
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
   * 주말 적용 (토요일 → 일요일)
   */
  const handleApplyWeekend = () => {
    if (!schedule.sat) return;
    const newSchedule = { ...schedule };
    newSchedule.sun = { ...schedule.sat };
    onChange(newSchedule);
  };

  /**
   * 요일별 셀 클릭 핸들러 (블록 기반)
   */
  const handleCellClickForDay = (day: DayOfWeek) => (hour: number) => {
    handleCellClick(day, hour);
  };

  /**
   * 요일별 마우스 다운 핸들러
   */
  const handleCellMouseDownForDay = (day: DayOfWeek) => (hour: number) => {
    handleMouseDown(day, hour);
  };

  /**
   * 요일별 마우스 엔터 핸들러
   */
  const handleCellMouseEnterForDay = (day: DayOfWeek) => (hour: number) => {
    handleMouseEnter(day, hour);
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Paint 모드 선택 툴바 */}
      <div className="card-compact">
        <p className="text-sm font-medium text-gray-700 mb-3">
          상태 선택 (클릭/드래그로 시간대 선택, 같은 색 클릭 시 지우기)
        </p>
        <div className="flex gap-3">
          {(['quiet', 'out'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPaintMode(mode)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                paintMode === mode
                  ? 'ring-2 ring-primary-500 ring-offset-2'
                  : ''
              }`}
            >
              <div className={`w-6 h-6 time-slot-${mode} rounded`}></div>
              <span className="text-gray-800">{SLOT_LABELS[mode]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 타임테이블 그리드 (TimelineRenderer 사용) */}
      <div className="timeline-container">
        <div className="space-y-4">
          {/* 시간 라벨 (개선: 블록 왼쪽 정렬) */}
          <TimeLabels interval={2} showZero />

          {/* 요일별 타임라인 */}
          {days.map((day) => {
            const blocks = scheduleToHourlyBlocks(schedule[day]);
            return (
              <TimelineRow
                key={day}
                label={DAY_NAMES[day]}
                blocks={blocks}
                onCellMouseDown={handleCellMouseDownForDay(day)}
                onCellMouseEnter={handleCellMouseEnterForDay(day)}
                readOnly={false}
              />
            );
          })}
        </div>
      </div>

      {/* 빠른 설정 */}
      <div className="card-compact">
        <p className="text-sm font-medium text-gray-700 mb-3">빠른 설정</p>

        {/* 일괄 적용 버튼 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleApplyWeekdays}
            className="flex-1 btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            월요일 → 평일 전체 적용
          </button>
          <button
            onClick={handleApplyWeekend}
            className="flex-1 btn-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
          >
            토요일 → 일요일 적용
          </button>
        </div>

        {/* 요일별 액션 */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div key={day} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-600 text-center">
                {DAY_NAMES[day]}
              </span>
              <button
                onClick={() =>
                  copySource === day ? setCopySource(null) : setCopySource(day)
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
      </div>
    </div>
  );
}
