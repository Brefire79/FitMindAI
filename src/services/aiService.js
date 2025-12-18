// Chatbot offline baseado em regras e cálculos locais

// Utilidades de cálculo
const toNumber = (x, def = 0) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : def;
};

const cmToM = (cm) => toNumber(cm) / 100;

const calcBMI = (weightKg, heightCm) => {
  const h = cmToM(heightCm);
  if (!h) return null;
  return +(toNumber(weightKg) / (h * h)).toFixed(2);
};

const calcBMR = (gender, weightKg, heightCm, age) => {
  const w = toNumber(weightKg);
  const h = toNumber(heightCm);
  const a = toNumber(age);
  // Mifflin St Jeor
  const base = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161);
  return Math.round(base);
};

const activityFactor = (level = 'moderate') => ({
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  athlete: 1.9
}[level] || 1.55);

const calcTDEE = (gender, weightKg, heightCm, age, activity = 'moderate') => {
  const bmr = calcBMR(gender, weightKg, heightCm, age);
  return Math.round(bmr * activityFactor(activity));
};

const trend = (arr) => {
  // Retorna variação simples entre último e primeiro
  if (!arr || arr.length < 2) return 0;
  const first = toNumber(arr[0]);
  const last = toNumber(arr[arr.length - 1]);
  return +(last - first).toFixed(2);
};

const last = (list) => list && list.length ? list[list.length - 1] : null;

// Normalizador de dados
const normalizeMeasurements = (measurements = []) => {
  const sorted = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map(m => ({
    date: m.date,
    weight: toNumber(m.weight),
    imc: m.imc != null ? toNumber(m.imc) : null,
    bodyFat: m.bodyFat != null ? toNumber(m.bodyFat) : null,
    leanMass: m.leanMass != null ? toNumber(m.leanMass) : null
  }));
};

const normalizeWorkouts = (workouts = []) => {
  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map(w => ({
    date: w.date,
    type: w.type || w.muscleGroup || 'Geral',
    duration: toNumber(w.duration, 0),
    intensity: w.intensity || 'moderate',
    name: w.name || 'Treino'
  }));
};

// Análise offline completa
export const analyzeUserProgress = async (userData, measurements = [], workouts = []) => {
  const ms = normalizeMeasurements(measurements).slice(-8);
  const ws = normalizeWorkouts(workouts).slice(-20);

  const latest = last(ms);
  const weightSeries = ms.map(m => m.weight).filter(Boolean);
  const imcSeries = ms.map(m => m.imc).filter(Boolean);

  const weightTrend = trend(weightSeries);
  const imcTrend = trend(imcSeries);

  const bmi = latest?.imc ?? calcBMI(latest?.weight ?? userData?.weight, userData?.height);
  const bmr = calcBMR(userData?.gender, latest?.weight ?? userData?.weight, userData?.height, userData?.age);
  const tdee = calcTDEE(userData?.gender, latest?.weight ?? userData?.weight, userData?.height, userData?.age, 'moderate');

  const sessionsWeek = ws.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  const strengths = [];
  const improvements = [];

  if (sessionsWeek >= 3) strengths.push('Frequência de treinos consistente na última semana');
  else improvements.push('Aumente para 3-4 sessões por semana para melhor evolução');

  if (weightTrend < -0.5) strengths.push('Tendência de perda de peso observada nas últimas medições');
  if (weightTrend > 0.5) improvements.push('Peso subiu recentemente; ajuste calorias e sono');

  if (bmi && bmi >= 18.5 && bmi <= 24.9) strengths.push('IMC dentro da faixa saudável');
  if (bmi && (bmi < 18.5 || bmi > 24.9)) improvements.push('IMC fora da faixa ideal; reavalie dieta e treinos');

  const recommendations = [
    {
      title: 'Planejamento semanal de treinos',
      description: 'Combine 2-3 sessões de força com 2 sessões de cardio. Foque em movimentos compostos e progressão de carga.',
      priority: sessionsWeek < 3 ? 'high' : 'medium'
    },
    {
      title: 'Meta calórica diária',
      description: `Base TDEE ~ ${tdee} kcal. Ajuste em ±300 kcal conforme objetivo (${userData?.goal || 'manutenção'}).`,
      priority: 'medium'
    },
    {
      title: 'Sono e recuperação',
      description: 'Garanta 7-9h de sono, hidratação adequada e alongamentos pós-treino.',
      priority: 'low'
    }
  ];

  const nutritionTips = [
    'Priorize proteína 1.6–2.2 g/kg/dia',
    'Controle carboidratos conforme volume de treino',
    'Inclua frutas, vegetais e fibras diariamente',
    'Distribua refeições ao longo do dia com 20–40 g de proteína por refeição'
  ];

  const summary = `Com base nas últimas ${ms.length} medições e ${ws.length} treinos: ` +
    (weightTrend < 0 ? `queda de peso de ${Math.abs(weightTrend)} kg, ` : weightTrend > 0 ? `aumento de ${weightTrend} kg, ` : 'peso estável, ') +
    (imcTrend !== 0 ? `variação de IMC ${imcTrend.toFixed(2)}. ` : '') +
    `IMC atual ~ ${bmi ?? 'n/d'}, TDEE estimado ~ ${tdee} kcal.`;

  const motivationalMessage = 'Você está no controle! Ajuste pequenas rotinas e avance um passo por dia. 💪';

  return { summary, strengths, improvements, recommendations, nutritionTips, motivationalMessage };
};

// Plano de treino offline
export const generateWorkoutPlan = async (userData, goal = 'hipertrofia', focusArea = 'full-body', duration = 45, level = 'intermediate') => {
  const templates = {
    emagrecimento: {
      name: 'Corte Inteligente',
      description: 'Mix de cardio intervalado e força com altas repetições',
      warmup: '5-10 min cardio leve + mobilidade',
      cooldown: 'Alongamento total 5 min',
      exercises: [
        { name: 'Agachamento', sets: 4, reps: '12-15', rest: '60-90s', notes: 'Carga moderada' },
        { name: 'Supino reto', sets: 4, reps: '12-15', rest: '60-90s', notes: 'Controle de ritmo' },
        { name: 'Remada curvada', sets: 4, reps: '12-15', rest: '60-90s', notes: 'Postura neutra' },
        { name: 'HIIT bicicleta', sets: 8, reps: '30s ON/30s OFF', rest: '-', notes: 'Zona alta de esforço' }
      ]
    },
    hipertrofia: {
      name: 'Força e Volume',
      description: 'Movimentos compostos com progressão gradual',
      warmup: 'Mobilidade + séries leves',
      cooldown: 'Alongamento dos grupos trabalhados',
      exercises: [
        { name: 'Agachamento livre', sets: 5, reps: '5-8', rest: '120s', notes: 'Progressão de carga' },
        { name: 'Supino reto', sets: 5, reps: '6-10', rest: '120s', notes: 'Pausa controlada' },
        { name: 'Levantamento terra', sets: 4, reps: '4-6', rest: '150s', notes: 'Técnica impecável' },
        { name: 'Remada', sets: 4, reps: '8-12', rest: '90s', notes: 'Amplitude total' }
      ]
    },
    resistencia: {
      name: 'Endurance Total',
      description: 'Volume moderado e cardio contínuo',
      warmup: 'Cardio leve + mobilidade',
      cooldown: 'Respiração e alongamento',
      exercises: [
        { name: 'Circuito funcional', sets: 3, reps: '15', rest: '60s', notes: 'Baixo descanso' },
        { name: 'Corrida contínua', sets: 1, reps: `${duration} min`, rest: '-', notes: 'Zona 2–3' },
        { name: 'Prancha', sets: 4, reps: '45s', rest: '45s', notes: 'Core sólido' }
      ]
    }
  };

  const plan = templates[goal] || templates.hipertrofia;
  return { ...plan, level, focusArea, sessionDuration: duration };
};

// Sugestões de alimentação offline
export const getMealSuggestions = async (userData, goal = 'manutencao', dietType = 'balanced') => {
  const tdee = calcTDEE(userData?.gender, userData?.weight, userData?.height, userData?.age, 'moderate');
  const adj = goal === 'emagrecimento' ? -300 : goal === 'hipertrofia' ? +300 : 0;
  const dailyCalories = Math.max(1200, tdee + adj);

  const macros = {
    balanced: { protein: 0.25, carbs: 0.5, fats: 0.25 },
    lowcarb: { protein: 0.3, carbs: 0.35, fats: 0.35 },
    highprotein: { protein: 0.35, carbs: 0.4, fats: 0.25 }
  }[dietType] || { protein: 0.25, carbs: 0.5, fats: 0.25 };

  const toKcal = (pct) => Math.round(dailyCalories * pct);
  const plan = {
    dailyCalories,
    macros: {
      protein: `${Math.round(macros.protein * 100)}% (${toKcal(macros.protein)} kcal)`,
      carbs: `${Math.round(macros.carbs * 100)}% (${toKcal(macros.carbs)} kcal)`,
      fats: `${Math.round(macros.fats * 100)}% (${toKcal(macros.fats)} kcal)`
    },
    meals: [
      { name: 'Café da Manhã', calories: Math.round(dailyCalories * 0.25), foods: ['Ovos', 'Aveia', 'Fruta'] },
      { name: 'Almoço', calories: Math.round(dailyCalories * 0.35), foods: ['Frango', 'Arroz integral', 'Salada'] },
      { name: 'Lanche', calories: Math.round(dailyCalories * 0.15), foods: ['Iogurte', 'Castanhas'] },
      { name: 'Jantar', calories: Math.round(dailyCalories * 0.25), foods: ['Peixe', 'Batata doce', 'Legumes'] }
    ],
    tips: ['Hidrate-se bem', 'Ajuste por sinais de fome/saciedade', 'Planeje compras para a semana']
  };

  return plan;
};

// Chat offline com intents simples
export const answerQuestion = async (question, context = {}) => {
  const q = (question || '').toLowerCase();
  const { user, measurements = [], workouts = [] } = context;
  const ms = normalizeMeasurements(measurements);
  const latest = last(ms);

  const bmi = latest?.imc ?? calcBMI(latest?.weight ?? user?.weight, user?.height);
  const tdee = calcTDEE(user?.gender, latest?.weight ?? user?.weight, user?.height, user?.age, 'moderate');

  if (q.includes('imc')) {
    return `Seu IMC estimado é ${bmi ?? 'n/d'}. Faixa saudável: 18.5–24.9.`;
  }
  if (q.includes('caloria') || q.includes('tdee')) {
    return `Gasto energético diário (TDEE) estimado: ${tdee} kcal. Ajuste ±300 kcal conforme objetivo.`;
  }
  if (q.includes('peso')) {
    return `Último peso registrado: ${latest?.weight ?? user?.weight ?? 'n/d'} kg.`;
  }
  if (q.includes('treino') || q.includes('exercício')) {
    const plan = await generateWorkoutPlan(user, 'hipertrofia');
    return `Sugestão de treino: ${plan.name} — ${plan.description}. Principais exercícios: ${plan.exercises.map(e => e.name).join(', ')}.`;
  }
  if (q.includes('dieta') || q.includes('alimentação') || q.includes('macro')) {
    const meal = await getMealSuggestions(user, 'manutencao');
    return `Plano diário ~${meal.dailyCalories} kcal. Macros: proteína ${meal.macros.protein}, carbo ${meal.macros.carbs}, gorduras ${meal.macros.fats}.`;
  }

  // Resposta padrão
  return 'Sou seu coach offline. Pergunte sobre IMC, calorias/TDEE, treinos ou dieta para receber recomendações personalizadas.';
};

export const getAIRecommendation = async (userData) => {
  const msg = {
    cut: 'Reduza 300 kcal/dia e mantenha 7–9h de sono. Você consegue! 💪',
    bulk: 'Aumente 300 kcal/dia e foque em compostos pesados com técnica sólida.',
    maintain: 'Mantenha consistência, variação de estímulos e atenção aos sinais do corpo.'
  };
  const goal = (userData?.goal || '').toLowerCase();
  if (goal.includes('ganho') || goal.includes('hipertrofia')) return msg.bulk;
  if (goal.includes('perda') || goal.includes('emagrec')) return msg.cut;
  return msg.maintain;
};
