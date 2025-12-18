import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Dumbbell, 
  Activity, 
  Bot,
  Settings,
  User
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/dashboard', icon: TrendingUp, label: 'Dashboard' },
    { path: '/measurements', icon: Activity, label: 'Medições' },
    { path: '/workouts', icon: Dumbbell, label: 'Treinos' },
    { path: '/ai-coach', icon: Bot, label: 'IA Coach' },
    { path: '/profile', icon: User, label: 'Perfil' },
    { path: '/settings', icon: Settings, label: 'Config' },
  ];

  return (
    <nav className="bg-gradient-card dark:bg-gradient-card border-b border-primary/20 dark:border-primary/20 backdrop-blur-custom sticky top-0 z-50 transition-colors duration-300">
      <div className="main-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-primary dark:bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow dark:shadow-glow"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-display font-bold text-gradient-primary dark:text-gradient-primary">
                FitMind AI
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-400 font-body">Seu Coach Inteligente</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative px-4 py-2 rounded-lg font-semibold text-sm
                      transition-all duration-300 flex items-center space-x-2
                      ${isActive 
                        ? 'bg-primary dark:bg-primary text-white shadow-glow dark:shadow-glow' 
                        : 'text-gray-300 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-primary/10 dark:hover:bg-primary/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-card dark:bg-gradient-card border-t border-primary/20 dark:border-primary/20 backdrop-blur-custom z-50 safe-area-bottom transition-colors duration-300">
          <div className="flex items-center gap-2 overflow-x-auto py-3 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link key={item.path} to={item.path} className="flex-shrink-0 flex-1">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`
                      flex flex-col items-center justify-center py-2 space-y-1
                      transition-colors duration-300
                      ${isActive ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-400'}
                    `}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(10,132,255,0.8)]' : ''}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Floating Settings Button (Mobile Only) */}
        <Link to="/settings" className="md:hidden">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              fixed bottom-24 right-4 z-40
              w-14 h-14 rounded-full
              bg-gradient-primary shadow-glow
              flex items-center justify-center
              ${location.pathname === '/settings' ? 'ring-4 ring-primary/30' : ''}
            `}
          >
            <Settings className="w-6 h-6 text-white" />
          </motion.div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
