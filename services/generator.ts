
import { GoogleGenAI, Type } from "@google/genai";
import { SelectionState, GeneratedContent, CategoryItem, SafetyAnalysis, AudioLayer, ThumbnailDesign, AnalyticsRecord } from '../types';
import { CATEGORIES } from '../constants';

const getSelectedItems = (selections: SelectionState, catId: string): CategoryItem[] => {
  const selectedIds = selections[catId] || [];
  const category = CATEGORIES.find(c => c.id === catId);
  if (!category) return [];
  return category.items.filter(i => selectedIds.includes(i.id));
};

const getEnglishTerm = (label: string): string => {
  const match = label.match(/\((.*?)\)/);
  return match ? match[1] : label.trim();
};

const getConciseWeather = (label: string): string => {
  const eng = getEnglishTerm(label).toUpperCase();
  // V2: RETURN PURE VISUALS, NOT AUDIO TERMS
  if (eng.includes('SUNNY')) return 'Sunny Clear Sky';
  if (eng.includes('OVERCAST')) return 'Grey Overcast Sky';
  if (eng.includes('BREEZE')) return 'Swaying Trees';
  if (eng.includes('CLOUDY')) return 'Cloudy Sky';
  if (eng.includes('SPRING')) return 'Spring Garden';
  if (eng.includes('SUMMER')) return 'Bright Summer Day';
  if (eng.includes('AUTUMN')) return 'Falling Autumn Leaves';
  if (eng.includes('WINTER')) return 'Clear Winter Sky';
  if (eng.includes('LUSH')) return 'Heavy Rain in Forest';
  if (eng.includes('LIGHT RAIN')) return 'Gentle Rain on Glass';
  if (eng.includes('MEDIUM RAIN')) return 'Rainy Day'; 
  if (eng.includes('HEAVY RAIN')) return 'Heavy Rain Storm';
  if (eng.includes('THUNDER')) return 'Thunderstorm and Lightning';
  if (eng.includes('LIGHT SNOW')) return 'Falling Snowflakes';
  if (eng.includes('HEAVY SNOW')) return 'Heavy Snowstorm';
  if (eng.includes('BLIZZARD')) return 'Whiteout Blizzard';
  if (eng.includes('FOG')) return 'Thick Fog'; 
  if (eng.includes('WIND')) return 'Stormy Wind';
  if (eng.includes('ACID')) return 'Toxic Green Rain';
  if (eng.includes('SOLAR')) return 'Solar Flare Light';
  return 'Rain Storm';
};

const getConciseStructure = (label: string): string => {
   const eng = getEnglishTerm(label).toUpperCase();
   // MARITIME
   if (eng.includes('SHIP CABIN')) return 'Ship Cabin';
   if (eng.includes('CRUISE') || eng.includes('LINER')) return 'Ghost Liner';
   if (eng.includes('RIG')) return 'Ocean Rig';
   if (eng.includes('SUBMARINE')) return 'Submarine';
   if (eng.includes('LIGHTHOUSE')) return 'Lighthouse';
   if (eng.includes('UNDERWATER') || eng.includes('DOME')) return 'Deep Sea Dome';
   if (eng.includes('CANAL') || eng.includes('NARROWBOAT')) return 'Narrowboat';
   
   // HIDDEN CORNERS & REALISM
   if (eng.includes('LOOKOUT')) return 'Fire Lookout';
   if (eng.includes('BUS') || eng.includes('SKOOLIE') || eng.includes('CONVERTED BUS')) return 'Cozy Bus';
   if (eng.includes('ATTIC') && eng.includes('SLANTED')) return 'Slanted Attic';
   if (eng.includes('PROJECTION') || eng.includes('CINEMA')) return 'Old Cinema';
   if (eng.includes('RADIO')) return 'Radio Station';
   if (eng.includes('LAUNDROMAT')) return 'Night Laundromat';
   if (eng.includes('CLOCK')) return 'Clock Tower';
   if (eng.includes('ATTIC')) return 'Secret Attic'; // Fallback for generic attic

   // SPECIAL & UNIQUE
   if (eng.includes('ARCTIC')) return 'Arctic Station';
   if (eng.includes('EARTHSHIP')) return 'Eco Home';
   if (eng.includes('YURT')) return 'Cozy Yurt';
   if (eng.includes('BOTANICAL')) return 'Botanical Lab';
   if (eng.includes('AQUARIUM')) return 'Aquarium Tunnel';

   // NATURE
   if (eng.includes('HOBBIT')) return 'Hobbit Home';
   if (eng.includes('WATERFALL')) return 'Waterfall Cave';
   if (eng.includes('TREE') || eng.includes('HOLLOW')) return 'Hollow Tree';
   if (eng.includes('GREENHOUSE')) return 'Overgrown Greenhouse';
   if (eng.includes('CLIFF')) return 'Cliff Terrace';
   if (eng.includes('FOREST') || eng.includes('CANOPY')) return 'Treehouse';
   if (eng.includes('ZEN')) return 'Zen Garden';
   if (eng.includes('IGLOO')) return 'Glass Igloo';

   // SKY
   if (eng.includes('AIRSHIP')) return 'Steampunk Airship';
   if (eng.includes('TEMPLE')) return 'Cloud Temple';
   if (eng.includes('PEAK')) return 'Mountain Peak';
   if (eng.includes('ROOFTOP') || eng.includes('PENTHOUSE')) return 'Skyscraper Rooftop';

   // VEHICLE
   if (eng.includes('ORIENT') || eng.includes('LUXURY TRAIN')) return 'Luxury Train';
   if (eng.includes('ROVER') || eng.includes('MARS')) return 'Mars Rover';
   if (eng.includes('CAMPER') || eng.includes('VAN')) return 'Van Life';
   if (eng.includes('RV') || eng.includes('EXPEDITION')) return 'Expedition RV';
   if (eng.includes('TRUCK') || eng.includes('SEMI')) return 'Semi Truck';
   if (eng.includes('NIGHT BUS')) return 'Night Bus';
   if (eng.includes('SPACESHIP')) return 'Spaceship';

   // URBAN
   if (eng.includes('CYBER') || eng.includes('POD')) return 'Cyberpunk Pod';
   if (eng.includes('NOIR') || eng.includes('DETECTIVE')) return 'Noir Office';
   if (eng.includes('SERVER')) return 'Server Room';
   if (eng.includes('SEWER') || eng.includes('DRAIN')) return 'Storm Drain';
   if (eng.includes('VAULT')) return 'Bank Vault';
   if (eng.includes('FACTORY')) return 'Abandoned Factory';

   // HISTORICAL
   if (eng.includes('ALCHEMY')) return 'Alchemy Lab';
   if (eng.includes('WINE') || eng.includes('CELLAR')) return 'Wine Cellar';
   if (eng.includes('LIBRARY')) return 'Grand Library';
   if (eng.includes('CHURCH') || eng.includes('CATHEDRAL')) return 'Fortified Church';

   // SURVIVAL
   if (eng.includes('BUNKER')) return 'Doomsday Bunker';
   if (eng.includes('SILO') || eng.includes('MISSILE')) return 'Missile Silo';
   if (eng.includes('SHIPPING') || eng.includes('CONTAINER')) return 'Cliff Container';
   if (eng.includes('CABIN') || eng.includes('LOG')) return 'Log Cabin';

   // FALLBACK
   return 'Cozy Shelter'; 
};

const getCharacterMotion = (charId: string): string => {
  switch (charId) {
    case 'deep_sleep': return 'Looping motion: Chest rising and falling slowly and rhythmically (breathing). No other movement. Fabric of the blanket moving slightly with breath. Absolute stillness otherwise.';
    case 'lofi_pianist': return 'Looping motion: Fingers dancing gently on the keys. Head bobbing slightly to the music. Shoulders relaxed. No sudden movements.';
    case 'lofi_guitarist': return 'Looping motion: Rhythmic shoulder movement and slight head bobbing. The back view hides the hands, focus on the swaying of the torso matching the beat. Dust motes floating.';
    case 'lofi_flamenco': return 'Looping motion: The red dress fabric fluttering in the wind. Body swaying passionately but standing relatively still. Hair moving in the breeze.';
    case 'lofi_flutist': return 'Looping motion: Chest expanding and contracting with deep breaths. Slight swaying of the upper body. The flute stays steady relative to the head.';
    case 'lofi_violinist': return 'Looping motion: The silhouette swaying gently left and right. The right arm (bow arm) moves rhythmically up and down, but the details are hidden in shadow. Elegant posture.';
    case 'lofi_cellist': return 'Looping motion: Slow, heavy rocking motion of the upper body forward and back. The shoulders move with the weight of the bow stroke. Grounded and steady.';
    case 'lofi_sax': return 'Looping motion: The silhouette gently leaning back and forth. The chest expands for breath. Fingers moving on the keys (subtle). Smooth, jazz-like swaying.';
    case 'lofi_harp': return 'Looping motion: Elegant arm movements reaching for strings. Hands plucking in a rhythmic pattern. Upper body swaying slightly like a willow tree.';
    case 'lofi_accordion': return 'Looping motion: The accordion bellows expanding and contracting rhythmically (breathing motion). The player swaying side to side with the effort.';
    case 'lofi_koto': return 'Looping motion: Hands moving horizontally across the long zither. Head bowing in meditation. Very subtle, zen-like stillness with hand motion.';
    case 'lofi_kalimba': return 'Looping motion: Thumbs moving rhythmically on the small instrument. Head tilted down in focus. Minimal body movement, very intimate.';
    case 'lofi_synth': return 'Looping motion: Head bobbing to a beat (nodding). Hand turning a knob slowly. The glow of the screen reflecting on the moving face.';
    default: return 'Character posture remains static with subtle breathing motion.';
  }
};

const analyzeSafety = (
  defense: CategoryItem[],
  warmth: CategoryItem[],
  pet: CategoryItem | undefined,
  amenities: CategoryItem[],
  textures: CategoryItem[]
): SafetyAnalysis => {
  let score = 50; 
  const feedback: string[] = [];
  if (defense.length > 1) { score += 15; feedback.push("✅ MULTI-LAYER DEFENSE"); }
  if (warmth.length > 0) { score += 20; feedback.push("✅ THERMAL COMFORT"); }
  if (amenities.length >= 3) { score += 10; feedback.push("✅ ABUNDANT SUPPLIES"); }
  if (pet && pet.id !== 'none') { score += 15; feedback.push("✅ COMPANION"); }
  if (textures.length > 0) { score += 10; feedback.push("✅ TACTILE SOFTNESS"); }
  return { score: Math.min(score, 100), feedback, psychologicalHooks: [] };
};

// HELPER: Select the most "visual" amenity to be the HERO PROP
const getHeroProp = (amenities: CategoryItem[], pet: CategoryItem | undefined, character: CategoryItem | undefined): string => {
    // 1. Animals are always best
    if (pet && pet.id !== 'none') return getEnglishTerm(pet.label);
    
    // 2. Instruments are second best
    if (character && character.id.startsWith('lofi_')) {
        const instrument = character.id.replace('lofi_', '').replace('pianist', 'piano').replace('guitarist', 'guitar');
        return instrument;
    }

    // 3. Iconic Props
    const highVisualImpact = ['whiskey', 'gun', 'map', 'radio', 'telescope', 'coffee', 'steak_dinner', 'laptop', 'typewriter', 'vinyl'];
    const found = amenities.find(a => highVisualImpact.some(k => a.id.includes(k)));
    if (found) return getEnglishTerm(found.label);

    return 'steaming coffee mug'; // Default fallback
};

// FORMULA: [Role]'s [Safety Moment] | [Location] [Threat] ([Utility])
// REFACTOR: Use {LOCATION} placeholder to respect user selection
const NARRATIVE_TEMPLATES: Record<string, { 
    titleTemplate: string; 
    description: string; 
    tags: string; 
    thumbText: string[]; 
    design: ThumbnailDesign; 
    visualSetting: string;
    coverVisual: string; 
}> = {
  narrative_scientist: {
    titleTemplate: "Marine Biologist's Safe Haven | {LOCATION} in Ocean Storm (8H Deep Sleep)",
    description: `...`,
    tags: "Deep Sleep...",
    thumbText: ["BELOW ZERO", "WARM INSIDE"], 
    design: { textColor: "#FFFFFF", accentColor: "#F59E0B", fontRecommendation: "Impact", layoutTip: "Navy Blue + Gold" },
    visualSetting: "Violent Dark Ocean Storm at Night, Massive Waves",
    coverVisual: "A glowing blue nautical map and brass compass in extreme close-up foreground. In the background, out of focus, massive waves crash against the porthole."
  },
  narrative_refugee: {
    titleTemplate: "Refugee's First Safe Night | {LOCATION} in Storm (ASMR Sleep)",
    description: `...`,
    tags: "Deep Sleep...",
    thumbText: ["SURVIVED", "WARM NIGHT"], 
    design: { textColor: "#FFFFFF", accentColor: "#F59E0B", fontRecommendation: "Impact", layoutTip: "Dark Gray + Warm Gold" },
    visualSetting: "Violent Rain Storm at Night, Dark and Cold Outside, Warm Fire Inside",
    coverVisual: "A hand pressing against the glass from the inside, seeking connection but separated by the storm. Warm light on the hand, cold blue rain on the other side of the glass. High emotional contrast."
  },
  narrative_fugitive: {
    titleTemplate: "Fugitive's Safe House | {LOCATION} in Storm (No Sirens)",
    description: `...`,
    tags: "Deep Sleep...",
    thumbText: ["WANTED?", "SAFE HERE"], 
    design: { textColor: "#FFFFFF", accentColor: "#EF4444", fontRecommendation: "Impact", layoutTip: "Black + Red + Gold" },
    visualSetting: "Dark Stormy Night, High Contrast, Dangerous Exterior",
    coverVisual: "View through slightly open blinds. Outside, distant red and blue siren lights reflect on the wet pavement (implying danger passed). Inside, a half-empty glass of whiskey and a map on the table. Noir aesthetic."
  },
  narrative_fresh_start: {
    titleTemplate: "Survivor's Fresh Start | Moving into {LOCATION} in Rain (Deep Sleep)",
    description: `...`,
    tags: "Deep Sleep...",
    thumbText: ["MOVED IN", "START OVER"], 
    design: { textColor: "#FFFFFF", accentColor: "#10B981", fontRecommendation: "Impact", layoutTip: "Gray + Warm Gold" },
    visualSetting: "Heavy Rain, Melancholic Night",
    coverVisual: "A packed suitcase or backpack sitting open on the floor next to a warm heater. The room is messy but cozy. It signifies arrival after a long journey."
  },
  narrative_nomad: {
    titleTemplate: "Nomad's Sanctuary | {LOCATION} in Blizzard (ASMR)",
    description: `...`,
    tags: "Deep Sleep...",
    thumbText: ["VAN LIFE", "STORM PROOF"], 
    design: { textColor: "#FFFFFF", accentColor: "#3B82F6", fontRecommendation: "Impact", layoutTip: "Adventurous Brown + Warm Glow" },
    visualSetting: "Heavy Rain Storm, Warm Cabin Interior",
    coverVisual: "A pair of worn-out muddy hiking boots placed near a roaring fireplace. Steam rising from the drying boots. The storm rages outside the window in the background."
  }
};

const generateModularDescription = (
    structureName: string,
    weatherName: string,
    durationText: string,
    intent: 'SLEEP_LONG' | 'NAP' | 'FOCUS',
    defense: CategoryItem[],
    warmth: CategoryItem[],
    amenities: CategoryItem[],
    pet: CategoryItem | undefined,
    soundKeyWords: string[],
    threatName: string,
    roleName: string
): string => {
    // ... (Description Logic Unchanged) ...
    const threatSegment = threatName !== 'Safe' 
        ? `Outside, the world is chaotic. ${threatName} are roaming in the distance, and the ${weatherName.toLowerCase()} is relentless.` 
        : `Outside, the ${weatherName.toLowerCase()} is raging and unforgiving. The elements are striking hard against the walls.`;

    const defenseText = defense.length > 0 
        ? `protected by heavy ${defense.map(d => getEnglishTerm(d.label)).join(' and ')}` 
        : `hidden away safely from the turmoil`;
    const warmthText = warmth.length > 0
        ? `The ${warmth.map(w => getEnglishTerm(w.label)).join(' and ')} fill the room with a protective, dry heat`
        : `The room is warm, dry, and hermetically sealed`;
        
    const safetySegment = `But here in this ${structureName}, you are completely safe. You are ${defenseText}. ${warmthText}. The storm cannot touch you here.`;

    const feelingSegment = `Finally, the noise of the survival fades away. This is your ${roleName}'s sanctuary. Surrounded by your ${amenities.slice(0,2).map(a => getEnglishTerm(a.label)).join(' and ')}, you can finally close your eyes. Listen to the muffled ${soundKeyWords[0] || 'rain'}, let your guard down, and drift into a ${durationText} deep sleep.`;

    const narrativeIntro = `${threatSegment}\n\n${safetySegment}\n\n${feelingSegment}`;

    let benefits = "";
    if (intent === 'FOCUS') {
        benefits = `🎯 BENEFITS:\n• For studying and exams\n• For work and deep focus\n• For reading and learning\n• For meditation and mindfulness\n• Blocks out distracting background noise`;
    } else {
        benefits = `🎯 BENEFITS:\n• Help with insomnia and sleep disorders\n• Reduce stress and anxiety immediately\n• Perfect for sleeping and relaxation\n• Ideal for deep rest and recovery\n• Creates a safe, enclosed atmosphere`;
    }

    const tvSection = `📺 WATCH ON TV FOR THE BEST EXPERIENCE\nThis video is optimized for 4K televisions (OLED/QLED). The high-dynamic-range visuals and rich ${weatherName} audio create the perfect environment for your room.`;

    const inventory = `🎒 SHELTER DETAILS:\n• Location: ${structureName} (Secluded & Safe)\n• Weather: ${weatherName} (${soundKeyWords.join(', ')})\n• Warmth: ${warmth.map(w => getEnglishTerm(w.label)).join(', ') || 'Central Heating'}\n• Security: ${defense.map(d => getEnglishTerm(d.label)).join(', ')}\n• Amenities: ${amenities.map(a => getEnglishTerm(a.label)).join(', ')}\n${pet && pet.id !== 'none' ? `• Companion: ${getEnglishTerm(pet.label)}` : ''}`;

    const cta = `🔗 SUBSCRIBE FOR MORE ${intent === 'FOCUS' ? 'FOCUS' : 'SLEEP'} SOUNDS:\n👉 Subscribe to Haven Nights for daily ambience videos.\n\n📋 MORE CONTENT:\n🎵 Focus & Study Collection\n🎵 Sleep Ambience Series\n🎵 Rain Sounds for Sleeping\n\n⚖️ DISCLAIMER:\nThis content is for relaxation and entertainment purposes. If you have severe sleep disorders, please consult a healthcare professional.`;

    const baseHash = `#RainSounds #Ambience #${structureName.replace(/\s+/g, '')}`;
    let specificHash = "";
    if (intent === 'FOCUS') {
        specificHash = "#FocusMusic #StudyAmbience #WhiteNoise #ReadingMusic #Concentration #NoLoop #Productivity";
    } else if (intent === 'NAP') {
        specificHash = "#PowerNap #SleepSounds #NapMusic #Rest #Relaxation #CozyAmbience";
    } else {
        specificHash = "#SleepAmbience #DeepSleep #Insomnia #ASMR #SleepSounds #NoAds";
    }
    
    const hashtags = `${baseHash} ${specificHash}`;

    return `${narrativeIntro}\n\n${benefits}\n\n${tvSection}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${inventory}\n\n${cta}\n\n${hashtags}`;
};

const generateTagsMatrix = (sName: string, wName: string, intent: 'SLEEP_LONG' | 'NAP' | 'FOCUS'): string => {
    let highPriority: string[] = [];
    if (intent === 'FOCUS') {
        highPriority = ["focus music", "study ambience", "reading music", "concentration music", "white noise for studying", "rain sounds for focus", "work ambience", "library ambience", "no loop", "productivity music", "focus mode"];
    } else if (intent === 'NAP') {
        highPriority = ["power nap music", "short sleep sounds", "nap ambience", "restorative sleep", "cozy cabin for sleep", "afternoon nap", "relaxing white noise", "calm sleep"];
    } else {
        highPriority = ["rain sounds for sleeping", "sleep ambience", "ASMR sleep sounds", "deep sleep music", "sleep music no ads", "white noise for sleep", "insomnia relief", "thunderstorm sounds", "8 hours sleep"];
    }
    const techTags = ["TV sleep ambience", "4K ambience", "OLED screensaver"];
    const contextTags = [`${wName} sounds`, `${sName} ambience`, `cozy ${sName}`, "Haven Nights", "cozy ambience", "safe shelter", "storm ambience"];
    return [...highPriority, ...techTags, ...contextTags].slice(0, 45).join(', ');
};

// ... (Analytics Logic Unchanged) ...
export const parseAnalyticsData = async (rawText: string): Promise<Partial<AnalyticsRecord>> => {
  // ... existing code ...
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
    You are a Strategic Data Analyst for a professional YouTube Ambience Channel. 
    Analyze the provided raw Executive Summary report.
    YOUR GOAL: Extract HIGH-VALUE metrics and provide a TACTICAL CHINESE STRATEGY.
    LOGIC FOR EXTRACTION:
    1. **Video Title**: If Top Video mentioned, use that. If not, use "Report: [Date]".
    2. **Metrics**: Extract Impressions, CTR, Views, Regulars, Subs, Avg Duration (AVD).
    3. **Advanced Signals**:
       - Recommendation Rate (YouTube recommending content).
       - Device TV % (Crucial for ambience).
    4. **STRATEGY NOTES (KEY REQUIREMENT)**:
       - **CRITICAL**: The 'notes' field MUST be in **Simplified Chinese (简体中文)**.
       - Do not give generic summaries. Be specific, ruthless, and actionable.
       - Structure the notes exactly like this:
         【核心诊断 (Diagnosis)】
         One sentence identifying the biggest bottleneck (e.g., High impressions but low CTR means bad thumbnail).
         【战术微调 (Tactical Actions)】
         1. [Action 1]: Specific instruction (e.g., "Change thumbnail font color to yellow").
         2. [Action 2]: Specific instruction (e.g., "Add 'Episode 1' to title to build series").
         3. [Action 3]: Specific instruction.
         【战略方向 (Strategic Pivot)】
         One sentence on the long-term fix (e.g., "Shift from random videos to a 'Survival Story' series to build regulars").
    RAW TEXT:
    """
    ${rawText}
    """
    Return purely JSON.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            videoTitle: { type: Type.STRING },
            date: { type: Type.STRING },
            impressions: { type: Type.NUMBER },
            ctr: { type: Type.NUMBER },
            views: { type: Type.NUMBER },
            regulars: { type: Type.NUMBER },
            subscribers: { type: Type.NUMBER },
            avgDuration: { type: Type.STRING },
            recommendationRate: { type: Type.NUMBER },
            deviceTV: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          }
        }
      }
    });
    const json = JSON.parse(response.text || "{}");
    return json;
  } catch (error) {
    console.error("Analytics Parsing Error:", error);
    return { notes: "AI 解析失败，请重试或手动输入。" };
  }
};

export const generateContent = (selections: SelectionState): GeneratedContent => {
  const structure = getSelectedItems(selections, 'structure')[0];
  const weatherItems = getSelectedItems(selections, 'weather');
  const dominantWeather = weatherItems.find(i => 
    i.id.includes('thunder') || i.id.includes('rain') || i.id.includes('snow') || i.id.includes('blizzard') || i.id.includes('fog')
  ) || weatherItems[0];
  const defense = getSelectedItems(selections, 'defense');
  const warmth = getSelectedItems(selections, 'warmth');
  const amenities = getSelectedItems(selections, 'amenities');
  const textures = getSelectedItems(selections, 'textures'); 
  const pet = getSelectedItems(selections, 'pets')[0];
  const character = getSelectedItems(selections, 'character')[0];
  const npc = getSelectedItems(selections, 'npc')[0];
  const perspective = getSelectedItems(selections, 'perspective')[0];
  const time = getSelectedItems(selections, 'time')[0];
  const shot = getSelectedItems(selections, 'shot_type')[0];
  const visualStyle = getSelectedItems(selections, 'visual_style')[0];
  const vibe = getSelectedItems(selections, 'vibe')[0];
  const durationRaw = getSelectedItems(selections, 'duration')[0]?.id || '8h';
  const durationText = durationRaw === '8h' ? '8 Hours' : '2 Hours';
  const threat = getSelectedItems(selections, 'danger')[0];

  let intent: 'SLEEP_LONG' | 'NAP' | 'FOCUS' = 'SLEEP_LONG';
  if (durationRaw === '8h') {
      intent = 'SLEEP_LONG';
  } else {
      const isWorkStructure = ['library', 'coffee', 'study', 'desk', 'office'].some(k => (structure?.label || '').toLowerCase().includes(k));
      const isWorkAmenity = amenities.some(a => ['laptop', 'books', 'typewriter', 'painting'].includes(a.id));
      if (vibe?.id === 'cozy_travel' || isWorkStructure || isWorkAmenity) {
          intent = 'FOCUS';
      } else {
          intent = 'NAP';
      }
  }

  const analysis = analyzeSafety(defense, warmth, pet, amenities, textures);
  
  const conciseStructureName = getConciseStructure(structure?.label || '');
  const conciseWeatherName = getConciseWeather(dominantWeather?.label || ''); 
  const primaryWarmth = warmth.length > 0 ? getEnglishTerm(warmth[0].label) : 'Heater';
  const heroProp = getHeroProp(amenities, pet, character);
  const threatName = threat ? getEnglishTerm(threat.label) : 'Safe';
  
  // ROLE DETECTION
  let roleName = "Survivor";
  if (vibe?.id.includes('scientist')) roleName = "Marine Biologist";
  if (vibe?.id.includes('refugee')) roleName = "Refugee";
  if (vibe?.id.includes('fugitive')) roleName = "Fugitive";
  if (vibe?.id.includes('nomad')) roleName = "Nomad";

  // --- DYNAMIC SUBHEAD LOGIC (Context Aware) ---
  const weatherAdjective = (() => {
      const w = conciseWeatherName.toUpperCase();
      if (w.includes("RAIN")) return "RAINY";
      if (w.includes("SNOW") || w.includes("BLIZZARD")) return "SNOWY";
      if (w.includes("SUNNY") || w.includes("CLEAR")) return "SUNNY";
      if (w.includes("STORM") || w.includes("THUNDER")) return "STORMY";
      if (w.includes("WIND")) return "WINDY";
      if (w.includes("FOG")) return "FOGGY";
      if (w.includes("NIGHT")) return "NIGHT";
      return "";
  })();

  const locationLabel = conciseStructureName.toUpperCase().replace("COZY ", ""); 
  const dynamicSubhead = weatherAdjective ? `${weatherAdjective} ${locationLabel}` : `${locationLabel} AMBIENCE`;

  // --- YOUTUBE TITLE LOGIC (New Formula) ---
  // [Role]'s [Safety Moment] | [Location] [Threat] ([Utility])
  let youtubeTitle = "";
  if (intent === 'SLEEP_LONG') {
      youtubeTitle = `${roleName}'s Safe Night | ${conciseStructureName} in ${conciseWeatherName} (8H Deep Sleep)`;
  } else if (intent === 'FOCUS') {
      youtubeTitle = `${roleName}'s Focus Mode | ${conciseStructureName} in ${conciseWeatherName} (Study & Work)`;
  } else {
      youtubeTitle = `${roleName}'s Power Nap | ${conciseStructureName} in ${conciseWeatherName} (2H Reset)`;
  }

  let thumbnailText: string[] = [];
  let thumbnailDesign: ThumbnailDesign;
  let narrativeVisualOverride = "";
  let narrativeCoverHook = ""; 

  if (intent === 'SLEEP_LONG') {
      thumbnailText = ["DEEP SLEEP", dynamicSubhead];
      thumbnailDesign = { textColor: "#FFFFFF", accentColor: "#F59E0B", fontRecommendation: "Impact", layoutTip: "High Contrast for TV Layout" };
  } else if (intent === 'FOCUS') {
      thumbnailText = ["FOCUS MODE", dynamicSubhead];
      thumbnailDesign = { textColor: "#FFFFFF", accentColor: "#10B981", fontRecommendation: "Impact", layoutTip: "Clean Modern Layout for Focus" };
  } else {
      thumbnailText = ["POWER NAP", dynamicSubhead];
      thumbnailDesign = { textColor: "#FFFFFF", accentColor: "#3B82F6", fontRecommendation: "Impact", layoutTip: "Calm Blue Tones" };
  }
  
  let youtubeDescription = "";
  let tags = "";
  
  // NARRATIVE HANDLING (Overrides default text if narrative exists)
  if (vibe && NARRATIVE_TEMPLATES[vibe.id]) {
    const template = NARRATIVE_TEMPLATES[vibe.id];
    // FIX: Replaces hardcoded location with the actual selected structure
    youtubeTitle = template.titleTemplate.replace('{LOCATION}', conciseStructureName);
    
    // Inject NARRATIVE INTRO but keep template description? 
    // Actually better to regenerate description dynamically to ensure variables match selections
    youtubeDescription = generateModularDescription(conciseStructureName, conciseWeatherName, durationText, intent, defense, warmth, amenities, pet, [], threatName, roleName);
    
    tags = template.tags;
    thumbnailText = template.thumbText; 
    thumbnailDesign = template.design;
    if (template.visualSetting) narrativeVisualOverride = template.visualSetting;
    if (template.coverVisual) narrativeCoverHook = template.coverVisual; 
  } else {
      const soundKeywords = [`${conciseWeatherName} soundscape`, `warm hum of the ${primaryWarmth}`, "deep Brown Noise"];
      youtubeDescription = generateModularDescription(conciseStructureName, conciseWeatherName, durationText, intent, defense, warmth, amenities, pet, soundKeywords, threatName, roleName);
      tags = generateTagsMatrix(conciseStructureName, conciseWeatherName, intent);
  }

  const weatherSounds = weatherItems.map(w => getEnglishTerm(w.label)).join(' + ');
  const interiorDetails = [
      ...textures.map(i => i.value), 
      ...warmth.map(i => i.value),
      ...amenities.map(i => i.value),
      ...defense.map(i => i.value),
      pet?.value,
      character?.value,
      npc?.value
  ].filter(Boolean).join('. ');

  const isOpenStructure = ['terrace', 'balcony', 'porch'].some(k => structure?.id.includes(k));
  const stylePrompt = visualStyle ? visualStyle.value : 'Unreal Engine 5 render, cozy atmosphere, high contrast';

  const isDrone = perspective?.id.includes('drone');
  let subjectDescription = structure?.value || 'A cozy shelter interior';
  let droneConstraint = "";

  if (isDrone) {
      const cleanStructure = subjectDescription.replace(/^(Interior of|Inside)\s+/i, '');
      subjectDescription = `Cinematic drone shot from OUTSIDE looking into ${cleanStructure}`;
      droneConstraint = `
      CAMERA POSITION: Strictly OUTSIDE the building.
      VISUAL LOGIC: We are looking THROUGH the window/glass into the warm interior.
      CONTRAST: The foreground is the cold, wet exterior environment. The background (through window) is the warm, safe interior.
      `;
  }

  const weatherDescription = weatherItems.length > 0 
    ? weatherItems.map(i => i.value).join(' combined with ') 
    : 'stormy weather';

  const drynessConstraint = textures.length > 0 
    ? "THE FLOOR IS COMPLETELY DRY AND WARM. No tiles, no stone, no puddles inside. Use wood or carpet materials."
    : "";

  const imagePrompt = `
[TASK] Create a 8K resolution cinematic concept art for a YouTube Ambience Video, optimized for Large OLED TVs.
[ARCHITECTURAL CONTAINER] ${structure?.value || 'Detailed shelter interior'}.
[SCENE CONTEXT] A ${roleName} has found safety here. The space is filled with their survival items.
[COMPOSITION] ${shot?.value || 'Medium shot'}, ${perspective?.value || 'Standard view'}. 
[INTERIOR VISIBLE] The interior is cluttered with survival supplies and SOFT TEXTURES: ${interiorDetails}.
[ENVIRONMENT] The location is isolated. Outside, a ${weatherDescription} is occurring.
[LIGHTING] ${time?.value || 'Warm interior lighting'}. Use Chiaroscuro lighting for high contrast on TV screens.
[CAMERA] Photorealistic, 8k, highly detailed textures, 35mm lens, sharp focus.
[STYLE] ${stylePrompt}.
[OUTPUT FORMAT] 16:9 Aspect Ratio.
[HARD CONSTRAINTS] 
1. DO NOT change the architectural style described in [ARCHITECTURAL CONTAINER]. If it says "Tatami", do not draw a western cabin.
2. ${isOpenStructure ? 'Rain splashes naturally on the open terrace.' : 'THE WINDOWS ARE HERMETICALLY SEALED. Rain streaks are strictly on the OUTER surface of the glass.'}
3. Perspective must be perfect for long-term viewing.
4. ${drynessConstraint}
5. CHARACTERS AND MUSICIANS ARE STRICTLY INSIDE, DRY, AND SAFE. They are separated from the weather by glass/walls. Never place them in the rain.
6. [NEGATIVE] Generic room, western furniture (unless specified), incorrect architecture.
${droneConstraint}
  `.trim();
  
  // --- VIRAL THUMBNAIL LOGIC (REMASTERED) ---
  const coverHook = narrativeCoverHook 
    ? `[NARRATIVE HOOK] ${narrativeCoverHook}`
    : `[HERO PROP FOCUS] A ${heroProp} sits prominently in the foreground, sharp focus. It implies a story of ${intent === 'FOCUS' ? 'deep study' : 'rest'}.`;

  const exteriorVisual = narrativeVisualOverride || conciseWeatherName;

  const thumbnailPrompt = `
[TASK] Create a VIRAL YouTube Thumbnail for an Ambience Channel. 
[KEY STRATEGY] HIGH VISUAL CONFLICT & CONTRAST (Warm vs Cold).
[WORLDVIEW] "Outside is Deadly / Inside is Safe".
[LOCATION] ${structure?.value || 'Shelter'}
[SUBJECT] ${coverHook}
[EXTERIOR BACKGROUND] Extremely hostile ${exteriorVisual}. Dark blues/greys/teals. Violent weather texture (rain/snow) visible through the window glass in the background. Bokeh effect on background.
[INTERIOR FOREGROUND] Extremely safe and warm. Glowing intense orange/gold light illuminating the ${heroProp} or subject.
[COMPOSITION] Rule of Thirds. The Foreground Object is the anchor. The Background Storm is the context.
[STYLE] Hyper-realistic, 8k, Unreal Engine 5, Volumetric Lighting, Glowing, Pop-out 3D effect.
[DETAILS] Raindrops on glass (Macro). Dust motes in the warm light.
[EMOTION] "Safe from the storm".
  `.trim();

  // --- VERTICAL SHORTS COVER LOGIC (REMASTERED) ---
  const verticalThumbnailPrompt = `
[TASK] Create a VIRAL YouTube Shorts / TikTok Cover (Vertical 9:16).
[KEY STRATEGY] VERTICAL DEPTH & COLOR CLASH.
[LOCATION] ${structure?.value || 'Shelter'}
[SUBJECT] ${coverHook.replace('A ', 'Vertical composition featuring a ')}
[EXTERIOR] Top half of image: Hostile ${exteriorVisual}. Dark, cold, wet. Rain/Snow streaks running vertically down the glass.
[INTERIOR] Bottom half of image: Warm, cozy sanctuary. The ${heroProp} is glowing with orange warmth.
[COMPOSITION] Vertical split or framing. Floor to ceiling depth. 
[STYLE] Hyper-realistic, 8k, Unreal Engine 5, Volumetric Lighting, Glowing.
[DETAILS] High contrast between the blue/grey top and orange/gold bottom.
[EMOTION] "Safe from the storm".
  `.trim();

  const charMotion = getCharacterMotion(character?.id || 'none');
  let cameraMotion = "Static Tripod";
  if (perspective?.id.includes('drone')) {
      if (perspective.id === 'drone_orbit') cameraMotion = "Slow Cinematic Orbit (0.2 speed)";
      else if (perspective.id === 'drone_peek') cameraMotion = "Drone Hover (0.1 speed, Floating in place outside window)";
      else if (perspective.id === 'drone_god') cameraMotion = "Slow High-Angle Pan";
      else if (perspective.id === 'drone_cinematic_45') cameraMotion = "Slow Dolly Forward (45 degree angle)";
  }

  const i2vPrompt = `[Camera]: ${cameraMotion}. [Internal Atmosphere]: Warm, dry, still air. [Energy]: ${warmth.length > 0 ? 'flickering fire' : 'dust motes'}. [Exterior]: ${conciseWeatherName} hitting glass. [Motion]: ${charMotion}. [Quality]: 4K High Fidelity for Large Screens.`;

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    imagePrompt,
    thumbnailPrompt,
    verticalThumbnailPrompt,
    videoPrompt: "",
    i2vPrompt,
    youtubeTitle,
    youtubeDescription,
    thumbnailText,
    thumbnailDesign,
    thumbnailConfig: {
      headline: { x: 640, y: 500, fontSize: 130 }, 
      subhead: { x: 640, y: 620, fontSize: 60 } 
    },
    tags: tags,
    analysis,
    audioGuide: [
      { layer: "1. Brown Noise Base", sound: "Deep rumble (Fan/Heater)", mixingNotes: "Low Pass @ 200Hz, -18dB" },
      { layer: "2. Texture Layer", sound: `High Fidelity ${weatherSounds}`, mixingNotes: "Wide Stereo, -6dB, Crisp Highs" },
      { layer: "3. ASMR Detail", sound: `${primaryWarmth} Crackle / Rain Taps`, mixingNotes: "Center Channel, -12dB" }
    ],
    selectedItems: selections,
    score: analysis.score
  };
};

export const generateRandomSelections = (): SelectionState => {
    const s: SelectionState = {};
    const pick = (catId: string, filterFn?: (item: CategoryItem) => boolean): string => {
        const cat = CATEGORIES.find(c => c.id === catId);
        if (!cat) return '';
        const items = filterFn ? cat.items.filter(filterFn) : cat.items;
        if (items.length === 0) return '';
        return items[Math.floor(Math.random() * items.length)].id;
    };
    const pickMulti = (catId: string, count: number, filterFn?: (item: CategoryItem) => boolean): string[] => {
        const cat = CATEGORIES.find(c => c.id === catId);
        if (!cat) return [];
        const items = filterFn ? cat.items.filter(filterFn) : cat.items;
        if (items.length === 0) return items.slice(0, count).map(i => i.id); // Fallback
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(i => i.id);
    };

    // 1. GLOBAL THEME DIRECTOR
    // 85% High Conflict (Storm/Rain/Snow) - Core Strategy
    // 15% Low Conflict (Sunny/Peaceful) - For variety
    const isHighConflict = Math.random() > 0.15; 

    // 2. Structure
    const structureId = pick('structure');
    s['structure'] = [structureId];

    // Archetype Analysis
    let archetype: 'vehicle' | 'scifi' | 'rustic' | 'urban' = 'rustic';
    if (['rv', 'truck', 'train', 'night_bus', 'luxury_jet', 'yacht', 'cyber_taxi', 'subway_moving', 'spaceship', 'cruise_ship'].includes(structureId)) {
        archetype = 'vehicle';
    } else if (['glass_igloo', 'mountain_peak', 'penthouse', 'bunker', 'vault', 'ocean_island'].includes(structureId)) {
        archetype = 'scifi';
    } else if (['supermarket', 'factory', 'warehouse_store', 'hospital_ward', 'library', 'church', 'oil_rig'].includes(structureId)) {
        archetype = 'urban';
    } else {
        archetype = 'rustic';
    }
    const isSpace = structureId === 'spaceship';

    // 3. Weather (Strictly aligned with Conflict Theme)
    s['weather'] = pickMulti('weather', 2, (i) => {
        if (isSpace) return i.id === 'solar'; 
        
        if (isHighConflict) {
            // Must be bad weather
            return ['rain', 'medium_rain', 'heavy_rain', 'thunder', 'rain_lush', 'heavy_snow', 'blizzard', 'fog', 'wind', 'acid'].includes(i.id);
        } else {
            // Must be good weather
            return ['sunny', 'overcast', 'cloudy', 'breeze', 'spring', 'summer', 'autumn', 'winter', 'light_snow', 'light_rain'].includes(i.id);
        }
    });
    // Fallback integrity check
    if (!s['weather'].length) s['weather'] = isHighConflict ? ['thunder'] : ['sunny'];

    // 4. Time (Synced with Weather)
    s['time'] = [pick('time', (i) => {
        if (isSpace) return i.id === 'night' || i.id === 'toxic';
        
        if (isHighConflict) {
            // Bad weather looks best at night or gloomy noon
            return ['night', 'moonlight', 'noon', 'floodlight', 'emergency'].includes(i.id);
        } else {
            // Good weather needs light
            return ['sunny_day', 'golden_hour', 'soft_day', 'morning'].includes(i.id);
        }
    })];

    // 5. Vibe (Synced with Theme)
    s['vibe'] = [pick('vibe', (i) => {
        // If High Conflict, we prioritize the Narrative Templates (Scientist, Fugitive, etc)
        // If Low Conflict, we avoid them (since they are hard-coded for storms)
        const isNarrative = i.id.startsWith('narrative_');
        return isHighConflict ? true : !isNarrative; 
    })];

    // ... Rest of the logic (Defense, Warmth, etc) stays largely similar but filtered slightly ...
    s['defense'] = pickMulti('defense', 1, (i) => {
        if (archetype === 'vehicle') return ['shutters', 'blast_glass'].includes(i.id);
        if (isSpace) return ['airlock', 'blast_glass'].includes(i.id);
        if (archetype === 'rustic') return ['iron_door', 'shutters', 'fence'].includes(i.id);
        return true;
    });
    s['warmth'] = pickMulti('warmth', 1, (i) => {
        // High conflict needs more warmth contrast
        return true;
    });
    s['danger'] = [pick('danger', (i) => {
        if (isSpace) return i.id === 'aliens' || i.id === 'none';
        // Only allow danger if high conflict
        if (!isHighConflict) return i.id === 'none';
        return true;
    })];
    // ... perspective, shot, style ...
    s['perspective'] = [pick('perspective', (i) => {
        if (archetype === 'vehicle') return ['first_person', 'over_shoulder', 'back_seat'].includes(i.id);
        return true;
    })];
    s['shot_type'] = [pick('shot_type')]; 
    s['sleeping'] = [pick('sleeping', (i) => {
        if (archetype === 'vehicle') return ['car_seat', 'hammock'].includes(i.id);
        return !['car_seat'].includes(i.id);
    })];
    s['visual_style'] = [pick('visual_style', (i) => {
        if (archetype === 'scifi') return ['cyber_neon', 'unreal_5', 'realistic_8k', 'davinci_grade'].includes(i.id);
        if (archetype === 'urban') return ['vhs_tape', 'analog_horror', 'gothic_noir', 'leica_bw'].includes(i.id);
        if (archetype === 'rustic') return ['cinematic_35mm', 'vintage_70s', 'realistic_8k', 'japanese_wafu', 'davinci_grade'].includes(i.id);
        return true;
    })];
    s['character'] = [pick('character')];
    s['pets'] = [pick('pets')];
    s['npc'] = [pick('npc')];
    s['amenities'] = pickMulti('amenities', 4);
    s['textures'] = pickMulti('textures', 2); 
    s['duration'] = [Math.random() > 0.3 ? '8h' : '2h'];
    
    return s;
};

export const parsePromptToSelections = (prompt: string): SelectionState => {
    const s: SelectionState = {};
    const lower = prompt.toLowerCase();
    CATEGORIES.forEach(c => {
        const matches = c.items.filter(i => lower.includes(getEnglishTerm(i.label).toLowerCase()));
        if (matches.length > 0) s[c.id] = matches.map(m => m.id);
    });
    return s;
};
