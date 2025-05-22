import type React from "react"

const Topbar: React.FC = () => {
  return (
    <header className="bg-[#1C8443] text-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/placeholder.svg?height=40&width=40" alt="Logo DACYTI" className="h-10" />
          <h1 className="text-xl font-bold">Sistema de Eventos y Constancias</h1>
        </div>
        <div className="flex items-center space-x-4">
          <img src="/placeholder.svg?height=40&width=120" alt="Logo Universidad" className="h-10" />
        </div>
      </div>
    </header>
  )
}

export default Topbar
