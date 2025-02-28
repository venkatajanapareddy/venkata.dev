/**
 * Election data structure for each state/territory
 * Data aggregated from county-level results
 */
export interface ElectionData {
  code: string           // Two-letter state code (e.g., "CA", "TX")
  votes_dem: number      // Total Democratic votes
  votes_rep: number      // Total Republican votes
  votes_total: number    // Total votes cast
  pct_dem: number        // Democratic percentage (0-100)
  pct_rep: number        // Republican percentage (0-100)
  margin: number         // Democratic margin (positive = Dem win, negative = Rep win)
  winner: 'D' | 'R'      // Winning party
}
