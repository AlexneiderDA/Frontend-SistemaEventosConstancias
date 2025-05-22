"use client"

import type React from "react"
import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"

interface PreferenciasNotificacionesProps {
  preferenciasIniciales: {
    correo: {
      nuevosEventos: boolean
      recordatoriosEventos: boolean
      constanciasDisponibles: boolean
      boletinInformativo: boolean
    }
    plataforma: {
      nuevosEventos: boolean
      recordatoriosEventos: boolean
      constanciasDisponibles: boolean
      actualizacionesPlataforma: boolean
    }
  }
  onGuardar: (preferencias: any) => Promise<void>
}

const PreferenciasNotificaciones: React.FC<PreferenciasNotificacionesProps> = ({
  preferenciasIniciales,
  onGuardar,
}) => {
  const [preferencias, setPreferencias] = useState(preferenciasIniciales)
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleChangeCorreo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setPreferencias((prev) => ({
      ...prev,
      correo: {
        ...prev.correo,
        [name]: checked,
      },
    }))

    // Limpiar mensaje de éxito
    if (exito) setExito(false)
  }

  const handleChangePlataforma = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setPreferencias((prev) => ({
      ...prev,
      plataforma: {
        ...prev.plataforma,
        [name]: checked,
      },
    }))

    // Limpiar mensaje de éxito
    if (exito) setExito(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setGuardando(true)
    setExito(false)

    try {
      await onGuardar(preferencias)
      setExito(true)
    } catch (error) {
      console.error("Error al guardar preferencias:", error)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <Bell size={18} className="mr-2 text-[#41AD49]" />
        <h2 className="text-lg font-bold text-[#1C8443]">Preferencias de Notificaciones</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notificaciones por correo */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">Notificaciones por Correo</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="correo-nuevosEventos"
                  name="nuevosEventos"
                  checked={preferencias.correo.nuevosEventos}
                  onChange={handleChangeCorreo}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="correo-nuevosEventos" className="ml-3 text-sm text-gray-700">
                  Nuevos eventos disponibles
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="correo-recordatoriosEventos"
                  name="recordatoriosEventos"
                  checked={preferencias.correo.recordatoriosEventos}
                  onChange={handleChangeCorreo}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="correo-recordatoriosEventos" className="ml-3 text-sm text-gray-700">
                  Recordatorios de eventos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="correo-constanciasDisponibles"
                  name="constanciasDisponibles"
                  checked={preferencias.correo.constanciasDisponibles}
                  onChange={handleChangeCorreo}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="correo-constanciasDisponibles" className="ml-3 text-sm text-gray-700">
                  Constancias disponibles
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="correo-boletinInformativo"
                  name="boletinInformativo"
                  checked={preferencias.correo.boletinInformativo}
                  onChange={handleChangeCorreo}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="correo-boletinInformativo" className="ml-3 text-sm text-gray-700">
                  Boletín informativo
                </label>
              </div>
            </div>
          </div>

          {/* Notificaciones en plataforma */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">Notificaciones en Plataforma</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plataforma-nuevosEventos"
                  name="nuevosEventos"
                  checked={preferencias.plataforma.nuevosEventos}
                  onChange={handleChangePlataforma}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="plataforma-nuevosEventos" className="ml-3 text-sm text-gray-700">
                  Nuevos eventos disponibles
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plataforma-recordatoriosEventos"
                  name="recordatoriosEventos"
                  checked={preferencias.plataforma.recordatoriosEventos}
                  onChange={handleChangePlataforma}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="plataforma-recordatoriosEventos" className="ml-3 text-sm text-gray-700">
                  Recordatorios de eventos
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plataforma-constanciasDisponibles"
                  name="constanciasDisponibles"
                  checked={preferencias.plataforma.constanciasDisponibles}
                  onChange={handleChangePlataforma}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="plataforma-constanciasDisponibles" className="ml-3 text-sm text-gray-700">
                  Constancias disponibles
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="plataforma-actualizacionesPlataforma"
                  name="actualizacionesPlataforma"
                  checked={preferencias.plataforma.actualizacionesPlataforma}
                  onChange={handleChangePlataforma}
                  className="h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                />
                <label htmlFor="plataforma-actualizacionesPlataforma" className="ml-3 text-sm text-gray-700">
                  Actualizaciones de la plataforma
                </label>
              </div>
            </div>
          </div>
        </div>

        {exito && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Preferencias guardadas correctamente.
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="bg-[#38A2C1] hover:bg-[#1C8443] text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors disabled:bg-gray-400"
          >
            {guardando ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              "Guardar Preferencias"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PreferenciasNotificaciones
