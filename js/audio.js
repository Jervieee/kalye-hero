// Synthesized Retro Arcade SFX & Upbeat Chiptune Loop (Zero external assets needed)
const SoundFX = (() => {
  let ctx = null;
  let muted = false;
  let bgmTimer = null;
  let bgmStep = 0;
  let bgmRunning = false;

  function ensureContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type = 'square', volume = 0.12, slideTo = null, delay = 0) {
    if (muted) return;
    const c = ensureContext();
    if (!c) return;
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), now + duration);
    }
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  let sharedNoiseBuffer = null;

  function playNoise(duration, volume = 0.14, highpass = 600, delay = 0) {
    if (muted) return;
    const c = ensureContext();
    if (!c) return;
    const now = c.currentTime + delay;
    if (!sharedNoiseBuffer || sharedNoiseBuffer.sampleRate !== c.sampleRate) {
      const len = Math.floor(c.sampleRate * 0.5);
      sharedNoiseBuffer = c.createBuffer(1, len, c.sampleRate);
      const data = sharedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    const noise = c.createBufferSource();
    noise.buffer = sharedNoiseBuffer;

    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(highpass, now);

    const gain = c.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start(now);
    noise.stop(now + duration);
  }

  // Upbeat Mario-inspired Kalye chiptune bass + melody
  const melodyNotes = [
    523.25, 659.25, 783.99, 0, 659.25, 783.99, 1046.5, 0,
    880.0, 783.99, 659.25, 587.33, 659.25, 0, 523.25, 0,
    587.33, 698.46, 880.0, 0, 783.99, 659.25, 587.33, 523.25,
    587.33, 659.25, 783.99, 659.25, 523.25, 0, 392.0, 0
  ];
  const bassNotes = [
    130.81, 0, 196.0, 0, 130.81, 0, 196.0, 0,
    174.61, 0, 130.81, 0, 146.83, 0, 196.0, 0,
    146.83, 0, 220.0, 0, 196.0, 0, 130.81, 0,
    146.83, 0, 196.0, 0, 130.81, 164.81, 196.0, 0
  ];

  function startBGM() {
    if (bgmRunning) return;
    bgmRunning = true;
    bgmStep = 0;
    bgmTimer = setInterval(() => {
      if (muted || !bgmRunning) return;
      const m = melodyNotes[bgmStep % melodyNotes.length];
      const b = bassNotes[bgmStep % bassNotes.length];
      if (m > 0) playTone(m, 0.13, 'square', 0.032);
      if (b > 0) playTone(b, 0.15, 'triangle', 0.055);
      bgmStep++;
    }, 170);
  }

  function stopBGM() {
    bgmRunning = false;
    if (bgmTimer) {
      clearInterval(bgmTimer);
      bgmTimer = null;
    }
  }

  return {
    unlock() {
      ensureContext();
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
    startBGM,
    stopBGM,
    jump() {
      playTone(260, 0.16, 'square', 0.11, 620);
    },
    doubleJump() {
      playTone(420, 0.12, 'triangle', 0.13, 860);
      playTone(640, 0.14, 'square', 0.09, 1080, 0.05);
    },
    horn() {
      // Classic Philippine Jeepney "BEEP-BEEP / POT-POT!"
      playTone(466.16, 0.11, 'sawtooth', 0.13);
      playTone(587.33, 0.11, 'square', 0.09);
      playTone(466.16, 0.16, 'sawtooth', 0.13, null, 0.14);
      playTone(587.33, 0.16, 'square', 0.09, null, 0.14);
    },
    board() {
      playTone(523.25, 0.08, 'triangle', 0.12);
      playTone(783.99, 0.12, 'triangle', 0.12, null, 0.07);
    },
    farePaid() {
      playTone(783.99, 0.07, 'square', 0.1);
      playTone(1046.5, 0.08, 'square', 0.11, null, 0.06);
      playTone(1318.51, 0.18, 'square', 0.12, null, 0.12);
    },
    angry() {
      playTone(220, 0.12, 'sawtooth', 0.14, 150);
      playTone(170, 0.18, 'sawtooth', 0.15, 95, 0.11);
    },
    sizzle() {
      playNoise(0.16, 0.09, 1800);
      playTone(340, 0.08, 'triangle', 0.08, 480);
    },
    dishReady() {
      playTone(659.25, 0.08, 'triangle', 0.11);
      playTone(987.77, 0.14, 'triangle', 0.12, null, 0.07);
    },
    serveHappy() {
      playTone(587.33, 0.07, 'square', 0.1);
      playTone(880, 0.08, 'square', 0.11, null, 0.06);
      playTone(1174.66, 0.16, 'square', 0.11, null, 0.12);
    },
    trashDish() {
      playTone(240, 0.1, 'sawtooth', 0.08, 120);
    },
    bounce() {
      playTone(220, 0.22, 'triangle', 0.16, 840);
    },
    coin() {
      playTone(987.77, 0.08, 'square', 0.1);
      playTone(1318.51, 0.18, 'square', 0.1, null, 0.07);
    },
    cash() {
      playTone(880, 0.07, 'triangle', 0.13);
      playTone(1174.66, 0.08, 'square', 0.11, null, 0.06);
      playTone(1567.98, 0.18, 'square', 0.12, null, 0.13);
    },
    blockBump() {
      playTone(190, 0.09, 'triangle', 0.16, 110);
    },
    crateBreak() {
      playNoise(0.14, 0.16, 300);
      playTone(160, 0.11, 'sawtooth', 0.1, 60);
    },
    punchSwing() {
      playNoise(0.08, 0.11, 1200);
      playTone(320, 0.08, 'triangle', 0.1, 120);
    },
    punchHit() {
      playNoise(0.11, 0.2, 400);
      playTone(210, 0.12, 'sawtooth', 0.18, 70);
      playTone(540, 0.07, 'square', 0.1, 240, 0.02);
    },
    noEnergy() {
      playTone(150, 0.09, 'sawtooth', 0.09, 110);
    },
    shoot(spread = false) {
      playNoise(0.08, 0.18, 900);
      playTone(spread ? 640 : 780, 0.1, 'sawtooth', 0.13, 180);
      if (spread) {
        playTone(520, 0.12, 'square', 0.1, 140, 0.02);
      }
    },
    powerup() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => playTone(n, 0.11, 'square', 0.11, null, i * 0.065));
    },
    energyDrink() {
      const notes = [440, 587.33, 880, 1174.66];
      notes.forEach((n, i) => playTone(n, 0.09, 'triangle', 0.13, null, i * 0.05));
    },
    stomp() {
      playTone(420, 0.12, 'square', 0.13, 160);
      playTone(620, 0.09, 'triangle', 0.11, 880, 0.05);
    },
    enemyKO() {
      playTone(340, 0.1, 'sawtooth', 0.12, 120);
      playTone(520, 0.14, 'square', 0.09, 760, 0.06);
    },
    hurt() {
      playTone(280, 0.16, 'sawtooth', 0.16, 95);
      playNoise(0.12, 0.14, 500);
    },
    stageClear() {
      stopBGM();
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
      const durs = [0.1, 0.1, 0.1, 0.16, 0.1, 0.14, 0.35];
      let t = 0;
      notes.forEach((n, i) => {
        playTone(n, durs[i], 'square', 0.12, null, t);
        t += durs[i] * 0.95;
      });
    },
    gameOver() {
      stopBGM();
      const notes = [392.0, 349.23, 329.63, 261.63];
      notes.forEach((n, i) => playTone(n, 0.24, 'sawtooth', 0.12, n * 0.92, i * 0.22));
    }
  };
})();
