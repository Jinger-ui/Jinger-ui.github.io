(function () {
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) return;

  var canvas = document.createElement("canvas");
  canvas.id = "clock-ripple-canvas";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    zIndex: "2", pointerEvents: "none"
  });
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var W, H, dpr;
  var ripples = [];
  var MAX_RIPPLES = 4;
  var SPAWN_INTERVAL = 150;
  var lastSpawn = 0;

  var ZONE_W_RATIO = 0.35;
  var ZONE_H_RATIO = 0.45;

  var ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createRipple(x, y) {
    var lifetime = 1.8 + Math.random() * 0.6;
    var maxR = 220 + Math.random() * 100;
    var initR = 20 + Math.random() * 20;
    var ringCount = 1 + Math.floor(Math.random() * 3);
    var particleCount = 3 + Math.floor(Math.random() * 6);

    var rings = [];
    for (var i = 0; i < ringCount; i++) {
      rings.push({
        delay: i * 0.15,
        romanIndices: shuffleArray([0,1,2,3,4,5,6,7,8,9,10,11]).slice(0, 2 + Math.floor(Math.random()*3)),
        tickOffset: Math.random() * Math.PI * 2
      });
    }

    var parts = [];
    for (var j = 0; j < particleCount; j++) {
      var angle = Math.random() * Math.PI * 2;
      parts.push({
        angle: angle, dist: 0.6 + Math.random() * 0.4,
        size: 0.6 + Math.random() * 1.2,
        color: j % 3 === 0 ? "rgba(139,184,208," : j % 3 === 1 ? "rgba(210,215,225," : "rgba(155,142,196,"
      });
    }

    return {
      x: x, y: y, born: performance.now() / 1000,
      lifetime: lifetime, maxR: maxR, initR: initR,
      rings: rings, particles: parts
    };
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function drawRing(cx, cy, radius, opacity, ring) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "rgba(180,200,220," + Math.min(opacity * 3, 0.35) + ")";
    ctx.lineWidth = Math.max(0.5, 1.5 - radius / 300);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    var tickCount = 60;
    var innerTick = radius - 4;
    var outerTick = radius + 2;
    ctx.strokeStyle = "rgba(180,200,220," + Math.min(opacity * 2, 0.18) + ")";
    ctx.lineWidth = 0.5;
    for (var i = 0; i < tickCount; i++) {
      if (Math.random() > 0.3) continue;
      var a = ring.tickOffset + (i / tickCount) * Math.PI * 2;
      var iLen = i % 5 === 0 ? innerTick - 3 : innerTick;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * iLen, cy + Math.sin(a) * iLen);
      ctx.lineTo(cx + Math.cos(a) * outerTick, cy + Math.sin(a) * outerTick);
      ctx.stroke();
    }

    ctx.font = Math.max(6, 8 - radius / 80) + "px 'Cormorant Garamond', serif";
    ctx.fillStyle = "rgba(180,200,220," + Math.min(opacity * 2.5, 0.14) + ")";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (var r = 0; r < ring.romanIndices.length; r++) {
      var idx = ring.romanIndices[r];
      var ang = ring.tickOffset + (idx / 12) * Math.PI * 2 - Math.PI / 2;
      var textR = radius + 10;
      ctx.fillText(ROMAN[idx], cx + Math.cos(ang) * textR, cy + Math.sin(ang) * textR);
    }

    ctx.strokeStyle = "rgba(155,142,196," + Math.min(opacity * 2, 0.1) + ")";
    ctx.lineWidth = 0.4;
    for (var s = 0; s < 2; s++) {
      var sa = ring.tickOffset + s * Math.PI * 0.7 + 0.3;
      var ea = sa + 0.4 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 8 + s * 4, sa, ea);
      ctx.stroke();
    }

    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var now = performance.now() / 1000;

    for (var i = ripples.length - 1; i >= 0; i--) {
      var rip = ripples[i];
      var age = now - rip.born;
      if (age > rip.lifetime) { ripples.splice(i, 1); continue; }

      var progress = age / rip.lifetime;
      var baseOpacity = Math.sin(progress * Math.PI) * 0.25;
      baseOpacity = Math.max(0, Math.min(baseOpacity, 0.25));
      if (baseOpacity < 0.005) continue;

      for (var ri = 0; ri < rip.rings.length; ri++) {
        var ring = rip.rings[ri];
        var ringAge = age - ring.delay;
        if (ringAge < 0) continue;
        var ringProgress = ringAge / (rip.lifetime - ring.delay);
        var radius = rip.initR + (rip.maxR - rip.initR) * easeOutQuad(Math.min(ringProgress, 1));
        var ringOpacity = baseOpacity * (1 - ringProgress * 0.7);
        if (ringOpacity > 0.005) drawRing(rip.x, rip.y, radius, ringOpacity, ring);
      }

      var mainRadius = rip.initR + (rip.maxR - rip.initR) * easeOutQuad(Math.min(progress, 1));
      for (var pi = 0; pi < rip.particles.length; pi++) {
        var part = rip.particles[pi];
        var pr = mainRadius * part.dist;
        var px = rip.x + Math.cos(part.angle + progress * 0.5) * pr;
        var py = rip.y + Math.sin(part.angle + progress * 0.5) * pr;
        var pOpacity = baseOpacity * 0.8 * (1 - progress);
        ctx.beginPath();
        ctx.arc(px, py, part.size, 0, Math.PI * 2);
        ctx.fillStyle = part.color + Math.max(0, pOpacity) + ")";
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  function easeOutQuad(t) { return t * (2 - t); }

  function onPointerMove(e) {
    var x = e.clientX, y = e.clientY;
    if (x > W * ZONE_W_RATIO || y > H * ZONE_H_RATIO) return;

    var now = performance.now();
    if (now - lastSpawn < SPAWN_INTERVAL) return;
    if (ripples.length >= MAX_RIPPLES) return;

    lastSpawn = now;
    ripples.push(createRipple(x, y));
  }

  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  requestAnimationFrame(draw);
})();
