# 🚀 Guia de Deploy - FitMind AI

## Deploy no Netlify (Recomendado)

### Método 1: Deploy via Git (Automático)

1. **Crie um repositório no GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit - FitMind AI"
   git branch -M main
   git remote add origin <seu-repositorio>
   git push -u origin main
   \`\`\`

2. **Conecte ao Netlify**
   - Acesse [Netlify](https://app.netlify.com/)
   - Clique em "Add new site" → "Import an existing project"
   - Conecte sua conta GitHub
   - Selecione o repositório FitMind AI

3. **Configure o Build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy Automático**
   - A cada push no repositório, o Netlify fará deploy automático
   - URL personalizada disponível após o primeiro deploy

### Método 2: Deploy Manual

1. **Gere o Build**
   \`\`\`powershell
   npm run build
   \`\`\`

2. **Deploy no Netlify**
   - Acesse https://app.netlify.com/drop
   - Arraste a pasta \`dist\` para a área de upload
   - Aguarde o processamento
   - Seu site estará online em poucos segundos!

## Deploy em Outras Plataformas

### Vercel

1. Instale a CLI do Vercel:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Execute:
   \`\`\`bash
   vercel
   \`\`\`

3. Siga as instruções no terminal

### GitHub Pages

1. Instale gh-pages:
   \`\`\`bash
   npm install --save-dev gh-pages
   \`\`\`

2. Adicione ao \`package.json\`:
   \`\`\`json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   \`\`\`

3. Configure base no \`vite.config.js\`:
   \`\`\`js
   export default defineConfig({
     base: '/nome-do-repositorio/',
     // ... resto da config
   })
   \`\`\`

4. Execute:
   \`\`\`bash
   npm run deploy
   \`\`\`

### Docker

\`\`\`dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Configurações Pós-Deploy

### 1. Custom Domain (Netlify)

1. Vá em Site settings → Domain management
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

### 2. HTTPS

- Netlify: Ativado automaticamente
- Para outros hosts: Configure certificado SSL

### 3. Variáveis de Ambiente

No Netlify:
1. Site settings → Build & deploy → Environment
2. Adicione variáveis se necessário (não recomendado para API Keys)

### 4. Redirects e Headers

O arquivo \`netlify.toml\` já está configurado com:
- SPA redirect (/* → /index.html)
- Headers de segurança
- Cache otimizado

## Otimizações

### Performance

✅ Code splitting automático (Vite)
✅ Lazy loading de rotas
✅ Compressão de assets
✅ PWA com cache offline
✅ Imagens otimizadas

### SEO (Adicional)

Adicione meta tags no \`index.html\`:
\`\`\`html
<meta property="og:title" content="FitMind AI">
<meta property="og:description" content="Seu coach inteligente de fitness">
<meta property="og:image" content="/og-image.png">
<meta property="og:url" content="https://seudominio.com">
<meta name="twitter:card" content="summary_large_image">
\`\`\`

### Analytics (Opcional)

1. **Google Analytics**
   \`\`\`html
   <!-- No index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   \`\`\`

2. **Netlify Analytics**
   - Ative em Site settings → Analytics

## Monitoramento

### Logs de Build

- Netlify: Deploy logs disponíveis no dashboard
- Verifique erros e avisos

### Performance

- Use [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

### Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com/)
- [StatusCake](https://www.statuscake.com/)

## Checklist Pré-Deploy

- [ ] Build local funcionando (\`npm run build\`)
- [ ] Preview local funcionando (\`npm run preview\`)
- [ ] Teste em diferentes navegadores
- [ ] Teste responsividade (mobile/tablet/desktop)
- [ ] Verifique PWA (instalação)
- [ ] Teste funcionalidades offline
- [ ] Configure domínio personalizado (opcional)
- [ ] Configure analytics (opcional)
- [ ] README.md atualizado

## Troubleshooting

### Build Falha

- Verifique versão do Node (18+)
- Limpe cache: \`rm -rf node_modules && npm install\`
- Verifique logs de erro

### PWA Não Funciona

- Certifique-se que está em HTTPS
- Limpe cache do navegador
- Verifique manifest e service worker

### Rotas 404

- Confirme que \`netlify.toml\` tem redirects
- Para outros hosts, configure SPA fallback

## Atualizações

Para atualizar o app em produção:

1. Faça alterações localmente
2. Teste com \`npm run dev\`
3. Commit e push (deploy automático no Netlify)
4. Ou faça build manual e upload

---

**🎉 Pronto! Seu FitMind AI está online e acessível para o mundo!**

Para suporte, consulte a documentação oficial das plataformas:
- [Netlify Docs](https://docs.netlify.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
