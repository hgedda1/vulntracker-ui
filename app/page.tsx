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

        try {
          const apiResponse = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json")
          if (apiResponse.ok) {
            const apiData = await apiResponse.json()
            if (apiData.vulnerabilities?.length > 0) {
              data = apiData.vulnerabilities
              setSource("api")
            }
          }
        } catch (apiError) {
          console.warn("API fetch failed, trying local fallback...")
        }

        if (data.length === 0) {
          const localResponse = await fetch("/data/data.json")
          if (localResponse.ok) {
            const localData = await localResponse.json()
            data = localData.vulnerabilities || localData || []
            setSource("local")
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
