'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import WeeklyGrid from '@/components/schedule/WeeklyGrid';
import type { WeeklySchedule, DayOfWeek } from '@/types';
import { saveSchedule, getMySchedule } from '@/lib/api/client';

/**
 * 타임테이블 설정 페이지
 *
 * 주간 스케줄을 설정합니다.
 * - 수면, 바쁨, 조용한 시간을 드래그로 선택
 * - 요일 복사 기능으로 편리하게 설정
 *
 * 완료 후 /dashboard로 이동
 */

export default function SchedulePage() {
  const router = useRouter();

  // 스케줄 상태
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * 초기 스케줄 로드
   */
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await getMySchedule();
        setSchedule(data);
      } catch (error) {
        console.error('스케줄 로드 실패:', error);
        // 빈 스케줄 생성
        setSchedule(createEmptySchedule());
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, []);

  /**
   * 빈 스케줄 생성
   */
  const createEmptySchedule = (): WeeklySchedule => {
    const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const schedule: Partial<WeeklySchedule> = {};

    days.forEach((day) => {
      const hours: { [hour: number]: null } = {};
      for (let i = 0; i < 24; i++) {
        hours[i] = null;
      }
      schedule[day] = hours;
    });

    return schedule as WeeklySchedule;
  };

  /**
   * 저장 및 다음 단계로 이동
   */
  const handleSubmit = async () => {
    if (!schedule) return;

    setIsSubmitting(true);

    try {
      await saveSchedule(schedule);
      // 성공 시 대시보드로 이동
      router.push('/dashboard');
    } catch (error) {
      console.error('스케줄 저장 실패:', error);
      alert('스케줄 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 건너뛰기 (나중에 설정)
   */
  const handleSkip = () => {
    if (confirm('타임테이블을 나중에 설정하시겠습니까?')) {
      router.push('/dashboard');
    }
  };

  if (isLoading || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">스케줄을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            주간 타임테이블 설정
          </h1>
          <p className="text-gray-600">
            매주 반복되는 일정을 설정해주세요 (일요일 밤 12시까지 수정 가능)
          </p>
        </div>

        {/* 사용 가이드 */}
        <Card padding="md" className="mb-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">💡 사용 방법</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                <strong>브러시 모드</strong>를 선택하고 시간대를 클릭하거나
                드래그하세요
              </li>
              <li>
                <strong>요일 복사</strong>로 같은 패턴을 빠르게 적용할 수
                있어요
              </li>
              <li>
                <strong>평일/주말 일괄 적용</strong>으로 반복 작업을 줄이세요
              </li>
              <li>비는 시간은 아무것도 선택하지 않으면 됩니다</li>
            </ul>
          </div>
        </Card>

        {/* 타임테이블 그리드 */}
        <WeeklyGrid schedule={schedule} onChange={setSchedule} />

        {/* 액션 버튼 */}
        <div className="mt-8 flex gap-3 justify-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            size="lg"
            disabled={isSubmitting}
          >
            나중에 설정
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장하고 시작하기'}
          </Button>
        </div>

        {/* 프로그레스 표시 */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            3 / 3 단계: 타임테이블 설정
          </p>
        </div>
      </div>
    </div>
  );
}
