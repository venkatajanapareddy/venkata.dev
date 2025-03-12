import { Row, Col, Card, Statistic } from 'antd'
import { useMemo } from 'react'
import { ElectionData } from '../types'

interface ElectionSummaryProps {
  data: ElectionData[]
}

/**
 * ElectionSummary Component
 *
 * Displays summary statistics for the election in a responsive grid:
 * - Number of states won by each party
 * - Total votes received by each party
 *
 * Uses useMemo to avoid recalculating on every render
 */
export default function ElectionSummary({ data }: ElectionSummaryProps) {
  // Calculate summary statistics from election data
  // Memoized to only recalculate when data changes
  const summary = useMemo(() => {
    return data.reduce(
      (acc, state) => {
        // Count state wins and accumulate votes by party
        if (state.winner === 'D') {
          acc.demStates++
          acc.demVotes += state.votes_dem
        } else {
          acc.repStates++
          acc.repVotes += state.votes_rep
        }
        acc.totalVotes += state.votes_total
        return acc
      },
      { demStates: 0, repStates: 0, demVotes: 0, repVotes: 0, totalVotes: 0 }
    )
  }, [data])

  return (
    <Row gutter={16} style={{ marginBottom: '2rem' }}>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Democratic States"
            value={summary.demStates}
            valueStyle={{ color: '#1e40af' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Republican States"
            value={summary.repStates}
            valueStyle={{ color: '#b91c1c' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Total Democratic Votes"
            value={summary.demVotes}
            precision={0}
            valueStyle={{ color: '#1e40af' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card>
          <Statistic
            title="Total Republican Votes"
            value={summary.repVotes}
            precision={0}
            valueStyle={{ color: '#b91c1c' }}
          />
        </Card>
      </Col>
    </Row>
  )
}
