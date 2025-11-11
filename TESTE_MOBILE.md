# 📱 Teste Mobile Local

Para testar o app no seu celular enquanto desenvolve:

## 🌐 Opção 1: Rede Local (Recomendado)

### 1. Iniciar servidor acessível na rede
```bash
npm run dev:host
```

### 2. Obter seu IP local
**Windows:**
```bash
ipconfig
# Procure por "IPv4 Address" na sua rede WiFi
# Exemplo: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### 3. Acessar no celular
```
http://192.168.1.100:5173
```

> ⚠️ **Importante:** Celular e computador devem estar na **mesma rede WiFi**

---

## 🔍 Opção 2: ngrok (Internet Pública)

### 1. Instalar ngrok
```bash
# Windows (com Chocolatey)
choco install ngrok

# Mac (com Homebrew)
brew install ngrok

# Ou baixar: https://ngrok.com/download
```

### 2. Iniciar app local
```bash
npm run dev
```

### 3. Expor na internet
```bash
ngrok http 5173
```

### 4. Acessar URL pública
```
https://abcd1234.ngrok.io
```

> ✅ Acesse de qualquer lugar do mundo!

---

## 🧪 Teste PWA no Mobile

### Android (Chrome)
1. Abra o app no Chrome
2. Toque no menu (⋮)
3. "Adicionar à tela inicial"
4. Confirme instalação

### iOS (Safari)
1. Abra o app no Safari
2. Toque em "Compartilhar" (ícone quadrado com seta)
3. "Adicionar à Tela de Início"
4. Confirme instalação

---

## 🔥 DevTools Mobile

### Chrome Remote Debugging (Android)
1. Conecte celular via USB
2. Ative "Depuração USB" nas opções de desenvolvedor
3. Chrome desktop > `chrome://inspect`
4. Selecione seu dispositivo

### Safari Web Inspector (iOS)
1. iPhone: Ajustes > Safari > Avançado > Web Inspector (ON)
2. Mac: Safari > Preferências > Avançado > Mostrar menu Desenvolver
3. Safari > Desenvolver > [Seu iPhone]

---

## 📊 Teste Performance Mobile

### Lighthouse Mobile
```bash
# Chrome DevTools
F12 > Lighthouse > Mobile > Analyze
```

### Teste Conexões Lentas
Chrome DevTools > Network > Throttling:
- Slow 3G
- Fast 3G
- Offline (testa PWA!)

---

## ✅ Checklist Testes Mobile

- [ ] Layout responsivo (320px a 768px)
- [ ] Touch targets > 44px
- [ ] Texto legível sem zoom
- [ ] Imagens otimizadas
- [ ] Scrolling suave
- [ ] Modais funcionam bem
- [ ] Inputs não ficam escondidos pelo teclado
- [ ] PWA instalável
- [ ] Funciona offline
- [ ] Gráficos renderizam corretamente

---

## 🚀 Atalho Rápido

**Desenvolvimento mobile-first:**
```bash
npm run dev:host
# Anote o IP exibido no terminal
# Exemplo: Network: http://192.168.1.100:5173/
```

**Acesse direto no celular! 📱**
