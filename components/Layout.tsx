
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageSquareText, Notebook, GraduationCap, 
  Users, Menu, X, Search, Bell, BarChart3, CalendarRange
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-white text-black font-bold shadow-lg shadow-white/5' 
        : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] uppercase tracking-widest">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { to: '/', icon: MessageSquareText, label: 'Homework Help' },
    { to: '/analytics', icon: BarChart3, label: 'My Progress' },
    { to: '/planner', icon: CalendarRange, label: 'Study Schedule' },
    { to: '/notebook', icon: Notebook, label: 'My Notes' },
    { to: '/learn', icon: GraduationCap, label: 'Courses' },
    { to: '/community', icon: Users, label: 'Student Chat' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } fixed inset-y-0 left-0 bg-[#0a0a0a] border-r border-zinc-900 transition-all duration-500 z-50 flex flex-col shadow-2xl`}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center dot-glow">
            <div className="w-2.5 h-2.5 bg-black rounded-full" />
          </div>
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter uppercase">DOT Study</span>}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-900 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full py-3 bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-xs font-bold text-zinc-600 transition-all"
          >
            {isSidebarOpen ? 'LOG OUT' : 'EXIT'}
          </button>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-full p-2 text-zinc-700 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="h-20 border-b border-zinc-900/50 bg-black/80 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 bg-zinc-900/30 px-6 py-2.5 rounded-2xl border border-zinc-800/50 w-[32rem] group focus-within:border-zinc-500 transition-all">
            <Search size={16} className="text-zinc-600 group-focus-within:text-white" />
            <input 
              type="text" 
              placeholder="Search subjects, notes, or tasks..." 
              className="bg-transparent text-sm focus:outline-none w-full placeholder:text-zinc-700"
            />
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-xs font-bold tracking-widest text-zinc-400">HI, ALEX</div>
              <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Student Tier</div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 p-0.5">
              <img src="https://picsum.photos/seed/dot_student/40/40" alt="User" className="w-full h-full rounded-[0.9rem] grayscale" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
