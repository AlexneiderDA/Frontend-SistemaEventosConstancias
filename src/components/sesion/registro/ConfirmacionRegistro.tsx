import type React from "react"
import { CheckCircle, Calendar, ArrowRight } from "lucide-react"

interface ConfirmacionRegistroProps {
  evento: {
    id: number
    titulo: string
    fecha: string
    horario: string
  }
  correo: string
}

const ConfirmacionRegistro: React.FC<ConfirmacionRegistroProps> = ({ evento, correo }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-6">
        <CheckCircle size={64} className="mx-auto text-[#41AD49]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1C8443] mb-4">¡Registro Exitoso!</h2>
      <p className="text-gray-600 mb-6">
        Te has registrado correctamente al evento <strong>{evento.titulo}</strong>.
      </p>

      <div className="bg-[#67DCD7]/10 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 mb-2">
          Hemos enviado un correo de confirmación a <strong>{correo}</strong> con todos los detalles.
        </p>
        <div className="flex items-center justify-center text-sm text-gray-700 mt-3">
          <Calendar size={16} className="mr-2 text-[#41AD49]" />
          <span>
            {evento.fecha} • {evento.horario}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={`/eventos/${evento.id}`}
          className="block w-full bg-[#8DC642] hover:bg-[#41AD49] text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Ver detalles del evento
        </a>
        <a
          href="/mis-eventos"
          className="block w-full bg-white border border-[#38A2C1] text-[#38A2C1] hover:bg-[#38A2C1] hover:text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
        >
          Ir a mis eventos <ArrowRight size={16} className="ml-2" />
        </a>
      </div>
    </div>
  )
}

export default ConfirmacionRegistro
