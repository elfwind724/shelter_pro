
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

// 2026年1月 HAVEN NIGHTS 发布方案 (完整映射版 - 包含视觉风格)
const JAN_2026_PLAN = [
  { week: "Phase 1: 流量基石 (Jan 1-7)", theme: "核心热门题材启动", items: [
    { 
      title: "Jan 1: 雨日木屋 (Rainy Cabin)", 
      selections: { 
        structure: ['cabin'], weather: ['rain'], time: ['night'], warmth: ['fireplace'], 
        defense: ['shutters'], duration: ['8h'], vibe: ['cozy_safe'],
        danger: ['none'], sleeping: ['corner_bed'], shot_type: ['medium'], amenities: ['tea_set', 'books', 'rugs', 'oil_lamp'],
        perspective: ['terrace_view'],
        visual_style: ['cinematic_35mm'] // 经典胶片质感
      } 
    },
    { 
      title: "Jan 4: 工业阁楼 (Ind. Loft)", 
      selections: { 
        structure: ['factory'], weather: ['rain'], time: ['night'], defense: ['blast_glass'], 
        warmth: ['heater'], duration: ['8h'], vibe: ['cozy_safe'],
        danger: ['none'], sleeping: ['floor_mat'], shot_type: ['wide_interior'], amenities: ['radio', 'canned_food', 'water', 'tech'],
        perspective: ['standard'],
        visual_style: ['vintage_70s'] // 怀旧工业风
      } 
    },
    { 
      title: "Jan 7: 森林树屋 (Treehouse)", 
      selections: { 
        structure: ['forest_aerie'], weather: ['rain_lush'], time: ['morning'], warmth: ['stove'], 
        duration: ['8h'], vibe: ['cozy_safe'], defense: ['shutters'],
        danger: ['none'], sleeping: ['canopy'], shot_type: ['terrace_view'], amenities: ['plants', 'books', 'coffee'],
        perspective: ['terrace_view'],
        visual_style: ['realistic_8k'] // 极致自然写实
      } 
    },
  ]},
  { week: "Phase 2: 差异化爆款 (Jan 10-16)", theme: "末日与冥想双赛道", items: [
    { 
      title: "Jan 10: 末日+狗 (Shelter Dog)", 
      selections: { 
        structure: ['bunker'], weather: ['rain'], pets: ['gsd'], warmth: ['fireplace'], time: ['night'], 
        duration: ['8h'], vibe: ['cozy_safe'], defense: ['iron_door'], 
        danger: ['zombies'], sleeping: ['floor_mat'], shot_type: ['medium_close'], amenities: ['ammo', 'water', 'canned_food'],
        perspective: ['standard'],
        visual_style: ['unreal_5'] // 游戏质感
      } 
    },
    { 
      title: "Jan 13: 雷暴地堡 (Thunder Bunker)", 
      selections: { 
        structure: ['bunker'], weather: ['thunder'], time: ['night'], defense: ['bulkhead'], warmth: ['fireplace'], 
        duration: ['8h'], vibe: ['cozy_safe'],
        danger: ['none'], sleeping: ['bunk'], shot_type: ['cinematic'], amenities: ['radio', 'map', 'oil_lamp'],
        perspective: ['standard'],
        visual_style: ['vhs_tape'] // 战地录像带风格
      } 
    },
    { 
      title: "Jan 16: 冥想雨声 (Calm Rain)", 
      selections: { 
        structure: ['zen_garden'], weather: ['light_rain'], time: ['night'], warmth: ['fireplace'], 
        duration: ['8h'], vibe: ['cozy_safe'], defense: ['shutters'], 
        danger: ['none'], sleeping: ['floor_mat'], shot_type: ['medium'], amenities: ['tea_set', 'plants', 'candles'],
        perspective: ['standard'],
        visual_style: ['nordic_minimal'] // 极简冷淡
      } 
    },
  ]},
  { week: "Phase 3: 节日与长尾 (Jan 19-22)", theme: "特定场景优化", items: [
    { 
      title: "Jan 19: 圣诞余温 (Holiday)", 
      selections: { 
        structure: ['cabin'], weather: ['light_snow'], time: ['night'], warmth: ['fireplace', 'candles'], 
        amenities: ['feast', 'tea_set', 'rugs'], duration: ['8h'], vibe: ['cozy_safe'],
        defense: ['shutters'], danger: ['none'], sleeping: ['canopy'], shot_type: ['medium'],
        perspective: ['standard'],
        visual_style: ['cinematic_35mm']
      } 
    },
    { 
      title: "Jan 22: 深夜4K (Night Sounds)", 
      selections: { 
        structure: ['cabin'], weather: ['fog'], time: ['night'], danger: ['none'], duration: ['8h'], vibe: ['cozy_safe'],
        defense: ['shutters'], warmth: ['stove'], sleeping: ['corner_bed'], shot_type: ['cinematic'], amenities: ['books', 'coffee'],
        perspective: ['standard'],
        visual_style: ['realistic_8k']
      } 
    },
  ]},
  { week: "Phase 4: 拓展与压轴 (Jan 25-28)", theme: "LoFi与终极组合", items: [
    { 
      title: "Jan 25: 学习节拍 (Lo-Fi Study)", 
      selections: { 
        structure: ['library'], weather: ['medium_rain'], time: ['night'], amenities: ['coffee', 'books', 'radio', 'plants'], 
        vibe: ['cozy_travel'], duration: ['8h'], defense: ['bars'], 
        warmth: ['heater'], danger: ['none'], sleeping: ['corner_bed'], shot_type: ['medium'],
        perspective: ['standard'],
        visual_style: ['anime_makoto'] // 新海诚动画风
      } 
    },
    { 
      title: "Jan 28: 终极雷暴 (Ultimate Story)", 
      selections: { 
        structure: ['cabin'], weather: ['thunder'], pets: ['dog'], warmth: ['fireplace'], time: ['night'], 
        duration: ['8h'], vibe: ['cozy_safe'], defense: ['shutters', 'iron_door'], 
        danger: ['wildlife'], sleeping: ['corner_bed'], shot_type: ['cinematic'], amenities: ['feast', 'rugs', 'guitar'],
        perspective: ['cinematic'],
        visual_style: ['gothic_noir'] // 暗黑哥特
      } 
    },
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
          <Calendar size={18} /> 2026年1月发布日程
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
                  <Calendar className="text-green-500" size={32}/> 2026年1月发布日程
                </h3>
                <p className="text-slate-500 mt-2 font-medium">HAVEN NIGHTS 频道专属 • 10个高潜力视频 • 目标月播放 10K+</p>
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
                           <span>VIDEO #{idx * 3 + i + 1}</span>
                           <span className="text-green-500/50">8H NO ADS</span>
                        </div>
                        <div className="text-sm font-black text-slate-200 mb-4 group-hover:text-green-400 leading-tight">{item.title}</div>
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
