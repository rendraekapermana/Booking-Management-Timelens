import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import Textarea from '../ui/Textarea.jsx';
import { formatIDR } from '../../lib/formatters.js';

export default function OrderReviewModal({
  order,
  isOpen,
  onClose,
  onApprove,
  onDecline,
  onShowToast
}) {
  const [internalNote, setInternalNote] = useState('');

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={order.eventTitle}
      description={`Submission Lead ID: ${order.id} • ${order.submittedTime}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Customer & Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#f6f3ee] rounded-xl border border-[#d3c3be]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ebe8e3] text-[#2c1810] flex items-center justify-center font-serif font-bold text-base">
              {order.clientName?.charAt(0) || 'C'}
            </div>
            <div>
              <span className="font-semibold text-sm text-[#090100] block">
                {order.clientName}
              </span>
              <span className="text-xs text-[#504440]">
                {order.clientEmail} • {order.clientPhone}
              </span>
            </div>
          </div>
          <Badge status={order.status} />
        </div>

        {/* Event Schedule & Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider">
              Jadwal & Waktu Acara
            </span>
            <p className="font-semibold text-sm text-[#090100]">
              {order.eventDateFormatted}
            </p>
            <p className="text-[#504440]">{order.eventTime} ({order.duration})</p>
          </div>

          <div className="p-4 rounded-xl bg-[#ffffff] border border-[#d3c3be]/40 space-y-1.5">
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider">
              Lokasi & Venue
            </span>
            <p className="font-semibold text-sm text-[#090100] truncate">
              {order.venueName}
            </p>
            <p className="text-[#504440] truncate">{order.venueDetail}</p>
          </div>
        </div>

        {/* Investment breakdown */}
        <div className="p-4 rounded-xl bg-[#f6f3ee] border border-[#d3c3be]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#855230] tracking-wider block">
              Estimasi Total Nilai
            </span>
            <span className="text-xl font-serif font-bold text-[#090100]">
              {formatIDR(order.packageTotal || 3500000)}
            </span>
          </div>
          <span className="text-xs text-[#504440]">Down Payment 50% Required</span>
        </div>

        {/* Internal Note */}
        <Textarea
          label="Catatan Verifikasi Studio (Internal)"
          rows={3}
          placeholder="Tuliskan catatan koordinasi loading dock, konfirmasi WhatsApp, dll..."
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f1ece4]">
          <Button
            variant="danger"
            onClick={() => onDecline(order)}
            disabled={order.status === 'rejected'}
          >
            Tolak Pesanan
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (onShowToast) onShowToast('Catatan internal disimpan.');
                onClose();
              }}
            >
              Simpan Catatan
            </Button>
            <Button
              variant="primary"
              onClick={() => onApprove(order)}
              disabled={order.status === 'confirmed'}
            >
              Konfirmasi & Jadwalkan
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
