
import React, { useState, useEffect } from 'react';
import { GeneratedContent, ThumbnailLayerConfig } from '../types';
import { 
  Copy, Download, Image as ImageIcon, Sparkles, RefreshCw, Star, 
  Palette, FileText, Music, Wand2, Video, Check, Layers, Type, ExternalLink,
  Info, ShieldCheck, Zap, Activity, Trash2, X, Hash, Search, SlidersHorizontal, ArrowDown, ArrowRight, CaseUpper
} from 'lucide-react';
import { generateImagePreview, editGeneratedImage, generateVideoPromptFromImage, compositeThumbnail } from '../services/imageService';
import MaskCanvas from './MaskCanvas';

interface Props {
  content: GeneratedContent | null;
  onToggleFavorite: (item: GeneratedContent) => void;
  isFavorite: boolean;
}

const OutputDisplay: React.FC<Props> = ({ content, onToggleFavorite, isFavorite }) => {
  const [local, setLocal] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [thumbText, setThumbText] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // NEW: State for layout configuration (X, Y, Size)
  const [thumbConfig, setThumbConfig] = useState<ThumbnailLayerConfig>({
    headline: { x: 640, y: 540, fontSize: 120 },
    subhead: { x: 640, y: 630, fontSize: 50 }
  });
  const [showLayoutControls, setShowLayoutControls] = useState(false);

  useEffect(() => { 
    setLocal(content); 
    if(content) {
      setThumbText(content.thumbnailText); 
      // Initialize config from content if available, otherwise use defaults
      if (content.thumbnailConfig) {
        setThumbConfig(content.thumbnailConfig);
      } else {
        // Fallback defaults if old data structure
        setThumbConfig({
          headline: { x: 640, y: 540, fontSize: 120 },
          subhead: { x: 640, y: 630, fontSize: 50 }
        });
      }
    }
  }, [content]);

  // Effect to re-render thumbnail when headlines, image, or LAYOUT changes
  useEffect(() => {
    const updateThumbnail = async () => {
      if (local?.generatedImage && thumbText.length > 0) {
        try {
          // Pass the dynamic configuration to the composite function
          const thumb = await compositeThumbnail(local.generatedImage, thumbText, thumbConfig);
          setThumbnailPreview(thumb);
          
          // Optional: Update local content object so if we save, we save the config
          setLocal(prev => prev ? { ...prev, thumbnailConfig: thumbConfig } : null);
        } catch (e) {
          console.error("Thumbnail composite failed", e);
        }
      }
    };
    // Debounce slightly for smooth slider performance could be added here, but canvas is fast enough for now
    const timer = setTimeout(updateThumbnail, 50);
    return () => clearTimeout(timer);
  }, [local?.generatedImage, thumbText, thumbConfig]);

  if (!local) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-700 bg-slate-950 p-12 text-center">
       <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-8 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-pulse">
          <Zap size={48} className="text-orange-500" />
       </div>
       <h3 className="text-2xl font-black text-slate-400 tracking-tighter uppercase">Shelter Command Center</h3>
       <p className="max-w-xs text-sm text-slate-600 mt-4 leading-relaxed font-medium">请在左侧选择运营计划或配置参数，<br/>开始你的爆款增长之路。</p>
    </div>
  );

  const handleGenImg = async () => {
    setLoading(true);
    try {
      const url = await generateImagePreview(local.imagePrompt);
      if (url) {
        setLocal({ ...local, generatedImage: url });
      }
    } finally { setLoading(false); }
  };

  const handleFix = async (mask: string) => {
    if (!editPrompt.trim()) { alert("请输入你想如何改变画面（如：在窗台加一只睡觉的黑猫）"); return; }
    setLoading(true);
    try {
      const url = await editGeneratedImage(local.generatedImage!, editPrompt, mask);
      if (url) { 
        setLocal({ ...local, generatedImage: url }); 
        setEditMode(false); 
        setEditPrompt(""); 
      }
    } finally { setLoading(false); }
  };

  const handleSync = async () => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      const p = await generateVideoPromptFromImage(local.generatedImage);
      setLocal({ ...local, i2vPrompt: p });
    } finally { setLoading(false); }
  };

  const copyAll = () => {
    const text = `
【Title / 标题】
${local.youtubeTitle}

【Description / 简介】
${local.youtubeDescription}

【Backend Tags / 后台标签】
${local.tags}

【I2V Prompt / 动效指令】
${local.i2vPrompt}
    `.trim();
    navigator.clipboard.writeText(text);
    alert("全案运营参数已复制！");
  };

  const downloadThumbnail = () => {
    if (!thumbnailPreview) return;
    const link = document.createElement('a');
    link.download = `THUMB_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.jpg`;
    link.href = thumbnailPreview;
    link.click();
  };

  const downloadCleanImage = () => {
    if (!local.generatedImage) return;
    const link = document.createElement('a');
    link.download = `CLEAN_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.png`;
    link.href = local.generatedImage;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* 顶部全案控制栏 */}
      <div className="px-8 py-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-2xl z-30 shrink-0">
        <div className="flex items-center gap-5 flex-1 min-w-0 mr-8">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/40 shrink-0">
            <ShieldCheck className="text-white" size={28}/>
          </div>
          <div className="min-w-0">
            {/* 修复：移除 truncate，允许换行，调整字体大小适应 */}
            <h2 className="text-white font-black text-xl leading-tight tracking-tighter mb-1 break-words">{local.youtubeTitle}</h2>
            <div className="flex gap-4 items-center">
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest whitespace-nowrap">Growth Phase: {local.score >= 90 ? 'Alpha' : 'Beta'}</span>
               <div className="h-1 w-1 bg-slate-700 rounded-full shrink-0"></div>
               <div className="flex items-center gap-1.5 whitespace-nowrap">
                 <Activity size={12} className="text-green-500"/>
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Engagement Score: {local.score}</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => onToggleFavorite(local)} className={`p-4 rounded-2xl border-2 transition-all ${isFavorite ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-900/20' : 'border-slate-800 text-slate-500 hover:text-white hover:bg-slate-800'}`}><Star size={24} fill={isFavorite ? 'currentColor' : 'none'}/></button>
          <button onClick={copyAll} className="flex items-center gap-3 px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-sm font-black shadow-2xl shadow-green-900/40 transition-all active:scale-95"><Copy size={20}/> 一键复制全案参数</button>
        </div>
      </div>

      {/* 主工作流 */}
      <div className="flex-1 overflow-y-auto p-10 space-y-16 scroll-smooth scrollbar-hide">
        
        {/* 01: 视觉实验室 */}
        <section className="space-y-8 animate-in fade-in duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
              <ImageIcon size={18} className="text-orange-500"/> 01. 原始视觉底图 (Clean Scene)
            </div>
            {local.generatedImage && (
              <button onClick={downloadCleanImage} className="flex items-center gap-2 text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                <Download size={14}/> 下载 4K 干净原图
              </button>
            )}
          </div>
          
          <div className="relative aspect-video bg-slate-900 rounded-[3rem] border-2 border-slate-800 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
            {local.generatedImage ? (
              editMode ? (
                <MaskCanvas imageSource={local.generatedImage} onConfirm={handleFix} onCancel={() => setEditMode(false)} />
              ) : (
                <div className="relative w-full h-full group">
                  <img src={local.generatedImage} className="w-full h-full object-cover"/>
                  <button 
                    onClick={downloadCleanImage}
                    className="absolute top-6 right-6 p-4 bg-black/60 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-2xl border border-white/10 active:scale-95 z-20"
                    title="立即下载 4K 原图"
                  >
                    <Download size={24}/>
                  </button>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                <Sparkles size={80} className="text-orange-500/10 mb-8 animate-pulse"/>
                <button onClick={handleGenImg} disabled={loading} className="px-16 py-8 bg-orange-600 hover:bg-orange-500 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-orange-900/40 transition-all flex items-center gap-5 active:scale-95">
                  {loading ? <RefreshCw className="animate-spin" size={28}/> : <Sparkles size={28}/>} 渲染 8K 物理底图
                </button>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center z-50">
                 <RefreshCw className="animate-spin text-orange-500 mb-10" size={80}/>
                 <p className="font-black tracking-[0.6em] uppercase text-sm text-white animate-pulse">Neural Engine Rendering...</p>
              </div>
            )}
          </div>

          {local.generatedImage && !editMode && (
            <div className="grid grid-cols-4 gap-4 animate-in slide-in-from-top-4 duration-300">
               <button onClick={() => setEditMode(true)} className="col-span-2 flex items-center justify-center gap-4 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98]"><Wand2 size={24}/> Magic Fix (涂抹重绘)</button>
               <button onClick={handleSync} className="flex items-center justify-center gap-4 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98]"><Video size={24}/> Vision Sync</button>
               <button onClick={handleGenImg} className="flex items-center justify-center py-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-[2rem] border-2 border-slate-700 transition-all active:scale-95"><RefreshCw size={24}/></button>
            </div>
          )}

          {editMode && (
            <div className="bg-indigo-900/10 border-2 border-indigo-500/20 p-10 rounded-[3rem] animate-in slide-in-from-top-4 duration-300">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4 text-base font-black text-indigo-400 uppercase tracking-widest"><Wand2 size={24}/> 1. 涂抹区域并输入指令</div>
                 <button onClick={() => setEditMode(false)} className="p-3 hover:bg-slate-800 rounded-full text-slate-500"><X size={24}/></button>
               </div>
               <div className="flex gap-4">
                 <input autoFocus value={editPrompt} onChange={e => setEditPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !loading && handleFix("")} className="flex-1 bg-slate-950 border-2 border-slate-800 rounded-[2rem] p-6 text-lg text-white focus:border-indigo-500 outline-none transition-all font-bold" placeholder="告诉我你想加点什么？"/>
                 <button onClick={() => handleFix("")} disabled={loading} className="px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black shadow-xl transition-all">执行修复</button>
               </div>
            </div>
          )}

          {/* 实时封面合成中心 */}
          <div className="bg-slate-900 rounded-[4rem] p-12 border-2 border-slate-800 shadow-inner grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
                    <Type size={18} className="text-orange-500"/> 封面大字 (Live Editor)
                  </div>
                  <button 
                    onClick={() => setShowLayoutControls(!showLayoutControls)} 
                    className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all ${showLayoutControls ? 'bg-orange-500 text-white border-orange-500' : 'text-slate-500 border-slate-700 hover:text-white'}`}
                  >
                    <SlidersHorizontal size={12}/> {showLayoutControls ? 'Hide Controls' : 'Adjust Layout'}
                  </button>
                </div>
                
                {/* 文本输入区 */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black ml-2 tracking-widest">主标题 (Headline)</label>
                    <input value={thumbText[0] || ""} onChange={e => { const n = [...thumbText]; n[0] = e.target.value; setThumbText(n); }} className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl font-black text-white focus:border-orange-500 outline-none shadow-2xl transition-all"/>
                    
                    {/* 主标题控制滑块 */}
                    {showLayoutControls && (
                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                           <CaseUpper size={16} className="text-slate-500"/>
                           <input type="range" min="40" max="250" value={thumbConfig.headline.fontSize} onChange={e => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, fontSize: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                           <span className="text-xs font-mono text-slate-400 w-8">{thumbConfig.headline.fontSize}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <ArrowDown size={16} className="text-slate-500"/>
                           <input type="range" min="0" max="720" value={thumbConfig.headline.y} onChange={e => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, y: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                           <span className="text-xs font-mono text-slate-400 w-8">{Math.round(thumbConfig.headline.y / 7.2)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <ArrowRight size={16} className="text-slate-500"/>
                           <input type="range" min="0" max="1280" value={thumbConfig.headline.x} onChange={e => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, x: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black ml-2 tracking-widest">副标题 (Subheadline)</label>
                    <input value={thumbText[1] || ""} onChange={e => { const n = [...thumbText]; n[1] = e.target.value; setThumbText(n); }} className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl font-black text-white focus:border-orange-500 outline-none shadow-2xl transition-all"/>

                    {/* 副标题控制滑块 */}
                    {showLayoutControls && (
                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                           <CaseUpper size={16} className="text-slate-500"/>
                           <input type="range" min="20" max="150" value={thumbConfig.subhead.fontSize} onChange={e => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, fontSize: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                           <span className="text-xs font-mono text-slate-400 w-8">{thumbConfig.subhead.fontSize}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <ArrowDown size={16} className="text-slate-500"/>
                           <input type="range" min="0" max="720" value={thumbConfig.subhead.y} onChange={e => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, y: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                           <span className="text-xs font-mono text-slate-400 w-8">{Math.round(thumbConfig.subhead.y / 7.2)}%</span>
                        </div>
                         <div className="flex items-center gap-4">
                           <ArrowRight size={16} className="text-slate-500"/>
                           <input type="range" min="0" max="1280" value={thumbConfig.subhead.x} onChange={e => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, x: Number(e.target.value)}})} className="flex-1 accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest flex items-center gap-2"><Palette size={14}/> 视觉建议</h4>
                  <ul className="text-xs text-slate-500 space-y-3 font-medium">
                    <li className="flex justify-between"><span>推荐字体:</span> <span className="text-orange-500 font-black">{local.thumbnailDesign.fontRecommendation}</span></li>
                    <li className="flex justify-between"><span>主色:</span> <span style={{color: local.thumbnailDesign.textColor}}>{local.thumbnailDesign.textColor}</span></li>
                    <li className="flex justify-between"><span>辅色:</span> <span style={{color: local.thumbnailDesign.accentColor}}>{local.thumbnailDesign.accentColor}</span></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em] flex items-center gap-3">
                    <Palette size={18} className="text-orange-500"/> 封面预览 (Final Composite)
                  </div>
                  {thumbnailPreview && (
                    <button onClick={downloadThumbnail} className="flex items-center gap-2 text-[10px] font-black text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 hover:bg-green-500/20 transition-all">
                      <Download size={14}/> 下载高清封面
                    </button>
                  )}
                </div>
                <div className="bg-slate-950/60 aspect-video rounded-[3rem] border-2 border-slate-800 flex flex-col justify-center items-center relative overflow-hidden group shadow-2xl">
                   {thumbnailPreview ? (
                     <div className="relative w-full h-full group">
                        <img src={thumbnailPreview} className="w-full h-full object-cover animate-in fade-in duration-500" />
                        <button 
                            onClick={downloadThumbnail}
                            className="absolute top-6 right-6 p-4 bg-black/60 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-2xl border border-white/10 active:scale-95 z-20"
                            title="立即下载封面"
                        >
                            <Download size={24}/>
                        </button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-4 text-slate-700">
                        <ImageIcon size={64} className="opacity-20"/>
                        <p className="text-xs font-black uppercase tracking-widest">渲染底图后自动合成</p>
                     </div>
                   )}
                </div>
                <p className="text-[10px] text-slate-600 text-center font-bold tracking-widest">自动应用 IMPACT 字体 + 粗黑描边 + 底部阴影渐变</p>
              </div>
          </div>
        </section>

        {/* 02 & 03: 动效与提示词 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="space-y-6">
             <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
               <Video size={18} className="text-purple-500"/> 02. I2V 物理动效指令
             </div>
             <div className="bg-slate-900 rounded-[3rem] p-10 border-2 border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vision Sync Optimized</span>
                   <button onClick={() => { navigator.clipboard.writeText(local.i2vPrompt); alert("Copied!"); }} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all"><Copy size={20}/></button>
                </div>
                <div className="text-sm text-slate-300 font-mono bg-slate-950 p-8 rounded-[2rem] leading-relaxed border border-white/5 shadow-inner min-h-[160px]">
                   {local.i2vPrompt}
                </div>
             </div>
           </div>

           <div className="space-y-6">
             <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
               <Layers size={18} className="text-blue-500"/> 03. 原始图像提示词
             </div>
             <div className="bg-slate-900 rounded-[3rem] p-10 border-2 border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Midjourney Reference</span>
                   <button onClick={() => { navigator.clipboard.writeText(local.imagePrompt); alert("Copied!"); }} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all"><Copy size={20}/></button>
                </div>
                <div className="text-sm text-slate-500 italic bg-slate-950 p-8 rounded-[2rem] leading-relaxed border border-white/5 shadow-inner min-h-[160px]">
                   "{local.imagePrompt}"
                </div>
             </div>
           </div>
        </section>

        {/* 04: SEO 全案 */}
        <section className="space-y-10">
           <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
             <FileText size={18} className="text-green-500"/> 04. YouTube 运营全案 (SEO)
           </div>

           {/* NEW: 独立的标题展示卡片 */}
           <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative group overflow-hidden">
             <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { navigator.clipboard.writeText(local.youtubeTitle); alert("Title Copied!"); }} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"><Copy size={20}/></button>
             </div>
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">【Title / 标题】</div>
             <div className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight selection:bg-green-500/30 pr-12">
               {local.youtubeTitle}
             </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Description Section */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl">
                    <div className="px-10 py-6 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">【Description / 简介】</span>
                       <button onClick={() => { navigator.clipboard.writeText(local.youtubeDescription); alert("Description Copied!"); }} className="bg-slate-950 p-4 rounded-2xl text-slate-500 hover:text-white transition-all shadow-xl"><Copy size={22}/></button>
                    </div>
                    <div className="p-12 text-sm text-slate-400 font-mono whitespace-pre-wrap leading-loose h-[600px] overflow-y-auto bg-slate-950/20 scrollbar-hide">
                       {local.youtubeDescription}
                    </div>
                 </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-6">
                 <div className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl h-full flex flex-col">
                    <div className="px-10 py-6 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Hash size={14}/> 【Backend Tags / 后台标签】</span>
                       <button onClick={() => { navigator.clipboard.writeText(local.tags); alert("All Tags Copied!"); }} className="bg-slate-950 p-3 rounded-xl text-slate-500 hover:text-white transition-all"><Copy size={16}/></button>
                    </div>
                    <div className="p-10 flex flex-wrap gap-2 overflow-y-auto flex-1 bg-slate-950/40">
                       {local.tags.split(',').map((tag, i) => (
                         <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-tighter hover:border-orange-500 transition-colors">
                           {tag.trim()}
                         </span>
                       ))}
                    </div>
                    <div className="p-8 bg-orange-600/5 border-t border-slate-800">
                       <div className="flex items-center gap-3 text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">
                         <Search size={14}/> Algorithm Insight
                       </div>
                       <p className="text-[10px] text-slate-500 italic leading-relaxed">
                         Tags are weighted by competition volume and relevance to the "Shelter Ambience" long-tail keyword matrix.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 05: 声学指南 */}
        <section className="space-y-8 pb-32">
           <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
             <Music size={18} className="text-indigo-500"/> 05. 声学工程蓝图
           </div>
           <div className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-800/80 text-slate-500 uppercase tracking-widest">
                    <tr>
                       <th className="px-12 py-8 font-black">Sound Layer</th>
                       <th className="px-12 py-8 font-black">Foley Blueprint</th>
                       <th className="px-12 py-8 font-black text-right">Mixing</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {local.audioGuide.map((layer, i) => (
                       <tr key={i} className="text-slate-300 hover:bg-slate-800/40 transition-all">
                          <td className="px-12 py-10 font-black text-orange-400 text-base tracking-tighter">{layer.layer}</td>
                          <td className="px-12 py-10 text-slate-400 font-bold leading-relaxed">{layer.sound}</td>
                          <td className="px-12 py-10 text-right">
                             <span className="bg-slate-950 border border-slate-700 px-6 py-3 rounded-[1.5rem] font-mono text-[10px] text-green-400 shadow-inner">
                                {layer.mixingNotes}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

      </div>
    </div>
  );
};

export default OutputDisplay;
