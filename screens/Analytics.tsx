
import React from 'react';
import { BarChart3, TrendingUp, Calendar, Zap, Target } from 'lucide-react';

export const Analytics: React.FC = () => {
  const stats = [
    { label: 'Total Deep Work', value: '42.5h', icon: Zap, color: 'text-yellow-400' },
    { label: 'Average Score', value: '88%', icon: Target, color: 'text-emerald-400' },
    { label: 'Active Days', value: '18/30', icon: Calendar, color: 'text-blue-400' },
  ];

  const subjects = [
    { name: 'Physics', progress: 85, color: 'bg-blue-500' },
    { name: 'Calculus', progress: 62, color: 'bg-purple-500' },
    { name: 'History', progress: 94, color: 'bg-emerald-500' },
    { name: 'Economics', progress: 48, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-zinc-500 mt-2">Your knowledge velocity is up 12% from last week.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <s.icon size={20} className={s.color} />
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">+4.2%</div>
            </div>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 size={20} />
              Subject Mastery
            </h3>
            <select className="bg-black text-xs border border-zinc-800 rounded-lg px-2 py-1 outline-none">
              <option>Past 30 Days</option>
              <option>Semester</option>
            </select>
          </div>
          
          <div className="space-y-8">
            {subjects.map((sub) => (
              <div key={sub.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-zinc-300">{sub.name}</span>
                  <span className="text-xs text-zinc-500 font-mono">{sub.progress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sub.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${sub.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" />
            Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-white font-bold italic">Peak Performance:</span> You are 40% more efficient at solving <span className="text-blue-400">Physics</span> problems between 8 PM and 10 PM.
              </p>
            </div>
            <div className="p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-white font-bold italic">Attention Warning:</span> Mastery in <span className="text-red-400">Economics</span> has plateaued. Suggesting deeper focus sessions.
              </p>
            </div>
            <button className="w-full py-3 bg-zinc-900 text-zinc-400 text-xs font-bold rounded-xl hover:bg-white hover:text-black transition-all">
              DOWNLOAD REPORT (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
