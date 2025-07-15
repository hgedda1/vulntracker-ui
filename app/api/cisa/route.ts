import fs from 'fs/promises'
import path from 'path'

const CACHE_FILE = path.join(process.cwd(), 'public/data/data.json')

export async function GET() {
  try {
    const cached = await fs.readFile(CACHE_FILE, 'utf-8')
    return new Response(cached, { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Cached data not found' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
