import React from 'react';
import Button from './Button';

/**
 * 공통 모달 컴포넌트
 *
 * isOpen: 모달 표시 여부
 * onClose: 모달 닫기 핸들러
 * title: 모달 제목
 * children: 모달 내용
 * showCloseButton: 닫기 버튼 표시 여부
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
        {/* 헤더 */}
        {title && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
        )}

        {/* 바디 */}
        <div className="mb-6">{children}</div>

        {/* 닫기 버튼 */}
        {showCloseButton && (
          <div className="flex justify-end">
            <Button onClick={onClose} variant="primary" size="md">
              확인
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
