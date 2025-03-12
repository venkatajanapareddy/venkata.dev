import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SavingsDoughnutChartProps {
  income: number;
  expenses: number;
}

export default function SavingsDoughnutChart({ income, expenses }: SavingsDoughnutChartProps) {
  const saved = Math.max(0, income - expenses);
  const spent = expenses;

  const data = {
    labels: ['Saved', 'Spent'],
    datasets: [
      {
        data: [saved, spent],
        backgroundColor: ['#3b82f6', '#ef4444'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
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
            const total = income;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return label + ': $' + value.toFixed(2) + ' (' + percentage + '%)';
          },
        },
      },
    },
  };

  if (income === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No income data available</div>;
  }

  return <Doughnut data={data} options={options} />;
}
