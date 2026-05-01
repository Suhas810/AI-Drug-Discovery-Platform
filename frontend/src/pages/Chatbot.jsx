import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Send, User } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hello! I am AI PharmaX Assistant. How can I help you today with your biomedical research?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/ml/chat`, { message: input });
      setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-neonBlue to-neonPurple bg-clip-text text-transparent">AI Research Assistant</h1>
      </header>

      <div className="flex-1 bg-panelBG border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
           {messages.map((msg, i) => (
               <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] rounded-2xl p-4 flex gap-4 ${msg.sender === 'user' ? 'bg-neonBlue/10 border border-neonBlue/20 text-white rounded-br-none' : 'bg-darkBG border border-gray-700 text-gray-300 rounded-bl-none'}`}>
                       <div className="mt-1 shrink-0">
                           {msg.sender === 'user' ? <User size={20} className="text-neonPurple" /> : <Bot size={20} className="text-neonBlue" />}
                       </div>
                       <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                   </div>
               </div>
           ))}
           {loading && (
               <div className="flex justify-start">
                   <div className="bg-darkBG border border-gray-700 rounded-2xl p-4 rounded-bl-none flex items-center gap-2 text-neonBlue animate-pulse">
                       <Bot size={20} className="animate-spin" /> Thinking...
                   </div>
               </div>
           )}
           <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 bg-darkBG border-t border-gray-800 flex gap-4">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             className="flex-1 bg-panelBG border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neonBlue transition-colors"
             placeholder="Ask about a compound, mechanism of action, or biological pathway..."
           />
           <button 
             onClick={handleSend}
             disabled={loading || !input.trim()}
             className="bg-gradient-to-r from-neonBlue to-neonPurple text-darkBG px-6 rounded-xl hover:shadow-neon transition-all flex items-center justify-center disabled:opacity-50"
           >
              <Send size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
