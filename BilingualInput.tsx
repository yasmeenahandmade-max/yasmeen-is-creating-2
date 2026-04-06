'use client';

import clsx from 'clsx';

type Props = {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
  placeholderEn?: string;
  placeholderAr?: string;
  type?: 'input' | 'textarea';
  rows?: number;
  required?: boolean;
  className?: string;
};

export function BilingualInput({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  placeholderEn = 'English',
  placeholderAr = 'العربية',
  type = 'input',
  rows = 3,
  required = false,
  className,
}: Props) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* English */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-charcoal/25">EN</span>
          </div>
          {type === 'textarea' ? (
            <textarea
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              rows={rows}
              required={required}
              className="input-brand resize-y"
              dir="ltr"
            />
          ) : (
            <input
              type="text"
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              required={required}
              className="input-brand"
              dir="ltr"
            />
          )}
        </div>

        {/* Arabic */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-charcoal/25">AR</span>
          </div>
          {type === 'textarea' ? (
            <textarea
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              placeholder={placeholderAr}
              rows={rows}
              required={required}
              className={clsx('input-brand resize-y text-right font-arabic')}
              dir="rtl"
            />
          ) : (
            <input
              type="text"
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              placeholder={placeholderAr}
              required={required}
              className={clsx('input-brand text-right font-arabic')}
              dir="rtl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
