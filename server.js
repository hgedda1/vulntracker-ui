// server.js
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
const PORT = 5001

app.use(cors())

app.get('/api/cisa', async (req, res) => {
  try {
    const response = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
    )
    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'CISA fetch failed', details: error.toString() })
  }
})

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`)
})
