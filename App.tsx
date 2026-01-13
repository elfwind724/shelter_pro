
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OutputDisplay from './components/OutputDisplay';
import HistoryPanel from './components/HistoryPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ThumbnailRemaster from './components/ThumbnailRemaster';
import { SelectionState, GeneratedContent, Preset, AnalyticsRecord } from './types';
import { generateContent, generateRandomSelections } from './services/generator';
import { CATEGORIES } from './constants';
import { Edit3, Eye } from 'lucide-react';

const App: React.FC = () => {
  // LAZY INITIALIZATION
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

  const [analyticsData, setAnalyticsData] = useState<AnalyticsRecord[]>(() => {
    try {
      const saved = localStorage.getItem('shelter_analytics');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load analytics", e);
      return [];
    }
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'results'>('editor');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRemaster, setShowRemaster] = useState(false); // NEW STATE

  useEffect(() => {
    try {
      const safeHistory = history.map(item => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { generatedImage, thumbnailImage, ...rest } = item;
        return rest;
      });
      localStorage.setItem('shelter_history', JSON.stringify(safeHistory));
    } catch (e) {
      console.warn("LocalStorage Quota Exceeded for History", e);
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

  useEffect(() => {
    try {
      localStorage.setItem('shelter_analytics', JSON.stringify(analyticsData));
    } catch (e) {
      console.warn("LocalStorage Quota Exceeded for Analytics", e);
    }
  }, [analyticsData]);

  // MUTUAL EXCLUSIVITY LOGIC FOR LOCATION CATEGORIES
  const LOCATION_CATEGORIES = ['cat_vehicles', 'cat_shelters', 'cat_semi_open'];

  const handleSelectionChange = (categoryId: string, itemId: string) => {
    setSelections(prev => {
      const category = CATEGORIES.find(c => c.id === categoryId);
      if (!category) return prev;

      // Logic: If user clicks a Location Category (Vehicle, Shelter, Semi-Open)
      // We must clear the other two location categories to ensure single location.
      let nextSelections = { ...prev };
      
      if (LOCATION_CATEGORIES.includes(categoryId)) {
          // Clear others
          LOCATION_CATEGORIES.forEach(c => {
              if (c !== categoryId) nextSelections[c] = [];
          });
      }

      const currentSelected = nextSelections[categoryId] || [];
      let newSelected: string[];

      if (category.type === 'single') {
        newSelected = currentSelected.includes(itemId) ? [] : [itemId];
      } else {
        newSelected = currentSelected.includes(itemId) 
          ? currentSelected.filter(id => id !== itemId)
          : [...currentSelected, itemId];
      }

      return { ...nextSelections, [categoryId]: newSelected };
    });
  };

  const handleBatchSelection = (newSelections: SelectionState) => {
    setSelections(newSelections);
  };

  const handleGenerate = (selectionsOverride?: SelectionState) => {
    const currentSelections = selectionsOverride || selections;
    
    // Check if at least ONE location is selected
    const hasLocation = LOCATION_CATEGORIES.some(c => currentSelections[c] && currentSelections[c].length > 0);
    const hasWeather = currentSelections['weather'] && currentSelections['weather'].length > 0;

    if (!hasLocation) {
      alert("请至少选择一个场景 (载具 / 建筑 / 半开放)");
      return;
    }
    if (!hasWeather) {
      alert("请选择天气条件");
      return;
    }

    const content = generateContent(currentSelections);
    setGeneratedContent(content);
    addToHistory(content);
    setActiveMobileTab('results');
  };

  const handleRandom = () => {
    const randomSelections = generateRandomSelections();
    setSelections(randomSelections);
    const content = generateContent(randomSelections);
    setGeneratedContent(content);
    addToHistory(content);
    setActiveMobileTab('results');
  };

  const addToHistory = (content: GeneratedContent) => {
    setHistory(prev => {
      const filtered = prev.filter(i => i.id !== content.id);
      const newHistory = [content, ...filtered];
      return newHistory.slice(0, 20);
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
    setActiveMobileTab('results'); 
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

  // --- Analytics Handlers ---
  const handleAddAnalytics = (record: AnalyticsRecord) => {
    setAnalyticsData(prev => [record, ...prev]);
  };

  const handleDeleteAnalytics = (id: string) => {
    setAnalyticsData(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden text-slate-200 font-sans">
      
      {/* Mobile Tab Navigation */}
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
        {/* Sidebar */}
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
            onOpenAnalytics={() => setShowAnalytics(true)}
            onOpenRemaster={() => setShowRemaster(true)}
          />
        </div>

        {/* Main Content Area */}
        <div className={`${activeMobileTab === 'editor' ? 'hidden' : 'flex'} md:flex flex-1 flex-col h-full min-w-0 bg-slate-950`}>
          <main className="flex-1 overflow-hidden relative">
            <OutputDisplay 
              content={generatedContent} 
              onToggleFavorite={toggleFavorite}
              isFavorite={!!generatedContent && favorites.some(f => f.id === generatedContent.id)}
            />
          </main>
          <HistoryPanel 
            history={history} 
            favorites={favorites} 
            onSelect={restoreFromHistory} 
            onDelete={deleteItem}
            onClearAll={handleClearAllHistory}
          />
        </div>
      </div>

      {showAnalytics && (
        <AnalyticsDashboard 
          data={analyticsData}
          onAdd={handleAddAnalytics}
          onDelete={handleDeleteAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showRemaster && (
        <ThumbnailRemaster onClose={() => setShowRemaster(false)} />
      )}
    </div>
  );
};

export default App;
