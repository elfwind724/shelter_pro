import React from 'react';
import { GeneratedContent } from '../types';
import { Clock, Star, Trash2, XCircle } from 'lucide-react';

interface HistoryPanelProps {
  history: GeneratedContent[];
  favorites: GeneratedContent[];
  onSelect: (item: GeneratedContent) => void;
  onDelete: (item: GeneratedContent) => void;
  onClearAll: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, favorites, onSelect, onDelete, onClearAll }) => {
  const [activeTab, setActiveTab] = React.useState<'history' | 'favorites'>('history');

  const items = activeTab === 'history' ? history : favorites;

  return (
    <div className="h-40 bg-slate-900 border-t border-slate-800 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === 'history' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Clock size={12} /> History
          </button>
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              activeTab === 'favorites' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            <Star size={12} /> Favorites
          </button>
        </div>
        
        {activeTab === 'history' && history.length > 0 && (
          <button 
            onClick={onClearAll}
            className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
          >
            <XCircle size={12} /> Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-x-auto flex items-center gap-3 px-4 pb-4 scrollbar-hide">
        {items.length === 0 ? (
          <div className="w-full text-center text-slate-600 text-xs italic">
            No {activeTab} yet. Generate some prompts!
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="flex-shrink-0 w-56 h-20 bg-slate-800 border border-slate-700 rounded-lg relative overflow-hidden group hover:border-slate-500 transition-all"
            >
               {/* Clickable Area */}
              <button
                onClick={() => onSelect(item)}
                className="w-full h-full p-3 text-left z-10 relative"
              >
                <div className="text-xs font-bold text-slate-200 truncate mb-1 pr-6">
                  {item.youtubeTitle.split('|')[0]}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                  <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <div className={`px-1.5 py-0.5 rounded ${
                      item.score >= 90 ? 'bg-green-900/50 text-green-400' : 
                      item.score >= 70 ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'
                  } font-mono font-bold`}>
                    Score: {item.score}
                  </div>
                </div>
              </button>

              {/* Delete Button (Visible on Hover) */}
              <button
                 onClick={(e) => {
                   e.stopPropagation();
                   onDelete(item);
                 }}
                 className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-700/80 text-slate-400 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20"
                 title="Delete"
              >
                <Trash2 size={12} />
              </button>
              
              {/* Highlight active tab context */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeTab === 'favorites' ? 'bg-yellow-500' : 'bg-orange-500'}`}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;