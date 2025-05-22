import type React from "react"
import Layout from "../../components/asistente/layout/Layout"
import Carrusel from "../../components/asistente/inicio/Carrusel"
import Buscador from "../../components/asistente/inicio/Buscador"
import Notificaciones from "../../components/asistente/inicio/Notificaciones"
import AccesosRapidos from "../../components/asistente/inicio/AccesosRapidos"

const InicioPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1C8443] mb-2">Bienvenido al Sistema de Eventos</h1>
          <p className="text-gray-600">Explora, regístrate y obtén constancias de los eventos de la comunidad DACYTI</p>
        </div>

        {/* Carrusel de eventos destacados */}
        <Carrusel />

        {/* Buscador de eventos */}
        <Buscador />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notificaciones */}
          <Notificaciones />

          {/* Accesos rápidos */}
          <AccesosRapidos />
        </div>
      </div>
    </Layout>
  )
}

export default InicioPage
