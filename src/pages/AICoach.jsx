import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useSettings } from '../contexts/SettingsContext';
import { getMeasurements, getWorkouts, saveAIRecommendation, getAIRecommendations } from '../utils/database';
import { analyzeUserProgress, answerQuestion } from '../services/aiService';
import { 
  Bot, Sparkles, TrendingUp, MessageCircle, Zap, 
  Send, Lightbulb, Award, Target
} from 'lucide-react';
import { format } from 'date-fns';

const AICoach = () => {
  const { user } = useUser();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [chatMode, setChatMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [generating, setGenerating] = useState(false);

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await getAIRecommendations(user.id, 5);
      setRecommendations(recs);
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user, loadRecommendations]);

  const analyzeProgress = async () => {
    setLoading(true);
    try {
      const [measurements, workouts] = await Promise.all([
        getMeasurements(user.id),
        getWorkouts(user.id)
      ]);

      const result = await analyzeUserProgress(user, measurements, workouts);
      setAnalysis(result);

      // Salvar análise no banco
      await saveAIRecommendation({
        userId: user.id,
        type: 'progress_analysis',
        content: result,
        summary: result.summary
      });

      await loadRecommendations();
    } catch (error) {
      console.error('Erro ao analisar progresso:', error);
      alert(error.message || 'Erro ao gerar análise offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');
    setGenerating(true);

    try {
      const [measurements, workouts] = await Promise.all([
        getMeasurements(user.id),
        getWorkouts(user.id)
      ]);
      const answer = await answerQuestion(question, { user, measurements, workouts, history: chatHistory });
      const aiMessage = { role: 'assistant', content: answer };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      
      let errorMessage = 'Desculpe, não consegui processar sua pergunta.';
      
      // Mensagens específicas de erro online removidas
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="main-container py-8 text-center">
        <p className="text-gray-400">Por favor, complete seu perfil primeiro.</p>
      </div>
    );
  }

  return (
    <div className="main-container py-8 pb-24 md:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Bot className="w-20 h-20 text-primary mx-auto drop-shadow-[0_0_30px_rgba(10,132,255,0.8)]" />
        </motion.div>
        
        <h1 className="text-4xl font-display font-bold mb-2">
          <span className="text-gradient-primary">IA Coach</span>
        </h1>
        <p className="text-gray-400 font-body max-w-2xl mx-auto">
          Seu assistente inteligente para treinos, nutrição e motivação
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg bg-background-card p-1 border border-primary/30">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatMode(false)}
            className={`
              px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center space-x-2
              ${!chatMode ? 'bg-primary text-white shadow-glow' : 'text-gray-400'}
            `}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Análise</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatMode(true)}
            className={`
              px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center space-x-2
              ${chatMode ? 'bg-primary text-white shadow-glow' : 'text-gray-400'}
            `}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </motion.button>
        </div>
      </div>

      {!chatMode ? (
        /* Modo Análise */
        <div className="space-y-6">
          {/* Botão de Análise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={analyzeProgress}
              disabled={loading}
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              {loading ? (
                <>
                  <div className="loading-spinner h-6 w-6 border-2" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Gerar Análise Completa</span>
                </>
              )}
            </motion.button>
            <p className="text-sm text-gray-400 mt-3">
              A IA analisará seus dados e gerará recomendações personalizadas
            </p>
          </motion.div>

          {/* Análise Atual */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glow neon-border"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-8 h-8 text-accent" />
                <h2 className="text-2xl font-display font-bold text-white">
                  Análise Recente
                </h2>
              </div>

              {/* Resumo */}
              <div className="bg-primary/10 rounded-lg p-4 mb-4 border border-primary/30">
                <p className="text-white font-body leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Pontos Fortes */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-display font-bold text-green-400 mb-2 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Pontos Fortes
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span className="text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Áreas de Melhoria */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-display font-bold text-yellow-400 mb-2 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Áreas de Melhoria
                  </h3>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">⚠</span>
                        <span className="text-gray-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recomendações */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-display font-bold text-primary mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Recomendações
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, idx) => (
                      <div 
                        key={idx}
                        className={`
                          p-4 rounded-lg border-l-4
                          ${rec.priority === 'high' ? 'bg-red-500/10 border-red-500' : ''}
                          ${rec.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500' : ''}
                          ${rec.priority === 'low' ? 'bg-blue-500/10 border-blue-500' : ''}
                        `}
                      >
                        <h4 className="font-display font-bold text-white mb-1">
                          {rec.title}
                        </h4>
                        <p className="text-gray-300 text-sm">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dicas de Nutrição */}
              {analysis.nutritionTips && analysis.nutritionTips.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-display font-bold text-accent mb-2">
                    🍎 Dicas de Nutrição
                  </h3>
                  <ul className="space-y-2">
                    {analysis.nutritionTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-accent mt-1">•</span>
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mensagem Motivacional */}
              {analysis.motivationalMessage && (
                <div className="bg-gradient-accent rounded-lg p-4 border border-accent/50">
                  <p className="text-background-darker font-bold text-center">
                    💪 {analysis.motivationalMessage}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Histórico de Recomendações */}
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h3 className="text-xl font-display font-bold text-white mb-4">
                📜 Histórico de Análises
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-background-dark/50 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <p className="text-gray-300 text-sm mb-1">{rec.summary}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(rec.date), "dd/MM/yyyy 'às' HH:mm")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Modo Chat */
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card h-[600px] flex flex-col"
          >
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-custom space-y-4 mb-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Faça uma pergunta sobre treino, nutrição ou motivação!
                  </p>
                </div>
              ) : (
                chatHistory.map((message, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] p-4 rounded-lg
                        ${message.role === 'user' 
                          ? 'bg-primary text-white ml-auto' 
                          : 'bg-background-dark border border-primary/30 text-gray-300'
                        }
                      `}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-5 h-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">IA Coach</span>
                        </div>
                      )}
                      <p className="font-body whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              {generating && (
                <div className="flex justify-start">
                  <div className="bg-background-dark border border-primary/30 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner h-4 w-4 border-2" />
                      <span className="text-gray-400 text-sm">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAskQuestion} className="flex space-x-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={generating}
                placeholder="Digite sua pergunta..."
                className="input-field flex-1"
              />
              <motion.button
                type="submit"
                disabled={generating || !question.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-6"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
