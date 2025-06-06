import type React from "react"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  color?: "green" | "blue" | "cyan" | "lime"
}

const colorClasses = {
  green: "bg-gradient-to-r from-[#1C8443] to-[#41AD49]",
  blue: "bg-gradient-to-r from-[#38A2C1] to-[#67DCD7]",
  cyan: "bg-gradient-to-r from-[#67DCD7] to-[#38A2C1]",
  lime: "bg-gradient-to-r from-[#8DC642] to-[#41AD49]",
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, trend, color = "green" }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span className="ml-1">{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <div className="text-white text-xl">{icon}</div>
        </div>
      </div>
    </div>
  )
}
