"use client"

import type React from "react"
import { useState, useEffect } from "react"
import ResumenEvento from "./ResumenEvento"
import SeleccionSesiones from "./SeleccionSesiones"
import ConfirmacionRegistro from "./ConfirmacionRegistro"
import { ArrowLeft, Loader2 } from "lucide-react"

interface FormularioRegistroProps {
  eventoId: string | number
}

interface Evento {
  id: number
  titulo: string
  imagen: string
  fecha: string
  horario: string
  lugar: string
  categoria: string
  cuposDisponibles: number
  cuposTotal: number
  tieneSesiones: boolean
  terminosEspecificos: string
}

interface Sesion {
  id: number
  titulo: string
  descripcion: string
  horario: string
  ponente: string
  cuposDisponibles: number
  requiereRegistro: boolean
}

interface Usuario {
  nombre: string
  apellido: string
  correo: string
  telefono: string
  institucion: string
}

const FormularioRegistro: React.FC<FormularioRegistroProps> = ({ eventoId }) => {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [sesiones, setSesiones] = useState<Sesion[]>([])
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [registroExitoso, setRegistroExitoso] = useState(false)
  const [sesionesSeleccionadas, setSesionesSeleccionadas] = useState<number[]>([])
  const [errores, setErrores] = useState<Record<string, string>>({})

  // Datos del usuario (simulados como si estuvieran precargados)
  const [datosUsuario, setDatosUsuario] = useState<Usuario>({
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@ejemplo.com",
    telefono: "5512345678",
    institucion: "Universidad Nacional",
  })

  // Términos y condiciones
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaTerminosEspecificos, setAceptaTerminosEspecificos] = useState(false)

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí harías una llamada a tu API con el ID
    setTimeout(() => {
      const eventoData: Evento = {
        id: Number(eventoId),
        titulo: "Conferencia de Inteligencia Artificial",
        imagen: "/placeholder.svg?height=300&width=600",
        fecha: "15 de Mayo, 2025",
        horario: "10:00 - 13:00",
        lugar: "Auditorio Principal, Edificio A",
        categoria: "Conferencia",
        cuposDisponibles: 42,
        cuposTotal: 150,
        tieneSesiones: true,
        terminosEspecificos:
          "Al registrarte en este evento, aceptas que se utilice tu imagen en fotografías y videos para fines promocionales. También te comprometes a seguir el código de conducta del evento.",
      }

      const sesionesData: Sesion[] = [
        {
          id: 1,
          titulo: "Taller práctico: Introducción a TensorFlow",
          descripcion: "Taller introductorio a TensorFlow con ejercicios prácticos.",
          horario: "14:00 - 16:00",
          ponente: "Ing. Carlos Gómez",
          cuposDisponibles: 15,
          requiereRegistro: true,
        },
        {
          id: 2,
          titulo: "Mesa redonda: Ética en la IA",
          descripcion: "Discusión sobre los aspectos éticos en el desarrollo de IA.",
          horario: "16:30 - 18:00",
          ponente: "Dra. Ana López y Dr. Roberto Sánchez",
          cuposDisponibles: 30,
          requiereRegistro: true,
        },
        {
          id: 3,
          titulo: "Networking y cierre",
          descripcion: "Sesión de networking entre participantes y ponentes.",
          horario: "18:00 - 19:00",
          ponente: "Equipo DACYTI",
          cuposDisponibles: 0,
          requiereRegistro: false,
        },
      ]

      setEvento(eventoData)
      setSesiones(sesionesData)
      setCargando(false)
    }, 1000) // Simular tiempo de carga
  }, [eventoId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDatosUsuario((prev) => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario comienza a escribir
    if (errores[name]) {
      setErrores((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {}

    // Validar campos requeridos
    if (!datosUsuario.nombre.trim()) nuevosErrores.nombre = "El nombre es requerido"
    if (!datosUsuario.apellido.trim()) nuevosErrores.apellido = "El apellido es requerido"
    if (!datosUsuario.correo.trim()) nuevosErrores.correo = "El correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(datosUsuario.correo))
      nuevosErrores.correo = "Por favor ingresa un correo electrónico válido"
    if (!datosUsuario.telefono.trim()) nuevosErrores.telefono = "El teléfono es requerido"
    else if (!/^\d{10}$/.test(datosUsuario.telefono.replace(/\s/g, "")))
      nuevosErrores.telefono = "Por favor ingresa un número de teléfono válido (10 dígitos)"
    if (!datosUsuario.institucion.trim()) nuevosErrores.institucion = "La institución es requerida"

    // Validar términos
    if (!aceptaTerminos) nuevosErrores.terminos = "Debes aceptar los términos y condiciones generales"
    if (!aceptaTerminosEspecificos)
      nuevosErrores.terminosEspecificos = "Debes aceptar los términos específicos del evento"

    // Validar selección de sesiones si es requerido
    if (evento?.tieneSesiones && sesiones.some((s) => s.requiereRegistro) && sesionesSeleccionadas.length === 0) {
      nuevosErrores.sesiones = "Debes seleccionar al menos una sesión"
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      // Scroll al primer error
      const primerError = document.querySelector(".error-message")
      if (primerError) {
        primerError.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setEnviando(true)

    // Simular envío de datos
    setTimeout(() => {
      setEnviando(false)
      setRegistroExitoso(true)
    }, 1500)
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1C8443]"></div>
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Evento no encontrado</h2>
        <p className="mt-2 text-gray-500">El evento que buscas no existe o ha sido eliminado.</p>
        <a
          href="/eventos"
          className="mt-4 inline-block bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Ver todos los eventos
        </a>
      </div>
    )
  }

  if (registroExitoso) {
    return <ConfirmacionRegistro evento={evento} correo={datosUsuario.correo} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <a
          href={`/eventos/${evento.id}`}
          className="inline-flex items-center text-[#38A2C1] hover:text-[#1C8443] transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Volver al detalle del evento
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Resumen del evento */}
        <div className="md:col-span-1">
          <ResumenEvento evento={evento} />
        </div>

        {/* Columna derecha - Formulario */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1C8443] mb-6">Registro al Evento</h2>

            <form onSubmit={handleSubmit}>
              {/* Datos personales */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700">Datos Personales</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={datosUsuario.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errores.nombre ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                    />
                    {errores.nombre && <p className="mt-1 text-sm text-red-500 error-message">{errores.nombre}</p>}
                  </div>

                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={datosUsuario.apellido}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        errores.apellido ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                    />
                    {errores.apellido && <p className="mt-1 text-sm text-red-500 error-message">{errores.apellido}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={datosUsuario.correo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errores.correo ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                  />
                  {errores.correo && <p className="mt-1 text-sm text-red-500 error-message">{errores.correo}</p>}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={datosUsuario.telefono}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errores.telefono ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                  />
                  {errores.telefono && <p className="mt-1 text-sm text-red-500 error-message">{errores.telefono}</p>}
                </div>

                <div>
                  <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">
                    Institución <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="institucion"
                    name="institucion"
                    value={datosUsuario.institucion}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errores.institucion ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#67DCD7]`}
                  />
                  {errores.institucion && (
                    <p className="mt-1 text-sm text-red-500 error-message">{errores.institucion}</p>
                  )}
                </div>
              </div>

              {/* Selección de sesiones (si aplica) */}
              {evento.tieneSesiones && (
                <div className="mb-6">
                  <SeleccionSesiones sesiones={sesiones} onSeleccionCambiada={setSesionesSeleccionadas} />
                  {errores.sesiones && <p className="mt-1 text-sm text-red-500 error-message">{errores.sesiones}</p>}
                </div>
              )}

              {/* Términos y condiciones */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start mb-4">
                    <input
                      type="checkbox"
                      id="terminos-generales"
                      checked={aceptaTerminos}
                      onChange={() => setAceptaTerminos(!aceptaTerminos)}
                      className="mt-1 h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                    />
                    <label htmlFor="terminos-generales" className="ml-3 text-sm text-gray-700">
                      Acepto los{" "}
                      <a href="/terminos" className="text-[#38A2C1] hover:underline">
                        términos y condiciones generales
                      </a>{" "}
                      de la plataforma.
                    </label>
                  </div>
                  {errores.terminos && <p className="text-sm text-red-500 error-message">{errores.terminos}</p>}

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terminos-especificos"
                      checked={aceptaTerminosEspecificos}
                      onChange={() => setAceptaTerminosEspecificos(!aceptaTerminosEspecificos)}
                      className="mt-1 h-4 w-4 text-[#41AD49] focus:ring-[#8DC642] rounded"
                    />
                    <label htmlFor="terminos-especificos" className="ml-3 text-sm text-gray-700">
                      {evento.terminosEspecificos}
                    </label>
                  </div>
                  {errores.terminosEspecificos && (
                    <p className="mt-1 text-sm text-red-500 error-message">{errores.terminosEspecificos}</p>
                  )}
                </div>
              </div>

              {/* Botón de confirmación */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-[#41AD49] hover:bg-[#1C8443] text-white font-medium py-2 px-6 rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-400"
                >
                  {enviando ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" /> Procesando...
                    </>
                  ) : (
                    "Confirmar Registro"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioRegistro
