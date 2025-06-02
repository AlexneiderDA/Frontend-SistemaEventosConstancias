"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReportCategory } from "@/types/report"
import type { LucideIcon } from "lucide-react"
import * as Icons from "lucide-react"

interface CategorySelectorProps {
  categories: ReportCategory[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string) => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Función para obtener el componente de icono dinámicamente
  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons as any)[iconName] || Icons.FileText
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon)

        return (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id ? "border-[#1C8443] bg-[#1C8443]/5" : "hover:border-[#1C8443]/50"
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <IconComponent className="mr-2 h-5 w-5 text-[#1C8443]" />
                {category.name}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.reports.length} reporte{category.reports.length !== 1 ? "s" : ""} disponible
                {category.reports.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
