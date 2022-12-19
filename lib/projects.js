// Projects metadata
// Add new projects here as they are built

const projectsData = [
  {
    id: 'personal-finance-tracker',
    title: 'Transaction Analytics Dashboard with Chart.js',
    date: '2022-03-15',
    description: 'Multi-chart dashboard for transaction analytics with category-based aggregation and monthly trend analysis',
    tech: ['TypeScript', 'React', 'Chart.js', 'Ant Design'],
    url: '/projects/personal-finance-tracker'
  },
  {
    id: 'stock-portfolio-analyzer',
    title: 'Stock Portfolio Analyzer with Recharts',
    date: '2022-06-20',
    description: 'Visualize stock performance, gains/losses, and portfolio diversity with interactive Recharts visualizations',
    tech: ['TypeScript', 'React', 'Recharts', 'Ant Design'],
    url: '/projects/stock-portfolio-analyzer'
  },
  {
    id: 'crypto-price-tracker',
    title: 'Crypto Price Tracker with D3.js',
    date: '2022-12-13',
    description: 'Real-time cryptocurrency price tracking with advanced D3.js visualizations and market analytics',
    tech: ['TypeScript', 'React', 'D3.js', 'Ant Design 5'],
    url: '/projects/crypto-price-tracker'
  },
  // Future projects will be added here:
  // - 2024 Election Results Dashboard (Nov 2024)
]

export function getSortedProjectsData() {
  // Sort projects by date (newest first)
  return projectsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getProjectData(id) {
  return projectsData.find(project => project.id === id)
}
