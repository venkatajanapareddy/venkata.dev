import { Stock, PortfolioStats, SectorAllocation } from '../types/stock';

export function calculateStockValue(stock: Stock): number {
  return stock.shares * stock.currentPrice;
}

export function calculateStockCost(stock: Stock): number {
  return stock.shares * stock.purchasePrice;
}

export function calculateStockGain(stock: Stock): number {
  return calculateStockValue(stock) - calculateStockCost(stock);
}

export function calculateStockGainPercentage(stock: Stock): number {
  const cost = calculateStockCost(stock);
  if (cost === 0) return 0;
  return (calculateStockGain(stock) / cost) * 100;
}

export function calculatePortfolioStats(stocks: Stock[]): PortfolioStats {
  if (stocks.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalGain: 0,
      totalGainPercentage: 0,
      bestPerformer: null,
      worstPerformer: null,
    };
  }

  const totalValue = stocks.reduce((sum, stock) => sum + calculateStockValue(stock), 0);
  const totalCost = stocks.reduce((sum, stock) => sum + calculateStockCost(stock), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const stocksWithGains = stocks.map(stock => ({
    stock,
    gainPercentage: calculateStockGainPercentage(stock),
  }));

  const bestPerformer = stocksWithGains.reduce((best, current) =>
    current.gainPercentage > best.gainPercentage ? current : best
  ).stock;

  const worstPerformer = stocksWithGains.reduce((worst, current) =>
    current.gainPercentage < worst.gainPercentage ? current : worst
  ).stock;

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercentage,
    bestPerformer,
    worstPerformer,
  };
}

export function calculateSectorAllocation(stocks: Stock[]): SectorAllocation[] {
  const sectorMap = new Map<string, number>();
  let totalValue = 0;

  stocks.forEach(stock => {
    const value = calculateStockValue(stock);
    totalValue += value;
    sectorMap.set(stock.sector, (sectorMap.get(stock.sector) || 0) + value);
  });

  const allocations: SectorAllocation[] = [];
  sectorMap.forEach((value, sector) => {
    allocations.push({
      sector,
      value,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
    });
  });

  return allocations.sort((a, b) => b.value - a.value);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
