
import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Loader2, X, Inbox, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

type AuthView = 'login' | 'signup' | 'verify';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showMailbox, setShowMailbox] = useState(false);

  const handleAction = async () => {
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (view === 'login') {
      if (email && password) {
        onLogin(email);
      } else {
        setError('Please enter your email and password.');
      }
    } else if (view === 'signup') {
      if (email.includes('@') && password.length >= 6) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        setView('verify');
        setTimeout(() => setShowMailbox(true), 500);
      } else {
        setError('Valid email and 6+ character password required.');
      }
    } else if (view === 'verify') {
      if (enteredCode === generatedCode) {
        onLogin(email);
      } else {
        setError("Invalid code. Please try again.");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden text-white font-sans selection:bg-white selection:text-black">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none" />

      {showMailbox && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#111] border border-white/5 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-zinc-900/50 p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Mail size={16} className="text-black" />
                </div>
                <h3 className="text-sm font-bold">Your Verification Code</h3>
              </div>
              <button onClick={() => setShowMailbox(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              <header className="space-y-2 text-center">
                <h2 className="text-xl font-bold">Verify Your Account</h2>
                <div className="text-xs text-zinc-500">Sent to: {email}</div>
              </header>

              <div className="bg-white/5 p-8 rounded-[2rem] text-center space-y-4 border border-white/5">
                <div className="text-5xl font-black tracking-[0.4em] text-white font-mono">
                  {generatedCode}
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Use this code to login</p>
              </div>

              <button 
                onClick={() => { setEnteredCode(generatedCode); setShowMailbox(false); }}
                className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs"
              >
                Use This Code <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-10 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white rounded-[1.8rem] mx-auto flex items-center justify-center shadow-2xl mb-6">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">DOT</h1>
          <p className="text-zinc-500 text-xs font-bold tracking-[0.3em] uppercase">Personal AI Assistant</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl space-y-8">
          <header className="text-center">
            <h3 className="text-xl font-bold">
              {view === 'login' ? 'Login' : view === 'signup' ? 'Create Account' : 'Verify Code'}
            </h3>
            <p className="text-zinc-500 text-xs mt-2">
              {view === 'verify' ? 'We sent a code to your email.' : 'Login to start chatting with DOT.'}
            </p>
          </header>

          <div className="space-y-4">
            {view !== 'verify' ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-white/20 transition-all text-sm"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <input 
                  type="text" 
                  maxLength={6}
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  placeholder="000000"
                  className="w-full bg-black border border-white/10 rounded-[2rem] px-5 py-6 text-center text-4xl font-mono tracking-[0.3em] font-black"
                />
                <button 
                  onClick={() => setShowMailbox(true)}
                  className="w-full py-4 bg-zinc-900 rounded-2xl text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Inbox size={14} /> Open Inbox
                </button>
              </div>
            )}
          </div>

          {error && <div className="text-red-400 text-xs font-bold text-center">{error}</div>}

          <button 
            onClick={handleAction}
            disabled={isLoading}
            className="w-full py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : view === 'login' ? 'Login' : view === 'signup' ? 'Continue' : 'Verify'}
          </button>

          <button 
            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            className="w-full text-xs font-bold text-zinc-600 hover:text-white transition-colors"
          >
            {view === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
