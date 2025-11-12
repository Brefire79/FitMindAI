import { useState, useEffect, useCallback } from 'react';
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
  Plus, Activity, Weight, Ruler, Trash2,
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
    bodyWater: '',
    boneMass: '',
    visceralFat: '',
    bmr: '',
    metabolicAge: '',
    neck: '',
    chest: '',
    waist: '',
    abdomen: '',
    hip: '',
    rightArmRelaxed: '',
    leftArmRelaxed: '',
    rightArmContracted: '',
    leftArmContracted: '',
    rightForearm: '',
    leftForearm: '',
    rightThigh: '',
    leftThigh: '',
    rightCalf: '',
    leftCalf: '',
    notes: ''
  });

  const loadMeasurements = useCallback(async () => {
    try {
      const data = await getMeasurements(user.id);
      setMeasurements(data);
    } catch (error) {
      console.error('Erro ao carregar medições:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMeasurements();
    }
  }, [user, loadMeasurements]);

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
      bodyWater: formData.bodyWater ? parseFloat(formData.bodyWater) : null,
      boneMass: formData.boneMass ? parseFloat(formData.boneMass) : null,
      visceralFat: formData.visceralFat ? parseFloat(formData.visceralFat) : null,
      bmr: formData.bmr ? parseFloat(formData.bmr) : null,
      metabolicAge: formData.metabolicAge ? parseInt(formData.metabolicAge) : null,
      neck: formData.neck ? parseFloat(formData.neck) : null,
      chest: formData.chest ? parseFloat(formData.chest) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      abdomen: formData.abdomen ? parseFloat(formData.abdomen) : null,
      hip: formData.hip ? parseFloat(formData.hip) : null,
      rightArmRelaxed: formData.rightArmRelaxed ? parseFloat(formData.rightArmRelaxed) : null,
      leftArmRelaxed: formData.leftArmRelaxed ? parseFloat(formData.leftArmRelaxed) : null,
      rightArmContracted: formData.rightArmContracted ? parseFloat(formData.rightArmContracted) : null,
      leftArmContracted: formData.leftArmContracted ? parseFloat(formData.leftArmContracted) : null,
      rightForearm: formData.rightForearm ? parseFloat(formData.rightForearm) : null,
      leftForearm: formData.leftForearm ? parseFloat(formData.leftForearm) : null,
      rightThigh: formData.rightThigh ? parseFloat(formData.rightThigh) : null,
      leftThigh: formData.leftThigh ? parseFloat(formData.leftThigh) : null,
      rightCalf: formData.rightCalf ? parseFloat(formData.rightCalf) : null,
      leftCalf: formData.leftCalf ? parseFloat(formData.leftCalf) : null,
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
      bodyWater: '',
      boneMass: '',
      visceralFat: '',
      bmr: '',
      metabolicAge: '',
      neck: '',
      chest: '',
      waist: '',
      abdomen: '',
      hip: '',
      rightArmRelaxed: '',
      leftArmRelaxed: '',
      rightArmContracted: '',
      leftArmContracted: '',
      rightForearm: '',
      leftForearm: '',
      rightThigh: '',
      leftThigh: '',
      rightCalf: '',
      leftCalf: '',
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

                {/* Bioimpedância */}
                {(measurement.bodyWater || measurement.boneMass || measurement.visceralFat || 
                  measurement.bmr || measurement.metabolicAge) && (
                  <div className="border-t border-primary/20 pt-4 mb-4">
                    <p className="text-sm text-gray-400 mb-3 font-semibold">
                      📊 Bioimpedância
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      {measurement.bodyWater && (
                        <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                          <p className="text-gray-400 text-xs">Água Corporal</p>
                          <p className="text-white font-semibold">{measurement.bodyWater}%</p>
                        </div>
                      )}
                      {measurement.boneMass && (
                        <div className="bg-gray-500/10 rounded-lg p-2 text-center">
                          <p className="text-gray-400 text-xs">Massa Óssea</p>
                          <p className="text-white font-semibold">{measurement.boneMass} kg</p>
                        </div>
                      )}
                      {measurement.visceralFat && (
                        <div className="bg-orange-500/10 rounded-lg p-2 text-center">
                          <p className="text-gray-400 text-xs">Gordura Visceral</p>
                          <p className="text-white font-semibold">{measurement.visceralFat}</p>
                        </div>
                      )}
                      {measurement.bmr && (
                        <div className="bg-purple-500/10 rounded-lg p-2 text-center">
                          <p className="text-gray-400 text-xs">TMB</p>
                          <p className="text-white font-semibold">{measurement.bmr} kcal</p>
                        </div>
                      )}
                      {measurement.metabolicAge && (
                        <div className="bg-green-500/10 rounded-lg p-2 text-center">
                          <p className="text-gray-400 text-xs">Idade Metabólica</p>
                          <p className="text-white font-semibold">{measurement.metabolicAge} anos</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Circunferências */}
                {(measurement.neck || measurement.chest || measurement.waist || measurement.abdomen || measurement.hip || 
                  measurement.rightArmRelaxed || measurement.leftArmRelaxed || measurement.rightArmContracted || 
                  measurement.leftArmContracted || measurement.rightForearm || measurement.leftForearm ||
                  measurement.rightThigh || measurement.leftThigh || measurement.rightCalf || measurement.leftCalf) && (
                  <div className="border-t border-primary/20 pt-4">
                    <p className="text-sm text-gray-400 mb-3 flex items-center font-semibold">
                      <Ruler className="w-4 h-4 mr-2" />
                      Circunferências (cm)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {measurement.neck && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Pescoço</p>
                          <p className="text-white font-semibold">{measurement.neck}</p>
                        </div>
                      )}
                      {measurement.chest && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Tórax/Peito</p>
                          <p className="text-white font-semibold">{measurement.chest}</p>
                        </div>
                      )}
                      {measurement.waist && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Cintura</p>
                          <p className="text-white font-semibold">{measurement.waist}</p>
                        </div>
                      )}
                      {measurement.abdomen && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Abdômen</p>
                          <p className="text-white font-semibold">{measurement.abdomen}</p>
                        </div>
                      )}
                      {measurement.hip && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Quadril</p>
                          <p className="text-white font-semibold">{measurement.hip}</p>
                        </div>
                      )}
                      {measurement.rightArmRelaxed && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Braço D (relaxado)</p>
                          <p className="text-white font-semibold">{measurement.rightArmRelaxed}</p>
                        </div>
                      )}
                      {measurement.leftArmRelaxed && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Braço E (relaxado)</p>
                          <p className="text-white font-semibold">{measurement.leftArmRelaxed}</p>
                        </div>
                      )}
                      {measurement.rightArmContracted && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Braço D (contraído)</p>
                          <p className="text-white font-semibold">{measurement.rightArmContracted}</p>
                        </div>
                      )}
                      {measurement.leftArmContracted && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Braço E (contraído)</p>
                          <p className="text-white font-semibold">{measurement.leftArmContracted}</p>
                        </div>
                      )}
                      {measurement.rightForearm && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Antebraço D</p>
                          <p className="text-white font-semibold">{measurement.rightForearm}</p>
                        </div>
                      )}
                      {measurement.leftForearm && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Antebraço E</p>
                          <p className="text-white font-semibold">{measurement.leftForearm}</p>
                        </div>
                      )}
                      {measurement.rightThigh && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Coxa D</p>
                          <p className="text-white font-semibold">{measurement.rightThigh}</p>
                        </div>
                      )}
                      {measurement.leftThigh && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Coxa E</p>
                          <p className="text-white font-semibold">{measurement.leftThigh}</p>
                        </div>
                      )}
                      {measurement.rightCalf && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Panturrilha D</p>
                          <p className="text-white font-semibold">{measurement.rightCalf}</p>
                        </div>
                      )}
                      {measurement.leftCalf && (
                        <div className="bg-background-dark/30 rounded p-2 text-center">
                          <p className="text-gray-400 text-xs">Panturrilha E</p>
                          <p className="text-white font-semibold">{measurement.leftCalf}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Bioimpedância */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              🔬 Bioimpedância
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Água Corporal (%)</label>
                <input
                  type="number"
                  name="bodyWater"
                  value={formData.bodyWater}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="60.0"
                />
              </div>
              <div>
                <label className="label">Massa Óssea (kg)</label>
                <input
                  type="number"
                  name="boneMass"
                  value={formData.boneMass}
                  onChange={handleChange}
                  step="0.1"
                  className="input-field"
                  placeholder="3.5"
                />
              </div>
              <div>
                <label className="label">Gordura Visceral</label>
                <input
                  type="number"
                  name="visceralFat"
                  value={formData.visceralFat}
                  onChange={handleChange}
                  step="1"
                  className="input-field"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="label">TMB (kcal)</label>
                <input
                  type="number"
                  name="bmr"
                  value={formData.bmr}
                  onChange={handleChange}
                  step="1"
                  className="input-field"
                  placeholder="1800"
                />
              </div>
              <div>
                <label className="label">Idade Metabólica</label>
                <input
                  type="number"
                  name="metabolicAge"
                  value={formData.metabolicAge}
                  onChange={handleChange}
                  step="1"
                  className="input-field"
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          {/* Circunferências */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              📏 Circunferências (cm)
            </h3>
            
            {/* Parte Superior */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">Parte Superior</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Pescoço</label>
                  <input
                    type="number"
                    name="neck"
                    value={formData.neck}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="38"
                  />
                </div>
                <div>
                  <label className="label">Tórax/Peito</label>
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
                  <label className="label">Cintura (linha do umbigo)</label>
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
                  <label className="label">Abdômen (2 dedos acima)</label>
                  <input
                    type="number"
                    name="abdomen"
                    value={formData.abdomen}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="82"
                  />
                </div>
              </div>
            </div>

            {/* Quadril */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">Quadril</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Quadril (ponto mais largo)</label>
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
                  <label className="label">Pescoço (abaixo do gogó)</label>
                  <input
                    type="number"
                    name="neck"
                    value={formData.neck}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="38"
                  />
                </div>
              </div>
            </div>

            {/* Braços */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">Braços</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="label">Braço D (relaxado)</label>
                  <input
                    type="number"
                    name="rightArmRelaxed"
                    value={formData.rightArmRelaxed}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="32"
                  />
                </div>
                <div>
                  <label className="label">Braço E (relaxado)</label>
                  <input
                    type="number"
                    name="leftArmRelaxed"
                    value={formData.leftArmRelaxed}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="32"
                  />
                </div>
                <div>
                  <label className="label">Braço D (contraído)</label>
                  <input
                    type="number"
                    name="rightArmContracted"
                    value={formData.rightArmContracted}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="label">Braço E (contraído)</label>
                  <input
                    type="number"
                    name="leftArmContracted"
                    value={formData.leftArmContracted}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="35"
                  />
                </div>
              </div>
            </div>

            {/* Antebraços */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">Antebraços</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Antebraço Direito</label>
                  <input
                    type="number"
                    name="rightForearm"
                    value={formData.rightForearm}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="28"
                  />
                </div>
                <div>
                  <label className="label">Antebraço Esquerdo</label>
                  <input
                    type="number"
                    name="leftForearm"
                    value={formData.leftForearm}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="28"
                  />
                </div>
              </div>
            </div>

            {/* Coxas */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-3">Coxas (meio da coxa)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Coxa Direita</label>
                  <input
                    type="number"
                    name="rightThigh"
                    value={formData.rightThigh}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="55"
                  />
                </div>
                <div>
                  <label className="label">Coxa Esquerda</label>
                  <input
                    type="number"
                    name="leftThigh"
                    value={formData.leftThigh}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="55"
                  />
                </div>
              </div>
            </div>

            {/* Panturrilhas */}
            <div>
              <p className="text-sm text-gray-400 mb-3">Panturrilhas</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Panturrilha Direita</label>
                  <input
                    type="number"
                    name="rightCalf"
                    value={formData.rightCalf}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="38"
                  />
                </div>
                <div>
                  <label className="label">Panturrilha Esquerda</label>
                  <input
                    type="number"
                    name="leftCalf"
                    value={formData.leftCalf}
                    onChange={handleChange}
                    step="0.1"
                    className="input-field"
                    placeholder="38"
                  />
                </div>
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
