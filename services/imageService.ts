
import { GoogleGenAI, Type } from "@google/genai";
import { ThumbnailLayerConfig, BadgeConfig, ShortsStory, ShortsFrame } from "../types";

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
  const fontSize = config.fontSize || 30;

  // --- STYLE 1: STANDARD BOX (MOVABLE) ---
  if (config.style === 'box') {
     ctx.font = `900 ${fontSize}px Impact, sans-serif`;
     const metrics = ctx.measureText(text);
     
     const paddingX = 25;
     const paddingY = 10;
     const badgeW = metrics.width + (paddingX * 2);
     const badgeH = fontSize + (paddingY * 2);
     
     // Position using Config X/Y (Default to Top Right if 0)
     let badgeX = config.x;
     let badgeY = config.y;
     
     // Basic safety default if uninitialized
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
    const offset = config.y || 60; 
    const ribbonWidth = fontSize * 1.6; 
    // FIX: Massive length to prevent cutoff on any resolution/rotation
    const ribbonLength = 4000; 

    ctx.save();
    
    // 1. Move origin to the target corner
    if (isRight) {
       ctx.translate(canvasW, 0);
       ctx.rotate((45 * Math.PI) / 180);
    } else {
       ctx.translate(0, 0);
       ctx.rotate((-45 * Math.PI) / 180);
    }

    // 2. Draw the ribbon strip
    ctx.fillStyle = color;
    ctx.fillRect(-ribbonLength / 2, offset, ribbonLength, ribbonWidth);

    // Borders
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.moveTo(-ribbonLength / 2, offset + 2);
    ctx.lineTo(ribbonLength / 2, offset + 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-ribbonLength / 2, offset + ribbonWidth - 2);
    ctx.lineTo(ribbonLength / 2, offset + ribbonWidth - 2);
    ctx.stroke();

    // Text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    
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
    img.crossOrigin = "anonymous"; // Safety
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // FIXED RESOLUTION: Always 1280x720 for thumbnails
      if (isVertical) {
        canvas.width = 720;
        canvas.height = 1280; 
      } else {
        canvas.width = 1280;
        canvas.height = 720;  
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // 1. Draw Background - "Cover" Fit Logic
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
        // Use Vertical Config if present, else fallback to hardcoded defaults
        headX = config?.verticalHeadline?.x ?? canvas.width / 2;
        headY = config?.verticalHeadline?.y ?? canvas.height * 0.15;
        headSize = config?.verticalHeadline?.fontSize ?? 100;
        
        subX = config?.verticalSubhead?.x ?? canvas.width / 2;
        subY = config?.verticalSubhead?.y ?? canvas.height * 0.85;
        subSize = config?.verticalSubhead?.fontSize ?? 80;
      } else {
        // Use Manual Config for Horizontal
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

      // --- HELPER: AUTO-SCALE TEXT ---
      const drawFittedText = (
        text: string, 
        x: number, 
        y: number, 
        initialSize: number, 
        color: string, 
        stroke: boolean = true,
        baseline: CanvasTextBaseline = 'top'
      ) => {
          if (!text) return;
          const uppercaseText = text.toUpperCase();
          const maxWidth = canvas.width * 0.9; // 90% of canvas width
          let currentSize = initialSize;
          
          ctx.font = `900 ${currentSize}px Impact, sans-serif`;
          let metrics = ctx.measureText(uppercaseText);
          
          // Shrink loop
          while (metrics.width > maxWidth && currentSize > 40) {
              currentSize -= 5;
              ctx.font = `900 ${currentSize}px Impact, sans-serif`;
              metrics = ctx.measureText(uppercaseText);
          }

          ctx.textAlign = getAlign(x, canvas.width);
          ctx.textBaseline = baseline;
          
          if (stroke) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = currentSize * 0.15;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 10;
            ctx.strokeText(uppercaseText, x, y);
            ctx.shadowBlur = 0; 
            ctx.shadowOffsetY = 0;
          }
          
          ctx.fillStyle = color;
          ctx.fillText(uppercaseText, x, y);
      };

      // --- LAYER 1: HEADLINE (WHITE, TOP) ---
      if (headlines[0]) {
        drawFittedText(headlines[0], headX, headY, headSize, 'white', true, 'top');
      }

      // --- LAYER 2: SUBHEAD (YELLOW, BOTTOM) ---
      if (headlines[1]) {
        drawFittedText(headlines[1], subX, subY, subSize, '#FFFF00', true, 'bottom');
      }

      // --- LAYER 3: BADGE (Configurable) ---
      if (config?.badge && !isVertical) {
          drawBadge(ctx, canvas.width, canvas.height, config.badge, isVertical);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.95));
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
  try {
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
  } catch (error) { console.error(error); throw error; }
};

export const cropImage = async (base64Image: string, zoomFactor: number, originalPrompt: string = ""): Promise<string | null> => {
  try {
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
  } catch (error) { console.error(error); throw error; }
};

export const generateVideoPromptFromImage = async (base64Image: string, isStatic: boolean = false): Promise<string> => {
    try {
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let prompt;
        if (isStatic) {
            // DARK MODE: STRICT STATIC & ATMOSPHERIC
            prompt = `[TASK] Write a TEXT-TO-VIDEO prompt for a STATIC, ATMOSPHERIC NIGHT scene.
[CRITICAL] CAMERA MUST BE STATIC (TRIPOD). NO MOVEMENT.
[FOCUS] Describe the subtle, calming movement of light and weather ONLY.
[DETAILS]:
- Focus on the flickering light source (fire, lamp, dashboard buttons).
- Mention the rain/snow patterns hitting the glass (if applicable).
- Keep the overall scene still and peaceful.
[OUTPUT] A single, immersive paragraph focusing on atmosphere.`;
        } else {
            // LIGHT MODE: RICH DYNAMIC & CINEMATIC
            prompt = `[TASK] Write a HIGH-END CINEMATIC VIDEO PROMPT for Sora/Veo.
[CRITICAL] CAMERA MUST BE DYNAMIC. Use professional film terms.
[MOVEMENT EXAMPLES]: "Slow Push-In towards the window", "Low Angle Tracking Shot across the floor", "Smooth Parallax Pan".
[ACTION]: Describe the environment coming alive:
- Wind blowing curtains, plants, or trees outside.
- Rain streaming heavily on glass.
- Steam rising dynamically from hot food/drinks.
- Dust motes dancing in light beams.
[OUTPUT] A rich, visual, and directional paragraph describing the camera path and scene action.`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
        });
        return response.text || "Failed to generate motion prompt.";
    } catch (error) { return "Error analyzing image."; }
};

export const generateDarkVariant = async (base64Image: string, originalPrompt: string, brightnessLevel: number = 20): Promise<string | null> => {
    try {
        let sanitizedContext = cleanPromptForGemini(originalPrompt);
        const forbiddenTerms = [/fire/gi, /flame/gi, /burning/gi, /stove/gi, /fireplace/gi, /warm/gi, /glow/gi, /light/gi, /lamp/gi, /candle/gi, /lit/gi, /bright/gi, /sun/gi, /day/gi, /morning/gi, /noon/gi];
        forbiddenTerms.forEach(term => { sanitizedContext = sanitizedContext.replace(term, ""); });

        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `[TASK] RE-RENDER as PITCH BLACK NIGHT (Brightness: ${brightnessLevel}%). TURN OFF ALL LIGHTS. Context: ${sanitizedContext}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
            config: { imageConfig: { aspectRatio: "16:9" } },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (error) { throw error; }
};

export const generateShortsStoryline = async (base64Image: string, originalPrompt: string, userInstruction?: string): Promise<ShortsStory> => {
    try {
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // --- 1. SCRIPT GENERATION (THE DIRECTOR) ---
        // Enhanced to analyze specific scene inventory for unique interactions
        const scriptPrompt = `
[ROLE] You are a Viral Shorts Director.
[TASK] Create a 3-Shot First-Person POV Narrative based on the image context.
[SCENE CONTEXT]: ${originalPrompt}

[CRITICAL INSTRUCTION: SCENE CONSISTENCY & INTERACTION]
1. ANALYZE THE SCENE: What specific objects are in this room? (e.g., Is there a Fish Tank? A Guitar? A Wood Stove? A Computer? A Cat?)
2. CREATE UNIQUE INTERACTIONS: 
   - If there is a Fish Tank -> Shot 2 should be "Feeding the fish" or "Touching the glass".
   - If there is a Stove -> Shot 2 should be "Adding a log" or "Warming hands".
   - If there is a Book -> Shot 2 should be "Turning a page".
   - DO NOT default to "Eating/Drinking" unless there is food on the table in the main image.

[STRICT POV RULES]
⛔️ PROHIBITED: "Silhouette", "Figure", "Person standing", "Third person".
✅ MANDATORY: STRICT FIRST PERSON POV. The viewer IS the character.

[NARRATIVE STRUCTURE]

1. SHOT 1 (THE GAZE - ESTABLISHING): 
   - VISUAL: First Person POV standing at the main window/opening.
   - ACTION: My hands resting on the specific material of the sill (wood/stone/metal). Watching the weather.
   - TEXT OVERLAY: "STORM OUTSIDE", "ALONE IN SPACE".

2. SHOT 2 (THE INTERACTION - SPECIFIC): 
   - VISUAL: First Person POV interacting with a UNIQUE object found in the [SCENE CONTEXT].
   - ACTION: Using hands to interact (Pouring, Typing, Tuning, Feeding, Stroking pet).
   - TEXT OVERLAY: related to the action (e.g., "FEEDING TIME", "WARM FIRE").

3. SHOT 3 (THE REST - CLOSING LOOP): 
   - VISUAL: First Person POV lying down on the specific bed/sofa from the scene.
   - ACTION: Looking down at my own legs under the specific blanket texture from scene. Closing eyes.
   - TEXT OVERLAY: "GOODNIGHT", "SAFE HERE".

[OUTPUT JSON SCHEMA]
{
  "title": "Viral Title",
  "description": "Caption",
  "tags": "#tags",
  "frames": [
    { "step": 1, "overlayText": "TEXT", "actionDescription": "POV looking out window...", "imagePrompt": "First Person POV standing at window..." },
    { "step": 2, "overlayText": "TEXT", "actionDescription": "POV interacting with specific object...", "imagePrompt": "First Person POV [Specific Interaction]..." },
    { "step": 3, "overlayText": "TEXT", "actionDescription": "POV lying down...", "imagePrompt": "First Person POV lying in bed..." }
  ]
}
`;

        const scriptResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: scriptPrompt }] },
        });
        
        let jsonString = scriptResponse.text || "{}";
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/) || jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) jsonString = jsonMatch[1];
        
        let scriptData;
        try {
            scriptData = JSON.parse(jsonString) as ShortsStory;
        } catch (e) {
            console.warn("JSON Parse Failed, falling back to empty.");
        }

        if (!scriptData || !Array.isArray(scriptData.frames)) {
            // Fallback
            scriptData = {
                title: "Safe Haven",
                description: "The perfect escape.",
                tags: "#shorts #cozy",
                frames: [
                    { step: 1, actionDescription: "POV standing at window.", overlayText: "STORM", imagePrompt: "First Person POV standing at window looking out." },
                    { step: 2, actionDescription: "POV warming hands.", overlayText: "WARMTH", imagePrompt: "First Person POV warming hands by the fire." },
                    { step: 3, actionDescription: "POV lying down.", overlayText: "SLEEP", imagePrompt: "First Person POV lying down looking at legs." }
                ]
            } as ShortsStory;
        }

        // --- 2. IMAGE GENERATION (THE RENDERER) ---
        // Enhanced Prompt to enforce Scene Consistency
        const imagePromises = scriptData.frames.map(async (frame) => {
             const finalImagePrompt = `[TASK] Generate a 9:16 Vertical Image.
[MASTER SCENE REFERENCE]: ${originalPrompt}
[CONSTRAINT]: You are rendering the EXACT SAME ROOM as the Master Scene.
- SAME Furniture style and placement.
- SAME Lighting atmosphere.
- SAME Window shape.
- Do NOT change the room decor.

[CAMERA ANGLE]: STRICT FIRST PERSON POV (Eyes of the character).
[ACTION FOCUS]: ${frame.imagePrompt}

[NEGATIVE]: No third person, no silhouette, no visible face, no distorted hands.`;

             const imgResponse = await ai.models.generateContent({
                 model: 'gemini-2.5-flash-image',
                 contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: finalImagePrompt }] },
                 config: { imageConfig: { aspectRatio: "9:16" } }
             });
             for (const part of imgResponse.candidates[0].content.parts) {
                if (part.inlineData) return { ...frame, imageUrl: `data:image/png;base64,${part.inlineData.data}` };
             }
             return { ...frame, imageUrl: undefined };
        });
        return { ...scriptData, frames: await Promise.all(imagePromises) };
    } catch (error) { 
        console.error("Shorts Gen Error", error);
        throw error; 
    }
};

export const regenerateSingleShortsFrame = async (base64Image: string, originalPrompt: string, frameContext: ShortsFrame): Promise<string | null> => {
    try {
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Same Consistency Logic for Regeneration
        const finalImagePrompt = `[TASK] Generate a 9:16 Vertical Image.
[MASTER SCENE REFERENCE]: ${originalPrompt}
[CONSTRAINT]: You are rendering the EXACT SAME ROOM as the Master Scene.
- SAME Furniture.
- SAME Lighting.
- SAME Window.
- Do NOT change the room decor.

[CAMERA ANGLE]: STRICT FIRST PERSON POV (Eyes of the character).
[ACTION FOCUS]: ${frameContext.imagePrompt}

[NEGATIVE]: No third person, no silhouette, no visible face.`;

        const imgResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: finalImagePrompt }] },
             config: { imageConfig: { aspectRatio: "9:16" } }
        });
        for (const part of imgResponse.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (error) { throw error; }
};

export const cleanImageText = async (base64Image: string): Promise<string | null> => {
  try {
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `[TASK] Image Cleanup. Remove ALL text, subtitles, logos. Output clean image.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64Data } }, { text: prompt }] },
    });
    // SAFE CHECK: response.candidates exists
    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content) return null;
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) { throw error; }
};

// --- HELPER TO REMOVE FLUFF ---
const cleanSeoTerm = (text: string) => {
  return text
    .replace(/LUXURY|COZY|PRIVATE|ABANDONED|UNDERGROUND|CONVERTED|RELAXING|AMBIENCE|SOUNDS|ASMR|VIDEO|4K|8K|HOURS|LOOP|HEAVY/gi, "")
    .trim()
    .toUpperCase();
}

export const analyzeDescriptionForText = async (description: string): Promise<{headline: string, subhead: string}> => {
  // 1. HEURISTIC PRIORITY: Look for "SHELTER INVENTORY" style formatting first
  // This matches your specific use case perfectly.
  const locMatch = description.match(/Location:\s*([^\n•]+)/i);
  const wthMatch = description.match(/Weather:\s*([^\n•]+)/i);

  if (locMatch && wthMatch) {
      let h = locMatch[1].trim().toUpperCase();
      let s = wthMatch[1].trim().toUpperCase();
      
      // Cleanup common fluff words from the inventory text, BUT keep core identity
      h = h.replace(/LUXURY|COZY|PRIVATE|ABANDONED/gi, "").trim(); 
      s = s.replace(/SOUNDS|AMBIENCE/gi, "").trim(); // Keep 'HEAVY', 'STORM'

      if (h && s) return { headline: h, subhead: s };
  }

  // 2. AI FALLBACK: If standard format isn't found, force AI to adhere to SEO Noun rules
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Task: Extract 2-3 word SEO Keywords for a YouTube Thumbnail from this description.
    
    Input Text:
    "${description.substring(0, 1000)}"

    [CRITICAL SEO RULES]:
    1. HEADLINE = The physical location/vehicle (Noun). REMOVE adjectives like "Cozy", "Luxury", "Relaxing".
       - Examples: "YACHT" (Not Cozy Yacht), "TRAIN CABIN" (Not Relaxing Train), "BUNKER".
    2. SUBHEAD = The weather or major sound event. REMOVE "Ambience", "Sounds", "ASMR".
       - Examples: "HEAVY RAIN", "BLIZZARD", "THUNDERSTORM", "OCEAN WAVES".
    3. Output STRICT JSON: { "headline": "...", "subhead": "..." }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // CHANGED FROM gemini-2.5-flash-image TO gemini-3-flash-preview
      contents: { parts: [{ text: prompt }] },
      config: { responseMimeType: 'application/json' }
    });

    let jsonStr = response.text || "";
    const match = jsonStr.match(/```json\s*([\s\S]*?)\s*```/) || jsonStr.match(/```\s*([\s\S]*?)\s*```/);
    if (match) jsonStr = match[1];

    if (!jsonStr.trim().startsWith('{')) throw new Error("Invalid JSON");
    
    const result = JSON.parse(jsonStr);
    
    // Final Safety Scrub in case AI hallucinates "Cozy"
    if (result.headline) result.headline = cleanSeoTerm(result.headline);
    if (result.subhead) result.subhead = cleanSeoTerm(result.subhead);
    
    // Hard Fallbacks
    if (!result.headline) result.headline = "SHELTER";
    if (!result.subhead) result.subhead = "STORM";
    
    return result;
  } catch (error) {
    console.error("Text Analysis Error", error);
    // Ultimate Fallback
    return { headline: "LOCATION", subhead: "SOUNDS" };
  }
};