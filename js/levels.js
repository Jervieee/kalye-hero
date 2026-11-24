// Handcrafted Mario-Inspired Philippine Street Stages
const Levels = (() => {
  const GROUND_Y = 540;
  const BLOCK_SIZE = 44;

  function coinRow(startX, y, count, gap = 38) {
    const out = [];
    for (let i = 0; i < count; i++) {
      out.push({ x: startX + i * gap, y, type: 'coin' });
    }
    return out;
  }

  function coinArc(centerX, peakY, count = 5, spread = 42) {
    const out = [];
    const half = (count - 1) / 2;
    for (let i = 0; i < count; i++) {
      const n = (i - half) / (half || 1);
      out.push({
        x: centerX + (i - half) * spread,
        y: peakY + n * n * 48,
        type: 'coin'
      });
    }
    return out;
  }

  function buildStage1() {
    // STAGE 1: BARANGAY KALYE (Sunny Manila Street)
    const platforms = [
      // Ground street segments (with classic Mario drainage gaps)
      { x: 0, y: GROUND_Y, w: 1250, h: 90, style: 'street' },
      { x: 1380, y: GROUND_Y, w: 1080, h: 90, style: 'street' },
      { x: 2600, y: GROUND_Y, w: 1200, h: 90, style: 'street' },

      // Iconic Jeepneys (bouncy roofs!)
      { x: 760, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'CUBAO · QUIAPO', color: '#ef4444' },
      { x: 1890, y: GROUND_Y - 82, w: 205, h: 82, style: 'jeepney', bouncy: true, route: 'TAFT · BACLARAN', color: '#2563eb' },
      { x: 2980, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'RECTO · DIVISORIA', color: '#f59e0b' },

      // Tricycle (bouncy roof!)
      { x: 1510, y: GROUND_Y - 68, w: 118, h: 68, style: 'tricycle', bouncy: true },

      // Elevated awnings & barangay footbridge platforms
      { x: 1020, y: 375, w: 165, h: 24, style: 'awning' },
      { x: 1680, y: 360, w: 170, h: 24, style: 'bridge' },
      { x: 2180, y: 350, w: 210, h: 24, style: 'bridge' },
      { x: 2480, y: 420, w: 120, h: 24, style: 'awning' },
      { x: 3220, y: 355, w: 175, h: 24, style: 'bridge' }
    ];

    const blocks = [
      // Opening tutorial ? blocks (Energy & First Street Pistol!)
      { x: 330, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 374, y: 410, size: BLOCK_SIZE, type: 'crate' },
      { x: 418, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 462, y: 410, size: BLOCK_SIZE, type: 'crate' },

      // Over jeepney 1
      { x: 830, y: 315, size: BLOCK_SIZE, type: 'question', reward: 'coin' },
      { x: 874, y: 315, size: BLOCK_SIZE, type: 'question', reward: 'energy' },

      // Mid-street crates & Spread Blaster upgrade!
      { x: 1460, y: 405, size: BLOCK_SIZE, type: 'crate' },
      { x: 1504, y: 405, size: BLOCK_SIZE, type: 'question', reward: 'coin' },
      { x: 1735, y: 240, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },

      // Before gap 2
      { x: 2240, y: 230, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 2284, y: 230, size: BLOCK_SIZE, type: 'question', reward: 'energy' },

      // Final stretch supply boxes
      { x: 2740, y: 410, size: BLOCK_SIZE, type: 'crate' },
      { x: 2784, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 2828, y: 410, size: BLOCK_SIZE, type: 'crate' },
      { x: 3285, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'energy' }
    ];

    const pickups = [
      { x: 185, y: 488, type: 'gun' },
      ...coinRow(245, 488, 3),
      { x: 560, y: 488, type: 'energy' },
      ...coinArc(855, 360, 5, 38),
      { x: 1120, y: 325, type: 'cash' },
      ...coinRow(1045, 330, 3, 34),
      ...coinArc(1315, 420, 4, 38),
      { x: 1475, y: 488, type: 'gun' },
      ...coinRow(1710, 315, 3, 40),
      ...coinArc(1990, 350, 5, 40),
      { x: 2290, y: 300, type: 'cash' },
      ...coinRow(2205, 305, 3, 38),
      ...coinArc(2540, 340, 4, 40),
      { x: 2700, y: 488, type: 'blaster' },
      ...coinRow(3245, 310, 4, 36)
    ];

    const enemies = [
      { x: 640, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 1070, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 1120, y: 375 - 52, type: 'snatcher' },
      { x: 1620, y: GROUND_Y - 52, type: 'runner' },
      { x: 1810, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 2140, y: GROUND_Y - 52, type: 'thug' },
      { x: 2280, y: 350 - 52, type: 'snatcher' },
      { x: 2760, y: GROUND_Y - 52, type: 'runner' },
      { x: 2910, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 3300, y: GROUND_Y - 52, type: 'thug' }
    ];

    return {
      index: 0,
      name: 'STAGE 1 · BARANGAY KALYE',
      theme: 'day',
      width: 3800,
      goalX: 3560,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage2() {
    // STAGE 2: DIVISORIA MARKET RUSH (Golden Hour Sunset!)
    const platforms = [
      { x: 0, y: GROUND_Y, w: 960, h: 90, style: 'street' },
      { x: 1100, y: GROUND_Y, w: 860, h: 90, style: 'street' },
      { x: 2100, y: GROUND_Y, w: 920, h: 90, style: 'street' },
      { x: 3170, y: GROUND_Y, w: 1030, h: 90, style: 'street' },

      // Jeepneys & Tricycles
      { x: 540, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'DIVISORIA · RECTO', color: '#ec4899' },
      { x: 1420, y: GROUND_Y - 68, w: 118, h: 68, style: 'tricycle', bouncy: true },
      { x: 2440, y: GROUND_Y - 82, w: 205, h: 82, style: 'jeepney', bouncy: true, route: 'QUIAPO · ESPAÑA', color: '#10b981' },
      { x: 3420, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'MONUMENTO · EDSA', color: '#ef4444' },

      // Market awnings & LRT overpass footbridges
      { x: 830, y: 390, w: 180, h: 24, style: 'awning' },
      { x: 1180, y: 360, w: 185, h: 24, style: 'bridge' },
      { x: 1620, y: 330, w: 215, h: 24, style: 'bridge' },
      { x: 1980, y: 425, w: 145, h: 24, style: 'awning' },
      { x: 2740, y: 345, w: 210, h: 24, style: 'bridge' },
      { x: 3040, y: 415, w: 145, h: 24, style: 'awning' }
    ];

    const blocks = [
      { x: 260, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 304, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 348, y: 410, size: BLOCK_SIZE, type: 'crate' },

      { x: 895, y: 265, size: BLOCK_SIZE, type: 'question', reward: 'coin' },
      { x: 1245, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 1289, y: 235, size: BLOCK_SIZE, type: 'crate' },

      { x: 1690, y: 210, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 1734, y: 210, size: BLOCK_SIZE, type: 'question', reward: 'heart' },

      { x: 2240, y: 410, size: BLOCK_SIZE, type: 'crate' },
      { x: 2284, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 2328, y: 410, size: BLOCK_SIZE, type: 'crate' },

      { x: 2820, y: 225, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 3290, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 3334, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      { x: 165, y: 488, type: 'gun' },
      ...coinRow(220, 488, 3),
      ...coinArc(635, 355, 5, 38),
      ...coinArc(1030, 395, 4, 38),
      { x: 1295, y: 488, type: 'blaster' },
      ...coinRow(1655, 285, 4, 42),
      ...coinArc(2045, 340, 4, 38),
      ...coinArc(2540, 350, 5, 40),
      { x: 2690, y: 488, type: 'gun' },
      ...coinRow(2770, 300, 4, 42),
      { x: 3100, y: 370, type: 'energy' },
      ...coinArc(3515, 350, 5, 38)
    ];

    const enemies = [
      { x: 450, y: GROUND_Y - 52, type: 'runner' },
      { x: 880, y: 390 - 52, type: 'thug' },
      { x: 1230, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 1580, y: GROUND_Y - 52, type: 'runner' },
      { x: 1710, y: 330 - 52, type: 'thug' },
      { x: 1860, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 2220, y: GROUND_Y - 52, type: 'runner' },
      { x: 2370, y: GROUND_Y - 52, type: 'thug' },
      { x: 2820, y: 345 - 52, type: 'thug' },
      { x: 2910, y: GROUND_Y - 52, type: 'runner' },
      { x: 3310, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 3680, y: GROUND_Y - 52, type: 'thug' }
    ];

    return {
      index: 1,
      name: 'STAGE 2 · DIVISORIA RUSH',
      theme: 'sunset',
      width: 4200,
      goalX: 3960,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage3() {
    // STAGE 3: MIDNIGHT MANILA SHOWDOWN + BOSS MANDURUKOT!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1050, h: 90, style: 'street' },
      { x: 1180, y: GROUND_Y, w: 920, h: 90, style: 'street' },
      // Wide Boss Arena stretch!
      { x: 2230, y: GROUND_Y, w: 1620, h: 90, style: 'street' },

      // Jeepneys & Tricycles
      { x: 580, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'EDSA · NIGHT PATROL', color: '#7c3aed' },
      { x: 1580, y: GROUND_Y - 68, w: 118, h: 68, style: 'tricycle', bouncy: true },

      // Mid platforms
      { x: 860, y: 385, w: 175, h: 24, style: 'bridge' },
      { x: 1290, y: 365, w: 195, h: 24, style: 'bridge' },
      { x: 1810, y: 370, w: 205, h: 24, style: 'awning' },

      // Boss Arena side platforms (tactical high ground!)
      { x: 2560, y: 395, w: 170, h: 24, style: 'bridge' },
      { x: 2990, y: 395, w: 170, h: 24, style: 'bridge' }
    ];

    const blocks = [
      { x: 250, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 294, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 920, y: 260, size: BLOCK_SIZE, type: 'question', reward: 'heart' },

      { x: 1360, y: 240, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 1404, y: 240, size: BLOCK_SIZE, type: 'question', reward: 'gun' },

      { x: 1890, y: 245, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },

      // Boss arena emergency resupply boxes!
      { x: 2620, y: 270, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 2840, y: 335, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 3050, y: 270, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      { x: 165, y: 488, type: 'blaster' },
      ...coinRow(220, 488, 3),
      ...coinArc(675, 355, 5, 38),
      ...coinArc(1115, 395, 4, 38),
      { x: 1380, y: 488, type: 'gun' },
      ...coinRow(1320, 320, 4, 40),
      ...coinArc(2165, 395, 4, 38),
      { x: 2460, y: 488, type: 'energy' },
      { x: 2520, y: 488, type: 'blaster' },
      { x: 3220, y: 488, type: 'energy' }
    ];

    const enemies = [
      { x: 470, y: GROUND_Y - 52, type: 'runner' },
      { x: 910, y: 385 - 52, type: 'thug' },
      { x: 1290, y: GROUND_Y - 52, type: 'runner' },
      { x: 1480, y: GROUND_Y - 52, type: 'snatcher' },
      { x: 1870, y: 370 - 52, type: 'thug' },
      { x: 1960, y: GROUND_Y - 52, type: 'runner' },
      // THE BOSS MANDURUKOT!
      { x: 2940, y: GROUND_Y - 86, type: 'boss', arenaMinX: 2360, arenaMaxX: 3320 }
    ];

    return {
      index: 2,
      name: 'STAGE 3 · MIDNIGHT BOSS',
      theme: 'night',
      width: 3850,
      goalX: 3600,
      bossStage: true,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage4() {
    // STAGE 4: MALACAÑANG, MANILA — CROCODILE BARONG THIEVES & DON BUWAYA!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1120, h: 90, style: 'palace' },
      { x: 1250, y: GROUND_Y, w: 1020, h: 90, style: 'palace' },
      // Grand Malacañang Courtyard Boss Arena!
      { x: 2400, y: GROUND_Y, w: 1680, h: 90, style: 'palace' },

      // Bouncy Black VIP Palace SUVs & Ceremonial Jeepney
      { x: 640, y: GROUND_Y - 76, w: 190, h: 76, style: 'suv', bouncy: true },
      { x: 1620, y: GROUND_Y - 76, w: 190, h: 76, style: 'suv', bouncy: true },
      { x: 2630, y: GROUND_Y - 76, w: 185, h: 76, style: 'suv', bouncy: true },

      // White & Gold Palace Marble Balconies
      { x: 920, y: 380, w: 185, h: 24, style: 'marble' },
      { x: 1360, y: 365, w: 195, h: 24, style: 'marble' },
      { x: 1900, y: 350, w: 220, h: 24, style: 'marble' },
      { x: 2260, y: 420, w: 130, h: 24, style: 'marble' },
      // Courtyard Boss Tactical Balconies
      { x: 2920, y: 385, w: 175, h: 24, style: 'marble' },
      { x: 3310, y: 385, w: 175, h: 24, style: 'marble' }
    ];

    const blocks = [
      // Opening Palace Supply Boxes (Gun + Energy + Cash!)
      { x: 260, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 304, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'cash' },
      { x: 348, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 392, y: 410, size: BLOCK_SIZE, type: 'crate' },

      // Balcony 1 & 2
      { x: 990, y: 255, size: BLOCK_SIZE, type: 'question', reward: 'cash' },
      { x: 1425, y: 240, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 1469, y: 240, size: BLOCK_SIZE, type: 'question', reward: 'energy' },

      // Balcony 3 Treasure Stash
      { x: 1965, y: 225, size: BLOCK_SIZE, type: 'question', reward: 'cash' },
      { x: 2009, y: 225, size: BLOCK_SIZE, type: 'question', reward: 'heart' },

      // Malacañang Boss Courtyard Emergency Resupply Boxes!
      { x: 2980, y: 260, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 3160, y: 325, size: BLOCK_SIZE, type: 'question', reward: 'energy' },
      { x: 3375, y: 260, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      // Opening Baril + Coins & Cash Trail!
      { x: 155, y: 488, type: 'blaster' },
      ...coinRow(210, 488, 3),
      { x: 470, y: 488, type: 'cash' },
      { x: 540, y: 488, type: 'energy' },

      // Over VIP SUV 1
      ...coinArc(735, 345, 5, 38),
      { x: 960, y: 335, type: 'cash' },
      ...coinRow(1005, 335, 3, 34),

      // Over Gap 1
      ...coinArc(1185, 405, 4, 38),

      // Mid Palace Boulevard Coins, Baril & Cash!
      { x: 1310, y: 488, type: 'gun' },
      { x: 1390, y: 320, type: 'cash' },
      ...coinRow(1440, 320, 3, 34),
      ...coinArc(1715, 345, 5, 38),
      { x: 1945, y: 305, type: 'cash' },
      { x: 2025, y: 305, type: 'cash' },

      // Over Gap 2 into Malacañang Courtyard
      ...coinArc(2325, 355, 4, 38),
      { x: 2510, y: 488, type: 'energy' },
      { x: 2560, y: 488, type: 'cash' },
      { x: 2610, y: 488, type: 'blaster' },
      { x: 3530, y: 488, type: 'energy' }
    ];

    const enemies = [
      // Crocodile-Headed Thieves in Barong Tagalog!
      { x: 520, y: GROUND_Y - 56, type: 'croc_thief' },
      { x: 960, y: 380 - 56, type: 'croc_vip' },
      { x: 1030, y: GROUND_Y - 56, type: 'croc_thief' },
      { x: 1390, y: GROUND_Y - 56, type: 'croc_thief' },
      { x: 1470, y: 365 - 56, type: 'croc_vip' },
      { x: 1850, y: GROUND_Y - 56, type: 'croc_thief' },
      { x: 2010, y: 350 - 56, type: 'croc_vip' },
      { x: 2150, y: GROUND_Y - 56, type: 'croc_thief' },
      // THE PALACE BOSS: DON BUWAYA (Giant Crocodile in Barong!)
      { x: 3260, y: GROUND_Y - 90, type: 'croc_boss', arenaMinX: 2540, arenaMaxX: 3580 }
    ];

    return {
      index: 3,
      name: 'STAGE 4 · MALACAÑANG MANILA',
      theme: 'malacanang',
      width: 4080,
      goalX: 3840,
      bossStage: true,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage5() {
    // STAGE 5: THE PASIG RIVER — Big Magnanakaw with Knife, Boost Knife, Baril & 3 Hearts!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1120, h: 90, style: 'boardwalk' },
      { x: 1270, y: GROUND_Y, w: 1080, h: 90, style: 'boardwalk' },
      { x: 2500, y: GROUND_Y, w: 1380, h: 90, style: 'boardwalk' },

      // Bouncy Pasig River Ferry Boats!
      { x: 650, y: GROUND_Y - 72, w: 195, h: 72, style: 'ferry', bouncy: true },
      { x: 1740, y: GROUND_Y - 72, w: 195, h: 72, style: 'ferry', bouncy: true },
      { x: 2880, y: GROUND_Y - 72, w: 195, h: 72, style: 'ferry', bouncy: true },

      // Elevated River Bridges
      { x: 960, y: 375, w: 190, h: 24, style: 'bridge' },
      { x: 1460, y: 360, w: 195, h: 24, style: 'bridge' },
      { x: 2050, y: 350, w: 205, h: 24, style: 'bridge' },
      { x: 2370, y: 420, w: 135, h: 24, style: 'bridge' },
      { x: 3180, y: 360, w: 190, h: 24, style: 'bridge' }
    ];

    const blocks = [
      { x: 250, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 294, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'gun' },
      { x: 338, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 1030, y: 250, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 1525, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 2120, y: 225, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 2710, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 3250, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'blaster' }
    ];

    const pickups = [
      // Immediate Boost Knife + Baril + 3 Claimable Hearts across Pasig River!
      { x: 150, y: 488, type: 'knife' },
      { x: 205, y: 488, type: 'gun' },
      { x: 430, y: 488, type: 'heart' },
      ...coinArc(745, 345, 5, 38),
      { x: 1010, y: 330, type: 'cash' },
      { x: 1340, y: 488, type: 'blaster' },
      { x: 1510, y: 315, type: 'heart' },
      ...coinArc(1835, 345, 5, 38),
      { x: 2095, y: 305, type: 'knife' },
      { x: 2610, y: 488, type: 'heart' },
      { x: 2665, y: 488, type: 'energy' },
      ...coinArc(2975, 345, 5, 38),
      { x: 3225, y: 315, type: 'cash' }
    ];

    const enemies = [
      { x: 540, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 1020, y: 375 - 64, type: 'big_knife_thief' },
      { x: 1410, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 1620, y: GROUND_Y - 52, type: 'runner' },
      { x: 2090, y: 350 - 64, type: 'big_knife_thief' },
      { x: 2210, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 2740, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 3180, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 3390, y: GROUND_Y - 64, type: 'big_knife_thief' }
    ];

    return {
      index: 4,
      name: 'STAGE 5 · THE PASIG RIVER',
      theme: 'pasig',
      width: 3880,
      goalX: 3640,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage6() {
    // STAGE 6: ILOCOS NORTE — Armed Drug Addict Enemies with Gun & Knife!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1060, h: 90, style: 'sandroad' },
      { x: 1210, y: GROUND_Y, w: 1080, h: 90, style: 'sandroad' },
      { x: 2440, y: GROUND_Y, w: 1480, h: 90, style: 'sandroad' },

      { x: 610, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'LAOAG · BANGUI', color: '#f97316' },
      { x: 1680, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'PAOAY · VIGAN', color: '#0284c7' },
      { x: 2860, y: GROUND_Y - 82, w: 195, h: 82, style: 'jeepney', bouncy: true, route: 'ILOCOS EXPRESS', color: '#ef4444' },

      { x: 890, y: 375, w: 185, h: 24, style: 'awning' },
      { x: 1380, y: 360, w: 205, h: 24, style: 'bridge' },
      { x: 1980, y: 350, w: 210, h: 24, style: 'bridge' },
      { x: 2300, y: 420, w: 140, h: 24, style: 'awning' },
      { x: 3170, y: 355, w: 200, h: 24, style: 'bridge' }
    ];

    const blocks = [
      { x: 240, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 284, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 328, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 1445, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 2045, y: 225, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 2680, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 3235, y: 230, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      { x: 155, y: 488, type: 'blaster' },
      { x: 205, y: 488, type: 'knife' },
      ...coinArc(705, 345, 5, 38),
      { x: 940, y: 330, type: 'heart' },
      { x: 1300, y: 488, type: 'energy' },
      { x: 1435, y: 315, type: 'cash' },
      ...coinArc(1775, 345, 5, 38),
      { x: 2020, y: 305, type: 'heart' },
      { x: 2560, y: 488, type: 'blaster' },
      { x: 2615, y: 488, type: 'knife' },
      ...coinArc(2955, 345, 5, 38),
      { x: 3220, y: 310, type: 'cash' }
    ];

    const enemies = [
      { x: 500, y: GROUND_Y - 58, type: 'armed_gang' },
      { x: 940, y: 375 - 58, type: 'armed_gang' },
      { x: 1340, y: GROUND_Y - 58, type: 'armed_gang' },
      { x: 1510, y: 360 - 58, type: 'armed_gang' },
      { x: 1940, y: GROUND_Y - 58, type: 'armed_gang' },
      { x: 2110, y: 350 - 58, type: 'armed_gang' },
      { x: 2660, y: GROUND_Y - 58, type: 'armed_gang' },
      { x: 2790, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 3260, y: GROUND_Y - 58, type: 'armed_gang' },
      { x: 3440, y: GROUND_Y - 58, type: 'armed_gang' }
    ];

    return {
      index: 5,
      name: 'STAGE 6 · ILOCOS NORTE',
      theme: 'ilocos',
      width: 3920,
      goalX: 3680,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage7() {
    // STAGE 7: PANGASINAN BEACH — DOUBLE BOSS: BOSS MAGNANAKAW & BOSS MANDURUKOT!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1080, h: 90, style: 'beach' },
      { x: 1220, y: GROUND_Y, w: 980, h: 90, style: 'beach' },
      // Wide Pangasinan Beach Dual-Boss Arena!
      { x: 2340, y: GROUND_Y, w: 1720, h: 90, style: 'beach' },

      // Bouncy Pangasinan Bangka Outrigger Boats!
      { x: 600, y: GROUND_Y - 68, w: 190, h: 68, style: 'bangka', bouncy: true },
      { x: 1580, y: GROUND_Y - 68, w: 190, h: 68, style: 'bangka', bouncy: true },
      { x: 2550, y: GROUND_Y - 68, w: 185, h: 68, style: 'bangka', bouncy: true },

      { x: 880, y: 375, w: 180, h: 24, style: 'awning' },
      { x: 1850, y: 360, w: 195, h: 24, style: 'awning' },
      // Boss Arena Tactical Bamboo Platforms
      { x: 2880, y: 385, w: 175, h: 24, style: 'awning' },
      { x: 3290, y: 385, w: 175, h: 24, style: 'awning' }
    ];

    const blocks = [
      { x: 240, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 284, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 328, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 1915, y: 235, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      // Boss arena resupply!
      { x: 2945, y: 260, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 3130, y: 325, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 3355, y: 260, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      { x: 155, y: 488, type: 'blaster' },
      { x: 205, y: 488, type: 'knife' },
      ...coinArc(695, 345, 5, 38),
      { x: 925, y: 330, type: 'cash' },
      { x: 1320, y: 488, type: 'heart' },
      ...coinArc(1675, 345, 5, 38),
      { x: 1900, y: 315, type: 'cash' },
      { x: 2460, y: 488, type: 'energy' },
      { x: 2505, y: 488, type: 'heart' },
      { x: 3500, y: 488, type: 'energy' }
    ];

    const enemies = [
      { x: 480, y: GROUND_Y - 64, type: 'big_knife_thief' },
      { x: 930, y: 375 - 58, type: 'armed_gang' },
      { x: 1380, y: GROUND_Y - 52, type: 'runner' },
      { x: 1890, y: 360 - 58, type: 'armed_gang' },
      { x: 2010, y: GROUND_Y - 64, type: 'big_knife_thief' },
      // DOUBLE BOSS SHOWDOWN ON PANGASINAN BEACH!
      { x: 3060, y: GROUND_Y - 88, type: 'boss_magnanakaw', arenaMinX: 2460, arenaMaxX: 3560 },
      { x: 3340, y: GROUND_Y - 86, type: 'boss', arenaMinX: 2460, arenaMaxX: 3560 }
    ];

    return {
      index: 6,
      name: 'STAGE 7 · PANGASINAN BEACH',
      theme: 'pangasinan',
      width: 4060,
      goalX: 3820,
      bossStage: true,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  function buildStage8() {
    // STAGE 8: KAGUBATAN — Philippine Mythical Creatures: Tikbalang, Manananggal, Kapre & Alpha Tikbalang Boss!
    const platforms = [
      { x: 0, y: GROUND_Y, w: 1080, h: 90, style: 'forest' },
      { x: 1230, y: GROUND_Y, w: 1020, h: 90, style: 'forest' },
      // Mystical Forest Final Boss Clearing!
      { x: 2400, y: GROUND_Y, w: 1760, h: 90, style: 'forest' },

      // Bouncy Giant Forest Mushrooms!
      { x: 610, y: GROUND_Y - 66, w: 130, h: 66, style: 'mushroom', bouncy: true },
      { x: 1620, y: GROUND_Y - 66, w: 130, h: 66, style: 'mushroom', bouncy: true },
      { x: 2600, y: GROUND_Y - 66, w: 130, h: 66, style: 'mushroom', bouncy: true },

      { x: 860, y: 375, w: 195, h: 24, style: 'awning' },
      { x: 1340, y: 355, w: 195, h: 24, style: 'awning' },
      { x: 1880, y: 345, w: 215, h: 24, style: 'awning' },
      { x: 2920, y: 380, w: 185, h: 24, style: 'awning' },
      { x: 3340, y: 380, w: 185, h: 24, style: 'awning' }
    ];

    const blocks = [
      { x: 240, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 284, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 328, y: 410, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 1410, y: 230, size: BLOCK_SIZE, type: 'question', reward: 'heart' },
      { x: 1950, y: 220, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 2990, y: 255, size: BLOCK_SIZE, type: 'question', reward: 'blaster' },
      { x: 3180, y: 320, size: BLOCK_SIZE, type: 'question', reward: 'knife' },
      { x: 3405, y: 255, size: BLOCK_SIZE, type: 'question', reward: 'heart' }
    ];

    const pickups = [
      { x: 155, y: 488, type: 'blaster' },
      { x: 205, y: 488, type: 'knife' },
      ...coinArc(675, 345, 5, 38),
      { x: 910, y: 330, type: 'heart' },
      { x: 1385, y: 310, type: 'cash' },
      ...coinArc(1685, 345, 5, 38),
      { x: 1935, y: 300, type: 'knife' },
      { x: 2490, y: 488, type: 'heart' },
      { x: 2545, y: 488, type: 'energy' },
      { x: 3580, y: 488, type: 'energy' }
    ];

    const enemies = [
      { x: 490, y: GROUND_Y - 68, type: 'tikbalang' },
      { x: 840, y: 255, type: 'manananggal' },
      { x: 1000, y: GROUND_Y - 72, type: 'kapre' },
      { x: 1380, y: GROUND_Y - 68, type: 'tikbalang' },
      { x: 1540, y: 235, type: 'manananggal' },
      { x: 1940, y: 345 - 72, type: 'kapre' },
      { x: 2120, y: GROUND_Y - 68, type: 'tikbalang' },
      // FINAL MYTHIC BOSS: HARI NG KAGUBATAN (ALPHA TIKBALANG) + FLYING MANANANGGAL!
      { x: 3080, y: 240, type: 'manananggal' },
      { x: 3320, y: GROUND_Y - 94, type: 'tikbalang_boss', arenaMinX: 2520, arenaMaxX: 3660 }
    ];

    return {
      index: 7,
      name: 'STAGE 8 · KAGUBATAN (MYTHIC FINALE)',
      theme: 'kagubatan',
      width: 4160,
      goalX: 3920,
      bossStage: true,
      platforms,
      blocks,
      pickups,
      enemies
    };
  }

  const META = [
    { index: 0, icon: '🏘️', short: 'Barangay Kalye', sub: 'Manila', desc: 'Sunny Manila street! Grab your first Baril, double-jump over jeepneys & stop street snatchers.' },
    { index: 1, icon: '🌇', short: 'Divisoria Rush', sub: 'Market', desc: 'Golden-hour market rush! Dodge flying bottles and battle pickpocket runners across awnings.' },
    { index: 2, icon: '🌙', short: 'Midnight Boss', sub: 'EDSA Night', desc: 'Neon Manila night! Defeat Boss Mandurukot on the rooftops to save the barangay.' },
    { index: 3, icon: '🏛️', short: 'Malacañang', sub: 'Manila', desc: 'Crocodile-headed thieves in Barong Tagalog! Recover Coins & Cash from Don Buwaya!' },
    { index: 4, icon: '🌊', short: 'Pasig River', sub: 'Knife & Hearts', desc: 'Pasig River boardwalk & ferries! Battle Big Magnanakaw with Knife—claim Boost Knife, Baril & 3 Hearts!' },
    { index: 5, icon: '🌬️', short: 'Ilocos Norte', sub: 'Windmills', desc: 'Spinning Bangui Windmills & sand dunes! Watch out for armed Drug Addict thugs wielding Guns & Knives!' },
    { index: 6, icon: '🏖️', short: 'Pangasinan Beach', sub: 'Double Boss', desc: 'Hundred Islands shore & bangka boats! Survive the Double Boss battle: BOSS Magnanakaw & BOSS Mandurukot!' },
    { index: 7, icon: '🌲', short: 'Kagubatan', sub: 'Mythic Finale', desc: 'Enchanted Philippine jungle! Face the Tikbalang, flying Manananggal, Kapre & Alpha Tikbalang Boss!' }
  ];

  const builders = [
    buildStage1,
    buildStage2,
    buildStage3,
    buildStage4,
    buildStage5,
    buildStage6,
    buildStage7,
    buildStage8
  ];

  return {
    GROUND_Y,
    META,
    count: builders.length,
    load(index) {
      const safe = Math.max(0, Math.min(builders.length - 1, index));
      return builders[safe]();
    }
  };
})();
