"use client"

import { useState, useEffect } from "react"
import { VulnerabilityDashboard } from "@/components/vulnerability-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Vulnerability } from "@/types/vulnerability"

export default function Home() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"api" | "local" | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let data: Vulnerability[] = []

        const isLocalhost = window.location.hostname === "localhost"
        const isGitHubPages = window.location.hostname.includes("github.io")

        // 1. Try API fetch via proxy if running locally
        if (isLocalhost) {
          try {
            const proxyResponse = await fetch("http://localhost:5001/api/cisa")
            if (proxyResponse.ok) {
              const apiData = await proxyResponse.json()
              if (apiData.vulnerabilities?.length > 0) {
                data = apiData.vulnerabilities
                setSource("api")
              }
            }
          } catch (err) {
            console.warn("Local proxy fetch failed:", err)
          }
        }

        // 2. If still no data, fallback to local JSON
        if (data.length === 0) {
          const jsonPath = isGitHubPages
            ? "/vulntracker-ui/data/data.json"
            : "/data/data.json"

          try {
            const localResponse = await fetch(jsonPath)
            if (localResponse.ok) {
              const localData = await localResponse.json()
              data = localData.vulnerabilities || localData || []
              setSource("local")
            } else {
              throw new Error("data.json not found")
            }
          } catch (err) {
            throw new Error("Failed to fetch local JSON")
          }
        }

        setVulnerabilities(data)
      } catch (err) {
        setError("Failed to load vulnerability data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return <VulnerabilityDashboard vulnerabilities={vulnerabilities} source={source} />
}
