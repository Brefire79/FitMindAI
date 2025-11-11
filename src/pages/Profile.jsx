import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { User, Calendar, Ruler, Weight, Target, Save } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, createUser, updateUserData, loading } = useUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || 'male',
    height: user?.height || '',
    weight: user?.weight || '',
    goal: user?.goal || 'muscle_gain'
  });

  const [saving, setSaving] = useState(false);

  const goals = [
    { value: 'weight_loss', label: 'Perda de Peso' },
    { value: 'muscle_gain', label: 'Ganho de Massa' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'endurance', label: 'Resistência' },
    { value: 'strength', label: 'Força' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userData = {
        ...formData,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        createdAt: user?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (user) {
        await updateUserData(userData);
      } else {
        await createUser(userData);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <User className="w-16 h-16 text-primary mx-auto" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="text-gradient-primary">
              {user ? 'Editar' : 'Criar'} Perfil
            </span>
          </h1>
          <p className="text-gray-400 font-body">
            {user ? 'Atualize suas informações' : 'Vamos começar sua jornada fitness'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Nome */}
          <div>
            <label className="label flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nome Completo</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Seu nome"
            />
          </div>

          {/* Idade e Sexo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Idade</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="10"
                max="100"
                className="input-field"
                placeholder="25"
              />
            </div>

            <div>
              <label className="label">Sexo</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="select-field"
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>

          {/* Altura e Peso */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>Altura (cm)</span>
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                min="100"
                max="250"
                step="0.1"
                className="input-field"
                placeholder="175"
              />
            </div>

            <div>
              <label className="label flex items-center space-x-2">
                <Weight className="w-4 h-4" />
                <span>Peso (kg)</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                min="30"
                max="300"
                step="0.1"
                className="input-field"
                placeholder="75"
              />
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label className="label flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Objetivo Principal</span>
            </label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="select-field"
            >
              {goals.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex space-x-4 pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Salvando...' : 'Salvar Perfil'}</span>
            </motion.button>

            {user && (
              <motion.button
                type="button"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Cancelar
              </motion.button>
            )}
          </div>
        </form>

        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 card bg-primary/5 border-primary/20"
          >
            <h3 className="font-display font-bold text-lg mb-2 text-primary-light">
              📊 Estatísticas do Perfil
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Membro desde</p>
                <p className="text-white font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Última atualização</p>
                <p className="text-white font-semibold">
                  {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
