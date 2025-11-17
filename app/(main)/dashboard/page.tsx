'use client';

import { useState, useRef, useCallback } from 'react';
import MonthlyCalendar from '@/components/dashboard/MonthlyCalendar';
import CombinedTimelineBar from '@/components/dashboard/CombinedTimelineBar';
import TimelineBar from '@/components/dashboard/TimelineBar';
import { MainLoadingSpinner } from '@/components/common/LoadingSpinner';
import { useApiData } from '@/hooks/useApiData';
import type { User, Assignment, WeeklySchedule } from '@/types';
import {
  getCurrentUser,
  getRoomMembers,
  getCurrentAssignments,
  getAllSchedules,
} from '@/lib/api/client';

/**
 * 대시보드 페이지
 *
 * 월간 캘린더 + 통합 타임라인 + 개인 타임라인
 */

interface DashboardData {
  currentUser: User | null;
  users: User[];
  assignments: Assignment[];
  allSchedules: Map<string, WeeklySchedule>;
}

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 스크롤 타겟 ref
  const detailsRef = useRef<HTMLDivElement>(null);

  /**
   * 초기 데이터 로드
   */
  const loadDashboardData = useCallback(async (): Promise<DashboardData> => {
    const [user, members, assignmentsData] = await Promise.all([
      getCurrentUser(),
      getRoomMembers('room-1'),
      getCurrentAssignments(),
    ]);

    // 모든 사용자의 스케줄 가져오기
    const userIds = members.map(u => u.id);
    const schedules = await getAllSchedules(userIds);

    return {
      currentUser: user,
      users: members,
      assignments: assignmentsData,
      allSchedules: schedules,
    };
  }, []);

  const { data, isLoading } = useApiData(loadDashboardData);

  /**
   * 날짜 클릭 핸들러 (스크롤 포함)
   */
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // 부드러운 스크롤
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (isLoading || !data) {
    return <MainLoadingSpinner text="대시보드를 불러오는 중..." />;
  }

  const { currentUser, users, assignments, allSchedules } = data;

  if (!currentUser) {
    return (
      <div className="page-container flex items-center justify-center">
        <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 현재 사용자의 스케줄
  const mySchedule = allSchedules.get(currentUser.id);

  return (
    <div className="page-container">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            {currentUser.realName}님의 집안일 대시보드
          </h1>
          <p className="text-gray-600">
            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
          </p>
        </div>

        {/* 월간 캘린더 (축소됨) */}
        <div className="max-w-3xl mx-auto">
          <MonthlyCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            assignments={assignments}
            selectedUserId={null}
            onDateClick={handleDateClick}
            onMonthChange={setCurrentMonth}
          />
        </div>

        {/* 선택된 날짜 상세 (스크롤 타겟) */}
        <div ref={detailsRef} className="space-y-6 scroll-mt-20">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 상세
            </h2>
          </div>

          {/* 통합 타임라인 (모두) */}
          <CombinedTimelineBar
            date={selectedDate}
            allSchedules={allSchedules}
            assignments={assignments}
            users={users}
          />

          {/* 개인 타임라인 (나) */}
          {mySchedule && (
            <TimelineBar
              date={selectedDate}
              schedule={mySchedule}
              assignments={assignments}
              userId={currentUser.id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
