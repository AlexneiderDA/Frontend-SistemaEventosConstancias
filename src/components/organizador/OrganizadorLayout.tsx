"use client"

import type React from "react"
import { useState } from "react"
import {
  Home,
  FileUser,
  FileText,
  CalendarCog,
  CalendarPlus,
  RulerDimensionLine,
  UserRound,
  BookUser,
  Menu,
  
  Bell,
  Shield,
} from "lucide-react"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"


interface OranizadorLayoutProps {
  children: React.ReactNode
  title: string
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isActive?: boolean
  isCollapsed?: boolean
  href?: string
}

const sidebarRef = "/organizador"
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  href = "#",
}) => {
  return (
    <a
      href={href}
      className={`
        flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer
        ${isActive ? "bg-[#41AD49] text-white" : "text-white hover:bg-[#41AD49]/50"}
        ${isCollapsed ? "justify-center" : ""}
      `}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </a>
  )
}

export const OrganizadorLayout: React.FC<OranizadorLayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-[#1C8443] text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#41AD49]">
          <div className={`flex items-center ${!isSidebarOpen && "justify-center w-full"}`}>
            <Shield className="h-8 w-8 text-[#8DC642]" />
            {isSidebarOpen && <span className="ml-2 font-bold text-xl">Oranizador Panel</span>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`text-white hover:bg-[#41AD49] ${!isSidebarOpen && "hidden"}`}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            <SidebarItem
              icon={Home}
              label="Dashboard"
              isActive={title === "Dashboard"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/"}
            />
            <SidebarItem
              icon={CalendarPlus}
              label="Crear evento"
              isActive={title === "UCrear evento"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/crear-evento"}
            />
            <SidebarItem
              icon={CalendarCog}
              label="Gestion evento"
              isActive={title === "Gestion evento"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/gestion-eventos"}
            />
            <SidebarItem
              icon={UserRound}
              label="Gestion asistencias"
              isActive={title === "Gestion asistencias"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/gestion-asistentes"}
            />
            <SidebarItem
              icon={RulerDimensionLine}
              label="Metricas tiempo real"
              isActive={title === "Metricas tiempo real"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/metricas-tiempo-real"}
            />
            <SidebarItem
              icon={FileUser}
              label="Emision constancias"
              isActive={title === "Emision constancias"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/emisiones-constancias"}
            />
            <SidebarItem
              icon={BookUser}
              label="Gestion personal"
              isActive={title === "Gestion personal"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/gestion-personal"}
            />
            <SidebarItem
              icon={FileText}
              label="Reportes"
              isActive={title === "Reportes"}
              isCollapsed={!isSidebarOpen}
              href= {sidebarRef + "/reportes"}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-[#41AD49]">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
              <AvatarFallback className="bg-[#67DCD7]">AD</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-[#8DC642]">Administrador</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`mr-4 ${isSidebarOpen && "hidden"} md:hidden`}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                      <AvatarFallback className="bg-[#67DCD7]">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
