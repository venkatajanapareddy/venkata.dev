import Head from 'next/head'
import Link from 'next/link'
import { Button, Card, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import { useElectionData } from './hooks/useElectionData'
import ElectionSummary from './components/ElectionSummary'
import ElectoralVoteCounter from './components/ElectoralVoteCounter'
import StateResultsTable from './components/StateResultsTable'
import StateMarginsChart from './components/StateMarginsChart'
import PopularVoteChart from './components/PopularVoteChart'

const { Title, Paragraph } = Typography

/**
 * Dynamically import ElectionMap component with SSR disabled
 * This ensures Highcharts only loads on the client side, avoiding SSR errors
 */
const ElectionMap = dynamic(() => import('./components/ElectionMap'), {
  ssr: false,  // Client-side only
  loading: () => <div style={{ textAlign: 'center', padding: '3rem' }}>Loading map...</div>
})

/**
 * Election 2024 Dashboard Page
 *
 * Displays an interactive visualization of the 2024 US Presidential Election results.
 * Includes summary statistics and an interactive choropleth map of all 50 states + DC.
 */
export default function Election2024Dashboard() {
  // Fetch election data and map topology using custom hook
  const { data, topology, loading, error } = useElectionData()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem'
      }}
    >
      <Head>
        <title>2024 US Presidential Election Results Dashboard</title>
        <meta
          name="description"
          content="Interactive visualization of 2024 US Presidential Election results by state"
        />
      </Head>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Card
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            background: 'rgba(255, 255, 255, 0.98)',
            marginBottom: '2rem'
          }}
          bodyStyle={{ padding: '2rem' }}
        >
          <Link href="/projects">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              style={{ padding: 0, marginBottom: '1rem' }}
            >
              Back to Projects
            </Button>
          </Link>

          <Title level={1}>2024 US Presidential Election Results</Title>
          <Paragraph>
            Interactive state-level visualization of the 2024 US Presidential Election results.
            Data aggregated from county-level results.
          </Paragraph>

          {/* Electoral Vote Counter - only show when data is loaded */}
          {!loading && data.length > 0 && <ElectoralVoteCounter data={data} />}

          {/* Summary statistics - only show when data is loaded */}
          {!loading && data.length > 0 && <ElectionSummary data={data} />}

          {/* Interactive map with loading and error states */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Title level={3}>Loading election data...</Title>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Title level={3}>Error loading data</Title>
              <Paragraph>{error.message}</Paragraph>
            </div>
          ) : (
            <ElectionMap data={data} topology={topology} />
          )}

          {/* State Margins Chart - only show when data is loaded */}
          {!loading && data.length > 0 && <StateMarginsChart data={data} />}

          {/* Popular Vote Chart - only show when data is loaded */}
          {!loading && data.length > 0 && <PopularVoteChart data={data} />}

          {/* State Results Table - only show when data is loaded */}
          {!loading && data.length > 0 && <StateResultsTable data={data} />}

          {/* Data Attribution */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f3f4f6',
              borderRadius: '8px'
            }}
          >
            <Paragraph style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              <strong>Data Source:</strong> U.S. County Level Election Results (2008-2024),{' '}
              <a
                href="https://github.com/tonmcg/US_County_Level_Election_Results_08-24"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/tonmcg/US_County_Level_Election_Results_08-24
              </a>
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  )
}
