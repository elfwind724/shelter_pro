
import React, { useState, useEffect } from 'react';
import { GeneratedContent, ThumbnailLayerConfig } from '../types';
import { 
  Copy, Download, Image as ImageIcon, Sparkles, RefreshCw, Star, 
  Palette, FileText, Music, Wand2, Video, Check, Layers, Type, ExternalLink,
  Info, ShieldCheck, Zap, Activity, Trash2, X, Hash, Search, SlidersHorizontal, ArrowDown, ArrowRight, CaseUpper, Scan, Minimize2, CheckCircle2, AlertTriangle, Move, Tag, Smartphone, ZoomIn, ZoomOut, Maximize, Loader2
} from 'lucide-react';
import { generateImagePreview, editGeneratedImage, generateVideoPromptFromImage, compositeThumbnail, outpaintImage, cropImage } from '../services/imageService';
import MaskCanvas from './MaskCanvas';

interface Props {
  content: GeneratedContent | null;
  onToggleFavorite: (item: GeneratedContent) => void;
  isFavorite: boolean;
}

const StrategyValidator: React.FC<{ content: GeneratedContent }> = ({ content }) => {
  const checkThreat = content.imagePrompt.includes('storm') || content.imagePrompt.includes('rain') || content.imagePrompt.includes('snow') || content.imagePrompt.includes('dark');
  const checkLocation = content.youtubeTitle.includes('Cabin') || content.youtubeTitle.includes('Station') || content.youtubeTitle.includes('Shelter') || content.youtubeTitle.includes('Room') || content.youtubeTitle.includes('Bunker');
  const checkSafety = content.imagePrompt.includes('warm') || content.imagePrompt.includes('fire') || content.imagePrompt.includes('dry') || content.imagePrompt.includes('light');
  const checkKeywords = content.tags.includes('sleep') && content.tags.includes('safe');
  const checkEmotion = content.youtubeTitle.includes("Safe") || content.youtubeTitle.includes("Sleep") || content.youtubeTitle.includes("Focus");

  const score = [checkThreat, checkLocation, checkSafety, checkKeywords, checkEmotion].filter(Boolean).length;
  const isPassing = score >= 4;

  return (
    <div className={`p-4 rounded-2xl border ${isPassing ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30'} mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${isPassing ? 'text-green-400' : 'text-red-400'}`}>
           {isPassing ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} Worldview Strategy Check
        </h4>
        <span className="text-[10px] font-mono text-slate-500">{score}/5 Passing</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[10px] font-medium text-slate-400">
        <div className={`flex items-center gap-1 ${checkThreat ? 'text-slate-300' : 'text-red-400/70'}`}>
          {checkThreat ? '✅' : '❌'} External Threat
        </div>
        <div className={`flex items-center gap-1 ${checkLocation ? 'text-slate-300' : 'text-red-400/70'}`}>
          {checkLocation ? '✅' : '❌'} Clear Location
        </div>
        <div className={`flex items-center gap-1 ${checkSafety ? 'text-slate-300' : 'text-red-400/70'}`}>
          {checkSafety ? '✅' : '❌'} Safety Visible
        </div>
        <div className={`flex items-center gap-1 ${checkKeywords ? 'text-slate-300' : 'text-red-400/70'}`}>
          {checkKeywords ? '✅' : '❌'} SEO Keywords
        </div>
        <div className={`flex items-center gap-1 ${checkEmotion ? 'text-slate-300' : 'text-red-400/70'}`}>
          {checkEmotion ? '✅' : '❌'} Emotional Arc
        </div>
      </div>
    </div>
  );
};

const OutputDisplay: React.FC<Props> = ({ content, onToggleFavorite, isFavorite }) => {
  const [local, setLocal] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [thumbText, setThumbText] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [verticalThumbnailPreview, setVerticalThumbnailPreview] = useState<string | null>(null);
  
  // LAYOUT CONFIG: Defaults set to Top/Bottom Split with Badge
  const [thumbConfig, setThumbConfig] = useState<ThumbnailLayerConfig>({
    headline: { x: 640, y: 100, fontSize: 160 }, 
    subhead: { x: 640, y: 620, fontSize: 130 },
    badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 80, fontSize: 50 } // Default
  });
  const [showLayoutControls, setShowLayoutControls] = useState(false);

  useEffect(() => { 
    setLocal(content); 
    if(content) {
      setThumbText(content.thumbnailText); 
      if (content.thumbnailConfig) {
        setThumbConfig(content.thumbnailConfig);
      } else {
        // Fallback for old content
        setThumbConfig({
            headline: { x: 640, y: 100, fontSize: 160 }, 
            subhead: { x: 640, y: 620, fontSize: 130 },
            badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 80, fontSize: 50 }
        });
      }
    }
  }, [content]);

  useEffect(() => {
    const updateThumbnail = async () => {
      const sourceImage = local?.thumbnailImage || local?.generatedImage;
      if (sourceImage && thumbText.length > 0) {
        try {
          const thumb = await compositeThumbnail(sourceImage, thumbText, thumbConfig, false);
          setThumbnailPreview(thumb);
          setLocal(prev => prev ? { ...prev, thumbnailConfig: thumbConfig } : null);
        } catch (e) { console.error("Thumbnail composite failed", e); }
      }
      const verticalSource = local?.verticalThumbnailImage;
      if (verticalSource && thumbText.length > 0) {
        try {
          const vThumb = await compositeThumbnail(verticalSource, thumbText, thumbConfig, true);
          setVerticalThumbnailPreview(vThumb);
        } catch (e) { console.error("Vertical composite failed", e); }
      }
    };
    const timer = setTimeout(updateThumbnail, 50);
    return () => clearTimeout(timer);
  }, [local?.generatedImage, local?.thumbnailImage, local?.verticalThumbnailImage, thumbText, thumbConfig]);

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
      if (url) setLocal({ ...local, generatedImage: url });
    } finally { setLoading(false); }
  };

  const handleGenThumbnail = async () => {
    setLoading(true);
    try {
      const url = await generateImagePreview(local.thumbnailPrompt, "16:9"); 
      if (url) setLocal({ ...local, thumbnailImage: url });
    } finally { setLoading(false); }
  };

  const handleGenVerticalThumbnail = async () => {
    setLoading(true);
    try {
      const url = await generateImagePreview(local.verticalThumbnailPrompt, "9:16"); 
      if (url) setLocal({ ...local, verticalThumbnailImage: url });
    } finally { setLoading(false); }
  };

  const handleFix = async (mask: string) => {
    if (!editPrompt.trim()) { alert("请输入你想如何改变画面 (例如：把椅子换成红色的)"); return; }
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

  const handleZoomOut = async (factor: number) => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      const url = await outpaintImage(local.generatedImage, local.imagePrompt, factor);
      if (url) setLocal({ ...local, generatedImage: url });
      else alert("Zoom Out failed: AI did not return a valid image.");
    } catch (e: any) {
        console.error(e);
        alert(`Zoom Out Error: ${e.message || "Unknown error"}`);
    } finally { 
        setLoading(false); 
    }
  };

  const handleZoomIn = async (factor: number) => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      const url = await cropImage(local.generatedImage, factor, local.imagePrompt);
      if (url) setLocal({ ...local, generatedImage: url });
      else alert("Zoom In failed: AI did not return a valid image.");
    } catch (e: any) {
        console.error(e);
        alert(`Zoom In Error: ${e.message || "Unknown error"}`);
    } finally { 
        setLoading(false); 
    }
  };

  const copyAll = () => {
    const text = `【Title】\n${local.youtubeTitle}\n\n【Description】\n${local.youtubeDescription}\n\n【Tags】\n${local.tags}\n\n【I2V】\n${local.i2vPrompt}`;
    navigator.clipboard.writeText(text);
    alert("全案运营参数已复制！");
  };

  const downloadThumbnail = () => {
    if (!thumbnailPreview) return;
    const link = document.createElement('a');
    link.download = `THUMB_H_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.jpg`;
    link.href = thumbnailPreview;
    link.click();
  };

  const downloadVerticalThumbnail = () => {
    if (!verticalThumbnailPreview) return;
    const link = document.createElement('a');
    link.download = `THUMB_V_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.jpg`;
    link.href = verticalThumbnailPreview;
    link.click();
  };

  // FIX: ADDED DOWNLOAD FUNCTION
  const downloadMainImage = () => {
    if (!local?.generatedImage) return;
    const link = document.createElement('a');
    link.download = `SCENE_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.png`;
    link.href = local.generatedImage;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      <div className="px-8 py-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center shadow-2xl z-30 shrink-0">
        <div className="flex items-center gap-5 flex-1 min-w-0 mr-8">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/40 shrink-0">
            <ShieldCheck className="text-white" size={28}/>
          </div>
          <div className="min-w-0">
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

      <div className="flex-1 overflow-y-auto p-10 space-y-16 scroll-smooth scrollbar-hide">
        
        {/* 01: SCENE GENERATION */}
        <section className="space-y-8 animate-in fade-in duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
              <ImageIcon size={18} className="text-orange-500"/> 01. 原始视觉底图 (Clean Scene)
            </div>
            {/* FIX: ADDED DOWNLOAD BUTTON */}
            {local.generatedImage && (
                <button onClick={downloadMainImage} className="text-[10px] font-black text-green-400 hover:text-green-300 flex items-center gap-2 transition-colors">
                   <Download size={14}/> DOWNLOAD 8K PNG
                </button>
            )}
          </div>
          
          <div className="relative aspect-video bg-slate-900 rounded-[3rem] border-2 border-slate-800 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
            {local.generatedImage ? (
              editMode ? (
                <>
                  <MaskCanvas imageSource={local.generatedImage} onConfirm={handleFix} onCancel={() => setEditMode(false)} />
                  
                  {/* FIX 1: RESTORED MAGIC FIX INPUT OVERLAY */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 animate-in slide-in-from-top-4">
                     <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-indigo-500/50 shadow-2xl flex gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                           <Wand2 size={20} className="text-white"/>
                        </div>
                        <input 
                           value={editPrompt}
                           onChange={(e) => setEditPrompt(e.target.value)}
                           className="flex-1 bg-transparent border-none outline-none text-white text-sm font-bold placeholder:text-slate-500 px-2"
                           placeholder="Describe change (e.g. 'Add a cat', 'Make it darker')..."
                           autoFocus
                        />
                     </div>
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full group">
                  <img src={local.generatedImage} className="w-full h-full object-cover"/>
                </div>
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                <Sparkles size={80} className="text-orange-500/10 mb-8 animate-pulse"/>
                <button onClick={handleGenImg} disabled={loading} className="px-16 py-8 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-orange-900/40 transition-all flex items-center gap-5 active:scale-95">
                  {loading ? <Loader2 className="animate-spin" size={28}/> : <Sparkles size={28}/>} 渲染 8K 物理底图
                </button>
              </div>
            )}
          </div>

          {local.generatedImage && !editMode && (
            <div className="space-y-4">
               {/* Primary Actions */}
               <div className="grid grid-cols-6 gap-4 animate-in slide-in-from-top-4 duration-300">
                  <button onClick={() => setEditMode(true)} className="col-span-4 flex items-center justify-center gap-3 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98]">
                     <Wand2 size={20}/> Magic Fix (局部重绘)
                  </button>
                  {/* FIX 2: LOADING SPINNERS ADDED */}
                  <button onClick={handleSync} disabled={loading} className="col-span-1 flex items-center justify-center gap-2 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50">
                     {loading ? <Loader2 className="animate-spin" size={20}/> : <Video size={20}/>}
                  </button>
                  <button onClick={handleGenImg} disabled={loading} className="col-span-1 flex items-center justify-center py-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-[2rem] border-2 border-slate-700 transition-all active:scale-95 disabled:opacity-50">
                     {loading ? <Loader2 className="animate-spin" size={20}/> : <RefreshCw size={20}/>}
                  </button>
               </div>
               
               {/* Zoom/Crop Controls */}
               <div className="flex gap-2 animate-in slide-in-from-top-6 duration-500">
                   <button onClick={() => handleZoomOut(2)} disabled={loading} className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      {loading ? <Loader2 size={14} className="animate-spin"/> : <ZoomOut size={14} />} Zoom Out 2x
                   </button>
                   <button onClick={() => handleZoomOut(1.5)} disabled={loading} className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      {loading ? <Loader2 size={14} className="animate-spin"/> : <ZoomOut size={14} />} 1.5x
                   </button>
                   <div className="w-px bg-slate-800 mx-2"></div>
                   <button onClick={() => handleZoomIn(1.5)} disabled={loading} className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      {loading ? <Loader2 size={14} className="animate-spin"/> : <ZoomIn size={14} />} Zoom In 1.5x
                   </button>
                   <button onClick={() => handleZoomIn(2)} disabled={loading} className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                      {loading ? <Loader2 size={14} className="animate-spin"/> : <ZoomIn size={14} />} 2x
                   </button>
               </div>
            </div>
          )}
        </section>

        {/* 02: THUMBNAIL EDITOR */}
        <section className="space-y-8 animate-in fade-in duration-700">
          <div className="bg-slate-900 rounded-[4rem] p-12 border-2 border-slate-800 shadow-inner grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
                    <Type size={18} className="text-orange-500"/> 封面大字 (Live Editor)
                  </div>
                  <button onClick={() => setShowLayoutControls(!showLayoutControls)} className="flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-slate-700 text-slate-500 hover:text-white"><SlidersHorizontal size={12}/> Layout</button>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black ml-2 tracking-widest">主标题 (White, Top)</label>
                    <input value={thumbText[0] || ""} onChange={e => { const n = [...thumbText]; n[0] = e.target.value; setThumbText(n); }} className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl font-black text-white focus:border-white outline-none shadow-2xl transition-all"/>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black ml-2 tracking-widest">副标题 (Yellow, Bottom)</label>
                    <input value={thumbText[1] || ""} onChange={e => { const n = [...thumbText]; n[1] = e.target.value; setThumbText(n); }} className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-xl font-black text-yellow-400 focus:border-yellow-400 outline-none shadow-2xl transition-all"/>
                  </div>

                  {/* BADGE EDITOR */}
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2"><Tag size={12}/> Badge (NO MUSIC)</label>
                        <button 
                          onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, visible: !thumbConfig.badge.visible}})}
                          className={`w-10 h-6 rounded-full transition-colors relative ${thumbConfig.badge?.visible ? 'bg-green-600' : 'bg-slate-700'}`}
                        >
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${thumbConfig.badge?.visible ? 'left-5' : 'left-1'}`}></div>
                        </button>
                     </div>
                     
                     {thumbConfig.badge?.visible && (
                        <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                           {/* Text Edit */}
                           <input 
                             value={thumbConfig.badge.text} 
                             onChange={e => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, text: e.target.value}})}
                             className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-green-500"
                             placeholder="NO MUSIC / LOFI BEATS"
                           />
                           
                           {/* Style Selection */}
                           <div className="flex gap-2">
                              {['box', 'ribbon_tr', 'ribbon_tl'].map((s) => (
                                 <button 
                                   key={s}
                                   onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, style: s as any}})}
                                   className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase border ${thumbConfig.badge.style === s ? 'bg-slate-800 border-white text-white' : 'border-slate-800 text-slate-500 hover:bg-slate-800'}`}
                                 >
                                   {s.replace('_', ' ')}
                                 </button>
                              ))}
                           </div>

                           {/* Color Selection */}
                           <div className="flex gap-2">
                              {['#16a34a', '#dc2626', '#a855f7', '#2563eb'].map((c) => (
                                 <button 
                                   key={c}
                                   onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, color: c}})}
                                   className={`flex-1 h-8 rounded-lg border-2 ${thumbConfig.badge.color === c ? 'border-white' : 'border-transparent'}`}
                                   style={{backgroundColor: c}}
                                 />
                              ))}
                           </div>

                           {/* Position & Size Control */}
                           <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                             <div>
                               <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">X / Offset</label>
                               <input 
                                 type="number" 
                                 value={thumbConfig.badge.x || 0}
                                 onChange={e => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, x: Number(e.target.value)}})}
                                 className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                               />
                             </div>
                             <div>
                               <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Y / Pos</label>
                               <input 
                                 type="number" 
                                 value={thumbConfig.badge.y || 80}
                                 onChange={e => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, y: Number(e.target.value)}})}
                                 className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                               />
                             </div>
                             <div>
                               <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Size</label>
                               <input 
                                 type="number" 
                                 value={thumbConfig.badge.fontSize || 50}
                                 onChange={e => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, fontSize: Number(e.target.value)}})}
                                 className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                               />
                             </div>
                           </div>
                           <p className="text-[10px] text-slate-500 italic">For Ribbon: Y = Distance from corner. For Box: X/Y = Coordinates.</p>
                        </div>
                     )}
                  </div>

                  {showLayoutControls && (
                       <div className="flex gap-4 p-4 bg-slate-950 rounded-2xl flex-col">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Headline Y Position</label>
                          <input type="range" min="0" max="720" value={thumbConfig.headline.y} onChange={e => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, y: Number(e.target.value)}})} className="w-full accent-white"/>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Subhead Y Position</label>
                          <input type="range" min="0" max="720" value={thumbConfig.subhead.y} onChange={e => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, y: Number(e.target.value)}})} className="w-full accent-yellow-400"/>
                       </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {/* Horizontal 16:9 Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em] flex items-center gap-3">
                      <Palette size={18} className="text-orange-500"/> 封面 16:9
                    </div>
                    {thumbnailPreview && <button onClick={downloadThumbnail} className="text-[10px] font-black text-green-400"><Download size={14}/></button>}
                  </div>
                  <div className="bg-slate-950/60 aspect-video rounded-[2.5rem] border-2 border-slate-800 relative overflow-hidden shadow-2xl">
                     {thumbnailPreview ? <img src={thumbnailPreview} className="w-full h-full object-cover"/> : <ImageIcon size={48} className="text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>}
                  </div>
                  <button onClick={handleGenThumbnail} disabled={loading} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-[2rem] font-black shadow-lg uppercase text-xs disabled:opacity-50 flex items-center justify-center gap-2">
                     {loading ? <Loader2 className="animate-spin" size={16}/> : null}
                     渲染高冲突封面 (Viral)
                  </button>
                </div>

                {/* Vertical 9:16 Preview (Shorts) */}
                <div className="space-y-4 pt-8 border-t border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em] flex items-center gap-3">
                      <Smartphone size={18} className="text-pink-500"/> Shorts 9:16
                    </div>
                    {verticalThumbnailPreview && <button onClick={downloadVerticalThumbnail} className="text-[10px] font-black text-green-400"><Download size={14}/></button>}
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-slate-950/60 aspect-[9/16] w-2/3 rounded-[2rem] border-2 border-slate-800 relative overflow-hidden shadow-2xl">
                       {verticalThumbnailPreview ? <img src={verticalThumbnailPreview} className="w-full h-full object-cover"/> : <ImageIcon size={32} className="text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>}
                    </div>
                  </div>
                  <button onClick={handleGenVerticalThumbnail} disabled={loading} className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-[2rem] font-black shadow-lg uppercase text-xs disabled:opacity-50 flex items-center justify-center gap-2">
                     {loading ? <Loader2 className="animate-spin" size={16}/> : null}
                     渲染竖屏封面 (Shorts)
                  </button>
                </div>
              </div>
          </div>
        </section>

        {/* 03: SEO & PROMPT DATA */}
        <section className="space-y-10">
           <StrategyValidator content={local} />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Title</h4>
                 <div className="text-2xl font-black text-white">{local.youtubeTitle}</div>
              </div>
              <div className="bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-8">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Tags</h4>
                 <div className="flex flex-wrap gap-2">
                    {local.tags.split(',').map((t, i) => <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-[10px] text-slate-400 border border-slate-700">{t.trim()}</span>)}
                 </div>
              </div>
           </div>
        </section>

        {/* FIX 3: ADDED I2V PROMPT SECTION */}
        {local.i2vPrompt && (
          <section className="bg-emerald-950/20 border border-emerald-900/50 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-6">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Video size={14}/> 04. 动态视频提示词 (Motion Prompts)
            </h4>
            <div className="bg-slate-950/50 rounded-2xl p-6 font-mono text-sm text-emerald-300 leading-relaxed border border-emerald-900/30">
              {local.i2vPrompt}
            </div>
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => {navigator.clipboard.writeText(local.i2vPrompt); alert("Copied!")}}
                className="px-4 py-2 bg-emerald-900/30 hover:bg-emerald-800 text-emerald-400 rounded-lg text-xs font-bold transition-all"
              >
                Copy Prompt
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default OutputDisplay;
