"use client"

import type React from "react"
import { useEffect } from "react"
import Layout from "../../components/asistente/layout/Layout"
import DetalleEvento from "../../components/asistente/eventos/DetalleEvento"

interface DetalleEventoPageProps {
  id?: string
}

const DetalleEventoPage: React.FC<DetalleEventoPageProps> = ({ id }) => {
  // Si no se proporciona un ID, intentamos obtenerlo de la URL
  const eventoId = id || window.location.pathname.split("/").pop() || "1"

  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <DetalleEvento id={eventoId} />
    </Layout>
  )
}

export default DetalleEventoPage
