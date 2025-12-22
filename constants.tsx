
import React from 'react';
import { Shield, Home, Flame, Coffee, Package, CloudLightning, Skull, Bed, Scroll, Clock, Hourglass, Camera, Ruler, Heart, Users, Map, Ghost, Lock, Dog, UserCheck, Armchair } from 'lucide-react';
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
    title: '2. 自然天气 (Nature & Weather)',
    icon: <CloudLightning className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      // Rain Intensities
      { id: 'light_rain', label: '绵绵细雨 (Light Rain)', value: 'gentle light rain falling softly. Delicate droplets on glass, peaceful atmosphere, grey sky but not dark. Soft tapping sound visuals' },
      { id: 'medium_rain', label: '淅沥中雨 (Medium Rain)', value: 'steady medium rain shower. Consistent rainfall, wet surfaces, classic rainy mood. Grey overcast light' },
      { id: 'rain', label: '倾盆大雨 (Heavy Rain)', value: 'heavy intense rainfall hammering down. Water splashing on surfaces, reduced visibility, dramatic atmosphere' },
      { id: 'thunder', label: '雷暴轰鸣 (Thunderstorm)', value: 'violent thunderstorm with heavy rain. Lightning flashes illuminating the dark clouds, dramatic contrast' },
      
      // Nature Combos
      { id: 'rain_lush', label: '森林暴雨 (Lush Rain)', value: 'heavy torrential rain pouring down on a lush green forest. Vibrant wet leaves, mossy rocks, and ferns are visible through the window/terrace. The atmosphere is wet and green. Nature is thriving in the storm' },
      
      // Snow Intensities
      { id: 'light_snow', label: '静谧飘雪 (Light Snow)', value: 'gentle light snowflakes falling slowly. Peaceful silence, soft white blanket forming, magical winter atmosphere' },
      { id: 'heavy_snow', label: '鹅毛大雪 (Heavy Snow)', value: 'heavy dense snowfall, large flakes, winter wonderland, accumulating fast on the window ledges' },
      { id: 'blizzard', label: '极寒风暴 (Blizzard)', value: 'whiteout blizzard conditions, horizontal snow driven by high winds, freezing cold atmosphere, zero visibility' },
      
      // Others
      { id: 'fog', label: '山林晨雾 (Misty Fog)', value: 'thick mysterious white fog clinging to the trees and landscape. High humidity, water dripping from condensation, quiet and eerie' },
      { id: 'wind', label: '呼啸狂风 (High Wind)', value: 'hurricane force winds bending trees outside, debris flying, howling wind visuals without heavy rain' },
      
      // Disasters (Keep for legacy compatibility)
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
      // Entrances
      { id: 'iron_door', label: '重型铁门 (Iron Door)', value: 'massive rusted blast-proof solid iron door, shut tight, triple deadbolt locked, no way in' },
      { id: 'airlock', label: '气闸舱门 (Airlock)', value: 'circular heavy pressure airlock door, closed and sealed, rotating locking mechanism engaged' },
      { id: 'bulkhead', label: '耐压舱门 (Bulkhead)', value: 'heavy industrial watertight bulkhead door with a rotating locking wheel, submarine style, hermetically sealed' },
      
      // Active Defense (New for Open Areas)
      { id: 'turret', label: '自动炮台 (Sentry Turret)', value: 'automated twin-barrel sentry turret mounted on the terrace railing, scanning the perimeter with a green laser sight, high-tech defense' },
      
      // Windows / Openness
      { id: 'glass_dome', label: '装甲天顶 (Armored Glass Dome)', value: 'massive reinforced glass skylight/dome overhead, allowing full view of the sky but completely bulletproof' },
      { id: 'bars', label: '防暴格栅 (Security Bars)', value: 'viewport reinforced with heavy cross-hatched steel prison grid bars' },
      { id: 'shutters', label: '装甲百叶 (Armored Shutters)', value: 'heavy mechanical metal security shutters, lowered to cover half the window' },
      { id: 'blast_glass', label: '防弹玻璃 (Ballistic Glass)', value: '4-inch thick multi-layered green-tinted bulletproof glass, distinct layers visible' },
      
      // Perimeter
      { id: 'fence', label: '通电铁网 (Electric Fence)', value: 'perimeter high-voltage electric barbed wire fence visible outside, humming with power' },
      
      // Tech
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
      // Standard Combustion (Buildings)
      { id: 'fireplace', label: '开放壁炉 (Open Fireplace)', value: 'large stone fireplace with a massive roaring, crackling open fire, intense orange light' },
      { id: 'stove', label: '可视铸铁炉 (Glass Stove)', value: 'heavy cast iron wood stove with a clean glass door revealing intense dancing flames inside' },
      { id: 'barrel', label: '油桶火炉 (Burn Barrel)', value: 'rusted 55-gallon oil drum converted into a stove, fire raging inside, industrial improvised feel' },
      
      // Vehicle Safe Options (New)
      { id: 'diesel_heater', label: '柴油暖风 (Diesel Heater)', value: 'compact Webasto style diesel heater control unit with a red digital display, emitting a cozy warm air, safe sealed heating system' },
      { id: 'hologram', label: '全息火焰 (Holo-Fire)', value: 'high-tech holographic screen displaying a looping video of a fireplace, providing psychological warmth without smoke' },
      { id: 'reactor', label: '核心余热 (Core Glow)', value: 'shielded power core unit pulsating with a gentle warm orange radiation light, heating the cabin' },
      
      // Ambient
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
    ]
  },

  // ========================================================================
  // 4. 生命与陪伴 (THE LIFE) - 关键修改：存在感策略
  // ========================================================================
  {
    id: 'character',
    title: '8. 人物策略 (Presence Strategy)',
    icon: <UserCheck className="w-4 h-4" />,
    type: 'single',
    items: [
      // STRATEGY A: POV (Immersion)
      { id: 'none', label: 'POV: 无人 (Immersive)', value: 'no humans, empty room, first person view' },
      
      // STRATEGY B: Silhouette (Cinematic)
      { id: 'silhouette', label: '背影/剪影 (Cinematic)', value: 'a mysterious survivor sitting by the window, back turned to the camera, silhouetted against the light' },
      { id: 'driver_focused', label: '专注驾驶 (Driver)', value: 'a focused driver/pilot is visible at the controls, hands on the wheel/yoke, back turned to the camera' },
      
      // STRATEGY C: Passive (Cozy/Safe)
      { id: 'man_sleeping', label: '熟睡 (Passive Sleep)', value: 'a survivor sleeping deeply in the bunk, wrapped in blankets, face hidden, peaceful posture' },
      { id: 'survivor_reading', label: '阅读 (Passive Read)', value: 'a survivor sitting in an armchair reading a book, face obscured by the book, relaxed' },
      { id: 'writer', label: '书写 (Passive Work)', value: 'a survivor writing in a journal at the table, focused on the paper, head down' },
    ]
  },
  {
    id: 'pets',
    title: '9. 动物伙伴 (Companions)',
    icon: <Dog className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '无宠物 (None)', value: '' },
      { id: 'dog', label: '金毛犬 (Golden Retriever)', value: 'loyal golden retriever in deep unconscious sleep on a thick rug, completely motionless body' },
      { id: 'cat', label: '橘猫 (Fat Cat)', value: 'fluffy fat cat curled up tight sleeping next to heat, face tucked in tail' },
      { id: 'gsd', label: '德牧 (German Shepherd)', value: 'alert German Shepherd resting head on paws, watching the door, protective energy' },
      { id: 'rottweiler', label: '罗威纳 (Rottweiler)', value: 'muscular Rottweiler dog sitting calmly near the door, imposing silhouette, absolute loyalty, protective posture' },
      { id: 'bernese', label: '伯恩山犬 (Bernese Mtn)', value: 'massive gentle Bernese Mountain Dog sleeping heavily like a bear rug, tri-color fluffy fur, pure comfort' },
      { id: 'mainecoon', label: '缅因巨猫 (Maine Coon)', value: 'gigantic Maine Coon cat with lion-like mane, resting on the highest furniture, observing the room with majesty' },
      { id: 'duo_dogs', label: '双犬护卫 (Two Dogs)', value: 'two large dogs (a Labrador and a Husky) sleeping back-to-back near the heat, pack safety vibe' },
      { id: 'cat_dog', label: '猫狗双全 (Cat & Dog)', value: 'a dog and a cat sleeping curled up together in a pile of fur, interlocked harmony, ultimate peace' },
      { id: 'cat_window', label: '窗边的猫 (Window Cat)', value: 'cat sitting on the windowsill watching the storm outside, tail twitching' },
    ]
  },
  {
    id: 'npc',
    title: '10. 背景守护 (Safety Bloom)',
    icon: <Users className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '绝对独处 (Alone)', value: '' },
      // FIX: Made neutral
      { id: 'npc_copilot', label: '副驾驶 (Co-Pilot)', value: 'a companion in the adjacent seat checking a large paper map, soft silhouette' },
      // FIX: Made neutral
      { id: 'npc_family', label: '后排家人 (Family)', value: 'blurred shapes of family members sleeping or talking quietly in the background, domestic safety' },
      { id: 'npc_tactical', label: '护卫小队 (Tactical)', value: 'silhouettes of a tactical team in the background, keeping watch, soft focus' },
    ]
  },

  // ========================================================================
  // 5. 氛围与细节 (THE VIBE) - 填充物
  // ========================================================================
  // Activity Category Removed - Merged into Amenities
  {
    id: 'amenities',
    title: '11. 物资与软装 (Amenities)',
    icon: <Package className="w-4 h-4" />,
    type: 'multi',
    items: [
      { id: 'tea_set', label: '热茶套组 (Steaming Tea)', value: 'In the immediate foreground, a small low wooden table is set with a steaming ceramic teapot and delicate cups, hot white steam rising vigorously against the cold background, creating a cozy tea time atmosphere' },
      { id: 'coffee', label: '手冲咖啡 (Pour-over Coffee)', value: 'Close-up focus on a glass chemex coffee maker and a ceramic mug with fresh dark coffee steaming on the side table, distinct aroma of coffee visual' },
      { id: 'cooking_pot', label: '沸腾炖锅 (Bubbling Pot)', value: 'In the center foreground, a heavy cast iron cooking pot is hanging over the fire, bubbling hot food, white steam rising, aroma of spices' },
      { id: 'radio', label: 'LoFi电台 (LoFi Radio)', value: 'Feature a vintage radio with tubes glowing orange on the desk, playing low fidelity jazz beats, static frequency visual' },
      { id: 'map', label: '导航地图 (Nav Map)', value: 'A detailed topographic map or digital navigation screen is spread out on the table, illuminated by dashboard lights' },
      { id: 'feast', label: '盛宴长桌 (Holiday Feast)', value: 'The table is overflowing with abundant hot food, roasted meat, mashed potatoes, red wine bottles, fresh bread, a true survivor\'s feast' },
      { id: 'bakery', label: '新鲜烘焙 (Fresh Bakery)', value: 'Wicker baskets filled with rustic sourdough bread and croissants placed in the foreground, flour dusting the table, warm bakery vibe' },
      { id: 'pizza', label: '披萨派对 (Pizza Stack)', value: 'Stacks of cardboard pizza boxes with hot cheesy pizza and soda bottles on the table, modern comfort food feast' },
      { id: 'sushi', label: '豪华刺身 (Sushi Boat)', value: 'A platter of fresh high-end sushi and sashimi is placed on the table, stark contrast to the apocalypse outside' },
      { id: 'shelves', label: '爆满货架 (Full Shelves)', value: 'Background shelves groaning under the weight of organized canned food and mason jars, zero empty space' },
      { id: 'water', label: '储水桶 (Water Supply)', value: 'Stack of large blue filtered water containers in the corner, reliable hydration' },
      { id: 'ammo', label: '弹药箱 (Ammo Crates)', value: 'Heavy green metal military ammo crates stacked in the corner, sense of preparedness' },
      { id: 'rugs', label: '波斯地毯 (Persian Rugs)', value: 'Layers of vintage persian rugs covering the cold floor, sound dampening' },
      { id: 'books', label: '书籍堆积 (Book Piles)', value: 'Stacks of old books, maps and journals filling every available surface' },
      { id: 'plants', label: '室内绿植 (Plants)', value: 'Potted fern plants and herbs growing under grow-lights, touch of life' },
      { id: 'guitar', label: '吉他 (Guitar)', value: 'Acoustic guitar leaning against the armchair, worn wood texture' },
      { id: 'tech', label: '监控屏幕 (Monitors)', value: 'Glowing security monitors showing green camera feeds of the safe exterior' },
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
      { id: 'medium', label: '叙事中景 (Medium Shot)', value: 'Cinematic medium shot, capturing the cozy living space and the window view' },
      { id: 'medium_close', label: '细节特写 (Close Up)', value: 'Medium close-up, focusing tightly on the foreground elements and rain on the glass' },
      { id: 'wide_interior', label: '广角全景 (Wide Interior)', value: 'Wide angle shot capturing the entire length of the interior living space' },
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
      { id: '8h', label: '8 Hours (Sleep)', value: '8 Hours' },
      { id: '4h', label: '4 Hours (Study)', value: '4 Hours' },
      { id: '2h', label: '2 Hours (Nap)', value: '2 Hours' },
      { id: 'loop', label: '4K Loop', value: '4K Loop' },
    ]
  },
];

export const SEO_KEYWORDS = {};
