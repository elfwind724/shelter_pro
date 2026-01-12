
import React from 'react';
import { Shield, Home, Flame, Coffee, CloudLightning, Skull, Bed, Clock, Hourglass, Camera, Users, Map, Dog, UserCheck, Palette, LayoutTemplate, Car, Anchor, Plane, Building, Tent, Trees, User, UserPlus, Utensils, Layers } from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  // ========================================================================
  // 1. 移动载具 (VEHICLES) - 陆海空
  // ========================================================================
  {
    id: 'cat_vehicles',
    title: '1. 移动载具 (Vehicles)',
    icon: <Car className="w-4 h-4" />,
    type: 'single', // Logically single choice across the 3 location cats (handled in App.tsx)
    required: false,
    items: [
      // --- LAND ---
      { id: 'veh_land_rv_luxury', label: '豪华房车 (Luxury RV)', value: 'ARCHITECTURAL STYLE: Massive Class-A Motorhome (Prevost). INTERIOR: Marble floors, slide-out living room, leather captain chairs. VIEW: Highway rainstorm rushing past large windshield.' },
      { id: 'veh_land_truck', label: '货运卡车 (Semi Truck)', value: 'ARCHITECTURAL STYLE: Peterbilt 389 Truck Cab. INTERIOR: Cozy sleeper berth behind seats, CB radio glowing, quilted leather walls. VIEW: Wipers beating heavy rain on highway night.' },
      { id: 'veh_land_schoolbus', label: '改装校车 (Skoolie)', value: 'ARCHITECTURAL STYLE: Converted Yellow School Bus. INTERIOR: Wood stove pipe, DIY wooden interior, hammock strung across aisle. VIEW: Parked in a forest storm.' },
      { id: 'veh_land_bus_public', label: '夜班公车 (Night Bus)', value: 'ARCHITECTURAL STYLE: City Transit Bus. INTERIOR: Empty seats, neon city lights passing by, reflections on wet floor. VIEW: Urban rain streaks on large side windows.' },
      { id: 'veh_land_train', label: '复古列车 (Vintage Train)', value: 'ARCHITECTURAL STYLE: Art Deco Train Carriage. INTERIOR: Mahogany wood, velvet booth seats, small table lamp. VIEW: Landscape rushing by in a blur of rain/snow.' },
      
      // --- WATER ---
      { id: 'veh_water_yacht_lux', label: '超级游艇 (Super Yacht)', value: 'ARCHITECTURAL STYLE: Modern Super Yacht Main Saloon. INTERIOR: Floor to ceiling glass, white leather sofas, modern art. VIEW: Raging dark ocean waves crashing against the glass.' },
      { id: 'veh_water_yacht_exp', label: '探险游艇 (Expedition Yacht)', value: 'ARCHITECTURAL STYLE: Steel Hull Explorer Vessel. INTERIOR: Functional bridge deck, glowing navigation screens, heavy rain on slanted windows. VIEW: Arctic storm waves.' },
      { id: 'veh_water_ship_med', label: '中型轮船 (Trawler/Ferry)', value: 'ARCHITECTURAL STYLE: Commercial Trawler Wheelhouse. INTERIOR: Brass instruments, steering wheel, coffee mug sliding on table. VIEW: High seas spray hitting the glass.' },
      { id: 'veh_water_cargo', label: '远洋货轮 (Cargo Ship)', value: 'ARCHITECTURAL STYLE: Massive Container Ship Bridge. INTERIOR: Industrial aesthetic, vast space, rain pounding on windows 10 stories high. VIEW: Endless containers and dark ocean.' },
      { id: 'veh_water_cruise', label: '豪华邮轮 (Cruise Ship)', value: 'ARCHITECTURAL STYLE: Cruise Ship Balcony Cabin. INTERIOR: Hotel-style luxury bed, glass sliding door. VIEW: Infinite ocean horizon from high up.' },

      // --- AIR ---
      { id: 'veh_air_boeing', label: '波音客机 (Airliner)', value: 'ARCHITECTURAL STYLE: Empty First Class Cabin 747. INTERIOR: Wide plush seats, ambient cabin lighting, quiet hum. VIEW: Above the clouds, lightning flashing below.' },
      { id: 'veh_air_private', label: '私人飞机 (Private Jet)', value: 'ARCHITECTURAL STYLE: Gulfstream G650. INTERIOR: Cream leather, wood veneer, champagne on table. VIEW: High altitude sunset/storm clouds close up.' },
    ]
  },

  // ========================================================================
  // 2. 实体避难所 (SHELTERS) - 高空/地面/地下
  // ========================================================================
  {
    id: 'cat_shelters',
    title: '2. 实体建筑 (Buildings)',
    icon: <Building className="w-4 h-4" />,
    type: 'single',
    required: false,
    items: [
      // --- HIGH ALTITUDE ---
      { id: 'slt_high_apt', label: '高层公寓 (High-rise Apt)', value: 'ARCHITECTURAL STYLE: Luxury Penthouse Apartment. INTERIOR: Modern minimalist, floor-to-ceiling windows. VIEW: Entire city skyline in heavy rain/fog.' },
      { id: 'slt_high_office', label: '顶层办公室 (Rooftop Office)', value: 'ARCHITECTURAL STYLE: CEO Corner Office at night. INTERIOR: Dark wood desk, leather chair, rain on glass. VIEW: City lights far below.' },
      { id: 'slt_high_cliff', label: '悬崖避难所 (Cliff Shelter)', value: 'ARCHITECTURAL STYLE: Concrete Pod cantilevered off a cliff. INTERIOR: Raw concrete, warm fur rugs. VIEW: Vertigo-inducing drop, fog swirling.' },
      { id: 'slt_high_bar', label: '空中酒吧 (Sky Bar)', value: 'ARCHITECTURAL STYLE: Empty Hotel Sky Bar. INTERIOR: Polished counter, rows of bottles, jazz vibe. VIEW: Rain streaking neon city lights.' },
      { id: 'slt_high_cave', label: '半山腰山洞 (Mountain Cave)', value: 'ARCHITECTURAL STYLE: Natural Cave Entrance high up. INTERIOR: Stone floor, campfire, sleeping bag. VIEW: Valley below shrouded in mist.' },
      { id: 'slt_high_treehouse', label: '高空树屋 (High Treehouse)', value: 'ARCHITECTURAL STYLE: Multi-level Treehouse canopy. INTERIOR: Wooden planks, rope railings, swaying slightly. VIEW: Birds eye view of forest floor.' },
      { id: 'slt_high_hotel', label: '空中花园酒店 (Sky Garden)', value: 'ARCHITECTURAL STYLE: Singapore-style Sky Hotel. INTERIOR: Indoor lush plants, infinity pool edge (covered). VIEW: Futuristic city in rain.' },
      { id: 'slt_high_monastery', label: '悬崖修道院 (Cliff Monastery)', value: 'ARCHITECTURAL STYLE: Stone Monastery carved into rock. INTERIOR: Candles, stone arches, ancient books. VIEW: Sea of clouds.' },
      { id: 'slt_high_lighthouse', label: '灯塔守望 (Lighthouse)', value: 'ARCHITECTURAL STYLE: Lighthouse Lantern Room. INTERIOR: Huge fresnel lens gear, circular iron walkway. VIEW: Raging waves crashing below.' },

      // --- GROUND LEVEL ---
      { id: 'slt_gnd_church', label: '古老教堂 (Church)', value: 'ARCHITECTURAL STYLE: Gothic Stone Church. INTERIOR: Stained glass, wooden pews, candlelight. VIEW: Rain hitting tall arched windows.' },
      { id: 'slt_gnd_supermarket', label: '深夜超市 (Supermarket)', value: 'ARCHITECTURAL STYLE: Abandoned/Closed Supermarket. INTERIOR: Aisles of goods, flickering fluorescent light, sleeping bag in aisle. VIEW: Rain on automatic glass doors.' },
      { id: 'slt_gnd_library', label: '图书馆 (Library)', value: 'ARCHITECTURAL STYLE: Grand Old Library. INTERIOR: Rolling ladders, smell of old paper, reading nook. VIEW: Tall windows with ivy and rain.' },
      { id: 'slt_gnd_police', label: '警察局 (Police Station)', value: 'ARCHITECTURAL STYLE: Noir Detective Office/Station. INTERIOR: Blinds, desk lamp, smoke, case files. VIEW: Rainy city street.' },
      { id: 'slt_gnd_school', label: '空无学校 (School)', value: 'ARCHITECTURAL STYLE: Empty Classroom at night. INTERIOR: Desks, chalkboard, silence. VIEW: Playground in the rain.' },
      { id: 'slt_gnd_hospital', label: '废弃医院 (Hospital)', value: 'ARCHITECTURAL STYLE: Hospital Room. INTERIOR: Clean white bed, medical equipment (off), rain sound. VIEW: Rain on window.' },
      { id: 'slt_gnd_bank', label: '银行金库 (Bank Vault)', value: 'ARCHITECTURAL STYLE: Heavy Steel Vault. INTERIOR: Safety deposit boxes, stacks of cash used as pillow. VIEW: None (Enclosed).' },
      { id: 'slt_gnd_villa', label: '独立别墅 (Luxury Villa)', value: 'ARCHITECTURAL STYLE: Modern Glass Villa. INTERIOR: Huge fireplace, white sofas. VIEW: Private garden in storm.' },
      { id: 'slt_gnd_factory', label: '废弃工厂 (Factory)', value: 'ARCHITECTURAL STYLE: Industrial Loft/Factory. INTERIOR: Brick walls, high iron windows, machinery. VIEW: Rain dripping from leaks.' },
      { id: 'slt_gnd_cinema', label: '电影院 (Cinema)', value: 'ARCHITECTURAL STYLE: Empty Movie Theater. INTERIOR: Red velvet seats, projector beam dust. VIEW: None (Enclosed).' },
      { id: 'slt_gnd_museum', label: '博物馆 (Museum)', value: 'ARCHITECTURAL STYLE: Grand Museum Hall. INTERIOR: Dinosaur bones or statues, echoey silence. VIEW: Skylights with rain.' },
      { id: 'slt_gnd_firestation', label: '消防站 (Fire Station)', value: 'ARCHITECTURAL STYLE: Fire Station Garage. INTERIOR: Red trucks, gear hanging, concrete floor. VIEW: Garage door windows rain.' },

      // --- UNDERGROUND ---
      { id: 'slt_und_subway', label: '废弃地铁 (Subway)', value: 'ARCHITECTURAL STYLE: Tiled Subway Station. INTERIOR: Camp set up on platform, dark tunnel. VIEW: None.' },
      { id: 'slt_und_airraid', label: '防空洞 (Air Raid)', value: 'ARCHITECTURAL STYLE: WWII Tunnel Shelter. INTERIOR: Curved corrugated metal, bunk beds. VIEW: None.' },
      { id: 'slt_und_apt', label: '半地下公寓 (Basement Apt)', value: 'ARCHITECTURAL STYLE: Semi-basement Apartment (Parasite style). INTERIOR: Cluttered, cozy, street level window at top. VIEW: Feet walking by, rain puddles on glass.' },
      { id: 'slt_und_bunker', label: '民防掩体 (Civil Bunker)', value: 'ARCHITECTURAL STYLE: Cold War Concrete Bunker. INTERIOR: Air filtration system, blast doors, canned food shelves. VIEW: None.' },
      { id: 'slt_und_luxbunker', label: '豪华地堡 (Luxury Bunker)', value: 'ARCHITECTURAL STYLE: Survival Condo. INTERIOR: Artificial window screens, fake garden, cinema room. VIEW: Artificial scenery.' },
      { id: 'slt_und_parking', label: '地下车库 (Deep Parking)', value: 'ARCHITECTURAL STYLE: Level B4 Parking Lot. INTERIOR: Concrete pillars, dim lights, echo, tent set up in corner. VIEW: None.' },
      { id: 'slt_und_wine', label: '山下酒窖 (Wine Cave)', value: 'ARCHITECTURAL STYLE: Natural Rock Wine Cave. INTERIOR: Oak barrels, stone walls, candlelight. VIEW: None.' },
      { id: 'slt_und_farm', label: '地下农场 (Und. Farm)', value: 'ARCHITECTURAL STYLE: Hydroponic Bunker Farm. INTERIOR: Purple grow lights, rows of vegetables, hum of pumps. VIEW: None.' },
      { id: 'slt_und_town', label: '地底小镇 (Underground Town)', value: 'ARCHITECTURAL STYLE: Massive Cavern City. INTERIOR: Small buildings inside a cave, glowing lights. VIEW: Cave ceiling.' },
    ]
  },

  // ========================================================================
  // 3. 半开放自然 (SEMI-OPEN) - 露台/庭院/野奢
  // ========================================================================
  {
    id: 'cat_semi_open',
    title: '3. 半开放/自然 (Semi-Open)',
    icon: <Trees className="w-4 h-4" />,
    type: 'single',
    required: false,
    items: [
      // --- TERRACES & DECKS ---
      { id: 'sem_forest_terrace', label: '森林露台 (Forest Terrace)', value: 'ARCHITECTURAL STYLE: Wooden Platform extension with roof eaves. LAYOUT: Three sides open to the forest. INTERIOR: Rugs, lounge chair, string lights protected from rain. VIEW: Heavy rain falling on pine trees inches away.' },
      { id: 'sem_veranda', label: '山腰长廊 (Hill Veranda)', value: 'ARCHITECTURAL STYLE: Long covered porch on a hillside house. LAYOUT: Rocking chairs, blankets, lantern. VIEW: Mist rolling over the valley, distant mountains.' },
      { id: 'sem_cliff_plat', label: '悬崖平台 (Cliff Platform)', value: 'ARCHITECTURAL STYLE: Concrete viewing platform with roof. LAYOUT: Semi-high railings, fire pit near the inner wall. VIEW: Snowstorm swirling in the abyss below.' },
      { id: 'sem_open_pavilion', label: '林中亭 (Open Pavilion)', value: 'ARCHITECTURAL STYLE: Wooden Shelter/Pavilion. LAYOUT: Three walls closed, one wall completely open. INTERIOR: Wooden sleeping platform, sleeping bags. VIEW: Rain falling on the forest floor.' },
      { id: 'sem_lake_pier', label: '湖心亭 (Lake Pavilion)', value: 'ARCHITECTURAL STYLE: Gazebo at end of a pier. LAYOUT: Roof and pillars, open air. INTERIOR: Beanbags, blankets. VIEW: Rain rippling on the lake surface 360 degrees.' },
      { id: 'sem_sea_deck', label: '海边甲板 (Sea Deck)', value: 'ARCHITECTURAL STYLE: Stilt House Deck. LAYOUT: Covered deck over the water. INTERIOR: Hammock, driftwood furniture. VIEW: Waves rolling under the floor.' },
      { id: 'sem_canyon_deck', label: '峡谷观景台 (Canyon Deck)', value: 'ARCHITECTURAL STYLE: Steel cantilever deck. LAYOUT: Roof overhead, glass railings. INTERIOR: Modern outdoor heater, sofa. VIEW: Waterfall opposite, mist rising.' },
      { id: 'sem_roof_garden', label: '屋顶花园 (Roof Garden)', value: 'ARCHITECTURAL STYLE: Urban Rooftop with glass canopy. LAYOUT: Surrounded by potted plants. INTERIOR: Rattan furniture, dry under the glass. VIEW: City rain and gray sky.' },
      { id: 'sem_star_deck', label: '观星台 (Star Deck)', value: 'ARCHITECTURAL STYLE: High altitude wooden deck. LAYOUT: Partial roof, mostly open. INTERIOR: Telescope, heavy furs, fire bowl. VIEW: Milky way or Aurora above.' },
      { id: 'sem_panorama', label: '全景玻璃廊 (Panorama)', value: 'ARCHITECTURAL STYLE: Half-cylinder glass sunroom. LAYOUT: Glass roof and front, wood back wall. INTERIOR: Warm reading nook. VIEW: Immersion in nature.' },
      
      // --- COURTYARDS ---
      { id: 'sem_atrium', label: '天井内院 (Atrium)', value: 'ARCHITECTURAL STYLE: Roman style Atrium. LAYOUT: Four walls of the house surround an open sky center. INTERIOR: Covered walkways with chairs looking at center rain. VIEW: Rain falling into the central pool/garden.' },
      { id: 'sem_corridor', label: '风雨连廊 (Corridor)', value: 'ARCHITECTURAL STYLE: Japanese Engawa or Covered Walkway. LAYOUT: Long roofed path next to a garden. INTERIOR: Sitting on the edge with feet dangling. VIEW: Rain dripping from eaves onto stones.' },
      
      // --- WILD / NATURAL ---
      { id: 'sem_rock_hang', label: '岩石凸棚 (Rock Overhang)', value: 'ARCHITECTURAL STYLE: Natural Stone Shelter. LAYOUT: Massive rock slab overhead, open front. INTERIOR: Campfire, furs, primitive comfort. VIEW: Wild storm outside the cave mouth.' },
      { id: 'sem_leanto', label: '野外棚屋 (Lean-to)', value: 'ARCHITECTURAL STYLE: Bushcraft Lean-to. LAYOUT: Logs and tarp angled against wind. INTERIOR: Pine bough bed, backpack, small fire. VIEW: Deep forest rain.' },
      { id: 'sem_tree_canopy', label: '巨树之下 (Tree Canopy)', value: 'ARCHITECTURAL STYLE: Natural Shelter under massive Evergreen. LAYOUT: Dry circle of needles under low branches. INTERIOR: Lantern, sleeping bag. VIEW: Rain filtering through branches.' },
    ]
  },

  // ========================================================================
  // 4. 听感纹理 (SOUND & WEATHER)
  // ========================================================================
  {
    id: 'weather',
    title: '4. 听感纹理 (Sound & Weather)',
    icon: <CloudLightning className="w-4 h-4" />,
    type: 'multi',
    required: true,
    items: [
      // --- RAIN SERIES ---
      { id: 'wth_rain_light', label: '绵绵细雨 (Light Rain)', value: 'Gentle light rain falling softly. Delicate droplets on glass, peaceful atmosphere, grey sky but not dark. Soft tapping sound visuals.' },
      { id: 'wth_rain_med', label: '淅沥中雨 (Medium Rain)', value: 'Steady medium rain shower. Consistent rainfall, wet surfaces, classic rainy mood. Grey overcast light.' },
      { id: 'wth_rain_heavy', label: '倾盆大雨 (Heavy Rain)', value: 'Heavy intense rainfall hammering down. Water splashing on surfaces, reduced visibility, dramatic atmosphere.' },
      { id: 'wth_rain_thunder', label: '雷暴轰鸣 (Thunderstorm)', value: 'Violent thunderstorm with heavy rain. Lightning flashes illuminating the dark clouds, dramatic contrast.' },
      { id: 'wth_rain_lush', label: '森林暴雨 (Lush Rain)', value: 'Heavy torrential rain pouring down on a lush green forest. Vibrant wet leaves, mossy rocks, and ferns are visible through the window/terrace. The atmosphere is wet and green. Nature is thriving in the storm.' },

      // --- SNOW SERIES ---
      { id: 'wth_snow_med', label: '漫天飞雪 (Medium Snow)', value: 'Heavy dense snowfall, large flakes, winter wonderland, accumulating fast on the window ledges. Soft white silence.' },
      { id: 'wth_snow_blizzard', label: '极寒风暴 (Blizzard)', value: 'Whiteout blizzard conditions, horizontal snow driven by high winds, freezing cold atmosphere, zero visibility. Harsh winter survival vibe.' },

      // --- ATMOSPHERE / WIND ---
      { id: 'wth_wind_breeze', label: '林间微风 (Gentle Breeze)', value: 'Gentle breeze blowing. Trees and plants swaying rhythmically outside, curtains fluttering slightly. Dynamic gentle motion, peaceful atmosphere.' },
      { id: 'wth_autumn', label: '深秋落叶 (Autumn Leaves)', value: 'Golden autumn atmosphere. Orange and red maple leaves falling from trees. Windy, dry crisp cool air. Melancholic beauty.' },
      { id: 'wth_summer', label: '夏日蝉鸣 (Summer Cicadas)', value: 'Mid-summer atmosphere. Intense bright sunlight, heat haze visible. The feeling of a hot lazy afternoon, cicadas buzzing. Lush green vegetation.' },
      { id: 'wth_fog', label: '迷雾风声 (Fog)', value: 'Thick mysterious white fog clinging to the trees. Trees swaying in the wind, leaves rustling, high humidity, water dripping from condensation, quiet and eerie.' },

      // --- SKY / CLEAR ---
      { id: 'wth_sunny', label: '风和日丽 (Sunny)', value: 'Bright clear sunny day. Sharp shadows cast by the sun, sunbeams entering the room. Peaceful nature atmosphere, birds chirping visual vibe.' },
      { id: 'wth_overcast', label: '阴郁多云 (Overcast)', value: 'Grey overcast sky, diffused flat soft lighting. No rain, dry pavement, mood is calm but slightly gloomy. Stillness in the air.' },
      { id: 'wth_cloudy', label: '多云间晴 (Cloudy)', value: 'Partly cloudy sky. Dynamic lighting with sun peaking through large white clouds. Dramatic sky texture, dry and comfortable atmosphere.' },
      { id: 'wth_blue_sky', label: '蓝天白云 (Blue Sky)', value: 'Perfect deep blue sky with fluffy white cumulus clouds. High visibility, crisp and clean atmosphere.' },
    ]
  },

  // ========================================================================
  // 5. 时间光影 (TIME OF DAY)
  // ========================================================================
  {
    id: 'time',
    title: '5. 时间光影 (Time)',
    icon: <Clock className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'time_dawn', label: '黎明破晓 (Dawn)', value: 'Dawn light, just before sunrise. Cool blue tones mixed with faint orange on the horizon. Mist on the ground. Quiet awakening.' },
      { id: 'time_morning', label: '清晨阳光 (Morning)', value: 'Early morning light. Fresh, clean, low angle sun creating long shadows. Bright and energetic.' },
      { id: 'time_noon', label: '正午烈日 (Noon)', value: 'High noon. Harsh overhead lighting, maximum brightness, short shadows. High contrast.' },
      { id: 'time_afternoon', label: '午后慵懒 (Afternoon)', value: 'Lazy afternoon light. Warm, slightly golden, relaxed atmosphere. Sun dipping lower.' },
      { id: 'time_sunset', label: '夕阳西下 (Sunset)', value: 'Golden Hour / Sunset. Intense orange, pink, and purple sky. Dramatic warm lighting, lens flares. Magical atmosphere.' },
      { id: 'time_dusk', label: '傍晚蓝调 (Dusk)', value: 'Blue Hour / Dusk. Just after sunset. Deep rich blue sky, interior lights starting to glow warm. Moody and calm.' },
      { id: 'time_night', label: '深夜静谧 (Deep Night)', value: 'Deep Night. Pitch black sky or moonlit. Focus is on the warm artificial light inside the shelter vs the cold darkness outside.' },
    ]
  },

  // ========================================================================
  // 6. 运镜方式/机位 (CAMERA MOVEMENT/ANGLE) - REFACTORED
  // ========================================================================
  {
    id: 'perspective',
    title: '6. 运镜方式/机位 (Camera Move)',
    icon: <Camera className="w-4 h-4" />,
    type: 'single',
    items: [
      // --- SPECIAL VEHICLE ANGLE ---
      { id: 'cam_back_to_front', label: '车尾向前 (Rear to Front)', value: 'Wide shot from the very back of the living cabin looking forward. The composition must show the bed/living area in the foreground and the Driver Cockpit/Windshield in the distance. Reveals the full depth of the vehicle layout.' },

      // --- ANGLE (STATIC) ---
      { id: 'cam_standard', label: '标准人眼 (Standard)', value: 'Standard view, eye level. Natural human perspective.' },
      { id: 'cam_pov', label: '第一人称 (POV)', value: 'First Person Point of View (POV). Visuals strictly from the eye level. No visible hands. Immersive.' },
      { id: 'cam_cutaway_side', label: '侧剖面图 (Side Cutaway)', value: 'Architectural Side Cutaway View (Cross-Section). Flat 2D profile. Wes Anderson style symmetry.' },
      { id: 'cam_cutaway_iso', label: '3D 剖面 (Isometric Cutaway)', value: 'Isometric 3D Cutaway. Diagonally sliced view showing depth and layout.' },
      { id: 'cam_isometric', label: '等轴测图 (Isometric)', value: 'Isometric view, high angle. Diorama style. Miniature effect.' },
      { id: 'cam_terrace', label: '露台视角 (Terrace View)', value: 'View from the terrace looking out. Back of the room visible.' },
      { id: 'cam_low', label: '低机位 (Low Angle)', value: 'Low angle shot from the floor looking up. Heroic or cozy perspective.' },
      { id: 'cam_cctv', label: '监控视角 (CCTV)', value: 'Security Camera grainy footage. High corner angle. Overlay data.' },
      { id: 'cam_high', label: '高机位俯视 (High Angle)', value: 'High angle shot looking down into the shelter, showing layout and vulnerability.' },
      { id: 'cam_worm', label: '极端仰视 (Worm Eye)', value: 'Extreme low angle from the ground, emphasizing the height of the shelter roof.' },
      { id: 'cam_shoulder', label: '过肩视角 (Over Shoulder)', value: 'Over-the-shoulder shot, looking past the character at the storm outside.' },
      { id: 'cam_peek', label: '主观窥视 (Peeking)', value: 'Peeking view through a crack in the door, bookshelf, or curtain. Secretive vibe.' },
      { id: 'cam_dutch', label: '荷兰倾斜角 (Dutch Angle)', value: 'Dutch Angle, camera tilted 15-30 degrees. Creating a sense of unease or dynamic energy.' },
      { id: 'cam_ground', label: '地面视角 (Ground Level)', value: 'Camera placed directly on the floor rug, looking at the fire or bed. Extremely cozy.' },

      // --- MOVEMENT (DYNAMIC) ---
      { id: 'cam_push', label: '缓慢推近 (Push-in)', value: 'Slow cinematic push-in movement towards the focal point (bed/window).' },
      { id: 'cam_track', label: '水平平移 (Tracking)', value: 'Tracking shot moving sideways parallel to the window or bed.' },
      { id: 'cam_arc', label: '环绕运动 (Arc Shot)', value: 'Slow circular arc shot rotating around the central fire or bed.' },
      { id: 'cam_tilt', label: '俯仰扫描 (Tilt)', value: 'Slow vertical tilt up or down, revealing the height of the shelter.' },
      { id: 'cam_pan', label: '水平摇摄 (Pan)', value: 'Slow horizontal panning shot from the dark corner to the bright window.' },
      { id: 'cam_handheld', label: '手持晃动 (Handheld)', value: 'Subtle handheld camera movement, breathing motion, realistic and raw.' },
      { id: 'cam_drone_dolly', label: '无人机推拉 (Aerial Dolly)', value: 'Drone hovering outside the window, slowly pushing in or pulling out.' },

      // --- COMPOSITION (ARTISTIC) ---
      { id: 'cam_sym', label: '对称构图 (Symmetrical)', value: 'Perfectly symmetrical center-framed composition. Wes Anderson style.' },
      { id: 'cam_frame', label: '框中框 (Frame in Frame)', value: 'Framing the subject through a door frame, window, or natural opening.' },
      { id: 'cam_reflect', label: '反射视角 (Reflection)', value: 'View seen through a reflection in a window, mirror, or water puddle.' },
      { id: 'cam_door', label: '门口回望 (Doorway)', value: 'View standing at the open doorway looking into the safe warm shelter.' },
      { id: 'cam_hall', label: '走廊尽头 (Hallway)', value: 'View from the end of a long dark hallway looking at the lit safe room.' },
    ]
  },

  // ========================================================================
  // 7. 角色身份 (IDENTITY)
  // ========================================================================
  {
    id: 'char_gender',
    title: '7. 角色身份 (Identity)',
    icon: <User className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'gender_male', label: '男生 (Man)', value: 'Man' },
      { id: 'gender_female', label: '女生 (Woman)', value: 'Woman' },
    ]
  },

  // ========================================================================
  // 8. 角色动作 (ACTION)
  // ========================================================================
  {
    id: 'character',
    title: '8. 角色动作 (Action)',
    icon: <UserPlus className="w-4 h-4" />,
    type: 'multi',
    items: [
      // SLEEPING
      { id: 'act_sleep_couple', label: '情侣同睡 (Couple Sleep)', value: 'A loving couple sleeping soundly together in a cozy bed, embracing under thick blankets' }, // NEW
      { id: 'act_sleep_bed', label: '床上熟睡 (Bed Sleep)', value: 'sleeping soundly in a cozy bed' },
      { id: 'act_sleep_sofa_sit', label: '沙发坐睡 (Sofa Nap)', value: 'sleeping while sitting on the sofa' },
      { id: 'act_sleep_sofa_lie', label: '沙发躺睡 (Deep Nap)', value: 'lying asleep on a long sofa' },
      { id: 'act_sleep_floor', label: '地铺熟睡 (Floor Mat)', value: 'sleeping on a thick futon mattress on the floor' },
      
      // LOOPING ACTIONS
      { id: 'act_read', label: '安静看书 (Reading)', value: 'sitting comfortably and reading a book' },
      { id: 'act_cook', label: '炉旁做饭 (Cooking)', value: 'cooking a meal by the stove' },
      { id: 'act_gaze', label: '凝视远方 (Gazing)', value: 'looking out the window at the distance' },
      { id: 'act_laptop', label: '操作电脑 (Laptop)', value: 'working on a laptop at a desk' },
      { id: 'act_tea', label: '喝茶品茗 (Tea)', value: 'sitting and drinking hot tea' },
      { id: 'act_coffee', label: '喝咖啡 (Coffee)', value: 'relaxing and drinking coffee' },
      { id: 'act_alcohol', label: '独酌小酒 (Drink)', value: 'sitting and drinking whiskey/wine' },
      { id: 'act_tv', label: '看电视 (Watching TV)', value: 'sitting on the sofa watching TV' },
      { id: 'act_music', label: '听音乐 (Music)', value: 'sitting with eyes closed listening to music' },
      { id: 'act_draw', label: '画画写生 (Drawing)', value: 'sketching in a notebook' },

      // INSTRUMENTS (BACK VIEW)
      { id: 'inst_guitar', label: '背身吉他 (Guitar)', value: 'sitting with back to camera playing acoustic guitar' },
      { id: 'inst_piano', label: '背身钢琴 (Piano)', value: 'sitting at a piano with back to camera' },
      { id: 'inst_violin', label: '背身小提琴 (Violin)', value: 'standing by the window playing violin, back turned' },
    ]
  },

  // ========================================================================
  // 9. 防御措施 (DEFENSE)
  // ========================================================================
  {
    id: 'defense',
    title: '9. 防御措施 (Defense)',
    icon: <Shield className="w-4 h-4" />,
    type: 'multi',
    required: false,
    items: [
      { id: 'def_door_heavy', label: '重型防爆门 (Heavy Door)', value: 'Massive reinforced steel blast door, hermetically sealed, multiple heavy duty locks, no gaps. Extremely secure.' },
      { id: 'def_window_shutter', label: '钢铁卷帘 (Steel Shutters)', value: 'Heavy metal security shutters completely covering the windows, blocking visual access. Industrial protection.' },
      { id: 'def_window_bars', label: '窗户铁栏 (Window Bars)', value: 'Thick steel security bars welded over the windows, reinforced frame. Prison-grade security.' },
      { id: 'def_glass_bullet', label: '防弹玻璃 (Bulletproof Glass)', value: 'Thick multi-layered bulletproof glass, slight green tint, unbreakable. Hermetically sealed.' },
      { id: 'def_ceiling_reinforced', label: '强化天花板 (Reinforced Ceiling)', value: 'Reinforced concrete ceiling with exposed steel beams, industrial support structure.' },
      { id: 'def_fence_wire', label: '外围铁丝网 (Razor Wire)', value: 'Coils of sharp razor wire visible through the window, perimeter defense.' },
      { id: 'def_wall_high', label: '高耸围墙 (High Wall)', value: 'Massive high concrete perimeter walls visible outside, prison-style security.' },
      { id: 'def_electric_grid', label: '高压电网 (Electric Grid)', value: 'Glowing electric fence grid surrounding the property, warning signs.' },
      { id: 'def_turret', label: '自动炮台 (Sentry Turret)', value: 'Automated sentry gun turret scanning the perimeter, high-tech defense.' },
      { id: 'def_weapons', label: '武器库 (Weapon Rack)', value: 'Tactical rack with rifles and survival gear mounted on the wall, ready for defense.' },
    ]
  },

  // ========================================================================
  // 10. 供暖设备 (WARMTH)
  // ========================================================================
  {
    id: 'warmth',
    title: '10. 供暖设备 (Warmth)',
    icon: <Flame className="w-4 h-4" />,
    type: 'multi',
    items: [
      { id: 'fireplace', label: '开放式大壁炉 (Open Fireplace)', value: 'Massive open stone fireplace, roaring wood fire, crackling logs, casting warm dancing shadows across the room. The centerpiece of the shelter.' },
      { id: 'firepit', label: '石头火堆 (Stone Fire Pit)', value: 'Rustic stone circle fire pit constructed on the floor, open flames burning brightly, primitive and cozy survival atmosphere.' },
      { id: 'stove', label: '铸铁火炉 (Cast Iron Stove)', value: 'Heavy antique cast iron wood-burning stove, intense orange glow visible through the glass door, chimney pipe rising up. Radiating intense heat.' },
      { id: 'oil_lamp', label: '复古油灯 (Oil Lamps)', value: 'Vintage brass hurricane oil lamps with glass chimneys, warm golden flickering flame, creating a soft nostalgic ambiance.' },
      { id: 'candles', label: '烛光海洋 (Candles)', value: 'Clusters of thick beeswax candles of various heights, soft romantic candlelight illuminating the dark corners, gentle dripping wax.' },
      { id: 'heater', label: '电暖器 (Electric Heater)', value: 'Retro industrial electric space heater with glowing orange heating coils, humming softly, providing directional warmth.' },
      { id: 'hologram', label: '全息火 (Holo Fire)', value: 'High-tech holographic fireplace projector, smokeless perfect digital flames, neon orange glow, cyberpunk comfort.' },
      { id: 'floor_heating', label: '隐形地暖 (Underfloor Heating)', value: 'Modern underfloor heating system, polished wood floors looking warm and inviting, cozy socks, heat rising from the ground up.' },
      { id: 'torch', label: '落地火炬 (Floor Torch)', value: 'Tall iron standing torches with real flames, medieval dungeon style lighting, dramatic flickering shadows on the walls.' },
    ]
  },

  // ========================================================================
  // 11. 饮食储备 (SUSTENANCE) - WORLD CUISINE & FEASTS
  // ========================================================================
  {
    id: 'cat_food',
    title: '11. 饮食储备 (Sustenance)',
    icon: <Utensils className="w-4 h-4" />,
    type: 'multi',
    required: false,
    items: [
      // --- MASSIVE FEASTS (NEW!) ---
      { id: 'food_feast_global', label: '世界盛宴 (Global Feast)', value: 'A massive banquet table overflowing with world cuisines: Roast Duck, Pizza, Sushi, Fruits and Wine. A true feast for the eyes.' },
      { id: 'food_feast_asian', label: '亚洲盛宴 (Asian Banquet)', value: 'A large table filled with Asian delicacies: Hot Pot bubbling, Bamboo Steamers of Dim Sum, Sushi boat, and Peking Duck.' },
      { id: 'food_feast_western', label: '西式晚宴 (Western Dinner)', value: 'A hearty Western dinner spread: Roast Turkey or Lamb, mashed potatoes, pasta dishes, pizza, and red wine.' },
      { id: 'food_potluck', label: '百家宴 (Potluck Spread)', value: 'A cozy chaotic table filled with various home-cooked dishes in pots and pans, comfort food style.' },

      // --- MAIN COURSES / HEAVY MEALS ---
      { id: 'food_duck', label: '北京烤鸭 (Beijing Duck)', value: 'A feast of Beijing Roast Duck with glistening crispy skin, thin pancakes, and scallions arranged on a porcelain plate.' },
      { id: 'food_hotpot', label: '麻辣火锅 (Hot Pot)', value: 'A bubbling spicy Sichuan Hot Pot with red oil broth, surrounded by plates of sliced meat and vegetables. Steam rising.' },
      { id: 'food_sushi', label: '寿司拼盘 (Sushi Platter)', value: 'A wooden boat platter filled with fresh Salmon, Tuna, and Uni sushi and sashimi. Glistening fresh fish.' },
      { id: 'food_pizza', label: '意式披萨 (Pizza)', value: 'A rustic Italian Pizza Margherita with fresh basil and melted mozzarella cheese, steam rising. Crispy crust.' },
      { id: 'food_steak', label: '厚切牛排 (Steak)', value: 'A thick juicy Ribeye steak grilled to perfection, served with roasted garlic and rosemary on a wooden board.' },
      { id: 'food_burger', label: '美式汉堡 (Burger)', value: 'A tall gourmet cheeseburger with dripping cheese, bacon, and fresh lettuce, served with a pile of golden fries.' },
      { id: 'food_taco', label: '塔可饼 (Tacos)', value: 'A platter of authentic Mexican Tacos with fresh cilantro, lime wedges, and salsa.' },
      { id: 'food_ramen', label: '日式拉面 (Ramen)', value: 'A large steaming bowl of Tonkotsu Ramen with chashu pork, soft boiled egg, and nori. Rich broth.' },
      { id: 'food_curry', label: '咖喱饭 (Curry)', value: 'A plate of rich Japanese Beef Curry with rice and pickled ginger, or Indian Butter Chicken with Naan bread.' },
      { id: 'food_pasta', label: '意大利面 (Pasta)', value: 'A plate of creamy Carbonara or rich Bolognese pasta with freshly grated parmesan cheese.' },
      { id: 'food_paella', label: '海鲜饭 (Paella)', value: 'A large flat pan of Spanish Seafood Paella with yellow rice, shrimp, mussels, and lemon wedges.' },
      { id: 'food_bbq_skewers', label: '烤肉串 (BBQ Skewers)', value: 'A pile of grilled meat skewers (Yakitori or Kebab), smoking hot and glazed with sauce.' },
      { id: 'food_fish', label: '烤全鱼 (Grilled Fish)', value: 'A whole grilled fish served with lemon and herbs on a long platter.' },
      
      // --- SOUPS & STEWS ---
      { id: 'food_stew_pot', label: '炖锅 (Stew Pot)', value: 'A heavy cast iron pot filled with hearty beef stew or vegetable soup, ladle resting on the side.' },
      { id: 'food_pho', label: '越南河粉 (Pho)', value: 'A large bowl of Vietnamese Pho with beef slices, fresh basil, bean sprouts, and lime.' },
      { id: 'food_onion_soup', label: '洋葱汤 (Onion Soup)', value: 'French Onion Soup with a thick layer of melted gruyère cheese on toast.' },

      // --- SNACKS & SMALL BITES ---
      { id: 'food_charcuterie', label: '冷切拼盘 (Charcuterie)', value: 'A luxury Charcuterie board with cured meats (salami, prosciutto), various cheeses, grapes, and crackers.' },
      { id: 'food_fries', label: '大份薯条 (Fries)', value: 'A large basket of golden crispy french fries with ketchup and mayo.' },
      { id: 'food_popcorn', label: '爆米花 (Popcorn)', value: 'A large bucket of buttered popcorn, movie night style.' },
      { id: 'food_chips', label: '薯片零食 (Chips)', value: 'Bowls of potato chips, nachos with cheese dip, and pretzels.' },
      { id: 'food_dimsum', label: '广式点心 (Dim Sum)', value: 'Stacks of bamboo steamers filled with dumplings, buns, and chicken feet.' },
      { id: 'food_takoyaki', label: '章鱼烧 (Takoyaki)', value: 'A boat of Takoyaki balls topped with dancing bonito flakes and mayo.' },
      
      // --- SWEETS & BAKERY ---
      { id: 'food_bread_basket', label: '面包篮 (Bread Basket)', value: 'A woven basket overflowing with fresh baguettes, croissants, and sourdough loaves.' },
      { id: 'food_cake', label: '草莓蛋糕 (Strawberry Cake)', value: 'A slice of fluffy shortcake with fresh strawberries and whipped cream.' },
      { id: 'food_macarons', label: '马卡龙 (Macarons)', value: 'A colorful tower of pastel French Macarons.' },
      { id: 'food_pancakes', label: '松饼塔 (Pancakes)', value: 'A stack of fluffy pancakes topped with butter and dripping maple syrup.' },
      { id: 'food_donuts', label: '甜甜圈 (Donuts)', value: 'A box of glazed and frosted donuts.' },
      { id: 'food_fruits', label: '水果拼盘 (Fruit Platter)', value: 'A lavish platter of fresh tropical fruits: Pineapple, Watermelon, Grapes, and Berries.' },

      // --- DRINKS ---
      { id: 'food_coffee_set', label: '手冲咖啡 (Coffee Set)', value: 'A professional pour-over coffee setup with a glass carafe and steaming mug.' },
      { id: 'food_tea_ceremony', label: '茶道套装 (Tea Ceremony)', value: 'A traditional tea set (Chinese or Japanese) with teapot and small cups.' },
      { id: 'food_wine', label: '红酒 (Red Wine)', value: 'A bottle of vintage red wine and a crystal glass half filled.' },
      { id: 'food_beer', label: '冰啤酒 (Beer)', value: 'Frosty mugs of amber beer with foam.' },
      { id: 'food_cocktails', label: '鸡尾酒 (Cocktails)', value: 'Colorful cocktails in fancy glasses with garnishes.' },
      { id: 'food_whiskey', label: '威士忌 (Whiskey)', value: 'A crystal decanter of whiskey and a glass with a large ice sphere.' },
      { id: 'food_cocoa', label: '热可可 (Hot Cocoa)', value: 'A mug of hot chocolate topped with marshmallows.' },
      { id: 'food_water_jugs', label: '纯净水 (Water Jugs)', value: 'Large clear jugs of purified water, essential for survival.' },
    ]
  },

  // ========================================================================
  // 12. 生活设施 (AMENITIES) - UPDATED
  // ========================================================================
  {
    id: 'amenities',
    title: '12. 生活设施 (Lifestyle)',
    icon: <Coffee className="w-4 h-4" />,
    type: 'multi',
    items: [
      { id: 'am_bathroom', label: '小型卫生间 (Compact Bathroom)', value: 'Visible compact hygiene module with clean toilet, sink and mirror. Integrated into the shelter.' },
      { id: 'am_shower', label: '淋浴间 (Shower Stall)', value: 'Glass enclosed shower stall with chrome fixtures, steam on glass. Luxury touch.' },
      { id: 'am_desk', label: '书桌电脑 (Desk & Laptop)', value: 'Workstation with a laptop open displaying code/map, notebook, and pen.' },
      { id: 'am_art', label: '墙壁挂画 (Wall Art)', value: 'Framed landscape paintings or posters on the walls, adding personality.' },
      { id: 'am_telescope', label: '望远镜 (Telescope)', value: 'Brass telescope mounted on a tripod pointed out the window.' },
      { id: 'am_plants', label: '室内绿植 (Indoor Plants)', value: 'Lush potted indoor plants, ferns, and hanging vines adding green life.' },
      { id: 'am_bookshelf', label: '书架 (Bookshelf)', value: 'Floor-to-ceiling bookshelf filled with old worn books.' },
      { id: 'am_vinyl', label: '黑胶唱机 (Vinyl Player)', value: 'Vintage vinyl record player spinning a record, speakers nearby.' },
      { id: 'am_radio', label: '老收音机 (Old Radio)', value: 'Vintage analog radio receiver with glowing dial.' },
      { id: 'am_tv', label: '大电视 (Large TV)', value: 'Large wall-mounted flat screen TV (can be off or showing static).' },
      { id: 'am_wardrobe', label: '衣柜 (Wardrobe)', value: 'Open wardrobe or clothing rack with hanging coats and gear.' },
      { id: 'am_kitchen', label: '开放厨房 (Kitchenette)', value: 'Compact kitchenette counter with sink, cutting board, and utensils.' },
      { id: 'am_treadmill', label: '跑步机 (Treadmill)', value: 'Modern treadmill folded in the corner, fitness equipment.' },
      { id: 'am_bike', label: '运动单车 (Exercise Bike)', value: 'Stationary exercise bike for indoor fitness.' },
      { id: 'am_workbench', label: '工具台 (Workbench)', value: 'DIY workbench with tools, soldering iron, and spare parts.' },
      { id: 'am_guitar', label: '吉他 (Guitar)', value: 'Acoustic guitar leaning against a chair or wall.' },
      { id: 'am_gaming', label: '游戏主机 (Gaming Setup)', value: 'Video game console with controllers and RGB lighting.' },
      { id: 'am_aquarium', label: '鱼缸 (Aquarium)', value: 'Glowing aquarium tank with fish and bubbles, calming blue light.' },
      { id: 'am_washer', label: '洗衣机 (Washing Machine)', value: 'Compact washing machine unit, domestic comfort.' },
      { id: 'am_printer', label: '3D打印机 (3D Printer)', value: 'High-tech 3D printer creating a small object.' },
    ]
  },

  // ========================================================================
  // 13. 温暖软装 (SOFT DECOR) - REPLACED 'TEXTURES'
  // ========================================================================
  {
    id: 'textures',
    title: '13. 温暖软装 (Soft Decor)',
    icon: <Palette className="w-4 h-4" />,
    type: 'multi',
    items: [
      { id: 'dec_blanket_knit', label: '巨型粗针织毛毯 (Chunky Knit)', value: 'Giant chunky knit wool blankets draped over everything, extremely tactile and cozy.' },
      { id: 'dec_curtain_velvet', label: '厚重天鹅绒窗帘 (Velvet Curtains)', value: 'Heavy thick velvet curtains blocking the draft, rich texture, insulating the room.' },
      { id: 'dec_tatami_soft', label: '厚实榻榻米 (Thick Tatami)', value: 'Thick soft tatami mats covering the floor, creating a warm cushioned surface.' },
      { id: 'dec_quilt_fleece', label: '珊瑚绒棉被 (Coral Fleece)', value: 'Ultra-soft fluffy coral fleece duvet, cloud-like texture, extremely warm and plush.' },
      { id: 'dec_pillow_sea', label: '枕头海洋 (Sea of Pillows)', value: 'A massive pile of plush pillows and cushions of various sizes, sinking into softness.' },
      { id: 'dec_rug_fur', label: '羊皮地毯 (Sheepskin Rug)', value: 'White faux fur sheepskin rugs scattered on the floor, soft underfoot.' },
      { id: 'dec_beanbag', label: '毛绒懒人沙发 (Plush Beanbag)', value: 'Oversized plush beanbag chair covered in faux fur, sinking in comfort.' },
      { id: 'dec_tapestry', label: '编织挂毯 (Woven Tapestry)', value: 'Intricate macrame or woven wool wall hangings adding softness to the walls.' },
      { id: 'dec_socks', label: '羊毛袜 (Wool Socks)', value: 'Thick hand-knitted wool socks visible, symbolizing warmth.' },
      { id: 'dec_fairy_lights', label: '纱幔串灯 (Tulle & Lights)', value: 'Soft tulle fabric draped with warm fairy lights, creating a magical soft glow.' },
    ]
  },

  // ========================================================================
  // 14. 外部威胁 (DANGER) - MANUAL ONLY
  // ========================================================================
  {
    id: 'danger',
    title: '14. 外部威胁 (Threat - Manual)',
    icon: <Skull className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '无威胁 (Safe)', value: 'No visible threats. Peaceful.' },
      { id: 'zombies', label: '丧尸群 (Zombies)', value: 'Horde of zombies wandering in the distance.' },
      { id: 'aliens', label: '外星人 (Aliens)', value: 'Alien tripod machines visible in the fog.' },
      { id: 'soldiers', label: '敌军 (Soldiers)', value: 'Enemy patrol with flashlights searching.' },
      { id: 'wolves', label: '狼群 (Wolves)', value: 'Pack of wolves circling outside.' },
      { id: 'bear', label: '巨熊 (Bear)', value: 'Massive bear shadow near the window.' },
      { id: 'ghosts', label: '幽灵 (Ghosts)', value: 'Translucent spirits floating outside.' },
      { id: 'flood', label: '洪水 (Flood)', value: 'Water level rising around the structure.' },
      { id: 'drones', label: '无人机 (Drones)', value: 'Surveillance drones scanning with lasers.' },
    ]
  },

  // ========================================================================
  // 15. 睡眠设施 (SLEEPING)
  // ========================================================================
  {
    id: 'sleeping',
    title: '15. 睡眠设施 (Sleeping)',
    icon: <Bed className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'sleep_wood_heavy', label: '大双人木床 (Heavy Wood Bed)', value: 'Massive rustic wooden bed frame with a high headboard, layered with thick winter quilts and a mountain of pillows.' },
      { id: 'sleep_platform_low', label: '低矮平台床 (Low Platform)', value: 'Low-profile platform bed on a soft rug, Japanese minimalist style, heavy duvet flowing onto the floor, enveloping comfort.' },
      { id: 'sleep_round_lux', label: '圆形大床 (Round Bed)', value: 'Luxurious oversized circular bed, surrounded by a protective ring of plush pillows and fur throws.' },
      { id: 'sleep_canopy', label: '四柱幔帐床 (Canopy Bed)', value: 'Grand four-poster bed with semi-transparent curtains draped around it, creating a private, safe, dreamlike enclosure within the room.' },
      { id: 'sleep_sofa_giant', label: 'L型沙发床 (Giant Sofa Bed)', value: 'Massive L-shaped sofa unfolded into a sprawling bed island, buried under a chaotic pile of blankets and cushions.' },
      { id: 'sleep_hammock_fur', label: '毛绒吊床 (Fur Hammock)', value: 'Wide heavy-duty hammock lined with thick sheepskin furs and pillows, suspended securely, swaying gently.' },
      { id: 'sleep_loft_nest', label: '阁楼窝 (Loft Nest)', value: 'Cozy loft bed nook near the ceiling, reachable by ladder, adorned with string lights and plushies, a safe hidden nest.' },
      { id: 'sleep_bunk_curtain', label: '隐私双层床 (Bunk w/ Curtain)', value: 'Sturdy wooden bunk bed with heavy privacy curtains drawn shut, a personal capsule of warmth.' },
      { id: 'sleep_window_alcove', label: '窗台卧榻 (Window Alcove)', value: 'Deep padded window seat converted into a bed, nestled right against the glass with a view of the storm.' },
      { id: 'sleep_floor_pile', label: '地铺被窝 (Floor Pile)', value: 'A messy, comfortable pile of thick mattresses and duvets directly on the floor, ultimate grounding comfort.' },
    ]
  },

  // ========================================================================
  // 16. 镜头距离 (LENS DISTANCE) - REFACTORED
  // ========================================================================
  {
    id: 'shot_type',
    title: '16. 镜头距离 (Lens Distance)',
    icon: <Camera className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'dist_macro', label: '微距 (Macro)', value: 'Macro close-up shot of texture/raindrops, extremely shallow depth of field.' },
      { id: 'dist_close', label: '特写 (Close Up)', value: 'Close up shot focusing on hands or a specific object like a coffee mug.' },
      { id: 'dist_medium', label: '中景 (Medium Shot)', value: 'Medium shot showing the character from waist up and immediate surroundings.' },
      { id: 'dist_long', label: '全景/远景 (Wide Shot)', value: 'Wide shot capturing the entire room and the window view.' },
      { id: 'dist_ext_wide', label: '广角大场景 (Extreme Wide)', value: 'Extreme wide angle shot showing the entire shelter layout and context.' },
      { id: 'dist_overhead', label: '上帝视角 (Overhead)', value: 'Top-down bird\'s eye view looking directly down at the floor plan.' },
      { id: 'dist_drone_45', label: '无人机45度 (Aerial Oblique)', value: 'Aerial shot from a 45-degree angle outside looking in through the window.' },
      { id: 'dist_drone_flat', label: '无人机平视 (Aerial Eye-level)', value: 'Aerial shot hovering at eye-level outside the window.' },
    ]
  },

  // ========================================================================
  // 17. 视觉风格 (VISUAL STYLE)
  // ========================================================================
  {
    id: 'visual_style',
    title: '17. 视觉风格 (Visual Style)',
    icon: <Palette className="w-4 h-4" />,
    type: 'single',
    items: [
      // --- 1. REALISTIC / FILM (写实/胶片) ---
      { id: 'realistic_8k', label: '8K 真实感 (Photorealistic)', value: 'ultra sharp photorealistic rendering, 4K resolution, natural colors, realistic textures, no stylization' },
      { id: 'cinematic_35mm', label: '35mm 胶片 (Cinematic)', value: 'cinematic 35mm film look, gentle film grain, natural contrast, subtle halation, realistic color grade' },
      { id: 'film_portra', label: '柯达 Portra (Soft Warm)', value: 'Kodak Portra-style film, soft warm skin tones, slightly muted contrast, pastel highlights, gentle grain' },
      { id: 'film_fuji', label: '富士经典 (Fuji Chrome)', value: 'Fujifilm Classic Chrome-inspired color, cool-neutral tones, restrained saturation, crisp contrast, documentary feel' },
      { id: 'film_teal_orange', label: '青橙色调 (Teal & Orange)', value: 'cinematic teal and orange color grade, warm interior lights, cool blue shadows, strong but balanced contrast' },
      { id: 'light_high_key', label: '高调柔光 (High Key)', value: 'high key lighting, bright overall exposure, very soft shadows, airy and clean color palette' },
      { id: 'light_low_key', label: '低调暖光 (Low Key)', value: 'low key lighting, mostly dark environment, focused warm pools of light, strong contrast and deep shadows' },
      { id: 'leica_bw', label: '莱卡黑白 (Leica B&W)', value: 'Leica-style monochrome, rich black and white tones, strong micro-contrast, fine grain, classic street-photography feel' },

      // --- 2. ANIME / JAPANESE (动画/日系) ---
      { id: 'anime_ghibli', label: '吉卜力 (Ghibli)', value: 'hand-drawn Ghibli-inspired style, soft lines, warm natural colors, painterly shading, gentle fantasy atmosphere' },
      { id: 'anime_makoto', label: '新海诚 (Makoto Shinkai)', value: 'Makoto Shinkai-inspired anime style, dramatic skies, strong light beams, vibrant color contrast, detailed backgrounds' },
      { id: 'jp_youth', label: '日系青春 (Youth Cinema)', value: 'Japanese youth cinema look, natural handheld feeling, warm slightly faded colors, soft backlight, subtle film grain' },
      { id: 'anime_slice', label: '生活系动画 (Slice of Life)', value: 'slice-of-life anime style, clean line art, soft flat shading, pastel everyday colors, calm and cozy mood' },
      { id: 'light_academia', label: '亮学术风 (Light Academia)', value: 'light academia aesthetic, cream and beige tones, soft daylight, bookish and elegant atmosphere, gentle contrast' },

      // --- 3. WASTELAND / APOCALYPTIC (废土/末日) ---
      { id: 'waste_madmax', label: '废土荒原 (Wasteland)', value: 'post-apocalyptic wasteland aesthetic, dusty air, desaturated earth tones, worn and scratched surfaces, harsh sunlight' },
      { id: 'waste_nuclear', label: '核冬天 (Nuclear Winter)', value: 'nuclear winter atmosphere, cold bluish-gray palette, snow and ash in the air, low visibility, bleak and quiet mood' },
      { id: 'waste_rusty', label: '锈迹工业 (Rusty Ind.)', value: 'rusty industrial style, oxidized metal textures, deep browns and oranges, heavy shadows, factory-like atmosphere' },
      { id: 'waste_gritty', label: '高去饱和 (Gritty)', value: 'gritty desaturated look, muted colors, strong contrast, noticeable noise and texture, rough and realistic mood' },
      { id: 'analog_horror', label: '模拟恐怖 (Analog Horror)', value: 'analog horror aesthetic, VHS scanlines, slight image blur and noise, dark low-contrast lighting, eerie retro feeling' },

      // --- 4. NATURE / SAFE (自然/安全感) ---
      { id: 'nature_earth', label: '大地色系 (Earth Tones)', value: 'earth-tone color palette, browns, ochres, muted greens, soft low contrast, warm and grounded atmosphere' },
      { id: 'nordic_warm', label: '北欧极简 (Nordic Warm)', value: 'Nordic minimalism, clean white walls, light wood, soft warm lighting, simple shapes, calm and airy feeling' },
      { id: 'cottagecore', label: '田园柔光 (Cottagecore)', value: 'cottagecore aesthetic, soft natural light, pastel colors, floral and wooden details, dreamy and nostalgic mood' },

      // --- 5. LEGACY / OTHER ---
      { id: 'cyber_neon', label: '赛博霓虹 (Cyberpunk)', value: 'neon-lit city at night, high contrast magenta and cyan lights, rainy streets, reflective surfaces, dense atmosphere' },
      { id: 'vintage_70s', label: '70年代复古 (Vintage 70s)', value: '1970s vintage photo look, warm slightly faded colors, soft focus, subtle film grain and vignetting' },
      { id: 'gothic_noir', label: '哥特黑色 (Noir)', value: 'noir-inspired style, deep blacks and strong highlights, dramatic side lighting, moody shadows, minimal color' },
      { id: 'unreal_5', label: '虚幻引擎5 (Unreal Engine)', value: 'Unreal Engine-style rendering, highly detailed 3D realism, game-like materials, crisp lighting and reflections' },
      { id: 'japanese_wafu', label: '和风 (Japanese)', value: 'traditional Japanese aesthetic, natural materials, washi paper, wooden textures, balanced composition, subdued colors' },
    ]
  },

  // ========================================================================
  // 18. 宠物伙伴 (PETS)
  // ========================================================================
  {
    id: 'pets',
    title: '18. 宠物伙伴 (Pets)',
    icon: <Dog className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '无 (None)', value: 'No pets.' },

      // --- DOGS ---
      { id: 'dog_golden', label: '金毛 (Golden Retriever)', value: 'A loyal Golden Retriever sleeping peacefully on the rug.' },
      { id: 'dog_puppy', label: '幼犬 (Sleeping Puppy)', value: 'A tiny fluffy puppy sleeping soundly, belly up, extremely cute.' },
      { id: 'dog_corgi', label: '柯基 (Corgi)', value: 'A Corgi splooting on the floor (lying flat on belly).' },
      { id: 'dog_border', label: '边牧 (Border Collie)', value: 'A smart Border Collie resting head on paws, watching.' },
      { id: 'dog_husky', label: '哈士奇 (Husky)', value: 'A fluffy Siberian Husky curled up like a donut.' },
      { id: 'dog_bernese', label: '伯恩山 (Bernese)', value: 'A large gentle Bernese Mountain Dog, looking like a bear rug.' },

      // --- CATS ---
      { id: 'cat_kitten', label: '幼猫 (Tiny Kitten)', value: 'A tiny kitten curled up in a small ball on a blanket.' },
      { id: 'cat_orange', label: '橘猫 (Orange Tabby)', value: 'A fat orange tabby cat loafing on a cushion.' },
      { id: 'cat_black', label: '黑猫 (Black Cat)', value: 'A sleek mysterious black cat with bright yellow eyes.' },
      { id: 'cat_white', label: '波斯猫 (White Persian)', value: 'A fluffy white Persian cat, elegant and royal.' },
      { id: 'cat_mainecoon', label: '缅因猫 (Maine Coon)', value: 'A massive fluffy Maine Coon cat stretching out.' },
      { id: 'cat_siamese', label: '暹罗猫 (Siamese)', value: 'Elegant Siamese cat.' },

      // --- SMALL MAMMALS ---
      { id: 'pet_rabbit', label: '垂耳兔 (Lop Rabbit)', value: 'A cute lop-eared rabbit sitting on the wooden floor.' },
      { id: 'pet_guinea', label: '豚鼠 (Guinea Pigs)', value: 'Two fluffy guinea pigs huddled together for warmth.' },
      { id: 'pet_hamster', label: '仓鼠 (Hamster)', value: 'A tiny round hamster eating a seed in a small cage/box.' },
      { id: 'pet_hedgehog', label: '刺猬 (Hedgehog)', value: 'A small hedgehog curled into a ball, safe and cozy.' },
      { id: 'pet_chinchilla', label: '龙猫 (Chinchilla)', value: 'A soft grey Chinchilla sitting on a shelf.' },
      { id: 'pet_ferret', label: '雪貂 (Ferret)', value: 'A playful ferret sleeping in a hammock.' },

      // --- BIRDS ---
      { id: 'bird_parrot', label: '金刚鹦鹉 (Macaw)', value: 'A colorful Macaw parrot perched on a wooden stand.' },
      { id: 'bird_budgie', label: '虎皮鹦鹉 (Budgie)', value: 'A small blue/green budgie perching on a finger or stand.' },
      { id: 'bird_cockatiel', label: '玄凤鹦鹉 (Cockatiel)', value: 'A cockatiel with yellow crest and orange cheeks.' },
      { id: 'bird_owl', label: '猫头鹰 (Pet Owl)', value: 'A small owl perched near the window, watching the night.' },

      // --- AQUATIC / REPTILES ---
      { id: 'pet_fish_tank', label: '热带鱼缸 (Aquarium)', value: 'A glowing glass aquarium filled with colorful neon tetras and plants.' },
      { id: 'pet_turtle', label: '乌龟 (Turtle)', value: 'A small turtle resting on a rock under a heat lamp.' },
      { id: 'pet_gecko', label: '守宫 (Gecko)', value: 'A small leopard gecko resting on a warm rock.' },

      // --- EXOTIC / SPECIAL ---
      { id: 'pet_red_panda', label: '小熊猫 (Red Panda)', value: 'A cute red panda sleeping on a wooden beam inside the room.' },
      { id: 'pet_fennec', label: '耳廓狐 (Fennec Fox)', value: 'A fennec fox with huge ears curling up to sleep.' },
      { id: 'pet_otter', label: '水獭 (Otter)', value: 'A playful otter holding a favorite pebble or toy.' },
      { id: 'pet_capybara', label: '水豚 (Capybara)', value: 'A chill capybara sitting calmly, radiating peace.' },
      { id: 'pet_meerkat', label: '狐獴 (Meerkat)', value: 'A meerkat standing up by the window, keeping watch.' },
      { id: 'pet_minipig', label: '迷你猪 (Mini Pig)', value: 'A clean spotted miniature pig sleeping on a rug.' },
      { id: 'pet_sugar', label: '蜜袋鼯 (Sugar Glider)', value: 'A tiny sugar glider peeking out from a pocket or pouch.' },

      // --- FARM / LARGE ---
      { id: 'pet_horse', label: '马 (Horse/Pony)', value: 'A horse visible in the connected stable or barn area.' },
      { id: 'pet_robot', label: '机器狗 (Spot)', value: 'A Boston Dynamics Spot robot dog lying down in charging mode.' },
    ]
  },

  // ========================================================================
  // 19. NPC (NPC) - FROZEN
  // ========================================================================
  {
    id: 'npc',
    title: '19. NPC (Frozen)',
    icon: <UserCheck className="w-4 h-4" />,
    type: 'single',
    items: [
      { id: 'none', label: '暂未开放 (Coming Soon)', value: '' },
    ]
  },

  // ========================================================================
  // 20. 时长策略 (DURATION)
  // ========================================================================
  {
    id: 'duration',
    title: '20. 时长策略 (Duration)',
    icon: <Hourglass className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: '2h', label: '2 Hours (Nap/Focus)', value: '2 Hours' },
      { id: '8h', label: '8 Hours (Deep Sleep)', value: '8 Hours' },
    ]
  },
];
