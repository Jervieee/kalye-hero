// KALYE HERO: THE JEEP RIDE — EDSA Traffic & Pasahero Driver Mode!
const JeepRide = (() => {
  const INK = '#111827';
  const STATIONS = [
    { name: 'MONUMENTO', dist: 650, color: '#ef4444' },
    { name: 'NORTH EDSA', dist: 1650, color: '#f97316' },
    { name: 'CUBAO', dist: 2700, color: '#eab308' },
    { name: 'ORTIGAS', dist: 3800, color: '#10b981' },
    { name: 'GUADALUPE', dist: 4900, color: '#06b6d4' },
    { name: 'AYALA', dist: 6000, color: '#3b82f6' },
    { name: 'TAFT PASAY', dist: 7100, color: '#8b5cf6', terminal: true }
  ];

  const MAX_SEATS = 6;
  const MAX_ANGRY = 3;
  const H = 630;
  // Road layout within 630px vertical world
  const ROAD_TOP = 260;
  const ROAD_BOTTOM = 555;
  const LANE_H = (ROAD_BOTTOM - ROAD_TOP) / 3; // ~98px per lane
  const LANE_Y = [
    ROAD_TOP + LANE_H * 0.5,
    ROAD_TOP + LANE_H * 1.5,
    ROAD_TOP + LANE_H * 2.5
  ];

  let active = false;
  let paused = false;
  let finished = false;
  let time = 0;

  let distance = 0;
  let speed = 220;
  let targetSpeed = 240;
  let fareEarned = 0;
  let happyServed = 0;
  let angryCount = 0;
  let combo = 0;
  let hornCooldown = 0;
  let hornWaveTimer = 0;
  let turboTimer = 0;
  let crashCooldown = 0;
  let shakeTimer = 0;
  let stopHoldTimer = 0;
  let mrtX = 1200;

  let jeep = {
    x: 110,
    lane: 1,
    y: LANE_Y[1],
    w: 152,
    h: 64,
    tilt: 0
  };

  let passengers = []; // { id, destIndex, destName, color, shirtColor, patience, maxPatience, fare }
  let stations = [];   // cloned stations with waiting pasaheros + visited flags
  let traffic = [];    // { x, lane, y, w, h, vx, type, color, honked }
  let roadPickups = []; // { x, lane, type }
  let floatTexts = [];
  let particles = [];
  let nextTrafficTimer = 0.8;
  let nextPickupTimer = 3.2;
  let nextPaxId = 1;
  let onStatusUpdate = null;
  let onEndCallback = null;

  const PAX_SHIRTS = ['#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#f97316', '#14b8a6'];

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
    floatTexts.push({ x, y, vy: -65, text, color, size, life: 1.15, maxLife: 1.15 });
  }

  function addParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 170;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 40,
        size: 3 + Math.random() * 4.5,
        color,
        life: 0.4 + Math.random() * 0.35,
        maxLife: 0.75
      });
    }
  }

  function buildStations() {
    return STATIONS.map((st, idx) => {
      const waiting = [];
      if (!st.terminal) {
        const count = idx === 0 ? 3 : 2 + (idx % 2);
        for (let i = 0; i < count; i++) {
          const destIdx = Math.min(STATIONS.length - 1, idx + 1 + Math.floor(Math.random() * Math.min(3, STATIONS.length - 1 - idx)));
          waiting.push({
            id: nextPaxId++,
            destIndex: destIdx,
            destName: STATIONS[destIdx].name,
            destColor: STATIONS[destIdx].color,
            shirtColor: PAX_SHIRTS[(idx * 3 + i) % PAX_SHIRTS.length],
            patience: 100,
            maxPatience: 100,
            fare: 20 + (destIdx - idx) * 15
          });
        }
      }
      return {
        ...st,
        index: idx,
        waiting,
        stoppedHere: false,
        passed: false
      };
    });
  }

  function start(statusCb, endCb) {
    onStatusUpdate = statusCb;
    onEndCallback = endCb;
    active = true;
    paused = false;
    finished = false;
    time = 0;
    distance = 0;
    speed = 215;
    fareEarned = 0;
    happyServed = 0;
    angryCount = 0;
    combo = 0;
    hornCooldown = 0;
    hornWaveTimer = 0;
    turboTimer = 0;
    crashCooldown = 0;
    shakeTimer = 0;
    stopHoldTimer = 0;
    mrtX = 950;
    nextTrafficTimer = 0.9;
    nextPickupTimer = 3.0;

    jeep = {
      x: 92,
      lane: 2,
      y: LANE_Y[2],
      w: 150,
      h: 62,
      tilt: 0
    };

    stations = buildStations();
    // Start with 2 friendly pasaheros already onboard heading to North EDSA & Cubao!
    passengers = [
      {
        id: nextPaxId++,
        destIndex: 1,
        destName: STATIONS[1].name,
        destColor: STATIONS[1].color,
        shirtColor: '#3b82f6',
        patience: 100,
        maxPatience: 100,
        fare: 30
      },
      {
        id: nextPaxId++,
        destIndex: 2,
        destName: STATIONS[2].name,
        destColor: STATIONS[2].color,
        shirtColor: '#ec4899',
        patience: 100,
        maxPatience: 100,
        fare: 40
      }
    ];
    traffic = [];
    roadPickups = [];
    floatTexts = [];
    particles = [];
    notifyHUD();
  }

  function stop() {
    active = false;
    paused = false;
  }

  function setPaused(val) {
    paused = val;
  }

  function moveLane(delta) {
    if (!active || paused || finished) return;
    const next = Math.max(0, Math.min(2, jeep.lane + delta));
    if (next !== jeep.lane) {
      jeep.lane = next;
      jeep.tilt = delta * 0.09;
    }
  }

  function honkHorn() {
    if (!active || paused || finished || hornCooldown > 0) return;
    hornCooldown = 2.0;
    hornWaveTimer = 0.45;
    SoundFX.horn();
    addFloat(jeep.x + jeep.w + 18, jeep.y - 26, 'BEEP BEEP! 📯', '#fde047', 19);

    // Calm onboard pasaheros slightly & nudge traffic directly ahead!
    for (const pax of passengers) {
      pax.patience = Math.min(pax.maxPatience, pax.patience + 10);
    }
    for (const car of traffic) {
      if (car.lane === jeep.lane && car.x > jeep.x && car.x < jeep.x + 360 && !car.honked) {
        car.honked = true;
        car.vx += 130; // speeds up to clear the way!
        addFloat(car.x + car.w / 2, car.y - 30, '💨', '#e2e8f0', 16);
      }
    }
  }

  function getNextStation() {
    return stations.find((s) => !s.passed) || stations[stations.length - 1];
  }

  function notifyHUD() {
    if (!onStatusUpdate) return;
    const nextSt = getNextStation();
    const dropHere = passengers.filter((p) => p.destIndex === nextSt.index).length;
    onStatusUpdate({
      fareEarned,
      happyServed,
      angryCount,
      maxAngry: MAX_ANGRY,
      combo,
      passengers,
      maxSeats: MAX_SEATS,
      progress: Math.min(100, (distance / STATIONS[STATIONS.length - 1].dist) * 100),
      nextStation: nextSt.name,
      nextStationDist: Math.max(0, Math.round(nextSt.dist - distance)),
      dropHere
    });
  }

  function spawnTrafficCar(viewW) {
    // Keep curb lane clearer right around an upcoming station so stopping is fair!
    const nextSt = getNextStation();
    const nearStation = nextSt && Math.abs(nextSt.dist - distance) < 260;
    const laneChoices = nearStation ? [0, 1] : [0, 1, 2];
    const lane = laneChoices[Math.floor(Math.random() * laneChoices.length)];

    // Avoid overlapping recently spawned car in same lane
    if (traffic.some((c) => c.lane === lane && c.x > viewW - 180)) return;

    const r = Math.random();
    let type = 'taxi';
    let w = 104;
    let h = 48;
    let color = '#facc15';
    let vx = 105 + Math.random() * 50;

    if (r < 0.24 && lane === 0) {
      type = 'bus';
      w = 175;
      h = 62;
      color = '#dc2626';
      vx = 95 + Math.random() * 35;
    } else if (r < 0.5) {
      type = 'suv';
      w = 118;
      h = 54;
      color = ['#1e293b', '#475569', '#2563eb', '#0f766e'][Math.floor(Math.random() * 4)];
      vx = 115 + Math.random() * 45;
    } else if (r < 0.72) {
      type = 'moto';
      w = 64;
      h = 34;
      color = '#ef4444';
      vx = 140 + Math.random() * 50;
    } else if (r < 0.86) {
      type = 'taxi';
      w = 104;
      h = 48;
      color = '#facc15';
      vx = 110 + Math.random() * 45;
    } else {
      type = 'cone';
      w = 42;
      h = 38;
      color = '#f97316';
      vx = 0; // Stationary MMDA EDSA roadwork cone!
    }

    traffic.push({
      x: viewW + 90,
      lane,
      y: LANE_Y[lane],
      w,
      h,
      vx,
      type,
      color,
      honked: false
    });
  }

  function triggerAngryPassenger(pax, reasonText) {
    angryCount++;
    combo = 0;
    SoundFX.angry();
    shakeTimer = 0.25;
    addFloat(jeep.x + 70, jeep.y - 52, `${reasonText} 😠`, '#f87171', 17);
    addParticles(jeep.x + 70, jeep.y - 24, '#ef4444', 12);

    if (angryCount >= MAX_ANGRY && !finished) {
      finished = true;
      SoundFX.gameOver();
      if (onEndCallback) {
        onEndCallback({
          won: false,
          fareEarned,
          happyServed,
          angryCount,
          stars: Math.max(1, 5 - angryCount)
        });
      }
    }
  }

  function handleStationStop(st) {
    let paidTotal = 0;
    let droppedCount = 0;
    let boardedCount = 0;

    // 1. Drop off pasaheros whose destination is THIS station (or final terminal!)
    for (let i = passengers.length - 1; i >= 0; i--) {
      const pax = passengers[i];
      if (pax.destIndex === st.index || st.terminal) {
        const happyBonus = pax.patience >= 65 ? 15 : pax.patience >= 35 ? 5 : 0;
        combo++;
        const comboMult = combo >= 5 ? 1.5 : combo >= 3 ? 1.25 : 1;
        const payout = Math.round((pax.fare + happyBonus) * comboMult);
        paidTotal += payout;
        fareEarned += payout;
        happyServed++;
        droppedCount++;
        passengers.splice(i, 1);
      }
    }

    // 2. Board waiting pasaheros at this station (up to MAX_SEATS!)
    while (st.waiting.length > 0 && passengers.length < MAX_SEATS) {
      const newPax = st.waiting.shift();
      passengers.push(newPax);
      boardedCount++;
    }

    st.stoppedHere = true;

    if (droppedCount > 0) {
      SoundFX.farePaid();
      addFloat(jeep.x + 75, jeep.y - 54, `SALAMAT KOYA! +₱${paidTotal} 💵`, '#34d399', 19);
      addParticles(jeep.x + 75, jeep.y - 20, '#34d399', 18);
      addParticles(jeep.x + 75, jeep.y - 20, '#facc15', 10);
    }
    if (boardedCount > 0) {
      SoundFX.board();
      addFloat(jeep.x + 75, jeep.y - 28, `+${boardedCount} PASAHERO! BAYAD PO!`, '#fde047', 16);
    }

    // Check Final Terminal Victory!
    if (st.terminal && !finished) {
      finished = true;
      SoundFX.stageClear();
      const stars = angryCount === 0 ? 5 : angryCount === 1 ? 4 : 3;
      if (onEndCallback) {
        onEndCallback({
          won: true,
          fareEarned,
          happyServed,
          angryCount,
          stars
        });
      }
    }
  }

  function update(dt, viewW, controls) {
    if (!active || paused || finished) return;
    time += dt;

    if (hornCooldown > 0) hornCooldown = Math.max(0, hornCooldown - dt);
    if (hornWaveTimer > 0) hornWaveTimer = Math.max(0, hornWaveTimer - dt);
    if (turboTimer > 0) turboTimer = Math.max(0, turboTimer - dt);
    if (crashCooldown > 0) crashCooldown = Math.max(0, crashCooldown - dt);
    if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);

    // Responsive jeep X anchor so portrait & widescreen both have generous forward vision
    jeep.x = viewW < 640 ? 48 : 96;

    // Speed control (Gas vs Brake/Stop, supporting both buttons & joystick X!)
    const joyX = controls.joyX || 0;
    const joyY = controls.joyY || 0;
    const braking = controls.brake || joyX < -0.45;
    const gassing = controls.gas || joyX > 0.45;
    const baseCruise = turboTimer > 0 ? 355 : 235;
    if (braking) {
      targetSpeed = 0;
    } else if (gassing) {
      targetSpeed = turboTimer > 0 ? 410 : 325;
    } else {
      targetSpeed = baseCruise;
    }

    const accel = braking ? 680 : 340;
    if (speed < targetSpeed) speed = Math.min(targetSpeed, speed + accel * dt);
    else speed = Math.max(targetSpeed, speed - accel * dt);

    // Advance EDSA distance (scaled so 7100m takes ~85-100 fun seconds!)
    distance += speed * dt * 0.34;

    // Smooth virtual joystick steering OR discrete lane glide!
    if (Math.abs(joyY) > 0.14) {
      const steerSpeed = 310;
      jeep.y = Math.max(LANE_Y[0], Math.min(LANE_Y[2], jeep.y + joyY * steerSpeed * dt));
      jeep.tilt = joyY * 0.11;
      // Keep jeep.lane synced to whichever EDSA lane the jeepney is currently in
      let closest = 0;
      let bestD = Infinity;
      for (let l = 0; l < 3; l++) {
        const d = Math.abs(jeep.y - LANE_Y[l]);
        if (d < bestD) { bestD = d; closest = l; }
      }
      jeep.lane = closest;
    } else {
      const targetY = LANE_Y[jeep.lane];
      jeep.y += (targetY - jeep.y) * Math.min(1, dt * 13);
      jeep.tilt *= 0.88;
    }

    // Animated overhead MRT-3 train
    mrtX -= (170 + speed * 0.25) * dt;
    if (mrtX < -520) mrtX = viewW + 400 + Math.random() * 400;

    // Spawn EDSA Traffic
    nextTrafficTimer -= dt * (speed > 60 ? 1 : 0.25);
    if (nextTrafficTimer <= 0) {
      spawnTrafficCar(viewW);
      nextTrafficTimer = Math.max(0.75, 1.55 - (distance / 9000) * 0.55) + Math.random() * 0.55;
    }

    // Spawn Street Coins / Kape Turbo Boosts
    nextPickupTimer -= dt;
    if (nextPickupTimer <= 0 && speed > 50) {
      const lane = Math.floor(Math.random() * 3);
      roadPickups.push({
        x: viewW + 70,
        lane,
        y: LANE_Y[lane],
        type: Math.random() < 0.35 ? 'kape' : 'coin'
      });
      nextPickupTimer = 2.6 + Math.random() * 2.2;
    }

    // Update Traffic & Check Crashes
    for (let i = traffic.length - 1; i >= 0; i--) {
      const car = traffic[i];
      // Relative scrolling speed
      const relSpeed = speed - car.vx;
      car.x -= relSpeed * dt;

      if (car.x < -260 || car.x > viewW + 460) {
        traffic.splice(i, 1);
        continue;
      }

      // Collision check with Jeepney!
      if (
        crashCooldown <= 0 &&
        Math.abs(car.y - jeep.y) < 34 &&
        jeep.x + jeep.w - 14 > car.x + 8 &&
        jeep.x + 12 < car.x + car.w - 8
      ) {
        crashCooldown = 1.35;
        shakeTimer = 0.26;
        speed = Math.max(40, speed * 0.38);
        SoundFX.hurt();
        addParticles(jeep.x + jeep.w - 10, jeep.y, '#f97316', 14);
        addFloat(jeep.x + 80, jeep.y - 44, 'BUMP! ARAY KOYA! 💥', '#fb923c', 18);

        // Push traffic car forward slightly so player doesn't get stuck
        if (car.type === 'cone') {
          traffic.splice(i, 1);
        } else {
          car.x += 55;
          car.vx += 90;
        }

        // Reduce patience of onboard pasaheros!
        for (let p = passengers.length - 1; p >= 0; p--) {
          passengers[p].patience -= 26;
          if (passengers[p].patience <= 0) {
            const mad = passengers.splice(p, 1)[0];
            triggerAngryPassenger(mad, 'GALIT NA PASAHERO!');
            if (finished) return;
          }
        }
      }
    }

    // Update Road Pickups
    for (let i = roadPickups.length - 1; i >= 0; i--) {
      const pk = roadPickups[i];
      pk.x -= speed * dt;
      if (pk.x < -60) {
        roadPickups.splice(i, 1);
        continue;
      }
      if (
        Math.abs(pk.y - jeep.y) < 42 &&
        jeep.x + jeep.w > pk.x - 14 &&
        jeep.x < pk.x + 14
      ) {
        if (pk.type === 'kape') {
          turboTimer = 4.0;
          SoundFX.energyDrink();
          addFloat(jeep.x + 70, jeep.y - 42, '⚡ KAPE TURBO + CALM!', '#fde047', 17);
          for (const pax of passengers) pax.patience = Math.min(pax.maxPatience, pax.patience + 25);
        } else {
          fareEarned += 10;
          SoundFX.coin();
          addFloat(jeep.x + 70, jeep.y - 36, '+₱10 BARYA!', '#facc15', 16);
        }
        addParticles(pk.x, pk.y, '#fde047', 10);
        roadPickups.splice(i, 1);
      }
    }

    // Update Passenger Patience gently over time (faster drain if stuck crawling outside a station!)
    const nextSt = getNextStation();
    const inStationRange = nextSt && Math.abs(nextSt.dist - distance) < 105;
    const patienceDrain = speed < 40 && !inStationRange ? 4.2 : 1.25;
    for (let i = passengers.length - 1; i >= 0; i--) {
      passengers[i].patience -= patienceDrain * dt;
      if (passengers[i].patience <= 0) {
        const mad = passengers.splice(i, 1)[0];
        triggerAngryPassenger(mad, 'TAGAL NAMAN KOYA!');
        if (finished) return;
      }
    }

    // Check EDSA Stations (Stopping to Drop Off / Pick Up vs Driving Past!)
    for (const st of stations) {
      if (st.passed) continue;
      const dxDist = st.dist - distance; // world meters remaining

      // Station Bay Stopping Window!
      if (Math.abs(dxDist) < 95 && jeep.lane === 2) {
        if (speed < 48) {
          stopHoldTimer += dt;
          if (!st.stoppedHere && stopHoldTimer >= 0.35) {
            handleStationStop(st);
            if (finished) return;
          }
        } else {
          stopHoldTimer = Math.max(0, stopHoldTimer - dt);
        }
      }

      // Passed the station!
      if (dxDist < -110) {
        st.passed = true;
        stopHoldTimer = 0;

        // Did we miss dropping off any pasaheros for this station?
        for (let i = passengers.length - 1; i >= 0; i--) {
          if (passengers[i].destIndex === st.index) {
            const missed = passengers.splice(i, 1)[0];
            triggerAngryPassenger(missed, `LUMAGPAS SA ${st.name}!`);
            if (finished) return;
          }
        }

        // If terminal passed without stopping, auto-dock & finish!
        if (st.terminal && !st.stoppedHere && !finished) {
          handleStationStop(st);
        }
      }
    }

    // Update particles & floating texts
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vy += 420 * dt;
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

  // ==================== RENDERING EDSA & JEEPNEY ====================
  function render(ctx, W) {
    ctx.save();
    if (shakeTimer > 0) {
      ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    }

    // 1. Bright Manila EDSA Sky
    const sky = ctx.createLinearGradient(0, 0, 0, ROAD_TOP);
    sky.addColorStop(0, '#1d4ed8');
    sky.addColorStop(0.55, '#38bdf8');
    sky.addColorStop(1, '#fef08a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, ROAD_TOP);

    // Manila Skyline + EDSA Billboards (Parallax)
    const skyScroll = distance * 0.45;
    for (let i = -1; i < 10; i++) {
      const bx = i * 165 - (skyScroll % 165);
      const bh = 95 + ((Math.abs(i * 41) % 4) * 32);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(bx, ROAD_TOP - 48 - bh, 118, bh + 50);
      ctx.fillStyle = '#dbeafe';
      for (let wy = ROAD_TOP - 40 - bh + 14; wy < ROAD_TOP - 64; wy += 20) {
        for (let wx = bx + 12; wx < bx + 102; wx += 22) {
          ctx.fillRect(wx, wy, 10, 10);
        }
      }
    }

    // Giant EDSA Billboards!
    const billScroll = distance * 0.95;
    const billLabels = ['EDSA TRAFFIC!', 'BEEP BEEP KOYA!', 'SUKI BAYAD PO!', 'INGAT SA BIYAHE'];
    const billColors = ['#ef4444', '#2563eb', '#f59e0b', '#10b981'];
    const bStart = Math.floor(billScroll / 420) - 1;
    for (let i = bStart; i < bStart + 5; i++) {
      const bx = i * 420 - billScroll;
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx + 62, 128, 12, 92);
      ctx.fillStyle = billColors[Math.abs(i) % billColors.length];
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, bx, 64, 146, 68, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(billLabels[Math.abs(i) % billLabels.length], bx + 73, 103);
    }

    // 2. Iconic Overhead MRT-3 Viaduct & Passing Train!
    const mrtY = 178;
    // Pillars
    const pilScroll = distance * 1.6;
    for (let px = -(pilScroll % 240); px < W + 240; px += 240) {
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.fillRect(px, mrtY + 22, 26, ROAD_TOP - mrtY - 12);
      ctx.strokeRect(px, mrtY + 22, 26, ROAD_TOP - mrtY - 12);
    }
    // Viaduct concrete beam
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.fillRect(0, mrtY, W, 24);
    ctx.strokeRect(-4, mrtY, W + 8, 24);

    // MRT-3 Blue & Yellow Train!
    ctx.save();
    ctx.fillStyle = '#1d4ed8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    for (let car = 0; car < 3; car++) {
      const tx = mrtX + car * 138;
      roundRect(ctx, tx, mrtY - 34, 130, 34, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx + 4, mrtY - 11, 122, 6);
      ctx.fillStyle = '#bae6fd';
      for (let w = 0; w < 4; w++) {
        ctx.fillRect(tx + 12 + w * 28, mrtY - 27, 20, 12);
      }
      ctx.fillStyle = '#1d4ed8';
    }
    ctx.restore();

    // 3. EDSA 3-Lane Asphalt Highway & Sidewalk!
    // Top concrete barrier
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, ROAD_TOP - 14, W, 16);
    // Main EDSA road
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, ROAD_TOP, W, ROAD_BOTTOM - ROAD_TOP);

    // Lane dividers (scrolling dashed white & yellow lines!)
    const roadScroll = (distance * 2.95) % 80;
    ctx.fillStyle = '#facc15';
    for (let lx = -roadScroll; lx < W + 80; lx += 80) {
      ctx.fillRect(lx, ROAD_TOP + LANE_H - 3, 44, 6);
    }
    ctx.fillStyle = '#f8fafc';
    for (let lx = -roadScroll; lx < W + 80; lx += 80) {
      ctx.fillRect(lx, ROAD_TOP + LANE_H * 2 - 3, 44, 6);
    }

    // Bottom Curb & EDSA Sidewalk (Sakayan / Babaan Loading Sidewalk!)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, ROAD_BOTTOM, W, H - ROAD_BOTTOM);
    for (let cx = -((distance * 2.95) % 64); cx < W + 64; cx += 64) {
      ctx.fillStyle = Math.floor((cx + distance * 2.95) / 64) % 2 === 0 ? '#facc15' : '#111827';
      ctx.fillRect(cx, ROAD_BOTTOM, 32, 9);
    }

    // 4. Draw Upcoming EDSA Station Loading Bays & Waiting Pasaheros!
    for (const st of stations) {
      const screenX = jeep.x + 80 + (st.dist - distance) * 2.95;
      if (screenX < -280 || screenX > W + 320) continue;

      const hasDropOff = passengers.some((p) => p.destIndex === st.index || st.terminal);
      const bayX = screenX - 105;
      const bayW = 210;

      // Glowing Station Stopping Box in Curb Lane (Lane 2)!
      ctx.save();
      ctx.fillStyle = hasDropOff
        ? `rgba(16, 185, 129, ${0.28 + Math.sin(time * 8) * 0.12})`
        : 'rgba(250, 204, 21, 0.22)';
      ctx.fillRect(bayX, ROAD_TOP + LANE_H * 2 + 4, bayW, LANE_H - 8);
      ctx.strokeStyle = hasDropOff ? '#34d399' : '#facc15';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(bayX, ROAD_TOP + LANE_H * 2 + 4, bayW, LANE_H - 8);
      ctx.setLineDash([]);

      // Painted road text inside box
      ctx.fillStyle = hasDropOff ? '#a7f3d0' : '#fef08a';
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(hasDropOff ? '🛑 STOP HERE · BABAAN' : '🛑 SAKAYAN · STOP', screenX, ROAD_TOP + LANE_H * 2 + 24);
      ctx.restore();

      // Station Canopy Signpost on Sidewalk
      ctx.save();
      ctx.fillStyle = st.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, bayX + 12, ROAD_BOTTOM + 12, bayW - 24, 34, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🚏 EDSA · ${st.name}`, screenX, ROAD_BOTTOM + 34);
      ctx.restore();

      // Waiting Chibi Pasaheros waving on the sidewalk!
      st.waiting.forEach((wp, idx) => {
        const px = bayX + 42 + idx * 46;
        const py = ROAD_BOTTOM + 56;
        drawWaitingPasahero(ctx, px, py, wp, time + idx);
      });
    }

    // 5. Road Pickups (Coins & Kape Boost)
    for (const pk of roadPickups) {
      ctx.save();
      ctx.translate(pk.x, pk.y + Math.sin(time * 6 + pk.x) * 4);
      if (pk.type === 'kape') {
        ctx.fillStyle = 'rgba(253,224,71,0.35)';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.2;
        roundRect(ctx, -9, -12, 18, 24, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', 0, 5);
      } else {
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₱', 0, 1);
      }
      ctx.restore();
    }

    // 6. Depth-sorted Vehicles (Draw top lane → middle → bottom lane so overlaps look crisp!)
    const drawables = [];
    traffic.forEach((c) => drawables.push({ kind: 'traffic', y: c.y, obj: c }));
    drawables.push({ kind: 'jeep', y: jeep.y, obj: jeep });
    drawables.sort((a, b) => a.y - b.y);

    for (const d of drawables) {
      if (d.kind === 'traffic') drawTrafficVehicle(ctx, d.obj);
      else drawPlayerJeepney(ctx);
    }

    // 7. Alert Banner on Canvas if Approaching a Requested Drop-off Station!
    const nextSt = getNextStation();
    if (nextSt) {
      const dLeft = nextSt.dist - distance;
      const dropCount = passengers.filter((p) => p.destIndex === nextSt.index || nextSt.terminal).length;
      if (dLeft > -60 && dLeft < 340 && dropCount > 0 && !nextSt.stoppedHere) {
        ctx.save();
        const pulse = 1 + Math.sin(time * 12) * 0.04;
        ctx.translate(W / 2, 48);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        roundRect(ctx, -175, -20, 350, 40, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#052e16';
        ctx.font = 'bold 15px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🛑 PARA PO! STOP AT ${nextSt.name} (${dropCount} PAX)`, 0, 6);
        ctx.restore();
      }
    }

    // 8. Particles & Floating Popups
    for (const pt of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 1.2;
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

  function drawWaitingPasahero(ctx, x, y, wp, t) {
    ctx.save();
    const wave = Math.sin(t * 9) * 5;
    // Little chibi body
    ctx.fillStyle = wp.shirtColor;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    roundRect(ctx, x - 8, y - 16, 16, 15, 4);
    ctx.fill();
    ctx.stroke();
    // Waving hand
    ctx.strokeStyle = '#f2b88a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x + 7, y - 12);
    ctx.lineTo(x + 14, y - 22 + wave);
    ctx.stroke();
    // Head
    ctx.fillStyle = '#f5be93';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y - 24, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Hair
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(x, y - 27, 9, Math.PI, 0);
    ctx.fill();

    // Destination Speech Bubble!
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    roundRect(ctx, x - 26, y - 50, 52, 16, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = wp.destColor;
    ctx.font = 'bold 8.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(wp.destName.split(' ')[0], x, y - 39);
    ctx.restore();
  }

  function drawPlayerJeepney(ctx) {
    ctx.save();
    const x = jeep.x;
    const y = jeep.y - jeep.h / 2;
    const w = jeep.w;
    const h = jeep.h;
    const bounce = speed > 20 ? Math.sin(time * 22) * 1.8 : 0;

    if (crashCooldown > 0 && Math.floor(crashCooldown * 16) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    ctx.translate(x + w / 2, y + h / 2 + bounce);
    ctx.rotate(jeep.tilt);
    ctx.translate(-w / 2, -h / 2);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h + 2, w * 0.48, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horn Sound Waves!
    if (hornWaveTimer > 0) {
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      for (let r = 0; r < 2; r++) {
        ctx.beginPath();
        ctx.arc(w + 8, h * 0.52, 14 + r * 12 + (0.45 - hornWaveTimer) * 40, -0.55, 0.55);
        ctx.stroke();
      }
    }

    // Turbo Exhaust Flame!
    if (turboTimer > 0) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(0, h - 16);
      ctx.lineTo(-22 - Math.random() * 14, h - 12);
      ctx.lineTo(0, h - 7);
      ctx.closePath();
      ctx.fill();
    }

    // Main Colorful Sarao Jeepney Body!
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, 2, 2, w - 34, h - 8, 10);
    ctx.fill();
    ctx.stroke();

    // Shiny Chrome Front Hood
    ctx.fillStyle = '#e2e8f0';
    roundRect(ctx, w - 38, 22, 38, h - 28, 8);
    ctx.fill();
    ctx.stroke();

    // Yellow & Blue Fiesta Stripes along side
    ctx.fillStyle = '#facc15';
    ctx.fillRect(6, 36, w - 42, 9);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(6, 45, w - 42, 6);

    // Open Passenger Window showing Seated Pasaheros!
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, 10, 10, 68, 23, 5);
    ctx.fill();
    ctx.stroke();
    passengers.slice(0, 6).forEach((pax, i) => {
      const px = 20 + (i % 3) * 20;
      const py = 24;
      ctx.fillStyle = pax.shirtColor;
      ctx.fillRect(px - 6, py, 12, 8);
      ctx.fillStyle = '#f5be93';
      ctx.beginPath();
      ctx.arc(px, py - 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Front Driver Cabin Window with our YELLOW JERSEY + BACKWARD CAP CHIBI HERO!
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, 84, 8, 30, 26, 5);
    ctx.fill();
    ctx.stroke();
    Sprites.drawJeepDriverChibi(ctx, 99, 25, 0.72, angryCount < 2);

    // Route Signboard on side ("EDSA · KALYE HERO")
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(16, 35, 72, 13);
    ctx.strokeRect(16, 35, 72, 13);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 8.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EDSA · BEEP!', 52, 44.5);

    // Roof rack + headlights
    ctx.fillStyle = '#fde047';
    roundRect(ctx, 12, -4, w - 54, 7, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(w - 4, 36, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Spinning Wheels
    [28, w - 24].forEach((wx) => {
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(wx, h - 2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wx, h - 2, 5.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function drawTrafficVehicle(ctx, car) {
    ctx.save();
    const x = car.x;
    const y = car.y - car.h / 2;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;

    if (car.type === 'cone') {
      // MMDA EDSA Road Cone
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(x + car.w / 2, y);
      ctx.lineTo(x + car.w - 4, y + car.h);
      ctx.lineTo(x + 4, y + car.h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 11, y + 14, car.w - 22, 6);
      ctx.restore();
      return;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(x + car.w / 2, y + car.h + 2, car.w * 0.45, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vehicle body
    ctx.fillStyle = car.color;
    roundRect(ctx, x, y, car.w, car.h - 6, car.type === 'bus' ? 8 : 11);
    ctx.fill();
    ctx.stroke();

    if (car.type === 'bus') {
      // EDSA Carousel Bus windows & stripe
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 4, y + 32, car.w - 8, 8);
      ctx.fillStyle = '#bae6fd';
      for (let wx = x + 10; wx < x + car.w - 24; wx += 28) {
        ctx.fillRect(wx, y + 8, 20, 18);
        ctx.strokeRect(wx, y + 8, 20, 18);
      }
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 8.5px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EDSA BUSWAY', x + car.w / 2, y + 39);
    } else if (car.type === 'taxi') {
      ctx.fillStyle = '#bae6fd';
      roundRect(ctx, x + 22, y + 7, car.w - 44, 15, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + car.w / 2 - 14, y - 7, 28, 8);
      ctx.strokeRect(x + car.w / 2 - 14, y - 7, 28, 8);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 7.5px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TAXI', x + car.w / 2, y - 0.5);
    } else if (car.type === 'moto') {
      // Delivery Motorcycle Rider!
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(x + car.w * 0.55, y - 6, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x + 6, y - 8, 18, 16);
      ctx.strokeRect(x + 6, y - 8, 18, 16);
    } else {
      // Private SUV
      ctx.fillStyle = '#94a3b8';
      roundRect(ctx, x + 18, y + 7, car.w - 36, 17, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Wheels
    [x + 20, x + car.w - 20].forEach((wx) => {
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(wx, y + car.h - 4, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(wx, y + car.h - 4, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  return {
    start,
    stop,
    setPaused,
    moveLane,
    honkHorn,
    update,
    render,
    isActive: () => active
  };
})();
