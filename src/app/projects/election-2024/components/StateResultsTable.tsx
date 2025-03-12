import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ElectionData } from '../types'

interface StateResultsTableProps {
  data: ElectionData[]
}

// State code to full name mapping
const STATE_NAMES: Record<string, string> = {
  'AK': 'Alaska', 'AL': 'Alabama', 'AR': 'Arkansas', 'AZ': 'Arizona',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DC': 'District of Columbia',
  'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii',
  'IA': 'Iowa', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'MA': 'Massachusetts',
  'MD': 'Maryland', 'ME': 'Maine', 'MI': 'Michigan', 'MN': 'Minnesota',
  'MO': 'Missouri', 'MS': 'Mississippi', 'MT': 'Montana', 'NC': 'North Carolina',
  'ND': 'North Dakota', 'NE': 'Nebraska', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NV': 'Nevada', 'NY': 'New York', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
  'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
  'UT': 'Utah', 'VA': 'Virginia', 'VT': 'Vermont', 'WA': 'Washington',
  'WI': 'Wisconsin', 'WV': 'West Virginia', 'WY': 'Wyoming'
}

interface TableDataType extends ElectionData {
  key: string
  state_name: string
}

/**
 * StateResultsTable Component
 *
 * Sortable table displaying all state-level election results
 */
export default function StateResultsTable({ data }: StateResultsTableProps) {
  // Transform data for table
  const tableData: TableDataType[] = data.map(state => ({
    ...state,
    key: state.code,
    state_name: STATE_NAMES[state.code] || state.code
  }))

  const columns: ColumnsType<TableDataType> = [
    {
      title: 'State',
      dataIndex: 'state_name',
      key: 'state_name',
      sorter: (a, b) => a.state_name.localeCompare(b.state_name),
      width: 180,
      fixed: 'left',
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: 'EV',
      dataIndex: 'electoral_votes',
      key: 'electoral_votes',
      sorter: (a, b) => a.electoral_votes - b.electoral_votes,
      width: 70,
      align: 'center',
      render: (value: number) => (
        <span style={{ fontWeight: 600 }}>{value}</span>
      )
    },
    {
      title: 'Winner',
      dataIndex: 'winner',
      key: 'winner',
      sorter: (a, b) => a.winner.localeCompare(b.winner),
      width: 100,
      align: 'center',
      render: (winner: string) => (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '12px',
            fontWeight: 600,
            background: winner === 'D' ? '#eff6ff' : '#fef2f2',
            color: winner === 'D' ? '#1e40af' : '#dc2626'
          }}
        >
          {winner === 'D' ? 'DEM' : 'REP'}
        </span>
      )
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      sorter: (a, b) => a.margin - b.margin,
      width: 100,
      align: 'right',
      render: (margin: number) => (
        <span
          style={{
            color: margin > 0 ? '#1e40af' : '#dc2626',
            fontWeight: 500
          }}
        >
          {margin > 0 ? '+' : ''}{margin.toFixed(1)}%
        </span>
      )
    },
    {
      title: 'Dem Votes',
      dataIndex: 'votes_dem',
      key: 'votes_dem',
      sorter: (a, b) => a.votes_dem - b.votes_dem,
      width: 130,
      align: 'right',
      render: (votes: number) => votes.toLocaleString()
    },
    {
      title: 'Dem %',
      dataIndex: 'pct_dem',
      key: 'pct_dem',
      sorter: (a, b) => a.pct_dem - b.pct_dem,
      width: 90,
      align: 'right',
      render: (pct: number) => (
        <span style={{ color: '#1e40af' }}>
          {pct.toFixed(1)}%
        </span>
      )
    },
    {
      title: 'Rep Votes',
      dataIndex: 'votes_rep',
      key: 'votes_rep',
      sorter: (a, b) => a.votes_rep - b.votes_rep,
      width: 130,
      align: 'right',
      render: (votes: number) => votes.toLocaleString()
    },
    {
      title: 'Rep %',
      dataIndex: 'pct_rep',
      key: 'pct_rep',
      sorter: (a, b) => a.pct_rep - b.pct_rep,
      width: 90,
      align: 'right',
      render: (pct: number) => (
        <span style={{ color: '#dc2626' }}>
          {pct.toFixed(1)}%
        </span>
      )
    },
    {
      title: 'Total Votes',
      dataIndex: 'votes_total',
      key: 'votes_total',
      sorter: (a, b) => a.votes_total - b.votes_total,
      width: 130,
      align: 'right',
      render: (votes: number) => votes.toLocaleString()
    }
  ]

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
      <h3
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1f2937',
          marginBottom: '16px',
          marginTop: 0
        }}
      >
        State-by-State Results
      </h3>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: 1000 }}
        size="small"
        bordered={false}
        style={{
          fontSize: '13px'
        }}
      />
    </div>
  )
}
