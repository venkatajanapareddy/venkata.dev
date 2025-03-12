import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { ElectionData } from '../types'

interface StateMarginsChartProps {
  data: ElectionData[]
}

/**
 * StateMarginsChart Component
 *
 * Column chart showing victory margins by state
 * Democrat wins = positive (blue), Republican wins = negative (red)
 */
export default function StateMarginsChart({ data }: StateMarginsChartProps) {
  const chartOptions: Highcharts.Options = useMemo(() => {
    // Sort states by margin (largest Dem wins to largest Rep wins)
    const sortedData = [...data].sort((a, b) => {
      const aValue = a.winner === 'D' ? a.margin : -a.margin
      const bValue = b.winner === 'D' ? b.margin : -b.margin
      return bValue - aValue
    })

    return {
      chart: {
        type: 'column',
        height: 500,
        backgroundColor: 'transparent'
      },

      title: {
        text: 'Victory Margins by State',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937'
        }
      },

      subtitle: {
        text: 'Sorted by margin (Democrat advantage → Republican advantage)',
        style: {
          fontSize: '13px',
          color: '#6b7280'
        }
      },

      xAxis: {
        categories: sortedData.map(state => state.code),
        title: {
          text: 'State',
          style: { color: '#6b7280', fontSize: '12px' }
        },
        labels: {
          style: { fontSize: '11px', color: '#4b5563' }
        }
      },

      yAxis: {
        title: {
          text: 'Margin (%)',
          style: { color: '#6b7280', fontSize: '12px' }
        },
        labels: {
          style: { fontSize: '11px', color: '#4b5563' },
          formatter: function() {
            return Math.abs(this.value as number) + '%'
          }
        },
        plotLines: [{
          value: 0,
          color: '#000',
          width: 2,
          zIndex: 4
        }]
      },

      legend: {
        enabled: false
      },

      plotOptions: {
        column: {
          borderWidth: 0,
          groupPadding: 0.05,
          pointPadding: 0.05
        }
      },

      series: [{
        type: 'column',
        name: 'Margin',
        data: sortedData.map(state => ({
          y: state.winner === 'D' ? state.margin : -state.margin,
          color: state.winner === 'D' ? '#1e40af' : '#dc2626',
          name: state.code
        }))
      }],

      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: false,
        useHTML: true,
        formatter: function(this: any) {
          const point = this.point
          const margin = Math.abs(this.y as number)
          const winner = (this.y as number) > 0 ? 'Democrat' : 'Republican'
          const color = (this.y as number) > 0 ? '#1e40af' : '#dc2626'

          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${this.x}</div>
              <div style="color: ${color}; font-weight: 500; font-size: 12px;">
                ${winner} +${margin.toFixed(1)}%
              </div>
            </div>
          `
        }
      },

      credits: {
        enabled: false
      }
    }
  }, [data])

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e1e4e8',
        borderRadius: '4px',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  )
}
