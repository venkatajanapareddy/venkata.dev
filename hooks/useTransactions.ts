import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types/finance';

const STORAGE_KEY = 'finance-tracker-transactions';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  // January Income
  { id: uuidv4(), type: 'income', category: 'salary', amount: 5000, description: 'Monthly Salary', date: '2022-01-15', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'income', category: 'freelance', amount: 1200, description: 'Website Development', date: '2022-01-20', createdAt: new Date().toISOString() },

  // January Expenses
  { id: uuidv4(), type: 'expense', category: 'housing-rent', amount: 1500, description: 'Monthly Rent', date: '2022-01-01', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'utilities', amount: 150, description: 'Electric & Gas', date: '2022-01-05', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'food-dining', amount: 85.50, description: 'Grocery Shopping', date: '2022-01-08', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'transportation', amount: 60, description: 'Gas', date: '2022-01-10', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'entertainment', amount: 45, description: 'Movie Night', date: '2022-01-12', createdAt: new Date().toISOString() },

  // February Income
  { id: uuidv4(), type: 'income', category: 'salary', amount: 5000, description: 'Monthly Salary', date: '2022-02-15', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'income', category: 'investment', amount: 250, description: 'Stock Dividends', date: '2022-02-25', createdAt: new Date().toISOString() },

  // February Expenses
  { id: uuidv4(), type: 'expense', category: 'housing-rent', amount: 1500, description: 'Monthly Rent', date: '2022-02-01', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'utilities', amount: 165, description: 'Electric & Gas', date: '2022-02-05', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'food-dining', amount: 120, description: 'Dinner Out', date: '2022-02-14', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'healthcare', amount: 75, description: 'Doctor Visit Co-pay', date: '2022-02-18', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'shopping', amount: 230, description: 'New Winter Coat', date: '2022-02-22', createdAt: new Date().toISOString() },

  // March Income
  { id: uuidv4(), type: 'income', category: 'salary', amount: 5000, description: 'Monthly Salary', date: '2022-03-15', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'income', category: 'freelance', amount: 800, description: 'Logo Design Project', date: '2022-03-10', createdAt: new Date().toISOString() },

  // March Expenses
  { id: uuidv4(), type: 'expense', category: 'housing-rent', amount: 1500, description: 'Monthly Rent', date: '2022-03-01', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'utilities', amount: 140, description: 'Electric & Gas', date: '2022-03-05', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'food-dining', amount: 95, description: 'Grocery Shopping', date: '2022-03-08', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'transportation', amount: 55, description: 'Gas', date: '2022-03-12', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'entertainment', amount: 180, description: 'Concert Tickets', date: '2022-03-20', createdAt: new Date().toISOString() },
  { id: uuidv4(), type: 'expense', category: 'food-dining', amount: 68, description: 'Birthday Lunch', date: '2022-03-25', createdAt: new Date().toISOString() },
];

interface UseTransactionsReturn {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
}

export default function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        // If no stored data, use sample transactions
        setTransactions(SAMPLE_TRANSACTIONS);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setTransactions(SAMPLE_TRANSACTIONS);
    }
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
  };
}
