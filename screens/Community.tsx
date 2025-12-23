
import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Flag,
  Award,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';

const initialExplanations = [
  {
    id: 1,
    author: 'Dr. Sarah Chen',
    role: 'Teacher',
    title: 'Visualizing Quantum Entanglement',
    subject: 'Physics',
    content: 'Think of entanglement not as hidden signals, but as two dice that always show the same number when rolled...',
    likes: 1240,
    comments: 84,
  },
  {
    id: 2,
    author: 'Marcus J.',
    role: 'Verified Student',
    title: 'Shortcuts for Partial Fractions',
    subject: 'Calculus',
    content: 'Most students struggle with the Heaviside Cover-up method, but if you look at the roots first...',
    likes: 856,
    comments: 32,
  }
];

export const Community: React.FC = () => {
  const [exps, setExps] = useState(initialExplanations);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter(i => i !== id));
      setExps(exps.map(e => e.id === id ? { ...e, likes: e.likes - 1 } : e));
    } else {
      setLikedIds([...likedIds, id]);
      setExps(exps.map(e => e.id === id ? { ...e, likes: e.likes + 1 } : e));
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Community Core</h1>
          <p className="text-zinc-500 text-sm">Validating collective knowledge through peer intelligence.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 rounded-2xl px-5 py-3 w-72 focus-within:border-zinc-500 transition-all">
            <Search size={18} className="text-zinc-600" />
            <input type="text" placeholder="Search knowledge..." className="bg-transparent text-sm focus:outline-none w-full" />
          </div>
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-white transition-all text-zinc-500">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
              <Award size={18} className="text-yellow-500" />
              Intelligence Feed
            </h2>
          </div>

          <div className="space-y-8">
            {exps.map((exp) => (
              <div key={exp.id} className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 hover:border-zinc-700 transition-all space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={`https://picsum.photos/seed/${exp.author}/40/40`} className="w-10 h-10 rounded-2xl border border-zinc-800 grayscale" alt={exp.author} />
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        {exp.author}
                        <CheckCircle2 size={12} className="text-blue-400" />
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 font-black uppercase tracking-widest">{exp.role}</span>
                      </div>
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{exp.subject}</div>
                    </div>
                  </div>
                  <button className="text-zinc-700 hover:text-white transition-colors"><Share2 size={18} /></button>
                </div>
                <h3 className="text-2xl font-black tracking-tight">{exp.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {exp.content}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => toggleLike(exp.id)}
                      className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${likedIds.includes(exp.id) ? 'text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
                      <ThumbsUp size={18} className={likedIds.includes(exp.id) ? 'fill-current' : ''} /> {exp.likes}
                    </button>
                    <button className="flex items-center gap-2 text-zinc-600 hover:text-zinc-300 text-xs font-black uppercase tracking-widest transition-all">
                      <MessageSquare size={18} /> {exp.comments}
                    </button>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-red-500 transition-colors flex items-center gap-2">
                    <Flag size={14} /> Flag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-400">
              <Users size={18} className="text-blue-400" />
              Node Leaders
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Dr. Sarah Chen', points: '14.2k', rank: 1, color: 'bg-yellow-500' },
                { name: 'PhysicsPro_99', points: '12.8k', rank: 2, color: 'bg-zinc-300' },
                { name: 'Curriculum_Lead', points: '9.4k', rank: 3, color: 'bg-orange-600' },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-xl ${c.color} text-black flex items-center justify-center font-black text-xs`}>
                      {c.rank}
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{c.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600 font-bold">{c.points} IX</span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-500 transition-all">
              Full Network Leaderboard
            </button>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] p-8 space-y-6">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-600">Core Impact</h3>
            <div className="space-y-2">
              <div className="text-4xl font-black tracking-tighter">124,592</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Validated Data Points</div>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">
              Knowledge is a global common. DOT Intelligence is fueled by the community to ensure high-fidelity learning for all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
