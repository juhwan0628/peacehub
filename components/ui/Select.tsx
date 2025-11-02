import React from 'react';

/**
 * 공통 셀렉트 컴포넌트
 *
 * label: 셀렉트 필드 레이블
 * options: 선택 옵션 배열 [{ value, label }]
 * error: 에러 메시지
 * fullWidth: 가로 전체 너비 사용 여부
 * placeholder: 기본 선택 옵션 텍스트
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  error,
  fullWidth = false,
  value,
  onChange,
  placeholder = '선택해주세요',
  className = '',
  id,
  ...props
}: SelectProps) {
  // 고유 ID 생성 (label과 select 연결용)
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  // 기본 스타일
  const baseStyles = 'px-4 py-2 border rounded-lg transition-colors duration-200 bg-white';
  const normalStyles = 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none';
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none';

  // 전체 너비 스타일
  const widthStyle = fullWidth ? 'w-full' : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        className={`${baseStyles} ${error ? errorStyles : normalStyles} ${widthStyle} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
