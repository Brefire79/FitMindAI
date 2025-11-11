# Netlify Build Settings

## Clear Cache and Deploy

Se o erro persistir no Netlify após o push:

### Opção 1: Limpar Cache pelo Painel
1. Acesse: https://app.netlify.com
2. Vá em **Site settings** > **Build & deploy**
3. Clique em **Clear cache and retry deploy**

### Opção 2: Trigger Deploy Manual
1. No painel do site
2. **Deploys** > **Trigger deploy** > **Clear cache and deploy site**

### Opção 3: Via Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy com cache limpo
netlify deploy --prod --clear-cache
```

## Variáveis de Ambiente Obrigatórias

Certifique-se de que está configurada:

```
VITE_OPENAI_API_KEY = sk-proj-...
```

## Build Settings Corretos

```
Build command: npm run build
Publish directory: dist
Node version: 18
```

## Troubleshooting

### Erro: ptBR is not defined
**Causa:** Cache antigo do Netlify com código anterior

**Solução:**
1. Clear cache no Netlify
2. Aguardar novo build
3. Verificar logs de build

### Erro: Module not found
**Causa:** node_modules desatualizados

**Solução:**
No `netlify.toml` já está configurado:
```toml
[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
```

### Build Timeout
**Causa:** Build muito lento

**Solução:**
Adicionar em netlify.toml:
```toml
[build]
  command = "npm ci && npm run build"
```

## Status Atual

✅ Build local funciona perfeitamente
✅ Código corrigido no GitHub
⚠️ Netlify precisa limpar cache

**Próximo passo:** Clear cache no Netlify!
