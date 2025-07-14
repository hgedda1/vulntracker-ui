"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Code } from "lucide-react"
import type { Vulnerability } from "@/types/vulnerability"

interface ExportButtonsProps {
  vulnerabilities: Vulnerability[]
}

export function ExportButtons({ vulnerabilities }: ExportButtonsProps) {
  const exportToCSV = () => {
    const headers = [
      "CVE ID",
      "Vendor Project",
      "Product",
      "Vulnerability Name",
      "Date Added",
      "Short Description",
      "Required Action",
      "Due Date",
      "Known Ransomware Campaign Use",
      "Notes",
    ]

    const csvContent = [
      headers.join(","),
      ...vulnerabilities.map((vuln) =>
        [
          vuln.cveID,
          `"${vuln.vendorProject}"`,
          `"${vuln.product}"`,
          `"${vuln.vulnerabilityName}"`,
          vuln.dateAdded,
          `"${vuln.shortDescription}"`,
          `"${vuln.requiredAction}"`,
          vuln.dueDate,
          vuln.knownRansomwareCampaignUse,
          `"${vuln.notes}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vulnerabilities-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const jsonContent = JSON.stringify({ vulnerabilities }, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vulnerabilities-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToMarkdown = () => {
    let markdown = "# Vulnerability Report\n\n"
    markdown += `Generated on: ${new Date().toLocaleDateString()}\n\n`
    markdown += `Total Vulnerabilities: ${vulnerabilities.length}\n\n`

    vulnerabilities.forEach((vuln) => {
      markdown += `## ${vuln.cveID}\n\n`
      markdown += `**Vendor/Product:** ${vuln.vendorProject} - ${vuln.product}\n\n`
      markdown += `**Vulnerability:** ${vuln.vulnerabilityName}\n\n`
      markdown += `**Description:** ${vuln.shortDescription}\n\n`
      markdown += `**Date Added:** ${vuln.dateAdded}\n\n`
      markdown += `**Due Date:** ${vuln.dueDate}\n\n`
      markdown += `**Required Action:** ${vuln.requiredAction}\n\n`
      markdown += `**Ransomware Campaign:** ${vuln.knownRansomwareCampaignUse}\n\n`
      if (vuln.notes) {
        markdown += `**Notes:** ${vuln.notes}\n\n`
      }
      markdown += "---\n\n"
    })

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vulnerabilities-${new Date().toISOString().split("T")[0]}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <Code className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
