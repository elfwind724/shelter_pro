
import { SelectionState, GeneratedContent, CategoryItem, SafetyAnalysis, AudioLayer, ThumbnailDesign } from '../types';
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
  // Sound Texture Mapping
  if (eng.includes('LUSH')) return 'FOREST RAIN';
  if (eng.includes('LIGHT RAIN')) return 'GENTLE RAIN';
  if (eng.includes('MEDIUM RAIN')) return 'RAINY DAY';
  if (eng.includes('HEAVY RAIN')) return 'HEAVY RAIN';
  if (eng.includes('THUNDER')) return 'THUNDERSTORM';
  if (eng.includes('LIGHT SNOW')) return 'SNOWFALL';
  if (eng.includes('HEAVY SNOW')) return 'HEAVY SNOW';
  if (eng.includes('BLIZZARD')) return 'BLIZZARD';
  if (eng.includes('FOG')) return 'FOG & WIND'; // Fixed: Fog needs sound texture
  if (eng.includes('WIND')) return 'HOWLING WIND';
  if (eng.includes('ACID')) return 'TOXIC RAIN';
  if (eng.includes('SOLAR')) return 'SOLAR STORM';
  return 'STORM';
};

const getConciseStructure = (label: string): string => {
   const eng = getEnglishTerm(label).toUpperCase();
   // FOUNDATION - Nature
   if (eng.includes('CLIFF')) return 'CLIFF SHELTER';
   if (eng.includes('FOREST')) return 'TREEHOUSE BASE'; 
   if (eng.includes('BOATHOUSE')) return 'LAKE HOUSE';
   if (eng.includes('ZEN')) return 'JAPANESE GARDEN';
   if (eng.includes('RIVER')) return 'RIVER COTTAGE';
   if (eng.includes('IGLOO')) return 'GLASS IGLOO';
   if (eng.includes('PEAK')) return 'MOUNTAIN BASE';
   if (eng.includes('ROOFTOP')) return 'CITY ROOFTOP';
   
   // FOUNDATION - Moving
   if (eng.includes('RV')) return 'EXPEDITION RV';
   if (eng.includes('TRUCK')) return 'TRUCK CABIN';
   if (eng.includes('TRAIN')) return 'SNOW TRAIN';
   if (eng.includes('BUS')) return 'NIGHT BUS';
   if (eng.includes('JET')) return 'LUXURY JET';
   if (eng.includes('YACHT')) return 'STORM YACHT';
   if (eng.includes('TAXI')) return 'CYBER TAXI';
   if (eng.includes('SPACESHIP')) return 'SPACESHIP';
   if (eng.includes('METRO')) return 'METRO CAR';
   
   // FOUNDATION - Underground
   if (eng.includes('BUNKER')) return 'DOOMSDAY BUNKER';
   if (eng.includes('RAID')) return 'WWII SHELTER';
   if (eng.includes('CAVE')) return 'CAVE BASE';
   if (eng.includes('DRAIN')) return 'SEWER BASE';
   if (eng.includes('VAULT')) return 'BANK VAULT';
   
   // FOUNDATION - Institutional
   if (eng.includes('CHURCH')) return 'SAFE CHURCH';
   if (eng.includes('TRAUMA') || eng.includes('HOSPITAL')) return 'ABANDONED HOSPITAL';
   if (eng.includes('LIBRARY')) return 'SAFE LIBRARY';
   
   // FOUNDATION - Commercial
   if (eng.includes('SUPERMARKET')) return 'SUPERMARKET';
   if (eng.includes('FACTORY')) return 'FACTORY BASE';
   if (eng.includes('WAREHOUSE')) return 'WAREHOUSE';
   
   // FOUNDATION - Residential
   if (eng.includes('PENTHOUSE')) return 'SKY PENTHOUSE';
   if (eng.includes('CABIN')) return 'COZY CABIN';
   if (eng.includes('CONTAINER')) return 'CONTAINER HOME';
   if (eng.includes('TREEHOUSE')) return 'TREE FORT';

   return 'COZY SHELTER';
};

const analyzeSafety = (
  defense: CategoryItem[],
  warmth: CategoryItem[],
  pet: CategoryItem | undefined,
  amenities: CategoryItem[]
): SafetyAnalysis => {
  let score = 50; 
  const feedback: string[] = [];
  if (defense.length > 1) { score += 15; feedback.push("✅ MULTI-LAYER DEFENSE: Multiple physical barriers increase visual safety."); }
  if (warmth.length > 0) { score += 20; feedback.push("✅ THERMAL COMFORT: Active heat source reduces the feeling of environmental dread."); }
  if (amenities.length >= 3) { score += 10; feedback.push("✅ ABUNDANT SUPPLIES: High resource visibility triggers the survival 'safe' instinct."); }
  if (pet && pet.id !== 'none') { score += 15; feedback.push("✅ COMPANION: Biological presence reduces the 'loneliness' anxiety score."); }
  return { score: Math.min(score, 100), feedback, psychologicalHooks: [] };
};

const generateModularDescription = (
    structureName: string,
    weatherName: string,
    durationText: string,
    defense: CategoryItem[],
    warmth: CategoryItem[],
    amenities: CategoryItem[],
    pet: CategoryItem | undefined,
    soundKeyWords: string[]
): string => {
    
    // SECTION 1: SEO Optimized Intro (Natural Phrasing)
    // "Welcome to your [Scene Name]. Outside, the [Weather] is raging, but inside, you are safe.
    // Enjoy the soothing sounds of [Sound 1], [Sound 2], and [Sound 3] designed to help you [Benefit] immediately."
    
    const benefit = durationText.includes('8') ? 'fall into a deep sleep' : 'focus and relax';
    
    // Improved sound list formatting
    let soundsString = "";
    if (soundKeyWords.length > 2) {
      const last = soundKeyWords.pop();
      soundsString = `${soundKeyWords.join(', ')}, and ${last}`;
    } else {
      soundsString = soundKeyWords.join(' and ');
    }
    
    const intro = `Welcome to your ${structureName}. Outside, the ${weatherName} is raging, but inside, you are safe.\n\nEnjoy the soothing sounds of ${soundsString} designed to help you ${benefit} immediately.\n\nThis video features a ${durationText} loop without ads, perfect for uninterrupted sleep, study, or relaxation.`;

    // SECTION 2: Inventory / Lore (Brand Asset)
    const inventory = [
        `🏠 **Base:** ${structureName}`,
        `⛈️ **Atmosphere:** ${weatherName}`,
        `🔥 **Hearth:** ${warmth.map(w => getEnglishTerm(w.label)).join(', ') || 'Thermal System'}`,
        `🛡️ **Security:** ${defense.map(d => getEnglishTerm(d.label)).join(', ')}`,
        `📦 **Resources:** ${amenities.map(a => getEnglishTerm(a.label)).join(', ')}`,
        pet && pet.id !== 'none' ? `🐾 **Companion:** ${getEnglishTerm(pet.label)}` : ''
    ].filter(Boolean).join('\n');

    // SECTION 3: Hashtags (Standardized)
    // #Ambience #SleepSounds #ASMR #[SceneName] #[Weather]
    const sceneTag = structureName.replace(/\s+/g, '');
    const weatherTag = weatherName.replace(/\s+/g, '');
    const hashtags = `#${sceneTag} #${weatherTag} #WhiteNoise #CozyAmbience #SleepSounds`;

    return `${intro}\n\n━━━━━━━━━━━━━━━━━━━━\n\n🎒 **SHELTER INVENTORY**\n${inventory}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${hashtags}`;
};

const generateTagsMatrix = (sName: string, wName: string, warmth: CategoryItem[], amenities: CategoryItem[]): string => {
    // Group 1: Basic (Universal)
    const basicTags = [
        "ambience", "sleeping sounds", "white noise for sleep", "insomnia relief", 
        "cozy ambience", "relaxing music", "asmr sleep", "no ads", "deep sleep", "soundscape"
    ];

    // Group 2: Weather (Texture)
    const weatherTags = [
        `${wName} sounds`, `${wName} on window`, `${wName} ambience`, 
        "heavy rain", "thunderstorm sounds", "wind sounds", "storm for sleep"
    ];

    // Group 3: Scene (Specific)
    const sceneTags = [
        `${sName} ambience`, `cozy ${sName}`, `${sName} sounds`, 
        "abandoned places", "shelter ambience", "safehouse", "bunker sounds"
    ];
    
    // Combine and dedupe
    const allTags = Array.from(new Set([...basicTags, ...weatherTags, ...sceneTags]));
    return allTags.slice(0, 40).join(', ');
};

export const generateContent = (selections: SelectionState): GeneratedContent => {
  const structure = getSelectedItems(selections, 'structure')[0];
  const weather = getSelectedItems(selections, 'weather')[0];
  const defense = getSelectedItems(selections, 'defense');
  const warmth = getSelectedItems(selections, 'warmth');
  const amenities = getSelectedItems(selections, 'amenities');
  const pet = getSelectedItems(selections, 'pets')[0];
  const character = getSelectedItems(selections, 'character')[0];
  const npc = getSelectedItems(selections, 'npc')[0];
  const perspective = getSelectedItems(selections, 'perspective')[0];
  const time = getSelectedItems(selections, 'time')[0];
  const shot = getSelectedItems(selections, 'shot_type')[0];
  const durationRaw = getSelectedItems(selections, 'duration')[0]?.id || '8h';
  const durationText = durationRaw === '8h' ? '8 Hours' : '2 Hours';

  const analysis = analyzeSafety(defense, warmth, pet, amenities);
  
  // Naming Standardization
  const conciseStructureName = getConciseStructure(structure?.label || '');
  const conciseWeatherName = getConciseWeather(weather?.label || '');
  const primaryWarmth = warmth.length > 0 ? getEnglishTerm(warmth[0].label) : 'Heater';

  // --- NEW TITLE FORMULA (SOP) ---
  // Formula: [Scene] + [Texture] + [Benefit] | [Badge]
  // 8H: SLEEP in [Structure] 🌧️ [Weather] Sounds | 8 Hours Deep Sleep | No Ads
  // 2H: [Structure] in [Weather] 🌧️ Cozy White Noise for Focus | 2 Hours No Loop
  
  let youtubeTitle = "";
  if (durationRaw === '8h') {
      youtubeTitle = `SLEEP in ${conciseStructureName} 🌧️ ${conciseWeatherName} Sounds | 8 Hours Deep Sleep | No Ads`;
  } else {
      youtubeTitle = `${conciseStructureName} in ${conciseWeatherName} 🌧️ Cozy White Noise for Sleep & Focus | 2 Hours No Loop`;
  }

  // --- THUMBNAIL STRATEGY ---
  // Text: 3-4 words max. Badge: NO ADS.
  const thumbnailText = [
      conciseStructureName.toUpperCase(), // e.g. CLIFF SHELTER
      `${conciseWeatherName} | NO ADS`    // e.g. HEAVY RAIN | NO ADS
  ];

  // Color Psychology
  // Sleep (8H) = Cold (Blue/Purple/Black)
  // Focus (2H) = Warm (Orange/Yellow/Brown)
  const thumbnailDesign: ThumbnailDesign = durationRaw === '8h' 
      ? { textColor: "#FFFFFF", accentColor: "#4F46E5", fontRecommendation: "Impact", layoutTip: "Cold Tones (Blue/Black), High Contrast White Text" } // Indigo
      : { textColor: "#FFFFFF", accentColor: "#EA580C", fontRecommendation: "Impact", layoutTip: "Warm Tones (Orange/Amber), Golden Lighting" }; // Orange

  // --- SOUND STRATEGY ---
  const soundKeywords = [`${conciseWeatherName} striking the glass`, `warm hum of the ${primaryWarmth}`, "deep Brown Noise"];

  // --- PROMPT LOGIC ---
  const interiorDetails = [
      ...warmth.map(i => i.value),
      ...amenities.map(i => i.value),
      ...defense.map(i => i.value),
      pet?.value,
      character?.value,
      npc?.value
  ].filter(Boolean).join('. ');

  const isOpenStructure = ['terrace', 'balcony', 'porch'].some(k => structure?.id.includes(k));
  
  const imagePrompt = `
[TASK] Create a professional cinematic concept art for a YouTube Ambience Video.
[SUBJECT] ${structure?.value || 'A cozy shelter interior'}.
[COMPOSITION] ${shot?.value || 'Medium shot'}, ${perspective?.value || 'Standard view'}. The scene is cluttered with survival supplies: ${interiorDetails}.
[ENVIRONMENT] The location is isolated. Outside, a ${weather?.value || 'storm'} is occurring.
[LIGHTING] ${time?.value || 'Warm interior lighting'}.
[CAMERA] Photorealistic, 8k, highly detailed textures, 35mm lens.
[STYLE] Unreal Engine 5 render, cozy atmosphere, high contrast.
[OUTPUT FORMAT] 16:9 Aspect Ratio.
[HARD CONSTRAINTS] 
1. ${isOpenStructure ? 'Rain splashes naturally on the open terrace.' : 'THE WINDOWS ARE HERMETICALLY SEALED. The interior is 100% DRY and WARM. Rain streaks are strictly on the OUTER surface of the glass.'}
2. No water inside the living space (unless it's a specific open terrace design).
3. Fireplace/Stove smoke goes UP the chimney, not into the room.
4. Perspective must be perfect.
  `.trim();

  const i2vPrompt = `[Camera]: Static Tripod, locked perspective. [Internal Atmosphere]: Warm, completely still air. [Energy & Particles]: ${warmth.length > 0 ? 'flickering orange flames in fireplace' : 'soft dust motes floating'}. [Exterior Physics]: ${getEnglishTerm(weather?.label || 'Rain')} striking the outer glass pane, trees swaying OUTSIDE the shelter. [Biological]: Subtle breathing of the animal companion if visible.`;

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    imagePrompt,
    videoPrompt: "",
    i2vPrompt,
    youtubeTitle,
    youtubeDescription: generateModularDescription(conciseStructureName, conciseWeatherName, durationText, defense, warmth, amenities, pet, soundKeywords),
    thumbnailText,
    thumbnailDesign,
    thumbnailConfig: {
      headline: { x: 640, y: 540, fontSize: 120 },
      subhead: { x: 640, y: 630, fontSize: 50 }
    },
    tags: generateTagsMatrix(conciseStructureName, conciseWeatherName, warmth, amenities),
    analysis,
    audioGuide: [
      { layer: "1. Base Layer (Brown Noise)", sound: "Deep rumble / Air filtration hum", mixingNotes: "EQ: Low Pass @ 300Hz, -15dB" },
      { layer: "2. External Texture (Main)", sound: `High fidelity ${conciseWeatherName} hitting glass`, mixingNotes: "Stereo 120% width, -6dB" },
      { layer: "3. Near Field (ASMR)", sound: `${primaryWarmth} crackle / ${amenities[0] ? getEnglishTerm(amenities[0].label) : 'Page Turning'}`, mixingNotes: "Center channel, crisp high-end, -12dB" }
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
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(i => i.id);
    };

    const structureId = pick('structure');
    s['structure'] = [structureId];

    let archetype: 'vehicle' | 'scifi' | 'rustic' | 'urban' = 'rustic';
    
    if (['rv', 'truck', 'train', 'night_bus', 'luxury_jet', 'yacht', 'cyber_taxi', 'subway_moving', 'spaceship'].includes(structureId)) {
        archetype = 'vehicle';
    } else if (['glass_igloo', 'mountain_peak', 'penthouse', 'bunker', 'vault'].includes(structureId)) {
        archetype = 'scifi'; // Or extreme/modern
    } else if (['supermarket', 'factory', 'warehouse_store', 'hospital_ward', 'library', 'church'].includes(structureId)) {
        archetype = 'urban';
    } else {
        archetype = 'rustic'; // Cabins, nature, etc.
    }

    const isSpace = structureId === 'spaceship';

    s['weather'] = [pick('weather', (i) => {
        if (isSpace) return i.id === 'solar'; 
        if (archetype === 'scifi' && structureId !== 'penthouse') return ['blizzard', 'fog', 'wind'].includes(i.id); 
        if (structureId === 'train') return ['heavy_snow', 'blizzard'].includes(i.id); 
        return !['acid', 'solar'].includes(i.id);
    })];

    s['defense'] = pickMulti('defense', 1, (i) => {
        if (archetype === 'vehicle') return ['shutters', 'blast_glass'].includes(i.id);
        if (isSpace) return ['airlock', 'blast_glass'].includes(i.id);
        if (archetype === 'rustic') return ['iron_door', 'shutters', 'fence'].includes(i.id);
        return true;
    });

    s['warmth'] = pickMulti('warmth', 1, (i) => {
        if (archetype === 'vehicle' || isSpace) return ['diesel_heater', 'hologram', 'reactor'].includes(i.id);
        if (archetype === 'rustic') return ['fireplace', 'stove', 'candles'].includes(i.id);
        if (archetype === 'urban') return ['barrel', 'heater', 'candles'].includes(i.id);
        return true;
    });

    s['time'] = [pick('time', (i) => {
        if (isSpace) return i.id === 'night' || i.id === 'toxic';
        return true;
    })];

    s['danger'] = [pick('danger', (i) => {
        if (isSpace) return i.id === 'aliens' || i.id === 'none';
        if (archetype === 'rustic') return ['wildlife', 'zombies', 'none'].includes(i.id);
        return true;
    })];

    s['perspective'] = [pick('perspective', (i) => {
        if (archetype === 'vehicle') return ['first_person', 'over_shoulder', 'back_seat'].includes(i.id);
        return ['standard', 'cinematic', 'terrace_view'].includes(i.id);
    })];

    s['shot_type'] = [pick('shot_type')]; 
    s['sleeping'] = [pick('sleeping', (i) => {
        if (archetype === 'vehicle') return ['car_seat', 'hammock'].includes(i.id);
        return !['car_seat'].includes(i.id);
    })];
    
    s['character'] = [pick('character')];
    s['pets'] = [pick('pets')];
    s['npc'] = [pick('npc')];
    s['amenities'] = pickMulti('amenities', 4);
    s['vibe'] = [pick('vibe')];
    
    // Randomly assign 2H or 8H (weighted towards 8H for safety)
    s['duration'] = [Math.random() > 0.3 ? '8h' : '2h'];

    return s;
};

export const parsePromptToSelections = (prompt: string): SelectionState => {
    const s: SelectionState = {};
    const lower = prompt.toLowerCase();
    CATEGORIES.forEach(c => {
        const matches = c.items.filter(i => lower.includes(getEnglishTerm(i.label).toLowerCase()));
        if (matches.length > 0) s[c.id] = [matches[0].id];
    });
    return s;
};
