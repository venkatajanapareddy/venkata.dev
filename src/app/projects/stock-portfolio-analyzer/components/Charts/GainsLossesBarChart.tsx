import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Stock } from '@/types/stock';
import { calculateStockGainPercentage, formatPercentage } from '@/utils/stockCalculations';

interface GainsLossesBarChartProps {
  stocks: Stock[];
}

export default function GainsLossesBarChart({ stocks }: GainsLossesBarChartProps) {
  const data = stocks
    .map(stock => ({
      symbol: stock.symbol,
      gain: calculateStockGainPercentage(stock),
    }))
    .sort((a, b) => b.gain - a.gain);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.symbol}</p>
          <p style={{ margin: '4px 0 0 0', color: value >= 0 ? '#10b981' : '#ef4444' }}>
            {formatPercentage(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (stocks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        No stocks in portfolio
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="symbol" />
        <YAxis
          tickFormatter={(value) => `${value.toFixed(0)}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="gain">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.gain >= 0 ? '#10b981' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
