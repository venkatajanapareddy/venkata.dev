import { useEffect, useRef } from 'react'
import { ElectionData } from '../types'

interface ElectionMapProps {
  data: ElectionData[]    // Election results for all states
  topology: any           // US map topology data
}

/**
 * ElectionMap Component
 *
 * Renders an interactive choropleth map of the US showing 2024 election results.
 * States are colored by margin (red = Republican, blue = Democratic, purple = toss-up).
 *
 * Features:
 * - Interactive tooltips with vote counts and percentages
 * - Zoom and pan controls
 * - State abbreviation labels
 * - Color-coded legend
 */
export default function ElectionMap({ data, topology }: ElectionMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Wait until we have all required data and a DOM element to render into
    if (!chartRef.current || !data.length || !topology) return

    // Dynamically import Highcharts on client side only
    import('highcharts').then((HighchartsModule) => {
      const Highcharts = HighchartsModule.default

      // Import and initialize map module
      return import('highcharts/modules/map').then((MapModule) => {
        const initMap = MapModule.default
        if (typeof initMap === 'function') {
          initMap(Highcharts)
        }
        return Highcharts
      })
    }).then((Highcharts) => {
      if (!chartRef.current) return

      // Transform election data into Highcharts map data format
      // Each state needs an 'hc-key' that matches the topology keys
      const mapData = data.map(state => ({
        'hc-key': `us-${state.code.toLowerCase()}`,  // Match topology key format
        value: state.margin,                          // Used for coloring
        winner: state.winner === 'R' ? 'Republican' : 'Democrat',  // For tooltip
        votes_dem: state.votes_dem,                   // For tooltip
        votes_rep: state.votes_rep,                   // For tooltip
        pct_dem: state.pct_dem,                       // For tooltip
        pct_rep: state.pct_rep                        // For tooltip
      }))

      // Create the Highcharts map
      Highcharts.mapChart(chartRef.current, {
        chart: {
          map: topology,  // US map topology
          height: 600
        },
        title: {
          text: '2024 US Presidential Election Results',
          style: {
            fontSize: '24px',
            fontWeight: 'bold'
          }
        },
        subtitle: {
          text: 'County-level data aggregated by state'
        },
        mapNavigation: {
          enabled: true,
          enableMouseWheelZoom: false,  // Prevent scroll hijacking
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        // Color states by margin using data classes (discrete color ranges)
        colorAxis: {
          dataClasses: [
            {
              from: -100,
              to: -20,
              color: '#b91c1c',  // Dark red
              name: 'Strong Republican'
            },
            {
              from: -20,
              to: -5,
              color: '#ef4444',  // Light red
              name: 'Lean Republican'
            },
            {
              from: -5,
              to: 5,
              color: '#a78bfa',  // Purple
              name: 'Toss-up'
            },
            {
              from: 5,
              to: 20,
              color: '#3b82f6',  // Light blue
              name: 'Lean Democrat'
            },
            {
              from: 20,
              to: 100,
              color: '#1e40af',  // Dark blue
              name: 'Strong Democrat'
            }
          ]
        },
        // Map series configuration
        series: [
          {
            type: 'map',
            name: 'States',
            data: mapData,  // Our transformed election data
            states: {
              hover: {
                color: '#BADA55'  // Highlight color on hover
              }
            },
            dataLabels: {
              enabled: true,
              format: '{point.properties.postal-code}'  // Show state abbreviation (e.g., "CA")
            },
            tooltip: {
              headerFormat: '',
              // Custom tooltip format showing state name, winner, margin, and vote details
              pointFormat:
                '<b>{point.properties.name}</b><br>' +
                'Winner: <b>{point.winner}</b><br>' +
                'Margin: <b>{point.value:,.2f}%</b><br>' +
                '<br>' +
                'Democratic: {point.pct_dem}% ({point.votes_dem:,.0f} votes)<br>' +
                'Republican: {point.pct_rep}% ({point.votes_rep:,.0f} votes)'
            }
          }
        ]
      })
    }).catch((error) => {
      console.error('Error loading Highcharts:', error)
    })
  }, [data, topology]) // Re-render map when data or topology changes

  return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
}
