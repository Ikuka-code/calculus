class SceneryRenderer {
  constructor(canvas, culture, isPreview = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.culture = culture;
    this.isPreview = isPreview;
    this.time = 0;
    this.rafId = null;

    this.pluckIntensity = 0;
    this.activeStringIndex = -1;
    this.handTargetNorm = 0.5;
    this.handCurrentNorm = 0.5;
    this.ripples = [];
    this.floatingOrbs = [];

    this.particles = Array.from({ length: isPreview ? 18 : 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 4 + Math.random() * 6,
      speedY: 0.0007 + Math.random() * 0.0013,
      speedX: (Math.random() - 0.5) * 0.0012,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.035,
      pink: Math.random() > 0.45
    }));

    if (!isPreview) {
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(window.innerWidth * dpr);
    this.canvas.height = Math.floor(window.innerHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  // 動態讀取底部鍵盤高度，確保人物與樂器永遠完整呈現在鍵盤上方不被遮擋
  getStageCenter(w, h) {
    if (this.isPreview) {
      return { cx: w * 0.5, cy: h * 0.66, scale: Math.min(w / 460, h / 320) * 0.82 };
    }
    const dockEl = document.getElementById("stage-keyboard-dock");
    const dockH = dockEl ? dockEl.offsetHeight : (w <= 820 ? 210 : 138);
    const usableH = Math.max(260, h - dockH);
    const scale = Math.min(w / 520, usableH / 340, 1.32);
    const cy = usableH - 114 * scale;
    return { cx: w * 0.5, cy, scale };
  }

  triggerNote(index, label, subText = "") {
    this.activeStringIndex = index;
    this.pluckIntensity = 1.0;
    const totalKeys = (window.CULTURES[this.culture]?.scale.length || 8) - 1;
    this.handTargetNorm = Math.max(0.08, Math.min(0.92, index / Math.max(1, totalKeys)));

    const w = this.isPreview ? this.canvas.width : this.w;
    const h = this.isPreview ? this.canvas.height : this.h;
    const { cx, cy, scale } = this.getStageCenter(w, h);
    const meta = window.CULTURES[this.culture];

    const orbOffsetX = this.culture === "china" ? -72 * scale : this.culture === "japan" ? 72 * scale : 0;
    const orbOffsetY = this.culture === "arabia" ? -122 * scale : -74 * scale;

    this.floatingOrbs = [
      {
        x: cx + orbOffsetX,
        y: Math.max(76, cy + orbOffsetY),
        label,
        subText,
        r: Math.max(34, 40 * scale),
        age: 0,
        life: 1.0,
        bg: meta.orbBg,
        glow: meta.orbGlow,
        text: meta.orbText
      }
    ];

    this.ripples.push({
      x: cx,
      y: cy - 8 * scale,
      rx: 42 * scale,
      ry: 24 * scale,
      alpha: 0.9,
      color: meta.accent
    });
  }

  start() {
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      this.time += 0.016;
      this.pluckIntensity *= 0.91;
      this.handCurrentNorm += (this.handTargetNorm - this.handCurrentNorm) * 0.22;
      this.render();
    };
    loop();
  }

  render() {
    const ctx = this.ctx;
    const w = this.isPreview ? this.canvas.width : this.w;
    const h = this.isPreview ? this.canvas.height : this.h;

    if (this.culture === "china") this.drawChinaScene(ctx, w, h);
    else if (this.culture === "japan") this.drawJapanScene(ctx, w, h);
    else this.drawArabiaScene(ctx, w, h);

    this.drawParticles(ctx, w, h);
    this.drawRipples(ctx);
    this.drawMusician(ctx, w, h);
    this.drawFloatingOrbs(ctx);

    if (this.culture === "arabia") {
      this.drawArabiaArchFrame(ctx, w, h);
    }
  }

  drawStylizedClouds(ctx, w, h, topRatio) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
    const bands = [
      { x: 0.16, y: topRatio, rx: w * 0.16, ry: h * 0.028 },
      { x: 0.48, y: topRatio + 0.03, rx: w * 0.22, ry: h * 0.032 },
      { x: 0.82, y: topRatio + 0.01, rx: w * 0.18, ry: h * 0.025 }
    ];
    bands.forEach((b, i) => {
      const drift = Math.sin(this.time * 0.35 + i * 2) * 14;
      ctx.beginPath();
      ctx.ellipse(w * b.x + drift, h * b.y, b.rx, b.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawChinaScene(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.72);
    sky.addColorStop(0, "#97d2cc");
    sky.addColorStop(0.45, "#d8f0e7");
    sky.addColorStop(1, "#a7d7ce");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    this.drawStylizedClouds(ctx, w, h, 0.12);

    const sunX = w * 0.65;
    const sunY = h * 0.17;
    const sunR = Math.min(w, h) * 0.11;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.25, sunX, sunY, sunR * 1.9);
    sunGlow.addColorStop(0, "rgba(255, 252, 232, 0.98)");
    sunGlow.addColorStop(0.45, "rgba(255, 241, 194, 0.42)");
    sunGlow.addColorStop(1, "rgba(255, 241, 194, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 1.9, 0, Math.PI * 2);
    ctx.fill();

    this.drawSmoothHills(ctx, w, h, 0.48, 0.14, "#74aeb0", 0.5, 2.2);
    this.drawSmoothHills(ctx, w, h, 0.54, 0.15, "#47958b", 2.1, 2.5);

    const lakeY = h * 0.54;
    const lake = ctx.createLinearGradient(0, lakeY, 0, h);
    lake.addColorStop(0, "#68bdbb");
    lake.addColorStop(0.55, "#4da49d");
    lake.addColorStop(1, "#327a74");
    ctx.fillStyle = lake;
    ctx.fillRect(0, lakeY, w, h - lakeY);

    const px = w * 0.77;
    const py = h * 0.55;
    const ps = Math.min(w, h) * 0.00145;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(ps, ps);

    ctx.fillStyle = "#4d8d7c";
    ctx.beginPath();
    ctx.ellipse(0, 12, 86, 16, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#e8e3d6";
    ctx.fillRect(-58, 4, 116, 10);

    ctx.fillStyle = "#b8322c";
    [-44, -18, 18, 44].forEach((rx) => ctx.fillRect(rx - 4, -52, 8, 56));
    ctx.fillStyle = "#91231e";
    ctx.fillRect(-50, -54, 100, 7);

    ctx.fillStyle = "#223b45";
    ctx.beginPath();
    ctx.moveTo(-76, -50);
    ctx.quadraticCurveTo(0, -82, 76, -50);
    ctx.quadraticCurveTo(0, -60, -76, -50);
    ctx.fill();
    ctx.strokeStyle = "#d9b45b";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-54, -76);
    ctx.quadraticCurveTo(0, -118, 54, -76);
    ctx.quadraticCurveTo(0, -86, -54, -76);
    ctx.fill();
    ctx.fillStyle = "#eab954";
    ctx.beginPath();
    ctx.arc(0, -104, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawDetailedBamboo(ctx, w * 0.075, h, h * 0.92, 1);
    this.drawDetailedBamboo(ctx, w * 0.13, h, h * 0.82, -0.7);
    this.drawDetailedBamboo(ctx, w * 0.87, h, h * 0.84, 0.8);
    this.drawDetailedBamboo(ctx, w * 0.925, h, h * 0.92, -1);
  }

  drawDetailedBamboo(ctx, baseX, h, height, swayDir) {
    const segments = 6;
    const segH = height / segments;
    const sway = Math.sin(this.time * 1.1 + baseX) * 5 * swayDir;
    const width = Math.max(5, h * 0.011);

    ctx.save();
    for (let i = 0; i < segments; i++) {
      const t0 = i / segments;
      const t1 = (i + 1) / segments;
      const x0 = baseX + sway * t0;
      const y0 = h - segH * i;
      const x1 = baseX + sway * t1;
      const y1 = h - segH * (i + 1);

      ctx.strokeStyle = i % 2 === 0 ? "#2d7e58" : "#378f65";
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.strokeStyle = "#1d573b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x1 - width * 0.75, y1);
      ctx.lineTo(x1 + width * 0.75, y1);
      ctx.stroke();

      if (i >= 1) {
        const dir = i % 2 === 0 ? 1 : -1;
        ctx.fillStyle = "#3c976b";
        ctx.beginPath();
        ctx.ellipse(x1 + dir * 24, y1 + 4, 24, 4.5, dir * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2b7853";
        ctx.beginPath();
        ctx.ellipse(x1 + dir * 18, y1 - 8, 18, 3.8, dir * -0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawJapanScene(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    sky.addColorStop(0, "#66a9e9");
    sky.addColorStop(0.55, "#b9dcf8");
    sky.addColorStop(1, "#f7d4e2");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    this.drawStylizedClouds(ctx, w, h, 0.12);

    const fx = w * 0.5;
    const peakY = h * 0.16;
    const baseY = h * 0.56;
    const span = Math.min(w * 0.56, h * 0.58);

    const fujiGrad = ctx.createLinearGradient(0, peakY, 0, baseY);
    fujiGrad.addColorStop(0, "#4c6fa8");
    fujiGrad.addColorStop(1, "#39598f");
    ctx.fillStyle = fujiGrad;
    ctx.beginPath();
    ctx.moveTo(fx - span, baseY);
    ctx.quadraticCurveTo(fx - span * 0.34, baseY - (baseY - peakY) * 0.52, fx - span * 0.11, peakY);
    ctx.lineTo(fx + span * 0.11, peakY);
    ctx.quadraticCurveTo(fx + span * 0.34, baseY - (baseY - peakY) * 0.52, fx + span, baseY);
    ctx.closePath();
    ctx.fill();

    const snowY = peakY + (baseY - peakY) * 0.29;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(fx - span * 0.11, peakY);
    ctx.lineTo(fx + span * 0.11, peakY);
    ctx.lineTo(fx + span * 0.25, snowY);
    ctx.lineTo(fx + span * 0.13, snowY - 12);
    ctx.lineTo(fx + span * 0.03, snowY + 8);
    ctx.lineTo(fx - span * 0.08, snowY - 10);
    ctx.lineTo(fx - span * 0.25, snowY);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#3f8c73";
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.quadraticCurveTo(w * 0.22, baseY - 22, w * 0.45, baseY);
    ctx.quadraticCurveTo(w * 0.78, baseY - 24, w, baseY);
    ctx.lineTo(w, baseY + 14);
    ctx.lineTo(0, baseY + 14);
    ctx.closePath();
    ctx.fill();

    const sakuraSpots = [
      { x: 0.15, y: baseY - 12, r: 22 },
      { x: 0.24, y: baseY - 10, r: 19 },
      { x: 0.72, y: baseY - 14, r: 24 },
      { x: 0.86, y: baseY - 10, r: 22 }
    ];
    sakuraSpots.forEach((s) => {
      ctx.fillStyle = "#f9b7cc";
      ctx.beginPath();
      ctx.arc(w * s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffdbe7";
      ctx.beginPath();
      ctx.arc(w * s.x - s.r * 0.22, s.y - s.r * 0.18, s.r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    });

    const lake = ctx.createLinearGradient(0, baseY, 0, h);
    lake.addColorStop(0, "#66aae2");
    lake.addColorStop(1, "#3773b4");
    ctx.fillStyle = lake;
    ctx.fillRect(0, baseY, w, h - baseY);

    const tx = w * 0.76;
    const ty = baseY + 18;
    const ts = Math.min(w, h) * 0.00145;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.scale(ts, ts);
    ctx.fillStyle = "#d93629";
    ctx.fillRect(-52, -92, 13, 98);
    ctx.fillRect(39, -92, 13, 98);
    ctx.fillRect(-68, -72, 136, 11);
    ctx.fillRect(-7, -92, 14, 22);
    ctx.beginPath();
    ctx.moveTo(-84, -98);
    ctx.quadraticCurveTo(0, -84, 84, -98);
    ctx.lineTo(78, -84);
    ctx.quadraticCurveTo(0, -73, -78, -84);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#22242c";
    ctx.beginPath();
    ctx.moveTo(-86, -101);
    ctx.quadraticCurveTo(0, -87, 86, -101);
    ctx.lineTo(84, -95);
    ctx.quadraticCurveTo(0, -82, -84, -95);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(-55, 2, 19, 8);
    ctx.fillRect(36, 2, 19, 8);
    ctx.restore();
  }

  drawArabiaScene(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.68);
    sky.addColorStop(0, "#339eb0");
    sky.addColorStop(0.5, "#87c9b9");
    sky.addColorStop(0.8, "#f3cd7e");
    sky.addColorStop(1, "#ecc06d");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(255, 250, 224, 0.85)";
    [[0.26, 0.14, 2.5], [0.68, 0.18, 2], [0.81, 0.28, 3], [0.22, 0.25, 2]].forEach(([sx, sy, sr]) => {
      ctx.beginPath();
      ctx.arc(w * sx, h * sy, sr, 0, Math.PI * 2);
      ctx.fill();
    });

    const mx = w * 0.7;
    const my = h * 0.13;
    const mr = Math.min(w, h) * 0.036;
    ctx.save();
    ctx.fillStyle = "#fff9e0";
    ctx.beginPath();
    ctx.arc(mx, my, mr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3ca4b2";
    ctx.beginPath();
    ctx.arc(mx + mr * 0.36, my - mr * 0.12, mr * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    this.drawArabiaPalace(ctx, w * 0.27, h * 0.56, Math.min(w, h) * 0.00125);
    this.drawArabiaPalace(ctx, w * 0.76, h * 0.57, Math.min(w, h) * 0.00105);

    this.drawSmoothHills(ctx, w, h, 0.58, 0.075, "#e6b868", 0.7, 1.8);
    this.drawSmoothHills(ctx, w, h, 0.65, 0.065, "#d69c48", 2.3, 1.5);

    ctx.fillStyle = "#2ca09b";
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.72, w * 0.38, h * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawPalmFrond(ctx, w * 0.17, h * 0.69, -1);
    this.drawPalmFrond(ctx, w * 0.83, h * 0.69, 1);
  }

  drawArabiaPalace(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = "#f9f3e2";
    ctx.fillRect(-102, -110, 16, 110);
    ctx.fillRect(86, -110, 16, 110);
    ctx.fillStyle = "#eab243";
    ctx.beginPath();
    ctx.moveTo(-104, -110); ctx.lineTo(-94, -134); ctx.lineTo(-84, -110); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(84, -110); ctx.lineTo(94, -134); ctx.lineTo(104, -110); ctx.fill();

    ctx.fillStyle = "#28a29a";
    ctx.beginPath(); ctx.arc(-66, -42, 18, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(66, -42, 18, Math.PI, 0); ctx.fill();

    const domeGrad = ctx.createLinearGradient(0, -112, 0, -42);
    domeGrad.addColorStop(0, "#fae082");
    domeGrad.addColorStop(1, "#d9972c");
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.moveTo(-46, -42);
    ctx.quadraticCurveTo(-48, -94, 0, -116);
    ctx.quadraticCurveTo(48, -94, 46, -42);
    ctx.fill();

    ctx.fillStyle = "#faf5e8";
    ctx.fillRect(-110, -42, 220, 46);
    ctx.fillStyle = "#2b7e8a";
    for (let wx = -88; wx <= 88; wx += 22) {
      ctx.beginPath();
      ctx.roundRect(wx - 5, -28, 10, 22, [6, 6, 0, 0]);
      ctx.fill();
    }
    ctx.restore();
  }

  drawPalmFrond(ctx, x, y, dir) {
    ctx.save();
    ctx.strokeStyle = "#1d7a6e";
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + dir * (22 + i * 8), y - 24 + i * 8, x + dir * (44 + i * 10), y - 6 + i * 11);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawArabiaArchFrame(ctx, w, h) {
    const padX = Math.max(18, w * 0.055);
    const topY = 0;
    const archShoulderY = h * 0.22;

    ctx.save();
    ctx.fillStyle = "#f2e7ca";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.moveTo(padX, h);
    ctx.lineTo(padX, archShoulderY);
    ctx.quadraticCurveTo(padX, topY + 6, w * 0.5, topY - 4);
    ctx.quadraticCurveTo(w - padX, topY + 6, w - padX, archShoulderY);
    ctx.lineTo(w - padX, h);
    ctx.closePath();
    ctx.fill("evenodd");

    ctx.strokeStyle = "#d59b32";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(padX, h);
    ctx.lineTo(padX, archShoulderY);
    ctx.quadraticCurveTo(padX, topY + 6, w * 0.5, topY - 4);
    ctx.quadraticCurveTo(w - padX, topY + 6, w - padX, archShoulderY);
    ctx.lineTo(w - padX, h);
    ctx.stroke();

    // 右上與中左懸掛發光六角燈籠（避開左上角返回／演奏按鈕）
    this.drawArabiaLantern(ctx, w - padX - Math.min(48, w * 0.09), 26);
    if (this.isPreview || w > 640) {
      this.drawArabiaLantern(ctx, padX + Math.min(48, w * 0.09), this.isPreview ? 22 : 76);
    }
    ctx.restore();
  }

  drawArabiaLantern(ctx, x, y) {
    const swing = Math.sin(this.time * 1.5 + x) * 3;
    ctx.save();
    ctx.translate(x + swing, y);
    const glow = ctx.createRadialGradient(0, 22, 4, 0, 22, 46);
    glow.addColorStop(0, "rgba(255, 232, 148, 0.72)");
    glow.addColorStop(1, "rgba(255, 232, 148, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 22, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#a8661e";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(15, 6);
    ctx.lineTo(12, 34);
    ctx.lineTo(0, 46);
    ctx.lineTo(-12, 34);
    ctx.lineTo(-15, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff4cf";
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(9, 10);
    ctx.lineTo(7, 30);
    ctx.lineTo(0, 38);
    ctx.lineTo(-7, 30);
    ctx.lineTo(-9, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSmoothHills(ctx, w, h, baseRatio, ampRatio, color, phase, freq) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 10) {
      const n = x / w;
      const y = h * baseRatio - (Math.sin(n * Math.PI * freq + phase) * 0.5 + 0.5) * h * ampRatio;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  drawMusician(ctx, w, h) {
    const { cx, cy, scale } = this.getStageCenter(w, h);
    const breathe = Math.sin(this.time * 2.2) * 2;
    const pluckLift = this.pluckIntensity * 11;

    ctx.save();
    ctx.translate(cx, cy + breathe);
    ctx.scale(scale, scale);

    if (this.culture === "china") this.drawChinaMusician(ctx, pluckLift);
    else if (this.culture === "japan") this.drawJapanMusician(ctx, pluckLift);
    else this.drawArabiaMusician(ctx, pluckLift);

    ctx.restore();
  }

  drawChinaMusician(ctx, pluckLift) {
    ctx.fillStyle = "#6c391f";
    ctx.fillRect(-165, 86, 330, 14);
    ctx.fillStyle = "#8a4b29";
    ctx.fillRect(-148, 76, 296, 12);

    ctx.fillStyle = "#f2faf7";
    ctx.beginPath();
    ctx.moveTo(-76, 78);
    ctx.quadraticCurveTo(-56, -24, 0, -34);
    ctx.quadraticCurveTo(56, -24, 76, 78);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#a9dcd0";
    ctx.beginPath();
    ctx.moveTo(-72, 26);
    ctx.lineTo(-26, -32);
    ctx.lineTo(0, 6);
    ctx.lineTo(26, -32);
    ctx.lineTo(72, 26);
    ctx.lineTo(42, 42);
    ctx.lineTo(-42, 42);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#e6b952";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, -32); ctx.lineTo(0, 4); ctx.lineTo(18, -32);
    ctx.stroke();

    ctx.fillStyle = "#c83b36";
    ctx.fillRect(-34, 16, 68, 12);
    ctx.fillStyle = "#f3ca64";
    ctx.fillRect(-7, 17, 14, 10);

    ctx.fillStyle = "#1d222b";
    ctx.beginPath(); ctx.arc(0, -64, 24, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -90, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(-23, -64, 7, 46);
    ctx.fillRect(16, -64, 7, 46);
    ctx.strokeStyle = "#4cc7a2";
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-22, -88); ctx.lineTo(26, -93); ctx.stroke();
    ctx.fillStyle = "#f4ca62";
    ctx.beginPath(); ctx.arc(27, -86, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#fde2c9";
    ctx.beginPath(); ctx.ellipse(0, -58, 19, 22, 0, 0, Math.PI * 2); ctx.fill();
    this.drawGentleFace(ctx, 0, -58);

    ctx.fillStyle = "#4d2712";
    ctx.fillRect(-118, 48, 12, 32);
    ctx.fillRect(-94, 48, 8, 32);
    ctx.fillRect(-118, 62, 32, 6);
    ctx.fillRect(86, 48, 8, 32);
    ctx.fillRect(106, 48, 12, 32);
    ctx.fillRect(86, 62, 32, 6);

    const gGrad = ctx.createLinearGradient(-155, 22, 155, 54);
    gGrad.addColorStop(0, "#7a441e");
    gGrad.addColorStop(0.5, "#c5864c");
    gGrad.addColorStop(1, "#6b3818");
    ctx.fillStyle = gGrad;
    ctx.beginPath();
    ctx.roundRect(-152, 22, 304, 34, 7);
    ctx.fill();
    ctx.strokeStyle = "#4a240e";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#4a240e";
    ctx.fillRect(-148, 22, 14, 34);
    ctx.fillRect(134, 22, 14, 34);

    for (let i = 0; i < 8; i++) {
      const sy = 26 + i * 3.7;
      const isHit = i === this.activeStringIndex && this.pluckIntensity > 0.14;
      ctx.strokeStyle = isHit ? "#fff5a8" : "rgba(255, 246, 224, 0.78)";
      ctx.lineWidth = isHit ? 2.4 : 1;
      ctx.beginPath();
      ctx.moveTo(-134, sy);
      if (isHit) {
        ctx.quadraticCurveTo(0, sy + Math.sin(this.time * 55) * 3.8 * this.pluckIntensity, 134, sy);
      } else {
        ctx.lineTo(134, sy);
      }
      ctx.stroke();

      ctx.fillStyle = "#fffaf0";
      ctx.beginPath();
      ctx.arc(-68 + i * 20, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const rx = -100 + this.handCurrentNorm * 200;
    ctx.fillStyle = "#fde2c9";
    ctx.beginPath(); ctx.arc(rx, 24 - pluckLift * 0.7, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-62, 24 + Math.sin(this.time * 2.5) * 1.5, 7, 0, Math.PI * 2); ctx.fill();
  }

  drawJapanMusician(ctx, pluckLift) {
    ctx.fillStyle = "#7a4e2b";
    ctx.fillRect(-168, 86, 336, 13);
    ctx.fillStyle = "#dbe4b8";
    ctx.fillRect(-156, 75, 312, 12);
    ctx.strokeStyle = "#8aa16b";
    ctx.lineWidth = 2;
    ctx.strokeRect(-156, 75, 312, 12);

    ctx.fillStyle = "#374670";
    ctx.beginPath();
    ctx.ellipse(0, 68, 72, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f4adc4";
    ctx.beginPath();
    ctx.moveTo(-66, 46);
    ctx.lineTo(-26, -30);
    ctx.lineTo(26, -30);
    ctx.lineTo(66, 46);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    [[-34, 6], [-18, -6], [24, 10], [36, -4], [0, -10]].forEach(([dx, dy]) => {
      ctx.beginPath(); ctx.arc(dx, dy, 2.5, 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-14, -30); ctx.lineTo(0, -2); ctx.lineTo(14, -30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ebb94f";
    ctx.fillRect(-32, 10, 64, 18);
    ctx.fillStyle = "#d9454f";
    ctx.fillRect(-32, 17, 64, 4);

    ctx.fillStyle = "#1d222b";
    ctx.beginPath(); ctx.arc(0, -64, 24, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -88, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff9bb9";
    ctx.beginPath(); ctx.arc(16, -74, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff0f6";
    ctx.beginPath(); ctx.arc(16, -74, 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#fde2c9";
    ctx.beginPath(); ctx.ellipse(0, -56, 18, 21, 0, 0, Math.PI * 2); ctx.fill();
    this.drawGentleFace(ctx, 0, -56);

    ctx.fillStyle = "#6c391f";
    ctx.fillRect(-132, 54, 12, 24);
    ctx.fillRect(120, 54, 12, 24);

    const kGrad = ctx.createLinearGradient(-158, 26, 158, 56);
    kGrad.addColorStop(0, "#b97a46");
    kGrad.addColorStop(0.5, "#dfa165");
    kGrad.addColorStop(1, "#a66936");
    ctx.fillStyle = kGrad;
    ctx.beginPath();
    ctx.roundRect(-156, 26, 312, 32, 6);
    ctx.fill();
    ctx.strokeStyle = "#6b3c1c";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#d63b49";
    ctx.fillRect(-154, 27, 15, 30);
    ctx.fillRect(139, 27, 15, 30);

    for (let i = 0; i < 7; i++) {
      const sy = 30 + i * 4;
      const isHit = i === this.activeStringIndex && this.pluckIntensity > 0.14;
      ctx.strokeStyle = isHit ? "#ffd1e6" : "rgba(255, 250, 240, 0.8)";
      ctx.lineWidth = isHit ? 2.4 : 1;
      ctx.beginPath();
      ctx.moveTo(-138, sy);
      if (isHit) ctx.quadraticCurveTo(0, sy + Math.sin(this.time * 55) * 3.8 * this.pluckIntensity, 138, sy);
      else ctx.lineTo(138, sy);
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-60 + i * 22, sy - 2, 4, 4);
    }

    const rx = -90 + this.handCurrentNorm * 180;
    ctx.fillStyle = "#fde2c9";
    ctx.beginPath(); ctx.arc(rx, 26 - pluckLift * 0.7, 7.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-54, 26, 7, 0, Math.PI * 2); ctx.fill();
  }

  drawArabiaMusician(ctx, pluckLift) {
    ctx.fillStyle = "#c93540";
    ctx.beginPath(); ctx.ellipse(0, 78, 132, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f2c85b";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = "#197b67";
    ctx.beginPath(); ctx.ellipse(-78, 66, 26, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(78, 66, 26, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f2c85b";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(-78, 66, 26, 12, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(78, 66, 26, 12, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = "#fcfaf2";
    ctx.beginPath();
    ctx.moveTo(-74, 76);
    ctx.quadraticCurveTo(-50, -24, 0, -34);
    ctx.quadraticCurveTo(50, -24, 74, 76);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#1a7d66";
    ctx.fillRect(-34, -28, 22, 66);
    ctx.fillRect(12, -28, 22, 66);
    ctx.strokeStyle = "#eab954";
    ctx.lineWidth = 2;
    ctx.strokeRect(-34, -28, 22, 66);
    ctx.strokeRect(12, -28, 22, 66);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, -60, 24, Math.PI, 0);
    ctx.lineTo(28, -22);
    ctx.lineTo(-28, -22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#f4cba8";
    ctx.beginPath(); ctx.ellipse(0, -56, 16, 19, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2c2420";
    ctx.beginPath();
    ctx.arc(0, -50, 14, 0.12 * Math.PI, 0.88 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#f4cba8";
    ctx.beginPath(); ctx.arc(0, -53, 8, 0, Math.PI); ctx.fill();

    ctx.fillStyle = "#241d19";
    ctx.beginPath(); ctx.arc(-6, -59, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -59, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#6e3b2e";
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(0, -53, 4.5, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

    ctx.strokeStyle = "#1b1d22";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, -73, 19, 4.5, 0, 0, Math.PI * 2); ctx.stroke();

    ctx.save();
    ctx.translate(10, 24);
    ctx.rotate(-0.08);

    const oGrad = ctx.createRadialGradient(-4, 0, 6, 6, 0, 56);
    oGrad.addColorStop(0, "#d2965a");
    oGrad.addColorStop(1, "#7c471f");
    ctx.fillStyle = oGrad;
    ctx.beginPath();
    ctx.ellipse(12, 0, 48, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#4d280d";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#5c3012";
    ctx.fillRect(-98, -6, 70, 12);
    ctx.beginPath();
    ctx.moveTo(-98, -6);
    ctx.lineTo(-118, 6);
    ctx.lineTo(-112, 16);
    ctx.lineTo(-92, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2b160a";
    ctx.beginPath(); ctx.arc(4, 0, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#eab954";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
      const sy = -4 + i * 2;
      ctx.strokeStyle = this.pluckIntensity > 0.2 ? "#8affdf" : "rgba(255, 244, 215, 0.8)";
      ctx.lineWidth = this.pluckIntensity > 0.2 ? 1.5 : 0.9;
      ctx.beginPath(); ctx.moveTo(-96, sy); ctx.lineTo(44, sy); ctx.stroke();
    }

    ctx.fillStyle = "#f4cba8";
    ctx.beginPath(); ctx.arc(-68 + this.handCurrentNorm * 26, -8, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(20, 4 - pluckLift * 0.7, 8.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawGentleFace(ctx, x, y) {
    ctx.strokeStyle = "#3a2d28";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x - 6, y - 2, 3.2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 6, y - 2, 3.2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.fillStyle = "rgba(240, 140, 150, 0.35)";
    ctx.beginPath(); ctx.arc(x - 10, y + 4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 10, y + 4, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#c06c6c";
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(x, y + 7, 3.8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }

  drawParticles(ctx, w, h) {
    this.particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(this.time + p.y * 5) * 0.0005;
      p.rot += p.rotSpeed;
      if (p.y > 1.05) {
        p.y = -0.05;
        p.x = Math.random();
      }
      ctx.save();
      ctx.translate(p.x * w, p.y * h);
      ctx.rotate(p.rot);
      if (this.culture === "china") {
        ctx.fillStyle = "rgba(56, 146, 104, 0.76)";
        ctx.beginPath(); ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      } else if (this.culture === "japan") {
        ctx.fillStyle = p.pink ? "rgba(255, 182, 208, 0.9)" : "rgba(255, 255, 255, 0.92)";
        ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.95, p.size * 0.56, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = "rgba(255, 244, 188, 0.78)";
        ctx.beginPath(); ctx.arc(0, 0, p.size * 0.36, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });
  }

  drawRipples(ctx) {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rp = this.ripples[i];
      rp.rx += 2.8;
      rp.ry += 1.6;
      rp.alpha *= 0.94;
      ctx.save();
      ctx.strokeStyle = rp.color;
      ctx.globalAlpha = rp.alpha;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(rp.x, rp.y, rp.rx, rp.ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      if (rp.alpha < 0.04) this.ripples.splice(i, 1);
    }
  }

  // 演奏時顯眼呈現的柔光音名圓球（含彈跳進場與音高小標）
  drawFloatingOrbs(ctx) {
    for (let i = this.floatingOrbs.length - 1; i >= 0; i--) {
      const o = this.floatingOrbs[i];
      o.age += 0.06;
      o.y -= 0.18;
      o.life -= 0.0085;
      const popScale = o.age < 1 ? 0.72 + Math.sin(o.age * Math.PI * 0.5) * 0.28 : 1;
      const alpha = Math.min(1, o.life * 1.65);

      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.scale(popScale, popScale);
      ctx.globalAlpha = Math.max(0, alpha);

      const rad = ctx.createRadialGradient(0, 0, o.r * 0.2, 0, 0, o.r * 1.65);
      rad.addColorStop(0, o.bg);
      rad.addColorStop(0.62, o.glow);
      rad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(0, 0, o.r * 1.65, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = o.bg;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = o.text;
      const mainSize = o.label.length > 4 ? 17 : o.label.length > 2 ? 20 : 28;
      ctx.font = `900 ${mainSize}px 'Noto Sans TC', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(o.label, 0, o.subText ? -6 : 1);

      if (o.subText) {
        ctx.font = "700 12px Consolas, monospace";
        ctx.globalAlpha = Math.max(0, alpha * 0.85);
        ctx.fillText(o.subText, 0, 16);
      }
      ctx.restore();

      if (o.life <= 0) this.floatingOrbs.splice(i, 1);
    }
  }
}

window.SceneryRenderer = SceneryRenderer;
