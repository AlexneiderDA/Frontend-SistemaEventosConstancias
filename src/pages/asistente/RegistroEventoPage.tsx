"use client"

import type React from "react"
import { useEffect } from "react"
import Layout from "../../components/asistente/layout/Layout"
import FormularioRegistro from "../../components/asistente/registro/FormularioRegistro"

interface RegistroEventoPageProps {
  id?: string
}

const RegistroEventoPage: React.FC<RegistroEventoPageProps> = ({ id }) => {
  // Si no se proporciona un ID, intentamos obtenerlo de la URL
  const eventoId = id || window.location.pathname.split("/").pop() || "1"

  // Scroll al inicio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Layout>
      <FormularioRegistro eventoId={eventoId} />
    </Layout>
  )
}

export default RegistroEventoPage
