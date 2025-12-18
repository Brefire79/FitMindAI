import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registrar Service Worker com atualização controlada
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('🔄 Nova versão disponível');
      
      // Disparar evento customizado para o componente UpdateNotification
      window.dispatchEvent(
        new CustomEvent('sw-update-available', {
          detail: updateSW
        })
      );
    },
    onOfflineReady() {
      console.log('✅ App pronto para funcionar offline');
      
      // Salvar metadata de instalação
      if (typeof indexedDB !== 'undefined') {
        const openRequest = indexedDB.open('FitMindDB', 2);
        openRequest.onsuccess = () => {
          const db = openRequest.result;
          const tx = db.transaction('metadata', 'readwrite');
          const store = tx.objectStore('metadata');
          store.put({
            key: 'offline-ready',
            value: true,
            timestamp: new Date().toISOString()
          });
        };
      }
    },
    onRegisteredSW(swUrl, r) {
      console.log('✅ Service Worker registrado:', swUrl);
      
      // Verificar atualizações a cada 1 hora
      r && setInterval(() => {
        console.log('🔍 Verificando atualizações...');
        r.update();
      }, 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
    },
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
