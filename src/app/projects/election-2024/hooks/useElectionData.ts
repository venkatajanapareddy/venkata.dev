import { useEffect, useState } from 'react'
import { ElectionData } from '../types'

/**
 * Return type for useElectionData hook
 */
interface UseElectionDataReturn {
  data: ElectionData[]      // Election results by state
  topology: any             // US map topology for Highcharts
  loading: boolean          // Loading state
  error: Error | null       // Error state if fetches fail
}

/**
 * Custom hook to fetch election data and map topology
 *
 * Fetches two resources in parallel:
 * 1. Election results data (from local JSON file)
 * 2. US map topology (from Highcharts CDN)
 *
 * @returns Election data, map topology, loading state, and error state
 */
export function useElectionData(): UseElectionDataReturn {
  const [data, setData] = useState<ElectionData[]>([])
  const [topology, setTopology] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Fetch both resources in parallel using Promise.all for better performance
    Promise.all([
      fetch('/data/election-2024-states.json').then(res => res.json()),
      fetch('https://code.highcharts.com/mapdata/countries/us/us-all.topo.json').then(res => res.json())
    ])
      .then(([electionData, mapTopology]) => {
        setData(electionData)
        setTopology(mapTopology)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { data, topology, loading, error }
}
