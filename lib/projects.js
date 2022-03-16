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
  // Future projects will be added here:
  // - Stock Portfolio Analyzer (Jun 2022)
  // - Crypto Price Tracker (Sep 2022)
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
