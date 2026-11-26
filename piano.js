// ===== 完整 27 鍵鋼琴音域（A3 ~ B5：16 白鍵 + 11 黑鍵，完整涵蓋中國全黑鍵五聲、日本、阿拉伯） =====
const PIANO_KEYS = [
  { pitch: "A3",  freq: 220.00, isBlack: false, aliases: ["A3"] },
  { pitch: "Bb3", freq: 233.08, isBlack: true,  aliases: ["Bb3", "A#3"] },
  { pitch: "B3",  freq: 246.94, isBlack: false, aliases: ["B3"] },
  { pitch: "C4",  freq: 261.63, isBlack: false, aliases: ["C4"] },
  { pitch: "C#4", freq: 277.18, isBlack: true,  aliases: ["C#4", "Db4"] },
  { pitch: "D4",  freq: 293.66, isBlack: false, aliases: ["D4"] },
  { pitch: "Eb4", freq: 311.13, isBlack: true,  aliases: ["Eb4", "D#4"] },
  { pitch: "E4",  freq: 329.63, isBlack: false, aliases: ["E4"] },
  { pitch: "F4",  freq: 349.23, isBlack: false, aliases: ["F4"] },
  { pitch: "F#4", freq: 369.99, isBlack: true,  aliases: ["F#4", "Gb4"] },
  { pitch: "G4",  freq: 392.00, isBlack: false, aliases: ["G4"] },
  { pitch: "G#4", freq: 415.30, isBlack: true,  aliases: ["G#4", "Ab4"] },
  { pitch: "A4",  freq: 440.00, isBlack: false, aliases: ["A4"] },
  { pitch: "A#4", freq: 466.16, isBlack: true,  aliases: ["A#4", "Bb4"] },
  { pitch: "B4",  freq: 493.88, isBlack: false, aliases: ["B4"] },
  { pitch: "C5",  freq: 523.25, isBlack: false, aliases: ["C5"] },
  { pitch: "C#5", freq: 554.37, isBlack: true,  aliases: ["C#5", "Db5"] },
  { pitch: "D5",  freq: 587.33, isBlack: false, aliases: ["D5"] },
  { pitch: "D#5", freq: 622.25, isBlack: true,  aliases: ["D#5", "Eb5"] },
  { pitch: "E5",  freq: 659.25, isBlack: false, aliases: ["E5"] },
  { pitch: "F5",  freq: 698.46, isBlack: false, aliases: ["F5"] },
  { pitch: "F#5", freq: 739.99, isBlack: true,  aliases: ["F#5", "Gb5"] },
  { pitch: "G5",  freq: 783.99, isBlack: false, aliases: ["G5"] },
  { pitch: "G#5", freq: 830.61, isBlack: true,  aliases: ["G#5", "Ab5"] },
  { pitch: "A5",  freq: 880.00, isBlack: false, aliases: ["A5"] },
  { pitch: "A#5", freq: 932.33, isBlack: true,  aliases: ["A#5", "Bb5"] },
  { pitch: "B5",  freq: 987.77, isBlack: false, aliases: ["B5"] }
];

// 中國鋼琴對照專屬：全黑鍵五聲音階（F# 宮調式：2-2-3-2-3 全落於黑鍵）
const CHINA_BLACK_KEY_SCALE = [
  { label: "宮",   pitch: "F#4", freq: 369.99, ratio: "1:1" },
  { label: "商",   pitch: "G#4", freq: 415.30, ratio: "9:8" },
  { label: "角",   pitch: "A#4", freq: 466.16, ratio: "81:64" },
  { label: "徵",   pitch: "C#5", freq: 554.37, ratio: "3:2" },
  { label: "羽",   pitch: "D#5", freq: 622.25, ratio: "27:16" },
  { label: "高宮", pitch: "F#5", freq: 739.99, ratio: "2:1" },
  { label: "高商", pitch: "G#5", freq: 830.61, ratio: "9:4" },
  { label: "高角", pitch: "A#5", freq: 932.33, ratio: "81:32" }
];

const params = new URLSearchParams(window.location.search);
let currentCulture = window.CULTURES[params.get("culture")] ? params.get("culture") : "china";
let usePianoSound = true;
let isPlaying = false;
let songTimers = [];
const autoFlashTimers = new Map();
const activeManualPresses = new Map();

const quantizer = window.beatQuantizer;
const recorder = new window.QuantizeRecorder(quantizer);

const backToStageEl = document.getElementById("back-to-stage");
const playBtn = document.getElementById("piano-play-btn");
const assistBtn = document.getElementById("piano-assist-btn");
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const cultureTabs = document.querySelectorAll(".p-tab");

const bpmSlider = document.getElementById("piano-bpm-slider");
const bpmDecBtn = document.getElementById("piano-bpm-dec");
const bpmIncBtn = document.getElementById("piano-bpm-inc");
const bpmValEl = document.getElementById("piano-bpm-val");
const periodHintEl = document.getElementById("piano-period-hint");
const winCapEl = document.getElementById("piano-win-cap");
const metroBtn = document.getElementById("piano-metro-btn");
const recBtn = document.getElementById("piano-rec-btn");
const replayBtn = document.getElementById("piano-replay-btn");
const clearRecBtn = document.getElementById("piano-clear-rec-btn");

const badgeEl = document.getElementById("piano-culture-badge");
const titleEl = document.getElementById("piano-song-title");
const beatDotEl = document.getElementById("piano-beat-dot");
const readoutArtEl = document.getElementById("readout-art");
const readoutNoteEl = document.getElementById("readout-note");
const readoutDetailEl = document.getElementById("readout-detail");
const rhythmStripTitleEl = document.getElementById("rhythm-strip-title");
const rhythmTrackEl = document.getElementById("rhythm-track");
const pianoKeysEl = document.getElementById("piano-keys");
const pianoScrollEl = document.getElementById("piano-keys-scroll");
const scaleKeyboardEl = document.getElementById("piano-scale-keyboard");
const scalePanelTitleEl = document.getElementById("scale-panel-title");

function getActiveScale() {
  if (currentCulture === "china") return CHINA_BLACK_KEY_SCALE;
  return window.CULTURES[currentCulture].scale;
}

function findPianoKeyByPitch(pitch) {
  return PIANO_KEYS.find((k) => k.pitch === pitch || k.aliases.includes(pitch)) || null;
}

function findScaleMatch(pianoKey) {
  const scale = getActiveScale();
  const idx = scale.findIndex((item) => pianoKey.pitch === item.pitch || pianoKey.aliases.includes(item.pitch));
  return idx >= 0 ? { index: idx, note: scale[idx] } : null;
}

function pulseBeatDot() {
  beatDotEl.classList.remove("flash");
  void beatDotEl.offsetWidth;
  beatDotEl.classList.add("flash");
}

quantizer.onBeatPulse(() => {
  if (quantizer.enabled || quantizer.metronomeSound) {
    pulseBeatDot();
  }
});

function syncQuantizeUI() {
  const bpm = quantizer.bpm;
  const effWin = quantizer.effectiveSnapWindowMs;
  const halfBeat = Math.round(quantizer.halfBeatMs);

  assistBtn.textContent = quantizer.enabled
    ? `🎯 量化吸附：開 (${bpm} BPM)`
    : "🎯 量化吸附：關";
  assistBtn.classList.toggle("active-mode", quantizer.enabled);
  assistBtn.setAttribute("aria-pressed", String(quantizer.enabled));

  bpmSlider.value = bpm;
  bpmValEl.textContent = bpm;
  periodHintEl.textContent = `${Math.round(quantizer.periodMs)}ms/拍`;
  winCapEl.textContent = quantizer.isWindowCapped
    ? `實際 ±${effWin}ms (<半拍${halfBeat}ms)`
    : `(<半拍${halfBeat}ms)`;

  document.querySelectorAll(".win-preset").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.win) === quantizer.snapWindowMs);
  });

  metroBtn.textContent = quantizer.metronomeSound ? "🔔 節拍聲：開" : "🔔 節拍聲：關";
  metroBtn.classList.toggle("active", quantizer.metronomeSound);

  const stats = recorder.getStats();
  recBtn.textContent = recorder.isRecording ? "■ 停止錄製" : "⏺ 錄製打譜";
  recBtn.classList.toggle("recording", recorder.isRecording);
  replayBtn.textContent = recorder.isReplaying ? "■ 停止回放" : `▶ 量化回放 (${stats.total})`;
  replayBtn.disabled = stats.total === 0 || recorder.isRecording;
  clearRecBtn.disabled = stats.total === 0 || recorder.isRecording;

  if (!isPlaying && !recorder.isRecording && !recorder.isReplaying) {
    rhythmStripTitleEl.textContent = quantizer.enabled
      ? `節拍量化吸附即時軌（${bpm} BPM｜|t_input − t_beat| ≤ ±${effWin}ms 自動對齊拍點・超出提示偏拍）`
      : "按壓時長即時軌（量化吸附已關閉・自由節奏）";
  }
}

function createRhythmBlock(label, evalRes) {
  const placeholder = rhythmTrackEl.querySelector(".rhythm-placeholder");
  if (placeholder) placeholder.remove();

  const block = document.createElement("div");
  block.className = "rhythm-block holding-block";
  const prefix = evalRes && evalRes.enabled
    ? (evalRes.snapped ? "🎯" : "⚠")
    : "●";
  block.innerHTML = `
    <span class="rb-tag">${prefix}</span>
    <span class="rb-note">${label}</span>
    <span class="rb-ms">按住中…</span>
  `;
  rhythmTrackEl.appendChild(block);

  while (rhythmTrackEl.children.length > 14) {
    rhythmTrackEl.removeChild(rhythmTrackEl.firstChild);
  }
  rhythmTrackEl.scrollLeft = rhythmTrackEl.scrollWidth;
  return block;
}

function finalizeRhythmBlock(block, holdMs, evalRes) {
  if (!block) return;
  const isShort = holdMs < 240;
  block.classList.remove("holding-block");
  block.classList.add(isShort ? "short" : "long");

  if (evalRes && evalRes.enabled) {
    block.classList.add(evalRes.snapped ? "assisted" : "offbeat");
  }

  if (!isShort) {
    const pxWidth = Math.min(210, Math.max(114, Math.round(holdMs * 0.19)));
    block.style.minWidth = `${pxWidth}px`;
  }

  const tagEl = block.querySelector(".rb-tag");
  const msEl = block.querySelector(".rb-ms");

  if (evalRes && evalRes.enabled) {
    const sign = evalRes.deltaMs >= 0 ? "+" : "";
    if (evalRes.snapped) {
      if (tagEl) tagEl.textContent = `🎯第${evalRes.beatIndex + 1}拍`;
      if (msEl) msEl.textContent = `${sign}${evalRes.deltaMs}ms・${holdMs}ms`;
    } else {
      if (tagEl) tagEl.textContent = "⚠偏拍";
      if (msEl) msEl.textContent = `${sign}${evalRes.deltaMs}ms・${holdMs}ms`;
    }
  } else {
    if (tagEl) tagEl.textContent = isShort ? "⚡短音" : "〰長音";
    if (msEl) msEl.textContent = `${holdMs}ms`;
  }
  rhythmTrackEl.scrollLeft = rhythmTrackEl.scrollWidth;
}

function clearAllHighlights() {
  autoFlashTimers.forEach((id) => clearTimeout(id));
  autoFlashTimers.clear();
  document.querySelectorAll(".piano-white-key, .piano-black-key, .stage-key").forEach((el) => {
    el.classList.remove("active", "holding", "art-short", "art-long");
  });
}

function releaseAllManualPresses() {
  Array.from(activeManualPresses.keys()).forEach((id) => endManualPress(id));
}

// =========================================================================
// 核心：即時偵測按鍵時長（長按長音／短按短音）＋ 節拍量化吸附（Quantize Snapping）
// =========================================================================
function beginManualPress(inputId, pitch, freq) {
  if (activeManualPresses.has(inputId)) return;

  window.audioEngine.init();
  const pianoObj = findPianoKeyByPitch(pitch);
  const canonicalPitch = pianoObj ? pianoObj.pitch : pitch;
  const match = pianoObj ? findScaleMatch(pianoObj) : null;
  const label = match ? match.note.label : canonicalPitch;

  const pianoBtn = pianoKeysEl.querySelector(`[data-pitch="${canonicalPitch}"]`);
  const scaleBtn = match ? scaleKeyboardEl.querySelector(`[data-index="${match.index}"]`) : null;

  const pressedAt = performance.now();

  // 執行 Quantize Snapping：判斷 |t_input - t_beat| <= snapWindow
  const evalRes = quantizer.evaluateInput();
  const style = usePianoSound ? "piano" : currentCulture;
  const voice = window.audioEngine.startSustainedNote(freq, style, evalRes.delaySec);

  const recEvent = recorder.recordNoteStart(
    { label, pitch: canonicalPitch, freq, scaleIndex: match ? match.index : null },
    evalRes
  );
  if (recEvent) syncQuantizeUI();

  const record = {
    inputId,
    pitch: canonicalPitch,
    freq,
    label,
    pianoObj,
    match,
    pianoBtn,
    scaleBtn,
    pressedAt,
    voice,
    evalRes,
    recEvent,
    visualTimer: null,
    growRaf: null,
    blockEl: null,
    released: false,
    holdMs: 0
  };
  activeManualPresses.set(inputId, record);

  if (pianoBtn) pianoBtn.classList.add("holding");
  if (scaleBtn) scaleBtn.classList.add("holding");

  const activateVisual = () => {
    record.visualTimer = null;

    if (pianoBtn) pianoBtn.classList.add("active");
    if (scaleBtn) scaleBtn.classList.add("active");

    record.blockEl = createRhythmBlock(label, evalRes);

    const sign = evalRes.deltaMs >= 0 ? "+" : "";
    if (evalRes.enabled) {
      if (evalRes.snapped) {
        pulseBeatDot();
        readoutArtEl.textContent = `🎯 ${evalRes.judgment}`;
        readoutArtEl.className = "readout-art assist";
        readoutDetailEl.textContent =
          `誤差 ${sign}${evalRes.deltaMs}ms（≤ ±${evalRes.snapWindowMs}ms）→ 已對齊第 ${evalRes.beatIndex + 1} 拍 t_beat`;
      } else {
        readoutArtEl.textContent = `⚠ ${evalRes.judgment}`;
        readoutArtEl.className = "readout-art offbeat";
        readoutDetailEl.textContent =
          `誤差 ${sign}${evalRes.deltaMs}ms（超出 ±${evalRes.snapWindowMs}ms 容錯，不強行吸附）`;
      }
    } else {
      readoutArtEl.textContent = "按住感測…";
      readoutArtEl.className = "readout-art holding";
      readoutDetailEl.textContent = match
        ? `鋼琴 ${match.note.pitch}（${pianoObj.isBlack ? "黑鍵" : "白鍵"}）｜${freq.toFixed(1)} Hz｜比例 ${match.note.ratio}`
        : `鋼琴自由音 ${canonicalPitch}｜${freq.toFixed(1)} Hz`;
    }
    readoutNoteEl.textContent = label;

    if (record.released) {
      const quickMs = Math.max(95, record.holdMs);
      finalizeRhythmBlock(record.blockEl, record.holdMs, evalRes);
      setTimeout(() => {
        if (pianoBtn) pianoBtn.classList.remove("active", "holding");
        if (scaleBtn) scaleBtn.classList.remove("active", "holding");
      }, Math.min(190, quickMs));
      return;
    }

    const updateGrow = () => {
      if (!activeManualPresses.has(inputId)) return;
      const curMs = Math.round(performance.now() - record.pressedAt);
      if (record.blockEl) {
        const msEl = record.blockEl.querySelector(".rb-ms");
        if (msEl) msEl.textContent = `${curMs}ms`;
        if (curMs >= 240) {
          record.blockEl.classList.add("long");
          record.blockEl.style.minWidth = `${Math.min(210, Math.max(114, Math.round(curMs * 0.19)))}px`;
        }
      }
      record.growRaf = requestAnimationFrame(updateGrow);
    };
    record.growRaf = requestAnimationFrame(updateGrow);
  };

  if (evalRes.delayMs > 4) {
    record.visualTimer = setTimeout(activateVisual, evalRes.delayMs);
  } else {
    activateVisual();
  }
}

function endManualPress(inputId) {
  const record = activeManualPresses.get(inputId);
  if (!record) return;
  activeManualPresses.delete(inputId);

  if (record.growRaf) cancelAnimationFrame(record.growRaf);
  const holdMs = Math.max(45, Math.round(performance.now() - record.pressedAt));
  const isShort = holdMs < 240;
  record.released = true;
  record.holdMs = holdMs;

  if (record.voice) record.voice.stop(holdMs);
  if (record.recEvent) recorder.updateNoteHold(record.recEvent, holdMs);

  if (!record.visualTimer) {
    if (record.pianoBtn) record.pianoBtn.classList.remove("active", "holding");
    if (record.scaleBtn) record.scaleBtn.classList.remove("active", "holding");
    finalizeRhythmBlock(record.blockEl, holdMs, record.evalRes);
  }

  const ev = record.evalRes;
  const sign = ev.deltaMs >= 0 ? "+" : "";
  if (ev.enabled) {
    if (ev.snapped) {
      readoutArtEl.textContent = `🎯 ${isShort ? "短音" : "長音"}・對拍`;
      readoutArtEl.className = "readout-art assist";
      readoutDetailEl.textContent = `對齊第 ${ev.beatIndex + 1} 拍（原誤差 ${sign}${ev.deltaMs}ms）｜按鍵時長 ${holdMs}ms`;
    } else {
      readoutArtEl.textContent = `⚠ ${isShort ? "短音" : "長音"}・偏拍`;
      readoutArtEl.className = "readout-art offbeat";
      readoutDetailEl.textContent = `誤差 ${sign}${ev.deltaMs}ms 超出 ±${ev.snapWindowMs}ms 未吸附｜按鍵時長 ${holdMs}ms`;
    }
  } else {
    readoutArtEl.textContent = isShort ? "⚡ 短音" : "〰 長音";
    readoutArtEl.className = `readout-art ${isShort ? "short" : "long"}`;
    readoutDetailEl.textContent = `實際按鍵時長 ${holdMs} ms（${isShort ? "短按制音" : "長按延音"}）｜${record.freq.toFixed(1)} Hz`;
  }
  readoutNoteEl.textContent = record.label;
}

// ===== 原本「▶ 演奏曲目」與量化回放共用單音觸發 =====
function triggerFixedPitch(pitch, freq, holdMs, replayEvent = null) {
  window.audioEngine.init();
  const isShort = holdMs < 240;
  const style = usePianoSound ? "piano" : currentCulture;
  const voice = window.audioEngine.startSustainedNote(freq, style, 0);
  setTimeout(() => voice.stop(holdMs), holdMs);

  const pianoObj = findPianoKeyByPitch(pitch);
  const canonicalPitch = pianoObj ? pianoObj.pitch : pitch;
  const match = pianoObj ? findScaleMatch(pianoObj) : null;
  const label = match ? match.note.label : canonicalPitch;

  const flashEl = (el, id) => {
    if (!el) return;
    if (autoFlashTimers.has(id)) clearTimeout(autoFlashTimers.get(id));
    el.classList.remove("active", "art-short", "art-long");
    el.style.setProperty("--sustain-ms", `${holdMs}ms`);
    void el.offsetWidth;
    el.classList.add("active", isShort ? "art-short" : "art-long");
    autoFlashTimers.set(id, setTimeout(() => {
      el.classList.remove("active", "art-short", "art-long");
      autoFlashTimers.delete(id);
    }, holdMs));
  };

  flashEl(pianoKeysEl.querySelector(`[data-pitch="${canonicalPitch}"]`), `p-${canonicalPitch}`);
  if (match) {
    flashEl(scaleKeyboardEl.querySelector(`[data-index="${match.index}"]`), `s-${match.index}`);
  }

  const fakeEval = replayEvent
    ? { enabled: true, snapped: replayEvent.snapped, deltaMs: replayEvent.deltaMs, beatIndex: replayEvent.beatNumber - 1 }
    : null;
  const block = createRhythmBlock(label, fakeEval);
  finalizeRhythmBlock(block, holdMs, fakeEval);

  if (replayEvent) {
    readoutArtEl.textContent = replayEvent.snapped ? `🎯 量化第${replayEvent.beatNumber}拍` : "▶ 原拍回放";
    readoutArtEl.className = `readout-art ${replayEvent.snapped ? "assist" : "offbeat"}`;
    readoutDetailEl.textContent = `量化回放｜有效時間 ${replayEvent.effectiveOffsetMs}ms｜按鍵時長 ${holdMs}ms`;
  } else {
    readoutArtEl.textContent = isShort ? "⚡ 短音" : "〰 長音";
    readoutArtEl.className = `readout-art ${isShort ? "short" : "long"}`;
    readoutDetailEl.textContent =
      `鋼琴 ${canonicalPitch}（${pianoObj && pianoObj.isBlack ? "黑鍵" : "白鍵"}）｜時值 ${holdMs} ms｜${freq.toFixed(1)} Hz`;
  }
  readoutNoteEl.textContent = label;
}

// =========================================================================
// 渲染鋼琴（A3 ~ B5）與底部宮商角徵羽鍵盤
// =========================================================================
function renderPianoAndScale() {
  releaseAllManualPresses();
  recorder.stopReplay();
  stopSong();

  const data = window.CULTURES[currentCulture];
  const scale = getActiveScale();

  document.body.dataset.theme = currentCulture;
  document.title = `鋼琴對照｜${data.name}`;
  backToStageEl.href = `stage.html?culture=${currentCulture}`;

  cultureTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.culture === currentCulture);
  });

  if (currentCulture === "china") {
    badgeEl.textContent = "中國五聲音階（全黑鍵 F# 宮調式）× 十二平均律鋼琴";
    titleEl.textContent = `${data.songName} — 全黑鍵「宮商角徵羽」長短按與節拍量化吸附`;
    scalePanelTitleEl.textContent =
      "下方傳統音階鍵盤：宮商角徵羽（對應鋼琴全黑鍵 F#4–A#5｜輕點短音、長按長音）";
  } else {
    badgeEl.textContent = `${data.name} × 十二平均律鋼琴`;
    titleEl.textContent = `${data.songName} — 鋼琴與傳統音階長短按與節拍量化吸附`;
    scalePanelTitleEl.textContent =
      `下方傳統音階鍵盤：${data.name}（輕點短音、長按長音｜按數字鍵 1–${scale.length} 同步彈奏）`;
  }

  rhythmTrackEl.innerHTML =
    `<span class="rhythm-placeholder">輕點琴鍵聽「短音」，按住琴鍵聽「長音」；調整上方 BPM 與容錯範圍，或點「⏺ 錄製打譜」體驗量化回放</span>`;

  // 1. 繪製上方擬真鋼琴（A3 ~ B5）
  pianoKeysEl.innerHTML = "";
  const whiteKeys = PIANO_KEYS.filter((k) => !k.isBlack);
  const whiteCount = whiteKeys.length;
  let whiteIndexSoFar = 0;

  PIANO_KEYS.forEach((k) => {
    const match = findScaleMatch(k);
    const btn = document.createElement("button");
    btn.dataset.pitch = k.pitch;

    if (!k.isBlack) {
      btn.className = `piano-white-key${match ? " in-scale" : ""}`;
      whiteIndexSoFar++;
    } else {
      btn.className = `piano-black-key${match ? " in-scale" : ""}`;
      const leftPct = (whiteIndexSoFar / whiteCount) * 100;
      btn.style.left = `${leftPct}%`;
    }

    const displayPitch = match ? match.note.pitch : k.pitch;
    const tagHtml = match ? `<span class="pk-scale-tag">${match.note.label}</span>` : "";
    btn.innerHTML = `
      <span class="key-sustain-bar"></span>
      ${tagHtml}
      <span class="pk-note-label">${displayPitch}</span>
    `;

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (btn.setPointerCapture) {
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      }
      beginManualPress(`p-ptr-${e.pointerId}`, k.pitch, k.freq);
    });
    const endPtr = (e) => endManualPress(`p-ptr-${e.pointerId}`);
    btn.addEventListener("pointerup", endPtr);
    btn.addEventListener("pointercancel", endPtr);

    pianoKeysEl.appendChild(btn);
  });

  if (pianoScrollEl) {
    pianoScrollEl.scrollLeft = currentCulture === "china" ? pianoScrollEl.scrollWidth : 0;
  }

  // 2. 繪製下方「宮商角徵羽」傳統音階鍵盤
  scaleKeyboardEl.innerHTML = "";
  scaleKeyboardEl.style.setProperty("--key-count", scale.length);
  scale.forEach((note, idx) => {
    const btn = document.createElement("button");
    btn.className = "stage-key";
    btn.dataset.index = idx;
    const isLong = note.label.length >= 6;
    btn.innerHTML = `
      <span class="scale-sustain-bar"></span>
      <span class="scale-art-pill"></span>
      <span class="k-name${isLong ? " long-name" : ""}">${note.label}</span>
      <span class="k-pitch">${note.pitch} · ${Math.round(note.freq)}Hz</span>
      <span class="k-ratio">${note.ratio}</span>
    `;

    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (btn.setPointerCapture) {
        try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      }
      beginManualPress(`s-ptr-${e.pointerId}`, note.pitch, note.freq);
    });
    const endPtr = (e) => endManualPress(`s-ptr-${e.pointerId}`);
    btn.addEventListener("pointerup", endPtr);
    btn.addEventListener("pointercancel", endPtr);

    scaleKeyboardEl.appendChild(btn);
  });

  syncQuantizeUI();
  readoutArtEl.textContent = quantizer.enabled ? `🎯 ${quantizer.bpm} BPM` : "長短按感測";
  readoutArtEl.className = `readout-art ${quantizer.enabled ? "assist" : "idle"}`;
  readoutNoteEl.textContent = "就緒";
  readoutDetailEl.textContent = quantizer.enabled
    ? `容錯 ±${quantizer.effectiveSnapWindowMs}ms 內自動對齊拍點 t_beat；輕點短音、長按長音`
    : "量化吸附已關閉（自由節奏模式）";
}

function stopSong() {
  songTimers.forEach((id) => clearTimeout(id));
  songTimers = [];
  isPlaying = false;
  playBtn.textContent = "▶ 演奏曲目";
  playBtn.classList.remove("playing");
  scaleKeyboardEl.classList.remove("is-playing");
  clearAllHighlights();
}

function playSong() {
  window.audioEngine.init();
  releaseAllManualPresses();
  recorder.stopReplay();
  stopSong();
  syncQuantizeUI();

  isPlaying = true;
  playBtn.textContent = "■ 停止演奏";
  playBtn.classList.add("playing");
  scaleKeyboardEl.classList.add("is-playing");
  rhythmTrackEl.innerHTML = "";
  rhythmStripTitleEl.textContent = "▶ 曲目演奏中（依曲譜時值自動呈現短音與長音）";

  const data = window.CULTURES[currentCulture];
  const scale = getActiveScale();
  let elapsed = 0;

  data.melody.forEach((step) => {
    const isShort = step.d <= 0.30;
    const holdMs = isShort
      ? Math.max(115, Math.min(185, Math.round(step.d * 660)))
      : Math.max(360, Math.round(step.d * 880));
    const id = setTimeout(() => {
      if (!isPlaying) return;
      const note = scale[step.k];
      if (note) triggerFixedPitch(note.pitch, note.freq, holdMs, null);
    }, elapsed * 1000);
    songTimers.push(id);
    elapsed += step.d;
  });

  const endId = setTimeout(() => {
    isPlaying = false;
    playBtn.textContent = "▶ 演奏曲目";
    playBtn.classList.remove("playing");
    scaleKeyboardEl.classList.remove("is-playing");
    syncQuantizeUI();
  }, (elapsed + 0.55) * 1000);
  songTimers.push(endId);
}

// ===== 按鈕事件 =====
playBtn.addEventListener("click", () => {
  if (isPlaying) stopSong();
  else playSong();
});

assistBtn.addEventListener("click", () => {
  window.audioEngine.init();
  quantizer.setEnabled(!quantizer.enabled);
  syncQuantizeUI();
  readoutArtEl.textContent = quantizer.enabled ? `🎯 ${quantizer.bpm} BPM` : "長短按感測";
  readoutArtEl.className = `readout-art ${quantizer.enabled ? "assist" : "idle"}`;
  readoutDetailEl.textContent = quantizer.enabled
    ? `已開啟節拍量化吸附（${quantizer.bpm} BPM，容錯 ±${quantizer.effectiveSnapWindowMs}ms）`
    : "已關閉量化吸附（自由節奏，保留長短按感測）";
});

bpmSlider.addEventListener("input", () => {
  quantizer.setBpm(bpmSlider.value);
  syncQuantizeUI();
});

bpmDecBtn.addEventListener("click", () => {
  quantizer.setBpm(quantizer.bpm - 10);
  syncQuantizeUI();
});

bpmIncBtn.addEventListener("click", () => {
  quantizer.setBpm(quantizer.bpm + 10);
  syncQuantizeUI();
});

document.querySelectorAll(".win-preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    quantizer.setSnapWindowMs(btn.dataset.win);
    syncQuantizeUI();
  });
});

metroBtn.addEventListener("click", () => {
  quantizer.setMetronomeSound(!quantizer.metronomeSound);
  syncQuantizeUI();
});

recBtn.addEventListener("click", () => {
  if (recorder.isRecording) {
    const stats = recorder.stopRecording();
    rhythmStripTitleEl.textContent = stats.total > 0
      ? `✅ 錄製完成：共 ${stats.total} 音，吸附對拍 ${stats.snappedCount} 音（踩拍率 ${stats.rate}%）— 點擊「▶ 量化回放」試聽！`
      : "尚未錄下音符，請按下琴鍵試彈。";
    readoutArtEl.textContent = `踩拍率 ${stats.rate}%`;
    readoutArtEl.className = "readout-art assist";
  } else {
    stopSong();
    recorder.startRecording();
    rhythmTrackEl.innerHTML = "";
    rhythmStripTitleEl.textContent = `⏺ 錄製打譜中（${quantizer.bpm} BPM｜±${quantizer.effectiveSnapWindowMs}ms 量化對齊）…請手動演奏！`;
    readoutArtEl.textContent = "⏺ 錄製中";
    readoutArtEl.className = "readout-art offbeat";
  }
  syncQuantizeUI();
});

replayBtn.addEventListener("click", () => {
  if (recorder.isReplaying) {
    recorder.stopReplay();
    scaleKeyboardEl.classList.remove("is-playing");
    syncQuantizeUI();
    return;
  }
  stopSong();
  window.audioEngine.init();
  rhythmTrackEl.innerHTML = "";
  scaleKeyboardEl.classList.add("is-playing");
  rhythmStripTitleEl.textContent = `▶ 正在依量化拍點 t_beat 回放錄製打譜（共 ${recorder.events.length} 音）…`;
  recorder.replay(
    (evt) => triggerFixedPitch(evt.pitch, evt.freq, evt.holdMs, evt),
    () => {
      scaleKeyboardEl.classList.remove("is-playing");
      syncQuantizeUI();
      rhythmStripTitleEl.textContent = "✅ 量化回放完畢！可繼續練習或重新錄製打譜。";
    }
  );
  syncQuantizeUI();
});

clearRecBtn.addEventListener("click", () => {
  recorder.clear();
  rhythmTrackEl.innerHTML =
    `<span class="rhythm-placeholder">已清除錄製紀錄；輕點短音、長按長音，或按「⏺ 錄製打譜」重新開始</span>`;
  syncQuantizeUI();
});

soundToggleBtn.addEventListener("click", () => {
  usePianoSound = !usePianoSound;
  const instName = currentCulture === "china" ? "古箏" : currentCulture === "japan" ? "日本箏" : "烏德琴";
  soundToggleBtn.textContent = usePianoSound ? "🎹 音色：鋼琴" : `🎵 音色：${instName}`;
});

cultureTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentCulture = tab.dataset.culture;
    const instName = currentCulture === "china" ? "古箏" : currentCulture === "japan" ? "日本箏" : "烏德琴";
    soundToggleBtn.textContent = usePianoSound ? "🎹 音色：鋼琴" : `🎵 音色：${instName}`;
    renderPianoAndScale();
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    window.location.href = `stage.html?culture=${currentCulture}`;
    return;
  }
  if (e.code === "Space") {
    e.preventDefault();
    if (isPlaying) stopSong();
    else playSong();
    return;
  }
  if (e.repeat) return;
  const n = parseInt(e.key, 10);
  const scale = getActiveScale();
  if (n >= 1 && n <= scale.length) {
    const note = scale[n - 1];
    beginManualPress(`kbd-${n}`, note.pitch, note.freq);
  }
});

window.addEventListener("keyup", (e) => {
  const n = parseInt(e.key, 10);
  const scale = getActiveScale();
  if (n >= 1 && n <= scale.length) {
    endManualPress(`kbd-${n}`);
  }
});

window.addEventListener("blur", releaseAllManualPresses);

renderPianoAndScale();
