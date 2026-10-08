import React from 'react';

/**
 * Standard Status Badge for Timelens Photobooth Atelier
 */
export default function Badge({
  children,
  status,
  variant,
  size = 'md',
  className = ''
}) {
  const getVariantStyles = () => {
    const key = (variant || status || '').toLowerCase();

    if (['confirmed', 'lunas', 'active', 'success', 'dp terverifikasi', 'fully paid'].includes(key)) {
      return 'bg-[#c7ecce] text-[#01210f] border border-[#a2dfae]/50';
    }
    if (['new', 'menunggu dp', 'warning', 'pending', 'baru'].includes(key)) {
      return 'bg-[#febb90]/50 text-[#794827] border border-[#febb90]/60';
    }
    if (['reviewed', 'scheduled', 'neutral', 'draft'].includes(key)) {
      return 'bg-[#ebe8e3] text-[#504440] border border-[#d3c3be]/40';
    }
    if (['rejected', 'cancelled', 'batal', 'danger'].includes(key)) {
      return 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4ab]/50';
    }
    if (['bronze', 'atelier', 'signature'].includes(key)) {
      return 'bg-[#855230]/10 text-[#855230] border border-[#855230]/25';
    }

    return 'bg-[#ebe8e3] text-[#504440] border border-[#d3c3be]/40';
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap ${
        sizes[size] || sizes.md
      } ${getVariantStyles()} ${className}`}
    >
      {children || status}
    </span>
  );
}
