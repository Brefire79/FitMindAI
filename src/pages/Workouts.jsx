import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import {
  saveWorkout,
  getWorkouts,
  deleteWorkout,
  saveExercise,
  getExercisesByWorkout
} from '../utils/database';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import {
  Plus, Dumbbell, Trash2, ChevronDown, ChevronUp,
  Clock, Target
} from 'lucide-react';
import { format } from 'date-fns';

const Workouts = () => {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [exercises, setExercises] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    muscleGroup: 'chest',
    duration: '',
    intensity: 'medium',
    notes: '',
    exercises: []
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    rest: ''
  });

  const loadWorkouts = useCallback(async () => {
    try {
      const data = await getWorkouts(user.id);
      setWorkouts(data);
      
      // Carregar exercícios para cada treino
      const exercisesData = {};
      for (const workout of data) {
        const workoutExercises = await getExercisesByWorkout(workout.id);
        exercisesData[workout.id] = workoutExercises;
      }
      setExercises(exercisesData);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadWorkouts();
    }
  }, [user, loadWorkouts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets) return;

    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { ...currentExercise }]
    }));

    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      rest: ''
    });
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workoutData = {
      userId: user.id,
      name: formData.name,
      type: formData.type,
      muscleGroup: formData.muscleGroup,
      duration: parseInt(formData.duration),
      intensity: formData.intensity,
      notes: formData.notes,
      date: new Date().toISOString()
    };

    try {
      const savedWorkout = await saveWorkout(workoutData);
      
      // Salvar exercícios
      for (const exercise of formData.exercises) {
        await saveExercise({
          workoutId: savedWorkout.id,
          name: exercise.name,
          sets: parseInt(exercise.sets),
          reps: exercise.reps,
          weight: exercise.weight ? parseFloat(exercise.weight) : null,
          rest: exercise.rest ? parseInt(exercise.rest) : null
        });
      }

      await loadWorkouts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao salvar treino');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este treino?')) {
      try {
        await deleteWorkout(id);
        await loadWorkouts();
      } catch (error) {
        console.error('Erro ao deletar treino:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'strength',
      muscleGroup: 'chest',
      duration: '',
      intensity: 'medium',
      notes: '',
      exercises: []
    });
  };

  const workoutTypes = [
    { value: 'strength', label: 'Força', icon: '💪' },
    { value: 'cardio', label: 'Cardio', icon: '🏃' },
    { value: 'hiit', label: 'HIIT', icon: '🔥' },
    { value: 'flexibility', label: 'Flexibilidade', icon: '🧘' },
    { value: 'sports', label: 'Esportes', icon: '⚽' }
  ];

  const muscleGroups = [
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'legs', label: 'Pernas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'arms', label: 'Braços' },
    { value: 'abs', label: 'Abdômen' },
    { value: 'full_body', label: 'Corpo Todo' }
  ];

  const intensityLevels = [
    { value: 'light', label: 'Leve', color: 'text-green-400' },
    { value: 'medium', label: 'Moderado', color: 'text-yellow-400' },
    { value: 'high', label: 'Alto', color: 'text-orange-400' },
    { value: 'extreme', label: 'Extremo', color: 'text-red-400' }
  ];

  if (!user) {
    return (
      <div className="main-container py-8 text-center">
        <p className="text-gray-400">Por favor, complete seu perfil primeiro.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Carregando treinos..." />;
  }

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            <span className="text-gradient-primary">Meus</span> Treinos
          </h1>
          <p className="text-gray-400 font-body">
            Gerencie seus exercícios e séries
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Novo Treino</span>
        </motion.button>
      </div>

      {/* Lista de Treinos */}
      <div className="space-y-4">
        <AnimatePresence>
          {workouts.map((workout, index) => {
            const isExpanded = expandedWorkout === workout.id;
            const workoutExercises = exercises[workout.id] || [];
            const intensityInfo = intensityLevels.find(i => i.value === workout.intensity);

            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-glow-lg transition-all"
              >
                {/* Cabeçalho do Treino */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-bold text-white">
                          {workout.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {format(new Date(workout.date), "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-info">
                        {workoutTypes.find(t => t.value === workout.type)?.label}
                      </span>
                      <span className="badge badge-success">
                        {muscleGroups.find(m => m.value === workout.muscleGroup)?.label}
                      </span>
                      <span className={`badge ${intensityInfo.color}`}>
                        {intensityInfo.label}
                      </span>
                      {workout.duration && (
                        <span className="badge text-gray-300 bg-gray-700/20 border-gray-600/50">
                          <Clock className="w-3 h-3 mr-1" />
                          {workout.duration} min
                        </span>
                      )}
                      <span className="badge text-gray-300 bg-gray-700/20 border-gray-600/50">
                        <Target className="w-3 h-3 mr-1" />
                        {workoutExercises.length} exercícios
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
                      className="text-primary hover:text-primary-light transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Exercícios (Expandível) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-primary/20 pt-4 mt-4"
                    >
                      <h4 className="text-lg font-display font-bold text-white mb-3">
                        Exercícios:
                      </h4>
                      <div className="space-y-3">
                        {workoutExercises.map((exercise, idx) => (
                          <div
                            key={exercise.id}
                            className="bg-background-dark/50 rounded-lg p-4 border border-primary/10"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-white font-semibold mb-2">
                                  {idx + 1}. {exercise.name}
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                  <span>
                                    <strong className="text-primary">{exercise.sets}</strong> séries
                                  </span>
                                  {exercise.reps && (
                                    <span>
                                      <strong className="text-primary">{exercise.reps}</strong> reps
                                    </span>
                                  )}
                                  {exercise.weight && (
                                    <span>
                                      <strong className="text-accent">{exercise.weight} kg</strong>
                                    </span>
                                  )}
                                  {exercise.rest && (
                                    <span>
                                      <Clock className="w-3 h-3 inline mr-1" />
                                      {exercise.rest}s descanso
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm text-gray-300">
                            <strong className="text-primary">Notas:</strong> {workout.notes}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {workouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              Nenhum treino registrado ainda
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              Registrar Primeiro Treino
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modal de Novo Treino */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Novo Treino"
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              📋 Informações do Treino
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Nome do Treino *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Ex: Treino de Peito e Tríceps"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Tipo</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {workoutTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Grupo Muscular</label>
                  <select
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {muscleGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Duração (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="label">Intensidade</label>
                <select
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleChange}
                  className="select-field"
                >
                  {intensityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Observações</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="input-field resize-none"
                  placeholder="Notas sobre o treino..."
                />
              </div>
            </div>
          </div>

          {/* Adicionar Exercícios */}
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-4">
              💪 Exercícios
            </h3>
            
            {/* Lista de Exercícios Adicionados */}
            {formData.exercises.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-background-dark/50 p-3 rounded-lg"
                  >
                    <div className="text-sm">
                      <span className="text-white font-semibold">{ex.name}</span>
                      <span className="text-gray-400 ml-3">
                        {ex.sets} séries • {ex.reps} reps
                        {ex.weight && ` • ${ex.weight}kg`}
                      </span>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeExercise(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulário de Exercício */}
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div>
                <input
                  type="text"
                  name="name"
                  value={currentExercise.name}
                  onChange={handleExerciseChange}
                  className="input-field"
                  placeholder="Nome do exercício"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input
                  type="number"
                  name="sets"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  className="input-field"
                  placeholder="Séries"
                />
                <input
                  type="text"
                  name="reps"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  className="input-field"
                  placeholder="Reps"
                />
                <input
                  type="number"
                  name="weight"
                  value={currentExercise.weight}
                  onChange={handleExerciseChange}
                  step="0.5"
                  className="input-field"
                  placeholder="Carga (kg)"
                />
                <input
                  type="number"
                  name="rest"
                  value={currentExercise.rest}
                  onChange={handleExerciseChange}
                  className="input-field"
                  placeholder="Descanso (s)"
                />
              </div>
              <motion.button
                type="button"
                onClick={addExercise}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-accent w-full text-sm py-2"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Adicionar Exercício
              </motion.button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              disabled={formData.exercises.length === 0}
              whileHover={{ scale: formData.exercises.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: formData.exercises.length > 0 ? 0.98 : 1 }}
              className={`btn-primary flex-1 ${formData.exercises.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Salvar Treino
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

export default Workouts;
