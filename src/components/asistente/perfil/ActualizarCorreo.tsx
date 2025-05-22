"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Loader2 } from "lucide-react"

interface ActualizarCorreoProps {
  correoActual: string
  onActualizarCorreo: (datos: { nuevoCorreo: string; contrasena: string }) => Promise<void>
}

const ActualizarCorreo: React.FC<ActualizarCorreoProps> = ({ correoActual, onActualizarCorreo }) => {
  const [datos, setDatos] = useState({
    nuevoCorreo: "",
    contrasena: "",
  })
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

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
    if (!datos.nuevoCorreo) nuevosErrores.nuevoCorreo = "El nuevo correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(datos.nuevoCorreo))
      nuevosErrores.nuevoCorreo = "Por favor ingresa un correo electrónico válido"
    else if (datos.nuevoCorreo === correoActual)
      nuevosErrores.nuevoCorreo = "El nuevo correo debe ser diferente al actual"

    if (!datos.contrasena) nuevosErrores.contrasena = "La contraseña es requerida para confirmar el cambio"

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
      await onActualizarCorreo(datos)
      setExito(true)
      // Limpiar formulario después de éxito
      setDatos({
        nuevoCorreo: "",
        contrasena: "",
      })
      // Ocultar formulario después de éxito
      setMostrarFormulario(false)
    } catch (error) {
      console.error("Error al actualizar correo:", error)
      setErrores({
        general: "Ocurrió un error al actualizar el correo. Por favor, intenta nuevamente.",
      })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <Mail size={18} className="mr-2 text-[#41AD49]" />
        <h2 className="text-lg font-bold text-[#1C8443]">Correo Electrónico</h2>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Correo electrónico actual:</p>
            <p className="font-medium">{correoActual}</p>
          </div>
          {!mostrarFormulario && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mt-3 sm:mt-0 text-[#38A2C1] hover:text-[#1C8443] font-medium"
            >
              Cambiar correo
            </button>
          )}
        </div>

        {exito && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Se ha enviado un correo de verificación a la nueva dirección. Por favor, revisa tu bandeja de entrada y
            sigue las instrucciones para completar el cambio.
          </div>
        )}

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="nuevoCorreo" className="block text-sm font-medium text-gray-700 mb-1">
                  Nuevo Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="nuevoCorreo"
                  name="nuevoCorreo"
                  value={datos.nuevoCorreo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errores.nuevoCorreo ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                />
                {errores.nuevoCorreo && <p className="mt-1 text-sm text-red-500">{errores.nuevoCorreo}</p>}
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={datos.contrasena}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errores.contrasena ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                  placeholder="Ingresa tu contraseña para confirmar"
                />
                {errores.contrasena && <p className="mt-1 text-sm text-red-500">{errores.contrasena}</p>}
              </div>
            </div>

            {errores.general && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">{errores.general}</div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
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
                  "Actualizar Correo"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>
            Al cambiar tu correo electrónico, se enviará un enlace de verificación a la nueva dirección. El cambio no
            será efectivo hasta que confirmes haciendo clic en ese enlace.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ActualizarCorreo
