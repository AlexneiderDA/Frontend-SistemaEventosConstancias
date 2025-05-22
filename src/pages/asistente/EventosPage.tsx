import type React from "react"
import Layout from "../../components/asistente/layout/Layout"
import EventosGaleria from "../../components/asistente/eventos/EventosGaleria"

const EventosPage: React.FC = () => {
  return (
    <Layout>
      <EventosGaleria />
    </Layout>
  )
}

export default EventosPage
