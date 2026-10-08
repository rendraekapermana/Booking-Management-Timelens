/**
 * Expenses Service Layer
 * Abstracts data access to enable clean future Supabase migration.
 */

import { initialExpenses } from '../lib/mock/mockData.js';

let expensesState = [...initialExpenses];

export const expenseService = {
  getAll: async () => {
    return Promise.resolve([...expensesState]);
  },

  create: async (newExpense) => {
    expensesState = [newExpense, ...expensesState];
    return Promise.resolve(newExpense);
  },

  update: async (updatedExpense) => {
    expensesState = expensesState.map(e => (e.id === updatedExpense.id ? updatedExpense : e));
    return Promise.resolve(updatedExpense);
  },

  delete: async (id) => {
    expensesState = expensesState.filter(e => e.id !== id);
    return Promise.resolve(id);
  }
};
