import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Lightbulb, Shield, Sword, Map, Settings, Mic, MicOff } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { ChatMessage } from '../../types';

export const AIGameAssistant: React.FC = () => {
  const { currentGame, games } = useGameStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI gaming assistant. I can help you with strategies, tips, trophy guides, and game recommendations. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: 'Trophy Guide', icon: Shield, prompt: 'Show me a trophy guide for my current game' },
    { label: 'Strategy Tips', icon: Sword, prompt: 'Give me some advanced strategy tips' },
    { label: 'Game Recommendations', icon: Map, prompt: 'Recommend similar games based on my library' },
    { label: 'Optimization', icon: Settings, prompt: 'How can I optimize my gaming setup?' }
  ];

  const generateResponse = (userMessage: string): ChatMessage => {
    const responses = {
      trophy: [
        "🏆 For Spider-Man 2, focus on the 'Web-Slinger' trophy first - it's missable during the tutorial. The AI recommends completing all combat challenges before progressing to Chapter 5.",
        "🎯 Based on your playtime data, you're 75% through Spider-Man 2. The AI suggests focusing on collectibles now - there are 42 backpacks remaining in Manhattan.",
        "💎 For the Platinum trophy, you'll need to complete all side missions. The AI has detected you're missing 3 Mysterium missions - check your map for purple icons."
      ],
      strategy: [
        "🎮 AI Analysis: Your Spider-Man 2 combat efficiency is 73%. Try using more web-gadgets - the AI detected you're only using 2 out of 8 available gadgets.",
        "⚡ For Call of Duty MW3, the AI recommends adjusting your sensitivity to 6.5 based on your current 0.8 K/D ratio. Your aim accuracy could improve by 23%.",
        "🕷️ Advanced tip: In Spider-Man 2, chain air combos with web-zip attacks. The AI shows this increases your style points by 340% compared to ground combat."
      ],
      recommendation: [
        "🎯 AI Recommendation: Based on your 95% completion rate in action games, try 'Ghost of Tsushima Director's Cut' - it matches your preference for open-world exploration.",
        "🤖 Machine Learning suggests 'Horizon Forbidden West' next. Your playtime patterns indicate 87% compatibility with this title based on similar players.",
        "📊 AI Analysis shows you prefer single-player campaigns (78% of playtime). Consider 'God of War Ragnarök' - predicted enjoyment score: 9.2/10."
      ],
      optimization: [
        "⚙️ AI detected your PS5 is running at 67°C. Recommend cleaning vents and ensuring 6-inch clearance for optimal performance.",
        "📺 Your display supports 120Hz but games are running at 60Hz. Enable 'Performance Mode' in PS5 settings for competitive advantage.",
        "🎮 Controller latency analysis shows 12ms input delay. Switch to wired connection for 4ms improvement in competitive games."
      ],
      default: [
        "🤖 AI Assistant ready! I can analyze your gaming patterns, suggest optimizations, or help with trophy hunting. What would you like to explore?",
        "📊 I have access to your gaming data and can provide personalized recommendations. Ask me about strategies, completions, or performance improvements!",
        "🎮 My AI algorithms are trained on millions of gaming sessions. I can help optimize your playtime, suggest difficulty settings, or predict your enjoyment of new games!"
      ]
    };

    const lowerMessage = userMessage.toLowerCase();
    let responseArray = responses.default;
    let messageType: 'text' | 'tip' | 'strategy' | 'warning' = 'text';

    if (lowerMessage.includes('trophy') || lowerMessage.includes('achievement')) {
      responseArray = responses.trophy;
      messageType = 'tip';
    } else if (lowerMessage.includes('strategy') || lowerMessage.includes('tip') || lowerMessage.includes('help')) {
      responseArray = responses.strategy;
      messageType = 'strategy';
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      responseArray = responses.recommendation;
      messageType = 'tip';
    } else if (lowerMessage.includes('optimize') || lowerMessage.includes('setup') || lowerMessage.includes('settings')) {
      responseArray = responses.optimization;
      messageType = 'tip';
    }

    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    return {
      id: Date.now().toString(),
      content: randomResponse,
      sender: 'assistant',
      timestamp: new Date(),
      gameContext: currentGame?.title,
      type: messageType
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantResponse = generateResponse(inputMessage);
      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input simulation
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("How do I get the platinum trophy in Spider-Man 2?");
      }, 3000);
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'strategy': return <Sword className="w-4 h-4 text-blue-400" />;
      case 'warning': return <Shield className="w-4 h-4 text-red-400" />;
      default: return <Bot className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Gaming Assistant</h3>
            <p className="text-gray-400 text-sm">
              {currentGame ? `Helping with ${currentGame.title}` : 'Ready to help with any game'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-green-400 font-medium">Online</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      getMessageIcon(message.type)
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.gameContext && (
                      <p className="text-xs opacity-75 mt-1">Context: {message.gameContext}</p>
                    )}
                  </div>
                </div>
                
                <p className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about gaming..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVoiceInput}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                isListening ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span>Listening...</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};