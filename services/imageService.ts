
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
  "open windows", "rain inside", "wet floor", "flooded room" // Added logic safety constraints
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
export const generateImagePreview = async (prompt: string): Promise<string | null> => {
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
          aspectRatio: "16:9"
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
  config?: ThumbnailLayerConfig
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1280; // Standard 720p Youtube Thumbnail
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject("Canvas Error");

      // 1. Draw Background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Add subtle dark gradient at bottom for text readability
      const grad = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Configure Font Styles
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Defaults (Fallback if no config provided)
      const headX = config?.headline.x ?? canvas.width / 2;
      const headY = config?.headline.y ?? canvas.height * 0.75;
      const headSize = config?.headline.fontSize ?? 120;

      const subX = config?.subhead.x ?? canvas.width / 2;
      const subY = config?.subhead.y ?? canvas.height * 0.88;
      const subSize = config?.subhead.fontSize ?? 50;
      
      // Main Headline
      if (headlines[0]) {
        ctx.font = `900 ${headSize}px Impact, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = headSize * 0.12; // Dynamic stroke width based on size
        ctx.strokeText(headlines[0].toUpperCase(), headX, headY);
        ctx.fillText(headlines[0].toUpperCase(), headX, headY);
      }

      // Subheadline
      if (headlines[1]) {
        ctx.font = `900 ${subSize}px Impact, sans-serif`;
        ctx.fillStyle = '#FF8C00'; // Accent Orange
        ctx.strokeStyle = 'black';
        ctx.lineWidth = subSize * 0.2; // Dynamic stroke width
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
