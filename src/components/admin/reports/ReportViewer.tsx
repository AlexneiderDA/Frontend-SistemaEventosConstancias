"use client"

import type React from "react"
import { useState } from "react"
import { Download, Printer, Send, Calendar, RefreshCw } from "lucide-react"
import {
  Button,
} from "../../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Report, ReportData, ReportColumn } from "../../../types/report"
import { ExportReportDialog } from "./ExportReportDialog"
import { ScheduleReportDialog } from "./ScheduleReportDialog"


interface ReportViewerProps {
  report: Report
  data: ReportData
  parameters: Record<string, any>
  onRefresh: () => void
  isLoading?: boolean
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  data,
  parameters,
  onRefresh,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"table" | "chart">(report.type === "chart" ? "chart" : "table")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const formatValue = (value: any, column: ReportColumn) => {
    if (value === null || value === undefined) {
      return "-"
    }

    switch (column.type) {
      case "date":
        return format(new Date(value), column.format || "PPP", { locale: es })
      case "number":
        return typeof value === "number"
          ? new Intl.NumberFormat("es-MX", {
              style: column.format === "currency" ? "currency" : "decimal",
              currency: "MXN",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(value)
          : value
      case "boolean":
        return value ? "Sí" : "No"
      case "status":
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
              value,
            )}`}
          >
            {value}
          </span>
        )
      default:
        return value
    }
  }

  const getStatusClass = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("activ") || statusLower.includes("complet") || statusLower.includes("aprob")) {
      return "bg-green-100 text-green-800"
    } else if (statusLower.includes("pend") || statusLower.includes("proces")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (statusLower.includes("cancel") || statusLower.includes("rechaz") || statusLower.includes("error")) {
      return "bg-red-100 text-red-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  const renderChart = () => {
    if (!data.chartData) return null

    const colors = ["#1C8443", "#41AD49", "#8DC642", "#67DCD7", "#38A2C1"]

    switch (report.chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data.chartData[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={colors[index % colors.length]} name={key} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data.chartData[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} name={key} />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data.chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(data.chartData[0])
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    stroke={colors[index % colors.length]}
                    name={key}
                    fillOpacity={0.3}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  const renderDateRangeInfo = () => {
    // Buscar parámetro de tipo dateRange
    const dateRangeParam = report.parameters.find((p) => p.type === "dateRange")
    if (dateRangeParam && parameters[dateRangeParam.name]) {
      const { from, to } = parameters[dateRangeParam.name]
      if (from) {
        return (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {format(new Date(from), "PPP", { locale: es })}
            {to && ` - ${format(new Date(to), "PPP", { locale: es })}`}
          </div>
        )
      }
    }
    return null
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{report.name}</CardTitle>
            <CardDescription>{report.description}</CardDescription>
            {renderDateRangeInfo()}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-[#1C8443] hover:text-[#1C8443]/80 hover:bg-[#1C8443]/10"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-[#38A2C1] hover:text-[#38A2C1]/80 hover:bg-[#38A2C1]/10"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="text-[#41AD49] hover:text-[#41AD49]/80 hover:bg-[#41AD49]/10"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScheduleDialog(true)}
              className="text-[#8DC642] hover:text-[#8DC642]/80 hover:bg-[#8DC642]/10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto pb-0">
        {report.type === "mixed" && (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "table" | "chart")}>
            <TabsList className="mb-4">
              <TabsTrigger value="table">Tabla</TabsTrigger>
              <TabsTrigger value="chart">Gráfico</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="h-full">
              {renderTable()}
            </TabsContent>

            <TabsContent value="chart" className="h-full">
              {renderChart()}
            </TabsContent>
          </Tabs>
        )}

        {report.type === "table" && renderTable()}
        {report.type === "chart" && renderChart()}
      </CardContent>

      {data.summary && (
        <CardFooter className="border-t pt-4 mt-4">
          <div className="w-full grid grid-cols-3 gap-4">
            {Object.entries(data.summary).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-sm text-muted-foreground">{key}</div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
            ))}
          </div>
        </CardFooter>
      )}

      <ExportReportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        reportName={report.name}
        onExport={(options) => {
          console.log("Exportando con opciones:", options)
          // Aquí iría la lógica real de exportación
          setShowExportDialog(false)
        }}
      />

      <ScheduleReportDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        report={report}
        parameters={parameters}
        onSchedule={(schedule) => {
          console.log("Programando con opciones:", schedule)
          // Aquí iría la lógica real de programación
          setShowScheduleDialog(false)
        }}
      />
    </Card>
  )

  function renderTable() {
    return (
      <div className="rounded-md border overflow-auto max-h-[calc(100vh-350px)]">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((column) => (
                <TableHead key={column.id} className="whitespace-nowrap">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={data.columns.length} className="h-24 text-center">
                  No hay datos disponibles para los parámetros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {data.columns.map((column) => (
                    <TableCell key={column.id} className="whitespace-nowrap">
                      {formatValue(row[column.key], column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
}
