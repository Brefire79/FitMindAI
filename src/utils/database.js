import { openDB } from 'idb';

const DB_NAME = 'FitMindDB';
const DB_VERSION = 2; // Incrementado para suportar migrações

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`📊 Migrando banco de dados da versão ${oldVersion} para ${newVersion}`);
      
      // Store para usuário
      if (!db.objectStoreNames.contains('user')) {
        db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
      }

      // Store para medições corporais
      if (!db.objectStoreNames.contains('measurements')) {
        const measurementStore = db.createObjectStore('measurements', {
          keyPath: 'id',
          autoIncrement: true,
        });
        measurementStore.createIndex('date', 'date');
        measurementStore.createIndex('userId', 'userId');
      }

      // Store para treinos
      if (!db.objectStoreNames.contains('workouts')) {
        const workoutStore = db.createObjectStore('workouts', {
          keyPath: 'id',
          autoIncrement: true,
        });
        workoutStore.createIndex('date', 'date');
        workoutStore.createIndex('userId', 'userId');
        workoutStore.createIndex('muscleGroup', 'muscleGroup');
      }

      // Store para exercícios
      if (!db.objectStoreNames.contains('exercises')) {
        const exerciseStore = db.createObjectStore('exercises', {
          keyPath: 'id',
          autoIncrement: true,
        });
        exerciseStore.createIndex('workoutId', 'workoutId');
        exerciseStore.createIndex('name', 'name');
      }

      // Store para configurações
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Store para recomendações da IA
      if (!db.objectStoreNames.contains('aiRecommendations')) {
        const aiStore = db.createObjectStore('aiRecommendations', {
          keyPath: 'id',
          autoIncrement: true,
        });
        aiStore.createIndex('date', 'date');
        aiStore.createIndex('userId', 'userId');
      }

      // Store para backup/metadata (versão 2)
      if (!db.objectStoreNames.contains('metadata')) {
        const metadataStore = db.createObjectStore('metadata', { keyPath: 'key' });
      }

      console.log('✅ Banco de dados migrado com sucesso!');
    },
    blocked() {
      console.warn('⚠️ Atualização do banco bloqueada. Feche outras abas do app.');
    },
    blocking() {
      console.warn('⚠️ Esta aba está bloqueando a atualização do banco.');
    },
  });

  return db;
};

// ========== CRUD para Usuário ==========
export const saveUser = async (userData) => {
  const db = await initDB();
  const tx = db.transaction('user', 'readwrite');
  const store = tx.objectStore('user');
  
  // Verifica se já existe um usuário
  const allUsers = await store.getAll();
  
  if (allUsers.length > 0) {
    // Atualiza o usuário existente
    const existingUser = allUsers[0];
    await store.put({ ...userData, id: existingUser.id });
    await tx.done;
    return { ...userData, id: existingUser.id };
  } else {
    // Cria novo usuário
    const id = await store.add(userData);
    await tx.done;
    return { ...userData, id };
  }
};

export const getUser = async () => {
  const db = await initDB();
  const users = await db.getAll('user');
  return users[0] || null;
};

export const updateUser = async (userData) => {
  const db = await initDB();
  await db.put('user', userData);
  return userData;
};

// ========== CRUD para Medições ==========
export const saveMeasurement = async (measurementData) => {
  const db = await initDB();
  const id = await db.add('measurements', {
    ...measurementData,
    date: measurementData.date || new Date().toISOString(),
  });
  return { ...measurementData, id };
};

export const getMeasurements = async (userId) => {
  const db = await initDB();
  const tx = db.transaction('measurements', 'readonly');
  const index = tx.store.index('userId');
  const measurements = await index.getAll(userId);
  await tx.done;
  return measurements.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const deleteMeasurement = async (id) => {
  const db = await initDB();
  await db.delete('measurements', id);
};

// ========== CRUD para Treinos ==========
export const saveWorkout = async (workoutData) => {
  const db = await initDB();
  const id = await db.add('workouts', {
    ...workoutData,
    date: workoutData.date || new Date().toISOString(),
  });
  return { ...workoutData, id };
};

export const getWorkouts = async (userId) => {
  const db = await initDB();
  const tx = db.transaction('workouts', 'readonly');
  const index = tx.store.index('userId');
  const workouts = await index.getAll(userId);
  await tx.done;
  return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getWorkoutById = async (id) => {
  const db = await initDB();
  return await db.get('workouts', id);
};

export const updateWorkout = async (workoutData) => {
  const db = await initDB();
  await db.put('workouts', workoutData);
  return workoutData;
};

export const deleteWorkout = async (id) => {
  const db = await initDB();
  // Deletar exercícios associados
  const exercises = await getExercisesByWorkout(id);
  const deletions = exercises.map(ex => deleteExercise(ex.id));
  await Promise.all(deletions);
  // Deletar treino
  await db.delete('workouts', id);
};

// ========== CRUD para Exercícios ==========
export const saveExercise = async (exerciseData) => {
  const db = await initDB();
  const id = await db.add('exercises', exerciseData);
  return { ...exerciseData, id };
};

export const getExercisesByWorkout = async (workoutId) => {
  const db = await initDB();
  const tx = db.transaction('exercises', 'readonly');
  const index = tx.store.index('workoutId');
  const exercises = await index.getAll(workoutId);
  await tx.done;
  return exercises;
};

export const deleteExercise = async (id) => {
  const db = await initDB();
  await db.delete('exercises', id);
};

// ========== CRUD para Configurações ==========
export const saveSetting = async (key, value) => {
  const db = await initDB();
  await db.put('settings', { key, value });
};

export const getSetting = async (key) => {
  const db = await initDB();
  const setting = await db.get('settings', key);
  return setting?.value;
};

export const getAllSettings = async () => {
  const db = await initDB();
  const settings = await db.getAll('settings');
  return settings.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
};

// ========== CRUD para Recomendações da IA ==========
export const saveAIRecommendation = async (recommendationData) => {
  const db = await initDB();
  const id = await db.add('aiRecommendations', {
    ...recommendationData,
    date: new Date().toISOString(),
  });
  return { ...recommendationData, id };
};

export const getAIRecommendations = async (userId, limit = 10) => {
  const db = await initDB();
  const tx = db.transaction('aiRecommendations', 'readonly');
  const index = tx.store.index('userId');
  const recommendations = await index.getAll(userId);
  await tx.done;
  return recommendations
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// ========== Exportação de Dados ==========
export const exportAllData = async () => {
  const db = await initDB();
  const data = {
    user: await db.getAll('user'),
    measurements: await db.getAll('measurements'),
    workouts: await db.getAll('workouts'),
    exercises: await db.getAll('exercises'),
    settings: await db.getAll('settings'),
    aiRecommendations: await db.getAll('aiRecommendations'),
    exportDate: new Date().toISOString(),
  };
  return data;
};

// ========== Importação de Dados ==========
export const importAllData = async (data) => {
  const db = await initDB();
  
  // Limpar stores existentes
  const stores = ['user', 'measurements', 'workouts', 'exercises', 'settings', 'aiRecommendations'];
  
  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readwrite');
    await tx.store.clear();
    await tx.done;
  }
  
  // Importar novos dados
  for (const [storeName, items] of Object.entries(data)) {
    if (storeName === 'exportDate') continue;
    
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.store;
    
    for (const item of items) {
      await store.put(item);
    }
    
    await tx.done;
  }
  
  return true;
};

// ========== Calculos Úteis ==========
export const calculateIMC = (weight, height) => {
  // height em cm, weight em kg
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const getIMCCategory = (imc) => {
  if (imc < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-400' };
  if (imc < 25) return { category: 'Peso normal', color: 'text-green-400' };
  if (imc < 30) return { category: 'Sobrepeso', color: 'text-yellow-400' };
  if (imc < 35) return { category: 'Obesidade Grau I', color: 'text-orange-400' };
  if (imc < 40) return { category: 'Obesidade Grau II', color: 'text-red-400' };
  return { category: 'Obesidade Grau III', color: 'text-red-600' };
};
