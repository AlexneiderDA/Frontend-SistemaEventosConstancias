import type React from "react"
import { AlertTriangle, Bell } from "lucide-react"
import { Badge } from "../../ui/badge"
import type { AlertItemProps } from "../../../types/dashboard"

export const AlertItem: React.FC<AlertItemProps> = ({ type, message, time }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          badge: "bg-red-100 text-red-800",
        }
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          badge: "bg-yellow-100 text-yellow-800",
        }
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Bell className="h-5 w-5 text-blue-500" />,
          badge: "bg-blue-100 text-blue-800",
        }
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <Bell className="h-5 w-5 text-green-500" />,
          badge: "bg-green-100 text-green-800",
        }
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: <Bell className="h-5 w-5 text-gray-500" />,
          badge: "bg-gray-100 text-gray-800",
        }
    }
  }

  const styles = getAlertStyles()

  return (
    <div className={`flex items-center p-3 rounded-md border ${styles.bg} ${styles.border}`}>
      <div className="mr-3">{styles.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <Badge variant="secondary" className={styles.badge}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    </div>
  )
}
