import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium', message = 'Carregando...' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} rounded-full border-4 border-primary/20 border-t-primary`}
      />
      {message && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400 font-body"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
