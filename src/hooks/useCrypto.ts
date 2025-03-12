import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cryptocurrency } from '../types/crypto';

const STORAGE_KEY = 'crypto-tracker';

// Sample cryptocurrency data (December 2022 - Crypto Winter prices)
const SAMPLE_CRYPTOS: Cryptocurrency[] = [
  {
    id: uuidv4(),
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 17235.45,
    priceChange24h: -425.23,
    priceChangePercentage24h: -2.41,
    marketCap: 331200000000,
    volume24h: 18500000000,
    circulatingSupply: 19200000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 1247.82,
    priceChange24h: 35.67,
    priceChangePercentage24h: 2.94,
    marketCap: 152400000000,
    volume24h: 7800000000,
    circulatingSupply: 122000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'BNB',
    name: 'Binance Coin',
    currentPrice: 285.42,
    priceChange24h: 8.23,
    priceChangePercentage24h: 2.97,
    marketCap: 45800000000,
    volume24h: 890000000,
    circulatingSupply: 160000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'XRP',
    name: 'Ripple',
    currentPrice: 0.3842,
    priceChange24h: -0.0123,
    priceChangePercentage24h: -3.10,
    marketCap: 19200000000,
    volume24h: 1200000000,
    circulatingSupply: 50000000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'ADA',
    name: 'Cardano',
    currentPrice: 0.2654,
    priceChange24h: 0.0087,
    priceChangePercentage24h: 3.39,
    marketCap: 9200000000,
    volume24h: 345000000,
    circulatingSupply: 34600000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'SOL',
    name: 'Solana',
    currentPrice: 13.42,
    priceChange24h: -0.78,
    priceChangePercentage24h: -5.49,
    marketCap: 4900000000,
    volume24h: 456000000,
    circulatingSupply: 365000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'DOT',
    name: 'Polkadot',
    currentPrice: 4.52,
    priceChange24h: 0.15,
    priceChangePercentage24h: 3.43,
    marketCap: 5200000000,
    volume24h: 287000000,
    circulatingSupply: 1150000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
  {
    id: uuidv4(),
    symbol: 'MATIC',
    name: 'Polygon',
    currentPrice: 0.8923,
    priceChange24h: 0.0456,
    priceChangePercentage24h: 5.38,
    marketCap: 7800000000,
    volume24h: 423000000,
    circulatingSupply: 8740000000,
    lastUpdated: '2022-12-10T12:00:00Z',
  },
];

export default function useCrypto() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCryptos(JSON.parse(stored));
      } else {
        setCryptos(SAMPLE_CRYPTOS);
      }
    } catch (error) {
      console.error('Failed to load crypto data:', error);
      setCryptos(SAMPLE_CRYPTOS);
    }
  }, []);

  useEffect(() => {
    if (cryptos.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cryptos));
      } catch (error) {
        console.error('Failed to save crypto data:', error);
      }
    }
  }, [cryptos]);

  const updateCrypto = (id: string, updates: Partial<Cryptocurrency>) => {
    setCryptos(cryptos.map(crypto =>
      crypto.id === id ? { ...crypto, ...updates } : crypto
    ));
  };

  const refreshPrices = () => {
    setCryptos(cryptos.map(crypto => {
      const randomChange = (Math.random() - 0.5) * 0.05;
      const newPrice = crypto.currentPrice * (1 + randomChange);
      const priceChange = newPrice - crypto.currentPrice;
      const priceChangePercentage = (priceChange / crypto.currentPrice) * 100;

      return {
        ...crypto,
        currentPrice: parseFloat(newPrice.toFixed(2)),
        priceChange24h: parseFloat(priceChange.toFixed(2)),
        priceChangePercentage24h: parseFloat(priceChangePercentage.toFixed(2)),
        lastUpdated: new Date().toISOString(),
      };
    }));
  };

  const resetData = () => {
    setCryptos(SAMPLE_CRYPTOS);
  };

  return {
    cryptos,
    updateCrypto,
    refreshPrices,
    resetData,
  };
}
