'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TASKS } from '@/types';
import { getMyPreference, savePreference } from '@/lib/api/client';
import type { Preference } from '@/types';

/**
 * 업무 배정 페이지
 *
 * 1지망, 2지망 선호도 제출
 * - 마감: 일요일 23:59:59
 * - 중복 선택 방지
 */

export default function AssignPage() {
  const router = useRouter();

  // 선호도 상태
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');

  // 기존 선호도
  const [existingPreference, setExistingPreference] = useState<Preference | null>(null);

  // UI 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ first?: string; second?: string }>({});

  /**
   * 초기 데이터 로드
   */
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const preference = await getMyPreference();
        if (preference) {
          setExistingPreference(preference);
          setFirst(preference.first);
          setSecond(preference.second);
        }
      } catch (error) {
        console.error('선호도 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreference();
  }, []);

  /**
   * 마감 시간 계산 (다음 일요일 23:59:59)
   */
  const getDeadline = (): Date => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = day === 0 ? 7 : 7 - day;
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + daysUntilSunday);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
  };

  /**
   * 남은 시간 계산
   */
  const getTimeRemaining = (): string => {
    const deadline = getDeadline();
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return '마감됨';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `D-${days}일 ${hours}시간`;
    } else {
      return `${hours}시간 남음`;
    }
  };

  /**
   * 유효성 검사
   */
  const validateForm = (): boolean => {
    const newErrors: { first?: string; second?: string } = {};

    if (!first) {
      newErrors.first = '1지망을 선택해주세요';
    }

    if (!second) {
      newErrors.second = '2지망을 선택해주세요';
    }

    if (first && second && first === second) {
      newErrors.second = '1지망과 다른 집안일을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 제출
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await savePreference(first, second);
      alert('선호도가 제출되었습니다!');
      router.push('/dashboard');
    } catch (error) {
      console.error('선호도 제출 실패:', error);
      alert('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 선택 옵션 (TASKS 기반)
  const taskOptions = TASKS.map((task) => ({
    value: task.id,
    label: task.name,
  }));

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8 min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">
            업무 선호도 제출
          </h1>
          <p className="text-gray-600">
            하고 싶은 집안일을 1지망, 2지망 순으로 선택해주세요
          </p>
          <div className="mt-3">
            <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">
              ⏰ 마감까지: {getTimeRemaining()}
            </span>
          </div>
        </div>

        {/* 기존 선호도 표시 */}
        {existingPreference && (
          <Card padding="md">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                ✅ 이미 제출된 선호도
              </p>
              <p className="text-sm text-blue-700">
                1지망:{' '}
                {TASKS.find((t) => t.id === existingPreference.first)?.name}
              </p>
              <p className="text-sm text-blue-700">
                2지망:{' '}
                {TASKS.find((t) => t.id === existingPreference.second)?.name}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                아래에서 수정할 수 있습니다
              </p>
            </div>
          </Card>
        )}

        {/* 선호도 선택 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1지망 */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              1지망 (가장 하고 싶은 집안일)
            </h3>
            <Select
              options={taskOptions}
              value={first}
              onChange={(value) => {
                setFirst(value);
                setErrors({ ...errors, first: undefined });
              }}
              error={errors.first}
              placeholder="집안일을 선택하세요"
              fullWidth
            />
          </Card>

          {/* 2지망 */}
          <Card padding="md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              2지망 (두 번째로 하고 싶은 집안일)
            </h3>
            <Select
              options={taskOptions}
              value={second}
              onChange={(value) => {
                setSecond(value);
                setErrors({ ...errors, second: undefined });
              }}
              error={errors.second}
              placeholder="집안일을 선택하세요"
              fullWidth
            />
          </Card>

          {/* 안내 */}
          <Card padding="md" className="bg-yellow-50 border-yellow-200">
            <p className="text-sm text-gray-700">
              💡 <strong>알아두세요:</strong> 선호도는 일요일 자정까지 수정
              가능하며, 이후 자동으로 집안일이 배정됩니다.
            </p>
          </Card>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? '제출 중...'
              : existingPreference
              ? '선호도 수정하기'
              : '선호도 제출하기'}
          </Button>
        </form>
      </div>
    </div>
  );
}
