# 🔧 Troubleshooting - FitMind AI

Soluções para problemas comuns

## 🚨 Instalação e Setup

### Erro: "npm not found"

**Causa**: Node.js não instalado ou não no PATH

**Solução**:
1. Instale Node.js 18+ de https://nodejs.org
2. Reinicie o terminal
3. Verifique: \`node --version\`

### Erro ao executar \`npm install\`

**Causa**: Cache corrompido ou conflitos de versão

**Solução**:
\`\`\`powershell
# Limpe o cache
npm cache clean --force

# Remova node_modules e package-lock
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstale
npm install
\`\`\`

### Erro: "Cannot find module"

**Causa**: Dependência não instalada

**Solução**:
\`\`\`powershell
npm install
\`\`\`

## 🌐 Desenvolvimento

### Página em branco após \`npm run dev\`

**Causa**: Erro de JavaScript no console

**Solução**:
1. Abra DevTools (F12)
2. Verifique Console tab
3. Procure mensagens de erro
4. Verifique se todas as importações estão corretas

### Estilos não aplicados

**Causa**: TailwindCSS não configurado corretamente

**Solução**:
1. Verifique \`tailwind.config.js\`
2. Confirme que \`index.css\` tem directives do Tailwind
3. Limpe cache: \`npm run dev\` (Ctrl+C e reinicie)

### Hot Reload não funciona

**Causa**: Vite não detectando mudanças

**Solução**:
1. Salve o arquivo corretamente
2. Verifique se o arquivo está no diretório \`src/\`
3. Reinicie o servidor de desenvolvimento

### Erro: "Port 5173 already in use"

**Causa**: Servidor já rodando em outra janela

**Solução**:
\`\`\`powershell
# Encontre e mate o processo
Get-Process node | Stop-Process -Force

# Ou use outra porta
npm run dev -- --port 5174
\`\`\`

## 🗄️ Banco de Dados (IndexedDB)

### Dados não salvando

**Causa**: IndexedDB bloqueado ou erro de permissão

**Solução**:
1. Verifique Console para erros
2. Limpe dados do site: DevTools → Application → Clear Storage
3. Teste em modo anônimo
4. Verifique configurações de privacidade do navegador

### Erro: "Failed to execute 'transaction'"

**Causa**: Tentativa de acesso a store inexistente

**Solução**:
1. Limpe IndexedDB: DevTools → Application → IndexedDB → Delete
2. Recarregue a página (recriará estrutura)
3. Verifique versão do DB em \`database.js\`

### Dados sumiram após atualização

**Causa**: Estrutura do DB mudou sem migração

**Solução**:
1. Restaure backup (se tiver)
2. Para prevenir: sempre faça export antes de atualizar

## 🤖 Integração com IA

### Erro: "OpenAI não foi inicializada"

**Causa**: API Key não configurada

**Solução**:
1. Vá em Configurações
2. Cole sua API Key da OpenAI
3. Clique em "Salvar API Key"

### Erro: "Invalid API Key"

**Causa**: Chave incorreta ou revogada

**Solução**:
1. Verifique a chave em https://platform.openai.com/api-keys
2. Gere nova chave se necessário
3. Reconfigure no app

### Erro: "Rate limit exceeded"

**Causa**: Muitas requisições em pouco tempo

**Solução**:
1. Aguarde alguns minutos
2. Configure limites na OpenAI dashboard
3. Reduza frequência de análises

### Erro: "Insufficient quota"

**Causa**: Sem créditos na conta OpenAI

**Solução**:
1. Adicione créditos em https://platform.openai.com/account/billing
2. Ou use modelo mais barato (gpt-3.5-turbo)

### IA retorna respostas estranhas

**Causa**: Prompt mal formatado ou dados insuficientes

**Solução**:
1. Registre mais medições/treinos
2. Verifique dados de perfil
3. Tente novamente com pergunta mais específica

## 📱 PWA

### Não aparece opção "Instalar app"

**Causa**: Critérios PWA não atendidos

**Solução**:
1. Acesse via HTTPS (em produção)
2. Verifique manifest.json
3. Confirme service worker registrado
4. Use Chrome/Edge (melhor suporte)

### App instalado não funciona offline

**Causa**: Service worker não cacheando corretamente

**Solução**:
1. DevTools → Application → Service Workers
2. Clique em "Update"
3. Verifique Cache Storage
4. Recarregue e teste novamente

### Ícone do app não aparece

**Causa**: Ícones não encontrados ou formato incorreto

**Solução**:
1. Verifique \`public/pwa-192x192.png\` e \`pwa-512x512.png\`
2. Confirme paths em \`manifest.json\`
3. Desinstale e reinstale o app

## 📊 Gráficos

### Gráficos não aparecem

**Causa**: Recharts não carregado ou dados vazios

**Solução**:
1. Verifique se há dados registrados
2. Abra Console para erros
3. Verifique se \`recharts\` está instalado

### Gráfico cortado ou mal formatado

**Causa**: ResponsiveContainer não configurado

**Solução**:
1. Envolva em \`ResponsiveContainer\`
2. Defina width="100%" e height={número}
3. Verifique container pai tem altura definida

## 🎨 UI/UX

### Fontes não carregam

**Causa**: Google Fonts bloqueado ou erro de rede

**Solução**:
1. Verifique conexão com internet
2. Teste com fontes do sistema como fallback
3. Verifique AdBlocker

### Animações travando

**Causa**: Performance baixa ou muitos re-renders

**Solução**:
1. Reduza quantidade de animações
2. Use \`useCallback\` e \`useMemo\`
3. Teste em modo produção (\`npm run build\`)

### Tema não muda

**Causa**: Configuração não salva ou CSS não atualizado

**Solução**:
1. Limpe cache do navegador
2. Force reload (Ctrl+Shift+R)
3. Verifique IndexedDB → settings

## 🚀 Build e Deploy

### Build falha

**Causa**: Erro de TypeScript ou ESLint

**Solução**:
\`\`\`powershell
# Verifique erros
npm run lint

# Se necessário, desabilite temporariamente
# Em vite.config.js: remova plugins de lint
\`\`\`

### Build muito grande

**Causa**: Dependencies não otimizadas

**Solução**:
1. Analise bundle: \`npm run build -- --analyze\`
2. Remova imports não utilizados
3. Use dynamic imports para rotas

### Erro 404 após deploy

**Causa**: SPA routing não configurado

**Solução**:
1. Verifique \`netlify.toml\` existe
2. Confirme redirects configurados
3. Para outros hosts, configure SPA fallback

### Assets não carregam em produção

**Causa**: Paths incorretos

**Solução**:
1. Use paths relativos (\`./\` ou \`/\`)
2. Verifique \`base\` em \`vite.config.js\`
3. Teste com \`npm run preview\`

## 📦 Dependências

### Erro de versão do Node

**Causa**: Node.js muito antigo

**Solução**:
\`\`\`powershell
# Atualize Node.js para 18+
# Baixe de https://nodejs.org
\`\`\`

### Vulnerabilidades detectadas

**Causa**: Dependências com security issues

**Solução**:
\`\`\`powershell
# Auditoria
npm audit

# Fix automático (quebra compatibilidade)
npm audit fix

# Ou atualize manualmente
npm update
\`\`\`

### Conflito de versões

**Causa**: Peer dependencies incompatíveis

**Solução**:
\`\`\`powershell
# Use flag legacy-peer-deps
npm install --legacy-peer-deps
\`\`\`

## 🔒 Segurança

### API Key exposta

**Causa**: Commit acidental no Git

**Solução**:
1. Revogue a chave imediatamente
2. Gere nova chave
3. Adicione \`.env\` ao \`.gitignore\`
4. Use Git history rewrite se necessário

### CORS errors

**Causa**: API externa bloqueando origem

**Solução**:
- OpenAI permite dangerouslyAllowBrowser
- Para outras APIs, use proxy ou backend

## 🆘 Ainda com Problemas?

### 1. Limpar tudo e recomeçar

\`\`\`powershell
# Remove tudo
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Limpa cache npm
npm cache clean --force

# Reinstala
npm install

# Tenta novamente
npm run dev
\`\`\`

### 2. Teste em navegador diferente

- Chrome/Edge (recomendado)
- Firefox
- Safari (limitações PWA)

### 3. Verifique requisitos do sistema

- Node.js 18+
- NPM 9+
- Windows 10+ / macOS / Linux
- Navegador moderno atualizado

### 4. Logs detalhados

\`\`\`powershell
# Build com logs verbosos
npm run build -- --debug

# Dev com logs
npm run dev -- --debug
\`\`\`

### 5. Consulte documentação oficial

- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [React Common Issues](https://react.dev/learn/troubleshooting)
- [OpenAI API Errors](https://platform.openai.com/docs/guides/error-codes)

### 6. Reporte o problema

Se nada resolver:
1. Crie issue no GitHub com:
   - Descrição detalhada
   - Mensagem de erro completa
   - Versões (Node, npm, navegador)
   - Steps to reproduce
   - Screenshots/logs

---

**💡 Dica Final**: Antes de reportar bugs, sempre teste em modo incógnito e com cache limpo!

Se resolver um problema não listado aqui, considere contribuir com a documentação! 🤝
