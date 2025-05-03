"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Eye, Trash2, Filter, Check, X, LogOut, FolderOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { StorageService, type FileMetadata } from "@/services/storage-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AdminDashboard() {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [activeTab, setActiveTab] = useState("todos")
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null)
  const { logout, user } = useAuth()
  const router = useRouter()

  // Adicionar estado para controlar o diálogo de confirmação
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  useEffect(() => {
    // Carregar arquivos ao montar o componente
    const loadFiles = () => {
      const storedFiles = StorageService.getFiles()
      setFiles(storedFiles)
    }

    loadFiles()

    // Adicionar um listener para atualizar a lista quando o localStorage mudar
    const handleStorageChange = () => {
      loadFiles()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const filteredFiles = activeTab === "todos" ? files : files.filter((file) => file.status === activeTab)

  const handleMarkAsViewed = (id: string) => {
    StorageService.updateFile(id, { status: "visto" })
    setFiles(StorageService.getFiles())
  }

  const handleMarkAsResolved = (id: string) => {
    StorageService.updateFile(id, { status: "resolvido" })
    setFiles(StorageService.getFiles())
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este arquivo?")) {
      StorageService.deleteFile(id)
      setFiles(StorageService.getFiles())
    }
  }

  // Adicionar função para limpar todos os arquivos
  const handleClearAllFiles = () => {
    StorageService.clearAllFiles()
    setFiles([])
    setIsConfirmDialogOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
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

          <div className="flex items-center gap-2">
            <Link href="/files">
              <Button variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <FolderOpen className="h-4 w-4 mr-1" /> Arquivos
              </Button>
            </Link>
            <span className="text-white">Olá, {user?.username}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl">Área do Administrador</CardTitle>
                <CardDescription>Gerencie as fotos de erros enviadas pelos técnicos</CardDescription>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2">
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
            <div className="flex items-center justify-between mb-4">
              <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="novo">Novos</TabsTrigger>
                  <TabsTrigger value="visto">Vistos</TabsTrigger>
                  <TabsTrigger value="resolvido">Resolvidos</TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>

                  <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1">
                        <Trash2 className="h-4 w-4" />
                        Limpar Todos
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso removerá permanentemente todos os arquivos armazenados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearAllFiles}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Tabs>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Nenhum registro encontrado nesta categoria</div>
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
            </TabsContent>
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

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
