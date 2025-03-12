import { useMemo } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { ElectionData } from '../types'

interface PopularVoteChartProps {
  data: ElectionData[]
}

/**
 * PopularVoteChart Component
 *
 * Pie chart showing national popular vote distribution
 */
export default function PopularVoteChart({ data }: PopularVoteChartProps) {
  const chartOptions: Highcharts.Options = useMemo(() => {
    // Calculate total popular votes
    const totals = data.reduce(
      (acc, state) => {
        acc.dem += state.votes_dem
        acc.rep += state.votes_rep
        acc.total += state.votes_total
        return acc
      },
      { dem: 0, rep: 0, total: 0 }
    )

    // Calculate other votes (third party, etc.)
    const other = totals.total - totals.dem - totals.rep

    // Calculate percentages
    const demPct = (totals.dem / totals.total) * 100
    const repPct = (totals.rep / totals.total) * 100
    const otherPct = (other / totals.total) * 100

    return {
      chart: {
        type: 'pie',
        height: 400,
        backgroundColor: 'transparent'
      },

      title: {
        text: 'Popular Vote Distribution',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937'
        }
      },

      subtitle: {
        text: `Total votes: ${totals.total.toLocaleString()}`,
        style: {
          fontSize: '13px',
          color: '#6b7280'
        }
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%<br>{point.votes}',
            style: {
              fontSize: '12px',
              fontWeight: '500',
              color: '#1f2937',
              textOutline: 'none'
            },
            distance: 20
          },
          showInLegend: true,
          borderWidth: 0
        }
      },

      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '13px',
          fontWeight: '500',
          color: '#4b5563'
        }
      },

      series: [{
        type: 'pie',
        name: 'Votes',
        data: [
          {
            name: 'Democrat',
            y: totals.dem,
            color: '#1e40af',
            sliced: false,
            votes: totals.dem.toLocaleString()
          },
          {
            name: 'Republican',
            y: totals.rep,
            color: '#dc2626',
            sliced: false,
            votes: totals.rep.toLocaleString()
          },
          {
            name: 'Other',
            y: other,
            color: '#6b7280',
            sliced: false,
            votes: other.toLocaleString()
          }
        ]
      }],

      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderRadius: 8,
        shadow: false,
        useHTML: true,
        formatter: function(this: any) {
          const point = this.point
          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: ${this.color};">
                ${this.key}
              </div>
              <div style="font-size: 12px; color: #4b5563;">
                <div>${point.votes} votes</div>
                <div style="font-weight: 500; margin-top: 2px;">${this.percentage?.toFixed(1)}%</div>
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
