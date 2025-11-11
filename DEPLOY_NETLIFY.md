# 🚀 Deploy FitMind AI no Netlify

## Opção 1: Deploy Drag & Drop (Mais Rápido)

### 1. Build Local
```bash
npm install
npm run build
```

### 2. Deploy Manual
1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist/` para o campo de upload
3. Aguarde o deploy finalizar
4. Seu app estará online!

---

## Opção 2: Deploy via Git (Recomendado)

### 1. Criar Repositório Git
```bash
git init
git add .
git commit -m "Initial commit - FitMind AI"
```

### 2. Push para GitHub
```bash
# Crie um repositório no GitHub primeiro
git remote add origin https://github.com/seu-usuario/fitmind-ai.git
git branch -M main
git push -u origin main
```

### 3. Conectar ao Netlify
1. Acesse: https://app.netlify.com/
2. Clique em "Add new site" > "Import an existing project"
3. Conecte ao GitHub e selecione o repositório
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `18`

### 4. Variáveis de Ambiente (IMPORTANTE!)
No painel do Netlify:
1. Vá em **Site settings** > **Environment variables**
2. Adicione:
   ```
   VITE_OPENAI_API_KEY=sk-sua-chave-aqui
   ```

### 5. Deploy Automático
- Cada push para `main` fará deploy automático
- Preview automático para Pull Requests

---

## ⚙️ Configurações Pós-Deploy

### Domínio Personalizado (Opcional)
1. **Site settings** > **Domain management**
2. Adicione seu domínio customizado
3. Configure DNS conforme instruções

### HTTPS
- Habilitado automaticamente pelo Netlify
- Certificado SSL gratuito via Let's Encrypt

### PWA e Mobile
- ✅ App instalável em iOS e Android
- ✅ Funciona offline após primeiro acesso
- ✅ Ícones otimizados (192x192 e 512x512)

---

## 🔐 Segurança

### Proteger API Key
A variável `VITE_OPENAI_API_KEY` estará exposta no frontend. Para produção:

**Opção Segura (Recomendada):**
1. Criar backend simples (Netlify Functions ou Vercel)
2. Armazenar API Key no backend
3. Frontend faz requisições para seu backend
4. Backend faz chamadas para OpenAI

**Exemplo Netlify Function** (`netlify/functions/ai.js`):
```javascript
export async function handler(event) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY; // Segura no servidor
  // Fazer chamada OpenAI aqui
}
```

---

## 📱 Teste Mobile

Após deploy, teste em:
- ✅ Chrome Android
- ✅ Safari iOS
- ✅ Edge Mobile
- ✅ Samsung Internet

### Instalar PWA:
1. Abra no navegador mobile
2. Toque no menu (⋮)
3. "Adicionar à tela inicial"
4. App instalado! 🎉

---

## 🐛 Troubleshooting

### Build Falha
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Key não funciona
- Verifique se variável está configurada no Netlify
- Formato: `VITE_OPENAI_API_KEY` (com prefixo VITE_)
- Faça redeploy após adicionar variável

### PWA não instala
- Verifique HTTPS (obrigatório)
- Confirme que `manifest.webmanifest` está acessível
- Limpe cache do navegador

---

## 📊 Monitoramento

### Analytics (Opcional)
Adicione no `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### Performance
- Use Lighthouse para avaliar
- Netlify fornece métricas automáticas
- Verifique Core Web Vitals

---

## 🔄 Atualizações

```bash
# Fazer alterações
git add .
git commit -m "feat: nova funcionalidade"
git push

# Deploy automático inicia!
```

---

## 📞 Suporte

- **Netlify Docs:** https://docs.netlify.com
- **Vite Deploy:** https://vitejs.dev/guide/static-deploy.html
- **PWA:** https://vite-pwa-org.netlify.app/

---

## ✅ Checklist Pré-Deploy

- [ ] `npm run build` funciona sem erros
- [ ] Todos os arquivos estáticos em `public/`
- [ ] Manifest e ícones PWA configurados
- [ ] API Key definida (ou backend criado)
- [ ] `.gitignore` inclui `.env` e `node_modules`
- [ ] README atualizado
- [ ] Testado em mobile local

**Pronto para Deploy! 🚀**
