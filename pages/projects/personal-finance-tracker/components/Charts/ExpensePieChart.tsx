import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { ExpensesByCategory } from '../../../../../types/finance';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

interface ExpensePieChartProps {
  expensesByCategory: ExpensesByCategory;
}

export default function ExpensePieChart({ expensesByCategory }: ExpensePieChartProps) {
  const categories = Object.keys(expensesByCategory);
  const amounts = Object.values(expensesByCategory);

  const data = {
    labels: categories.map(cat => cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    datasets: [
      {
        data: amounts,
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
          },
        },
      },
    },
  };

  if (categories.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No expense data available</div>;
  }

  return <Pie data={data} options={options} />;
}
