# 🤖 Provedores de IA - FitMind AI

## ✨ Novidade: Suporte a Múltiplos Provedores

Agora o FitMind AI suporta **dois provedores de inteligência artificial**:

### 1. OpenAI (GPT)
- **Modelo**: GPT-4o-mini
- **Vantagens**: 
  - Respostas muito precisas e contextuais
  - Ótimo para análises complexas
  - Suporte a JSON estruturado
- **Como obter**:
  1. Acesse: https://platform.openai.com/api-keys
  2. Crie uma conta (necessita cartão de crédito)
  3. Gere uma API Key (começa com `sk-`)
  4. Crédito gratuito de $5 para novos usuários

### 2. Google Gemini
- **Modelo**: Gemini 1.5 Flash
- **Vantagens**:
  - **GRATUITO** - Até 1500 requisições/dia
  - Respostas rápidas
  - Sem necessidade de cartão de crédito
  - Ótimo para uso pessoal
- **Como obter**:
  1. Acesse: https://makersuite.google.com/app/apikey
  2. Faça login com sua conta Google
  3. Clique em "Create API Key"
  4. Copie a chave (começa com `AIza`)

## 📝 Como Configurar

1. **Abra o App** → Vá em **Configurações** (ícone de engrenagem)

2. **Escolha o Provedor**:
   - Clique em **OpenAI** ou **Google Gemini**

3. **Cole sua API Key**:
   - OpenAI: Cole a chave que começa com `sk-...`
   - Gemini: Cole a chave que começa com `AIza...`

4. **Salve**:
   - Clique em "Salvar Configurações"
   - Aguarde a mensagem de confirmação

5. **Pronto!**
   - Agora todos os recursos de IA funcionarão:
     - ✅ AI Coach (análise de progresso)
     - ✅ Geração de treinos personalizados
     - ✅ Sugestões de nutrição
     - ✅ Chat com assistente fitness

## 🆚 Comparação

| Característica | OpenAI | Gemini |
|----------------|--------|--------|
| **Custo** | Pago (créditos) | **Gratuito** |
| **Limite Diário** | Baseado em créditos | 1500 requisições/dia |
| **Qualidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Velocidade** | Rápido | Muito Rápido |
| **Requer Cartão** | Sim | Não |
| **JSON Mode** | Sim | Simulado |

## 💡 Recomendação

- **Para uso pessoal/teste**: Use **Gemini** (gratuito, sem limites preocupantes)
- **Para uso profissional**: Use **OpenAI** (mais preciso para análises complexas)
- **Pode alternar**: Troque entre provedores a qualquer momento!

## 🔒 Segurança

- ✅ Suas API Keys são armazenadas **apenas localmente** no seu navegador
- ✅ **Nunca** enviamos suas chaves para nossos servidores
- ✅ As chamadas vão direto para OpenAI/Google
- ✅ Seus dados ficam no seu dispositivo (IndexedDB)

## 🐛 Solução de Problemas

### Erro 401 (Unauthorized)
- **Causa**: API Key inválida ou expirada
- **Solução**: Verifique se copiou a chave completa e se ela está ativa

### Erro 429 (Too Many Requests)
- **OpenAI**: Você excedeu seus créditos ou limite de taxa
  - Solução: Aguarde alguns segundos ou adicione créditos
- **Gemini**: Você excedeu 1500 requisições/dia
  - Solução: Aguarde até o próximo dia ou use OpenAI

### Erro 400 (Bad Request)
- **Causa**: Problema na formatação da requisição
- **Solução**: Tente reformular sua pergunta ou aguarde alguns segundos

## 📱 Funcionalidades que Usam IA

1. **AI Coach** → Análise completa de progresso
2. **Perguntas e Respostas** → Chat inteligente sobre fitness
3. **Geração de Treinos** → Planos personalizados (futuro)
4. **Sugestões de Nutrição** → Recomendações alimentares (futuro)

## 🚀 Arquitetura Técnica

```
aiService.js
├── initializeAI({ provider, apiKey })     # Configura provedor
├── callAI(prompt, temp, maxTokens)        # Chamada unificada
│   ├── callOpenAI()                       # GPT-4o-mini
│   └── callGemini()                       # Gemini 1.5 Flash
├── analyzeUserProgress()                  # Análise de dados
├── generateWorkoutPlan()                  # Criação de treinos
├── getMealSuggestions()                   # Nutrição
└── answerQuestion()                       # Chat
```

## 📊 Status da Implementação

- ✅ Suporte a OpenAI (GPT-4o-mini)
- ✅ Suporte a Google Gemini (1.5 Flash)
- ✅ Interface de seleção de provedor
- ✅ Armazenamento de configurações
- ✅ Tratamento de erros por provedor
- ✅ Validação de API Keys
- ✅ Fallback para respostas não-JSON

---

**Desenvolvido com ❤️ para o FitMind AI**
