import React from 'react';
import { studioProfile } from '../data/mockData.js';

export default function Sidebar({ currentView, onNavigate, onLogout }) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
  ];

  const bookingNav = [
    { id: 'incoming-orders', label: 'Incoming Orders', icon: 'inbox' },
    { id: 'booking-forms', label: 'Booking Forms', icon: 'assignment' },
  ];

  const businessNav = [
    { id: 'expenses', label: 'Expenses', icon: 'receipt_long' },
    { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  ];

  const settingsNav = [
    { id: 'invoice-settings', label: 'Invoice Settings', icon: 'tune' },
  ];

  const renderNavGroup = (title, items) => (
    <div className="flex flex-col gap-1">
      <span className="px-3 pb-1 text-[11px] text-[#855230] uppercase tracking-widest font-semibold">
        {title}
      </span>
      {items.map((item) => {
        const isActive = currentView === item.id || 
          (item.id === 'incoming-orders' && currentView === 'booking-detail') ||
          (item.id === 'booking-forms' && currentView === 'edit-booking-form') ||
          (item.id === 'expenses' && currentView === 'add-expense') ||
          (item.id === 'invoice-settings' && currentView === 'invoice-preview');

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 text-left ${
              isActive
                ? 'bg-[#2c1810] text-[#fcf9f4] shadow-sm'
                : 'text-[#504440] hover:bg-[#ebe8e3] hover:text-[#1c1c19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] select-none">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#f6f3ee] border-r border-[#d3c3be]/60 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)] select-none">
      <div className="flex flex-col flex-1 overflow-y-auto px-6 pt-6 pb-4">
        {/* Logo lockup matching reference */}
        <div className="flex items-center gap-3 pb-6 border-b border-[#d3c3be]/40">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center cursor-pointer text-left"
          >
            <img
              src={studioProfile.logo}
              alt="Timelens"
              className="h-8 w-auto object-contain"
            />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 flex flex-col gap-6 pt-6">
          {renderNavGroup('MAIN', mainNav)}
          {renderNavGroup('BOOKING', bookingNav)}
          {renderNavGroup('BUSINESS', businessNav)}
          {renderNavGroup('SETTINGS', settingsNav)}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-[#d3c3be]/40 bg-[#f0ede9]/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#ffffff]/80 border border-[#d3c3be]/30 mb-2 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#d3c3be]/50 shrink-0"
              src={studioProfile.owner.avatar}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-[#090100] font-medium truncate">
                {studioProfile.owner.name}
              </span>
              <span className="text-[11px] text-[#504440] truncate">
                {studioProfile.owner.title}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-[#504440] hover:text-[#ba1a1a] hover:bg-[#ebe8e3] rounded text-xs font-semibold transition-colors duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
