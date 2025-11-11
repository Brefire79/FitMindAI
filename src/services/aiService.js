import axios from 'axios';

let OPENAI_API_KEY = null;

export const initializeOpenAI = (apiKey) => {
  if (!apiKey) {
    throw new Error('API Key da OpenAI não configurada');
  }
  
  OPENAI_API_KEY = apiKey;
  return true;
};

export const getOpenAIClient = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');
  }
  return OPENAI_API_KEY;
};

export const analyzeUserProgress = async (userData, measurements, workouts) => {
  try {
    const apiKey = getOpenAIClient();
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('API Key inválida. A chave deve começar com "sk-"');
    }
    
    // Preparar dados para análise
    const latestMeasurements = measurements.slice(0, 5);
    const recentWorkouts = workouts.slice(0, 10);
    
    const prompt = `
Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:

**DADOS DO USUÁRIO:**
- Nome: ${userData.name}
- Idade: ${userData.age} anos
- Sexo: ${userData.gender}
- Altura: ${userData.height} cm
- Objetivo: ${userData.goal}

**MEDIÇÕES RECENTES:**
${latestMeasurements.map((m, i) => `
Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):
- Peso: ${m.weight} kg
- IMC: ${m.imc}
- Gordura Corporal: ${m.bodyFat || 'N/A'}%
- Massa Magra: ${m.leanMass || 'N/A'} kg
`).join('\n')}

**TREINOS RECENTES:**
${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `
Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):
- Tipo: ${w.type}
- Grupo Muscular: ${w.muscleGroup}
- Duração: ${w.duration} min
- Intensidade: ${w.intensity}
`).join('\n') : 'Nenhum treino registrado ainda.'}

**ANÁLISE SOLICITADA:**
1. Avalie o progresso atual do usuário em relação ao objetivo
2. Identifique pontos fortes e áreas que precisam melhorar
3. Forneça 3-5 recomendações específicas para os próximos treinos
4. Sugira ajustes na frequência, intensidade ou tipo de exercício
5. Dê dicas de nutrição e recuperação

Responda em formato JSON com a seguinte estrutura:
{
  "summary": "Resumo geral do progresso (2-3 frases)",
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "improvements": ["área a melhorar 1", "área a melhorar 2"],
  "recommendations": [
    {
      "title": "Título da recomendação",
      "description": "Descrição detalhada",
      "priority": "high|medium|low"
    }
  ],
  "nutritionTips": ["dica 1", "dica 2"],
  "motivationalMessage": "Mensagem motivacional personalizada"
}
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um personal trainer e nutricionista esportivo experiente. Forneça análises profissionais, motivadoras e baseadas em ciência do exercício.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const analysis = JSON.parse(response.data.choices[0].message.content);
    return analysis;
    
  } catch (error) {
    console.error('Erro ao analisar progresso:', error);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        throw new Error('Erro 429: Limite de requisições excedido. Aguarde alguns segundos e tente novamente.');
      } else if (status === 401) {
        throw new Error('Erro 401: API Key inválida ou expirada. Verifique sua chave.');
      } else if (status === 400) {
        throw new Error('Erro 400: Requisição inválida. Verifique os dados enviados.');
      }
    }
    
    throw new Error(`Não foi possível gerar análise. ${error.message || 'Verifique sua API Key e conexão.'}`);
  }
};

export const generateWorkoutPlan = async (userData, goal, focusArea, duration, level) => {
  try {
    const apiKey = getOpenAIClient();
    
    const prompt = `
Crie um plano de treino personalizado com os seguintes parâmetros:

**PERFIL:**
- Idade: ${userData.age} anos
- Sexo: ${userData.gender}
- Nível: ${level}
- Objetivo: ${goal}
- Foco: ${focusArea}
- Duração desejada: ${duration} minutos

Gere um treino completo em formato JSON:
{
  "workoutName": "Nome do treino",
  "description": "Descrição breve",
  "warmup": "Aquecimento sugerido (5-10 min)",
  "exercises": [
    {
      "name": "Nome do exercício",
      "muscleGroup": "Grupo muscular",
      "sets": 3,
      "reps": "10-12",
      "rest": 60,
      "notes": "Dicas de execução"
    }
  ],
  "cooldown": "Alongamento/relaxamento (5 min)",
  "tips": ["dica 1", "dica 2"]
}
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um personal trainer certificado. Crie treinos seguros, eficazes e adequados ao nível do praticante.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
        max_tokens: 1200
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
    
  } catch (error) {
    console.error('Erro ao gerar plano de treino:', error);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        throw new Error('Erro 429: Limite de requisições excedido.');
      } else if (status === 401) {
        throw new Error('Erro 401: API Key inválida.');
      }
    }
    
    throw new Error(`Não foi possível gerar o plano de treino. ${error.message || ''}`);
  }
};

export const getMealSuggestions = async (userData, goal, dietType = 'balanced') => {
  try {
    const apiKey = getOpenAIClient();
    
    const prompt = `
Sugira um plano alimentar para:

**PERFIL:**
- Idade: ${userData.age} anos
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- Objetivo: ${goal}
- Tipo de dieta: ${dietType}

Forneça sugestões em JSON:
{
  "dailyCalories": 2000,
  "macros": {
    "protein": "25%",
    "carbs": "50%",
    "fats": "25%"
  },
  "meals": [
    {
      "meal": "Café da manhã",
      "suggestions": ["opção 1", "opção 2"],
      "timing": "7h-8h"
    }
  ],
  "hydration": "Recomendação de água",
  "supplements": ["suplemento 1", "suplemento 2"],
  "tips": ["dica 1", "dica 2"]
}
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista esportivo. Forneça orientações nutricionais seguras e personalizadas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
    
  } catch (error) {
    console.error('Erro ao gerar sugestões alimentares:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Erro 429: Limite de requisições excedido.');
    } else if (error.response?.status === 401) {
      throw new Error('Erro 401: API Key inválida.');
    }
    
    throw new Error(`Não foi possível gerar sugestões alimentares. ${error.message || ''}`);
  }
};

export const answerQuestion = async (question, userData, context = '') => {
  try {
    const apiKey = getOpenAIClient();
    
    const systemPrompt = `Você é um assistente fitness especializado. Responda perguntas sobre treino, nutrição e saúde de forma clara e profissional.
    
Contexto do usuário:
- Nome: ${userData.name}
- Idade: ${userData.age} anos
- Objetivo: ${userData.goal}

${context}`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
    
  } catch (error) {
    console.error('Erro ao responder pergunta:', error);
    throw new Error('Não foi possível processar sua pergunta.');
  }
};

// Função auxiliar para obter recomendações gerais de IA
export const getAIRecommendation = async (userData) => {
  try {
    const apiKey = getOpenAIClient();
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um personal trainer e nutricionista virtual que analisa dados físicos e de treino e gera recomendações objetivas e seguras.'
          },
          {
            role: 'user',
            content: `Dados do usuário: ${JSON.stringify(userData)}. Gere dicas de treino e evolução.`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro na IA:', error);
    return 'Não foi possível gerar uma recomendação agora. Tente novamente.';
  }
};
