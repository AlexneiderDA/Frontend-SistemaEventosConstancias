"use client"

import type React from "react"
import { Calendar, Users, Award, Settings, Home, BookOpen, User } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { title: "Inicio", icon: <Home size={20} />, path: "/" },
    { title: "Eventos", icon: <Calendar size={20} />, path: "/eventos" },
    { title: "Mis Eventos", icon: <BookOpen size={20} />, path: "/mis-eventos" },
    { title: "Constancias", icon: <Award size={20} />, path: "/constancias" },
    { title: "Participantes", icon: <Users size={20} />, path: "/participantes" },
    { title: "Mi Perfil", icon: <User size={20} />, path: "/perfil" },
    { title: "Configuración", icon: <Settings size={20} />, path: "/configuracion" },
  ]

  // Obtener la ruta actual
  const currentPath = window.location.pathname

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 z-30
                   ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                   lg:translate-x-0 w-64`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              // Verificar si el elemento está activo
              const isActive = currentPath === item.path

              return (
                <li key={index}>
                  <a
                    href={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive ? "bg-[#67DCD7] text-[#1C8443] font-medium" : "hover:bg-[#67DCD7] hover:text-[#1C8443]"
                    }`}
                  >
                    <span className={isActive ? "text-[#1C8443]" : "text-[#41AD49]"}>{item.icon}</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
