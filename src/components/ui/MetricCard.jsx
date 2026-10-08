import React from 'react';

/**
 * Standard Metric / KPI Card for Timelens Photobooth Atelier
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'bg-[#855230]/30',
  className = '',
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-[#ffffff] rounded-xl p-6 sm:p-8 shadow-xs border border-[#d3c3be]/40 transition-all duration-300 flex flex-col justify-between ${
        onClick ? 'hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${accentColor}`} />

      <div className="flex flex-col justify-between h-full space-y-5">
        <div className="flex items-start justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[#504440] font-semibold">
            {title}
          </span>
          {icon && (
            typeof icon === 'string' ? (
              <span className="material-symbols-outlined text-[#855230] opacity-70 text-[22px]">
                {icon}
              </span>
            ) : (
              icon
            )
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-4xl lg:text-5xl text-[#090100] tracking-tight font-serif font-bold leading-none">
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-[#504440] mt-2 leading-relaxed">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
