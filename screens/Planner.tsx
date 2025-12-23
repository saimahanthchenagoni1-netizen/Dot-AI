
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { suggestTasks } from '../geminiService.ts';
import { Task } from '../types.ts';

export const Planner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dot_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('dot_tasks', JSON.stringify(newTasks));
  };

  const handleSuggest = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const suggestions = await suggestTasks(goal);
      const newTasks: Task[] = suggestions.map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
      }));
      saveTasks([...newTasks, ...tasks]);
      setGoal('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Planner</h1>
          <p className="text-zinc-500 mt-2">Plan with precision. Execute with DOT.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</div>
          <div className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Workspace / Schedule</div>
        </div>
      </header>

      {/* AI Suggestion Box */}
      <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2rem] space-y-4 focus-within:border-zinc-700 transition-all">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 mb-2">
          <Sparkles size={16} className="text-blue-400" />
          Smart Suggestion
        </div>
        <div className="flex gap-4">
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSuggest()}
            placeholder="What's your main goal for today?"
            className="flex-1 bg-black border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-zinc-500 transition-all"
          />
          <button 
            onClick={handleSuggest}
            disabled={loading || !goal}
            className="px-8 bg-white text-black font-bold rounded-2xl flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            Plan
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold">Tasks</h2>
          <span className="text-xs text-zinc-600 font-bold uppercase">{tasks.filter(t => t.completed).length}/{tasks.length} Done</span>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-zinc-950 rounded-3xl border border-dashed border-zinc-800 text-zinc-600">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p>No tasks planned yet. Try the AI suggestion above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group flex items-center gap-4 p-5 bg-zinc-950 border rounded-2xl transition-all ${
                  task.completed ? 'border-zinc-900 opacity-50' : 'border-zinc-900 hover:border-zinc-700'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 ${task.completed ? 'text-emerald-500' : 'text-zinc-700 hover:text-zinc-400'} transition-colors`}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1">
                  <h3 className={`font-bold transition-all ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 bg-zinc-900 rounded">{task.subject}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock size={10} /> {task.duration}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
