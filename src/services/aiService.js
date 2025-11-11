import axios from 'axios';

let OPENAI_API_KEY = null;
let GEMINI_API_KEY = null;
let AI_PROVIDER = 'openai';

export const initializeAI = ({ provider, apiKey }) => {
  if (provider === 'openai') {
    if (!apiKey) throw new Error('API Key da OpenAI não configurada');
    OPENAI_API_KEY = apiKey;
    AI_PROVIDER = 'openai';
  } else if (provider === 'gemini') {
    if (!apiKey) throw new Error('API Key do Gemini não configurada');
    GEMINI_API_KEY = apiKey;
    AI_PROVIDER = 'gemini';
  } else {
    throw new Error('Provedor de IA inválido');
  }
  return true;
};

export const initializeOpenAI = (apiKey) => initializeAI({ provider: 'openai', apiKey });

export const getAIClient = () => {
  if (AI_PROVIDER === 'openai') {
    if (!OPENAI_API_KEY) throw new Error('OpenAI não foi inicializada. Configure sua API Key.');
    return { provider: 'openai', apiKey: OPENAI_API_KEY };
  }
  if (AI_PROVIDER === 'gemini') {
    if (!GEMINI_API_KEY) throw new Error('Gemini não foi inicializado. Configure sua API Key.');
    return { provider: 'gemini', apiKey: GEMINI_API_KEY };
  }
  throw new Error('Nenhum provedor de IA configurado');
};

export const getOpenAIClient = () => getAIClient().apiKey;

const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {
  const res = await axios.post('https://api.openai.com/v1/chat/completions',
    { model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], temperature, max_tokens: maxTokens },
    { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
  );
  return res.data.choices?.[0]?.message?.content ?? '';
};

const callGemini = async (prompt, apiKey, temperature, maxTokens) => {
  const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature, maxOutputTokens: maxTokens } },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
};

const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {
  const client = getAIClient();
  if (client.provider === 'openai') return callOpenAI(prompt, client.apiKey, temperature, maxTokens);
  if (client.provider === 'gemini') return callGemini(prompt, client.apiKey, temperature, maxTokens);
  throw new Error('Provedor de IA não suportado');
};

export const analyzeUserProgress = async (userData, measurements, workouts) => {
  try {
    const client = getAIClient();
    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-')))
      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');
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
