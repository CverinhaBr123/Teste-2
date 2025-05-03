"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { StorageService } from "@/services/storage-service"

export function StorageUsage() {
  const [usedSpace, setUsedSpace] = useState(0)
  const [totalSpace, setTotalSpace] = useState(5 * 1024 * 1024) // 5MB como exemplo
  const [percentUsed, setPercentUsed] = useState(0)

  useEffect(() => {
    const calculateUsage = () => {
      const files = StorageService.getFiles()
      const used = files.reduce((acc, file) => acc + file.size, 0)

      setUsedSpace(used)
      setPercentUsed(Math.min(Math.round((used / totalSpace) * 100), 100))
    }

    calculateUsage()

    // Configurar listener para mudanças nos dados
    const removeListener = StorageService.setupChangeListener(() => {
      calculateUsage()
    })

    return () => {
      // Remover listener ao desmontar o componente
      removeListener()
    }
  }, [totalSpace])

  // Função para formatar o tamanho em bytes para uma unidade legível
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Espaço utilizado</span>
        <span className="font-medium">
          {formatSize(usedSpace)} / {formatSize(totalSpace)}
        </span>
      </div>
      <Progress value={percentUsed} className="h-2" />
      <p className="text-xs text-gray-500">{percentUsed}% do espaço de armazenamento utilizado</p>
    </div>
  )
}
