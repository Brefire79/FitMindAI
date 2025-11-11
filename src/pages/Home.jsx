import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Bot, Dumbbell, TrendingUp, Zap, Brain, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const features = [
    {
      icon: Brain,
      title: 'IA Coach',
      description: 'Recomendações personalizadas baseadas em seus dados',
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      title: 'Acompanhamento',
      description: 'Gráficos detalhados da sua evolução física',
      color: 'text-accent'
    },
    {
      icon: Dumbbell,
      title: 'Treinos',
      description: 'Gerencie exercícios, séries e cargas',
      color: 'text-green-400'
    },
    {
      icon: Zap,
      title: 'Rápido e Offline',
      description: 'PWA instalável que funciona sem internet',
      color: 'text-yellow-400'
    },
    {
      icon: Shield,
      title: 'Privacidade',
      description: 'Seus dados armazenados localmente no dispositivo',
      color: 'text-purple-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="main-container relative py-20 text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Bot className="w-24 h-24 mx-auto text-primary drop-shadow-[0_0_30px_rgba(10,132,255,0.8)]" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-black mb-6">
            <span className="text-gradient-primary">FitMind</span>
            <span className="text-white"> AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-body">
            Seu personal trainer com inteligência artificial. 
            Transforme seu corpo com tecnologia de ponta.
          </p>

          {!user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/profile')}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>Começar Agora</span>
              <Zap className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="btn-primary text-lg px-8 py-4"
            >
              Ir para Dashboard
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="main-container py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-display font-bold text-center mb-4"
          >
            <span className="text-gradient-primary">Recursos</span>
            <span className="text-white"> Poderosos</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 text-center mb-12 text-lg"
          >
            Tudo que você precisa para alcançar seus objetivos
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card-glow neon-border group cursor-pointer"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-display font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 font-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="main-container py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-12 text-center"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Pronto para transformar seu corpo?
            </h2>
            <p className="text-lg text-primary-light mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de usuários que já estão alcançando resultados incríveis
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user ? '/ai-coach' : '/profile')}
              className="bg-white text-primary font-bold py-4 px-8 rounded-lg hover:shadow-glow-lg transition-all"
            >
              {user ? 'Falar com IA Coach' : 'Criar Meu Perfil'}
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
