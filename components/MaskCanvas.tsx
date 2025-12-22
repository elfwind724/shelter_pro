import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Paintbrush, Trash2, Check, X } from 'lucide-react';

interface MaskCanvasProps {
  imageSource: string;
  onConfirm: (maskBase64: string) => void;
  onCancel: () => void;
}

const MaskCanvas: React.FC<MaskCanvasProps> = ({ imageSource, onConfirm, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(50); // Slightly larger default
  const [mode, setMode] = useState<'brush' | 'eraser'>('brush');

  // Initialize Canvas Size
  useEffect(() => {
    const img = new Image();
    img.src = imageSource;
    img.onload = () => {
      if (canvasRef.current && containerRef.current) {
        // Set internal resolution to match standard 16:9 
        canvasRef.current.width = 1280;
        canvasRef.current.height = 720;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
        }
      }
    };
  }, [imageSource]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      draw(e); // Draw initial dot
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();

    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineWidth = brushSize;
      
      if (mode === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        // VISUAL FEEDBACK ONLY: We draw semi-transparent red for the user.
        // The export logic will ignore this color and strictly check opacity.
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; 
      } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      }
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // UPDATED: Pixel-Perfect Binary Mask Generation
  const handleConfirm = () => {
    if (canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const ctx = canvasRef.current.getContext('2d');

      if (!ctx) return;

      // 1. Get raw pixel data from the user's drawing layer
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // 2. Create a new buffer for the final binary mask
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return;

      const finalImageData = maskCtx.createImageData(width, height);
      const finalData = finalImageData.data;

      // 3. Iterate through every pixel
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]; // The Alpha channel (0-255)

        if (alpha > 0) {
          // IF USER PAINTED HERE (Any opacity):
          // Force Pure White (The "Selection")
          finalData[i] = 255;     // R
          finalData[i + 1] = 255; // G
          finalData[i + 2] = 255; // B
          finalData[i + 3] = 255; // Alpha (Opaque)
        } else {
          // IF EMPTY:
          // Force Pure Black (The "Background")
          finalData[i] = 0;       // R
          finalData[i + 1] = 0;   // G
          finalData[i + 2] = 0;   // B
          finalData[i + 3] = 255; // Alpha (Opaque)
        }
      }

      // 4. Put the binary data onto the temp canvas
      maskCtx.putImageData(finalImageData, 0, 0);

      // 5. Export as clean PNG
      const binaryMaskBase64 = maskCanvas.toDataURL('image/png');
      onConfirm(binaryMaskBase64);
    }
  };

  return (
    <div className="relative w-full h-full group select-none" ref={containerRef}>
      {/* Background Image - The visual reference */}
      <img 
        src={imageSource} 
        alt="Reference" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
      />
      
      {/* Canvas Layer - Where user draws */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* Floating Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 rounded-full px-4 py-2 flex items-center gap-4 shadow-xl backdrop-blur-md z-10">
        <div className="flex items-center gap-1 border-r border-slate-700 pr-4">
           <button 
             onClick={() => setMode('brush')}
             className={`p-2 rounded-full transition-colors ${mode === 'brush' ? 'bg-red-500/20 text-red-400' : 'text-slate-400 hover:text-white'}`}
             title="Brush"
           >
             <Paintbrush size={18} />
           </button>
           <button 
             onClick={() => setMode('eraser')}
             className={`p-2 rounded-full transition-colors ${mode === 'eraser' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
             title="Eraser"
           >
             <Eraser size={18} />
           </button>
        </div>

        <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
           <span className="text-[10px] uppercase font-bold text-slate-500">Size</span>
           <input 
             type="range" 
             min="10" 
             max="150" 
             value={brushSize} 
             onChange={(e) => setBrushSize(Number(e.target.value))}
             className="w-24 accent-red-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
           />
        </div>

        <button 
             onClick={clearCanvas}
             className="p-2 text-slate-400 hover:text-red-400 transition-colors"
             title="Clear All"
           >
             <Trash2 size={18} />
        </button>
      </div>

      {/* Confirm Actions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
         <button 
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-lg backdrop-blur-md border border-slate-700 font-bold text-sm transition-all"
         >
            <X size={16} /> Cancel
         </button>
         <button 
            onClick={handleConfirm}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg shadow-red-900/40 font-bold text-sm transition-all animate-in fade-in zoom-in"
         >
            <Check size={16} /> Done Painting
         </button>
      </div>
      
      {/* Help Text */}
      <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded text-xs text-white backdrop-blur-sm pointer-events-none z-10 border border-white/10">
        Red Area = What to Change
      </div>
    </div>
  );
};

export default MaskCanvas;