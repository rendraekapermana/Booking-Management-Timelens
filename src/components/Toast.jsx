import React from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-8 z-50 bg-[#2c1810] text-[#fcf9f4] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#d3c3be]/30 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <span className="material-symbols-outlined text-[20px] text-[#c7ecce]">
        {type === 'success' ? 'check_circle' : 'info'}
      </span>
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-[#9e7e73] hover:text-[#fcf9f4] transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
