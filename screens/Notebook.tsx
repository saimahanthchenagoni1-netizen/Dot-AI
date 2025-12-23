
import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Trash2, MessageSquare, Sparkles, Plus, Loader2, ArrowRight
} from 'lucide-react';
import { chatWithNotebook } from '../geminiService';
import { NoteDocument } from '../types';

export const Notebook: React.FC = () => {
  const [docs, setDocs] = useState<NoteDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<NoteDocument | null>(null);
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dot_notes');
    if (saved) {
      const parsed = JSON.parse(saved);
      setDocs(parsed);
      if (parsed.length > 0) setActiveDoc(parsed[0]);
    }
  }, []);

  const saveDocs = (newDocs: NoteDocument[]) => {
    setDocs(newDocs);
    localStorage.setItem('dot_notes', JSON.stringify(newDocs));
  };

  const addDoc = () => {
    const name = prompt('Note name:');
    const content = prompt('Note content:');
    if (name && content) {
      const newDoc: NoteDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        content,
        type: 'text',
        uploadedAt: new Date().toISOString()
      };
      saveDocs([...docs, newDoc]);
      setActiveDoc(newDoc);
    }
  };

  const deleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDocs = docs.filter(d => d.id !== id);
    saveDocs(newDocs);
    if (activeDoc?.id === id) setActiveDoc(newDocs[0] || null);
  };

  const handleQuery = async () => {
    if (!query || !activeDoc) return;
    const userMsg = query;
    setChatLog(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await chatWithNotebook(userMsg, activeDoc.content);
      setChatLog(prev => [...prev, { role: 'ai', content: res || 'No response.' }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 bg-zinc-950 border border-zinc-900 rounded-[2rem] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2 text-zinc-300">
            <FileText size={18} />
            Library
          </h3>
          <button onClick={addDoc} className="p-2 hover:bg-zinc-900 rounded-lg text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {docs.map(doc => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className={`group w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeDoc?.id === doc.id ? 'bg-white text-black' : 'text-zinc-500 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <FileText size={16} />
                <span className="text-xs font-bold truncate">{doc.name}</span>
              </div>
              <Trash2 
                size={14} 
                className={`transition-opacity ${activeDoc?.id === doc.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => deleteDoc(doc.id, e)}
              />
            </button>
          ))}
          {docs.length === 0 && <div className="text-center py-10 text-xs text-zinc-600">No notes yet.</div>}
        </div>
      </div>

      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col">
          <h2 className="text-xl font-bold mb-6">{activeDoc?.name || 'Empty'}</h2>
          <div className="flex-1 bg-black/50 border border-zinc-900 rounded-3xl p-6 overflow-y-auto text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
            {activeDoc?.content || 'Click + to add your first study note.'}
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
            <Sparkles size={18} className="text-blue-400" />
            <span className="text-sm font-bold">DOT Intelligence</span>
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' ? 'bg-white text-black font-bold' : 'bg-zinc-900 text-zinc-300'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-start animate-pulse text-xs text-zinc-600">DOT is thinking...</div>}
          </div>
          <div className="p-6 bg-zinc-900/30">
            <div className="flex items-center gap-2 bg-black border border-zinc-800 p-2 rounded-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder="Query your note..."
                className="flex-1 bg-transparent px-4 text-xs focus:outline-none"
              />
              <button 
                onClick={handleQuery}
                disabled={loading || !query}
                className="p-3 bg-white text-black rounded-xl active:scale-95 transition-all"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
