
import React, { useState, useRef } from 'react';
import { Upload, Eraser, Sparkles, Download, X, ArrowRight, Type, Loader2, Wand2, ImageMinus } from 'lucide-react';
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
  
  // Config State (Reusing App Logic)
  const [thumbText, setThumbText] = useState<string[]>(["", ""]);
  const [thumbConfig, setThumbConfig] = useState<ThumbnailLayerConfig>({
    headline: { x: 640, y: 100, fontSize: 160 }, 
    subhead: { x: 640, y: 620, fontSize: 130 },
    badge: { visible: true, text: "NO MUSIC", style: 'ribbon_tr', color: '#16a34a', x: 0, y: 80, fontSize: 50 }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const result = await compositeThumbnail(cleanedImage, thumbText, thumbConfig, false);
      setFinalImage(result);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
        
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
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center border-dashed border-2 border-slate-700 hover:border-pink-500/50 transition-colors group relative overflow-hidden">
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
                           className="w-full h-full bg-transparent resize-none outline-none text-slate-300 text-sm font-mono leading-relaxed placeholder:text-slate-700"
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
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white z-10">Cleaned Base</div>
                    <img src={cleanedImage} className="w-full h-full object-contain" />
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col gap-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Type className="text-pink-500"/> Text Overlay Settings
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase">Headline (White)</label>
                            <input 
                                value={thumbText[0]}
                                onChange={e => setThumbText([e.target.value, thumbText[1]])}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-white focus:border-pink-500 outline-none mt-2"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase">Subhead (Yellow)</label>
                            <input 
                                value={thumbText[1]}
                                onChange={e => setThumbText([thumbText[0], e.target.value])}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-lg font-black text-yellow-500 focus:border-yellow-500 outline-none mt-2"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Badge Type</span>
                           <div className="flex gap-2">
                              <button onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, text: "NO MUSIC", color: "#16a34a"}})} className={`px-3 py-1 rounded-lg text-xs font-bold ${thumbConfig.badge.text === "NO MUSIC" ? "bg-green-600 text-white" : "bg-slate-800 text-slate-500"}`}>NO MUSIC</button>
                              <button onClick={() => setThumbConfig({...thumbConfig, badge: {...thumbConfig.badge, text: "LOFI BEATS", color: "#a855f7"}})} className={`px-3 py-1 rounded-lg text-xs font-bold ${thumbConfig.badge.text === "LOFI BEATS" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-500"}`}>LOFI</button>
                           </div>
                        </div>
                    </div>

                    <button 
                       onClick={handleComposite} 
                       disabled={loading}
                       className="mt-auto py-6 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-900/40 transition-all flex items-center justify-center gap-3"
                    >
                       {loading ? <Loader2 className="animate-spin"/> : <Sparkles />} 
                       RENDER FINAL THUMBNAIL
                    </button>
                </div>
             </div>
           )}

           {/* STEP 3: DOWNLOAD */}
           {step === 3 && finalImage && (
             <div className="flex flex-col items-center justify-center h-full gap-8">
                 <div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-[2rem] border-2 border-slate-800 overflow-hidden shadow-2xl">
                     <img src={finalImage} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="flex gap-4">
                     <button onClick={() => setStep(1)} className="px-8 py-4 bg-slate-800 text-slate-300 hover:text-white rounded-2xl font-bold transition-all">
                        Do Another
                     </button>
                     <button 
                        onClick={() => {
                            const link = document.createElement('a');
                            link.download = `REMASTERED_${Date.now()}.jpg`;
                            link.href = finalImage;
                            link.click();
                        }} 
                        className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black shadow-xl shadow-pink-900/40 transition-all flex items-center gap-3"
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
