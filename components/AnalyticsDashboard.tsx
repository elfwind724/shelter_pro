
import React, { useState } from 'react';
import { AnalyticsRecord } from '../types';
import { parseAnalyticsData } from '../services/generator';
import { 
  X, TrendingUp, Users, Clock, Plus, Trash2, AlertTriangle, CheckCircle, 
  Target, Sparkles, Loader2, BarChart2, Radio, Smartphone, Activity, ArrowRight, Zap 
} from 'lucide-react';

interface Props {
  data: AnalyticsRecord[];
  onAdd: (record: AnalyticsRecord) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const AnalyticsDashboard: React.FC<Props> = ({ data, onAdd, onDelete, onClose }) => {
  const [newRecord, setNewRecord] = useState<Partial<AnalyticsRecord>>({
    date: new Date().toISOString().split('T')[0],
    ctr: 0,
    views: 0,
    impressions: 0,
    regulars: 0,
    subscribers: 0,
    recommendationRate: 0,
    deviceTV: 0,
    avgDuration: "00:00",
    notes: ""
  });

  const [rawInput, setRawInput] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleSmartExtract = async () => {
    if (!rawInput.trim()) return;
    setIsParsing(true);
    try {
      const extracted = await parseAnalyticsData(rawInput);
      setNewRecord(prev => ({
        ...prev,
        ...extracted,
        // Ensure defaults if AI misses them
        date: extracted.date || prev.date,
        avgDuration: extracted.avgDuration || prev.avgDuration,
        notes: extracted.notes || prev.notes
      }));
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.videoTitle) return alert("请输入视频标题");
    
    onAdd({
      id: crypto.randomUUID(),
      date: newRecord.date || new Date().toISOString().split('T')[0],
      videoTitle: newRecord.videoTitle || "Untitled Report",
      ctr: Number(newRecord.ctr),
      views: Number(newRecord.views),
      impressions: Number(newRecord.impressions) || 0,
      regulars: Number(newRecord.regulars),
      subscribers: Number(newRecord.subscribers) || 0,
      recommendationRate: Number(newRecord.recommendationRate) || 0,
      deviceTV: Number(newRecord.deviceTV) || 0,
      avgDuration: newRecord.avgDuration || "00:00",
      notes: newRecord.notes
    });

    // Reset Form
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      videoTitle: "",
      ctr: 0,
      views: 0,
      impressions: 0,
      regulars: 0,
      subscribers: 0,
      recommendationRate: 0,
      deviceTV: 0,
      avgDuration: "00:00",
      notes: ""
    });
    setRawInput("");
  };

  // --- ANALYSIS ENGINE ---
  const latest = data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  // Tactical AI Logic
  const getTacticalAdvice = (record: AnalyticsRecord | undefined) => {
    if (!record) return { status: 'waiting', msg: "等待数据录入..." };
    
    const { ctr, recommendationRate, regulars, deviceTV } = record;
    
    // Scenario 1: High Algorithmic Love, Low Click (Thumbnail Crisis)
    if ((recommendationRate || 0) > 80 && ctr < 3.5) {
      return { 
        status: 'critical', 
        title: 'Thumbnail Crisis (封面危机)',
        msg: `算法正在疯狂推流 (推荐率 ${recommendationRate}%)，但封面点击率过低 (${ctr}%)。你正在浪费算法的红利。立即更换高对比度封面。` 
      };
    }
    
    // Scenario 2: High Views, Zero Retention (Hook Crisis)
    if (regulars === 0 && record.views > 500) {
      return { 
        status: 'warning', 
        title: 'Retention Leak (留存泄露)',
        msg: `获得了 ${record.views} 次观看，但没有转化为常客。你的内容可能与封面承诺不符，或者缺乏“系列感”。` 
      };
    }

    // Scenario 3: High TV Usage (Optimize for Big Screen)
    if ((deviceTV || 0) > 40) {
      return {
        status: 'success',
        title: 'TV Dominance (电视大屏)',
        msg: `48% 的用户在电视上观看。请确保你的缩略图字体巨大，并且画面暗部细节在 OLED 屏幕上足够清晰。`
      };
    }

    return { status: 'stable', title: 'Steady Growth', msg: "数据平稳。继续保持现有策略，逐步优化 CTR。" };
  };

  const advice = getTacticalAdvice(latest);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
              <Activity className="text-orange-500" /> HAVEN <span className="text-orange-500">COMMAND</span>
            </h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2 ml-1">
              YouTube Strategic Intelligence Unit
            </p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left: Tactical Input & Control */}
          <div className="w-full lg:w-[350px] p-6 border-r border-slate-800 bg-slate-900/30 overflow-y-auto shrink-0 scrollbar-hide">
            
            {/* AI SMART EXTRACT */}
            <div className="mb-8 p-1 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-indigo-500/30">
               <div className="bg-slate-900/90 rounded-[1.3rem] p-5 backdrop-blur-sm">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={14} /> Intelligence Extraction
                  </h3>
                  <textarea
                    value={rawInput}
                    onChange={e => setRawInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 focus:border-indigo-500 outline-none h-32 resize-none placeholder:text-slate-600 mb-4 font-mono leading-relaxed"
                    placeholder="PASTE RAW EXECUTIVE SUMMARY HERE..."
                  />
                  <button 
                    onClick={handleSmartExtract} 
                    disabled={isParsing || !rawInput}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                  >
                    {isParsing ? <Loader2 size={14} className="animate-spin"/> : <Zap size={14}/>}
                    {isParsing ? "ANALYZING..." : "EXTRACT INTEL"}
                  </button>
               </div>
            </div>

            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Manual Override</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Simple Date & Title */}
               <div className="space-y-3">
                 <input type="date" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-400 text-xs outline-none focus:border-orange-500"/>
                 <input type="text" placeholder="Report Title" value={newRecord.videoTitle} onChange={e => setNewRecord({...newRecord, videoTitle: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs outline-none focus:border-orange-500 font-bold"/>
               </div>

               {/* Metrics Grid */}
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CTR %</label>
                    <input type="number" step="0.1" value={newRecord.ctr} onChange={e => setNewRecord({...newRecord, ctr: parseFloat(e.target.value)})} className="w-full bg-transparent text-orange-400 font-mono font-bold outline-none"/>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Views</label>
                    <input type="number" value={newRecord.views} onChange={e => setNewRecord({...newRecord, views: parseInt(e.target.value)})} className="w-full bg-transparent text-white font-mono font-bold outline-none"/>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Impressions</label>
                    <input type="number" value={newRecord.impressions} onChange={e => setNewRecord({...newRecord, impressions: parseInt(e.target.value)})} className="w-full bg-transparent text-slate-400 font-mono font-bold outline-none"/>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Algo %</label>
                    <input type="number" step="0.1" value={newRecord.recommendationRate} onChange={e => setNewRecord({...newRecord, recommendationRate: parseFloat(e.target.value)})} className="w-full bg-transparent text-blue-400 font-mono font-bold outline-none"/>
                  </div>
               </div>

               <button type="submit" className="w-full py-4 bg-orange-600/10 hover:bg-orange-600 hover:text-white border border-orange-500/30 text-orange-500 rounded-xl font-black uppercase tracking-widest transition-all text-xs">
                 Commit Data
               </button>
            </form>
          </div>

          {/* Right: The War Room Display */}
          <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
            
            {latest ? (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                
                {/* 1. TOP LEVEL ADVISOR */}
                <div className={`p-6 rounded-[2rem] border-2 flex items-start gap-5 ${
                  advice.status === 'critical' ? 'bg-red-900/10 border-red-500/50' : 
                  advice.status === 'warning' ? 'bg-orange-900/10 border-orange-500/50' :
                  'bg-green-900/10 border-green-500/50'
                }`}>
                   <div className={`p-4 rounded-2xl shrink-0 ${
                     advice.status === 'critical' ? 'bg-red-500 text-white' : 
                     advice.status === 'warning' ? 'bg-orange-500 text-white' :
                     'bg-green-500 text-white'
                   }`}>
                      {advice.status === 'critical' ? <AlertTriangle size={24}/> : <CheckCircle size={24}/>}
                   </div>
                   <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest mb-2 ${
                        advice.status === 'critical' ? 'text-red-400' : 'text-slate-300'
                      }`}>{advice.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">{advice.msg}</p>
                   </div>
                </div>

                {/* 2. THE FUNNEL VISUALIZATION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Impressions */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-slate-700"><Target size={24}/></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Reach</div>
                      <div className="text-3xl font-black text-slate-200 tracking-tighter">{(latest.impressions || 0).toLocaleString()}</div>
                      <div className="text-xs text-slate-600 mt-2 font-mono">IMPRESSIONS</div>
                   </div>

                   {/* Conversion Arrow */}
                   <div className="hidden md:flex flex-col items-center justify-center -mx-6 z-10">
                      <div className="bg-slate-800 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full border border-slate-700 mb-2">{latest.ctr}% CTR</div>
                      <ArrowRight size={24} className="text-slate-700"/>
                   </div>

                   {/* Views */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-slate-700"><Users size={24}/></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Views</div>
                      <div className="text-3xl font-black text-white tracking-tighter">{(latest.views || 0).toLocaleString()}</div>
                      <div className="text-xs text-green-500 mt-2 font-mono">CONVERTED</div>
                   </div>

                   {/* Conversion Arrow */}
                   <div className="hidden md:flex flex-col items-center justify-center -mx-6 z-10">
                      <div className="bg-slate-800 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full border border-slate-700 mb-2">
                        {((latest.subscribers || 0) / (latest.views || 1) * 100).toFixed(1)}% Sub
                      </div>
                      <ArrowRight size={24} className="text-slate-700"/>
                   </div>

                   {/* Regulars */}
                   <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden">
                      <div className="absolute top-4 right-4 text-slate-700"><TrendingUp size={24}/></div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Core Growth</div>
                      <div className="flex gap-4">
                         <div>
                            <div className="text-3xl font-black text-blue-400 tracking-tighter">+{latest.subscribers || 0}</div>
                            <div className="text-[10px] text-slate-500 mt-1">SUBS</div>
                         </div>
                         <div className="w-px bg-slate-800"></div>
                         <div>
                            <div className="text-3xl font-black text-orange-400 tracking-tighter">{latest.regulars || 0}</div>
                            <div className="text-[10px] text-slate-500 mt-1">REGULARS</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 3. ALGORITHM SIGNALS */}
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[2rem]">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Radio size={14}/> Algorithm Confidence
                      </h4>
                      <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                         <div className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-1000" style={{width: `${latest.recommendationRate || 0}%`}}></div>
                      </div>
                      <div className="flex justify-between mt-3 text-xs font-mono font-bold text-slate-400">
                         <span>0%</span>
                         <span className="text-white">{latest.recommendationRate || 0}% Recommended</span>
                         <span>100%</span>
                      </div>
                   </div>

                   <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[2rem]">
                      <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Smartphone size={14}/> Device Usage (TV vs Mobile)
                      </h4>
                      <div className="flex items-center gap-4">
                         <div className="flex-1 text-center p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="text-2xl font-black text-white">{latest.deviceTV || 0}%</div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">TV (Big Screen)</div>
                         </div>
                         <div className="flex-1 text-center p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <div className="text-2xl font-black text-slate-400">{100 - (latest.deviceTV || 0)}%</div>
                            <div className="text-[10px] text-slate-600 uppercase font-bold mt-1">Mobile/PC</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. AI NOTES */}
                {latest.notes && (
                  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem]">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Sparkles size={14} className="text-orange-500"/> Strategic Summary
                    </h4>
                    <p className="text-sm text-slate-300 leading-loose font-mono whitespace-pre-wrap">
                      {latest.notes}
                    </p>
                  </div>
                )}
                
                {/* 5. HISTORY TABLE */}
                <div className="pt-8 border-t border-slate-900">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Historical Data</h4>
                  <div className="space-y-2">
                    {data.map(record => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-slate-900/30 hover:bg-slate-900 border border-slate-800/50 rounded-xl transition-all group">
                         <div className="flex items-center gap-4">
                           <div className="w-2 h-2 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors"></div>
                           <div className="text-xs font-mono text-slate-500">{record.date}</div>
                           <div className="text-sm font-bold text-slate-300">{record.videoTitle}</div>
                         </div>
                         <div className="flex items-center gap-6">
                           <div className="text-xs font-mono text-slate-500"><span className="text-orange-400">{record.ctr}%</span> CTR</div>
                           <div className="text-xs font-mono text-slate-500">{record.views} Views</div>
                           <button onClick={() => onDelete(record.id)} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <BarChart2 size={64} className="mb-6 opacity-20"/>
                <p className="text-sm font-bold uppercase tracking-widest">No Strategic Data Available</p>
                <p className="text-xs mt-2">Paste your YouTube Executive Summary on the left to begin.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
