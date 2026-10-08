import React from 'react';
import { studioProfile } from '../data/mockData.js';

export default function Header({ currentView, onNavigate, onOpenNewBooking }) {
  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'dashboard':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'calendar':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'incoming-orders':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'booking-detail':
        return { section: 'Bookings', title: 'BK-2024-089' };
      case 'booking-forms':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'edit-booking-form':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'expenses':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'add-expense':
        return { section: 'Expenses', title: 'Add Expenses' };
      case 'reports':
        return { section: 'Atelier', title: 'Studio Management', sub: 'Laporan & Analitik' };
      case 'invoice-settings':
        return { section: 'Atelier', title: 'Studio Management' };
      case 'invoice-preview':
        return { section: 'Paris Atelier', title: 'Salon Saint-Germain' };
      default:
        return { section: 'Atelier', title: 'Studio Management' };
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#fcf9f4]/90 backdrop-blur-md border-b border-[#d3c3be]/50 z-40 px-8 flex items-center justify-between shadow-[0_1px_4px_rgba(44,24,16,0.02)]">
      {/* Left breadcrumb */}
      <div className="flex items-center gap-2 text-[#504440]">
        <span className="text-xs uppercase tracking-wider text-[#855230] font-semibold">
          {breadcrumbs.section}
        </span>
        <span className="material-symbols-outlined text-[14px] text-[#827470]">
          chevron_right
        </span>
        <span className="text-sm text-[#1c1c19] font-semibold">
          {breadcrumbs.title}
        </span>
        {breadcrumbs.sub && (
          <>
            <span className="material-symbols-outlined text-[14px] text-[#827470]">
              chevron_right
            </span>
            <span className="text-sm text-[#090100] font-bold">
              {breadcrumbs.sub}
            </span>
          </>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Quick link to public reservation form */}
        <button
          type="button"
          onClick={() => onNavigate('public-booking')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3c3be]/60 hover:bg-[#ebe8e3] text-xs font-medium text-[#855230] transition-colors"
          title="Open Public Client Reservation Form"
        >
          <span className="material-symbols-outlined text-[15px]">public</span>
          <span>Public Form</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewBooking}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c1810] text-[#ffffff] hover:bg-[#090100] text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Booking</span>
        </button>

        <div className="h-6 w-px bg-[#d3c3be]/60"></div>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="cursor-pointer"
          title="Clara Vance Profile"
        >
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#d3c3be]"
            src={studioProfile.owner.avatar}
          />
        </button>
      </div>
    </header>
  );
}
