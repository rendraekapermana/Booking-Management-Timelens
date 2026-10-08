import React, { useEffect } from 'react';

/**
 * Standard Modal Dialog for Timelens Photobooth Atelier
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
  className = ''
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090100]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full ${maxWidth} bg-[#ffffff] border border-[#d3c3be]/40 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${className}`}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#d3c3be]/40 mb-6">
            <div>
              {title && (
                <h3 className="text-xl font-serif font-bold text-[#090100]">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-[#504440] mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-[#f0ede9] text-[#504440] hover:text-[#090100] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
