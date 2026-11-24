// KALYE HERO — Mario-Inspired PH Street Action Platformer Engine
(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width;
  const H = 630;

  let manualTouchOverride = null;
  function isMobileViewport() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 960 ||
      window.innerHeight <= 560
    );
  }

  function syncTouchControlsVisibility() {
    const showAny =
      mode === 'playing' &&
      activeGameMode !== 'karenderya' &&
      (manualTouchOverride !== null ? manualTouchOverride : isMobileViewport());
    const isJeep = activeGameMode === 'jeep';
    const isVendor = activeGameMode === 'vendor';
    touchControls.classList.toggle('hidden', !showAny || isJeep || isVendor);
    if (jeepTouchControls) {
      jeepTouchControls.classList.toggle('hidden', !showAny || !isJeep);
    }
    if (vendorTouchControls) {
      vendorTouchControls.classList.toggle('hidden', !showAny || !isVendor);
    }
  }

  function resizeGameCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const aspect = rect.width / rect.height;
    // Keep vertical world height fixed at 630px; adapt horizontal viewport width so mobile never squishes!
    const targetW = Math.max(330, Math.min(1120, Math.round(H * aspect)));
    if (canvas.width !== targetW || canvas.height !== H) {
      canvas.width = targetW;
      canvas.height = H;
      W = targetW;
    }
    syncTouchControlsVisibility();
  }

  // DOM References
  const hud = document.getElementById('hud');
  const hudAvatar = document.getElementById('hudAvatar');
  const jeepHud = document.getElementById('jeepHud');
  const jeepMoodRow = document.getElementById('jeepMoodRow');
  const jeepSeatsText = document.getElementById('jeepSeatsText');
  const jeepPaxChips = document.getElementById('jeepPaxChips');
  const jeepNextStation = document.getElementById('jeepNextStation');
  const jeepProgress = document.getElementById('jeepProgress');
  const jeepFare = document.getElementById('jeepFare');
  const jeepServed = document.getElementById('jeepServed');
  const karenderyaHud = document.getElementById('karenderyaHud');
  const karenLevelName = document.getElementById('karenLevelName');
  const karenCustGoal = document.getElementById('karenCustGoal');
  const karenSalesGoal = document.getElementById('karenSalesGoal');
  const karenTimerPill = document.getElementById('karenTimerPill');
  const karenTimer = document.getElementById('karenTimer');
  const vendorHud = document.getElementById('vendorHud');
  const vendorModeTitle = document.getElementById('vendorModeTitle');
  const vendorStatA = document.getElementById('vendorStatA');
  const vendorStatB = document.getElementById('vendorStatB');
  const vendorAlertPill = document.getElementById('vendorAlertPill');
  const vendorAlertText = document.getElementById('vendorAlertText');
  const hudHearts = document.getElementById('hudHearts');
  const hudEnergyFill = document.getElementById('hudEnergyFill');
  const hudEnergyText = document.getElementById('hudEnergyText');
  const weaponBadge = document.getElementById('weaponBadge');
  const weaponIcon = document.getElementById('weaponIcon');
  const weaponName = document.getElementById('weaponName');
  const weaponAmmo = document.getElementById('weaponAmmo');
  const knifeBadge = document.getElementById('knifeBadge');
  const hudKnifeCount = document.getElementById('hudKnifeCount');
  const jeepFlagIcon = document.getElementById('jeepFlagIcon');
  const hudStage = document.getElementById('hudStage');
  const hudProgress = document.getElementById('hudProgress');
  const hudCoins = document.getElementById('hudCoins');
  const hudCash = document.getElementById('hudCash');
  const hudScore = document.getElementById('hudScore');
  const bossBar = document.getElementById('bossBar');
  const bossTitle = document.getElementById('bossTitle');
  const bossFill = document.getElementById('bossFill');
  const toastBanner = document.getElementById('toastBanner');

  const titleOverlay = document.getElementById('titleOverlay');
  const selectGameOverlay = document.getElementById('selectGameOverlay');
  const customizerOverlay = document.getElementById('customizerOverlay');
  const levelMapOverlay = document.getElementById('levelMapOverlay');
  const howToOverlay = document.getElementById('howToOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const stageClearOverlay = document.getElementById('stageClearOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const touchControls = document.getElementById('touchControls');
  const jeepTouchControls = document.getElementById('jeepTouchControls');
  const vendorTouchControls = document.getElementById('vendorTouchControls');
  const vendorBalotBtns = document.getElementById('vendorBalotBtns');
  const vendorPandesalBtns = document.getElementById('vendorPandesalBtns');
  const titleHighScore = document.getElementById('titleHighScore');
  const titleBestFare = document.getElementById('titleBestFare');
  const previewCanvas = document.getElementById('previewCanvas');
  const previewCtx = previewCanvas ? previewCanvas.getContext('2d') : null;
  const streetMapView = document.getElementById('streetMapView');
  const jeepMapView = document.getElementById('jeepMapView');
  const karenMapView = document.getElementById('karenMapView');
  const vendorMapView = document.getElementById('vendorMapView');
  const levelMapTitle = document.getElementById('levelMapTitle');

  const STORAGE_KEY = 'kalye_hero_high_score_v1';
  const FARE_STORAGE_KEY = 'kalye_hero_best_fare_v1';

  // Physics Constants
  const GRAVITY = 1760;
  const MAX_FALL = 880;
  const MOVE_ACCEL = 2200;
  const MOVE_FRICTION = 1850;
  const MAX_SPEED = 315;
  const JUMP_VEL = -675;
  const DOUBLE_JUMP_VEL = -615;
  const BOUNCE_VEL = -830;
  const PUNCH_COST = 22;

  // Game State
  let mode = 'title'; // title | playing | paused | clear | gameover
  let selectedGameMode = 'street'; // 'street' | 'jeep' | 'karenderya' | 'vendor'
  let selectedJeepSubMode = 'route'; // 'route' | 'endless'
  let selectedVendorSubMode = 'balot'; // 'balot' | 'pandesal'
  let selectedPandesalLevel = 0;
  let activeGameMode = 'street';
  let playerCustom = {
    head: 'spiky',
    skin: 'tan',
    top: 'black',
    bottom: 'maong'
  };
  let selectedStage = 0;
  let selectedKarenLevel = 0;
  let currentStageIndex = 0;
  let level = null;
  let score = 0;
  let coins = 0;
  let cash = 0;
  let thievesDefeated = 0;
  let highScore = 0;
  let bestFare = 0;
  try {
    highScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
    bestFare = Number(localStorage.getItem(FARE_STORAGE_KEY) || 0);
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

  const jeepKeys = {
    gas: false,
    brake: false,
    joyX: 0,
    joyY: 0
  };

  const vendorKeys = {
    brake: false,
    joyX: 0
  };

  function updateHighScoreUI() {
    if (score > highScore) {
      highScore = score;
      try {
        localStorage.setItem(STORAGE_KEY, String(highScore));
      } catch (_) {}
    }
    titleHighScore.textContent = String(highScore).padStart(5, '0');
    if (titleBestFare) titleBestFare.textContent = `₱${bestFare.toLocaleString()}`;
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
    const prevKnife = keepGear && player ? player.knifeAmmo : 0;
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
      jumpsRemaining: 2,
      doubleJumpTimer: 0,
      custom: { ...playerCustom },
      hp: prevHp,
      maxHp: 5,
      energy: 100,
      maxEnergy: 100,
      weapon: prevWeapon, // null | 'pistol' | 'blaster'
      ammo: prevAmmo,
      knifeAmmo: prevKnife,
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

  function isBossEnemy(e) {
    return (
      e.type === 'boss' ||
      e.type === 'croc_boss' ||
      e.type === 'boss_magnanakaw' ||
      e.type === 'tikbalang_boss'
    );
  }

  function spawnEnemyInstance(def) {
    const isBoss =
      def.type === 'boss' ||
      def.type === 'croc_boss' ||
      def.type === 'boss_magnanakaw' ||
      def.type === 'tikbalang_boss';
    const hpMap = {
      snatcher: 1,
      runner: 1,
      thug: 2,
      croc_thief: 2,
      croc_vip: 3,
      big_knife_thief: 4,
      armed_gang: 3,
      tikbalang: 3,
      manananggal: 2,
      kapre: 4,
      boss: 16,
      croc_boss: 20,
      boss_magnanakaw: 18,
      tikbalang_boss: 22
    };
    const maxHp = hpMap[def.type] || 2;
    const isBig = def.type === 'big_knife_thief' || def.type === 'kapre' || def.type === 'tikbalang';
    return {
      x: def.x,
      y: def.y,
      baseY: def.y,
      w: isBoss ? 60 : isBig ? 46 : def.type === 'armed_gang' || def.type === 'thug' || def.type === 'croc_vip' ? 40 : 36,
      h: isBoss ? 88 : isBig ? 66 : def.type === 'manananggal' ? 46 : 56,
      vx: def.type === 'runner' || def.type === 'tikbalang' ? -150 : isBoss ? -125 : -95,
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
      aiTimer: 1 + Math.random() * 1.3,
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

    const stageToasts = [
      '⚡ Punch Thieves [J] · Grab Barils & Double-Jump!',
      '🌇 Divisoria Rush! Watch out for Bottle-Throwing Thugs!',
      '🌙 Midnight Showdown! Defeat Boss Mandurukot!',
      '🏛️ Malacañang, Manila! Stop the Crocodile Barong Thieves & Grab Cash!',
      '🌊 The Pasig River! Claim Boost Knife, Baril & 3 Hearts vs Big Magnanakaw!',
      '🌬️ Ilocos Norte! Armed Drug Addict thugs carry Guns & Knives—stay sharp!',
      '🏖️ Pangasinan Beach! Double Boss Ahead: BOSS Magnanakaw & BOSS Mandurukot!',
      '🌲 Kagubatan Finale! Battle the Tikbalang, Manananggal & Kapre!'
    ];
    showToast(stageToasts[index] || stageToasts[0], 3.3);
  }

  function startGame(stageIdx = selectedStage) {
    SoundFX.unlock();
    if (selectedGameMode === 'jeep') {
      startJeepRide(selectedJeepSubMode);
      return;
    }
    if (selectedGameMode === 'karenderya') {
      startKarenderya(selectedKarenLevel);
      return;
    }
    if (selectedGameMode === 'vendor') {
      startVendor(selectedVendorSubMode, selectedPandesalLevel);
      return;
    }
    activeGameMode = 'street';
    JeepRide.stop();
    Karenderya.stop();
    VendorGame.stop();
    score = 0;
    coins = 0;
    cash = 0;
    thievesDefeated = 0;
    if (hudAvatar) {
      hudAvatar.src = playerCustom.top === 'jersey'
        ? 'assets/hero_jeep_jersey.jpg'
        : playerCustom.top === 'manong'
        ? 'assets/hero_manong_cook.jpg'
        : 'assets/hero_chibi.jpg';
    }
    loadStage(stageIdx, false);
    mode = 'playing';
    hideAllOverlays();
    jeepHud.classList.add('hidden');
    karenderyaHud.classList.add('hidden');
    if (vendorHud) vendorHud.classList.add('hidden');
    hud.classList.remove('hidden');
    syncTouchControlsVisibility();
    requestAnimationFrame(resizeGameCanvas);
    SoundFX.startBGM();
  }

  function updateKarenHUD(info) {
    karenLevelName.textContent = info.levelName;
    karenCustGoal.textContent = `👥 ${info.customersServed}/${info.customerGoal}`;
    karenCustGoal.classList.toggle('done', info.customersServed >= info.customerGoal);
    karenSalesGoal.textContent = `💵 ₱${info.sales.toLocaleString()} / ₱${info.salesGoal.toLocaleString()}`;
    karenSalesGoal.classList.toggle('done', info.sales >= info.salesGoal);
    karenTimer.textContent = `${info.timeLeft}s`;
    karenTimerPill.classList.toggle('urgent', info.timeLeft <= 15);
  }

  function startKarenderya(lvlIndex = selectedKarenLevel) {
    selectedKarenLevel = lvlIndex;
    activeGameMode = 'karenderya';
    JeepRide.stop();
    VendorGame.stop();
    mode = 'playing';
    hideAllOverlays();
    hud.classList.add('hidden');
    jeepHud.classList.add('hidden');
    if (vendorHud) vendorHud.classList.add('hidden');
    bossBar.classList.add('hidden');
    karenderyaHud.classList.remove('hidden');
    syncTouchControlsVisibility();
    requestAnimationFrame(resizeGameCanvas);

    Karenderya.start(lvlIndex, updateKarenHUD, (result) => {
      mode = result.won ? 'clear' : 'gameover';
      syncTouchControlsVisibility();
      if (result.won) {
        document.getElementById('clearBadge').textContent = '🍲';
        document.getElementById('clearTitle').textContent = result.isLastLevel
          ? '🏆 MASTER KUSINERO!'
          : '🍲 KARENDERYA LEVEL CLEAR!';
        document.getElementById('clearSubtitle').textContent = result.isLastLevel
          ? 'Aling Tessa, Aling Loring, Madam Baby & Jeo Ong loved every dish!'
          : 'Goals crushed! Ready for the next Karenderya rush?';
        document.getElementById('clearStats').innerHTML = `
          <div><span>TOTAL SALES</span><strong>₱${result.sales.toLocaleString()} / ₱${result.salesGoal.toLocaleString()}</strong></div>
          <div><span>CUSTOMERS</span><strong>${result.customersServed}/${result.customerGoal} 😊</strong></div>
          <div><span>TIME LEFT</span><strong>${result.timeLeft}s ⏱️</strong></div>
          <div><span>RATING</span><strong>${'⭐'.repeat(result.stars)}</strong></div>
        `;
        const nextBtn = document.getElementById('btnNextStage');
        nextBtn.textContent = 'NEXT KARENDERYA LVL ➔';
        nextBtn.classList.toggle('hidden', result.isLastLevel);
        stageClearOverlay.classList.remove('hidden');
      } else {
        document.getElementById('gameOverTitle').textContent = "⏰ TIME'S UP MANONG!";
        document.getElementById('gameOverSub').textContent = 'Almost! Serve customers faster to hit both goals before time runs out!';
        document.getElementById('gameOverStats').innerHTML = `
          <div><span>SALES</span><strong>₱${result.sales.toLocaleString()} / ₱${result.salesGoal.toLocaleString()}</strong></div>
          <div><span>CUSTOMERS</span><strong>${result.customersServed}/${result.customerGoal}</strong></div>
          <div><span>LEVEL</span><strong>Level ${result.levelIdx + 1}</strong></div>
          <div><span>TIP</span><strong>Cook &amp; Plate Fast!</strong></div>
        `;
        gameOverOverlay.classList.remove('hidden');
      }
    });

    showToast('🍲 Tap Dishes at bottom to Plate/Cook, then Tap Customers to Serve!', 3.2);
    SoundFX.startBGM();
  }

  function updateVendorHUD(info) {
    if (!vendorModeTitle) return;
    vendorModeTitle.textContent = info.title;
    if (info.subMode === 'balot') {
      vendorStatA.textContent = `🏃 ${info.dist}m · 🥚 ${info.eggs}`;
      vendorStatB.textContent = `💵 ₱${info.pesos}`;
      vendorAlertText.textContent = info.dogClose >= 1 ? '🐕 DOG CLOSE!!' : '🐕 SAFE';
      vendorAlertPill.classList.toggle('urgent', info.dogClose >= 1);
    } else {
      vendorStatA.textContent = `🥖 ${info.sold}/${info.goalPandesal} pcs`;
      vendorStatB.textContent = `💵 ₱${info.pesos} / ₱${info.goalPesos}`;
      vendorAlertText.textContent = `😢 ${info.missed}/${info.maxMissed}`;
      vendorAlertPill.classList.toggle('urgent', info.missed >= info.maxMissed - 1);
    }
  }

  function startVendor(sub = selectedVendorSubMode, pLvl = selectedPandesalLevel) {
    selectedVendorSubMode = sub;
    selectedPandesalLevel = pLvl;
    activeGameMode = 'vendor';
    JeepRide.stop();
    Karenderya.stop();
    mode = 'playing';
    hideAllOverlays();
    hud.classList.add('hidden');
    jeepHud.classList.add('hidden');
    karenderyaHud.classList.add('hidden');
    bossBar.classList.add('hidden');
    if (vendorHud) vendorHud.classList.remove('hidden');
    if (vendorBalotBtns) vendorBalotBtns.classList.toggle('hidden', sub !== 'balot');
    if (vendorPandesalBtns) vendorPandesalBtns.classList.toggle('hidden', sub !== 'pandesal');
    vendorKeys.brake = false;
    vendorKeys.joyX = 0;

    VendorGame.start(sub, pLvl, playerCustom, updateVendorHUD, (result) => {
      mode = result.won ? 'clear' : 'gameover';
      syncTouchControlsVisibility();
      if (result.subMode === 'balot') {
        document.getElementById('gameOverTitle').textContent = '🐕 NAHABOL NG ASO!';
        document.getElementById('gameOverSub').textContent = 'The Pasig River dog caught the Balot Vendor! Run again & dodge obstacles!';
        document.getElementById('gameOverStats').innerHTML = `
          <div><span>DISTANCE</span><strong>${result.dist}m</strong></div>
          <div><span>BEST RUN</span><strong>${result.bestDist}m</strong></div>
          <div><span>BALOT EGGS</span><strong>🥚 ${result.eggs}</strong></div>
          <div><span>EARNED</span><strong>₱${result.pesos}</strong></div>
        `;
        gameOverOverlay.classList.remove('hidden');
      } else if (result.won) {
        document.getElementById('clearBadge').textContent = '🚲';
        document.getElementById('clearTitle').textContent = result.isLastLevel
          ? '🏆 GOLDEN PANADERO KUYA TISOY!'
          : '🥖 PANDESAL QUOTA SOLD OUT!';
        document.getElementById('clearSubtitle').textContent = 'Hot Malunggay Pandesal (₱2 each) sold out across the barangay!';
        document.getElementById('clearStats').innerHTML = `
          <div><span>PANDESAL SOLD</span><strong>${result.sold} pcs 🥖</strong></div>
          <div><span>TOTAL SALES</span><strong>₱${result.pesos}</strong></div>
          <div><span>MISSED HOUSES</span><strong>${result.missed}/4</strong></div>
          <div><span>RATING</span><strong>${'⭐'.repeat(result.stars)}</strong></div>
        `;
        const nextBtn = document.getElementById('btnNextStage');
        nextBtn.textContent = 'NEXT PANDESAL ROUTE ➔';
        nextBtn.classList.toggle('hidden', result.isLastLevel);
        stageClearOverlay.classList.remove('hidden');
      } else {
        document.getElementById('gameOverTitle').textContent = '😢 SAYANG ANG BENTA!';
        document.getElementById('gameOverSub').textContent = 'You missed 4 houses shouting "PANDESAL!" Hold 🛑 SELL in front of shouting gates!';
        document.getElementById('gameOverStats').innerHTML = `
          <div><span>PANDESAL SOLD</span><strong>${result.sold}/${result.goalPandesal}</strong></div>
          <div><span>SALES (₱2 ea)</span><strong>₱${result.pesos}</strong></div>
          <div><span>MISSED HOUSES</span><strong>${result.missed}/4</strong></div>
          <div><span>TIP</span><strong>Stop at Green Zones!</strong></div>
        `;
        gameOverOverlay.classList.remove('hidden');
      }
    });

    syncTouchControlsVisibility();
    requestAnimationFrame(resizeGameCanvas);
    showToast(
      sub === 'balot'
        ? '🥚 Pasig Balot Run! Slide Joystick/Swipe Left-Right & Jump barriers—outrun the dog!'
        : '🚲 Malunggay Pandesal (₱2)! Stop & tap 🛑 SELL when a house shouts "PANDESAL!"',
      3.4
    );
    SoundFX.startBGM();
  }

  function updateJeepHUD(info) {
    // Angry / Happy strikes display
    let moodIcons = '';
    for (let i = 0; i < info.maxAngry; i++) {
      moodIcons += i < info.angryCount ? '😠' : '😊';
    }
    jeepMoodRow.textContent = moodIcons;
    jeepSeatsText.textContent = `👥 ${info.passengers.length}/${info.maxSeats} PASAHERO${info.combo >= 2 ? ` · x${info.combo} SUKI!` : ''}`;
    jeepNextStation.textContent = info.dropHere > 0
      ? `🛑 ${info.nextStationSide}: ${info.nextStation} (${info.dropHere} PAX)`
      : `🚏 ${info.nextStationSide}: ${info.nextStation} (${info.nextStationDist}m)`;
    if (jeepFlagIcon) jeepFlagIcon.textContent = info.endlessMode ? '♾️' : '🏁';
    jeepProgress.style.width = `${info.progress}%`;
    jeepFare.textContent = `₱${info.fareEarned.toLocaleString()}`;
    jeepServed.textContent = String(info.happyServed);

    // Compact destination chips for onboard pasaheros!
    jeepPaxChips.innerHTML = info.passengers
      .slice(0, 4)
      .map((p) => {
        const cls = p.patience < 35 ? 'danger' : p.patience < 65 ? 'warn' : '';
        const face = p.patience < 35 ? '😠' : p.patience < 65 ? '😐' : '😊';
        return `<span class="pax-chip ${cls}">${p.destName.split(' ')[0]} ${face}</span>`;
      })
      .join('');
  }

  function startJeepRide(subMode = selectedJeepSubMode) {
    selectedJeepSubMode = subMode;
    activeGameMode = 'jeep';
    Karenderya.stop();
    VendorGame.stop();
    mode = 'playing';
    hideAllOverlays();
    hud.classList.add('hidden');
    karenderyaHud.classList.add('hidden');
    if (vendorHud) vendorHud.classList.add('hidden');
    bossBar.classList.add('hidden');
    jeepHud.classList.remove('hidden');
    jeepKeys.gas = false;
    jeepKeys.brake = false;
    jeepKeys.joyX = 0;
    jeepKeys.joyY = 0;

    JeepRide.start(updateJeepHUD, (result) => {
      mode = result.won ? 'clear' : 'gameover';
      if (result.fareEarned > bestFare) {
        bestFare = result.fareEarned;
        try {
          localStorage.setItem(FARE_STORAGE_KEY, String(bestFare));
        } catch (_) {}
      }
      updateHighScoreUI();
      syncTouchControlsVisibility();

      if (result.won) {
        document.getElementById('clearBadge').textContent = '🚐';
        document.getElementById('clearTitle').textContent = '🏆 KING OF EDSA!';
        document.getElementById('clearSubtitle').textContent = `Full EDSA route complete! ${'⭐'.repeat(result.stars)} Driver Rating!`;
        document.getElementById('clearStats').innerHTML = `
          <div><span>TOTAL BAYAD</span><strong>₱${result.fareEarned.toLocaleString()}</strong></div>
          <div><span>HAPPY PASAHEROS</span><strong>${result.happyServed} 😊</strong></div>
          <div><span>DRIVER RATING</span><strong>${'⭐'.repeat(result.stars)}</strong></div>
          <div><span>BEST EDSA FARE</span><strong>₱${bestFare.toLocaleString()}</strong></div>
        `;
        document.getElementById('btnNextStage').classList.add('hidden');
        stageClearOverlay.classList.remove('hidden');
      } else {
        document.getElementById('gameOverTitle').textContent = result.endlessMode
          ? '♾️ ENDLESS RUN COMPLETE!'
          : '😠 NAWALAN NG PASAHERO!';
        document.getElementById('gameOverSub').textContent = result.endlessMode
          ? `You drove ${result.distance}m across EDSA and served ${result.happyServed} happy pasaheros!`
          : '3 pasaheros got angry! Watch UP & DOWN bus stops and dodge traffic!';
        document.getElementById('gameOverStats').innerHTML = `
          <div><span>FARE EARNED</span><strong>₱${result.fareEarned.toLocaleString()}</strong></div>
          <div><span>HAPPY PASAHEROS</span><strong>${result.happyServed} 😊</strong></div>
          <div><span>DISTANCE</span><strong>${result.distance}m</strong></div>
          <div><span>BEST EDSA FARE</span><strong>₱${bestFare.toLocaleString()}</strong></div>
        `;
        gameOverOverlay.classList.remove('hidden');
      }
    }, subMode);

    syncTouchControlsVisibility();
    requestAnimationFrame(resizeGameCanvas);
    showToast(
      subMode === 'endless'
        ? '♾️ Endless EDSA! Stop at ⬆️ UP & ⬇️ DOWN Bus Stops to earn infinite Bayad!'
        : '🚐 EDSA Route! Watch for ⬆️ UP & ⬇️ DOWN Bus Stops and hold 🛑 STOP!',
      3.3
    );
    SoundFX.startBGM();
  }

  function hideAllOverlays() {
    titleOverlay.classList.add('hidden');
    if (selectGameOverlay) selectGameOverlay.classList.add('hidden');
    if (customizerOverlay) customizerOverlay.classList.add('hidden');
    if (levelMapOverlay) levelMapOverlay.classList.add('hidden');
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

    // Boost Knife badge
    if (knifeBadge && hudKnifeCount) {
      knifeBadge.classList.toggle('hidden', !player.knifeAmmo || player.knifeAmmo <= 0);
      hudKnifeCount.textContent = String(player.knifeAmmo || 0);
    }

    // Coins, Cash & Score
    hudCoins.textContent = String(coins);
    if (hudCash) hudCash.textContent = `₱${cash.toLocaleString()}`;
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
    const isBoss = isBossEnemy(e);
    const isCroc = e.type === 'croc_thief' || e.type === 'croc_vip' || e.type === 'croc_boss';
    e.hp -= dmg;
    e.hurtFlash = 0.14;
    e.vx = knockDir * (isBoss ? 140 : 240);
    if (e.onGround && !isBoss) e.vy = -210;

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
      const pts = e.type === 'croc_boss' ? 3000 : isBoss ? 2000 : e.type === 'croc_vip' ? 500 : isCroc || e.type === 'thug' ? 350 : 200;
      score += pts;
      SoundFX.enemyKO();
      addShake(isBoss ? 12 : 5, isBoss ? 0.35 : 0.12);
      hitStop = isBoss ? 0.09 : 0.035;
      addFloatText(e.x + e.w / 2, e.y - 10, `${word} +${pts}`, '#fde047', isBoss ? 24 : 18);
      spawnParticles(e.x + e.w / 2, e.y + e.h / 2, '#facc15', isBoss ? 32 : 14, 260);
      spawnParticles(e.x + e.w / 2, e.y + e.h / 2, isCroc ? '#22c55e' : '#ef4444', 12, 200);

      // Thief drops stolen Peso Coins, Cash Bundles, Energy, AND easy Baril/Ammo when low!
      const needsGun = !player.weapon || player.ammo < 7;
      const dropCount = isBoss ? 10 : isCroc ? 3 : 2;
      for (let i = 0; i < dropCount; i++) {
        let dropType = 'coin';
        if (i === 0 && needsGun && Math.random() < 0.5) dropType = Math.random() < 0.35 ? 'blaster' : 'gun';
        else if (i === 0 && isCroc) dropType = 'cash';
        else if (isBoss && i % 2 === 1) dropType = 'cash';
        else if (i === 1 && Math.random() < 0.4) dropType = 'energy';
        pickups.push({
          x: e.x + e.w / 2 - 12,
          y: e.y + 10,
          w: 28,
          h: 28,
          vx: (Math.random() - 0.5) * 230,
          vy: -250 - Math.random() * 150,
          type: dropType,
          fromBlock: true,
          collected: false
        });
      }

      if (isBoss) {
        bossBar.classList.add('hidden');
        showToast(
          e.type === 'croc_boss'
            ? '🏆 DON BUWAYA DEFEATED! Collect the Cash & Claim the Malacañang Flag!'
            : '🏆 BOSS MANDURUKOT DEFEATED! Grab the Barangay Flag!',
          3.6
        );
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
    document.getElementById('clearBadge').textContent = '🏁';
    document.getElementById('clearTitle').textContent = isLast
      ? '🏛️ MALACAÑANG & MANILA SAVED!'
      : '🏁 STAGE CLEAR!';
    document.getElementById('clearSubtitle').textContent = isLast
      ? 'You defeated Don Buwaya & the Crocodile Barong Thieves and recovered the public cash!'
      : currentStageIndex === 2
      ? 'Boss Mandurukot is down! Next up: Malacañang, Manila!'
      : 'Thieves sent packing! Ready for the next street?';
    document.getElementById('clearStats').innerHTML = `
      <div><span>SCORE</span><strong>${String(score).padStart(5, '0')}</strong></div>
      <div><span>COINS &amp; CASH</span><strong>🪙${coins} · ₱${cash.toLocaleString()}</strong></div>
      <div><span>THIEVES STOPPED</span><strong>${thievesDefeated}</strong></div>
      <div><span>HP BONUS</span><strong>+${player.hp * 100}</strong></div>
    `;
    const nextBtn = document.getElementById('btnNextStage');
    nextBtn.classList.toggle('hidden', isLast);
    stageClearOverlay.classList.remove('hidden');
    syncTouchControlsVisibility();
  }

  function triggerGameOver() {
    mode = 'gameover';
    updateHighScoreUI();
    SoundFX.gameOver();
    document.getElementById('gameOverTitle').textContent = 'NAKO! KNOCKED OUT!';
    document.getElementById('gameOverSub').textContent = 'Those street thieves got away—get back up and stop them!';
    document.getElementById('gameOverStats').innerHTML = `
      <div><span>FINAL SCORE</span><strong>${String(score).padStart(5, '0')}</strong></div>
      <div><span>COINS &amp; CASH</span><strong>🪙${coins} · ₱${cash.toLocaleString()}</strong></div>
      <div><span>THIEVES STOPPED</span><strong>${thievesDefeated}</strong></div>
      <div><span>HIGH SCORE</span><strong>${String(highScore).padStart(5, '0')}</strong></div>
    `;
    gameOverOverlay.classList.remove('hidden');
    syncTouchControlsVisibility();
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

    if (activeGameMode === 'jeep') {
      JeepRide.update(dt, W, jeepKeys);
      return;
    }
    if (activeGameMode === 'karenderya') {
      Karenderya.update(dt, W);
      return;
    }
    if (activeGameMode === 'vendor') {
      VendorGame.update(dt, W, vendorKeys);
      return;
    }

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
    const activeBoss = enemies.find((e) => isBossEnemy(e) && !e.dead);
    if (!goalCleared && player.x + player.w >= level.goalX - 18) {
      if (activeBoss) {
        // Must beat the Stage Boss first!
        player.x = level.goalX - player.w - 20;
        showToast(
          activeBoss.type === 'croc_boss'
            ? '🐊 Defeat Don Buwaya before claiming the Malacañang Flag!'
            : '🦹 Defeat Boss Mandurukot before claiming the Flag!',
          1.8
        );
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
    if (p.doubleJumpTimer > 0) p.doubleJumpTimer = Math.max(0, p.doubleJumpTimer - dt);

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

    // Coyote time + Jump buffer + DOUBLE JUMP!
    if (p.onGround) {
      p.coyoteTimer = 0.11;
      p.jumpsRemaining = 2;
    } else {
      p.coyoteTimer = Math.max(0, p.coyoteTimer - dt);
    }

    if (keys.jumpPressed) {
      p.jumpBuffer = 0.12;
      keys.jumpPressed = false;
    } else {
      p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    }

    if (p.jumpBuffer > 0) {
      if (p.coyoteTimer > 0) {
        // First Jump
        p.vy = JUMP_VEL;
        p.onGround = false;
        p.coyoteTimer = 0;
        p.jumpBuffer = 0;
        p.jumpsRemaining = 1;
        SoundFX.jump();
        spawnParticles(p.x + p.w / 2, p.y + p.h, '#e2e8f0', 6, 110);
      } else if (p.jumpsRemaining > 0) {
        // Mid-Air DOUBLE JUMP!
        p.vy = DOUBLE_JUMP_VEL;
        p.jumpsRemaining = 0;
        p.jumpBuffer = 0;
        p.doubleJumpTimer = 0.34;
        SoundFX.doubleJump();
        spawnParticles(p.x + p.w / 2, p.y + p.h, '#fde047', 10, 165);
        addFloatText(p.x + 17, p.y + p.h, 'DOUBLE JUMP!', '#38bdf8', 13);
      }
    }

    // Variable jump height (release jump early for short hop)
    if (!keys.jump && p.vy < -260) {
      p.vy *= 0.88;
    }

    // PUNCH / BOOST KNIFE SLASH ACTION (Uses Energy!)
    if (keys.punchPressed) {
      keys.punchPressed = false;
      if (p.punchCooldown <= 0) {
        const usingKnife = p.knifeAmmo > 0;
        const cost = usingKnife ? 10 : PUNCH_COST;
        if (p.energy >= cost) {
          p.energy -= cost;
          if (usingKnife) p.knifeAmmo--;
          p.punchTimer = p.punchDuration;
          p.punchCooldown = usingKnife ? 0.2 : 0.27;
          p.punchHitSet.clear();
          p.vx += p.facing * (usingKnife ? 160 : 120);
          SoundFX.punchSwing();
          spawnParticles(
            p.facing > 0 ? p.x + p.w + 8 : p.x - 8,
            p.y + 28,
            usingKnife ? '#38bdf8' : '#fde047',
            usingKnife ? 11 : 7,
            170
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

    // Active Punch / Boost Knife Hitbox Check
    if (p.punchTimer > 0) {
      p.punchTimer -= dt;
      const hasKnifeReach = p.knifeAmmo > 0;
      const reach = hasKnifeReach ? 62 : 46;
      const punchBox = {
        x: p.facing > 0 ? p.x + p.w - 4 : p.x - reach + 4,
        y: p.y + 4,
        w: reach,
        h: 44
      };

      for (const e of enemies) {
        if (!e.dead && !p.punchHitSet.has(e) && rectOverlap(punchBox, e)) {
          p.punchHitSet.add(e);
          defeatOrDamageEnemy(e, hasKnifeReach ? 3 : 2, p.facing, 'punch');
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

    const GROUND_STYLES = ['street', 'palace', 'boardwalk', 'sandroad', 'beach', 'forest'];

    // Solid ground horizontal collision
    for (const plat of platforms) {
      if (!GROUND_STYLES.includes(plat.style)) continue;
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
          p.jumpsRemaining = 2;
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
        // Respawn safely on nearest ground segment to the left
        let safeX = Math.max(60, p.x - 190);
        for (const plat of platforms) {
          const isGround = GROUND_STYLES.includes(plat.style);
          if (isGround && safeX >= plat.x && safeX <= plat.x + plat.w - 40) {
            break;
          }
          if (isGround && plat.x < p.x) {
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
        } else if (item.type === 'cash') {
          cash += 1000;
          score += 500;
          player.energy = Math.min(player.maxEnergy, player.energy + 15);
          SoundFX.cash();
          addFloatText(player.x + 17, player.y - 12, '+₱1,000 CASH! 💵', '#34d399', 18);
          spawnParticles(item.x + 14, item.y + 14, '#34d399', 14, 190);
          spawnParticles(item.x + 14, item.y + 14, '#facc15', 6, 150);
        } else if (item.type === 'energy') {
          player.energy = Math.min(player.maxEnergy, player.energy + 60);
          score += 120;
          SoundFX.energyDrink();
          addFloatText(player.x + 17, player.y - 12, '+⚡ PUNCH ENERGY!', '#fde047', 17);
          spawnParticles(item.x + 14, item.y + 14, '#fde047', 14, 190);
        } else if (item.type === 'gun') {
          if (player.weapon === 'blaster') {
            player.ammo += 12;
            showToast('💥 Spread Blaster Ammo +12!', 1.8);
          } else {
            player.weapon = 'pistol';
            player.ammo += 20;
            showToast('🔫 BARIL GET! Street Pistol (+20 Ammo) · Press [K] to Shoot!', 2.4);
          }
          score += 200;
          SoundFX.powerup();
          addFloatText(player.x + 17, player.y - 12, '🔫 BARIL +20!', '#60a5fa', 18);
          spawnParticles(item.x + 14, item.y + 14, '#60a5fa', 16, 200);
        } else if (item.type === 'blaster') {
          player.weapon = 'blaster';
          player.ammo += 16;
          score += 300;
          SoundFX.powerup();
          showToast('💥 3-WAY SPREAD BARIL (+16 Ammo)! Press [K] to Blast!', 2.4);
          addFloatText(player.x + 17, player.y - 12, '💥 SPREAD BARIL!', '#f87171', 18);
          spawnParticles(item.x + 14, item.y + 14, '#ef4444', 18, 220);
        } else if (item.type === 'knife') {
          player.knifeAmmo = (player.knifeAmmo || 0) + 15;
          score += 250;
          SoundFX.powerup();
          showToast('🔪 BOOST KNIFE (+15 Slashes · 3× Damage & Half Energy)!', 2.6);
          addFloatText(player.x + 17, player.y - 12, '🔪 BOOST KNIFE!', '#38bdf8', 18);
          spawnParticles(item.x + 14, item.y + 14, '#38bdf8', 18, 220);
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
      if (Math.abs(e.x - player.x) > W * 1.15 && !isBossEnemy(e)) continue;

      const dx = player.x - e.x;
      const dist = Math.abs(dx);

      if (isBossEnemy(e)) {
        const triggerX = e.type === 'croc_boss' || e.type === 'boss_magnanakaw' || e.type === 'tikbalang_boss' ? 2360 : 2240;
        if (player.x > triggerX) {
          const liveBosses = enemies.filter((b) => isBossEnemy(b) && !b.dead);
          const totalHp = liveBosses.reduce((s, b) => s + b.hp, 0);
          const totalMax = liveBosses.reduce((s, b) => s + b.maxHp, 0) || 1;
          bossBar.classList.remove('hidden');
          if (bossTitle) {
            if (liveBosses.length > 1) {
              bossTitle.textContent = '⚔️ DOUBLE BOSS: MAGNANAKAW & MANDURUKOT!';
            } else if (e.type === 'croc_boss') {
              bossTitle.textContent = '🐊 DON BUWAYA — MALACAÑANG CROC IN BARONG';
            } else if (e.type === 'boss_magnanakaw') {
              bossTitle.textContent = '🔪 BOSS MAGNANAKAW — BEACH BANDIT KING';
            } else if (e.type === 'tikbalang_boss') {
              bossTitle.textContent = '🐴 HARI NG KAGUBATAN — ALPHA TIKBALANG';
            } else {
              bossTitle.textContent = '🦹 BOSS MANDURUKOT — SNATCHER KING';
            }
          }
          bossFill.style.width = `${Math.max(0, (totalHp / totalMax) * 100)}%`;

          e.facing = dx >= 0 ? 1 : -1;
          const enraged = e.hp <= e.maxHp * 0.45;
          const speed = enraged ? 190 : 140;
          e.vx += (e.facing * speed - e.vx) * Math.min(1, dt * 4);

          e.bossJumpTimer -= dt;
          if (e.bossJumpTimer <= 0 && e.onGround) {
            e.vy = e.type === 'tikbalang_boss' ? -680 : -620;
            e.onGround = false;
            e.bossJumpTimer = enraged ? 1.6 : 2.4;
          }

          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && dist < 580) {
            e.aiTimer = enraged ? 1.5 : 2.15;
            const kind = e.type === 'croc_boss'
              ? 'briefcase'
              : e.type === 'boss_magnanakaw'
              ? 'enemy_bullet'
              : e.type === 'tikbalang_boss'
              ? 'ember'
              : 'sack';
            enemyProjectiles.push({
              x: e.x + e.w / 2,
              y: e.y + 24,
              w: kind === 'enemy_bullet' ? 14 : 20,
              h: kind === 'enemy_bullet' ? 10 : 16,
              vx: e.facing * (kind === 'enemy_bullet' ? 420 : 320),
              vy: kind === 'enemy_bullet' ? 0 : -250,
              noGravity: kind === 'enemy_bullet',
              kind,
              life: 2.4
            });
          }
        } else {
          e.vx = 0;
        }
      } else if (e.type === 'manananggal') {
        // Flying Winged Manananggal — hovers & swoops without gravity!
        e.facing = dx >= 0 ? 1 : -1;
        if (dist < 520) {
          e.vx = e.facing * 125;
          const targetY = (e.baseY || 240) + Math.sin(worldTime * 3.4 + e.seed) * 70;
          e.y += (targetY - e.y) * Math.min(1, dt * 3.5);
          e.x += e.vx * dt;
        }
        if (rectOverlap(player, e)) {
          const playerFalling = player.vy > 40;
          const playerAbove = player.y + player.h - player.vy * dt <= e.y + 22;
          if (playerFalling && playerAbove) {
            player.vy = -510;
            player.jumpsRemaining = 1;
            SoundFX.stomp();
            defeatOrDamageEnemy(e, 2, player.facing, 'stomp');
          } else {
            damagePlayer(1, player.x < e.x ? -1 : 1);
          }
        }
        continue;
      } else if (e.type === 'armed_gang' || e.type === 'kapre') {
        // Armed Gang (Gun & Knife!) or Kapre (Throws Glowing Fire Embers!)
        if (dist < 470) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = dist > 160 ? e.facing * (e.type === 'armed_gang' ? 105 : 65) : e.type === 'armed_gang' ? e.facing * 145 : 0;
          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && dist < 440 && dist > 120) {
            e.aiTimer = e.type === 'armed_gang' ? 1.95 : 2.3;
            const isGun = e.type === 'armed_gang';
            enemyProjectiles.push({
              x: e.x + e.w / 2,
              y: e.y + 20,
              w: isGun ? 13 : 16,
              h: isGun ? 8 : 16,
              vx: e.facing * (isGun ? 390 : 285),
              vy: isGun ? 0 : -230,
              noGravity: isGun,
              kind: isGun ? 'enemy_bullet' : 'ember',
              life: 2.3
            });
          }
        }
      } else if (e.type === 'tikbalang' || e.type === 'big_knife_thief') {
        // Aggressive lunging & leaping melee beasts / Big Magnanakaw with Knife!
        if (dist < 420) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = e.facing * (e.type === 'tikbalang' ? 165 : 135);
          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && e.onGround && dist < 290) {
            e.vy = e.type === 'tikbalang' ? -540 : -390;
            e.aiTimer = e.type === 'tikbalang' ? 1.7 : 2.1;
          }
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
      } else if (e.type === 'thug' || e.type === 'croc_vip') {
        if (dist < 440) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = dist > 180 ? e.facing * 72 : 0;
          e.aiTimer -= dt;
          if (e.aiTimer <= 0 && dist < 420) {
            e.aiTimer = e.type === 'croc_vip' ? 2.15 : 2.4;
            enemyProjectiles.push({
              x: e.x + e.w / 2,
              y: e.y + 18,
              w: e.type === 'croc_vip' ? 18 : 14,
              h: 14,
              vx: e.facing * 275,
              vy: -225,
              kind: e.type === 'croc_vip' ? 'briefcase' : 'bottle',
              life: 2.5
            });
          }
        }
      } else if (e.type === 'croc_thief') {
        // Crocodile Barong Thief patrols and snaps forward aggressively!
        if (dist < 310 && Math.abs(player.y - e.y) < 90) {
          e.facing = dx >= 0 ? 1 : -1;
          e.vx = e.facing * 145;
        } else {
          if (Math.abs(e.vx) < 30) e.vx = e.facing * 100;
          e.facing = Math.sign(e.vx) || -1;
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
      if (isBossEnemy(e)) {
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

      if (standingPlat && !isBossEnemy(e)) {
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
          // Classic Mario head-stomp! (Also refreshes mid-air double jump!)
          player.vy = -510;
          player.jumpsRemaining = 1;
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
      if (!pr.noGravity) pr.vy += GRAVITY * 0.55 * dt;
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
    if (activeGameMode === 'jeep' && JeepRide.isActive()) {
      JeepRide.render(ctx, W);
      return;
    }
    if (activeGameMode === 'karenderya' && Karenderya.isActive()) {
      Karenderya.render(ctx, W);
      return;
    }
    if (activeGameMode === 'vendor' && VendorGame.isActive()) {
      VendorGame.render(ctx, W);
      return;
    }
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

    // Barangay / Malacañang Goal Flagpole
    Sprites.drawGoalFlag(ctx, level.goalX, Levels.GROUND_Y, worldTime, goalCleared, level.theme);

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
      } else if (pr.kind === 'enemy_bullet') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (pr.kind === 'ember') {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (pr.kind === 'briefcase') {
        // Spinning Cash-Stuffed Executive Briefcase!
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-10, -7, 20, 14);
        ctx.strokeRect(-10, -7, 20, 14);
        ctx.fillStyle = '#34d399';
        ctx.fillRect(-7, -10, 6, 4);
        ctx.fillRect(1, -10, 6, 4);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-2, -1, 4, 3);
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

    if (activeGameMode === 'karenderya' && mode === 'playing') {
      if (!e.repeat) {
        if (code === 'Digit1') Karenderya.interactDishByIndex(0);
        if (code === 'Digit2') Karenderya.interactDishByIndex(1);
        if (code === 'Digit3') Karenderya.interactDishByIndex(2);
        if (code === 'Digit4') Karenderya.interactDishByIndex(3);
        if (code === 'Digit5') Karenderya.interactDishByIndex(4);
        if (code === 'Digit6') Karenderya.interactDishByIndex(5);
        if (code === 'Digit7') Karenderya.interactDishByIndex(6);
        if (code === 'KeyQ') Karenderya.serveSeat(0);
        if (code === 'KeyW') Karenderya.serveSeat(1);
        if (code === 'KeyE') Karenderya.serveSeat(2);
        if (code === 'KeyC') Karenderya.clearTray();
      }
    } else if (activeGameMode === 'vendor' && mode === 'playing') {
      if (VendorGame.getSubMode() === 'balot') {
        if ((code === 'KeyA' || code === 'ArrowLeft') && !e.repeat) VendorGame.balotMoveLane(-1);
        if ((code === 'KeyD' || code === 'ArrowRight') && !e.repeat) VendorGame.balotMoveLane(1);
        if ((code === 'KeyW' || code === 'ArrowUp' || code === 'Space') && !e.repeat) VendorGame.balotJump();
      } else {
        if (code === 'KeyA' || code === 'ArrowLeft') vendorKeys.joyX = -0.8;
        if (code === 'KeyD' || code === 'ArrowRight') vendorKeys.joyX = 0.8;
        if (code === 'Space' || code === 'KeyJ') vendorKeys.brake = true;
        if ((code === 'KeyK' || code === 'KeyH') && !e.repeat) VendorGame.pandesalShout();
      }
    } else if (activeGameMode === 'jeep' && mode === 'playing') {
      if ((code === 'KeyW' || code === 'ArrowUp') && !e.repeat) JeepRide.moveLane(-1);
      if ((code === 'KeyS' || code === 'ArrowDown') && !e.repeat) JeepRide.moveLane(1);
      if (code === 'KeyD' || code === 'ArrowRight') jeepKeys.gas = true;
      if (code === 'KeyA' || code === 'ArrowLeft' || code === 'Space') jeepKeys.brake = true;
      if ((code === 'KeyJ' || code === 'KeyK' || code === 'KeyH' || code === 'KeyZ' || code === 'KeyX') && !e.repeat) {
        JeepRide.honkHorn();
      }
    } else {
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
    }

    if ((code === 'KeyP' || code === 'Escape') && !e.repeat) {
      if (mode === 'playing') {
        mode = 'paused';
        if (activeGameMode === 'jeep') JeepRide.setPaused(true);
        if (activeGameMode === 'karenderya') Karenderya.setPaused(true);
        if (activeGameMode === 'vendor') VendorGame.setPaused(true);
        pauseOverlay.classList.remove('hidden');
        syncTouchControlsVisibility();
      } else if (mode === 'paused') {
        mode = 'playing';
        if (activeGameMode === 'jeep') JeepRide.setPaused(false);
        if (activeGameMode === 'karenderya') Karenderya.setPaused(false);
        if (activeGameMode === 'vendor') VendorGame.setPaused(false);
        pauseOverlay.classList.add('hidden');
        syncTouchControlsVisibility();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    const code = e.code;
    if (code === 'KeyA' || code === 'ArrowLeft') { keys.left = false; jeepKeys.brake = false; vendorKeys.joyX = 0; }
    if (code === 'KeyD' || code === 'ArrowRight') { keys.right = false; jeepKeys.gas = false; vendorKeys.joyX = 0; }
    if (code === 'KeyW' || code === 'ArrowUp' || code === 'Space') { keys.jump = false; jeepKeys.brake = false; vendorKeys.brake = false; }
    if (code === 'KeyJ') vendorKeys.brake = false;
  });

  // ==================== 4-STEP UI FLOW (PLAY -> GAME -> PLAYER CUSTOMIZER -> LEVEL MAP) ====================
  function showFlowScreen(screenEl) {
    hideAllOverlays();
    if (screenEl) screenEl.classList.remove('hidden');
  }

  function applyCustomPreset(presetKey) {
    const presets = {
      classic: { head: 'spiky', skin: 'tan', top: 'black', bottom: 'maong' },
      jersey: { head: 'backcap', skin: 'tan', top: 'jersey', bottom: 'shorts' },
      manong: { head: 'manong', skin: 'tan', top: 'manong', bottom: 'shorts' },
      jeo: { head: 'bandana', skin: 'tan', top: 'black', bottom: 'maong' }
    };
    if (presets[presetKey]) {
      playerCustom = { ...presets[presetKey] };
      syncCustomizerPills();
    }
  }

  function syncCustomizerPills() {
    document.querySelectorAll('.cust-pills').forEach((group) => {
      const part = group.dataset.part;
      group.querySelectorAll('.cust-pill').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.val === playerCustom[part]);
      });
    });
  }

  function renderPreviewHero() {
    if (!previewCtx || !customizerOverlay || customizerOverlay.classList.contains('hidden')) return;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewCtx.save();
    previewCtx.translate(110, 192);
    previewCtx.scale(2.15, 2.15);
    const dummy = {
      x: -17,
      y: -56,
      w: 34,
      h: 56,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: true,
      energy: 60,
      maxEnergy: 100,
      weapon: null,
      ammo: 0,
      knifeAmmo: 0,
      punchTimer: 0,
      punchDuration: 0.22,
      shootFlashTimer: 0,
      invulnTimer: 0,
      doubleJumpTimer: 0,
      custom: { ...playerCustom }
    };
    Sprites.drawHero(previewCtx, dummy, worldTime);
    previewCtx.restore();
  }

  function buildStreetAdventureMap() {
    const container = document.getElementById('streetMapNodes');
    if (!container) return;
    container.innerHTML = '';
    Levels.META.forEach((m) => {
      const btn = document.createElement('button');
      btn.className = `map-node${m.index === selectedStage ? ' selected' : ''}`;
      btn.innerHTML = `
        <span class="map-node-num">${m.index + 1}</span>
        <span class="map-node-icon">${m.icon}</span>
        <span class="map-node-title">${m.short}</span>
        <span class="map-node-sub">${m.sub}</span>
      `;
      btn.addEventListener('click', () => {
        selectedStage = m.index;
        updateStreetMapSelection();
      });
      container.appendChild(btn);
    });
    updateStreetMapSelection();
  }

  function updateStreetMapSelection() {
    const m = Levels.META[selectedStage] || Levels.META[0];
    document.querySelectorAll('#streetMapNodes .map-node').forEach((n, idx) => {
      n.classList.toggle('selected', idx === selectedStage);
    });
    document.getElementById('mapStageName').textContent = `LEVEL ${m.index + 1} · ${m.short.toUpperCase()}`;
    document.getElementById('mapStageDesc').textContent = m.desc;
  }

  function syncKarenShopUI() {
    const st = Karenderya.getUpgradesState();
    const bankEl = document.getElementById('karenBankText');
    if (bankEl) bankEl.textContent = `💰 KITA BANK: ₱${st.bank.toLocaleString()}`;

    const btnTray = document.getElementById('btnUpgTray');
    const btnStove = document.getElementById('btnUpgStove');
    const btnStaff = document.getElementById('btnUpgStaff');
    if (btnTray) {
      document.getElementById('upgTrayLabel').textContent = `🍽️ TRAY: ${st.trayCap} SLOTS`;
      document.getElementById('upgTrayCost').textContent = st.trayNextCost !== null ? `UPGRADE (+1) · ₱${st.trayNextCost}` : '✓ MAXED';
      btnTray.classList.toggle('affordable', st.trayNextCost !== null && st.bank >= st.trayNextCost);
      btnTray.classList.toggle('maxed', st.trayNextCost === null);
    }
    if (btnStove) {
      document.getElementById('upgStoveLabel').textContent = `🔥 LUTUAN: ${st.stoveSpeed}×`;
      document.getElementById('upgStoveCost').textContent = st.stoveNextCost !== null ? `FASTER COOK · ₱${st.stoveNextCost}` : '✓ MAXED';
      btnStove.classList.toggle('affordable', st.stoveNextCost !== null && st.bank >= st.stoveNextCost);
      btnStove.classList.toggle('maxed', st.stoveNextCost === null);
    }
    if (btnStaff) {
      document.getElementById('upgStaffLabel').textContent = `🧑‍🍳 EMPLEYADO: ${st.staffLevel}/2`;
      document.getElementById('upgStaffCost').textContent = st.staffNextCost !== null ? `HIRE HELPER · ₱${st.staffNextCost}` : '✓ FULL TEAM';
      btnStaff.classList.toggle('affordable', st.staffNextCost !== null && st.bank >= st.staffNextCost);
      btnStaff.classList.toggle('maxed', st.staffNextCost === null);
    }
  }

  ['Tray', 'Stove', 'Staff'].forEach((name) => {
    const el = document.getElementById(`btnUpg${name}`);
    if (el) {
      el.addEventListener('click', () => {
        const ok = Karenderya.buyUpgrade(name.toLowerCase());
        syncKarenShopUI();
        if (ok) showToast(`✓ ${name} Upgraded!`, 1.8);
        else showToast('Earn more Kita ₱ by serving customers first!', 1.8);
      });
    }
  });

  function buildKarenderyaMap() {
    const container = document.getElementById('karenMapNodes');
    if (!container) return;
    container.innerHTML = '';
    Karenderya.LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      btn.className = `map-node${idx === selectedKarenLevel ? ' selected' : ''}`;
      btn.innerHTML = `
        <span class="map-node-num">${idx + 1}</span>
        <span class="map-node-icon">${lvl.icon || '🍲'}</span>
        <span class="map-node-title">${lvl.short}</span>
        <span class="map-node-sub">⏱️${lvl.timeLimit}s · ${lvl.customerGoal} Pax</span>
      `;
      btn.addEventListener('click', () => {
        selectedKarenLevel = idx;
        updateKarenderyaMapSelection();
      });
      container.appendChild(btn);
    });
    syncKarenShopUI();
    updateKarenderyaMapSelection();
  }

  function updateKarenderyaMapSelection() {
    const lvl = Karenderya.LEVELS[selectedKarenLevel] || Karenderya.LEVELS[0];
    document.querySelectorAll('#karenMapNodes .map-node').forEach((n, idx) => {
      n.classList.toggle('selected', idx === selectedKarenLevel);
    });
    document.getElementById('mapKarenName').textContent = `${lvl.name} · ${lvl.unlockText}`;
    document.getElementById('mapKarenDesc').textContent =
      `⏱️ ${lvl.timeLimit}s · Goal: Serve ${lvl.customerGoal} Customers & Earn ₱${lvl.salesGoal.toLocaleString()}! Dishes: ${lvl.dishes.map((d) => Karenderya.DISHES[d].emoji + ' ' + Karenderya.DISHES[d].name).join(', ')}.`;
  }

  function openLevelMapForSelectedGame() {
    streetMapView.classList.toggle('hidden', selectedGameMode !== 'street');
    jeepMapView.classList.toggle('hidden', selectedGameMode !== 'jeep');
    karenMapView.classList.toggle('hidden', selectedGameMode !== 'karenderya');
    if (vendorMapView) vendorMapView.classList.toggle('hidden', selectedGameMode !== 'vendor');

    if (selectedGameMode === 'street') {
      levelMapTitle.textContent = '🗺️ STREET PATROL — 8 PH LEVELS';
      buildStreetAdventureMap();
    } else if (selectedGameMode === 'jeep') {
      levelMapTitle.textContent = '🚐 THE JEEP RIDE — SELECT MODE';
    } else if (selectedGameMode === 'vendor') {
      levelMapTitle.textContent = '🧺 THE VENDOR — SELECT MODE';
    } else {
      levelMapTitle.textContent = '🍲 KARENDERYA MANIA — 5 LEVELS & SHOP';
      buildKarenderyaMap();
    }
    showFlowScreen(levelMapOverlay);
  }

  // Step 1 -> Step 2 (PLAY -> Select a Game)
  document.getElementById('btnPlayEntry').addEventListener('click', () => {
    SoundFX.unlock();
    showFlowScreen(selectGameOverlay);
  });
  document.getElementById('btnBackToTitle').addEventListener('click', () => showFlowScreen(titleOverlay));

  // Step 2 -> Step 3 (Select Game -> Player Visual Customizer)
  document.querySelectorAll('.game-select-card').forEach((card) => {
    card.addEventListener('click', () => {
      selectedGameMode = card.dataset.game || 'street';
      // Smart default visual suggestion per game (player can still customize every part!)
      if (selectedGameMode === 'jeep') applyCustomPreset('jersey');
      else if (selectedGameMode === 'karenderya') applyCustomPreset('manong');
      else applyCustomPreset('classic');
      showFlowScreen(customizerOverlay);
    });
  });
  document.getElementById('btnBackToGames').addEventListener('click', () => showFlowScreen(selectGameOverlay));

  // Step 3: Visual Customizer Pills & Presets
  document.querySelectorAll('.cust-pills').forEach((group) => {
    const part = group.dataset.part;
    group.querySelectorAll('.cust-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        playerCustom[part] = btn.dataset.val;
        syncCustomizerPills();
      });
    });
  });
  document.querySelectorAll('.preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => applyCustomPreset(chip.dataset.preset));
  });

  // Step 3 -> Step 4 (Player Customizer -> Level Map / Mode Select)
  document.getElementById('btnToLevelMap').addEventListener('click', openLevelMapForSelectedGame);
  document.getElementById('btnBackToCustom').addEventListener('click', () => showFlowScreen(customizerOverlay));

  // Step 4: Jeep Sub-Mode (Route vs Endless) + Vendor Sub-Mode (Balot vs Pandesal) + Launch Buttons
  document.querySelectorAll('.jeep-submode-card[data-jeepmode]').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.jeep-submode-card[data-jeepmode]').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      selectedJeepSubMode = card.dataset.jeepmode || 'route';
    });
  });

  const pandesalRoutePicker = document.getElementById('pandesalRoutePicker');
  const btnLaunchVendor = document.getElementById('btnLaunchVendor');
  document.querySelectorAll('.vendor-submode-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.vendor-submode-card').forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
      selectedVendorSubMode = card.dataset.vendormode || 'balot';
      if (pandesalRoutePicker) {
        pandesalRoutePicker.classList.toggle('hidden', selectedVendorSubMode !== 'pandesal');
      }
      if (btnLaunchVendor) {
        btnLaunchVendor.textContent = selectedVendorSubMode === 'balot'
          ? '🥚 START BALOT RUN!'
          : '🚲 SELL PANDESAL NOW!';
      }
    });
  });

  document.querySelectorAll('.pandesal-lvl-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pandesal-lvl-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPandesalLevel = Number(btn.dataset.plvl || 0);
    });
  });

  document.getElementById('btnLaunchStreet').addEventListener('click', () => {
    selectedGameMode = 'street';
    startGame(selectedStage);
  });
  document.getElementById('btnLaunchJeep').addEventListener('click', () => {
    selectedGameMode = 'jeep';
    startJeepRide(selectedJeepSubMode);
  });
  document.getElementById('btnLaunchKaren').addEventListener('click', () => {
    selectedGameMode = 'karenderya';
    startKarenderya(selectedKarenLevel);
  });
  if (btnLaunchVendor) {
    btnLaunchVendor.addEventListener('click', () => {
      selectedGameMode = 'vendor';
      startVendor(selectedVendorSubMode, selectedPandesalLevel);
    });
  }

  document.getElementById('btnHowTo').addEventListener('click', () => howToOverlay.classList.remove('hidden'));
  document.getElementById('btnCloseHowTo').addEventListener('click', () => howToOverlay.classList.add('hidden'));

  function pauseGame() {
    if (mode === 'playing') {
      mode = 'paused';
      if (activeGameMode === 'jeep') JeepRide.setPaused(true);
      if (activeGameMode === 'karenderya') Karenderya.setPaused(true);
      if (activeGameMode === 'vendor') VendorGame.setPaused(true);
      pauseOverlay.classList.remove('hidden');
      syncTouchControlsVisibility();
    }
  }
  document.getElementById('btnPause').addEventListener('click', pauseGame);
  document.getElementById('btnPauseJeep').addEventListener('click', pauseGame);
  const btnPauseKaren = document.getElementById('btnPauseKaren');
  if (btnPauseKaren) btnPauseKaren.addEventListener('click', pauseGame);
  const btnPauseVendor = document.getElementById('btnPauseVendor');
  if (btnPauseVendor) btnPauseVendor.addEventListener('click', pauseGame);

  const btnClearTray = document.getElementById('btnClearTray');
  if (btnClearTray) btnClearTray.addEventListener('click', () => Karenderya.clearTray());

  document.getElementById('btnResume').addEventListener('click', () => {
    if (mode === 'paused') {
      mode = 'playing';
      if (activeGameMode === 'jeep') JeepRide.setPaused(false);
      if (activeGameMode === 'karenderya') Karenderya.setPaused(false);
      if (activeGameMode === 'vendor') VendorGame.setPaused(false);
      pauseOverlay.classList.add('hidden');
      syncTouchControlsVisibility();
      requestAnimationFrame(resizeGameCanvas);
    }
  });

  function restartCurrentMode() {
    if (activeGameMode === 'jeep') {
      startJeepRide(selectedJeepSubMode);
      return;
    }
    if (activeGameMode === 'karenderya') {
      startKarenderya(selectedKarenLevel);
      return;
    }
    if (activeGameMode === 'vendor') {
      startVendor(selectedVendorSubMode, selectedPandesalLevel);
      return;
    }
    loadStage(currentStageIndex, false);
    mode = 'playing';
    hideAllOverlays();
    syncTouchControlsVisibility();
    requestAnimationFrame(resizeGameCanvas);
    SoundFX.startBGM();
  }

  document.getElementById('btnRestartPause').addEventListener('click', restartCurrentMode);

  function returnToTitle() {
    SoundFX.stopBGM();
    JeepRide.stop();
    Karenderya.stop();
    VendorGame.stop();
    mode = 'title';
    hideAllOverlays();
    hud.classList.add('hidden');
    jeepHud.classList.add('hidden');
    karenderyaHud.classList.add('hidden');
    if (vendorHud) vendorHud.classList.add('hidden');
    bossBar.classList.add('hidden');
    toastBanner.classList.add('hidden');
    titleOverlay.classList.remove('hidden');
    syncTouchControlsVisibility();
    updateHighScoreUI();
  }

  function returnToLevelMap() {
    SoundFX.stopBGM();
    JeepRide.stop();
    Karenderya.stop();
    VendorGame.stop();
    mode = 'title';
    hud.classList.add('hidden');
    jeepHud.classList.add('hidden');
    karenderyaHud.classList.add('hidden');
    if (vendorHud) vendorHud.classList.add('hidden');
    bossBar.classList.add('hidden');
    toastBanner.classList.add('hidden');
    syncTouchControlsVisibility();
    openLevelMapForSelectedGame();
  }

  document.getElementById('btnQuitTitle').addEventListener('click', returnToTitle);
  document.getElementById('btnMenuOver').addEventListener('click', returnToTitle);
  document.getElementById('btnMapFromPause').addEventListener('click', returnToLevelMap);
  document.getElementById('btnMapFromClear').addEventListener('click', returnToLevelMap);
  document.getElementById('btnMapFromOver').addEventListener('click', returnToLevelMap);

  document.getElementById('btnNextStage').addEventListener('click', () => {
    if (activeGameMode === 'karenderya') {
      if (selectedKarenLevel + 1 < Karenderya.LEVELS.length) {
        startKarenderya(selectedKarenLevel + 1);
      }
      return;
    }
    if (activeGameMode === 'vendor') {
      if (selectedVendorSubMode === 'pandesal' && selectedPandesalLevel + 1 < VendorGame.PANDESAL_LEVELS.length) {
        startVendor('pandesal', selectedPandesalLevel + 1);
      }
      return;
    }
    if (currentStageIndex + 1 < Levels.count) {
      document.getElementById('btnNextStage').textContent = 'NEXT LEVEL ➔';
      selectedStage = currentStageIndex + 1;
      loadStage(currentStageIndex + 1, true);
      mode = 'playing';
      hideAllOverlays();
      syncTouchControlsVisibility();
      requestAnimationFrame(resizeGameCanvas);
      SoundFX.startBGM();
    }
  });

  document.getElementById('btnReplayClear').addEventListener('click', restartCurrentMode);
  document.getElementById('btnRetry').addEventListener('click', restartCurrentMode);

  const btnSound = document.getElementById('btnSound');
  const btnSoundJeep = document.getElementById('btnSoundJeep');
  const btnSoundKaren = document.getElementById('btnSoundKaren');
  const btnSoundVendor = document.getElementById('btnSoundVendor');
  function toggleGameSound() {
    SoundFX.unlock();
    const muted = SoundFX.toggleMute();
    const icon = muted ? '🔇' : '🔊';
    btnSound.textContent = icon;
    if (btnSoundJeep) btnSoundJeep.textContent = icon;
    if (btnSoundKaren) btnSoundKaren.textContent = icon;
    if (btnSoundVendor) btnSoundVendor.textContent = icon;
  }
  btnSound.addEventListener('click', toggleGameSound);
  if (btnSoundJeep) btnSoundJeep.addEventListener('click', toggleGameSound);
  if (btnSoundKaren) btnSoundKaren.addEventListener('click', toggleGameSound);
  if (btnSoundVendor) btnSoundVendor.addEventListener('click', toggleGameSound);

  // Direct Canvas Pointer Handler (Karenderya Tap + Balot Runner Swipe!)
  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeActive = false;
  canvas.addEventListener('pointerdown', (ev) => {
    if (mode !== 'playing') return;
    if (activeGameMode === 'karenderya') {
      ev.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = ((ev.clientX - rect.left) / rect.width) * W;
      const cy = ((ev.clientY - rect.top) / rect.height) * H;
      Karenderya.handleCanvasPointer(cx, cy);
      return;
    }
    if (activeGameMode === 'vendor' && VendorGame.getSubMode() === 'balot') {
      swipeStartX = ev.clientX;
      swipeStartY = ev.clientY;
      swipeActive = true;
    }
  });
  canvas.addEventListener('pointerup', (ev) => {
    if (!swipeActive || activeGameMode !== 'vendor' || mode !== 'playing') return;
    swipeActive = false;
    const dx = ev.clientX - swipeStartX;
    const dy = ev.clientY - swipeStartY;
    if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) {
      VendorGame.balotMoveLane(dx > 0 ? 1 : -1);
    } else if (dy < -28) {
      VendorGame.balotJump();
    }
  });

  // HORIZONTAL FORWARD / BACKWARD-ONLY VIRTUAL JOYSTICK (Same clean 1D slider for BOTH Street Patrol & Jeep Ride!)
  function bindHorizontalJoystick(trackEl, knobEl, onMoveX, onRelease) {
    if (!trackEl || !knobEl) return;
    let pointerId = null;

    function updateStick(clientX) {
      const rect = trackEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const maxX = Math.max(24, rect.width / 2 - 28);
      let dx = clientX - cx;
      dx = Math.max(-maxX, Math.min(maxX, dx));
      knobEl.style.transform = `translate(${dx.toFixed(1)}px, 0px)`;
      onMoveX(dx / maxX);
    }

    function resetStick() {
      pointerId = null;
      trackEl.classList.remove('active');
      knobEl.style.transform = 'translate(0px, 0px)';
      onRelease();
    }

    trackEl.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      pointerId = ev.pointerId;
      trackEl.classList.add('active');
      if (trackEl.setPointerCapture) {
        try { trackEl.setPointerCapture(pointerId); } catch (_) {}
      }
      updateStick(ev.clientX);
    });

    trackEl.addEventListener('pointermove', (ev) => {
      if (ev.pointerId !== pointerId) return;
      ev.preventDefault();
      updateStick(ev.clientX);
    });

    const end = (ev) => {
      if (ev.pointerId !== pointerId) return;
      ev.preventDefault();
      resetStick();
    };
    trackEl.addEventListener('pointerup', end);
    trackEl.addEventListener('pointercancel', end);
  }

  // Street Patrol Forward/Backward-Only Joystick
  bindHorizontalJoystick(
    document.getElementById('streetJoystick'),
    document.getElementById('streetJoyKnob'),
    (nx) => {
      keys.left = nx < -0.2;
      keys.right = nx > 0.2;
    },
    () => {
      keys.left = false;
      keys.right = false;
    }
  );

  // The Jeep Ride Forward/Backward-Only Joystick (same horizontal feel as Street Patrol!)
  bindHorizontalJoystick(
    document.getElementById('jeepJoystick'),
    document.getElementById('jeepJoyKnob'),
    (nx) => {
      jeepKeys.joyX = nx;
    },
    () => {
      jeepKeys.joyX = 0;
    }
  );

  // The Vendor Forward/Backward-Only Horizontal Joystick (Balot Lane Switch / Pandesal Bike Pedal!)
  bindHorizontalJoystick(
    document.getElementById('vendorJoystick'),
    document.getElementById('vendorJoyKnob'),
    (nx) => {
      vendorKeys.joyX = nx;
    },
    () => {
      vendorKeys.joyX = 0;
    }
  );

  // Vendor Right-Hand Touch Controls (Balot Jump OR Pandesal Sell & Shout!)
  if (vendorTouchControls) {
    vendorTouchControls.querySelectorAll('.touch-btn').forEach((btn) => {
      const action = btn.dataset.vendor;
      const press = (ev) => {
        ev.preventDefault();
        btn.classList.add('pressed');
        if (action === 'jump') VendorGame.balotJump();
        if (action === 'sell') vendorKeys.brake = true;
        if (action === 'shout') VendorGame.pandesalShout();
      };
      const release = (ev) => {
        ev.preventDefault();
        btn.classList.remove('pressed');
        if (action === 'sell') vendorKeys.brake = false;
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
    });
  }

  // Touch Controls Toggle + Responsive Resize Handlers
  window.addEventListener('resize', resizeGameCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeGameCanvas, 120));
  resizeGameCanvas();

  document.getElementById('btnToggleTouch').addEventListener('click', () => {
    const activePad = activeGameMode === 'jeep'
      ? jeepTouchControls
      : activeGameMode === 'vendor'
      ? vendorTouchControls
      : touchControls;
    const currentlyHidden = activePad ? activePad.classList.contains('hidden') : true;
    manualTouchOverride = currentlyHidden;
    syncTouchControlsVisibility();
  });

  // Jeep Ride Right-Hand Touch Controls (UP / DOWN lane switches + STOP + BEEP!)
  if (jeepTouchControls) {
    jeepTouchControls.querySelectorAll('.touch-btn').forEach((btn) => {
      const action = btn.dataset.jeep;
      const press = (ev) => {
        ev.preventDefault();
        btn.classList.add('pressed');
        if (action === 'up') JeepRide.moveLane(-1);
        if (action === 'down') JeepRide.moveLane(1);
        if (action === 'brake') jeepKeys.brake = true;
        if (action === 'horn') JeepRide.honkHorn();
      };
      const release = (ev) => {
        ev.preventDefault();
        btn.classList.remove('pressed');
        if (action === 'brake') jeepKeys.brake = false;
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
    });
  }

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
    renderPreviewHero();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
