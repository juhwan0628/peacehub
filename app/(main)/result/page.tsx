'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import {
  mockUsers,
  mockAssignments,
  TASKS,
} from '@/lib/api/mockData';
import { DAY_NAMES } from '@/types';
import type { Assignment, DayOfWeek } from '@/types';

interface UserAssignment {
  userId: string;
  userName: string;
  profileImage?: string;
  tasks: {
    taskId: string;
    taskName: string;
    days: DayOfWeek[];
  }[];
}

// Helper to get the start of the current week (Monday)
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

export default function ResultPage() {
  const [assignmentsByUser, setAssignmentsByUser] = useState<UserAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [week, setWeek] = useState({ start: '', end: '' });

  useEffect(() => {
    // For prototype, we'll find the most recent week from mock data
    const mostRecentWeekStart = mockAssignments.reduce((latest, assign) => {
      return latest > assign.weekStart ? latest : assign.weekStart;
    }, '');

    const weekStart = new Date(mostRecentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (d: Date) => `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
    setWeek({ start: formatDate(weekStart), end: formatDate(weekEnd) });

    const currentWeekAssignments = mockAssignments.filter(
      (a) => a.weekStart === mostRecentWeekStart
    );

    const groupedAssignments: { [userId: string]: UserAssignment } = {};

    mockUsers.forEach((user) => {
      groupedAssignments[user.id] = {
        userId: user.id,
        userName: user.realName,
        profileImage: user.profileImage,
        tasks: [],
      };
    });

    currentWeekAssignments.forEach((assignment) => {
      if (groupedAssignments[assignment.userId]) {
        const task = TASKS.find((t) => t.id === assignment.taskId);
        if (task) {
          groupedAssignments[assignment.userId].tasks.push({
            taskId: task.id,
            taskName: task.name,
            days: assignment.days,
          });
        }
      }
    });

    setAssignmentsByUser(Object.values(groupedAssignments));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            주간 업무 배정 결과
          </h1>
          <p className="text-gray-600 text-lg">
            {week.start} ~ {week.end}
          </p>
        </div>

        {/* 배정 결과 목록 */}
        <div className="space-y-6">
          {assignmentsByUser.map((userAssignment) => (
            <Card key={userAssignment.userId} padding="lg">
              <div className="flex items-start gap-4">
                <img
                  src={userAssignment.profileImage}
                  alt={userAssignment.userName}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">
                    {userAssignment.userName}
                  </h2>
                  {userAssignment.tasks.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {userAssignment.tasks.map((task) => (
                        <div key={task.taskId} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold text-gray-700">
                            {task.taskName}
                          </p>
                          <div className="flex gap-2 mt-1.5">
                            {task.days.map((day) => (
                              <span
                                key={day}
                                className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full"
                              >
                                {DAY_NAMES[day]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-500">
                      이번 주 배정된 업무가 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">매주 월요일 자정에 새로운 업무가 배정됩니다.</p>
        </div>
      </div>
    </div>
  );
}
