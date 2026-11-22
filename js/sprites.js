// Cartoon Chibi Characters & Philippine Streets Canvas Renderer
const Sprites = (() => {
  const INK = '#111827';

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

  // ==================== HERO: CARTOON CHIBI MAN (BLACK SHIRT & MAONG PANTS) ====================
  function drawHero(ctx, p, time) {
    ctx.save();

    // Invulnerability blink
    if (p.invulnTimer > 0 && Math.floor(p.invulnTimer * 18) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const cx = p.x + p.w / 2;
    const bottom = p.y + p.h;
    ctx.translate(cx, bottom);
    ctx.scale(p.facing, 1);

    const moving = Math.abs(p.vx) > 25 && p.onGround;
    const walkPhase = moving ? Math.sin(time * 16) : 0;
    const bob = p.onGround ? (moving ? Math.abs(Math.sin(time * 16)) * -3.5 : Math.sin(time * 4.5) * 1.4) : 0;
    const punchProgress = p.punchTimer > 0 ? p.punchTimer / p.punchDuration : 0;
    const isPunching = punchProgress > 0;
    const isShooting = p.shootFlashTimer > 0;

    // Ground shadow
    if (p.onGround) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle golden energy aura when energy is full
    if (p.energy >= p.maxEnergy * 0.99 && !isPunching) {
      ctx.save();
      ctx.strokeStyle = `rgba(253, 224, 71, ${0.28 + Math.sin(time * 8) * 0.14})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, -32 + bob, 24, 30, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Slight forward lean while running or punching
    const lean = isPunching ? 0.16 : moving ? 0.08 : 0;
    ctx.rotate(lean);

    // ---- BACK ARM (black t-shirt sleeve + tan forearm) ----
    ctx.save();
    const backArmSwing = p.onGround ? -walkPhase * 0.6 : -0.5;
    ctx.translate(-7, -26 + bob);
    ctx.rotate(backArmSwing);
    // Sleeve
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    roundRect(ctx, -5, -2, 9, 10, 4);
    ctx.fill();
    ctx.stroke();
    // Forearm & hand
    ctx.fillStyle = '#f2b88a';
    roundRect(ctx, -4, 6, 7, 8, 3.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ---- LEGS: BLUE MAONG DENIM PANTS + CUFFS + SNEAKERS ----
    const leftLegAngle = p.onGround ? walkPhase * 0.55 : -0.35;
    const rightLegAngle = p.onGround ? -walkPhase * 0.55 : 0.45;

    function drawMaongLeg(offsetX, angle, isFront) {
      ctx.save();
      ctx.translate(offsetX, -19 + bob);
      ctx.rotate(angle);

      // Denim pants leg
      ctx.fillStyle = isFront ? '#2563eb' : '#1d4ed8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      roundRect(ctx, -6, 0, 12, 13, 4);
      ctx.fill();
      ctx.stroke();

      // Denim gold side stitching
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(2, 9);
      ctx.stroke();

      // Cuffed maong hem (classic folded jeans cuff!)
      ctx.fillStyle = '#93c5fd';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      roundRect(ctx, -6.5, 9.5, 13, 4, 2);
      ctx.fill();
      ctx.stroke();

      // White sneaker with red accent
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.3;
      roundRect(ctx, -5, 12.5, 15, 7, 3.5);
      ctx.fill();
      ctx.stroke();

      // Red sneaker stripe
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, 14.5, 6, 2.5);
      ctx.restore();
    }

    drawMaongLeg(-5, leftLegAngle, false);
    drawMaongLeg(5, rightLegAngle, true);

    // ---- TORSO: BLACK T-SHIRT + MAONG WAISTBAND ----
    ctx.save();
    ctx.translate(0, -29 + bob);

    // Maong denim belt/waistband peek
    ctx.fillStyle = '#1e40af';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    roundRect(ctx, -11.5, 9, 23, 6, 3);
    ctx.fill();
    ctx.stroke();

    // Black crew-neck t-shirt body
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    roundRect(ctx, -12.5, -5, 25, 17, 6);
    ctx.fill();
    ctx.stroke();

    // Subtle fabric highlight on black shirt so folds read clearly
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(-4, 1, 5, 2.2, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Crew-neck collar
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -4, 5.5, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.restore();

    // ---- CHIBI HEAD ----
    ctx.save();
    ctx.translate(1, -46 + bob);

    // Ear
    ctx.fillStyle = '#e5a373';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(-15, 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Round chibi face
    ctx.fillStyle = '#f5be93';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 1, 17, 15.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rosy chibi cheek
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.beginPath();
    ctx.ellipse(9, 5, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Expressive big chibi eyes
    const eyeY = isPunching ? 1 : 0.5;
    // Left eye
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.ellipse(-1.5, eyeY, 2.7, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-0.5, eyeY - 1.3, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.ellipse(8.5, eyeY, 2.9, 3.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(9.5, eyeY - 1.3, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (determined when punching/shooting!)
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    if (isPunching || isShooting) {
      ctx.beginPath();
      ctx.moveTo(-5, -5.5);
      ctx.lineTo(1.5, -3.5);
      ctx.moveTo(12, -5.5);
      ctx.lineTo(5.5, -3.5);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-4.5, -5.5);
      ctx.lineTo(1, -5.5);
      ctx.moveTo(5.5, -5.5);
      ctx.lineTo(11.5, -5.5);
      ctx.stroke();
    }

    // Mouth (battle shout when punching, confident grin otherwise)
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2.2;
    if (isPunching) {
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(4.5, 8, 4, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(4, 5.5, 4.5, 0.15, Math.PI - 0.2);
      ctx.stroke();
    }

    // Spiky cartoon dark hair
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(-17, 1);
    ctx.quadraticCurveTo(-20, -11, -10, -15);
    ctx.lineTo(-12, -21);
    ctx.lineTo(-3, -17);
    ctx.lineTo(2, -23);
    ctx.lineTo(7, -17);
    ctx.lineTo(15, -20);
    ctx.lineTo(14, -12);
    ctx.quadraticCurveTo(20, -9, 16, -2);
    ctx.quadraticCurveTo(10, -10, 4, -7);
    ctx.quadraticCurveTo(-2, -12, -7, -6);
    ctx.quadraticCurveTo(-13, -9, -15, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hair highlight shine
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.ellipse(-2, -13, 6, 2.2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ---- FRONT ARM: PUNCHING OR HOLDING OBTAINED GUN OR RUNNING ----
    ctx.save();
    ctx.translate(6, -26 + bob);

    if (isPunching) {
      // Extended energy-charged cartoon punch!
      const thrust = Math.sin(punchProgress * Math.PI) * 24;
      // Black sleeve
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -3, -4, 11, 9, 4);
      ctx.fill();
      ctx.stroke();

      // Extended forearm
      ctx.fillStyle = '#f2b88a';
      roundRect(ctx, 5, -3.5, 8 + thrust * 0.65, 7, 3);
      ctx.fill();
      ctx.stroke();

      // Glowing yellow energy fist!
      const fistX = 14 + thrust;
      ctx.save();
      ctx.fillStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.beginPath();
      ctx.arc(fistX, 0, 15, 0, Math.PI * 2);
      ctx.fill();

      // Fist body
      ctx.fillStyle = '#f5be93';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(fistX, 0, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Energy crescent shockwave
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(fistX + 4, 0, 15, -Math.PI * 0.42, Math.PI * 0.42);
      ctx.stroke();
      ctx.restore();
    } else if (p.weapon && p.ammo > 0) {
      // Holding obtained gun!
      const recoil = isShooting ? -4 : 0;
      ctx.translate(recoil, 0);

      // Sleeve + arm holding gun
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -3, -3, 10, 8, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f2b88a';
      roundRect(ctx, 5, -2.5, 9, 6.5, 3);
      ctx.fill();
      ctx.stroke();

      // Gun sprite (Street Pistol vs Heavy Spread Blaster)
      if (p.weapon === 'pistol') {
        // Grip
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.2;
        roundRect(ctx, 11, 0, 5, 9, 2);
        ctx.fill();
        ctx.stroke();
        // Slide / Barrel
        ctx.fillStyle = '#60a5fa';
        roundRect(ctx, 10, -5, 16, 7.5, 2.5);
        ctx.fill();
        ctx.stroke();
        // Orange arcade tip
        ctx.fillStyle = '#f97316';
        ctx.fillRect(23, -4, 3.5, 5.5);
      } else {
        // Spread Blaster (bigger gold/red street blaster)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.3;
        roundRect(ctx, 10, 0, 6, 9, 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        roundRect(ctx, 9, -6.5, 21, 10, 3);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fde047';
        ctx.fillRect(14, -4, 9, 4);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(27, -5.5, 4, 8);
      }

      // Muzzle flash!
      if (isShooting) {
        const mx = p.weapon === 'pistol' ? 30 : 34;
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mx - 2, -2);
        ctx.lineTo(mx + 12, -9);
        ctx.lineTo(mx + 8, -2);
        ctx.lineTo(mx + 15, 0);
        ctx.lineTo(mx + 8, 2);
        ctx.lineTo(mx + 11, 8);
        ctx.lineTo(mx - 2, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else {
      // Normal arm swing
      const armSwing = p.onGround ? walkPhase * 0.65 : -0.6;
      ctx.rotate(armSwing);
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -4, -2, 9, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f2b88a';
      roundRect(ctx, -3, 6, 7, 8, 3.5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  // ==================== THIEF ENEMIES ====================
  function drawEnemy(ctx, e, time) {
    ctx.save();
    const cx = e.x + e.w / 2;
    const bottom = e.y + e.h;
    ctx.translate(cx, bottom);

    if (e.dead) {
      ctx.rotate(e.deathSpin || 0);
      ctx.globalAlpha = Math.max(0, e.deathTimer / 0.55);
    }

    const scale = e.type === 'boss' ? 1.55 : e.type === 'thug' ? 1.12 : 1.0;
    ctx.scale(e.facing * scale, scale);

    if (e.hurtFlash > 0) {
      ctx.filter = 'brightness(1.85)';
    }

    const step = Math.sin(time * (e.type === 'runner' ? 18 : 11) + e.seed);
    const bob = e.onGround ? Math.abs(step) * -3 : 0;

    // Shadow
    if (e.onGround && !e.dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 16, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Loot sack on back (signature thief detail!)
    ctx.save();
    ctx.translate(-13, -24 + bob);
    ctx.rotate(-0.2 + step * 0.08);
    ctx.fillStyle = '#d6b47c';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.ellipse(0, 2, 10, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Sack tie
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-3, -11, 6, 4);
    // Peso symbol on loot bag
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('₱', 0, 6);
    ctx.restore();

    // Legs
    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    // Left leg
    ctx.save();
    ctx.translate(-5, -16 + bob);
    ctx.rotate(step * 0.5);
    roundRect(ctx, -4.5, 0, 9, 15, 3.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // Right leg
    ctx.save();
    ctx.translate(5, -16 + bob);
    ctx.rotate(-step * 0.5);
    roundRect(ctx, -4.5, 0, 9, 15, 3.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Torso (striped burglar shirt for snatcher/boss, dark hoodie for runner, maroon vest for thug)
    ctx.save();
    ctx.translate(0, -28 + bob);
    if (e.type === 'runner') {
      ctx.fillStyle = '#312e81';
    } else if (e.type === 'thug') {
      ctx.fillStyle = '#7f1d1d';
    } else {
      ctx.fillStyle = '#f8fafc';
    }
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    roundRect(ctx, -11.5, -3, 23, 17, 5);
    ctx.fill();
    ctx.stroke();

    if (e.type === 'snatcher' || e.type === 'boss') {
      // Classic horizontal burglar stripes
      ctx.fillStyle = '#111827';
      ctx.fillRect(-10.5, 0, 21, 3.2);
      ctx.fillRect(-10.5, 6, 21, 3.2);
      ctx.fillRect(-10.5, 11.5, 21, 2.2);
    }

    if (e.type === 'boss') {
      // Gold chain!
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(1, 0, 7, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
    ctx.restore();

    // Chibi Thief Head
    ctx.save();
    ctx.translate(1, -43 + bob);

    ctx.fillStyle = '#ebb086';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.ellipse(0, 1, 15.5, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Black burglar domino mask!
    ctx.fillStyle = '#111827';
    roundRect(ctx, -11, -5, 25, 8.5, 4);
    ctx.fill();

    // Sneaky white eyes inside mask
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-1, -0.5, 2.8, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(8.5, -0.5, 2.8, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = e.type === 'boss' ? '#ef4444' : '#111827';
    ctx.beginPath();
    ctx.arc(0, -0.5, 1.3, 0, Math.PI * 2);
    ctx.arc(9.5, -0.5, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Sneaky smirk
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, 7.5);
    ctx.quadraticCurveTo(5, 9.5, 9.5, 6);
    ctx.stroke();

    // Headgear: beanie / bandana / boss crown
    if (e.type === 'boss') {
      // Red bandana + golden crown
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, -5, 15.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-9, -14);
      ctx.lineTo(-11, -24);
      ctx.lineTo(-4, -19);
      ctx.lineTo(0, -27);
      ctx.lineTo(4, -19);
      ctx.lineTo(11, -24);
      ctx.lineTo(9, -14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (e.type === 'runner') {
      // Backward street cap
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, -5, 15, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, -22, -9, 12, 4.5, 2);
      ctx.fill();
      ctx.stroke();
    } else {
      // Classic burglar knit beanie
      ctx.fillStyle = e.type === 'thug' ? '#374151' : '#1f2937';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -6, 15.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Beanie cuff
      ctx.fillStyle = e.type === 'thug' ? '#f59e0b' : '#ef4444';
      roundRect(ctx, -16, -10, 32, 5.5, 2.5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Front sneaky arm (holds crowbar/bottle for thug)
    ctx.save();
    ctx.translate(7, -24 + bob);
    ctx.rotate(-0.35 + step * 0.35);
    ctx.fillStyle = e.type === 'runner' ? '#312e81' : '#111827';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    roundRect(ctx, -3, -2, 8, 12, 3.5);
    ctx.fill();
    ctx.stroke();
    if (e.type === 'thug') {
      // Green bottle
      ctx.fillStyle = '#22c55e';
      roundRect(ctx, 2, 4, 6, 12, 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Mini HP bar for tougher enemies (non-boss with hp > 1)
    if (!e.dead && e.type !== 'boss' && e.maxHp > 1 && e.hp < e.maxHp) {
      ctx.scale(e.facing, 1); // unflip bar
      const bw = 30;
      ctx.fillStyle = '#111827';
      ctx.fillRect(-bw / 2, -66, bw, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-bw / 2 + 1, -65, (bw - 2) * (e.hp / e.maxHp), 4);
    }

    ctx.restore();
  }

  // ==================== PH STREET PARALLAX BACKGROUND ====================
  function drawBackground(ctx, width, height, camX, theme, time) {
    // 1. Sky gradient by stage theme
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    if (theme === 'sunset') {
      sky.addColorStop(0, '#4c1d95');
      sky.addColorStop(0.38, '#ea580c');
      sky.addColorStop(0.75, '#fbbf24');
      sky.addColorStop(1, '#fef08a');
    } else if (theme === 'night') {
      sky.addColorStop(0, '#090d1f');
      sky.addColorStop(0.55, '#1e1b4b');
      sky.addColorStop(1, '#312e81');
    } else {
      // Sunny Manila Kalye
      sky.addColorStop(0, '#2563eb');
      sky.addColorStop(0.45, '#38bdf8');
      sky.addColorStop(0.85, '#bae6fd');
      sky.addColorStop(1, '#fef9c3');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Sun or Moon + stars
    if (theme === 'night') {
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath();
      ctx.arc(width - 140, 92, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090d1f';
      ctx.beginPath();
      ctx.arc(width - 126, 86, 30, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars
      for (let i = 0; i < 36; i++) {
        const sx = ((i * 173) % width);
        const sy = 25 + ((i * 71) % 190);
        const alpha = 0.4 + Math.sin(time * 3 + i) * 0.4;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(sx, sy, 2.5, 2.5);
      }
    } else {
      const sunY = theme === 'sunset' ? 185 : 95;
      const sunGrad = ctx.createRadialGradient(width - 160, sunY, 10, width - 160, sunY, 95);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.45, 'rgba(253, 224, 71, 0.55)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(width - 160, sunY, 95, 0, Math.PI * 2);
      ctx.fill();

      // Cartoon puffy clouds
      const cloudScroll = (camX * 0.12) % 360;
      for (let x = -cloudScroll; x < width + 220; x += 260) {
        drawCloud(ctx, x, 70 + (Math.abs(Math.floor(x / 260)) % 2) * 35, theme === 'sunset' ? '#fed7aa' : '#ffffff');
      }
    }

    // 2. Distant Manila Skyline & LRT Viaduct (0.18x parallax)
    const farScroll = camX * 0.18;
    const farColor = theme === 'night' ? '#131633' : theme === 'sunset' ? '#7c2d12' : '#60a5fa';
    const farWin = theme === 'night' ? '#fde047' : theme === 'sunset' ? '#fdba74' : '#dbeafe';
    for (let i = -1; i < 12; i++) {
      const bx = i * 140 - (farScroll % 140);
      const bh = 130 + ((Math.abs(i * 37) % 5) * 36);
      const by = height - 120 - bh;
      ctx.fillStyle = farColor;
      ctx.fillRect(bx, by, 108, bh + 40);
      // Windows
      ctx.fillStyle = farWin;
      for (let wy = by + 16; wy < height - 140; wy += 24) {
        for (let wx = bx + 14; wx < bx + 94; wx += 22) {
          if ((wx + wy) % 3 !== 0) ctx.fillRect(wx, wy, 10, 12);
        }
      }
    }

    // 3. Midground Philippine Neighborhood Houses & Shops (0.38x parallax)
    const midScroll = camX * 0.38;
    const shopSpacing = 320;
    const startIdx = Math.floor(midScroll / shopSpacing) - 1;
    for (let i = startIdx; i < startIdx + 6; i++) {
      const sx = i * shopSpacing - midScroll;
      drawMidgroundBuilding(ctx, sx, height - 110, Math.abs(i), theme);
    }

    // 4. Overhead Meralco Utility Poles, Sagging Wires & Fiesta Banderitas! (0.68x parallax)
    const poleSpacing = 340;
    const poleScroll = camX * 0.68;
    const pStart = Math.floor(poleScroll / poleSpacing) - 1;
    const polePositions = [];
    for (let i = pStart; i < pStart + 6; i++) {
      const px = i * poleSpacing - poleScroll;
      polePositions.push(px);
      drawUtilityPole(ctx, px, height - 92, theme);
    }

    // Sagging tangled electric wires + colorful Filipino Fiesta Banderitas between poles
    const flagColors = ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#ec4899', '#f97316'];
    for (let i = 0; i < polePositions.length - 1; i++) {
      const x1 = polePositions[i];
      const x2 = polePositions[i + 1];
      const topY = height - 355;

      // Electric wires
      ctx.strokeStyle = theme === 'night' ? '#334155' : '#1e293b';
      ctx.lineWidth = 2;
      for (let w = 0; w < 2; w++) {
        ctx.beginPath();
        ctx.moveTo(x1, topY + w * 14);
        ctx.quadraticCurveTo((x1 + x2) / 2, topY + 26 + w * 18, x2, topY + w * 14);
        ctx.stroke();
      }

      // Fiesta banderitas string
      const bY = topY + 38;
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x1, bY);
      ctx.quadraticCurveTo((x1 + x2) / 2, bY + 42, x2, bY);
      ctx.stroke();

      const steps = 11;
      for (let f = 1; f < steps; f++) {
        const t = f / steps;
        const fx = x1 + (x2 - x1) * t;
        const fy = bY + 4 * t * (1 - t) * 42;
        const flutter = Math.sin(time * 5 + f + i) * 2.5;
        ctx.fillStyle = flagColors[(f + i) % flagColors.length];
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(fx - 7, fy);
        ctx.lineTo(fx + 7, fy + 1);
        ctx.lineTo(fx + flutter, fy + 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  function drawCloud(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.arc(x + 24, y - 10, 28, 0, Math.PI * 2);
    ctx.arc(x + 52, y - 4, 24, 0, Math.PI * 2);
    ctx.arc(x + 74, y + 6, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawUtilityPole(ctx, x, groundY, theme) {
    // Concrete pole
    ctx.fillStyle = theme === 'night' ? '#475569' : '#94a3b8';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.fillRect(x - 7, groundY - 285, 14, 285);
    ctx.strokeRect(x - 7, groundY - 285, 14, 285);

    // Crossbar
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 28, groundY - 270, 56, 8);
    ctx.strokeRect(x - 28, groundY - 270, 56, 8);

    // Street lamp glow at night
    if (theme === 'night') {
      const lamp = ctx.createRadialGradient(x + 22, groundY - 252, 4, x + 22, groundY - 252, 85);
      lamp.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      lamp.addColorStop(0.35, 'rgba(251, 191, 36, 0.25)');
      lamp.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = lamp;
      ctx.beginPath();
      ctx.arc(x + 22, groundY - 252, 85, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMidgroundBuilding(ctx, x, groundY, seed, theme) {
    const isSariSari = seed % 2 === 0;
    const isNight = theme === 'night';

    if (isSariSari) {
      // Iconic Philippine Sari-Sari Store!
      const w = 190;
      const h = 155;
      const y = groundY - h;

      // Wall
      ctx.fillStyle = isNight ? '#334155' : seed % 4 === 0 ? '#fef3c7' : '#dcfce7';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // Upper corrugated roof / awning
      ctx.fillStyle = seed % 4 === 0 ? '#dc2626' : '#0284c7';
      ctx.beginPath();
      ctx.moveTo(x - 10, y + 32);
      ctx.lineTo(x + 8, y - 6);
      ctx.lineTo(x + w - 8, y - 6);
      ctx.lineTo(x + w + 10, y + 32);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Signboard
      ctx.fillStyle = '#facc15';
      roundRect(ctx, x + 20, y + 2, w - 40, 24, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(seed % 4 === 0 ? 'SARI-SARI STORE' : 'CARINDERIA · KAPE', x + w / 2, y + 18);

      // Counter window with iron grilles & colorful snack packs!
      ctx.fillStyle = isNight ? '#fbbf24' : '#1e293b';
      ctx.fillRect(x + 24, y + 48, 108, 62);
      ctx.strokeRect(x + 24, y + 48, 108, 62);

      // Hanging chichirya snack packets
      const snackColors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#f97316'];
      for (let s = 0; s < 5; s++) {
        ctx.fillStyle = snackColors[s];
        ctx.fillRect(x + 32 + s * 19, y + 54, 13, 18);
        ctx.strokeRect(x + 32 + s * 19, y + 54, 13, 18);
      }

      // Counter ledge
      ctx.fillStyle = '#92400e';
      ctx.fillRect(x + 18, y + 108, 120, 10);
      ctx.strokeRect(x + 18, y + 108, 120, 10);

      // Mini "ICE WATER" poster
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(x + 142, y + 55, 36, 46);
      ctx.strokeRect(x + 142, y + 55, 36, 46);
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 9px Nunito, sans-serif';
      ctx.fillText('ICE', x + 160, y + 73);
      ctx.fillText('WATER', x + 160, y + 84);
      ctx.fillText('₱2', x + 160, y + 95);
    } else {
      // Two-story Barangay concrete shophouse / Bakery / Vulcanizing
      const w = 175;
      const h = 210;
      const y = groundY - h;
      ctx.fillStyle = isNight ? '#1e293b' : '#fde68a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      // Upper balcony windows
      ctx.fillStyle = isNight ? '#fde047' : '#38bdf8';
      ctx.fillRect(x + 22, y + 26, 48, 42);
      ctx.strokeRect(x + 22, y + 26, 48, 42);
      ctx.fillRect(x + 102, y + 26, 48, 42);
      ctx.strokeRect(x + 102, y + 26, 48, 42);

      // Ground shop awning
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - 6, y + 96, w + 12, 24);
      ctx.strokeRect(x - 6, y + 96, w + 12, 24);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(seed % 3 === 0 ? 'PANADERIA · TAHO' : 'BARANGAY HALL', x + w / 2, y + 112);

      // Roll-up shutter door
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 30, y + 128, 115, 82);
      ctx.strokeRect(x + 30, y + 128, 115, 82);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      for (let ly = y + 140; ly < y + 206; ly += 12) {
        ctx.beginPath();
        ctx.moveTo(x + 32, ly);
        ctx.lineTo(x + 143, ly);
        ctx.stroke();
      }
    }
  }

  // ==================== STREET GROUND & PLATFORMS ====================
  function drawPlatform(ctx, plat) {
    ctx.save();
    const { x, y, w, h, style } = plat;

    if (style === 'jeepney') {
      drawJeepneyPlatform(ctx, x, y, w, h, plat.route || 'CUBAO · QUIAPO', plat.color || '#ef4444');
      ctx.restore();
      return;
    }

    if (style === 'tricycle') {
      drawTricyclePlatform(ctx, x, y, w, h);
      ctx.restore();
      return;
    }

    if (style === 'street') {
      // Concrete Philippine sidewalk curb + dark asphalt kalye road!
      // Curb top strip (yellow/black Manila sidewalk curb paint)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x, y, w, 16);

      // Alternating yellow-black street curb blocks
      for (let cx = x; cx < x + w; cx += 48) {
        ctx.fillStyle = Math.floor(cx / 48) % 2 === 0 ? '#facc15' : '#1e293b';
        ctx.fillRect(cx, y + 10, Math.min(48, x + w - cx), 8);
      }

      // Asphalt street body
      ctx.fillStyle = '#334155';
      ctx.fillRect(x, y + 18, w, h - 18);

      // Road lane dashed line
      ctx.fillStyle = '#f8fafc';
      for (let lx = x + 20; lx < x + w - 20; lx += 76) {
        ctx.fillRect(lx, y + 44, 38, 6);
      }

      // Top crisp cartoon outline
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
    } else {
      // Elevated wooden market awning / footbridge / steel scaffold platform
      ctx.fillStyle = style === 'bridge' ? '#64748b' : '#b45309';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, w, h, 7);
      ctx.fill();
      ctx.stroke();

      // Top trim highlight
      ctx.fillStyle = style === 'bridge' ? '#facc15' : '#f59e0b';
      ctx.fillRect(x + 4, y + 3, w - 8, 6);

      // Bolts / wood grain
      ctx.fillStyle = INK;
      for (let bx = x + 16; bx < x + w - 12; bx += 36) {
        ctx.beginPath();
        ctx.arc(bx, y + h / 2 + 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawJeepneyPlatform(ctx, x, y, w, h, route, bodyColor) {
    // Classic Philippine Jeepney! Roof (y) is the bouncy jumpable surface!
    const bodyTop = y + 2;
    const wheelY = y + h - 8;

    // Main roof + body
    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, x + 6, bodyTop, w - 34, h - 14, 12);
    ctx.fill();
    ctx.stroke();

    // Front chrome hood (classic Sarao Jeepney nose!)
    ctx.fillStyle = '#e2e8f0';
    roundRect(ctx, x + w - 36, bodyTop + 26, 36, h - 40, 8);
    ctx.fill();
    ctx.stroke();

    // Decorative yellow & blue stripes
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 10, bodyTop + 42, w - 42, 11);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(x + 10, bodyTop + 53, w - 42, 7);

    // Open passenger windows
    ctx.fillStyle = '#1e293b';
    const winCount = Math.max(2, Math.floor((w - 60) / 34));
    for (let i = 0; i < winCount; i++) {
      roundRect(ctx, x + 16 + i * 32, bodyTop + 12, 24, 24, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Route signboard
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 16, bodyTop + 43, Math.min(115, w - 58), 15);
    ctx.strokeRect(x + 16, bodyTop + 43, Math.min(115, w - 58), 15);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 9.5px Fredoka, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(route, x + 21, bodyTop + 54);

    // Headlight & silver bumper
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + w - 6, bodyTop + 42, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bouncy Roof Rack highlight
    ctx.fillStyle = '#fde047';
    roundRect(ctx, x + 14, y - 3, w - 52, 7, 3);
    ctx.fill();
    ctx.stroke();

    // Wheels
    [x + 32, x + w - 26].forEach((wx) => {
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(wx, wheelY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wx, wheelY, 7, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawTricyclePlatform(ctx, x, y, w, h) {
    // Colorful PH Tricycle (bouncy roof!)
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, x + 4, y + 2, w - 16, h - 14, 10);
    ctx.fill();
    ctx.stroke();

    // Yellow roof canopy
    ctx.fillStyle = '#facc15';
    roundRect(ctx, x, y - 2, w - 8, 10, 4);
    ctx.fill();
    ctx.stroke();

    // Window opening
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, x + 14, y + 14, w - 42, 24, 5);
    ctx.fill();
    ctx.stroke();

    // Sidecar label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TODA #08', x + w / 2 - 4, y + 52);

    // Wheels
    [x + 22, x + w - 18].forEach((wx) => {
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(wx, y + h - 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(wx, y + h - 8, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ==================== MARIO-STYLE ? BLOCKS & BREAKABLE CRATES ====================
  function drawBlock(ctx, b, time) {
    ctx.save();
    const bumpY = b.bumpTimer > 0 ? -Math.sin((b.bumpTimer / 0.18) * Math.PI) * 10 : 0;
    const x = b.x;
    const y = b.y + bumpY;
    const s = b.size;

    if (b.type === 'question') {
      if (b.used) {
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        roundRect(ctx, x, y, s, s, 6);
        ctx.fill();
        ctx.stroke();
      } else {
        // Glowing golden Mario-style Barangay Supply Box!
        const pulse = 0.5 + Math.sin(time * 7) * 0.5;
        ctx.fillStyle = b.reward === 'gun' || b.reward === 'blaster'
          ? `rgb(${235 + pulse * 20}, ${140 + pulse * 40}, 35)`
          : '#facc15';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 3;
        roundRect(ctx, x, y, s, s, 7);
        ctx.fill();
        ctx.stroke();

        // Inner highlight border
        ctx.strokeStyle = '#fef9c3';
        ctx.lineWidth = 2;
        roundRect(ctx, x + 4, y + 4, s - 8, s - 8, 4);
        ctx.stroke();

        // Corner rivets
        ctx.fillStyle = '#78350f';
        [[6, 6], [s - 6, 6], [6, s - 6], [s - 6, s - 6]].forEach(([rx, ry]) => {
          ctx.beginPath();
          ctx.arc(x + rx, y + ry, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Icon or ?
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 24px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const glyph = b.reward === 'gun' || b.reward === 'blaster' ? '?' : b.reward === 'energy' ? '⚡' : '?';
        ctx.fillText(glyph, x + s / 2 + 1, y + s / 2 + 2);
        ctx.fillStyle = b.reward === 'gun' || b.reward === 'blaster' ? '#fef08a' : '#ffffff';
        ctx.fillText(glyph, x + s / 2, y + s / 2);
      }
    } else if (b.type === 'crate') {
      // Breakable wooden palengke crate
      ctx.fillStyle = '#b45309';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, s, s, 5);
      ctx.fill();
      ctx.stroke();

      // Diagonal wooden slats
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 5);
      ctx.lineTo(x + s - 5, y + s - 5);
      ctx.moveTo(x + s - 5, y + 5);
      ctx.lineTo(x + 5, y + s - 5);
      ctx.stroke();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 5, y + 5, s - 10, s - 10);
    }

    ctx.restore();
  }

  // ==================== PICKUPS (COINS, ENERGY DRINKS, GUNS, HEARTS) ====================
  function drawPickup(ctx, item, time) {
    ctx.save();
    const bob = Math.sin(time * 5.5 + item.x * 0.05) * 4;
    const cx = item.x + item.w / 2;
    const cy = item.y + item.h / 2 + bob;
    ctx.translate(cx, cy);

    if (item.type === 'coin') {
      const spinW = Math.max(0.28, Math.abs(Math.cos(time * 5 + item.x * 0.03)));
      ctx.scale(spinW, 1);
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 14px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₱', 0, 1);
    } else if (item.type === 'energy') {
      // Glowing Energy Drink / Lightning Kape Can for Punch Power!
      ctx.fillStyle = 'rgba(253, 224, 71, 0.32)';
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      roundRect(ctx, -10, -14, 20, 28, 5);
      ctx.fill();
      ctx.stroke();

      // Can lid
      ctx.fillStyle = '#e2e8f0';
      roundRect(ctx, -9, -15, 18, 5, 2);
      ctx.fill();
      ctx.stroke();

      // Lightning bolt
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(2, -8);
      ctx.lineTo(-5, 1);
      ctx.lineTo(0, 1);
      ctx.lineTo(-2, 10);
      ctx.lineTo(6, -1);
      ctx.lineTo(1, -1);
      ctx.closePath();
      ctx.fill();
    } else if (item.type === 'gun' || item.type === 'blaster') {
      // Glowing Obtainable Gun Pickup!
      const isBlaster = item.type === 'blaster';
      ctx.fillStyle = isBlaster ? 'rgba(239, 68, 68, 0.32)' : 'rgba(59, 130, 246, 0.34)';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      // Grip
      ctx.fillStyle = '#1e293b';
      roundRect(ctx, -10, 0, 7, 11, 2);
      ctx.fill();
      ctx.stroke();
      // Body
      ctx.fillStyle = isBlaster ? '#ef4444' : '#3b82f6';
      roundRect(ctx, -12, -8, isBlaster ? 26 : 22, 11, 3);
      ctx.fill();
      ctx.stroke();
      // Accent + orange muzzle
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-6, -5, 10, 4);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(isBlaster ? 11 : 7, -6.5, 4.5, 8);
    } else if (item.type === 'heart') {
      // Halo-Halo / Health Heart
      ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, 11);
      ctx.bezierCurveTo(-15, 2, -16, -11, -7, -11);
      ctx.bezierCurveTo(-2, -11, 0, -6, 0, -5);
      ctx.bezierCurveTo(0, -6, 2, -11, 7, -11);
      ctx.bezierCurveTo(16, -11, 15, 2, 0, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  // ==================== BARANGAY GOAL FLAGPOLE ====================
  function drawGoalFlag(ctx, goalX, groundY, time, cleared) {
    ctx.save();
    // Base pedestal
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, goalX - 22, groundY - 22, 44, 22, 5);
    ctx.fill();
    ctx.stroke();

    // Tall flagpole
    const poleH = 260;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(goalX - 5, groundY - poleH, 10, poleH - 20);
    ctx.strokeRect(goalX - 5, groundY - poleH, 10, poleH - 20);

    // Golden sun finial on top
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(goalX, groundY - poleH, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Philippine-inspired Barangay Flag!
    const flagY = cleared ? groundY - poleH + 22 : groundY - poleH + 28;
    const wave = Math.sin(time * 6) * 5;
    // Blue top half
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(goalX + 5, flagY);
    ctx.lineTo(goalX + 82, flagY + wave);
    ctx.lineTo(goalX + 82, flagY + 24 + wave);
    ctx.lineTo(goalX + 5, flagY + 24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red bottom half
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(goalX + 5, flagY + 24);
    ctx.lineTo(goalX + 82, flagY + 24 + wave);
    ctx.lineTo(goalX + 82, flagY + 48 + wave);
    ctx.lineTo(goalX + 5, flagY + 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // White triangle & sun
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(goalX + 5, flagY);
    ctx.lineTo(goalX + 36, flagY + 24);
    ctx.lineTo(goalX + 5, flagY + 48);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(goalX + 16, flagY + 24, 6, 0, Math.PI * 2);
    ctx.fill();

    // Little Barangay Outpost Arch behind flag
    ctx.fillStyle = '#1e3a8a';
    roundRect(ctx, goalX + 66, groundY - 125, 110, 125, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(goalX + 74, groundY - 114, 94, 24);
    ctx.strokeRect(goalX + 74, groundY - 114, 94, 24);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BARANGAY HQ', goalX + 121, groundY - 98);

    // Door
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, goalX + 101, groundY - 62, 40, 62, 18);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  return {
    drawHero,
    drawEnemy,
    drawBackground,
    drawPlatform,
    drawBlock,
    drawPickup,
    drawGoalFlag
  };
})();
