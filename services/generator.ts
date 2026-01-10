
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
  if (eng.includes('BREEZE')) return 'Swaying Trees'; // New
  if (eng.includes('CLOUDY')) return 'Cloudy Sky';
  if (eng.includes('SUMMER') || eng.includes('CICADAS')) return 'Summer Ambience'; // Updated
  if (eng.includes('AUTUMN')) return 'Falling Autumn Leaves';
  if (eng.includes('BLUE SKY')) return 'Blue Sky'; // New
  if (eng.includes('LUSH')) return 'Heavy Rain in Forest';
  if (eng.includes('LIGHT RAIN')) return 'Gentle Rain on Glass';
  if (eng.includes('MEDIUM RAIN')) return 'Rainy Day'; 
  if (eng.includes('HEAVY RAIN')) return 'Heavy Rain Storm';
  if (eng.includes('THUNDER')) return 'Thunderstorm and Lightning';
  if (eng.includes('LIGHT SNOW')) return 'Falling Snowflakes';
  if (eng.includes('MEDIUM SNOW')) return 'Winter Snow'; // New
  if (eng.includes('BLIZZARD')) return 'Whiteout Blizzard';
  if (eng.includes('FOG')) return 'Thick Fog'; 
  return 'Rain Storm';
};

const getConciseStructure = (label: string): string => {
   const eng = getEnglishTerm(label).toUpperCase();
   
   // --- VEHICLES ---
   if (eng.includes('RV')) return 'Luxury RV';
   if (eng.includes('TRUCK')) return 'Truck Cabin';
   if (eng.includes('SKOOLIE')) return 'Cozy Skoolie';
   if (eng.includes('BUS')) return 'Night Bus';
   if (eng.includes('TRAIN')) return 'Train Cabin';
   if (eng.includes('YACHT')) return 'Super Yacht';
   if (eng.includes('TRAWLER')) return 'Storm Boat';
   if (eng.includes('CARGO')) return 'Cargo Ship';
   if (eng.includes('CRUISE')) return 'Cruise Ship';
   if (eng.includes('BOEING')) return 'Airplane';
   if (eng.includes('PRIVATE JET')) return 'Private Jet';

   // --- SHELTERS ---
   if (eng.includes('HIGH-RISE')) return 'Penthouse';
   if (eng.includes('OFFICE')) return 'Night Office';
   if (eng.includes('CLIFF SHELTER')) return 'Cliff Pod';
   if (eng.includes('SKY BAR')) return 'Sky Bar';
   if (eng.includes('CAVE')) return 'Mountain Cave';
   if (eng.includes('TREEHOUSE')) return 'Treehouse';
   if (eng.includes('SKY GARDEN')) return 'Sky Garden';
   if (eng.includes('MONASTERY')) return 'Cliff Monastery';
   if (eng.includes('LIGHTHOUSE')) return 'Lighthouse';
   
   if (eng.includes('CHURCH')) return 'Gothic Church';
   if (eng.includes('SUPERMARKET')) return 'Supermarket';
   if (eng.includes('LIBRARY')) return 'Old Library';
   if (eng.includes('POLICE')) return 'Police Station';
   if (eng.includes('SCHOOL')) return 'Empty School';
   if (eng.includes('HOSPITAL')) return 'Abandoned Hospital';
   if (eng.includes('BANK')) return 'Bank Vault';
   if (eng.includes('VILLA')) return 'Glass Villa';
   if (eng.includes('FACTORY')) return 'Factory Loft';
   if (eng.includes('CINEMA')) return 'Cinema';
   if (eng.includes('MUSEUM')) return 'Museum';
   if (eng.includes('FIRE')) return 'Fire Station';

   if (eng.includes('SUBWAY')) return 'Subway Station';
   if (eng.includes('AIR RAID')) return 'Air Raid Shelter';
   if (eng.includes('BASEMENT')) return 'Basement Room';
   if (eng.includes('CIVIL BUNKER')) return 'Concrete Bunker';
   if (eng.includes('LUXURY BUNKER')) return 'Luxury Bunker';
   if (eng.includes('PARKING')) return 'Parking Lot';
   if (eng.includes('WINE')) return 'Wine Cave';
   if (eng.includes('FARM')) return 'Underground Farm';
   if (eng.includes('TOWN')) return 'Underground Town';

   // --- SEMI OPEN ---
   if (eng.includes('TERRACE')) return 'Forest Terrace';
   if (eng.includes('VERANDA')) return 'Hill Veranda';
   if (eng.includes('CLIFF PLATFORM')) return 'Cliff Platform';
   if (eng.includes('OPEN PAVILION')) return 'Open Pavilion';
   if (eng.includes('LAKE PAVILION')) return 'Lake Pavilion';
   if (eng.includes('SEA DECK')) return 'Sea Deck';
   if (eng.includes('CANYON')) return 'Canyon Deck';
   if (eng.includes('ROOF GARDEN')) return 'Roof Garden';
   if (eng.includes('STAR')) return 'Star Deck';
   if (eng.includes('PANORAMA')) return 'Glass Pod';
   if (eng.includes('ATRIUM')) return 'Rainy Atrium';
   if (eng.includes('CORRIDOR')) return 'Rain Corridor';
   if (eng.includes('ROCK')) return 'Rock Shelter';
   if (eng.includes('LEAN-TO')) return 'Bushcraft Camp';
   if (eng.includes('CANOPY')) return 'Tree Canopy';

   return 'Shelter'; 
};

// Updated Logic to combine Gender and Action
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
    
    default: return ''; // No character or action selected
  }
};

// ... (analyzeSafety, getHeroProp unchanged)
const analyzeSafety = (
  defense: CategoryItem[],
  warmth: CategoryItem[],
  pet: CategoryItem | undefined,
  amenities: CategoryItem[],
  textures: CategoryItem[],
  food: CategoryItem[] // ADDED
): SafetyAnalysis => {
  let score = 50; 
  const feedback: string[] = [];
  if (defense.length > 1) { score += 15; feedback.push("✅ MULTI-LAYER DEFENSE"); }
  if (warmth.length > 0) { score += 20; feedback.push("✅ THERMAL COMFORT"); }
  if (amenities.length >= 2) { score += 5; feedback.push("✅ LIFESTYLE"); }
  if (food.length >= 2) { score += 10; feedback.push("✅ SUSTENANCE"); } // NEW
  if (pet && pet.id !== 'none') { score += 15; feedback.push("✅ COMPANION"); }
  if (textures.length > 0) { score += 10; feedback.push("✅ TACTILE SOFTNESS"); }
  return { score: Math.min(score, 100), feedback, psychologicalHooks: [] };
};

const getHeroProp = (amenities: CategoryItem[], pet: CategoryItem | undefined, characters: CategoryItem[], food: CategoryItem[]): string => {
    if (pet && pet.id !== 'none') return getEnglishTerm(pet.label);
    const musician = characters.find(c => c.id.startsWith('inst_'));
    if (musician) {
        const instrument = musician.id.replace('inst_', '');
        return instrument;
    }
    // Updated list to include high-impact food items
    const highVisualImpact = [
      'whiskey', 'gun', 'map', 'radio', 'telescope', 'coffee', 'steak', 'pizza', 'sushi', 'burger', 'taco', 'wine', 'beer', 'feast', 'laptop', 'typewriter', 'vinyl'
    ];
    const foundAmenity = amenities.find(a => highVisualImpact.some(k => a.id.includes(k)));
    if (foundAmenity) return getEnglishTerm(foundAmenity.label);

    // CHECK FOOD
    const foundFood = food.find(f => highVisualImpact.some(k => f.id.includes(k)));
    if (foundFood) return getEnglishTerm(foundFood.label);

    return 'steaming coffee mug';
};

// ... (generateModularDescription, generateTagsMatrix, parseAnalyticsData, generateViralTitle, generateViralThumbText unchanged)
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
    roleName: string,
    food: CategoryItem[]
): string => {
    const introTemplate = [
       `Escape the chaos of the world and find sanctuary in this cozy ${structureName}.`,
       `Outside, a fierce ${weatherName.toLowerCase()} is raging, but inside, you are perfectly safe, warm, and dry.`,
       `The sound of the ${weatherName.toLowerCase()} against the structure creates a natural, hypnotic white noise that instantly calms the mind.`
    ].join('\n');

    const sensoryDetails = `The warm glow of the ${warmth.map(w => getEnglishTerm(w.label)).join(' and ')} illuminates the room, creating a peaceful haven. Your faithful ${pet && pet.id !== 'none' ? getEnglishTerm(pet.label) : 'companion'} is sleeping soundly, completely unbothered by the storm. Take a deep breath, let go of your stress, and drift into a ${durationText} deep sleep.`;

    const inventory = `**SHELTER INVENTORY**\n🧩 **Structure:** ${structureName}\n🌧️ **Weather:** ${weatherName}\n🔥 **Heating:** ${warmth.map(w => getEnglishTerm(w.label)).join(', ') || 'Central Heating'}\n🛡️ **Security:** ${defense.map(d => getEnglishTerm(d.label)).join(', ')}\n🥘 **Sustenance:** ${food.map(f => getEnglishTerm(f.label)).join(', ')}\n☕ **Amenities:** ${amenities.slice(0,3).map(a => getEnglishTerm(a.label)).join(', ')}\n🐕 **Companion:** ${pet && pet.id !== 'none' ? getEnglishTerm(pet.label) : 'None'}`;

    let benefits = "";
    if (intent === 'FOCUS') {
        benefits = `🎯 BENEFITS:\n• For studying and exams\n• For work and deep focus\n• For reading and learning\n• Blocks out distracting background noise`;
    } else {
        benefits = `🎯 BENEFITS:\n• Help with insomnia and sleep disorders\n• Reduce stress and anxiety immediately\n• Perfect for sleeping and relaxation\n• Creates a safe, enclosed atmosphere`;
    }

    const cta = `🔗 SUBSCRIBE FOR MORE ${intent === 'FOCUS' ? 'FOCUS' : 'SLEEP'} SOUNDS:\n👉 Subscribe to Haven Nights for daily ambience videos.\n\n⚖️ DISCLAIMER:\nThis content is for relaxation and entertainment purposes.`;

    const baseHash = `#RainSounds #Ambience #${structureName.replace(/\s+/g, '')}`;
    const specificHash = intent === 'FOCUS' ? "#FocusMusic #StudyAmbience" : "#SleepAmbience #DeepSleep #Insomnia";
    const hashtags = `${baseHash} ${specificHash}`;

    return `${introTemplate}\n\n${sensoryDetails}\n\n${inventory}\n\n${benefits}\n\n${cta}\n\n${hashtags}`;
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

const generateViralTitle = (structure: string, weather: string, duration: string): string => {
  // STRATEGY: KEYWORD FIRST. SHORT. PUNCHY.
  // FORMAT: [Structure] [Weather] Ambience - [Benefit]
  const w = weather.replace("Sounds", "").trim();
  const s = structure.replace("Luxury", "").replace("Cozy", "").trim();
  
  return `${s} ${w} Ambience - Deep Sleep ${duration}`;
};

const generateViralThumbText = (structureName: string, weatherName: string, durationId: string): string[] => {
   // STRATEGY: EXTREME CONCISENESS FOR HIGH CONTRAST THUMBNAILS
   // HEADLINE: LOCATION + WEATHER (Max 2-3 words total)
   // SUBHEAD: "SLEEP 8:00" (Badge Style)

   const s = structureName.toUpperCase()
      .replace("LUXURY ", "")
      .replace("COZY ", "")
      .replace("PRIVATE ", "")
      .replace("STORMY ", "")
      .replace("VINTAGE ", "")
      .replace("CONVERTED ", "") 
      .replace("SURVIVAL ", "")
      .replace("ABANDONED ", "") 
      .replace("UNDERGROUND ", "UND.") // Abbreviate
      .replace("APARTMENT", "APT")
      .replace("PENTHOUSE", "LOFT")
      .trim();
      
   const w = weatherName.toUpperCase()
      .replace("HEAVY ", "")
      .replace("LIGHT ", "")
      .replace("FALLING ", "")
      .replace("CLEAR ", "")
      .replace(" SOUNDS", "") 
      .replace(" SKY", "")
      .replace("THUNDERSTORM", "STORM") // Shorten
      .replace("BLIZZARD", "BLIZZARD")
      .replace("RAINY DAY", "RAIN")
      .trim();

   // Headline Logic: If Structure is long, just use Structure. If short, combine.
   let headline = `${s} ${w}`;
   if (headline.length > 15) {
       // If too long, prioritize the most dramatic word
       if (w.includes("STORM") || w.includes("BLIZZARD")) {
           headline = `${s.split(' ')[0]} ${w}`; // e.g., "BUNKER BLIZZARD"
       } else {
           headline = s; // Just "LUXURY RV"
       }
   }

   const durationLabel = durationId === '8h' ? '8:00' : '2:00';
   const badge = `SLEEP ${durationLabel}`;

   return [headline, badge];
};

export const generateContent = (selections: SelectionState): GeneratedContent => {
  // NEW LOGIC: DETECT STRUCTURE FROM THE 3 BLOCKS
  const vehicle = getSelectedItems(selections, 'cat_vehicles')[0];
  const shelter = getSelectedItems(selections, 'cat_shelters')[0];
  const semiOpen = getSelectedItems(selections, 'cat_semi_open')[0];
  
  // The dominant structure is whichever one is selected
  const structure = vehicle || shelter || semiOpen;

  const weatherItems = getSelectedItems(selections, 'weather');
  const dominantWeather = weatherItems[0];
  const defense = getSelectedItems(selections, 'defense');
  const warmth = getSelectedItems(selections, 'warmth');
  const amenities = getSelectedItems(selections, 'amenities');
  const food = getSelectedItems(selections, 'cat_food'); // NEW
  const textures = getSelectedItems(selections, 'textures'); 
  const pet = getSelectedItems(selections, 'pets')[0];
  
  // UPDATED CHARACTER LOGIC
  const genderItem = getSelectedItems(selections, 'char_gender')[0];
  const gender = genderItem ? genderItem.value : 'Survivor';
  const actionItems = getSelectedItems(selections, 'character'); // Now fetches multiple
  const actionId = actionItems[0]?.id || '';
  // Used for logic downstream
  const characters = actionItems; 

  const npc = getSelectedItems(selections, 'npc')[0];
  
  // UPDATED CATEGORY REFS
  const cameraMove = getSelectedItems(selections, 'perspective')[0]; // Cat 6: Camera Move
  const lensDistance = getSelectedItems(selections, 'shot_type')[0]; // Cat 16: Lens Distance
  
  const time = getSelectedItems(selections, 'time')[0];
  const visualStyle = getSelectedItems(selections, 'visual_style')[0];
  
  const durationItem = getSelectedItems(selections, 'duration')[0];
  const durationRaw = durationItem ? durationItem.id : '2h';
  const durationText = durationItem ? durationItem.value : '2 Hours';
  
  const threat = getSelectedItems(selections, 'danger')[0];

  let intent: 'SLEEP_LONG' | 'NAP' | 'FOCUS' = 'SLEEP_LONG';
  if (durationRaw === '8h') intent = 'SLEEP_LONG';
  else intent = 'FOCUS';

  const analysis = analyzeSafety(defense, warmth, pet, amenities, textures, food);
  
  const conciseStructureName = getConciseStructure(structure?.label || '');
  const conciseWeatherName = getConciseWeather(dominantWeather?.label || ''); 
  const primaryWarmth = warmth.length > 0 ? getEnglishTerm(warmth[0].label) : 'Heater';
  const threatName = threat ? getEnglishTerm(threat.label) : 'Safe';
  const threatVisual = threat && threat.id !== 'none' ? threat.value : '';

  // --- LOGIC GATES (NEW DETECTION) ---
  const isVehicleMode = !!vehicle;
  // Bunkers are typically underground shelters. Let's detect by ID prefix.
  const isBunkerMode = !!shelter && shelter.id.startsWith('slt_und_');
  const isScenicMode = !!semiOpen || (!!shelter && shelter.id.startsWith('slt_high_'));
  
  const isDoubleDecker = structure?.id.includes('double') || structure?.id.includes('fortress') || structure?.id.includes('train');

  // --- DEFENSE STATE LOGIC ---
  const hasDefense = defense.length > 0;
  const securityState = hasDefense ? "[SECURITY STATE] HERMETICALLY SEALED. CRITICAL: All doors and windows are firmly CLOSED. No open air gaps. No open windows. Massive reinforcement." : "Standard ventilation.";

  // --- VIRAL TITLE & THUMBNAIL LOGIC ---
  const youtubeTitle = generateViralTitle(conciseStructureName, conciseWeatherName, durationText);
  const thumbnailText = generateViralThumbText(conciseStructureName, conciseWeatherName, durationRaw);

  const viralThumbConfig = {
      headline: { x: 340, y: 620, fontSize: 130 }, // Bigger Font by default
      subhead: { x: 340, y: 530, fontSize: 80 }   // Badge position
  };

  const soundKeywords = [`${conciseWeatherName} soundscape`, `warm hum of the ${primaryWarmth}`, "deep Brown Noise"];
  const youtubeDescription = generateModularDescription(conciseStructureName, conciseWeatherName, durationText, intent, defense, warmth, amenities, pet, soundKeywords, threatName, 'Survivor', food);
  const tags = generateTagsMatrix(conciseStructureName, conciseWeatherName, intent);

  let motionInstructions = "";
  // UPDATE LOGIC TO MATCH NEW IDs
  const isSideCutaway = cameraMove?.id === 'cam_cutaway_side';
  const isIsometric = cameraMove?.id === 'cam_cutaway_iso' || cameraMove?.id === 'cam_isometric';

  // --- MODE SPECIFIC LOGIC ---
  if (isVehicleMode) {
      if (structure.id.includes('water')) {
          motionInstructions = `MOTION: The vessel is SAILING. ${isSideCutaway ? 'Profile view of the ship moving left to right.' : 'Bow cutting the waves.'} VIEW: ${isSideCutaway ? 'Split level: Water below, Sky above. Straight horizon.' : 'Horizon line tilted.'} CUTAWAY: Show the hull below waterline and living quarters above.`;
      } else if (structure.id.includes('air')) {
          motionInstructions = `MOTION: The aircraft is IN FLIGHT. ALTITUDE: High above the ground. CUTAWAY: Fuselage cross-section. ${isSideCutaway ? 'VIEW: Perfect profile view of the plane interior.' : ''}`;
      } else { // Land
          let layoutInstruction = "STRUCTURAL LAYOUT: Two distinctly separated zones.";
          if (isDoubleDecker) {
             layoutInstruction += " VERTICAL SPLIT: Level 1 (Bottom) has the Driver Cab at the very front. Level 2 (Top) is PURELY living space/bedroom. NO DRIVER ON TOP FLOOR. NO STEERING WHEEL ON TOP FLOOR.";
          } else {
             layoutInstruction += " HORIZONTAL SPLIT: Front Room = Driver Cockpit. Back Room = Living Quarters.";
          }
          motionInstructions = `MOTION: The vehicle is DRIVING. ${layoutInstruction} SEPARATED BY A SOLID WALL/PARTITION. The driver is strictly in the LOWER FRONT cockpit.`;
      }
  } else if (isBunkerMode) {
      motionInstructions = `NO WINDOWS: There are NO windows to the outside world. LIGHTING: Strictly artificial warm lighting (Grow lights, lamps). No sunlight. ATMOSPHERE: Claustrophobic but safe.`;
  } else if (isScenicMode) {
      motionInstructions = `VIEW: Huge floor-to-ceiling windows or open terrace looking at nature. NO VEHICLES: This is a static building rooted in the ground.`;
  } else if (semiOpen) {
      motionInstructions = `VIEW: Open Air. One side is completely open to the elements, protected only by a roof overhang. Rain blowing near the opening.`;
  }

  const weatherDescription = weatherItems.length > 0 ? weatherItems.map(i => i.value).join(' combined with ') : 'stormy weather';
  const drynessConstraint = "INTERIOR FLOOR MUST BE DRY. Rain/Snow is strictly OUTSIDE the window/opening.";
  
  // NEW: Combine Gender and Action for prompt with Multi-Character Support
  const characterDescriptions = actionItems.map((item, index) => {
      // Direct pass for Couple
      if (item.id === 'act_sleep_couple') return item.value;

      // First character respects the Gender selection.
      // Subsequent characters (if multiple actions selected) get randomized gender.
      let specificGender = gender;
      if (index > 0) {
          specificGender = Math.random() > 0.5 ? 'Man' : 'Woman';
      }
      return getCharacterMotion(specificGender, item.id);
  });

  // DRIVER LOGIC INJECTION
  // If we are in a Land Vehicle, we MUST have a driver visible in the cockpit.
  const needsDriver = isVehicleMode && !structure.id.includes('water') && !structure.id.includes('air');
  
  let familyContext = "";
  
  // CHARACTER LOGIC REFINEMENT (Prevents distortion)
  // If shot is too wide, handle characters carefully.
  const isWideShot = lensDistance?.id === 'dist_long' || lensDistance?.id === 'dist_ext_wide' || lensDistance?.id === 'dist_drone_45' || lensDistance?.id === 'dist_overhead';
  
  if (characterDescriptions.length > 0) {
      // FORCE MEDIUM SHOT for characters if they are main subject, OR hide details if wide
      if (isWideShot) {
          familyContext = `[PASSENGERS] ${characterDescriptions.join(' + ')}. Note: Figures are small in frame (Silhouette Only, No Facial Details, Natural Poses).`;
      } else {
          familyContext = `[PASSENGERS] ${characterDescriptions.join(' + ')}. Located in the COZY LIVING AREA. (One human character only, medium shot, clear face, simple relaxed pose, anatomically correct body, natural proportions).`;
      }
  } else {
      familyContext = `[PASSENGERS] Empty living area. No humans.`;
  }

  if (needsDriver) {
      familyContext += ` [DRIVER] A professional driver is seated in the FRONT COCKPIT/CAB, holding the steering wheel. The vehicle is being driven.`;
  }

  // --- CONSTRUCT OHNEIL JSON PROMPT ---
  let baseStyle: any = {};
  
  // UPDATED: Handle String-based Visual Styles
  let styleDescription = "cinematic 35mm film look";
  let isAnimeStyle = false;

  if (visualStyle && visualStyle.value) {
      // Check if it's the old JSON format or new String format
      if (visualStyle.value.trim().startsWith('{')) {
          try {
              baseStyle = JSON.parse(visualStyle.value);
              styleDescription = baseStyle.style?.aesthetic?.join(', ') || styleDescription;
              const influences = baseStyle.style?.influences || [];
              const aesthetics = baseStyle.style?.aesthetic || [];
              isAnimeStyle = influences.some((i:string) => i.toLowerCase().includes('anime')) || aesthetics.some((a:string) => a.toLowerCase().includes('anime'));
          } catch(e) {
              styleDescription = visualStyle.value; // Fallback
          }
      } else {
          styleDescription = visualStyle.value;
          isAnimeStyle = styleDescription.toLowerCase().includes('anime') || styleDescription.toLowerCase().includes('ghibli');
      }
  } else {
      // Default Base Style
      baseStyle = {
        camera: { framing: "Standard" },
        lighting: { mood: "Cozy" },
        render: { resolution: "8K" }
      };
  }

  let cameraOverrides = {};
  if (isSideCutaway) {
      cameraOverrides = { framing: "FLAT 2D ORTHOGRAPHIC SIDE VIEW (CROSS-SECTION)", angle: "90 degrees perpendicular", lens: "Telephoto (No Distortion)", projection: "Orthographic" };
  } else if (isIsometric) {
      cameraOverrides = { framing: "ISOMETRIC DIORAMA CUTAWAY (3D CROSS SECTION)", angle: "High Angle (45 Degrees)", lens: "Orthographic (No Perspective Distortion)", projection: "Isometric" };
  }

  let subjectText = `${conciseStructureName} interior with ${familyContext}`;
  if (isVehicleMode && (isSideCutaway || isIsometric)) {
      if (isDoubleDecker) {
         subjectText = `Architectural Cross-Section of Double-Decker ${conciseStructureName}. IMPORTANT ZONING: LOWER DECK (Level 1): Front Driver Cab + Kitchen. UPPER DECK (Level 2): PURELY Bedroom. NEGATIVE: NO STEERING WHEEL ON TOP FLOOR.`;
      } else {
         subjectText = `Architectural Cross-Section of ${conciseStructureName}. Front Cab with Driver separated by a wall from Rear Living Space.`;
      }
  }

  const indoorConstraint = "CRITICAL SPATIAL RULE: All 'amenities', 'warmth' (fire/stoves), 'sustenance', 'textures', and 'occupants' MUST be located DEEP INSIDE the covered/sheltered area. They must be DRY and protected from the weather. DO NOT place furniture or firepits on the wet ground outside.";
  
  // GLOBAL NEGATIVE PROMPT (Safety Net)
  const GLOBAL_NEGATIVE = "no visible hands, no disembodied arms, no first-person hands, no extra limbs, no deformed faces, no distorted bodies, no neon, no cyberpunk, no holographic UI, no glitch effects";

  const ohneilPrompt = {
    subject: subjectText,
    style: {
      description: styleDescription, // New flat string field
      mode_specific: [isVehicleMode ? "Vehicle Interior" : "Architecture"]
    },
    camera: { 
        ...baseStyle.camera, 
        ...cameraOverrides, 
        lens_distance: lensDistance?.value || "Medium Shot", 
        camera_movement: cameraMove?.value || "Standard" 
    },
    lighting: { ...baseStyle.lighting, time_of_day: time?.value || "Night", interior_sources: warmth.map(w => getEnglishTerm(w.label)) },
    environment: { location: structure?.value || "Shelter", weather: weatherDescription, threat: threatVisual || "None" },
    subject_details: {
      amenities: amenities.map(a => getEnglishTerm(a.label)),
      sustenance: food.map(f => getEnglishTerm(f.label)), // ADDED
      textures: textures.map(t => getEnglishTerm(t.label)),
      protection: defense.map(d => getEnglishTerm(d.label)),
      companion: pet ? getEnglishTerm(pet.label) : "None",
      occupants: familyContext
    },
    render: {
      ...baseStyle.render,
      additional_notes: [
          motionInstructions, 
          drynessConstraint, 
          securityState, 
          indoorConstraint, 
          GLOBAL_NEGATIVE, // Added Negative Constraints
          isDoubleDecker ? "CRITICAL: The TOP FLOOR is a BEDROOM. It MUST NOT contain a steering wheel." : ""
      ].filter(Boolean)
    }
  };

  const metaInstruction = isAnimeStyle 
    ? `[TASK] Generate an ANIME ART STYLE image based on the JSON description below.`
    : `[TASK] Generate a PHOTOREALISTIC, 8K RAW PHOTOGRAPH based on the JSON configuration below. Treat JSON as camera metadata.`;

  const imagePrompt = `${metaInstruction}\n\n${JSON.stringify(ohneilPrompt, null, 2)}`;

  const thumbnailPrompt = `
[TASK] YouTube Thumbnail. High Contrast.
[SUBJECT] POV from INSIDE the ${conciseStructureName} looking OUT at the storm.
[CONTRAST] Foreground: Warm ${primaryWarmth} light (2700K). Background: Cold ${conciseWeatherName} (6500K).
[COMPOSITION] Cozy interior frame. Rain/Snow on glass.
[EMOTION] Safe, Warm, Dry. "Refuge from the storm".
[TEXT] No text.
  `.trim();

  const verticalThumbnailPrompt = `
[TASK] Vertical Shorts Cover (9:16).
[SUBJECT] Cozy interior of ${conciseStructureName}.
[COMPOSITION] Bottom half: Warm bed/amenities. Top half: Large window with ${conciseWeatherName}.
[VIBE] "Safe vs Scary" contrast.
  `.trim();

  const charMotion = getCharacterMotion(gender, actionId); // Keeps primary motion for I2V default
  const i2vPrompt = `[Camera]: Static. [Internal]: Warm, dry. [Exterior]: ${conciseWeatherName}. [Motion]: ${charMotion}.`;

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
    thumbnailDesign: { textColor: "#FFF", accentColor: "#F00", fontRecommendation: "Impact", layoutTip: "Standard" },
    thumbnailConfig: viralThumbConfig,
    tags,
    analysis,
    audioGuide: [],
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
        if (items.length === 0) return items.slice(0, count).map(i => i.id); 
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(i => i.id);
    };

    // 1. SELECT ONE OF THE 3 BLOCKS
    const block = Math.random();
    let blockId = '';
    
    // Weighting: 40% Vehicles, 30% Shelters, 30% Semi-Open
    if (block < 0.4) blockId = 'cat_vehicles';
    else if (block < 0.7) blockId = 'cat_shelters';
    else blockId = 'cat_semi_open';
    
    s[blockId] = [pick(blockId)]; // Pick one item from the chosen block

    // 2. WEATHER 
    s['weather'] = pickMulti('weather', 2);

    // 3. PERSPECTIVE / CAMERA MOVE
    // Special logic: If vehicle, prefer cutaways.
    s['perspective'] = [pick('perspective', (i) => {
        if (blockId === 'cat_vehicles') return i.id.includes('cam_cutaway') || i.id === 'cam_pov';
        return true;
    })];
    
    // 4. LENS DISTANCE (New)
    s['shot_type'] = [pick('shot_type')];

    // 5. CHARACTERS
    // Randomize Gender
    s['char_gender'] = [Math.random() > 0.5 ? 'gender_male' : 'gender_female'];
    // Randomize Action - Pick 1 or 2 actions for variety
    const actionCount = Math.random() > 0.8 ? 2 : 1; 
    s['character'] = pickMulti('character', actionCount); 

    // 6. FILL REST
    s['time'] = [pick('time')];
    s['defense'] = pickMulti('defense', 1);
    s['warmth'] = pickMulti('warmth', 1);
    
    // FREEZE THREAT: Always default to 'none' (Safe)
    // User must manually select threats if desired.
    s['danger'] = ['none']; 
    
    s['sleeping'] = [pick('sleeping')];
    s['visual_style'] = [pick('visual_style')];
    s['pets'] = [pick('pets')];
    s['npc'] = [pick('npc')];
    s['amenities'] = pickMulti('amenities', 3);
    s['cat_food'] = pickMulti('cat_food', 2); 
    s['textures'] = pickMulti('textures', 2); 
    s['duration'] = [Math.random() > 0.5 ? '2h' : '8h']; 
    
    return s;
};

export const parsePromptToSelections = (promptText: string): SelectionState => {
  const selections: SelectionState = {};
  const lowerPrompt = promptText.toLowerCase();

  CATEGORIES.forEach(cat => {
    const matchedItems = cat.items.filter(item => {
       // Check against ID
       if (lowerPrompt.includes(item.id)) return true;
       
       // Check against English label
       const engLabel = getEnglishTerm(item.label).toLowerCase();
       if (engLabel.length > 3 && lowerPrompt.includes(engLabel)) return true;

       return false;
    });

    if (matchedItems.length > 0) {
        if (cat.type === 'single') {
            selections[cat.id] = [matchedItems[0].id];
        } else {
            selections[cat.id] = matchedItems.map(i => i.id);
        }
    }
  });
  
  return selections;
};
