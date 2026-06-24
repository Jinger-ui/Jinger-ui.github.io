(function () {
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) return;

  var canvas = document.createElement("canvas");
  canvas.id = "lantern-glow-canvas";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    zIndex: "1", pointerEvents: "none"
  });
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var W, H, dpr;
  var particles = [];
  var PARTICLE_COUNT = 18;
  var time = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: W * 0.82 + (Math.random() - 0.5) * W * 0.14,
        y: H * 0.88 + (Math.random() - 0.5) * H * 0.08,
        speedY: -0.12 - Math.random() * 0.25,
        speedX: (Math.random() - 0.5) * 0.15,
        size: 0.6 + Math.random() * 1.4,
        life: Math.random(),
        lifeSpeed: 0.002 + Math.random() * 0.004,
        isGold: Math.random() > 0.4
      });
    }
  }

  function resetParticle(p) {
    p.x = W * 0.82 + (Math.random() - 0.5) * W * 0.12;
    p.y = H * 0.88 + (Math.random() - 0.5) * H * 0.06;
    p.life = 0;
    p.speedY = -0.12 - Math.random() * 0.25;
    p.speedX = (Math.random() - 0.5) * 0.15;
    p.size = 0.6 + Math.random() * 1.4;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.008;

    var lanternX = W * 0.85;
    var lanternY = H * 0.82;

    var breathe = 0.5 + 0.5 * Math.sin(time * 0.7);
    var goldAlpha = 0.04 + breathe * 0.04;
    var cyanAlpha = 0.02 + breathe * 0.025;

    var g1 = ctx.createRadialGradient(lanternX, lanternY, 0, lanternX, lanternY, 180 + breathe * 40);
    g1.addColorStop(0, "rgba(200,165,90," + goldAlpha + ")");
    g1.addColorStop(0.5, "rgba(160,135,70," + (goldAlpha * 0.5) + ")");
    g1.addColorStop(1, "rgba(200,165,90,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(lanternX - 250, lanternY - 250, 500, 500);

    var g2 = ctx.createRadialGradient(lanternX, lanternY, 0, lanternX, lanternY, 120 + breathe * 30);
    g2.addColorStop(0, "rgba(100,180,190," + cyanAlpha + ")");
    g2.addColorStop(0.6, "rgba(80,160,170," + (cyanAlpha * 0.4) + ")");
    g2.addColorStop(1, "rgba(100,180,190,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(lanternX - 200, lanternY - 200, 400, 400);

    ctx.save();
    ctx.globalAlpha = 0.015 + breathe * 0.012;
    ctx.strokeStyle = "rgba(200,175,110,0.06)";
    ctx.lineWidth = 40 + breathe * 20;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lanternX, lanternY);
    ctx.quadraticCurveTo(
      lanternX - W * 0.15, lanternY - H * 0.15,
      lanternX - W * 0.35, lanternY - H * 0.35
    );
    ctx.stroke();

    ctx.strokeStyle = "rgba(120,180,185,0.04)";
    ctx.lineWidth = 25 + breathe * 15;
    ctx.beginPath();
    ctx.moveTo(lanternX, lanternY);
    ctx.quadraticCurveTo(
      lanternX - W * 0.12, lanternY - H * 0.18,
      lanternX - W * 0.3, lanternY - H * 0.4
    );
    ctx.stroke();
    ctx.restore();

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.life += p.lifeSpeed;
      if (p.life > 1) { resetParticle(p); continue; }
      p.x += p.speedX + Math.sin(time + i) * 0.05;
      p.y += p.speedY;

      var fadeIn = Math.min(p.life * 4, 1);
      var fadeOut = 1 - Math.max((p.life - 0.7) / 0.3, 0);
      var alpha = fadeIn * fadeOut * 0.55;

      var color = p.isGold
        ? "rgba(210,175,100," + alpha + ")"
        : "rgba(120,190,200," + alpha + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (p.size > 1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? "rgba(210,175,100," + (alpha * 0.15) + ")"
          : "rgba(120,190,200," + (alpha * 0.12) + ")";
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  initParticles();
  window.addEventListener("resize", function () { resize(); initParticles(); });
  requestAnimationFrame(draw);
})();
