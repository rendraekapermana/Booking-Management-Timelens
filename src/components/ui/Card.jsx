import React from 'react';

/**
 * Standard Atelier Content Card
 */
export default function Card({
  children,
  className = '',
  title,
  subtitle,
  headerAction,
  ...props
}) {
  return (
    <div
      className={`bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl shadow-xs p-6 sm:p-7 ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1ece4] mb-5">
          <div>
            {title && (
              <h2 className="text-lg lg:text-xl text-[#090100] font-serif font-bold">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#504440] mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
