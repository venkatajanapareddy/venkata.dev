export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  lastUpdated: string;
}

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface CryptoPortfolio {
  totalValue: number;
  totalChange24h: number;
  totalChangePercentage24h: number;
  bestPerformer: Cryptocurrency | null;
  worstPerformer: Cryptocurrency | null;
}

export interface CryptoHolding {
  id: string;
  cryptoId: string;
  symbol: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}
