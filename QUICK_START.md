# 🚀 Guia Rápido - FitMind AI

## 📋 Passo a Passo para Começar

### 1. Instalar Dependências
Abra o terminal PowerShell nesta pasta e execute:

\`\`\`powershell
npm install
\`\`\`

Este comando instalará todas as dependências necessárias (React, TailwindCSS, Recharts, etc.)

### 2. Iniciar o Servidor de Desenvolvimento

\`\`\`powershell
npm run dev
\`\`\`

O aplicativo será aberto em: **http://localhost:5173**

### 3. Primeiro Acesso

1. **Complete seu perfil**: Clique em "Começar Agora" e preencha seus dados
2. **Configure a API Key da OpenAI** (opcional, mas recomendado para IA):
   - Vá em **Configurações** (ícone de engrenagem)
   - Obtenha sua chave em: https://platform.openai.com/api-keys
   - Cole a chave e clique em "Salvar"

### 4. Explorar Funcionalidades

- **Dashboard**: Visualize gráficos de evolução
- **Medições**: Registre peso, IMC, circunferências e bioimpedância
- **Treinos**: Crie e gerencie seus treinos completos
- **IA Coach**: Obtenha análises e recomendações personalizadas
- **Configurações**: Personalize tema, unidades e faça backup

## 🏗️ Build para Produção

Para criar a versão otimizada para deploy:

\`\`\`powershell
npm run build
\`\`\`

Os arquivos prontos para deploy estarão na pasta \`dist/\`

## 🌐 Deploy no Netlify

### Opção 1: Arrastar e Soltar (Mais Fácil)

1. Execute \`npm run build\`
2. Acesse https://app.netlify.com/drop
3. Arraste a pasta \`dist\` para o site
4. Pronto! Seu app está online

### Opção 2: Git (Recomendado)

1. Faça push do código para GitHub/GitLab
2. Conecte o repositório no Netlify
3. Configure:
   - **Build command**: \`npm run build\`
   - **Publish directory**: \`dist\`
4. Deploy automático a cada commit!

## 📱 Instalar como App

Após abrir o site:

- **Desktop**: Clique no ícone de instalação na barra de endereço
- **Mobile**: Menu → "Adicionar à tela inicial"

## 🔧 Comandos Úteis

\`\`\`powershell
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build localmente

# Linting
npm run lint         # Verifica código
\`\`\`

## 🆘 Problemas Comuns

### Erro ao instalar dependências
\`\`\`powershell
# Limpe o cache e reinstale
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
\`\`\`

### Porta 5173 em uso
O Vite escolherá automaticamente outra porta (5174, 5175, etc.)

### IA não funciona
- Verifique se configurou a API Key da OpenAI
- Certifique-se de ter créditos na sua conta OpenAI
- Verifique a conexão com internet

## 📚 Recursos

- **Documentação React**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Vite**: https://vitejs.dev

## 💡 Dicas

1. **Backup Regular**: Use a função de exportação em Configurações
2. **API Key**: Mantenha sua chave segura, não compartilhe
3. **Dados Locais**: Tudo é armazenado no seu navegador (IndexedDB)
4. **Offline**: O app funciona sem internet (exceto IA)

---

**Está pronto para começar sua transformação! 💪🚀**

Em caso de dúvidas, consulte o README.md completo.
