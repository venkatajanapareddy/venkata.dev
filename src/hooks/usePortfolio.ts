import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Stock } from '../types/stock';

const STORAGE_KEY = 'stock-portfolio';

// Sample portfolio data (June 2022 prices)
const SAMPLE_STOCKS: Stock[] = [
  {
    id: uuidv4(),
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 50,
    purchasePrice: 125.50,
    purchaseDate: '2022-01-15',
    currentPrice: 141.66,
    sector: 'Technology',
  },
  {
    id: uuidv4(),
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 25,
    purchasePrice: 295.00,
    purchaseDate: '2021-11-20',
    currentPrice: 259.58,
    sector: 'Technology',
  },
  {
    id: uuidv4(),
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    shares: 10,
    purchasePrice: 2650.00,
    purchaseDate: '2021-12-10',
    currentPrice: 2250.43,
    sector: 'Technology',
  },
  {
    id: uuidv4(),
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    shares: 30,
    purchasePrice: 125.00,
    purchaseDate: '2022-06-05',
    currentPrice: 113.00,
    sector: 'Retail',
  },
  {
    id: uuidv4(),
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    shares: 15,
    purchasePrice: 850.00,
    purchaseDate: '2021-10-25',
    currentPrice: 699.21,
    sector: 'Automotive',
  },
  {
    id: uuidv4(),
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    shares: 40,
    purchasePrice: 145.00,
    purchaseDate: '2022-03-15',
    currentPrice: 169.40,
    sector: 'Technology',
  },
  {
    id: uuidv4(),
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    shares: 20,
    purchasePrice: 130.00,
    purchaseDate: '2022-02-01',
    currentPrice: 117.15,
    sector: 'Financial',
  },
];

export default function usePortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStocks(JSON.parse(stored));
      } else {
        setStocks(SAMPLE_STOCKS);
      }
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      setStocks(SAMPLE_STOCKS);
    }
  }, []);

  useEffect(() => {
    if (stocks.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
      } catch (error) {
        console.error('Failed to save portfolio:', error);
      }
    }
  }, [stocks]);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = {
      ...stock,
      id: uuidv4(),
    };
    setStocks([...stocks, newStock]);
  };

  const updateStock = (id: string, updates: Partial<Stock>) => {
    setStocks(stocks.map(stock =>
      stock.id === id ? { ...stock, ...updates } : stock
    ));
  };

  const deleteStock = (id: string) => {
    setStocks(stocks.filter(stock => stock.id !== id));
  };

  const clearAllStocks = () => {
    setStocks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    stocks,
    addStock,
    updateStock,
    deleteStock,
    clearAllStocks,
  };
}
