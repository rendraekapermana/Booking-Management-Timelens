/**
 * Booking Service Layer
 * Abstracts data access to enable clean future Supabase migration.
 */

import { initialBookings } from '../lib/mock/mockData.js';

let bookingsState = [...initialBookings];

export const bookingService = {
  getAll: async () => {
    return Promise.resolve([...bookingsState]);
  },

  getById: async (id) => {
    const booking = bookingsState.find(b => b.id === id);
    return Promise.resolve(booking || null);
  },

  create: async (newBooking) => {
    bookingsState = [newBooking, ...bookingsState];
    return Promise.resolve(newBooking);
  },

  update: async (updated) => {
    bookingsState = bookingsState.map(b => (b.id === updated.id ? updated : b));
    return Promise.resolve(updated);
  },

  recordPayment: async (bookingId, amount) => {
    const booking = bookingsState.find(b => b.id === bookingId);
    if (!booking) return Promise.reject(new Error('Booking not found'));

    const newPaid = (booking.downPayment || 0) + amount;
    const newRemaining = Math.max(0, (booking.totalPrice || 0) - newPaid);
    const updated = {
      ...booking,
      downPayment: newPaid,
      remainingDue: newRemaining,
      status: newRemaining === 0 ? 'Fully Paid' : booking.status
    };

    bookingsState = bookingsState.map(b => (b.id === bookingId ? updated : b));
    return Promise.resolve(updated);
  }
};
