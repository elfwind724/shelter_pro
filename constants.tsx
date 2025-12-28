
import React from 'react';
import { Shield, Home, Flame, Coffee, Package, CloudLightning, Skull, Bed, Scroll, Clock, Hourglass, Camera, Ruler, Heart, Users, Map, Ghost, Lock, Dog, UserCheck, Armchair, Palette } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  // ========================================================================
  // 1. 世界观与基石 (THE FOUNDATION)
  // ========================================================================
  {
    id: 'structure',
    title: '1. 场景选择 (Location)',
    icon: <Map className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      // --- OCEAN & MARITIME (The Abyss) - OPTIMIZED ---
      { id: 'cruise_ship', label: '幽灵邮轮 (Ghost Liner)', value: 'Interior of a First Class Stateroom on a 1920s vintage Art Deco ocean liner. Key elements: Rows of heavy ROUND BRASS PORTHOLES (not large windows) dripping with condensation. Walls are varnished dark mahogany with brass trim. Furniture is bolted to the floor. The ceiling is low with decorative beams. Outside the thick circular glass, massive dark waves are rolling by. The horizon is tilted. Atmospheric nautical decay, Bioshock aesthetic' },
      { id: 'oil_rig', label: '海上油井 (Oil Rig)', value: 'Interior of a suspended industrial control module on a deep-sea oil rig. Architectural style: High-tech industrial brutalism. Walls are corrugated metal with yellow hazard stripes and peeling rust. Windows are THICK, SLANTED, REINFORCED GLASS with heavy wipers, looking down 100 feet at the churning black ocean. Metal grating floor, hanging chains, red emergency lighting. Heavy rain hammering the steel structure' },
      { id: 'ocean_island', label: '黑沙孤岛 (Black Island)', value: 'Interior of a minimalist concrete bunker embedded into a black basalt cliff face. Architecture: Nordic Brutalist. Frameless horizontal ribbon windows strictly framing the violent surf where white foam hits black volcanic sand. Dark grey slate walls, sheepskin textures, suspended fireplace. The ocean spray hits the glass constantly. Death Stranding atmosphere, isolation' },
      { id: 'submarine', label: '核潜艇 (Submarine)', value: 'Interior of a cramped submarine officer quarters. Curved steel hull walls covered in pipes, valves, and pressure gauges. No windows, but a digital periscope screen showing the stormy surface. Red tactical lighting, narrow bunk, metallic claustrophobia, Das Boot aesthetic' },
      { id: 'lighthouse', label: '孤峰灯塔 (Lighthouse)', value: 'Interior of the lantern room at the top of an old brick lighthouse. 360-degree glass reinforced with heavy iron cage frames. The massive fresnel lens machinery is visible in the center, rotating slowly. Rain lashes against the glass. High altitude view of the storm raging over the dark sea below' },

      // --- NATURE & SEMI-OPEN (The "Terrace" Vibe) ---
      { id: 'cliff_terrace', label: '悬崖露台 (Cliff Terrace)', value: 'interior of a modern cliffside home with massive sliding glass doors opening onto a wet wooden terrace. The terrace extends out into the rain without a roof, collecting puddles and rain splashes. Located at mid-mountain altitude, surrounded by a dense canopy of nature' },
      { id: 'forest_aerie', label: '森林树顶 (Forest Canopy)', value: 'interior of a structure built high into the canopy of massive ancient trees. A large balcony extends out, unprotected from the rain. Rain is dripping heavily from the lush giant leaves and branches onto the balcony floor. View of the deep green forest depth below and thick tree trunks nearby' },
      { id: 'lake_boathouse', label: '湖畔船屋 (Lakeside Boathouse)', value: 'interior of a cozy wooden boathouse right on the water level. Large open cargo doors look out directly onto a misty lake. Rain is hitting the lake surface creating thousands of ripples. Tall reeds, birch trees, and water lilies are visible near the deck. Calm water atmosphere' },
      { id: 'zen_garden', label: '日式缘侧 (Zen Garden)', value: 'interior of a traditional Japanese room looking out through open shoji doors onto a wet Engawa (wooden porch) and a lush mossy garden. Rain drips rhythmically from the tiled roof eaves onto stone basins. Vibrant green maple trees, bamboo, and stone lanterns visible in the rain' },
      { id: 'river_cottage', label: '河谷石屋 (River Cottage)', value: 'interior of a stone cottage situated on a river bank. Large picture window looks out at a rushing river flowing over smooth river stones. Giant weeping willow branches hang down in front of the window, swaying in the rain. Ferns and wet rocks are close by' },
      { id: 'glass_igloo', label: '极光玻璃屋 (Glass Igloo)', value: 'interior of a geodesic glass dome cabin deep in a snowy forest. Floor-to-ceiling triangular glass panels offer a 360-degree view of nature. Warm and safe inside, surrounded by a winter wonderland' },

      // --- HIGH ALTITUDE (Sealed) ---
      { id: 'mountain_peak', label: '山巅哨站 (Mountain Peak)', value: 'high altitude vantage point, interior of a high-tech observation outpost perched on the very tip of a jagged snowy mountain peak. 360-degree panoramic polygon windows looking down at clouds. Surrounded by swirling clouds far below, snow-capped ridges, and aerial views' },
      { id: 'rooftop_garden', label: '摩天楼顶层 (Skyscraper Rooftop)', value: 'extreme height, interior of a fortified luxury penthouse with a glass-enclosed winter garden on the 80th floor. Looking down at the rain falling on the distant city lights glowing dimly in the fog below. Aerial view of a ruined metropolitan skyline' },

      // --- MOVING SANCTUARIES (Travel / LoFi Vibes) ---
      { id: 'rv', label: '末日房车 (Expedition RV)', value: 'interior of a heavy-duty 6x6 expedition vehicle (Unimog style), moving on a muddy road. Cramped but high-tech cockpit, dashboard with navigation systems, quilted insulation on walls, rain drumming on metal roof. The driver is focused on the road' },
      { id: 'truck', label: '重卡座舱 (Semi Truck)', value: 'interior of a massive sleeper semi-truck cabin moving on a highway at night. Dashboard lights glowing with distinct gauges. Spacious sleeper berth visible behind seats. Rain streaking horizontally on windshield. Cozy long-haul trucker vibe' },
      { id: 'train', label: '雪国列车 (Snow Train)', value: 'interior of a fortified armored train cabin moving rapidly through a frozen landscape. Vintage wood paneling, heavy velvet curtains, brass fixtures. View of blurring snow rushing past the window. Rhythmic mechanical vibration' },
      { id: 'night_bus', label: '夜行巴士 (Night Bus)', value: 'interior of a Japanese style night highway bus. Rows of empty plush velvet seats, soft ambient floor lights. Rain streaks moving horizontally across the panoramic windshield. The driver is visible in silhouette handling the wheel. Melancholic travel vibe' },
      { id: 'luxury_jet', label: '私人飞机 (Private Jet)', value: 'interior of a luxury Gulfstream private jet flying through a storm at night. Cream leather seats, walnut wood tables, champagne glass vibrating slightly on the table. Rain freezing on the oval windows. Cockpit door slightly ajar showing pilot instruments' },
      { id: 'yacht', label: '跨海游艇 (Expedition Yacht)', value: 'interior of a reinforced expedition yacht bridge/wheelhouse navigating rough seas. Wipers fighting heavy rain on the slanted reinforced glass. Glowing radar screens. The captain is piloting the wheel. Dark ocean waves crashing outside' },
      { id: 'cyber_taxi', label: '赛博出租 (Cyberpunk Taxi)', value: 'interior of a flying taxi in a futuristic rainy city. Neon lights from skyscrapers streaking past the rain-covered canopy. Holographic dashboard displays. The pilot is navigating through sky traffic. Blade Runner aesthetic' },
      { id: 'spaceship', label: '星际飞船 (Spaceship)', value: 'interior of a long-haul spacesuit cockpit drifting through an asteroid field. Hexagonal reinforced windows. Starfields and rocks floating past. Zero-G floating pen. Silent, sterile, but cozy high-tech safety' },
      { id: 'subway_moving', label: '行驶地铁 (Moving Metro)', value: 'interior of a moving subway car, empty except for the survivor. Tiled tunnel lights flashing past the windows rhythmically. Overhead handles swaying with the motion. Urban isolation' },

      // --- DEEP UNDERGROUND (The Womb) ---
      { id: 'bunker', label: '末日地堡 (Doomsday Bunker)', value: 'professional military-grade concrete bunker, cylindrical curved ceiling, thick blast doors with rotating wheels, air filtration pipes visible, cold concrete softened by rugs, windowless claustrophobic safety' },
      { id: 'air_raid', label: '老式防空洞 (Air Raid Shelter)', value: 'vintage WWII era brick arched air raid shelter tunnel, curved masonry ceiling, long narrow geometry, wooden benches lining the walls converted into shelves, dusty ventilation boxes, warm incandescent bulb lighting, smell of damp earth and history' },
      { id: 'cave', label: '深山岩洞 (Natural Cave)', value: 'massive natural limestone cavern converted into a home, uneven stalactite ceiling, rough hewn rock walls, entrance sealed by a massive improvised steel blast door, primitive but electrified' },
      { id: 'sewer', label: '改造下水道 (Storm Drain)', value: 'massive cylindrical concrete storm drain tunnel (10ft diameter) converted into a base, curved walls, echoing acoustics, steel grate welded over the opening, flowing water channel covered by planks' },
      { id: 'vault', label: '银行金库 (Bank Vault)', value: 'inside a massive circular steel bank vault, walls lined with thousands of safety deposit boxes, metallic floor, main vault door is 3ft thick steel gear mechanism, impenetrable silence' },

      // --- INSTITUTIONAL & PUBLIC (The Stronghold) ---
      { id: 'church', label: '末日教堂 (Fortified Church)', value: 'interior of a grand Gothic cathedral nave, the living space is established up in the raised choir loft (mezzanine) overlooking the empty nave below, stained glass windows reinforced with welded heavy steel rebar grids, the high vantage point provides safety without enclosing the space' },
      { id: 'hospital_ward', label: '废弃医院 (Trauma Center)', value: 'interior of a dark abandoned hospital trauma center, central circular nurses station fortified with overturned metal filing cabinets, surrounding glass-walled ICU isolation rooms, biohazard curtains acting as soft partitions, medical monitors repurposed for security feeds, sterile blue atmosphere softened by warm yellow kerosene lamps' },
      { id: 'library', label: '古老图书馆 (Grand Library)', value: 'grand victorian library hall, two stories of bookshelves reached by rolling ladders, the living space is nestled in the reading nook between two massive oak bookcases, high arched windows boarded up with stacks of hardcover books, leather armchairs, dust motes in light shafts' },
      
      // --- COMMERCIAL & INDUSTRIAL (The Scavenger) ---
      { id: 'supermarket', label: '物资超市 (Supermarket)', value: 'interior of a vast abandoned big-box superstore, high industrial ceiling with exposed ducts, the living area is located in the Manager\'s Office on the mezzanine overlooking the sales floor, huge glass observation window looks down on the aisles of metal shelving, commanding view of the supplies' },
      { id: 'factory', label: '重工废墟 (Heavy Factory)', value: 'vast industrial assembly plant, sawtooth roof with north-facing windows, overhead crane yellow beams, the living quarters are established on the elevated steel catwalks and control platform high above the factory floor, using the height as natural defense, industrial vastness below' },
      { id: 'warehouse_store', label: '仓储中心 (Warehouse)', value: 'interior of a massive abandoned IKEA-style warehouse store, high pallet racks filled with boxes forming a canyon-like maze, the living space is built into the racking system itself like a bunk, high off the ground, surrounded by supplies' },

      // --- RESIDENTIAL & WILDERNESS (The Home) ---
      { id: 'penthouse', label: '顶层豪宅 (High-Rise)', value: 'extreme height luxury penthouse on the 50th floor of a ruined skyscraper, floor-to-ceiling reinforced glass wall looking down 500 feet onto a ruined city shrouded in mist, sleek modern furniture, high altitude isolation' },
      { id: 'cabin', label: '重木小屋 (Log Cabin)', value: 'classic survivalist cabin built with massive 12-inch thick logs, stone foundation, large stone hearth, chinking between logs, heavy wooden shutters bolted shut, deep forest isolation' },
      { id: 'container', label: '集装箱房 (Container)', value: 'two shipping containers stacked and welded together, corrugated metal walls, narrow width, industrial airtight doors, buried halfway into a hillside for insulation' },
      { id: 'treehouse', label: '钢铁树屋 (Treehouse)', value: 'structure suspended high in massive redwood trees, built from scrap metal and airplane parts, swaying gently in wind, rope bridge retracted, camouflage netting' },
    ]
  },
  {
    id: 'weather',
    title: '2. 听感纹理 (Sound & Weather)',
    icon: <CloudLightning className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'light_rain', label: '绵绵细雨 (Light Rain)', value: 'gentle light rain falling softly. Delicate droplets on glass, peaceful atmosphere, grey sky but not dark. Soft tapping sound visuals' },
      { id: 'medium_rain', label: '淅沥中雨 (Medium Rain)', value: 'steady medium rain shower. Consistent rainfall, wet surfaces, classic rainy mood. Grey overcast light' },
      { id: 'rain', label: '倾盆大雨 (Heavy Rain)', value: 'heavy intense rainfall hammering down. Water splashing on surfaces, reduced visibility, dramatic atmosphere' },
      { id: 'thunder', label: '雷暴轰鸣 (Thunderstorm)', value: 'violent thunderstorm with heavy rain. Lightning flashes illuminating the dark clouds, dramatic contrast' },
      { id: 'rain_lush', label: '森林暴雨 (Lush Rain)', value: 'heavy torrential rain pouring down on a lush green forest. Vibrant wet leaves, mossy rocks, and ferns are visible through the window/terrace. The atmosphere is wet and green. Nature is thriving in the storm' },
      { id: 'light_snow', label: '静谧飘雪 (Light Snow)', value: 'gentle light snowflakes falling slowly. Peaceful silence, soft white blanket forming, magical winter atmosphere' },
      { id: 'heavy_snow', label: '鹅毛大雪 (Heavy Snow)', value: 'heavy dense snowfall, large flakes, winter wonderland, accumulating fast on the window ledges' },
      { id: 'blizzard', label: '极寒风暴 (Blizzard)', value: 'whiteout blizzard conditions, horizontal snow driven by high winds, freezing cold atmosphere, zero visibility' },
      { id: 'fog', label: '迷雾风声 (Fog & Wind)', value: 'thick mysterious white fog clinging to the trees. Trees swaying in the wind, leaves rustling, high humidity, water dripping from condensation, quiet and eerie' },
      { id: 'wind', label: '呼啸狂风 (Howling Wind)', value: 'hurricane force winds bending trees outside, debris flying, howling wind visuals without heavy rain' },
      { id: 'acid', label: '腐蚀酸雨 (Acid Rain)', value: 'corrosive green acid rain burning the landscape, yellow toxic fumes, dystopian atmosphere' },
      { id: 'solar', label: '太阳风暴 (Solar Flare)', value: 'blinding bright solar flare radiation storm outside, harsh shadows, magnetic interference visual' },
    ]
  },
  {
    id: 'time',
    title: '3. 时间光影 (Time)',
    icon: <Clock className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'night', label: '漆黑深夜 (Pitch Black)', value: 'pitch black night, zero ambient light outside, only interior warmth visible' },
      { id: 'moonlight', label: '皓月当空 (Full Moon)', value: 'cold silver moonlight illuminating the landscape, eerie blue shadows, sharp contrast' },
      { id: 'floodlight', label: '工业泛光 (Floodlight)', value: 'harsh artificial halogen floodlight illuminating the rain in a specific cone, rest is pitch black, industrial safety feel' },
      { id: 'emergency', label: '警报红光 (Emergency Red)', value: 'rotating emergency red warning lights creating a tense but secure atmosphere, submarine mode' },
      { id: 'morning', label: '清晨微光 (Blue Hour)', value: 'early morning blue hour, cold light, frost on windows, peaceful silence' },
      { id: 'noon', label: '阴霾正午 (Overcast)', value: 'diffused flat daylight, grey overcast sky, gloomy atmosphere, soft shadows' },
      { id: 'toxic', label: '辐射绿光 (Toxic Glow)', value: 'sickly green bioluminescent environmental glow, radioactive atmosphere' },
    ]
  },
  {
    id: 'danger',
    title: '4. 潜在威胁 (Threats)',
    icon: <Skull className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'none', label: '绝对隔离 (Safe)', value: 'no visible threats, pure isolation' },
      { id: 'zombies', label: '丧尸围城 (Horde)', value: 'distant silhouettes of a zombie horde, slow moving shapes in the fog' },
      { id: 'wildlife', label: '荒野狼群 (Wolves)', value: 'glowing eyes of wolves visible in the tree line, primal nature threat' },
      { id: 'drones', label: '巡逻无人机 (Drones)', value: 'futuristic security drones scanning with red laser beams outside' },
      { id: 'aliens', label: '外星巨塔 (Tripods)', value: 'massive alien tripod machine silhouette in the far distance, war of the worlds vibe' },
      { id: 'shadows', label: '不可名状 (Shadows)', value: 'mysterious shadow figures that vanish when looked at directly, paranormal vibe' },
    ]
  },

  // ========================================================================
  // 2. 防御与隔离 (THE SHIELD) - 核心卖点
  // ========================================================================
  {
    id: 'defense',
    title: '5. 硬核防御 (Defense)',
    icon: <Shield className="w-4 h-4" />,
    type: 'multi',
    required: true,
    items: [
      { id: 'iron_door', label: '重型铁门 (Iron Door)', value: 'massive rusted blast-proof solid iron door, shut tight, triple deadbolt locked, no way in' },
      { id: 'airlock', label: '气闸舱门 (Airlock)', value: 'circular heavy pressure airlock door, closed and sealed, rotating locking mechanism engaged' },
      { id: 'bulkhead', label: '耐压舱门 (Bulkhead)', value: 'heavy industrial watertight bulkhead door with a rotating locking wheel, submarine style, hermetically sealed' },
      { id: 'turret', label: '自动炮台 (Sentry Turret)', value: 'automated twin-barrel sentry turret mounted on the terrace railing, scanning the perimeter with a green laser sight, high-tech defense' },
      { id: 'glass_dome', label: '装甲天顶 (Armored Glass Dome)', value: 'massive reinforced glass skylight/dome overhead, allowing full view of the sky but completely bulletproof' },
      { id: 'bars', label: '防暴格栅 (Security Bars)', value: 'viewport reinforced with heavy cross-hatched steel prison grid bars' },
      { id: 'shutters', label: '装甲百叶 (Armored Shutters)', value: 'heavy mechanical metal security shutters, lowered to cover half the window' },
      { id: 'blast_glass', label: '防弹玻璃 (Ballistic Glass)', value: '4-inch thick multi-layered green-tinted bulletproof glass, distinct layers visible' },
      { id: 'fence', label: '通电铁网 (Electric Fence)', value: 'perimeter high-voltage electric barbed wire fence visible outside, humming with power' },
      { id: 'camera', label: '监控探头 (CCTV Cam)', value: 'security camera mounted on wall with blinking red LED, motion sensor active' },
    ]
  },

  // ========================================================================
  // 3. 核心生活区 (THE CORE) - 家的定义
  // ========================================================================
  {
    id: 'warmth',
    title: '6. 温暖火源 (Hearth)',
    icon: <Flame className="w-4 h-4" />,
    type: 'multi',
    required: true,
    items: [
      { id: 'fireplace', label: '开放壁炉 (Open Fireplace)', value: 'large stone fireplace with a massive roaring, crackling open fire, intense orange light' },
      { id: 'stove', label: '可视铸铁炉 (Glass Stove)', value: 'heavy cast iron wood stove with a clean glass door revealing intense dancing flames inside' },
      { id: 'barrel', label: '油桶火炉 (Burn Barrel)', value: 'rusted 55-gallon oil drum converted into a stove, fire raging inside, industrial improvised feel' },
      { id: 'diesel_heater', label: '柴油暖风 (Diesel Heater)', value: 'compact Webasto style diesel heater control unit with a red digital display, emitting a cozy warm air, safe sealed heating system' },
      { id: 'hologram', label: '全息火焰 (Holo-Fire)', value: 'high-tech holographic screen displaying a looping video of a fireplace, providing psychological warmth without smoke' },
      { id: 'reactor', label: '核心余热 (Core Glow)', value: 'shielded power core unit pulsating with a gentle warm orange radiation light, heating the cabin' },
      { id: 'candles', label: '大量蜡烛 (Candle Sea)', value: 'hundreds of beeswax candles creating a warm sanctuary glow everywhere' },
      { id: 'oil_lamp', label: '复古油灯 (Oil Lanterns)', value: 'vintage kerosene lanterns hanging and casting warm protective shadows' },
      { id: 'heater', label: '电暖器 (Space Heater)', value: 'industrial electric heater glowing bright orange coils, heat waves visible' },
    ]
  },
  {
    id: 'sleeping',
    title: '7. 睡眠巢穴 (The Nest)',
    icon: <Bed className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'corner_bed', label: '角落厚床 (Corner Nest)', value: 'thick mattress on a raised wooden bed frame pushed into a safe corner, piled high with heavy duvet and pillows, safe haven' },
      { id: 'canopy', label: '床幔包裹 (Canopy Bed)', value: 'bed enclosed in thick heavy fabric curtains creating a room within a room, private sanctuary' },
      { id: 'bunk', label: '嵌入式床 (Built-in Bunk)', value: 'cozy sleeping alcove built into the wall with storage underneath, secure and tight' },
      { id: 'floor_mat', label: '地铺重力被 (Floor Pallet)', value: 'japanese style futon on raised pallet, covered in weighted anxiety blankets and furs' },
      { id: 'hammock', label: '重型吊床 (Hammock)', value: 'sturdy canvas hammock suspended with heavy chains, filled with sheepskins' },
      { id: 'car_seat', label: '放倒座椅 (Reclined Seat)', value: 'driver seat reclined all the way back, turned into a makeshift bed with sleeping bags' },
      { id: 'hospital_bed', label: '医院病床 (Hospital Bed)', value: 'vintage iron hospital bed with wheels locked, piled with non-medical cozy wool blankets' },
      
      // NEW ADDITIONS
      { id: 'window_nook', label: '窗边卧榻 (Window Nook)', value: 'deep cushioned window seat alcove built directly into the glass wall, rain is inches away from the pillow, ultimate rain immersion' },
      { id: 'indoor_tent', label: '室内帐篷 (Indoor Fort)', value: 'a camping tent pitched inside the room, unzipped to show a cozy nest of glowing lanterns and sleeping bags inside, double protection' },
      { id: 'bathtub', label: '浴缸枕海 (Bathtub Nest)', value: 'vintage clawfoot bathtub filled with blankets and pillows instead of water, creating a porcelain womb, extremely safe and enclosed' },
      { id: 'loft_bed', label: '高架阁楼 (Loft Platform)', value: 'sleeping platform high up near the ceiling rafters reached by a wooden ladder, overlooking the safety of the room below' },
      { id: 'suspended_net', label: '悬浮网床 (Cargo Net)', value: 'heavy-duty cargo net suspended tautly across a ceiling void, filled with pillows, floating in the air' },
      { id: 'cryo_pod', label: '休眠舱 (Cryo Pod)', value: 'sleek sci-fi hibernation capsule with glass cover open, glowing blue interior light, sterile and futuristic comfort' },
      { id: 'sofa_island', label: '沙发岛屿 (Sofa Island)', value: 'massive modular sectional sofa pushed together to form a giant square bed island in the center of the room, surrounded by supplies' },
      { id: 'tatami_raised', label: '榻榻米地台 (Raised Tatami)', value: 'raised wooden platform with authentic tatami mats, minimal futon, zen aesthetic' },
    ]
  },

  // ========================================================================
  // 4. 生命与陪伴 (THE LIFE)
  // ========================================================================
  {
    id: 'character',
    title: '8. 人物动作 (Action Loops)',
    icon: <UserCheck className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: 'POV: 无人 (Immersive)', value: 'no humans, empty room, first person view' },
      { id: 'cooking_stew', label: '搅拌热汤 (Cooking Stew)', value: 'Back view of a survivor standing at the stove/hearth, slowly stirring a steaming pot of stew with a wooden spoon. Relaxed posture, focused on the food. Steam rising rhythmically. Homey atmosphere' },
      { id: 'retro_gaming', label: '复古游戏 (Retro Gaming)', value: 'A survivor sitting on the floor rug, back to camera, playing a vintage game console on a small CRT TV. The blue light from the screen flickers on their silhouette. Relaxed gaming posture' },
      { id: 'playing_cards', label: '双人牌局 (Playing Cards)', value: 'Two survivors sitting opposite each other at a low table, playing cards. Focus on the table and hands. One is dealing cards, the other holding a hand. Quiet social moment, faces in shadow' },
      { id: 'polishing_gear', label: '擦拭装备 (Maintenance)', value: 'A survivor sitting in an armchair, slowly polishing a rifle or a helmet with a cloth. Methodical, rhythmic motion. Sense of preparation and care. Tools spread on the table' },
      { id: 'reading_nook', label: '窗边阅读 (Reading)', value: 'A survivor sitting in the window nook, holding a hardcover book. Soft light from the window illuminates the page. Occasional page turn. Peaceful intellectual vibe' },
      { id: 'writing_diary', label: '书写日记 (Journaling)', value: 'Close up on a survivor sitting at a desk, writing in a leather-bound journal with a pen. Hand moving across the paper. Recording the days events. Introspective vibe' },
      { id: 'knitting', label: '编织毛衣 (Knitting)', value: 'Close up on hands knitting a thick wool blanket or scarf. Rhythmic clicking of needles. Cozy domestic vibe, creating warmth' },
      { id: 'guitar_strum', label: '弹奏吉他 (Guitar)', value: 'A figure sitting on the rug gently strumming an acoustic guitar (visual only, imply sound). Head down, lost in music. Relaxed posture' },
      { id: 'window_trace', label: '触碰雨滴 (Window Trace)', value: 'Silhouette of a person leaning against the glass, tracing the path of a raindrop with their finger. Melancholic and contemplative pose. Connection with the storm' },
      { id: 'cat_petting', label: '撸猫 (Petting Cat)', value: 'A survivor sitting on the sofa with a cat in their lap, rhythmically stroking the cats fur. The cat is sleeping. Pure stress relief' },
    ]
  },
  {
    id: 'pets',
    title: '9. 动物伙伴 (Companions)',
    icon: <Dog className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '无宠物 (None)', value: '' },
      // DOGS
      { id: 'dog', label: '金毛犬 (Golden Retriever)', value: 'loyal golden retriever in deep unconscious sleep on a thick rug, completely motionless body' },
      { id: 'shiba', label: '柴犬 (Shiba Inu)', value: 'cute Shiba Inu curled up in a donut bed, eyes closed, deep sleep, motionless' },
      { id: 'corgi', label: '柯基 (Corgi)', value: 'fluffy Corgi splooting flat on the rug near the heater, eyes closed, fast asleep' },
      { id: 'samoyed', label: '萨摩耶 (Samoyed)', value: 'large white fluffy Samoyed dog sleeping like a cloud, eyes closed tight, peaceful deep sleep' },
      { id: 'husky', label: '哈士奇 (Husky)', value: 'Siberian Husky curled up into a ball on the rug, tail covering nose, deep sleeping, motionless' },
      { id: 'gsd', label: '德牧 (German Shepherd)', value: 'German Shepherd lying on side, eyes closed, in deep deep sleep, paws twitching slightly in dream' },
      { id: 'rottweiler', label: '罗威纳 (Rottweiler)', value: 'large Rottweiler sleeping heavily on its back, legs in the air, belly exposed, trusting and safe deep sleep' },
      { id: 'bernese', label: '伯恩山犬 (Bernese Mtn)', value: 'massive gentle Bernese Mountain Dog sleeping heavily like a bear rug, motionless, eyes closed' },
      { id: 'duo_dogs', label: '双犬护卫 (Two Dogs)', value: 'two large dogs (a Labrador and a Husky) sleeping back-to-back near the heat, both fast asleep' },
      
      // CATS
      { id: 'cat', label: '橘猫 (Fat Cat)', value: 'fluffy fat cat curled up tight sleeping next to heat, face tucked in tail, motionless' },
      { id: 'mainecoon', label: '缅因巨猫 (Maine Coon)', value: 'gigantic Maine Coon cat sprawled out sleeping on the highest furniture, long fur draped over edge, deep sleep' },
      { id: 'black_cat', label: '黑猫 (Black Cat)', value: 'sleek black cat curled into a ball on the windowsill, asleep, looking like a black void' },
      { id: 'cat_dog', label: '猫狗双全 (Cat & Dog)', value: 'a dog and a cat sleeping curled up together in a pile of fur, interlocked harmony, deep sleep' },
      
      // WILD / EXOTIC
      { id: 'bunny', label: '垂耳兔 (Lop Bunny)', value: 'small fluffy lop-eared rabbit sleeping inside a hay basket, eyes closed, nose still' },
      { id: 'fox', label: '驯化狐狸 (Pet Fox)', value: 'red fox curled up in a perfect circle on the armchair, big tail covering nose, deep sleep' },
      { id: 'raccoon', label: '干脆面 (Raccoon)', value: 'chubby raccoon sleeping inside a wooden crate, paws tucked under chin, eyes closed tight' },
      { id: 'owl', label: '猫头鹰 (Owl)', value: 'great horned owl perched on a high rafter, head tucked into chest feathers, eyes closed, sleeping profoundly' },
    ]
  },
  {
    id: 'npc',
    title: '10. 背景守护 (Safety Bloom)',
    icon: <Users className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '绝对独处 (Alone)', value: '' },
      { id: 'npc_copilot', label: '副驾驶 (Co-Pilot)', value: 'a companion in the adjacent seat checking a large paper map, soft silhouette' },
      { id: 'npc_family', label: '后排家人 (Family)', value: 'blurred shapes of family members sleeping or talking quietly in the background, domestic safety' },
      { id: 'npc_tactical', label: '护卫小队 (Tactical)', value: 'silhouettes of a tactical team in the background, keeping watch, soft focus' },
    ]
  },

  // ========================================================================
  // 5. 氛围与细节 (THE VIBE)
  // ========================================================================
  {
    id: 'amenities',
    title: '11. 物资与软装 (Amenities)',
    icon: <Package className="w-4 h-4" />,
    type: 'multi',
    items: [
      // DRINKS & FOOD (The Comfort)
      { id: 'tea_set', label: '热茶套组 (Steaming Tea)', value: 'In the foreground, a low wooden table with a steaming ceramic teapot and delicate cups, hot white steam rising vigorously' },
      { id: 'coffee', label: '手冲咖啡 (Pour-over)', value: 'Close-up on a glass chemex coffee maker and a ceramic mug with fresh dark coffee steaming on the side table' },
      { id: 'cocoa', label: '热可可 (Hot Cocoa)', value: 'Mug of hot chocolate topped with marshmallows and whipped cream, steam rising, cozy winter vibe' },
      { id: 'whiskey', label: '威士忌 (Whiskey)', value: 'Crystal glass with amber whiskey and a large ice cube, vintage bottle next to it, cigar smoke in ashtray' },
      { id: 'wine_cheese', label: '红酒芝士 (Wine & Cheese)', value: 'Bottle of red wine breathing in a decanter, glass of wine, wooden board with artisanal cheese and grapes' },
      { id: 'ramen', label: '豚骨拉面 (Ramen)', value: 'Steaming bowl of Tonkotsu ramen with soft boiled egg, chashu pork and nori, chopsticks resting on bowl, comfort food' },
      { id: 'burger', label: '汉堡套餐 (Burger Meal)', value: 'Juicy cheeseburger with fries on a tray, greaseproof paper, soda bottle, american diner vibe' },
      { id: 'pizza', label: '披萨派对 (Pizza)', value: 'Open cardboard pizza box with hot cheesy pepperoni pizza slices, soda cans, modern comfort' },
      { id: 'sushi', label: '豪华刺身 (Sushi)', value: 'Platter of fresh premium sushi and sashimi, soy sauce dish, wasabi, elegant contrast to storm' },
      { id: 'cooking_pot', label: '炖锅料理 (Stew Pot)', value: 'Heavy cast iron dutch oven hanging over the fire, bubbling beef stew, steam and aroma visual' },
      { id: 'bakery', label: '烘焙面包 (Bakery)', value: 'Basket of fresh sourdough bread and croissants, flour dusting on table, butter dish' },

      // HOBBIES & TECH (The Distraction)
      { id: 'radio', label: 'LoFi电台 (LoFi Radio)', value: 'Vintage tube radio glowing orange, frequency dial lit up, playing low fidelity jazz beats' },
      { id: 'vinyl', label: '黑胶唱机 (Vinyl Player)', value: 'Vintage turntable spinning a black vinyl record, needle arm on the groove, album covers stacked nearby' },
      { id: 'typewriter', label: '打字机 (Typewriter)', value: 'Antique mechanical typewriter with a half-written page, ink ribbon, crumpled paper balls' },
      { id: 'gaming_setup', label: '复古游戏 (Retro Gaming)', value: 'Small CRT TV glowing with pixel art game, vintage game console controller on the table, 8-bit vibe' },
      { id: 'laptop', label: '黑客笔电 (Cyber Deck)', value: 'Rugged military laptop with code scrolling on screen, cables connected to hard drives, cyber deck vibe' },
      { id: 'telescope', label: '望远镜 (Telescope)', value: 'Brass telescope mounted on a tripod pointed out the window, star charts and compass on table' },
      { id: 'painting', label: '油画架 (Easel)', value: 'Artist easel with a half-finished oil painting of the storm outside, palette with wet paint, brushes' },
      { id: 'guitar', label: '吉他 (Guitar)', value: 'Acoustic guitar leaning against the armchair, worn wood texture, music sheet on stand' },
      { id: 'books', label: '书籍堆积 (Book Piles)', value: 'Stacks of old leather-bound books, maps and open journals filling every available surface' },

      // DECOR & ATMOSPHERE (The Mood)
      { id: 'salt_lamp', label: '盐灯 (Salt Lamp)', value: 'Himalayan pink salt lamp glowing with a warm diffuse orange light, calming ionization vibe' },
      { id: 'fairy_lights', label: '串灯 (Fairy Lights)', value: 'String of warm white fairy lights draped across the ceiling and shelves, magical bokeh effect' },
      { id: 'dreamcatcher', label: '捕梦网 (Dreamcatcher)', value: 'Intricate dreamcatcher with feathers hanging near the window, swaying gently' },
      { id: 'rugs', label: '波斯地毯 (Persian Rugs)', value: 'Layers of vintage persian rugs covering the cold floor, rich red and patterned textures' },
      { id: 'plants', label: '室内绿植 (Plants)', value: 'Potted monstera and fern plants growing under purple grow-lights, vibrant green life' },
      { id: 'tech', label: '监控屏幕 (Monitors)', value: 'Stack of glowing CRT security monitors showing green night-vision feeds of the exterior' },
      { id: 'ammo', label: '弹药箱 (Ammo Crates)', value: 'Heavy green metal military ammo crates stacked in the corner, sense of preparedness' },
    ]
  },

  // ========================================================================
  // 6. 镜头语言 (THE LENS)
  // ========================================================================
  {
    id: 'perspective',
    title: '12. 镜头视角 (Perspective)',
    icon: <Camera className="w-4 h-4" />,
    type: 'single',
    required: false,
    items: [
      { id: 'standard', label: '标准客观 (Standard View)', value: 'Cinematic standard objective view' },
      { id: 'first_person', label: '沉浸主观 (First-Person)', value: 'First-person POV from a seated position, immersive viewpoint' },
      { id: 'terrace_view', label: '露台视角 (Terrace View)', value: 'View from deep inside the room looking out through open sliding doors onto a wet, rain-soaked terrace. Framing the shelter, the wet deck, and the nature beyond in layers' },
      { id: 'over_shoulder', label: '过肩视角 (Over Shoulder)', value: 'Over-the-shoulder shot from behind the subject, seeing the environment ahead' },
      { id: 'back_seat', label: '后方视角 (Back Room)', value: 'View from the back of the room looking forward through the window, framing the main living area' },
      { id: 'isometric', label: '等轴上帝 (Isometric)', value: 'Isometric orthographic 3D render, diorama style, cutaway ceiling' },
      { id: 'cinematic', label: '电影特写 (Split Diopter)', value: 'Cinematic split-diopter shot, deep depth of field keeping both foreground detail and background storm in sharp focus' },
    ]
  },
  {
    id: 'shot_type',
    title: '13. 镜头距离 (Shot Size)',
    icon: <Ruler className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'extreme_wide', label: '远景/大环境 (Extreme Wide)', value: 'Extreme wide shot establishing the shelter in its vast environment, tiny house in big nature' },
      { id: 'wide_interior', label: '室内全景 (Wide Interior)', value: 'Wide angle interior shot capturing the entire room layout from wall to wall' },
      { id: 'full_shot', label: '全身景 (Full Shot)', value: 'Full shot showing the character or furniture completely from top to bottom within the space' },
      { id: 'cowboy', label: '牛仔景 (Cowboy/American)', value: 'Cowboy shot (American shot), framing from mid-thigh up, perfect for a character sitting in an armchair' },
      { id: 'medium', label: '叙事中景 (Medium Shot)', value: 'Cinematic medium shot, framing the subject from waist up, standard storytelling distance' },
      { id: 'medium_close', label: '近景 (Medium Close-Up)', value: 'Medium close-up, focusing on the upper chest and face, intimate but not claustrophobic' },
      { id: 'close_up', label: '特写 (Close Up)', value: 'Close-up shot, tight framing on the face or specific object, capturing emotions and details' },
      { id: 'extreme_close', label: '微距特写 (Macro)', value: 'Extreme close-up macro shot, focusing on tiny details like raindrops on glass, texture of wool, or steam rising' },
    ]
  },
  
  // ========================================================================
  // 7. 视觉风格 (VISUAL STYLE) - NEW
  // ========================================================================
  {
    id: 'visual_style',
    title: '14. 视觉风格 (Visual Style)',
    icon: <Palette className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'davinci_grade', label: '达芬奇调色 (DaVinci Resolve)', value: 'Color graded in DaVinci Resolve, teal and orange Hollywood look, rich contrast, cinematic skin tones, master quality' },
      { id: 'japanese_wafu', label: '日式清新 (Fuji Superia)', value: 'Shot on Fujifilm Superia 400, Japanese summer aesthetic, slight film grain, fresh and transparent color grading, highlights with lime green tint, airy atmosphere, youthful energy, high key lighting, soft focus, overexposed' },
      { id: 'leica_bw', label: '徕卡黑白 (Leica Monochrome)', value: 'Shot on Leica M11 Monochrom, high contrast black and white photography, rich deep blacks, artistic, emotional, fine art' },
      { id: 'unreal_5', label: '数字拟真 (Unreal Engine 5)', value: 'Unreal Engine 5 Lumen Render, raytracing, clean textures, perfect lighting, commercial game asset quality' },
      { id: 'realistic_8k', label: '极致写实 (Hyper-Realistic)', value: '8k raw photo, shot on Phase One IQ4 150MP, sharp focus, incredibly detailed textures, photorealistic lighting, dSLR quality' },
      { id: 'cinematic_35mm', label: '胶片电影 (Cinematic 35mm)', value: 'Shot on Kodak Portra 400 film, 35mm movie aesthetic, slight film grain, warm analog color grading, cinematic lighting, movie still' },
      { id: 'vhs_tape', label: '复古录像 (VHS Found Footage)', value: '1990s VHS tape aesthetic, slight tracking noise, chromatic aberration, soft focus, found footage vibe, raw and authentic' },
      { id: 'analog_horror', label: '类比恐怖 (Liminal/Analog)', value: 'Liminal space aesthetic, flash photography look, dark corners, unsettling realism, early 2000s digital camera vibe' },
      { id: 'cyber_neon', label: '赛博霓虹 (Cyberpunk Neon)', value: 'Cyberpunk aesthetic, high contrast blue and pink neon lighting, wet surfaces reflecting colored lights, futuristic noir atmosphere' },
      { id: 'vintage_70s', label: '怀旧70年代 (Vintage 70s)', value: '1970s vintage photo aesthetic, warm orange and brown tones, soft hazy lighting, retro furniture look, Kodachrome slide' },
      { id: 'nordic_minimal', label: '北欧冷淡 (Nordic Minimal)', value: 'Scandi minimalist aesthetic, desaturated colors, bright soft white lighting, clean lines, Architectural Digest photography' },
      { id: 'gothic_noir', label: '暗黑哥特 (Gothic Noir)', value: 'Film Noir aesthetic, high contrast chiaroscuro lighting, deep shadows, moody atmosphere, desaturated colors, dramatic' },
      { id: 'anime_makoto', label: '新海诚风 (Anime Art)', value: 'Makoto Shinkai anime art style, 2D/3D hybrid, vibrant emotional skies, exaggerated lighting effects, detailed background art' },
    ]
  },

  // Hidden / Meta Categories
  {
    id: 'vibe',
    title: '情感包装 (Vibe)',
    icon: <Heart className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: 'cozy_travel', label: '旅途白噪 (Travel/LoFi)', value: 'lofi' },
      { id: 'cozy_safe', label: '极致安全 (Cozy/Safe)', value: 'cozy' },
    ]
  },
  {
    id: 'duration',
    title: '时长策略 (Duration)',
    icon: <Hourglass className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: '2h', label: '2 Hours (Test/Focus)', value: '2 Hours' },
      { id: '8h', label: '8 Hours (Deep Sleep)', value: '8 Hours' },
    ]
  },
];

export const SEO_KEYWORDS = {};
