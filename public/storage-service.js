// Serviço de armazenamento para o GitHub Pages
;(() => {
  // Obter o prefixo de armazenamento da configuração global
  const getStoragePrefix = () => {
    if (window.SITE_CONFIG && window.SITE_CONFIG.storage && window.SITE_CONFIG.storage.prefix) {
      return window.SITE_CONFIG.storage.prefix
    }
    return "rlc_almox_" // Prefixo padrão
  }

  // Chave para o armazenamento compartilhado
  const SHARED_STORAGE_KEY = getStoragePrefix() + "shared_files"

  // Classe para gerenciar o armazenamento de arquivos
  window.StorageService = {
    // Obter todos os arquivos armazenados
    getFiles: () => {
      const filesJson = localStorage.getItem(SHARED_STORAGE_KEY)
      if (!filesJson) return []

      try {
        return JSON.parse(filesJson)
      } catch (error) {
        console.error("Erro ao carregar arquivos compartilhados:", error)
        return []
      }
    },

    // Salvar um novo arquivo
    saveFile: function (file) {
      const files = this.getFiles()
      files.push(file)
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(files))

      // Disparar um evento personalizado para notificar outras abas/janelas
      this.notifyDataChange()
    },

    // Atualizar um arquivo existente
    updateFile: function (id, updates) {
      const files = this.getFiles()
      const index = files.findIndex((f) => f.id === id)

      if (index !== -1) {
        files[index] = { ...files[index], ...updates }
        localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(files))

        // Disparar um evento personalizado para notificar outras abas/janelas
        this.notifyDataChange()
      }
    },

    // Excluir um arquivo
    deleteFile: function (id) {
      const files = this.getFiles()
      const filteredFiles = files.filter((f) => f.id !== id)
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(filteredFiles))

      // Disparar um evento personalizado para notificar outras abas/janelas
      this.notifyDataChange()
    },

    // Simular o upload de um arquivo e retornar uma URL
    uploadFile: async (file) =>
      new Promise((resolve) => {
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
      }),

    // Adicionar método para limpar todos os arquivos
    clearAllFiles: function () {
      localStorage.removeItem(SHARED_STORAGE_KEY)

      // Disparar um evento personalizado para notificar outras abas/janelas
      this.notifyDataChange()
    },

    // Método para notificar outras abas/janelas sobre mudanças nos dados
    notifyDataChange: () => {
      // Disparar um evento personalizado que pode ser capturado por outras abas/janelas
      const event = new CustomEvent("shared-storage-change", {
        detail: { key: SHARED_STORAGE_KEY },
      })
      window.dispatchEvent(event)

      // Também disparar o evento storage para compatibilidade
      window.dispatchEvent(new Event("storage"))
    },

    // Método para configurar um listener para mudanças nos dados
    setupChangeListener: (callback) => {
      const handleChange = (event) => {
        callback()
      }

      window.addEventListener("shared-storage-change", handleChange)
      window.addEventListener("storage", handleChange)

      // Retornar uma função para remover os listeners
      return () => {
        window.removeEventListener("shared-storage-change", handleChange)
        window.removeEventListener("storage", handleChange)
      }
    },
  }
})()
