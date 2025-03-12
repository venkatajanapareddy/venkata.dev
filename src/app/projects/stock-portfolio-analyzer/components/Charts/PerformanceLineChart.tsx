import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Stock } from '@/types/stock';
import { calculatePortfolioStats, formatCurrency } from '@/utils/stockCalculations';

interface PerformanceLineChartProps {
  stocks: Stock[];
}

export default function PerformanceLineChart({ stocks }: PerformanceLineChartProps) {
  // Generate mock historical data for the last 6 months
  const generateHistoricalData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const stats = calculatePortfolioStats(stocks);
    const currentValue = stats.totalValue;
    const totalCost = stats.totalCost;

    // Generate a trend from cost to current value
    const data = months.map((month, index) => {
      const progress = index / (months.length - 1);
      const value = totalCost + (currentValue - totalCost) * progress;
      // Add some random variation (+/- 5%)
      const variation = value * 0.05 * (Math.random() - 0.5) * 2;
      return {
        month,
        value: Math.max(0, value + variation),
      };
    });

    // Ensure the last month is the current value
    data[data.length - 1].value = currentValue;

    return data;
  };

  const data = stocks.length > 0 ? generateHistoricalData() : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.month} 2022</p>
          <p style={{ margin: '4px 0 0 0', color: '#0088FE' }}>
            {formatCurrency(payload[0].value)}
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
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0088FE"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Portfolio Value"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
