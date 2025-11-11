# 🏋️‍♂️ FitMind AI - Seu Coach Inteligente de Fitness

![FitMind AI](https://img.shields.io/badge/PWA-Ready-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

**FitMind AI** é um aplicativo PWA (Progressive Web App) moderno e futurista para gerenciamento completo de dados físicos, medições corporais e treinos, com inteligência artificial integrada para recomendações personalizadas.

## ✨ Funcionalidades

### 📊 Gerenciamento Completo
- **Perfil de Usuário**: Cadastro com dados pessoais, objetivos e preferências
- **Medições Corporais**: Registro de peso, IMC, gordura corporal, massa magra e circunferências
- **Histórico de Evolução**: Gráficos interativos com Recharts mostrando progressão ao longo do tempo
- **Sistema de Treinos**: CRUD completo para exercícios, séries, repetições e cargas

### 🤖 Inteligência Artificial
- **IA Coach**: Análise automática de progresso usando GPT-4
- **Recomendações Personalizadas**: Sugestões baseadas em seus dados e objetivos
- **Chat Interativo**: Tire dúvidas sobre treino, nutrição e motivação
- **Insights Inteligentes**: Identifica pontos fortes e áreas de melhoria

### 📱 PWA Moderno
- **Instalável**: Funciona como app nativo em qualquer dispositivo
- **Offline First**: Armazenamento local com IndexedDB
- **Performance**: Otimizado com cache inteligente via Workbox
- **Responsivo**: Design adaptável para desktop, tablet e mobile

### 🎨 Design Futurista
- **Paleta Neon**: Azul elétrico (#0A84FF) e amarelo neon (#FFD60A)
- **Tipografia**: Fontes modernas (Orbitron, Rajdhani, Exo 2)
- **Animações**: Transições suaves com Framer Motion
- **Efeitos Glow**: Bordas e sombras luminosas

### 🔧 Configurações
- **Tema**: Modo escuro/claro
- **Unidades**: kg/lb, cm/in, km/mi
- **Backup/Exportação**: JSON e PDF
- **API Key**: Configure sua chave OpenAI

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- Conta OpenAI (para recursos de IA)

### Instalação

1. **Clone o repositório**
\`\`\`bash
git clone <seu-repositorio>
cd Gestao
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Execute em modo desenvolvimento**
\`\`\`bash
npm run dev
\`\`\`

4. **Acesse no navegador**
\`\`\`
http://localhost:5173
\`\`\`

### Build para Produção

\`\`\`bash
npm run build
\`\`\`

Os arquivos otimizados estarão na pasta \`dist/\`.

## 📦 Deploy no Netlify

### Método 1: Deploy Manual

1. Faça o build do projeto:
\`\`\`bash
npm run build
\`\`\`

2. Faça upload da pasta \`dist/\` no Netlify

### Método 2: Deploy Automático (Git)

1. Conecte seu repositório Git ao Netlify
2. Configure:
   - **Build command**: \`npm run build\`
   - **Publish directory**: \`dist\`
3. Deploy automático a cada push!

### Variáveis de Ambiente (Opcional)

Se quiser configurar a API Key via variável de ambiente:
\`\`\`
VITE_OPENAI_API_KEY=sua-chave-aqui
\`\`\`

## 🔑 Configuração da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma nova API Key
3. No aplicativo, vá em **Configurações**
4. Cole sua API Key no campo apropriado
5. Clique em **Salvar API Key**

⚠️ **Importante**: Sua chave é armazenada localmente no navegador e nunca é enviada para nossos servidores.

## 📱 Instalação como PWA

### Android
1. Abra o site no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"

### iOS
1. Abra o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"

### Desktop
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação

## 🛠️ Stack Tecnológico

### Core
- **React 18.2** - Biblioteca UI
- **Vite 5.0** - Build tool ultrarrápido
- **React Router 6** - Roteamento SPA

### UI/UX
- **TailwindCSS 3.4** - Estilização utility-first
- **Framer Motion 11** - Animações fluidas
- **Lucide React** - Ícones modernos

### Gráficos e Visualização
- **Recharts 2.12** - Gráficos interativos
- **date-fns** - Manipulação de datas

### Dados e IA
- **IndexedDB (idb)** - Banco de dados local
- **OpenAI API** - Integração GPT-4
- **jsPDF** - Geração de relatórios PDF

### PWA
- **Vite PWA Plugin** - Configuração PWA
- **Workbox** - Service Worker e cache

## 📁 Estrutura do Projeto

\`\`\`
Gestao/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Navbar.jsx
│   │   ├── Modal.jsx
│   │   ├── StatCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── contexts/        # Context API
│   │   ├── UserContext.jsx
│   │   └── SettingsContext.jsx
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Measurements.jsx
│   │   ├── Workouts.jsx
│   │   ├── AICoach.jsx
│   │   └── Settings.jsx
│   ├── services/        # Serviços externos
│   │   └── aiService.js
│   ├── utils/           # Utilitários
│   │   └── database.js
│   ├── App.jsx          # Componente raiz
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── index.html
├── vite.config.js       # Config Vite + PWA
├── tailwind.config.js   # Config Tailwind
├── netlify.toml         # Config Netlify
└── package.json
\`\`\`

## 🎯 Roadmap

- [ ] Integração com Firebase (sync multi-dispositivo)
- [ ] Notificações push para lembretes de treino
- [ ] Compartilhamento de progresso nas redes sociais
- [ ] Biblioteca de exercícios com vídeos
- [ ] Planos de treino pré-definidos
- [ ] Calculadora de macronutrientes
- [ ] Modo de competição com amigos

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (\`git checkout -b feature/MinhaFeature\`)
3. Commit suas mudanças (\`git commit -m 'Adiciona MinhaFeature'\`)
4. Push para a branch (\`git push origin feature/MinhaFeature\`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ e 💪 para ajudar você a alcançar seus objetivos fitness!

---

**FitMind AI** - Transforme seu corpo com inteligência artificial 🚀
