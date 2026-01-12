
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
  if (eng.includes('SUNNY')) return 'Sunny Clear Sky';
  if (eng.includes('OVERCAST')) return 'Grey Overcast Sky';
  if (eng.includes('BREEZE')) return 'Swaying Trees'; 
  if (eng.includes('CLOUDY')) return 'Cloudy Sky';
  if (eng.includes('SUMMER') || eng.includes('CICADAS')) return 'Summer Ambience'; 
  if (eng.includes('AUTUMN')) return 'Falling Autumn Leaves';
  if (eng.includes('BLUE SKY')) return 'Blue Sky'; 
  if (eng.includes('LUSH')) return 'Heavy Rain in Forest';
  if (eng.includes('LIGHT RAIN')) return 'Gentle Rain';
  if (eng.includes('MEDIUM RAIN')) return 'Rain Sounds'; 
  if (eng.includes('HEAVY RAIN')) return 'Heavy Rain Storm';
  if (eng.includes('THUNDER')) return 'Thunderstorm';
  if (eng.includes('LIGHT SNOW')) return 'Falling Snow';
  if (eng.includes('MEDIUM SNOW')) return 'Snowstorm'; 
  if (eng.includes('BLIZZARD')) return 'Blizzard';
  if (eng.includes('FOG')) return 'Foggy Ambience'; 
  return 'Rain Storm';
};

const getConciseStructure = (label: string): string => {
   const eng = getEnglishTerm(label).toUpperCase();
   // Simple mapping for concise structure names
   const map: {[key:string]: string} = {
       'RV': 'Luxury RV', 'TRUCK': 'Truck Cabin', 'SKOOLIE': 'Cozy Skoolie', 'BUS': 'Night Bus',
       'TRAIN': 'Train Cabin', 'YACHT': 'Super Yacht', 'TRAWLER': 'Storm Boat', 'CARGO': 'Cargo Ship',
       'CRUISE': 'Cruise Ship', 'BOEING': 'Airplane', 'PRIVATE JET': 'Private Jet',
       'HIGH-RISE': 'Penthouse', 'OFFICE': 'Night Office', 'CLIFF SHELTER': 'Cliff Pod', 'SKY BAR': 'Sky Bar',
       'CAVE': 'Mountain Cave', 'TREEHOUSE': 'Treehouse', 'SKY GARDEN': 'Sky Garden', 
       'MONASTERY': 'Cliff Monastery', 'LIGHTHOUSE': 'Lighthouse', 'CHURCH': 'Gothic Church',
       'SUPERMARKET': 'Supermarket', 'LIBRARY': 'Old Library', 'POLICE': 'Police Station',
       'SCHOOL': 'Empty School', 'HOSPITAL': 'Abandoned Hospital', 'BANK': 'Bank Vault',
       'VILLA': 'Glass Villa', 'FACTORY': 'Factory Loft', 'CINEMA': 'Cinema', 'MUSEUM': 'Museum',
       'FIRE': 'Fire Station', 'SUBWAY': 'Subway Station', 'AIR RAID': 'Air Raid Shelter',
       'BASEMENT': 'Basement Room', 'CIVIL BUNKER': 'Concrete Bunker', 'LUXURY BUNKER': 'Luxury Bunker',
       'PARKING': 'Parking Lot', 'WINE': 'Wine Cave', 'FARM': 'Underground Farm', 'TOWN': 'Underground Town',
       'TERRACE': 'Forest Terrace', 'VERANDA': 'Hill Veranda', 'CLIFF PLATFORM': 'Cliff Platform',
       'OPEN PAVILION': 'Open Pavilion', 'LAKE PAVILION': 'Lake Pavilion', 'SEA DECK': 'Sea Deck',
       'CANYON': 'Canyon Deck', 'ROOF GARDEN': 'Roof Garden', 'STAR': 'Star Deck',
       'PANORAMA': 'Glass Pod', 'ATRIUM': 'Rainy Atrium', 'CORRIDOR': 'Rain Corridor',
       'ROCK': 'Rock Shelter', 'LEAN-TO': 'Bushcraft Camp', 'CANOPY': 'Tree Canopy'
   };

   for (const key in map) {
       if (eng.includes(key)) return map[key];
   }
   return 'Shelter'; 
};

const getCharacterMotion = (gender: string, actionId: string): string => {
  const g = gender === 'Woman' ? 'A woman' : gender === 'Man' ? 'A man' : 'A survivor';
  switch (actionId) {
    case 'act_sleep_couple': return 'A loving couple sleeping soundly together in a cozy bed, embracing under thick blankets.';
    case 'act_sleep_bed': return `${g} sleeping soundly in a cozy bed with thick blankets. Rhythmic breathing.`;
    case 'act_sleep_sofa_sit': return `${g} falling asleep while sitting on the sofa, head resting comfortably.`;
    case 'act_sleep_sofa_lie': return `${g} lying asleep on a long sofa, covered by a throw blanket.`;
    case 'act_sleep_floor': return `${g} sleeping on a thick futon mattress on the floor. Japanese style.`;
    case 'act_read': return `${g} sitting comfortably in an armchair, focused on reading a hardcover book.`;
    case 'act_cook': return `${g} standing by the stove, slowly stirring a pot. Steam rising.`;
    case 'act_gaze': return `${g} sitting by the window, gazing out at the scenery with a calm expression.`;
    case 'act_laptop': return `${g} sitting at a desk, typing on a laptop. Screen glow on face.`;
    case 'act_tea': return `${g} sitting at a small table, holding a hot cup of tea with both hands.`;
    case 'act_coffee': return `${g} relaxing in a chair, blowing steam off a hot mug of coffee.`;
    case 'act_alcohol': return `${g} sitting quietly, swirling a glass of whiskey/wine.`;
    case 'act_tv': return `${g} sitting on the sofa, watching an old television set. Flickering light.`;
    case 'act_music': return `${g} sitting with eyes closed, wearing headphones or listening to a record player.`;
    case 'act_draw': return `${g} sitting on a rug, sketching in a notebook with a pencil.`;
    case 'inst_guitar': return `${g} sitting with BACK TO CAMERA, playing an acoustic guitar. Silhouette view.`;
    case 'inst_piano': return `${g} sitting at a piano with BACK TO CAMERA, playing softly.`;
    case 'inst_violin': return `${g} standing by the window with BACK TO CAMERA, playing the violin.`;
    default: return '';
  }
};

const analyzeSafety = (defense: CategoryItem[], warmth: CategoryItem[], pet: CategoryItem | undefined, amenities: CategoryItem[], textures: CategoryItem[], food: CategoryItem[]): SafetyAnalysis => {
  let score = 50; 
  const feedback: string[] = [];
  if (defense.length > 1) { score += 15; feedback.push("✅ MULTI-LAYER DEFENSE"); }
  if (warmth.length > 0) { score += 20; feedback.push("✅ THERMAL COMFORT"); }
  if (amenities.length >= 2) { score += 5; feedback.push("✅ LIFESTYLE"); }
  if (food.length >= 2) { score += 10; feedback.push("✅ SUSTENANCE"); } 
  if (pet && pet.id !== 'none') { score += 15; feedback.push("✅ COMPANION"); }
  if (textures.length > 0) { score += 10; feedback.push("✅ TACTILE SOFTNESS"); }
  return { score: Math.min(score, 100), feedback, psychologicalHooks: [] };
};

const generateViralTitle = (structure: string, weather: string, durationRaw: string, intent: string): string => {
  const w = weather.replace("Sounds", "").replace("Ambience", "").trim();
  const s = structure.replace("Luxury", "").replace("Cozy", "").trim();
  const d = durationRaw === '8h' ? '8 Hours' : '2 Hours';
  
  let coreKeyword = "Rain Sounds for Sleeping";
  if (w.includes("SNOW") || w.includes("BLIZZARD")) coreKeyword = "Snowstorm Sounds for Sleep";
  if (w.includes("THUNDER")) coreKeyword = "Thunderstorm Sounds for Sleeping";
  if (w.includes("FOG") || w.includes("WIND")) coreKeyword = "Wind Sounds for Sleeping";
  if (intent === 'FOCUS') coreKeyword = "Ambient Noise for Focus";

  const sceneDesc = `Cozy ${s} Ambience`;
  return `${coreKeyword} ${d} | ${sceneDesc}`;
};

const generateModularDescription = (structureName: string, weatherName: string, durationText: string, intent: string, defense: any[], warmth: any[], amenities: any[], pet: any, soundKeyWords: string[], threatName: string, roleName: string, food: any[]): string => {
    const corePromise = `Pure ${weatherName.toLowerCase()} sounds from a safe ${structureName.toLowerCase()}. No music, no ads, no interruptions.`;
    const techSpecs = `Specs:\n⏱️ Duration: ${durationText} continuous\n🎥 Footage: Original 1.5 hours loop\n🔊 Audio: High fidelity binaural rain & thunder\n❌ No Talking, No Mid-roll Ads`;
    
    let useCases = "";
    if (intent === 'FOCUS') {
        useCases = `Perfect for:\n✓ Deep Focus & Productivity\n✓ Studying for Exams\n✓ Reading & Writing\n✓ Blocking out distraction`;
    } else {
        useCases = `Perfect for:\n✓ Deep Sleep & Insomnia Relief\n✓ Reducing Stress & Anxiety\n✓ Meditation & Relaxation\n✓ Fall Asleep Fast`;
    }

    const narrative = `Imagine you've found shelter from the raging storm outside. You are in a ${structureName}, completely safe and warm. The glow of the ${warmth.map(w => getEnglishTerm(w.label)).join(' and ')} illuminates the room. Outside, the ${weatherName} creates a natural white noise barrier.`;
    
    const inventory = `**SHELTER INVENTORY**\n• Location: ${structureName}\n• Weather: ${weatherName}\n• Heating: ${warmth.map(w => getEnglishTerm(w.label)).join(', ') || 'Central Heating'}\n• Security: ${defense.map(d => getEnglishTerm(d.label)).join(', ') || 'Standard'}`;

    const tags = `#${structureName.replace(/\s+/g, '')} #${weatherName.replace(/\s+/g, '')} #RainSounds #SleepSounds #CozyAmbience`;

    return `${corePromise}\n\n${techSpecs}\n\n${useCases}\n\n${narrative}\n\n${inventory}\n\n${tags}`;
};

const generateTagsMatrix = (sName: string, wName: string, intent: string): string => {
    const tier1 = ["rain sounds", "rain sounds for sleeping", "sleep sounds", "heavy rain", "thunderstorm sounds", "white noise for sleep", "insomnia relief"];
    const tier2 = [`${sName} ambience`, `cozy ${sName}`, "shelter ambience", "safe haven", "storm ambience", `${wName} sounds`];
    return [...tier1, ...tier2].slice(0, 45).join(', ');
};

export const parseAnalyticsData = async (rawText: string): Promise<Partial<AnalyticsRecord>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are a Data Analyst...`; 
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { notes: "AI 解析失败" };
  }
};

const generateViralThumbText = (structureName: string, weatherName: string, durationId: string): string[] => {
   const d = durationId === '8h' ? "8HR" : "2HR";
   const w = weatherName.toUpperCase();
   let wShort = "RAIN";
   if (w.includes("THUNDER")) wShort = "STORM";
   if (w.includes("SNOW")) wShort = "SNOW";
   if (w.includes("BLIZZARD")) wShort = "BLIZZARD";
   if (w.includes("FOG")) wShort = "FOG";
   
   const mainText = `${d} ${wShort}`; 

   const subText = structureName.toUpperCase()
      .replace("LUXURY ", "")
      .replace("COZY ", "")
      .replace("PRIVATE ", "")
      .replace("ABANDONED ", "")
      .replace("UNDERGROUND ", "")
      .replace("CONVERTED ", "")
      .replace("APARTMENT", "APT")
      .split(" ")
      .pop() || "SHELTER"; 

   return [mainText, subText];
};

export const generateContent = (selections: SelectionState): GeneratedContent => {
  const vehicle = getSelectedItems(selections, 'cat_vehicles')[0];
  const shelter = getSelectedItems(selections, 'cat_shelters')[0];
  const semiOpen = getSelectedItems(selections, 'cat_semi_open')[0];
  const structure = vehicle || shelter || semiOpen;

  const weatherItems = getSelectedItems(selections, 'weather');
  const dominantWeather = weatherItems[0];
  const defense = getSelectedItems(selections, 'defense');
  const warmth = getSelectedItems(selections, 'warmth');
  const amenities = getSelectedItems(selections, 'amenities');
  const food = getSelectedItems(selections, 'cat_food'); 
  const textures = getSelectedItems(selections, 'textures'); 
  const pet = getSelectedItems(selections, 'pets')[0];
  const genderItem = getSelectedItems(selections, 'char_gender')[0];
  const gender = genderItem ? genderItem.value : 'Survivor';
  const actionItems = getSelectedItems(selections, 'character'); 
  const actionId = actionItems[0]?.id || '';
  const cameraMove = getSelectedItems(selections, 'perspective')[0]; 
  const lensDistance = getSelectedItems(selections, 'shot_type')[0]; 
  const time = getSelectedItems(selections, 'time')[0];
  const visualStyle = getSelectedItems(selections, 'visual_style')[0];
  const durationItem = getSelectedItems(selections, 'duration')[0];
  const durationRaw = durationItem ? durationItem.id : '2h';
  const durationText = durationItem ? durationItem.value : '2 Hours';
  const threat = getSelectedItems(selections, 'danger')[0];

  let intent: 'SLEEP_LONG' | 'NAP' | 'FOCUS' = durationRaw === '8h' ? 'SLEEP_LONG' : 'FOCUS';
  const analysis = analyzeSafety(defense, warmth, pet, amenities, textures, food);
  
  const conciseStructureName = getConciseStructure(structure?.label || '');
  const conciseWeatherName = getConciseWeather(dominantWeather?.label || ''); 
  const primaryWarmth = warmth.length > 0 ? getEnglishTerm(warmth[0].label) : 'Heater';
  const threatName = threat ? getEnglishTerm(threat.label) : 'Safe';
  const threatVisual = threat && threat.id !== 'none' ? threat.value : '';

  const isVehicleMode = !!vehicle;
  const isDoubleDecker = structure?.id.includes('double');
  const hasDefense = defense.length > 0;
  const securityState = hasDefense ? "[SECURITY STATE] HERMETICALLY SEALED. CRITICAL: All doors and windows are firmly CLOSED." : "Standard ventilation.";

  const youtubeTitle = generateViralTitle(conciseStructureName, conciseWeatherName, durationRaw, intent);
  
  const thumbnailText = generateViralThumbText(conciseStructureName, conciseWeatherName, durationRaw);

  // --- MUSIC DETECTION & BADGE LOGIC ---
  const musicActions = ['inst_guitar', 'inst_piano', 'inst_violin', 'act_music'];
  const hasMusic = actionItems.some(item => musicActions.includes(item.id));
  
  const viralThumbConfig = {
      headline: { x: 640, y: 100, fontSize: 160 },
      subhead: { x: 640, y: 620, fontSize: 140 },
      badge: {
        visible: !hasMusic, 
        text: hasMusic ? "LOFI BEATS" : "NO MUSIC",
        style: 'ribbon_tr' as const, 
        color: hasMusic ? '#a855f7' : '#16a34a',
        x: 0, // Ribbon Offset for TR
        y: 80, // Ribbon Position (distance from corner)
        fontSize: 50
      }
  };

  const soundKeywords = [`${conciseWeatherName} soundscape`, `warm hum of the ${primaryWarmth}`, "deep Brown Noise"];
  const youtubeDescription = generateModularDescription(conciseStructureName, conciseWeatherName, durationText, intent, defense, warmth, amenities, pet, soundKeywords, threatName, 'Survivor', food);
  const tags = generateTagsMatrix(conciseStructureName, conciseWeatherName, intent);

  // --- PHYSICS & VEHICLE LOGIC ---
  const isSideCutaway = cameraMove?.id === 'cam_cutaway_side';
  let motionInstructions = "";
  let vehicleLayoutRules = "";
  
  if (isVehicleMode) {
      motionInstructions = `MOTION: The vehicle is in motion. Rain streaks moving horizontally on windows.`;
      
      // HARD CONSTRAINT: Vehicle Structure
      vehicleLayoutRules = "VEHICLE STRUCTURE MANDATE: The composition MUST show TWO distinct sections. 1. The Living Quarters (Foreground/Midground, Cozy, Warm). 2. The Driver's Cab/Cockpit (Background, visible through open door/partition). DRIVER: A silhouetted driver MUST be visible in the cockpit facing the road.";
  }

  const weatherDescription = weatherItems.length > 0 ? weatherItems.map(i => i.value).join(' combined with ') : 'stormy weather';
  
  const characterDescriptions = actionItems.map((item, index) => {
      let specificGender = gender;
      if (index > 0) specificGender = Math.random() > 0.5 ? 'Man' : 'Woman';
      return getCharacterMotion(specificGender, item.id);
  });
  
  // DRIVER LOGIC: If vehicle and moving, ensure driver exists if not already described
  if (isVehicleMode && !actionItems.some(i => i.id.includes('drive'))) {
      characterDescriptions.push("[BACKGROUND] Silhouetted driver in the cockpit, hands on wheel, facing the road ahead.");
  }
  
  const familyContext = characterDescriptions.length > 0 ? `[OCCUPANTS] ${characterDescriptions.join(' + ')}` : `[OCCUPANTS] Empty.`;

  // --- ITEM INJECTION (Force Selected Amenities) ---
  const mustHaveItems = [
      ...amenities.map(a => getEnglishTerm(a.label)),
      ...textures.map(t => getEnglishTerm(t.label)),
      ...food.map(f => getEnglishTerm(f.label))
  ];
  const detailedInteriorProps = mustHaveItems.length > 0 ? `MUST CONTAIN: ${mustHaveItems.join(', ')}.` : "";

  let styleDescription = "cinematic 35mm film look";
  let isAnimeStyle = false;
  if (visualStyle) {
     styleDescription = visualStyle.value;
     isAnimeStyle = styleDescription.toLowerCase().includes('anime');
  }

  const subjectText = `${conciseStructureName} interior. ${vehicleLayoutRules}`;
  const compositionRule = "VISUAL COMPOSITION RULE: The image MUST be split roughly 70% WINDOW VIEW (Rain/Storm outside) and 30% INTERIOR (Cozy Shelter).";
  const GLOBAL_NEGATIVE = "no visible hands, no disembodied arms, no deformed faces, no text, no watermark, no ghost car";

  const ohneilPrompt = {
    subject: subjectText,
    style: { description: styleDescription, mode_specific: [isVehicleMode ? "Vehicle Interior" : "Architecture"] },
    camera: { framing: "Standard", lens_distance: lensDistance?.value || "Medium Shot", specific_angle: cameraMove?.value || "" },
    lighting: { mood: "Cozy", time_of_day: time?.value || "Night", interior_sources: warmth.map(w => getEnglishTerm(w.label)) },
    environment: { location: structure?.value || "Shelter", weather: weatherDescription },
    subject_details: { occupants: familyContext, mandatory_props: detailedInteriorProps },
    render: { additional_notes: [motionInstructions, securityState, compositionRule, GLOBAL_NEGATIVE] }
  };

  const metaInstruction = isAnimeStyle ? `[TASK] Generate an ANIME ART STYLE image.` : `[TASK] Generate a PHOTOREALISTIC, 8K RAW PHOTOGRAPH.`;
  const imagePrompt = `${metaInstruction}\n\n${JSON.stringify(ohneilPrompt, null, 2)}`;
  const thumbnailPrompt = `[TASK] YouTube Thumbnail. High Contrast. [SUBJECT] POV from INSIDE ${conciseStructureName} looking OUT at ${conciseWeatherName}. [COMPOSITION] 70% Window, 30% Interior.`;
  const verticalThumbnailPrompt = `[TASK] Vertical Shorts Cover (9:16). Cozy interior of ${conciseStructureName} vs Storm outside.`;
  const i2vPrompt = `[Camera]: Static. [Internal]: Warm. [Exterior]: ${conciseWeatherName}.`;

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
    thumbnailDesign: { textColor: "#FFF", accentColor: "#FFFF00", fontRecommendation: "Impact", layoutTip: "Top/Bottom Split" },
    thumbnailConfig: viralThumbConfig,
    tags,
    analysis,
    audioGuide: [],
    selectedItems: selections,
    score: analysis.score
  };
};

export const parsePromptToSelections = (promptText: string): SelectionState => {
  const selections: SelectionState = {};
  const lowerPrompt = promptText.toLowerCase();

  CATEGORIES.forEach(category => {
    const matchedIds: string[] = [];
    
    category.items.forEach(item => {
      // 1. Check English Label (e.g. "Luxury RV")
      const labelTerm = getEnglishTerm(item.label).toLowerCase();
      
      // 2. Check Value Snippet (Avoid noise by stripping common prefixes)
      // We look for significant unique strings
      const valueContent = item.value
        .replace(/ARCHITECTURAL STYLE:|INTERIOR:|VIEW:|LAYOUT:/gi, '')
        .toLowerCase();
      
      // Lenient matching: if the prompt contains the English label OR a significant chunk of the value description
      if ((labelTerm.length > 2 && lowerPrompt.includes(labelTerm)) || 
          (valueContent.length > 10 && lowerPrompt.includes(valueContent.substring(0, 15)))) {
         matchedIds.push(item.id);
      }
    });

    if (matchedIds.length > 0) {
      selections[category.id] = matchedIds;
    }
  });

  return selections;
};

export const generateRandomSelections = (): SelectionState => {
  const s: SelectionState = {};
  
  const pick = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat || cat.items.length === 0) return null;
    return cat.items[Math.floor(Math.random() * cat.items.length)].id;
  };

  // 1. Pick Location (Mutually Exclusive: Vehicles OR Shelters OR Semi-Open)
  const locType = Math.random();
  if (locType < 0.33) {
     const v = pick('cat_vehicles');
     if(v) s['cat_vehicles'] = [v];
  } else if (locType < 0.66) {
     const sh = pick('cat_shelters');
     if(sh) s['cat_shelters'] = [sh];
  } else {
     const sm = pick('cat_semi_open');
     if(sm) s['cat_semi_open'] = [sm];
  }

  // 2. Pick Essential Atmosphere
  const w = pick('weather'); if(w) s['weather'] = [w];
  const t = pick('time'); if(t) s['time'] = [t];
  const d = pick('duration'); if(d) s['duration'] = [d];
  
  // 3. Pick Details (Random chance for optional items)
  if (Math.random() > 0.3) { const cam = pick('perspective'); if(cam) s['perspective'] = [cam]; }
  if (Math.random() > 0.5) { const sty = pick('visual_style'); if(sty) s['visual_style'] = [sty]; }
  if (Math.random() > 0.5) { const pet = pick('pets'); if(pet) s['pets'] = [pet]; }
  
  // 4. Multi-selects (Pick 1-2 random items)
  const pickMulti = (catId: string, max: number) => {
      const cat = CATEGORIES.find(c => c.id === catId);
      if (!cat) return;
      const count = Math.floor(Math.random() * max) + 1;
      const shuffled = [...cat.items].sort(() => 0.5 - Math.random());
      s[catId] = shuffled.slice(0, count).map(i => i.id);
  };

  if (Math.random() > 0.4) pickMulti('warmth', 1);
  if (Math.random() > 0.6) pickMulti('amenities', 2);
  if (Math.random() > 0.7) pickMulti('textures', 1);

  return s;
};
