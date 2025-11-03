'use client';

import Card from '@/components/ui/Card';
import WeeklyGrid from '@/components/schedule/WeeklyGrid';
import type { WeeklySchedule } from '@/types';

interface ScheduleEditorProps {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

export default function ScheduleEditor({ schedule, onChange }: ScheduleEditorProps) {
  return (
    <>
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
      <WeeklyGrid schedule={schedule} onChange={onChange} />
    </>
  );
}