// Projects metadata
// Add new projects here as they are built

const projectsData = [
  {
    id: 'personal-finance-tracker',
    title: 'Transaction Analytics Dashboard with Chart.js',
    date: '2022-03-15',
    description: 'Transaction analytics with multiple charts showing category breakdowns and monthly trends',
    tech: ['TypeScript', 'React', 'Chart.js', 'Ant Design'],
    url: '/projects/personal-finance-tracker'
  },
  {
    id: 'stock-portfolio-analyzer',
    title: 'Stock Portfolio Analyzer with Recharts',
    date: '2022-06-20',
    description: 'Stock performance with interactive charts for gains, losses, and portfolio breakdown',
    tech: ['TypeScript', 'React', 'Recharts', 'Ant Design'],
    url: '/projects/stock-portfolio-analyzer'
  },
  {
    id: 'crypto-price-tracker',
    title: 'Crypto Price Tracker with D3.js',
    date: '2022-12-13',
    description: 'Crypto price tracker with D3.js visualizations and market analytics',
    tech: ['TypeScript', 'React', 'D3.js', 'Ant Design 5'],
    url: '/projects/crypto-price-tracker'
  },
  {
    id: 'earthquake-globe',
    title: 'Real Time 3D Earthquake Visualization with Three.js',
    date: '2023-04-28',
    description: 'Real time 3D visualization of earthquakes worldwide using WebGL, Three.js, and USGS data',
    tech: ['TypeScript', 'React', 'Three.js', 'WebGL', 'USGS API'],
    url: '/projects/earthquake-globe'
  }
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
