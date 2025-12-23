
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const Onboarding: React.FC<{ onComplete: (name: string) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [showLogoAnim, setShowLogoAnim] = useState(false);

  const handleNext = () => {
    if (step === 1 && name) setStep(2);
    else if (step === 2 && source) {
      setShowLogoAnim(true);
      setTimeout(() => onComplete(name), 2500);
    }
  };

  if (showLogoAnim) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center animate-pulse-dot shadow-2xl">
          <div className="w-5 h-5 bg-black rounded-full" />
        </div>
        <div className="text-2xl font-black tracking-tighter uppercase animate-in slide-in-from-bottom-4 duration-1000">
          DOT Assistant
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-[1.5rem] mx-auto flex items-center justify-center shadow-2xl mb-4">
            <div className="w-4 h-4 bg-black rounded-full" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Setting up DOT</h1>
        </div>

        {step === 1 ? (
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-bold">What is your name?</h2>
              <p className="text-zinc-500 text-sm">Let's get your profile ready.</p>
            </div>
            <input 
              autoFocus
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name && handleNext()}
              placeholder="Your name..."
              className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-white/20 transition-all text-center text-xl font-bold placeholder:text-zinc-700"
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-bold">Welcome, {name}.</h2>
              <p className="text-zinc-500 text-sm">How did you find DOT?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Social Media', 'A Friend', 'A Website', 'Somewhere else'].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => { setSource(opt); handleNext(); }}
                  className={`w-full py-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between px-6 ${
                    source === opt ? 'bg-white text-black border-white shadow-xl' : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  {opt}
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <button 
            disabled={!name}
            onClick={handleNext}
            className="w-full py-4 bg-white text-black font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all disabled:opacity-20 uppercase tracking-widest text-xs shadow-xl"
          >
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
