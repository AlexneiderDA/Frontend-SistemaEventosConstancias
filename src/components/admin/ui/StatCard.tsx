import type React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StatCardProps } from "@/types/dashboard"

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
              {change}
            </Badge>
          </div>
          <div className="bg-gray-50 p-3 rounded-full">{icon}</div>
        </div>
      </div>
    </Card>
  )
}
