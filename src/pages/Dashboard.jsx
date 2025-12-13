import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { getMeasurements, getWorkouts } from '../utils/database';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Weight, Activity, TrendingUp, Dumbbell, Calendar 
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('30'); // 7, 30, 90 dias

  const loadData = useCallback(async () => {
    if (!user) return;
    
    try {
      const [measurementsData, workoutsData] = await Promise.all([
        getMeasurements(user.id),
        getWorkouts(user.id)
      ]);
      setMeasurements(measurementsData);
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Preparar dados para gráficos - memoized
  const filterByPeriod = useCallback((data) => {
    const days = parseInt(chartPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return data.filter(item => new Date(item.date) >= cutoffDate);
  }, [chartPeriod]);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background-card border border-primary/30 rounded-lg p-3 shadow-glow">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name === 'peso' && ' kg'}
              {entry.name === 'gordura' && '%'}
              {entry.name === 'massaMagra' && ' kg'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  if (!user) {
    return (
      <div className="main-container py-8 text-center">
        <p className="text-gray-400">Por favor, complete seu perfil primeiro.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Carregando seu progresso..." />;
  }

  // Estatísticas rápidas - computed after early returns
  const latestMeasurement = measurements[0];
  const previousMeasurement = measurements[1];
  
  const weightChange = latestMeasurement && previousMeasurement 
    ? (latestMeasurement.weight - previousMeasurement.weight).toFixed(1)
    : 0;
  
  const workoutsThisMonth = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    return workoutDate.getMonth() === now.getMonth() && 
           workoutDate.getFullYear() === now.getFullYear();
  }).length;

  const weightChartData = filterByPeriod(measurements)
    .reverse()
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      peso: m.weight,
      imc: m.imc
    }));

  const bodyCompositionData = filterByPeriod(measurements)
    .reverse()
    .filter(m => m.bodyFat && m.leanMass)
    .map(m => ({
      date: format(new Date(m.date), 'dd/MM'),
      gordura: m.bodyFat,
      massaMagra: m.leanMass
    }));

  const workoutFrequencyData = (() => {
    const workoutsByWeek = {};
    filterByPeriod(workouts).forEach(w => {
      const weekStart = new Date(w.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = format(weekStart, 'dd/MM');
      workoutsByWeek[weekKey] = (workoutsByWeek[weekKey] || 0) + 1;
    });
    
    return Object.entries(workoutsByWeek).map(([week, count]) => ({
      semana: week,
      treinos: count
    }));
  })();

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-display font-bold mb-2">
          Olá, <span className="text-gradient-primary">{user.name.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-gray-400 font-body">
          Aqui está seu progresso e estatísticas
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Peso Atual"
          value={latestMeasurement?.weight || user.weight}
          unit="kg"
          icon={Weight}
          trend={weightChange > 0 ? 'up' : weightChange < 0 ? 'down' : 'stable'}
          trendValue={`${Math.abs(weightChange)} kg`}
          color="primary"
        />
        
        <StatCard
          title="IMC"
          value={latestMeasurement?.imc || '--'}
          icon={Activity}
          color="accent"
        />
        
        <StatCard
          title="Treinos (Mês)"
          value={workoutsThisMonth}
          icon={Dumbbell}
          color="success"
        />
        
        <StatCard
          title="Total Medições"
          value={measurements.length}
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Period Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-white">
          📊 Evolução
        </h2>
        <div className="flex space-x-2">
          {['7', '30', '90'].map(period => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChartPeriod(period)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all
                ${chartPeriod === period 
                  ? 'bg-primary text-white shadow-glow' 
                  : 'bg-background-card text-gray-400 hover:text-white'
                }
              `}
            >
              {period} dias
            </motion.button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weight Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center">
            <Weight className="w-5 h-5 text-primary mr-2" />
            Evolução de Peso
          </h3>
          {weightChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weightChartData}>
                <defs>
                  <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="peso" 
                  stroke="#0A84FF" 
                  fillOpacity={1}
                  fill="url(#colorPeso)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              Adicione medições para visualizar o gráfico
            </p>
          )}
        </motion.div>

        {/* Body Composition Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 text-accent mr-2" />
            Composição Corporal
          </h3>
          {bodyCompositionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bodyCompositionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gordura" 
                  stroke="#FFD60A" 
                  strokeWidth={2}
                  name="Gordura %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="massaMagra" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Massa Magra" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              Adicione dados de bioimpedância para visualizar
            </p>
          )}
        </motion.div>

        {/* Workout Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card lg:col-span-2"
        >
          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center">
            <Dumbbell className="w-5 h-5 text-green-400 mr-2" />
            Frequência de Treinos
          </h3>
          {workoutFrequencyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="semana" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="treinos" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-12">
              Registre treinos para visualizar a frequência
            </p>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-primary mr-2" />
          Atividade Recente
        </h3>
        <div className="space-y-3">
          {measurements.slice(0, 5).map((measurement) => (
            <div 
              key={measurement.id}
              className="flex items-center justify-between p-3 bg-background-dark/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white font-semibold">Medição Corporal</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(measurement.date), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{measurement.weight} kg</p>
                <p className="text-sm text-gray-400">IMC: {measurement.imc}</p>
              </div>
            </div>
          ))}
          
          {measurements.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              Nenhuma medição registrada ainda
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
