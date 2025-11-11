import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30',
    accent: 'from-accent/20 to-accent/5 border-accent/30',
    success: 'from-green-500/20 to-green-500/5 border-green-500/30',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    danger: 'from-red-500/20 to-red-500/5 border-red-500/30'
  };

  const iconColorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const trendColorClass = 
    trend === 'up' ? 'text-green-400' :
    trend === 'down' ? 'text-red-400' :
    'text-gray-400';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        bg-gradient-to-br ${colorClasses[color]}
        rounded-xl p-6 border transition-all duration-300
        hover:shadow-glow ${className}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-body mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-display font-bold text-white">
              {value}
            </h3>
            {unit && (
              <span className="text-lg text-gray-400 font-body">{unit}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-background-dark/50 ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className={`flex items-center space-x-1 text-sm font-semibold ${trendColorClass}`}>
          {getTrendIcon()}
          <span>{trendValue}</span>
          <span className="text-gray-500">vs. anterior</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
