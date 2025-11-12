import { createContext, useContext, useState, useEffect } from 'react';
import { saveSetting, getAllSettings } from '../utils/database';
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
      
      console.log('📊 Configurações carregadas:', mergedSettings);
      
      // Inicializar Gemini se a chave estiver configurada
      if (mergedSettings.geminiApiKey) {
        try {
          console.log('🔑 Inicializando Gemini com API Key...');
          initializeAI(mergedSettings.geminiApiKey);
          console.log('✅ Gemini inicializado com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao inicializar Gemini:', error);
        }
      } else {
        console.log('⚠️ Nenhuma API Key do Gemini configurada');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      console.log(`💾 Salvando configuração: ${key} =`, value);
      await saveSetting(key, value);
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Reinicializar Gemini quando a chave for atualizada
      if (key === 'geminiApiKey' && value) {
        console.log('🔄 Reinicializando Gemini com nova API Key...');
        initializeAI(value);
        console.log('✅ Gemini reinicializado com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
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
