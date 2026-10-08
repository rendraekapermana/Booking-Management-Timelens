import React, { useState } from 'react';

export default function BookingFormsPage({ onNavigate, onShowToast }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDuration, setNewDuration] = useState('Standard Evening (4 Hours • Dual Strips)');
  const [requireDeposit, setRequireDeposit] = useState(true);

  const publicUrl = `${window.location.origin}/#book/main-atelier`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicUrl);
    onShowToast('Public reservation URL copied to clipboard: ' + publicUrl);
  };

  const handleCreateForm = (e) => {
    e.preventDefault();
    setShowCreateModal(false);
    onShowToast(`New intake form "${newFormName || 'Custom Event Form'}" published!`);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#855230] uppercase tracking-[0.25em] font-semibold">
              Atelier Form Engine
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl text-[#090100] tracking-tight font-serif font-bold">
            Booking Forms
          </h1>
          <p className="text-sm text-[#504440] leading-relaxed">
            Manage public booking request forms for your website and social links. Captured submissions sync directly to your atelier calendar and lead archive.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Create New Form</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-[#504440]">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
              Total Submissions
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#855230]">
              assignment
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl text-[#090100] font-serif font-bold">
              142 <span className="text-xs text-[#504440] font-normal">Pesanan</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#504440] mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d633b]"></span>
              <span>38 bulan ini · +18% vs bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-[#504440]">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
              Monthly Inquiries
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#855230]">
              inbox
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl text-[#090100] font-serif font-bold">
              28
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#504440] mt-1">
              <span className="material-symbols-outlined text-[14px] text-[#855230]">
                trending_up
              </span>
              <span>+14% vs previous month</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('incoming-orders')}
          className="p-5 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 shadow-xs flex flex-col justify-between h-full hover:bg-[#f6f3ee] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#504440]">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#febb90] animate-pulse"></span>
              Perlu Verifikasi
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#855230] group-hover:text-[#090100] transition-colors">
              pending_actions
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl text-[#090100] font-serif font-bold flex items-baseline justify-between">
              <span>15 <span className="text-xs text-[#504440] font-normal">Pesanan</span></span>
              <span className="material-symbols-outlined text-[16px] text-[#827470] group-hover:text-[#090100] transition-colors">
                arrow_forward
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#504440] mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#febb90]"></span>
              <span className="text-[#855230] font-medium">Menunggu cek bukti transfer</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 shadow-xs flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-[#504440]">
            <span className="text-[11px] uppercase tracking-wider text-[#855230] font-semibold">
              Latest Submission
            </span>
            <span className="material-symbols-outlined text-[20px] text-[#855230]">
              schedule
            </span>
          </div>
          <div className="mt-4">
            <div className="text-2xl text-[#090100] font-serif font-bold">
              2 jam lalu
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#504440] mt-1">
              <span className="text-[#090100] font-medium truncate">
                Clara &amp; Julian Engagement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Form Container & Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Detail (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0ede9] pb-5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c7ecce] text-[#01210f] text-xs font-semibold tracking-wide inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d633b] animate-pulse"></span>
                    Active · Live Form
                  </span>
                  <span className="text-xs text-[#504440] tracking-wider uppercase font-mono font-bold">
                    FORM-01
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#f0ede9] text-[#855230] text-xs font-medium">
                    Direct Reservation Flow
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#504440]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#855230]">check_circle</span>
                    Instant Retainer
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#d3c3be]"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#855230]">sync</span>
                    Calendar Sync
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <h2 className="text-2xl text-[#090100] font-serif font-bold">
                    Timelens Official Event Booking Form
                  </h2>
                  <span className="px-3 py-1 bg-[#f6f3ee] rounded-lg font-mono text-xs text-[#855230] font-semibold shrink-0">
                    142 Submissions
                  </span>
                </div>
              </div>

              {/* Public Share URL Box */}
              <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#ebe8e3] flex items-center justify-center shrink-0 text-[#855230]">
                    <span className="material-symbols-outlined text-[18px]">link</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-[#504440] uppercase tracking-wider font-semibold">
                      Public Share URL
                    </span>
                    <span className="text-xs text-[#090100] font-mono truncate select-all font-semibold">
                      timelens.studio/book/main-atelier
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#fcf9f4] text-[#855230] hover:text-[#090100] text-xs font-semibold rounded-lg shadow-xs border border-[#d3c3be]/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('public-booking')}
                    className="px-3.5 py-1.5 bg-[#ffffff] hover:bg-[#fcf9f4] text-[#855230] hover:text-[#090100] text-xs font-semibold rounded-lg shadow-xs border border-[#d3c3be]/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-[#f0ede9] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('public-booking')}
                  className="px-4 py-2 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  <span>Open Live Form</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('edit-booking-form')}
                  className="px-4 py-2 bg-[#f0ede9] hover:bg-[#ebe8e3] text-[#090100] text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Edit Settings</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[#504440] text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#855230]">history</span>
                <span>Updated 3 days ago by Clara V.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Form Submissions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#ffffff] rounded-xl shadow-xs border border-[#d3c3be]/40 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#f0ede9] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#855230] text-[20px]">
                  receipt_long
                </span>
                <span className="text-sm text-[#090100] font-semibold">
                  Recent Form Submissions
                </span>
              </div>
              <span className="text-[11px] text-[#855230] font-mono font-medium">3 Terbaru</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-[#090100] font-semibold truncate">
                    Sarah &amp; Dimas
                  </span>
                  <span className="text-[11px] text-[#504440]">
                    Wedding Reception · 4 Jam
                  </span>
                  <span className="text-[10px] text-[#827470] font-mono mt-0.5">
                    25 Menit yang lalu
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c7ecce] text-[#01210f] whitespace-nowrap">
                  DP Terverifikasi
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-[#090100] font-semibold truncate">
                    Bank Mandiri Gala
                  </span>
                  <span className="text-[11px] text-[#504440]">
                    Corporate Annual Dinner · 6 Jam
                  </span>
                  <span className="text-[10px] text-[#827470] font-mono mt-0.5">
                    2 Jam yang lalu
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c7ecce] text-[#01210f] whitespace-nowrap">
                  Lunas
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 flex items-start justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-[#090100] font-semibold truncate">
                    Arka &amp; Nadira
                  </span>
                  <span className="text-[11px] text-[#504440]">
                    Intimate Engagement · 2 Jam
                  </span>
                  <span className="text-[10px] text-[#827470] font-mono mt-0.5">
                    Kemarin, 19:40
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffdbc7] text-[#693b1b] whitespace-nowrap">
                  Menunggu DP
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#f0ede9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('incoming-orders')}
                className="text-[#855230] hover:text-[#090100] text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">inbox</span>
                <span>Buka Semua Antrean Pesanan</span>
              </button>
              <span className="material-symbols-outlined text-[16px] text-[#827470]">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create New Form */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#090100]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-8 shadow-2xl relative border border-[#d3c3be]/40 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-[#f0ede9]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#855230] uppercase tracking-widest font-semibold">
                  New Intake Channel
                </span>
                <h3 className="text-2xl text-[#090100] font-serif font-bold mt-0.5">
                  Create Booking Form
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#504440] hover:bg-[#f6f3ee]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateForm} className="space-y-4 pt-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
                  Form Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autumn Vintage Weddings 2025"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f3ee] text-[#090100] text-sm focus:outline-none focus:bg-[#ffffff] border border-[#d3c3be]/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
                  Public URL Slug
                </label>
                <div className="flex items-center bg-[#f6f3ee] rounded-lg px-3 py-2 border border-[#d3c3be]/40">
                  <span className="text-xs text-[#827470] font-mono">timelens.studio/book/</span>
                  <input
                    type="text"
                    placeholder="autumn-2025"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="bg-transparent flex-1 text-[#090100] font-mono text-xs focus:outline-none pl-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#504440] font-semibold">
                  Default Duration &amp; Setup
                </label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#f6f3ee] text-[#090100] text-sm focus:outline-none border border-[#d3c3be]/40"
                >
                  <option>Flexible Client Selection (Custom Duration &amp; Specs)</option>
                  <option>Standard Evening (4 Hours • Dual Strips)</option>
                  <option>Intimate Session (2 Hours • Matte 4x6)</option>
                  <option>Full Gala Experience (6–8 Hours • Unlimited Strips + Audio Guestbook)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#f6f3ee] border border-[#d3c3be]/30 mt-2">
                <div className="flex flex-col">
                  <span className="text-xs text-[#090100] font-semibold">Require Initial Retainer</span>
                  <span className="text-[11px] text-[#504440]">Collect minimum 50% deposit upon form submission</span>
                </div>
                <input
                  type="checkbox"
                  checked={requireDeposit}
                  onChange={(e) => setRequireDeposit(e.target.checked)}
                  className="w-4 h-4 accent-[#2c1810]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede9]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#504440]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2c1810] text-[#fcf9f4] hover:bg-[#090100] text-xs font-semibold rounded-lg shadow-sm"
                >
                  Publish Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
