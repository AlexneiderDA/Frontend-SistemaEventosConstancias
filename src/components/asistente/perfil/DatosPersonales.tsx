"use client"

import type React from "react"
import { useState } from "react"
import { User, Save, Loader2 } from "lucide-react"

interface DatosPersonalesProps {
  datosIniciales: {
    nombre: string
    apellido: string
    telefono: string
    institucion: string
    ocupacion: string
    biografia: string
    fotoPerfil: string
  }
  onGuardar: (datos: any) => Promise<void>
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({ datosIniciales, onGuardar }) => {
  const [datos, setDatos] = useState(datosIniciales)
  const [guardando, setGuardando] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [exito, setExito] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!datos.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido"
    if (!datos.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido"
    if (!datos.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido"
    else if (!/^\d{10}$/.test(datos.telefono.replace(/\s/g, "")))
      nuevosErrores.telefono = "Por favor ingresa un número de teléfono válido (10 dígitos)"
    if (!datos.institucion.trim()) nuevosErrores.institucion = "La institución es requerida"

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
      await onGuardar(datos)
      setExito(true)
    } catch (error) {
      console.error("Error al guardar datos:", error)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex items-center">
        <User size={18} className="mr-2 text-[#41AD49]" />
        <h2 className="text-lg font-bold text-[#1C8443]">Datos Personales</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={datos.fotoPerfil || "/placeholder.svg?height=128&width=128&text=Foto"}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-800">
              {datos.nombre} {datos.apellido}
            </h3>
            <p className="text-gray-600 mt-1">{datos.ocupacion || "Estudiante"}</p>
            <button type="button" className="mt-3 text-[#38A2C1] hover:text-[#1C8443] text-sm font-medium">
              Cambiar foto de perfil
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errores.nombre ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
            />
            {errores.nombre && <p className="mt-1 text-sm text-red-500">{errores.nombre}</p>}
          </div>

          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={datos.apellido}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errores.apellido ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
            />
            {errores.apellido && <p className="mt-1 text-sm text-red-500">{errores.apellido}</p>}
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errores.telefono ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
            />
            {errores.telefono && <p className="mt-1 text-sm text-red-500">{errores.telefono}</p>}
          </div>

          <div>
            <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">
              Institución <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institucion"
              name="institucion"
              value={datos.institucion}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errores.institucion ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
            />
            {errores.institucion && <p className="mt-1 text-sm text-red-500">{errores.institucion}</p>}
          </div>

          <div>
            <label htmlFor="ocupacion" className="block text-sm font-medium text-gray-700 mb-1">
              Ocupación
            </label>
            <input
              type="text"
              id="ocupacion"
              name="ocupacion"
              value={datos.ocupacion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-1">
            Biografía
          </label>
          <textarea
            id="biografia"
            name="biografia"
            value={datos.biografia}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]"
            placeholder="Cuéntanos un poco sobre ti..."
          ></textarea>
        </div>

        {exito && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
            Datos guardados correctamente.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="bg-[#41AD49] hover:bg-[#1C8443] text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors disabled:bg-gray-400"
          >
            {guardando ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DatosPersonales
