
import React, { useState, useEffect } from 'react';
import { GeneratedContent, ThumbnailLayerConfig } from '../types';
import { 
  Copy, Download, Image as ImageIcon, Sparkles, RefreshCw, Star, 
  Palette, FileText, Music, Wand2, Video, Check, Layers, Type, ExternalLink,
  Info, ShieldCheck, Zap, Activity, Trash2, X, Hash, Search, SlidersHorizontal, ArrowDown, ArrowRight, CaseUpper, Scan, Minimize2, CheckCircle2, AlertTriangle, Move, Tag, Smartphone, ZoomIn, ZoomOut, Maximize, Loader2, Moon, Flame, Sun, Film, Footprints, Hand, BedDouble, Layout
} from 'lucide-react';
import { generateImagePreview, editGeneratedImage, generateVideoPromptFromImage, compositeThumbnail, outpaintImage, cropImage, generateDarkVariant, generateShortsStoryline, regenerateSingleShortsFrame } from '../services/imageService';
import MaskCanvas from './MaskCanvas';

interface Props {
  content: GeneratedContent | null;
  onToggleFavorite: (item: GeneratedContent) => void;
  isFavorite: boolean;
}

// ... (StrategyValidator component remains the same)
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
  const [loadingFrames, setLoadingFrames] = useState<number[]>([]); // Track which frames are regenerating
  
  const [editMode, setEditMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  
  const [darkEditMode, setDarkEditMode] = useState(false);
  const [darkEditPrompt, setDarkEditPrompt] = useState("");

  const [thumbText, setThumbText] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [verticalThumbnailPreview, setVerticalThumbnailPreview] = useState<string | null>(null);
  
  const [darknessLevel, setDarknessLevel] = useState(20);

  const [shortsInstruction, setShortsInstruction] = useState("");

  const [thumbConfig, setThumbConfig] = useState<ThumbnailLayerConfig>({
    headline: { x: 640, y: 100, fontSize: 160 }, 
    subhead: { x: 640, y: 620, fontSize: 130 },
    // Initialize vertical defaults
    verticalHeadline: { x: 360, y: 200, fontSize: 100 }, 
    verticalSubhead: { x: 360, y: 1000, fontSize: 80 },
    badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 80, fontSize: 50 } 
  });
  const [showLayoutControls, setShowLayoutControls] = useState(false);

  useEffect(() => { 
    setLocal(content); 
    if(content) {
      setThumbText(content.thumbnailText); 
      if (content.thumbnailConfig) {
        setThumbConfig(content.thumbnailConfig);
      } else {
        // Reset defaults if not present
        setThumbConfig({
            headline: { x: 640, y: 100, fontSize: 160 }, 
            subhead: { x: 640, y: 620, fontSize: 130 },
            verticalHeadline: { x: 360, y: 200, fontSize: 100 }, 
            verticalSubhead: { x: 360, y: 1000, fontSize: 80 },
            badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 80, fontSize: 50 }
        });
      }
      setShortsInstruction("");
      setEditMode(false);
      setDarkEditMode(false);
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
      
      const verticalSource = local?.verticalThumbnailImage || local?.generatedImage; 
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

  const handleDarkFix = async (mask: string) => {
    if (!darkEditPrompt.trim()) { alert("请描述修改内容 (例如：Make window view pitch black night)"); return; }
    setLoading(true);
    try {
      const url = await editGeneratedImage(local.darkImage!, darkEditPrompt, mask);
      if (url) { 
        setLocal({ ...local, darkImage: url }); 
        setDarkEditMode(false); 
        setDarkEditPrompt(""); 
      }
    } finally { setLoading(false); }
  };

  const handleSync = async () => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      // Dynamic Prompt for Light Scene (isStatic = false)
      const p = await generateVideoPromptFromImage(local.generatedImage, false);
      setLocal({ ...local, i2vPrompt: p });
    } finally { setLoading(false); }
  };

  const handleGenDarkVariant = async () => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      const url = await generateDarkVariant(local.generatedImage, local.imagePrompt, darknessLevel);
      if (url) {
         // Static Prompt for Dark Scene (isStatic = true)
         const motionPrompt = await generateVideoPromptFromImage(url, true);
         setLocal({ ...local, darkImage: url, darkI2vPrompt: motionPrompt });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate dark variant.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenShortsStory = async () => {
    if (!local.generatedImage) return;
    setLoading(true);
    try {
      const story = await generateShortsStoryline(local.generatedImage, local.imagePrompt, shortsInstruction);
      if (story) {
        setLocal({ ...local, shortsStory: story });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate shorts story. AI might be busy, try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // --- NEW: REGENERATE SINGLE FRAME ---
  const handleRegenerateFrame = async (index: number) => {
      if (!local.generatedImage || !local.shortsStory || !local.shortsStory.frames[index]) return;
      
      setLoadingFrames(prev => [...prev, index]);
      try {
          const frame = local.shortsStory.frames[index];
          const newImageUrl = await regenerateSingleShortsFrame(local.generatedImage, local.imagePrompt, frame);
          
          if (newImageUrl) {
              const updatedFrames = [...local.shortsStory.frames];
              updatedFrames[index] = { ...frame, imageUrl: newImageUrl };
              
              const updatedStory = { ...local.shortsStory, frames: updatedFrames };
              setLocal({ ...local, shortsStory: updatedStory });
          }
      } catch (e) {
          console.error(e);
          alert("Failed to regenerate frame.");
      } finally {
          setLoadingFrames(prev => prev.filter(i => i !== index));
      }
  };

  const handleDownloadAllShots = () => {
      if (!local.shortsStory || !local.shortsStory.frames) return;
      local.shortsStory.frames.forEach((frame, index) => {
          if (frame.imageUrl) {
              setTimeout(() => {
                  const link = document.createElement('a');
                  const safeTitle = local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 20);
                  link.download = `Shot_${frame.step}_${safeTitle}.png`;
                  link.href = frame.imageUrl!;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              }, index * 500);
          }
      });
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
    let text = `【YOUTUBE METADATA】
TITLE:
${local.youtubeTitle}

DESCRIPTION:
${local.youtubeDescription}

TAGS:
${local.tags}

---------------------------------------

【MOTION PROMPTS (SORA / VEO)】
[MAIN LIGHT]: ${local.i2vPrompt}
[DARK MODE]: ${local.darkI2vPrompt || "N/A"}

---------------------------------------`;

    if (local.shortsStory) {
        text += `\n【SHORTS STORYBOARD】\nTITLE: ${local.shortsStory.title}\nDESC: ${local.shortsStory.description}\nTAGS: ${local.shortsStory.tags}\n\n`;
        local.shortsStory.frames.forEach((f, i) => {
            text += `[SHOT ${i+1}]
ACTION: ${f.actionDescription}
OVERLAY: ${f.overlayText}
IMAGE PROMPT: ${f.imagePrompt}
\n`;
        });
    }

    navigator.clipboard.writeText(text);
    alert("Copied Full Project Data (Metadata, I2V Prompts, Shorts Storyboard)!");
  };

  const downloadMainImage = () => {
    if (!local?.generatedImage) return;
    const link = document.createElement('a');
    link.download = `SCENE_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.png`;
    link.href = local.generatedImage;
    link.click();
  };

  const downloadDarkImage = () => {
    if (!local?.darkImage) return;
    const link = document.createElement('a');
    link.download = `SCENE_DARK_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}.png`;
    link.href = local.darkImage;
    link.click();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
        {/* HEADER */}
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
        <StrategyValidator content={local} />
        
        {/* 01: SCENE GENERATION */}
        <section className="space-y-8 animate-in fade-in duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
              <ImageIcon size={18} className="text-orange-500"/> 01. 原始视觉底图 (Clean Scene)
            </div>
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
               <div className="grid grid-cols-6 gap-4 animate-in slide-in-from-top-4 duration-300">
                  <button onClick={() => setEditMode(true)} className="col-span-4 flex items-center justify-center gap-3 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98]">
                     <Wand2 size={20}/> Magic Fix (局部重绘)
                  </button>
                  <button onClick={handleSync} disabled={loading} className="col-span-1 flex items-center justify-center gap-2 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50">
                     {loading ? <Loader2 className="animate-spin" size={20}/> : <Video size={20}/>}
                  </button>
                  <button onClick={handleGenImg} disabled={loading} className="col-span-1 flex items-center justify-center py-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-[2rem] border-2 border-slate-700 transition-all active:scale-95 disabled:opacity-50">
                     {loading ? <Loader2 className="animate-spin" size={20}/> : <RefreshCw size={20}/>}
                  </button>
               </div>
               
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

        {/* 01.5: VIRAL THUMBNAIL */}
        {local.generatedImage && (
            <section className="space-y-8 animate-in fade-in duration-700 bg-slate-900 p-8 rounded-[3rem] border border-slate-800">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-black text-yellow-500 uppercase tracking-[0.4em]">
                     <Layout size={18} className="text-yellow-500"/> 02. Viral Thumbnail (Cover System)
                  </div>
                  {thumbnailPreview && (
                     <button onClick={() => {
                        const link = document.createElement('a');
                        link.download = `THUMB_${local.youtubeTitle.replace(/[^a-z0-9]/gi, '_').slice(0,20)}.jpg`;
                        link.href = thumbnailPreview;
                        link.click();
                     }} className="text-[10px] font-black text-green-400 hover:text-green-300 flex items-center gap-2">
                        <Download size={14}/> DOWNLOAD
                     </button>
                  )}
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 16:9 Main Cover */}
                  <div className="space-y-4">
                      <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                          {thumbnailPreview ? (
                              <img src={thumbnailPreview} className="w-full h-full object-cover"/>
                          ) : (
                              <div className="flex items-center justify-center h-full text-slate-600 flex-col gap-2">
                                  <Loader2 className="animate-spin"/>
                                  <span className="text-[10px] font-bold">COMPOSITING...</span>
                              </div>
                          )}
                      </div>
                      <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-bold text-slate-500">16:9 YOUTUBE COVER</span>
                          <button onClick={() => setShowLayoutControls(!showLayoutControls)} className="text-[10px] font-bold text-yellow-500 hover:text-white flex items-center gap-1">
                              <SlidersHorizontal size={12}/> ADJUST LAYOUT
                          </button>
                      </div>
                  </div>

                  {/* 9:16 Shorts Cover */}
                  <div className="space-y-4">
                       <div className="relative aspect-[9/16] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl w-1/2 mx-auto">
                           {verticalThumbnailPreview ? (
                               <img src={verticalThumbnailPreview} className="w-full h-full object-cover"/>
                           ) : (
                               <div className="flex items-center justify-center h-full text-slate-600 flex-col gap-2">
                                   <Loader2 className="animate-spin"/>
                               </div>
                           )}
                       </div>
                       <div className="text-center">
                           <span className="text-[10px] font-bold text-slate-500">9:16 SHORTS COVER</span>
                       </div>
                  </div>
               </div>

               {/* Expanded Layout Controls */}
               {showLayoutControls && (
                   <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 animate-in slide-in-from-top-2 space-y-6">
                       
                       {/* 16:9 Controls */}
                       <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">16:9 Horizontal Layout</div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">Headline Y</label>
                                   <input type="range" min="50" max="600" value={thumbConfig.headline.y} onChange={e => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, y: Number(e.target.value)}})} className="w-full h-1 bg-slate-800 rounded appearance-none accent-yellow-500"/>
                               </div>
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">Subhead Y</label>
                                   <input type="range" min="100" max="650" value={thumbConfig.subhead.y} onChange={e => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, y: Number(e.target.value)}})} className="w-full h-1 bg-slate-800 rounded appearance-none accent-yellow-500"/>
                               </div>
                           </div>
                       </div>

                       {/* 9:16 Controls - NEW INDEPENDENT CONTROLS */}
                       <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">9:16 Vertical Layout</div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">V-Headline Y</label>
                                   <input 
                                     type="range" min="50" max="1200" 
                                     value={thumbConfig.verticalHeadline?.y || 200} 
                                     onChange={e => setThumbConfig({
                                         ...thumbConfig, 
                                         verticalHeadline: { ...(thumbConfig.verticalHeadline || { x: 360, fontSize: 100 }), y: Number(e.target.value) }
                                     })} 
                                     className="w-full h-1 bg-slate-800 rounded appearance-none accent-pink-500"
                                   />
                               </div>
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">V-Headline Size</label>
                                   <input 
                                     type="range" min="50" max="250" 
                                     value={thumbConfig.verticalHeadline?.fontSize || 100} 
                                     onChange={e => setThumbConfig({
                                         ...thumbConfig, 
                                         verticalHeadline: { ...(thumbConfig.verticalHeadline || { x: 360, y: 200 }), fontSize: Number(e.target.value) }
                                     })} 
                                     className="w-full h-1 bg-slate-800 rounded appearance-none accent-pink-500"
                                   />
                               </div>
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">V-Subhead Y</label>
                                   <input 
                                     type="range" min="200" max="1200" 
                                     value={thumbConfig.verticalSubhead?.y || 1000} 
                                     onChange={e => setThumbConfig({
                                         ...thumbConfig, 
                                         verticalSubhead: { ...(thumbConfig.verticalSubhead || { x: 360, fontSize: 80 }), y: Number(e.target.value) }
                                     })} 
                                     className="w-full h-1 bg-slate-800 rounded appearance-none accent-pink-500"
                                   />
                               </div>
                               <div>
                                   <label className="text-[10px] font-bold text-slate-500 block mb-2">V-Subhead Size</label>
                                   <input 
                                     type="range" min="40" max="200" 
                                     value={thumbConfig.verticalSubhead?.fontSize || 80} 
                                     onChange={e => setThumbConfig({
                                         ...thumbConfig, 
                                         verticalSubhead: { ...(thumbConfig.verticalSubhead || { x: 360, y: 1000 }), fontSize: Number(e.target.value) }
                                     })} 
                                     className="w-full h-1 bg-slate-800 rounded appearance-none accent-pink-500"
                                   />
                               </div>
                           </div>
                       </div>

                   </div>
               )}
            </section>
        )}

        {/* 01.5: DARK MODE VARIANT */}
        {local.generatedImage && (
            <section className="space-y-8 animate-in fade-in duration-700 bg-indigo-950/20 p-8 rounded-[3rem] border border-indigo-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">
                    <Moon size={18} className="text-indigo-400 fill-indigo-400"/> 01.5 熄灯/微光模式 (Dark Mode)
                    </div>
                    {local.darkImage && (
                        <button onClick={downloadDarkImage} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors">
                        <Download size={14}/> DOWNLOAD DARK PNG
                        </button>
                    )}
                </div>

                <div className="relative aspect-video bg-slate-900/60 rounded-[2.5rem] border-2 border-indigo-900/30 overflow-hidden shadow-2xl">
                    {local.darkImage ? (
                        darkEditMode ? (
                            <>
                                <MaskCanvas imageSource={local.darkImage} onConfirm={handleDarkFix} onCancel={() => setDarkEditMode(false)} />
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg z-30 animate-in slide-in-from-top-4">
                                    <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-indigo-500/50 shadow-2xl flex gap-2">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 animate-pulse">
                                            <Wand2 size={20} className="text-white"/>
                                        </div>
                                        <input 
                                            value={darkEditPrompt}
                                            onChange={(e) => setDarkEditPrompt(e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-white text-sm font-bold placeholder:text-slate-500 px-2"
                                            placeholder="Fix Dark Mode: e.g. 'Make window view pitch black', 'Remove sunlight'..."
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative w-full h-full group">
                                <img src={local.darkImage} className="w-full h-full object-cover"/>
                            </div>
                        )
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                            <Moon size={48} className="text-indigo-500/30 mb-6"/>
                            <p className="text-xs text-indigo-400/60 font-bold max-w-sm mb-6">生成此场景的“关灯”版本。请使用下方滑块调整目标暗度。</p>
                            
                            <div className="w-full max-w-sm mb-8 bg-slate-900/80 p-6 rounded-2xl border border-indigo-900/50 shadow-inner">
                               <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center gap-2 text-indigo-300">
                                     <Moon size={14} className="fill-indigo-300"/>
                                     <span className="text-[10px] font-black uppercase tracking-widest">Darkness</span>
                                  </div>
                                  <div className="text-xs font-mono font-bold text-white bg-indigo-600 px-2 py-1 rounded">
                                     {darknessLevel < 25 ? "BLACKOUT" : darknessLevel < 60 ? "DIM" : "BLUE HOUR"} ({darknessLevel}%)
                                  </div>
                                  <div className="flex items-center gap-2 text-indigo-300">
                                     <Sun size={14}/>
                                  </div>
                               </div>
                               <input 
                                 type="range" 
                                 min="0" 
                                 max="100" 
                                 value={darknessLevel} 
                                 onChange={(e) => setDarknessLevel(Number(e.target.value))}
                                 className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                               />
                               <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase">
                                  <span>Pitch Black</span>
                                  <span>Cinematic Dim</span>
                                  <span>Ambient Glow</span>
                               </div>
                            </div>

                            <button onClick={handleGenDarkVariant} disabled={loading} className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-[2rem] font-black text-sm shadow-xl shadow-indigo-900/40 transition-all flex items-center gap-3 active:scale-95">
                                {loading ? <Loader2 className="animate-spin" size={18}/> : <Flame size={18}/>} 生成暗场图 (Generate Lights Off)
                            </button>
                        </div>
                    )}
                </div>

                {local.darkImage && !darkEditMode && (
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900/50 p-4 rounded-3xl border border-indigo-900/30">
                        <button onClick={() => setDarkEditMode(true)} className="flex-1 flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg transition-all active:scale-[0.98]">
                            <Wand2 size={18}/> Magic Fix (局部重绘)
                        </button>
                        <div className="flex-1 flex gap-4 w-full md:w-auto items-center">
                            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">
                                <Moon size={14} className="text-indigo-400"/>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={darknessLevel} 
                                    onChange={(e) => setDarknessLevel(Number(e.target.value))}
                                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <span className="text-[10px] font-mono text-indigo-400 w-8 text-right">{darknessLevel}%</span>
                            </div>
                            <button onClick={handleGenDarkVariant} disabled={loading} className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all active:scale-95">
                                {loading ? <Loader2 className="animate-spin" size={18}/> : <RefreshCw size={18}/>}
                            </button>
                        </div>
                    </div>
                )}

                {local.darkI2vPrompt && (
                   <div className="bg-slate-900/50 rounded-2xl p-6 border border-indigo-900/30">
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Dark Motion Prompt</span>
                         <button onClick={() => {navigator.clipboard.writeText(local.darkI2vPrompt || ""); alert("Copied!")}} className="text-indigo-400 hover:text-white"><Copy size={12}/></button>
                      </div>
                      <p className="text-xs font-mono text-indigo-200/80 leading-relaxed">{local.darkI2vPrompt}</p>
                   </div>
                )}
            </section>
        )}
        
        {/* 05: SHORTS STORYBOARD */}
        {local.generatedImage && (
            <section className="space-y-8 animate-in fade-in duration-700 bg-slate-900 border border-slate-800 p-8 rounded-[3rem]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-black text-pink-500 uppercase tracking-[0.4em]">
                        <Smartphone size={18} className="text-pink-500" /> 02. Shorts Storyboard (9:16)
                    </div>
                     <div className="flex gap-2">
                        {local.shortsStory?.frames && local.shortsStory.frames.some(f => f.imageUrl) && (
                            <button onClick={handleDownloadAllShots} className="text-[10px] font-black text-green-400 hover:text-green-300 flex items-center gap-2 transition-colors">
                                <Download size={14}/> DOWNLOAD ALL SHOTS
                            </button>
                        )}
                    </div>
                </div>

                {!local.shortsStory ? (
                   <div className="flex flex-col items-center justify-center p-8 bg-slate-950/50 rounded-3xl border border-slate-800/50 text-center">
                       <Film size={48} className="text-slate-800 mb-4"/>
                       <h4 className="text-slate-400 font-bold mb-2">Create Viral Shorts Narrative</h4>
                       <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
                          AI Director will analyze your scene and generate a 3-Step POV Script (Entering → Interacting → Relaxing) + Image Prompts for Veo/Sora.
                       </p>
                       
                       <div className="w-full max-w-lg mb-6">
                           <input 
                              value={shortsInstruction}
                              onChange={(e) => setShortsInstruction(e.target.value)}
                              placeholder="Optional: Custom direction (e.g. 'Show someone reading a book')" 
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-pink-500 outline-none"
                           />
                       </div>

                       <button onClick={handleGenShortsStory} disabled={loading} className="px-10 py-4 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-2xl font-black text-sm shadow-xl shadow-pink-900/20 transition-all flex items-center gap-3 active:scale-95">
                           {loading ? <Loader2 className="animate-spin" size={18}/> : <Wand2 size={18}/>} Generate Storyboard
                       </button>
                   </div>
                ) : (
                   <div className="space-y-6">
                       {/* Story Metadata */}
                       <div className="bg-slate-950/80 p-6 rounded-3xl border border-white/5">
                           <div className="flex items-start justify-between mb-4">
                               <div>
                                   <div className="text-[10px] text-pink-500 font-black uppercase tracking-widest mb-1">Viral Title</div>
                                   <div className="text-lg font-bold text-white">{local.shortsStory.title}</div>
                               </div>
                               <button onClick={() => setLocal({...local, shortsStory: undefined})} className="p-2 text-slate-600 hover:text-red-400"><Trash2 size={16}/></button>
                           </div>
                           <p className="text-sm text-slate-400 mb-3">{local.shortsStory.description}</p>
                           <div className="flex flex-wrap gap-2">
                               {local.shortsStory.tags.split(' ').map((tag, i) => (
                                   <span key={i} className="text-[10px] bg-slate-900 text-slate-500 px-2 py-1 rounded-lg">{tag}</span>
                               ))}
                           </div>
                       </div>

                       {/* Frames Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {local.shortsStory.frames.map((frame, idx) => (
                               <div key={idx} className="space-y-4">
                                   <div className="relative aspect-[9/16] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group">
                                       {frame.imageUrl ? (
                                           <>
                                             <img src={frame.imageUrl} className={`w-full h-full object-cover transition-opacity ${loadingFrames.includes(idx) ? 'opacity-50' : 'opacity-100'}`} />
                                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-4">
                                                 <div className="text-3xl font-black text-white font-impact tracking-tighter drop-shadow-lg uppercase">{frame.overlayText}</div>
                                             </div>
                                             
                                             {/* REGENERATE BUTTON OVERLAY */}
                                             <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button 
                                                    onClick={() => handleRegenerateFrame(idx)} 
                                                    disabled={loadingFrames.includes(idx)}
                                                    className="p-3 bg-black/60 hover:bg-pink-600 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
                                                    title="Regenerate this specific shot"
                                                 >
                                                    {loadingFrames.includes(idx) ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
                                                 </button>
                                             </div>
                                           </>
                                       ) : (
                                           <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                               <Film size={32} opacity={0.2}/>
                                           </div>
                                       )}
                                       <div className="absolute top-3 left-3 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white font-black text-xs border border-white/10">
                                           {frame.step}
                                       </div>
                                   </div>
                                   <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 h-32 overflow-y-auto">
                                       <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                           {idx === 0 ? <Footprints size={12}/> : idx === 1 ? <Hand size={12}/> : <BedDouble size={12}/>}
                                           Step {frame.step} Action
                                       </div>
                                       <p className="text-xs text-slate-300 leading-relaxed">{frame.actionDescription}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
                )}
            </section>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
