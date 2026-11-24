// KALYE HERO: THE JEEP RIDE — EDSA Route & Endless Mode with UP & DOWN Bus Stops!
const JeepRide = (() => {
  const INK = '#111827';
  const BASE_STATIONS = [
    { name: 'MONUMENTO', color: '#ef4444' },
    { name: 'NORTH EDSA', color: '#f97316' },
    { name: 'CUBAO', color: '#eab308' },
    { name: 'ORTIGAS', color: '#10b981' },
    { name: 'GUADALUPE', color: '#06b6d4' },
    { name: 'AYALA', color: '#3b82f6' },
    { name: 'TAFT PASAY', color: '#8b5cf6' },
    { name: 'SHAW BLVD', color: '#ec4899' },
    { name: 'QUEZON AVE', color: '#14b8a6' }
  ];

  const MAX_SEATS = 6;
  const MAX_ANGRY = 3;
  const H = 630;
  // Road layout within 630px vertical world (Top sidewalk above ROAD_TOP for UP Bus Stops, Bottom sidewalk below ROAD_BOTTOM for DOWN Bus Stops!)
  const ROAD_TOP = 268;
  const ROAD_BOTTOM = 550;
  const LANE_H = (ROAD_BOTTOM - ROAD_TOP) / 3;
  const LANE_Y = [
    ROAD_TOP + LANE_H * 0.5,
    ROAD_TOP + LANE_H * 1.5,
    ROAD_TOP + LANE_H * 2.5
  ];

  let active = false;
  let paused = false;
  let finished = false;
  let endlessMode = false;
  let time = 0;

  let distance = 0;
  let speed = 215;
  let targetSpeed = 235;
  let fareEarned = 0;
  let happyServed = 0;
  let angryCount = 0;
  let combo = 0;
  let loopCount = 1;
  let hornCooldown = 0;
  let hornWaveTimer = 0;
  let turboTimer = 0;
  let crashCooldown = 0;
  let shakeTimer = 0;
  let stopHoldTimer = 0;
  let mrtX = 1200;

  let jeep = {
    x: 100,
    lane: 2,
    y: LANE_Y[2],
    w: 150,
    h: 62,
    tilt: 0
  };

  let passengers = [];
  let stations = [];
  let nextStationSeq = 0;
  let lastStationDist = 0;
  let traffic = [];
  let roadPickups = [];
  let floatTexts = [];
  let particles = [];
  let nextTrafficTimer = 0.85;
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

  function createStationNode(seqIdx, distVal, isTerminal) {
    const base = BASE_STATIONS[seqIdx % BASE_STATIONS.length];
    // Alternate Bus Stops cleanly between DOWN Curb (lane 2) and UP Curb (lane 0)!
    const side = seqIdx % 2 === 0 ? 'bottom' : 'top';
    const lane = side === 'top' ? 0 : 2;
    return {
      seqIndex: seqIdx,
      name: base.name,
      color: base.color,
      dist: distVal,
      side,
      lane,
      terminal: isTerminal,
      waiting: [],
      stoppedHere: false,
      passed: false
    };
  }

  function populateWaitingForStation(st) {
    if (st.terminal) return;
    const count = st.seqIndex === 0 ? 3 : 2 + (st.seqIndex % 2);
    const maxOffset = endlessMode ? 3 : Math.min(3, stations.length - 1 - st.seqIndex);
    if (maxOffset <= 0) return;
    for (let i = 0; i < count; i++) {
      const stepAhead = 1 + Math.floor(Math.random() * maxOffset);
      const targetSeq = st.seqIndex + stepAhead;
      const targetBase = BASE_STATIONS[targetSeq % BASE_STATIONS.length];
      const loopMult = 1 + Math.floor(st.seqIndex / 7) * 0.25;
      st.waiting.push({
        id: nextPaxId++,
        destSeq: targetSeq,
        destName: targetBase.name,
        destColor: targetBase.color,
        shirtColor: PAX_SHIRTS[(st.seqIndex * 3 + i) % PAX_SHIRTS.length],
        patience: 100,
        maxPatience: 100,
        fare: Math.round((25 + stepAhead * 15) * loopMult)
      });
    }
  }

  function ensureEndlessStations() {
    if (!endlessMode) return;
    while (lastStationDist - distance < 3400) {
      lastStationDist += 1050;
      const st = createStationNode(nextStationSeq++, lastStationDist, false);
      stations.push(st);
      populateWaitingForStation(st);
    }
  }

  function start(statusCb, endCb, modeType = 'route') {
    onStatusUpdate = statusCb;
    onEndCallback = endCb;
    endlessMode = modeType === 'endless';
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
    loopCount = 1;
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

    stations = [];
    nextStationSeq = 0;
    lastStationDist = 650;

    if (endlessMode) {
      // Seed first 4 endless stations (alternating DOWN & UP!)
      for (let i = 0; i < 4; i++) {
        const d = 650 + i * 1050;
        lastStationDist = d;
        const st = createStationNode(nextStationSeq++, d, false);
        stations.push(st);
      }
      stations.forEach(populateWaitingForStation);
    } else {
      // Classic 7-Station EDSA Route (Monumento -> Taft Pasay), alternating DOWN & UP Bus Stops!
      for (let i = 0; i < 7; i++) {
        const d = 650 + i * 1060;
        lastStationDist = d;
        stations.push(createStationNode(nextStationSeq++, d, i === 6));
      }
      stations.forEach(populateWaitingForStation);
    }

    // Start with 2 friendly pasaheros onboard!
    passengers = [
      {
        id: nextPaxId++,
        destSeq: 1,
        destName: stations[1].name,
        destColor: stations[1].color,
        shirtColor: '#3b82f6',
        patience: 100,
        maxPatience: 100,
        fare: 30
      },
      {
        id: nextPaxId++,
        destSeq: 2,
        destName: stations[2].name,
        destColor: stations[2].color,
        shirtColor: '#ec4899',
        patience: 100,
        maxPatience: 100,
        fare: 45
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

    for (const pax of passengers) {
      pax.patience = Math.min(pax.maxPatience, pax.patience + 10);
    }
    for (const car of traffic) {
      if (car.lane === jeep.lane && car.x > jeep.x && car.x < jeep.x + 360 && !car.honked) {
        car.honked = true;
        car.vx += 130;
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
    const dropHere = passengers.filter((p) => p.destSeq === nextSt.seqIndex || nextSt.terminal).length;
    const totalDist = stations[stations.length - 1].dist;
    onStatusUpdate({
      endlessMode,
      loopCount: 1 + Math.floor(distance / 7000),
      fareEarned,
      happyServed,
      angryCount,
      maxAngry: MAX_ANGRY,
      combo,
      passengers,
      maxSeats: MAX_SEATS,
      progress: endlessMode ? ((distance % 1050) / 1050) * 100 : Math.min(100, (distance / totalDist) * 100),
      nextStation: nextSt.name,
      nextStationSide: nextSt.side === 'top' ? '⬆️ UP' : '⬇️ DOWN',
      nextStationDist: Math.max(0, Math.round(nextSt.dist - distance)),
      dropHere
    });
  }

  function spawnTrafficCar(viewW) {
    const nextSt = getNextStation();
    const nearStation = nextSt && Math.abs(nextSt.dist - distance) < 250;
    // Leave whichever side (UP or DOWN) has the approaching Bus Stop clearer!
    const laneChoices = nearStation
      ? (nextSt.lane === 0 ? [1, 2] : [0, 1])
      : [0, 1, 2];
    const lane = laneChoices[Math.floor(Math.random() * laneChoices.length)];

    if (traffic.some((c) => c.lane === lane && c.x > viewW - 180)) return;

    const r = Math.random();
    let type = 'taxi';
    let w = 104;
    let h = 48;
    let color = '#facc15';
    let vx = 105 + Math.random() * 50;

    if (r < 0.24 && lane === 1) {
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
      vx = 0;
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
          endlessMode,
          fareEarned,
          happyServed,
          angryCount,
          distance: Math.round(distance),
          stars: Math.max(1, 5 - angryCount)
        });
      }
    }
  }

  function handleStationStop(st) {
    let paidTotal = 0;
    let droppedCount = 0;
    let boardedCount = 0;

    for (let i = passengers.length - 1; i >= 0; i--) {
      const pax = passengers[i];
      if (pax.destSeq === st.seqIndex || st.terminal) {
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

    while (st.waiting.length > 0 && passengers.length < MAX_SEATS) {
      passengers.push(st.waiting.shift());
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

    if (st.terminal && !endlessMode && !finished) {
      finished = true;
      SoundFX.stageClear();
      const stars = angryCount === 0 ? 5 : angryCount === 1 ? 4 : 3;
      if (onEndCallback) {
        onEndCallback({
          won: true,
          endlessMode: false,
          fareEarned,
          happyServed,
          angryCount,
          distance: Math.round(distance),
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

    ensureEndlessStations();

    jeep.x = viewW < 640 ? 48 : 96;

    // Horizontal Forward/Backward-ONLY Joystick + Stop/Gas Buttons!
    const joyX = controls.joyX || 0;
    const braking = controls.brake;
    const reversing = !braking && joyX < -0.3;
    const gassing = controls.gas || joyX > 0.25;
    const endlessBoost = endlessMode ? Math.min(85, distance * 0.005) : 0;
    const baseCruise = (turboTimer > 0 ? 355 : 225) + endlessBoost;

    if (braking) {
      targetSpeed = 0;
    } else if (reversing) {
      // Gentle slow-down / slight reverse so you can back into a station bay!
      targetSpeed = -55 * Math.min(1, Math.abs(joyX));
    } else if (gassing) {
      targetSpeed = (turboTimer > 0 ? 410 : 335) + endlessBoost;
    } else {
      targetSpeed = baseCruise;
    }

    const accel = braking || reversing ? 720 : 350;
    if (speed < targetSpeed) speed = Math.min(targetSpeed, speed + accel * dt);
    else speed = Math.max(targetSpeed, speed - accel * dt);

    distance = Math.max(0, distance + speed * dt * 0.34);

    // Smooth discrete lane glide (controlled by UP / DOWN buttons or W/S keys!)
    const targetY = LANE_Y[jeep.lane];
    jeep.y += (targetY - jeep.y) * Math.min(1, dt * 13);
    jeep.tilt *= 0.88;

    mrtX -= (170 + Math.max(0, speed) * 0.25) * dt;
    if (mrtX < -520) mrtX = viewW + 400 + Math.random() * 400;

    // Spawn EDSA Traffic
    nextTrafficTimer -= dt * (speed > 60 ? 1 : 0.25);
    if (nextTrafficTimer <= 0) {
      spawnTrafficCar(viewW);
      const diffScale = Math.min(0.65, (distance / 10000) * 0.55);
      nextTrafficTimer = Math.max(0.68, 1.5 - diffScale) + Math.random() * 0.5;
    }

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

    // Update Traffic
    for (let i = traffic.length - 1; i >= 0; i--) {
      const car = traffic[i];
      const relSpeed = speed - car.vx;
      car.x -= relSpeed * dt;

      if (car.x < -260 || car.x > viewW + 460) {
        traffic.splice(i, 1);
        continue;
      }

      if (
        crashCooldown <= 0 &&
        Math.abs(car.y - jeep.y) < 34 &&
        jeep.x + jeep.w - 14 > car.x + 8 &&
        jeep.x + 12 < car.x + car.w - 8
      ) {
        crashCooldown = 1.35;
        shakeTimer = 0.26;
        speed = Math.max(30, speed * 0.35);
        SoundFX.hurt();
        addParticles(jeep.x + jeep.w - 10, jeep.y, '#f97316', 14);
        addFloat(jeep.x + 80, jeep.y - 44, 'BUMP! ARAY KOYA! 💥', '#fb923c', 18);

        if (car.type === 'cone') traffic.splice(i, 1);
        else { car.x += 55; car.vx += 90; }

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
      if (pk.x < -60) { roadPickups.splice(i, 1); continue; }
      if (Math.abs(pk.y - jeep.y) < 42 && jeep.x + jeep.w > pk.x - 14 && jeep.x < pk.x + 14) {
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

    // Passenger patience
    const nextSt = getNextStation();
    const inStationRange = nextSt && Math.abs(nextSt.dist - distance) < 110;
    const patienceDrain = Math.abs(speed) < 40 && !inStationRange ? 4.0 : 1.2;
    for (let i = passengers.length - 1; i >= 0; i--) {
      passengers[i].patience -= patienceDrain * dt;
      if (passengers[i].patience <= 0) {
        const mad = passengers.splice(i, 1)[0];
        triggerAngryPassenger(mad, 'TAGAL NAMAN KOYA!');
        if (finished) return;
      }
    }

    // Check BOTH UP (lane 0) & DOWN (lane 2) Bus Stops!
    for (const st of stations) {
      if (st.passed) continue;
      const dxDist = st.dist - distance;

      if (Math.abs(dxDist) < 105 && jeep.lane === st.lane) {
        if (Math.abs(speed) < 55) {
          stopHoldTimer += dt;
          if (!st.stoppedHere && stopHoldTimer >= 0.32) {
            handleStationStop(st);
            if (finished) return;
          }
        } else {
          stopHoldTimer = Math.max(0, stopHoldTimer - dt);
        }
      }

      if (dxDist < -125) {
        st.passed = true;
        stopHoldTimer = 0;

        for (let i = passengers.length - 1; i >= 0; i--) {
          if (passengers[i].destSeq === st.seqIndex) {
            const missed = passengers.splice(i, 1)[0];
            triggerAngryPassenger(missed, `LUMAGPAS SA ${st.name}!`);
            if (finished) return;
          }
        }

        if (st.terminal && !endlessMode && !st.stoppedHere && !finished) {
          handleStationStop(st);
        }
      }
    }

    // Prune very old passed stations in endless mode
    if (endlessMode && stations.length > 10 && stations[0].passed && distance - stations[0].dist > 600) {
      stations.shift();
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

    notifyHUD();
  }

  // ==================== RENDERING EDSA (TOP & BOTTOM BUS STOPS!) ====================
  function render(ctx, W) {
    ctx.save();
    if (shakeTimer > 0) {
      ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    }

    // 1. Manila EDSA Sky
    const sky = ctx.createLinearGradient(0, 0, 0, ROAD_TOP);
    sky.addColorStop(0, '#1d4ed8');
    sky.addColorStop(0.55, '#38bdf8');
    sky.addColorStop(1, '#fef08a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, ROAD_TOP);

    // Skyline
    const skyScroll = distance * 0.45;
    for (let i = -1; i < 10; i++) {
      const bx = i * 165 - (skyScroll % 165);
      const bh = 82 + ((Math.abs(i * 41) % 4) * 28);
      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(bx, ROAD_TOP - 82 - bh, 118, bh + 50);
    }

    // Overhead MRT-3 Viaduct & Train
    const mrtY = 148;
    const pilScroll = distance * 1.6;
    for (let px = -(pilScroll % 240); px < W + 240; px += 240) {
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.fillRect(px, mrtY + 20, 24, ROAD_TOP - mrtY - 60);
      ctx.strokeRect(px, mrtY + 20, 24, ROAD_TOP - mrtY - 60);
    }
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.fillRect(0, mrtY, W, 22);
    ctx.strokeRect(-4, mrtY, W + 8, 22);

    ctx.save();
    ctx.fillStyle = '#1d4ed8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    for (let car = 0; car < 3; car++) {
      const tx = mrtX + car * 138;
      roundRect(ctx, tx, mrtY - 32, 130, 32, 7);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(tx + 4, mrtY - 10, 122, 6);
      ctx.fillStyle = '#bae6fd';
      for (let w = 0; w < 4; w++) ctx.fillRect(tx + 12 + w * 28, mrtY - 26, 20, 11);
      ctx.fillStyle = '#1d4ed8';
    }
    ctx.restore();

    // 2. TOP EDSA SIDEWALK (For UP Bus Stops — Lane 0!)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, ROAD_TOP - 68, W, 68);
    for (let cx = -((distance * 2.95) % 64); cx < W + 64; cx += 64) {
      ctx.fillStyle = Math.floor((cx + distance * 2.95) / 64) % 2 === 0 ? '#facc15' : '#111827';
      ctx.fillRect(cx, ROAD_TOP - 9, 32, 9);
    }

    // 3. EDSA 3-Lane Asphalt Highway
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, ROAD_TOP, W, ROAD_BOTTOM - ROAD_TOP);
    const roadScroll = (distance * 2.95) % 80;
    ctx.fillStyle = '#facc15';
    for (let lx = -roadScroll; lx < W + 80; lx += 80) {
      ctx.fillRect(lx, ROAD_TOP + LANE_H - 3, 44, 6);
    }
    ctx.fillStyle = '#f8fafc';
    for (let lx = -roadScroll; lx < W + 80; lx += 80) {
      ctx.fillRect(lx, ROAD_TOP + LANE_H * 2 - 3, 44, 6);
    }

    // 4. BOTTOM EDSA SIDEWALK (For DOWN Bus Stops — Lane 2!)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, ROAD_BOTTOM, W, H - ROAD_BOTTOM);
    for (let cx = -((distance * 2.95) % 64); cx < W + 64; cx += 64) {
      ctx.fillStyle = Math.floor((cx + distance * 2.95) / 64) % 2 === 0 ? '#facc15' : '#111827';
      ctx.fillRect(cx, ROAD_BOTTOM, 32, 9);
    }

    // 5. Draw UP (Top Curb) & DOWN (Bottom Curb) Bus Stops + Waiting Pasaheros!
    for (const st of stations) {
      const screenX = jeep.x + 80 + (st.dist - distance) * 2.95;
      if (screenX < -280 || screenX > W + 320) continue;

      const hasDropOff = passengers.some((p) => p.destSeq === st.seqIndex || st.terminal);
      const bayX = screenX - 108;
      const bayW = 216;
      const isTop = st.side === 'top';
      const bayY = isTop ? ROAD_TOP + 4 : ROAD_TOP + LANE_H * 2 + 4;

      // Glowing Bus Stop Bay in Lane 0 (UP) OR Lane 2 (DOWN)!
      ctx.save();
      ctx.fillStyle = hasDropOff
        ? `rgba(16, 185, 129, ${0.3 + Math.sin(time * 8) * 0.12})`
        : 'rgba(250, 204, 21, 0.24)';
      ctx.fillRect(bayX, bayY, bayW, LANE_H - 8);
      ctx.strokeStyle = hasDropOff ? '#34d399' : '#facc15';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([10, 6]);
      ctx.strokeRect(bayX, bayY, bayW, LANE_H - 8);
      ctx.setLineDash([]);

      ctx.fillStyle = hasDropOff ? '#a7f3d0' : '#fef08a';
      ctx.font = 'bold 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        hasDropOff
          ? `🛑 ${isTop ? '⬆️ UP' : '⬇️ DOWN'} STOP · BABAAN`
          : `🛑 ${isTop ? '⬆️ UP' : '⬇️ DOWN'} SAKAYAN`,
        screenX,
        bayY + 22
      );
      ctx.restore();

      // Station Signpost + Waiting Pasaheros on TOP or BOTTOM Sidewalk!
      ctx.save();
      const signY = isTop ? ROAD_TOP - 64 : ROAD_BOTTOM + 12;
      ctx.fillStyle = st.color;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, bayX + 10, signY, bayW - 20, 30, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🚏 ${st.name} (${isTop ? 'UP' : 'DOWN'})`, screenX, signY + 20);
      ctx.restore();

      st.waiting.forEach((wp, idx) => {
        const px = bayX + 42 + idx * 46;
        const py = isTop ? ROAD_TOP - 12 : ROAD_BOTTOM + 56;
        drawWaitingPasahero(ctx, px, py, wp, time + idx);
      });
    }

    // 6. Road Pickups
    for (const pk of roadPickups) {
      ctx.save();
      ctx.translate(pk.x, pk.y + Math.sin(time * 6 + pk.x) * 4);
      if (pk.type === 'kape') {
        ctx.fillStyle = 'rgba(253,224,71,0.35)';
        ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
        roundRect(ctx, -9, -12, 18, 24, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fef08a'; ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('⚡', 0, 5);
      } else {
        ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#92400e'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#92400e'; ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('₱', 0, 1);
      }
      ctx.restore();
    }

    // 7. Depth-sorted Vehicles
    const drawables = [];
    traffic.forEach((c) => drawables.push({ kind: 'traffic', y: c.y, obj: c }));
    drawables.push({ kind: 'jeep', y: jeep.y, obj: jeep });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) {
      if (d.kind === 'traffic') drawTrafficVehicle(ctx, d.obj);
      else drawPlayerJeepney(ctx);
    }

    // 8. PARA PO! Approach Banner (clearly tells player UP or DOWN bay!)
    const nextSt = getNextStation();
    if (nextSt) {
      const dLeft = nextSt.dist - distance;
      const dropCount = passengers.filter((p) => p.destSeq === nextSt.seqIndex || nextSt.terminal).length;
      if (dLeft > -70 && dLeft < 360 && dropCount > 0 && !nextSt.stoppedHere) {
        ctx.save();
        const pulse = 1 + Math.sin(time * 12) * 0.04;
        ctx.translate(W / 2, 42);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        const bw = Math.min(W - 20, 360);
        roundRect(ctx, -bw / 2, -20, bw, 40, 12);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#052e16';
        ctx.font = `bold ${W < 420 ? 12.5 : 14.5}px Fredoka, sans-serif`;
        ctx.textAlign = 'center';
        const sideLbl = nextSt.side === 'top' ? '⬆️ TOP BAY' : '⬇️ BOTTOM BAY';
        ctx.fillText(`🛑 PARA PO! ${nextSt.name} (${sideLbl})`, 0, 6);
        ctx.restore();
      }
    }

    // 9. Particles & Floating Texts
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

  function drawWaitingPasahero(ctx, x, y, wp, t) {
    ctx.save();
    const wave = Math.sin(t * 9) * 5;
    ctx.fillStyle = wp.shirtColor;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    roundRect(ctx, x - 8, y - 16, 16, 15, 4);
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#f2b88a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(x + 7, y - 12);
    ctx.lineTo(x + 14, y - 22 + wave);
    ctx.stroke();
    ctx.fillStyle = '#f5be93';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y - 24, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#18181b';
    ctx.beginPath(); ctx.arc(x, y - 27, 9, Math.PI, 0); ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    roundRect(ctx, x - 26, y - 50, 52, 16, 5);
    ctx.fill(); ctx.stroke();
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
    const bounce = Math.abs(speed) > 20 ? Math.sin(time * 22) * 1.8 : 0;

    if (crashCooldown > 0 && Math.floor(crashCooldown * 16) % 2 === 0) ctx.globalAlpha = 0.55;

    ctx.translate(x + w / 2, y + h / 2 + bounce);
    ctx.rotate(jeep.tilt);
    ctx.translate(-w / 2, -h / 2);

    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath(); ctx.ellipse(w / 2, h + 2, w * 0.48, 9, 0, 0, Math.PI * 2); ctx.fill();

    if (hornWaveTimer > 0) {
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = 3;
      for (let r = 0; r < 2; r++) {
        ctx.beginPath();
        ctx.arc(w + 8, h * 0.52, 14 + r * 12 + (0.45 - hornWaveTimer) * 40, -0.55, 0.55);
        ctx.stroke();
      }
    }
    if (turboTimer > 0) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.moveTo(0, h - 16); ctx.lineTo(-22 - Math.random() * 14, h - 12); ctx.lineTo(0, h - 7); ctx.closePath(); ctx.fill();
    }

    ctx.fillStyle = '#dc2626'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    roundRect(ctx, 2, 2, w - 34, h - 8, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e2e8f0';
    roundRect(ctx, w - 38, 22, 38, h - 28, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#facc15'; ctx.fillRect(6, 36, w - 42, 9);
    ctx.fillStyle = '#2563eb'; ctx.fillRect(6, 45, w - 42, 6);

    ctx.fillStyle = '#1e293b';
    roundRect(ctx, 10, 10, 68, 23, 5); ctx.fill(); ctx.stroke();
    passengers.slice(0, 6).forEach((pax, i) => {
      const px = 20 + (i % 3) * 20;
      const py = 24;
      ctx.fillStyle = pax.shirtColor; ctx.fillRect(px - 6, py, 12, 8);
      ctx.fillStyle = '#f5be93'; ctx.beginPath(); ctx.arc(px, py - 2, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    });

    ctx.fillStyle = '#0f172a';
    roundRect(ctx, 84, 8, 30, 26, 5); ctx.fill(); ctx.stroke();
    Sprites.drawJeepDriverChibi(ctx, 99, 25, 0.72, angryCount < 2);

    ctx.fillStyle = '#ffffff'; ctx.fillRect(16, 35, 72, 13); ctx.strokeRect(16, 35, 72, 13);
    ctx.fillStyle = '#111827'; ctx.font = 'bold 8.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(endlessMode ? 'EDSA · ENDLESS' : 'EDSA · BEEP!', 52, 44.5);

    ctx.fillStyle = '#fde047'; roundRect(ctx, 12, -4, w - 54, 7, 3); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(w - 4, 36, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    [28, w - 24].forEach((wx) => {
      ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, h - 2, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.arc(wx, h - 2, 5.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function drawTrafficVehicle(ctx, car) {
    ctx.save();
    const x = car.x;
    const y = car.y - car.h / 2;
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6;

    if (car.type === 'cone') {
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.moveTo(x + car.w / 2, y); ctx.lineTo(x + car.w - 4, y + car.h); ctx.lineTo(x + 4, y + car.h); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 11, y + 14, car.w - 22, 6);
      ctx.restore();
      return;
    }

    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(x + car.w / 2, y + car.h + 2, car.w * 0.45, 7, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = car.color;
    roundRect(ctx, x, y, car.w, car.h - 6, car.type === 'bus' ? 8 : 11);
    ctx.fill(); ctx.stroke();

    if (car.type === 'bus') {
      ctx.fillStyle = '#facc15'; ctx.fillRect(x + 4, y + 32, car.w - 8, 8);
      ctx.fillStyle = '#bae6fd';
      for (let wx = x + 10; wx < x + car.w - 24; wx += 28) { ctx.fillRect(wx, y + 8, 20, 18); ctx.strokeRect(wx, y + 8, 20, 18); }
      ctx.fillStyle = '#111827'; ctx.font = 'bold 8.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('EDSA BUSWAY', x + car.w / 2, y + 39);
    } else if (car.type === 'taxi') {
      ctx.fillStyle = '#bae6fd'; roundRect(ctx, x + 22, y + 7, car.w - 44, 15, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + car.w / 2 - 14, y - 7, 28, 8); ctx.strokeRect(x + car.w / 2 - 14, y - 7, 28, 8);
      ctx.fillStyle = '#111827'; ctx.font = 'bold 7.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TAXI', x + car.w / 2, y - 0.5);
    } else if (car.type === 'moto') {
      ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(x + car.w * 0.55, y - 6, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#22c55e'; ctx.fillRect(x + 6, y - 8, 18, 16); ctx.strokeRect(x + 6, y - 8, 18, 16);
    } else {
      ctx.fillStyle = '#94a3b8'; roundRect(ctx, x + 18, y + 7, car.w - 36, 17, 4); ctx.fill(); ctx.stroke();
    }

    [x + 20, x + car.w - 20].forEach((wx) => {
      ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, y + car.h - 4, 9.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(wx, y + car.h - 4, 4, 0, Math.PI * 2); ctx.fill();
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
