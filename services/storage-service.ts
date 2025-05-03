// Tipo para os metadados do arquivo
export type FileMetadata = {
  id: string
  name: string
  size: number
  type: string
  url: string
  tecnico: string
  categoria: string
  descricao: string
  data: string
  status: "novo" | "visto" | "resolvido"
}

// Chave para o armazenamento compartilhado
const SHARED_STORAGE_KEY = "shared_tecnico_files"

// Classe para gerenciar o armazenamento de arquivos
export class StorageService {
  private static readonly STORAGE_KEY = "tecnico_files"

  // Simular um servidor compartilhado usando localStorage com um prefixo diferente
  private static getSharedStorage(): FileMetadata[] {
    if (typeof window === "undefined") return []

    const filesJson = localStorage.getItem(SHARED_STORAGE_KEY)
    if (!filesJson) return []

    try {
      return JSON.parse(filesJson)
    } catch (error) {
      console.error("Erro ao carregar arquivos compartilhados:", error)
      return []
    }
  }

  private static setSharedStorage(files: FileMetadata[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(files))
  }

  // Obter todos os arquivos armazenados (agora do armazenamento compartilhado)
  static getFiles(): FileMetadata[] {
    return this.getSharedStorage()
  }

  // Salvar um novo arquivo
  static saveFile(file: FileMetadata): void {
    if (typeof window === "undefined") return

    const files = this.getSharedStorage()
    files.push(file)
    this.setSharedStorage(files)

    // Disparar um evento personalizado para notificar outras abas/janelas
    this.notifyDataChange()
  }

  // Atualizar um arquivo existente
  static updateFile(id: string, updates: Partial<FileMetadata>): void {
    if (typeof window === "undefined") return

    const files = this.getSharedStorage()
    const index = files.findIndex((f) => f.id === id)

    if (index !== -1) {
      files[index] = { ...files[index], ...updates }
      this.setSharedStorage(files)

      // Disparar um evento personalizado para notificar outras abas/janelas
      this.notifyDataChange()
    }
  }

  // Excluir um arquivo
  static deleteFile(id: string): void {
    if (typeof window === "undefined") return

    const files = this.getSharedStorage()
    const filteredFiles = files.filter((f) => f.id !== id)
    this.setSharedStorage(filteredFiles)

    // Disparar um evento personalizado para notificar outras abas/janelas
    this.notifyDataChange()
  }

  // Simular o upload de um arquivo e retornar uma URL
  static async uploadFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      // Simular um atraso de rede
      setTimeout(() => {
        // Em um ambiente real, aqui faríamos o upload para um serviço de armazenamento
        // e retornaríamos a URL real do arquivo

        // Para demonstração, vamos criar uma URL de objeto para o arquivo
        const objectUrl = URL.createObjectURL(file)

        // Em um ambiente real, você armazenaria o arquivo em um servidor
        // e retornaria a URL do servidor
        resolve(objectUrl)
      }, 1000)
    })
  }

  // Adicionar método para limpar todos os arquivos
  static clearAllFiles(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(SHARED_STORAGE_KEY)

    // Disparar um evento personalizado para notificar outras abas/janelas
    this.notifyDataChange()
  }

  // Método para notificar outras abas/janelas sobre mudanças nos dados
  private static notifyDataChange(): void {
    if (typeof window === "undefined") return

    // Disparar um evento personalizado que pode ser capturado por outras abas/janelas
    const event = new CustomEvent("shared-storage-change", {
      detail: { key: SHARED_STORAGE_KEY },
    })
    window.dispatchEvent(event)

    // Também disparar o evento storage para compatibilidade
    window.dispatchEvent(new Event("storage"))
  }

  // Método para configurar um listener para mudanças nos dados
  static setupChangeListener(callback: () => void): () => void {
    if (typeof window === "undefined") return () => {}

    const handleChange = (event: Event) => {
      callback()
    }

    window.addEventListener("shared-storage-change", handleChange)
    window.addEventListener("storage", handleChange)

    // Retornar uma função para remover os listeners
    return () => {
      window.removeEventListener("shared-storage-change", handleChange)
      window.removeEventListener("storage", handleChange)
    }
  }
}
