import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { 
  saveMeasurement, 
  getMeasurements, 
  deleteMeasurement,
  calculateIMC,
  getIMCCategory 
} from '../utils/database';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { 
  Plus, Activity, Weight, Ruler, Trash2, Calendar,
  Heart, Scale, TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';

const Measurements = () => {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    leanMass: '',
    chest: '',
    waist: '',
    hip: '',
    arm: '',
    thigh: '',
    calf: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadMeasurements();
    }
  }, [user]);

  const loadMeasurements = async () => {
    try {
      const data = await getMeasurements(user.id);
      setMeasurements(data);
    } catch (error) {
      console.error('Erro ao carregar medições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weight = parseFloat(formData.weight);
    const imc = calculateIMC(weight, user.height);

    const measurementData = {
      userId: user.id,
      weight: weight,
      imc: parseFloat(imc),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
      leanMass: formData.leanMass ? parseFloat(formData.leanMass) : null,
      chest: formData.chest ? parseFloat(formData.chest) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      hip: formData.hip ? parseFloat(formData.hip) : null,
      arm: formData.arm ? parseFloat(formData.arm) : null,
      thigh: formData.thigh ? parseFloat(formData.thigh) : null,
      calf: formData.calf ? parseFloat(formData.calf) : null,
      notes: formData.notes,
      date: new Date().toISOString()
    };

    try {
      await saveMeasurement(measurementData);
      await loadMeasurements();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      alert('Erro ao salvar medição');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta medição?')) {
      try {
        await deleteMeasurement(id);
        await loadMeasurements();
      } catch (error) {
        console.error('Erro ao deletar medição:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      weight: '',
      bodyFat: '',
      leanMass: '',
      chest: '',
      waist: '',
      hip: '',
      arm: '',
      thigh: '',
      calf: '',
      notes: ''
    });
  };

  if (!user) {
    return (
      <div className="main-container py-8 text-center">
        <p className="text-gray-400">Por favor, complete seu perfil primeiro.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Carregando medições..." />;
  }

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="text-gradient-primary">Medições</span> Corporais
          </h1>
          <p className="text-gray-400 font-body">
            Acompanhe sua evolução física
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nova Medição</span>
        </motion.button>
      </div>

      {/* Lista de Medições */}
      <div className="space-y-4">
        <AnimatePresence>
          {measurements.map((measurement, index) => {
            const imcInfo = getIMCCategory(measurement.imc);
            const prevMeasurement = measurements[index + 1];
            const weightDiff = prevMeasurement 
              ? (measurement.weight - prevMeasurement.weight).toFixed(1) 
              : null;

            return (
              <motion.div
                key={measurement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-glow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">
                        {format(new Date(measurement.date), "dd/MM/yyyy")}
                      </p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(measurement.date), 'HH:mm')}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(measurement.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-background-dark/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Weight className="w-4 h-4 text-primary" />
                      <p className="text-xs text-gray-400">Peso</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {measurement.weight} <span className="text-sm text-gray-400">kg</span>
                    </p>
                    {weightDiff && (
                      <p className={`text-xs ${parseFloat(weightDiff) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
                      </p>
                    )}
                  </div>

                  <div className="bg-background-dark/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Scale className="w-4 h-4 text-accent" />
                      <p className="text-xs text-gray-400">IMC</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{measurement.imc}</p>
                    <p className={`text-xs ${imcInfo.color}`}>{imcInfo.category}</p>
                  </div>

                  {measurement.bodyFat && (
                    <div className="bg-background-dark/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <p className="text-xs text-gray-400">Gordura</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {measurement.bodyFat} <span className="text-sm text-gray-400">%</span>
                      </p>
                    </div>
                  )}

                  {measurement.leanMass && (
                    <div className="bg-background-dark/50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <p className="text-xs text-gray-400">Massa Magra</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {measurement.leanMass} <span className="text-sm text-gray-400">kg</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Circunferências */}
                {(measurement.chest || measurement.waist || measurement.hip || 
                  measurement.arm || measurement.thigh || measurement.calf) && (
                  <div className="border-t border-primary/20 pt-4">
                    <p className="text-sm text-gray-400 mb-3 flex items-center">
                      <Ruler className="w-4 h-4 mr-2" />
                      Circunferências (cm)
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                      {measurement.chest && (
                        <div className="text-center">
                          <p className="text-gray-400">Peito</p>
                          <p className="text-white font-semibold">{measurement.chest}</p>
                        </div>
                      )}
                      {measurement.waist && (
                        <div className="text-center">
                          <p className="text-gray-400">Cintura</p>
                          <p className="text-white font-semibold">{measurement.waist}</p>
                        </div>
                      )}
                      {measurement.hip && (
                        <div className="text-center">
                          <p className="text-gray-400">Quadril</p>
                          <p className="text-white font-semibold">{measurement.hip}</p>
                        </div>
                      )}
                      {measurement.arm && (
                        <div className="text-center">
                          <p className="text-gray-400">Braço</p>
                          <p className="text-white font-semibold">{measurement.arm}</p>
                        </div>
                      )}
                      {measurement.thigh && (
                        <div className="text-center">
                          <p className="text-gray-400">Coxa</p>
                          <p className="text-white font-semibold">{measurement.thigh}</p>
                        </div>
                      )}
                      {measurement.calf && (
                        <div className="text-center">
                          <p className="text-gray-400">Panturrilha</p>
                          <p className="text-white font-semibold">{measurement.calf}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notas */}
                {measurement.notes && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-gray-300">{measurement.notes}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {measurements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              Nenhuma medição registrada ainda
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Adicionar Primeira Medição
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modal de Nova Medição */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Nova Medição"
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Essenciais */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              📊 Dados Essenciais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Peso (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  step="0.1"
                  className="input-field"
                  placeholder="75.5"
                />
              </div>
              <div>
                <label className="label">Gordura Corporal (%)</label>
                <input
                  type="number"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="15.0"
                />
              </div>
              <div>
                <label className="label">Massa Magra (kg)</label>
                <input
                  type="number"
                  name="leanMass"
                  value={formData.leanMass}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="65.0"
                />
              </div>
            </div>
          </div>

          {/* Circunferências */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              📏 Circunferências (cm)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Peito</label>
                <input
                  type="number"
                  name="chest"
                  value={formData.chest}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="95"
                />
              </div>
              <div>
                <label className="label">Cintura</label>
                <input
                  type="number"
                  name="waist"
                  value={formData.waist}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="label">Quadril</label>
                <input
                  type="number"
                  name="hip"
                  value={formData.hip}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="95"
                />
              </div>
              <div>
                <label className="label">Braço</label>
                <input
                  type="number"
                  name="arm"
                  value={formData.arm}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="35"
                />
              </div>
              <div>
                <label className="label">Coxa</label>
                <input
                  type="number"
                  name="thigh"
                  value={formData.thigh}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="55"
                />
              </div>
              <div>
                <label className="label">Panturrilha</label>
                <input
                  type="number"
                  name="calf"
                  value={formData.calf}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="38"
                />
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="label">Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Adicione observações sobre esta medição..."
            />
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1"
            >
              Salvar Medição
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              Cancelar
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Measurements;
