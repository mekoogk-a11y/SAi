import React from 'react';
import { Search, MessageSquare, FileText, Heart, Code, ChevronLeft } from 'lucide-react';

interface GlobalSearchViewProps {
  query: string;
  setQuery: (q: string) => void;
  setActiveView: (view: string) => void;
  savedChats: any[];
}

export const GlobalSearchView: React.FC<GlobalSearchViewProps> = ({
  query,
  setQuery,
  setActiveView,
  savedChats
}) => {

  const filteredChats = savedChats.filter(c => 
    c.title?.toLowerCase().includes(query.toLowerCase()) || 
    c.snippet?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">نتائج البحث الشامل الموحد</h2>
            <p className="text-xs text-zinc-400">البحث في محادثاتك، المستندات، والموسوعة المعرفية</p>
          </div>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="أكتب كلمة للبحث عنها..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Results Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
          المحادثات المأرشفة والنتاجات المنيعة ({filteredChats.length})
        </h3>

        {filteredChats.length === 0 ? (
          <div className="p-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-center text-zinc-500 text-xs">
            لم يتم العثور على أية نتائج مطابقة للكلمة البحثية "{query}".
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveView('chat')}
              className="w-full p-4 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-2xl text-right transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                    {chat.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-1">{chat.snippet}</p>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-zinc-500 group-hover:translate-x-[-2px] transition-transform" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GlobalSearchView;
