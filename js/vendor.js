// KALYE HERO: THE VENDOR — 2 Modes: Balot Vendor Run (Pasig River) & Malunggay Pandesal ni Kuya Tisoy!
const VendorGame = (() => {
  const INK = '#111827';
  const H = 630;
  const BALOT_BEST_KEY = 'kalye_hero_balot_best_v1';

  const PANDESAL_LEVELS = [
    { index: 0, name: 'ROUTE 1 · MORNING BARANGAY', short: 'Morning Barangay', icon: '🌅', goalPandesal: 30, goalPesos: 60, maxMissed: 4, baseSpeed: 195 },
    { index: 1, name: 'ROUTE 2 · SUBDIVISION RUSH', short: 'Subdivision Rush', icon: '🏘️', goalPandesal: 50, goalPesos: 100, maxMissed: 4, baseSpeed: 230 },
    { index: 2, name: 'ROUTE 3 · FIESTA BAKERY RUN', short: 'Fiesta Bakery', icon: '🎉', goalPandesal: 75, goalPesos: 150, maxMissed: 4, baseSpeed: 265 }
  ];

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

  // ==================== BALOT VENDOR (SUBWAY SURFERS / TEMPLE RUN 3D PERSPECTIVE) STATE ====================
  let balotBestDist = 0;
  try { balotBestDist = Number(localStorage.getItem(BALOT_BEST_KEY) || 0); } catch (_) {}

  let bLane = 1; // 0 (Left), 1 (Center), 2 (Right)
  let bLaneX = 1; // smooth interpolated lane 0..2
  let bJumpY = 0;
  let bJumpVy = 0;
  let bSpeed = 1.05; // world z-units per second
  let bDist = 0;
  let bPesos = 0;
  let bEggs = 0;
  let bDogClose = 0; // 0 = far, 1 = right behind barking, 2 = caught!
  let bDogRecoverTimer = 0;
  let bStumbleInvuln = 0;
  let bBoostTimer = 0;
  let bObjects = []; // { z (0..1.4), lane, kind: 'barrier'|'tricycle'|'cart'|'egg'|'coin'|'chili', hit }
  let bSpawnTimer = 0.6;
  let bJoyLatch = 0;

  // ==================== PANDESAL NI KUYA TISOY (BIKE DELIVERY) STATE ====================
  let pLvlIdx = 0;
  let pLvlCfg = PANDESAL_LEVELS[0];
  let pDist = 0;
  let pSpeed = 190;
  let pSold = 0;
  let pPesos = 0;
  let pMissed = 0;
  let pSellHold = 0;
  let pShoutCooldown = 0;
  let pShoutWave = 0;
  let pHouses = []; // { dist, color, roofColor, wantsPandesal, qty, sold, missed, ownerName, shoutTimer }
  let pNextHouseDist = 360;
  const HOUSE_COLORS = ['#fef3c7', '#dcfce7', '#fce7f3', '#e0f2fe', '#ffedd5', '#f3e8ff'];
  const ROOF_COLORS = ['#dc2626', '#2563eb', '#15803d', '#9a3412', '#7c3aed'];
  const NEIGHBORS = ['Aling Nena', 'Mang Jose', 'Ate Joy', 'Kuya Ben', 'Lola Ising', 'Tito Boy', 'Aling Cora'];

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
    floatTexts.push({ x, y, vy: -60, text, color, size, life: 1.15, maxLife: 1.15 });
  }

  function addParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 55 + Math.random() * 165;
      particles.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 45,
        size: 3 + Math.random() * 4.5, color,
        life: 0.4 + Math.random() * 0.35, maxLife: 0.75
      });
    }
  }

  function start(modeName, lvlIdx, custom, statusCb, endCb) {
    subMode = modeName === 'pandesal' ? 'pandesal' : 'balot';
    customLook = custom ? { ...custom } : customLook;
    onStatusUpdate = statusCb;
    onEndCallback = endCb;
    active = true;
    paused = false;
    finished = false;
    time = 0;
    shakeTimer = 0;
    particles = [];
    floatTexts = [];

    if (subMode === 'balot') {
      bLane = 1;
      bLaneX = 1;
      bJumpY = 0;
      bJumpVy = 0;
      bSpeed = 0.72;
      bDist = 0;
      bPesos = 0;
      bEggs = 0;
      bDogClose = 0;
      bDogRecoverTimer = 0;
      bStumbleInvuln = 0;
      bBoostTimer = 0;
      bObjects = [];
      bSpawnTimer = 0.7;
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
      ensurePandesalHouses();
    }
    notifyHUD();
  }

  function stop() {
    active = false;
    paused = false;
  }

  function setPaused(val) {
    paused = val;
  }

  function ensurePandesalHouses() {
    while (pNextHouseDist - pDist < 2200) {
      const idx = pHouses.length;
      // 75% of houses shout "PANDESAL!" (first house ALWAYS shouts so player immediately sells!)
      const wants = idx === 0 || Math.random() < 0.74;
      const qty = 3 + Math.floor(Math.random() * (pLvlIdx === 0 ? 5 : 7)); // 3–9 pandesals @ ₱2 each!
      pHouses.push({
        dist: pNextHouseDist,
        color: HOUSE_COLORS[idx % HOUSE_COLORS.length],
        roofColor: ROOF_COLORS[idx % ROOF_COLORS.length],
        ownerName: NEIGHBORS[idx % NEIGHBORS.length],
        wantsPandesal: wants,
        qty,
        sold: false,
        missed: false
      });
      pNextHouseDist += 390 + Math.floor(Math.random() * 110);
    }
  }

  // Controls Actions
  function balotMoveLane(delta) {
    if (!active || paused || finished || subMode !== 'balot') return;
    const next = Math.max(0, Math.min(2, bLane + delta));
    if (next !== bLane) {
      bLane = next;
      SoundFX.board();
    }
  }

  function balotJump() {
    if (!active || paused || finished || subMode !== 'balot') return;
    if (bJumpY <= 2) {
      bJumpVy = 610;
      SoundFX.jump();
    }
  }

  function pandesalShout() {
    if (!active || paused || finished || subMode !== 'pandesal' || pShoutCooldown > 0) return;
    pShoutCooldown = 2.6;
    pShoutWave = 0.55;
    SoundFX.horn();
    addFloat(180, 390, '📣 MALUNGGAY PANDESAL!! ₱2!', '#fde047', 17);
    // Wake up the next quiet house ahead so it becomes a bonus buyer!
    const quiet = pHouses.find((h) => !h.wantsPandesal && !h.sold && !h.missed && h.dist > pDist + 90 && h.dist < pDist + 650);
    if (quiet) {
      quiet.wantsPandesal = true;
      quiet.qty = 4 + Math.floor(Math.random() * 5);
      addFloat(260, 290, `${quiet.ownerName}: "PANDESAL!!" 🥖`, '#34d399', 15);
    }
  }

  function notifyHUD() {
    if (!onStatusUpdate) return;
    if (subMode === 'balot') {
      onStatusUpdate({
        subMode: 'balot',
        title: '🥚 BALOT RUN · PASIG RIVER',
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
    notifyHUD();
  }

  function updateBalot(dt, W, controls) {
    // Horizontal Joystick snaps lanes cleanly (with latch so one slide = one lane step!)
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

    if (bJumpY > 0 || bJumpVy > 0) {
      bJumpY += bJumpVy * dt;
      bJumpVy -= 1820 * dt;
      if (bJumpY < 0) { bJumpY = 0; bJumpVy = 0; }
    }

    if (bStumbleInvuln > 0) bStumbleInvuln -= dt;
    if (bBoostTimer > 0) bBoostTimer -= dt;
    if (bDogClose === 1) {
      bDogRecoverTimer += dt;
      if (bDogRecoverTimer >= 7.0) {
        bDogClose = 0;
        bDogRecoverTimer = 0;
        addFloat(W / 2, 390, 'ESCAPED THE DOG! 💨', '#34d399', 16);
      }
    }

    const spdMult = bBoostTimer > 0 ? 1.45 : 1.0;
    bSpeed = Math.min(1.38, 0.72 + bDist * 0.00055);
    const stepZ = bSpeed * spdMult * dt;
    bDist += stepZ * 42;

    // Spawn Obstacles & Balot Collectibles on Horizon (z = 0.02 -> approaches player at z = 1.0!)
    bSpawnTimer -= dt * spdMult;
    if (bSpawnTimer <= 0) {
      const lane = Math.floor(Math.random() * 3);
      const r = Math.random();
      if (r < 0.24) {
        bObjects.push({ z: 0.02, lane, kind: 'barrier', jumpable: true, hit: false });
      } else if (r < 0.45) {
        bObjects.push({ z: 0.02, lane, kind: 'tricycle', jumpable: false, hit: false });
      } else if (r < 0.6) {
        bObjects.push({ z: 0.02, lane, kind: 'cart', jumpable: false, hit: false });
      } else if (r < 0.8) {
        // Line of 3 Balot Eggs or Coins!
        for (let k = 0; k < 3; k++) {
          bObjects.push({ z: 0.02 - k * 0.08, lane, kind: k === 1 ? 'egg' : 'coin', jumpable: false, hit: false });
        }
      } else {
        bObjects.push({ z: 0.02, lane, kind: 'chili', jumpable: false, hit: false });
      }
      bSpawnTimer = Math.max(0.45, 0.95 - bDist * 0.00035) + Math.random() * 0.25;
    }

    // Advance & Collide
    for (let i = bObjects.length - 1; i >= 0; i--) {
      const obj = bObjects[i];
      obj.z += stepZ;

      if (!obj.hit && obj.z >= 0.88 && obj.z <= 1.04 && Math.abs(obj.lane - bLaneX) < 0.46) {
        const isPickup = obj.kind === 'egg' || obj.kind === 'coin' || obj.kind === 'chili';
        if (isPickup) {
          obj.hit = true;
          if (obj.kind === 'egg') {
            bEggs++;
            bPesos += 20;
            SoundFX.coin();
            addFloat(W / 2, 430, '🥚 BALOT! +₱20', '#fde047', 17);
            addParticles(W / 2, 470, '#fde047', 8);
          } else if (obj.kind === 'chili') {
            bBoostTimer = 3.5;
            bDogClose = 0;
            bDogRecoverTimer = 0;
            SoundFX.energyDrink();
            addFloat(W / 2, 420, '🌶️ SUKA BOOST! DOG BACK!', '#f97316', 18);
            addParticles(W / 2, 470, '#f97316', 14);
          } else {
            bPesos += 5;
            SoundFX.coin();
          }
        } else if (bStumbleInvuln <= 0) {
          // Obstacle collision! (Check if player jumped over low barrier!)
          if (obj.jumpable && bJumpY > 42) {
            obj.hit = true;
            addFloat(W / 2, 420, 'NICE JUMP! 💨', '#38bdf8', 15);
          } else if (bBoostTimer > 0) {
            // Chili boost smashes straight through!
            obj.hit = true;
            SoundFX.crateBreak();
            addParticles(W / 2, 480, '#facc15', 10);
          } else {
            obj.hit = true;
            bStumbleInvuln = 1.1;
            bDogClose++;
            bDogRecoverTimer = 0;
            shakeTimer = 0.28;
            SoundFX.angry();
            addParticles(W / 2, 490, '#ef4444', 14);
            if (bDogClose >= 2) {
              // DOG CAUGHT THE BALOT VENDOR!
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
                  dist: Math.floor(bDist),
                  bestDist: balotBestDist,
                  pesos: bPesos,
                  eggs: bEggs
                });
              }
              return;
            } else {
              addFloat(W / 2, 415, '🐕 AW! AW! DOG IS RIGHT BEHIND YOU!', '#f87171', 16);
            }
          }
        }
      }

      if (obj.z > 1.25) bObjects.splice(i, 1);
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
    else if (reversing) targetSpd = -85 * Math.min(1, Math.abs(jx));
    else if (pedalingFast) targetSpd = pLvlCfg.baseSpeed * 1.48;

    const accel = braking || reversing ? 760 : 340;
    if (pSpeed < targetSpd) pSpeed = Math.min(targetSpd, pSpeed + accel * dt);
    else pSpeed = Math.max(targetSpd, pSpeed - accel * dt);

    pDist = Math.max(0, pDist + pSpeed * dt);
    ensurePandesalHouses();

    // Check Houses for Selling or Missing!
    const bikeWorldX = pDist;
    for (const h of pHouses) {
      if (h.sold || h.missed) continue;
      const dx = h.dist - bikeWorldX;

      // Selling Zone right in front of the house gate!
      if (h.wantsPandesal && Math.abs(dx) < 88) {
        if (Math.abs(pSpeed) < 55 || braking) {
          pSellHold += dt;
          if (pSellHold >= 0.25) {
            h.sold = true;
            pSellHold = 0;
            const earned = h.qty * 2; // EXACTLY ₱2 per Malunggay Pandesal!
            pSold += h.qty;
            pPesos += earned;
            SoundFX.farePaid();
            const bikeScreenX = W < 520 ? W * 0.34 : 210;
            addParticles(bikeScreenX + 20, 440, '#fde047', 14);
            addParticles(bikeScreenX + 20, 440, '#34d399', 10);
            addFloat(bikeScreenX + 20, 385, `🥖 ${h.qty} PANDESAL · +₱${earned}!`, '#34d399', 17);

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

      // Passed a shouting house without stopping!
      if (h.wantsPandesal && dx < -118) {
        h.missed = true;
        pMissed++;
        shakeTimer = 0.24;
        SoundFX.angry();
        const bikeScreenX = W < 520 ? W * 0.34 : 210;
        addFloat(bikeScreenX + 20, 390, `😢 MISSED ${h.ownerName}! (${pMissed}/${pLvlCfg.maxMissed})`, '#f87171', 15);
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

  // ==================== RENDERING ====================
  function render(ctx, W) {
    ctx.save();
    if (shakeTimer > 0) ctx.translate((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9);

    if (subMode === 'balot') {
      renderBalotRunner(ctx, W);
    } else {
      renderPandesalBike(ctx, W);
    }

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

  // ---------- 3D PERSPECTIVE PASIG RIVER BALOT RUNNER (TEMPLE RUN / SUBWAY SURFERS!) ----------
  function projectLane(laneVal, z, W) {
    const horizonY = 192;
    const playerY = 515;
    const p = Math.pow(Math.max(0.01, z), 1.65);
    const y = horizonY + p * (playerY - horizonY);
    const roadHalfW = 24 + p * (Math.min(W * 0.44, 210));
    const laneOffset = (laneVal - 1) * (roadHalfW * 0.66);
    const scale = 0.14 + p * 0.96;
    return { x: W / 2 + laneOffset, y, scale, roadHalfW };
  }

  function renderBalotRunner(ctx, W) {
    const horizonY = 192;
    // 1. Twilight Manila / Pasig River Sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, '#0f172a');
    sky.addColorStop(0.55, '#312e81');
    sky.addColorStop(1, '#ea580c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizonY + 10);

    // Moon & Manila Skyline
    ctx.fillStyle = '#fef08a';
    ctx.beginPath(); ctx.arc(W * 0.78, 66, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    for (let i = 0; i < 10; i++) {
      const bx = i * (W / 9);
      const bh = 38 + ((i * 29) % 52);
      ctx.fillRect(bx, horizonY - bh, W / 9 - 4, bh + 6);
    }

    // 2. Left Bank = Shimmering Pasig River Water! Right Bank = Manila Esplanade Trees!
    const water = ctx.createLinearGradient(0, horizonY, 0, H);
    water.addColorStop(0, '#0369a1');
    water.addColorStop(1, '#0f766e');
    ctx.fillStyle = water;
    ctx.fillRect(0, horizonY, W / 2, H - horizonY);
    ctx.fillStyle = '#14532d';
    ctx.fillRect(W / 2, horizonY, W / 2, H - horizonY);

    // Water sparkles rushing toward camera
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    for (let i = 0; i < 8; i++) {
      const z = ((i / 8) + (time * bSpeed * 0.5)) % 1;
      const pr = projectLane(0, z, W);
      ctx.fillRect(pr.x - pr.roadHalfW - 45 * pr.scale, pr.y, 40 * pr.scale, 3.5 * pr.scale);
    }

    // 3. 3-Lane Pasig Riverbank Stone Promenade (Trapezoid Perspective!)
    const topHalf = 26;
    const botHalf = Math.min(W * 0.48, 240);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(W / 2 - topHalf, horizonY);
    ctx.lineTo(W / 2 + topHalf, horizonY);
    ctx.lineTo(W / 2 + botHalf, H);
    ctx.lineTo(W / 2 - botHalf, H);
    ctx.closePath();
    ctx.fill();

    // Glowing yellow-black curb rails
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(W / 2 - topHalf, horizonY); ctx.lineTo(W / 2 - botHalf, H);
    ctx.moveTo(W / 2 + topHalf, horizonY); ctx.lineTo(W / 2 + botHalf, H);
    ctx.stroke();

    // 3-Lane perspective dashed dividers
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 2.5;
    [-0.33, 0.33].forEach((f) => {
      ctx.beginPath();
      ctx.moveTo(W / 2 + topHalf * f, horizonY);
      ctx.lineTo(W / 2 + botHalf * f, H);
      ctx.stroke();
    });

    // Rushing streetlamp posts along the right promenade edge!
    for (let i = 0; i < 6; i++) {
      const z = ((i / 6) + (time * bSpeed * 0.65)) % 1;
      const pr = projectLane(2, z, W);
      const lx = W / 2 + pr.roadHalfW + 18 * pr.scale;
      const lh = 96 * pr.scale;
      ctx.fillStyle = '#475569';
      ctx.fillRect(lx - 2 * pr.scale, pr.y - lh, 4 * pr.scale, lh);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(lx, pr.y - lh, 7 * pr.scale, 0, Math.PI * 2); ctx.fill();
    }

    // 4. Depth-Sorted Obstacles & Collectibles (Far z -> Near z)
    const sorted = [...bObjects].filter((o) => !o.hit && o.z > 0.01).sort((a, b) => a.z - b.z);
    for (const obj of sorted) {
      const pr = projectLane(obj.lane, obj.z, W);
      drawBalotWorldObject(ctx, obj, pr.x, pr.y, pr.scale);
    }

    // 5. The Balot Vendor Running Forward (3D Back/Three-Quarter View!)
    const pProj = projectLane(bLaneX, 0.96, W);
    drawBalotVendorSprite(ctx, pProj.x, pProj.y - bJumpY * 0.68, pProj.scale);

    // 6. The Chasing Askal Dog Right Behind!
    const dogZ = bDogClose >= 1 ? 1.07 : 1.16;
    const dProj = projectLane(bLaneX, dogZ, W);
    drawChasingDog(ctx, dProj.x, Math.min(H - 12, dProj.y + (bDogClose >= 1 ? 0 : 22)), bDogClose >= 1 ? 1.08 : 0.92);
  }

  function drawBalotWorldObject(ctx, obj, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;

    if (obj.kind === 'egg') {
      ctx.fillStyle = 'rgba(253,224,71,0.35)';
      ctx.beginPath(); ctx.arc(0, -18, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath(); ctx.ellipse(0, -18, 12, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b45309'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('BALOT', 0, -15);
    } else if (obj.kind === 'coin') {
      ctx.fillStyle = '#facc15'; ctx.strokeStyle = '#92400e';
      ctx.beginPath(); ctx.arc(0, -16, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#92400e'; ctx.font = 'bold 14px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('₱', 0, -11);
    } else if (obj.kind === 'chili') {
      ctx.fillStyle = 'rgba(249,115,22,0.4)';
      ctx.beginPath(); ctx.arc(0, -18, 22, 0, Math.PI * 2); ctx.fill();
      ctx.font = '26px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('🌶️', 0, -10);
    } else if (obj.kind === 'barrier') {
      // Jumpable Low Road Barrier!
      ctx.fillStyle = '#f97316';
      roundRect(ctx, -36, -28, 72, 24, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-26, -24, 14, 16); ctx.fillRect(12, -24, 14, 16);
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('JUMP!', 0, -32);
    } else if (obj.kind === 'tricycle') {
      // Tall Parked Tricycle (Switch Lanes!)
      ctx.fillStyle = '#10b981';
      roundRect(ctx, -38, -68, 76, 62, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#facc15';
      roundRect(ctx, -40, -72, 80, 14, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#0f172a';
      roundRect(ctx, -26, -54, 52, 26, 4); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('TODA', 0, -14);
    } else {
      // Fishball Street Cart!
      ctx.fillStyle = '#b45309';
      roundRect(ctx, -36, -56, 72, 50, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ef4444';
      roundRect(ctx, -40, -68, 80, 16, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('FISHBALL', 0, -30);
    }
    ctx.restore();
  }

  function drawBalotVendorSprite(ctx, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    const step = Math.sin(time * 18);
    const bob = bJumpY > 0 ? 0 : Math.abs(step) * -5;

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath(); ctx.ellipse(0, 4 + bJumpY * 0.5, 22, 6, 0, 0, Math.PI * 2); ctx.fill();

    ctx.translate(0, bob);
    // Running Legs
    ctx.fillStyle = customLook.bottom === 'maong' ? '#2563eb' : '#18181b';
    ctx.strokeStyle = INK; ctx.lineWidth = 2.6;
    roundRect(ctx, -14, -22 + step * 5, 11, 20, 4); ctx.fill(); ctx.stroke();
    roundRect(ctx, 3, -22 - step * 5, 11, 20, 4); ctx.fill(); ctx.stroke();

    // Torso (respects customizer top!)
    ctx.fillStyle = customLook.top === 'jersey' ? '#facc15' : customLook.top === 'manong' ? '#ffffff' : customLook.top === 'red' ? '#dc2626' : '#f97316';
    roundRect(ctx, -18, -50, 36, 30, 8); ctx.fill(); ctx.stroke();

    // Woven BALOT Basket held on hip!
    ctx.fillStyle = '#d97706';
    roundRect(ctx, 12, -40, 26, 20, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath(); ctx.arc(20, -40, 5, 0, Math.PI * 2); ctx.arc(28, -40, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Head + Red Vendor Cap
    ctx.fillStyle = customLook.skin === 'deep' ? '#c98856' : '#f5be93';
    ctx.beginPath(); ctx.arc(0, -64, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(0, -68, 16.5, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Little floating "BALOT!" callout when boosting
    if (bBoostTimer > 0) {
      ctx.fillStyle = '#fde047'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🌶️ TURBO BALOT!', 0, -90);
    }
    ctx.restore();
  }

  function drawChasingDog(ctx, x, y, sc) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sc, sc);
    const gallop = Math.sin(time * 22) * 5;
    ctx.translate(0, gallop);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    // Playful brown Philippine Askal Dog!
    ctx.fillStyle = '#b45309';
    ctx.beginPath(); ctx.ellipse(0, -18, 20, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Floppy ears + head
    ctx.fillStyle = '#d97706';
    ctx.beginPath(); ctx.arc(0, -32, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.beginPath(); ctx.ellipse(-13, -30, 5, 9, 0.3, 0, Math.PI * 2); ctx.ellipse(13, -30, 5, 9, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Eyes + barking tongue!
    ctx.fillStyle = '#111827';
    ctx.beginPath(); ctx.arc(-4.5, -34, 2.2, 0, Math.PI * 2); ctx.arc(4.5, -34, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.ellipse(0, -25, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    if (bDogClose >= 1) {
      ctx.fillStyle = '#fef08a'; ctx.font = 'bold 12px Fredoka, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('AW! AW!', 0, -52);
    }
    ctx.restore();
  }

  // ---------- MALUNGGAY PANDESAL NI KUYA TISOY (MORNING BARANGAY BIKE DELIVERY!) ----------
  function renderPandesalBike(ctx, W) {
    const roadY = 475;
    const bikeScreenX = W < 520 ? W * 0.34 : 210;

    // 1. Warm Golden Morning Philippine Sky!
    const sky = ctx.createLinearGradient(0, 0, 0, roadY);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.5, '#7dd3fc');
    sky.addColorStop(0.85, '#fef08a');
    sky.addColorStop(1, '#fed7aa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, roadY);

    // Rising Morning Sun
    const sunG = ctx.createRadialGradient(W - 110, 95, 10, W - 110, 95, 85);
    sunG.addColorStop(0, '#fef9c3'); sunG.addColorStop(0.5, 'rgba(253,224,71,0.5)'); sunG.addColorStop(1, 'rgba(253,224,71,0)');
    ctx.fillStyle = sunG;
    ctx.beginPath(); ctx.arc(W - 110, 95, 85, 0, Math.PI * 2); ctx.fill();

    // 2. Neighborhood Barangay Houses along the Street!
    for (const h of pHouses) {
      const hx = bikeScreenX + (h.dist - pDist);
      if (hx < -220 || hx > W + 240) continue;
      drawBarangayHouse(ctx, hx, roadY, h);
    }

    // 3. Barangay Concrete Street
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, roadY, W, 16);
    ctx.fillStyle = '#475569'; ctx.fillRect(0, roadY + 16, W, H - roadY - 16);
    ctx.fillStyle = '#f8fafc';
    for (let lx = -((pDist) % 80); lx < W + 80; lx += 80) {
      ctx.fillRect(lx, roadY + 62, 40, 6);
    }

    // 4. Kuya Tisoy on his Classic Pandesal Bicycle (with Wooden Back Box!)
    drawKuyaTisoyBike(ctx, bikeScreenX, roadY + 34);
  }

  function drawBarangayHouse(ctx, cx, roadY, h) {
    ctx.save();
    const w = 185;
    const hH = 175;
    const x = cx - w / 2;
    const y = roadY - hH;

    // Glowing Green STOP & SELL Zone on Street when house shouts "PANDESAL!"
    if (h.wantsPandesal && !h.sold && !h.missed) {
      ctx.fillStyle = `rgba(16, 185, 129, ${0.26 + Math.sin(time * 8) * 0.12})`;
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
    ctx.fillStyle = h.color; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    roundRect(ctx, x, y + 36, w, hH - 36, 8); ctx.fill(); ctx.stroke();

    // Pitched Filipino Roof
    ctx.fillStyle = h.roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 42);
    ctx.lineTo(cx, y - 6);
    ctx.lineTo(x + w + 12, y + 42);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Windows & Front Gate Door
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 20, y + 66, 44, 42); ctx.strokeRect(x + 20, y + 66, 44, 42);
    ctx.fillStyle = '#78350f';
    roundRect(ctx, cx - 22, y + 96, 44, 79, 8); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + w - 64, y + 66, 44, 42); ctx.strokeRect(x + w - 64, y + 66, 44, 42);

    // Neighbor popping out & Shouting "PANDESAL!"
    if (h.wantsPandesal) {
      const wave = Math.sin(time * 10) * 4;
      const ny = roadY - 20;
      ctx.fillStyle = h.sold ? '#10b981' : '#ec4899';
      roundRect(ctx, cx + 28, ny - 22, 18, 22, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f5be93';
      ctx.beginPath(); ctx.arc(cx + 37, ny - 32, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#18181b';
      ctx.beginPath(); ctx.arc(cx + 37, ny - 35, 11, Math.PI, 0); ctx.fill();

      // Big Shout Speech Bubble!
      if (!h.sold && !h.missed) {
        const pulse = 1 + Math.sin(time * 9) * 0.05;
        ctx.save();
        ctx.translate(cx + 22, y + 18 + wave);
        ctx.scale(pulse, pulse);
        ctx.fillStyle = '#fef08a'; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
        roundRect(ctx, -74, -26, 148, 44, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#dc2626'; ctx.font = 'bold 14px Fredoka, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('📣 "PANDESAL!"', 0, -6);
        ctx.fillStyle = '#111827'; ctx.font = 'bold 11.5px Nunito, sans-serif';
        ctx.fillText(`x${h.qty} pcs · ₱${h.qty * 2}`, 0, 11);
        ctx.restore();
      } else if (h.sold) {
        ctx.fillStyle = '#dcfce7'; ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5;
        roundRect(ctx, cx - 50, y + 6, 100, 28, 9); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 11.5px Fredoka, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('✓ SALAMAT!', cx, y + 24);
      }
    }
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

    // Bicycle Spinning Wheels (Rear & Front!)
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

    // ---- WOODEN PANDESAL BOX ON THE BACK OF THE BIKE! ----
    ctx.fillStyle = '#b45309'; ctx.strokeStyle = INK; ctx.lineWidth = 2.8;
    roundRect(ctx, -64, -44, 44, 32, 5); ctx.fill(); ctx.stroke();
    // Wooden slats
    ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-62, -33); ctx.lineTo(-22, -33); ctx.moveTo(-62, -23); ctx.lineTo(-22, -23); ctx.stroke();
    // Golden Malunggay Pandesal Rolls peeking out top of the box!
    ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = INK; ctx.lineWidth = 2;
    [-53, -42, -31].forEach((bx) => {
      ctx.beginPath(); ctx.ellipse(bx, -45, 7, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      // Tiny green malunggay leaf flecks!
      ctx.fillStyle = '#16a34a'; ctx.fillRect(bx - 2, -46, 2.5, 2);
      ctx.fillStyle = '#f59e0b';
    });
    // Box label ("₱2")
    ctx.fillStyle = '#fef08a'; ctx.font = 'bold 9px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('PANDESAL ₱2', -42, -25);

    // ---- KUYA TISOY RIDING THE BIKE! ----
    // Pedaling leg
    ctx.fillStyle = '#18181b'; ctx.strokeStyle = INK; ctx.lineWidth = 2.4;
    roundRect(ctx, -8, -18, 11, 20, 4); ctx.fill(); ctx.stroke();
    // White shirt + apron
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, -14, -48, 24, 30, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-10, -34, 18, 16);
    // Arm on handlebar
    ctx.strokeStyle = '#f5be93'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(4, -40); ctx.lineTo(24, -41); ctx.stroke();
    // Chibi Head + Classic Newsboy/Baker Cap!
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
    start,
    stop,
    setPaused,
    balotMoveLane,
    balotJump,
    pandesalShout,
    update,
    render,
    isActive: () => active,
    getSubMode: () => subMode
  };
})();
