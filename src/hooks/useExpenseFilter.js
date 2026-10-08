import { useMemo } from 'react';

/**
 * Hook to filter expenses by category, period, and search query
 * @param {Array} expenses
 * @param {Object} filters
 * @param {string} filters.category
 * @param {string} filters.period
 * @param {string} filters.query
 * @returns {Object} { filteredExpenses, totalCalculated }
 */
export function useExpenseFilter(expenses = [], { category = 'all', period = '2024-10', query = '' }) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();

    const filtered = expenses.filter((item) => {
      const matchesCategory =
        category === 'all' ||
        item.category?.toLowerCase().includes(category.toLowerCase());
      const matchesPeriod =
        period === 'all' || item.period === period;
      const matchesSearch =
        !q ||
        item.eventName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      return matchesCategory && matchesPeriod && matchesSearch;
    });

    const total = filtered.reduce((sum, item) => sum + (item.amount || 0), 0);

    return {
      filteredExpenses: filtered,
      totalCalculated: total
    };
  }, [expenses, category, period, query]);
}
