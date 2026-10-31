import React from "react";

export default function Header({ onNavigate }) {
  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#fcf9f4]/90 backdrop-blur-md border-b border-[#d3c3be]/50 z-40 px-8 flex items-center justify-between shadow-[0_1px_4px_rgba(44,24,16,0.02)]">
      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Quick link to public reservation form */}
        <button
          type="button"
          onClick={() => onNavigate("public-booking")}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3c3be]/60 hover:bg-[#ebe8e3] text-xs font-medium text-[#855230] transition-colors"
          title="Open Public Client Reservation Form"
        >
          <span className="material-symbols-outlined text-[15px]">public</span>
          <span>Public Form</span>
        </button>
      </div>
    </header>
  );
}
