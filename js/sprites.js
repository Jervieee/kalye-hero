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
    const custom = p.custom || {
      head: p.outfit === 'jersey' ? 'backcap' : 'spiky',
      skin: 'tan',
      top: p.outfit === 'jersey' ? 'jersey' : 'black',
      bottom: p.outfit === 'jersey' ? 'shorts' : 'maong'
    };
    const skinTone = custom.skin === 'light' ? '#fbd3b4' : custom.skin === 'deep' ? '#c98856' : '#f5be93';
    const skinShadow = custom.skin === 'light' ? '#ebb690' : custom.skin === 'deep' ? '#a86b3e' : '#e5a373';
    const sleeveColor = custom.top === 'jersey' ? skinTone : custom.top === 'manong' ? '#ffffff' : custom.top === 'red' ? '#dc2626' : '#18181b';
    const hasKnife = (p.knifeAmmo || 0) > 0;

    // Ground shadow
    if (p.onGround) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Double-jump somersault spin!
    if (p.doubleJumpTimer > 0) {
      ctx.translate(0, -28);
      ctx.rotate((1 - p.doubleJumpTimer / 0.34) * Math.PI * 2);
      ctx.translate(0, 28);
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

    // ---- BACK ARM ----
    ctx.save();
    const backArmSwing = p.onGround ? -walkPhase * 0.6 : -0.5;
    ctx.translate(-7, -26 + bob);
    ctx.rotate(backArmSwing);
    ctx.fillStyle = sleeveColor;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    roundRect(ctx, -5, -2, 9, 10, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = skinTone;
    roundRect(ctx, -4, 6, 7, 8, 3.5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // ---- LEGS: MAONG PANTS / BLACK SHORTS / KHAKI CARGO SHORTS + SNEAKERS ----
    const leftLegAngle = p.onGround ? walkPhase * 0.55 : -0.35;
    const rightLegAngle = p.onGround ? -walkPhase * 0.55 : 0.45;

    function drawHeroLeg(offsetX, angle, isFront) {
      ctx.save();
      ctx.translate(offsetX, -19 + bob);
      ctx.rotate(angle);

      if (custom.bottom === 'shorts' || custom.bottom === 'cargo') {
        const isCargo = custom.bottom === 'cargo';
        ctx.fillStyle = isCargo
          ? (isFront ? '#ca8a04' : '#a16207')
          : (isFront ? '#18181b' : '#09090b');
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.4;
        roundRect(ctx, -6.5, 0, 13, 8.5, 3);
        ctx.fill();
        ctx.stroke();
        if (!isCargo) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(2, 1.5, 2.2, 6);
        }
        ctx.fillStyle = skinTone;
        roundRect(ctx, -4.5, 7.5, 9, 6.5, 3);
        ctx.fill();
        ctx.stroke();
      } else {
        // Denim maong pants leg
        ctx.fillStyle = isFront ? '#2563eb' : '#1d4ed8';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.5;
        roundRect(ctx, -6, 0, 12, 13, 4);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(2, 2);
        ctx.lineTo(2, 9);
        ctx.stroke();
        ctx.fillStyle = '#93c5fd';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2;
        roundRect(ctx, -6.5, 9.5, 13, 4, 2);
        ctx.fill();
        ctx.stroke();
      }

      // White sneaker with red accent
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.3;
      roundRect(ctx, -5, 12.5, 15, 7, 3.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(0, 14.5, 6, 2.5);
      ctx.restore();
    }

    drawHeroLeg(-5, leftLegAngle, false);
    drawHeroLeg(5, rightLegAngle, true);

    // ---- TORSO: BLACK SHIRT / YELLOW #8 JERSEY / WHITE MANONG + TOWEL / RED STREET TEE ----
    ctx.save();
    ctx.translate(0, -29 + bob);

    // Waistband peek
    ctx.fillStyle = custom.bottom === 'maong' ? '#1e40af' : custom.bottom === 'cargo' ? '#a16207' : '#111827';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    roundRect(ctx, -11.5, 9, 23, 6, 3);
    ctx.fill();
    ctx.stroke();

    if (custom.top === 'jersey') {
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      roundRect(ctx, -12.5, -5, 25, 17, 6);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-5.5, -4.5);
      ctx.lineTo(0, 0.5);
      ctx.lineTo(5.5, -4.5);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('8', 1, 9.5);
      ctx.fillText('8', 1, 9.5);
    } else if (custom.top === 'manong') {
      // Crisp White Shirt + Red-Striped Kitchen Towel draped over shoulder!
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      roundRect(ctx, -12.5, -5, 25, 17, 6);
      ctx.fill();
      ctx.stroke();
      // Shoulder towel (bimpo)
      ctx.fillStyle = '#f8fafc';
      ctx.lineWidth = 2;
      roundRect(ctx, -11, -6, 9, 17, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-10, 4, 7, 2.2);
      ctx.fillRect(-10, 7.5, 7, 2.2);
    } else {
      ctx.fillStyle = custom.top === 'red' ? '#dc2626' : '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.8;
      roundRect(ctx, -12.5, -5, 25, 17, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = custom.top === 'red' ? '#f87171' : '#334155';
      ctx.beginPath();
      ctx.ellipse(-4, 1, 5, 2.2, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = custom.top === 'red' ? '#991b1b' : '#3f3f46';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -4, 5.5, 0.15, Math.PI - 0.15);
      ctx.stroke();
    }
    ctx.restore();

    // ---- CHIBI HEAD ----
    ctx.save();
    ctx.translate(1, -46 + bob);

    // Long flowing back hair for Bandana (Jeo Ong style!)
    if (custom.head === 'bandana') {
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      roundRect(ctx, -20, -6, 14, 28, 6);
      ctx.fill();
      ctx.stroke();
    }

    // Ear
    ctx.fillStyle = skinShadow;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(-15, 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Round chibi face
    ctx.fillStyle = skinTone;
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

    // Optional Mustache for Manong face OR Cool Shades!
    if (custom.head === 'manong') {
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.ellipse(1, 5.2, 4, 1.8, -0.1, 0, Math.PI * 2);
      ctx.ellipse(7, 5.2, 4, 1.8, 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else if (custom.head === 'shades') {
      ctx.fillStyle = '#111827';
      roundRect(ctx, -6, -3.5, 20, 7.5, 2.5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(-3.5, -2, 5, 2);
      ctx.fillRect(5.5, -2, 5, 2);
    }

    if (custom.head === 'backcap') {
      // Hair tufts peeking out from under the BACKWARD CAP!
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-16, 2);
      ctx.lineTo(-19, -4);
      ctx.lineTo(-13, -7);
      ctx.lineTo(-12, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Backward Cap Brim/Visor sticking out the BACK!
      ctx.fillStyle = '#1f2937';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(-13, -7);
      ctx.quadraticCurveTo(-27, -6, -28, -1);
      ctx.quadraticCurveTo(-22, 1, -13, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red & Black Snapback Cap Dome
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -5, 16.5, Math.PI + 0.1, -0.05);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(0, -5, 16.2, Math.PI + 0.1, Math.PI * 1.42);
      ctx.lineTo(-2, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(0, -22, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(7, -8, 5.2, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      ctx.moveTo(4, -9);
      ctx.lineTo(7, -14);
      ctx.lineTo(10, -9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#475569';
      roundRect(ctx, 1, -9.5, 12, 3.8, 1.5);
      ctx.fill();
      ctx.stroke();
    } else if (custom.head === 'bandana') {
      // Long hair + Red Bandana wrapped across forehead!
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -5, 16.5, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      roundRect(ctx, -17, -12, 34, 8, 3.5);
      ctx.fill();
      ctx.stroke();
      // Bandana tail fluttering behind
      ctx.beginPath();
      ctx.moveTo(-16, -9);
      ctx.lineTo(-26, -5);
      ctx.lineTo(-23, 0);
      ctx.lineTo(-15, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      [-8, 0, 8].forEach((bx) => {
        ctx.beginPath();
        ctx.arc(bx, -8, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (custom.head === 'manong') {
      // Neat classic Manong short dark hair
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -5, 16.5, Math.PI + 0.1, -0.08);
      ctx.quadraticCurveTo(5, -10, -15, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Spiky cartoon dark hair (default & shades)
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
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath();
      ctx.ellipse(-2, -13, 6, 2.2, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ---- FRONT ARM: PUNCH / BOOST KNIFE SLASH / HOLDING GUN / RUNNING ----
    ctx.save();
    ctx.translate(6, -26 + bob);

    if (isPunching) {
      const thrust = Math.sin(punchProgress * Math.PI) * (hasKnife ? 32 : 24);
      ctx.fillStyle = sleeveColor;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -3, -4, 11, 9, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = skinTone;
      roundRect(ctx, 5, -3.5, 8 + thrust * 0.65, 7, 3);
      ctx.fill();
      ctx.stroke();

      const fistX = 14 + thrust;
      ctx.save();
      if (hasKnife) {
        // BLAZING BOOST KNIFE SLASH!
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.2;
        roundRect(ctx, fistX - 4, -4, 9, 8, 2);
        ctx.fill();
        ctx.stroke();
        // Gleaming cyan-gold blade
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(fistX + 5, -5);
        ctx.lineTo(fistX + 28, -1);
        ctx.lineTo(fistX + 18, 6);
        ctx.lineTo(fistX + 5, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Huge glowing slash arc!
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(fistX + 8, 0, 24, -Math.PI * 0.55, Math.PI * 0.55);
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(253, 224, 71, 0.55)';
        ctx.beginPath();
        ctx.arc(fistX, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = skinTone;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(fistX, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(fistX + 4, 0, 15, -Math.PI * 0.42, Math.PI * 0.42);
        ctx.stroke();
      }
      ctx.restore();
    } else if (p.weapon && p.ammo > 0) {
      const recoil = isShooting ? -4 : 0;
      ctx.translate(recoil, 0);
      ctx.fillStyle = sleeveColor;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -3, -3, 10, 8, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = skinTone;
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
      ctx.fillStyle = sleeveColor;
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -4, -2, 9, 10, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = skinTone;
      roundRect(ctx, -3, 6, 7, 8, 3.5);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  // ==================== THIEF ENEMIES ====================
  function drawCrocEnemy(ctx, e, time) {
    ctx.save();
    const cx = e.x + e.w / 2;
    const bottom = e.y + e.h;
    ctx.translate(cx, bottom);

    if (e.dead) {
      ctx.rotate(e.deathSpin || 0);
      ctx.globalAlpha = Math.max(0, e.deathTimer / 0.55);
    }

    const isBoss = e.type === 'croc_boss';
    const isVip = e.type === 'croc_vip';
    const scale = isBoss ? 1.58 : isVip ? 1.15 : 1.04;
    ctx.scale(e.facing * scale, scale);

    if (e.hurtFlash > 0) {
      ctx.filter = 'brightness(1.85)';
    }

    const step = Math.sin(time * (isBoss ? 10 : 12) + e.seed);
    const bob = e.onGround ? Math.abs(step) * -3 : 0;
    const chomp = Math.max(0, Math.sin(time * 7 + e.seed)) * 3.5;

    // Ground shadow
    if (e.onGround && !e.dead) {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 17, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Swinging Green Crocodile Tail behind Barong!
    ctx.save();
    ctx.translate(-10, -15 + bob);
    ctx.rotate(Math.sin(time * 6 + e.seed) * 0.16);
    ctx.fillStyle = '#16a34a';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.quadraticCurveTo(-14, -7, -21, 1);
    ctx.quadraticCurveTo(-13, 6, 0, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Tail ridge scales
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-13, -5, 4, 3);
    ctx.fillRect(-8, -5, 4, 3);
    ctx.restore();

    // Bulging stolen Cash & Peso sack on back
    ctx.save();
    ctx.translate(-13, -27 + bob);
    ctx.rotate(-0.18 + step * 0.06);
    ctx.fillStyle = '#d6b47c';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.ellipse(0, 2, 9.5, 11, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Cash bills poking out top of bag!
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-5, -12, 7, 6);
    ctx.strokeRect(-5, -12, 7, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, -13, 7, 6);
    ctx.strokeRect(0, -13, 7, 6);
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('₱', 0, 6);
    ctx.restore();

    // Formal Black Slacks & Shiny Leather Shoes
    function drawFormalLeg(ox, angle) {
      ctx.save();
      ctx.translate(ox, -17 + bob);
      ctx.rotate(angle);
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.3;
      roundRect(ctx, -4.5, 0, 9, 13, 3);
      ctx.fill();
      ctx.stroke();
      // Shiny black dress shoe
      ctx.fillStyle = '#1f2937';
      roundRect(ctx, -4, 11, 12, 5.5, 2.5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(1, 12.2, 4, 1.5);
      ctx.restore();
    }
    drawFormalLeg(-5, step * 0.45);
    drawFormalLeg(5, -step * 0.45);

    // ---- TORSO: CLASSIC CREAM/IVORY BARONG TAGALOG! ----
    ctx.save();
    ctx.translate(0, -29 + bob);
    // White undershirt silhouette underneath sheer Barong
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, -11, -2, 22, 16, 4);
    ctx.fill();

    // Cream / Piña Barong Tagalog body (untucked formal hem!)
    ctx.fillStyle = isBoss ? '#fef3c7' : '#fdf8e6';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    roundRect(ctx, -12.5, -4, 25, 21, 5);
    ctx.fill();
    ctx.stroke();

    // Traditional Barong Tagalog embroidered front chest panel (U-shaped calado!)
    ctx.fillStyle = isBoss ? '#f59e0b' : '#e2c286';
    roundRect(ctx, -6, -2, 12, 13, 2.5);
    ctx.fill();
    ctx.strokeStyle = isBoss ? '#b45309' : '#c09853';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-5.5, -1.5, 11, 12);

    // Center button placket & diamond embroidery stitches
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, 12);
    ctx.stroke();
    ctx.fillStyle = '#fffbeb';
    for (let by = 1; by <= 9; by += 4) {
      ctx.beginPath();
      ctx.arc(0, by, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crisp Chinese/Standing Barong Collar
    ctx.fillStyle = '#fef9c3';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    roundRect(ctx, -7, -6.5, 14, 4.5, 2);
    ctx.fill();
    ctx.stroke();

    // Boss VIP sash & gold pin
    if (isBoss) {
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.lineTo(9, 14);
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(6, 2, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ---- CROCODILE HEAD (BUWAYA!) ----
    ctx.save();
    ctx.translate(2, -44 + bob);

    // Back of green croc skull
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.7;
    ctx.beginPath();
    ctx.ellipse(-3, 0, 13, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lower jaw (animated chomp!)
    ctx.save();
    ctx.translate(2, 5);
    ctx.rotate(chomp * 0.045);
    ctx.fillStyle = '#86efac';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    roundRect(ctx, -4, -1, 22, 6.5, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Upper Crocodile Snout (long scaly cartoon muzzle!)
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-4, -8);
    ctx.quadraticCurveTo(8, -11, 22, -4);
    ctx.quadraticCurveTo(26, 0, 22, 4.5);
    ctx.lineTo(-3, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crocodile Nostril bump at tip of snout
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(19.5, -2, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Sharp White Zig-Zag Cartoon Croc Teeth!
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    for (let tx = 4; tx <= 18; tx += 5) {
      ctx.beginPath();
      ctx.moveTo(tx, 4);
      ctx.lineTo(tx + 2.5, 8.5 + chomp * 0.3);
      ctx.lineTo(tx + 5, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Scaly forehead bumps
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(-8, -10, 3, 0, Math.PI * 2);
    ctx.arc(-2, -11, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Black burglar eye-mask / VIP dark shades
    ctx.fillStyle = '#111827';
    if (isVip) {
      // Dark politician VIP sunglasses!
      roundRect(ctx, -6, -7.5, 19, 7, 2.5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(-3, -6, 5, 2);
      ctx.fillRect(5, -6, 5, 2);
    } else {
      // Classic thief domino mask over croc eyes!
      roundRect(ctx, -9, -8, 21, 7.5, 3.5);
      ctx.fill();
      // Sneaky yellow reptile eyes!
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(-2, -4.3, 3, 2.6, 0, 0, Math.PI * 2);
      ctx.ellipse(6.5, -4.3, 3, 2.6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Vertical reptile slit pupils!
      ctx.fillStyle = isBoss ? '#dc2626' : '#111827';
      ctx.fillRect(-2.3, -6.3, 1.5, 4);
      ctx.fillRect(6.2, -6.3, 1.5, 4);
    }

    // Golden Crown on Don Buwaya Boss!
    if (isBoss) {
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.3;
      ctx.beginPath();
      ctx.moveTo(-11, -11);
      ctx.lineTo(-13, -22);
      ctx.lineTo(-6, -16);
      ctx.lineTo(-1, -25);
      ctx.lineTo(4, -16);
      ctx.lineTo(10, -21);
      ctx.lineTo(8, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // ---- FRONT BARONG SLEEVE + CASH BRIEFCASE! ----
    ctx.save();
    ctx.translate(7, -25 + bob);
    ctx.rotate(-0.2 + step * 0.25);
    // Ivory Barong sleeve
    ctx.fillStyle = isBoss ? '#fef3c7' : '#fdf8e6';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    roundRect(ctx, -3, -2, 8, 12, 3.5);
    ctx.fill();
    ctx.stroke();
    // Green croc hand
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(1, 10, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Executive Black Briefcase bursting with Cash!
    ctx.translate(3, 11);
    ctx.fillStyle = '#1e293b';
    roundRect(ctx, -6, 0, 16, 12, 2.5);
    ctx.fill();
    ctx.stroke();
    // Cash sticking out of briefcase
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-4, -3, 6, 4);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(3, -3, 6, 4);
    // Gold briefcase clasp
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 3, 4, 2.5);
    ctx.restore();

    // Mini HP bar for non-boss crocs when damaged
    if (!e.dead && !isBoss && e.maxHp > 1 && e.hp < e.maxHp) {
      ctx.scale(e.facing, 1);
      const bw = 32;
      ctx.fillStyle = '#111827';
      ctx.fillRect(-bw / 2, -68, bw, 6);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(-bw / 2 + 1, -67, (bw - 2) * (e.hp / e.maxHp), 4);
    }

    ctx.restore();
  }

  // ==================== SPECIAL ENEMIES (LEVELS 5–8: KNIFE THIEF, ARMED GANG, MYTHICAL CREATURES) ====================
  function drawSpecialEnemy(ctx, e, time) {
    ctx.save();
    const cx = e.x + e.w / 2;
    const bottom = e.y + e.h;
    ctx.translate(cx, bottom);

    if (e.dead) {
      ctx.rotate(e.deathSpin || 0);
      ctx.globalAlpha = Math.max(0, e.deathTimer / 0.55);
    }

    const isBoss = e.type === 'boss_magnanakaw' || e.type === 'tikbalang_boss';
    const scale = isBoss ? 1.55 : e.type === 'big_knife_thief' || e.type === 'kapre' ? 1.28 : e.type === 'tikbalang' ? 1.2 : 1.05;
    ctx.scale(e.facing * scale, scale);
    if (e.hurtFlash > 0) ctx.filter = 'brightness(1.85)';

    const step = Math.sin(time * 12 + e.seed);
    const bob = e.onGround ? Math.abs(step) * -3 : Math.sin(time * 8 + e.seed) * 5;

    if (e.onGround && !e.dead && e.type !== 'manananggal') {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(0, -1, 17, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (e.type === 'manananggal') {
      // Flying Winged Philippine Manananggal!
      const flap = Math.sin(time * 14 + e.seed) * 0.45;
      ctx.translate(0, -28 + bob);
      // Giant Bat Wings!
      ctx.save();
      ctx.rotate(-0.3 + flap);
      ctx.fillStyle = '#3b0764';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.quadraticCurveTo(-34, -36, -38, -8);
      ctx.quadraticCurveTo(-24, -10, -20, 2);
      ctx.quadraticCurveTo(-12, -6, -6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(0.3 - flap);
      ctx.fillStyle = '#4c1d95';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(6, -12);
      ctx.quadraticCurveTo(32, -34, 36, -6);
      ctx.quadraticCurveTo(22, -8, 18, 2);
      ctx.quadraticCurveTo(12, -6, 6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Long Flowing Dark Hair + Upper Torso Dress
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      roundRect(ctx, -14, -22, 28, 28, 8);
      ctx.fill();
      ctx.stroke();
      // Tattered white-violet blouse
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(-10, -12);
      ctx.lineTo(10, -12);
      ctx.lineTo(13, 8);
      ctx.lineTo(6, 3);
      ctx.lineTo(0, 10);
      ctx.lineTo(-6, 3);
      ctx.lineTo(-13, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eerie Pale Head with Glowing Red Eyes & Fangs
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(1, -22, 13, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-2, -23, 2.4, 0, Math.PI * 2);
      ctx.arc(6, -23, 2.4, 0, Math.PI * 2);
      ctx.fill();
      // Little cartoon fangs
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(-1, -16); ctx.lineTo(1, -12); ctx.lineTo(3, -16);
      ctx.moveTo(4, -16); ctx.lineTo(6, -12); ctx.lineTo(8, -16);
      ctx.fill();
    } else if (e.type === 'tikbalang' || e.type === 'tikbalang_boss') {
      // Mythological Horse-Headed Tikbalang!
      // Muscular dark hooves & legs
      ctx.fillStyle = '#3f2e21';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      [-5, 5].forEach((ox, idx) => {
        ctx.save();
        ctx.translate(ox, -19 + bob);
        ctx.rotate((idx === 0 ? step : -step) * 0.55);
        roundRect(ctx, -4.5, 0, 9, 15, 3);
        ctx.fill();
        ctx.stroke();
        // Hoof
        ctx.fillStyle = '#111827';
        roundRect(ctx, -4.5, 13, 10, 5, 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Muscular brown-fur torso + glowing forest markings
      ctx.fillStyle = e.type === 'tikbalang_boss' ? '#291d14' : '#5c3a21';
      roundRect(ctx, -12, -37 + bob, 24, 21, 6);
      ctx.fill();
      ctx.stroke();
      // Golden tribal chest mark
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -30 + bob); ctx.lineTo(0, -24 + bob); ctx.lineTo(6, -30 + bob);
      ctx.stroke();

      // Horse Head + Spiky Dark Mane!
      ctx.save();
      ctx.translate(2, -49 + bob);
      // Mane spikes
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-14, 4); ctx.lineTo(-20, -4); ctx.lineTo(-14, -8);
      ctx.lineTo(-17, -16); ctx.lineTo(-6, -14); ctx.lineTo(-2, -22);
      ctx.lineTo(4, -14); ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Horse snout & skull
      ctx.fillStyle = e.type === 'tikbalang_boss' ? '#451a03' : '#78350f';
      ctx.beginPath();
      ctx.ellipse(-2, -2, 12, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, 2, -5, 18, 11, 5);
      ctx.fill();
      ctx.stroke();
      // Pointed horse ears
      ctx.beginPath();
      ctx.moveTo(-7, -10); ctx.lineTo(-4, -22); ctx.lineTo(1, -11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Glowing golden/red eyes!
      ctx.fillStyle = e.type === 'tikbalang_boss' ? '#ef4444' : '#fde047';
      ctx.beginPath();
      ctx.arc(3, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      // Boss antlers/crown aura
      if (e.type === 'tikbalang_boss') {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-4, -16); ctx.lineTo(-10, -27);
        ctx.moveTo(2, -16); ctx.lineTo(8, -27);
        ctx.stroke();
      }
      ctx.restore();
    } else if (e.type === 'kapre') {
      // Hulking Forest Giant Kapre with Glowing Cigar (Tabako)!
      ctx.fillStyle = '#292524';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      // Legs
      roundRect(ctx, -11, -17 + bob, 9, 17, 3); ctx.fill(); ctx.stroke();
      roundRect(ctx, 2, -17 + bob, 9, 17, 3); ctx.fill(); ctx.stroke();
      // Huge furry body
      roundRect(ctx, -16, -40 + bob, 32, 26, 9); ctx.fill(); ctx.stroke();
      // Mossy vine sash
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-13, -36 + bob); ctx.lineTo(13, -18 + bob);
      ctx.stroke();
      // Head + bushy beard
      ctx.fillStyle = '#1c1917';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(0, -49 + bob, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Glowing red eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-2, -51 + bob, 2.8, 0, Math.PI * 2);
      ctx.arc(7, -51 + bob, 2.8, 0, Math.PI * 2);
      ctx.fill();
      // Glowing Cigar (Tabako) in mouth!
      ctx.fillStyle = '#92400e';
      ctx.fillRect(6, -45 + bob, 14, 4.5);
      ctx.strokeRect(6, -45 + bob, 14, 4.5);
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(21, -43 + bob, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // BIG MAGNANAKAW WITH KNIFE / ARMED GANG (GUN & KNIFE) / BOSS MAGNANAKAW!
      const isArmedGang = e.type === 'armed_gang';
      const isBossMag = e.type === 'boss_magnanakaw';

      // Legs
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      [-5, 5].forEach((ox, idx) => {
        ctx.save();
        ctx.translate(ox, -16 + bob);
        ctx.rotate((idx === 0 ? step : -step) * 0.5);
        roundRect(ctx, -4.5, 0, 9, 15, 3.5);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Torso
      ctx.fillStyle = isArmedGang ? '#581c87' : isBossMag ? '#7f1d1d' : '#1f2937';
      roundRect(ctx, -13, -32 + bob, 26, 19, 5);
      ctx.fill();
      ctx.stroke();
      if (!isArmedGang) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-12, -24 + bob, 24, 4);
      }

      // Head
      ctx.save();
      ctx.translate(1, -45 + bob);
      ctx.fillStyle = isArmedGang ? '#d6a582' : '#e5a373';
      ctx.beginPath();
      ctx.ellipse(0, 1, 15, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isArmedGang) {
        // Wild red-eyed street hood!
        ctx.fillStyle = '#3b0764';
        ctx.beginPath();
        ctx.arc(0, -4, 16, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(-1, 0, 3.4, 0, Math.PI * 2);
        ctx.arc(8, 0, 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(-0.5, 0, 1.7, 0, Math.PI * 2);
        ctx.arc(8.5, 0, 1.7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Burglar mask + red skull bandana!
        ctx.fillStyle = '#111827';
        roundRect(ctx, -11, -5, 25, 8.5, 4);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-1, -0.5, 2.6, 0, Math.PI * 2);
        ctx.arc(8.5, -0.5, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -6, 15.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (isBossMag) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(3, -13, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();

      // Weapons in Hands! (Big Gleaming Knife/Bolo + Pistol for Armed Gang!)
      ctx.save();
      ctx.translate(10, -24 + bob);
      ctx.rotate(Math.sin(time * 8 + e.seed) * 0.25 - 0.3);
      // Handle
      ctx.fillStyle = '#78350f';
      roundRect(ctx, -2, -3, 8, 6, 2);
      ctx.fill();
      ctx.stroke();
      // Curved Silver Knife / Bolo Blade!
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(6, -4);
      ctx.lineTo(24, -1);
      ctx.lineTo(17, 5);
      ctx.lineTo(6, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (isArmedGang || isBossMag) {
        // Back hand holding a Gun!
        ctx.save();
        ctx.translate(-12, -23 + bob);
        ctx.fillStyle = '#334155';
        roundRect(ctx, -12, -4, 15, 7, 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    // Mini HP bar for tough non-boss enemies
    if (!e.dead && !isBoss && e.maxHp > 1 && e.hp < e.maxHp) {
      ctx.scale(e.facing, 1);
      const bw = 34;
      ctx.fillStyle = '#111827';
      ctx.fillRect(-bw / 2, -70, bw, 6);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-bw / 2 + 1, -69, (bw - 2) * (e.hp / e.maxHp), 4);
    }

    ctx.restore();
  }

  function drawEnemy(ctx, e, time) {
    if (e.type === 'croc_thief' || e.type === 'croc_vip' || e.type === 'croc_boss') {
      drawCrocEnemy(ctx, e, time);
      return;
    }
    if (['big_knife_thief', 'armed_gang', 'boss_magnanakaw', 'tikbalang', 'tikbalang_boss', 'manananggal', 'kapre'].includes(e.type)) {
      drawSpecialEnemy(ctx, e, time);
      return;
    }
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
    } else if (theme === 'malacanang') {
      // Grand Ceremonial Manila Sky over Malacañang!
      sky.addColorStop(0, '#1d4ed8');
      sky.addColorStop(0.42, '#38bdf8');
      sky.addColorStop(0.82, '#fde68a');
      sky.addColorStop(1, '#fef3c7');
    } else if (theme === 'pasig') {
      // Pasig River Golden Afternoon Sky!
      sky.addColorStop(0, '#0369a1');
      sky.addColorStop(0.48, '#38bdf8');
      sky.addColorStop(0.85, '#fed7aa');
      sky.addColorStop(1, '#fef08a');
    } else if (theme === 'ilocos') {
      // Ilocos Norte Bright Coastal Windmill Sky!
      sky.addColorStop(0, '#1e40af');
      sky.addColorStop(0.45, '#60a5fa');
      sky.addColorStop(0.82, '#fde68a');
      sky.addColorStop(1, '#fef3c7');
    } else if (theme === 'pangasinan') {
      // Pangasinan Tropical Beach Sky!
      sky.addColorStop(0, '#0284c7');
      sky.addColorStop(0.5, '#38bdf8');
      sky.addColorStop(0.88, '#a5f3fc');
      sky.addColorStop(1, '#fef9c3');
    } else if (theme === 'kagubatan') {
      // Mystical Philippine Jungle Twilight!
      sky.addColorStop(0, '#052e16');
      sky.addColorStop(0.45, '#064e3b');
      sky.addColorStop(0.82, '#115e59');
      sky.addColorStop(1, '#1e293b');
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

    // 3. Regional Midground Parallax Backgrounds
    if (theme === 'malacanang') {
      drawMalacanangBackground(ctx, width, height, camX, time);
      return;
    }
    if (theme === 'pasig') {
      drawPasigRiverBackground(ctx, width, height, camX, time);
      return;
    }
    if (theme === 'ilocos') {
      drawIlocosNorteBackground(ctx, width, height, camX, time);
      return;
    }
    if (theme === 'pangasinan') {
      drawPangasinanBeachBackground(ctx, width, height, camX, time);
      return;
    }
    if (theme === 'kagubatan') {
      drawKagubatanBackground(ctx, width, height, camX, time);
      return;
    }

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

  function drawMalacanangBackground(ctx, width, height, camX, time) {
    const groundY = height - 92;

    // Shimmering Pasig River band behind the palace grounds
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, groundY - 48, width, 54);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    for (let rx = -((camX * 0.25) % 90); rx < width + 90; rx += 90) {
      ctx.fillRect(rx, groundY - 34, 42, 4);
      ctx.fillRect(rx + 24, groundY - 22, 30, 3);
    }

    // Iconic Malacañang Palace White Neoclassical Wings & Grand Portico (0.35x parallax)
    const palaceSpacing = 540;
    const pScroll = camX * 0.35;
    const startIdx = Math.floor(pScroll / palaceSpacing) - 1;

    for (let i = startIdx; i < startIdx + 4; i++) {
      const px = i * palaceSpacing - pScroll;
      const py = groundY - 235;
      const pw = 450;

      // Tropical Acacia / Palm trees flanking the palace
      drawPalmTree(ctx, px - 36, groundY, time + i);
      drawPalmTree(ctx, px + pw + 32, groundY, time + i + 2);

      // Main Neoclassical White-Cream Palace Facade
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.fillRect(px, py + 32, pw, 205);
      ctx.strokeRect(px, py + 32, pw, 205);

      // Ornate Roof Balustrade & Golden Trim
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(px - 8, py + 24, pw + 16, 14);
      ctx.strokeRect(px - 8, py + 24, pw + 16, 14);

      // Central Grand Triangular Pediment + Seal
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.moveTo(px + 115, py + 24);
      ctx.lineTo(px + pw / 2, py - 24);
      ctx.lineTo(px + pw - 115, py + 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Presidential-Style Sun Seal inside Pediment
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + 4, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Palace Sign Plaque ("MALACAÑANG · MANILA")
      ctx.fillStyle = '#1e3a8a';
      roundRect(ctx, px + pw / 2 - 96, py + 42, 192, 24, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MALACAÑANG · MANILA', px + pw / 2, py + 58);

      // Stately Colonial Arched Windows along upper floor
      for (let w = 0; w < 6; w++) {
        const wx = px + 26 + w * 69;
        if (w === 2 || w === 3) continue; // Center portico columns sit here
        ctx.fillStyle = '#1e3a8a';
        roundRect(ctx, wx, py + 76, 36, 54, 16);
        ctx.fill();
        ctx.stroke();
        // Warm interior chandelier glow
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(wx + 6, py + 86, 24, 34);
      }

      // Grand White Roman Columns supporting the Portico
      for (let c = 0; c < 4; c++) {
        const colX = px + 148 + c * 46;
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(colX, py + 72, 14, 165);
        ctx.strokeRect(colX, py + 72, 14, 165);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(colX - 3, py + 70, 20, 7);
        ctx.strokeRect(colX - 3, py + 70, 20, 7);
      }

      // Red Ceremonial Carpet & Grand Entrance Arch
      ctx.fillStyle = '#7f1d1d';
      roundRect(ctx, px + pw / 2 - 32, py + 150, 64, 86, 26);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(px + pw / 2 - 26, groundY - 22);
      ctx.lineTo(px + pw / 2 + 26, groundY - 22);
      ctx.lineTo(px + pw / 2 + 44, groundY + 4);
      ctx.lineTo(px + pw / 2 - 44, groundY + 4);
      ctx.closePath();
      ctx.fill();

      // Waving Philippine Flag atop Palace Pediment!
      const fPoleX = px + pw / 2;
      const fPoleTop = py - 74;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(fPoleX - 2, fPoleTop, 4, 52);
      const wave = Math.sin(time * 5 + i) * 3;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(fPoleX + 2, fPoleTop + 2, 34, 11 + wave * 0.2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(fPoleX + 2, fPoleTop + 13, 34, 11 + wave * 0.2);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(fPoleX + 2, fPoleTop + 2);
      ctx.lineTo(fPoleX + 16, fPoleTop + 13);
      ctx.lineTo(fPoleX + 2, fPoleTop + 24);
      ctx.closePath();
      ctx.fill();
    }

    // Ornate Wrought-Iron Malacañang Perimeter Fence + Heritage Manila Globe Lamps (0.65x parallax)
    const fenceScroll = camX * 0.65;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY - 58, width, 5);
    ctx.fillRect(0, groundY - 14, width, 14);
    for (let fx = -(fenceScroll % 24); fx < width + 24; fx += 24) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fx, groundY - 62, 4, 62);
      // Gold spear finial on fence bars
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(fx + 2, groundY - 70);
      ctx.lineTo(fx - 2, groundY - 61);
      ctx.lineTo(fx + 6, groundY - 61);
      ctx.closePath();
      ctx.fill();
    }

    // Classic Green Manila Heritage Streetlamps + J.P. Laurel St Sign
    const lampSpacing = 360;
    const lStart = Math.floor(fenceScroll / lampSpacing) - 1;
    for (let i = lStart; i < lStart + 6; i++) {
      const lx = i * lampSpacing - fenceScroll;
      ctx.fillStyle = '#14532d';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      ctx.fillRect(lx - 4, groundY - 190, 8, 190);
      ctx.strokeRect(lx - 4, groundY - 190, 8, 190);
      // Twin heritage white globe lights
      [-16, 16].forEach((gx) => {
        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.arc(lx + gx, groundY - 192, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Manila Street Sign every other lamp
      if (Math.abs(i) % 2 === 0) {
        ctx.fillStyle = '#15803d';
        roundRect(ctx, lx - 66, groundY - 148, 132, 22, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('J.P. LAUREL · MANILA', lx, groundY - 134);
      }
    }
  }

  function drawPasigRiverBackground(ctx, width, height, camX, time) {
    const groundY = height - 92;
    // Shimmering Pasig River expanse!
    const riverGrad = ctx.createLinearGradient(0, groundY - 120, 0, groundY + 10);
    riverGrad.addColorStop(0, '#0284c7');
    riverGrad.addColorStop(1, '#0f766e');
    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, groundY - 120, width, 128);
    // Animated water glints
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    for (let rx = -((camX * 0.35 + time * 26) % 95); rx < width + 95; rx += 95) {
      ctx.fillRect(rx, groundY - 96, 44, 4);
      ctx.fillRect(rx + 28, groundY - 62, 36, 4);
      ctx.fillRect(rx + 10, groundY - 32, 48, 3);
    }
    // Iconic Manila Pasig River Arch Bridges (Jones / Ayala Bridge style!)
    const brScroll = camX * 0.42;
    const brSpacing = 440;
    const start = Math.floor(brScroll / brSpacing) - 1;
    for (let i = start; i < start + 5; i++) {
      const bx = i * brSpacing - brScroll;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(bx + 180, groundY - 82, 135, Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = '#475569';
      ctx.fillRect(bx + 36, groundY - 115, 24, 115);
      ctx.fillRect(bx + 300, groundY - 115, 24, 115);
      // Heritage lamp atop bridge pier
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bx + 48, groundY - 124, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    // Riverbank Railing + Sign ("PASIG RIVER · MANILA")
    const railScroll = camX * 0.65;
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, groundY - 40, width, 6);
    for (let px = -(railScroll % 42); px < width + 42; px += 42) {
      ctx.fillRect(px, groundY - 40, 5, 42);
    }
    const signX = 240 - ((camX * 0.55) % 520);
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRect(ctx, signX, groundY - 165, 165, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌊 PASIG RIVER · MANILA', signX + 82, groundY - 147);
  }

  function drawIlocosNorteBackground(ctx, width, height, camX, time) {
    const groundY = height - 92;
    // Coastal sea horizon
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(0, groundY - 88, width, 92);
    // Golden Paoay Sand Dunes rolling hills!
    const duneScroll = camX * 0.28;
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.moveTo(0, groundY + 10);
    for (let x = 0; x <= width + 60; x += 60) {
      const y = groundY - 52 - Math.sin((x + duneScroll) * 0.009) * 28;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, groundY + 10);
    ctx.closePath();
    ctx.fill();

    // Iconic SPINNING BANGUI WINDMILLS! (0.45x parallax)
    const wmScroll = camX * 0.45;
    const wmSpacing = 260;
    const start = Math.floor(wmScroll / wmSpacing) - 1;
    for (let i = start; i < start + 7; i++) {
      const wx = i * wmSpacing - wmScroll;
      const hubY = groundY - 220 + (Math.abs(i) % 2) * 18;
      // Tall white windmill tower
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(wx - 8, groundY - 30);
      ctx.lineTo(wx - 4, hubY);
      ctx.lineTo(wx + 4, hubY);
      ctx.lineTo(wx + 8, groundY - 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3 Rotating Windmill Blades!
      ctx.save();
      ctx.translate(wx, hubY);
      ctx.rotate(time * 1.9 + i * 1.1);
      for (let b = 0; b < 3; b++) {
        ctx.rotate((Math.PI * 2) / 3);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(0, -68);
        ctx.lineTo(4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Ilocos Norte Heritage Brick Signpost
    const sx = 280 - ((camX * 0.52) % 560);
    ctx.fillStyle = '#9a3412';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    roundRect(ctx, sx, groundY - 125, 175, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 11.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌬️ ILOCOS NORTE · BANGUI', sx + 87, groundY - 107);
  }

  function drawPangasinanBeachBackground(ctx, width, height, camX, time) {
    const groundY = height - 92;
    // Sparkling Turquoise Hundred Islands / Lingayen Sea!
    const sea = ctx.createLinearGradient(0, groundY - 130, 0, groundY);
    sea.addColorStop(0, '#0284c7');
    sea.addColorStop(0.55, '#06b6d4');
    sea.addColorStop(1, '#67e8f9');
    ctx.fillStyle = sea;
    ctx.fillRect(0, groundY - 130, width, 138);

    // Emerald Hundred Islands Dome Islets on Horizon!
    const islScroll = camX * 0.22;
    for (let i = -1; i < 8; i++) {
      const ix = i * 240 - (islScroll % 240);
      const ir = 42 + (Math.abs(i * 19) % 28);
      ctx.fillStyle = '#15803d';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(ix, groundY - 110, ir, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Animated White Beach Waves!
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (let wx = -((camX * 0.4 + time * 35) % 120); wx < width + 120; wx += 120) {
      ctx.beginPath();
      ctx.ellipse(wx, groundY - 14 + Math.sin(time * 4 + wx) * 3, 46, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Coconut Palms & Nipa Beach Huts (Bahay Kubo Cottages!)
    const hutScroll = camX * 0.48;
    const hSpacing = 380;
    const start = Math.floor(hutScroll / hSpacing) - 1;
    for (let i = start; i < start + 6; i++) {
      const hx = i * hSpacing - hutScroll;
      drawPalmTree(ctx, hx - 40, groundY - 8, time + i);
      // Thatched Nipa Beach Cottage
      ctx.fillStyle = '#92400e';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      ctx.fillRect(hx + 16, groundY - 84, 96, 76);
      ctx.strokeRect(hx + 16, groundY - 84, 96, 76);
      // Steep Nipa Roof
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.moveTo(hx - 4, groundY - 80);
      ctx.lineTo(hx + 64, groundY - 134);
      ctx.lineTo(hx + 132, groundY - 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fef9c3';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏖️ PANGASINAN', hx + 64, groundY - 56);
    }
  }

  function drawKagubatanBackground(ctx, width, height, camX, time) {
    const groundY = height - 92;
    // Glowing Full Moon through Mystical Forest!
    ctx.fillStyle = '#fef9c3';
    ctx.beginPath();
    ctx.arc(width - 130, 88, 38, 0, Math.PI * 2);
    ctx.fill();

    // Distant Dark Jungle Canopy Silhouettes
    const farScroll = camX * 0.25;
    ctx.fillStyle = '#064e3b';
    for (let i = -1; i < 12; i++) {
      const tx = i * 150 - (farScroll % 150);
      ctx.beginPath();
      ctx.arc(tx + 75, groundY - 170, 95, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(tx + 55, groundY - 170, 40, 175);
    }

    // Ancient Gnarled Balete Trees + Hanging Vines (0.5x parallax)
    const treeScroll = camX * 0.5;
    const tSpacing = 290;
    const start = Math.floor(treeScroll / tSpacing) - 1;
    for (let i = start; i < start + 6; i++) {
      const tx = i * tSpacing - treeScroll;
      ctx.fillStyle = '#3f2e21';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.6;
      ctx.fillRect(tx, groundY - 260, 46, 265);
      ctx.strokeRect(tx, groundY - 260, 46, 265);
      // Canopy & Vines
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(tx + 23, groundY - 265, 76, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      for (let v = 0; v < 3; v++) {
        const vx = tx - 26 + v * 46;
        ctx.beginPath();
        ctx.moveTo(vx, groundY - 210);
        ctx.quadraticCurveTo(vx + Math.sin(time * 2 + v) * 10, groundY - 140, vx - 4, groundY - 80);
        ctx.stroke();
      }
    }

    // Floating Golden Fireflies (Alitaptap)!
    for (let f = 0; f < 24; f++) {
      const fx = ((f * 97 + time * 18) % (width + 40)) - 20;
      const fy = 110 + ((f * 53) % (groundY - 140)) + Math.sin(time * 3 + f) * 12;
      const alpha = 0.4 + Math.sin(time * 5 + f * 1.7) * 0.45;
      ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPalmTree(ctx, x, groundY, phase) {
    ctx.save();
    // Trunk
    ctx.fillStyle = '#92400e';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.fillRect(x - 6, groundY - 125, 12, 125);
    ctx.strokeRect(x - 6, groundY - 125, 12, 125);
    // Lush tropical canopy
    const sway = Math.sin(phase * 2) * 3;
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x + sway, groundY - 134, 34, 0, Math.PI * 2);
    ctx.arc(x - 24 + sway, groundY - 120, 24, 0, Math.PI * 2);
    ctx.arc(x + 24 + sway, groundY - 120, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
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

    if (style === 'suv') {
      drawVipSuvPlatform(ctx, x, y, w, h);
      ctx.restore();
      return;
    }

    if (style === 'palace') {
      // Malacañang Heritage Marble & Cobblestone Boulevard!
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x, y, w, 16);
      // Crimson & Gold Ceremonial Curb
      for (let cx = x; cx < x + w; cx += 48) {
        ctx.fillStyle = Math.floor(cx / 48) % 2 === 0 ? '#dc2626' : '#facc15';
        ctx.fillRect(cx, y + 10, Math.min(48, x + w - cx), 8);
      }
      // Polished Heritage Stone Road
      ctx.fillStyle = '#475569';
      ctx.fillRect(x, y + 18, w, h - 18);
      // Decorative gold center dashes
      ctx.fillStyle = '#fde047';
      for (let lx = x + 22; lx < x + w - 20; lx += 74) {
        ctx.fillRect(lx, y + 44, 36, 6);
      }
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
      return;
    }

    if (style === 'marble') {
      // Ornate White & Gold Palace Balcony Platform
      ctx.fillStyle = '#fffbeb';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x + 4, y + 3, w - 8, 6);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + 6, y + h - 7, w - 12, 4);
      ctx.restore();
      return;
    }

    if (style === 'boardwalk' || style === 'sandroad' || style === 'beach' || style === 'forest') {
      const topColors = { boardwalk: '#94a3b8', sandroad: '#f59e0b', beach: '#fde047', forest: '#15803d' };
      const bodyColors = { boardwalk: '#475569', sandroad: '#b45309', beach: '#eab308', forest: '#422006' };
      ctx.fillStyle = topColors[style];
      ctx.fillRect(x, y, w, 18);
      ctx.fillStyle = bodyColors[style];
      ctx.fillRect(x, y + 18, w, h - 18);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
      return;
    }

    if (style === 'ferry' || style === 'bangka') {
      // Bouncy Pasig River Ferry OR Pangasinan Bangka Boat!
      ctx.fillStyle = style === 'ferry' ? '#0284c7' : '#ef4444';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x + 6, y + 12, w - 12, h - 14, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      roundRect(ctx, x + 16, y - 2, w - 32, 16, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style === 'ferry' ? '⛴️ PASIG FERRY' : '⛵ BANGKA BOAT', x + w / 2, y + 38);
      ctx.restore();
      return;
    }

    if (style === 'mushroom') {
      // Bouncy Glowing Kagubatan Giant Mushroom!
      ctx.fillStyle = '#fef3c7';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 3;
      roundRect(ctx, x + w * 0.34, y + 18, w * 0.32, h - 18, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + 18, w * 0.5, 22, 0, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x + w * 0.35, y + 8, 5, 0, Math.PI * 2);
      ctx.arc(x + w * 0.62, y + 6, 6, 0, Math.PI * 2);
      ctx.fill();
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

  function drawVipSuvPlatform(ctx, x, y, w, h) {
    // Glossy Black VIP Palace SUV (bouncy roof!)
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    roundRect(ctx, x + 6, y + 4, w - 12, h - 16, 12);
    ctx.fill();
    ctx.stroke();

    // Tinted VIP windows
    ctx.fillStyle = '#334155';
    roundRect(ctx, x + 22, y + 12, w - 58, 22, 5);
    ctx.fill();
    ctx.stroke();
    // Window reflection glint
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(x + 30, y + 15, 22, 5);

    // Gold VIP trim + Plate "VIP-8"
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 12, y + 40, w - 24, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w / 2 - 24, y + 46, 48, 13);
    ctx.strokeRect(x + w / 2 - 24, y + 46, 48, 13);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 9.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VIP · 8', x + w / 2, y + 56);

    // Flashing Red & Blue Siren Bar on Roof (Bouncy!)
    ctx.fillStyle = '#ef4444';
    roundRect(ctx, x + w / 2 - 24, y - 4, 22, 8, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#3b82f6';
    roundRect(ctx, x + w / 2 + 2, y - 4, 22, 8, 3);
    ctx.fill();
    ctx.stroke();

    // Chrome Wheels
    [x + 34, x + w - 34].forEach((wx) => {
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(wx, y + h - 8, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(wx, y + h - 8, 6.5, 0, Math.PI * 2);
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
    } else if (item.type === 'cash') {
      // Sparkling Stack of Philippine Cash Bills (₱1,000 Bundle!)
      ctx.fillStyle = 'rgba(34, 197, 94, 0.34)';
      ctx.beginPath();
      ctx.arc(0, 0, 21, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(Math.sin(time * 4 + item.x) * 0.1);
      // Stacked shadow bill
      ctx.fillStyle = '#15803d';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.2;
      roundRect(ctx, -14, -7, 28, 16, 3);
      ctx.fill();
      ctx.stroke();
      // Top crisp Philippine Blue-Green Cash Bill
      ctx.fillStyle = '#34d399';
      roundRect(ctx, -16, -10, 28, 16, 3);
      ctx.fill();
      ctx.stroke();
      // Golden Bank Currency Strap
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-5, -10, 10, 16);
      ctx.strokeRect(-5, -10, 10, 16);
      // Peso glyph
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 12px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('₱', 0, -1.5);
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
    } else if (item.type === 'knife') {
      // Glowing Boost Knife Pickup!
      ctx.fillStyle = 'rgba(56, 189, 248, 0.36)';
      ctx.beginPath();
      ctx.arc(0, 0, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.rotate(-0.45 + Math.sin(time * 6) * 0.12);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.4;
      // Handle
      ctx.fillStyle = '#f59e0b';
      roundRect(ctx, -14, -4, 11, 8, 2);
      ctx.fill();
      ctx.stroke();
      // Gleaming cyan-silver blade
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(-3, -6);
      ctx.lineTo(17, -1);
      ctx.lineTo(9, 6);
      ctx.lineTo(-3, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
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

  // ==================== BARANGAY / MALACAÑANG GOAL FLAGPOLE ====================
  function drawGoalFlag(ctx, goalX, groundY, time, cleared, theme = 'day') {
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

    // Little Goal Outpost Arch behind flag
    const goalLabels = {
      malacanang: 'MALACAÑANG',
      pasig: 'PASIG PORT',
      ilocos: 'ILOCOS GATE',
      pangasinan: 'BEACH CAMP',
      kagubatan: 'FOREST SHRINE'
    };
    const isPalace = theme === 'malacanang';
    ctx.fillStyle = isPalace ? '#fffbeb' : theme === 'kagubatan' ? '#14532d' : '#1e3a8a';
    roundRect(ctx, goalX + 66, groundY - 125, 118, 125, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isPalace ? '#dc2626' : '#facc15';
    ctx.fillRect(goalX + 74, groundY - 114, 102, 24);
    ctx.strokeRect(goalX + 74, groundY - 114, 102, 24);
    ctx.fillStyle = isPalace ? '#fde047' : '#111827';
    ctx.font = 'bold 10.5px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(goalLabels[theme] || 'BARANGAY HQ', goalX + 125, groundY - 98);

    // Door
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, goalX + 101, groundY - 62, 40, 62, 18);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  function drawJeepDriverChibi(ctx, x, y, scale = 1, happy = true) {
    // Mini chibi driver inside the Jeepney cabin: Yellow Jersey + Backward Cap!
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Yellow jersey shoulders
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.2;
    roundRect(ctx, -10, 4, 20, 13, 4);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 4);
    ctx.lineTo(0, 8);
    ctx.lineTo(4, 4);
    ctx.stroke();

    // Chibi head
    ctx.fillStyle = '#f5be93';
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.3;
    ctx.beginPath();
    ctx.ellipse(0, -5, 11.5, 10.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(0, -5, 1.8, 0, Math.PI * 2);
    ctx.arc(6, -5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Grin
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if (happy) ctx.arc(3, -1.5, 3.2, 0.15, Math.PI - 0.15);
    else ctx.arc(3, 1, 2.5, Math.PI + 0.2, -0.2);
    ctx.stroke();

    // Backward cap brim pointing back!
    ctx.fillStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.quadraticCurveTo(-19, -9, -19, -5);
    ctx.lineTo(-9, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red cap dome
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, -9.5, 11.5, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front snapback strap (back of cap in front!)
    ctx.fillStyle = '#475569';
    roundRect(ctx, 1, -13, 8, 3, 1);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  return {
    drawHero,
    drawJeepDriverChibi,
    drawEnemy,
    drawBackground,
    drawPlatform,
    drawBlock,
    drawPickup,
    drawGoalFlag
  };
})();
