"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StorageService } from "@/services/storage-service"
import { Database, FileImage, CheckCircle, Eye } from "lucide-react"

export function StorageStats() {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    newFiles: 0,
    viewedFiles: 0,
    resolvedFiles: 0,
    categories: {} as Record<string, number>,
  })

  useEffect(() => {
    const calculateStats = () => {
      const files = StorageService.getFiles()

      // Calcular estatísticas básicas
      const totalFiles = files.length
      const totalSize = files.reduce((acc, file) => acc + file.size, 0)
      const newFiles = files.filter((file) => file.status === "novo").length
      const viewedFiles = files.filter((file) => file.status === "visto").length
      const resolvedFiles = files.filter((file) => file.status === "resolvido").length

      // Calcular estatísticas por categoria
      const categories: Record<string, number> = {}
      files.forEach((file) => {
        if (categories[file.categoria]) {
          categories[file.categoria]++
        } else {
          categories[file.categoria] = 1
        }
      })

      setStats({
        totalFiles,
        totalSize,
        newFiles,
        viewedFiles,
        resolvedFiles,
        categories,
      })
    }

    calculateStats()

    // Configurar listener para mudanças nos dados
    const removeListener = StorageService.setupChangeListener(() => {
      calculateStats()
    })

    return () => {
      // Remover listener ao desmontar o componente
      removeListener()
    }
  }, [])

  // Função para formatar o tamanho em bytes para uma unidade legível
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total de Arquivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-2xl font-bold">{stats.totalFiles}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{formatSize(stats.totalSize)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Novos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileImage className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-2xl font-bold">{stats.newFiles}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalFiles > 0 ? Math.round((stats.newFiles / stats.totalFiles) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Vistos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-2xl font-bold">{stats.viewedFiles}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalFiles > 0 ? Math.round((stats.viewedFiles / stats.totalFiles) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Resolvidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-2xl font-bold">{stats.resolvedFiles}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalFiles > 0 ? Math.round((stats.resolvedFiles / stats.totalFiles) * 100) : 0}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
