
import { GoogleGenAI } from "@google/genai";
import { ThumbnailLayerConfig } from "../types";

/**
 * Nano Banana 2 (Pro) Recommended Negative Prompts
 * Table 6.1 from the Strategy Guide
 */
const NEGATIVE_PROMPTS = [
  "worst quality", "normal quality", "low quality", "low res", "blurry", "artifacts", 
  "jpeg artifacts", "washed-out backgrounds", "low detail",
  "extra limbs", "distorted hands", "incorrect anatomy", "poorly drawn hands", 
  "poorly drawn feet", "missing digits", "extra digits", "interlocked fingers", 
  "deformed bows", "Polydactyly", "multiple limbs",
  "watermark", "signature", "text", "logo", "username", "error", "cut off", 
  "out of frame", "body out of frame", "draft",
  "simple background", "blank background", "abstract background", "tiling",
  "open windows", "rain inside", "wet floor", "flooded room", // Added logic safety constraints
  "tile floor", "marble floor", "cold stone floor", "ceramic tiles", "hospital floor", "clinical" // Added COLD FLOOR constraints
].join(", ");

/**
 * Clean up Midjourney specific parameters that might confuse Gemini
 */
const cleanPromptForGemini = (prompt: string): string => {
  return prompt
    .replace(/--ar\s+\d+:\d+/gi, '') // Remove aspect ratio flags
    .replace(/--no\s+.*$/i, '')       // Remove negative prompts
    .replace(/--v\s+.*$/i, '')        // Remove version flags
    .replace(/--style\s+.*$/i, '')    // Remove style flags
    .trim();
};

/**
 * Generate an image using Gemini 2.5 Flash Image
 */
export const generateImagePreview = async (prompt: string, aspectRatio: string = "16:9"): Promise<string | null> => {
  try {
    const cleanPrompt = cleanPromptForGemini(prompt);
    
    // Constructing the final prompt for Gemini 2.5 Flash Image
    // We append the negative constraints as strong "Avoid" instructions since SDK structure differs from SD.
    const finalPrompt = `
      ${cleanPrompt}
      
      IMPORTANT QUALITY GUIDELINES:
      - Avoid the following features: ${NEGATIVE_PROMPTS}.
      - Ensure high fidelity and logic consistency.
    `;
    
    // Create a new instance right before making an API call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash-image
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio // Dynamic aspect ratio
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

/**
 * Composite Thumbnail: Overlay text onto the background image with DYNAMIC positioning
 */
export const compositeThumbnail = async (
  imageBase64: string, 
  headlines: string[],
  config?: ThumbnailLayerConfig,
  isVertical: boolean = false // New flag for Shorts
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      if (isVertical) {
        canvas.width = 720;
        canvas.height = 1280; // 9:16 Shorts Resolution
      } else {
        canvas.width = 1280;
        canvas.height = 720;  // 16:9 Standard Resolution
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // 1. Draw Background (Cover mode)
      // We calculate aspect ratios to ensure the image covers the canvas cleanly
      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        // Image is wider than canvas
        drawH = canvas.height;
        drawW = drawH * imgRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        // Image is taller than canvas
        drawW = canvas.width;
        drawH = drawW / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 2. Add subtle dark gradient at bottom for text readability
      const grad = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Configure Font Styles
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let headX, headY, headSize, subX, subY, subSize;

      if (isVertical) {
        // Vertical Defaults (Shorts) - Auto layout
        headX = canvas.width / 2;
        headY = canvas.height * 0.25; // Top quarter
        headSize = 100; // Slightly smaller than landscape due to width constraint

        subX = canvas.width / 2;
        subY = canvas.height * 0.85; // Bottom area
        subSize = 60;
      } else {
        // Landscape Defaults (Standard) - Or use Config
        headX = config?.headline.x ?? canvas.width / 2;
        headY = config?.headline.y ?? canvas.height * 0.75;
        headSize = config?.headline.fontSize ?? 120;

        subX = config?.subhead.x ?? canvas.width / 2;
        subY = config?.subhead.y ?? canvas.height * 0.88;
        subSize = config?.subhead.fontSize ?? 50;
      }
      
      // Main Headline
      if (headlines[0]) {
        ctx.font = `900 ${headSize}px Impact, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = headSize * 0.12; 
        
        // Wrap text if needed for vertical
        if (isVertical && ctx.measureText(headlines[0].toUpperCase()).width > canvas.width - 40) {
           headSize = headSize * 0.7; // Shrink font
           ctx.font = `900 ${headSize}px Impact, sans-serif`;
        }

        ctx.strokeText(headlines[0].toUpperCase(), headX, headY);
        ctx.fillText(headlines[0].toUpperCase(), headX, headY);
      }

      // Subheadline
      if (headlines[1]) {
        ctx.font = `900 ${subSize}px Impact, sans-serif`;
        ctx.fillStyle = '#FF8C00'; // Accent Orange
        ctx.strokeStyle = 'black';
        ctx.lineWidth = subSize * 0.2; 
        ctx.strokeText(headlines[1].toUpperCase(), subX, subY);
        ctx.fillText(headlines[1].toUpperCase(), subX, subY);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject("Image Load Error");
    img.src = imageBase64;
  });
};

/**
 * Helper: Merge Source Image and Binary Mask into a Red-Overlay reference
 */
const mergeMaskOverlay = (sourceBase64: string, maskBase64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const imgSource = new Image();
        const imgMask = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) { reject("Canvas not supported"); return; }

        imgSource.onload = () => {
            canvas.width = imgSource.width;
            canvas.height = imgSource.height;
            ctx.drawImage(imgSource, 0, 0);

            imgMask.onload = () => {
                const maskCanvas = document.createElement('canvas');
                maskCanvas.width = canvas.width;
                maskCanvas.height = canvas.height;
                const maskCtx = maskCanvas.getContext('2d');
                
                if (maskCtx) {
                    maskCtx.drawImage(imgMask, 0, 0);
                    const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
                    const data = imageData.data;

                    for(let i = 0; i < data.length; i += 4) {
                        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
                        if (brightness > 100) { 
                            data[i] = 255; data[i+1] = 0; data[i+2] = 0; data[i+3] = 120; 
                        } else { data[i+3] = 0; }
                    }
                    maskCtx.putImageData(imageData, 0, 0);
                    ctx.drawImage(maskCanvas, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } else { reject("Failed mask context"); }
            };
            imgMask.src = maskBase64;
        };
        imgSource.src = sourceBase64;
    });
};

/**
 * Magic Fix: Inpainting
 */
export const editGeneratedImage = async (base64Image: string, instruction: string, maskImageBase64?: string): Promise<string | null> => {
    try {
      let finalImageToSend = base64Image;
      let prompt = `Edit this image: ${instruction}. Maintain the same lighting and style.`;

      if (maskImageBase64) {
          finalImageToSend = await mergeMaskOverlay(base64Image, maskImageBase64);
          prompt = `TASK: Perform INPAINTING on the provided image.
          The area covered in SEMI-TRANSPARENT RED is the editing region.
          INSTRUCTION: ${instruction}.
          RULES:
          1. Replace the red overlay area ONLY.
          2. The rest of the image (protected pixels) must remain 100% UNCHANGED.
          3. Seamlessly blend the new content into the original scene's lighting and texture.`;
      }

      const base64Data = finalImageToSend.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      
      // Create a new instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/png', data: base64Data } },
            { text: prompt }
          ],
        },
      });
  
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return null;
    } catch (error) {
      console.error("Image Edit Error:", error);
      throw error;
    }
  };


/**
 * OUTPAINTING: Zoom Out / Unzoom
 * Creates a larger canvas, places the original image in the center, and asks AI to fill the surroundings.
 */
export const outpaintImage = async (base64Image: string, originalPrompt: string, zoomFactor: number): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = async () => {
      const width = img.width;
      const height = img.height;

      // 1. Prepare Canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // 2. Calculate new size for the original image (Inverse of zoom factor)
      // If Zoom 2x, image becomes 1/2 size in the center.
      const newW = width / zoomFactor;
      const newH = height / zoomFactor;
      const offsetX = (width - newW) / 2;
      const offsetY = (height - newH) / 2;

      // 3. Draw Original Image Scaled Down in Center
      ctx.fillStyle = 'black'; // Fill background with black (or noise, but black is fine for mask logic)
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, newW, newH);

      const compositeImageBase64 = canvas.toDataURL('image/png');

      // 4. Create Mask
      // White = Edit (The Border), Black = Keep (The Center)
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext('2d');
      if (!maskCtx) return reject("Mask Canvas Error");

      // Fill whole mask with White (Edit everything by default)
      maskCtx.fillStyle = 'white'; 
      maskCtx.fillRect(0, 0, width, height);

      // Draw Black rectangle in center (Protect original)
      // Note: We overlap slightly to blend edges? No, precision is better.
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(offsetX, offsetY, newW, newH);

      const maskBase64 = maskCanvas.toDataURL('image/png');

      // 5. Call Edit API
      const outpaintInstruction = `Zoom out. Extend the scene to reveal the surrounding environment. Maintain continuity with: ${originalPrompt}. High detail, cinematic wide shot.`;

      try {
        const result = await editGeneratedImage(compositeImageBase64, outpaintInstruction, maskBase64);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject("Failed to load source image for outpainting");
  });
};

/**
 * CROP: Zoom In
 * Crops the center of the image and scales it back up.
 * This is a client-side only operation (Fast).
 */
export const cropImage = async (base64Image: string, zoomFactor: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // Calculate crop area
      // If Zoom 2x, we show 1/2 of the image (center)
      const cropW = width / zoomFactor;
      const cropH = height / zoomFactor;
      const cropX = (width - cropW) / 2;
      const cropY = (height - cropH) / 2;

      // Draw crop area scaled up to full canvas
      // drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, width, height);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject("Failed to load source image for cropping");
  });
};


/**
 * Vision Sync: 扫描图片反推 4D 物理动效提示词
 */
export const generateVideoPromptFromImage = async (base64Image: string): Promise<string> => {
  try {
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const prompt = `
    Analyze this shelter image for video motion generation (I2V).
    The shelter is HERMETICALLY SEALED.
    
    Motion rules:
    - INTERIOR: Static air, vertical steam/smoke, subtle fire flickering, dust motes.
    - EXTERIOR (BEHIND GLASS): Rain splattering outside, trees swaying outside, clouds moving.
    - CAMERA: Static tripod.
    
    Output a structured paragraph:
    [Camera]: ... [Internal Atmosphere]: ... [Energy/Particles]: ... [Exterior Physics]: ... [Biological]: ...
    `;

    // Create a new instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Using gemini-3-flash-preview for image analysis and text generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt }
        ]
      }
    });

    return response.text || "Failed to analyze image motion.";
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    return "Error generating motion prompt from image.";
  }
};
