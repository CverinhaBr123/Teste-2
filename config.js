// Configurações globais do site
window.SITE_CONFIG = {
  // URL base do seu site (com barra no final)
  // Para GitHub Pages com repositório personalizado
  baseUrl: "/Teste-2/", // Caminho base para o repositório "Teste-2"

  // Caminhos das páginas do sistema (sem barra no início)
  paths: {
    home: "app.html", // Página inicial
    upload: "upload.html", // Página de upload
    login: "login.html", // Página de login
    admin: "admin.html", // Área do administrador
    files: "files.html", // Página de arquivos
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
