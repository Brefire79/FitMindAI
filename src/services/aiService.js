import axios from 'axios';import axios from 'axios';import axios from 'axios';



let OPENAI_API_KEY = null;

let GEMINI_API_KEY = null;

let AI_PROVIDER = 'openai'; // 'openai' ou 'gemini'let OPENAI_API_KEY = null;let OPENAI_API_KEY = null;



export const initializeAI = (config) => {let GEMINI_API_KEY = null;let GEMINI_API_KEY = null;

  if (config.provider === 'openai') {

    if (!config.apiKey) {let AI_PROVIDER = 'openai'; // 'openai' ou 'gemini'let AI_PROVIDER = 'openai'; // 'openai' ou 'gemini'

      throw new Error('API Key da OpenAI não configurada');

    }

    OPENAI_API_KEY = config.apiKey;

    AI_PROVIDER = 'openai';export const initializeAI = (config) => {export const initializeAI = (config) => {

  } else if (config.provider === 'gemini') {

    if (!config.apiKey) {  if (config.provider === 'openai') {  if (config.provider === 'openai') {

      throw new Error('API Key do Gemini não configurada');

    }    if (!config.apiKey) {    if (!config.apiKey) {

    GEMINI_API_KEY = config.apiKey;

    AI_PROVIDER = 'gemini';      throw new Error('API Key da OpenAI não configurada');      throw new Error('API Key da OpenAI não configurada');

  }

  return true;    }    }

};

    OPENAI_API_KEY = config.apiKey;    OPENAI_API_KEY = config.apiKey;

// Manter compatibilidade com código antigo

export const initializeOpenAI = (apiKey) => {    AI_PROVIDER = 'openai';    AI_PROVIDER = 'openai';

  return initializeAI({ provider: 'openai', apiKey });

};  } else if (config.provider === 'gemini') {  } else if (config.provider === 'gemini') {



export const getAIClient = () => {    if (!config.apiKey) {    if (!config.apiKey) {

  if (AI_PROVIDER === 'openai') {

    if (!OPENAI_API_KEY) {      throw new Error('API Key do Gemini não configurada');      throw new Error('API Key do Gemini não configurada');

      throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');

    }    }    }

    return { provider: 'openai', apiKey: OPENAI_API_KEY };

  } else if (AI_PROVIDER === 'gemini') {    GEMINI_API_KEY = config.apiKey;    GEMINI_API_KEY = config.apiKey;

    if (!GEMINI_API_KEY) {

      throw new Error('Gemini não foi inicializado. Configure sua API Key nas configurações.');    AI_PROVIDER = 'gemini';    AI_PROVIDER = 'gemini';

    }

    return { provider: 'gemini', apiKey: GEMINI_API_KEY };  }  }

  }

  throw new Error('Nenhum provedor de IA configurado');  return true;  return true;

};

};};

// Manter compatibilidade com código antigo

export const getOpenAIClient = () => {

  const client = getAIClient();

  return client.apiKey;// Manter compatibilidade com código antigo// Manter compatibilidade com código antigo

};

export const initializeOpenAI = (apiKey) => {export const initializeOpenAI = (apiKey) => {

// Chamada para OpenAI

const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {  return initializeAI({ provider: 'openai', apiKey });  return initializeAI({ provider: 'openai', apiKey });

  const response = await axios.post(

    'https://api.openai.com/v1/chat/completions',};};

    {

      model: 'gpt-4o-mini',

      messages: [{ role: 'user', content: prompt }],

      temperature,export const getAIClient = () => {export const getAIClient = () => {

      max_tokens: maxTokens,

    },  if (AI_PROVIDER === 'openai') {  if (AI_PROVIDER === 'openai') {

    {

      headers: {    if (!OPENAI_API_KEY) {    if (!OPENAI_API_KEY) {

        'Authorization': `Bearer ${apiKey}`,

        'Content-Type': 'application/json',      throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');      throw new Error('OpenAI não foi inicializada. Configure sua API Key nas configurações.');

      },

    }    }    }

  );

  return response.data.choices[0].message.content;    return { provider: 'openai', apiKey: OPENAI_API_KEY };    return { provider: 'openai', apiKey: OPENAI_API_KEY };

};

  } else if (AI_PROVIDER === 'gemini') {  } else if (AI_PROVIDER === 'gemini') {

// Chamada para Gemini

const callGemini = async (prompt, apiKey, temperature, maxTokens) => {    if (!GEMINI_API_KEY) {    if (!GEMINI_API_KEY) {

  const response = await axios.post(

    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,      throw new Error('Gemini não foi inicializado. Configure sua API Key nas configurações.');      throw new Error('Gemini não foi inicializado. Configure sua API Key nas configurações.');

    {

      contents: [{    }    }

        parts: [{ text: prompt }]

      }],    return { provider: 'gemini', apiKey: GEMINI_API_KEY };    return { provider: 'gemini', apiKey: GEMINI_API_KEY };

      generationConfig: {

        temperature,  }  }

        maxOutputTokens: maxTokens,

      }  throw new Error('Nenhum provedor de IA configurado');  throw new Error('Nenhum provedor de IA configurado');

    },

    {};};

      headers: {

        'Content-Type': 'application/json',

      },

    }// Manter compatibilidade com código antigo// Manter compatibilidade com código antigo

  );

  return response.data.candidates[0].content.parts[0].text;export const getOpenAIClient = () => {export const getOpenAIClient = () => {

};

  const client = getAIClient();  const client = getAIClient();

// Função auxiliar para fazer chamadas de IA

const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {  return client.apiKey;  return client.apiKey;

  const client = getAIClient();

  };};

  if (client.provider === 'openai') {

    return await callOpenAI(prompt, client.apiKey, temperature, maxTokens);

  } else if (client.provider === 'gemini') {

    return await callGemini(prompt, client.apiKey, temperature, maxTokens);// Chamada para OpenAI// Função auxiliar para fazer chamadas de IA

  }

};const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {



export const analyzeUserProgress = async (userData, measurements, workouts) => {  const response = await axios.post(  const client = getAIClient();

  try {

    const client = getAIClient();    'https://api.openai.com/v1/chat/completions',  

    

    // Validação específica para OpenAI    {  if (client.provider === 'openai') {

    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-'))) {

      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');      model: 'gpt-4o-mini',    return await callOpenAI(prompt, client.apiKey, temperature, maxTokens);

    }

          messages: [{ role: 'user', content: prompt }],  } else if (client.provider === 'gemini') {

    // Preparar dados para análise

    const latestMeasurements = measurements.slice(0, 5);      temperature,    return await callGemini(prompt, client.apiKey, temperature, maxTokens);

    const recentWorkouts = workouts.slice(0, 10);

          max_tokens: maxTokens,  }

    const prompt = `

Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:    },};



**DADOS DO USUÁRIO:**    {

- Nome: ${userData.name}

- Idade: ${userData.age} anos      headers: {// Chamada para OpenAI

- Sexo: ${userData.gender}

- Altura: ${userData.height} cm        'Authorization': `Bearer ${apiKey}`,const callOpenAI = async (prompt, apiKey, temperature, maxTokens) => {

- Objetivo: ${userData.goal}

        'Content-Type': 'application/json',  const response = await axios.post(

**MEDIÇÕES RECENTES:**

${latestMeasurements.map((m, i) => `      },    'https://api.openai.com/v1/chat/completions',

Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):

- Peso: ${m.weight} kg    }    {

- IMC: ${m.imc}

- Gordura Corporal: ${m.bodyFat || 'N/A'}%  );      model: 'gpt-4o-mini',

- Massa Magra: ${m.leanMass || 'N/A'} kg

`).join('\n')}  return response.data.choices[0].message.content;      messages: [{ role: 'user', content: prompt }],



**TREINOS RECENTES:**};      temperature,

${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `

Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):      max_tokens: maxTokens,

- Tipo: ${w.type}

- Duração: ${w.duration} minutos// Chamada para Gemini    },

- Intensidade: ${w.intensity}

`).join('\n') : 'Nenhum treino registrado ainda.'}const callGemini = async (prompt, apiKey, temperature, maxTokens) => {    {



**ANÁLISE SOLICITADA:**  const response = await axios.post(      headers: {

1. Avalie o progresso atual do usuário em relação ao objetivo

2. Identifique pontos fortes e áreas que precisam melhorar    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,        'Authorization': `Bearer ${apiKey}`,

3. Forneça 3-5 recomendações específicas para os próximos treinos

4. Sugira ajustes na frequência, intensidade ou tipo de exercício    {        'Content-Type': 'application/json',

5. Dê dicas de nutrição e recuperação

      contents: [{      },

Responda em formato JSON com a seguinte estrutura:

{        parts: [{ text: prompt }]    }

  "summary": "Resumo geral do progresso (2-3 frases)",

  "strengths": ["ponto forte 1", "ponto forte 2"],      }],  );

  "improvements": ["área a melhorar 1", "área a melhorar 2"],

  "recommendations": [      generationConfig: {  return response.data.choices[0].message.content;

    {

      "title": "Título da recomendação",        temperature,};

      "description": "Descrição detalhada",

      "priority": "high|medium|low"        maxOutputTokens: maxTokens,

    }

  ],      }// Chamada para Gemini

  "nutritionTips": ["dica 1", "dica 2"],

  "motivationalMessage": "Mensagem motivacional personalizada"    },const callGemini = async (prompt, apiKey, temperature, maxTokens) => {

}

`;    {  const response = await axios.post(



    const responseText = await callAI(prompt, 0.7, 1500);      headers: {    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,

    

    // Tentar parsear como JSON        'Content-Type': 'application/json',    {

    let analysis;

    try {      },      contents: [{

      analysis = JSON.parse(responseText);

    } catch (parseError) {    }        parts: [{ text: prompt }]

      // Se falhar, criar estrutura básica

      analysis = {  );      }],

        summary: responseText.substring(0, 200),

        strengths: ['Progresso em análise'],  return response.data.candidates[0].content.parts[0].text;      generationConfig: {

        improvements: ['Aguarde análise detalhada'],

        recommendations: [{};        temperature,

          title: 'Análise em Processamento',

          description: responseText,        maxOutputTokens: maxTokens,

          priority: 'medium'

        }],// Função auxiliar para fazer chamadas de IA      }

        nutritionTips: ['Mantenha uma alimentação equilibrada'],

        motivationalMessage: 'Continue firme no seu objetivo!'const callAI = async (prompt, temperature = 0.7, maxTokens = 1000) => {    },

      };

    }  const client = getAIClient();    {

    

    return analysis;        headers: {

    

  } catch (error) {  if (client.provider === 'openai') {        'Content-Type': 'application/json',

    console.error('Erro ao analisar progresso:', error);

        return await callOpenAI(prompt, client.apiKey, temperature, maxTokens);      },

    if (error.response) {

      const status = error.response.status;  } else if (client.provider === 'gemini') {    }

      if (status === 429) {

        throw new Error('Erro 429: Limite de requisições excedido. Aguarde alguns segundos e tente novamente.');    return await callGemini(prompt, client.apiKey, temperature, maxTokens);  );

      } else if (status === 401) {

        throw new Error('Erro 401: API Key inválida ou expirada. Verifique sua chave.');  }  return response.data.candidates[0].content.parts[0].text;

      } else if (status === 400) {

        throw new Error('Erro 400: Requisição inválida. Verifique os dados enviados.');};};

      }

    }

    

    throw new Error(`Não foi possível gerar análise. ${error.message || 'Verifique sua API Key e conexão.'}`);export const analyzeUserProgress = async (userData, measurements, workouts) => {export const analyzeUserProgress = async (userData, measurements, workouts) => {

  }

};  try {  try {



export const generateWorkoutPlan = async (userData, goal, focusArea, duration, level) => {    const client = getAIClient();    const client = getAIClient();

  try {

    const prompt = `        

Crie um plano de treino personalizado com os seguintes parâmetros:

    // Validação específica para OpenAI    // Validação específica para OpenAI

**USUÁRIO:**

- Idade: ${userData.age} anos    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-'))) {    if (client.provider === 'openai' && (!client.apiKey || !client.apiKey.startsWith('sk-'))) {

- Sexo: ${userData.gender}

- Objetivo: ${goal}      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');      throw new Error('API Key da OpenAI inválida. A chave deve começar com "sk-"');



**ESPECIFICAÇÕES:**    }    }

- Foco: ${focusArea}

- Duração por sessão: ${duration} minutos        

- Nível: ${level}

    // Preparar dados para análise    // Preparar dados para análise

Crie um plano de treino detalhado em formato JSON:

{    const latestMeasurements = measurements.slice(0, 5);    const latestMeasurements = measurements.slice(0, 5);

  "name": "Nome do Plano",

  "description": "Descrição breve do plano",    const recentWorkouts = workouts.slice(0, 10);    const recentWorkouts = workouts.slice(0, 10);

  "exercises": [

    {        

      "name": "Nome do exercício",

      "sets": número,    const prompt = `    const prompt = `

      "reps": "repetições ou tempo",

      "rest": "tempo de descanso",Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:Você é um personal trainer especializado e nutricionista esportivo. Analise os dados do usuário e forneça recomendações personalizadas:

      "notes": "observações importantes"

    }

  ],

  "warmup": "Descrição do aquecimento",**DADOS DO USUÁRIO:****DADOS DO USUÁRIO:**

  "cooldown": "Descrição do alongamento final"

}- Nome: ${userData.name}- Nome: ${userData.name}

`;

- Idade: ${userData.age} anos- Idade: ${userData.age} anos

    const response = await callAI(prompt, 0.8, 1200);

    - Sexo: ${userData.gender}- Sexo: ${userData.gender}

    try {

      return JSON.parse(response);- Altura: ${userData.height} cm- Altura: ${userData.height} cm

    } catch {

      return {- Objetivo: ${userData.goal}- Objetivo: ${userData.goal}

        workoutPlan: {

          name: 'Plano Personalizado',

          description: response,

          exercises: []**MEDIÇÕES RECENTES:****MEDIÇÕES RECENTES:**

        }

      };${latestMeasurements.map((m, i) => `${latestMeasurements.map((m, i) => `

    }

    Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):Medição ${i + 1} (${new Date(m.date).toLocaleDateString('pt-BR')}):

  } catch (error) {

    console.error('Erro ao gerar plano de treino:', error);- Peso: ${m.weight} kg- Peso: ${m.weight} kg

    

    if (error.response) {- IMC: ${m.imc}- IMC: ${m.imc}

      const status = error.response.status;

      if (status === 429) {- Gordura Corporal: ${m.bodyFat || 'N/A'}%- Gordura Corporal: ${m.bodyFat || 'N/A'}%

        throw new Error('Erro 429: Limite de requisições excedido.');

      } else if (status === 401) {- Massa Magra: ${m.leanMass || 'N/A'} kg- Massa Magra: ${m.leanMass || 'N/A'} kg

        throw new Error('Erro 401: API Key inválida.');

      }`).join('\n')}`).join('\n')}

    }

    

    throw new Error(`Não foi possível gerar o plano de treino. ${error.message || ''}`);

  }**TREINOS RECENTES:****TREINOS RECENTES:**

};

${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `${recentWorkouts.length > 0 ? recentWorkouts.map((w, i) => `

export const getMealSuggestions = async (userData, goal, dietType = 'balanced') => {

  try {Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):Treino ${i + 1} (${new Date(w.date).toLocaleDateString('pt-BR')}):

    const prompt = `

Sugira um plano alimentar para:- Tipo: ${w.type}- Tipo: ${w.type}



**PERFIL:**- Duração: ${w.duration} minutos- Grupo Muscular: ${w.muscleGroup}

- Idade: ${userData.age} anos

- Peso: ${userData.weight} kg- Intensidade: ${w.intensity}- Duração: ${w.duration} min

- Altura: ${userData.height} cm

- Objetivo: ${goal}`).join('\n') : 'Nenhum treino registrado ainda.'}- Intensidade: ${w.intensity}

- Tipo de dieta: ${dietType}

`).join('\n') : 'Nenhum treino registrado ainda.'}

Crie sugestões de refeições em formato JSON:

{**ANÁLISE SOLICITADA:**

  "dailyCalories": valor_estimado,

  "macros": {1. Avalie o progresso atual do usuário em relação ao objetivo**ANÁLISE SOLICITADA:**

    "protein": "percentual",

    "carbs": "percentual",2. Identifique pontos fortes e áreas que precisam melhorar1. Avalie o progresso atual do usuário em relação ao objetivo

    "fats": "percentual"

  },3. Forneça 3-5 recomendações específicas para os próximos treinos2. Identifique pontos fortes e áreas que precisam melhorar

  "meals": [

    {4. Sugira ajustes na frequência, intensidade ou tipo de exercício3. Forneça 3-5 recomendações específicas para os próximos treinos

      "name": "Café da Manhã",

      "foods": ["alimento 1", "alimento 2"],5. Dê dicas de nutrição e recuperação4. Sugira ajustes na frequência, intensidade ou tipo de exercício

      "calories": valor

    }5. Dê dicas de nutrição e recuperação

  ],

  "tips": ["dica 1", "dica 2"]Responda em formato JSON com a seguinte estrutura:

}

`;{Responda em formato JSON com a seguinte estrutura:



    const response = await callAI(prompt, 0.7, 1000);  "summary": "Resumo geral do progresso (2-3 frases)",{

    

    try {  "strengths": ["ponto forte 1", "ponto forte 2"],  "summary": "Resumo geral do progresso (2-3 frases)",

      return JSON.parse(response);

    } catch {  "improvements": ["área a melhorar 1", "área a melhorar 2"],  "strengths": ["ponto forte 1", "ponto forte 2"],

      return {

        mealPlan: {  "recommendations": [  "improvements": ["área a melhorar 1", "área a melhorar 2"],

          breakfast: response.substring(0, 200),

          meals: []    {  "recommendations": [

        }

      };      "title": "Título da recomendação",    {

    }

          "description": "Descrição detalhada",      "title": "Título da recomendação",

  } catch (error) {

    console.error('Erro ao gerar sugestões alimentares:', error);      "priority": "high|medium|low"      "description": "Descrição detalhada",

    

    if (error.response?.status === 429) {    }      "priority": "high|medium|low"

      throw new Error('Erro 429: Limite de requisições excedido.');

    } else if (error.response?.status === 401) {  ],    }

      throw new Error('Erro 401: API Key inválida.');

    }  "nutritionTips": ["dica 1", "dica 2"],  ],

    

    throw new Error(`Não foi possível gerar sugestões alimentares. ${error.message || ''}`);  "motivationalMessage": "Mensagem motivacional personalizada"  "nutritionTips": ["dica 1", "dica 2"],

  }

};}  "motivationalMessage": "Mensagem motivacional personalizada"



export const answerQuestion = async (question, chatHistory = []) => {`;}

  try {

    const prompt = `Você é um assistente fitness especializado. Responda perguntas sobre treino, nutrição e saúde de forma clara e profissional.`;



Pergunta: ${question}`;    const responseText = await callAI(prompt, 0.7, 1500);



    const response = await callAI(prompt, 0.8, 500);        // Fazer a chamada usando a função genérica

    return response;

        // Tentar parsear como JSON    const responseText = await callAI(prompt, 0.7, 1500);

  } catch (error) {

    console.error('Erro ao responder pergunta:', error);    let analysis;    

    

    if (error.response) {    try {    // Tentar parsear como JSON

      const status = error.response.status;

      if (status === 429) {      analysis = JSON.parse(responseText);    let analysis;

        throw new Error('Erro 429: Você excedeu o limite de requisições. Aguarde 20 segundos e tente novamente.');

      } else if (status === 401) {    } catch (parseError) {    try {

        throw new Error('Erro 401: API Key inválida ou expirada. Atualize sua chave nas Configurações.');

      } else if (status === 400) {      // Se falhar, criar estrutura básica      analysis = JSON.parse(responseText);

        throw new Error('Erro 400: Requisição inválida. Tente reformular sua pergunta.');

      }      analysis = {    } catch (parseError) {

    }

            summary: responseText.substring(0, 200),      // Se falhar, criar estrutura básica

    throw new Error(`Não foi possível processar sua pergunta. ${error.message || 'Verifique sua conexão.'}`);

  }        strengths: ['Progresso em análise'],      analysis = {

};

        improvements: ['Aguarde análise detalhada'],        summary: responseText.substring(0, 200),

export const getAIRecommendation = async (userData) => {

  try {        recommendations: [{        strengths: ['Progresso em análise'],

    const prompt = `

Com base neste perfil:          title: 'Análise em Processamento',        improvements: ['Aguarde análise detalhada'],

- Nome: ${userData.name}

- Idade: ${userData.age} anos          description: responseText,        recommendations: [{

- Objetivo: ${userData.goal}

          priority: 'medium'          title: 'Análise em Processamento',

Forneça uma recomendação motivacional curta e personalizada (máximo 2 frases).

`;        }],          description: responseText,



    const response = await callAI(prompt, 0.7, 150);        nutritionTips: ['Mantenha uma alimentação equilibrada'],          priority: 'medium'

    return response;

            motivationalMessage: 'Continue firme no seu objetivo!'        }],

  } catch (error) {

    console.error('Erro ao obter recomendação:', error);      };        nutritionTips: ['Mantenha uma alimentação equilibrada'],

    return 'Continue firme no seu objetivo! Você está no caminho certo! 💪';

  }    }        motivationalMessage: 'Continue firme no seu objetivo!'

};

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
