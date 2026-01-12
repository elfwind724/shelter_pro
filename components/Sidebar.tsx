
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { SelectionState, Preset } from '../types';
import { parsePromptToSelections } from '../services/generator';
import { 
  Check, ChevronDown, ChevronUp, Zap, RotateCcw, Save, Trash2, FolderOpen, X, 
  BookOpen, Terminal, Calendar, PlayCircle, Info, Wand2, Eye, History, Settings2, Target,
  Cpu, Lightbulb, PenTool, Layers, AlertTriangle, Aperture, Fingerprint, Palette, Link as LinkIcon,
  Brain, Globe, Layout, Type, Eraser, Box, ScanFace, FileJson, TrendingUp
} from 'lucide-react';

interface SidebarProps {
  selections: SelectionState;
  onSelectionChange: (categoryId: string, itemId: string) => void;
  onBatchSelectionChange: (selections: SelectionState) => void;
  onGenerate: (selections?: SelectionState) => void;
  onRandom: () => void;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
  onOpenAnalytics: () => void; // New prop for Analytics
}

// 2026年1月 HAVEN NIGHTS 战略发布计划 (CONTENT MATRIX)
const SHELTER_UNIVERSE_PLAN = [
  { 
    week: "Series A: Pure Ambience", 
    theme: "纯环境音 (SEO Traffic) - 8 Hours", 
    items: [
      { 
        title: "A1: Basement Shelter Rain", 
        selections: { 
          structure: ['slt_und_bunker'], weather: ['wth_rain_heavy'], time: ['time_night'], warmth: ['fireplace'], 
          defense: ['def_door_heavy'], duration: ['8h'], 
          danger: ['none'], sleeping: ['sleep_floor_pile'], shot_type: ['dist_medium'], amenities: ['am_bookshelf'],
          pets: ['none'], perspective: ['cam_standard'], visual_style: ['realistic_8k']
        } 
      },
      { 
        title: "A2: Attic Hideout Storm",
        selections: { 
          structure: ['slt_high_apt'], weather: ['wth_rain_thunder'], time: ['time_night'], warmth: ['candles'], 
          defense: ['def_window_shutter'], duration: ['8h'], 
          danger: ['none'], sleeping: ['sleep_window_alcove'], shot_type: ['dist_medium'], amenities: ['am_plants'],
          pets: ['none'], perspective: ['cam_standard'], visual_style: ['realistic_8k']
        } 
      },
      { 
        title: "A3: Underground Bunker",
        selections: { 
          structure: ['slt_und_civil'], weather: ['wth_rain_heavy'], time: ['time_night'], warmth: ['heater'], 
          defense: ['def_door_heavy'], duration: ['8h'], 
          danger: ['none'], sleeping: ['sleep_bunk_curtain'], shot_type: ['dist_medium'], amenities: ['am_radio'],
          pets: ['none'], perspective: ['cam_cctv'], visual_style: ['waste_gritty']
        } 
      },
      { 
        title: "A4: Abandoned Cabin",
        selections: { 
          structure: ['sem_leanto'], weather: ['wth_rain_lush'], time: ['time_dusk'], warmth: ['firepit'], 
          defense: ['none'], duration: ['8h'], 
          danger: ['none'], sleeping: ['sleep_floor_pile'], shot_type: ['dist_long'], amenities: ['am_kitchen'],
          pets: ['none'], perspective: ['cam_standard'], visual_style: ['nature_earth']
        } 
      }
    ]
  },
  { 
    week: "Series B: Cozy Ambience", 
    theme: "环境音 + 音乐 (Brand) - 2 Hours", 
    items: [
      { 
        title: "B1: Basement + Soft Piano",
        selections: { 
          structure: ['slt_und_apt'], weather: ['wth_rain_med'], time: ['time_night'], warmth: ['oil_lamp'], 
          duration: ['2h'], character: ['inst_piano'],
          defense: ['none'], sleeping: ['sleep_sofa_lie'], shot_type: ['dist_medium'], amenities: ['am_plants', 'am_coffee'],
          perspective: ['cam_standard'], visual_style: ['light_academia'], textures: ['dec_blanket_knit']
        } 
      },
      { 
        title: "B2: Bunker + Lofi Beats",
        selections: { 
          structure: ['slt_und_luxbunker'], weather: ['wth_rain_heavy'], time: ['time_night'], warmth: ['hologram'], 
          duration: ['2h'], character: ['act_laptop'],
          defense: ['def_door_heavy'], sleeping: ['sleep_round_lux'], shot_type: ['dist_medium'], amenities: ['am_gaming', 'am_desk'],
          perspective: ['cam_standard'], visual_style: ['cyber_neon'], textures: ['dec_beanbag']
        } 
      },
      { 
        title: "B3: Treehouse + Guitar",
        selections: { 
          structure: ['slt_high_treehouse'], weather: ['wth_rain_light'], time: ['time_morning'], warmth: ['stove'], 
          duration: ['2h'], character: ['inst_guitar'],
          defense: ['none'], sleeping: ['sleep_hammock_fur'], shot_type: ['dist_medium'], amenities: ['am_plants', 'am_tea'],
          perspective: ['cam_terrace'], visual_style: ['cottagecore'], textures: ['dec_rug_fur']
        } 
      }
    ]
  },
  { 
    week: "Series C: Cinematic Stories", 
    theme: "视觉叙事 (Loyalty) - 故事片", 
    items: [
      { 
        title: "C1: Last Night in Bunker",
        selections: { 
          structure: ['slt_und_bunker'], weather: ['wth_rain_thunder'], time: ['time_night'], warmth: ['oil_lamp'], 
          duration: ['2h'], character: ['act_read'],
          defense: ['def_door_heavy'], sleeping: ['sleep_bunk_curtain'], shot_type: ['dist_medium'], amenities: ['am_map', 'am_radio'],
          perspective: ['cam_cinematic'], visual_style: ['waste_rusty'], textures: ['dec_tapestry']
        } 
      },
      { 
        title: "C2: Finding Sanctuary",
        selections: { 
          structure: ['slt_gnd_church'], weather: ['wth_rain_heavy'], time: ['time_night'], warmth: ['candles'], 
          duration: ['2h'], character: ['act_sleep_floor'],
          defense: ['def_window_bars'], sleeping: ['sleep_floor_pile'], shot_type: ['dist_long'], amenities: ['am_backpack'],
          perspective: ['cam_low'], visual_style: ['gothic_noir'], textures: ['dec_rug_fur']
        } 
      },
      { 
        title: "C3: The Safest Place",
        selections: { 
          structure: ['slt_und_bank'], weather: ['wth_rain_heavy'], time: ['time_night'], warmth: ['heater'], 
          duration: ['8h'], character: ['act_sleep_bed'],
          defense: ['def_door_heavy'], sleeping: ['sleep_platform_low'], shot_type: ['dist_wide'], amenities: ['am_money_stacks'],
          perspective: ['cam_high'], visual_style: ['cinematic_35mm'], textures: ['dec_pillow_sea']
        } 
      }
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [openCategories, setOpenCategories] = useState<string[]>(['cat_shelters', 'weather', 'warmth']); // Default expanded
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const executePlanItem = (item: any) => {
    // 同步勾选状态到父组件
    props.onBatchSelectionChange(item.selections);
    
    // 自动展开包含这些选项的侧边栏分类
    const categoriesToOpen = Object.keys(item.selections);
    setOpenCategories(prev => Array.from(new Set([...prev, ...categoriesToOpen])));
    
    setIsPlanOpen(false);
    
    // 稍等片刻让 React 状态生效，然后执行生成
    setTimeout(() => {
      props.onGenerate(item.selections);
    }, 100);
  };

  const handleSave = () => {
    const name = prompt("Enter preset name:");
    if (name) props.onSavePreset(name);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-full md:w-96 overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black flex items-center gap-3 text-white tracking-tighter">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">🛖</div>
            SHELTER <span className="text-orange-500">SEO</span>
          </h1>
          <div className="flex gap-2">
            <button onClick={() => props.onOpenAnalytics()} className="p-2 bg-green-900/20 text-green-400 rounded-xl border border-green-500/30 hover:bg-green-600 hover:text-white hover:border-green-500 transition-all shadow-lg shadow-green-900/10" title="SEO Analytics Command Center"><TrendingUp size={18} /></button>
            <button onClick={() => setIsGuideOpen(true)} className="p-2 bg-slate-800 text-slate-400 rounded-xl border border-slate-700 hover:text-orange-400 hover:border-orange-500/50 transition-all" title="Nano Banana Strategy Guide"><BookOpen size={18} /></button>
            <button onClick={() => setIsImportOpen(true)} className="p-2 bg-slate-800 text-slate-400 rounded-xl border border-slate-700 hover:text-white transition-all" title="Reverse Sync"><Terminal size={18} /></button>
          </div>
        </div>
        
        {/* STRATEGY PLANS TRIGGER (Collapsed but prominent) */}
        <button 
          onClick={() => setIsPlanOpen(true)} 
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500/50 rounded-xl text-xs font-black text-slate-300 hover:text-white shadow-lg transition-all group"
        >
          <span className="flex items-center gap-2"><Calendar size={14} className="text-green-500"/> 避难所宇宙 (Content Matrix)</span>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {/* Presets Row (Removed Random, kept Save) */}
        <div className="mb-2">
           <button onClick={handleSave} className="w-full py-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2"><Save size={12}/> Save Current as Preset</button>
        </div>

        {/* Presets List - RESTORED */}
        {props.presets.length > 0 && (
          <div className="mb-4 space-y-2">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Saved Presets</h3>
            {props.presets.map(preset => (
              <div key={preset.id} className="group flex items-center gap-2">
                <button 
                  onClick={() => props.onLoadPreset(preset.id)}
                  className="flex-1 text-left px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 transition-all truncate"
                >
                  {preset.name}
                </button>
                <button 
                  onClick={() => props.onDeletePreset(preset.id)}
                  className="p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={12}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Categories List */}
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="space-y-1">
            <button 
              onClick={() => setOpenCategories(prev => prev.includes(cat.id) ? prev.filter(cid => cid !== cat.id) : [...prev, cat.id])} 
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${openCategories.includes(cat.id) ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
            >
              <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${props.selections[cat.id]?.length ? 'text-orange-400' : 'text-slate-500'}`}>
                {cat.icon} {cat.title}
              </span>
              {openCategories.includes(cat.id) ? <ChevronUp size={12} className="text-slate-600"/> : <ChevronDown size={12} className="text-slate-600"/>}
            </button>
            {openCategories.includes(cat.id) && (
              <div className="grid grid-cols-1 gap-1 pl-2">
                {cat.items.map(item => {
                  const active = props.selections[cat.id]?.includes(item.id);
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => props.onSelectionChange(cat.id, item.id)} 
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-left border transition-all group relative overflow-hidden ${
                        active 
                          ? 'bg-orange-600/10 border-orange-500/50 text-white' 
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded flex items-center justify-center shrink-0 transition-all ${active ? 'bg-orange-500' : 'border border-slate-600'}`}>
                        {active && <Check size={8} strokeWidth={4} className="text-white"/>}
                      </div>
                      <span className="font-medium truncate flex-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950 z-10 sticky bottom-0 flex gap-3">
        <button 
          onClick={props.onRandom} 
          className="px-5 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.95]" 
          title="Randomize Parameters"
        >
          <RotateCcw size={18}/>
        </button>
        <button onClick={() => props.onGenerate()} className="flex-1 flex items-center justify-center gap-3 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black shadow-2xl shadow-orange-900/40 transition-all active:scale-[0.98] uppercase tracking-widest text-sm">
          <Zap size={18}/> Generate Concept
        </button>
      </div>

      {isPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-950">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
                  <Calendar className="text-green-500" size={32}/> HAVEN NIGHTS 频道矩阵
                </h3>
                <p className="text-slate-500 mt-2 font-medium">Series A/B/C • 流量与品牌双轮驱动</p>
              </div>
              <button onClick={() => setIsPlanOpen(false)} className="p-4 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"><X size={32}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              {SHELTER_UNIVERSE_PLAN.map((week, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xl font-black text-green-400 tracking-tight">{week.week}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{week.theme}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {week.items.map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => executePlanItem(item)} 
                        className="p-6 bg-slate-950 border border-slate-800 rounded-3xl hover:border-green-500 hover:bg-slate-800 transition-all text-left group relative overflow-hidden flex flex-col h-full"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-xs font-black text-slate-500 mb-2 uppercase tracking-widest flex justify-between">
                           <span>{item.title.split(':')[0]}</span>
                           <span className="text-green-500/50">READY</span>
                        </div>
                        <div className="text-sm font-black text-slate-200 mb-4 group-hover:text-green-400 leading-tight flex-1">{item.title.split(':')[1] || item.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
                          <PlayCircle size={14}/> 加载参数
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NANO BANANA GUIDE MODAL (Unchanged content, kept for consistency) */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-950 border border-white/10 rounded-[2rem] w-full max-w-4xl h-full overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5">
             <div className="p-8 border-b border-white/10 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                      <BookOpen className="text-white" size={24}/>
                   </div>
                   <div>
                      <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">Nano Banana 2 <span className="text-blue-500">PRO</span></h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">官方权威全书 (The Complete Guide)</p>
                   </div>
                </div>
                <button onClick={() => setIsGuideOpen(false)} className="p-3 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"><X size={24}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 text-slate-300 leading-relaxed font-sans selection:bg-blue-500/30 selection:text-white">
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Lightbulb size={24} className="text-yellow-500"/> 第0章：提示词黄金法则 (Golden Rules)</h3>
                   <div className="space-y-4">
                      <p>停止使用关键词堆砌（Tag Soup）。Nano-Banana Pro 是一个“思考型”模型，它理解意图、物理和构图。</p>
                   </div>
                </section>
                <div className="text-center pt-10 border-t border-white/10 space-y-6">
                   <p className="text-xs font-black text-slate-600 uppercase tracking-[0.5em]">END OF STRATEGY GUIDE</p>
                </div>

             </div>
          </div>
        </div>
      )}

      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-4 tracking-tighter"><Terminal size={28} className="text-purple-400"/> PROMPT REVERSE SYNC</h3>
            <textarea 
              value={importText} 
              onChange={e => setImportText(e.target.value)} 
              className="w-full h-64 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm text-slate-300 mb-8 font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-slate-700" 
              placeholder="粘贴 Midjourney/SD 提示词，系统将自动逆向分析并同步选项..."
            />
            <div className="flex gap-4">
              <button onClick={() => setIsImportOpen(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black hover:text-white transition-colors">取消</button>
              <button 
                onClick={() => { const s = parsePromptToSelections(importText); props.onBatchSelectionChange(s); props.onGenerate(s); setIsImportOpen(false); }} 
                className="flex-1 py-5 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-500 shadow-xl shadow-purple-900/30 transition-all"
              >
                开始逆向解析
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
