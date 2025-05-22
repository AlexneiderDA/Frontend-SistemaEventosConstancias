"use client"

import type React from "react"
import { useState } from "react"
import Topbar from "./Topbar"
import Sidebar from "./Sidebar"
import { Menu } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Botón para abrir/cerrar sidebar en móvil */}
      <button onClick={toggleSidebar} className="fixed top-4 left-4 z-50 lg:hidden text-white" aria-label="Toggle menu">
        <Menu size={24} />
      </button>

      <main className="pt-16 lg:pl-64 transition-all duration-300">
        <div className="container mx-auto p-4">{children}</div>
      </main>
    </div>
  )
}

export default Layout
