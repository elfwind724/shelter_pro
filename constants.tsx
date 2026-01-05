
import React from 'react';
import { Shield, Home, Flame, Coffee, Package, CloudLightning, Skull, Bed, Scroll, Clock, Hourglass, Camera, Ruler, Heart, Users, Map, Ghost, Lock, Dog, UserCheck, Armchair, Palette, Feather } from 'lucide-react';
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
      // STRATEGY SPECIAL
      { id: 'ship_cabin', label: '船长室 (Ship Cabin)', value: 'ARCHITECTURAL STYLE: 19th Century Maritime. Interior of a heavy wooden ship captain\'s cabin. KEY ELEMENTS: Dark polished mahogany walls, brass instruments, gimbaled lanterns, slanted walls following the hull shape. A round brass porthole dripping with condensation. NO MODERN WINDOWS.' },

      // =================================================================
      // [REALISM] HIDDEN CORNERS (现实隐秘角落)
      // =================================================================
      { id: 'fire_lookout', label: '森林瞭望塔 (Fire Lookout)', value: 'ARCHITECTURAL STYLE: US Forest Service Lookout. Interior of a high-altitude square room with 360-degree windows on all sides. KEY ELEMENTS: Osborne Fire Finder in the center, utilitarian steel furniture, propane stove. Visible horizon line above the trees. High exposure feeling.' },
      { id: 'skoolie', label: '改造校车 (Converted Bus)', value: 'ARCHITECTURAL STYLE: Vehicle Conversion (Skoolie). Interior of a long, narrow metal bus shell. KEY ELEMENTS: Curved metal ceiling ribs, long perspective, driver seat visible at far end, wood stove installed near back door. Windows on both sides showing passing scenery. DIY wood paneling.' },
      { id: 'attic_studio', label: '斜顶阁楼 (Slanted Attic)', value: 'ARCHITECTURAL STYLE: A-Frame Attic. Interior of a dusty artist garret under the roof. KEY ELEMENTS: Sharp triangular ceiling beams, massive slanted skylight window (rain hammering on it), low headroom on sides. Cluttered, artistic, bohemian atmosphere.' },
      { id: 'projection_booth', label: '放映室 (Cinema Booth)', value: 'ARCHITECTURAL STYLE: Vintage Industrial. Interior of a cramped movie theater projection room. KEY ELEMENTS: Small square observation ports looking out into a dark void (the theater), massive film reels, projector beam cutting the dust. Concrete walls, humming electronics.' },
      { id: 'radio_station', label: '深夜电台 (Radio Station)', value: 'ARCHITECTURAL STYLE: Soundproof Studio. Interior of a broadcasting booth. KEY ELEMENTS: Walls lined with acoustic foam pyramids, "ON AIR" red sign, microphone on boom arm, mixing console with VU meters. Rain visible through the heavy soundproof glass window.' },
      { id: 'laundromat', label: '深夜洗衣房 (Laundromat)', value: 'ARCHITECTURAL STYLE: Retro Commercial. Interior of a 24-hour coin laundry. KEY ELEMENTS: Rows of washing machines with round glass doors spinning rhythmically, fluorescent tube lighting, checkerboard floor, plastic chairs. Urban loneliness.' },
      { id: 'clock_tower', label: '钟楼密室 (Clock Tower)', value: 'ARCHITECTURAL STYLE: Steampunk Industrial. Interior of the gear room behind a giant clock face. KEY ELEMENTS: Massive brass cogs and gears (some turning), the back of a giant glass clock face serves as the window. Rain running down the Roman numerals. Amber light.' },

      // =================================================================
      // [SPECIAL] UNIQUE STRUCTURES (特色建筑)
      // =================================================================
      { id: 'arctic_station', label: '极地科考站 (Arctic Station)', value: 'ARCHITECTURAL STYLE: Modular Sci-Fi Prefab. Interior of an Antarctic research outpost. KEY ELEMENTS: Orange insulated panel walls, heavy blast doors, thick multi-pane portholes. Scientific servers blinking. Sterile but warm interior vs Whiteout Blizzard outside.' },
      { id: 'earthship', label: '沙漠生态屋 (Earthship)', value: 'ARCHITECTURAL STYLE: Organic Biotecture. Interior of a sustainable Earthship. KEY ELEMENTS: Walls made of adobe and colored bottles, south-facing angled glass wall, indoor planter beds with jungle plants growing inside. Curved organic shapes, no sharp corners.' },
      { id: 'yurt', label: '游牧蒙古包 (Cozy Yurt)', value: 'ARCHITECTURAL STYLE: Central Asian Nomad. Interior of a circular felt tent. KEY ELEMENTS: Wooden lattice walls (Khana), central roof wheel (Toono) with chimney, heavy patterned rugs everywhere, curved roof poles. Round communal space, warm and enclosed.' },
      { id: 'botanical_lab', label: '植物实验室 (Botanical Lab)', value: 'ARCHITECTURAL STYLE: Overgrown Science. Interior of a glass-walled research pod in the jungle. KEY ELEMENTS: Condensation on glass, grow lights (purple/pink), creeping vines inside, microscopes. The feeling of being inside a terrarium looking out at a monsoon.' },
      { id: 'aquarium_tunnel', label: '水族馆隧道 (Aquarium)', value: 'ARCHITECTURAL STYLE: Underwater Acrylic Tunnel. Interior of a dry transparent tube. KEY ELEMENTS: 180-degree view of water overhead, sharks and fish swimming above, caustic light patterns on the floor. Thick curved glass walls. Blue ambient light.' },

      // =================================================================
      // [CLASSIC] OCEAN & MARITIME
      // =================================================================
      { id: 'cruise_ship', label: '幽灵邮轮 (Ghost Liner)', value: 'ARCHITECTURAL STYLE: Art Deco 1920s. Interior of a luxury ocean liner stateroom. KEY ELEMENTS: Dark varnished wood paneling, brass trim, round portholes (not square windows), bolted-down furniture. Tilted horizon line. Bioshock atmosphere.' },
      { id: 'oil_rig', label: '海上油井 (Oil Rig)', value: 'ARCHITECTURAL STYLE: Industrial Brutalism. Interior of a suspended control module. KEY ELEMENTS: Corrugated metal walls, yellow hazard stripes, floor grating, heavy steel watertight doors. View looking DOWN at the black churning ocean through slanted reinforced windows.' },
      { id: 'submarine', label: '核潜艇 (Submarine)', value: 'ARCHITECTURAL STYLE: Military Industrial. Interior of a submarine pressure hull. KEY ELEMENTS: Curved steel walls covered in pipes, valves, and analog gauges. Red tactical lighting. Cramped, claustrophobic, high-tech. No windows (periscope screen only).' },
      { id: 'lighthouse', label: '孤峰灯塔 (Lighthouse)', value: 'ARCHITECTURAL STYLE: Cylindrical Stone Tower. Interior of the lantern room. KEY ELEMENTS: 360-degree glass reinforced with iron cage, massive Fresnel lens machinery in the center. High altitude view of storm. Iron spiral staircase.' },
      { id: 'underwater_dome', label: '深海穹顶 (Abyssal Dome)', value: 'ARCHITECTURAL STYLE: Geodesic Glass Dome. Interior of a seabed habitat. KEY ELEMENTS: Triangular glass panels reinforced with steel frame. Pitch black outside with bioluminescent creatures. High pressure aesthetic. Subnautica style.' },
      { id: 'canal_boat', label: '运河窄船 (Canal Narrowboat)', value: 'ARCHITECTURAL STYLE: British Narrowboat. Interior of a very long, narrow (6ft wide) wooden cabin. KEY ELEMENTS: Painted with "Roses and Castles" folk art, small solid fuel stove, low ceiling. Rain pattering right above head. Moored under a willow tree.' },

      // =================================================================
      // [NATURE] WILDERNESS & ORGANIC
      // =================================================================
      { id: 'hobbit_hole', label: '霍比特洞 (Hobbit Hole)', value: 'ARCHITECTURAL STYLE: Underground Fantasy. Interior of a hill-burrow. KEY ELEMENTS: Round wooden door with central knob, curved plaster walls, heavy oak timber beams (no straight lines). Low ceiling. Cozy, earthy, warm yellow light. View of garden from ground level.' },
      { id: 'waterfall_cave', label: '水帘洞天 (Waterfall Cave)', value: 'ARCHITECTURAL STYLE: Natural Rock Formation. Interior of a dry cave behind a waterfall. KEY ELEMENTS: The "Window" is a roaring curtain of falling water (distorted light). Stone floor covered in rugs. Damp but safe atmosphere. Blue-green filtered light.' },
      { id: 'giant_tree', label: '巨木树洞 (Hollow Tree)', value: 'ARCHITECTURAL STYLE: Druidic Nature. Interior carved inside a massive living sequoia trunk. KEY ELEMENTS: Walls are living wood bark and smooth cambium. Windows are natural knotholes fitted with glass. Amber resin lamps. High up in the canopy.' },
      { id: 'greenhouse', label: '末日温室 (Overgrown Greenhouse)', value: 'ARCHITECTURAL STYLE: Victorian Glasshouse. Interior of an iron-framed conservatory. KEY ELEMENTS: Rusted iron framework, broken panes patched up, overgrown with giant ferns and vines INSIDE. Smells of wet earth and plants. Foggy and humid.' },
      { id: 'cliff_terrace', label: '悬崖露台 (Cliff Terrace)', value: 'ARCHITECTURAL STYLE: Modern Brutalist Concrete. Interior looking out. KEY ELEMENTS: Massive floor-to-ceiling glass walls, a raw concrete terrace cantilevered over a void. Rain splashing on the concrete deck. Minimalist furniture.' },
      { id: 'forest_aerie', label: '森林树顶 (Forest Canopy)', value: 'ARCHITECTURAL STYLE: Wooden Platform. Interior of a treehouse high in the branches. KEY ELEMENTS: Wooden planks, rope railings, surrounded by thick leaves and branches pressing against the windows. Swaying motion. Bird\'s eye view of the forest floor.' },
      { id: 'zen_garden', label: '日式缘侧 (Zen Garden)', value: 'ARCHITECTURAL STYLE: Traditional Japanese Kyoto Temple. Interior of a Washitsu (Tatami room). KEY ELEMENTS: Straw Tatami mats on floor, Shoji sliding paper doors (open), looking out onto a wet wooden Engawa porch and a mossy rock garden. Low wooden ceiling. Paper lanterns. NO WESTERN SOFAS.' },
      { id: 'glass_igloo', label: '极光玻璃屋 (Glass Igloo)', value: 'ARCHITECTURAL STYLE: Geodesic Dome. Interior of a frameless glass pod. KEY ELEMENTS: Triangular glass panels offering 100% sky view. Heated glass (no fog). Lying in bed looking directly up at snow falling on the glass. Modern, Scandinavian.' },

      // =================================================================
      // [SKY] AERIAL & HIGH ALTITUDE
      // =================================================================
      { id: 'steampunk_airship', label: '蒸汽飞艇 (Steampunk Airship)', value: 'ARCHITECTURAL STYLE: Victorian Industrial Aerial. Interior of a dirigible gondola. KEY ELEMENTS: Brass piping, riveted aluminum walls, large slanted observation windows looking down at clouds. Leather pilot seat. Vibration of engines.' },
      { id: 'cloud_temple', label: '云端神庙 (Cloud Temple)', value: 'ARCHITECTURAL STYLE: Ancient Stone Fantasy. Interior of a floating sanctuary. KEY ELEMENTS: White marble columns, open arches with no glass, looking out over a sea of clouds. mystical floating rocks. Ethereal, airy, high altitude.' },
      { id: 'mountain_peak', label: '山巅哨站 (Mountain Peak)', value: 'ARCHITECTURAL STYLE: High-Tech Alpine. Interior of a summit weather station. KEY ELEMENTS: Reinforced geometric windows, steel cables anchoring the structure. Surrounded by swirling clouds and jagged rocks. The feeling of being on top of the world.' },
      { id: 'rooftop_garden', label: '摩天楼顶层 (Skyscraper Rooftop)', value: 'ARCHITECTURAL STYLE: Cyberpunk Penthouse. Interior of a high-rise luxury apartment. KEY ELEMENTS: Floor-to-ceiling glass looking down at a rainy futuristic city. Neon lights reflecting on wet glass. Modern luxury furniture. Height vertigo.' },

      // =================================================================
      // [VEHICLE] MOVING SANCTUARIES
      // =================================================================
      { id: 'orient_express', label: '东方快车 (Luxury Train)', value: 'ARCHITECTURAL STYLE: 1920s Art Nouveau Train. Interior of a first-class compartment. KEY ELEMENTS: Inlaid marquetry wood, velvet seats, Tiffany lamps, crystal glass. Landscape rushing by horizontally outside the window. Rhythmic motion.' },
      { id: 'scifi_rover', label: '火星漫游车 (Mars Rover)', value: 'ARCHITECTURAL STYLE: NASA/Sci-Fi Utility. Interior of a pressurized rover cockpit. KEY ELEMENTS: Hexagonal reinforced windows, digital HUD displays, white padded walls, joystick controls. Red dust storm outside. Cramped efficiency.' },
      { id: 'camper_van', label: '暴雨露营车 (Van Life)', value: 'ARCHITECTURAL STYLE: Mercedes Sprinter Conversion. Interior of a compact van. KEY ELEMENTS: Back doors open to rain (with net), fairy lights, wood paneling, very small cozy bed. Rain drumming loudly on the metal roof. Parked near nature.' },
      { id: 'rv', label: '末日房车 (Expedition RV)', value: 'ARCHITECTURAL STYLE: 6x6 Overland Truck. Interior of a heavy-duty expedition vehicle. KEY ELEMENTS: Quilted wall insulation, tactical storage nets, high dashboard with navigation screens. Rain on the windshield. Moving through mud.' },
      { id: 'truck', label: '重卡座舱 (Semi Truck)', value: 'ARCHITECTURAL STYLE: American Semi-Truck. Interior of the sleeper cab. KEY ELEMENTS: Driver seat and steering wheel visible, cozy bunk bed behind seats, CB radio. Rain streaking horizontally on the windshield. Highway lights passing.' },
      { id: 'night_bus', label: '夜行巴士 (Night Bus)', value: 'ARCHITECTURAL STYLE: Highway Coach. Interior of a passenger bus at night. KEY ELEMENTS: Rows of empty plush velvet seats, blue aisle floor lights. Rain on the massive panoramic windshield. The driver is a silhouette. Melancholic travel.' },
      { id: 'spaceship', label: '星际飞船 (Spaceship)', value: 'ARCHITECTURAL STYLE: Hard Sci-Fi. Interior of a long-haul spacecraft. KEY ELEMENTS: White padded walls (Kubrick style), hexagonal windows showing starfields or asteroids. Zero-G floating objects (pen, cup). Silent, sterile, hum of life support.' },

      // =================================================================
      // [URBAN] CITY & INDUSTRIAL
      // =================================================================
      { id: 'cyber_pod', label: '赛博胶囊 (Cyberpunk Pod)', value: 'ARCHITECTURAL STYLE: Tokyo Capsule Hotel. Interior of a tiny plastic sleeping pod. KEY ELEMENTS: White molded plastic walls, integrated control panel, one wall is a smart window looking at neon signs. Extremely compact, futuristic coffin.' },
      { id: 'noir_office', label: '侦探事务所 (Noir Office)', value: 'ARCHITECTURAL STYLE: 1940s Film Noir. Interior of a detective agency. KEY ELEMENTS: Frosted glass door with reverse lettering, venetian blinds casting slat shadows, ceiling fan, filing cabinets. Whiskey bottle. Rainy city street outside.' },
      { id: 'server_room', label: '数据中心 (Server Hideout)', value: 'ARCHITECTURAL STYLE: Data Center. Interior of a server aisle. KEY ELEMENTS: Rows of black server racks with blinking green/blue LEDs. A cot set up on the raised floor tiles. Cables everywhere. Cold air conditioning, hum of fans.' },
      { id: 'sewer', label: '改造下水道 (Storm Drain)', value: 'ARCHITECTURAL STYLE: Urban Exploration. Interior of a massive concrete cylindrical pipe. KEY ELEMENTS: Curved concrete walls, graffiti, a stream of water running in the center channel (covered by planks). Echoing acoustics. Ninja Turtles vibe.' },
      { id: 'vault', label: '银行金库 (Bank Vault)', value: 'ARCHITECTURAL STYLE: Bank Strongroom. Interior of a steel vault. KEY ELEMENTS: Walls lined with safety deposit boxes (brass/steel), massive circular gear door (open or closed), piles of cash or gold. Metallic, cold, impenetrable.' },
      { id: 'factory', label: '重工废墟 (Heavy Factory)', value: 'ARCHITECTURAL STYLE: Abandoned Industrial Hall. Interior of a vast factory. KEY ELEMENTS: Sawtooth roof windows, yellow overhead cranes, rusted machinery. The living space is a small "cage" or office elevated on a catwalk. Vast empty space below.' },

      // =================================================================
      // [HISTORICAL] MAGIC & HISTORY
      // =================================================================
      { id: 'alchemy_lab', label: '炼金工坊 (Alchemy Lab)', value: 'ARCHITECTURAL STYLE: Medieval Stone Tower. Interior of a wizard\'s study. KEY ELEMENTS: Rough stone walls, arched window, tables full of bubbling potions and glassware. Dried herbs hanging from rafters. Fireplace with cauldron. Harry Potter vibe.' },
      { id: 'wine_cellar', label: '陈年酒窖 (Wine Cellar)', value: 'ARCHITECTURAL STYLE: Brick Vault. Interior of an underground cellar. KEY ELEMENTS: Curved brick ceiling (barrel vault), rows of dusty wine bottles, large oak barrels. Candlelight reflecting on glass. No windows. Smell of oak and dust.' },
      { id: 'library', label: '古老图书馆 (Grand Library)', value: 'ARCHITECTURAL STYLE: Victorian Gothic. Interior of a massive library hall. KEY ELEMENTS: Floor-to-ceiling dark wood bookshelves, rolling ladders, leather armchairs, dust motes in light shafts. Smell of old paper. Silence.' },
      { id: 'church', label: '末日教堂 (Fortified Church)', value: 'ARCHITECTURAL STYLE: Gothic Cathedral. Interior of the nave. KEY ELEMENTS: Stained glass windows (reinforced with steel bars), stone pillars, pews pushed aside for living space. High vaulted ceiling. Echoing rain sound.' },
      { id: 'attic', label: '秘密阁楼 (Secret Attic)', value: 'ARCHITECTURAL STYLE: Suburban House Attic. Interior under the eaves. KEY ELEMENTS: Exposed insulation, wooden rafters, boxes of Christmas decorations, old dress forms. A small dusty window. The Goonies vibe. Hidden from the house below.' },

      // =================================================================
      // [SURVIVAL] BUNKER & FORTRESS
      // =================================================================
      { id: 'bunker', label: '末日地堡 (Doomsday Bunker)', value: 'ARCHITECTURAL STYLE: Cold War Concrete. Interior of a military bunker. KEY ELEMENTS: Curved concrete ceiling, blast doors with wheels, air filtration pipes, fluorescent lights. No windows (or fake digital windows). Survival supplies stacked.' },
      { id: 'missile_silo', label: '导弹井 (Missile Silo)', value: 'ARCHITECTURAL STYLE: Decommissioned Silo. Interior of a round control room deep underground. KEY ELEMENTS: Metal grating floors, analog computer banks from the 80s, red phones. Echoing metallic space. The ultimate fortress.' },
      { id: 'shipping_container', label: '悬崖集装箱 (Cliff Container)', value: 'ARCHITECTURAL STYLE: Upcycled Industrial. Interior of a shipping container home. KEY ELEMENTS: Corrugated metal walls (painted), narrow width, one end is replaced by a massive glass wall looking at a view. Modern minimalist.' },
      { id: 'cabin', label: '重木小屋 (Log Cabin)', value: 'ARCHITECTURAL STYLE: Rustic Pioneer. Interior of a log cabin. KEY ELEMENTS: Massive round logs visible on walls, stone fireplace, chinking between logs, heavy wooden beams. Bear skin rug. Warm orange light. The classic cozy spot.' },
    ]
  },
  {
    id: 'weather',
    title: '2. 听感纹理 (Sound & Weather)',
    icon: <CloudLightning className="w-4 h-4" />,
    type: 'multi',
    required: true,
    items: [
      // NEW: Normal & Seasonal Weather
      { id: 'sunny', label: '风和日丽 (Sunny)', value: 'bright clear sunny day. Deep blue sky, sharp shadows cast by the sun, sunbeams entering the room. Peaceful nature atmosphere, birds chirping visual vibe' },
      { id: 'overcast', label: '阴郁多云 (Overcast)', value: 'grey overcast sky, diffused flat soft lighting. No rain, dry pavement, mood is calm but slightly gloomy. Stillness in the air' },
      { id: 'cloudy', label: '多云间晴 (Cloudy)', value: 'partly cloudy sky. Dynamic lighting with sun peaking through large white clouds. Dramatic sky texture, dry and comfortable atmosphere' },
      { id: 'breeze', label: '清风徐来 (Breeze)', value: 'gentle breeze blowing. Trees and plants swaying rhythmically outside, curtains fluttering slightly. Dynamic gentle motion, peaceful atmosphere' },
      
      { id: 'spring', label: '早春生机 (Spring)', value: 'fresh spring atmosphere. Blooming flowers and cherry blossoms visible outside. Vibrant green grass, soft warm pastel sunlight. Birdsong vibe' },
      { id: 'summer', label: '盛夏午后 (Summer)', value: 'mid-summer atmosphere. Intense bright sunlight, deep green vegetation, heat haze visible. The feeling of a hot lazy afternoon, cicadas buzzing' },
      { id: 'autumn', label: '深秋落叶 (Autumn)', value: 'golden autumn atmosphere. Orange and red maple leaves falling from trees. Golden hour lighting, dry crisp cool air. Melancholic beauty' },
      { id: 'winter', label: '冬日暖阳 (Winter)', value: 'clear winter day without snow falling. Frost on the window pane, barren trees outside. Cold blue sky but bright low sun. Crisp cold air visual' },

      // Existing Heavy/Sci-Fi Weather
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
      { id: 'sunny_day', label: '晴朗正午 (Sunny Day)', value: 'bright clear sunny day with blue sky, sharp defined shadows, high visibility, vibrant natural colors, optimistic atmosphere' },
      { id: 'golden_hour', label: '日落金光 (Golden Hour)', value: 'magical golden hour lighting, low sun casting long horizontal shadows, warm orange and gold hues filling the room, cinematic dust motes dancing in sunbeams' },
      { id: 'soft_day', label: '柔和白昼 (Soft Daylight)', value: 'bright but diffused daylight, soft shadows, airy and fresh atmosphere, neutral white light balance, perfect visibility' },
      { id: 'morning', label: '清晨微光 (Blue Hour)', value: 'early morning blue hour, cold light, frost on windows, peaceful silence' },
      { id: 'noon', label: '阴霾正午 (Overcast)', value: 'diffused flat daylight, grey overcast sky, gloomy atmosphere, soft shadows' },
      { id: 'night', label: '漆黑深夜 (Pitch Black)', value: 'pitch black night, zero ambient light outside, only interior warmth visible' },
      { id: 'moonlight', label: '皓月当空 (Full Moon)', value: 'cold silver moonlight illuminating the landscape, eerie blue shadows, sharp contrast' },
      { id: 'floodlight', label: '工业泛光 (Floodlight)', value: 'harsh artificial halogen floodlight illuminating the rain in a specific cone, rest is pitch black, industrial safety feel' },
      { id: 'emergency', label: '警报红光 (Emergency Red)', value: 'rotating emergency red warning lights creating a tense but secure atmosphere, submarine mode' },
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
      { id: 'heated_floor', label: '地暖系统 (Heated Floor)', value: 'invisible underfloor heating system radiating gentle warmth upwards, keeping the floor dry and cozy to the touch' },
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
      
      // --- LOFI MUSICIANS (NEW) ---
      { 
        id: 'lofi_pianist', 
        label: '海上钢琴师 (Ocean Pianist)', 
        value: '[LoFi Aesthetic] Night. An elegant adult male pianist sitting at an old upright piano INSIDE the dry cabin of a boat. Head bowed, focused on playing. Through the window, we see the deep blue ocean and rain. Blue-green color palette, grainy texture, melancholic and lonely atmosphere. The pianist is dry and warm.' 
      },
      { 
        id: 'lofi_guitarist', 
        label: '吉他手-背影 (Guitarist Back)', 
        value: '[LoFi Aesthetic] View from behind. An adult guitarist sitting INSIDE on the edge of a bed, facing the warm heater. The silhouette is outlined by the orange glow. Strumming motion is visible in the shoulder movement, but hands are obscured by the body angle. Introspective and private.' 
      },
      { 
        id: 'lofi_flamenco', 
        label: '弗拉明戈-侧影 (Flamenco Side)', 
        value: '[LoFi Aesthetic] Side profile view. A beautiful adult woman playing Flamenco guitar standing INSIDE the room, next to a closed glass door looking out at the heavy storm. The red shawl flutters. The guitar body hides the intricate fingerwork. Focus on the posture. She is safe and dry inside.' 
      },
      { 
        id: 'lofi_flutist', 
        label: '长笛手-侧影 (Flutist Side)', 
        value: '[LoFi Aesthetic] Side view silhouette against the window. An elegant adult woman sitting on the wooden floor INSIDE the room playing the flute. Looking out at the rain. The hands are small and mostly hidden by the angle of the flute. Soft yellow interior light. Quiet, peaceful.' 
      },
      { 
        id: 'lofi_violinist', 
        label: '小提琴-背影 (Violinist Back)', 
        value: '[LoFi Aesthetic] View from the back. A handsome adult male violinist standing INSIDE the room, directly in front of a large rain-streaked window. Facing the storm but protected by glass. The silhouette is elegant. The bow arm moves rhythmically up and down. Deep emotional atmosphere.' 
      },
      { 
        id: 'lofi_cellist', 
        label: '大提琴-侧背 (Cellist Side/Back)', 
        value: '[LoFi Aesthetic] Angled side view, almost from behind. An adult female cellist sitting in a dark corner INSIDE the shelter. The body blocks the view of the strings. We see the rhythmic motion of the bowing arm and the swaying of the shoulders. Deep shadows and dust motes.' 
      },

      // --- STANDARD ACTIONS ---
      { id: 'deep_sleep', label: '深沉睡眠 (Deep Sleep)', value: 'A survivor sleeping deeply in the comfortable nest, wrapped in heavy blankets. Only the rhythmic rising and falling of their chest is visible. Face partially hidden or peaceful. Absolute safety and exhaustion. The figure is integrated into the bedding' },
      { id: 'cooking_stew', label: '搅拌热汤 (Cooking Stew)', value: 'Back view of a survivor standing at the stove/hearth, slowly stirring a steaming pot of stew with a wooden spoon. Relaxed posture, focused on the food. Steam rising rhythmically. Homey atmosphere' },
      { id: 'retro_gaming', label: '复古游戏 (Retro Gaming)', value: 'A survivor sitting on the floor rug, back to camera, playing a vintage game console on a small CRT TV. The blue light from the screen flickers on their silhouette. Relaxed gaming posture' },
      { id: 'playing_cards', label: '双人牌局 (Playing Cards)', value: 'Two survivors sitting opposite each other at a low table, playing cards. Focus on the table and hands. One is dealing cards, the other holding a hand. Quiet social moment, faces in shadow' },
      { id: 'polishing_gear', label: '擦拭装备 (Maintenance)', value: 'A survivor sitting in an armchair, slowly polishing a rifle or a helmet with a cloth. Methodical, rhythmic motion. Sense of preparation and care. Tools spread on the table' },
      { id: 'reading_nook', label: '窗边阅读 (Reading)', value: 'A survivor sitting in the window nook, holding a hardcover book. Soft light from the window illuminates the page. Occasional page turn. Peaceful intellectual vibe' },
      { id: 'writing_diary', label: '书写日记 (Journaling)', value: 'Close up on a survivor sitting at a desk, writing in a leather-bound journal with a pen. Hand moving across the paper. Recording the days events. Introspective vibe' },
      { id: 'knitting', label: '编织毛衣 (Knitting)', value: 'Close up on hands knitting a thick wool blanket or scarf. Rhythmic clicking of needles. Cozy domestic vibe, creating warmth' },
      { id: 'guitar_strum', label: '弹奏吉他 (Guitar)', value: 'A figure sitting on the rug gently strumming an acoustic guitar (visual only, imply sound). Head down, lost in music. Relaxed posture' },
      { id: 'window_trace', label: '触碰雨滴 (Window Trace)', value: 'Silhouette of a person leaning against the glass from the INSIDE, tracing the path of a raindrop with their finger. Melancholic and contemplative pose. Connection with the storm but physically separated' },
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
    title: '11. 美食与软装 (Amenities)',
    icon: <Package className="w-4 h-4" />,
    type: 'multi',
    items: [
      // MEALS - HEARTY
      { id: 'steak_dinner', label: '战斧牛排 (Tomahawk Steak)', value: 'Sizzling cast iron skillet with a massive Tomahawk steak, rosemary sprigs, garlic butter melting, roasted potatoes, red wine glass nearby' },
      { id: 'roast_chicken', label: '烤全鸡 (Roast Chicken)', value: 'Golden brown roast chicken on a platter, steam rising, surrounded by roasted vegetables, lemons, and herbs, sunday dinner vibe' },
      { id: 'bbq_ribs', label: '美式烤排 (BBQ Ribs)', value: 'Rack of sticky glazed BBQ ribs, coleslaw, corn on the cob, cold beer bottle with condensation, rustic feast' },
      { id: 'sausages', label: '德式香肠 (Grilled Sausages)', value: 'Platter of assorted grilled sausages, sauerkraut, pretzels, and mugs of foaming amber beer, warm pub atmosphere' },
      
      // MEALS - ASIAN & HOT
      { id: 'hot_pot', label: '重庆火锅 (Spicy Hot Pot)', value: 'Bubbling spicy red hot pot in the center of the table, plates of sliced wagyu beef, lotus root, and tofu arranged around it, steam filling the air' },
      { id: 'dim_sum', label: '广式早茶 (Dim Sum)', value: 'Bamboo steamer baskets stacked high containing shrimp dumplings (har gow) and pork buns, tea pot, chili oil dipping sauce' },
      { id: 'pho', label: '越南河粉 (Pho)', value: 'Large ceramic bowl of Pho with rare beef slices, fresh basil, bean sprouts, lime wedges, hoisin sauce, aromatic steam' },
      { id: 'bibimbap', label: '石锅拌饭 (Bibimbap)', value: 'Hot stone bowl with rice, assorted colorful vegetables, fried egg on top, gochujang sauce, sizzling sound visual' },
      
      // MEALS - SEAFOOD & LUXURY
      { id: 'seafood_boil', label: '海鲜大咖 (Seafood Boil)', value: 'Table covered in newspaper piled high with boiled crawfish, crab legs, corn, and potatoes, lemon wedges, cajun spice visual' },
      { id: 'lobster', label: '黄油龙虾 (Grilled Lobster)', value: 'Whole grilled lobster with melted garlic butter dipping sauce, asparagus, white wine, luxury dining' },
      { id: 'oysters', label: '冰镇生蚝 (Oysters)', value: 'Silver platter with fresh oysters on crushed ice, lemon wedges, tabasco sauce, glass of champagne' },
      
      // SWEETS & SNACKS
      { id: 'pancakes', label: '松饼塔 (Pancakes)', value: 'Tall stack of fluffy pancakes dripping with maple syrup and melting butter, fresh berries on top, breakfast vibe' },
      { id: 'donuts', label: '甜甜圈盒 (Donuts)', value: 'Open pink box filled with assorted colorful glazed donuts, sprinkles, chocolate frosted, coffee cup nearby' },
      { id: 'popcorn', label: '爆米花桶 (Popcorn)', value: 'Large bucket of buttery movie theater popcorn, spilled slightly on the table, soda cup with straw, movie night vibe' },
      { id: 'ice_cream', label: '圣代冰激凌 (Sundae)', value: 'Tall glass ice cream sundae with chocolate sauce, whipped cream, and a cherry on top, melting slightly' },
      { id: 'fruit_platter', label: '热带果盘 (Fruit Platter)', value: 'Lush platter of cut tropical fruits: watermelon, pineapple, mango, grapes, refreshing contrast to the cozy room' },

      // DRINKS (Existing kept for utility)
      { id: 'tea_set', label: '热茶套组 (Steaming Tea)', value: 'In the foreground, a low wooden table with a steaming ceramic teapot and delicate cups, hot white steam rising vigorously' },
      { id: 'coffee', label: '手冲咖啡 (Pour-over)', value: 'Close-up on a glass chemex coffee maker and a ceramic mug with fresh dark coffee steaming on the side table' },
      { id: 'cocoa', label: '热可可 (Hot Cocoa)', value: 'Mug of hot chocolate topped with marshmallows and whipped cream, steam rising, cozy winter vibe' },
      { id: 'whiskey', label: '威士忌 (Whiskey)', value: 'Crystal glass with amber whiskey and a large ice cube, vintage bottle next to it, cigar smoke in ashtray' },
      { id: 'wine_cheese', label: '红酒芝士 (Wine & Cheese)', value: 'Bottle of red wine breathing in a decanter, glass of wine, wooden board with artisanal cheese and grapes' },
      
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
  // NEW: SOFT TEXTURES (The "Warmth" Solution)
  // ========================================================================
  {
    id: 'textures',
    title: '12. 极致触感 (Soft Textures)',
    icon: <Feather className="w-4 h-4" />,
    type: 'multi',
    required: false,
    items: [
      { id: 'plush_carpet', label: '长毛地毯 (Plush Carpet)', value: 'Wall-to-wall high-pile beige plush carpet covering the entire floor. Soft, warm, and dry. No cold tiles visible. Sinking feet sensation.' },
      { id: 'sheepskin', label: '羊皮皮草 (Sheepskins)', value: 'Multiple white fluffy sheepskin rugs layered on the floor and chairs. Soft organic textures, warm white tones, maximizing coziness.' },
      { id: 'wood_floor', label: '温润木板 (Wood Floor)', value: 'Warm honey-colored polished hardwood flooring. Dry, smooth, and inviting. No cold stone or tiles.' },
      { id: 'chunky_knit', label: '粗棒针织 (Chunky Knit)', value: 'Giant chunky knit merino wool blankets draped over everything. Oversized texture, extreme softness, tactile comfort.' },
      { id: 'velvet_drapes', label: '丝绒重帘 (Velvet Drapes)', value: 'Heavy burgundy velvet curtains hanging floor to ceiling. Thick fabric texture, sound dampening, insulating against the cold window.' },
      { id: 'beanbag', label: '懒人豆袋 (Bean Bag)', value: 'Oversized soft fabric bean bag chair sinking into the floor. Casual, unstructured comfort, inviting relaxation.' },
      { id: 'tapestry', label: '挂毯壁饰 (Wall Tapestry)', value: 'Intricate woven fabric tapestries hanging on the walls to cover cold surfaces. Adding insulation and softness to the vertical space.' },
      { id: 'warm_lighting', label: '暖黄氛围 (Warm Glow)', value: 'The entire room is bathed in a dedicated warm amber light (2700K). Enhancing the feeling of heat and dryness.' },
      { id: 'cushion_pile', label: '枕头堆 (Cushion Pile)', value: 'A massive pile of assorted soft velvet and fur cushions in the corner, creating a dedicated soft landing spot.' },
    ]
  },

  // ========================================================================
  // 6. 镜头语言 (THE LENS)
  // ========================================================================
  {
    id: 'perspective',
    title: '13. 镜头视角 (Perspective)',
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
      
      // NEW: DRONE PERSPECTIVES (Inside vs Outside Contrast)
      { id: 'drone_god', label: '无人机-上帝俯视 (Drone God View)', value: 'High-altitude drone shot looking down at the shelter amidst the vast stormy landscape. The roof and surrounding terrain are visible. Through a skylight or large window, the warm glowing interior and the tiny survivor are visible, creating a massive contrast between the cold vastness outside and the warm safety inside.' },
      
      // REFINED: Drone Level Hover (Was Peek)
      { id: 'drone_peek', label: '无人机-悬停平视 (Drone Level Hover)', value: 'Cinematic drone shot hovering in mid-air OUTSIDE the shelter. The camera is OUTSIDE looking IN through the window or balcony. We see the rain/snow falling between the lens and the glass. The shot frames the entire window, clearly showing the warm interior life inside.' },
      
      { id: 'drone_orbit', label: '无人机-中景环绕 (Drone Orbit)', value: 'Cinematic mid-range drone shot orbiting the shelter at a 45-degree angle. Capturing the structural details of the hideout against the harsh weather, while simultaneously framing the large window that reveals the full interior layout and life inside. Establishing the isolated location.' },
      
      // REPLACED: Drone 45° Cinematic (Was Top-Down)
      { id: 'drone_cinematic_45', label: '无人机-45度侧俯 (Drone 45° Side)', value: 'Classic cinematic drone establishing shot from a 45-degree elevated angle. Capturing the corner of the shelter structure, showing both the roof texture and the lit window side simultaneously. The shelter sits isolated in the vast stormy landscape. Depth and scale.' },
    ]
  },
  {
    id: 'shot_type',
    title: '14. 镜头距离 (Shot Size)',
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
    title: '15. 视觉风格 (Visual Style)',
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
      { id: 'cozy_travel', label: '旅途/专注 (Travel/Focus)', value: 'lofi' },
      { id: 'cozy_safe', label: '安全/睡眠 (Safe/Sleep)', value: 'cozy' },
      // JAN 2026 NARRATIVE STRATEGY VIBES (Triggers specific SEO templates)
      { id: 'narrative_scientist', label: '叙事: 海洋学家 (Scientist)', value: 'Marine Scientist Safe Haven' },
      { id: 'narrative_refugee', label: '叙事: 避难者 (Refugee)', value: 'Refugee First Safe Night' },
      { id: 'narrative_fugitive', label: '悬疑: 亡命天涯 (The Fugitive)', value: 'Fugitive Rest Storm Guardian' }, 
      { id: 'narrative_fresh_start', label: '叙事: 重获新生 (Fresh Start)', value: 'Fresh Start After Loss' },
      { id: 'narrative_nomad', label: '叙事: 漂泊游牧 (The Nomad)', value: 'Nomad Haven Home' },
    ]
  },
  {
    id: 'duration',
    title: '时长策略 (Duration)',
    icon: <Hourglass className="w-4 h-4" />,
    type: 'single',
    required: true,
    items: [
      { id: '2h', label: '2 Hours (Nap/Focus)', value: '2 Hours' },
      { id: '8h', label: '8 Hours (Deep Sleep)', value: '8 Hours' },
    ]
  },
];
