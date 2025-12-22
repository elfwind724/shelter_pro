
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
  if (eng.includes('LUSH')) return 'FOREST RAIN';
  if (eng.includes('LIGHT RAIN')) return 'GENTLE RAIN';
  if (eng.includes('MEDIUM RAIN')) return 'RAINY DAY';
  if (eng.includes('HEAVY RAIN')) return 'HEAVY RAIN';
  if (eng.includes('THUNDER')) return 'THUNDERSTORM';
  if (eng.includes('LIGHT SNOW')) return 'SNOWFALL';
  if (eng.includes('HEAVY SNOW')) return 'HEAVY SNOW';
  if (eng.includes('BLIZZARD')) return 'BLIZZARD';
  if (eng.includes('FOG')) return 'DENSE FOG';
  return 'STORM';
};

const getConciseStructure = (label: string): string => {
   const eng = getEnglishTerm(label).toUpperCase();
   if (eng.includes('BUNKER')) return 'BUNKER';
   if (eng.includes('CABIN')) return 'LOG CABIN';
   if (eng.includes('TRAIN')) return 'SNOW TRAIN';
   if (eng.includes('CLIFF')) return 'CLIFF HOUSE';
   if (eng.includes('PENTHOUSE')) return 'SKY PENTHOUSE';
   if (eng.includes('FACTORY')) return 'FACTORY BASE';
   if (eng.includes('BOATHOUSE')) return 'LAKE HOUSE';
   if (eng.includes('TRUCK')) return 'TRUCK CAB';
   if (eng.includes('RV')) return 'EXPEDITION RV';
   return 'SHELTER';
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

const generateLongFormDescription = (
    structure: CategoryItem | undefined,
    weather: CategoryItem | undefined,
    duration: string,
    defense: CategoryItem[],
    warmth: CategoryItem[],
    amenities: CategoryItem[],
    pet: CategoryItem | undefined
): string => {
    const sName = structure ? getEnglishTerm(structure.label) : "Shelter";
    const wName = weather ? getEnglishTerm(weather.label) : "Storm";
    
    const narrativeEN = `The world outside is dissolving into a fierce ${wName}, but here, within the reinforced walls of your ${sName}, time seems to stand still. Listen to the rhythmic drumming on the glass as you drift into a deep, uninterrupted slumber. You are safe. You are warm.`;
    const narrativeZH = `欢迎回到你的私人避难所。窗外${wName}肆虐，但在打造精良的${sName}空间里，你拥有绝对的安全感。戴上耳机，让外界的喧嚣在这一刻彻底消失。`;

    const inventory = [
        `🏠 **Base:** ${sName}`,
        `⛈️ **Atmosphere:** ${wName}`,
        `🔥 **Hearth:** ${warmth.map(w => getEnglishTerm(w.label)).join(', ') || 'Thermal System'}`,
        `🛡️ **Security:** ${defense.map(d => getEnglishTerm(d.label)).join(', ')}`,
        `📦 **Resources:** ${amenities.map(a => getEnglishTerm(a.label)).join(', ')}`,
        pet && pet.id !== 'none' ? `🐾 **Companion:** ${getEnglishTerm(pet.label)}` : ''
    ].filter(Boolean).join('\n');

    return `${narrativeEN}\n\n━━━━━━━━━━━━━━━━━━━━\n\n${narrativeZH}\n\n━━━━━━━━━━━━━━━━━━━━\n\n🎒 **SHELTER INVENTORY**\n${inventory}\n\n━━━━━━━━━━━━━━━━━━━━\n\n⏰ **TIMESTAMP**\n0:00:00 Intro & Ambient Setup\n0:05:00 Deep Sleep White Noise Phase\n${duration.replace('h','')} Hours Loop End\n\n#${sName.replace(/\s+/g, '')} #${wName.replace(/\s+/g, '')} #CozyAmbience #RainSounds #SleepAid #ASMR`;
};

const generateTags = (sName: string, wName: string, warmth: CategoryItem[], amenities: CategoryItem[]): string => {
    const tags = [
        `${sName} ambience`, `${sName} sounds`, `cozy ${sName}`, `rain on ${sName}`,
        `${wName} sounds`, `${wName} for sleep`, "sleep sounds", "relaxing white noise",
        "insomnia relief", "study music", "focus aid", "asmr ambience", "fireplace sounds",
        "shelter ambience", "doomsday shelter", "rain and thunder", "snowstorm sleep"
    ];
    return tags.slice(0, 30).join(', ');
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
  const durationText = durationRaw.replace('h', ' HOURS');

  const analysis = analyzeSafety(defense, warmth, pet, amenities);
  const sName = structure ? getEnglishTerm(structure.label) : "Shelter";
  const wName = weather ? getEnglishTerm(weather.label) : "Storm";

  // --- NANO BANANA 2 STRUCTURED PROMPT LOGIC ---
  
  // 1. Gather all interior details
  const interiorDetails = [
      ...warmth.map(i => i.value),
      ...amenities.map(i => i.value),
      ...defense.map(i => i.value),
      pet?.value,
      character?.value,
      npc?.value
  ].filter(Boolean).join('. ');

  // 2. Determine "Openness" Logic for Safety Constraints
  const isOpenStructure = ['terrace', 'balcony', 'porch'].some(k => structure?.id.includes(k));
  
  // 3. Construct the Script (The 9-Point Framework)
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

  // -----------------------------------------------------

  const i2vPrompt = `[Camera]: Static Tripod, locked perspective. [Internal Atmosphere]: Warm, completely still air. [Energy & Particles]: ${warmth.length > 0 ? 'flickering orange flames in fireplace' : 'soft dust motes floating'}. [Exterior Physics]: ${getEnglishTerm(weather?.label || 'Rain')} striking the outer glass pane, trees swaying OUTSIDE the shelter. [Biological]: Subtle breathing of the animal companion if visible.`;

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    imagePrompt,
    videoPrompt: "",
    i2vPrompt,
    youtubeTitle: `${getConciseStructure(structure?.label || '')} vs ${getConciseWeather(weather?.label || '')} | ${durationText} Sleep Ambience | NO ADS`,
    youtubeDescription: generateLongFormDescription(structure, weather, durationRaw, defense, warmth, amenities, pet),
    thumbnailText: [
      getConciseStructure(structure?.label || ''), 
      `${getConciseWeather(weather?.label || '')} | SLEEP ${durationText}`
    ],
    thumbnailDesign: { 
      textColor: "#FFFFFF", 
      accentColor: "#FF8C00", 
      fontRecommendation: "Impact", 
      layoutTip: "Centered bottom, heavy black stroke, use white text for main headline" 
    },
    // NEW: Initialize with default centered positions
    thumbnailConfig: {
      headline: { x: 640, y: 540, fontSize: 120 },
      subhead: { x: 640, y: 630, fontSize: 50 }
    },
    tags: generateTags(sName, wName, warmth, amenities),
    analysis,
    audioGuide: [
      { layer: "1. Room Tone", sound: "Low-end hum of air filtration", mixingNotes: "Cut above 500Hz" },
      { layer: "2. External Storm", sound: `High fidelity ${wName} hitting glass`, mixingNotes: "Stereo 120% width" },
      { layer: "3. Hearth", sound: "Crackling wood fire", mixingNotes: "Center channel, add reverb" }
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
    s['duration'] = [pick('duration')];

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
