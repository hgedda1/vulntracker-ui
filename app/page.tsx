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

        // 1. Vercel API route
        try {
          const res = await fetch("/api/cisa")
          if (res.ok) {
            const json = await res.json()
            if (json?.vulnerabilities?.length > 0) {
              data = json.vulnerabilities
              setSource("vercel-api")
            }
          }
        } catch (err) {
          console.warn("Vercel API route failed:", err)
        }

        // 2. Localhost proxy (for development)
        if (data.length === 0 && isLocalhost) {
          try {
            const res = await fetch("http://localhost:5001/api/cisa")
            if (res.ok) {
              const json = await res.json()
              if (json?.vulnerabilities?.length > 0) {
                data = json.vulnerabilities
                setSource("proxy")
              }
            }
          } catch (err) {
            console.warn("Local proxy fetch failed:", err)
          }
        }

        // 3. Fallback to static local JSON
        if (data.length === 0) {
          const isVercel = hostname.endsWith("vercel.app")
          const path = isGitHubPages
            ? "/vulntracker-ui/data/data.json"
            : isVercel
              ? "/data/data.json"
              : "/data/data.json"

          try {
            const res = await fetch(path)
            if (res.ok) {
              const json = await res.json()
              data = json.vulnerabilities || json || []
              setSource("local")
            } else {
              throw new Error("data.json not found")
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

  return (
    <VulnerabilityDashboard
      vulnerabilities={vulnerabilities}
      source={source}
    />
  )
}
