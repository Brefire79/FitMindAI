import axios from 'axios';import axios from 'axios';



let OPENAI_API_KEY = null;let OPENAI_API_KEY = null;

let GEMINI_API_KEY = null;let GEMINI_API_KEY = null;

let AI_PROVIDER = 'openai'; // 'openai' ou 'gemini'let AI_PROVIDER = 'openai'; // 'openai' ou 'gemini'



export const initializeAI = (config) => {export const initializeAI = (config) => {

  if (config.provider === 'openai') {  if (config.provider === 'openai') {

    if (!config.apiKey) {    if (!config.apiKey) {

      throw new Error('API Key da OpenAI não configurada');      throw new Error('API Key da OpenAI não configurada');

    }    }

    OPENAI_API_KEY = config.apiKey;    OPENAI_API_KEY = config.apiKey;

    AI_PROVIDER = 'openai';    AI_PROVIDER = 'openai';

  } else if (config.provider === 'gemini') {  } else if (config.provider === 'gemini') {

    if (!config.apiKey) {    if (!config.apiKey) {

      throw new Error('API Key do Gemini não configurada');      throw new Error('API Key do Gemini não configurada');

    }    }

    GEMINI_API_KEY = config.apiKey;    GEMINI_API_KEY = config.apiKey;

    AI_PROVIDER = 'gemini';    AI_PROVIDER = 'gemini';

  }  }

  return true;  return true;

};};



// Manter compatibilidade com código antigo// Manter compatibilidade com código antigo

export const initializeOpenAI = (apiKey) => {export const initializeOpenAI = (apiKey) => {

  return initializeAI({ provider: 'openai', apiKey });  return initializeAI({ provider: 'openai', apiKey });

};};



export const getAIClient = () => {export const getAIClient = () => {

  if (AI_PROVIDER === 'openai') {  if (AI_PROVIDER === 'openai') {

    if (!OPENAI_API_KEY) {    if (!OPENAI_API_KEY) {

      throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');      throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');

    }    }

    return { provider: 'openai', apiKey: OPENAI_API_KEY };    return { provider: 'openai', apiKey: OPENAI_API_KEY };

  } else if (AI_PROVIDER === 'gemini') {  } else if (AI_PROVIDER === 'gemini') {

    if (!GEMINI_API_KEY) {    if (!GEMINI_API_KEY) {

      throw new Error('Gemini não foi inicializado. Configure sua API Key nas configurações.');      throw new Error('Gemini não foi inicializado. Configure sua API Key nas configurações.');

    }    }

    return { provider: 'gemini', apiKey: GEMINI_API_KEY };    return { provider: 'gemini', apiKey: GEMINI_API_KEY };

  }  }

  throw new Error('Nenhum provedor de IA configurado');  throw new Error('Nenhum provedor de IA configurado');

};};



// Manter compatibilidade com código antigo// Manter compatibilidade com código antigo

export const getOpenAIClient = () => {export const getOpenAIClient = () => {

  const client = getAIClient();  const client = getAIClient();

  return client.apiKey;  return client.apiKey;

};};



// Chamada para OpenAI// Função auxiliar para fazer chamadas de IA

const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {

  const response = await axios.post(  const client = getAIClient();

    'https://api.openai.com/v1/chat/completions',  

    {  if (client.provider === 'openai') {

      model: 'gpt-4o-mini',    return await callOpenAI(prompt, client.apiKey, temperature, maxTokens);

      messages: [{ role: 'user', content: prompt }],  } else if (client.provider === 'gemini') {

      temperature,    return await callGemini(prompt, client.apiKey, temperature, maxTokens);

      max_tokens: maxTokens,  }

    },};

    {

      headers: {// Chamada para OpenAI

        'Authorization': `Bearer ${apiKey}`,const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {

        'Content-Type': 'application/json',  const response = await axios.post(

      },    'https://api.openai.com/v1/chat/completions',

    }    {

  );      model: 'gpt-4o-mini',

  return response.data.choices[0].message.content;      messages: [{ role: 'user', content: prompt }],

};      temperature,

      max_tokens: maxTokens,

// Chamada para Gemini    },

const callGemini = async (prompt, apiKey, temperature, maxTokens) => {    {

  const response = await axios.post(      headers: {

    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,        'Authorization': `Bearer ${apiKey}`,

    {        'Content-Type': 'application/json',

      contents: [{      },

        parts: [{ text: prompt }]    }

      }],  );

      generationConfig: {  return response.data.choices[0].message.content;

        temperature,};

        maxOutputTokens: maxTokens,

      }// Chamada para Gemini

    },const callGemini = async (prompt, apiKey, temperature, maxTokens) => {

    {  const response = await axios.post(

      headers: {    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

        'Content-Type': 'application/json',    {

      },      contents: [{

    }        parts: [{ text: prompt }]

  );      }],

  return response.data.candidates[0].content.parts[0].text;      generationConfig: {

};        temperature,

        maxOutputTokens: maxTokens,

// Função auxiliar para fazer chamadas de IA      }

const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {    },

  const client = getAIClient();    {

        headers: {

  if (client.provider === 'openai') {        'Content-Type': 'application/json',

    return await callOpenAI(prompt, client.apiKey, temperature, maxTokens);      },

  } else if (client.provider === 'gemini') {    }

    return await callGemini(prompt, client.apiKey, temperature, maxTokens);  );

  }  return response.data.candidates[0].content.parts[0].text;

};};



export const analyzeUserProgress = async (userData, measurements, workouts) => {export const analyzeUserProgress = async (userData, measurements, workouts) => {

  try {  try {

    const client = getAIClient();    const client = getAIClient();

        

    // Validação específica para OpenAI    // Validação específica para OpenAI

    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-'))) {    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-'))) {

      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');

    }    }

        

    // Preparar dados para análise    // Preparar dados para análise

    const latestMeasurements = measurements.slice(0, 5);    const latestMeasurements = measurements.slice(0, 5);

    const recentWorkouts = workouts.slice(0, 10);    const recentWorkouts = workouts.slice(0, 10);

        

    const prompt = `    const prompt = `

Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:



**DADOS DO USUÁRIO:****DADOS DO USUÁRIO:**

- Nome: ${userData.name}- Nome: ${userData.name}

- Idade: ${userData.age} anos- Idade: ${userData.age} anos

- Sexo: ${userData.gender}- Sexo: ${userData.gender}

- Altura: ${userData.height} cm- Altura: ${userData.height} cm

- Objetivo: ${userData.goal}- Objetivo: ${userData.goal}



**MEDIÇÕES RECENTES:****MEDIÇÕES RECENTES:**

${latestMeasurements.map((m, i) => `${latestMeasurements.map((m, i) => `

Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):

- Peso: ${m.weight} kg- Peso: ${m.weight} kg

- IMC: ${m.imc}- IMC: ${m.imc}

- Gordura Corporal: ${m.bodyFat || 'N/A'}%- Gordura Corporal: ${m.bodyFat || 'N/A'}%

- Massa Magra: ${m.leanMass || 'N/A'} kg- Massa Magra: ${m.leanMass || 'N/A'} kg

`).join('\n')}`).join('\n')}



**TREINOS RECENTES:****TREINOS RECENTES:**

${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `

Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):

- Tipo: ${w.type}- Tipo: ${w.type}

- Duração: ${w.duration} minutos- Grupo Muscular: ${w.muscleGroup}

- Intensidade: ${w.intensity}- Duração: ${w.duration} min

`).join('\n') : 'Nenhum treino registrado ainda.'}- Intensidade: ${w.intensity}

`).join('\n') : 'Nenhum treino registrado ainda.'}

**ANÁLISE SOLICITADA:**

1. Avalie o progresso atual do usuário em relação ao objetivo**ANÁLISE SOLICITADA:**

2. Identifique pontos fortes e áreas que precisam melhorar1. Avalie o progresso atual do usuário em relação ao objetivo

3. Forneça 3-5 recomendações específicas para os próximos treinos2. Identifique pontos fortes e áreas que precisam melhorar

4. Sugira ajustes na frequência, intensidade ou tipo de exercício3. Forneça 3-5 recomendações específicas para os próximos treinos

5. Dê dicas de nutrição e recuperação4. Sugira ajustes na frequência, intensidade ou tipo de exercício

5. Dê dicas de nutrição e recuperação

Responda em formato JSON com a seguinte estrutura:

{Responda em formato JSON com a seguinte estrutura:

  "summary": "Resumo geral do progresso (2-3 frases)",{

  "strengths": ["ponto forte 1", "ponto forte 2"],  "summary": "Resumo geral do progresso (2-3 frases)",

  "improvements": ["área a melhorar 1", "área a melhorar 2"],  "strengths": ["ponto forte 1", "ponto forte 2"],

  "recommendations": [  "improvements": ["área a melhorar 1", "área a melhorar 2"],

    {  "recommendations": [

      "title": "Título da recomendação",    {

      "description": "Descrição detalhada",      "title": "Título da recomendação",

      "priority": "high|medium|low"      "description": "Descrição detalhada",

    }      "priority": "high|medium|low"

  ],    }

  "nutritionTips": ["dica 1", "dica 2"],  ],

  "motivationalMessage": "Mensagem motivacional personalizada"  "nutritionTips": ["dica 1", "dica 2"],

}  "motivationalMessage": "Mensagem motivacional personalizada"

`;}

`;

    const responseText = await callAI(prompt, 0.7, 1500);

        // Fazer a chamada usando a função genérica

    // Tentar parsear como JSON    const responseText = await callAI(prompt, 0.7, 1500);

    let analysis;    

    try {    // Tentar parsear como JSON

      analysis = JSON.parse(responseText);    let analysis;

    } catch (parseError) {    try {

      // Se falhar, criar estrutura básica      analysis = JSON.parse(responseText);

      analysis = {    } catch (parseError) {

        summary: responseText.substring(0, 200),      // Se falhar, criar estrutura básica

        strengths: ['Progresso em análise'],      analysis = {

        improvements: ['Aguarde análise detalhada'],        summary: responseText.substring(0, 200),

        recommendations: [{        strengths: ['Progresso em análise'],

          title: 'Análise em Processamento',        improvements: ['Aguarde análise detalhada'],

          description: responseText,        recommendations: [{

          priority: 'medium'          title: 'Análise em Processamento',

        }],          description: responseText,

        nutritionTips: ['Mantenha uma alimentação equilibrada'],          priority: 'medium'

        motivationalMessage: 'Continue firme no seu objetivo!'        }],

      };        nutritionTips: ['Mantenha uma alimentação equilibrada'],

    }        motivationalMessage: 'Continue firme no seu objetivo!'

          };

    return analysis;    }

        

  } catch (error) {    return analysis;

    console.error('Erro ao analisar progresso:', error);    

      } catch (error) {

    if (error.response) {    console.error('Erro ao analisar progresso:', error);

      const status = error.response.status;    

      if (status === 429) {    if (error.response) {

        throw new Error('Erro 429: Limite de requisições excedido. Aguarde alguns segundos e tente novamente.');      const status = error.response.status;

      } else if (status === 401) {      if (status === 429) {

        throw new Error('Erro 401: API Key inválida ou expirada. Verifique sua chave.');        throw new Error('Erro 429: Limite de requisições excedido. Aguarde alguns segundos e tente novamente.');

      } else if (status === 400) {      } else if (status === 401) {

        throw new Error('Erro 400: Requisição inválida. Verifique os dados enviados.');        throw new Error('Erro 401: API Key inválida ou expirada. Verifique sua chave.');

      }      } else if (status === 400) {

    }        throw new Error('Erro 400: Requisição inválida. Verifique os dados enviados.');

          }

    throw new Error(`Não foi possível gerar análise. ${error.message || 'Verifique sua API Key e conexão.'}`);    }

  }    

};    throw new Error(`Não foi possível gerar análise. ${error.message || 'Verifique sua API Key e conexão.'}`);

  }

export const generateWorkoutPlan = async (userData, goal, focusArea, duration, level) => {};

  try {

    const prompt = `export const generateWorkoutPlan = async (userData, goal, focusArea, duration, level) => {

Crie um plano de treino personalizado com os seguintes parâmetros:  try {

    

**USUÁRIO:**    const prompt = `

- Idade: ${userData.age} anosCrie um plano de treino personalizado com os seguintes parâmetros:

- Sexo: ${userData.gender}

- Objetivo: ${goal}**PERFIL:**

- Idade: ${userData.age} anos

**ESPECIFICAÇÕES:**- Sexo: ${userData.gender}

- Foco: ${focusArea}- Nível: ${level}

- Duração por sessão: ${duration} minutos- Objetivo: ${goal}

- Nível: ${level}- Foco: ${focusArea}

- Duração desejada: ${duration} minutos

Crie um plano de treino detalhado em formato JSON:

{Gere um treino completo em formato JSON:

  "name": "Nome do Plano",{

  "description": "Descrição breve do plano",  "workoutName": "Nome do treino",

  "exercises": [  "description": "Descrição breve",

    {  "warmup": "Aquecimento sugerido (5-10 min)",

      "name": "Nome do exercício",  "exercises": [

      "sets": número,    {

      "reps": "repetições ou tempo",      "name": "Nome do exercício",

      "rest": "tempo de descanso",      "muscleGroup": "Grupo muscular",

      "notes": "observações importantes"      "sets": 3,

    }      "reps": "10-12",

  ],      "rest": 60,

  "warmup": "Descrição do aquecimento",      "notes": "Dicas de execução"

  "cooldown": "Descrição do alongamento final"    }

}  ],

`;  "cooldown": "Alongamento/relaxamento (5 min)",

  "tips": ["dica 1", "dica 2"]

    const response = await callAI(prompt, 0.8, 1200);}

    `;

    try {

      return JSON.parse(response);    const response = await callAI(prompt, 0.8, 1200);

    } catch {    

      return {    try {

        workoutPlan: {      return JSON.parse(response);

          name: 'Plano Personalizado',    } catch {

          description: response,      return {

          exercises: []        workoutPlan: {

        }          name: 'Plano Personalizado',

      };          description: response,

    }          exercises: []

            }

  } catch (error) {      };

    console.error('Erro ao gerar plano de treino:', error);    }

        

    if (error.response) {  } catch (error) {

      const status = error.response.status;    console.error('Erro ao gerar plano de treino:', error);

      if (status === 429) {    

        throw new Error('Erro 429: Limite de requisições excedido.');    if (error.response) {

      } else if (status === 401) {      const status = error.response.status;

        throw new Error('Erro 401: API Key inválida.');      if (status === 429) {

      }        throw new Error('Erro 429: Limite de requisições excedido.');

    }      } else if (status === 401) {

            throw new Error('Erro 401: API Key inválida.');

    throw new Error(`Não foi possível gerar o plano de treino. ${error.message || ''}`);      }

  }    }

};    

    throw new Error(`Não foi possível gerar o plano de treino. ${error.message || ''}`);

export const getMealSuggestions = async (userData, goal, dietType = 'balanced') => {  }

  try {};

    const prompt = `

Sugira um plano alimentar para:export const getMealSuggestions = async (userData, goal, dietType = 'balanced') => {

  try {

**PERFIL:**    

- Idade: ${userData.age} anos    const prompt = `

- Peso: ${userData.weight} kgSugira um plano alimentar para:

- Altura: ${userData.height} cm

- Objetivo: ${goal}**PERFIL:**

- Tipo de dieta: ${dietType}- Idade: ${userData.age} anos

- Peso: ${userData.weight} kg

Crie sugestões de refeições em formato JSON:- Altura: ${userData.height} cm

{- Objetivo: ${goal}

  "dailyCalories": valor_estimado,- Tipo de dieta: ${dietType}

  "macros": {

    "protein": "percentual",Forneça sugestões em JSON:

    "carbs": "percentual",{

    "fats": "percentual"  "dailyCalories": 2000,

  },  "macros": {

  "meals": [    "protein": "25%",

    {    "carbs": "50%",

      "name": "Café da Manhã",    "fats": "25%"

      "foods": ["alimento 1", "alimento 2"],  },

      "calories": valor  "meals": [

    }    {

  ],      "meal": "Café da manhã",

  "tips": ["dica 1", "dica 2"]      "suggestions": ["opção 1", "opção 2"],

}      "timing": "7h-8h"

`;    }

  ],

    const response = await callAI(prompt, 0.7, 1000);  "hydration": "Recomendação de água",

      "supplements": ["suplemento 1", "suplemento 2"],

    try {  "tips": ["dica 1", "dica 2"]

      return JSON.parse(response);}

    } catch {`;

      return {

        mealPlan: {    const response = await callAI(prompt, 0.7, 1000);

          breakfast: response.substring(0, 200),    

          meals: []    try {

        }      return JSON.parse(response);

      };    } catch {

    }      return {

            mealPlan: {

  } catch (error) {          breakfast: response.substring(0, 200),

    console.error('Erro ao gerar sugestões alimentares:', error);          meals: []

            }

    if (error.response?.status === 429) {      };

      throw new Error('Erro 429: Limite de requisições excedido.');    }

    } else if (error.response?.status === 401) {    

      throw new Error('Erro 401: API Key inválida.');  } catch (error) {

    }    console.error('Erro ao gerar sugestões alimentares:', error);

        

    throw new Error(`Não foi possível gerar sugestões alimentares. ${error.message || ''}`);    if (error.response?.status === 429) {

  }      throw new Error('Erro 429: Limite de requisições excedido.');

};    } else if (error.response?.status === 401) {

      throw new Error('Erro 401: API Key inválida.');

export const answerQuestion = async (question, chatHistory = []) => {    }

  try {    

    const prompt = `Você é um assistente fitness especializado. Responda perguntas sobre treino, nutrição e saúde de forma clara e profissional.    throw new Error(`Não foi possível gerar sugestões alimentares. ${error.message || ''}`);

  }

Pergunta: ${question}`;};



    const response = await callAI(prompt, 0.8, 500);export const answerQuestion = async (question, chatHistory = []) => {

    return response;  try {

      try {

  } catch (error) {    const apiKey = getOpenAIClient();

    console.error('Erro ao responder pergunta:', error);    

        const systemPrompt = `Você é um assistente fitness especializado. Responda perguntas sobre treino, nutrição e saúde de forma clara e profissional.

    if (error.response) {    

      const status = error.response.status;Contexto do usuário:

      if (status === 429) {- Nome: ${userData.name}

        throw new Error('Erro 429: Você excedeu o limite de requisições. Aguarde 20 segundos e tente novamente.');- Idade: ${userData.age} anos

      } else if (status === 401) {- Objetivo: ${userData.goal}

        throw new Error('Erro 401: API Key inválida ou expirada. Atualize sua chave nas Configurações.');

      } else if (status === 400) {${context}`;

        throw new Error('Erro 400: Requisição inválida. Tente reformular sua pergunta.');

      }    const response = await axios.post(

    }      'https://api.openai.com/v1/chat/completions',

          {

    throw new Error(`Não foi possível processar sua pergunta. ${error.message || 'Verifique sua conexão.'}`);        model: 'gpt-4o-mini',

  }        messages: [

};          {

            role: 'system',

export const getAIRecommendation = async (userData) => {            content: systemPrompt

  try {          },

    const prompt = `          {

Com base neste perfil:            role: 'user',

- Nome: ${userData.name}            content: question

- Idade: ${userData.age} anos          }

- Objetivo: ${userData.goal}        ],

        temperature: 0.8,

Forneça uma recomendação motivacional curta e personalizada (máximo 2 frases).        max_tokens: 500

`;      },

      {

    const response = await callAI(prompt, 0.7, 150);        headers: {

    return response;          'Authorization': `Bearer ${apiKey}`,

              'Content-Type': 'application/json'

  } catch (error) {        }

    console.error('Erro ao obter recomendação:', error);      }

    return 'Continue firme no seu objetivo! Você está no caminho certo! 💪';    );

  }

};    return response.data.choices[0].message.content;

    
  } catch (error) {
    console.error('Erro ao responder pergunta:', error);
    
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        throw new Error('Erro 429: Você excedeu o limite de requisições. Aguarde 20 segundos e tente novamente.');
      } else if (status === 401) {
        throw new Error('Erro 401: API Key inválida ou expirada. Atualize sua chave nas Configurações.');
      } else if (status === 400) {
        throw new Error('Erro 400: Requisição inválida. Tente reformular sua pergunta.');
      }
    }
    
    throw new Error(`Não foi possível processar sua pergunta. ${error.message || 'Verifique sua conexão.'}`);
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
