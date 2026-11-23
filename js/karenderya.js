// KALYE HERO: KARENDERYA MANIA — Filipino Turo-Turo Cooking & Serving Mode!
const Karenderya = (() => {
  const INK = '#111827';
  const H = 630;

  const DISHES = {
    adobo: {
      id: 'adobo',
      name: 'ADOBO',
      emoji: '🍲',
      price: 65,
      cookTime: 2.2,
      batch: 3,
      color: '#92400e',
      accent: '#f59e0b'
    },
    sinigang: {
      id: 'sinigang',
      name: 'SINIGANG',
      emoji: '🥘',
      price: 75,
      cookTime: 2.6,
      batch: 3,
      color: '#ea580c',
      accent: '#22c55e'
    },
    kanin: {
      id: 'kanin',
      name: 'KANIN',
      emoji: '🍚',
      price: 25,
      cookTime: 1.4,
      batch: 4,
      color: '#e2e8f0',
      accent: '#38bdf8'
    },
    halohalo: {
      id: 'halohalo',
      name: 'HALO-HALO',
      emoji: '🍧',
      price: 60,
      cookTime: 1.8,
      batch: 2,
      color: '#a855f7',
      accent: '#f472b6'
    }
  };
  const DISH_KEYS = ['adobo', 'sinigang', 'kanin', 'halohalo'];

  const CUSTOMER_PROFILES = [
    {
      id: 'tessa',
      name: 'Aling Tessa',
      patienceRate: 1.0,
      tipMult: 1.15,
      quote: 'SARAP NAMAN MANONG!',
      favOrders: [
        ['adobo', 'kanin'],
        ['adobo', 'halohalo'],
        ['sinigang', 'kanin']
      ]
    },
    {
      id: 'loring',
      name: 'Aling Loring',
      patienceRate: 0.85,
      tipMult: 1.1,
      quote: 'MAINIT PA! SALAMAT IHO!',
      favOrders: [
        ['sinigang', 'kanin'],
        ['kanin', 'halohalo'],
        ['sinigang']
      ]
    },
    {
      id: 'baby',
      name: 'Madam Baby',
      patienceRate: 1.32,
      tipMult: 1.55,
      quote: 'FABULOUS! KEEP THE CHANGE! 💅',
      favOrders: [
        ['adobo', 'halohalo'],
        ['sinigang', 'halohalo'],
        ['adobo', 'kanin', 'halohalo']
      ]
    },
    {
      id: 'jeo',
      name: 'Jeo Ong',
      patienceRate: 0.95,
      tipMult: 1.45,
      quote: 'SOLID TO MANONG! 🔥',
      favOrders: [
        ['adobo', 'kanin'],
        ['sinigang', 'kanin'],
        ['adobo', 'sinigang'],
        ['sinigang', 'kanin', 'halohalo']
      ]
    }
  ];

  const LEVELS = [
    {
      index: 0,
      name: 'LVL 1 · MORNING MERIENDA',
      timeLimit: 75,
      customerGoal: 6,
      salesGoal: 450,
      spawnDelay: 3.4,
      maxOrderItems: 2
    },
    {
      index: 1,
      name: 'LVL 2 · LUNCHTIME RUSH',
      timeLimit: 85,
      customerGoal: 9,
      salesGoal: 850,
      spawnDelay: 2.7,
      maxOrderItems: 2
    },
    {
      index: 2,
      name: 'LVL 3 · FIESTA MADNESS',
      timeLimit: 95,
      customerGoal: 12,
      salesGoal: 1300,
      spawnDelay: 2.2,
      maxOrderItems: 3
    }
  ];

  let active = false;
  let paused = false;
  let finished = false;
  let time = 0;

  let levelIdx = 0;
  let levelCfg = LEVELS[0];
  let timeLeft = 75;
  let sales = 0;
  let customersServed = 0;
  let angryLeft = 0;
  let combo = 0;
  let spawnTimer = 0.7;
  let nextCustSeed = 0;

  let manong = {
    x: 320,
    targetX: 320,
    actionTimer: 0,
    facing: 1
  };

  let tray = []; // array of dish ids (max 2)
  let seats = [null, null, null]; // 3 customer seats
  let stations = {}; // { adobo: { servings, cooking, cookProgress }, ... }
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

  function addFloat(x, y, text, color = '#fde047', size = 18) {
    floatTexts.push({ x, y, vy: -58, text, color, size, life: 1.2, maxLife: 1.2 });
  }

  function addParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 55 + Math.random() * 145;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 45,
        size: 3 + Math.random() * 4.5,
        color,
        life: 0.4 + Math.random() * 0.35,
        maxLife: 0.75
      });
    }
  }

  function getSeatX(seatIndex, W) {
    return W * (0.2 + seatIndex * 0.3);
  }

  function getStationRect(idx, W) {
    const margin = Math.max(12, W * 0.03);
    const gap = Math.max(8, W * 0.018);
    const totalW = W - margin * 2 - gap * 3;
    const w = totalW / 4;
    return {
      x: margin + idx * (w + gap),
      y: 486,
      w,
      h: 122
    };
  }

  function initStations() {
    stations = {};
    DISH_KEYS.forEach((k) => {
      // Start with a small warm-up batch ready so player can immediately start serving!
      stations[k] = {
        servings: k === 'kanin' ? 3 : 2,
        cooking: false,
        cookProgress: 0
      };
    });
  }

  function spawnCustomer(W) {
    const emptySeats = [];
    for (let i = 0; i < 3; i++) {
      if (!seats[i]) emptySeats.push(i);
    }
    if (emptySeats.length === 0) return;

    const seatIdx = emptySeats[Math.floor(Math.random() * emptySeats.length)];
    // Rotate through all 4 iconic customers so Aling Tessa, Aling Loring, Madam Baby, and Jeo Ong all appear frequently!
    const profile = CUSTOMER_PROFILES[nextCustSeed % CUSTOMER_PROFILES.length];
    nextCustSeed++;

    // Pick an order matching level difficulty
    let pool = profile.favOrders.filter((o) => o.length <= levelCfg.maxOrderItems);
    if (pool.length === 0) pool = profile.favOrders;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    const orderItems = chosen.map((dishId) => ({ dishId, served: false }));
    seats[seatIdx] = {
      seatIdx,
      profile,
      order: orderItems,
      patience: 100,
      maxPatience: 100,
      enterAnim: 1.0,
      happyTimer: 0
    };
    addFloat(getSeatX(seatIdx, W), 158, `${profile.name}!`, '#fef08a', 15);
  }

  function start(lvlIndex, statusCb, endCb) {
    levelIdx = Math.max(0, Math.min(LEVELS.length - 1, lvlIndex || 0));
    levelCfg = LEVELS[levelIdx];
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
    spawnTimer = 0.4;
    nextCustSeed = levelIdx; // Vary opening customer per level
    tray = [];
    seats = [null, null, null];
    particles = [];
    floatTexts = [];
    manong = { x: lastViewW / 2, targetX: lastViewW / 2, actionTimer: 0, facing: 1 };
    initStations();

    // Immediately bring in the first 2 customers (e.g., Aling Tessa & Jeo Ong!)
    spawnCustomer(lastViewW);
    spawnTimer = 1.6;
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
      combo,
      tray: [...tray],
      stations: DISH_KEYS.map((k) => ({
        id: k,
        emoji: DISHES[k].emoji,
        name: DISHES[k].name,
        servings: stations[k].servings,
        cooking: stations[k].cooking,
        pct: Math.round((stations[k].cookProgress / DISHES[k].cookTime) * 100)
      }))
    });
  }

  function interactDish(dishId) {
    if (!active || paused || finished) return;
    const st = stations[dishId];
    const cfg = DISHES[dishId];
    if (!st || !cfg) return;

    const idx = DISH_KEYS.indexOf(dishId);
    const rect = getStationRect(idx, lastViewW);
    manong.targetX = rect.x + rect.w / 2;
    manong.actionTimer = 0.28;

    if (st.cooking) {
      addFloat(rect.x + rect.w / 2, rect.y - 10, 'COOKING... 🔥', '#fb923c', 14);
      return;
    }

    if (st.servings <= 0) {
      // Start cooking fresh batch!
      st.cooking = true;
      st.cookProgress = 0;
      SoundFX.sizzle();
      addParticles(rect.x + rect.w / 2, rect.y + 30, cfg.accent, 8);
      addFloat(rect.x + rect.w / 2, rect.y - 10, `COOKING ${cfg.name}! 🔥`, '#fde047', 14);
      notifyHUD();
      return;
    }

    // Plate 1 serving onto Manong's Tray!
    if (tray.length >= 2) {
      SoundFX.noEnergy();
      addFloat(manong.x, 345, 'TRAY FULL! SERVE CUSTOMER!', '#fb923c', 14);
      return;
    }

    st.servings--;
    tray.push(dishId);
    SoundFX.board();
    addParticles(rect.x + rect.w / 2, rect.y + 24, '#fef08a', 7);
    addFloat(rect.x + rect.w / 2, rect.y - 8, `+${cfg.emoji} ${cfg.name}`, '#ffffff', 14);

    // Auto-start recooking if pot just emptied so gameplay flows smoothly!
    if (st.servings === 0) {
      st.cooking = true;
      st.cookProgress = 0;
      SoundFX.sizzle();
    }
    notifyHUD();
  }

  function clearTray() {
    if (!active || paused || finished || tray.length === 0) return;
    tray = [];
    SoundFX.trashDish();
    addFloat(manong.x, 355, 'TRAY CLEARED 🗑️', '#94a3b8', 14);
    notifyHUD();
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
    // Match as many dishes on Manong's tray as this customer needs!
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

    // Did we complete the customer's entire order?
    const allDone = cust.order.every((o) => o.served);
    if (allDone) {
      combo++;
      const baseTotal = cust.order.reduce((sum, o) => sum + DISHES[o.dishId].price, 0);
      const speedTip = cust.patience >= 65 ? 30 : cust.patience >= 35 ? 15 : 0;
      const comboBonus = combo >= 3 ? 20 : 0;
      const payout = Math.round((baseTotal + speedTip + comboBonus) * cust.profile.tipMult);

      sales += payout;
      customersServed++;
      cust.happyTimer = 0.75;
      SoundFX.serveHappy();
      addParticles(sx, 225, '#34d399', 16);
      addParticles(sx, 225, '#facc15', 10);
      addFloat(sx, 175, `+₱${payout} ${cust.profile.quote}`, '#34d399', 16);
      checkWinCondition();
    } else {
      SoundFX.coin();
      addParticles(sx, 235, '#fde047', 8);
      addFloat(sx, 200, 'SERVED! +1 MORE DISH!', '#fde047', 14);
    }

    notifyHUD();
  }

  function handleCanvasPointer(canvasX, canvasY) {
    if (!active || paused || finished) return;

    // 1. Check Customer Seats (Top dining area y: 70..340)
    if (canvasY >= 60 && canvasY <= 355) {
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

    // 2. Check Bottom Cooking Stations (y: 470..625)
    for (let i = 0; i < DISH_KEYS.length; i++) {
      const r = getStationRect(i, lastViewW);
      if (canvasX >= r.x && canvasX <= r.x + r.w && canvasY >= r.y - 10 && canvasY <= r.y + r.h + 10) {
        interactDish(DISH_KEYS[i]);
        return;
      }
    }
  }

  function checkWinCondition() {
    if (finished) return;
    if (customersServed >= levelCfg.customerGoal && sales >= levelCfg.salesGoal) {
      finished = true;
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

    // Level Countdown Timer
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
          timeLeft: 0,
          stars: metGoals ? 4 : 1
        });
      }
      return;
    }

    // Manong smooth slide behind counter
    const dxM = manong.targetX - manong.x;
    if (Math.abs(dxM) > 4) {
      manong.facing = Math.sign(dxM);
      manong.x += dxM * Math.min(1, dt * 11);
    }
    if (manong.actionTimer > 0) manong.actionTimer = Math.max(0, manong.actionTimer - dt);

    // Update Cooking Pots
    DISH_KEYS.forEach((k, idx) => {
      const st = stations[k];
      const cfg = DISHES[k];
      if (st.cooking) {
        st.cookProgress += dt;
        if (st.cookProgress >= cfg.cookTime) {
          st.cooking = false;
          st.cookProgress = 0;
          st.servings = cfg.batch;
          SoundFX.dishReady();
          const r = getStationRect(idx, W);
          addParticles(r.x + r.w / 2, r.y + 24, '#fef08a', 10);
          addFloat(r.x + r.w / 2, r.y - 6, `${cfg.emoji} READY!`, '#34d399', 14);
        }
      }
    });

    // Spawn New Customers
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnCustomer(W);
      spawnTimer = levelCfg.spawnDelay + Math.random() * 1.1;
    }

    // Update Customers Patience & Animations
    for (let i = 0; i < 3; i++) {
      const c = seats[i];
      if (!c) continue;
      if (c.enterAnim > 0) c.enterAnim = Math.max(0, c.enterAnim - dt * 3.5);
      if (c.happyTimer > 0) {
        c.happyTimer -= dt;
        if (c.happyTimer <= 0) seats[i] = null;
        continue;
      }

      // Patience drains gently (scales by character personality)
      const drain = (3.4 + levelIdx * 0.55) * c.profile.patienceRate;
      c.patience -= drain * dt;
      if (c.patience <= 0) {
        const sx = getSeatX(i, W);
        angryLeft++;
        combo = 0;
        SoundFX.angry();
        addFloat(sx, 185, `${c.profile.name} LEFT ANGRY! 😠`, '#f87171', 15);
        addParticles(sx, 220, '#ef4444', 10);
        seats[i] = null;
      }
    }

    // Update Particles & Floating Texts
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 380 * dt;
      pt.life -= dt;
      if (pt.life <= 0) particles.splice(i, 1);
    }
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const ft = floatTexts[i];
      ft.y += ft.vy * dt;
      ft.vy *= 0.94;
      ft.life -= dt;
      if (ft.life <= 0) floatTexts.splice(i, 1);
    }

    notifyHUD();
  }

  // ==================== RENDERING KARENDERYA MANIA ====================
  function render(ctx, W) {
    lastViewW = W;
    ctx.save();

    // 1. Cozy Philippine Karenderya Wall & Checkered Tiles!
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 340);
    wallGrad.addColorStop(0, '#fef3c7');
    wallGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, 340);

    // Subtle Kitchen Tile Grid
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.14)';
    ctx.lineWidth = 1.5;
    for (let tx = 0; tx < W; tx += 46) {
      ctx.beginPath();
      ctx.moveTo(tx, 0);
      ctx.lineTo(tx, 340);
      ctx.stroke();
    }
    for (let ty = 0; ty < 340; ty += 46) {
      ctx.beginPath();
      ctx.moveTo(0, ty);
      ctx.lineTo(W, ty);
      ctx.stroke();
    }

    // Colorful Fiesta Banderitas across Karenderya ceiling!
    const flagColors = ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#ec4899'];
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.quadraticCurveTo(W / 2, 36, W, 14);
    ctx.stroke();
    const flagCount = Math.max(10, Math.floor(W / 44));
    for (let f = 1; f < flagCount; f++) {
      const t = f / flagCount;
      const fx = W * t;
      const fy = 14 + 4 * t * (1 - t) * 22;
      ctx.fillStyle = flagColors[f % flagColors.length];
      ctx.beginPath();
      ctx.moveTo(fx - 8, fy);
      ctx.lineTo(fx + 8, fy);
      ctx.lineTo(fx + Math.sin(time * 4 + f) * 2, fy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Karenderya Wooden Signboard!
    const signW = Math.min(350, W - 28);
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, W / 2 - signW / 2, 26, signW, 38, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 16px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("🍲 MANONG'S KARENDERYA · TURO-TURO", W / 2, 50);

    // 2. Customers Seated at the 3 Karenderya Counter Spots!
    for (let i = 0; i < 3; i++) {
      const sx = getSeatX(i, W);
      const cust = seats[i];
      if (cust) {
        drawCustomer(ctx, sx, 286, cust, W);
      } else {
        // Empty stool invitation
        ctx.fillStyle = 'rgba(120, 53, 15, 0.16)';
        ctx.font = 'bold 12px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`SEAT ${i + 1}`, sx, 270);
      }
    }

    // 3. Classic Wooden & Stainless Turo-Turo Dining Counter!
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3.5;
    ctx.fillRect(0, 294, W, 18);
    ctx.strokeRect(-4, 294, W + 8, 18);

    // Kitchen Floor / Prep Zone Behind Counter
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 312, W, H - 312);
    // Warm counter apron panel
    ctx.fillStyle = '#92400e';
    ctx.fillRect(0, 312, W, 160);
    ctx.fillStyle = '#78350f';
    for (let px = 20; px < W; px += 90) {
      ctx.fillRect(px, 322, 68, 138);
    }

    // 4. Manong Cook (White Shirt + Shoulder Towel!) & Serving Tray!
    drawManongChef(ctx, manong.x, 456, W);

    // 5. Bottom 4 Interactive Cooking Stations (Adobo, Sinigang, Kanin, Halo-Halo!)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 472, W, H - 472);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 472);
    ctx.lineTo(W, 472);
    ctx.stroke();

    DISH_KEYS.forEach((k, idx) => {
      drawStationCard(ctx, k, idx, W);
    });

    // 6. Particles & Floating Popups
    for (const pt of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      ctx.restore();
    }
    for (const ft of floatTexts) {
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

  // ==================== MANONG CHEF (WHITE SHIRT + SHOULDER TOWEL!) ====================
  function drawManongChef(ctx, x, y, W) {
    ctx.save();
    const bob = Math.sin(time * 6) * 2.5 - (manong.actionTimer > 0 ? 6 : 0);
    ctx.translate(x, y + bob);

    // Subtle spotlight behind Manong
    ctx.fillStyle = 'rgba(253, 224, 71, 0.14)';
    ctx.beginPath();
    ctx.ellipse(0, -48, 52, 56, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark pants waist
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    roundRect(ctx, -20, -20, 40, 22, 6);
    ctx.fill();
    ctx.stroke();

    // ---- CRISP WHITE T-SHIRT / SANDO ----
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, -24, -62, 48, 46, 11);
    ctx.fill();
    ctx.stroke();
    // Soft grey shadow fold on white shirt
    ctx.fillStyle = '#e2e8f0';
    roundRect(ctx, -18, -32, 36, 10, 4);
    ctx.fill();
    // Crew neck collar
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, -60, 10, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // ---- CLASSIC PINOY KITCHEN TOWEL (BIMPO) DRAPED ON SHOULDER! ----
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    roundRect(ctx, 10, -64, 17, 36, 5);
    ctx.fill();
    ctx.stroke();
    // Classic red stripes on Manong's shoulder towel!
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(12, -39, 13, 3.5);
    ctx.fillRect(12, -33, 13, 3.5);
    // Towel fringe tips at bottom
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.6;
    for (let fx = 13; fx <= 24; fx += 3.5) {
      ctx.beginPath();
      ctx.moveTo(fx, -28);
      ctx.lineTo(fx, -23);
      ctx.stroke();
    }

    // Left Arm holding Wooden Sandok (Ladle)!
    ctx.save();
    ctx.translate(-24, -46);
    ctx.rotate(manong.actionTimer > 0 ? -0.45 : -0.15);
    ctx.fillStyle = '#f2b88a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    roundRect(ctx, -12, -5, 16, 11, 5);
    ctx.fill();
    ctx.stroke();
    // Wooden Ladle (Sandok)
    ctx.fillStyle = '#b45309';
    roundRect(ctx, -17, -26, 6, 26, 2.5);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-14, -29, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ---- MANONG CHIBI HEAD ----
    ctx.save();
    ctx.translate(0, -86);
    // Ears
    ctx.fillStyle = '#e5a373';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(-22, 2, 5.5, 0, Math.PI * 2);
    ctx.arc(22, 2, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Face
    ctx.fillStyle = '#f5be93';
    ctx.beginPath();
    ctx.ellipse(0, 2, 23, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.beginPath();
    ctx.ellipse(-12, 7, 4.5, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(12, 7, 4.5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful eyes
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.ellipse(-8, -1, 3.2, 4.2, 0, 0, Math.PI * 2);
    ctx.ellipse(8, -1, 3.2, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-6.8, -2.5, 1.3, 0, Math.PI * 2);
    ctx.arc(9.2, -2.5, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Friendly Manong Mustache & Big Grin!
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.ellipse(-4.5, 7, 5, 2.2, -0.15, 0, Math.PI * 2);
    ctx.ellipse(4.5, 7, 5, 2.2, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 9, 6, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Neat Short Dark Hair
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(0, -6, 23, Math.PI + 0.12, -0.12);
    ctx.quadraticCurveTo(8, -14, 0, -11);
    ctx.quadraticCurveTo(-10, -15, -22, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ---- SERVING TRAY NEXT TO MANONG (SHOWS PLATED DISHES!) ----
    const trayX = x > W - 110 ? -78 : 42;
    ctx.save();
    ctx.translate(trayX, -42);
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.8;
    roundRect(ctx, -18, -16, 78, 38, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 9px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRAY', 21, -20);

    if (tray.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.fillText('EMPTY', 21, 7);
    } else {
      tray.forEach((dId, i) => {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(DISHES[dId].emoji, 4 + i * 34, 4);
      });
    }
    ctx.restore();

    ctx.restore();
  }

  // ==================== 4 NAMED CHIBI CUSTOMERS ====================
  function drawCustomer(ctx, x, y, cust, W) {
    ctx.save();
    const slideY = cust.enterAnim * 48;
    const happyHop = cust.happyTimer > 0 ? Math.abs(Math.sin(time * 16)) * -12 : Math.sin(time * 4 + cust.seatIdx) * 2;
    ctx.translate(x, y + slideY + happyHop);

    const id = cust.profile.id;

    // ---- DRAW SPECIFIC CUSTOMER CHARACTER ----
    if (id === 'jeo') {
      // JEO ONG: Long flowing dark hair + patterned bandana + black shirt + blue maong pants!
      // Long dark hair flowing behind shoulders!
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-25, -58);
      ctx.quadraticCurveTo(-32, -26, -27, -2);
      ctx.lineTo(27, -2);
      ctx.quadraticCurveTo(32, -26, 25, -58);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Maong Denim Pants peeking at bottom
      ctx.fillStyle = '#2563eb';
      roundRect(ctx, -18, -12, 36, 14, 4);
      ctx.fill();
      ctx.stroke();

      // Plain Black T-Shirt!
      ctx.fillStyle = '#18181b';
      roundRect(ctx, -21, -46, 42, 37, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, -36, 12, 4);

      // Face
      ctx.fillStyle = '#f2b88a';
      ctx.beginPath();
      ctx.ellipse(0, -68, 21, 19.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Side long hair locks framing face
      ctx.fillStyle = '#111827';
      roundRect(ctx, -25, -72, 7, 34, 3);
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, 18, -72, 7, 34, 3);
      ctx.fill();
      ctx.stroke();

      // Signature Bandana wrapped across forehead!
      ctx.fillStyle = '#dc2626';
      roundRect(ctx, -22, -84, 44, 11, 4);
      ctx.fill();
      ctx.stroke();
      // White paisley dots on bandana + fluttering knot tails on side!
      ctx.fillStyle = '#ffffff';
      for (let bx = -14; bx <= 14; bx += 7) {
        ctx.beginPath();
        ctx.arc(bx, -78.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      // Bandana tie tail
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(21, -80);
      ctx.lineTo(31, -74);
      ctx.lineTo(27, -69);
      ctx.lineTo(20, -76);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Top hair crown
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(0, -82, 19, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Eyes & Cool Confident Smile
      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, false);
    } else if (id === 'baby') {
      // MADAM BABY: Glamorous wavy hair, red dress, gold hoops, shades & red lipstick!
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(-20, -66, 14, 0, Math.PI * 2);
      ctx.arc(20, -66, 14, 0, Math.PI * 2);
      ctx.arc(0, -82, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Fancy Crimson Dress + Pearl Necklace
      ctx.fillStyle = '#dc2626';
      roundRect(ctx, -22, -46, 44, 48, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      for (let px = -10; px <= 10; px += 5) {
        ctx.beginPath();
        ctx.arc(px, -42, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Gold Hoop Earrings
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(-21, -59, 5, 0, Math.PI * 2);
      ctx.arc(21, -59, 5, 0, Math.PI * 2);
      ctx.stroke();

      // Face
      ctx.fillStyle = '#fbd0b0';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Stylish Cat-Eye Sunglasses!
      ctx.fillStyle = '#111827';
      roundRect(ctx, -17, -75, 15, 9, 4);
      roundRect(ctx, 2, -75, 15, 9, 4);
      ctx.fill();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -72, 4, 2);

      // Red lipstick smile
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(0, -58, 5, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (id === 'loring') {
      // ALING LORING: Sweet Lola with silver-white bun, spectacles & lavender cardigan!
      // White hair bun on top
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -93, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Lavender Cardigan
      ctx.fillStyle = '#a78bfa';
      roundRect(ctx, -21, -46, 42, 48, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -46, 10, 46);

      // Face
      ctx.fillStyle = '#f5c29b';
      ctx.beginPath();
      ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Silver Hair Bangs
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(0, -75, 20, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, true);
    } else {
      // ALING TESSA: Friendly Tita in pink floral blouse & dark hair bun!
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -92, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pink Floral Blouse
      ctx.fillStyle = '#ec4899';
      roundRect(ctx, -21, -46, 42, 48, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      [[-10, -30], [8, -22], [-5, -14], [11, -36]].forEach(([fx, fy]) => {
        ctx.beginPath();
        ctx.arc(fx, fy, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Face
      ctx.fillStyle = '#f5be93';
      ctx.beginPath();
      ctx.ellipse(0, -68, 20, 19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark Hair
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(0, -75, 20, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      drawCustFace(ctx, 0, -65, cust.patience, cust.happyTimer > 0, false);
    }

    // ---- NAME PLATE TAG ----
    ctx.fillStyle = '#111827';
    roundRect(ctx, -44, -14, 88, 19, 6);
    ctx.fill();
    ctx.fillStyle = id === 'jeo' ? '#38bdf8' : id === 'baby' ? '#f472b6' : '#fde047';
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cust.profile.name, 0, -1);

    // ---- ORDER SPEECH BUBBLE + PATIENCE BAR ABOVE HEAD ----
    const bubbleW = Math.min(W * 0.28, cust.order.length * 36 + 24);
    ctx.fillStyle = cust.happyTimer > 0 ? '#dcfce7' : '#ffffff';
    ctx.strokeStyle = cust.patience < 30 ? '#ef4444' : INK;
    ctx.lineWidth = 3;
    roundRect(ctx, -bubbleW / 2, -166, bubbleW, 56, 12);
    ctx.fill();
    ctx.stroke();

    // Order Dish Icons (with green checkmark when served!)
    const spacing = Math.min(34, (bubbleW - 16) / cust.order.length);
    const startX = -((cust.order.length - 1) * spacing) / 2;
    cust.order.forEach((o, i) => {
      const ix = startX + i * spacing;
      ctx.save();
      if (o.served) ctx.globalAlpha = 0.35;
      ctx.font = '23px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(DISHES[o.dishId].emoji, ix, -143);
      ctx.restore();
      if (o.served) {
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 14px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', ix, -140);
      }
    });

    // Patience Progress Bar inside bottom of speech bubble
    const barW = bubbleW - 18;
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, -barW / 2, -122, barW, 7, 3);
    ctx.fill();
    const pRatio = Math.max(0, cust.patience / cust.maxPatience);
    ctx.fillStyle = pRatio > 0.55 ? '#22c55e' : pRatio > 0.28 ? '#facc15' : '#ef4444';
    roundRect(ctx, -barW / 2, -122, barW * pRatio, 7, 3);
    ctx.fill();

    // Highlight "TAP TO SERVE!" ring if Manong's tray matches this customer!
    const canServe = cust.happyTimer <= 0 && tray.some((d) => cust.order.some((o) => o.dishId === d && !o.served));
    if (canServe) {
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      roundRect(ctx, -38, -188, 76, 19, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#052e16';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TAP SERVE!', 0, -175);
    }

    ctx.restore();
  }

  function drawCustFace(ctx, x, y, patience, happy, glasses) {
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(x - 7, y - 3, 2.5, 0, Math.PI * 2);
    ctx.arc(x + 7, y - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (glasses) {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(x - 7, y - 3, 5.5, 0, Math.PI * 2);
      ctx.arc(x + 7, y - 3, 5.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (happy || patience > 55) {
      ctx.arc(x, y + 3, 5, 0.15, Math.PI - 0.15);
    } else if (patience > 28) {
      ctx.moveTo(x - 5, y + 6);
      ctx.lineTo(x + 5, y + 6);
    } else {
      ctx.arc(x, y + 9, 5, Math.PI + 0.2, -0.2);
    }
    ctx.stroke();
  }

  function drawStationCard(ctx, dishId, idx, W) {
    const r = getStationRect(idx, W);
    const cfg = DISHES[dishId];
    const st = stations[dishId];

    ctx.save();
    ctx.fillStyle = st.cooking ? '#1e293b' : st.servings > 0 ? '#1e3a8a' : '#334155';
    ctx.strokeStyle = st.servings > 0 ? '#facc15' : '#64748b';
    ctx.lineWidth = 3;
    roundRect(ctx, r.x, r.y, r.w, r.h, 14);
    ctx.fill();
    ctx.stroke();

    // Dish Emoji Icon
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cfg.emoji, r.x + r.w / 2, r.y + 34);

    // Dish Name + Price
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${W < 520 ? 11 : 13}px Fredoka, sans-serif`;
    ctx.fillText(cfg.name, r.x + r.w / 2, r.y + 66);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.fillText(`₱${cfg.price}`, r.x + r.w / 2, r.y + 82);

    // Cooking Progress Bar OR Servings Badge
    if (st.cooking) {
      const bw = r.w - 18;
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, r.x + 9, r.y + 96, bw, 14, 7);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      roundRect(ctx, r.x + 9, r.y + 96, bw * Math.min(1, st.cookProgress / cfg.cookTime), 14, 7);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9.5px Fredoka, sans-serif';
      ctx.fillText('COOKING...', r.x + r.w / 2, r.y + 103);
    } else if (st.servings > 0) {
      ctx.fillStyle = '#10b981';
      roundRect(ctx, r.x + 10, r.y + 94, r.w - 20, 18, 8);
      ctx.fill();
      ctx.fillStyle = '#052e16';
      ctx.font = 'bold 10.5px Fredoka, sans-serif';
      ctx.fillText(`PLATE (${st.servings})`, r.x + r.w / 2, r.y + 103);
    } else {
      ctx.fillStyle = '#f59e0b';
      roundRect(ctx, r.x + 10, r.y + 94, r.w - 20, 18, 8);
      ctx.fill();
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 10.5px Fredoka, sans-serif';
      ctx.fillText('TAP TO COOK', r.x + r.w / 2, r.y + 103);
    }

    ctx.restore();
  }

  return {
    LEVELS,
    start,
    stop,
    setPaused,
    interactDish,
    clearTray,
    serveSeat,
    handleCanvasPointer,
    update,
    render,
    isActive: () => active
  };
})();
