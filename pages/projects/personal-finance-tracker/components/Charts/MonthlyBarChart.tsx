import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { MonthlyTotals } from '../../../../../types/finance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyBarChartProps {
  currentMonth: MonthlyTotals;
  previousMonth: MonthlyTotals;
}

export default function MonthlyBarChart({ currentMonth, previousMonth }: MonthlyBarChartProps) {
  const data = {
    labels: ['Last Month', 'This Month'],
    datasets: [
      {
        label: 'Income',
        data: [previousMonth.income, currentMonth.income],
        backgroundColor: '#10b981',
      },
      {
        label: 'Expenses',
        data: [previousMonth.expenses, currentMonth.expenses],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
