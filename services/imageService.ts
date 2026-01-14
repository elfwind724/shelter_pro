
import { GoogleGenAI, Type } from "@google/genai";
import { ThumbnailLayerConfig, BadgeConfig, ShortsStory, ShortsFrame } from "../types";

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
        // Vertical layout auto-adapts, ignoring manual X/Y for now to ensure safety
        // Or we could adapt them proportionally if requested. 
        // For now, keeping vertical centered logic for consistency on mobile.
        headX = canvas.width / 2;
        headY = canvas.height * 0.15; 
        headSize = 100; 
        subX = canvas.width / 2;
        subY = canvas.height * 0.85; 
        subSize = 80;
      } else {
        // Use Manual Config
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

// --- FIX: IMPLEMENTED STRICT STATIC CAMERA PROMPT ---
export const generateVideoPromptFromImage = async (base64Image: string): Promise<string> => {
    try {
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // REVISED: STRICT STATIC CAMERA INSTRUCTIONS
        const prompt = `[TASK] Describe this image for a high-end AI Video Generator (Veo/Sora).
        
        [CRITICAL CAMERA RULES - READ CAREFULLY]
        1. **STATIC CAMERA ONLY**: The camera must be on a TRIPOD. 
        2. **NO MOVEMENT**: NO push in, NO zoom, NO pan, NO tilt. 
        3. **FOCUS**: The only movement should be the internal elements (rain, fire, smoke, lights).
        
        [OUTPUT FORMAT]
        "Static tripod shot of [Subject]. [Internal Motion Description]. [Atmosphere]."
        
        Example: "Static tripod shot of a cozy cabin. Rain streaks sliding down the window glass. Fire flickering in the hearth. No camera movement."
        
        Keep it under 40 words.`;

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

// --- NEW: GENERATE DARK VARIANT (VARIABLE BRIGHTNESS) ---
export const generateDarkVariant = async (base64Image: string, originalPrompt: string, brightnessLevel: number = 20): Promise<string | null> => {
    try {
        // STEP 1: SANITIZE ORIGINAL PROMPT
        // We must remove all mention of "Fire", "Stove", "Warmth", "Light" from the original context
        // to stop the AI from hallucinating them back into existence.
        let sanitizedContext = cleanPromptForGemini(originalPrompt);
        
        // Aggressive regex to kill light sources in the prompt text
        const forbiddenTerms = [
            /fire/gi, /flame/gi, /burning/gi, /stove/gi, /fireplace/gi, 
            /warm/gi, /glow/gi, /light/gi, /lamp/gi, /candle/gi, /lit/gi, 
            /bright/gi, /sun/gi, /day/gi, /morning/gi, /noon/gi
        ];
        
        forbiddenTerms.forEach(term => {
            sanitizedContext = sanitizedContext.replace(term, "");
        });

        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // DYNAMIC LOGIC BASED ON BRIGHTNESS LEVEL (0 - 100)
        let brightnessInstruction = "";
        let lightSourceConstraint = "";

        // Check if user has explicit candles or oil lamps in the ORIGINAL (we stripped them, but we need to know if they were there to allow small lights)
        const originalHadCandles = originalPrompt.toLowerCase().includes('candle') || originalPrompt.toLowerCase().includes('oil lamp');
        
        if (brightnessLevel < 25) {
            // LEVEL 0-25: TOTAL BLACKOUT / SILHOUETTE
            brightnessInstruction = `
            1. [PHYSICS OVERRIDE]: IGNORE ORIGINAL LIGHTING. RE-RENDER AS PITCH BLACK NIGHT.
            2. [INTERIOR]: NO ELECTRIC LIGHTS. Total power failure. 
            3. [FIREPLACE/STOVE STATE]: EXTINGUISHED. COLD ASH. If you must show it, show only 1 tiny red spark (dying ember). NO FLAMES.
            4. [VISIBILITY]: Objects are barely visible silhouettes against the window.
            `;
            if (originalHadCandles) {
                lightSourceConstraint = "PRIMARY SOURCE: A few small candles/oil lamps creating weak pools of light. Rest of room is DARK.";
            } else {
                lightSourceConstraint = "PRIMARY SOURCE: Very faint moonlight from window. FIRE IS OUT (Embers only).";
            }
        } else if (brightnessLevel < 60) {
             // LEVEL 25-60: DEEP SHADOWS
            brightnessInstruction = `
            1. [ENVIRONMENT]: Low-light Emergency Mode.
            2. [INTERIOR]: Deep shadows. Electric lights are OFF.
            3. [FIREPLACE/STOVE STATE]: DYING EMBERS. A pile of glowing red coals. NO YELLOW FLAMES.
            `;
            lightSourceConstraint = originalHadCandles ? "Candlelight + Moonlight mixture." : "Moonlight dominates. Fireplace provides faint red ambient glow only.";
        } else {
            // LEVEL 60-100: BLUE HOUR
            brightnessInstruction = `
            1. [ENVIRONMENT]: Blue Hour / Twilight.
            2. [INTERIOR]: Dim, cool ambient light filling the room.
            `;
            lightSourceConstraint = "Soft atmospheric blue skylight filling the room. Soft shadows.";
        }

        const prompt = `[TASK] RE-RENDER this scene as a DEEP NIGHT SCENE with a COMPLETE POWER OUTAGE.
        [BRIGHTNESS LEVEL]: ${brightnessLevel}% (0% = Pitch Black).
        
        [CRITICAL: FORCE LIGHTING CHANGE]
        - You MUST IGNORE the brightness of the original image. Even if original is Day, output MUST be NIGHT.
        - TURN OFF ALL CEILING LIGHTS / LAMPS / LEDS. They are now dark objects.
        - **FIREPLACE/STOVE MANDATE**: If there is a stove or fireplace, DELETE THE FLAMES. Replace them with grey ash and faint red embers. The room must feel COLD.
        
        [LIGHTING INSTRUCTIONS]
        ${brightnessInstruction}
        ${lightSourceConstraint}
        
        [ORIGINAL CONTEXT (Geometry Only)] 
        ${sanitizedContext}`; // Using the sanitized prompt

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { 
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Data } }, 
                    { text: prompt }
                ] 
            },
            config: { imageConfig: { aspectRatio: "16:9" } },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        return null;
    } catch (error) {
        console.error("Dark Variant Generation Error:", error);
        throw error;
    }
};

// --- UPDATED: GENERATE SHORTS STORYLINE WITH USER INPUT ---
export const generateShortsStoryline = async (base64Image: string, originalPrompt: string, userInstruction?: string): Promise<ShortsStory> => {
    try {
        const cleanPrompt = cleanPromptForGemini(originalPrompt);
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Logic switch based on userInstruction
        const scenarioInstruction = userInstruction 
        ? `[USER OVERRIDE]: The user has specifically requested: "${userInstruction}".
           You MUST adapt the 3 steps to fulfill this request. 
           If the user lists 3 specific actions, map them to Step 1, 2, and 3.
           If the user gives a vague vibe, interpret it creatively into 3 POV steps.`
        : `[AUTO-DIRECTOR MODE]:
           Analyze the image context (Vehicle? Bunker? Luxury? Wild?). Choose ONE specific narrative arc that fits best:
           
           Option A (The Traveler/Driver):
           1. Driving/Navigating (Hands on wheel or looking at map).
           2. Parking/Stopping (Turning off engine, rain hits harder).
           3. Moving to back/Resting (Climbing into bed/seat).
           
           Option B (The Survivor/Bunker):
           1. Securing (Locking heavy door, checking air filter).
           2. Sustaining (Opening canned food, checking radio).
           3. Enduring (Cleaning weapon or staring at monitor).
           
           Option C (The Scholar/Cozy):
           1. Preparing (Brewing coffee/tea, lighting candle).
           2. Focusing (Writing in journal, reading book).
           3. Contemplating (Looking out window, hand on glass).
           
           Option D (The Sleeper - ONLY if bed is main focus):
           1. Approaching bed/fluffing pillow.
           2. Getting in/pulling up blanket.
           3. Closing eyes/dimming light.

           [CRITICAL]: DO NOT DEFAULT TO OPTION D. Pick the one that matches the image details best.
           [CONSTRAINT]: Step 3 MUST NOT always be "feet on bed". Vary it (e.g., hand turning off lamp, staring at fire, closing curtains).`;

        // STEP 1: SCRIPTING (Text & Metadata)
        const scriptPrompt = `
        [TASK] You are a YouTube Shorts Director. Analyze the provided image (The Scene). 
        Create a 3-Step POV Narrative Script to make this scene feel "ALIVE" and "INTERACTIVE".
        
        ${scenarioInstruction}
        
        [CRITICAL CAMERA COMPOSITION RULES - YOU MUST FOLLOW]
        - Frame 1 (ESTABLISHING): Must be a WIDE or ULTRA-WIDE shot showing the environment context.
        - Frame 2 (ACTION/HANDS): Must be a MEDIUM SHOT focused on hands doing something (cooking, driving, holding mug).
        - Frame 3 (INTIMATE/REST): Must be a CLOSE UP or LOW ANGLE or POV shot (e.g. looking at fire, looking at rain on glass).
        *DO NOT make all 3 frames look the same. Vary the distance and angle.*

        [OUTPUT FORMAT] JSON ONLY.
        {
           "title": "Viral Shorts Title (e.g. Rainy Night in a Cozy Bunker 🌧️)",
           "description": "Short engaging description for YouTube Shorts.",
           "tags": "#Shorts #Cozy #Rain...",
           "frames": [
              { "step": 1, "actionDescription": "Detailed action description...", "overlayText": "Short Text (e.g. Finally Safe)", "imagePrompt": "Wide shot of..." },
              { "step": 2, "actionDescription": "Detailed action description...", "overlayText": "Short Text (e.g. Warmth)", "imagePrompt": "Medium shot of hands..." },
              { "step": 3, "actionDescription": "Detailed action description...", "overlayText": "Short Text (e.g. Goodnight)", "imagePrompt": "Close up of..." }
           ]
        }
        
        [CRITICAL VISUAL RULES FOR PROMPTS]
        - All prompts MUST specify "Vertical 9:16 aspect ratio".
        - Maintain the exact VISUAL STYLE (Lighting, Colors, Architecture) of the input image.
        `;

        const scriptResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: {
                 parts: [
                     { inlineData: { mimeType: 'image/png', data: base64Data } },
                     { text: scriptPrompt }
                 ]
             },
        });
        
        // Manual JSON Parsing to handle Markdown blocks
        let jsonString = scriptResponse.text || "{}";
        const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/) || jsonString.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }
        const scriptData = JSON.parse(jsonString) as ShortsStory;
        
        // STEP 2: PARALLEL IMAGE GENERATION
        // We will generate the 3 images in parallel based on the AI-written prompts
        const imagePromises = scriptData.frames.map(async (frame) => {
             // Combine original style context with new specific action prompt
             const finalImagePrompt = `[STYLE REFERENCE]: ${cleanPrompt}. \n[ACTION]: ${frame.imagePrompt} \n[CONSTRAINT]: Vertical 9:16, First Person POV. Make it look exactly like the same room.`;
             
             // We pass the original image as reference to guide consistency (using image-to-image logic roughly)
             // Note: Gemini 2.5 Flash Image supports image input for context.
             const imgResponse = await ai.models.generateContent({
                 model: 'gemini-2.5-flash-image',
                 contents: {
                     parts: [
                         { inlineData: { mimeType: 'image/png', data: base64Data } }, // Reference Base Image
                         { text: finalImagePrompt }
                     ]
                 },
                 config: { imageConfig: { aspectRatio: "9:16" } }
             });
             
             let generatedUrl = null;
             for (const part of imgResponse.candidates[0].content.parts) {
                if (part.inlineData) {
                    generatedUrl = `data:image/png;base64,${part.inlineData.data}`;
                    break;
                }
             }
             return { ...frame, imageUrl: generatedUrl || undefined };
        });

        const completedFrames = await Promise.all(imagePromises);
        
        return {
            ...scriptData,
            frames: completedFrames
        };

    } catch (error) {
        console.error("Shorts Story Generation Error:", error);
        throw error;
    }
};

// --- NEW: REGENERATE SINGLE SHORTS FRAME ---
export const regenerateSingleShortsFrame = async (base64Image: string, originalPrompt: string, frameContext: ShortsFrame): Promise<string | null> => {
    try {
        const cleanPrompt = cleanPromptForGemini(originalPrompt);
        const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Add variance to the prompt to ensure it's not identical
        const variance = Math.random() > 0.5 ? "Slightly adjust camera angle." : "Shift focus slightly.";
        
        const finalImagePrompt = `[TASK] Regenerate this specific shot for a story.
        [STYLE REFERENCE]: ${cleanPrompt}. 
        [ACTION REQUIREMENT]: ${frameContext.imagePrompt}
        [VARIANCE]: ${variance}
        [CONSTRAINT]: Vertical 9:16, First Person POV. Must match the style of the reference image exactly.`;

        const imgResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash-image',
             contents: {
                 parts: [
                     { inlineData: { mimeType: 'image/png', data: base64Data } }, // Reference Base Image
                     { text: finalImagePrompt }
                 ]
             },
             config: { imageConfig: { aspectRatio: "9:16" } }
        });
         
        for (const part of imgResponse.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;

    } catch (error) {
        console.error("Single Frame Regen Error:", error);
        throw error;
    }
};

// --- NEW: THUMBNAIL REMASTER SERVICES ---
export const cleanImageText = async (base64Image: string): Promise<string | null> => {
  try {
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Command explicitly for text removal / inpainting
    const prompt = `[TASK] Image Cleanup. Remove ALL text, subtitles, logos, watermarks, and UI elements from this image. Inpaint the background to look natural and seamless. Output ONLY the clean background image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } }, 
          { text: prompt }
        ] 
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image Cleaning Error:", error);
    throw error;
  }
};

export const analyzeDescriptionForText = async (description: string): Promise<{headline: string, subhead: string}> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze this YouTube video description. Extract 2 short, punchy keywords for a thumbnail using high-contrast strategy.
    
    Format JSON: { "headline": "Main 1-2 words (White Text)", "subhead": "Secondary 1-2 words (Yellow Text)" }
    
    Description:
    ${description.substring(0, 1000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using text model effectively
      contents: { parts: [{ text: prompt }] },
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || '{"headline": "COZY", "subhead": "RAIN"}');
  } catch (error) {
    return { headline: "COZY", subhead: "AMBIENCE" };
  }
};
