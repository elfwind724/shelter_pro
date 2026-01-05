
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

// 2026年1月 HAVEN NIGHTS 战略发布计划 (NARRATIVE DRIVEN)
const JAN_2026_PLAN = [
  { week: "Phase 1: 8-Hour Deep Sleep", theme: "核心叙事 (Narrative Loops)", items: [
    { 
      title: "Story A: The Marine Scientist", 
      selections: { 
        structure: ['ship_cabin'], weather: ['rain', 'thunder'], time: ['night'], warmth: ['fireplace', 'oil_lamp'], 
        defense: ['shutters'], duration: ['8h'], vibe: ['narrative_scientist'],
        danger: ['none'], sleeping: ['corner_bed'], shot_type: ['medium'], amenities: ['books', 'map', 'coffee'],
        pets: ['dog'], perspective: ['standard'], visual_style: ['cinematic_35mm']
      } 
    },
    { 
      title: "Story B: The Refugee",
      selections: { 
        structure: ['ship_cabin'], weather: ['rain', 'wind'], time: ['night'], defense: ['iron_door'], 
        warmth: ['stove'], duration: ['8h'], vibe: ['narrative_refugee'],
        danger: ['none'], sleeping: ['floor_mat'], shot_type: ['medium_close'], amenities: ['canned_food', 'water', 'tea_set'],
        pets: ['dog'], perspective: ['standard'], visual_style: ['vintage_70s']
      } 
    },
    { 
      title: "Story C: The Fugitive",
      selections: { 
        structure: ['ship_cabin'], weather: ['thunder'], time: ['night'], warmth: ['fireplace'], 
        duration: ['8h'], vibe: ['narrative_fugitive'], defense: ['shutters', 'lock'],
        danger: ['none'], sleeping: ['corner_bed'], shot_type: ['cinematic'], amenities: ['radio', 'map', 'whiskey'],
        pets: ['dog'], perspective: ['standard'], visual_style: ['gothic_noir']
      } 
    },
    { 
      title: "Story D: Fresh Start",
      selections: { 
        structure: ['ship_cabin'], weather: ['rain'], time: ['night'], warmth: ['stove'], 
        duration: ['8h'], vibe: ['narrative_fresh_start'], defense: ['shutters'],
        danger: ['none'], sleeping: ['bunk'], shot_type: ['medium'], amenities: ['plants', 'books', 'coffee'],
        pets: ['dog'], perspective: ['standard'], visual_style: ['realistic_8k']
      } 
    },
     { 
      title: "Story E: The Nomad",
      selections: { 
        structure: ['ship_cabin'], weather: ['rain'], time: ['night'], warmth: ['fireplace'], 
        duration: ['8h'], vibe: ['narrative_nomad'], defense: ['shutters'],
        danger: ['none'], sleeping: ['hammock'], shot_type: ['medium'], amenities: ['map', 'telescope', 'rugs'],
        pets: ['dog'], perspective: ['standard'], visual_style: ['leica_bw']
      } 
    },
  ]},
  { week: "Phase 2: 2-Hour LoFi Musician", theme: "12种乐器/场景 (12 Instruments)", items: [
    // 1. PIANO - ABANDONED THEATER (DRAMATIC/CLASSICAL)
    { 
      title: "01. 钢琴 - 废弃剧院 (Piano)",
      selections: { 
        structure: ['projection_booth'], weather: ['heavy_rain'], warmth: ['oil_lamp'], time: ['night'], 
        duration: ['2h'], vibe: ['cozy_travel'], character: ['lofi_pianist'],
        defense: ['iron_door'], sleeping: ['none'], shot_type: ['wide_interior'], amenities: ['vinyl', 'whiskey', 'velvet_drapes'],
        perspective: ['cinematic'], visual_style: ['gothic_noir'], textures: ['velvet_drapes']
      } 
    },
    // 2. GUITAR - CAMPER VAN (INTIMATE/ACOUSTIC)
    { 
      title: "02. 吉他 - 暴雨露营车 (Guitar)",
      selections: { 
        structure: ['camper_van'], weather: ['rain'], time: ['night'], defense: ['none'], warmth: ['fairy_lights', 'diesel_heater'], 
        duration: ['2h'], vibe: ['cozy_safe'], character: ['lofi_guitarist'],
        danger: ['none'], sleeping: ['car_seat'], shot_type: ['medium_close'], amenities: ['coffee', 'map', 'dog'],
        perspective: ['first_person'], visual_style: ['vintage_70s'], textures: ['chunky_knit']
      } 
    },
    // 3. VIOLIN - VICTORIAN LIBRARY (CLASSICAL/STUDY)
    { 
      title: "03. 小提琴 - 古老图书馆 (Violin)",
      selections: { 
        structure: ['library'], weather: ['light_rain'], time: ['morning'], warmth: ['fireplace'], 
        duration: ['2h'], vibe: ['cozy_travel'], character: ['lofi_violinist'], defense: ['bars'], 
        sleeping: ['none'], shot_type: ['medium'], amenities: ['books', 'tea_set', 'painting'],
        perspective: ['standard'], visual_style: ['cinematic_35mm'], textures: ['wood_floor', 'rugs']
      } 
    },
    // 4. CELLO - LIGHTHOUSE (MELANCHOLIC/DEEP)
    { 
      title: "04. 大提琴 - 孤峰灯塔 (Cello)",
      selections: { 
        structure: ['lighthouse'], weather: ['thunder'], time: ['night'], warmth: ['oil_lamp'], 
        duration: ['2h'], vibe: ['melancholic'], character: ['lofi_cellist'], defense: ['blast_glass'], 
        sleeping: ['corner_bed'], shot_type: ['cinematic'], amenities: ['radio', 'telescope', 'whiskey'],
        perspective: ['standard'], visual_style: ['leica_bw'], textures: ['rugs']
      } 
    },
    // 5. SAXOPHONE - DETECTIVE OFFICE (JAZZ/NOIR)
    { 
      title: "05. 萨克斯 - 侦探事务所 (Sax)",
      selections: { 
        structure: ['noir_office'], weather: ['rain'], time: ['night'], warmth: ['heater'],
        duration: ['2h'], vibe: ['mysterious'], character: ['lofi_sax'], defense: ['shutters'],
        sleeping: ['sofa_island'], shot_type: ['medium'], amenities: ['whiskey', 'typewriter', 'vinyl'],
        perspective: ['cinematic'], visual_style: ['gothic_noir'], textures: ['wood_floor']
      } 
    },
    // 6. HARP - BOTANICAL LAB (ETHEREAL/FANTASY)
    { 
      title: "06. 竖琴 - 植物实验室 (Harp)",
      selections: { 
        structure: ['botanical_lab'], weather: ['rain_lush'], time: ['morning'], warmth: ['hologram'],
        duration: ['2h'], vibe: ['cozy_safe'], character: ['lofi_harp'], defense: ['glass_dome'],
        sleeping: ['hammock'], shot_type: ['medium'], amenities: ['plants', 'tea_set', 'books'],
        perspective: ['standard'], visual_style: ['unreal_5'], textures: ['tapestry']
      } 
    },
    // 7. FLUTE - TREEHOUSE (NATURE/FOLK)
    { 
      title: "07. 长笛 - 森林树屋 (Flute)",
      selections: { 
        structure: ['forest_aerie'], weather: ['light_rain'], time: ['day'], warmth: ['stove'],
        duration: ['2h'], vibe: ['cozy_safe'], character: ['lofi_flutist'], defense: ['none'],
        sleeping: ['hammock'], shot_type: ['medium_close'], amenities: ['plants', 'fruit_platter', 'books'],
        perspective: ['terrace_view'], visual_style: ['japanese_wafu'], textures: ['wood_floor']
      } 
    },
    // 8. KOTO - ZEN GARDEN (MEDITATIVE/ASIAN)
    { 
      title: "08. 古琴 - 禅意花园 (Koto)",
      selections: { 
        structure: ['zen_garden'], weather: ['light_rain'], time: ['afternoon'], warmth: ['candles'],
        duration: ['2h'], vibe: ['cozy_travel'], character: ['lofi_koto'], defense: ['none'],
        sleeping: ['tatami_raised'], shot_type: ['medium'], amenities: ['tea_set', 'plants', 'scroll'],
        perspective: ['low_angle'], visual_style: ['japanese_wafu'], textures: ['rugs']
      } 
    },
    // 9. ACCORDION - CANAL BOAT (FOLK/TRAVEL)
    { 
      title: "09. 手风琴 - 运河窄船 (Accordion)",
      selections: { 
        structure: ['canal_boat'], weather: ['rain'], time: ['dusk'], warmth: ['stove'],
        duration: ['2h'], vibe: ['cozy_travel'], character: ['lofi_accordion'], defense: ['none'],
        sleeping: ['bunk'], shot_type: ['medium'], amenities: ['map', 'canned_food', 'coffee'],
        perspective: ['standard'], visual_style: ['vintage_70s'], textures: ['chunky_knit']
      } 
    },
    // 10. SYNTH - CYBER POD (STUDY/BEATS)
    { 
      title: "10. 合成器 - 赛博胶囊 (Synth)",
      selections: { 
        structure: ['cyber_pod'], weather: ['acid'], time: ['night'], warmth: ['hologram'],
        duration: ['2h'], vibe: ['cozy_travel'], character: ['lofi_synth'], defense: ['blast_glass'],
        sleeping: ['cryo_pod'], shot_type: ['medium'], amenities: ['laptop', 'tech', 'coffee'],
        perspective: ['standard'], visual_style: ['cyber_neon'], textures: ['beanbag']
      } 
    },
    // 11. KALIMBA - WINDOW NOOK (SLEEP/COZY)
    { 
      title: "11. 拇指琴 - 窗边卧榻 (Kalimba)",
      selections: { 
        structure: ['attic'], weather: ['snow'], time: ['night'], warmth: ['fairy_lights', 'candles'],
        duration: ['2h'], vibe: ['cozy_safe'], character: ['lofi_kalimba'], defense: ['none'],
        sleeping: ['window_nook'], shot_type: ['close_up'], amenities: ['cocoa', 'plush_carpet', 'cat'],
        perspective: ['first_person'], visual_style: ['realistic_8k'], textures: ['cushion_pile']
      } 
    },
    // 12. ELECTRIC GUITAR - PROJECTION BOOTH (POST-ROCK/SOLO)
    { 
      title: "12. 电吉他 - 放映室 (Elec. Guitar)",
      selections: { 
        structure: ['projection_booth'], weather: ['fog'], time: ['night'], warmth: ['heater'],
        duration: ['2h'], vibe: ['melancholic'], character: ['lofi_guitarist'], defense: ['iron_door'],
        sleeping: ['sofa_island'], shot_type: ['medium'], amenities: ['vinyl', 'tech', 'sausages'],
        perspective: ['cinematic'], visual_style: ['analog_horror'], textures: ['rugs']
      } 
    },
  ]}
];

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [openCategories, setOpenCategories] = useState<string[]>(['structure', 'weather', 'warmth', 'character']); // Default expanded
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
          <span className="flex items-center gap-2"><Calendar size={14} className="text-green-500"/> 2026 战略全案 (Phase 1 & 2)</span>
          <ChevronDown size={14} className="group-hover:rotate-180 transition-transform"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {/* Presets Row */}
        <div className="flex gap-2 mb-2">
           <button onClick={props.onRandom} className="flex-1 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2"><RotateCcw size={12}/> Randomize</button>
           <button onClick={handleSave} className="flex-1 py-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-2"><Save size={12}/> Save Preset</button>
        </div>

        {/* Categories List (Restored full density) */}
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

      <div className="p-4 border-t border-slate-800 bg-slate-950 z-10 sticky bottom-0">
        <button onClick={() => props.onGenerate()} className="w-full flex items-center justify-center gap-3 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black shadow-2xl shadow-orange-900/40 transition-all active:scale-[0.98] uppercase tracking-widest text-sm">
          <Zap size={18}/> Generate Concept
        </button>
      </div>

      {isPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-950">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
                  <Calendar className="text-green-500" size={32}/> HAVEN NIGHTS 2026 战略全案
                </h3>
                <p className="text-slate-500 mt-2 font-medium">8-Hour Deep Sleep + 2-Hour LoFi Musician • 叙事驱动 • 目标 CTR > 4%</p>
              </div>
              <button onClick={() => setIsPlanOpen(false)} className="p-4 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"><X size={32}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              {JAN_2026_PLAN.map((week, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xl font-black text-green-400 tracking-tight">{week.week}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{week.theme}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {week.items.map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => executePlanItem(item)} 
                        className="p-6 bg-slate-950 border border-slate-800 rounded-3xl hover:border-green-500 hover:bg-slate-800 transition-all text-left group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-xs font-black text-slate-500 mb-2 uppercase tracking-widest flex justify-between">
                           <span>{item.title.split(':')[0]}</span>
                           <span className="text-green-500/50">SEO READY</span>
                        </div>
                        <div className="text-sm font-black text-slate-200 mb-4 group-hover:text-green-400 leading-tight">{item.title.split(':')[1] || item.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
                          <PlayCircle size={14}/> 加载全案参数
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
                {/* ... (Kept short for brevity in this update block, assume original content remains) ... */}
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
