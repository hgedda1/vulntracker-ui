"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Calendar, Zap, TrendingUp } from "lucide-react"
import type { Vulnerability } from "@/types/vulnerability"

interface StatsCardsProps {
  vulnerabilities: Vulnerability[]
}

export function StatsCards({ vulnerabilities }: StatsCardsProps) {
  const totalVulns = vulnerabilities.length

  const overdueCVEs = vulnerabilities.filter((vuln) => new Date(vuln.dueDate) < new Date()).length

  const ransomwareKnown = vulnerabilities.filter((vuln) => vuln.knownRansomwareCampaignUse === "Known").length

  const criticalVulns = vulnerabilities.filter((vuln) => {
    const description = vuln.shortDescription.toLowerCase()
    const name = vuln.vulnerabilityName.toLowerCase()
    return (
      description.includes("critical") || name.includes("critical") || description.includes("remote code execution")
    )
  }).length

  const dueSoon = vulnerabilities.filter((vuln) => {
    const dueDate = new Date(vuln.dueDate)
    const today = new Date()
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDue <= 7 && daysUntilDue >= 0
  }).length

  const recentlyAdded = vulnerabilities.filter((vuln) => {
    const addedDate = new Date(vuln.dateAdded)
    const today = new Date()
    const daysSinceAdded = Math.ceil((today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceAdded <= 7
  }).length

  const statsData = [
    {
      title: "Total CVEs",
      value: totalVulns,
      description: "Known exploited vulnerabilities",
      icon: Shield,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Critical",
      value: criticalVulns,
      description: "Critical severity vulnerabilities",
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Overdue",
      value: overdueCVEs,
      description: "Past due date",
      icon: Calendar,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Due Soon",
      value: dueSoon,
      description: "Due within 7 days",
      icon: Calendar,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Ransomware",
      value: ransomwareKnown,
      description: "Known ransomware campaigns",
      icon: Zap,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Recently Added",
      value: recentlyAdded,
      description: "Added in last 7 days",
      icon: TrendingUp,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
