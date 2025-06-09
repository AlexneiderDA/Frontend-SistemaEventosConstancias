import type React from "react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ReactNode | string
  trend?: {
    value: string | number
    isPositive: boolean
    text: string
  }
  color?: "green" | "blue" | "cyan" | "lime"
  loading?: boolean
}

const colorClasses = {
  green: "bg-gradient-to-r from-[#1C8443] to-[#41AD49]",
  blue: "bg-gradient-to-r from-[#38A2C1] to-[#67DCD7]",
  cyan: "bg-gradient-to-r from-[#67DCD7] to-[#38A2C1]",
  lime: "bg-gradient-to-r from-[#8DC642] to-[#41AD49]",
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = "green",
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}>
              <span className="mr-1">
                {trend.isPositive ? "↗" : "↘"}
              </span>
              <span>{trend.text}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]} flex-shrink-0`}>
          <div className="text-white text-xl">
            {typeof icon === 'string' ? icon : icon}
          </div>
        </div>
      </div>
    </div>
  )
}