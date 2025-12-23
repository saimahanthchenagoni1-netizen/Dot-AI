
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Camera, X, Mic, Plus, Home, History, User, Settings as SettingsIcon, 
  PenTool, Image as ImageIcon, Trash2, MessageSquare, Clock, Brain, Lightbulb, Code, Globe, ExternalLink
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  image?: string;
  timestamp: string;
  sources?: { uri: string; title: string }[];
}

type ViewMode = 'home' | 'chat' | 'history' | 'profile' | 'settings';
type AIMode = 'general' | 'web' | 'reasoning' | 'coding';

interface ChatInterfaceProps {
  userName: string;
  userAvatar: string | null;
  settings: { snowfall: boolean; proMode: boolean };
  onUpdateProfile: (name: string, avatar: string | null) => void;
  onUpdateSettings: (settings: any) => void;
}

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-item ${isVisible ? 'active' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  userName, userAvatar, settings, onUpdateProfile, onUpdateSettings 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [aiMode, setAiMode] = useState<AIMode>('general');
  const [showHistory, setShowHistory] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const saved = localStorage.getItem('dot_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('dot_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const y = containerRef.current?.scrollTop || 0;
      setScrollY(y);
      document.documentElement.style.setProperty('--bg-hue-shift', `${y / 25}deg`);
    };
    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (viewMode === 'chat' && !showHistory) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, viewMode, showHistory]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (e: any) => {
        setInput(prev => prev + (prev ? ' ' : '') + e.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleVoiceTyping = () => {
    if (isListening) recognitionRef.current?.stop();
    else { setIsListening(true); recognitionRef.current?.start(); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearHistory = () => {
    if (confirm("Clear all conversation memory?")) {
      setMessages([]);
      localStorage.removeItem('dot_chat_history');
      setShowHistory(false);
    }
  };

  const jumpToMessage = (id: string) => {
    setShowHistory(false);
    setViewMode('chat');
    setTimeout(() => {
      messageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const sendMessage = async (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text && !image) return;

    // Direct initialization from environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    setViewMode('chat');
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image: image || undefined,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const imageTrigger = /^(create|draw|generate|make|show me) (an |a )?(image|picture|drawing|sketch)/i;
      
      if (imageTrigger.test(text)) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: text }] },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let generatedImg = '';
        let aiText = "Here is the image you requested:";
        for (const part of response.candidates?.[0].content.parts || []) {
          if (part.inlineData) generatedImg = `data:image/png;base64,${part.inlineData.data}`;
          else if (part.text) aiText = part.text;
        }

        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'ai',
          text: aiText,
          image: generatedImg,
          timestamp: new Date().toISOString()
        }]);
      } else {
        const model = settings.proMode ? "gemini-3-pro-preview" : "gemini-3-flash-preview";
        const systemInstruction = `You are DOT, a helpful AI assistant. You were created by SAI. Use simple, clear, and professional language. User name: ${userName}. Current mode: ${aiMode}. If anyone asks who created you, say SAI.`;
        
        const contents: any[] = [{ text: text || "Help me with this." }];
        if (userMsg.image) {
          contents.push({ inlineData: { mimeType: 'image/jpeg', data: userMsg.image.split(',')[1] } });
        }

        const config: any = { systemInstruction };

        // Handle specific AI modes
        if (aiMode === 'web') {
          config.tools = [{ googleSearch: {} }];
        } else if (aiMode === 'reasoning') {
          config.thinkingConfig = { thinkingBudget: 4000 };
        }

        const response = await ai.models.generateContent({
          model,
          contents: { parts: contents },
          config
        });

        let aiSources: { uri: string; title: string }[] = [];
        if (aiMode === 'web') {
          const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
          if (chunks) {
            aiSources = chunks
              .filter((c: any) => c.web)
              .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
          }
        }

        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: response.text || "I'm looking into that...",
          timestamp: new Date().toISOString(),
          sources: aiSources.length > 0 ? aiSources : undefined
        }]);
      }
    } catch (error) {
      console.error("AI Request Failed:", error);
      setMessages(prev => [...prev, { 
        id: 'err', 
        role: 'ai', 
        text: "I encountered an issue processing your request. Please ensure your API key is correctly configured in your deployment environment.", 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'home':
        return (
          <div className="min-h-[100vh] flex flex-col items-center justify-start pt-32 space-y-20 text-center">
            <RevealSection>
              <div className="space-y-6 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-500">
                  Welcome, <span className="text-white text-gradient">{userName}</span>
                </h2>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
                  What can I help with?
                </h1>
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-8">
              {[
                { icon: <ImageIcon size={22} />, label: "Create Image", desc: "Generate any picture" },
                { icon: <PenTool size={22} />, label: "Help Writing", desc: "Essays, stories, or emails" },
                { icon: <Brain size={22} />, label: "Solve Problem", desc: "Step-by-step help" },
                { icon: <Lightbulb size={22} />, label: "Brainstorm", desc: "Get new ideas" },
                { icon: <Code size={22} />, label: "Coding Help", desc: "Write or fix code" },
                { icon: <Globe size={22} />, label: "Web Search", desc: "Find live info" }
              ].map((item, i) => (
                <RevealSection key={i} delay={i * 80}>
                  <button onClick={() => sendMessage(item.label)} className="hover-card w-full text-left p-8 bg-zinc-900/40 border border-white/5 rounded-3xl flex flex-col gap-4 group shadow-xl">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{item.label}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                  </button>
                </RevealSection>
              ))}
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="max-w-4xl mx-auto w-full space-y-12 pb-56 pt-10 px-6">
            {messages.length === 0 && (
               <RevealSection>
                 <div className="text-center py-24 space-y-6 opacity-40">
                    <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-xl animate-float">
                      <MessageSquare size={28} className="text-zinc-500" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-600">Start a conversation</p>
                 </div>
               </RevealSection>
            )}
            {messages.map((msg) => (
              <RevealSection key={msg.id}>
                <div ref={el => messageRefs.current[msg.id] = el} className={`flex items-start gap-6 group`}>
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 shadow-xl ${msg.role === 'ai' ? 'bg-white text-black' : 'bg-zinc-900 border border-white/10 text-zinc-400'}`}>
                    {msg.role === 'ai' ? <div className="w-3 h-3 bg-black rounded-full" /> : <User size={22} />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                      {msg.role === 'user' ? userName : 'DOT AI'}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {msg.image && (
                      <div className="relative group/img max-w-lg mb-4 mt-2">
                        <img src={msg.image} className="rounded-3xl border border-white/5 shadow-2xl" alt="Content" />
                      </div>
                    )}
                    <div className={`text-[17px] leading-relaxed font-semibold tracking-tight ${msg.role === 'user' ? 'text-zinc-100' : 'text-zinc-300'}`}>
                      {msg.text}
                    </div>
                    {msg.sources && (
                      <div className="pt-4 flex flex-wrap gap-2">
                        {msg.sources.map((src, i) => (
                          <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-full text-[10px] font-bold text-zinc-400 transition-all">
                            <ExternalLink size={10} /> {src.title || 'Source'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </RevealSection>
            ))}
            {loading && (
              <div className="flex items-center gap-6 animate-pulse">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5" />
                <div className="space-y-3 w-full max-w-md">
                  <div className="h-3 bg-zinc-900/50 rounded-full w-full" />
                  <div className="h-3 bg-zinc-900/50 rounded-full w-[60%]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-xl mx-auto py-32 space-y-16 flex flex-col items-center">
             <RevealSection>
                <div className="relative group">
                   <div className="w-40 h-40 bg-zinc-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                      {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" alt="Avatar" /> : <User size={56} className="m-12 text-zinc-800" />}
                   </div>
                   <button onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-3 -right-3 bg-white text-black p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-90 transition-all">
                     <Camera size={20} />
                   </button>
                   <input type="file" ref={avatarInputRef} hidden onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        const reader = new FileReader();
                        reader.onload = () => onUpdateProfile(userName, reader.result as string);
                        reader.readAsDataURL(file);
                      }
                   }} />
                </div>
             </RevealSection>
             <div className="w-full space-y-10">
                <input type="text" value={userName} onChange={(e) => onUpdateProfile(e.target.value, userAvatar)} className="w-full bg-zinc-950/40 border border-white/5 rounded-3xl px-8 py-5 text-2xl font-bold tracking-tight focus:outline-none focus:border-white transition-all text-center" />
                <button onClick={() => setViewMode('chat')} className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-2xl">Save Profile</button>
             </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-xl mx-auto py-32 space-y-12">
            <h1 className="text-4xl font-black tracking-tight text-center">Settings</h1>
            <div className="space-y-4">
              {[
                { label: 'Snow Effect', active: settings.snowfall, toggle: () => onUpdateSettings({ snowfall: !settings.snowfall }) },
                { label: 'Pro Mode', active: settings.proMode, toggle: () => onUpdateSettings({ proMode: !settings.proMode }) }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem]">
                   <span className="text-xl font-bold">{s.label}</span>
                   <button onClick={s.toggle} className={`w-14 h-7 rounded-full relative transition-all ${s.active ? 'bg-white' : 'bg-zinc-800'}`}>
                      <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${s.active ? 'left-8 bg-black' : 'left-1 bg-zinc-500'}`} />
                   </button>
                </div>
              ))}
            </div>
            <button onClick={() => setViewMode('chat')} className="w-full py-5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-2xl mt-8">Back to Chat</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto overflow-x-hidden relative no-scrollbar bg-black">
      <div className={`fixed top-6 left-6 right-6 z-[100] transition-all duration-600 ${scrollY > 40 ? 'translate-y-[-10px] scale-[0.99]' : ''}`}>
        <div className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full px-8 py-3.5 flex items-center justify-between shadow-2xl max-w-6xl mx-auto">
          <button onClick={() => setViewMode('home')} className="flex items-center gap-4 group active:scale-90 transition-all">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all">
                <div className="w-2.5 h-2.5 bg-black rounded-full" />
             </div>
             <div className="flex flex-col text-left leading-none">
                <span className="font-black text-xl italic tracking-tighter text-white uppercase">DOT</span>
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">AI Assistant</span>
             </div>
          </button>
          <div className="flex items-center gap-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'chat', icon: MessageSquare, label: 'Chat' },
              { id: 'history', icon: History, label: 'History' },
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { if (item.id === 'history') setShowHistory(!showHistory); else { setViewMode(item.id as ViewMode); setShowHistory(false); } }}
                className={`px-6 py-3 rounded-full transition-all font-bold uppercase tracking-widest text-[9px] flex items-center gap-2.5 ${viewMode === item.id || (item.id === 'history' && showHistory) ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={16} />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-xl animate-in fade-in">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl p-8 flex flex-col space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Memory</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/5 rounded-full text-zinc-500"><X size={24} /></button>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {messages.length === 0 ? <p className="text-center text-zinc-600 py-20">No history yet</p> : 
                  messages.filter(m => m.role === 'user').map((msg) => (
                    <button key={msg.id} onClick={() => jumpToMessage(msg.id)} className="w-full text-left p-5 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-zinc-900 transition-all">
                       <p className="text-sm font-bold text-zinc-400 line-clamp-2">{msg.text || "View image"}</p>
                    </button>
                  ))
                }
             </div>
             {messages.length > 0 && <button onClick={clearHistory} className="w-full py-4 bg-zinc-900 text-red-500/60 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all"><Trash2 size={16} className="inline mr-2"/> Clear Memory</button>}
          </div>
        </div>
      )}

      <div className={`px-8 transition-all duration-500 ${showHistory ? 'blur-md grayscale opacity-50 scale-[0.98]' : ''}`}>
        {renderContent()}
      </div>

      {viewMode === 'chat' && !showHistory && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8 animate-reveal z-50">
           <div className="bg-[#0e0e10]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl flex flex-col">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())} placeholder="Message DOT..." className="bg-transparent border-none focus:ring-0 w-full text-lg font-medium py-3 resize-none outline-none min-h-[50px] max-h-[180px]" rows={1} />
              <div className="flex items-center justify-between px-4 pt-2 border-t border-white/5">
                 <div className="flex items-center gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="p-3 text-zinc-600 hover:text-white transition-all bg-white/5 rounded-full"><Plus size={20}/></button>
                    <div className="flex bg-black/60 p-1.5 rounded-xl border border-white/5 gap-1">
                      {(['general', 'web', 'reasoning', 'coding'] as AIMode[]).map(m => (
                        <button key={m} onClick={() => setAiMode(m)} className={`px-4 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${aiMode === m ? 'bg-white text-black' : 'text-zinc-600 hover:text-zinc-400'}`}>{m}</button>
                      ))}
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={toggleVoiceTyping} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-white/5 text-zinc-600'}`}><Mic size={20}/></button>
                    <button onClick={() => sendMessage()} disabled={!input.trim() && !image} className="p-3.5 bg-white text-black rounded-xl shadow-lg active:scale-95 disabled:opacity-20"><Send size={18}/></button>
                 </div>
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
           </div>
           <div className="text-center mt-6 text-[9px] font-bold text-zinc-800 uppercase tracking-[0.4em] opacity-40">DOT v3.0 • Created by SAI</div>
        </div>
      )}
    </div>
  );
};
