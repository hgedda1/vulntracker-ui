"use client"

import { useState, useEffect } from "react"
import { VulnerabilityDashboard } from "@/components/vulnerability-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Vulnerability } from "@/types/vulnerability"

export default function Home() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<"vercel-api" | "proxy" | "local" | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let data: Vulnerability[] = []

        const hostname = window.location.hostname
        const isLocalhost = hostname === "localhost"
        const isGitHubPages = hostname.includes("github.io")

        // 1. Vercel API route (works in Vercel deployment)
        try {
          const vercelApi = await fetch("/api/cisa")
          if (vercelApi.ok) {
            const res = await vercelApi.json()
            if (res?.vulnerabilities?.length > 0) {
              data = res.vulnerabilities
              setSource("vercel-api")
            }
          }
        } catch (err) {
          console.warn("Vercel API route failed:", err)
        }

        // 2. Localhost proxy server (for local dev)
        if (data.length === 0 && isLocalhost) {
          try {
            const localProxy = await fetch("http://localhost:5001/api/cisa")
            if (localProxy.ok) {
              const res = await localProxy.json()
              if (res?.vulnerabilities?.length > 0) {
                data = res.vulnerabilities
                setSource("proxy")
              }
            }
          } catch (err) {
            console.warn("Local proxy fetch failed:", err)
          }
        }

        // 3. Fallback to local static JSON
        if (data.length === 0) {
          const fallbackJsonPath = isGitHubPages
            ? "/vulntracker-ui/data/data.json"
            : "/data/data.json"

          try {
            const localResponse = await fetch(fallbackJsonPath)
            if (localResponse.ok) {
              const localData = await localResponse.json()
              data = localData.vulnerabilities || localData || []
              setSource("local")
            } else {
              throw new Error("Local data.json not found")
            }
          } catch (err) {
            throw new Error("Failed to fetch local fallback JSON")
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
