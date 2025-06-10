"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Download, QrCode, User } from "lucide-react"
import QRCodeSVG from "react-qr-code"

interface CodigoQRProps {
  userId: string
  userName: string
}

const CodigoQR: React.FC<CodigoQRProps> = ({ userId, userName }) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  // Datos que se incluirán en el QR
  const qrData = JSON.stringify({
    userId,
    userName,
    timestamp: new Date().toISOString(),
    type: "user_profile",
    platform: "sistema_eventos"
  })

  // Función para descargar el QR como imagen
  const handleDownloadQR = async () => {
    if (!qrRef.current) return

    setIsDownloading(true)
    try {
      // Obtener el SVG del QR
      const svgElement = qrRef.current.querySelector('svg')
      if (!svgElement) return

      // Crear un canvas para convertir SVG a imagen
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Configurar el tamaño del canvas
      const size = 256
      canvas.width = size
      canvas.height = size

      // Crear una imagen del SVG
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        // Fondo blanco
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, size, size)
        
        // Dibujar el QR
        ctx.drawImage(img, 0, 0, size, size)
        
        // Crear enlace de descarga
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `qr-perfil-${userId}.png`
            link.href = url
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }
          setIsDownloading(false)
        }, 'image/png')
        
        URL.revokeObjectURL(svgUrl)
      }
      
      img.onerror = () => {
        console.error('Error cargando SVG')
        setIsDownloading(false)
        URL.revokeObjectURL(svgUrl)
      }
      
      img.src = svgUrl
    } catch (error) {
      console.error('Error descargando QR:', error)
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="h-5 w-5 text-[#1C8443]" />
        <h3 className="text-lg font-semibold text-gray-900">Código QR</h3>
      </div>

      <div className="text-center space-y-4">
        {/* Información del usuario */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
          <User className="h-4 w-4" />
          <span>{userName}</span>
        </div>

        {/* ID del usuario */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">ID de Usuario</p>
          <p className="text-sm font-mono text-gray-900">{userId}</p>
        </div>

        {/* Canvas oculto para generar QR */}
        <div
          ref={qrRef}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
            <QRCodeSVG
              value={qrData}
              size={192}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        {/* Botón de descarga */}
        <button
          onClick={handleDownloadQR}
          disabled={isDownloading}
          className="w-full bg-[#1C8443] text-white py-2 px-4 rounded-lg hover:bg-[#155a35] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Descargando..." : "Descargar QR"}
        </button>

        {/* Información adicional */}
        <p className="text-xs text-gray-500 mt-3">
          Este código QR contiene tu información de perfil y puede ser usado para identificarte en eventos.
        </p>
      </div>
    </div>
  )
}

export default CodigoQR