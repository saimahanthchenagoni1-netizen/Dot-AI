
import React from 'react';
import { 
  GraduationCap, 
  ChevronRight, 
  Lock, 
  Play, 
  Star,
  Search
} from 'lucide-react';

const subjects = [
  { id: 'math', name: 'Mathematics', topics: 42, icon: '∑', color: 'bg-blue-500' },
  { id: 'physics', name: 'Physics', topics: 28, icon: '⚛', color: 'bg-purple-500' },
  { id: 'bio', name: 'Biology', topics: 35, icon: '🧬', color: 'bg-emerald-500' },
  { id: 'chem', name: 'Chemistry', topics: 31, icon: '🧪', color: 'bg-red-500' },
  { id: 'cs', name: 'Computer Science', topics: 18, icon: '💻', color: 'bg-zinc-700' },
  { id: 'econ', name: 'Economics', topics: 22, icon: '📈', color: 'bg-amber-500' },
];

export const Learn: React.FC = () => {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Concept Mastery</h1>
          <p className="text-zinc-500">Pick a subject and start your personalized learning path.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2 w-full md:w-80">
          <Search size={18} className="text-zinc-600" />
          <input type="text" placeholder="Search subjects..." className="bg-transparent text-sm focus:outline-none w-full" />
        </div>
      </header>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <div key={sub.id} className="group bg-zinc-950 border border-zinc-900 p-6 rounded-3xl hover:border-zinc-700 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold ${sub.color} bg-opacity-10 text-white`}>
                {sub.icon}
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-400 font-bold">
                <Star size={12} fill="currentColor" />
                Popular
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{sub.name}</h3>
            <p className="text-zinc-500 text-sm mb-6">{sub.topics} modules curated by DOT</p>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${sub.id + i}/24/24`} className="w-6 h-6 rounded-full border-2 border-zinc-950" alt="Student" />
                ))}
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] border-2 border-zinc-950 text-zinc-500">+1k</div>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-1 transition-transform">
                Explore <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Continue Learning */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Play size={20} className="text-blue-400 fill-current" />
            Jump Back In
          </h2>
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-all" />
            <div className="space-y-4">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Advanced Mathematics</div>
              <h3 className="text-2xl font-bold">Multivariable Calculus: Vector Fields</h3>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[65%]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Module 4 of 12 completed</span>
                <button className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                  Resume Lesson
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap / Skill Tree Preview */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap size={20} />
            Learning Paths
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Foundations of Algebra', status: 'completed', icon: CheckCircle },
              { name: 'Linear Equations & Graphs', status: 'current', icon: PlayCircle },
              { name: 'Functions & Modeling', status: 'locked', icon: Lock },
              { name: 'Quadratic Equations', status: 'locked', icon: Lock },
            ].map((node, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                node.status === 'current' ? 'bg-zinc-900/50 border-zinc-700' : 'bg-transparent border-zinc-900'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  node.status === 'completed' ? 'text-emerald-500' : node.status === 'current' ? 'text-blue-400' : 'text-zinc-700'
                }`}>
                  <node.icon size={20} />
                </div>
                <span className={`text-sm font-medium ${node.status === 'locked' ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {node.name}
                </span>
                {node.status === 'current' && <span className="ml-auto text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">ACTIVE</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const PlayCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
  </svg>
);
