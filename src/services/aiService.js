import axios from 'axios';

let GEMINI_API_KEY = null;

export const initializeAI = (apiKey) => {
  if (!apiKey) {
    console.error('❌ initializeAI: API Key não fornecida');
    throw new Error('API Key do Gemini não configurada');
  }
  
  // Validar formato básico da API Key do Gemini
  if (!apiKey.startsWith('AIza')) {
    console.error('❌ initializeAI: API Key não parece ser válida (deve começar com "AIza")');
    console.log('🔑 API Key fornecida começa com:', apiKey.substring(0, 4));
    throw new Error('API Key do Gemini inválida. Deve começar com "AIza". Gere uma nova em: https://makersuite.google.com/app/apikey');
  }
  
  if (apiKey.length < 30) {
    console.error('❌ initializeAI: API Key muito curta (tamanho:', apiKey.length, ')');
    throw new Error('API Key do Gemini inválida. Verifique se copiou a chave completa.');
  }
  
  GEMINI_API_KEY = apiKey;
  console.log('✅ initializeAI: Gemini API Key configurada com sucesso');
  console.log('🔑 Primeiros caracteres da chave:', apiKey.substring(0, 10) + '...');
  console.log('📏 Tamanho da chave:', apiKey.length, 'caracteres');
  return true;
};

export const getAIClient = () => {
  if (!GEMINI_API_KEY) {
    console.error('❌ getAIClient: Gemini não inicializado');
    throw new Error('Gemini não foi inicializado. Configure sua API Key.');
  }
  console.log('✅ getAIClient: Retornando API Key');
  return GEMINI_API_KEY;
};

const callGemini = async (prompt, apiKey, temperature, maxTokens) => {
  try {
    console.log('🔄 callGemini: Iniciando chamada à API do Gemini');
    console.log('🔑 API Key (primeiros 15 chars):', apiKey.substring(0, 15) + '...');
    console.log('📝 Tamanho do prompt:', prompt.length, 'caracteres');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = { 
      contents: [{ parts: [{ text: prompt }] }], 
      generationConfig: { temperature, maxOutputTokens: maxTokens } 
    };
    
    console.log('🌐 URL da requisição:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const res = await axios.post(url, payload, { 
      headers: { 'Content-Type': 'application/json' } 
    });
    
    console.log('✅ callGemini: Resposta recebida com sucesso');
    const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('📄 Tamanho da resposta:', text.length, 'caracteres');
    
    return text;
  } catch (error) {
    console.error('❌ callGemini: Erro detalhado');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    if (error.response?.status === 404) {
      throw new Error('❌ API Key inválida ou API do Gemini não habilitada. Verifique:\n' +
        '1. API Key está correta?\n' +
        '2. API do Gemini está ativada no Google Cloud Console?\n' +
        '3. Gere uma nova chave em: https://makersuite.google.com/app/apikey');
    } else if (error.response?.status === 403) {
      throw new Error('❌ Permissão negada. Verifique se a API Key tem permissões para usar o Gemini.');
    } else if (error.response?.status === 429) {
      throw new Error('❌ Limite de requisições excedido. Aguarde alguns minutos e tente novamente.');
    }
    
    throw new Error(`Erro ao chamar API do Gemini: ${error.message}`);
  }
};

const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {
  const apiKey = getAIClient();
  return callGemini(prompt, apiKey, temperature, maxTokens);
};

export const analyzeUserProgress = async (userData, measurements, workouts) => {
  try {
    const latestMeasurements = (measurements || []).slice(0, 5);
    const recentWorkouts = (workouts || []).slice(0, 10);
    const prompt = `Você é um personal trainer e nutricionista esportivo. Analise os dados e retorne JSON.\n\nUSUÁRIO:\n- Nome: ${userData?.name}\n- Idade: ${userData?.age}\n- Sexo: ${userData?.gender}\n- Altura: ${userData?.height}\n- Objetivo: ${userData?.goal}\n\nMEDIÇÕES:\n${latestMeasurements.map((m, i) => `#${i + 1} ${new Date(m.date).toLocaleDateString('pt-BR')} | Peso: ${m.weight} | IMC: ${m.imc} | GC: ${m.bodyFat ?? '-'}% | MM: ${m.leanMass ?? '-'}`).join('\n') || '-'}\n\nTREINOS:\n${recentWorkouts.map((w, i) => `#${i + 1} ${new Date(w.date).toLocaleDateString('pt-BR')} | Tipo: ${w.type} | Duração: ${w.duration} | Intensidade: ${w.intensity}`).join('\n') || '-'}\n\nEstrutura JSON:\n{"summary":"2-3 frases","strengths":["..."],"improvements":["..."],"recommendations":[{"title":"...","description":"...","priority":"high|medium|low"}],"nutritionTips":["..."],"motivationalMessage":"..."}`;
    const text = await callAI(prompt, 0.7, 1500);
    try { return JSON.parse(text); } catch { return { summary: text.slice(0, 200), strengths: [], improvements: [], recommendations: [], nutritionTips: [], motivationalMessage: 'Continue firme!' }; }
  } catch (error) {
    if (error?.response?.status === 429) throw new Error('Erro 429: Limite de requisições excedido. Tente novamente em instantes.');
    if (error?.response?.status === 401) throw new Error('Erro 401: API Key inválida ou expirada.');
    if (error?.response?.status === 400) throw new Error('Erro 400: Requisição inválida.');
    throw new Error(`Não foi possível gerar análise. ${error.message || ''}`);
  }
};

export const generateWorkoutPlan = async (userData, goal, focusArea, duration, level) => {
  try {
    const prompt = `Crie um plano de treino (JSON) para ${userData?.age || '-'} anos, ${userData?.gender || '-'}.\nObjetivo: ${goal}. Foco: ${focusArea}. Duração por sessão: ${duration} min. Nível: ${level}.\nEstrutura: {"name":"...","description":"...","exercises":[{"name":"...","sets":3,"reps":"10-12","rest":"60s","notes":"..."}],"warmup":"...","cooldown":"..."}`;
    const text = await callAI(prompt, 0.8, 1200);
    try { return JSON.parse(text); } catch { return { workoutPlan: { name: 'Plano Personalizado', description: text, exercises: [] } }; }
  } catch (error) {
    if (error?.response?.status === 429) throw new Error('Erro 429: Limite de requisições excedido.');
    if (error?.response?.status === 401) throw new Error('Erro 401: API Key inválida.');
    throw new Error(`Não foi possível gerar o plano de treino. ${error.message || ''}`);
  }
};

export const getMealSuggestions = async (userData, goal, dietType = 'balanced') => {
  try {
    const prompt = `Sugira plano alimentar (JSON) para ${userData?.age || '-'} anos, ${userData?.height || '-'} cm, ${userData?.weight || '-'} kg.\nObjetivo: ${goal}. Dieta: ${dietType}.\nEstrutura: {"dailyCalories":2000,"macros":{"protein":"25%","carbs":"50%","fats":"25%"},"meals":[{"name":"Café da Manhã","foods":["..."],"calories":500}],"tips":["..."]}`;
    const text = await callAI(prompt, 0.7, 1000);
    try { return JSON.parse(text); } catch { return { mealPlan: { notes: text, meals: [] } }; }
  } catch (error) {
    if (error?.response?.status === 429) throw new Error('Erro 429: Limite de requisições excedido.');
    if (error?.response?.status === 401) throw new Error('Erro 401: API Key inválida.');
    throw new Error(`Não foi possível gerar sugestões alimentares. ${error.message || ''}`);
  }
};

export const answerQuestion = async (question) => {
  try {
    const prompt = `Você é um assistente fitness. Responda de forma clara e profissional.\nPergunta: ${question}`;
    return await callAI(prompt, 0.8, 500);
  } catch (error) {
    if (error?.response?.status === 429) throw new Error('Erro 429: Limite de requisições excedido. Aguarde e tente novamente.');
    if (error?.response?.status === 401) throw new Error('Erro 401: API Key inválida ou expirada.');
    if (error?.response?.status === 400) throw new Error('Erro 400: Requisição inválida.');
    throw new Error(`Não foi possível processar sua pergunta. ${error.message || ''}`);
  }
};

export const getAIRecommendation = async (userData) => {
  try {
    const prompt = `Com base neste perfil (Nome: ${userData?.name || '-'}, Idade: ${userData?.age || '-'}, Objetivo: ${userData?.goal || '-'}), escreva UMA frase motivacional curta.`;
    return await callAI(prompt, 0.7, 150);
  } catch (error) { return 'Continue firme no seu objetivo! Você está no caminho certo! 💪'; }
};
