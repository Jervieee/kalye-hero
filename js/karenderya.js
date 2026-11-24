// KALYE HERO: KARENDERYA MANIA — 5 Levels, Progressive Dish Unlocks, Upgrades & Empleyado Helpers!
const Karenderya = (() => {
  const INK = '#111827';
  const H = 630;
  const SAVE_KEY = 'kalye_hero_karenderya_save_v1';

  const DISHES = {
    adobo: { id: 'adobo', name: 'ADOBO', emoji: '🍲', price: 65, cookTime: 2.2, batch: 3, accent: '#f59e0b' },
    kanin: { id: 'kanin', name: 'KANIN', emoji: '🍚', price: 25, cookTime: 1.4, batch: 4, accent: '#38bdf8' },
    halohalo: { id: 'halohalo', name: 'HALO-HALO', emoji: '🍧', price: 60, cookTime: 1.8, batch: 2, accent: '#f472b6' },
    sinigang: { id: 'sinigang', name: 'SINIGANG', emoji: '🥘', price: 75, cookTime: 2.5, batch: 3, accent: '#22c55e' },
    sisig: { id: 'sisig', name: 'SISIG', emoji: '🍳', price: 85, cookTime: 2.7, batch: 3, accent: '#f97316' },
    karekare: { id: 'karekare', name: 'KARE-KARE', emoji: '🥜', price: 95, cookTime: 3.0, batch: 3, accent: '#eab308' },
    lechon: { id: 'lechon', name: 'LECHON', emoji: '🍗', price: 110, cookTime: 3.2, batch: 2, accent: '#ef4444' }
  };

  const LEVELS = [
    {
      index: 0,
      name: 'LVL 1 · MORNING MERIENDA',
      short: 'Morning Merienda',
      icon: '☀️',
      unlockText: '🍲 Adobo · 🍚 Kanin · 🍧 Halo-Halo',
      dishes: ['adobo', 'kanin', 'halohalo'],
      timeLimit: 75,
      customerGoal: 6,
      salesGoal: 420,
      spawnDelay: 3.3,
      maxOrderItems: 2
    },
    {
      index: 1,
      name: 'LVL 2 · LUNCHTIME RUSH',
      short: 'Lunchtime Rush',
      icon: '🥘',
      unlockText: '🔓 NEW DISH: 🥘 Sinigang!',
      dishes: ['adobo', 'kanin', 'halohalo', 'sinigang'],
      timeLimit: 85,
      customerGoal: 9,
      salesGoal: 800,
      spawnDelay: 2.8,
      maxOrderItems: 2
    },
    {
      index: 2,
      name: 'LVL 3 · BARKADA SISIG NIGHT',
      short: 'Barkada Sisig',
      icon: '🍳',
      unlockText: '🔓 NEW DISH: 🍳 Sizzling Sisig!',
      dishes: ['adobo', 'kanin', 'halohalo', 'sinigang', 'sisig'],
      timeLimit: 90,
      customerGoal: 11,
      salesGoal: 1150,
      spawnDelay: 2.5,
      maxOrderItems: 3
    },
    {
      index: 3,
      name: 'LVL 4 · SUNDAY KARE-KARE',
      short: 'Sunday Kare-Kare',
      icon: '🥜',
      unlockText: '🔓 NEW DISH: 🥜 Kare-Kare!',
      dishes: ['adobo', 'kanin', 'halohalo', 'sinigang', 'sisig', 'karekare'],
      timeLimit: 95,
      customerGoal: 13,
      salesGoal: 1550,
      spawnDelay: 2.3,
      maxOrderItems: 3
    },
    {
      index: 4,
      name: 'LVL 5 · FIESTA GRAND FEAST',
      short: 'Fiesta Feast',
      icon: '🍗',
      unlockText: '🔓 NEW DISH: 🍗 Lechon Kawali!',
      dishes: ['adobo', 'kanin', 'halohalo', 'sinigang', 'sisig', 'karekare', 'lechon'],
      timeLimit: 105,
      customerGoal: 16,
      salesGoal: 2100,
      spawnDelay: 2.0,
      maxOrderItems: 3
    }
  ];

  const UPGRADE_COSTS = {
    tray: [0, 250, 550],         // Lvl 1 (2 slots) -> Lvl 2 (3) -> Lvl 3 (4)
    stove: [0, 220, 480, 800],   // Lvl 1 (1.0x) -> Lvl 2 (1.35x) -> Lvl 3 (1.75x) -> Lvl 4 (2.25x)
    staff: [0, 300, 650]         // 0 -> 1 Empleyado (Ate Nene) -> 2 Empleyados (Ate Nene & Kuya Jun)
  };
  const STOVE_MULT = [1.0, 1.35, 1.75, 2.25];

  const CUSTOMER_PROFILES = [
    { id: 'tessa', name: 'Aling Tessa', patienceRate: 1.0, tipMult: 1.15, quote: 'SARAP NAMAN MANONG!' },
    { id: 'loring', name: 'Aling Loring', patienceRate: 0.85, tipMult: 1.12, quote: 'MAINIT PA! SALAMAT IHO!' },
    { id: 'baby', name: 'Madam Baby', patienceRate: 1.3, tipMult: 1.55, quote: 'FABULOUS! KEEP THE CHANGE! 💅' },
    { id: 'jeo', name: 'Jeo Ong', patienceRate: 0.95, tipMult: 1.45, quote: 'SOLID TO MANONG! 🔥' }
  ];

  let save = {
    bank: 0,
    trayLevel: 1,   // 1..3 => capacity = trayLevel + 1 (2, 3, 4)
    stoveLevel: 1,  // 1..4
    staffLevel: 0   // 0..2
  };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      save = { ...save, ...parsed };
    }
  } catch (_) {}

  function persistSave() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (_) {}
  }

  function getUpgradesState() {
    const trayMax = 3;
    const stoveMax = 4;
    const staffMax = 2;
    return {
      bank: save.bank,
      trayLevel: save.trayLevel,
      trayCap: save.trayLevel + 1,
      trayNextCost: save.trayLevel < trayMax ? UPGRADE_COSTS.tray[save.trayLevel] : null,
      stoveLevel: save.stoveLevel,
      stoveSpeed: STOVE_MULT[save.stoveLevel - 1],
      stoveNextCost: save.stoveLevel < stoveMax ? UPGRADE_COSTS.stove[save.stoveLevel] : null,
      staffLevel: save.staffLevel,
      staffNextCost: save.staffLevel < staffMax ? UPGRADE_COSTS.staff[save.staffLevel + 1] : null
    };
  }

  function buyUpgrade(kind) {
    const st = getUpgradesState();
    if (kind === 'tray' && st.trayNextCost !== null && save.bank >= st.trayNextCost) {
      save.bank -= st.trayNextCost;
      save.trayLevel++;
      persistSave();
      SoundFX.powerup();
      return true;
    }
    if (kind === 'stove' && st.stoveNextCost !== null && save.bank >= st.stoveNextCost) {
      save.bank -= st.stoveNextCost;
      save.stoveLevel++;
      persistSave();
      SoundFX.powerup();
      return true;
    }
    if (kind === 'staff' && st.staffNextCost !== null && save.bank >= st.staffNextCost) {
      save.bank -= st.staffNextCost;
      save.staffLevel++;
      persistSave();
      SoundFX.powerup();
      return true;
    }
    SoundFX.noEnergy();
    return false;
  }

  // Runtime state
  let active = false;
  let paused = false;
  let finished = false;
  let time = 0;

  let levelIdx = 0;
  let levelCfg = LEVELS[0];
  let activeDishKeys = LEVELS[0].dishes;
  let timeLeft = 75;
  let sales = 0;
  let customersServed = 0;
  let angryLeft = 0;
  let combo = 0;
  let spawnTimer = 0.7;
  let nextCustSeed = 0;
  let staffTimers = [2.4, 3.8];

  let manong = { x: 320, targetX: 320, actionTimer: 0, facing: 1 };
  let tray = [];
  let seats = [null, null, null];
  let stations = {};
  let particles = [];
  let floatTexts = [];
  let lastViewW = 800;

  let onStatusUpdate = null;
  let onEndCallback = null;

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

  function addFloat(x, y, text, color = '#fde047', size = 16) {
    floatTexts.push({ x, y, vy: -56, text, color, size, life: 1.2, maxLife: 1.2 });
  }

  function addParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 55 + Math.random() * 145;
      particles.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 45,
        size: 3 + Math.random() * 4.5, color,
        life: 0.4 + Math.random() * 0.35, maxLife: 0.75
      });
    }
  }

  function getSeatX(seatIndex, W) {
    return W * (0.18 + seatIndex * 0.32);
  }

  function getStationRect(idx, W) {
    const count = activeDishKeys.length;
    const margin = Math.max(6, Math.min(12, W * 0.02));
    const gap = 5;

    if (count <= 4) {
      const totalW = W - margin * 2 - gap * (count - 1);
      const w = totalW / count;
      return { x: margin + idx * (w + gap), y: 486, w, h: 126, compactRow: false };
    }
    // 2 neat rows for 5–7 unlocked dishes so every button stays big & tappable on mobile!
    const topCount = Math.ceil(count / 2);
    const botCount = count - topCount;
    const isTop = idx < topCount;
    const rowIdx = isTop ? idx : idx - topCount;
    const cols = isTop ? topCount : botCount;
    const totalW = W - margin * 2 - gap * (cols - 1);
    const w = totalW / cols;
    return {
      x: margin + rowIdx * (w + gap),
      y: isTop ? 464 : 546,
      w,
      h: 76,
      compactRow: true
    };
  }

  function initStations() {
    stations = {};
    activeDishKeys.forEach((k) => {
      stations[k] = {
        servings: k === 'kanin' ? 3 : 2,
        cooking: false,
        cookProgress: 0
      };
    });
  }

  function buildOrderForLevel() {
    const pool = activeDishKeys;
    const maxItems = levelCfg.maxOrderItems;
    const itemCount = Math.random() < 0.25 ? 1 : Math.random() < 0.75 ? Math.min(2, maxItems) : maxItems;
    const chosen = [];
    // Favor pairing main ulam with kanin or halo-halo, and highlight the newest unlocked dish!
    const newestDish = pool[pool.length - 1];
    if (levelIdx > 0 && Math.random() < 0.55) {
      chosen.push(newestDish);
    }
    while (chosen.length < itemCount) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!chosen.includes(pick) || chosen.length < 2) {
        chosen.push(pick);
      }
    }
    return chosen.map((dishId) => ({ dishId, served: false }));
  }

  function spawnCustomer(W) {
    const emptySeats = [];
    for (let i = 0; i < 3; i++) if (!seats[i]) emptySeats.push(i);
    if (emptySeats.length === 0) return;

    const seatIdx = emptySeats[Math.floor(Math.random() * emptySeats.length)];
    const profile = CUSTOMER_PROFILES[nextCustSeed % CUSTOMER_PROFILES.length];
    nextCustSeed++;

    seats[seatIdx] = {
      seatIdx,
      profile,
      order: buildOrderForLevel(),
      patience: 100,
      maxPatience: 100,
      enterAnim: 1.0,
      happyTimer: 0
    };
    addFloat(getSeatX(seatIdx, W), 156, `${profile.name}!`, '#fef08a', 15);
  }

  function start(lvlIndex, statusCb, endCb) {
    levelIdx = Math.max(0, Math.min(LEVELS.length - 1, lvlIndex || 0));
    levelCfg = LEVELS[levelIdx];
    activeDishKeys = levelCfg.dishes;
    onStatusUpdate = statusCb;
    onEndCallback = endCb;

    active = true;
    paused = false;
    finished = false;
    time = 0;
    timeLeft = levelCfg.timeLimit;
    sales = 0;
    customersServed = 0;
    angryLeft = 0;
    combo = 0;
    spawnTimer = 0.5;
    nextCustSeed = levelIdx;
    staffTimers = [3.2, 4.4];
    tray = [];
    seats = [null, null, null];
    particles = [];
    floatTexts = [];
    manong = { x: lastViewW / 2, targetX: lastViewW / 2, actionTimer: 0, facing: 1 };
    initStations();

    spawnCustomer(lastViewW);
    spawnTimer = 1.5;
    notifyHUD();
  }

  function stop() {
    active = false;
    paused = false;
  }

  function setPaused(val) {
    paused = val;
  }

  function notifyHUD() {
    if (!onStatusUpdate) return;
    onStatusUpdate({
      levelIdx,
      levelName: levelCfg.name,
      timeLeft: Math.ceil(Math.max(0, timeLeft)),
      sales,
      salesGoal: levelCfg.salesGoal,
      customersServed,
      customerGoal: levelCfg.customerGoal,
      bank: save.bank,
      trayCap: save.trayLevel + 1,
      staffLevel: save.staffLevel,
      combo
    });
  }

  function interactDish(dishId) {
    if (!active || paused || finished) return;
    const st = stations[dishId];
    const cfg = DISHES[dishId];
    if (!st || !cfg) return;

    const idx = activeDishKeys.indexOf(dishId);
    const rect = getStationRect(idx, lastViewW);
    manong.targetX = rect.x + rect.w / 2;
    manong.actionTimer = 0.28;

    if (st.cooking) {
      addFloat(rect.x + rect.w / 2, rect.y - 8, 'COOKING... 🔥', '#fb923c', 13);
      return;
    }

    if (st.servings <= 0) {
      st.cooking = true;
      st.cookProgress = 0;
      SoundFX.sizzle();
      addParticles(rect.x + rect.w / 2, rect.y + 24, cfg.accent, 8);
      addFloat(rect.x + rect.w / 2, rect.y - 8, `COOKING ${cfg.name}! 🔥`, '#fde047', 13);
      notifyHUD();
      return;
    }

    const trayCap = save.trayLevel + 1;
    if (tray.length >= trayCap) {
      SoundFX.noEnergy();
      addFloat(manong.x, 345, `TRAY FULL (${trayCap}/${trayCap})!`, '#fb923c', 14);
      return;
    }

    st.servings--;
    tray.push(dishId);
    SoundFX.board();
    addParticles(rect.x + rect.w / 2, rect.y + 22, '#fef08a', 7);
    addFloat(rect.x + rect.w / 2, rect.y - 8, `+${cfg.emoji} ${cfg.name}`, '#ffffff', 13);

    if (st.servings === 0) {
      st.cooking = true;
      st.cookProgress = 0;
      SoundFX.sizzle();
    }
    notifyHUD();
  }

  function interactDishByIndex(idx) {
    if (idx >= 0 && idx < activeDishKeys.length) {
      interactDish(activeDishKeys[idx]);
    }
  }

  function clearTray() {
    if (!active || paused || finished || tray.length === 0) return;
    tray = [];
    SoundFX.trashDish();
    addFloat(manong.x, 355, 'TRAY CLEARED 🗑️', '#94a3b8', 14);
    notifyHUD();
  }

  function completeCustomerOrder(cust, sx) {
    combo++;
    const baseTotal = cust.order.reduce((sum, o) => sum + DISHES[o.dishId].price, 0);
    const speedTip = cust.patience >= 65 ? 30 : cust.patience >= 35 ? 15 : 0;
    const comboBonus = combo >= 3 ? 25 : 0;
    const payout = Math.round((baseTotal + speedTip + comboBonus) * cust.profile.tipMult);

    sales += payout;
    save.bank += payout;
    persistSave();
    customersServed++;
    cust.happyTimer = 0.75;
    SoundFX.serveHappy();
    addParticles(sx, 225, '#34d399', 16);
    addParticles(sx, 225, '#facc15', 10);
    addFloat(sx, 172, `+₱${payout} ${cust.profile.quote}`, '#34d399', 15);
    checkWinCondition();
  }

  function serveSeat(seatIdx) {
    if (!active || paused || finished) return;
    const cust = seats[seatIdx];
    if (!cust || cust.happyTimer > 0) return;

    const sx = getSeatX(seatIdx, lastViewW);
    manong.targetX = sx;
    manong.actionTimer = 0.3;

    if (tray.length === 0) {
      SoundFX.noEnergy();
      addFloat(sx, 220, 'TAP A DISH FIRST! 🍲', '#fde047', 14);
      return;
    }

    let servedAny = false;
    for (let t = tray.length - 1; t >= 0; t--) {
      const dishId = tray[t];
      const needed = cust.order.find((o) => o.dishId === dishId && !o.served);
      if (needed) {
        needed.served = true;
        tray.splice(t, 1);
        servedAny = true;
        cust.patience = Math.min(100, cust.patience + 22);
      }
    }

    if (!servedAny) {
      SoundFX.noEnergy();
      addFloat(sx, 215, 'WRONG ORDER! 😅', '#fb923c', 15);
      return;
    }

    if (cust.order.every((o) => o.served)) {
      completeCustomerOrder(cust, sx);
    } else {
      SoundFX.coin();
      addParticles(sx, 235, '#fde047', 8);
      addFloat(sx, 200, 'SERVED! +1 MORE DISH!', '#fde047', 14);
    }
    notifyHUD();
  }

  // Hired Empleyado Helper AI (Auto-cooks empty pots & periodically serves waiting customers!)
  function runEmpleyadoAssist(helperIdx, W) {
    const helperName = helperIdx === 0 ? 'Ate Nene' : 'Kuya Jun';
    // 1. Auto-cook any empty idle pot
    for (const k of activeDishKeys) {
      const st = stations[k];
      if (!st.cooking && st.servings <= 0) {
        st.cooking = true;
        st.cookProgress = 0;
        SoundFX.sizzle();
        addFloat(W * (helperIdx === 0 ? 0.16 : 0.84), 380, `${helperName}: COOKING ${DISHES[k].emoji}!`, '#38bdf8', 12);
        return;
      }
    }
    // 2. Serve 1 ready dish to the most impatient waiting customer!
    let targetCust = null;
    for (const c of seats) {
      if (c && c.happyTimer <= 0 && (!targetCust || c.patience < targetCust.patience)) {
        targetCust = c;
      }
    }
    if (!targetCust) return;
    for (const o of targetCust.order) {
      if (!o.served && stations[o.dishId] && stations[o.dishId].servings > 0) {
        stations[o.dishId].servings--;
        if (stations[o.dishId].servings === 0) {
          stations[o.dishId].cooking = true;
          stations[o.dishId].cookProgress = 0;
        }
        o.served = true;
        targetCust.patience = Math.min(100, targetCust.patience + 20);
        const sx = getSeatX(targetCust.seatIdx, W);
        if (targetCust.order.every((item) => item.served)) {
          completeCustomerOrder(targetCust, sx);
        } else {
          SoundFX.coin();
          addFloat(sx, 202, `${helperName} served ${DISHES[o.dishId].emoji}!`, '#38bdf8', 13);
        }
        return;
      }
    }
  }

  function handleCanvasPointer(canvasX, canvasY) {
    if (!active || paused || finished) return;

    if (canvasY >= 55 && canvasY <= 345) {
      let bestSeat = -1;
      let bestDist = Infinity;
      for (let i = 0; i < 3; i++) {
        const sx = getSeatX(i, lastViewW);
        const d = Math.abs(canvasX - sx);
        if (d < lastViewW * 0.17 && d < bestDist) {
          bestDist = d;
          bestSeat = i;
        }
      }
      if (bestSeat >= 0) {
        serveSeat(bestSeat);
        return;
      }
    }

    for (let i = 0; i < activeDishKeys.length; i++) {
      const r = getStationRect(i, lastViewW);
      if (canvasX >= r.x && canvasX <= r.x + r.w && canvasY >= r.y - 6 && canvasY <= r.y + r.h + 6) {
        interactDish(activeDishKeys[i]);
        return;
      }
    }
  }

  function checkWinCondition() {
    if (finished) return;
    if (customersServed >= levelCfg.customerGoal && sales >= levelCfg.salesGoal) {
      finished = true;
      // Bonus Kita reward on level clear!
      const clearBonus = 100 + levelIdx * 50;
      save.bank += clearBonus;
      persistSave();
      SoundFX.stageClear();
      const stars = angryLeft === 0 ? 5 : angryLeft === 1 ? 4 : 3;
      if (onEndCallback) {
        onEndCallback({
          won: true,
          levelIdx,
          isLastLevel: levelIdx >= LEVELS.length - 1,
          sales,
          salesGoal: levelCfg.salesGoal,
          customersServed,
          customerGoal: levelCfg.customerGoal,
          bank: save.bank,
          clearBonus,
          timeLeft: Math.ceil(timeLeft),
          stars
        });
      }
    }
  }

  function update(dt, W) {
    lastViewW = W;
    if (!active || paused || finished) return;
    time += dt;

    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0;
      finished = true;
      const metGoals = customersServed >= levelCfg.customerGoal && sales >= levelCfg.salesGoal;
      if (metGoals) SoundFX.stageClear();
      else SoundFX.gameOver();
      if (onEndCallback) {
        onEndCallback({
          won: metGoals,
          levelIdx,
          isLastLevel: levelIdx >= LEVELS.length - 1,
          sales,
          salesGoal: levelCfg.salesGoal,
          customersServed,
          customerGoal: levelCfg.customerGoal,
          bank: save.bank,
          clearBonus: 0,
          timeLeft: 0,
          stars: metGoals ? 4 : 1
        });
      }
      return;
    }

    const dxM = manong.targetX - manong.x;
    if (Math.abs(dxM) > 4) {
      manong.facing = Math.sign(dxM);
      manong.x += dxM * Math.min(1, dt * 11);
    }
    if (manong.actionTimer > 0) manong.actionTimer = Math.max(0, manong.actionTimer - dt);

    // Cook Pots (boosted by Stove Upgrade!)
    const cookMult = STOVE_MULT[save.stoveLevel - 1] || 1.0;
    activeDishKeys.forEach((k, idx) => {
      const st = stations[k];
      const cfg = DISHES[k];
      if (st.cooking) {
        st.cookProgress += dt * cookMult;
        if (st.cookProgress >= cfg.cookTime) {
          st.cooking = false;
          st.cookProgress = 0;
          st.servings = cfg.batch;
          SoundFX.dishReady();
          const r = getStationRect(idx, W);
          addParticles(r.x + r.w / 2, r.y + 20, '#fef08a', 9);
          addFloat(r.x + r.w / 2, r.y - 4, `${cfg.emoji} READY!`, '#34d399', 13);
        }
      }
    });

    // Run Hired Empleyado Helpers!
    for (let h = 0; h < save.staffLevel; h++) {
      staffTimers[h] -= dt;
      if (staffTimers[h] <= 0) {
        runEmpleyadoAssist(h, W);
        staffTimers[h] = h === 0 ? 4.4 : 5.0;
      }
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnCustomer(W);
      spawnTimer = levelCfg.spawnDelay + Math.random() * 1.0;
    }

    for (let i = 0; i < 3; i++) {
      const c = seats[i];
      if (!c) continue;
      if (c.enterAnim > 0) c.enterAnim = Math.max(0, c.enterAnim - dt * 3.5);
      if (c.happyTimer > 0) {
        c.happyTimer -= dt;
        if (c.happyTimer <= 0) seats[i] = null;
        continue;
      }
      const drain = (3.1 + levelIdx * 0.45) * c.profile.patienceRate;
      c.patience -= drain * dt;
      if (c.patience <= 0) {
        const sx = getSeatX(i, W);
        angryLeft++;
        combo = 0;
        SoundFX.angry();
        addFloat(sx, 185, `${c.profile.name} LEFT ANGRY! 😠`, '#f87171', 14);
        addParticles(sx, 220, '#ef4444', 10);
        seats[i] = null;
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.vy += 380 * dt; pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const ft = floatTexts[i];
      ft.y += ft.vy * dt; ft.vy *= 0.94; ft.life -= dt;
      if (ft.life <= 0) floatTexts.splice(i, 1);
    }

    notifyHUD();
  }

  // ==================== RENDERING KARENDERYA MANIA ====================
  function render(ctx, W) {
    lastViewW = W;
    ctx.save();

    const wallGrad = ctx.createLinearGradient(0, 0, 0, 320);
    wallGrad.addColorStop(0, '#fef3c7');
    wallGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, 320);

    ctx.strokeStyle = 'rgba(180, 83, 9, 0.14)';
    ctx.lineWidth = 1.5;
    for (let tx = 0; tx < W; tx += 46) { ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, 320); ctx.stroke(); }
    for (let ty = 0; ty < 320; ty += 46) { ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(W, ty); ctx.stroke(); }

    // Fiesta Banderitas
    const flagColors = ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#ec4899'];
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 14); ctx.quadraticCurveTo(W / 2, 34, W, 14); ctx.stroke();
    const flagCount = Math.max(10, Math.floor(W / 44));
    for (let f = 1; f < flagCount; f++) {
      const t = f / flagCount;
      const fx = W * t;
      const fy = 14 + 4 * t * (1 - t) * 20;
      ctx.fillStyle = flagColors[f % flagColors.length];
      ctx.beginPath(); ctx.moveTo(fx - 7, fy); ctx.lineTo(fx + 7, fy); ctx.lineTo(fx + Math.sin(time * 4 + f) * 2, fy + 15); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    const signW = Math.min(340, W - 20);
    ctx.fillStyle = '#991b1b'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    roundRect(ctx, W / 2 - signW / 2, 24, signW, 34, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047'; ctx.font = `bold ${W < 400 ? 13 : 15}px Fredoka, sans-serif`; ctx.textAlign = 'center';
    ctx.fillText("🍲 MANONG'S KARENDERYA · TURO-TURO", W / 2, 46);

    for (let i = 0; i < 3; i++) {
      const sx = getSeatX(i, W);
      const cust = seats[i];
      if (cust) drawCustomer(ctx, sx, 282, cust, W);
      else {
        ctx.fillStyle = 'rgba(120, 53, 15, 0.16)';
        ctx.font = 'bold 12px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`SEAT ${i + 1}`, sx, 266);
      }
    }

    // Dining Counter
    ctx.fillStyle = '#b45309'; ctx.strokeStyle = INK; ctx.lineWidth = 3.5;
    ctx.fillRect(0, 290, W, 16); ctx.strokeRect(-4, 290, W + 8, 16);

    const stationTopY = activeDishKeys.length <= 4 ? 472 : 454;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 306, W, stationTopY - 306);
    ctx.fillStyle = '#78350f';
    for (let px = 20; px < W; px += 90) ctx.fillRect(px, 316, 68, stationTopY - 324);

    // Draw Hired Empleyado Helpers behind the counter!
    if (save.staffLevel >= 1) drawEmpleyado(ctx, W * 0.14, stationTopY - 12, 'Ate Nene', '#2563eb', 0);
    if (save.staffLevel >= 2) drawEmpleyado(ctx, W * 0.86, stationTopY - 12, 'Kuya Jun', '#10b981', 1);

    // Draw Manong Chef (White Shirt + Shoulder Towel!) & Upgraded Tray!
    drawManongChef(ctx, manong.x, stationTopY - 8, W);

    // Bottom Interactive Dish Stations
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, stationTopY, W, H - stationTopY);
    ctx.strokeStyle = '#facc15'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, stationTopY); ctx.lineTo(W, stationTopY); ctx.stroke();

    activeDishKeys.forEach((k, idx) => drawStationCard(ctx, k, idx, W));

    for (const pt of particles) {
      ctx.save(); ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color; ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      ctx.restore();
    }
    for (const ft of floatTexts) {
      ctx.save(); ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = `700 ${ft.size}px Fredoka, sans-serif`; ctx.textAlign = 'center';
      ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color; ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawEmpleyado(ctx, x, y, name, apronColor, idx) {
    ctx.save();
    const bob = Math.sin(time * 7 + idx * 2) * 2.5;
    ctx.translate(x, y + bob);
    ctx.scale(0.76, 0.76);
    // White shirt + colored helper apron
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    roundRect(ctx, -20, -56, 40, 42, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = apronColor;
    roundRect(ctx, -14, -44, 28, 30, 5); ctx.fill(); ctx.stroke();
    // Head
    ctx.fillStyle = '#f5be93';
    ctx.beginPath(); ctx.ellipse(0, -76, 19, 17.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#18181b';
    ctx.beginPath(); ctx.arc(0, -82, 19, Math.PI, 0); ctx.fill(); ctx.stroke();
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(-6, -75, 2.5, 0, Math.PI * 2); ctx.arc(6, -75, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -70, 5, 0.15, Math.PI - 0.15); ctx.stroke();
    // Name tag
    ctx.fillStyle = '#111827';
    roundRect(ctx, -34, -12, 68, 17, 5); ctx.fill();
    ctx.fillStyle = '#93c5fd'; ctx.font = 'bold 10.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(name, 0, 0);
    ctx.restore();
  }

  function drawManongChef(ctx, x, y, W) {
    ctx.save();
    const bob = Math.sin(time * 6) * 2.5 - (manong.actionTimer > 0 ? 5 : 0);
    ctx.translate(x, y + bob);
    const sc = activeDishKeys.length > 4 ? 0.9 : 1.0;
    ctx.scale(sc, sc);

    ctx.fillStyle = 'rgba(253, 224, 71, 0.14)';
    ctx.beginPath(); ctx.ellipse(0, -48, 52, 56, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    roundRect(ctx, -20, -20, 40, 22, 6); ctx.fill(); ctx.stroke();

    // Crisp White Shirt
    ctx.fillStyle = '#ffffff'; ctx.lineWidth = 3;
    roundRect(ctx, -24, -62, 48, 46, 11); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    roundRect(ctx, -18, -32, 36, 10, 4); ctx.fill();

    // Classic Red-Striped Shoulder Towel (Bimpo!)
    ctx.fillStyle = '#f8fafc'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    roundRect(ctx, 10, -64, 17, 36, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, -39, 13, 3.5); ctx.fillRect(12, -33, 13, 3.5);

    // Wooden Sandok (Ladle)
    ctx.save();
    ctx.translate(-24, -46);
    ctx.rotate(manong.actionTimer > 0 ? -0.45 : -0.15);
    ctx.fillStyle = '#f2b88a'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    roundRect(ctx, -12, -5, 16, 11, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#b45309';
    roundRect(ctx, -17, -26, 6, 26, 2.5); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-14, -29, 8, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();

    // Manong Chibi Head
    ctx.save();
    ctx.translate(0, -86);
    ctx.fillStyle = '#e5a373'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(-22, 2, 5.5, 0, Math.PI * 2); ctx.arc(22, 2, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f5be93';
    ctx.beginPath(); ctx.ellipse(0, 2, 23, 21, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.beginPath(); ctx.ellipse(-12, 7, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.ellipse(12, 7, 4.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.ellipse(-8, -1, 3.2, 4.2, 0, 0, Math.PI * 2); ctx.ellipse(8, -1, 3.2, 4.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-6.8, -2.5, 1.3, 0, Math.PI * 2); ctx.arc(9.2, -2.5, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.ellipse(-4.5, 7, 5, 2.2, -0.15, 0, Math.PI * 2); ctx.ellipse(4.5, 7, 5, 2.2, 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 9, 6, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.fillStyle = '#18181b';
    ctx.beginPath(); ctx.arc(0, -6, 23, Math.PI + 0.12, -0.12);
    ctx.quadraticCurveTo(8, -14, 0, -11); ctx.quadraticCurveTo(-10, -15, -22, -4); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.restore();

    // Dynamic Upgraded Serving Tray (2, 3, or 4 slots!)
    const cap = save.trayLevel + 1;
    const trayW = cap * 32 + 16;
    const trayX = x > W - 125 ? -trayW - 22 : 38;
    ctx.save();
    ctx.translate(trayX, -44);
    ctx.fillStyle = '#475569'; ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.8;
    roundRect(ctx, 0, -16, trayW, 38, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fde047'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`TRAY ${tray.length}/${cap}`, trayW / 2, -20);
    if (tray.length === 0) {
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.fillText('EMPTY', trayW / 2, 7);
    } else {
      tray.forEach((dId, i) => {
        ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(DISHES[dId].emoji, 22 + i * 31, 4);
      });
    }
    ctx.restore();

    ctx.restore();
  }

  function drawCustomer(ctx, x, y, cust, W) {
    ctx.save();
    const slideY = cust.enterAnim * 48;
    const happyHop = cust.happyTimer > 0 ? Math.abs(Math.sin(time * 16)) * -12 : Math.sin(time * 4 + cust.seatIdx) * 2;
    ctx.translate(x, y + slideY + happyHop);

    const id = cust.profile.id;
    if (id === 'jeo') {
      // JEO ONG: Long flowing dark hair + patterned bandana + black shirt + blue maong pants!
      ctx.fillStyle = '#111827'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(-25, -58); ctx.quadraticCurveTo(-32, -26, -27, -2); ctx.lineTo(27, -2); ctx.quadraticCurveTo(32, -26, 25, -58); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2563eb'; roundRect(ctx, -18, -12, 36, 14, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#18181b'; roundRect(ctx, -21, -46, 42, 37, 9); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f2b88a'; ctx.beginPath(); ctx.ellipse(0, -68, 21, 19.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111827'; roundRect(ctx, -25, -72, 7, 34, 3); ctx.fill(); ctx.stroke();
      roundRect(ctx, 18, -72, 7, 34, 3); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dc2626'; roundRect(ctx, -22, -84, 44, 11, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; for (let bx = -14; bx <= 14; bx += 7) { ctx.beginPath(); ctx.arc(bx, -78.5, 1.8, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(21, -80); ctx.lineTo(31, -74); ctx.lineTo(27, -69); ctx.lineTo(20, -76); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(0, -82, 19, Math.PI, 0); ctx.fill(); ctx.stroke();
      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, false);
    } else if (id === 'baby') {
      ctx.fillStyle = '#451a03'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(-20, -66, 14, 0, Math.PI * 2); ctx.arc(20, -66, 14, 0, Math.PI * 2); ctx.arc(0, -82, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#dc2626'; roundRect(ctx, -22, -46, 44, 48, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; for (let px = -10; px <= 10; px += 5) { ctx.beginPath(); ctx.arc(px, -42, 2.3, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(-21, -59, 5, 0, Math.PI * 2); ctx.arc(21, -59, 5, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#fbd0b0'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#111827'; roundRect(ctx, -17, -75, 15, 9, 4); roundRect(ctx, 2, -75, 15, 9, 4); ctx.fill();
      ctx.fillStyle = '#facc15'; ctx.fillRect(-2, -72, 4, 2);
      ctx.fillStyle = '#e11d48'; ctx.beginPath(); ctx.ellipse(0, -58, 5, 2.8, 0, 0, Math.PI * 2); ctx.fill();
    } else if (id === 'loring') {
      ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, -93, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#a78bfa'; roundRect(ctx, -21, -46, 42, 48, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-5, -46, 10, 46);
      ctx.fillStyle = '#f5c29b'; ctx.beginPath(); ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(0, -75, 20, Math.PI, 0); ctx.fill(); ctx.stroke();
      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, true);
    } else {
      ctx.fillStyle = '#18181b'; ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.arc(0, -92, 9.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ec4899'; roundRect(ctx, -21, -46, 42, 48, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fde047'; [[-10, -30], [8, -22], [-5, -14], [11, -36]].forEach(([fx, fy]) => { ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = '#f5be93'; ctx.beginPath(); ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#18181b'; ctx.beginPath(); ctx.arc(0, -75, 20, Math.PI, 0); ctx.fill(); ctx.stroke();
      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, false);
    }

    ctx.fillStyle = '#111827';
    roundRect(ctx, -44, -14, 88, 19, 6); ctx.fill();
    ctx.fillStyle = id === 'jeo' ? '#38bdf8' : id === 'baby' ? '#f472b6' : '#fde047';
    ctx.font = 'bold 11px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(cust.profile.name, 0, -1);

    const bubbleW = Math.min(W * 0.3, cust.order.length * 32 + 22);
    ctx.fillStyle = cust.happyTimer > 0 ? '#dcfce7' : '#ffffff';
    ctx.strokeStyle = cust.patience < 30 ? '#ef4444' : INK; ctx.lineWidth = 3;
    roundRect(ctx, -bubbleW / 2, -166, bubbleW, 56, 12); ctx.fill(); ctx.stroke();

    const spacing = Math.min(32, (bubbleW - 14) / cust.order.length);
    const startX = -((cust.order.length - 1) * spacing) / 2;
    cust.order.forEach((o, i) => {
      const ix = startX + i * spacing;
      ctx.save();
      if (o.served) ctx.globalAlpha = 0.35;
      ctx.font = '21px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(DISHES[o.dishId].emoji, ix, -143);
      ctx.restore();
      if (o.served) {
        ctx.fillStyle = '#16a34a'; ctx.font = 'bold 14px Fredoka, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('✓', ix, -140);
      }
    });

    const barW = bubbleW - 18;
    ctx.fillStyle = '#1e293b'; roundRect(ctx, -barW / 2, -122, barW, 7, 3); ctx.fill();
    const pRatio = Math.max(0, cust.patience / cust.maxPatience);
    ctx.fillStyle = pRatio > 0.55 ? '#22c55e' : pRatio > 0.28 ? '#facc15' : '#ef4444';
    roundRect(ctx, -barW / 2, -122, barW * pRatio, 7, 3); ctx.fill();

    const canServe = cust.happyTimer <= 0 && tray.some((d) => cust.order.some((o) => o.dishId === d && !o.served));
    if (canServe) {
      ctx.fillStyle = '#10b981'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
      roundRect(ctx, -38, -188, 76, 19, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#052e16'; ctx.font = 'bold 10px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TAP SERVE!', 0, -175);
    }
    ctx.restore();
  }

  function drawCustFace(ctx, x, y, patience, happy, glasses) {
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.arc(x - 7, y - 3, 2.5, 0, Math.PI * 2); ctx.arc(x + 7, y - 3, 2.5, 0, Math.PI * 2); ctx.fill();
    if (glasses) {
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(x - 7, y - 3, 5.5, 0, Math.PI * 2); ctx.arc(x + 7, y - 3, 5.5, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath();
    if (happy || patience > 55) ctx.arc(x, y + 3, 5, 0.15, Math.PI - 0.15);
    else if (patience > 28) { ctx.moveTo(x - 5, y + 6); ctx.lineTo(x + 5, y + 6); }
    else ctx.arc(x, y + 9, 5, Math.PI + 0.2, -0.2);
    ctx.stroke();
  }

  function drawStationCard(ctx, dishId, idx, W) {
    const r = getStationRect(idx, W);
    const cfg = DISHES[dishId];
    const st = stations[dishId];
    const compact = r.compactRow || W < 440;

    ctx.save();
    ctx.fillStyle = st.cooking ? '#1e293b' : st.servings > 0 ? '#1e3a8a' : '#334155';
    ctx.strokeStyle = st.servings > 0 ? '#facc15' : '#64748b';
    ctx.lineWidth = 2.8;
    roundRect(ctx, r.x, r.y, r.w, r.h, 12);
    ctx.fill(); ctx.stroke();

    if (r.compactRow) {
      // Sleek 2-row card for 5–7 dishes!
      ctx.font = '22px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillText(cfg.emoji, r.x + 8, r.y + 24);
      ctx.fillStyle = '#ffffff'; ctx.font = `bold ${W < 420 ? 9.5 : 11}px Fredoka, sans-serif`;
      ctx.fillText(cfg.name, r.x + 34, r.y + 18);
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 10px Nunito, sans-serif';
      ctx.fillText(`₱${cfg.price}`, r.x + 34, r.y + 33);
    } else {
      ctx.font = compact ? '28px sans-serif' : '34px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(cfg.emoji, r.x + r.w / 2, r.y + 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${compact ? 10 : 13}px Fredoka, sans-serif`;
      ctx.fillText(cfg.name, r.x + r.w / 2, r.y + 64);
      ctx.fillStyle = '#fde047';
      ctx.font = `bold ${compact ? 10 : 11}px Nunito, sans-serif`;
      ctx.fillText(`₱${cfg.price}`, r.x + r.w / 2, r.y + 80);
    }

    const barY = r.compactRow ? r.y + r.h - 22 : r.y + 94;
    if (st.cooking) {
      const bw = r.w - 10;
      ctx.fillStyle = '#0f172a'; roundRect(ctx, r.x + 5, barY, bw, 16, 6); ctx.fill();
      ctx.fillStyle = '#f97316'; roundRect(ctx, r.x + 5, barY, bw * Math.min(1, st.cookProgress / cfg.cookTime), 16, 6); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 8.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('COOKING', r.x + r.w / 2, barY + 8);
    } else if (st.servings > 0) {
      ctx.fillStyle = '#10b981'; roundRect(ctx, r.x + 5, barY, r.w - 10, 17, 7); ctx.fill();
      ctx.fillStyle = '#052e16'; ctx.font = `bold ${compact ? 8.5 : 10}px Fredoka, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText(`PLATE (${st.servings})`, r.x + r.w / 2, barY + 9);
    } else {
      ctx.fillStyle = '#f59e0b'; roundRect(ctx, r.x + 5, barY, r.w - 10, 17, 7); ctx.fill();
      ctx.fillStyle = '#111827'; ctx.font = `bold ${compact ? 8.5 : 10}px Fredoka, sans-serif`; ctx.textAlign = 'center';
      ctx.fillText('COOK', r.x + r.w / 2, barY + 9);
    }
    ctx.restore();
  }

  return {
    LEVELS,
    DISHES,
    getUpgradesState,
    buyUpgrade,
    start,
    stop,
    setPaused,
    interactDish,
    interactDishByIndex,
    clearTray,
    serveSeat,
    handleCanvasPointer,
    update,
    render,
    isActive: () => active
  };
})();
