/**
 * Report & Financial Calculations for Timelens Photobooth Atelier
 */

/**
 * Calculate totals and gross/net profit metrics
 * @param {Array} bookings
 * @param {Array} expenses
 * @returns {Object}
 */
export function calculateFinancialSummary(bookings = [], expenses = []) {
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const marginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    marginPercent: Number(marginPercent)
  };
}

/**
 * Calculate expense aggregation by category
 * @param {Array} expenses
 * @returns {Object} { categoryTotals: Object, total: number }
 */
export function calculateExpensesByCategory(expenses = []) {
  const categoryTotals = {};
  let total = 0;

  for (const item of expenses) {
    const cat = item.category || 'Lainnya';
    const amt = item.amount || 0;
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    total += amt;
  }

  return {
    categoryTotals,
    total
  };
}
