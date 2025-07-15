import fs from 'fs/promises'
import path from 'path'

// Constants
const RESULTS_PER_PAGE = 2000
const BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
const CACHE_FILE = path.join(process.cwd(), 'public/data/data.json')
const MAX_CACHE_AGE_SECONDS = 12 * 60 * 60 // 12 hours
const RATE_LIMIT_DELAY_MS = 6000

// Helper: Sleep function
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET() {
  try {
    // Check if cache is still valid
    const stat = await fs.stat(CACHE_FILE)
    const age = (Date.now() - new Date(stat.mtime).getTime()) / 1000

    if (age < MAX_CACHE_AGE_SECONDS) {
      const cached = await fs.readFile(CACHE_FILE, 'utf-8')
      return new Response(cached, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Start paginated fetch
    let allVulnerabilities: any[] = []
    let startIndex = 0
    let totalResults = Infinity

    while (startIndex < totalResults) {
      const url = `${BASE_URL}?resultsPerPage=${RESULTS_PER_PAGE}&startIndex=${startIndex}`
      const response = await fetch(url)

      if (!response.ok) throw new Error(`Failed to fetch NVD page ${startIndex}`)

      const data = await response.json()

      if (data?.vulnerabilities?.length) {
        allVulnerabilities.push(...data.vulnerabilities)
        totalResults = data.totalResults || data.vulnerabilities.length
        startIndex += RESULTS_PER_PAGE
        await sleep(RATE_LIMIT_DELAY_MS)
      } else {
        break
      }
    }

    const result = { fetchedAt: new Date().toISOString(), count: allVulnerabilities.length, vulnerabilities: allVulnerabilities }

    // Cache the result
    await fs.writeFile(CACHE_FILE, JSON.stringify(result, null, 2), 'utf-8')

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[NVD API ERROR]', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch NVD data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
