const CHAPTERS = [
  {
    title: "第一章：聲音的數學函數 — 正弦波",
    duration: 12,
    cues: [
      { t: 0.2, sub: "聲音本質上是空氣的週期性振動，可用三角函數 y(t) = A · sin(2πft) 描述。", audio: () => window.audioEngine.playTone(330, 0.9, 0.35) },
      { t: 3.6, sub: "觀察縱向高度：振幅 A 越大，波峰越高，聽到的聲音響度（音量）就越大。", audio: () => window.audioEngine.playTone(330, 1.1, 0.65) },
      { t: 7.4, sub: "觀察橫向疏密：頻率 f 越高，每秒振動次數越多，聽起來的音高（Hz）就越高！", audio: () => {
        window.audioEngine.playTone(220, 0.45, 0.45);
        setTimeout(() => window.audioEngine.playTone(330, 0.45, 0.45), 550);
        setTimeout(() => window.audioEngine.playTone(440, 0.7, 0.45), 1100);
      }}
    ],
    quiz: {
      question: "在正弦波公式 y(t) = A · sin(2πft) 中，振幅 A 與頻率 f 分別決定聲音的哪兩個物理特性？",
      options: [
        "A 決定音高、f 決定音量",
        "A 決定響度（音量）、f 決定音高",
        "A 決定音色、f 決定節奏快慢",
        "A 與 f 都只影響音色"
      ],
      answer: 1,
      explain: "正確！振幅 A 控制波峰高度（決定響度大小），頻率 f 控制每秒振動次數（單位 Hz，決定音高高低）。"
    }
  },
  {
    title: "第二章：中國五聲音階 — 三分損益法",
    duration: 14,
    cues: [
      { t: 0.2, sub: "古人以一根基準弦長 L = 1 發出「宮」音（C4，比例 1:1）。", audio: () => window.audioEngine.playNote(261.63, 0.9, "china") },
      { t: 2.8, sub: "【三分損一】將弦長減去 1/3（剩 2/3），頻率變為 3/2 倍，生出純五度「徵」音（G4）！", audio: () => window.audioEngine.playNote(392.00, 0.9, "china") },
      { t: 6.0, sub: "【三分益一】將現有弦長增加 1/3（× 4/3 = 8/9），下降純四度，生出「商」音（D4）！", audio: () => window.audioEngine.playNote(293.66, 0.9, "china") },
      { t: 9.0, sub: "反覆執行「損一、益一」，依序推演出「羽」（A4）與「角」（E4），湊齊五聲！", audio: () => {
        window.audioEngine.playNote(440.00, 0.6, "china");
        setTimeout(() => window.audioEngine.playNote(329.63, 0.8, "china"), 650);
      }},
      { t: 11.4, sub: "排成音階：宮・商・角・徵・羽，避開尖銳半音，形成中和圓融的東方聽覺美學。", audio: () => {
        [261.63, 293.66, 329.63, 392.00, 440.00].forEach((f, i) => {
          setTimeout(() => window.audioEngine.playNote(f, 0.45, "china"), i * 240);
        });
      }}
    ],
    quiz: {
      question: "在中國古代「三分損益法」中，執行一次「三分損一」會使弦長變為原本的幾分之幾，進而讓音高上升純五度？",
      options: [
        "弦長變為 2/3（頻率比 3:2）",
        "弦長變為 1/2（頻率比 2:1）",
        "弦長變為 4/3（頻率比 3:4）",
        "弦長變為 3/4（頻率比 4:3）"
      ],
      answer: 0,
      explain: "答對了！弦越短振動越快，「三分損一」去掉 1/3 後弦長為 2/3，頻率與弦長成反比，因此頻率變為 3/2（純五度）。"
    }
  },
  {
    title: "第三章：跨文化音律 — 日本都節與阿拉伯希賈茲",
    duration: 13,
    cues: [
      { t: 0.2, sub: "同樣在十二平均律 fₙ = f₀ × 2^(n/12) 的尺規上，各國挑選的「音程間距」截然不同。", audio: null },
      { t: 2.2, sub: "日本「都節音階」採用 1-4-2-1-4 結構，特意包含緊密的小二度半音，營造哀婉幽玄感。", audio: () => {
        [440, 440, 493.88, 440, 493.88, 523.25, 493.88, 440, 349.23].forEach((f, i) => {
          setTimeout(() => window.audioEngine.playNote(f, 0.38, "japan"), i * 320);
        });
      }},
      { t: 6.8, sub: "阿拉伯「希賈茲調式」核心為 1-3-1，中間跨越 3 個半音的「增二度」極具戲劇張力！", audio: () => {
        [293.66, 311.13, 369.99, 392.00, 440.00, 392.00, 369.99, 311.13, 293.66].forEach((f, i) => {
          setTimeout(() => window.audioEngine.playNote(f, 0.36, "arabia"), i * 320);
        });
      }},
      { t: 10.4, sub: "阿拉伯傳統樂理更進一步將半音再切半，使用二十四平均律 2^(n/24) 演奏細膩四分音。", audio: null }
    ],
    quiz: {
      question: "阿拉伯「希賈茲調式（Maqam Hijaz）」最具異域張力的特色音程，以及傳統四分音所對應的數學律制分別是？",
      options: [
        "純五度與五聲音階",
        "增二度（3 個半音）與二十四平均律 2^(n/24)",
        "小二度與七平均律",
        "大三度與八度律"
      ],
      answer: 1,
      explain: "完全正確！希賈茲調式以 1-3-1 的對稱結構與「增二度」聞名，而傳統阿拉伯音樂更延伸至二十四平均律來表現四分音。"
    }
  },
  {
    title: "第四章：傅立葉級數 — 樂器音色的數學秘密",
    duration: 13,
    cues: [
      { t: 0.2, sub: "為什麼古箏與音叉彈出同樣的 261.6 Hz（中央 C），聽起來聲音卻完全不同？", audio: () => window.audioEngine.playHarmonics(261.63, [1, 0, 0, 0], 1.1) },
      { t: 3.2, sub: "依據傅立葉級數，複雜波形皆由基頻 1f 疊加整數倍泛音（2f, 3f, 4f...）組成。", audio: () => window.audioEngine.playHarmonics(261.63, [1, 0.55, 0, 0], 1.1) },
      { t: 6.4, sub: "現在把第 2、3、4 階泛音層層疊加，原本平滑的正弦波立刻變形為尖銳豐富的撥弦波形！", audio: () => window.audioEngine.playHarmonics(261.63, [1, 0.55, 0.35, 0.25], 1.4) },
      { t: 9.8, sub: "因此，y(t) = Σ Aₙ sin(nωt) 中各階泛音振幅比例 Aₙ，正是塑造每種樂器獨特「音色」的指紋。", audio: () => window.audioEngine.playNote(261.63, 1.2, "china") }
    ],
    quiz: {
      question: "根據傅立葉級數理論，當古箏與音叉演奏相同頻率（同音高）與相同音量時，造成兩者「音色」不同的主因是什麼？",
      options: [
        "兩者的基頻 f 完全不同",
        "各階整數倍泛音（2f, 3f, 4f...）的振幅比例不同",
        "空氣中的傳播速度不同",
        "古箏不會產生週期性聲波"
      ],
      answer: 1,
      explain: "滿分理解！音色取決於波形的形狀，而波形形狀正是由基頻與各階泛音的強度比例所決定。"
    }
  }
];

const canvas = document.getElementById("theory-canvas");
const ctx = canvas.getContext("2d");
const subtitleEl = document.getElementById("video-subtitle");
const startOverlay = document.getElementById("start-overlay");
const quizOverlay = document.getElementById("quiz-overlay");
const completeOverlay = document.getElementById("complete-overlay");
const playPauseBtn = document.getElementById("play-pause-btn");
const replayBtn = document.getElementById("replay-chapter-btn");
const muteBtn = document.getElementById("mute-btn");
const timelineFill = document.getElementById("timeline-fill");
const timeReadout = document.getElementById("time-readout");
const scoreBadge = document.getElementById("score-badge");
const stepPills = document.querySelectorAll(".step-pill");

let chapterIdx = 0;
let elapsed = 0;
let isPlaying = false;
let lastFrameTime = null;
let triggeredCues = new Set();
const passedChapters = new Set();

function formatSec(sec) {
  return `00:${String(Math.floor(sec)).padStart(2, "0")}`;
}

function updateChapterPills() {
  stepPills.forEach((pill, i) => {
    pill.classList.toggle("active", i === chapterIdx);
    pill.classList.toggle("done", passedChapters.has(i));
  });
  scoreBadge.textContent = `隨堂考驗：${passedChapters.size} / ${CHAPTERS.length}`;
}

function loadChapter(idx, autoPlay = true) {
  chapterIdx = idx;
  elapsed = 0;
  triggeredCues.clear();
  lastFrameTime = null;
  quizOverlay.classList.add("hidden");
  completeOverlay.classList.add("hidden");
  startOverlay.classList.add("hidden");
  updateChapterPills();

  isPlaying = autoPlay;
  playPauseBtn.textContent = isPlaying ? "⏸ 暫停" : "▶ 播放";
  subtitleEl.textContent = CHAPTERS[chapterIdx].title;
}

function openQuiz() {
  isPlaying = false;
  playPauseBtn.textContent = "▶ 播放";
  const ch = CHAPTERS[chapterIdx];

  document.getElementById("quiz-tag").textContent = `隨堂考驗 ${chapterIdx + 1} / ${CHAPTERS.length}`;
  document.getElementById("quiz-chapter-name").textContent = ch.title;
  document.getElementById("quiz-question").textContent = ch.quiz.question;

  const optContainer = document.getElementById("quiz-options");
  const feedbackEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next-btn");

  optContainer.innerHTML = "";
  feedbackEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  nextBtn.textContent = chapterIdx < CHAPTERS.length - 1 ? "繼續下一章 ▶" : "查看通關結果 🏆";

  const labels = ["A", "B", "C", "D"];
  ch.quiz.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option-btn";
    btn.textContent = `${labels[i]}. ${optText}`;
    btn.addEventListener("click", () => {
      if (i === ch.quiz.answer) {
        btn.classList.add("correct");
        optContainer.querySelectorAll("button").forEach((b) => (b.disabled = true));
        passedChapters.add(chapterIdx);
        updateChapterPills();
        feedbackEl.textContent = `✔ ${ch.quiz.explain}`;
        feedbackEl.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
        window.audioEngine.playTone(523.25, 0.25, 0.35);
        setTimeout(() => window.audioEngine.playTone(659.25, 0.4, 0.35), 140);
      } else {
        btn.classList.add("wrong");
        btn.disabled = true;
        feedbackEl.textContent = "✖ 再想一想喔！回想剛剛動畫中的數理關係，再選一次。";
        feedbackEl.classList.remove("hidden");
        window.audioEngine.playTone(190, 0.22, 0.3);
      }
    });
    optContainer.appendChild(btn);
  });

  quizOverlay.classList.remove("hidden");
}

function drawVideoFrame(t) {
  const w = canvas.width;
  const h = canvas.height;
  const ch = CHAPTERS[chapterIdx];

  ctx.fillStyle = "#0b111d";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  ctx.fillStyle = "#eab954";
  ctx.font = "bold 22px 'Noto Sans TC', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(ch.title, 36, 46);

  if (chapterIdx === 0) drawCh1Sine(t, w, h);
  else if (chapterIdx === 1) drawCh2Sanfen(t, w, h);
  else if (chapterIdx === 2) drawCh3CrossCulture(t, w, h);
  else drawCh4Fourier(t, w, h);
}

function drawCh1Sine(t, w, h) {
  const cy = h * 0.48;
  let amp = 65;
  let freq = 2.5;
  let badge = "基礎正弦波：y(t) = A · sin(2πft)";

  if (t >= 3.5 && t < 7.3) {
    const p = (t - 3.5) / 3.8;
    amp = 45 + Math.sin(p * Math.PI) * 95;
    badge = `振幅實驗：A = ${(amp / 100).toFixed(2)}（振幅越大 → 越響亮）`;
  } else if (t >= 7.3) {
    const p = Math.min(1, (t - 7.3) / 4.2);
    amp = 85;
    freq = 2.5 + p * 4.5;
    badge = `頻率實驗：f ≈ ${Math.round(220 + p * 220)} Hz（波越密集 → 音越高）`;
  }

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(60, cy); ctx.lineTo(w - 60, cy); ctx.stroke();

  ctx.strokeStyle = "#eab954";
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let x = 60; x <= w - 60; x++) {
    const norm = (x - 60) / (w - 120);
    const y = cy - Math.sin(norm * Math.PI * 2 * freq - t * 4.5) * amp;
    if (x === 60) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = "#5ee6a8";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(140, cy); ctx.lineTo(140, cy - amp); ctx.stroke();
  ctx.fillStyle = "#5ee6a8";
  ctx.font = "bold 18px Consolas, monospace";
  ctx.fillText("A", 150, cy - amp * 0.5);

  ctx.fillStyle = "rgba(234, 185, 84, 0.16)";
  ctx.fillRect(36, 66, 540, 38);
  ctx.fillStyle = "#ffe59c";
  ctx.font = "bold 18px 'Noto Sans TC', monospace";
  ctx.fillText(badge, 50, 91);
}

function drawCh2Sanfen(t, w, h) {
  const startX = 110;
  const fullLen = 680;
  const rows = [
    { showAt: 0.0, name: "宮 (C)", ratio: 1.0, frac: "1", freqRatio: "1 : 1", op: "基準弦長 L", color: "#eab954" },
    { showAt: 2.7, name: "徵 (G)", ratio: 2 / 3, frac: "2/3", freqRatio: "3 : 2", op: "三分損一 (× 2/3)", color: "#5ee6a8" },
    { showAt: 5.9, name: "商 (D)", ratio: 8 / 9, frac: "8/9", freqRatio: "9 : 8", op: "三分益一 (× 4/3)", color: "#7cc2ff" },
    { showAt: 8.9, name: "羽 (A)", ratio: 16 / 27, frac: "16/27", freqRatio: "27 : 16", op: "三分損一 (× 2/3)", color: "#f28eb0" },
    { showAt: 10.2, name: "角 (E)", ratio: 64 / 81, frac: "64/81", freqRatio: "81 : 64", op: "三分益一 (× 4/3)", color: "#c49bff" }
  ];

  rows.forEach((row, idx) => {
    if (t < row.showAt) return;
    const progress = Math.min(1, (t - row.showAt) / 0.8);
    const y = 115 + idx * 66;
    const curLen = fullLen * row.ratio * progress;

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + fullLen, y); ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = row.color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(startX + curLen, y); ctx.stroke();

    ctx.fillStyle = row.color;
    ctx.font = "bold 20px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(row.name, startX - 18, y + 6);

    ctx.textAlign = "left";
    ctx.fillStyle = "#f2f6ff";
    ctx.font = "15px Consolas, 'Noto Sans TC', sans-serif";
    ctx.fillText(`${row.op} ｜ 弦長 ${row.frac} ｜ 頻率比 ${row.freqRatio}`, startX + curLen + 14, y + 5);
  });
}

function drawCh3CrossCulture(t, w, h) {
  const drawScaleRuler = (y, title, steps, accent, highlightRange, visible) => {
    if (!visible) return;
    const x0 = 90;
    const stepW = (w - 180) / 12;

    ctx.fillStyle = accent;
    ctx.font = "bold 20px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(title, x0, y - 34);

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + stepW * 12, y); ctx.stroke();

    for (let i = 0; i <= 12; i++) {
      const px = x0 + i * stepW;
      const active = steps.includes(i);
      ctx.fillStyle = active ? accent : "rgba(255,255,255,0.25)";
      ctx.beginPath(); ctx.arc(px, y, active ? 11 : 5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = "#a6b4cc";
      ctx.font = "13px Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(i, px, y + 28);
    }

    const aX = x0 + highlightRange[0] * stepW;
    const bX = x0 + highlightRange[1] * stepW;
    ctx.strokeStyle = "#ffe28c";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(aX, y - 12);
    ctx.quadraticCurveTo((aX + bX) / 2, y - 55, bX, y - 12);
    ctx.stroke();

    ctx.fillStyle = "#ffe28c";
    ctx.font = "bold 15px 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(highlightRange[2], (aX + bX) / 2, y - 42);
  };

  drawScaleRuler(200, "日本・都節音階（半音間隔：1 - 4 - 2 - 1 - 4）", [0, 1, 5, 7, 8, 12], "#ef8db2", [0, 1, "小二度(1)"], t >= 1.8);
  drawScaleRuler(365, "阿拉伯・希賈茲調式 Maqam Hijaz（核心四音列：1 - 3 - 1）", [0, 1, 4, 5, 7, 8, 10, 12], "#32c49f", [1, 4, "增二度 (跨越 3 個半音)"], t >= 6.5);

  if (t >= 10.2) {
    ctx.fillStyle = "rgba(50, 196, 159, 0.2)";
    ctx.fillRect(90, 412, 780, 36);
    ctx.fillStyle = "#9effe4";
    ctx.font = "bold 16px Consolas, 'Noto Sans TC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("阿拉伯進階微分音：二十四平均律 fₙ = f₀ × 2^(n/24)（精準切出四分音）", w / 2, 435);
  }
}

function drawCh4Fourier(t, w, h) {
  const cy = h * 0.49;
  const amps = [
    1.0,
    t >= 3.2 ? Math.min(0.55, (t - 3.2) * 0.45) : 0,
    t >= 6.4 ? Math.min(0.35, (t - 6.4) * 0.35) : 0,
    t >= 7.4 ? Math.min(0.25, (t - 7.4) * 0.3) : 0
  ];
  const colors = ["#7cc2ff", "#f28eb0", "#5ee6a8", "#c49bff"];

  amps.forEach((a, idx) => {
    if (a <= 0.01) return;
    ctx.strokeStyle = colors[idx];
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 70; x <= w - 70; x++) {
      const norm = (x - 70) / (w - 140);
      const y = cy - Math.sin((idx + 1) * (norm * Math.PI * 4 - t * 3)) * a * 85;
      if (x === 70) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = "#eab954";
  ctx.lineWidth = 4.2;
  ctx.beginPath();
  for (let x = 70; x <= w - 70; x++) {
    const norm = (x - 70) / (w - 140);
    let sum = 0;
    amps.forEach((a, idx) => { sum += a * Math.sin((idx + 1) * (norm * Math.PI * 4 - t * 3)); });
    const y = cy - sum * 72;
    if (x === 70) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.fillStyle = "#ffe59c";
  ctx.font = "bold 18px Consolas, 'Noto Sans TC', monospace";
  ctx.textAlign = "left";
  ctx.fillText(
    `y(t) = ${amps[0].toFixed(2)}sin(ωt) + ${amps[1].toFixed(2)}sin(2ωt) + ${amps[2].toFixed(2)}sin(3ωt) + ${amps[3].toFixed(2)}sin(4ωt)`,
    36,
    88
  );
}

function tick(now) {
  requestAnimationFrame(tick);
  const ch = CHAPTERS[chapterIdx];

  if (isPlaying) {
    if (lastFrameTime === null) lastFrameTime = now;
    const dt = Math.min(0.1, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    elapsed += dt;

    ch.cues.forEach((cue, idx) => {
      if (elapsed >= cue.t && !triggeredCues.has(idx)) {
        triggeredCues.add(idx);
        subtitleEl.textContent = cue.sub;
        if (cue.audio) cue.audio();
      }
    });

    if (elapsed >= ch.duration) {
      elapsed = ch.duration;
      openQuiz();
    }
  } else {
    lastFrameTime = null;
  }

  const pct = Math.min(100, (elapsed / ch.duration) * 100);
  timelineFill.style.width = `${pct}%`;
  timeReadout.textContent = `${formatSec(elapsed)} / ${formatSec(ch.duration)}`;
  drawVideoFrame(elapsed);
}

document.getElementById("start-course-btn").addEventListener("click", () => {
  window.audioEngine.init();
  loadChapter(0, true);
});

playPauseBtn.addEventListener("click", () => {
  if (!startOverlay.classList.contains("hidden")) {
    window.audioEngine.init();
    loadChapter(0, true);
    return;
  }
  if (!quizOverlay.classList.contains("hidden")) return;
  isPlaying = !isPlaying;
  playPauseBtn.textContent = isPlaying ? "⏸ 暫停" : "▶ 播放";
});

replayBtn.addEventListener("click", () => {
  window.audioEngine.init();
  loadChapter(chapterIdx, true);
});

document.getElementById("quiz-replay-btn").addEventListener("click", () => loadChapter(chapterIdx, true));

document.getElementById("quiz-next-btn").addEventListener("click", () => {
  if (chapterIdx < CHAPTERS.length - 1) {
    loadChapter(chapterIdx + 1, true);
  } else {
    quizOverlay.classList.add("hidden");
    document.getElementById("complete-summary").textContent =
      `你已完成全部 ${CHAPTERS.length} 個數理樂理動態章節與隨堂考驗（答對 ${passedChapters.size} / ${CHAPTERS.length} 題）！現在可以回到跨文化演奏廳親手彈奏三國音律。`;
    completeOverlay.classList.remove("hidden");
  }
});

document.getElementById("restart-all-btn").addEventListener("click", () => loadChapter(0, true));

muteBtn.addEventListener("click", () => {
  const nextMute = !window.audioEngine.muted;
  window.audioEngine.setMuted(nextMute);
  muteBtn.textContent = nextMute ? "🔇 已靜音" : "🔊 音效開";
});

stepPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    window.audioEngine.init();
    loadChapter(parseInt(pill.dataset.chapter, 10), true);
  });
});

updateChapterPills();
requestAnimationFrame(tick);
