import React from 'react';

/**
 * Standard Button for Timelens Photobooth Atelier
 * Preserves exact walnut and cream atelier design system styles.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] active:scale-[0.99] shadow-xs rounded-lg',
    secondary: 'bg-[#ffffff] text-[#1c1c19] border border-[#d3c3be]/60 hover:bg-[#f6f3ee] shadow-xs rounded-lg',
    subtle: 'bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#090100] rounded-lg',
    outline: 'border border-[#d3c3be]/60 text-[#504440] hover:text-[#090100] hover:bg-[#f6f3ee] rounded-lg',
    ghost: 'text-[#504440] hover:text-[#090100] hover:bg-[#ebe8e3]/60 rounded-lg',
    danger: 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80 rounded-lg',
    bronze: 'bg-[#855230] text-[#ffffff] hover:bg-[#6c4226] shadow-xs rounded-lg'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-5 py-3 text-sm'
  };

  const iconElement = icon ? (
    typeof icon === 'string' ? (
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    ) : (
      icon
    )
  ) : null;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {iconElement && iconPosition === 'left' && iconElement}
      {children}
      {iconElement && iconPosition === 'right' && iconElement}
    </button>
  );
}
