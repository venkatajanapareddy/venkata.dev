import { startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { Transaction, MonthlyTotals, ExpensesByCategory, MonthlyData } from '../types/finance';

export function calculateTotals(transactions: Transaction[], month: Date = new Date()): MonthlyTotals {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const monthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = income - expenses;
  const savingsRate = income > 0 ? netSavings / income : 0;

  return {
    income,
    expenses,
    netSavings,
    savingsRate,
  };
}

export function getExpensesByCategory(transactions: Transaction[], month: Date = new Date()): ExpensesByCategory {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  const monthExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return t.type === 'expense' && isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
  });

  const byCategory: ExpensesByCategory = {};
  monthExpenses.forEach(t => {
    if (!byCategory[t.category]) {
      byCategory[t.category] = 0;
    }
    byCategory[t.category] += t.amount;
  });

  return byCategory;
}

export function getMonthlyData(transactions: Transaction[], monthsBack: number = 6, endDate?: Date): MonthlyData[] {
  const months: MonthlyData[] = [];
  const referenceDate = endDate || new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const month = subMonths(referenceDate, i);
    const totals = calculateTotals(transactions, month);
    months.push({
      month: month.toISOString().slice(0, 7), // YYYY-MM format
      income: totals.income,
      expenses: totals.expenses,
    });
  }

  return months;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
