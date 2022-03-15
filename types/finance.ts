export type TransactionType = 'income' | 'expense';

export type IncomeCategory = 'salary' | 'freelance' | 'investment' | 'other';

export type ExpenseCategory =
  | 'food-dining'
  | 'housing-rent'
  | 'utilities'
  | 'transportation'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'other';

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface MonthlyTotals {
  income: number;
  expenses: number;
  netSavings: number;
  savingsRate: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpensesByCategory {
  [category: string]: number;
}
