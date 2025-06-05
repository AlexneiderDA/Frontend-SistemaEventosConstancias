import type React from "react"
import { Progress } from "../../ui/progress"
import type { PerformanceIndicatorProps } from "../../../types/dashboard"

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({ label, value, color }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Progress
        value={value}
        className="h-2"
        style={
          {
            "--progress-background": color,
          } as React.CSSProperties
        }
      />
    </div>
  )
}
