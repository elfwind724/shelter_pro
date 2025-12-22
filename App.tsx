
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OutputDisplay from './components/OutputDisplay';
import HistoryPanel from './components/HistoryPanel';
import { SelectionState, GeneratedContent, Preset } from './types';
import { generateContent, generateRandomSelections } from './services/generator';
import { CATEGORIES } from './constants';
import { Edit3, Eye } from 'lucide-react';

const App: React.FC = () => {
  // LAZY INITIALIZATION: Fixes the bug where data is overwritten by empty arrays on mount
  const [selections, setSelections] = useState<SelectionState>({});
  
  const [history, setHistory] = useState<GeneratedContent[]>(() => {
    try {
      const saved = localStorage.getItem('shelter_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });

  const [favorites, setFavorites] = useState<GeneratedContent[]>(() => {
    try {
      const saved = localStorage.getItem('shelter_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favorites", e);
      return [];
    }
  });

  const [presets, setPresets] = useState<Preset[]>(() => {
    try {
      const saved = localStorage.getItem('shelter_presets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load presets", e);
      return [];
    }
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'results'>('editor');

  // Save to local storage whenever state changes
  // CRITICAL FIX: Strip images before saving to prevent QuotaExceededError (LocalStorage 5MB limit)
  useEffect(() => {
    try {
      const safeHistory = history.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { generatedImage, thumbnailImage, ...rest } = item;
        return rest;
      });
      localStorage.setItem('shelter_history', JSON.stringify(safeHistory));
    } catch (e) {
      console.warn("LocalStorage Quota Exceeded for History. Oldest items might be lost.", e);
      // Emergency fallback: slice harder if still failing
      try {
        const safeHistory = history.slice(0, 5).map(item => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { generatedImage, thumbnailImage, ...rest } = item;
            return rest;
        });
        localStorage.setItem('shelter_history', JSON.stringify(safeHistory));
      } catch (e2) {
         console.error("Critical Storage Error", e2);
      }
    }
  }, [history]);

  useEffect(() => {
    try {
      const safeFavorites = favorites.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { generatedImage, thumbnailImage, ...rest } = item;
        return rest;
      });
      localStorage.setItem('shelter_favorites', JSON.stringify(safeFavorites));
    } catch (e) {
      console.warn("LocalStorage Quota Exceeded for Favorites", e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('shelter_presets', JSON.stringify(presets));
    } catch (e) {
      console.warn("LocalStorage Quota Exceeded for Presets", e);
    }
  }, [presets]);

  const handleSelectionChange = (categoryId: string, itemId: string) => {
    setSelections(prev => {
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (!category) return prev;

      const currentSelected = prev[categoryId] || [];
      let newSelected: string[];

      if (category.type === 'single') {
        // Toggle if same clicked, otherwise set new
        newSelected = currentSelected.includes(itemId) ? [] : [itemId];
      } else {
        // Multi select
        newSelected = currentSelected.includes(itemId) 
          ? currentSelected.filter(id => id !== itemId)
          : [...currentSelected, itemId];
      }

      return { ...prev, [categoryId]: newSelected };
    });
  };

  const handleBatchSelection = (newSelections: SelectionState) => {
    setSelections(newSelections);
  };

  const handleGenerate = (selectionsOverride?: SelectionState) => {
    // 强制识别是否传入了覆盖参数（如从增长计划点击）
    const isOverride = selectionsOverride && selectionsOverride.structure && selectionsOverride.weather;
    const currentSelections = isOverride ? selectionsOverride : selections;

    // Basic validation: ensure required categories have selections
    const missingRequired = CATEGORIES.filter(c => c.required && (!currentSelections[c.id] || currentSelections[c.id].length === 0));
    
    if (missingRequired.length > 0) {
      alert(`请完善必填参数: ${missingRequired.map(c => c.title).join(', ')}`);
      return;
    }

    const content = generateContent(currentSelections);
    setGeneratedContent(content);
    addToHistory(content);
    
    // Auto-switch to results on mobile
    setActiveMobileTab('results');
  };

  const handleRandom = () => {
    const randomSelections = generateRandomSelections();
    setSelections(randomSelections);
    // Auto generate after random selection
    const content = generateContent(randomSelections);
    setGeneratedContent(content);
    addToHistory(content);
    
    // Auto-switch to results on mobile
    setActiveMobileTab('results');
  };

  const addToHistory = (content: GeneratedContent) => {
    setHistory(prev => {
      // Remove duplicates based on ID if any
      const filtered = prev.filter(i => i.id !== content.id);
      const newHistory = [content, ...filtered];
      return newHistory.slice(0, 20); // Limit to 20
    });
  };

  const toggleFavorite = (item: GeneratedContent) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [item, ...prev];
    });
  };

  const deleteItem = (itemToDelete: GeneratedContent) => {
     setHistory(prev => prev.filter(item => item.id !== itemToDelete.id));
     setFavorites(prev => prev.filter(item => item.id !== itemToDelete.id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete ALL history items? Favorites will remain.")) {
      setHistory([]);
    }
  };

  const restoreFromHistory = (item: GeneratedContent) => {
    setGeneratedContent(item);
    setSelections(item.selectedItems);
    setActiveMobileTab('results'); // Switch to view when restored
  };

  // --- Preset Handlers ---

  const handleSavePreset = (name: string) => {
    if (!name.trim()) return;
    const newPreset: Preset = {
      id: crypto.randomUUID(),
      name: name.trim(),
      selections: selections,
      timestamp: Date.now()
    };
    setPresets(prev => [newPreset, ...prev]);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setSelections(preset.selections);
    }
  };

  const handleDeletePreset = (presetId: string) => {
    if (window.confirm("Delete this preset?")) {
      setPresets(prev => prev.filter(p => p.id !== presetId));
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      
      {/* Mobile Tab Navigation (Visible only on Mobile) */}
      <div className="md:hidden flex items-center border-b border-slate-800 bg-slate-900 shrink-0 h-12">
        <button 
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 h-full text-sm font-bold transition-colors ${
            activeMobileTab === 'editor' ? 'text-orange-500 bg-slate-800/50' : 'text-slate-500'
          }`}
        >
          <Edit3 size={16} /> Editor
        </button>
        <div className="w-px h-6 bg-slate-800"></div>
        <button 
          onClick={() => setActiveMobileTab('results')}
          className={`flex-1 flex items-center justify-center gap-2 h-full text-sm font-bold transition-colors ${
            activeMobileTab === 'results' ? 'text-green-400 bg-slate-800/50' : 'text-slate-500'
          }`}
        >
          <Eye size={16} /> Results
          {generatedContent && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile if tab is 'results' */}
        <div className={`${activeMobileTab === 'results' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-96 border-r border-slate-800 h-full`}>
          <Sidebar 
            selections={selections} 
            onSelectionChange={handleSelectionChange} 
            onBatchSelectionChange={handleBatchSelection}
            onGenerate={handleGenerate}
            onRandom={handleRandom}
            presets={presets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        </div>

        {/* Main Content Area - Hidden on mobile if tab is 'editor' */}
        <div className={`${activeMobileTab === 'editor' ? 'hidden' : 'flex'} md:flex flex-1 flex-col h-full min-w-0 bg-slate-950`}>
          
          {/* Output Area */}
          <main className="flex-1 overflow-hidden relative">
            <OutputDisplay 
              content={generatedContent} 
              onToggleFavorite={toggleFavorite}
              isFavorite={!!generatedContent && favorites.some(f => f.id === generatedContent.id)}
            />
          </main>

          {/* Bottom Bar */}
          <HistoryPanel 
            history={history} 
            favorites={favorites} 
            onSelect={restoreFromHistory} 
            onDelete={deleteItem}
            onClearAll={handleClearAllHistory}
          />
          
        </div>
      </div>
    </div>
  );
};

export default App;
