import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { formatIDR } from '../../lib/formatters.js';

export default function RecordPaymentModal({
  isOpen,
  onClose,
  booking,
  onRecordPayment
}) {
  const [paymentAmount, setPaymentAmount] = useState(booking?.remainingDue || 0);
  const [paymentMethod, setPaymentMethod] = useState('Transfer BCA');
  const [notes, setNotes] = useState('Pelunasan sisa invoice via bank transfer');

  if (!booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(paymentAmount) || 0;
    onRecordPayment(amt, { paymentMethod, notes });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Masuk"
      description={`Rekam penyelesaian pembayaran untuk ${booking.eventName} (${booking.id})`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-[#f6f3ee] p-4 rounded-xl border border-[#d3c3be]/40 text-xs space-y-2">
          <div className="flex justify-between text-[#504440]">
            <span>Total Tagihan Reservasi:</span>
            <span className="font-semibold text-[#090100]">{formatIDR(booking.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-[#504440]">
            <span>Telah Diterima Sebelumnya:</span>
            <span className="font-semibold text-[#01210f]">{formatIDR(booking.downPayment)}</span>
          </div>
          <div className="flex justify-between text-[#855230] pt-1 border-t border-[#d3c3be]/40 font-semibold">
            <span>Sisa Tagihan Tertunggak:</span>
            <span>{formatIDR(booking.remainingDue)}</span>
          </div>
        </div>

        <Input
          label="Nominal Pembayaran Diterima (Rp)"
          type="number"
          required
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          helperText={`Masukkan angka tanpa titik. Sisa pelunasan saat ini ${formatIDR(booking.remainingDue)}.`}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#504440]">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Transfer BCA', 'Transfer Mandiri', 'Cash / Tunai', 'QRIS'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                  paymentMethod === method
                    ? 'bg-[#ffffff] border-[#855230] text-[#855230] shadow-xs ring-1 ring-[#855230]'
                    : 'bg-[#f6f3ee]/40 border-[#d3c3be]/60 text-[#504440] hover:bg-[#ffffff]'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Catatan Pembayaran"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Bukti transfer diterima via WhatsApp PIC"
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1ece4]">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Pembayaran
          </Button>
        </div>
      </form>
    </Modal>
  );
}
