import { createContext, useContext, useState, useEffect } from 'react';
import { getSetting, saveSetting, getAllSettings } from '../utils/database';
import { initializeAI } from '../services/aiService';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
  theme: 'dark',
  units: {
    weight: 'kg',
    distance: 'km',
    height: 'cm'
  },
  notifications: true,
  aiProvider: 'openai', // 'openai' ou 'gemini'
  openaiApiKey: '',
  geminiApiKey: ''
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getAllSettings();
      const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
      setSettings(mergedSettings);
      
      // Inicializar IA se as chaves estiverem configuradas
      if (mergedSettings.aiProvider === 'openai' && mergedSettings.openaiApiKey) {
        try {
          initializeAI({ provider: 'openai', apiKey: mergedSettings.openaiApiKey });
        } catch (error) {
          console.error('Erro ao inicializar OpenAI:', error);
        }
      } else if (mergedSettings.aiProvider === 'gemini' && mergedSettings.geminiApiKey) {
        try {
          initializeAI({ provider: 'gemini', apiKey: mergedSettings.geminiApiKey });
        } catch (error) {
          console.error('Erro ao inicializar Gemini:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      await saveSetting(key, value);
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Reinicializar IA quando necessário
      if (key === 'aiProvider') {
        const apiKey = value === 'openai' ? settings.openaiApiKey : settings.geminiApiKey;
        if (apiKey) {
          initializeAI({ provider: value, apiKey });
        }
      } else if (key === 'openaiApiKey' && value && settings.aiProvider === 'openai') {
        initializeAI({ provider: 'openai', apiKey: value });
      } else if (key === 'geminiApiKey' && value && settings.aiProvider === 'gemini') {
        initializeAI({ provider: 'gemini', apiKey: value });
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  };

  const updateUnits = async (unitType, value) => {
    try {
      const newUnits = { ...settings.units, [unitType]: value };
      await saveSetting('units', newUnits);
      setSettings(prev => ({
        ...prev,
        units: newUnits
      }));
    } catch (error) {
      console.error('Erro ao atualizar unidades:', error);
      throw error;
    }
  };

  const toggleTheme = async () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    await updateSetting('theme', newTheme);
  };

  const value = {
    settings,
    loading,
    updateSetting,
    updateUnits,
    toggleTheme
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
};
