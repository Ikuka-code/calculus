const params = new URLSearchParams(window.location.search);
const cultureKey = window.CULTURES[params.get("culture")] ? params.get("culture") : "china";
const cultureData = window.CULTURES[cultureKey];

document.body.dataset.theme = cultureKey;
document.title = `${cultureData.name}｜數理 × 樂韻`;

const pianoLink = document.getElementById("stage-piano-link");
if (pianoLink) {
  pianoLink.href = `piano.html?culture=${cultureKey}`;
}

const canvas = document.getElementById("stage-canvas");
const keyboardEl = document.getElementById("stage-keyboard");
const playBtn = document.getElementById("stage-play-btn");
const assistBtn = document.getElementById("stage-assist-btn");
const settingsBtn = document.getElementById("stage-settings-btn");
const quantizePanel = document.getElementById("stage-quantize-panel");

const bpmSlider = document.getElementById("stage-bpm-slider");
const bpmValEl = document.getElementById("stage-bpm-val");
const periodInfoEl = document.getElementById("stage-period-info");
const winValEl = document.getElementById("stage-win-val");
const winCapEl = document.getElementById("stage-win-cap");
const metroBtn = document.getElementById("stage-metro-btn");
const recBtn = document.getElementById("stage-rec-btn");
const replayBtn = document.getElementById("stage-replay-btn");
const clearRecBtn = document.getElementById("stage-clear-rec-btn");
const recStatusEl = document.getElementById("stage-rec-status");

const beatHudEl = document.getElementById("stage-beat-hud");
const beatDotEl = document.getElementById("stage-beat-dot");
const beatTextEl = document.getElementById("stage-beat-text");

keyboardEl.style.setProperty("--key-count", cultureData.scale.length);

const renderer = new window.SceneryRenderer(canvas, cultureKey, false);
renderer.start();

const quantizer = window.beatQuantizer;
const recorder = new window.QuantizeRecorder(quantizer);

let isPlaying = false;
let songTimers = [];
const keyTimers = new Map();
const activeHoldMap = new Map();
let hudHideTimer = null;

function showHud(text, stateClass = "") {
  beatHudEl.classList.remove("hidden", "hud-snapped", "hud-offbeat");
  if (stateClass) beatHudEl.classList.add(stateClass);
  beatTextEl.textContent = text;
  if (hudHideTimer) clearTimeout(hudHideTimer);
  hudHideTimer = setTimeout(() => {
    if (!recorder.isRecording && !recorder.isReplaying) {
      beatHudEl.classList.add("hidden");
    }
  }, 2400);
}

function pulseBeatDot() {
  beatDotEl.classList.remove("flash");
  void beatDotEl.offsetWidth;
  beatDotEl.classList.add("flash");
}

quantizer.onBeatPulse(() => {
  if (!beatHudEl.classList.contains("hidden")) {
    pulseBeatDot();
  }
});

function syncQuantizeUI() {
  const bpm = quantizer.bpm;
  const effWin = quantizer.effectiveSnapWindowMs;
  const halfBeat = Math.round(quantizer.halfBeatMs);

  assistBtn.textContent = quantizer.enabled
    ? `🎯 量化吸附：開 (${bpm} BPM)`
    : `🎯 量化吸附：關`;
  assistBtn.classList.toggle("active-mode", quantizer.enabled);
  assistBtn.setAttribute("aria-pressed", String(quantizer.enabled));

  bpmSlider.value = bpm;
  bpmValEl.textContent = bpm;
  periodInfoEl.textContent = `(每拍 ${Math.round(quantizer.periodMs)}ms・半拍 ${halfBeat}ms)`;

  winValEl.textContent = `±${effWin} ms`;
  winCapEl.textContent = quantizer.isWindowCapped
    ? `(原 ±${quantizer.snapWindowMs}ms，已自動限制 < 半拍防過度吸附)`
    : `(< 半拍 ${halfBeat}ms 安全範圍)`;

  document.querySelectorAll(".bpm-preset").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.bpm) === bpm);
  });
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
}

// 建立底部毛玻璃彩色頂條琴鍵（pointerdown/pointerup 偵測長短按）
cultureData.scale.forEach((note, idx) => {
  const btn = document.createElement("button");
  btn.className = "stage-key";
  btn.dataset.index = idx;
  const isLong = note.label.length >= 6;
  btn.innerHTML = `
    <span class="k-name${isLong ? " long-name" : ""}">${note.label}</span>
    <span class="k-pitch">${note.pitch} · ${Math.round(note.freq)}Hz</span>
    <span class="k-ratio">${note.ratio}</span>
  `;

  btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (btn.setPointerCapture) {
      try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    }
    beginManualPress(`ptr-${e.pointerId}`, idx);
  });

  const endPtr = (e) => endManualPress(`ptr-${e.pointerId}`);
  btn.addEventListener("pointerup", endPtr);
  btn.addEventListener("pointercancel", endPtr);
  keyboardEl.appendChild(btn);
});

function clearAllKeyHighlights() {
  keyTimers.forEach((id) => clearTimeout(id));
  keyTimers.clear();
  document.querySelectorAll(".stage-key").forEach((el) => {
    el.classList.remove("active", "holding", "art-short", "art-long");
  });
}

function releaseAllManualHolds() {
  Array.from(activeHoldMap.keys()).forEach((id) => endManualPress(id));
}

// ===== 用戶手動按鍵：即時長短按感測 ＋ 節拍量化吸附（|t_input - t_beat| <= snapWindow） =====
function beginManualPress(inputId, index) {
  if (activeHoldMap.has(inputId)) return;

  window.audioEngine.init();
  const note = cultureData.scale[index];
  if (!note) return;

  const btn = keyboardEl.querySelector(`[data-index="${index}"]`);
  const pressedAt = performance.now();

  const evalRes = quantizer.evaluateInput();
  const voice = window.audioEngine.startSustainedNote(note.freq, cultureKey, evalRes.delaySec);
  const recEvent = recorder.recordNoteStart(
    { label: note.label, pitch: note.pitch, freq: note.freq, scaleIndex: index },
    evalRes
  );
  if (recEvent) syncQuantizeUI();

  const record = {
    index,
    note,
    btn,
    pressedAt,
    voice,
    evalRes,
    recEvent,
    visualTimer: null,
    released: false,
    holdMs: 0
  };
  activeHoldMap.set(inputId, record);

  if (btn) btn.classList.add("holding");

  const triggerVisual = () => {
    record.visualTimer = null;
    renderer.triggerNote(index, note.label, `${note.pitch} · ${note.ratio}`);
    if (btn) btn.classList.add("active");
    if (evalRes.snapped) pulseBeatDot();

    if (evalRes.enabled) {
      const sign = evalRes.deltaMs >= 0 ? "+" : "";
      if (evalRes.snapped) {
        showHud(
          `🎯 ${evalRes.judgment}｜${note.label}（誤差 ${sign}${evalRes.deltaMs}ms ≤ ±${evalRes.snapWindowMs}ms → 對齊第 ${evalRes.beatIndex + 1} 拍）`,
          "hud-snapped"
        );
      } else {
        showHud(
          `⚠ ${evalRes.judgment}｜${note.label}（誤差 ${sign}${evalRes.deltaMs}ms > ±${evalRes.snapWindowMs}ms，保留原時機）`,
          "hud-offbeat"
        );
      }
    }

    if (record.released) {
      const flashMs = Math.max(100, Math.min(190, record.holdMs));
      setTimeout(() => {
        if (btn) btn.classList.remove("active", "holding");
      }, flashMs);
    }
  };

  if (evalRes.delayMs > 4) {
    record.visualTimer = setTimeout(triggerVisual, evalRes.delayMs);
  } else {
    triggerVisual();
  }
}

function endManualPress(inputId) {
  const record = activeHoldMap.get(inputId);
  if (!record) return;
  activeHoldMap.delete(inputId);

  const holdMs = Math.max(45, Math.round(performance.now() - record.pressedAt));
  const isShort = holdMs < 240;
  record.released = true;
  record.holdMs = holdMs;

  if (record.voice) record.voice.stop(holdMs);
  if (record.recEvent) recorder.updateNoteHold(record.recEvent, holdMs);

  if (!record.visualTimer && record.btn) {
    record.btn.classList.remove("active", "holding");
  }

  if (!record.evalRes.enabled) {
    showHud(`${isShort ? "⚡ 短按短音" : "〰 長按長音"}｜${record.note.label}（${holdMs} ms）`);
  }
}

// ===== 原本「▶ 演奏曲目」與量化回放單音觸發 =====
function triggerFixedKey(index, holdMs, subTag = "") {
  const note = cultureData.scale[index];
  if (!note) return;

  const isShort = holdMs < 240;
  const voice = window.audioEngine.startSustainedNote(note.freq, cultureKey, 0);
  setTimeout(() => voice.stop(holdMs), holdMs);

  renderer.triggerNote(index, note.label, subTag || `${note.pitch} · ${isShort ? "短音" : "長音"}`);

  const btn = keyboardEl.querySelector(`[data-index="${index}"]`);
  if (btn) {
    if (keyTimers.has(index)) clearTimeout(keyTimers.get(index));
    btn.classList.remove("active", "art-short", "art-long");
    void btn.offsetWidth;
    btn.classList.add("active", isShort ? "art-short" : "art-long");

    const tId = setTimeout(() => {
      btn.classList.remove("active", "art-short", "art-long");
      keyTimers.delete(index);
    }, holdMs);
    keyTimers.set(index, tId);
  }
}

function stopSong() {
  songTimers.forEach((id) => clearTimeout(id));
  songTimers = [];
  isPlaying = false;
  playBtn.textContent = "▶ 演奏曲目";
  playBtn.classList.remove("playing");
  keyboardEl.classList.remove("is-playing");
  clearAllKeyHighlights();
}

function playSong() {
  window.audioEngine.init();
  releaseAllManualHolds();
  recorder.stopReplay();
  stopSong();
  syncQuantizeUI();

  isPlaying = true;
  playBtn.textContent = "■ 停止演奏";
  playBtn.classList.add("playing");
  keyboardEl.classList.add("is-playing");

  let elapsed = 0;
  cultureData.melody.forEach((step) => {
    const isShort = step.d <= 0.30;
    const holdMs = isShort
      ? Math.max(110, Math.min(185, Math.round(step.d * 650)))
      : Math.max(360, Math.round(step.d * 880));
    const id = setTimeout(() => {
      if (!isPlaying) return;
      triggerFixedKey(step.k, holdMs);
    }, elapsed * 1000);
    songTimers.push(id);
    elapsed += step.d;
  });

  const endId = setTimeout(() => {
    isPlaying = false;
    playBtn.textContent = "▶ 演奏曲目";
    playBtn.classList.remove("playing");
    keyboardEl.classList.remove("is-playing");
  }, (elapsed + 0.45) * 1000);
  songTimers.push(endId);
}

// ===== 事件綁定 =====
playBtn.addEventListener("click", () => {
  if (isPlaying) stopSong();
  else playSong();
});

assistBtn.addEventListener("click", () => {
  window.audioEngine.init();
  quantizer.setEnabled(!quantizer.enabled);
  syncQuantizeUI();
  showHud(
    quantizer.enabled
      ? `🎯 量化吸附已開啟（${quantizer.bpm} BPM｜容錯 ±${quantizer.effectiveSnapWindowMs}ms）`
      : "🎵 已關閉量化吸附（自由節奏模式）"
  );
});

settingsBtn.addEventListener("click", () => {
  const isOpen = !quantizePanel.classList.contains("hidden");
  quantizePanel.classList.toggle("hidden", isOpen);
  settingsBtn.setAttribute("aria-expanded", String(!isOpen));
  settingsBtn.classList.toggle("active-mode", !isOpen);
});

bpmSlider.addEventListener("input", () => {
  quantizer.setBpm(bpmSlider.value);
  syncQuantizeUI();
});

document.querySelectorAll(".bpm-preset").forEach((btn) => {
  btn.addEventListener("click", () => {
    quantizer.setBpm(btn.dataset.bpm);
    syncQuantizeUI();
  });
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
    recStatusEl.textContent = stats.total > 0
      ? `錄製完成：共 ${stats.total} 音，成功吸附拍點 ${stats.snappedCount} 音（踩拍率 ${stats.rate}%）。`
      : "尚未錄下任何音符，請按下琴鍵試試看。";
    showHud(recStatusEl.textContent, "hud-snapped");
  } else {
    stopSong();
    recorder.startRecording();
    recStatusEl.textContent = `⏺ 錄製中（${quantizer.bpm} BPM，容錯 ±${quantizer.effectiveSnapWindowMs}ms）…請點擊琴鍵演奏！`;
    showHud(recStatusEl.textContent, "hud-snapped");
  }
  syncQuantizeUI();
});

replayBtn.addEventListener("click", () => {
  if (recorder.isReplaying) {
    recorder.stopReplay();
    keyboardEl.classList.remove("is-playing");
    syncQuantizeUI();
    return;
  }
  stopSong();
  window.audioEngine.init();
  keyboardEl.classList.add("is-playing");
  showHud(`▶ 正在依量化後拍點 t_beat 回放錄音（共 ${recorder.events.length} 音）…`, "hud-snapped");
  recorder.replay(
    (evt) => {
      if (evt.scaleIndex != null) {
        triggerFixedKey(evt.scaleIndex, evt.holdMs, evt.snapped ? `第${evt.beatNumber}拍・已量化` : "原拍點");
      }
    },
    () => {
      keyboardEl.classList.remove("is-playing");
      syncQuantizeUI();
      showHud("▶ 量化回放完成！", "hud-snapped");
    }
  );
  syncQuantizeUI();
});

clearRecBtn.addEventListener("click", () => {
  recorder.clear();
  recStatusEl.textContent = "已清除錄製紀錄。";
  syncQuantizeUI();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!quantizePanel.classList.contains("hidden")) {
      quantizePanel.classList.add("hidden");
      settingsBtn.setAttribute("aria-expanded", "false");
      settingsBtn.classList.remove("active-mode");
      return;
    }
    window.location.href = "index.html";
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
  if (n >= 1 && n <= cultureData.scale.length) {
    beginManualPress(`kbd-${n}`, n - 1);
  }
});

window.addEventListener("keyup", (e) => {
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= cultureData.scale.length) {
    endManualPress(`kbd-${n}`);
  }
});

window.addEventListener("blur", releaseAllManualHolds);

syncQuantizeUI();
