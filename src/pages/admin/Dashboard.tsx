import type React from "react"
import {
  Activity,
  BarChart3,
  Calendar,
  CreditCard,
  Database,
  Download,
  FileText,
  PieChart,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Separator } from "../../components/ui/separator"
import { AdminLayout } from "../../components/admin/layouts/AdminLayout"
import { StatCard } from "../../components/admin/ui/StatCard"
import { AlertItem } from "../../components/admin/ui/AlertItem"
import { PerformanceIndicator } from "../../components/admin/ui/PerformanceIndicator"
import { QuickAccessButton } from "../../components/admin/ui/QuickAccessButton"


// Resto del archivo permanece igual...
export const Dashboard: React.FC = () => {
  return (
    <AdminLayout title="Dashboard">
      {/* Resumen general del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Usuarios Activos"
          value="1,234"
          change="+12%"
          icon={<Users className="h-8 w-8 text-[#1C8443]" />}
        />
        <StatCard
          title="Eventos Registrados"
          value="56"
          change="+8%"
          icon={<Calendar className="h-8 w-8 text-[#41AD49]" />}
        />
        <StatCard
          title="Constancias Emitidas"
          value="789"
          change="+23%"
          icon={<FileText className="h-8 w-8 text-[#8DC642]" />}
        />
        <StatCard
          title="Uso del Sistema"
          value="85%"
          change="+5%"
          icon={<Activity className="h-8 w-8 text-[#38A2C1]" />}
        />
      </div>

      {/* Alertas críticas y notificaciones */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Alertas y Notificaciones</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Alertas del Sistema</h3>
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <AlertItem type="error" message="Error de conexión con la base de datos" time="Hace 5 minutos" />
              <AlertItem type="warning" message="Espacio de almacenamiento por debajo del 20%" time="Hace 30 minutos" />
              <AlertItem type="info" message="Actualización del sistema disponible" time="Hace 2 horas" />
              <AlertItem type="success" message="Respaldo automático completado con éxito" time="Hace 6 horas" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráficos de actividad reciente */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="usuarios" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Actividad Reciente</h2>
              <TabsList>
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                <TabsTrigger value="eventos">Eventos</TabsTrigger>
                <TabsTrigger value="constancias">Constancias</TabsTrigger>
              </TabsList>
            </div>

            <Card>
              <CardContent className="pt-6">
                <TabsContent value="usuarios" className="mt-0">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">Gráfico de actividad de usuarios</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="eventos" className="mt-0">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">Gráfico de eventos por categoría</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="constancias" className="mt-0">
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
                    <div className="text-center">
                      <Activity className="h-16 w-16 mx-auto text-gray-300" />
                      <p className="mt-2 text-sm text-gray-500">Gráfico de constancias emitidas</p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        {/* Accesos rápidos a funciones administrativas */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Accesos Rápidos</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <QuickAccessButton icon={<Users className="h-5 w-5" />} label="Gestionar Usuarios" color="#1C8443" />
                <QuickAccessButton icon={<Calendar className="h-5 w-5" />} label="Crear Evento" color="#41AD49" />
                <QuickAccessButton icon={<FileText className="h-5 w-5" />} label="Generar Constancia" color="#8DC642" />
                <QuickAccessButton icon={<Download className="h-5 w-5" />} label="Descargar Reportes" color="#38A2C1" />
                <QuickAccessButton icon={<Database className="h-5 w-5" />} label="Respaldo BD" color="#67DCD7" />
                <QuickAccessButton icon={<Settings className="h-5 w-5" />} label="Configuración" color="#1C8443" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Indicadores de rendimiento del sistema */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Rendimiento del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Uso de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PerformanceIndicator label="CPU" value={45} color="#1C8443" />
                <PerformanceIndicator label="Memoria" value={72} color="#41AD49" />
                <PerformanceIndicator label="Almacenamiento" value={83} color="#8DC642" />
                <PerformanceIndicator label="Ancho de banda" value={38} color="#38A2C1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tiempos de Respuesta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tiempo de carga promedio</p>
                    <p className="text-2xl font-bold text-[#1C8443]">1.2s</p>
                  </div>
                  <Activity className="h-10 w-10 text-[#1C8443] opacity-20" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Disponibilidad del sistema</p>
                    <p className="text-2xl font-bold text-[#41AD49]">99.8%</p>
                  </div>
                  <Shield className="h-10 w-10 text-[#41AD49] opacity-20" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Transacciones por minuto</p>
                    <p className="text-2xl font-bold text-[#8DC642]">245</p>
                  </div>
                  <CreditCard className="h-10 w-10 text-[#8DC642] opacity-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
