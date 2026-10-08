import React from 'react';

/**
 * Editorial Page Header for Timelens Photobooth Atelier
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = ''
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 ${className}`}>
      <div className="space-y-1.5 max-w-2xl">
        {eyebrow && (
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#855230]"></span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#855230] font-semibold">
              {eyebrow}
            </span>
          </div>
        )}
        {title && (
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-xs lg:text-sm text-[#504440] leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
}
