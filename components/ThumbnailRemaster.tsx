
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Eraser, Sparkles, Download, X, ArrowRight, Type, Loader2, Wand2, ImageMinus, Move, Sliders, AlignCenter, AlignLeft, AlignRight, MousePointer2, Box, Bookmark } from 'lucide-react';
import { cleanImageText, analyzeDescriptionForText, compositeThumbnail } from '../services/imageService';
import { ThumbnailLayerConfig } from '../types';

interface Props {
  onClose: () => void;
}

const ThumbnailRemaster: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // NEW: Live Preview
  
  // Config State
  const [thumbText, setThumbText] = useState<string[]>(["", ""]);
  
  // Default Config with adjustable values
  const [thumbConfig, setThumbConfig] = useState<ThumbnailLayerConfig>({
    headline: { x: 640, y: 100, fontSize: 130 },  
    subhead: { x: 640, y: 620, fontSize: 100 },   
    badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 60, fontSize: 35 } 
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LIVE PREVIEW EFFECT ---
  useEffect(() => {
    let isMounted = true;
    if (step === 2 && cleanedImage) {
      const generatePreview = async () => {
        try {
          // Generate a composite based on CURRENT state (Text & Config)
          const result = await compositeThumbnail(cleanedImage, thumbText, thumbConfig, false);
          if (isMounted) setPreviewImage(result);
        } catch (e) {
          console.error("Preview generation failed", e);
        }
      };
      
      // Debounce slightly to avoid lagging UI on slider drag
      const timer = setTimeout(generatePreview, 50);
      return () => { 
        clearTimeout(timer); 
        isMounted = false; 
      };
    }
  }, [thumbText, thumbConfig, cleanedImage, step]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setOriginalImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!originalImage || !description) return alert("Please upload an image and provide a description.");
    setLoading(true);
    try {
      // Parallel Execution: Clean Image + Analyze Text
      const [cleanResult, textResult] = await Promise.all([
        cleanImageText(originalImage),
        analyzeDescriptionForText(description)
      ]);

      if (cleanResult) {
        setCleanedImage(cleanResult);
        setThumbText([textResult.headline.toUpperCase(), textResult.subhead.toUpperCase()]);
        setPreviewImage(cleanResult); // Init preview with clean image
        setStep(2);
      } else {
        alert("Failed to clean image.");
      }
    } catch (e) {
      console.error(e);
      alert("Error processing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComposite = async () => {
    if (!cleanedImage) return;
    setLoading(true);
    try {
        // CRITICAL FIX: DO NOT use 'previewImage' state here. It might be stale or mid-debounce.
        // We must RE-GENERATE the image using the EXACT current values of thumbText and thumbConfig.
        // This ensures WYSIWYG (What You See Is What You Get).
        const finalRender = await compositeThumbnail(cleanedImage, thumbText, thumbConfig, false);
        setFinalImage(finalRender);
        setStep(3);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
              <ImageMinus className="text-pink-500" /> THUMBNAIL <span className="text-pink-500">REMASTER</span>
            </h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2 ml-1">
              Legacy Content Modernization Tool
            </p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
           
           {/* STEP 1: UPLOAD & INPUT */}
           {step === 1 && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center border-dashed border-2 border-slate-700 hover:border-pink-500/50 transition-colors group relative overflow-hidden h-96 lg:h-auto">
                    {originalImage ? (
                        <img src={originalImage} className="w-full h-full object-contain rounded-xl z-10" />
                    ) : (
                        <div className="text-center z-10">
                            <Upload size={48} className="mx-auto mb-4 text-slate-600 group-hover:text-pink-500 transition-colors"/>
                            <p className="text-slate-400 font-bold mb-2">Upload Old Thumbnail</p>
                            <p className="text-xs text-slate-600">Supports JPG, PNG (Max 5MB)</p>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" accept="image/*"/>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 block">Original Video Description</label>
                        <textarea 
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                           className="w-full h-64 lg:h-full bg-transparent resize-none outline-none text-slate-300 text-sm font-mono leading-relaxed placeholder:text-slate-700"
                           placeholder="Paste the YouTube description here. AI will extract the best headline keywords..."
                        />
                    </div>
                    <button 
                       onClick={handleProcess} 
                       disabled={loading || !originalImage || !description}
                       className="py-6 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-900/40 transition-all flex items-center justify-center gap-3"
                    >
                       {loading ? <Loader2 className="animate-spin"/> : <Wand2 />} 
                       {loading ? "AI WORKING..." : "MAGIC REMASTER"}
                    </button>
                </div>
             </div>
           )}

           {/* STEP 2: REVIEW & TWEAK */}
           {step === 2 && cleanedImage && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* PREVIEW AREA */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                    <div className="absolute top-4 left-4 bg-pink-600 backdrop-blur px-3 py-1 rounded text-[10px] font-black uppercase text-white z-20 shadow-lg border border-white/20">Live Preview</div>
                    {/* SHOW COMPOSITE IF READY, ELSE SHOW CLEANED */}
                    <img src={previewImage || cleanedImage} className="w-full h-auto object-contain max-h-[60vh] shadow-2xl" />
                </div>

                {/* CONTROLS AREA */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh] scrollbar-hide">
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
                        <Sliders className="text-pink-500" size={20}/> Fine-Tune Design
                    </h3>
                    
                    {/* TEXT INPUTS - HEADLINE */}
                    <div className="space-y-4 p-5 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                                    <Type size={12}/> Headline (White)
                                </label>
                                <span className="text-[10px] text-slate-600 font-mono">Size: {thumbConfig.headline.fontSize}</span>
                            </div>
                            <input 
                                value={thumbText[0]}
                                onChange={e => setThumbText([e.target.value, thumbText[1]])}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-white focus:border-pink-500 outline-none mb-3"
                            />
                            
                            <div className="grid grid-cols-12 gap-3 items-center">
                                {/* Size Slider */}
                                <div className="col-span-12 mb-2">
                                    <input 
                                        type="range" min="50" max="250" 
                                        value={thumbConfig.headline.fontSize}
                                        onChange={(e) => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, fontSize: Number(e.target.value)}})}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white"
                                    />
                                </div>
                                {/* X Position */}
                                <div className="col-span-6 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600 w-3">X</span>
                                    <input 
                                        type="range" min="0" max="1280" 
                                        value={thumbConfig.headline.x}
                                        onChange={(e) => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, x: Number(e.target.value)}})}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                    />
                                </div>
                                {/* Y Position */}
                                <div className="col-span-6 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600 w-3">Y</span>
                                    <input 
                                        type="range" min="0" max="720" 
                                        value={thumbConfig.headline.y}
                                        onChange={(e) => setThumbConfig({...thumbConfig, headline: {...thumbConfig.headline, y: Number(e.target.value)}})}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TEXT INPUTS - SUBHEAD */}
                    <div className="space-y-4 p-5 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
                                    <Type size={12}/> Subhead (Yellow)
                                </label>
                                <span className="text-[10px] text-slate-600 font-mono">Size: {thumbConfig.subhead.fontSize}</span>
                            </div>
                            <input 
                                value={thumbText[1]}
                                onChange={e => setThumbText([thumbText[0], e.target.value])}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-yellow-500 focus:border-yellow-500 outline-none mb-3"
                            />
                            
                            <div className="grid grid-cols-12 gap-3 items-center">
                                {/* Size Slider */}
                                <div className="col-span-12 mb-2">
                                    <input 
                                        type="range" min="40" max="200" 
                                        value={thumbConfig.subhead.fontSize}
                                        onChange={(e) => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, fontSize: Number(e.target.value)}})}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                </div>
                                {/* X Position */}
                                <div className="col-span-6 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600 w-3">X</span>
                                    <input 
                                        type="range" min="0" max="1280" 
                                        value={thumbConfig.subhead.x}
                                        onChange={(e) => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, x: Number(e.target.value)}})}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                    />
                                </div>
                                {/* Y Position */}
                                <div className="col-span-6 flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-600 w-3">Y</span>
                                    <input 
                                        type="range" min="0" max="720" 
                                        value={thumbConfig.subhead.y}
                                        onChange={(e) => setThumbConfig({...thumbConfig, subhead: {...thumbConfig.subhead, y: Number(e.target.value)}})}
                                        className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BADGE SETTINGS (MOVER) */}
                    <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Move size={12}/> Badge (Corner)</span>
                           <div className="flex gap-1">
                              <button onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, text: "NO MUSIC", color: "#16a34a"}})} className={`px-2 py-1 rounded text-[10px] font-bold ${thumbConfig.badge.text === "NO MUSIC" ? "bg-green-600 text-white" : "bg-slate-800 text-slate-500"}`}>NO MUSIC</button>
                              <button onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, text: "LOFI BEATS", color: "#a855f7"}})} className={`px-2 py-1 rounded text-[10px] font-bold ${thumbConfig.badge.text === "LOFI BEATS" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-500"}`}>LOFI</button>
                              <button onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, visible: !thumbConfig.badge.visible}})} className={`px-2 py-1 rounded text-[10px] font-bold ${!thumbConfig.badge.visible ? "bg-red-900/50 text-red-400" : "bg-slate-800 text-slate-500"}`}>{thumbConfig.badge.visible ? "HIDE" : "HIDDEN"}</button>
                           </div>
                        </div>
                        
                        {thumbConfig.badge.visible && (
                            <div className="space-y-4">
                                {/* STYLE SELECTOR: Ribbon vs Box */}
                                <div className="flex items-center justify-between mb-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Box size={10}/> Shape</span>
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, style: 'ribbon_tr', y: 60}})}
                                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${thumbConfig.badge.style === 'ribbon_tr' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            <Bookmark size={10} className="rotate-90"/> Ribbon
                                        </button>
                                        <button 
                                            onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, style: 'box', x: 1050, y: 50}})}
                                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${thumbConfig.badge.style === 'box' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                        >
                                            <Box size={10}/> Box
                                        </button>
                                    </div>
                                </div>

                                {thumbConfig.badge.style === 'box' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                 <div className="flex justify-between mb-1">
                                                    <label className="text-[10px] font-bold text-slate-500">Pos X</label>
                                                    <span className="text-[10px] font-mono text-pink-400">{thumbConfig.badge.x}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="1150" 
                                                    value={thumbConfig.badge.x}
                                                    onChange={(e) => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, x: Number(e.target.value)}})}
                                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                                />
                                            </div>
                                            <div>
                                                 <div className="flex justify-between mb-1">
                                                    <label className="text-[10px] font-bold text-slate-500">Pos Y</label>
                                                    <span className="text-[10px] font-mono text-pink-400">{thumbConfig.badge.y}</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="650" 
                                                    value={thumbConfig.badge.y}
                                                    onChange={(e) => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, y: Number(e.target.value)}})}
                                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[10px] font-bold text-slate-500">Corner Distance</label>
                                            <span className="text-[10px] font-mono text-pink-400">{thumbConfig.badge.y}px</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="400" 
                                            value={thumbConfig.badge.y}
                                            onChange={(e) => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, y: Number(e.target.value)}})}
                                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                            title="Move the badge further from corner"
                                        />
                                    </div>
                                )}
                                
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-[10px] font-bold text-slate-500">Size</label>
                                        <span className="text-[10px] font-mono text-pink-400">{thumbConfig.badge.fontSize}px</span>
                                    </div>
                                    <input 
                                        type="range" min="20" max="100" 
                                        value={thumbConfig.badge.fontSize}
                                        onChange={(e) => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, fontSize: Number(e.target.value)}})}
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                       onClick={handleComposite} 
                       disabled={loading}
                       className="mt-auto py-5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black text-sm shadow-xl shadow-green-900/40 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                       {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>} 
                       CONFIRM & DOWNLOAD
                    </button>
                </div>
             </div>
           )}

           {/* STEP 3: DOWNLOAD */}
           {step === 3 && finalImage && (
             <div className="flex flex-col items-center justify-center h-full gap-8">
                 <div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-[2rem] border-2 border-slate-800 overflow-hidden shadow-2xl ring-4 ring-pink-500/20">
                     {/* FIX: Use object-contain to prevent cropping/zooming illusion */}
                     <img src={finalImage} className="w-full h-full object-contain" />
                 </div>
                 
                 <div className="flex gap-4">
                     <button onClick={() => setStep(2)} className="px-8 py-4 bg-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold transition-all flex items-center gap-2">
                        <Sliders size={16}/> Keep Tweaking
                     </button>
                     <button 
                        onClick={() => {
                            const link = document.createElement('a');
                            link.download = `REMASTERED_${Date.now()}.jpg`;
                            link.href = finalImage;
                            link.click();
                        }} 
                        className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black shadow-xl shadow-pink-900/40 transition-all flex items-center gap-3 active:scale-95"
                     >
                        <Download /> DOWNLOAD RESULT
                     </button>
                 </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default ThumbnailRemaster;
