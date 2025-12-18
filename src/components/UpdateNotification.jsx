import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  useEffect(() => {
    // Listener para quando há atualização disponível
    const handleUpdateAvailable = (event) => {
      if (event.detail) {
        setUpdateSW(() => event.detail);
        setShowUpdate(true);
      }
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = async () => {
    if (updateSW) {
      try {
        await updateSW(true);
        window.location.reload();
      } catch (error) {
        console.error('Erro ao atualizar:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  return (
    <AnimatePresence>
      {showUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-24 md:bottom-8 right-4 left-4 md:left-auto md:w-96 z-[60]"
        >
          <div className="bg-gradient-card dark:bg-gradient-card border-2 border-primary rounded-xl shadow-glow-lg p-4 backdrop-blur-custom">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white dark:text-white">
                    Atualização Disponível
                  </h3>
                  <p className="text-xs text-gray-300 dark:text-gray-400">
                    Nova versão do app
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-300 dark:text-gray-400 mb-4">
              Uma nova versão está disponível com melhorias e correções. Seus dados serão preservados.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 btn-primary py-2 text-sm"
              >
                Atualizar Agora
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-background-card/50 dark:bg-background-card/50 text-gray-300 dark:text-gray-400 rounded-lg text-sm hover:bg-background-card dark:hover:bg-background-card transition-colors"
              >
                Depois
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateNotification;
