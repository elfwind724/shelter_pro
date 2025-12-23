
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { SelectionState, Preset } from '../types';
import { parsePromptToSelections } from '../services/generator';
import { 
  Check, ChevronDown, ChevronUp, Zap, RotateCcw, Save, Trash2, FolderOpen, X, 
  BookOpen, Terminal, Calendar, PlayCircle, Info, Wand2, Eye, History, Settings2, Target,
  Cpu, Lightbulb, PenTool, Layers, AlertTriangle, Aperture, Fingerprint, Palette, Link as LinkIcon,
  Brain, Globe, Layout, Type, Eraser, Box, ScanFace, FileJson
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
}

// 精心调校的 24 天爆款矩阵方案 - REVISED HIGH DETAIL VERSION
const GROWTH_PLAN_24 = [
  { week: "Week 1: 流量基石系列", theme: "高搜索量经典题材", items: [
    { title: "Day 1: 丛林木屋-雷暴之夜", selections: { structure: ['cabin'], weather: ['thunder'], time: ['night'], danger: ['none'], defense: ['iron_door', 'shutters', 'fence'], warmth: ['fireplace', 'candles'], sleeping: ['corner_bed'], character: ['none'], pets: ['dog'], npc: ['none'], amenities: ['tea_set', 'rugs', 'books', 'guitar', 'plants'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 2: 悬崖露台-治愈暴雨", selections: { structure: ['cliff_terrace'], weather: ['rain'], time: ['noon'], danger: ['none'], defense: ['blast_glass', 'turret'], warmth: ['stove'], sleeping: ['canopy'], character: ['survivor_reading'], pets: ['cat'], npc: ['none'], amenities: ['coffee', 'plants', 'books', 'radio'], perspective: ['terrace_view'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['4h'] } },
    { title: "Day 3: 雪国列车-极寒旅行", selections: { structure: ['train'], weather: ['blizzard'], time: ['morning'], danger: ['none'], defense: ['blast_glass', 'bulkhead'], warmth: ['heater', 'oil_lamp'], sleeping: ['bunk'], character: ['none'], pets: ['cat_dog'], npc: ['none'], amenities: ['bakery', 'radio', 'map', 'tea_set'], perspective: ['cinematic'], shot_type: ['wide_interior'], vibe: ['cozy_travel'], duration: ['8h'] } },
    { title: "Day 4: 湖畔船屋-静谧雨滴", selections: { structure: ['lake_boathouse'], weather: ['medium_rain'], time: ['night'], danger: ['none'], defense: ['iron_door', 'bars'], warmth: ['oil_lamp', 'candles'], sleeping: ['floor_mat'], character: ['none'], pets: ['cat'], npc: ['none'], amenities: ['tea_set', 'guitar', 'plants', 'rugs'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 5: 末日地堡-深层睡眠", selections: { structure: ['bunker'], weather: ['rain'], time: ['emergency'], danger: ['none'], defense: ['bulkhead', 'camera', 'airlock'], warmth: ['reactor'], sleeping: ['bunk'], character: ['man_sleeping'], pets: ['gsd'], npc: ['none'], amenities: ['shelves', 'tech', 'water', 'ammo'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 6: 重卡驾驶-雨夜国道", selections: { structure: ['truck'], weather: ['rain'], time: ['night'], danger: ['none'], defense: ['blast_glass'], warmth: ['diesel_heater'], sleeping: ['car_seat'], character: ['driver_focused'], pets: ['dog'], npc: ['none'], amenities: ['coffee', 'radio', 'map', 'pizza'], perspective: ['over_shoulder'], shot_type: ['medium_close'], vibe: ['cozy_travel'], duration: ['2h'] } }
  ]},
  { week: "Week 2: 视觉差异系列", theme: "高点击率奇观题材", items: [
    { title: "Day 7: 极光玻璃屋-梦幻飘雪", selections: { structure: ['glass_igloo'], weather: ['light_snow'], time: ['moonlight'], danger: ['none'], defense: ['blast_glass', 'turret'], warmth: ['stove', 'candles'], sleeping: ['canopy'], character: ['none'], pets: ['mainecoon'], npc: ['none'], amenities: ['tea_set', 'rugs', 'books', 'plants'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 8: 山巅哨站-云海之上", selections: { structure: ['mountain_peak'], weather: ['fog'], time: ['morning'], danger: ['none'], defense: ['blast_glass', 'bulkhead'], warmth: ['reactor', 'heater'], sleeping: ['bunk'], character: ['writer'], pets: ['none'], npc: ['none'], amenities: ['coffee', 'tech', 'radio', 'map'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['4h'] } },
    { title: "Day 9: 日式缘侧-和风落雨", selections: { structure: ['zen_garden'], weather: ['rain_lush'], time: ['noon'], danger: ['none'], defense: ['fence'], warmth: ['candles'], sleeping: ['floor_mat'], character: ['none'], pets: ['cat'], npc: ['none'], amenities: ['tea_set', 'plants', 'books', 'rugs'], perspective: ['terrace_view'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 10: 私人飞机-风暴飞行", selections: { structure: ['luxury_jet'], weather: ['thunder'], time: ['night'], danger: ['none'], defense: ['blast_glass', 'airlock'], warmth: ['reactor'], sleeping: ['canopy'], character: ['none'], pets: ['none'], npc: ['npc_copilot'], amenities: ['sushi', 'pizza', 'tech', 'water'], perspective: ['back_seat'], shot_type: ['medium'], vibe: ['cozy_travel'], duration: ['2h'] } },
    { title: "Day 11: 废弃医院-最后港湾", selections: { structure: ['hospital_ward'], weather: ['rain'], time: ['emergency'], danger: ['zombies'], defense: ['bars', 'camera', 'iron_door'], warmth: ['candles', 'heater'], sleeping: ['hospital_bed'], character: ['none'], pets: ['rottweiler'], npc: ['npc_tactical'], amenities: ['shelves', 'water', 'tech', 'rugs'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 12: 房车宿营-森林午后", selections: { structure: ['rv'], weather: ['light_rain'], time: ['morning'], danger: ['none'], defense: ['shutters'], warmth: ['diesel_heater'], sleeping: ['hammock'], character: ['none'], pets: ['dog'], npc: ['none'], amenities: ['cooking_pot', 'radio', 'map', 'guitar'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_travel'], duration: ['4h'] } }
  ]},
  { week: "Week 3: 废墟美学系列", theme: "高粘度生存氛围", items: [
    { title: "Day 13: 摩天豪宅-末日全景", selections: { structure: ['penthouse'], weather: ['fog'], time: ['night'], danger: ['drones'], defense: ['blast_glass', 'camera', 'turret'], warmth: ['hologram', 'heater'], sleeping: ['corner_bed'], character: ['silhouette'], pets: ['mainecoon'], npc: ['none'], amenities: ['pizza', 'tech', 'sushi', 'rugs'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 14: 重工工厂-钢铁巢穴", selections: { structure: ['factory'], weather: ['rain'], time: ['floodlight'], danger: ['none'], defense: ['bars', 'iron_door', 'camera'], warmth: ['barrel'], sleeping: ['bunk'], character: ['none'], pets: ['gsd'], npc: ['none'], amenities: ['cooking_pot', 'water', 'ammo', 'shelves'], perspective: ['isometric'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 15: 银行金库-绝对静谧", selections: { structure: ['vault'], weather: ['none'], time: ['night'], danger: ['none'], defense: ['iron_door', 'bulkhead'], warmth: ['oil_lamp'], sleeping: ['corner_bed'], character: ['none'], pets: ['cat'], npc: ['none'], amenities: ['shelves', 'ammo', 'water', 'rugs'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['loop'] } },
    { title: "Day 16: 改造地铁-城市孤岛", selections: { structure: ['subway_moving'], weather: ['medium_rain'], time: ['night'], danger: ['none'], defense: ['bars', 'blast_glass'], warmth: ['heater', 'oil_lamp'], sleeping: ['bunk'], character: ['silhouette'], pets: ['dog'], npc: ['none'], amenities: ['radio', 'rugs', 'books', 'water'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_travel'], duration: ['4h'] } },
    { title: "Day 17: 树顶吊舱-雨林深处", selections: { structure: ['forest_aerie'], weather: ['rain_lush'], time: ['morning'], danger: ['wildlife'], defense: ['shutters', 'turret'], warmth: ['stove'], sleeping: ['hammock'], character: ['none'], pets: ['cat'], npc: ['none'], amenities: ['tea_set', 'plants', 'books', 'guitar'], perspective: ['terrace_view'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 18: 物资超市-囤货狂喜", selections: { structure: ['supermarket'], weather: ['rain'], time: ['noon'], danger: ['none'], defense: ['iron_door', 'bars', 'camera'], warmth: ['stove'], sleeping: ['bunk'], character: ['none'], pets: ['none'], npc: ['none'], amenities: ['shelves', 'water', 'ammo', 'feast', 'bakery'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } }
  ]},
  { week: "Week 4: 赛博与未知系列", theme: "探索新流量蓝海", items: [
    { title: "Day 19: 星际座舱-深空漫游", selections: { structure: ['spaceship'], weather: ['none'], time: ['night'], danger: ['aliens'], defense: ['blast_glass', 'airlock'], warmth: ['reactor', 'hologram'], sleeping: ['canopy'], character: ['none'], pets: ['cat'], npc: ['npc_copilot'], amenities: ['tech', 'pizza', 'water', 'map'], perspective: ['first_person'], shot_type: ['medium_close'], vibe: ['cozy_travel'], duration: ['8h'] } },
    { title: "Day 20: 赛博出租-霓虹雨夜", selections: { structure: ['cyber_taxi'], weather: ['rain'], time: ['night'], danger: ['drones'], defense: ['blast_glass'], warmth: ['hologram'], sleeping: ['car_seat'], character: ['driver_focused'], pets: ['none'], npc: ['none'], amenities: ['radio', 'coffee', 'tech', 'map'], perspective: ['first_person'], shot_type: ['medium'], vibe: ['cozy_travel'], duration: ['2h'] } },
    { title: "Day 21: 古典书馆-烛光学习", selections: { structure: ['library'], weather: ['medium_rain'], time: ['night'], danger: ['none'], defense: ['bars', 'iron_door'], warmth: ['candles', 'fireplace'], sleeping: ['corner_bed'], character: ['survivor_reading'], pets: ['cat'], npc: ['none'], amenities: ['tea_set', 'books', 'rugs', 'plants'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['4h'] } },
    { title: "Day 22: 跨海游艇-海浪咆哮", selections: { structure: ['yacht'], weather: ['rain'], time: ['floodlight'], danger: ['none'], defense: ['bulkhead', 'blast_glass'], warmth: ['reactor'], sleeping: ['bunk'], character: ['driver_focused'], pets: ['dog'], npc: ['npc_copilot'], amenities: ['coffee', 'tech', 'radio', 'map'], perspective: ['over_shoulder'], shot_type: ['medium_close'], vibe: ['cozy_travel'], duration: ['2h'] } },
    { title: "Day 23: 山林晨雾-隐秘石屋", selections: { structure: ['river_cottage'], weather: ['fog'], time: ['morning'], danger: ['none'], defense: ['iron_door', 'fence'], warmth: ['fireplace'], sleeping: ['floor_mat'], character: ['none'], pets: ['cat_dog'], npc: ['none'], amenities: ['tea_set', 'bakery', 'plants', 'books'], perspective: ['standard'], shot_type: ['medium'], vibe: ['cozy_safe'], duration: ['8h'] } },
    { title: "Day 24: 旗舰地堡-雷雨睡眠", selections: { structure: ['bunker'], weather: ['thunder'], time: ['night'], danger: ['none'], defense: ['bulkhead', 'camera', 'turret', 'iron_door'], warmth: ['reactor', 'fireplace'], sleeping: ['corner_bed'], character: ['man_sleeping'], pets: ['duo_dogs'], npc: ['npc_family'], amenities: ['shelves', 'water', 'feast', 'tech', 'rugs'], perspective: ['standard'], shot_type: ['wide_interior'], vibe: ['cozy_safe'], duration: ['8h'] } }
  ]}
];

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [openCategories, setOpenCategories] = useState<string[]>(['structure', 'weather', 'warmth']);
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

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-full md:w-96 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black flex items-center gap-3 text-white tracking-tighter">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">🛖</div>
            SHELTER <span className="text-orange-500">PRO</span>
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setIsGuideOpen(true)} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl border border-slate-700 hover:text-orange-400 hover:border-orange-500/50 transition-all" title="Nano Banana Strategy Guide"><BookOpen size={20} /></button>
            <button onClick={() => setIsImportOpen(true)} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl border border-slate-700 hover:text-white transition-all" title="Reverse Sync"><Terminal size={20} /></button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsPlanOpen(true)} 
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl text-sm font-black shadow-xl shadow-green-900/30 transition-all active:scale-[0.98]"
        >
          <Target size={18} /> 开启 24 天黄金增长清单
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <div key={cat.id} className="space-y-3">
            <button 
              onClick={() => setOpenCategories(prev => prev.includes(cat.id) ? prev.filter(cid => cid !== cat.id) : [...prev, cat.id])} 
              className="w-full flex items-center justify-between group"
            >
              <span className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-slate-300 transition-colors">
                {cat.icon} {cat.title}
              </span>
              {openCategories.includes(cat.id) ? <ChevronUp size={14} className="text-slate-600"/> : <ChevronDown size={14} className="text-slate-600"/>}
            </button>
            {openCategories.includes(cat.id) && (
              <div className="grid grid-cols-1 gap-2">
                {cat.items.map(item => {
                  const active = props.selections[cat.id]?.includes(item.id);
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => props.onSelectionChange(cat.id, item.id)} 
                      className={`flex items-center gap-3 p-4 rounded-2xl text-xs text-left border-2 transition-all group ${
                        active 
                          ? 'bg-orange-600/10 border-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.1)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${active ? 'bg-orange-600 shadow-lg' : 'border-2 border-slate-700'}`}>
                        {active && <Check size={10} strokeWidth={4}/>}
                      </div>
                      <span className="font-bold truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-950 grid grid-cols-2 gap-4 z-10 sticky bottom-0">
        <button onClick={props.onRandom} className="flex items-center justify-center gap-3 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black transition-all active:scale-95"><RotateCcw size={20}/> 随机灵感</button>
        <button onClick={() => props.onGenerate()} className="flex items-center justify-center gap-3 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black shadow-2xl shadow-orange-900/40 transition-all active:scale-95"><Zap size={20}/> 生成数据</button>
      </div>

      {isPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-950">
              <div>
                <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
                  <Target className="text-green-500" size={32}/> 下一月 24 天爆款增长计划
                </h3>
                <p className="text-slate-500 mt-2 font-medium">目标：月播放 10,000+ | 系列化、高频、长尾流量黄金策略组合</p>
              </div>
              <button onClick={() => setIsPlanOpen(false)} className="p-4 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-all"><X size={32}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              {GROWTH_PLAN_24.map((week, idx) => (
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
                        <div className="text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Day {idx * 6 + i + 1}</div>
                        <div className="text-sm font-black text-slate-200 mb-4 group-hover:text-green-400 leading-tight">{item.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold group-hover:text-slate-400">
                          <PlayCircle size={14}/> 载入黄金参数并生成
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

      {/* NANO BANANA GUIDE MODAL */}
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
                
                {/* Intro */}
                <section className="space-y-6">
                  <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
                    <p className="font-medium text-blue-200">
                      Nano-Banana Pro (Gemini 2.5) 是从“娱乐”生图向“功能性”专业资产制作的重大飞跃。本指南基于谷歌官方 "10 Tips for Professional Asset Production"，涵盖核心能力及最佳实践。
                    </p>
                  </div>
                </section>

                {/* Tip 0: Golden Rules */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Lightbulb size={24} className="text-yellow-500"/> 第0章：提示词黄金法则 (Golden Rules)</h3>
                   <div className="space-y-4">
                      <p>停止使用关键词堆砌（Tag Soup）。Nano-Banana Pro 是一个“思考型”模型，它理解意图、物理和构图。</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <h4 className="font-bold text-white">1. Edit, Don't Re-roll (编辑，别重抽)</h4>
                            <p className="text-sm text-slate-400">如果图有80%满意，不要重新生成。直接说：“这很棒，但请把灯光改为日落氛围，并将文本改为霓虹蓝。”</p>
                         </div>
                         <div className="space-y-2">
                            <h4 className="font-bold text-white">2. 自然语言与完整句子</h4>
                            <p className="text-sm text-slate-400">❌ 坏: "Cool car, neon, city."<br/>✅ 好: "A cinematic wide shot of a futuristic sports car speeding through a rainy Tokyo street."</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* Tip 1: Text & Infographics */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Type size={24} className="text-indigo-500"/> 第1章：文本渲染与信息图 (Text & Visual Synthesis)</h3>
                   <p className="text-sm text-slate-400">NB Pro 具备 SOTA 级别的文本渲染能力，可直接生成 PPT 素材、图表和白板图。</p>
                   
                   <div className="space-y-4">
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-2">复古信息图 (Retro Infographic)</h4>
                         <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-indigo-200 border border-indigo-500/20 leading-relaxed">
                           "Make a retro, 1950s-style infographic about the history of the American diner. Include distinct sections for 'The Food,' 'The Jukebox,' and 'The Decor.' Ensure all text is legible and stylized to match the period."
                         </div>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-2">教学白板 (Educational Whiteboard)</h4>
                         <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-indigo-200 border border-indigo-500/20 leading-relaxed">
                           "Summarize the concept of 'Transformer Neural Network Architecture' as a hand-drawn whiteboard diagram. Use different colored markers for Encoder and Decoder blocks, with legible labels for 'Self-Attention'."
                         </div>
                      </div>
                   </div>
                </section>

                {/* Tip 2: Character Consistency */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><ScanFace size={24} className="text-pink-500"/> 第2章：角色一致性与病毒图 (Consistency)</h3>
                   <div className="space-y-4">
                      <p className="text-sm text-slate-400">支持多达 14 张参考图。核心指令是 <strong>"Identity Locking"</strong>。</p>
                      
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-2">病毒缩略图 (Viral Thumbnail)</h4>
                         <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-pink-200 border border-pink-500/20 leading-relaxed">
                           "Design a viral video thumbnail using the person from Image 1.<br/>
                           <strong>Face Consistency:</strong> Keep facial features exactly the same as Image 1, but make expression excited.<br/>
                           <strong>Subject:</strong> Place a delicious avocado toast on the right.<br/>
                           <strong>Graphics:</strong> Add a bold yellow arrow connecting person to toast.<br/>
                           <strong>Text:</strong> Overlay massive text: '3分钟搞定!' (Done in 3 mins!)."
                         </div>
                      </div>

                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-2">多图故事 (Storyboarding)</h4>
                         <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-pink-200 border border-pink-500/20 leading-relaxed">
                           "Create a funny 10-part story with these 3 fluffy friends. Keep the attire and identity consistent for all 3 characters, but vary expressions. Only have one of each character in each image."
                         </div>
                      </div>
                   </div>
                </section>

                {/* Tip 3: Grounding */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Globe size={24} className="text-blue-500"/> 第3章：谷歌搜索接地 (Grounding)</h3>
                   <p className="text-sm text-slate-400">利用实时数据生成图表，减少幻觉。</p>
                   <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                      <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-blue-200 border border-blue-500/20">
                         "Generate an infographic of the best times to visit U.S. National Parks in 2025 based on current travel trends."
                      </div>
                   </div>
                </section>

                {/* Tip 4: Advanced Editing */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Eraser size={24} className="text-green-500"/> 第4章：高级编辑与修复 (Editing)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-green-400 uppercase tracking-widest mb-2">物体移除 (In-painting)</h4>
                         <p className="text-xs text-slate-400 mb-2">无需手动遮罩，自然语言指令即可。</p>
                         <div className="p-3 bg-black/50 rounded-lg text-xs font-mono text-green-200 border border-green-500/20">
                           "Remove tourists from the background and fill space with logical textures (cobblestones) matching the environment."
                         </div>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-green-400 uppercase tracking-widest mb-2">本地化 (Localization)</h4>
                         <p className="text-xs text-slate-400 mb-2">翻译文字 + 文化背景适配。</p>
                         <div className="p-3 bg-black/50 rounded-lg text-xs font-mono text-green-200 border border-green-500/20">
                           "Localize this ad to Tokyo. Translate tagline to Japanese. Change background to Shibuya street at night."
                         </div>
                      </div>
                   </div>
                </section>

                {/* Tip 5 & 6: Dimensions & High Res */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Box size={24} className="text-orange-500"/> 第5章：维度转换 (2D ↔ 3D)</h3>
                   <p className="text-sm text-slate-400">设计师神器：将平面图转为3D，或将表情包3D化。</p>
                   <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                      <h4 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-2">平面图转室内设计 (Floor Plan to 3D)</h4>
                      <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-orange-200 border border-orange-500/20 leading-relaxed">
                         "Based on the uploaded 2D floor plan, generate a professional interior design board. Layout: Collage with large main image (living area) and smaller detail shots. Style: Modern Minimalist with oak flooring."
                      </div>
                   </div>
                </section>

                {/* Tip 9: Structural Control */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Layout size={24} className="text-purple-500"/> 第6章：结构控制 (Structure & Layout)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-2">草图转广告 (Sketch to Ad)</h4>
                         <div className="p-3 bg-black/50 rounded-lg text-xs font-mono text-purple-200 border border-purple-500/20">
                           "Create a ad for a [product] following this sketch exactly."
                         </div>
                      </div>
                      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                         <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-2">线框图转 UI (Wireframe to UI)</h4>
                         <div className="p-3 bg-black/50 rounded-lg text-xs font-mono text-purple-200 border border-purple-500/20">
                           "Create a high-fidelity UI mock-up following these wireframe guidelines."
                         </div>
                      </div>
                   </div>
                </section>

                {/* Tip 7: Thinking */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><Brain size={24} className="text-teal-500"/> 第7章：思维与推理 (Thinking)</h3>
                   <p className="text-sm text-slate-400">利用思维链解决数学或逻辑问题。</p>
                   <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                      <div className="p-4 bg-black/50 rounded-xl text-xs font-mono text-teal-200 border border-teal-500/20">
                         {`"Solve log_{x^2+1}(x^4-1)=2 in C on a white board. Show the steps clearly."`}
                      </div>
                   </div>
                </section>

                {/* Tip 10: Negative Prompts */}
                <section className="space-y-6">
                   <h3 className="text-2xl font-black text-white flex items-center gap-3"><AlertTriangle size={24} className="text-red-500"/> 第8章：质量保障 (Negative Prompts)</h3>
                   <p className="text-sm text-slate-400">即使是 Pro 模型，也建议保留以下负面词以确保商业级输出。</p>
                   <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl">
                      <p className="font-mono text-xs md:text-sm text-red-200 leading-relaxed select-all">
                         worst quality, normal quality, low quality, low res, blurry, artifacts, jpeg artifacts, washed-out backgrounds, low detail, extra limbs, distorted hands, incorrect anatomy, poorly drawn hands, poorly drawn feet, missing digits, extra digits, interlocked fingers, deformed bows, Polydactyly, multiple limbs, watermark, signature, text, logo, username, error, cut off, out of frame, body out of frame, draft, simple background, blank background, abstract background, tiling
                      </p>
                   </div>
                </section>

                <div className="text-center pt-10 border-t border-white/10 space-y-6">
                   <a 
                     href="https://x.com/googleaistudio/status/1994480371061469306?s=46" 
                     target="_blank" 
                     rel="noreferrer"
                     className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-2xl font-black transition-all group"
                   >
                     <LinkIcon size={18}/> View Original Tutorial on X <span className="text-slate-500 group-hover:text-blue-200">↗</span>
                   </a>
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
