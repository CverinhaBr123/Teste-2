"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Eye, Trash2, Check, X, FolderOpen, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StorageService, type FileMetadata } from "@/services/storage-service"
import ProtectedRoute from "@/components/protected-route"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { StorageStats } from "@/components/storage-stats"
import { ExportData } from "@/components/export-data"
import { StorageUsage } from "@/components/storage-usage"
import { useToast } from "@/components/ui/use-toast"

function FilesPage() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Função para carregar os arquivos
  const loadFiles = () => {
    const storedFiles = StorageService.getFiles()
    setFiles(storedFiles)
  }

  // Função para atualizar manualmente os arquivos
  const handleRefresh = () => {
    setIsRefreshing(true)
    loadFiles()

    toast({
      title: "Dados atualizados",
      description: "Os arquivos foram atualizados com sucesso.",
    })

    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  useEffect(() => {
    // Carregar arquivos ao montar o componente
    loadFiles()

    // Configurar listener para mudanças nos dados
    const removeListener = StorageService.setupChangeListener(() => {
      loadFiles()
    })

    return () => {
      // Remover listener ao desmontar o componente
      removeListener()
    }
  }, [])

  const filteredFiles = files
    .filter((file) => {
      if (activeTab === "todos") return true
      return file.status === activeTab
    })
    .filter((file) => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        file.name.toLowerCase().includes(searchLower) ||
        file.tecnico.toLowerCase().includes(searchLower) ||
        file.categoria.toLowerCase().includes(searchLower) ||
        file.descricao.toLowerCase().includes(searchLower)
      )
    })

  const handleMarkAsViewed = (id: string) => {
    StorageService.updateFile(id, { status: "visto" })
    loadFiles()

    toast({
      title: "Status atualizado",
      description: "O arquivo foi marcado como visto.",
    })
  }

  const handleMarkAsResolved = (id: string) => {
    StorageService.updateFile(id, { status: "resolvido" })
    loadFiles()

    toast({
      title: "Status atualizado",
      description: "O arquivo foi marcado como resolvido.",
    })
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      StorageService.deleteFile(id)
      loadFiles()

      toast({
        title: "Arquivo excluído",
        description: "O arquivo foi excluído com sucesso.",
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="inline-flex items-center text-white hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para a página principal
          </Link>

          <Link href="/admin">
            <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Área do Administrador
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle className="text-2xl">Arquivos Armazenados</CardTitle>
                  <CardDescription>Visualize e gerencie todos os arquivos enviados pelos técnicos</CardDescription>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  {files.filter((f) => f.status === "novo").length} Novos
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  {files.filter((f) => f.status === "visto").length} Vistos
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {files.filter((f) => f.status === "resolvido").length} Resolvidos
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Estatísticas de armazenamento */}
            <StorageStats />

            {/* Componente StorageUsage */}
            <div className="mb-6">
              <StorageUsage />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="novo">Novos</TabsTrigger>
                  <TabsTrigger value="visto">Vistos</TabsTrigger>
                  <TabsTrigger value="resolvido">Resolvidos</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="w-full md:w-64">
                  <Input
                    placeholder="Pesquisar arquivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <ExportData />
              </div>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchTerm ? (
                  <>
                    Nenhum arquivo encontrado para a pesquisa "<strong>{searchTerm}</strong>"
                  </>
                ) : (
                  <>Nenhum arquivo encontrado nesta categoria</>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <Card
                    key={file.id}
                    className={`overflow-hidden ${file.status === "novo" ? "ring-2 ring-red-400" : ""}`}
                  >
                    <div className="relative h-48 cursor-pointer" onClick={() => setSelectedFile(file)}>
                      <Image
                        src={file.url || "/placeholder.svg"}
                        alt={`Erro reportado por ${file.tecnico}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFile(file)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Visualizar
                        </Button>
                      </div>

                      {file.status === "novo" && <Badge className="absolute top-2 right-2 bg-red-500">Novo</Badge>}
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{file.tecnico}</h3>
                          <p className="text-sm text-gray-500">{file.data}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`
                            ${file.status === "novo" ? "bg-red-50 text-red-700 border-red-200" : ""}
                            ${file.status === "visto" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                            ${file.status === "resolvido" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          `}
                        >
                          {file.status === "novo" ? "Novo" : ""}
                          {file.status === "visto" ? "Visto" : ""}
                          {file.status === "resolvido" ? "Resolvido" : ""}
                        </Badge>
                      </div>

                      <div>
                        <Badge variant="outline" className="mb-2">
                          {file.categoria}
                        </Badge>
                        <p className="text-sm line-clamp-2">{file.descricao}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-1" /> Baixar
                      </Button>

                      {file.status === "novo" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleMarkAsViewed(file.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Marcar como visto
                        </Button>
                      )}

                      {file.status === "visto" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleMarkAsResolved(file.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Marcar como resolvido
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de visualização de arquivo */}
        {selectedFile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedFile(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    Enviado por {selectedFile.tecnico} em {selectedFile.data}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative h-[60vh]">
                <Image
                  src={selectedFile.url || "/placeholder.svg"}
                  alt="Visualização ampliada"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 border-t">
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Descrição do Problema</h4>
                  <p className="text-sm text-gray-700">{selectedFile.descricao}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="outline">{selectedFile.categoria}</Badge>
                    <Badge
                      variant="outline"
                      className={`
                        ${selectedFile.status === "novo" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        ${selectedFile.status === "visto" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                        ${selectedFile.status === "resolvido" ? "bg-green-50 text-green-700 border-green-200" : ""}
                      `}
                    >
                      {selectedFile.status === "novo" ? "Novo" : ""}
                      {selectedFile.status === "visto" ? "Visto" : ""}
                      {selectedFile.status === "resolvido" ? "Resolvido" : ""}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(selectedFile.url, "_blank")}>
                      <Download className="h-4 w-4 mr-1" /> Baixar
                    </Button>
                    <Button variant="default" onClick={() => setSelectedFile(null)}>
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProtectedFilesPage() {
  return (
    <ProtectedRoute>
      <FilesPage />
    </ProtectedRoute>
  )
}
