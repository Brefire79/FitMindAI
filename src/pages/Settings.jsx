import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { exportAllData, importAllData } from '../utils/database';
import { 
  Settings as SettingsIcon, Key, Download, Upload, 
  Moon, Sun, Scale, AlertCircle, Save, FileJson
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Settings = () => {
  const { settings, updateSetting, updateUnits, toggleTheme } = useSettings();
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveAISettings = async () => {
    setSaving(true);
    try {
      if (geminiApiKey) {
        await updateSetting('geminiApiKey', geminiApiKey);
      }
      setMessage('✓ Configurações de IA salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Erro ao salvar configurações');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      const data = await exportAllData();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitmind-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('✓ Dados exportados com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Erro ao exportar dados');
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    try {
      const data = await exportAllData();
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(10, 132, 255);
      doc.text('FitMind AI - Relatório Completo', 20, 20);
      
      // Data
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
      
      // Usuário
      if (data.user && data.user.length > 0) {
        const user = data.user[0];
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Perfil do Usuário', 20, 45);
        
        doc.autoTable({
          startY: 50,
          head: [['Campo', 'Valor']],
          body: [
            ['Nome', user.name],
            ['Idade', `${user.age} anos`],
            ['Sexo', user.gender === 'male' ? 'Masculino' : 'Feminino'],
            ['Altura', `${user.height} cm`],
            ['Peso Inicial', `${user.weight} kg`],
            ['Objetivo', user.goal]
          ],
          theme: 'grid',
          headStyles: { fillColor: [10, 132, 255] }
        });
      }
      
      // Medições
      if (data.measurements && data.measurements.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Histórico de Medições', 20, 20);
        
        const measurementsData = data.measurements.slice(0, 20).map(m => [
          new Date(m.date).toLocaleDateString('pt-BR'),
          `${m.weight} kg`,
          m.imc,
          m.bodyFat ? `${m.bodyFat}%` : '-',
          m.leanMass ? `${m.leanMass} kg` : '-'
        ]);
        
        doc.autoTable({
          startY: 25,
          head: [['Data', 'Peso', 'IMC', 'Gordura', 'Massa Magra']],
          body: measurementsData,
          theme: 'striped',
          headStyles: { fillColor: [10, 132, 255] }
        });
      }
      
      // Treinos
      if (data.workouts && data.workouts.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Histórico de Treinos', 20, 20);
        
        const workoutsData = data.workouts.slice(0, 15).map(w => [
          new Date(w.date).toLocaleDateString('pt-BR'),
          w.name,
          w.type,
          w.muscleGroup,
          `${w.duration || '-'} min`,
          w.intensity
        ]);
        
        doc.autoTable({
          startY: 25,
          head: [['Data', 'Nome', 'Tipo', 'Grupo', 'Duração', 'Intensidade']],
          body: workoutsData,
          theme: 'striped',
          headStyles: { fillColor: [10, 132, 255] },
          styles: { fontSize: 8 }
        });
      }
      
      doc.save(`fitmind-relatorio-${new Date().toISOString().split('T')[0]}.pdf`);
      setMessage('✓ PDF gerado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Erro ao gerar PDF');
      console.error(error);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (window.confirm('Isso substituirá todos os dados existentes. Deseja continuar?')) {
        await importAllData(data);
        setMessage('✓ Dados importados! Recarregue a página.');
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      setMessage('✗ Erro ao importar dados. Arquivo inválido.');
      console.error(error);
    }
  };

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <SettingsIcon className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-display font-bold">
              <span className="text-gradient-primary">Configurações</span>
            </h1>
          </div>
          <p className="text-gray-400 font-body">
            Personalize sua experiência no FitMind AI
          </p>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              mb-6 p-4 rounded-lg border
              ${message.startsWith('✓') 
                ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                : 'bg-red-500/10 border-red-500/50 text-red-400'
              }
            `}
          >
            {message}
          </motion.div>
        )}

        {/* AI Configuration */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-display font-bold text-white">
              Configuração de IA
            </h2>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">API Gratuita do Google Gemini</p>
                <p>Configure sua chave de API do Gemini para usar todos os recursos de IA do FitMind gratuitamente.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Gemini API Key */}
            <div>
              <label className="label">Gemini API Key</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIza..."
                className="input-field font-mono"
              />
              <p className="text-xs text-gray-500 mt-2">
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Obtenha sua chave Gemini gratuita aqui →
                </a>
              </p>
            </div>

            <p className="text-xs text-gray-500">
              🔒 Sua chave é armazenada localmente e nunca é enviada para nossos servidores
            </p>

            <motion.button
              onClick={handleSaveAISettings}
              disabled={saving || !geminiApiKey}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Salvando...' : 'Salvar API Key'}</span>
            </motion.button>
          </div>
        </div>

        {/* Aparência */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            {settings.theme === 'dark' ? (
              <Moon className="w-6 h-6 text-primary" />
            ) : (
              <Sun className="w-6 h-6 text-accent" />
            )}
            <h2 className="text-2xl font-display font-bold text-white">
              Aparência
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Tema</p>
              <p className="text-sm text-gray-400">
                {settings.theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
              </p>
            </div>
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              Alternar
            </motion.button>
          </div>
        </div>

        {/* Unidades */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-display font-bold text-white">
              Unidades de Medida
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Peso</label>
              <select
                value={settings.units.weight}
                onChange={(e) => updateUnits('weight', e.target.value)}
                className="select-field"
              >
                <option value="kg">Quilogramas (kg)</option>
                <option value="lb">Libras (lb)</option>
              </select>
            </div>

            <div>
              <label className="label">Altura</label>
              <select
                value={settings.units.height}
                onChange={(e) => updateUnits('height', e.target.value)}
                className="select-field"
              >
                <option value="cm">Centímetros (cm)</option>
                <option value="in">Polegadas (in)</option>
              </select>
            </div>

            <div>
              <label className="label">Distância</label>
              <select
                value={settings.units.distance}
                onChange={(e) => updateUnits('distance', e.target.value)}
                className="select-field"
              >
                <option value="km">Quilômetros (km)</option>
                <option value="mi">Milhas (mi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backup e Exportação */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <FileJson className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-display font-bold text-white">
              Backup e Exportação
            </h2>
          </div>

          <p className="text-gray-400 mb-4">
            Exporte ou importe seus dados para manter backup seguro
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              onClick={handleExportJSON}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Exportar JSON</span>
            </motion.button>

            <motion.button
              onClick={handleExportPDF}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Gerar PDF</span>
            </motion.button>

            <label className="btn-secondary flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Importar JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Informações */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>FitMind AI v1.0.0</p>
          <p>Desenvolvido com ❤️ para transformar sua jornada fitness</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
