/**
 * Incoming Orders Service Layer
 * Abstracts data access to enable clean future Supabase migration.
 */

import { initialIncomingOrders } from '../lib/mock/mockData.js';

let ordersState = [...initialIncomingOrders];

export const orderService = {
  getAll: async () => {
    return Promise.resolve([...ordersState]);
  },

  updateStatus: async (orderId, newStatus) => {
    ordersState = ordersState.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
    return Promise.resolve(ordersState.find(o => o.id === orderId));
  },

  create: async (newOrder) => {
    ordersState = [newOrder, ...ordersState];
    return Promise.resolve(newOrder);
  }
};
