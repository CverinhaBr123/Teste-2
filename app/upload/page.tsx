"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft, ImageIcon, Check, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { StorageService } from "@/services/storage-service"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState(false)
  const [tecnico, setTecnico] = useState("")
  const [categoria, setCategoria] = useState("")
  const [descricao, setDescricao] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !tecnico || !categoria || !descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos e selecione um arquivo",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setUploadSuccess(false)
    setUploadError(false)

    try {
      // Fazer upload do arquivo e obter a URL
      const fileUrl = await StorageService.uploadFile(selectedFile)

      // Salvar os metadados do arquivo
      StorageService.saveFile({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: fileUrl,
        tecnico,
        categoria,
        descricao,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "novo",
      })

      setUploadSuccess(true)

      toast({
        title: "Upload realizado com sucesso!",
        description: "O administrador foi notificado e analisará sua foto em breve.",
        variant: "default",
      })

      // Redirecionar para a página de arquivos após 2 segundos
      setTimeout(() => {
        router.push("/files")
      }, 2000)
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      setUploadError(true)

      toast({
        title: "Erro ao fazer upload",
        description: "Ocorreu um erro ao enviar o arquivo. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setUploadSuccess(false)
    setUploadError(false)
    setTecnico("")
    setCategoria("")
    setDescricao("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
      }}
    >
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center text-white mb-4 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar para a página principal
        </Link>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Enviar Foto de Erro</CardTitle>
            <CardDescription>Envie uma foto do problema para que o administrador possa analisar</CardDescription>
          </CardHeader>

          <CardContent>
            {uploadSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Upload realizado com sucesso!</h3>
                <p className="text-gray-500 mb-4">O administrador foi notificado e analisará sua foto em breve.</p>
                <Button onClick={resetForm}>Enviar outra foto</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tecnico">Técnico</Label>
                    <Select value={tecnico} onValueChange={setTecnico} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o técnico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bruno">Bruno</SelectItem>
                        <SelectItem value="Jarbas">Jarbas</SelectItem>
                        <SelectItem value="Julio">Julio</SelectItem>
                        <SelectItem value="Luan">Luan</SelectItem>
                        <SelectItem value="Matheus">Matheus</SelectItem>
                        <SelectItem value="Ruan">Ruan</SelectItem>
                        <SelectItem value="Ryan">Ryan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria do Problema</Label>
                    <Select value={categoria} onValueChange={setCategoria} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipamento">Equipamento</SelectItem>
                        <SelectItem value="Instalação">Instalação</SelectItem>
                        <SelectItem value="Material">Material</SelectItem>
                        <SelectItem value="Ferramenta">Ferramenta</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição do Problema</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva o problema em detalhes..."
                      className="resize-none"
                      rows={3}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="foto">Foto do Problema</Label>
                    <div
                      className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center ${
                        preview ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        id="foto"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />

                      {preview ? (
                        <div className="relative">
                          <div className="relative h-48 w-full overflow-hidden rounded-md">
                            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                          </div>
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              resetForm()
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <p className="text-sm text-gray-500 mt-2">Clique para trocar a imagem</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="font-medium text-blue-600 hover:underline cursor-pointer"
                            >
                              Clique para selecionar
                            </label>
                            <p>ou arraste e solte</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>

          {!uploadSuccess && (
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!selectedFile || uploading} onClick={handleSubmit}>
                {uploading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Enviar Foto
                  </span>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
