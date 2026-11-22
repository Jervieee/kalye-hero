// KALYE HERO — Mario-Inspired PH Street Action Platformer Engine
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // DOM References
  const hud = document.getElementById('hud');
  const hudHearts = document.getElementById('hudHearts');
  const hudEnergyFill = document.getElementById('hudEnergyFill');
  const hudEnergyText = document.getElementById('hudEnergyText');
  const weaponBadge = document.getElementById('weaponBadge');
  const weaponIcon = document.getElementById('weaponIcon');
  const weaponName = document.getElementById('weaponName');
  const weaponAmmo = document.getElementById('weaponAmmo');
  const hudStage = document.getElementById('hudStage');
  const hudProgress = document.getElementById('hudProgress');
  const hudCoins = document.getElementById('hudCoins');
  const hudScore = document.getElementById('hudScore');
  const bossBar = document.getElementById('bossBar');
  const bossFill = document.getElementById('bossFill');
  const toastBanner = document.getElementById('toastBanner');

  const titleOverlay = document.getElementById('titleOverlay');
  const howToOverlay = document.getElementById('howToOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const stageClearOverlay = document.getElementById('stageClearOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const touchControls = document.getElementById('touchControls');
  const titleHighScore = document.getElementById('titleHighScore');

  const STORAGE_KEY = 'kalye_hero_high_score_v1';

  // Physics Constants
  const GRAVITY = 1760;
  const MAX_FALL = 880;
  const MOVE_ACCEL = 2200;
  const MOVE_FRICTION = 1850;
  const MAX_SPEED = 315;
  const JUMP_VEL = -675;
  const BOUNCE_VEL = -830;
  const PUNCH_COST = 22;

  // Game State
  let mode = 'title'; // title | playing | paused | clear | gameover
  let selectedStage = 0;
  let currentStageIndex = 0;
  let level = null;
  let score = 0;
  let coins = 0;
  let thievesDefeated = 0;
  let highScore = 0;
  try {
    highScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
  } catch (_) {}
  let camX = 0;
  let worldTime = 0;
  let shakeTimer = 0;
  let shakeMag = 0;
  let hitStop = 0;
  let toastTimer = 0;
  let goalCleared = false;

  // Dynamic Entities
  let player = null;
  let platforms = [];
  let blocks = [];
  let pickups = [];
  let enemies = [];
  let bullets = [];
  let enemyProjectiles = [];
  let particles = [];
  let floatTexts = [];

  // Input State
  const keys = {
    left: false,
    right: false,
    jump: false,
    jumpPressed: false,
    punchPressed: false,
    shootPressed: false
  };

  function updateHighScoreUI() {
    if (score > highScore) {
      highScore = score;
      try {
        localStorage.setItem(STORAGE_KEY, String(highScore));
      } catch (_) {}
    }
    titleHighScore.textContent = String(highScore).padStart(5, '0');
  }
  updateHighScoreUI();

  function showToast(msg, duration = 2.0) {
    toastBanner.textContent = msg;
    toastBanner.classList.remove('hidden');
    toastTimer = duration;
  }

  function addShake(mag = 6, dur = 0.16) {
    shakeMag = Math.max(shakeMag, mag);
    shakeTimer = Math.max(shakeTimer, dur);
  }

  function addFloatText(x, y, text, color = '#fde047', size = 18) {
    floatTexts.push({ x, y, vy: -75, text, color, size, life: 0.9, maxLife: 0.9 });
  }

  function spawnParticles(x, y, color, count = 10, speed = 220) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.35 + Math.random() * 0.85) * speed;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 60,
        size: 3 + Math.random() * 5,
        color,
        life: 0.35 + Math.random() * 0.35,
        maxLife: 0.7
      });
    }
  }

  function createPlayer(keepGear = false) {
    const prevWeapon = keepGear && player ? player.weapon : null;
    const prevAmmo = keepGear && player ? player.ammo : 0;
    const prevHp = keepGear && player ? Math.max(3, player.hp) : 5;
    return {
      x: 80,
      y: Levels.GROUND_Y - 58,
      w: 34,
      h: 56,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: false,
      coyoteTimer: 0,
      jumpBuffer: 0,
      hp: prevHp,
      maxHp: 5,
      energy: 100,
      maxEnergy: 100,
      weapon: prevWeapon, // null | 'pistol' | 'blaster'
      ammo: prevAmmo,
      punchTimer: 0,
      punchDuration: 0.22,
      punchCooldown: 0,
      punchHitSet: new Set(),
      shootCooldown: 0,
      shootFlashTimer: 0,
      invulnTimer: 0,
      noEnergyHintCooldown: 0
    };
  }

  function spawnEnemyInstance(def) {
    const isBoss = def.type === 'boss';
    const isThug = def.type === 'thug';
    const isRunner = def.type === 'runner';
    const maxHp = isBoss ? 16 : isThug ? 2 : 1;
    return {
      x: def.x,
      y: def.y,
      w: isBoss ? 56 : isThug ? 40 : 34,
      h: isBoss ? 84 : isThug ? 58 : 52,
      vx: isRunner ? -155 : isBoss ? -120 : -85,
      vy: 0,
      facing: -1,
      type: def.type,
      hp: maxHp,
      maxHp,
      onGround: false,
      dead: false,
      deathTimer: 0,
      deathSpin: 0,
      hurtFlash: 0,
      aiTimer: 1 + Math.random() * 1.4,
      bossJumpTimer: 2.2,
      arenaMinX: def.arenaMinX || 0,
      arenaMaxX: def.arenaMaxX || 99999,
      seed: Math.random() * 10
    };
  }

  function loadStage(index, keepGear = false) {
    currentStageIndex = index;
    level = Levels.load(index);
    player = createPlayer(keepGear);
    platforms = level.platforms.map((p) => ({ ...p }));
    blocks = level.blocks.map((b) => ({ ...b, used: false, broken: false, bumpTimer: 0 }));
    pickups = level.pickups.map((item) => ({
      x: item.x,
      y: item.y,
      w: 28,
      h: 28,
      vx: 0,
      vy: 0,
      type: item.type,
      fromBlock: false,
      collected: false
    }));
    enemies = level.enemies.map(spawnEnemyInstance);
    bullets = [];
    enemyProjectiles = [];
    particles = [];
    floatTexts = [];
    camX = 0;
    goalCleared = false;
    bossBar.classList.add('hidden');
    hudStage.textContent = level.name;
    updateHUD();

    if (index === 0) {
      showToast('⚡ Punch Thieves [J] · Crack [?] Boxes for Guns!', 3.0);
    } else if (index === 1) {
      showToast('🌇 Divisoria Rush! Watch out for Bottle-Throwing Thugs!', 2.8);
    } else {
      showToast('🌙 Midnight Showdown! Defeat Boss Mandurukot!', 2.8);
    }
  }

  function startGame(stageIdx = selectedStage) {
    SoundFX.unlock();
    score = 0;
    coins = 0;
    thievesDefeated = 0;
    loadStage(stageIdx, false);
    mode = 'playing';
    hideAllOverlays();
    hud.classList.remove('hidden');
    SoundFX.startBGM();
  }

  function hideAllOverlays() {
    titleOverlay.classList.add('hidden');
    howToOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    stageClearOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
  }

  function updateHUD() {
    if (!player) return;
    // Hearts
    let heartsStr = '';
    for (let i = 0; i < player.maxHp; i++) {
      heartsStr += i < player.hp ? '❤️' : '🖤';
    }
    hudHearts.textContent = heartsStr;

    // Punch Energy Bar
    const pct = Math.max(0, Math.min(100, Math.round((player.energy / player.maxEnergy) * 100)));
    hudEnergyFill.style.width = `${pct}%`;
    hudEnergyFill.classList.toggle('low', player.energy < PUNCH_COST);
    hudEnergyText.textContent = `${pct}`;

    // Weapon Badge
    if (player.weapon && player.ammo > 0) {
      weaponBadge.classList.add('armed');
      if (player.weapon === 'pistol') {
        weaponIcon.textContent = '🔫';
        weaponName.textContent = 'STREET PISTOL';
      } else {
        weaponIcon.textContent = '💥';
        weaponName.textContent = 'SPREAD BLASTER';
      }
      weaponAmmo.textContent = `AMMO: ${player.ammo}`;
    } else {
      weaponBadge.classList.remove('armed');
      weaponIcon.textContent = '✊';
      weaponName.textContent = 'FISTS ONLY';
      weaponAmmo.textContent = 'Find a [?] Gun Box!';
    }

    // Coins & Score
    hudCoins.textContent = String(coins);
    hudScore.textContent = String(score).padStart(5, '0');

    // Stage progress
    if (level) {
      const prog = Math.max(0, Math.min(100, (player.x / level.goalX) * 100));
      hudProgress.style.width = `${prog}%`;
    }
  }

  function rectOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function spawnBlockReward(block) {
    const reward = block.reward || 'coin';
    if (reward === 'coin') {
      coins += 1;
      score += 100;
      SoundFX.coin();
      addFloatText(block.x + 22, block.y - 10, '+₱100', '#fde047', 17);
      spawnParticles(block.x + 22, block.y, '#facc15', 10, 180);
      return;
    }

    SoundFX.powerup();
    pickups.push({
      x: block.x + 8,
      y: block.y - 34,
      w: 28,
      h: 28,
      vx: reward === 'gun' || reward === 'blaster' ? 40 : 0,
      vy: -240,
      type: reward,
      fromBlock: true,
      collected: false
    });
    spawnParticles(block.x + 22, block.y - 8, '#fef08a', 12, 180);
  }

  function breakCrate(block) {
    if (block.broken) return;
    block.broken = true;
    score += 50;
    SoundFX.crateBreak();
    addShake(4, 0.1);
    spawnParticles(block.x + 22, block.y + 22, '#b45309', 14, 240);
    spawnParticles(block.x + 22, block.y + 22, '#f59e0b', 6, 180);
    // 45% chance crate hides bonus coin or energy drink!
    if (Math.random() < 0.45) {
      pickups.push({
        x: block.x + 8,
        y: block.y + 6,
        w: 28,
        h: 28,
        vx: (Math.random() - 0.5) * 90,
        vy: -220,
        type: Math.random() < 0.45 ? 'energy' : 'coin',
        fromBlock: true,
        collected: false
      });
    }
  }

  function damagePlayer(amount = 1, knockDir = -1) {
    if (player.invulnTimer > 0 || mode !== 'playing') return;
    player.hp = Math.max(0, player.hp - amount);
    player.invulnTimer = 1.35;
    player.vx = knockDir * 240;
    player.vy = -340;
    SoundFX.hurt();
    addShake(8, 0.22);
    spawnParticles(player.x + player.w / 2, player.y + 26, '#ef4444', 14, 240);
    addFloatText(player.x + 16, player.y - 8, 'ARAY!', '#f87171', 19);
    updateHUD();

    if (player.hp <= 0) {
      triggerGameOver();
    }
  }

  function defeatOrDamageEnemy(e, dmg, knockDir, source = 'punch') {
    if (e.dead) return;
    e.hp -= dmg;
    e.hurtFlash = 0.14;
    e.vx = knockDir * (e.type === 'boss' ? 140 : 240);
    if (e.onGround && e.type !== 'boss') e.vy = -210;

    const comicWords = source === 'punch'
      ? ['PAK!', 'BOOGSH!', 'SUNTUK!', 'BAM!']
      : source === 'stomp'
      ? ['STOMP!', 'BONK!']
      : ['BLAM!', 'PEW!', 'POW!'];
    const word = comicWords[Math.floor(Math.random() * comicWords.length)];

    if (e.hp <= 0) {
      e.dead = true;
      e.deathTimer = 0.55;
      e.vy = -340;
      e.vx = knockDir * 210;
      thievesDefeated++;
      const pts = e.type === 'boss' ? 2000 : e.type === 'thug' ? 350 : 200;
      score += pts;
      SoundFX.enemyKO();
      addShake(e.type === 'boss' ? 12 : 5, e.type === 'boss' ? 0.35 : 0.12);
      hitStop = e.type === 'boss' ? 0.09 : 0.035;
      addFloatText(e.x + e.w / 2, e.y - 10, `${word} +${pts}`, '#fde047', e.type === 'boss' ? 24 : 18);
      spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#facc15', e.type === 'boss' ? 32 : 14, 260);
      spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#ef4444', 10, 200);

      // Thief drops stolen Peso Coins (and sometimes an Energy Drink!)
      const dropCount = e.type === 'boss' ? 8 : 2;
      for (let i = 0; i < dropCount; i++) {
        pickups.push({
          x: e.x + e.w / 2 - 12,
          y: e.y + 10,
          w: 28,
          h: 28,
          vx: (Math.random() - 0.5) * 210,
          vy: -250 - Math.random() * 140,
          type: i === 0 && Math.random() < 0.38 ? 'energy' : 'coin',
          fromBlock: true,
          collected: false
        });
      }

      if (e.type === 'boss') {
        bossBar.classList.add('hidden');
        showToast('🏆 BOSS MANDURUKOT DEFEATED! Grab the Barangay Flag!', 3.4);
      }
    } else {
      SoundFX.punchHit();
      addShake(4, 0.09);
      addFloatText(e.x + e.w / 2, e.y - 8, word, '#fb923c', 17);
      spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#fef08a', 9, 190);
    }
    updateHUD();
  }

  function triggerStageClear() {
    if (mode !== 'playing') return;
    goalCleared = true;
    mode = 'clear';
    score += 500 + player.hp * 100;
    updateHighScoreUI();
    SoundFX.stageClear();

    const isLast = currentStageIndex >= Levels.count - 1;
    document.getElementById('clearTitle').textContent = isLast
      ? '🏆 MANILA STREETS SAVED!'
      : '🏁 BARANGAY STAGE CLEAR!';
    document.getElementById('clearSubtitle').textContent = isLast
      ? 'You defeated Boss Mandurukot and protected the whole kalye!'
      : 'Thieves sent packing! Ready for the next street?';
    document.getElementById('clearStats').innerHTML = `
      <div><span>SCORE</span><strong>${String(score).padStart(5, '0')}</strong></div>
      <div><span>PESO COINS</span><strong>₱${coins}</strong></div>
      <div><span>THIEVES STOPPED</span><strong>${thievesDefeated}</strong></div>
      <div><span>HP BONUS</span><strong>+${player.hp * 100}</strong></div>
    `;
    const nextBtn = document.getElementById('btnNextStage');
    nextBtn.classList.toggle('hidden', isLast);
    stageClearOverlay.classList.remove('hidden');
  }

  function triggerGameOver() {
    mode = 'gameover';
    updateHighScoreUI();
    SoundFX.gameOver();
    document.getElementById('gameOverStats').innerHTML = `
      <div><span>FINAL SCORE</span><strong>${String(score).padStart(5, '0')}</strong></div>
      <div><span>PESO COINS</span><strong>₱${coins}</strong></div>
      <div><span>THIEVES STOPPED</span><strong>${thievesDefeated}</strong></div>
      <div><span>HIGH SCORE</span><strong>${String(highScore).padStart(5, '0')}</strong></div>
    `;
    gameOverOverlay.classList.remove('hidden');
  }

  // ==================== UPDATE LOOP ====================
  function update(dt) {
    worldTime += dt;

    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toastBanner.classList.add('hidden');
    }

    if (shakeTimer > 0) {
      shakeTimer -= dt;
      if (shakeTimer <= 0) shakeMag = 0;
    }

    if (mode !== 'playing') return;

    if (hitStop > 0) {
      hitStop -= dt;
      return;
    }

    updatePlayer(dt);
    updateBlocks(dt);
    updatePickups(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateEnemyProjectiles(dt);
    updateParticlesAndText(dt);

    // Smooth Mario-style horizontal camera follow
    const targetCam = Math.max(0, Math.min(level.width - W, player.x - W * 0.36));
    camX += (targetCam - camX) * Math.min(1, dt * 8.5);

    // Check Goal Flagpole!
    const activeBoss = enemies.find((e) => e.type === 'boss' && !e.dead);
    if (!goalCleared && player.x + player.w >= level.goalX - 18) {
      if (activeBoss) {
        // Must beat Boss Mandurukot first!
        player.x = level.goalX - player.w - 20;
        showToast('🦹 Defeat Boss Mandurukot before claiming the Flag!', 1.8);
      } else {
        triggerStageClear();
      }
    }

    updateHUD();
  }

  function updatePlayer(dt) {
    const p = player;

    if (p.invulnTimer > 0) p.invulnTimer -= dt;
    if (p.punchCooldown > 0) p.punchCooldown -= dt;
    if (p.shootCooldown > 0) p.shootCooldown -= dt;
    if (p.shootFlashTimer > 0) p.shootFlashTimer -= dt;
    if (p.noEnergyHintCooldown > 0) p.noEnergyHintCooldown -= dt;

    // Passive energy recharge (for punching!)
    if (p.punchTimer <= 0 && p.energy < p.maxEnergy) {
      p.energy = Math.min(p.maxEnergy, p.energy + 11 * dt);
    }

    // Horizontal movement
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (dir !== 0) {
      p.facing = dir;
      p.vx += dir * MOVE_ACCEL * dt;
      if (Math.abs(p.vx) > MAX_SPEED) p.vx = Math.sign(p.vx) * MAX_SPEED;
    } else {
      const decel = MOVE_FRICTION * dt;
      if (Math.abs(p.vx) <= decel) p.vx = 0;
      else p.vx -= Math.sign(p.vx) * decel;
    }

    // Coyote time + Jump buffer (authentic crisp Mario feel!)
    if (p.onGround) p.coyoteTimer = 0.11;
    else p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);

    if (keys.jumpPressed) {
      p.jumpBuffer = 0.12;
      keys.jumpPressed = false;
    } else {
      p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    }

    if (p.jumpBuffer > 0 && p.coyoteTimer > 0) {
      p.vy = JUMP_VEL;
      p.onGround = false;
      p.coyoteTimer = 0;
      p.jumpBuffer = 0;
      SoundFX.jump();
      spawnParticles(p.x + p.w / 2, p.y + p.h, '#e2e8f0', 6, 110);
    }

    // Variable jump height (release jump early for short hop)
    if (!keys.jump && p.vy < -260) {
      p.vy *= 0.88;
    }

    // PUNCH ACTION (Uses Energy!)
    if (keys.punchPressed) {
      keys.punchPressed = false;
      if (p.punchCooldown <= 0) {
        if (p.energy >= PUNCH_COST) {
          p.energy -= PUNCH_COST;
          p.punchTimer = p.punchDuration;
          p.punchCooldown = 0.27;
          p.punchHitSet.clear();
          p.vx += p.facing * 120;
          SoundFX.punchSwing();
          spawnParticles(
            p.facing > 0 ? p.x + p.w + 8 : p.x - 8,
            p.y + 28,
            '#fde047',
            7,
            150
          );
        } else if (p.noEnergyHintCooldown <= 0) {
          SoundFX.noEnergy();
          p.noEnergyHintCooldown = 0.9;
          addFloatText(p.x + 17, p.y - 10, 'LOW ⚡ ENERGY!', '#fb923c', 15);
        }
      }
    }

    // SHOOT ACTION (Requires Obtained Gun & Ammo!)
    if (keys.shootPressed) {
      keys.shootPressed = false;
      if (p.shootCooldown <= 0) {
        if (p.weapon && p.ammo > 0) {
          p.ammo--;
          p.shootFlashTimer = 0.09;
          const isBlaster = p.weapon === 'blaster';
          p.shootCooldown = isBlaster ? 0.3 : 0.19;
          SoundFX.shoot(isBlaster);

          const bx = p.facing > 0 ? p.x + p.w + 6 : p.x - 14;
          const by = p.y + 26;
          if (isBlaster) {
            [-110, 0, 110].forEach((vy) => {
              bullets.push({
                x: bx,
                y: by,
                w: 13,
                h: 9,
                vx: p.facing * 720,
                vy,
                dmg: 1,
                color: '#f97316',
                life: 0.72
              });
            });
            addShake(3, 0.07);
          } else {
            bullets.push({
              x: bx,
              y: by,
              w: 12,
              h: 7,
              vx: p.facing * 760,
              vy: 0,
              dmg: 1,
              color: '#38bdf8',
              life: 0.9
            });
          }

          if (p.ammo <= 0) {
            p.weapon = null;
            showToast('Ammo empty! Grab another [?] Gun Box or ⚡ Punch!', 2.2);
          }
        } else if (p.noEnergyHintCooldown <= 0) {
          SoundFX.noEnergy();
          p.noEnergyHintCooldown = 1.0;
          addFloatText(p.x + 17, p.y - 10, 'FIND A [?] GUN!', '#93c5fd', 15);
        }
      }
    }

    // Active Punch Hitbox Check (hits enemies & smashes crates!)
    if (p.punchTimer > 0) {
      p.punchTimer -= dt;
      const punchBox = {
        x: p.facing > 0 ? p.x + p.w - 4 : p.x - 42,
        y: p.y + 8,
        w: 46,
        h: 40
      };

      for (const e of enemies) {
        if (!e.dead && !p.punchHitSet.has(e) && rectOverlap(punchBox, e)) {
          p.punchHitSet.add(e);
          defeatOrDamageEnemy(e, 2, p.facing, 'punch');
        }
      }

      for (const b of blocks) {
        if (!b.broken && b.type === 'crate') {
          const bRect = { x: b.x, y: b.y, w: b.size, h: b.size };
          if (rectOverlap(punchBox, bRect)) {
            breakCrate(b);
          }
        }
      }
    }

    // Apply Gravity
    p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);

    // ---- HORIZONTAL MOVE & SOLID COLLISION ----
    p.x += p.vx * dt;
    if (p.x < 0) {
      p.x = 0;
      p.vx = 0;
    }
    if (p.x + p.w > level.width) {
      p.x = level.width - p.w;
      p.vx = 0;
    }

    // Solid blocks horizontal collision
    for (const b of blocks) {
      if (b.broken) continue;
      const bRect = { x: b.x, y: b.y, w: b.size, h: b.size };
      if (rectOverlap(p, bRect)) {
        if (p.vx > 0) p.x = b.x - p.w;
        else if (p.vx < 0) p.x = b.x + b.size;
        p.vx = 0;
      }
    }

    // Street ground solid walls horizontal collision
    for (const plat of platforms) {
      if (plat.style !== 'street') continue;
      if (rectOverlap(p, plat)) {
        if (p.vx > 0) p.x = plat.x - p.w;
        else if (p.vx < 0) p.x = plat.x + plat.w;
        p.vx = 0;
      }
    }

    // ---- VERTICAL MOVE & COLLISION ----
    const prevBottom = p.y + p.h;
    const prevTop = p.y;
    p.y += p.vy * dt;
    p.onGround = false;

    // Platform collisions (street = solid; jeepney/tricycle/awning/bridge = jump-through from below!)
    for (const plat of platforms) {
      if (p.x + p.w <= plat.x + 3 || p.x >= plat.x + plat.w - 3) continue;

      if (p.vy >= 0 && prevBottom <= plat.y + 12 && p.y + p.h >= plat.y) {
        p.y = plat.y - p.h;
        if (plat.bouncy) {
          p.vy = BOUNCE_VEL;
          p.onGround = false;
          SoundFX.bounce();
          addFloatText(p.x + 17, plat.y - 12, 'BOING!', '#fde047', 16);
          spawnParticles(p.x + p.w / 2, plat.y, '#fde047', 8, 150);
        } else {
          p.vy = 0;
          p.onGround = true;
        }
      }
    }

    // Solid ? blocks & crates vertical collision (with classic Mario head-bonk!)
    for (const b of blocks) {
      if (b.broken) continue;
      const bRect = { x: b.x, y: b.y, w: b.size, h: b.size };
      if (!rectOverlap(p, bRect)) continue;

      if (p.vy >= 0 && prevBottom <= b.y + 14) {
        p.y = b.y - p.h;
        p.vy = 0;
        p.onGround = true;
      } else if (p.vy < 0 && prevTop >= b.y + b.size - 16) {
        p.y = b.y + b.size;
        p.vy = 90;
        b.bumpTimer = 0.18;
        if (b.type === 'question' && !b.used) {
          b.used = true;
          SoundFX.blockBump();
          spawnBlockReward(b);
        } else if (b.type === 'crate') {
          breakCrate(b);
        } else {
          SoundFX.blockBump();
        }
      }
    }

    // Pitfall check (open drainage gap!)
    if (p.y > H + 70) {
      player.hp -= 1;
      SoundFX.hurt();
      addShake(8, 0.25);
      if (player.hp <= 0) {
        triggerGameOver();
      } else {
        // Respawn safely on nearest street segment to the left
        let safeX = Math.max(60, p.x - 190);
        for (const plat of platforms) {
          if (plat.style === 'street' && safeX >= plat.x && safeX <= plat.x + plat.w - 40) {
            break;
          }
          if (plat.style === 'street' && plat.x < p.x) {
            safeX = Math.min(plat.x + plat.w - 70, Math.max(plat.x + 30, p.x - 160));
          }
        }
        p.x = safeX;
        p.y = Levels.GROUND_Y - 120;
        p.vx = 0;
        p.vy = 0;
        p.invulnTimer = 1.6;
        showToast('Watch the open drainage! -1 Heart', 1.8);
      }
    }
  }

  function updateBlocks(dt) {
    for (const b of blocks) {
      if (b.bumpTimer > 0) b.bumpTimer = Math.max(0, b.bumpTimer - dt);
    }
  }

  function updatePickups(dt) {
    for (const item of pickups) {
      if (item.collected) continue;

      if (item.fromBlock) {
        item.vy = Math.min(MAX_FALL, item.vy + GRAVITY * 0.72 * dt);
        item.x += item.vx * dt;
        item.y += item.vy * dt;
        item.vx *= 0.985;

        // Rest on platforms or blocks
        for (const plat of platforms) {
          if (item.x + item.w > plat.x && item.x < plat.x + plat.w) {
            if (item.vy >= 0 && item.y + item.h >= plat.y && item.y + item.h <= plat.y + 26) {
              item.y = plat.y - item.h;
              item.vy = 0;
              item.vx *= 0.8;
            }
          }
        }
        for (const b of blocks) {
          if (b.broken) continue;
          if (item.x + item.w > b.x && item.x < b.x + b.size) {
            if (item.vy >= 0 && item.y + item.h >= b.y && item.y + item.h <= b.y + 20) {
              item.y = b.y - item.h;
              item.vy = 0;
              item.vx *= 0.8;
            }
          }
        }
      }

      if (rectOverlap(player, item)) {
        item.collected = true;
        if (item.type === 'coin') {
          coins += 1;
          score += 50;
          SoundFX.coin();
          spawnParticles(item.x + 14, item.y + 14, '#facc15', 7, 130);
          if (coins % 30 === 0 && player.hp < player.maxHp) {
            player.hp++;
            showToast('₱30 Coins Bonus! +1 Heart ❤️', 2.0);
          }
        } else if (item.type === 'energy') {
          player.energy = Math.min(player.maxEnergy, player.energy + 60);
          score += 120;
          SoundFX.energyDrink();
          addFloatText(player.x + 17, player.y - 12, '+⚡ PUNCH ENERGY!', '#fde047', 17);
          spawnParticles(item.x + 14, item.y + 14, '#fde047', 14, 190);
        } else if (item.type === 'gun') {
          if (player.weapon === 'blaster') {
            player.ammo += 8;
            showToast('💥 Spread Blaster Ammo +8!', 1.8);
          } else {
            player.weapon = 'pistol';
            player.ammo += 14;
            showToast('🔫 OBTAINED STREET PISTOL! Press [K] or [X] to Shoot!', 2.6);
          }
          score += 200;
          SoundFX.powerup();
          addFloatText(player.x + 17, player.y - 12, '🔫 GUN GET!', '#60a5fa', 18);
          spawnParticles(item.x + 14, item.y + 14, '#60a5fa', 16, 200);
        } else if (item.type === 'blaster') {
          player.weapon = 'blaster';
          player.ammo += 10;
          score += 300;
          SoundFX.powerup();
          showToast('💥 OBTAINED 3-WAY SPREAD BLASTER! Press [K] or [X]!', 2.6);
          addFloatText(player.x + 17, player.y - 12, '💥 SPREAD BLASTER!', '#f87171', 18);
          spawnParticles(item.x + 14, item.y + 14, '#ef4444', 18, 220);
        } else if (item.type === 'heart') {
          player.hp = Math.min(player.maxHp, player.hp + 1);
          score += 150;
          SoundFX.powerup();
          addFloatText(player.x + 17, player.y - 12, '+1 ❤️ HP', '#f43f5e', 18);
          spawnParticles(item.x + 14, item.y + 14, '#f43f5e', 14, 180);
        }
      }
    }
  }

  function updateBullets(dt) {
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;

      let hit = false;
      for (const e of enemies) {
        if (!e.dead && rectOverlap(b, e)) {
          defeatOrDamageEnemy(e, b.dmg, Math.sign(b.vx) || 1, 'gun');
          hit = true;
          break;
        }
      }

      if (!hit) {
        for (const blk of blocks) {
          if (blk.broken) continue;
          const bRect = { x: blk.x, y: blk.y, w: blk.size, h: blk.size };
          if (rectOverlap(b, bRect)) {
            if (blk.type === 'crate') breakCrate(blk);
            hit = true;
            break;
          }
        }
      }

      if (hit || b.life <= 0) {
        spawnParticles(b.x, b.y, b.color, 5, 130);
        bullets.splice(i, 1);
      }
    }
  }

  function updateEnemies(dt) {
    for (const e of enemies) {
      if (e.hurtFlash > 0) e.hurtFlash -= dt;

      if (e.dead) {
        e.deathTimer -= dt;
        e.vy += GRAVITY * dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.deathSpin += dt * 9;
        continue;
      }

      // Only activate enemies reasonably close to camera
      if (Math.abs(e.x - player.x) > W * 1.15 && e.type !== 'boss') continue;

      const dx = player.x - e.x;
      const dist = Math.abs(dx);

      if (e.type === 'boss') {
        if (player.x > 2240) {
          bossBar.classList.remove('hidden');
          bossFill.style.width = `${Math.max(0, (e.hp / e.maxHp) * 100)}%`;

          // Boss AI: chase, leap-slam, and toss loot-bombs!
          e.facing = dx >= 0 ? 1 : -1;
          const speed = e.hp <= 7 ? 175 : 130;
          e.vx += (e.facing * speed - e.vx) * Math.min(1, dt * 4);

          e.bossJumpTimer -= dt;
          if (e.bossJumpTimer <= 0 && e.onGround) {
            e.vy = -610;
            e.onGround = false;
            e.bossJumpTimer = e.hp <= 7 ? 1.8 : 2.6;
          }

          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && dist < 560) {
            e.aiTimer = e.hp <= 7 ? 1.65 : 2.3;
            enemyProjectiles.push({
              x: e.x + e.w / 2,
              y: e.y + 24,
              w: 18,
              h: 18,
              vx: e.facing * 310,
              vy: -240,
              kind: 'sack',
              life: 2.6
            });
          }
        } else {
          e.vx = 0;
        }
      } else if (e.type === 'runner') {
        if (dist < 420) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = e.facing * 170;
          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && e.onGround && dist < 240) {
            e.vy = -440;
            e.aiTimer = 1.6;
          }
        }
      } else if (e.type === 'thug') {
        if (dist < 430) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = dist > 180 ? e.facing * 65 : 0;
          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && dist < 410) {
            e.aiTimer = 2.4;
            enemyProjectiles.push({
              x: e.x + e.w / 2,
              y: e.y + 18,
              w: 14,
              h: 14,
              vx: e.facing * 265,
              vy: -220,
              kind: 'bottle',
              life: 2.4
            });
          }
        }
      } else {
        // Snatcher patrol + slight chase when close
        if (dist < 260 && Math.abs(player.y - e.y) < 80) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = e.facing * 118;
        } else {
          if (Math.abs(e.vx) < 30) e.vx = e.facing * 85;
          e.facing = Math.sign(e.vx) || -1;
        }
      }

      // Gravity & movement
      e.vy = Math.min(MAX_FALL, e.vy + GRAVITY * dt);
      const prevBottom = e.y + e.h;
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.onGround = false;

      // Boss arena bounds
      if (e.type === 'boss') {
        if (e.x < e.arenaMinX) { e.x = e.arenaMinX; e.vx = Math.abs(e.vx); }
        if (e.x + e.w > e.arenaMaxX) { e.x = e.arenaMaxX - e.w; e.vx = -Math.abs(e.vx); }
      }

      // Platform landing + edge patrol turnaround
      let standingPlat = null;
      for (const plat of platforms) {
        if (e.x + e.w > plat.x + 2 && e.x < plat.x + plat.w - 2) {
          if (e.vy >= 0 && prevBottom <= plat.y + 14 && e.y + e.h >= plat.y) {
            e.y = plat.y - e.h;
            e.vy = 0;
            e.onGround = true;
            standingPlat = plat;
          }
        }
      }

      if (standingPlat && e.type !== 'boss') {
        // Turn around cleanly at platform/street edges so thieves don't suicide into pits
        if (e.x <= standingPlat.x + 6 && e.vx < 0) {
          e.vx = Math.abs(e.vx);
          e.facing = 1;
        } else if (e.x + e.w >= standingPlat.x + standingPlat.w - 6 && e.vx > 0) {
          e.vx = -Math.abs(e.vx);
          e.facing = -1;
        }
      }

      // Remove if fell off map
      if (e.y > H + 120) {
        e.dead = true;
        e.deathTimer = 0;
        continue;
      }

      // Player <-> Enemy collision (Mario Stomp vs Damage!)
      if (rectOverlap(player, e)) {
        const playerFalling = player.vy > 40;
        const playerAbove = player.y + player.h - player.vy * dt <= e.y + 22;

        if (playerFalling && playerAbove) {
          // Classic Mario head-stomp!
          player.vy = -510;
          SoundFX.stomp();
          defeatOrDamageEnemy(e, e.type === 'boss' ? 2 : 2, player.facing, 'stomp');
        } else {
          const knockDir = player.x + player.w / 2 < e.x + e.w / 2 ? -1 : 1;
          damagePlayer(1, knockDir);
        }
      }
    }
  }

  function updateEnemyProjectiles(dt) {
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
      const pr = enemyProjectiles[i];
      pr.vy += GRAVITY * 0.55 * dt;
      pr.x += pr.vx * dt;
      pr.y += pr.vy * dt;
      pr.life -= dt;

      if (rectOverlap(player, pr)) {
        const knockDir = pr.vx >= 0 ? 1 : -1;
        damagePlayer(1, knockDir);
        spawnParticles(pr.x, pr.y, '#22c55e', 10, 170);
        enemyProjectiles.splice(i, 1);
        continue;
      }

      if (pr.y > Levels.GROUND_Y + 6 || pr.life <= 0) {
        spawnParticles(pr.x, Math.min(pr.y, Levels.GROUND_Y), pr.kind === 'bottle' ? '#22c55e' : '#d6b47c', 8, 140);
        enemyProjectiles.splice(i, 1);
      }
    }
  }

  function updateParticlesAndText(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.vy += 650 * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
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
  }

  // ==================== RENDER LOOP ====================
  function render() {
    ctx.clearRect(0, 0, W, H);
    if (!level) {
      Sprites.drawBackground(ctx, W, H, worldTime * 28, 'day', worldTime);
      return;
    }

    ctx.save();
    if (shakeTimer > 0 && shakeMag > 0) {
      const sx = (Math.random() - 0.5) * shakeMag * 2;
      const sy = (Math.random() - 0.5) * shakeMag * 2;
      ctx.translate(sx, sy);
    }

    // 1. PH Streets Multi-Layer Parallax Background
    Sprites.drawBackground(ctx, W, H, camX, level.theme, worldTime);

    // 2. World Space Entities
    ctx.save();
    ctx.translate(-Math.round(camX), 0);

    // Platforms (Streets, Jeepneys, Tricycles, Footbridges, Awnings)
    for (const plat of platforms) {
      if (plat.x + plat.w < camX - 60 || plat.x > camX + W + 60) continue;
      Sprites.drawPlatform(ctx, plat);
    }

    // Barangay Goal Flagpole
    Sprites.drawGoalFlag(ctx, level.goalX, Levels.GROUND_Y, worldTime, goalCleared);

    // ? Blocks & Wooden Crates
    for (const b of blocks) {
      if (b.broken) continue;
      if (b.x + b.size < camX - 40 || b.x > camX + W + 40) continue;
      Sprites.drawBlock(ctx, b, worldTime);
    }

    // Pickups (Peso Coins, Energy Drinks, Guns, Hearts)
    for (const item of pickups) {
      if (item.collected) continue;
      if (item.x + item.w < camX - 40 || item.x > camX + W + 40) continue;
      Sprites.drawPickup(ctx, item, worldTime);
    }

    // Thief Enemies
    for (const e of enemies) {
      if (e.dead && e.deathTimer <= 0) continue;
      if (e.x + e.w < camX - 90 || e.x > camX + W + 90) continue;
      Sprites.drawEnemy(ctx, e, worldTime);
    }

    // Hero Chibi Man (Black Shirt & Maong Pants!)
    Sprites.drawHero(ctx, player, worldTime);

    // Player Bullets
    for (const b of bullets) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(b.x + b.w / 2, b.y + b.h / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Enemy Projectiles (Bottles / Loot Sacks)
    for (const pr of enemyProjectiles) {
      ctx.save();
      ctx.translate(pr.x + pr.w / 2, pr.y + pr.h / 2);
      ctx.rotate(worldTime * 11);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2.2;
      if (pr.kind === 'bottle') {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-4, -9, 8, 18);
        ctx.strokeRect(-4, -9, 8, 18);
      } else {
        ctx.fillStyle = '#d6b47c';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 11px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('₱', 0, 1);
      }
      ctx.restore();
    }

    // Particles
    for (const pt of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.4;
      ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      ctx.strokeRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
      ctx.restore();
    }

    // Comic Popups & Floating Score Text
    for (const ft of floatTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = `700 ${ft.size}px Fredoka, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#111827';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
  }

  // ==================== INPUT & UI BINDINGS ====================
  window.addEventListener('keydown', (e) => {
    const code = e.code;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(code)) {
      e.preventDefault();
    }

    if (code === 'KeyA' || code === 'ArrowLeft') keys.left = true;
    if (code === 'KeyD' || code === 'ArrowRight') keys.right = true;

    if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') {
      if (!keys.jump) keys.jumpPressed = true;
      keys.jump = true;
    }

    if (code === 'KeyJ' || code === 'KeyZ' || code === 'KeyF') {
      if (!e.repeat) keys.punchPressed = true;
    }

    if (code === 'KeyK' || code === 'KeyX' || code === 'KeyG') {
      if (!e.repeat) keys.shootPressed = true;
    }

    if ((code === 'KeyP' || code === 'Escape') && !e.repeat) {
      if (mode === 'playing') {
        mode = 'paused';
        pauseOverlay.classList.remove('hidden');
      } else if (mode === 'paused') {
        mode = 'playing';
        pauseOverlay.classList.add('hidden');
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const code = e.code;
    if (code === 'KeyA' || code === 'ArrowLeft') keys.left = false;
    if (code === 'KeyD' || code === 'ArrowRight') keys.right = false;
    if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') keys.jump = false;
  });

  // Stage selection pills
  document.querySelectorAll('.stage-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stage-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStage = Number(btn.dataset.stage || 0);
    });
  });

  document.getElementById('btnStart').addEventListener('click', () => startGame(selectedStage));
  document.getElementById('btnHowTo').addEventListener('click', () => howToOverlay.classList.remove('hidden'));
  document.getElementById('btnCloseHowTo').addEventListener('click', () => howToOverlay.classList.add('hidden'));

  document.getElementById('btnPause').addEventListener('click', () => {
    if (mode === 'playing') {
      mode = 'paused';
      pauseOverlay.classList.remove('hidden');
    }
  });

  document.getElementById('btnResume').addEventListener('click', () => {
    if (mode === 'paused') {
      mode = 'playing';
      pauseOverlay.classList.add('hidden');
    }
  });

  document.getElementById('btnRestartPause').addEventListener('click', () => {
    loadStage(currentStageIndex, false);
    mode = 'playing';
    hideAllOverlays();
    SoundFX.startBGM();
  });

  function returnToTitle() {
    SoundFX.stopBGM();
    mode = 'title';
    hideAllOverlays();
    hud.classList.add('hidden');
    bossBar.classList.add('hidden');
    toastBanner.classList.add('hidden');
    titleOverlay.classList.remove('hidden');
    updateHighScoreUI();
  }

  document.getElementById('btnQuitTitle').addEventListener('click', returnToTitle);
  document.getElementById('btnMenuClear').addEventListener('click', returnToTitle);
  document.getElementById('btnMenuOver').addEventListener('click', returnToTitle);

  document.getElementById('btnNextStage').addEventListener('click', () => {
    if (currentStageIndex + 1 < Levels.count) {
      loadStage(currentStageIndex + 1, true);
      mode = 'playing';
      hideAllOverlays();
      SoundFX.startBGM();
    }
  });

  document.getElementById('btnReplayClear').addEventListener('click', () => {
    loadStage(currentStageIndex, false);
    mode = 'playing';
    hideAllOverlays();
    SoundFX.startBGM();
  });

  document.getElementById('btnRetry').addEventListener('click', () => {
    loadStage(currentStageIndex, false);
    mode = 'playing';
    hideAllOverlays();
    SoundFX.startBGM();
  });

  const btnSound = document.getElementById('btnSound');
  btnSound.addEventListener('click', () => {
    SoundFX.unlock();
    const muted = SoundFX.toggleMute();
    btnSound.textContent = muted ? '🔇' : '🔊';
  });

  // Touch Controls Toggle + Multi-touch Handlers
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    touchControls.classList.remove('hidden');
  }
  document.getElementById('btnToggleTouch').addEventListener('click', () => {
    touchControls.classList.toggle('hidden');
  });

  touchControls.querySelectorAll('.touch-btn').forEach((btn) => {
    const action = btn.dataset.key;
    const press = (ev) => {
      ev.preventDefault();
      btn.classList.add('pressed');
      if (action === 'left') keys.left = true;
      if (action === 'right') keys.right = true;
      if (action === 'jump') {
        if (!keys.jump) keys.jumpPressed = true;
        keys.jump = true;
      }
      if (action === 'punch') keys.punchPressed = true;
      if (action === 'shoot') keys.shootPressed = true;
    };
    const release = (ev) => {
      ev.preventDefault();
      btn.classList.remove('pressed');
      if (action === 'left') keys.left = false;
      if (action === 'right') keys.right = false;
      if (action === 'jump') keys.jump = false;
    };
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('pointerleave', release);
  });

  // PWA Service Worker & Native App Install Prompt
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  let deferredInstallPrompt = null;
  const btnInstall = document.getElementById('btnInstall');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (btnInstall) btnInstall.classList.remove('hidden');
  });

  if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        btnInstall.classList.add('hidden');
        showToast('📲 Kalye Hero installed as an App!', 2.6);
      }
      deferredInstallPrompt = null;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (btnInstall) btnInstall.classList.add('hidden');
    deferredInstallPrompt = null;
  });

  // Main Animation Loop
  let lastTime = performance.now();
  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
