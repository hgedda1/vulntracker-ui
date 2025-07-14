export async function GET() {
  const res = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")
  const data = await res.json()
  return Response.json(data)
}
