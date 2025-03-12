import { Cryptocurrency, CryptoPortfolio } from '../types/crypto';

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function calculatePortfolioStats(cryptos: Cryptocurrency[]): CryptoPortfolio {
  if (cryptos.length === 0) {
    return {
      totalValue: 0,
      totalChange24h: 0,
      totalChangePercentage24h: 0,
      bestPerformer: null,
      worstPerformer: null,
    };
  }

  const totalValue = cryptos.reduce((sum, crypto) => sum + crypto.currentPrice, 0);
  const totalChange24h = cryptos.reduce((sum, crypto) => sum + crypto.priceChange24h, 0);
  const totalChangePercentage24h = (totalChange24h / (totalValue - totalChange24h)) * 100;

  const sortedByPerformance = [...cryptos].sort(
    (a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h
  );

  return {
    totalValue,
    totalChange24h,
    totalChangePercentage24h,
    bestPerformer: sortedByPerformance[0] || null,
    worstPerformer: sortedByPerformance[sortedByPerformance.length - 1] || null,
  };
}

export function generateHistoricalData(
  currentPrice: number,
  days: number = 30,
  volatility: number = 0.05
): Array<{ date: string; price: number }> {
  const data: Array<{ date: string; price: number }> = [];
  const now = new Date('2022-12-10');

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const daysAgo = i / days;
    const price = currentPrice * (1 + randomChange * daysAgo);

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  return data;
}
