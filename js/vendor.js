// KALYE HERO: THE VENDOR — 2 Modes:
// 1) Balot Vendor Run (Metro Manila: Pasig, Parañaque, Cubao, Manila) — Subway Surfers / Temple Run 3D Chase!
// 2) Malunggay Pandesal ni Kuya Tisoy — Morning Barangay Bike Delivery with 10+ Random Filipino Customers!
const VendorGame = (() => {
  const INK = '#111827';
  const H = 630;
  const BALOT_BEST_KEY = 'kalye_hero_balot_best_v1';

  const BALOT_CITIES = {
    pasig: {
      key: 'pasig',
      name: 'PASIG CITY',
      hudTitle: '🥚 BALOT RUN · PASIG',
      badge: '✨ PASIG CITY ✨',
      routeSign: 'PASIG',
      sky: ['#070b1e', '#171c47', '#432366', '#c2410c', '#fb923c'],
      water: ['#0c4a6e', '#075985', '#0f766e', '#115e59'],
      bank: ['#064e3b', '#14532d', '#1e293b'],
      curbGlow: '#facc15',
      lampColor: '#fef9c3',
      lampHalo: 'rgba(254, 240, 138, 0.55)',
      accent: '#38bdf8'
    },
    paranaque: {
      key: 'paranaque',
      name: 'PARAÑAQUE',
      hudTitle: '🥚 BALOT RUN · PARAÑAQUE',
      badge: '✈️ PARAÑAQUE BAY ✈️',
      routeSign: 'BACLARAN',
      sky: ['#140a2e', '#3b145c', '#7e22ce', '#db2777', '#fb923c'],
      water: ['#1e1b4b', '#312e81', '#0e7490', '#155e75'],
      bank: ['#1e293b', '#14532d', '#0f172a'],
      curbGlow: '#38bdf8',
      lampColor: '#fde68a',
      lampHalo: 'rgba(251, 146, 60, 0.52)',
      accent: '#f472b6'
    },
    cubao: {
      key: 'cubao',
      name: 'CUBAO',
      hudTitle: '🥚 BALOT RUN · CUBAO',
      badge: '🎡 CUBAO · ARANETA 🎡',
      routeSign: 'CUBAO',
      sky: ['#06071a', '#111438', '#1e1b4b', '#312e81', '#4c1d95'],
      water: ['#1e293b', '#0f172a', '#1e1b4b', '#0f172a'],
      bank: ['#1e1b4b', '#1e293b', '#0f172a'],
      curbGlow: '#22d3ee',
      lampColor: '#e0f2fe',
      lampHalo: 'rgba(34, 211, 238, 0.52)',
      accent: '#22d3ee'
    },
    manila: {
      key: 'manila',
      name: 'MANILA',
      hudTitle: '🥚 BALOT RUN · MANILA',
      badge: '🏛️ MANILA BAY 🏛️',
      routeSign: 'MANILA',
      sky: ['#1a0814', '#4a1026', '#9a1b26', '#ea580c', '#fde047'],
      water: ['#7c2d12', '#9a3412', '#1e3a5f', '#0f172a'],
      bank: ['#1c1917', '#292524', '#1e293b'],
      curbGlow: '#fbbf24',
      lampColor: '#fef08a',
      lampHalo: 'rgba(251, 191, 36, 0.58)',
      accent: '#fbbf24'
    }
  };

  const PANDESAL_LEVELS = [
    { index: 0, name: 'ROUTE 1 · MORNING BARANGAY', short: 'Morning Barangay', icon: '🌅', goalPandesal: 30, goalPesos: 60, maxMissed: 4, baseSpeed: 195 },
    { index: 1, name: 'ROUTE 2 · SUBDIVISION RUSH', short: 'Subdivision Rush', icon: '🏘️', goalPandesal: 50, goalPesos: 100, maxMissed: 4, baseSpeed: 230 },
    { index: 2, name: 'ROUTE 3 · FIESTA BAKERY RUN', short: 'Fiesta Bakery', icon: '🎉', goalPandesal: 75, goalPesos: 150, maxMissed: 4, baseSpeed: 265 }
  ];

  // 10 Distinct Randomized Barangay Filipino Customers!
  const PANDESAL_CUSTOMERS = [
    { name: 'Aling Nena', shirt: '#ec4899', hair: '#1e293b', style: 'bun', prop: 'walis', skin: '#f5be93', shout: '"PANDESAL PO!"' },
    { name: 'Mang Tony', shirt: '#ffffff', hair: '#475569', style: 'stache', prop: 'mug', skin: '#d89b6e', shout: '"PANDESAL! KAPE NA!"' },
    { name: 'Lola Basyang', shirt: '#a855f7', hair: '#e2e8f0', style: 'lola', prop: 'shawl', skin: '#f5be93', shout: '"IHO, PANDESAL!"' },
    { name: 'Kuya Boyet', shirt: '#facc15', hair: '#111827', style: 'cap', prop: 'ball', skin: '#c98856', shout: '"PRE! PANDESAL!"' },
    { name: 'Ate Jing', shirt: '#f472b6', hair: '#3b1d0f', style: 'curlers', prop: 'phone', skin: '#f8cba6', shout: '"KUYA PANDESAL!"' },
    { name: 'Tito Jun', shirt: '#38bdf8', hair: '#334155', style: 'parted', prop: 'paper', skin: '#e0a679', shout: '"PANDESAL MAINIIIT!"' },
    { name: 'Totoy', shirt: '#2563eb', hair: '#111827', style: 'spiky', prop: 'kid', skin: '#f5be93', shout: '"PANDESAL!! 🥖"' },
    { name: 'Aling Marites', shirt: '#fb923c', hair: '#1f2937', style: 'bob', prop: 'purse', skin: '#eab083', shout: '"PABILI PANDESAL!"' },
    { name: 'Ate Glenda', shirt: '#10b981', hair: '#18181b', style: 'ponytail', prop: 'apron', skin: '#f5be93', shout: '"KUYA TISOY! DITO!"' },
    { name: 'Kuya Jojo', shirt: '#fef9c3', hair: '#111827', style: 'neat', prop: 'bag', skin: '#d89b6e', shout: '"PANDESAL! LATE NA!"' }
  ];

  const HOUSE_COLORS = ['#fef3c7', '#dcfce7', '#fce7f3', '#e0f2fe', '#ffedd5', '#f3e8ff', '#fef9c3', '#e2e8f0'];
  const ROOF_COLORS = ['#dc2626', '#2563eb', '#15803d', '#9a3412', '#7c3aed', '#b91c1c', '#0f766e'];
  const HOUSE_TYPES = ['bungalow', 'twostory', 'sarisari', 'corner'];

  let active = false;
  let paused = false;
  let finished = false;
  let subMode = 'balot'; // 'balot' | 'pandesal'
  let time = 0;
  let customLook = { head: 'backcap', skin: 'tan', top: 'black', bottom: 'shorts' };
  let onStatusUpdate = null;
  let onEndCallback = null;

  let particles = [];
  let floatTexts = [];
  let shakeTimer = 0;
  let hudSyncTimer = 0;

  // Offscreen static backdrop cache (HUGE mobile FPS boost!)
  let cacheCanvas = null;
  let cacheCtx = null;
  let cacheKey = '';
  let cachedRoadGrad = null;
  let cachedRoadGradW = 0;

  // ==================== BALOT VENDOR STATE ====================
  let balotBestDist = 0;
  try { balotBestDist = Number(localStorage.getItem(BALOT_BEST_KEY) || 0); } catch (_) {}

  let bCityKey = 'pasig';
  let bCity = BALOT_CITIES.pasig;
  let bLane = 1; // 0 (Left), 1 (Center), 2 (Right)
  let bLaneX = 1;
  let bLaneTilt = 0;
  let bJumpY = 0;
  let bJumpVy = 0;
  let bSpeed = 0.75;
  let bDist = 0;
  let bPesos = 0;
  let bEggs = 0;
  let bDogClose = 0; // 0 = chasing behind, 1 = snapping right at heels, 2 = caught!
  let bDogRecoverTimer = 0;
  let bStumbleInvuln = 0;
  let bBoostTimer = 0;
  let bObjects = []; // { z, lane, kind: 'barrier'|'tricycle'|'jeep'|'cart'|'egg'|'coin'|'chili', hit, color }
  let bSpawnTimer = 0.6;
  let bJoyLatch = 0;

  // ==================== PANDESAL NI KUYA TISOY STATE ====================
  let pLvlIdx = 0;
  let pLvlCfg = PANDESAL_LEVELS[0];
  let pDist = 0;
  let pSpeed = 195;
  let pSold = 0;
  let pPesos = 0;
  let pMissed = 0;
  let pSellHold = 0;
  let pShoutCooldown = 0;
  let pShoutWave = 0;
  let pHouses = [];
  let pNextHouseDist = 350;
  let pLastCustIdx = -1;

  function roundRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  function addFloat(x, y, text, color = '#fde047', size = 17) {
    if (floatTexts.length >= 10) floatTexts.shift();
    floatTexts.push({ x, y, vy: -60, text, color, size, life: 1.1, maxLife: 1.1 });
  }

  function addParticles(x, y, color, count = 8) {
    const budget = Math.max(0, 36 - particles.length);
    const n = Math.min(count, budget);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 55 + Math.random() * 155;
      particles.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 45,
        size: 3 + Math.random() * 4, color,
        life: 0.35 + Math.random() * 0.3, maxLife: 0.65
      });
    }
  }

  function start(modeName, lvlIdx, custom, statusCb, endCb, cityKey) {
    subMode = modeName === 'pandesal' ? 'pandesal' : 'balot';
    customLook = custom ? { ...custom } : customLook;
    onStatusUpdate = statusCb;
    onEndCallback = endCb;
    active = true;
    paused = false;
    finished = false;
    time = 0;
    shakeTimer = 0;
    hudSyncTimer = 0;
    particles = [];
    floatTexts = [];
    cacheKey = '';

    if (subMode === 'balot') {
      bCityKey = BALOT_CITIES[cityKey] ? cityKey : 'pasig';
      bCity = BALOT_CITIES[bCityKey];
      bLane = 1;
      bLaneX = 1;
      bLaneTilt = 0;
      bJumpY = 0;
      bJumpVy = 0;
      bSpeed = 0.74;
      bDist = 0;
      bPesos = 0;
      bEggs = 0;
      bDogClose = 0;
      bDogRecoverTimer = 0;
      bStumbleInvuln = 0;
      bBoostTimer = 0;
      bObjects = [];
      bSpawnTimer = 0.65;
      bJoyLatch = 0;
    } else {
      pLvlIdx = Math.max(0, Math.min(PANDESAL_LEVELS.length - 1, lvlIdx || 0));
      pLvlCfg = PANDESAL_LEVELS[pLvlIdx];
      pDist = 0;
      pSpeed = pLvlCfg.baseSpeed;
      pSold = 0;
      pPesos = 0;
      pMissed = 0;
      pSellHold = 0;
      pShoutCooldown = 0;
      pShoutWave = 0;
      pHouses = [];
      pNextHouseDist = 340;
      pLastCustIdx = -1;
      ensurePandesalHouses();
    }
    notifyHUD(true);
  }

  function stop() {
    active = false;
    paused = false;
  }

  function setPaused(val) {
    paused = val;
  }

  function pickRandomCustomer() {
    let idx = Math.floor(Math.random() * PANDESAL_CUSTOMERS.length);
    if (idx === pLastCustIdx) idx = (idx + 1 + Math.floor(Math.random() * (PANDESAL_CUSTOMERS.length - 1))) % PANDESAL_CUSTOMERS.length;
    pLastCustIdx = idx;
    return PANDESAL_CUSTOMERS[idx];
  }

  function ensurePandesalHouses() {
    // Prune far-behind houses so memory & loops stay super fast!
    while (pHouses.length > 18 && pHouses[0].dist < pDist - 480) {
      pHouses.shift();
    }
    while (pNextHouseDist - pDist < 2100) {
      const firstHouse = pHouses.length === 0 && pNextHouseDist < 500;
      const wants = firstHouse || Math.random() < 0.74;
      const cust = pickRandomCustomer();
      const qty = 2 + Math.floor(Math.random() * (pLvlIdx === 0 ? 5 : 7)); // Random 2–8 pandesals @ ₱2 each!
      const hType = HOUSE_TYPES[Math.floor(Math.random() * HOUSE_TYPES.length)];
      pHouses.push({
        dist: pNextHouseDist,
        type: hType,
        color: HOUSE_COLORS[Math.floor(Math.random() * HOUSE_COLORS.length)],
        roofColor: ROOF_COLORS[Math.floor(Math.random() * ROOF_COLORS.length)],
        customer: cust,
        ownerName: cust.name,
        wantsPandesal: wants,
        qty,
        hasRooster: Math.random() < 0.25,
        hasPlant: Math.random() < 0.65,
        hasTricycle: hType === 'corner' && Math.random() < 0.55,
        sold: false,
        missed: false
      });
      // Randomized Barangay lot spacing!
      pNextHouseDist += 365 + Math.floor(Math.random() * 145);
    }
  }

  // Controls Actions
  function balotMoveLane(delta) {
    if (!active || paused || finished || subMode !== 'balot') return;
    const next = Math.max(0, Math.min(2, bLane + delta));
    if (next !== bLane) {
      bLane = next;
      bLaneTilt = delta * 0.24;
      SoundFX.board();
    }
  }

  function balotJump() {
    if (!active || paused || finished || subMode !== 'balot') return;
    if (bJumpY <= 3) {
      bJumpVy = 670;
      SoundFX.jump();
    }
  }

  function pandesalShout() {
    if (!active || paused || finished || subMode !== 'pandesal' || pShoutCooldown > 0) return;
    pShoutCooldown = 2.4;
    pShoutWave = 0.55;
    SoundFX.horn();
    addFloat(180, 390, '📣 MALUNGGAY PANDESAL!! ₱2!', '#fde047', 17);
    const quiet = pHouses.find((h) => !h.wantsPandesal && !h.sold && !h.missed && h.dist > pDist + 80 && h.dist < pDist + 680);
    if (quiet) {
      quiet.wantsPandesal = true;
      quiet.qty = 3 + Math.floor(Math.random() * 6);
      addFloat(260, 290, `${quiet.ownerName}: ${quiet.customer.shout}`, '#34d399', 15);
    }
  }

  function notifyHUD(force = false) {
    if (!onStatusUpdate) return;
    if (!force && hudSyncTimer < 0.085) return;
    hudSyncTimer = 0;
    if (subMode === 'balot') {
      onStatusUpdate({
        subMode: 'balot',
        title: bCity.hudTitle,
        dist: Math.floor(bDist),
        pesos: bPesos,
        eggs: bEggs,
        dogClose: bDogClose,
        bestDist: balotBestDist
      });
    } else {
      onStatusUpdate({
        subMode: 'pandesal',
        title: pLvlCfg.name,
        sold: pSold,
        goalPandesal: pLvlCfg.goalPandesal,
        pesos: pPesos,
        goalPesos: pLvlCfg.goalPesos,
        missed: pMissed,
        maxMissed: pLvlCfg.maxMissed
      });
    }
  }

  // ==================== UPDATE ====================
  function update(dt, W, controls) {
    if (!active || paused || finished) return;
    time += dt;
    hudSyncTimer += dt;
    if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);

    if (subMode === 'balot') {
      updateBalot(dt, W, controls);
    } else {
      updatePandesal(dt, W, controls);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 420 * dt; pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const ft = floatTexts[i];
      ft.y += ft.vy * dt; ft.vy *= 0.94; ft.life -= dt;
      if (ft.life <= 0) floatTexts.splice(i, 1);
    }
    notifyHUD(false);
  }

  function updateBalot(dt, W, controls) {
    const jx = controls.joyX || 0;
    if (jx < -0.45 && bJoyLatch !== -1) {
      balotMoveLane(-1);
      bJoyLatch = -1;
    } else if (jx > 0.45 && bJoyLatch !== 1) {
      balotMoveLane(1);
      bJoyLatch = 1;
    } else if (Math.abs(jx) < 0.22) {
      bJoyLatch = 0;
    }

    bLaneX += (bLane - bLaneX) * Math.min(1, dt * 15);
    bLaneTilt *= Math.max(0, 1 - dt * 10);

    if (bJumpY > 0 || bJumpVy > 0) {
      bJumpY += bJumpVy * dt;
      bJumpVy -= 1680 * dt;
      if (bJumpY < 0) { bJumpY = 0; bJumpVy = 0; }
    }

    if (bStumbleInvuln > 0) bStumbleInvuln -= dt;
    if (bBoostTimer > 0) bBoostTimer -= dt;
    if (bDogClose === 1) {
      bDogRecoverTimer += dt;
      if (bDogRecoverTimer >= 7.0) {
        bDogClose = 0;
        bDogRecoverTimer = 0;
        addFloat(W / 2, 390, 'ESCAPED THE ASKAL! 💨', '#34d399', 16);
        notifyHUD(true);
      }
    }

    const spdMult = bBoostTimer > 0 ? 1.42 : 1.0;
    bSpeed = Math.min(1.36, 0.74 + bDist * 0.0005);
    const stepZ = bSpeed * spdMult * dt;
    bDist += stepZ * 42;

    // Spawn Jumpable PH Street Obstacles (Jeepney, Tricycle, Barrier, Fishball Cart) & Balot Eggs!
    bSpawnTimer -= dt * spdMult;
    if (bSpawnTimer <= 0) {
      const lane = Math.floor(Math.random() * 3);
      const r = Math.random();
      if (r < 0.22) {
        bObjects.push({ z: 0.02, lane, kind: 'jeep', jumpable: true, roofHop: true, hit: false, color: ['#ef4444', '#2563eb', '#16a34a', '#d97706'][Math.floor(Math.random() * 4)] });
      } else if (r < 0.44) {
        bObjects.push({ z: 0.02, lane, kind: 'tricycle', jumpable: true, hit: false, color: ['#10b981', '#0284c7', '#e11d48', '#f59e0b'][Math.floor(Math.random() * 4)] });
      } else if (r < 0.6) {
        bObjects.push({ z: 0.02, lane, kind: 'barrier', jumpable: true, hit: false });
      } else if (r < 0.71) {
        bObjects.push({ z: 0.02, lane, kind: 'cart', jumpable: true, hit: false });
      } else if (r < 0.9) {
        // Line of Balot Eggs & Peso Coins (plus occasional aerial egg above a jump!)
        for (let k = 0; k < 3; k++) {
          bObjects.push({ z: 0.02 - k * 0.085, lane, kind: k === 1 ? 'egg' : 'coin', hit: false });
        }
      } else {
        bObjects.push({ z: 0.02, lane, kind: 'chili', hit: false });
      }
      bSpawnTimer = Math.max(0.46, 0.94 - bDist * 0.00032) + Math.random() * 0.24;
    }

    // Advance & Collide
    for (let i = bObjects.length - 1; i >= 0; i--) {
      const obj = bObjects[i];
      obj.z += stepZ;

      if (!obj.hit && obj.z >= 0.86 && obj.z <= 1.03 && Math.abs(obj.lane - bLaneX) < 0.45) {
        const isPickup = obj.kind === 'egg' || obj.kind === 'coin' || obj.kind === 'chili';
        if (isPickup) {
          obj.hit = true;
          if (obj.kind === 'egg') {
            bEggs++;
            bPesos += 20;
            SoundFX.coin();
            addFloat(W / 2, 420, '🥚 BALOT! +₱20', '#fde047', 17);
            addParticles(W / 2, 468, '#fde047', 8);
          } else if (obj.kind === 'chili') {
            bBoostTimer = 3.5;
            bDogClose = 0;
            bDogRecoverTimer = 0;
            SoundFX.energyDrink();
            addFloat(W / 2, 415, '🌶️ SUKA TURBO! DOG BACK!', '#f97316', 18);
            addParticles(W / 2, 468, '#f97316', 12);
          } else {
            bPesos += 5;
            SoundFX.coin();
          }
          notifyHUD(true);
        } else if (bStumbleInvuln <= 0) {
          // ALL Jeepneys, Tricycles, Barriers & Carts can be cleanly jumped over!
          const clearHeight = obj.kind === 'jeep' ? 52 : obj.kind === 'tricycle' ? 40 : 34;
          if (obj.jumpable && bJumpY >= clearHeight) {
            obj.hit = true;
            if (obj.roofHop) {
              // Subway Surfers style Jeepney Roof Hop Bounce!
              bJumpVy = Math.max(bJumpVy, 420);
              bPesos += 15;
              SoundFX.bounce();
              addFloat(W / 2, 390, '🚐 JEEP ROOF HOP! +₱15', '#38bdf8', 16);
              addParticles(W / 2, 445, '#38bdf8', 8);
            } else {
              bPesos += 10;
              SoundFX.coin();
              addFloat(W / 2, 405, obj.kind === 'tricycle' ? '🛺 TRICYCLE JUMP! +₱10' : '💨 NICE JUMP! +₱10', '#34d399', 15);
            }
            notifyHUD(true);
          } else if (bBoostTimer > 0) {
            obj.hit = true;
            SoundFX.crateBreak();
            addParticles(W / 2, 475, '#facc15', 10);
          } else {
            obj.hit = true;
            bStumbleInvuln = 1.1;
            bDogClose++;
            bDogRecoverTimer = 0;
            shakeTimer = 0.28;
            SoundFX.angry();
            addParticles(W / 2, 488, '#ef4444', 12);
            notifyHUD(true);
            if (bDogClose >= 2) {
              finished = true;
              if (Math.floor(bDist) > balotBestDist) {
                balotBestDist = Math.floor(bDist);
                try { localStorage.setItem(BALOT_BEST_KEY, String(balotBestDist)); } catch (_) {}
              }
              SoundFX.gameOver();
              if (onEndCallback) {
                onEndCallback({
                  subMode: 'balot',
                  won: false,
                  cityName: bCity.name,
                  dist: Math.floor(bDist),
                  bestDist: balotBestDist,
                  pesos: bPesos,
                  eggs: bEggs
                });
              }
              return;
            } else {
              addFloat(W / 2, 412, '🐕 GRRR! ASKAL RIGHT BEHIND YOU!', '#f87171', 16);
            }
          }
        }
      }

      if (obj.z > 1.22) bObjects.splice(i, 1);
    }
  }

  function updatePandesal(dt, W, controls) {
    if (pShoutCooldown > 0) pShoutCooldown = Math.max(0, pShoutCooldown - dt);
    if (pShoutWave > 0) pShoutWave = Math.max(0, pShoutWave - dt);

    const jx = controls.joyX || 0;
    const braking = controls.brake;
    const reversing = !braking && jx < -0.25;
    const pedalingFast = jx > 0.25;

    let targetSpd = pLvlCfg.baseSpeed;
    if (braking) targetSpd = 0;
    else if (reversing) targetSpd = -90 * Math.min(1, Math.abs(jx));
    else if (pedalingFast) targetSpd = pLvlCfg.baseSpeed * 1.5;

    const accel = braking || reversing ? 780 : 360;
    if (pSpeed < targetSpd) pSpeed = Math.min(targetSpd, pSpeed + accel * dt);
    else pSpeed = Math.max(targetSpd, pSpeed - accel * dt);

    pDist = Math.max(0, pDist + pSpeed * dt);
    ensurePandesalHouses();

    const bikeWorldX = pDist;
    for (const h of pHouses) {
      if (h.sold || h.missed) continue;
      const dx = h.dist - bikeWorldX;

      if (h.wantsPandesal && Math.abs(dx) < 92) {
        if (Math.abs(pSpeed) < 58 || braking) {
          pSellHold += dt;
          if (pSellHold >= 0.24) {
            h.sold = true;
            pSellHold = 0;
            const earned = h.qty * 2; // ₱2 per Malunggay Pandesal!
            pSold += h.qty;
            pPesos += earned;
            SoundFX.farePaid();
            const bikeScreenX = W < 520 ? W * 0.34 : 210;
            addParticles(bikeScreenX + 20, 440, '#fde047', 10);
            addParticles(bikeScreenX + 20, 440, '#34d399', 8);
            addFloat(bikeScreenX + 20, 380, `🥖 ${h.qty} pcs · +₱${earned} (${h.ownerName})`, '#34d399', 16);
            notifyHUD(true);

            if (pSold >= pLvlCfg.goalPandesal && !finished) {
              finished = true;
              SoundFX.stageClear();
              if (onEndCallback) {
                onEndCallback({
                  subMode: 'pandesal',
                  won: true,
                  levelIdx: pLvlIdx,
                  isLastLevel: pLvlIdx >= PANDESAL_LEVELS.length - 1,
                  sold: pSold,
                  goalPandesal: pLvlCfg.goalPandesal,
                  pesos: pPesos,
                  missed: pMissed,
                  stars: pMissed === 0 ? 5 : pMissed <= 1 ? 4 : 3
                });
              }
              return;
            }
          }
        }
      }

      if (h.wantsPandesal && dx < -122) {
        h.missed = true;
        pMissed++;
        shakeTimer = 0.24;
        SoundFX.angry();
        const bikeScreenX = W < 520 ? W * 0.34 : 210;
        addFloat(bikeScreenX + 20, 388, `😢 MISSED ${h.ownerName}! (${pMissed}/${pLvlCfg.maxMissed})`, '#f87171', 15);
        notifyHUD(true);
        if (pMissed >= pLvlCfg.maxMissed && !finished) {
          finished = true;
          SoundFX.gameOver();
          if (onEndCallback) {
            onEndCallback({
              subMode: 'pandesal',
              won: false,
              levelIdx: pLvlIdx,
              isLastLevel: false,
              sold: pSold,
              goalPandesal: pLvlCfg.goalPandesal,
              pesos: pPesos,
              missed: pMissed,
              stars: 1
            });
          }
          return;
        }
      }
    }
  }

  // ==================== OFFSCREEN STATIC BACKDROP CACHE (60FPS MOBILE PERFORMANCE!) ====================
  function ensureBackdropCache(W, key, drawFn) {
    const fullKey = `${W}x${H}_${key}`;
    if (cacheCanvas && cacheKey === fullKey) return;
    if (!cacheCanvas) {
      cacheCanvas = document.createElement('canvas');
      cacheCtx = cacheCanvas.getContext('2d', { alpha: false });
    }
    cacheCanvas.width = W;
    cacheCanvas.height = H;
    cacheKey = fullKey;
    drawFn(cacheCtx, W);
  }

  // ==================== RENDERING ====================
  function render(ctx, W) {
    ctx.save();
    if (shakeTimer > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);

    if (subMode === 'balot') {
      renderBalotRunner(ctx, W);
    } else {
      renderPandesalBike(ctx, W);
    }

    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
    }
    ctx.globalAlpha = 1;

    for (let i = 0; i < floatTexts.length; i++) {
      const ft = floatTexts[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = `700 ${ft.size}px Fredoka, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = INK;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- 3D PERSPECTIVE BALOT RUNNER (4 METRO MANILA CITIES!) ----------
  function projectLane(laneVal, z, W) {
    const horizonY = 204;
    const playerY = 512;
    const p = Math.pow(Math.max(0.01, z), 1.65);
    const y = horizonY + p * (playerY - horizonY);
    const roadHalfW = 28 + p * (Math.min(W * 0.44, 210));
    const laneOffset = (laneVal - 1) * (roadHalfW * 0.66);
    const scale = 0.14 + p * 0.96;
    return { x: W / 2 + laneOffset, y, scale, roadHalfW };
  }

  function bakeBalotStaticBackdrop(bctx, W) {
    const horizonY = 204;
    const c = bCity;

    // 1. Sky Gradient
    const sky = bctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, c.sky[0]);
    sky.addColorStop(0.35, c.sky[1]);
    sky.addColorStop(0.7, c.sky[2]);
    sky.addColorStop(0.9, c.sky[3]);
    sky.addColorStop(1, c.sky[4]);
    bctx.fillStyle = sky;
    bctx.fillRect(0, 0, W, horizonY + 12);

    // Stars
    for (let s = 0; s < 28; s++) {
      const sx = ((s * 97 + 31) % 997) / 997 * W;
      const sy = 10 + ((s * 53 + 17) % 102);
      bctx.fillStyle = s % 3 === 0 ? 'rgba(254,249,195,0.85)' : 'rgba(226,232,240,0.45)';
      bctx.fillRect(sx, sy, s % 4 === 0 ? 2 : 1.3, s % 4 === 0 ? 2 : 1.3);
    }

    // Moon (Pasig/Cubao/Parañaque) OR Dramatic Manila Bay Setting Sun!
    if (c.key === 'manila') {
      const sunX = W * 0.25;
      const sunY = horizonY - 18;
      const sg = bctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 85);
      sg.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
      sg.addColorStop(0.45, 'rgba(249, 115, 22, 0.42)');
      sg.addColorStop(1, 'rgba(249, 115, 22, 0)');
      bctx.fillStyle = sg;
      bctx.beginPath(); bctx.arc(sunX, sunY, 85, 0, Math.PI * 2); bctx.fill();
      bctx.fillStyle = '#fef08a';
      bctx.beginPath(); bctx.arc(sunX, sunY, 30, 0, Math.PI * 2); bctx.fill();
    } else {
      const moonX = W * 0.8;
      const moonY = 56;
      const mg = bctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 52);
      mg.addColorStop(0, 'rgba(254, 240, 138, 0.72)');
      mg.addColorStop(0.5, 'rgba(253, 224, 71, 0.2)');
      mg.addColorStop(1, 'rgba(253, 224, 71, 0)');
      bctx.fillStyle = mg;
      bctx.beginPath(); bctx.arc(moonX, moonY, 52, 0, Math.PI * 2); bctx.fill();
      bctx.fillStyle = '#fef9c3';
      bctx.beginPath(); bctx.arc(moonX, moonY, 19, 0, Math.PI * 2); bctx.fill();
    }

    // 2. City-Specific Iconic Philippine Skyline (Baked Once!)
    drawCitySkylineStatic(bctx, W, horizonY, c);

    // 3. Left Bank Water/Avenue & Right Bank Park/Plaza
    const water = bctx.createLinearGradient(0, horizonY, 0, H);
    water.addColorStop(0, c.water[0]);
    water.addColorStop(0.38, c.water[1]);
    water.addColorStop(0.75, c.water[2]);
    water.addColorStop(1, c.water[3]);
    bctx.fillStyle = water;
    bctx.fillRect(0, horizonY, W / 2 + 10, H - horizonY);

    // Horizon sunset glow reflection on water
    if (c.key !== 'cubao') {
      const rg = bctx.createLinearGradient(0, horizonY, 0, horizonY + 135);
      rg.addColorStop(0, c.key === 'manila' ? 'rgba(253,224,71,0.55)' : 'rgba(251,146,60,0.38)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      bctx.fillStyle = rg;
      bctx.fillRect(0, horizonY, W / 2, 135);
    }

    const bank = bctx.createLinearGradient(0, horizonY, 0, H);
    bank.addColorStop(0, c.bank[0]);
    bank.addColorStop(0.55, c.bank[1]);
    bank.addColorStop(1, c.bank[2]);
    bctx.fillStyle = bank;
    bctx.fillRect(W / 2, horizonY, W / 2, H - horizonY);

    // 4. Static 3-Lane Road Base Trapezoid & Curbs
    const topHalf = 28;
    const botHalf = Math.min(W * 0.48, 240);
    const roadGrad = bctx.createLinearGradient(0, horizonY, 0, H);
    roadGrad.addColorStop(0, '#475569');
    roadGrad.addColorStop(0.5, '#334155');
    roadGrad.addColorStop(1, '#1e293b');
    bctx.fillStyle = roadGrad;
    bctx.beginPath();
    bctx.moveTo(W / 2 - topHalf, horizonY);
    bctx.lineTo(W / 2 + topHalf, horizonY);
    bctx.lineTo(W / 2 + botHalf, H);
    bctx.lineTo(W / 2 - botHalf, H);
    bctx.closePath();
    bctx.fill();

    // Curbs & Lane Dividers
    bctx.strokeStyle = '#cbd5e1';
    bctx.lineWidth = 6;
    bctx.beginPath();
    bctx.moveTo(W / 2 - topHalf, horizonY); bctx.lineTo(W / 2 - botHalf, H);
    bctx.moveTo(W / 2 + topHalf, horizonY); bctx.lineTo(W / 2 + botHalf, H);
    bctx.stroke();

    bctx.strokeStyle = c.curbGlow;
    bctx.lineWidth = 2.4;
    bctx.beginPath();
    bctx.moveTo(W / 2 - topHalf + 3, horizonY); bctx.lineTo(W / 2 - botHalf + 6, H);
    bctx.moveTo(W / 2 + topHalf - 3, horizonY); bctx.lineTo(W / 2 + botHalf - 6, H);
    bctx.stroke();

    bctx.strokeStyle = 'rgba(254, 240, 138, 0.48)';
    bctx.lineWidth = 2.4;
    [-0.33, 0.33].forEach((f) => {
      bctx.beginPath();
      bctx.moveTo(W / 2 + topHalf * f, horizonY);
      bctx.lineTo(W / 2 + botHalf * f, H);
      bctx.stroke();
    });
  }

  function drawCitySkylineStatic(bctx, W, horizonY, c) {
    bctx.save();
    // Far silhouettes
    bctx.fillStyle = c.key === 'manila' ? '#3b0764' : '#1e1b4b';
    const farTowers = [
      [0.03, 0.07, 44], [0.11, 0.08, 60], [0.21, 0.06, 50],
      [0.54, 0.08, 84], [0.63, 0.09, 108], [0.73, 0.07, 92],
      [0.81, 0.09, 116], [0.91, 0.09, 76]
    ];
    farTowers.forEach(([fx, fw, fh]) => {
      bctx.fillRect(W * fx, horizonY - fh, W * fw, fh + 6);
    });

    if (c.key === 'pasig') {
      // Pasig River Illuminated Cable-Stayed Arch Bridge
      const brLeft = -10, brRight = W * 0.48, brMid = (brLeft + brRight) * 0.5, brDeckY = horizonY - 14;
      bctx.strokeStyle = '#38bdf8'; bctx.lineWidth = 4;
      bctx.beginPath(); bctx.moveTo(brLeft + 18, brDeckY); bctx.quadraticCurveTo(brMid, horizonY - 82, brRight - 14, brDeckY); bctx.stroke();
      bctx.strokeStyle = 'rgba(253,224,71,0.75)'; bctx.lineWidth = 1.6;
      bctx.beginPath(); bctx.moveTo(brLeft + 18, brDeckY + 2); bctx.quadraticCurveTo(brMid, horizonY - 78, brRight - 14, brDeckY + 2); bctx.stroke();
      bctx.strokeStyle = 'rgba(186,230,253,0.5)'; bctx.lineWidth = 1.2;
      for (let k = 1; k <= 7; k++) {
        const t = k / 8;
        const cx = (brLeft + 18) + t * (brRight - brLeft - 32);
        const archY = (1 - t) * (1 - t) * brDeckY + 2 * (1 - t) * t * (horizonY - 82) + t * t * brDeckY;
        bctx.beginPath(); bctx.moveTo(cx, archY); bctx.lineTo(cx, brDeckY); bctx.stroke();
      }
      bctx.fillStyle = '#0f172a'; bctx.fillRect(brLeft, brDeckY, brRight - brLeft, 7);
      bctx.fillStyle = '#38bdf8'; bctx.fillRect(brLeft, brDeckY + 6, brRight - brLeft, 2);

      // Pasig Cathedral Bell Tower
      const cathX = W * 0.44;
      bctx.fillStyle = '#2e1065';
      bctx.fillRect(cathX - 18, horizonY - 46, 36, 48);
      bctx.fillRect(cathX - 8, horizonY - 76, 16, 34);
      bctx.beginPath(); bctx.arc(cathX, horizonY - 76, 8, Math.PI, 0); bctx.fill();
      bctx.strokeStyle = '#fde047'; bctx.lineWidth = 1.8;
      bctx.beginPath(); bctx.moveTo(cathX, horizonY - 94); bctx.lineTo(cathX, horizonY - 82); bctx.moveTo(cathX - 4, horizonY - 90); bctx.lineTo(cathX + 4, horizonY - 90); bctx.stroke();
      bctx.fillStyle = '#fef08a'; bctx.beginPath(); bctx.arc(cathX, horizonY - 62, 4, 0, Math.PI * 2); bctx.fill();
    } else if (c.key === 'paranaque') {
      // Coastal / NAIA Skyway Viaduct + Baclaran Church Dome!
      const vy = horizonY - 22;
      bctx.fillStyle = '#1e1b4b';
      bctx.fillRect(0, vy, W * 0.52, 8);
      bctx.fillStyle = '#f472b6';
      bctx.fillRect(0, vy + 7, W * 0.52, 2);
      for (let p = 0; p < 5; p++) {
        bctx.fillStyle = '#312e81';
        bctx.fillRect(W * (0.04 + p * 0.11), vy + 8, 8, 22);
      }
      // Baclaran Redemptorist Church Silhouette
      const bx = W * 0.43;
      bctx.fillStyle = '#3b0764';
      bctx.fillRect(bx - 24, horizonY - 48, 48, 50);
      bctx.beginPath(); bctx.arc(bx, horizonY - 48, 20, Math.PI, 0); bctx.fill();
      bctx.strokeStyle = '#fde047'; bctx.lineWidth = 2;
      bctx.beginPath(); bctx.moveTo(bx, horizonY - 80); bctx.lineTo(bx, horizonY - 66); bctx.moveTo(bx - 5, horizonY - 75); bctx.lineTo(bx + 5, horizonY - 75); bctx.stroke();
      bctx.fillStyle = '#fde047';
      bctx.fillRect(bx - 12, horizonY - 32, 7, 14); bctx.fillRect(bx + 5, horizonY - 32, 7, 14);
    } else if (c.key === 'cubao') {
      // Iconic Smart Araneta Coliseum (The Big Dome!) + LRT-2 Elevated Viaduct!
      const domeX = W * 0.25;
      bctx.fillStyle = '#1e1b4b';
      bctx.beginPath(); bctx.ellipse(domeX, horizonY - 32, 74, 34, 0, Math.PI, 0); bctx.fill();
      bctx.fillRect(domeX - 74, horizonY - 32, 148, 34);
      // Glowing Neon Dome Ribs!
      bctx.strokeStyle = '#22d3ee'; bctx.lineWidth = 2.2;
      bctx.beginPath(); bctx.ellipse(domeX, horizonY - 32, 74, 34, 0, Math.PI, 0); bctx.stroke();
      bctx.strokeStyle = '#f43f5e'; bctx.lineWidth = 2;
      bctx.beginPath(); bctx.moveTo(domeX - 66, horizonY - 22); bctx.lineTo(domeX + 66, horizonY - 22); bctx.stroke();
      bctx.fillStyle = '#fde047'; bctx.font = 'bold 9px Fredoka, sans-serif'; bctx.textAlign = 'center';
      bctx.fillText('BIG DOME', domeX, horizonY - 10);

      // Overhead LRT-2 / MRT-3 Viaduct Beam across Cubao!
      bctx.fillStyle = '#0f172a';
      bctx.fillRect(0, horizonY - 56, W * 0.56, 7);
      bctx.fillStyle = '#22d3ee';
      bctx.fillRect(0, horizonY - 50, W * 0.56, 2);
      for (let p = 0; p < 4; p++) {
        bctx.fillStyle = '#1e293b';
        bctx.fillRect(W * (0.06 + p * 0.14), horizonY - 48, 9, 50);
      }
    } else if (c.key === 'manila') {
      // Jones Bridge Neoclassical Arches + Manila Post Office Dome + Rizal Monument Obelisk!
      const jy = horizonY - 18;
      bctx.fillStyle = '#292524';
      bctx.fillRect(0, jy, W * 0.45, 10);
      for (let a = 0; a < 3; a++) {
        const ax = W * (0.07 + a * 0.14);
        bctx.fillStyle = '#fb923c';
        bctx.beginPath(); bctx.arc(ax, horizonY + 2, 18, Math.PI, 0); bctx.fill();
        // Ornate Jones Bridge lamp posts
        bctx.fillStyle = '#fde047';
        bctx.beginPath(); bctx.arc(ax, jy - 10, 3.5, 0, Math.PI * 2); bctx.fill();
      }
      // Rizal Monument Obelisk (Center-Left!)
      const rx = W * 0.45;
      bctx.fillStyle = '#1c1917';
      bctx.beginPath();
      bctx.moveTo(rx - 9, horizonY + 2); bctx.lineTo(rx - 4, horizonY - 82);
      bctx.lineTo(rx, horizonY - 94); bctx.lineTo(rx + 4, horizonY - 82);
      bctx.lineTo(rx + 9, horizonY + 2); bctx.closePath(); bctx.fill();
      bctx.fillStyle = '#fef08a';
      bctx.beginPath(); bctx.arc(rx, horizonY - 94, 3, 0, Math.PI * 2); bctx.fill();
    }

    // Illuminated Right-Side Towers / CBD Buildings (styled per City!)
    const buildings = [
      { x: 0.56, w: 0.085, h: 90, accent: c.accent },
      { x: 0.65, w: 0.095, h: 120, accent: '#facc15' },
      { x: 0.75, w: 0.085, h: 96, accent: c.accent },
      { x: 0.84, w: 0.095, h: 110, accent: '#fb923c' },
      { x: 0.935, w: 0.075, h: 72, accent: c.accent }
    ];
    buildings.forEach((b, idx) => {
      const bx = W * b.x;
      const bw = Math.max(24, W * b.w);
      const by = horizonY - b.h;
      bctx.fillStyle = idx % 2 === 0 ? '#172554' : '#0f172a';
      bctx.fillRect(bx, by, bw, b.h + 4);
      bctx.fillStyle = b.accent;
      bctx.fillRect(bx, by, bw, 3);
      const cols = Math.max(3, Math.floor(bw / 8));
      const rows = Math.floor((b.h - 14) / 10);
      for (let r = 0; r < rows; r++) {
        for (let cl = 0; cl < cols; cl++) {
          if ((r * 7 + cl * 3 + idx * 5) % 4 === 0) continue;
          bctx.fillStyle = (r + cl + idx) % 5 === 0 ? 'rgba(56,189,248,0.75)' : 'rgba(254,240,138,0.72)';
          bctx.fillRect(bx + 4 + cl * ((bw - 8) / cols), by + 8 + r * 10, 4, 5);
        }
      }
    });

    // Glowing City Landmark Sign!
    const signX = W * 0.72;
    const signY = horizonY - 10;
    bctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    roundRect(bctx, signX - 54, signY - 15, 108, 17, 4); bctx.fill();
    bctx.strokeStyle = c.accent; bctx.lineWidth = 1.6; bctx.stroke();
    bctx.fillStyle = '#fef08a';
    bctx.font = 'bold 9.5px Fredoka, sans-serif';
    bctx.textAlign = 'center';
    bctx.fillText(c.badge, signX, signY - 3);
    bctx.restore();
  }

  function renderBalotRunner(ctx, W) {
    const horizonY = 204;

    // 1. Blit Cached Static Sky + City Skyline + River + Road Base in ONE fast drawImage!
    ensureBackdropCache(W, `balot_${bCityKey}`, bakeBalotStaticBackdrop);
    ctx.drawImage(cacheCanvas, 0, 0);

    // 2. City-Specific Live Animated Landmark Details!
    if (bCityKey === 'pasig') {
      // Moving cars on Pasig Arch Bridge + Pasig River Ferry!
      const brRight = W * 0.48;
      for (let car = 0; car < 4; car++) {
        const carX = ((car * 62 + time * 26) % (brRight + 10)) - 10;
        ctx.fillStyle = car % 2 === 0 ? '#fef08a' : '#f87171';
        ctx.fillRect(carX, horizonY - 16, 5, 2.5);
      }
      const ferryZ = ((time * 0.08 + 0.35) % 0.72) + 0.08;
      const fProj = projectLane(0, ferryZ, W);
      const ferryX = Math.max(26, fProj.x - fProj.roadHalfW - 56 * fProj.scale - 22);
      drawPasigFerry(ctx, ferryX, fProj.y + 4, Math.max(0.32, fProj.scale * 0.92));
    } else if (bCityKey === 'paranaque') {
      // Animated NAIA Landing Airplanes gliding across the Parañaque twilight sky!
      const planeX = W + 30 - ((time * 38) % (W + 140));
      const planeY = 66 + (W - planeX) * 0.06;
      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath(); ctx.ellipse(0, 0, 16, 3.2, 0.08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-2, -1); ctx.lineTo(6, -11); ctx.lineTo(10, -1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(10, -2); ctx.lineTo(16, -9); ctx.lineTo(15, -1); ctx.fill();
      // Blinking NAIA wing strobe light
      if (Math.sin(time * 9) > 0) {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath(); ctx.arc(-14, 0, 2.6, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      // Skyway traffic lights
      for (let car = 0; car < 4; car++) {
        const cx = ((car * 58 + time * 34) % (W * 0.52));
        ctx.fillStyle = car % 2 === 0 ? '#fef08a' : '#fb7185';
        ctx.fillRect(cx, horizonY - 24, 5, 2.5);
      }
    } else if (bCityKey === 'cubao') {
      // Animated LRT-2 / MRT-3 Elevated Train gliding across Cubao Viaduct!
      const trainX = ((time * 68) % (W * 0.72 + 160)) - 140;
      if (trainX < W * 0.56) {
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, W * 0.56, horizonY); ctx.clip();
        ctx.fillStyle = '#e2e8f0';
        roundRect(ctx, trainX, horizonY - 68, 92, 12, 3); ctx.fill();
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(trainX + 2, horizonY - 59, 88, 3);
        ctx.fillStyle = '#fde047';
        for (let w = 0; w < 8; w++) ctx.fillRect(trainX + 6 + w * 10, horizonY - 65, 6, 4);
        ctx.restore();
      }
    } else if (bCityKey === 'manila') {
      // Shimmering golden Manila Bay sunset sun-path ripples on the left!
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      for (let r = 0; r < 6; r++) {
        const ry = horizonY + 12 + r * 22 + Math.sin(time * 3 + r) * 2;
        const rw = 46 - r * 4 + Math.sin(time * 5 + r * 2) * 8;
        ctx.fillRect(W * 0.25 - rw / 2, ry, rw, 3);
      }
    }

    // 3. Water/Street Light Ripples + 3D Scrolling Pavement Cross-Seams
    for (let i = 0; i < 9; i++) {
      const z = ((i / 9) + (time * bSpeed * 0.85)) % 1;
      const pr = projectLane(1, z, W);
      ctx.strokeStyle = `rgba(148, 163, 184, ${(0.12 + z * 0.22).toFixed(2)})`;
      ctx.lineWidth = Math.max(1, 2 * pr.scale);
      ctx.beginPath();
      ctx.moveTo(W / 2 - pr.roadHalfW, pr.y);
      ctx.lineTo(W / 2 + pr.roadHalfW, pr.y);
      ctx.stroke();

      if (i % 2 === 0 && bCityKey !== 'cubao') {
        const wx = W / 2 - pr.roadHalfW - (26 + (i % 3) * 26) * pr.scale;
        const ww = 28 * pr.scale;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.32)';
        ctx.fillRect(wx - ww, pr.y, ww, Math.max(1.5, 2.8 * pr.scale));
      }
    }

    // 4. 3D Scrolling Left Bollards + Right Lamp Posts & Trees
    for (let i = 0; i < 6; i++) {
      const z = ((i / 6) + (time * bSpeed * 0.65)) % 1;
      const pr = projectLane(1, z, W);
      const sc = pr.scale;

      // Left Esplanade Bollard
      const lx = W / 2 - pr.roadHalfW - 6 * sc;
      const ph = 26 * sc;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lx - 3.5 * sc, pr.y - ph, 7 * sc, ph);
      ctx.fillStyle = bCity.accent;
      ctx.fillRect(lx - 2 * sc, pr.y - ph * 0.6, 4 * sc, 3 * sc);

      // Right Side: Heritage Lamp Posts & Tropical Palms/Trees
      const rx = W / 2 + pr.roadHalfW + 16 * sc;
      if (i % 2 === 0) {
        const lh = 104 * sc;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx - 2.4 * sc, pr.y - lh, 4.8 * sc, lh);
        ctx.fillRect(rx - 10 * sc, pr.y - lh + 4 * sc, 20 * sc, 2.8 * sc);
        ctx.fillStyle = bCity.lampHalo;
        ctx.beginPath(); ctx.arc(rx, pr.y - lh, 18 * sc, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = bCity.lampColor;
        ctx.beginPath();
        ctx.arc(rx - 8.5 * sc, pr.y - lh + 1 * sc, 4.5 * sc, 0, Math.PI * 2);
        ctx.arc(rx + 8.5 * sc, pr.y - lh + 1 * sc, 4.5 * sc, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const tx = rx + 14 * sc;
        const th = 72 * sc;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx - 3.8 * sc, pr.y - th * 0.56, 7.6 * sc, th * 0.56);
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(tx, pr.y - th * 0.72, 20 * sc, 0, Math.PI * 2);
        ctx.arc(tx - 11 * sc, pr.y - th * 0.58, 14 * sc, 0, Math.PI * 2);
        ctx.arc(tx + 11 * sc, pr.y - th * 0.58, 14 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath(); ctx.arc(tx - 3 * sc, pr.y - th * 0.78, 10 * sc, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 5. Depth-Sorted Obstacles & Collectibles (In-place sort — zero GC!)
    bObjects.sort((a, b) => a.z - b.z);
    for (let i = 0; i < bObjects.length; i++) {
      const obj = bObjects[i];
      if (obj.hit || obj.z <= 0.01) continue;
      const pr = projectLane(obj.lane, obj.z, W);
      drawBalotWorldObject(ctx, obj, pr.x, pr.y, pr.scale);
    }

    // 6. Redesigned Manong Balot Vendor Running Forward!
    const pProj = projectLane(bLaneX, 0.93, W);
    drawBalotVendorSprite(ctx, pProj.x, pProj.y - bJumpY * 0.65, pProj.scale);

    // 7. Rear-View Chasing Askal Dog (Facing AWAY from camera, UP toward Manong!)
    const dogZ = bDogClose >= 1 ? 1.03 : 1.1;
    const dProj = projectLane(bLaneX, dogZ, W);
    const dogY = bDogClose >= 1 ? 556 : 584;
    drawChasingDogFacingManong(ctx, dProj.x, dogY, bDogClose >= 1 ? 1.12 : 0.98);
  }

  function drawPasigFerry(ctx, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.strokeStyle = 'rgba(224,242,254,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-34, 7); ctx.lineTo(34, 7); ctx.stroke();
    ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(-24, 4); ctx.lineTo(26, 4); ctx.lineTo(32, -4); ctx.lineTo(-20, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#0284c7'; ctx.fillRect(-20, -1, 46, 3);
    ctx.fillStyle = '#e2e8f0'; roundRect(ctx, -14, -13, 30, 9, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047';
    for (let w = 0; w < 4; w++) ctx.fillRect(-10 + w * 7, -10, 4.5, 4.5);
    ctx.restore();
  }

  function drawBalotWorldObject(ctx, obj, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;

    if (obj.kind === 'egg') {
      // REDESIGNED BALOT EGG COLLECTIBLE (Warm Aura + Speckled Duck Egg + Steam + Asin/Suka Tag!)
      const bob = Math.sin(time * 7 + obj.z * 8) * 4;
      ctx.translate(0, bob);
      // Warm Golden Halo
      ctx.fillStyle = 'rgba(253, 224, 71, 0.34)';
      ctx.beginPath(); ctx.arc(0, -22, 24, 0, Math.PI * 2); ctx.fill();
      // Rising Steam Wisps!
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.8;
      for (let s = -1; s <= 1; s += 2) {
        const sy = ((time * 18 + s * 4) % 10);
        ctx.beginPath();
        ctx.moveTo(s * 5, -38 - sy * 0.4);
        ctx.quadraticCurveTo(s * 9, -44 - sy * 0.5, s * 4, -49 - sy * 0.5);
        ctx.stroke();
      }
      // Egg Body with warm creamy-tan duck egg shading
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.bezierCurveTo(13, -38, 16, -18, 12, -9);
      ctx.bezierCurveTo(7, -2, -7, -2, -12, -9);
      ctx.bezierCurveTo(-16, -18, -13, -38, 0, -40);
      ctx.fill(); ctx.stroke();
      // Glossy highlight & subtle duck-egg speckles
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(-5, -28, 3, 6.5, -0.25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath(); ctx.arc(6, -24, 1.3, 0, Math.PI * 2); ctx.arc(4, -14, 1.5, 0, Math.PI * 2); ctx.arc(-4, -13, 1.2, 0, Math.PI * 2); ctx.fill();
      // Tiny Salt & Chili-Suka Packet Ribbon!
      ctx.fillStyle = '#ef4444';
      roundRect(ctx, -13, -24, 26, 9, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 7.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('BALOT ₱20', 0, -17);
    } else if (obj.kind === 'coin') {
      const spinW = Math.max(4, Math.abs(Math.cos(time * 5 + obj.z * 6)) * 13);
      ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#92400e';
      ctx.beginPath(); ctx.ellipse(0, -18, spinW, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (spinW > 7) {
        ctx.fillStyle = '#92400e'; ctx.font = 'bold 13px Fredoka, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('₱', 0, -13);
      }
    } else if (obj.kind === 'chili') {
      ctx.fillStyle = 'rgba(249,115,22,0.42)';
      ctx.beginPath(); ctx.arc(0, -20, 22, 0, Math.PI * 2); ctx.fill();
      ctx.font = '25px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌶️', 0, -12);
    } else if (obj.kind === 'jeep') {
      // DETAILED JUMPABLE FILIPINO JEEPNEY (Roof Hop!)
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath(); ctx.ellipse(0, 2, 46, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Tires
      ctx.fillStyle = '#09090b';
      roundRect(ctx, -40, -16, 14, 18, 4); ctx.fill(); ctx.stroke();
      roundRect(ctx, 26, -16, 14, 18, 4); ctx.fill(); ctx.stroke();
      // Main Jeepney Rear Body
      ctx.fillStyle = obj.color || '#ef4444';
      roundRect(ctx, -42, -74, 84, 62, 9); ctx.fill(); ctx.stroke();
      // Yellow/Gold Pinoy Decorative Stripe
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-40, -34, 80, 9);
      // Open Rear Passenger Entrance Window
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, -24, -64, 48, 36, 5); ctx.fill(); ctx.stroke();
      // Chrome Roof Rack + Glowing Route Signboard!
      ctx.fillStyle = '#e2e8f0';
      roundRect(ctx, -44, -82, 88, 11, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#facc15';
      roundRect(ctx, -26, -79, 52, 12, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111827'; ctx.font = 'bold 8.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(bCity.routeSign, 0, -70);
      // Glowing Red Taillights + Chrome Bumper
      ctx.fillStyle = '#fb7185';
      ctx.beginPath(); ctx.arc(-33, -24, 4.5, 0, Math.PI * 2); ctx.arc(33, -24, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      roundRect(ctx, -44, -17, 88, 8, 3); ctx.fill(); ctx.stroke();
      // Roof-Hop Cue!
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 9.5px Fredoka, sans-serif';
      ctx.fillText('▲ JUMP ROOF!', 0, -88);
    } else if (obj.kind === 'tricycle') {
      // DETAILED JUMPABLE PH TODA TRICYCLE (Sidecar + Motorcycle Rear!)
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(0, 2, 42, 7, 0, 0, Math.PI * 2); ctx.fill();
      // Wheels
      ctx.fillStyle = '#09090b';
      roundRect(ctx, -34, -16, 10, 17, 3); ctx.fill(); ctx.stroke();
      roundRect(ctx, 22, -16, 12, 17, 3); ctx.fill(); ctx.stroke();
      // Sidecar Cabin (Left)
      ctx.fillStyle = obj.color || '#10b981';
      roundRect(ctx, -38, -56, 52, 46, 8); ctx.fill(); ctx.stroke();
      // Motorcycle Rear (Right)
      ctx.fillStyle = '#1e293b';
      roundRect(ctx, 14, -44, 24, 34, 6); ctx.fill(); ctx.stroke();
      // Roof Canopy
      ctx.fillStyle = '#facc15';
      roundRect(ctx, -40, -64, 78, 12, 5); ctx.fill(); ctx.stroke();
      // Rear Window + Taillight
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, -30, -48, 36, 18, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(-28, -20, 4, 0, Math.PI * 2); ctx.arc(26, -24, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TODA', -12, -17);
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 9px Fredoka, sans-serif';
      ctx.fillText('▲ JUMP!', 0, -70);
    } else if (obj.kind === 'barrier') {
      // Jumpable Road Barrier with Blinking Amber Light
      ctx.fillStyle = '#f97316';
      roundRect(ctx, -36, -28, 72, 24, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-26, -24, 14, 16); ctx.fillRect(12, -24, 14, 16);
      ctx.fillStyle = Math.sin(time * 10) > 0 ? '#fde047' : '#f59e0b';
      ctx.beginPath(); ctx.arc(0, -32, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('▲ JUMP!', 0, -42);
    } else {
      // Jumpable Illuminated Fishball Cart
      ctx.fillStyle = '#b45309';
      roundRect(ctx, -34, -46, 68, 42, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      roundRect(ctx, -38, -58, 76, 14, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('FISHBALL', 0, -22);
      ctx.fillText('▲ JUMP!', 0, -64);
    }
    ctx.restore();
  }

  function drawBalotVendorSprite(ctx, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    const jumping = bJumpY > 6;
    const stride = time * 19;
    const step = Math.sin(stride);
    const bob = jumping ? 0 : Math.abs(step) * -5;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath();
    ctx.ellipse(0, 4 + bJumpY * 0.45, jumping ? 17 : 23, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, bob);
    ctx.rotate(bLaneTilt);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;

    // 1. Running Legs + Sneakers with White Soles (Tucked in Mid-Air Jump!)
    const lLegY = jumping ? -24 : -22 + step * 6;
    const rLegY = jumping ? -20 : -22 - step * 6;
    const pantColor = customLook.bottom === 'maong' ? '#2563eb' : customLook.bottom === 'khaki' ? '#ca8a04' : '#18181b';
    ctx.fillStyle = pantColor;
    roundRect(ctx, -14, lLegY, 11, jumping ? 15 : 19, 4); ctx.fill(); ctx.stroke();
    roundRect(ctx, 3, rLegY, 11, jumping ? 15 : 19, 4); ctx.fill(); ctx.stroke();
    // Sneakers
    ctx.fillStyle = '#ef4444';
    roundRect(ctx, -15, lLegY + (jumping ? 11 : 15), 13, 7, 3); ctx.fill(); ctx.stroke();
    roundRect(ctx, 2, rLegY + (jumping ? 11 : 15), 13, 7, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-13, lLegY + (jumping ? 16 : 20), 9, 2.2);
    ctx.fillRect(4, rLegY + (jumping ? 16 : 20), 9, 2.2);

    // 2. Torso Shirt (Back View!) + Fluttering White Shoulder Towel (Bimpo!)
    const shirtColor = customLook.top === 'jersey' ? '#facc15' : customLook.top === 'manong' ? '#ffffff' : customLook.top === 'red' ? '#dc2626' : '#f97316';
    ctx.fillStyle = shirtColor;
    roundRect(ctx, -18, -52, 36, 32, 9); ctx.fill(); ctx.stroke();
    // Shirt collar + back number/stripe
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(-10, -45, 20, 4);
    // White Bimpo Towel draped over left shoulder fluttering in the wind!
    const flutter = Math.sin(time * 16) * 3;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-15, -51);
    ctx.lineTo(-6, -51);
    ctx.lineTo(-4 + flutter, -26);
    ctx.lineTo(-14 + flutter, -24);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-13 + flutter * 0.7, -31, 8, 2.5);

    // Left pumping arm
    ctx.fillStyle = customLook.skin === 'deep' ? '#c98856' : '#f5be93';
    roundRect(ctx, -24, -48 - step * 4, 8, 18, 4); ctx.fill(); ctx.stroke();

    // 3. Authentic Woven Bamboo BALOT Basket (Tiklis) with Red Checkered Katsa Cloth & Steaming Eggs!
    // Basket strap across back
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(-14, -50); ctx.lineTo(18, -32); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    // Woven basket body
    ctx.fillStyle = '#d97706';
    roundRect(ctx, 11, -43, 29, 23, 6); ctx.fill(); ctx.stroke();
    // Woven cross-hatch lines
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(13, -34); ctx.lineTo(38, -34);
    ctx.moveTo(13, -27); ctx.lineTo(38, -27);
    ctx.moveTo(21, -42); ctx.lineTo(21, -21);
    ctx.moveTo(30, -42); ctx.lineTo(30, -21);
    ctx.stroke();
    // Red-and-White Checkered Cloth Rim + Warm Balot Eggs peeking out!
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.ellipse(20, -44, 5.2, 6.2, 0, 0, Math.PI * 2);
    ctx.ellipse(30, -44, 5.2, 6.2, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    roundRect(ctx, 10, -44, 31, 6, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, -43, 5, 4); ctx.fillRect(26, -43, 5, 4);

    // 4. Head (Back View!) + Hair + Red Vendor Cap with Brim!
    ctx.fillStyle = customLook.skin === 'deep' ? '#c98856' : '#f5be93';
    ctx.beginPath(); ctx.arc(0, -66, 15.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Dark hair at back of neck
    ctx.fillStyle = '#111827';
    ctx.beginPath(); ctx.arc(0, -64, 15, 0.25, Math.PI - 0.25); ctx.fill();
    // Red Cap + White Strap Buckle at back!
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -69, 16, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef08a';
    roundRect(ctx, -6, -70, 12, 4.5, 2); ctx.fill(); ctx.stroke();

    if (bBoostTimer > 0) {
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🌶️ TURBO BALOT!', 0, -92);
    }
    ctx.restore();
  }

  // ---- REAR-CHASE ASKAL DOG: FACING AWAY FROM CAMERA & CHASING UP TOWARD MANONG! ----
  function drawChasingDogFacingManong(ctx, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);

    const stride = time * (bDogClose >= 1 ? 26 : 21);
    const gallop = Math.sin(stride) * 5.5;
    const stretch = Math.cos(stride) * 4;
    const wag = Math.sin(time * 24) * 0.55;
    const earFlap = Math.sin(stride + 0.5) * 0.2;
    // Dog slightly lunges head left/right looking forward at Manong's heels!
    const lungeSide = Math.sin(time * 7) * 2.5;

    // 1. Ground Shadow + Kicking Dust Puffs behind rear paws!
    ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 24 + Math.abs(stretch), 7.5, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let d = 0; d < 2; d++) {
      const p = (time * 5.2 + d * 0.5) % 1;
      ctx.fillStyle = `rgba(226, 232, 240, ${(0.48 * (1 - p)).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc((d === 0 ? -13 : 13) + (d === 0 ? -1 : 1) * p * 10, 3 + p * 7, 3.5 + p * 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.translate(0, -6 + gallop * 0.65);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;

    // 2. FRONT FORE-LEGS (Furthest from camera, reaching UPWARD toward Manong!)
    const frontOff = Math.cos(stride) * 6;
    [-12, 12].forEach((lx, idx) => {
      const dy = idx === 0 ? -frontOff : frontOff;
      ctx.fillStyle = '#9a3412';
      roundRect(ctx, lx - 4.5, -42 + dy * 0.6, 9, 18, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef3c7';
      roundRect(ctx, lx - 4, -45 + dy * 0.6, 8, 6, 3); ctx.fill(); ctx.stroke();
    });

    // 3. BACK OF ASKAL HEAD & PERKED EARS (Facing UP toward Manong — NO front eyes staring at camera!)
    ctx.save();
    ctx.translate(lungeSide, -43 - stretch * 0.45);
    // Pointed snout peeking slightly upward ahead of the head (pointing AT Manong!)
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(lungeSide * 0.5, -13, 6.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Tiny black nose tip pointing forward at Manong
    ctx.fillStyle = '#09090b';
    ctx.beginPath(); ctx.arc(lungeSide * 0.7, -17, 2.8, 0, Math.PI * 2); ctx.fill();

    // Flapping Triangular Askal Ears (Back View!)
    [-1, 1].forEach((side) => {
      ctx.save();
      ctx.translate(side * 10, -4);
      ctx.rotate(side * (-0.35 + earFlap));
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(side * 11, -13);
      ctx.quadraticCurveTo(side * 14, -1, side * 5, 7);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    });

    // Back of Cranium (Warm caramel fur + darker crown stripe)
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14.5, 12, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.ellipse(0, -1, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bark Sound Waves + Comic Bubble radiating UPWARD toward Manong!
    const showBark = bDogClose >= 1 || Math.sin(time * 3.6) > 0.68;
    if (showBark) {
      // Action bark arcs pointing up toward Manong
      ctx.strokeStyle = bDogClose >= 1 ? '#ef4444' : '#fde047';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -17, 10, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();

      const msg = bDogClose >= 1 ? 'GRRR! AW! AW!' : 'AW! AW!';
      const bw = bDogClose >= 1 ? 84 : 52;
      const by = -31;
      ctx.fillStyle = bDogClose >= 1 ? '#fef08a' : '#ffffff';
      ctx.strokeStyle = bDogClose >= 1 ? '#dc2626' : INK;
      ctx.lineWidth = 2;
      roundRect(ctx, -bw / 2, by - 12, bw, 17, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = bDogClose >= 1 ? '#b91c1c' : '#111827';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(msg, 0, by);
    }
    ctx.restore();

    // 4. Red Collar wrapping around the BACK of the Dog's Neck!
    ctx.fillStyle = '#dc2626';
    roundRect(ctx, -14, -34, 28, 6.5, 3); ctx.fill(); ctx.stroke();
    // Silver buckle on back of collar
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-3.5, -33, 7, 4.5);

    // 5. Sleek Muscular Back & Hind Haunches (Closest to Camera!)
    ctx.fillStyle = '#c2651a';
    ctx.beginPath();
    ctx.ellipse(0, -18, 20, 17 + stretch * 0.4, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Dark brown Askal dorsal spine stripe running up the back!
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.ellipse(0, -21, 9.5, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Kicking HIND LEGS & Rear Paw Pads (Closest to Camera — Pushing off the ground!)
    const hindOff = Math.sin(stride) * 7;
    [-14, 14].forEach((lx, idx) => {
      const dy = idx === 0 ? hindOff : -hindOff;
      ctx.fillStyle = '#b45309';
      roundRect(ctx, lx - 6, -15 + dy * 0.65, 12, 18, 5); ctx.fill(); ctx.stroke();
      // White hind socks & pink/dark paw pads showing as feet kick back!
      ctx.fillStyle = '#fef3c7';
      roundRect(ctx, lx - 5.5, -2 + dy * 0.65, 11, 7.5, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(lx, 2 + dy * 0.65, 2.2, 0, Math.PI * 2); ctx.fill();
    });

    // 7. Prominent Whipping Curled Askal Tail RIGHT AT THE REAR (Closest to Camera!)
    ctx.save();
    ctx.translate(0, -10);
    ctx.rotate(wag);
    ctx.strokeStyle = INK; ctx.lineWidth = 9.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(13, -10, 8, -24); ctx.stroke();
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(13, -10, 8, -24); ctx.stroke();
    // Cream-white tail tip!
    ctx.strokeStyle = '#fef3c7'; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(10, -17); ctx.lineTo(8, -24); ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // ---------- MALUNGGAY PANDESAL NI KUYA TISOY (UPGRADED MORNING BARANGAY + 10 RANDOM CUSTOMERS!) ----------
  function bakePandesalStaticBackdrop(bctx, W) {
    const roadY = 475;
    // Warm Golden Philippine Sunrise Sky
    const sky = bctx.createLinearGradient(0, 0, 0, roadY);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.45, '#38bdf8');
    sky.addColorStop(0.78, '#fef08a');
    sky.addColorStop(1, '#fed7aa');
    bctx.fillStyle = sky;
    bctx.fillRect(0, 0, W, roadY);

    // Rising Morning Sun
    const sunX = W - 96;
    const sunG = bctx.createRadialGradient(sunX, 92, 10, sunX, 92, 86);
    sunG.addColorStop(0, '#fef9c3');
    sunG.addColorStop(0.45, 'rgba(253,224,71,0.52)');
    sunG.addColorStop(1, 'rgba(253,224,71,0)');
    bctx.fillStyle = sunG;
    bctx.beginPath(); bctx.arc(sunX, 92, 86, 0, Math.PI * 2); bctx.fill();

    // Distant Sierra Madre / Barangay Rolling Hills Silhouette
    bctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
    bctx.beginPath();
    bctx.moveTo(0, roadY);
    bctx.quadraticCurveTo(W * 0.22, roadY - 125, W * 0.48, roadY - 78);
    bctx.quadraticCurveTo(W * 0.76, roadY - 140, W, roadY - 82);
    bctx.lineTo(W, roadY); bctx.closePath(); bctx.fill();

    // Concrete Barangay Sidewalk & Asphalt Street
    bctx.fillStyle = '#cbd5e1'; bctx.fillRect(0, roadY, W, 18);
    bctx.fillStyle = '#94a3b8'; bctx.fillRect(0, roadY + 15, W, 3);
    bctx.fillStyle = '#475569'; bctx.fillRect(0, roadY + 18, W, H - roadY - 18);
  }

  function renderPandesalBike(ctx, W) {
    const roadY = 475;
    const bikeScreenX = W < 520 ? W * 0.34 : 210;

    // 1. Blit Cached Morning Sky, Sun & Road in ONE fast drawImage!
    ensureBackdropCache(W, 'pandesal_morning', bakePandesalStaticBackdrop);
    ctx.drawImage(cacheCanvas, 0, 0);

    // 2. Drifting Morning Clouds + Distant Barangay Trees Parallax
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let c = 0; c < 4; c++) {
      const cx = ((c * 220 - pDist * 0.08 + time * 8) % (W + 160) + (W + 160)) % (W + 160) - 80;
      const cy = 58 + (c % 2) * 38;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 38, 13, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + 22, cy - 5, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Parallax Barangay Coconut Palms & Distant Roofs behind the houses
    const bgSpan = 260;
    const bgOff = ((pDist * 0.32) % bgSpan + bgSpan) % bgSpan;
    for (let bx = -bgOff; bx < W + bgSpan; bx += bgSpan) {
      // Distant swaying coconut palm!
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(bx + 60, roadY); ctx.quadraticCurveTo(bx + 52, roadY - 110, bx + 68, roadY - 195); ctx.stroke();
      ctx.fillStyle = '#15803d';
      for (let f = 0; f < 5; f++) {
        const ang = -2.6 + f * 0.65;
        ctx.beginPath();
        ctx.ellipse(bx + 68 + Math.cos(ang) * 24, roadY - 195 + Math.sin(ang) * 14, 24, 6, ang, 0, Math.PI * 2);
        ctx.fill();
      }
      // Distant Barangay Basketball Hoop / Waiting Shed Silhouette
      ctx.fillStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.fillRect(bx + 150, roadY - 130, 85, 130);
    }

    // 3. Wooden Electric Poles (Poste) + Sagging Power Lines + Colorful Fiesta BANDERITAS Overhead!
    const poleSpan = 340;
    const poleStart = -(((pDist) % poleSpan + poleSpan) % poleSpan);
    const bandColors = ['#ef4444', '#facc15', '#22c55e', '#38bdf8', '#ec4899', '#f97316'];
    for (let px = poleStart; px < W + poleSpan; px += poleSpan) {
      // Wooden Electric Pole
      ctx.fillStyle = '#78350f'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      ctx.fillRect(px - 5, 160, 10, roadY - 160);
      ctx.fillStyle = '#475569';
      ctx.fillRect(px - 18, 174, 36, 5);
      // Sagging wire & colorful Fiesta Banderitas to next pole!
      const nextPx = px + poleSpan;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(px, 178); ctx.quadraticCurveTo(px + poleSpan / 2, 224, nextPx, 178); ctx.stroke();
      // Triangular fiesta flags!
      for (let k = 1; k <= 9; k++) {
        const t = k / 10;
        const fx = px + t * poleSpan;
        const fy = (1 - t) * (1 - t) * 178 + 2 * (1 - t) * t * 224 + t * t * 178;
        ctx.fillStyle = bandColors[k % bandColors.length];
        ctx.beginPath();
        ctx.moveTo(fx - 8, fy); ctx.lineTo(fx + 8, fy); ctx.lineTo(fx, fy + 14);
        ctx.closePath(); ctx.fill();
      }
    }

    // 4. Randomized Filipino Neighborhood Houses & 10 Distinct Customers!
    for (let i = 0; i < pHouses.length; i++) {
      const h = pHouses[i];
      const hx = bikeScreenX + (h.dist - pDist);
      if (hx < -240 || hx > W + 240) continue;
      drawBarangayHouse(ctx, hx, roadY, h);
    }

    // 5. Animated Street Center Dashed Lines
    ctx.fillStyle = '#f8fafc';
    const dashOff = ((pDist) % 80 + 80) % 80;
    for (let lx = -dashOff; lx < W + 80; lx += 80) {
      ctx.fillRect(lx, roadY + 62, 40, 6);
    }

    // 6. Kuya Tisoy on his Classic Pandesal Bicycle!
    drawKuyaTisoyBike(ctx, bikeScreenX, roadY + 34);
  }

  function drawBarangayHouse(ctx, cx, roadY, h) {
    ctx.save();
    const isTwoStory = h.type === 'twostory';
    const isSariSari = h.type === 'sarisari';
    const w = isSariSari ? 200 : 188;
    const hH = isTwoStory ? 215 : 175;
    const x = cx - w / 2;
    const y = roadY - hH;

    // Glowing Green STOP & SELL Zone on Street when house shouts "PANDESAL!"
    if (h.wantsPandesal && !h.sold && !h.missed) {
      ctx.fillStyle = `rgba(16, 185, 129, ${0.26 + Math.sin(time * 8) * 0.1})`;
      ctx.fillRect(x, roadY + 4, w, 78);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(x, roadY + 4, w, 78);
      ctx.setLineDash([]);
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚲 STOP & SELL HERE!', cx, roadY + 75);
    }

    // House Wall
    ctx.fillStyle = h.color; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    roundRect(ctx, x, y + 36, w, hH - 36, 8); ctx.fill(); ctx.stroke();

    // Pitched Filipino Galvanized Roof + TV Antenna
    ctx.fillStyle = h.roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 42);
    ctx.lineTo(cx, y - 4);
    ctx.lineTo(x + w + 12, y + 42);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    if (isTwoStory) {
      // 2nd Floor Balcony + Laundry Line (Sampayan)!
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 14, y + 88, w - 28, 7);
      ctx.strokeRect(x + 14, y + 88, w - 28, 7);
      // Hanging shirts on sampayan!
      ctx.fillStyle = '#38bdf8'; ctx.fillRect(x + 24, y + 62, 16, 18); ctx.strokeRect(x + 24, y + 62, 16, 18);
      ctx.fillStyle = '#f472b6'; ctx.fillRect(x + 48, y + 62, 16, 18); ctx.strokeRect(x + 48, y + 62, 16, 18);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + w - 62, y + 52, 42, 34); ctx.strokeRect(x + w - 62, y + 52, 42, 34);
    }

    if (isSariSari) {
      // Sari-Sari Store / Tindahan Awning & Counter Window!
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 16, y + 72, 92, 54); ctx.strokeRect(x + 16, y + 72, 92, 54);
      // Striped red-and-yellow awning
      for (let s = 0; s < 6; s++) {
        ctx.fillStyle = s % 2 === 0 ? '#ef4444' : '#facc15';
        ctx.fillRect(x + 12 + s * 16.5, y + 58, 16.5, 18);
        ctx.strokeRect(x + 12 + s * 16.5, y + 58, 16.5, 18);
      }
      // Hanging snack packs!
      ['#facc15', '#ef4444', '#22c55e', '#38bdf8'].forEach((scol, idx) => {
        ctx.fillStyle = scol;
        ctx.fillRect(x + 24 + idx * 18, y + 80, 11, 14);
      });
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TINDAHAN', x + 62, y + 54);
    } else {
      // Jalousie Window with horizontal slats
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + 18, roadY - 108, 44, 42); ctx.strokeRect(x + 18, roadY - 108, 44, 42);
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.4;
      for (let j = 1; j <= 4; j++) {
        ctx.beginPath(); ctx.moveTo(x + 20, roadY - 108 + j * 8); ctx.lineTo(x + 60, roadY - 108 + j * 8); ctx.stroke();
      }
      ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    }

    // Front Door / Wooden Gate
    ctx.fillStyle = '#78350f';
    roundRect(ctx, cx - 18, roadY - 76, 40, 76, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(cx + 14, roadY - 38, 3, 0, Math.PI * 2); ctx.fill();

    // Potted Bougainvillea Plant beside door!
    if (h.hasPlant) {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x + 10, roadY - 22, 18, 22); ctx.strokeRect(x + 10, roadY - 22, 18, 22);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath(); ctx.arc(x + 19, roadY - 30, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath(); ctx.arc(x + 14, roadY - 32, 3.5, 0, Math.PI * 2); ctx.arc(x + 23, roadY - 28, 3.5, 0, Math.PI * 2); ctx.fill();
    }

    // Morning Rooster (Tandang!) perched on yard fence!
    if (h.hasRooster) {
      const rx = x + w - 20;
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.ellipse(rx, roadY - 12, 9, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(rx - 6, roadY - 19, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rx - 8, roadY - 25, 4, 4);
    }

    // Distinct Randomized Filipino Customer stepping out to buy Pandesal!
    if (h.wantsPandesal) {
      drawBarangayCustomer(ctx, cx + 44, roadY, h.customer, !h.sold && !h.missed);
    }

    // Speech Bubble above the House!
    if (h.wantsPandesal && !h.sold && !h.missed) {
      const pulse = Math.sin(time * 9) * 3;
      ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
      roundRect(ctx, cx - 76, y - 4 + pulse, 152, 48, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dc2626'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`📣 ${h.customer.shout}`, cx, y + 14 + pulse);
      ctx.fillStyle = '#111827'; ctx.font = 'bold 11.5px Fredoka, sans-serif';
      ctx.fillText(`${h.ownerName} · ${h.qty} pcs (₱${h.qty * 2})`, cx, y + 32 + pulse);
    } else if (h.sold) {
      ctx.fillStyle = '#dcfce7'; ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5;
      roundRect(ctx, cx - 54, y + 8, 108, 28, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#15803d'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('✓ SALAMAT PO!', cx, y + 26);
    } else if (h.missed) {
      ctx.fillStyle = '#fee2e2'; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5;
      roundRect(ctx, cx - 54, y + 8, 108, 28, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dc2626'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('😢 SAYANG!', cx, y + 26);
    }

    ctx.restore();
  }

  function drawBarangayCustomer(ctx, cx, roadY, cust, waving) {
    ctx.save();
    const isKid = cust.prop === 'kid';
    const sc = isKid ? 0.78 : 1.0;
    const bounce = waving ? Math.abs(Math.sin(time * 8 + cx * 0.02)) * 4 : 0;
    ctx.translate(cx, roadY - bounce);
    ctx.scale(sc, sc);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;

    // Legs
    ctx.fillStyle = '#334155';
    roundRect(ctx, -8, -20, 6.5, 20, 3); ctx.fill(); ctx.stroke();
    roundRect(ctx, 1.5, -20, 6.5, 20, 3); ctx.fill(); ctx.stroke();

    // Outfit / Shirt
    ctx.fillStyle = cust.shirt;
    roundRect(ctx, -12, -46, 24, 28, 6); ctx.fill(); ctx.stroke();
    if (cust.prop === 'apron') {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-8, -38, 16, 18); ctx.strokeRect(-8, -38, 16, 18);
    } else if (cust.prop === 'shawl') {
      ctx.fillStyle = '#e9d5ff'; ctx.fillRect(-12, -45, 24, 8);
    }

    // Waving Arm calling Kuya Tisoy!
    const waveAng = waving ? -0.9 + Math.sin(time * 12) * 0.45 : 0.2;
    ctx.save();
    ctx.translate(-11, -40);
    ctx.rotate(waveAng);
    ctx.fillStyle = cust.skin;
    roundRect(ctx, -4, -18, 7, 19, 3); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Optional Prop (Coffee Mug / Walis / Newspaper / Coin Purse)
    if (cust.prop === 'mug') {
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(10, -35, 8, 9); ctx.strokeRect(10, -35, 8, 9);
    } else if (cust.prop === 'purse') {
      ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(13, -28, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (cust.prop === 'paper') {
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(9, -38, 11, 13); ctx.strokeRect(9, -38, 11, 13);
    }

    // Head
    ctx.fillStyle = cust.skin;
    ctx.beginPath(); ctx.arc(0, -56, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Distinct Hairstyle / Headgear per Customer!
    ctx.fillStyle = cust.hair;
    if (cust.style === 'bun' || cust.style === 'lola') {
      ctx.beginPath(); ctx.arc(0, -61, 12, Math.PI, 0); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -70, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (cust.style === 'cap') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(0, -60, 12.5, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillRect(-14, -62, 10, 3.5);
    } else if (cust.style === 'curlers') {
      ctx.beginPath(); ctx.arc(0, -61, 12, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath(); ctx.arc(-9, -66, 3.5, 0, Math.PI * 2); ctx.arc(0, -69, 3.5, 0, Math.PI * 2); ctx.arc(9, -66, 3.5, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, -60, 12.2, Math.PI, 0); ctx.fill();
    }

    // Eyes & Smile (plus mustache for Mang Tony or glasses for Lola!)
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-4, -56, 1.8, 0, Math.PI * 2); ctx.arc(3, -56, 1.8, 0, Math.PI * 2); ctx.fill();
    if (cust.style === 'stache') {
      ctx.fillRect(-5, -52, 9, 2.5);
    } else if (cust.style === 'lola') {
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.4;
      ctx.strokeRect(-7, -59, 5.5, 5); ctx.strokeRect(0.5, -59, 5.5, 5);
    }
    ctx.beginPath(); ctx.arc(-0.5, -52, 3.2, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.restore();
  }

  function drawKuyaTisoyBike(ctx, x, y) {
    ctx.save();
    const bob = Math.abs(pSpeed) > 15 ? Math.sin(time * 18) * 2 : 0;
    ctx.translate(x, y + bob);
    ctx.strokeStyle = INK; ctx.lineWidth = 3;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, 22, 58, 8, 0, 0, Math.PI * 2); ctx.fill();

    // Shout wave
    if (pShoutWave > 0) {
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(38, -42, 18 + (0.55 - pShoutWave) * 55, -0.6, 0.6); ctx.stroke();
    }

    // Spinning Wheels
    const wheelRot = pDist * 0.08;
    [-34, 34].forEach((wx) => {
      ctx.save();
      ctx.translate(wx, 4);
      ctx.fillStyle = '#111827';
      ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
      ctx.rotate(wheelRot);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.moveTo(0, -12); ctx.lineTo(0, 12); ctx.stroke();
      ctx.restore();
    });

    // Classic Blue Bike Frame & Handlebars
    ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-34, 4); ctx.lineTo(-4, -22); ctx.lineTo(24, -24); ctx.lineTo(34, 4);
    ctx.moveTo(-4, -22); ctx.lineTo(-4, 4); ctx.lineTo(24, -24);
    ctx.moveTo(24, -24); ctx.lineTo(20, -40); ctx.lineTo(30, -42);
    ctx.stroke();

    // Wooden Malunggay Pandesal Box on the Back Rack!
    ctx.fillStyle = '#b45309'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    roundRect(ctx, -64, -44, 44, 32, 5); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-62, -33); ctx.lineTo(-22, -33); ctx.moveTo(-62, -23); ctx.lineTo(-22, -23); ctx.stroke();
    // Golden Malunggay Pandesal Rolls peeking out top!
    ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    [-53, -42, -31].forEach((bx) => {
      ctx.beginPath(); ctx.ellipse(bx, -45, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#16a34a'; ctx.fillRect(bx - 2, -46, 2.5, 2);
      ctx.fillStyle = '#f59e0b';
    });
    // Centered crisp 2-line Box Label
    ctx.fillStyle = '#fef08a'; ctx.font = 'bold 7.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('PANDESAL', -42, -29);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8.5px Fredoka, sans-serif';
    ctx.fillText('₱2 EACH', -42, -18);

    // Kuya Tisoy Riding!
    ctx.fillStyle = '#18181b'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRect(ctx, -8, -18, 11, 20, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, -14, -48, 24, 30, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-10, -34, 18, 16);
    ctx.strokeStyle = '#f5be93'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(24, -41); ctx.stroke();
    ctx.fillStyle = '#f5be93'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(0, -61, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(4, -62, 2.2, 0, Math.PI * 2); ctx.arc(10, -62, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -57, 4, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.arc(-1, -66, 15.5, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    roundRect(ctx, 4, -71, 16, 4.5, 2); ctx.fill(); ctx.stroke();

    ctx.restore();
  }

  return {
    PANDESAL_LEVELS,
    BALOT_CITIES,
    start,
    stop,
    setPaused,
    update,
    render,
    balotMoveLane,
    balotJump,
    pandesalShout,
    isActive: () => active,
    getSubMode: () => subMode
  };
})();
