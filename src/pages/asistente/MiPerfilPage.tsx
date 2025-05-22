"use client"

import type React from "react"
import { useState } from "react"
import Layout from "../../components/asistente/layout/Layout"
import DatosPersonales from "../../components/asistente/perfil/DatosPersonales"
import CambioContrasena from "../../components/asistente/perfil/CambioContrasena"
import ActualizarCorreo from "../../components/asistente/perfil/ActualizarCorreo"
import PreferenciasNotificaciones from "../../components/asistente/perfil/PreferenciasNotificaciones"
import HistorialActividad from "../../components/asistente/perfil/HistorialActividad"

const MiPerfilPage: React.FC = () => {
  // Datos simulados del usuario
  const [datosUsuario] = useState({
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@ejemplo.com",
    telefono: "5512345678",
    institucion: "Universidad Nacional",
    ocupacion: "Estudiante",
    biografia:
      "Estudiante de Ingeniería en Sistemas Computacionales con interés en Inteligencia Artificial y Desarrollo Web.",
    fotoPerfil: "/placeholder.svg?height=128&width=128&text=JP",
  })

  // Preferencias de notificaciones simuladas
  const [preferenciasNotificaciones] = useState({
    correo: {
      nuevosEventos: true,
      recordatoriosEventos: true,
      constanciasDisponibles: true,
      boletinInformativo: false,
    },
    plataforma: {
      nuevosEventos: true,
      recordatoriosEventos: true,
      constanciasDisponibles: true,
      actualizacionesPlataforma: false,
    },
  })

  // Funciones simuladas para manejar las actualizaciones
  const handleGuardarDatosPersonales = async (datos: any) => {
    // Simular una llamada a la API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Datos personales guardados:", datos)
        resolve()
      }, 1500)
    })
  }

  const handleCambiarContrasena = async (datos: any) => {
    // Simular una llamada a la API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Contraseña cambiada:", datos)
        resolve()
      }, 1500)
    })
  }

  const handleActualizarCorreo = async (datos: any) => {
    // Simular una llamada a la API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Correo actualizado:", datos)
        resolve()
      }, 1500)
    })
  }

  const handleGuardarPreferencias = async (preferencias: any) => {
    // Simular una llamada a la API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Preferencias guardadas:", preferencias)
        resolve()
      }, 1500)
    })
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1C8443] mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Administra tu información personal y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Datos personales */}
            <DatosPersonales datosIniciales={datosUsuario} onGuardar={handleGuardarDatosPersonales} />

            {/* Preferencias de notificaciones */}
            <PreferenciasNotificaciones
              preferenciasIniciales={preferenciasNotificaciones}
              onGuardar={handleGuardarPreferencias}
            />

            {/* Historial de actividad */}
            <HistorialActividad />
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Actualizar correo */}
            <ActualizarCorreo correoActual={datosUsuario.correo} onActualizarCorreo={handleActualizarCorreo} />

            {/* Cambiar contraseña */}
            <CambioContrasena onCambiarContrasena={handleCambiarContrasena} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MiPerfilPage
