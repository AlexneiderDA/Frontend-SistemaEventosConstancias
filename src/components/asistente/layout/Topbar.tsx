// src/components/asistente/layout/Topbar.tsx
import type React from "react"
import { useState } from "react"
import { useAuth } from "../../../context/auth.context"
import { LogOut, User, ChevronDown } from "lucide-react"

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await logout();
    }
  };

  return (
    <header className="bg-[#1C8443] text-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/placeholder.svg?height=40&width=40" alt="Logo DACYTI" className="h-10" />
          <h1 className="text-xl font-bold">Sistema de Eventos y Constancias</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Logo Universidad */}
          <img src="/placeholder.svg?height=40&width=120" alt="Logo Universidad" className="h-10" />
          
          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="hidden md:block text-sm font-medium">{user.name}</span>
                <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Overlay para cerrar el menú */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <a
                      href="/user/perfil"
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User size={16} />
                      <span>Mi Perfil</span>
                    </a>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar