
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Send, 
  Zap, 
  ChevronRight, 
  BookOpen, 
  Lightbulb,
  Loader2,
  Trash2,
  BrainCircuit,
  MessageCircleQuestion
} from 'lucide-react';
import { solveProblem } from '../geminiService';
import { StudentLevel, AskMode, AIResponse } from '../types';

export const AskAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [level, setLevel] = useState<StudentLevel>(StudentLevel.HIGH_SCHOOL);
  const [mode, setMode] = useState<AskMode>(AskMode.DEEP);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAsk = async () => {
    if (!input && !image) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await solveProblem(input, level, mode, image || undefined);
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-zinc-900/50 px-4 py-1 rounded-full border border-zinc-800 mb-2">
          <MessageCircleQuestion size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Ready to help</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter">Need a hand?</h1>
        <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
          Stuck on a problem? Type it here or upload a photo. 
          DOT explains it step-by-step so you actually understand.
        </p>
      </header>

      {/* Input Area */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 shadow-2xl focus-within:border-zinc-700 transition-all">
        <div className="flex flex-col gap-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here, or upload a screenshot of your homework..."
            className="bg-transparent border-none focus:ring-0 text-xl resize-none h-40 w-full placeholder:text-zinc-800 leading-relaxed"
          />

          {image && (
            <div className="relative w-48 group">
              <img src={image} alt="Uploaded" className="rounded-2xl border border-zinc-800 shadow-xl" />
              <button 
                onClick={() => setImage(null)}
                className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-zinc-900 gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                <Camera size={18} />
                <span>Camera</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                <Upload size={18} />
                <span>Upload</span>
              </button>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*,application/pdf" />
            </div>

            <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value as StudentLevel)}
                className="bg-black border-none text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-2 text-zinc-400 focus:ring-1 focus:ring-white outline-none"
              >
                {Object.values(StudentLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select 
                value={mode} 
                onChange={(e) => setMode(e.target.value as AskMode)}
                className="bg-black border-none text-[10px] font-bold uppercase tracking-widest rounded-xl px-4 py-2 text-zinc-400 focus:ring-1 focus:ring-white outline-none"
              >
                {Object.values(AskMode).map(m => <option key={m} value={m}>{m} Mode</option>)}
              </select>
              <button 
                onClick={handleAsk}
                disabled={loading || (!input && !image)}
                className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl flex items-center gap-3 disabled:opacity-20 hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                <span>Ask DOT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Area */}
      {response && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Steps */}
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                  How to solve it
                </h3>
              </div>
              <div className="space-y-6">
                {response.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center font-mono text-xs text-zinc-500 group-hover:border-zinc-500 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex-1 text-zinc-200 leading-relaxed text-sm shadow-xl">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanations & Context */}
            <div className="space-y-8">
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                <h4 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-blue-400">
                  <BookOpen size={18} />
                  The Concept
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {response.explanation}
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
                <h4 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-emerald-400">
                  <Lightbulb size={18} />
                  Why it matters
                </h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {response.whyItMatters}
                </p>
              </div>

              {response.alternativeMethod && (
                <div className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[2.5rem] space-y-6">
                  <h4 className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-purple-400">
                    <ChevronRight size={18} />
                    Try this too
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed italic">
                    {response.alternativeMethod}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
