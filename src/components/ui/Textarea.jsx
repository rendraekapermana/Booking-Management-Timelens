import React from 'react';

/**
 * Standard Form Textarea for Timelens Photobooth Atelier
 */
export default function Textarea({
  label,
  helperText,
  error,
  id,
  rows = 3,
  className = '',
  wrapperClassName = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#504440] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
          </span>
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        required={required}
        className={`w-full bg-[#f6f3ee]/50 border border-[#d3c3be]/60 rounded-xl px-4 py-2.5 text-xs text-[#1c1c19] placeholder:text-[#827470]/60 focus:outline-none focus:border-[#855230] focus:ring-1 focus:ring-[#855230] transition-colors resize-y ${
          error ? 'border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ba1a1a]' : ''
        } ${className}`}
        {...props}
      />

      {error ? (
        <span className="text-[10px] text-[#ba1a1a] font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-[10px] text-[#827470]">{helperText}</span>
      ) : null}
    </div>
  );
}
