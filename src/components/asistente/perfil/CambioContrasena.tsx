"use client"

import type React from "react"
import { useState } from "react"
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react"

interface CambioContrasenaProps {
  onCambiarContrasena: (datos: {
    contrasenaActual: string
    nuevaContrasena: string
    confirmarContrasena: string
  }) => Promise<void>
}

const CambioContrasena: React.FC<CambioContrasenaProps> = ({ onCambiarContrasena }) => {
  const [datos, setDatos] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  })
  const [mostrarActual, setMostrarActual] = useState(false)
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errores[name]) {
      setErrores((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Limpiar mensaje de éxito
    if (exito) setExito(false)
  }

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    // Validar campos requeridos
    if (!datos.contrasenaActual) nuevosErrores.contrasenaActual = "La contraseña actual es requerida"
    if (!datos.nuevaContrasena) nuevosErrores.nuevaContrasena = "La nueva contraseña es requerida"
    else if (datos.nuevaContrasena.length < 8)
      nuevosErrores.nuevaContrasena = "La contraseña debe tener al menos 8 caracteres"
    if (!datos.confirmarContrasena) nuevosErrores.confirmarContrasena = "Debes confirmar la nueva contraseña"
    else if (datos.nuevaContrasena !== datos.confirmarContrasena)
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden"

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setGuardando(true)
    setExito(false)

    try {
      await onCambiarContrasena(datos)
      setExito(true)
      // Limpiar formulario después de éxito
      setDatos({
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: "",
      })
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      setErrores({
        general: "Ocurrió un error al cambiar la contraseña. Por favor, intenta nuevamente.",
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <Lock size={18} className="mr-2 text-[#41AD49]" />
        <h2 className="text-lg font-bold text-[#1C8443]">Cambiar Contraseña</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="contrasenaActual" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña Actual <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={mostrarActual ? "text" : "password"}
                id="contrasenaActual"
                name="contrasenaActual"
                value={datos.contrasenaActual}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errores.contrasenaActual ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7] pr-10`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarActual(!mostrarActual)}
              >
                {mostrarActual ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errores.contrasenaActual && <p className="mt-1 text-sm text-red-500">{errores.contrasenaActual}</p>}
          </div>

          <div>
            <label htmlFor="nuevaContrasena" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={mostrarNueva ? "text" : "password"}
                id="nuevaContrasena"
                name="nuevaContrasena"
                value={datos.nuevaContrasena}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errores.nuevaContrasena ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7] pr-10`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarNueva(!mostrarNueva)}
              >
                {mostrarNueva ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errores.nuevaContrasena && <p className="mt-1 text-sm text-red-500">{errores.nuevaContrasena}</p>}
            <p className="mt-1 text-xs text-gray-500">La contraseña debe tener al menos 8 caracteres.</p>
          </div>

          <div>
            <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Nueva Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmar ? "text" : "password"}
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={datos.confirmarContrasena}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errores.confirmarContrasena ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7] pr-10`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              >
                {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errores.confirmarContrasena && <p className="mt-1 text-sm text-red-500">{errores.confirmarContrasena}</p>}
          </div>
        </div>

        {errores.general && (
          <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">{errores.general}</div>
        )}

        {exito && (
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Contraseña actualizada correctamente.
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
                <Loader2 size={18} className="mr-2 animate-spin" /> Actualizando...
              </>
            ) : (
              "Cambiar Contraseña"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CambioContrasena
