// Configurações globais do site
window.SITE_CONFIG = {
  // URL base do seu site (com barra no final)
  // Para GitHub Pages com repositório personalizado
  baseUrl: "baseUrl", // Caminho base para o repositório "Teste-2"

  // Caminhos das páginas do sistema (sem barra no início)
  paths: {
    home: "home", // Página inicial
    upload: "upload", // Página de upload
    login: "login", // Página de login
    admin: "admin", // Área do administrador
    files: "files", // Página de arquivos
  },

  // Configurações de armazenamento
  storage: {
    // Prefixo para as chaves de armazenamento local
    prefix: "rlc_almox_",
  },

  // Configurações específicas para GitHub Pages
  githubPages: {
    enabled: true,
    repository: "Teste-2",
    username: "CverinhaBr123",
  },
}
