import fs from 'fs/promises'
import path from 'path'

const BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
const RESULTS_PER_PAGE = 2000
const CACHE_FILE = path.join(process.cwd(), 'public/data/data.json')
const DELAY = 6000

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchAllVulnerabilities() {
  let all: any[] = []
  let startIndex = 0
  let totalResults = Infinity

  while (startIndex < totalResults) {
    const url = `${BASE_URL}?resultsPerPage=${RESULTS_PER_PAGE}&startIndex=${startIndex}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed at index ${startIndex}`)
    const json = await res.json()

    all.push(...(json.vulnerabilities || []))
    totalResults = json.totalResults || all.length
    startIndex += RESULTS_PER_PAGE
    console.log(`Fetched ${all.length}/${totalResults}`)
    await sleep(DELAY)
  }

  const final = { fetchedAt: new Date().toISOString(), count: all.length, vulnerabilities: all }
  await fs.writeFile(CACHE_FILE, JSON.stringify(final, null, 2), 'utf8')
  console.log("Data cached to", CACHE_FILE)
}

fetchAllVulnerabilities().catch(console.error)
