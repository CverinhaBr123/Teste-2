"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { StorageService } from "@/services/storage-service"
import { FileDown, Loader2 } from "lucide-react"

export function ExportData() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)

    try {
      const files = StorageService.getFiles()

      if (files.length === 0) {
        alert("Não há dados para exportar.")
        setIsExporting(false)
        return
      }

      // Criar cabeçalho do CSV
      const headers = ["ID", "Nome", "Técnico", "Categoria", "Descrição", "Data", "Status", "URL"]

      // Criar linhas de dados
      const rows = files.map((file) => [
        file.id,
        file.name,
        file.tecnico,
        file.categoria,
        `"${file.descricao.replace(/"/g, '""')}"`, // Escapar aspas duplas
        file.data,
        file.status,
        file.url,
      ])

      // Combinar cabeçalho e linhas
      const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      // Criar blob e link para download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.setAttribute("href", url)
      link.setAttribute("download", `arquivos_tecnicos_${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      alert("Ocorreu um erro ao exportar os dados.")
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = () => {
    setIsExporting(true)

    try {
      const files = StorageService.getFiles()

      if (files.length === 0) {
        alert("Não há dados para exportar.")
        setIsExporting(false)
        return
      }

      // Criar blob e link para download
      const jsonContent = JSON.stringify(files, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.setAttribute("href", url)
      link.setAttribute("download", `arquivos_tecnicos_${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      alert("Ocorreu um erro ao exportar os dados.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        disabled={isExporting}
        className="flex items-center gap-1"
      >
        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Exportar CSV
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportToJSON}
        disabled={isExporting}
        className="flex items-center gap-1"
      >
        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Exportar JSON
      </Button>
    </div>
  )
}
