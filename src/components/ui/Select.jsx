import React from 'react';

/**
 * Standard Form Select for Timelens Photobooth Atelier
 */
export default function Select({
  label,
  helperText,
  error,
  id,
  options = [],
  children,
  className = '',
  wrapperClassName = '',
  required = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#504440] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`w-full bg-[#f6f3ee]/50 border border-[#d3c3be]/60 rounded-xl px-4 py-2.5 text-xs text-[#1c1c19] focus:outline-none focus:border-[#855230] focus:ring-1 focus:ring-[#855230] appearance-none transition-colors pr-10 cursor-pointer ${
            error ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]' : ''
          } ${className}`}
          {...props}
        >
          {children || options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>
        <span className="material-symbols-outlined text-[18px] text-[#827470] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          expand_more
        </span>
      </div>

      {error ? (
        <span className="text-[10px] text-[#ba1a1a] font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[10px] text-[#827470]">{helperText}</span>
      ) : null}
    </div>
  );
}
