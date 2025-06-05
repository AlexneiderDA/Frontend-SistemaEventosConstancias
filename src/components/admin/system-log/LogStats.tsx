import type React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import type { SystemLogStats } from "../../../types/system-log"


interface LogStatsProps {
  stats: SystemLogStats
}

export const LogStats: React.FC<LogStatsProps> = ({ stats }) => {
  const statusData = [
    { name: "Éxito", value: stats.successCount, color: "#41AD49" },
    { name: "Advertencia", value: stats.warningCount, color: "#F59E0B" },
    { name: "Error", value: stats.errorCount, color: "#EF4444" },
    { name: "Información", value: stats.infoCount, color: "#38A2C1" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Actividad</CardTitle>
        <CardDescription>Resumen de la actividad del sistema basado en los registros de la bitácora</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Distribución por Estado</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} registros`, "Cantidad"]}
                        labelFormatter={(name) => `Estado: ${name}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Acciones Principales</div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topActions.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="action" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8DC642" name="Cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalEntries}</div>
                  <p className="text-xs text-muted-foreground">Total de registros</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{stats.successCount}</div>
                  <p className="text-xs text-muted-foreground">Operaciones exitosas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
                  <p className="text-xs text-muted-foreground">Errores registrados</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.averageDuration.toFixed(2)}ms</div>
                  <p className="text-xs text-muted-foreground">Duración promedio</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topModules} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="module" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#67DCD7" name="Cantidad de registros" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topUsers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="userName" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#38A2C1" name="Cantidad de registros" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
