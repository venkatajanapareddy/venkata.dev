export interface Stock {
  id: string;
  symbol: string;
  companyName: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number;
  sector: string;
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercentage: number;
  bestPerformer: Stock | null;
  worstPerformer: Stock | null;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
}

export interface HistoricalData {
  date: string;
  value: number;
}
