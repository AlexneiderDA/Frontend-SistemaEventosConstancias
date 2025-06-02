"use client"

import type React from "react"
import { ChevronRight, BarChart, LineChart, PieChart, Table, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Report } from "@/types/report"

interface ReportSelectorProps {
  reports: Report[]
  selectedReport: string | null
  onSelectReport: (reportId: string) => void
}

export const ReportSelector: React.FC<ReportSelectorProps> = ({ reports, selectedReport, onSelectReport }) => {
  const getReportIcon = (report: Report) => {
    if (report.type === "table") {
      return <Table className="h-4 w-4" />
    }

    if (report.type === "mixed") {
      return <FileText className="h-4 w-4" />
    }

    switch (report.chartType) {
      case "bar":
        return <BarChart className="h-4 w-4" />
      case "line":
        return <LineChart className="h-4 w-4" />
      case "pie":
        return <PieChart className="h-4 w-4" />
      default:
        return <BarChart className="h-4 w-4" />
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)] pr-4">
      <div className="space-y-2">
        {reports.map((report) => (
          <Button
            key={report.id}
            variant="ghost"
            className={`w-full justify-start text-left ${
              selectedReport === report.id ? "bg-[#1C8443]/10 text-[#1C8443] hover:bg-[#1C8443]/20" : ""
            }`}
            onClick={() => onSelectReport(report.id)}
          >
            <div className="flex items-center w-full">
              <span className="mr-2">{getReportIcon(report)}</span>
              <div className="flex-1">
                <div className="font-medium">{report.name}</div>
                <div className="text-xs text-muted-foreground truncate">{report.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
