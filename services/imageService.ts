
import { GoogleGenAI } from "@google/genai";
import { ThumbnailLayerConfig, BadgeConfig } from "../types";

// ... (Constants and helper functions like cleanPromptForGemini, generateImagePreview kept the same)
const NEGATIVE_PROMPTS = "worst quality, normal quality, low quality, low res, blurry, artifacts, jpeg artifacts, washed-out backgrounds, low detail, extra limbs, distorted hands, incorrect anatomy, poorly drawn hands, poorly drawn feet, missing digits, extra digits, interlocked fingers, deformed bows, Polydactyly, multiple limbs, watermark, signature, text, logo, username, error, cut off, out of frame, body out of frame, draft, simple background, blank background, abstract background, tiling, open windows, rain inside, wet floor, flooded room, tile floor, marble floor, cold stone floor, ceramic tiles, hospital floor, clinical, dark room, gloomy interior, scary, horror, no visible hands, disembodied arms, first-person hands, deformed face, ugly face, mutated hands, missing legs";

const cleanPromptForGemini = (prompt: string): string => {
  return prompt.replace(/--ar\s+\d+:\d+/gi, '').replace(/--no\s+.*$/i, '').replace(/--v\s+.*$/i, '').replace(/--style\s+.*$/i, '').trim();
};

export const generateImagePreview = async (prompt: string, aspectRatio: string = "16:9"): Promise<string | null> => {
  try {
    const cleanPrompt = cleanPromptForGemini(prompt);
    const finalPrompt = `${cleanPrompt}\nIMPORTANT QUALITY GUIDELINES:\n- Avoid: ${NEGATIVE_PROMPTS}.\n- Ensure high fidelity and logic consistency.`;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: finalPrompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio } },
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

/**
 * HELPER: Draw Badge with accurate corner ribbon logic
 */
const drawBadge = (
  ctx: CanvasRenderingContext2D, 
  canvasW: number, 
  canvasH: number, 
  config: BadgeConfig, 
  isVertical: boolean
) => {
  if (!config.visible) return;

  const text = config.text.toUpperCase();
  const color = config.color;
  const fontSize = config.fontSize || 50;

  // --- STYLE 1: STANDARD BOX (MOVABLE) ---
  if (config.style === 'box') {
     ctx.font = `900 ${fontSize}px Impact, sans-serif`;
     const metrics = ctx.measureText(text);
     
     const paddingX = 25;
     const paddingY = 10;
     const badgeW = metrics.width + (paddingX * 2);
     const badgeH = fontSize + (paddingY * 2);
     
     // Position using Config X/Y (Default to Top Right if 0)
     // If x/y are 0 (uninitialized), put it in default spot
     let badgeX = config.x;
     let badgeY = config.y;
     
     // Basic safety default
     if (badgeX === 0 && badgeY === 0) {
        badgeX = canvasW - badgeW - 40;
        badgeY = 40;
     }

     // Draw Background
     ctx.fillStyle = color;
     ctx.beginPath();
     ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
     ctx.fill();
     
     // Border
     ctx.strokeStyle = 'white';
     ctx.lineWidth = 4;
     ctx.stroke();

     // Text
     ctx.fillStyle = 'white';
     ctx.textAlign = 'center';
     ctx.textBaseline = 'middle';
     ctx.shadowColor = "rgba(0,0,0,0.5)";
     ctx.shadowBlur = 4;
     
     const textCenterX = badgeX + (badgeW / 2);
     const textCenterY = badgeY + (badgeH / 2) + 2; 

     ctx.fillText(text, textCenterX, textCenterY);
     ctx.shadowBlur = 0;
  }
  
  // --- STYLE 2: RIBBON (CORNER DIAGONAL) ---
  else if (config.style === 'ribbon_tr' || config.style === 'ribbon_tl') {
    const isRight = config.style === 'ribbon_tr';
    ctx.font = `900 ${fontSize}px Impact, sans-serif`;
    
    // Ribbon Geometry
    // Offset from the corner vertex
    const offset = config.y || 80; // Distance from corner (hypotenuse distance roughly)
    const ribbonWidth = fontSize + 40;
    const ribbonLength = 800; // Long enough to span corner

    ctx.save();
    
    // 1. Move origin to the target corner
    if (isRight) {
       ctx.translate(canvasW, 0);
       // 2. Rotate 45 degrees to align diagonal
       ctx.rotate((45 * Math.PI) / 180);
    } else {
       ctx.translate(0, 0);
       ctx.rotate((-45 * Math.PI) / 180);
    }

    // 3. Draw the ribbon as a horizontal strip in rotated space
    // The "offset" shifts it down the Y axis of the rotated frame
    // Because we rotated 45 deg, positive Y goes "into" the canvas from the corner.
    
    // Fill
    ctx.fillStyle = color;
    ctx.fillRect(-ribbonLength / 2, offset, ribbonLength, ribbonWidth);

    // Borders (Top and Bottom of ribbon)
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.moveTo(-ribbonLength / 2, offset + 4);
    ctx.lineTo(ribbonLength / 2, offset + 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-ribbonLength / 2, offset + ribbonWidth - 4);
    ctx.lineTo(ribbonLength / 2, offset + ribbonWidth - 4);
    ctx.stroke();

    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    
    // Text is drawn at the center X (0), and center Y of the ribbon strip
    ctx.fillText(text, 0, offset + (ribbonWidth / 2) + 2);
    
    ctx.restore();
    ctx.shadowBlur = 0;
  }
};

export const compositeThumbnail = async (
  imageBase64: string, 
  headlines: string[],
  config?: ThumbnailLayerConfig,
  isVertical: boolean = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      if (isVertical) {
        canvas.width = 720;
        canvas.height = 1280; 
      } else {
        canvas.width = 1280;
        canvas.height = 720;  
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // 1. Draw Background
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawH = canvas.height;
        drawW = drawH * imgRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 2. Gradients for Readability
      const gradTop = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      gradTop.addColorStop(0, 'rgba(0,0,0,0.8)');
      gradTop.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradTop;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);

      const gradBot = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      gradBot.addColorStop(0, 'rgba(0,0,0,0)');
      gradBot.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = gradBot;
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // 3. Layout Configuration
      let headX, headY, headSize, subX, subY, subSize;

      if (isVertical) {
        headX = canvas.width / 2;
        headY = canvas.height * 0.15; 
        headSize = 100; 
        subX = canvas.width / 2;
        subY = canvas.height * 0.85; 
        subSize = 80;
      } else {
        headX = config?.headline.x ?? 640;
        headY = config?.headline.y ?? 100;
        headSize = config?.headline.fontSize ?? 150;
        subX = config?.subhead.x ?? 640;
        subY = config?.subhead.y ?? 620;
        subSize = config?.subhead.fontSize ?? 130;
      }
      
      const getAlign = (x: number, w: number): CanvasTextAlign => {
          if (isVertical) return 'center'; 
          if (x < w * 0.35) return 'left';
          if (x > w * 0.65) return 'right';
          return 'center';
      };

      // --- LAYER 1: HEADLINE (WHITE, TOP) ---
      if (headlines[0]) {
        ctx.textAlign = getAlign(headX, canvas.width);
        ctx.textBaseline = 'top'; 
        ctx.font = `900 ${headSize}px Impact, sans-serif`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = headSize * 0.15;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.strokeText(headlines[0].toUpperCase(), headX, headY);
        ctx.shadowBlur = 0; 
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = 'white';
        ctx.fillText(headlines[0].toUpperCase(), headX, headY);
      }

      // --- LAYER 2: SUBHEAD (YELLOW, BOTTOM) ---
      if (headlines[1]) {
        ctx.textAlign = getAlign(subX, canvas.width);
        ctx.textBaseline = 'bottom'; 
        ctx.font = `900 ${subSize}px Impact, sans-serif`;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = subSize * 0.15;
        ctx.lineJoin = 'round';
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.strokeText(headlines[1].toUpperCase(), subX, subY);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = '#FFFF00'; 
        ctx.fillText(headlines[1].toUpperCase(), subX, subY);
      }

      // --- LAYER 3: BADGE (Configurable) ---
      if (config?.badge && !isVertical) {
          drawBadge(ctx, canvas.width, canvas.height, config.badge, isVertical);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject("Image Load Error");
    img.src = imageBase64;
  });
};

export const editGeneratedImage = async (base64Image: string, instruction: string, maskImageBase64?: string): Promise<string | null> => {
     try {
      let finalImageToSend = base64Image;
      let prompt = `Edit this image: ${instruction}.`;
      if (maskImageBase64) prompt += ` Use the provided mask.`;
      
      const base64Data = finalImageToSend.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) { console.error(error); throw error; }
};

export const outpaintImage = async (base64Image: string, originalPrompt: string, zoomFactor: number): Promise<string | null> => {
     const cleanPrompt = cleanPromptForGemini(originalPrompt);
     // Stronger Prompting for Zoom Out
     const prompt = `[TASK] Generate a WIDER SHOT of this scene (Zoom Out ${zoomFactor}x). Show MORE of the surrounding environment while maintaining the exact same style, lighting, and core subject. Create a consistent expansion of the view. Context: ${cleanPrompt}`;
     
     const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }, 
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
};

export const cropImage = async (base64Image: string, zoomFactor: number, originalPrompt: string = ""): Promise<string | null> => {
     const cleanPrompt = cleanPromptForGemini(originalPrompt);
     // Stronger Prompting for Zoom In
     const prompt = `[TASK] Generate a CLOSE UP shot of this scene (Zoom In ${zoomFactor}x). Crop into the center details. Maintain high resolution, sharpness, and the exact same style. Do not lose detail. Context: ${cleanPrompt}`;
     
     const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
};

// --- FIX: IMPLEMENTED REAL I2V PROMPT GENERATION ---
export const generateVideoPromptFromImage = async (base64Image: string): Promise<string> => {
    try {
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Strict prompt engineering for Veo/Sora style outputs
        const prompt = `[TASK] Describe this image for a high-end AI Video Generator (like Veo or Sora). 
        [REQUIREMENTS]
        1. Describe the movement (rain falling, trees swaying, lights flickering, camera push-in).
        2. Describe the atmosphere (moody, cinematic, 8k).
        3. Format: "Cinematic shot of [Subject], [Action/Movement], [Atmosphere/Lighting], [Camera Move]".
        4. Keep it concise (under 40 words).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { 
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Data } }, 
                    { text: prompt }
                ] 
            },
        });
        
        return response.text || "Failed to generate motion prompt. Please try again.";
    } catch (error) {
        console.error("Video Prompt Generation Error:", error);
        return "Error analyzing image. Please ensure API key allows Vision tasks.";
    }
};
