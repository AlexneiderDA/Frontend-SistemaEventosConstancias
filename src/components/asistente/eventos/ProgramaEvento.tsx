import type React from "react"

interface ProgramaItem {
  hora: string
  actividad: string
  ponente?: string
}

interface ProgramaEventoProps {
  programa: ProgramaItem[]
}

const ProgramaEvento: React.FC<ProgramaEventoProps> = ({ programa }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-[#1C8443] mb-4">Programa</h2>
      <div className="space-y-4">
        {programa.map((item, index) => (
          <div key={index} className="relative pl-8 pb-4 border-l-2 border-[#67DCD7] last:border-0 last:pb-0">
            {/* Indicador de tiempo */}
            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-[#67DCD7]"></div>

            {/* Contenido */}
            <div className="mb-1">
              <span className="inline-block bg-[#67DCD7]/20 text-[#1C8443] text-sm font-medium px-2 py-1 rounded">
                {item.hora}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">{item.actividad}</h3>
            {item.ponente && <p className="text-sm text-gray-600 mt-1">{item.ponente}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramaEvento
