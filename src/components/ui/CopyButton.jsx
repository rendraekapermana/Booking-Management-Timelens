import React, { useState } from 'react';

/**
 * Copy to Clipboard Button with visual feedback
 */
export default function CopyButton({
  text,
  label = 'Salin',
  onCopySuccess,
  className = ''
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    if (onCopySuccess) onCopySuccess(text);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
        copied
          ? 'bg-[#c7ecce] text-[#01210f] border-[#a2dfae]'
          : 'bg-[#ffffff] text-[#855230] border-[#d3c3be]/60 hover:bg-[#f6f3ee]'
      } ${className}`}
    >
      <span className="material-symbols-outlined text-[15px]">
        {copied ? 'check' : 'content_copy'}
      </span>
      <span>{copied ? 'Tersalin' : label}</span>
    </button>
  );
}
