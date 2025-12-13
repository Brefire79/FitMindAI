import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await getAllSettings();
      const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
      setSettings(mergedSettings);
      
      // Inicializar Gemini se a chave estiver configurada
      if (mergedSettings.geminiApiKey) {
        try {
          initializeAI(mergedSettings.geminiApiKey);
        } catch (error) {
          console.error('Erro ao inicializar Gemini:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = useCallback(async (key, value) => {
    try {
      await saveSetting(key, value);
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Reinicializar Gemini quando a chave for atualizada
      if (key === 'geminiApiKey' && value) {
        initializeAI(value);
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  }, []);

  const updateUnits = useCallback(async (unitType, value) => {
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
  }, [settings.units]);

  const toggleTheme = useCallback(async () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    await updateSetting('theme', newTheme);
  }, [settings.theme, updateSetting]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    settings,
    loading,
    updateSetting,
    updateUnits,
    toggleTheme
  }), [settings, loading, updateSetting, updateUnits, toggleTheme]);

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
