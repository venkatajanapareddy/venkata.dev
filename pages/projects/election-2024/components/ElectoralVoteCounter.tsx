import { useMemo } from 'react'
import { ElectionData } from '../types'

interface ElectoralVoteCounterProps {
  data: ElectionData[]
}

/**
 * ElectoralVoteCounter Component
 *
 * Clean, professional electoral vote counter inspired by CNN/NYT/BBC designs
 */
export default function ElectoralVoteCounter({ data }: ElectoralVoteCounterProps) {
  // Calculate electoral vote totals by party
  const { demVotes, repVotes } = useMemo(() => {
    return data.reduce(
      (acc, state) => {
        if (state.winner === 'D') {
          acc.demVotes += state.electoral_votes
        } else {
          acc.repVotes += state.electoral_votes
        }
        return acc
      },
      { demVotes: 0, repVotes: 0 }
    )
  }, [data])

  const demPercentage = (demVotes / 538) * 100
  const repPercentage = (repVotes / 538) * 100
  const winner = repVotes >= 270 ? 'rep' : demVotes >= 270 ? 'dem' : null

  return (
    <div
      style={{
        background: '#f8f9fa',
        border: '1px solid #e1e4e8',
        borderRadius: '4px',
        padding: '24px',
        marginBottom: '24px'
      }}
    >
      {/* Results Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '20px'
        }}
      >
        {/* Democrat */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#6b7280',
              marginBottom: '8px'
            }}
          >
            Democrat
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1,
              color: '#1e40af',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {demVotes}
          </div>
        </div>

        {/* 270 to Win */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#6b7280',
              marginBottom: '4px'
            }}
          >
            270 to Win
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#9ca3af',
              fontWeight: 500
            }}
          >
            538 Electoral Votes
          </div>
        </div>

        {/* Republican */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#6b7280',
              marginBottom: '8px'
            }}
          >
            Republican
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 700,
              lineHeight: 1,
              color: '#dc2626',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {repVotes}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          position: 'relative',
          height: '8px',
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        {/* Democrat portion */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${demPercentage}%`,
            background: '#1e40af',
            transition: 'width 0.3s ease'
          }}
        />

        {/* Republican portion */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: `${repPercentage}%`,
            background: '#dc2626',
            transition: 'width 0.3s ease'
          }}
        />

        {/* 270 threshold marker */}
        <div
          style={{
            position: 'absolute',
            left: '50.19%',
            top: '-2px',
            bottom: '-2px',
            width: '2px',
            background: '#000',
            zIndex: 10
          }}
        />
      </div>

      {/* Winner Label */}
      {winner && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: winner === 'rep' ? '#fef2f2' : '#eff6ff',
            border: `1px solid ${winner === 'rep' ? '#fecaca' : '#bfdbfe'}`,
            borderRadius: '4px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: winner === 'rep' ? '#991b1b' : '#1e40af',
              textAlign: 'center'
            }}
          >
            {winner === 'rep' ? 'Republican' : 'Democrat'} wins presidency
          </div>
        </div>
      )}
    </div>
  )
}
