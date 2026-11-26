window.CULTURES = {
  china: {
    name: "中國・宮商角徵羽",
    songName: "《茉莉花》五聲經典選段",
    accent: "#eab954",
    orbBg: "rgba(255, 245, 198, 0.96)",
    orbGlow: "rgba(246, 196, 68, 0.95)",
    orbText: "#543702",
    scale: [
      { label: "宮", pitch: "C4", freq: 261.63, ratio: "1:1" },
      { label: "商", pitch: "D4", freq: 293.66, ratio: "9:8" },
      { label: "角", pitch: "E4", freq: 329.63, ratio: "81:64" },
      { label: "徵", pitch: "G4", freq: 392.00, ratio: "3:2" },
      { label: "羽", pitch: "A4", freq: 440.00, ratio: "27:16" },
      { label: "高宮", pitch: "C5", freq: 523.25, ratio: "2:1" },
      { label: "高商", pitch: "D5", freq: 587.33, ratio: "9:4" },
      { label: "高角", pitch: "E5", freq: 659.25, ratio: "81:32" }
    ],
    melody: [
      { k: 2, d: 0.45 }, { k: 2, d: 0.23 }, { k: 3, d: 0.23 },
      { k: 4, d: 0.23 }, { k: 5, d: 0.23 }, { k: 5, d: 0.23 }, { k: 4, d: 0.23 },
      { k: 3, d: 0.45 }, { k: 3, d: 0.23 }, { k: 4, d: 0.23 }, { k: 3, d: 0.88 },

      { k: 2, d: 0.45 }, { k: 2, d: 0.23 }, { k: 3, d: 0.23 },
      { k: 4, d: 0.23 }, { k: 5, d: 0.23 }, { k: 5, d: 0.23 }, { k: 4, d: 0.23 },
      { k: 3, d: 0.45 }, { k: 3, d: 0.23 }, { k: 4, d: 0.23 }, { k: 3, d: 0.88 },

      { k: 3, d: 0.45 }, { k: 3, d: 0.45 }, { k: 3, d: 0.45 }, { k: 2, d: 0.23 }, { k: 3, d: 0.23 },
      { k: 4, d: 0.45 }, { k: 4, d: 0.45 }, { k: 3, d: 0.88 },

      { k: 2, d: 0.45 }, { k: 1, d: 0.23 }, { k: 2, d: 0.23 },
      { k: 3, d: 0.45 }, { k: 2, d: 0.23 }, { k: 1, d: 0.23 },
      { k: 0, d: 0.45 }, { k: 0, d: 0.23 }, { k: 1, d: 0.23 }, { k: 0, d: 1.05 }
    ]
  },

  japan: {
    name: "日本・都節音階",
    songName: "《櫻花（さくら）》經典選段",
    accent: "#ef8db2",
    orbBg: "rgba(255, 228, 240, 0.96)",
    orbGlow: "rgba(242, 130, 174, 0.95)",
    orbText: "#631836",
    scale: [
      { label: "下羽", pitch: "B3", freq: 246.94, ratio: "3:4" },
      { label: "陰", pitch: "C4", freq: 261.63, ratio: "4:5" },
      { label: "主音", pitch: "E4", freq: 329.63, ratio: "1:1" },
      { label: "小二", pitch: "F4", freq: 349.23, ratio: "16:15" },
      { label: "純四", pitch: "A4", freq: 440.00, ratio: "4:3" },
      { label: "純五", pitch: "B4", freq: 493.88, ratio: "3:2" },
      { label: "小六", pitch: "C5", freq: 523.25, ratio: "8:5" }
    ],
    melody: [
      { k: 4, d: 0.50 }, { k: 4, d: 0.50 }, { k: 5, d: 0.95 },
      { k: 4, d: 0.50 }, { k: 4, d: 0.50 }, { k: 5, d: 0.95 },
      { k: 4, d: 0.50 }, { k: 5, d: 0.50 }, { k: 6, d: 0.50 }, { k: 5, d: 0.50 },
      { k: 4, d: 0.50 }, { k: 5, d: 0.25 }, { k: 4, d: 0.25 }, { k: 3, d: 0.95 },

      { k: 2, d: 0.50 }, { k: 1, d: 0.50 }, { k: 2, d: 0.50 }, { k: 3, d: 0.50 },
      { k: 2, d: 0.50 }, { k: 2, d: 0.25 }, { k: 1, d: 0.25 }, { k: 0, d: 0.95 },
      { k: 2, d: 0.50 }, { k: 3, d: 0.50 }, { k: 5, d: 0.25 }, { k: 4, d: 0.25 },
      { k: 3, d: 0.50 }, { k: 2, d: 1.05 }
    ]
  },

  arabia: {
    name: "阿拉伯・希賈茲調式",
    songName: "《希賈茲沙漠迴響（Maqam Hijaz）》",
    accent: "#32c49f",
    orbBg: "rgba(196, 250, 232, 0.96)",
    orbGlow: "rgba(52, 212, 168, 0.95)",
    orbText: "#0a4c3b",
    scale: [
      { label: "Duka", pitch: "D4", freq: 293.66, ratio: "1:1" },
      { label: "Kurd", pitch: "Eb4", freq: 311.13, ratio: "2^(1/12)" },
      { label: "Hijaz", pitch: "F#4", freq: 369.99, ratio: "2^(4/12)" },
      { label: "Nawa", pitch: "G4", freq: 392.00, ratio: "4:3" },
      { label: "Husayni", pitch: "A4", freq: 440.00, ratio: "3:2" },
      { label: "Ajam", pitch: "Bb4", freq: 466.16, ratio: "2^(8/12)" },
      { label: "Kardan", pitch: "C5", freq: 523.25, ratio: "2^(10/12)" },
      { label: "Muhayyar", pitch: "D5", freq: 587.33, ratio: "2:1" }
    ],
    melody: [
      { k: 0, d: 0.40 }, { k: 1, d: 0.22 }, { k: 2, d: 0.40 }, { k: 3, d: 0.22 },
      { k: 4, d: 0.68 }, { k: 3, d: 0.24 }, { k: 2, d: 0.40 }, { k: 1, d: 0.40 },

      { k: 2, d: 0.34 }, { k: 3, d: 0.22 }, { k: 4, d: 0.22 }, { k: 5, d: 0.40 },
      { k: 4, d: 0.22 }, { k: 3, d: 0.22 }, { k: 2, d: 0.40 }, { k: 1, d: 0.40 }, { k: 0, d: 0.80 },

      { k: 4, d: 0.40 }, { k: 5, d: 0.22 }, { k: 6, d: 0.22 }, { k: 7, d: 0.68 },
      { k: 6, d: 0.24 }, { k: 5, d: 0.40 }, { k: 4, d: 0.40 }, { k: 3, d: 0.40 }, { k: 2, d: 0.40 },

      { k: 3, d: 0.26 }, { k: 2, d: 0.26 }, { k: 1, d: 0.26 }, { k: 2, d: 0.26 },
      { k: 1, d: 0.40 }, { k: 0, d: 1.0 }
    ]
  }
};

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.55;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(flag) {
    this.muted = flag;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(flag ? 0 : 0.55, this.ctx.currentTime, 0.02);
    }
  }

  // 即時按壓時長感測發聲：支援精準 delaySec 排程（對齊目標拍點 t_beat）
  startSustainedNote(freq, style = "piano", delaySec = 0) {
    if (this.muted) {
      return { stop: () => {}, startedAt: performance.now() + delaySec * 1000 };
    }
    this.init();
    const t0 = this.ctx.currentTime + Math.max(0, delaySec);
    const maxHoldSec = 4.2;

    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";

    const oscs = [];
    const addOsc = (type, f, gainVal, detune = 0) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f, t0);
      if (detune) osc.detune.setValueAtTime(detune, t0);
      g.gain.setValueAtTime(gainVal, t0);
      osc.connect(g);
      g.connect(filter);
      osc.start(t0);
      osc.stop(t0 + maxHoldSec + 0.6);
      oscs.push(osc);
    };

    let peakGain = 0.72;
    let sustainGain = 0.42;

    if (style === "piano") {
      addOsc("triangle", freq, 0.58, 0);
      addOsc("sine", freq, 0.18, 3.2);
      addOsc("sine", freq, 0.15, -3.2);
      addOsc("sine", freq * 2, 0.24, 0);
      addOsc("sine", freq * 3, 0.10, 0);
      addOsc("sine", freq * 4, 0.04, 0);

      filter.frequency.setValueAtTime(Math.min(6000, freq * 8.5), t0);
      filter.frequency.exponentialRampToValueAtTime(Math.max(950, freq * 2.1), t0 + 2.8);

      peakGain = 0.72;
      sustainGain = 0.42;
      noteGain.gain.setValueAtTime(0.0001, t0);
      noteGain.gain.linearRampToValueAtTime(peakGain, t0 + 0.008);
      noteGain.gain.exponentialRampToValueAtTime(sustainGain, t0 + 0.22);
      noteGain.gain.exponentialRampToValueAtTime(0.18, t0 + 2.4);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t0 + maxHoldSec);
    } else if (style === "china") {
      addOsc("triangle", freq, 0.65, 0);
      addOsc("sine", freq * 2, 0.28, 0);
      addOsc("sine", freq * 3, 0.08, 2.0);
      filter.frequency.setValueAtTime(2900, t0);
      filter.frequency.exponentialRampToValueAtTime(800, t0 + 2.4);

      peakGain = 0.72;
      sustainGain = 0.34;
      noteGain.gain.setValueAtTime(0.0001, t0);
      noteGain.gain.linearRampToValueAtTime(peakGain, t0 + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(sustainGain, t0 + 0.35);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t0 + maxHoldSec);
    } else if (style === "japan") {
      addOsc("sawtooth", freq, 0.45, 0);
      addOsc("triangle", freq * 2, 0.22, 0);
      filter.frequency.setValueAtTime(3400, t0);
      filter.frequency.exponentialRampToValueAtTime(620, t0 + 2.1);

      peakGain = 0.58;
      sustainGain = 0.28;
      noteGain.gain.setValueAtTime(0.0001, t0);
      noteGain.gain.linearRampToValueAtTime(peakGain, t0 + 0.008);
      noteGain.gain.exponentialRampToValueAtTime(sustainGain, t0 + 0.3);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t0 + maxHoldSec);
    } else {
      addOsc("sawtooth", freq, 0.46, 0);
      addOsc("triangle", freq * 0.5, 0.24, 0);
      filter.Q.setValueAtTime(2.3, t0);
      filter.frequency.setValueAtTime(2200, t0);
      filter.frequency.exponentialRampToValueAtTime(520, t0 + 2.2);

      peakGain = 0.58;
      sustainGain = 0.30;
      noteGain.gain.setValueAtTime(0.0001, t0);
      noteGain.gain.linearRampToValueAtTime(peakGain, t0 + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(sustainGain, t0 + 0.32);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t0 + maxHoldSec);
    }

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    let stopped = false;
    const stop = (holdMs = 200) => {
      if (stopped || !this.ctx) return;
      stopped = true;
      const isShort = holdMs < 240;
      const releaseSec = isShort ? 0.065 : Math.min(0.45, 0.16 + holdMs / 2400);
      const curTime = this.ctx.currentTime;

      try {
        if (curTime < t0) {
          const shortPlaySec = Math.max(0.085, Math.min(0.18, holdMs / 1000));
          const stopAt = t0 + shortPlaySec;
          noteGain.gain.cancelScheduledValues(stopAt);
          noteGain.gain.setValueAtTime(peakGain * 0.72, stopAt);
          noteGain.gain.exponentialRampToValueAtTime(0.0008, stopAt + releaseSec);
          oscs.forEach((osc) => {
            try { osc.stop(stopAt + releaseSec + 0.04); } catch (e) {}
          });
        } else {
          const stopAt = Math.max(curTime, t0 + 0.045);
          noteGain.gain.cancelScheduledValues(stopAt);
          const curVal = Math.max(0.001, noteGain.gain.value);
          noteGain.gain.setValueAtTime(curVal, stopAt);
          noteGain.gain.exponentialRampToValueAtTime(0.0008, stopAt + releaseSec);
          oscs.forEach((osc) => {
            try { osc.stop(stopAt + releaseSec + 0.04); } catch (e) {}
          });
        }
      } catch (e) {}
    };

    return { stop, startedAt: performance.now() + delaySec * 1000, audioStartTime: t0 };
  }

  // 輕柔節拍器滴答聲（用戶可選擇開啟輔助跟拍）
  playMetronomeTick(accent = false) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(accent ? 1100 : 780, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(accent ? 0.16 : 0.09, now + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.04);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playPianoNote(freq, duration = 0.9, articulation = "normal") {
    if (this.muted) return;
    const effectiveArt = articulation === "normal" ? (duration <= 0.30 ? "short" : "long") : articulation;
    const handle = this.startSustainedNote(freq, "piano", 0);
    const holdMs = effectiveArt === "short"
      ? Math.max(100, Math.min(180, duration * 650))
      : Math.max(360, duration * 900);
    setTimeout(() => handle.stop(holdMs), holdMs);
  }

  playNote(freq, duration = 0.7, style = "china", articulation = "normal") {
    if (style === "piano") {
      this.playPianoNote(freq, duration, articulation);
      return;
    }
    if (this.muted) return;
    const effectiveArt = articulation === "normal" ? (duration <= 0.30 ? "short" : "long") : articulation;
    const handle = this.startSustainedNote(freq, style, 0);
    const holdMs = effectiveArt === "short"
      ? Math.max(100, Math.min(180, duration * 650))
      : Math.max(340, duration * 880);
    setTimeout(() => handle.stop(holdMs), holdMs);
  }

  playTone(freq, duration = 0.6, amp = 0.45) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(amp, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  playHarmonics(baseFreq, amps, duration = 1.1) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const total = amps.reduce((a, b) => a + b, 0) || 1;
    const bus = this.ctx.createGain();

    bus.gain.setValueAtTime(0.001, now);
    bus.gain.linearRampToValueAtTime(0.55, now + 0.025);
    bus.gain.exponentialRampToValueAtTime(0.001, now + duration);
    bus.connect(this.masterGain);

    amps.forEach((a, idx) => {
      if (a <= 0) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * (idx + 1), now);
      g.gain.setValueAtTime(a / total, now);
      osc.connect(g);
      g.connect(bus);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }
}

// =========================================================================
// 節拍量化吸附引擎（Quantize Snapping）：支援用戶自訂 BPM 與 snapWindow
// 判定公式：尋找最近拍點 t_beat；若 |t_input - t_beat| <= effectiveSnapWindow，
//          則視為踩在該拍點上，有效時間對齊為 t_beat（早按排程至 t_beat，晚按立即發聲並記為 t_beat）；
//          若超出容錯範圍則不強行吸附（保留節奏訓練回饋），且容錯自動限制小於半拍。
// =========================================================================
class BeatQuantizer {
  constructor() {
    this.bpm = 240;
    this.snapWindowMs = 80; // 預設 ±80 ms（用戶可自調 ±60 / ±80 / ±100 / ±120 ms）
    this.enabled = true;
    this.metronomeSound = false;
    this.anchorSec = 0;

    // 讀取先前設定，讓演奏舞台與鋼琴頁面保持一致
    this.loadPrefs();

    // 拍點視覺／節拍聲監聽器
    this._pulseListeners = new Set();
    this._lastPulsedBeat = -1;
    this._rafId = null;
    this._startPulseLoop();
  }

  loadPrefs() {
    try {
      const savedBpm = parseInt(localStorage.getItem("mma_bpm"), 10);
      if (savedBpm >= 40 && savedBpm <= 240) this.bpm = savedBpm;
      const savedWin = parseInt(localStorage.getItem("mma_snap_ms"), 10);
      if (savedWin >= 30 && savedWin <= 150) this.snapWindowMs = savedWin;
      const savedEn = localStorage.getItem("mma_quantize_on");
      if (savedEn !== null) this.enabled = savedEn === "true";
    } catch (_) {}
  }

  savePrefs() {
    try {
      localStorage.setItem("mma_bpm", String(this.bpm));
      localStorage.setItem("mma_snap_ms", String(this.snapWindowMs));
      localStorage.setItem("mma_quantize_on", String(this.enabled));
    } catch (_) {}
  }

  get periodSec() {
    return 60 / this.bpm;
  }

  get periodMs() {
    return 60000 / this.bpm;
  }

  get halfBeatMs() {
    return this.periodMs / 2;
  }

  // 安全防呆上限：不得超過半拍（取半拍的 88%），避免亂按也被強行吸到拍點
  get maxSafeSnapMs() {
    return Math.max(25, Math.floor(this.halfBeatMs * 0.88));
  }

  get effectiveSnapWindowMs() {
    return Math.min(this.snapWindowMs, this.maxSafeSnapMs);
  }

  get isWindowCapped() {
    return this.snapWindowMs > this.maxSafeSnapMs;
  }

  getNowSec() {
    if (window.audioEngine.ctx) {
      return window.audioEngine.ctx.currentTime;
    }
    return performance.now() / 1000;
  }

  resetAnchor() {
    this.anchorSec = this.getNowSec();
    this._lastPulsedBeat = -1;
  }

  setBpm(newBpm) {
    const clamped = Math.max(40, Math.min(240, Math.round(Number(newBpm) || 120)));
    this.bpm = clamped;
    this.resetAnchor();
    this.savePrefs();
  }

  setSnapWindowMs(ms) {
    const clamped = Math.max(30, Math.min(150, Math.round(Number(ms) || 80)));
    this.snapWindowMs = clamped;
    this.savePrefs();
  }

  setEnabled(flag) {
    this.enabled = Boolean(flag);
    if (this.enabled) this.resetAnchor();
    this.savePrefs();
  }

  setMetronomeSound(flag) {
    this.metronomeSound = Boolean(flag);
    if (this.metronomeSound) {
      window.audioEngine.init();
      this.resetAnchor();
    }
  }

  onBeatPulse(fn) {
    this._pulseListeners.add(fn);
    return () => this._pulseListeners.delete(fn);
  }

  _startPulseLoop() {
    const tick = () => {
      this._rafId = requestAnimationFrame(tick);
      if (!this.enabled && !this.metronomeSound) return;

      const nowSec = this.getNowSec();
      const rel = nowSec - this.anchorSec;
      if (rel < 0) return;

      const beatIdx = Math.floor(rel / this.periodSec);
      if (beatIdx !== this._lastPulsedBeat) {
        this._lastPulsedBeat = beatIdx;
        const isAccent = beatIdx % 4 === 0;
        if (this.metronomeSound && window.audioEngine.ctx) {
          window.audioEngine.playMetronomeTick(isAccent);
        }
        this._pulseListeners.forEach((fn) => fn({ beatIndex: beatIdx, isAccent }));
      }
    };
    this._rafId = requestAnimationFrame(tick);
  }

  // 核心量化吸附判定：|t_input - t_beat| <= effectiveSnapWindow
  evaluateInput() {
    window.audioEngine.init();
    const tInputSec = this.getNowSec();
    const relSec = Math.max(0, tInputSec - this.anchorSec);
    const period = this.periodSec;

    if (!this.enabled) {
      return {
        enabled: false,
        snapped: false,
        delaySec: 0,
        delayMs: 0,
        deltaMs: 0,
        tInputSec,
        tBeatSec: tInputSec,
        effectiveTimeSec: tInputSec,
        beatIndex: Math.round(relSec / period),
        snapWindowMs: this.effectiveSnapWindowMs,
        judgment: "自由節奏"
      };
    }

    // 尋找最近拍點 t_beat（四捨五入至最近拍點，兼顧早按與晚按）
    const nearestIdx = Math.round(relSec / period);
    const tBeatSec = this.anchorSec + nearestIdx * period;
    const deltaSec = tInputSec - tBeatSec; // < 0 代表早按，> 0 代表晚按
    const deltaMs = Math.round(deltaSec * 1000);
    const absDeltaMs = Math.abs(deltaMs);
    const winMs = this.effectiveSnapWindowMs;

    if (absDeltaMs <= winMs) {
      // 吸附條件成立：|t_input - t_beat| <= snapWindow
      // 早按（t_input < t_beat）：聲音與視覺排程至 t_beat；晚按（t_input >= t_beat）：立即觸發，有效時間仍對齊為 t_beat
      const delaySec = deltaSec < 0 ? -deltaSec : 0;
      const judgment = absDeltaMs <= 25
        ? "完美踩拍"
        : (deltaMs < 0 ? "早按已吸附" : "晚按已吸附");

      return {
        enabled: true,
        snapped: true,
        delaySec,
        delayMs: Math.round(delaySec * 1000),
        deltaMs,
        tInputSec,
        tBeatSec,
        effectiveTimeSec: tBeatSec,
        beatIndex: nearestIdx,
        snapWindowMs: winMs,
        judgment
      };
    }

    // 超出吸附容錯範圍：不強行吸附，保留原始輸入時間並提示偏拍（訓練節奏感）
    return {
      enabled: true,
      snapped: false,
      delaySec: 0,
      delayMs: 0,
      deltaMs,
      tInputSec,
      tBeatSec,
      effectiveTimeSec: tInputSec,
      beatIndex: nearestIdx,
      snapWindowMs: winMs,
      judgment: deltaMs < 0 ? "過早未吸附" : "過晚未吸附"
    };
  }
}

// =========================================================================
// 演奏錄製／打譜輔助器（QuantizeRecorder）
// 紀錄每個音符的原始時間 t_input 與量化對齊時間 t_beat，並支援量化回放
// =========================================================================
class QuantizeRecorder {
  constructor(quantizer) {
    this.quantizer = quantizer;
    this.isRecording = false;
    this.isReplaying = false;
    this.startSec = 0;
    this.events = [];
    this.replayTimers = [];
  }

  startRecording() {
    this.stopReplay();
    window.audioEngine.init();
    this.quantizer.resetAnchor();
    this.startSec = this.quantizer.anchorSec;
    this.events = [];
    this.isRecording = true;
  }

  stopRecording() {
    this.isRecording = false;
    // 依有效量化時間排序，並把第一顆音平移到起點（保留整齊拍點間隔）
    if (this.events.length > 0) {
      this.events.sort((a, b) => a.effectiveOffsetMs - b.effectiveOffsetMs);
    }
    return this.getStats();
  }

  clear() {
    this.stopReplay();
    this.isRecording = false;
    this.events = [];
  }

  recordNoteStart(noteInfo, evalResult) {
    if (!this.isRecording) return null;
    const rawOffsetMs = Math.max(0, Math.round((evalResult.tInputSec - this.startSec) * 1000));
    const effectiveOffsetMs = Math.max(0, Math.round((evalResult.effectiveTimeSec - this.startSec) * 1000));
    const evt = {
      id: `${Date.now()}-${Math.random()}`,
      label: noteInfo.label,
      pitch: noteInfo.pitch,
      freq: noteInfo.freq,
      scaleIndex: noteInfo.scaleIndex,
      rawOffsetMs,
      effectiveOffsetMs,
      beatNumber: evalResult.beatIndex + 1,
      deltaMs: evalResult.deltaMs,
      snapped: evalResult.snapped,
      holdMs: 260
    };
    this.events.push(evt);
    return evt;
  }

  updateNoteHold(evt, holdMs) {
    if (!evt) return;
    evt.holdMs = Math.max(85, Math.min(3500, Math.round(holdMs)));
  }

  getStats() {
    const total = this.events.length;
    const snappedCount = this.events.filter((e) => e.snapped).length;
    const rate = total > 0 ? Math.round((snappedCount / total) * 100) : 0;
    return { total, snappedCount, rate };
  }

  replay(onPlayEvent, onComplete) {
    if (this.events.length === 0) return false;
    this.stopReplay();
    this.isRecording = false;
    this.isReplaying = true;

    const baseOffset = this.events[0].effectiveOffsetMs;
    let maxEndMs = 0;

    this.events.forEach((evt) => {
      const fireMs = Math.max(0, evt.effectiveOffsetMs - baseOffset);
      maxEndMs = Math.max(maxEndMs, fireMs + evt.holdMs);
      const id = setTimeout(() => {
        if (!this.isReplaying) return;
        onPlayEvent(evt);
      }, fireMs);
      this.replayTimers.push(id);
    });

    const endId = setTimeout(() => {
      this.isReplaying = false;
      this.replayTimers = [];
      if (onComplete) onComplete();
    }, maxEndMs + 280);
    this.replayTimers.push(endId);
    return true;
  }

  stopReplay() {
    this.replayTimers.forEach((id) => clearTimeout(id));
    this.replayTimers = [];
    this.isReplaying = false;
  }
}

window.audioEngine = new AudioEngine();
window.BeatQuantizer = BeatQuantizer;
window.QuantizeRecorder = QuantizeRecorder;
window.beatQuantizer = new BeatQuantizer();
