(function () {
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (REDUCED) return;

  var canvas = document.createElement("canvas");
  canvas.id = "grimoire-particles";
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    zIndex: "1", pointerEvents: "none"
  });
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d");
  var W, H, particles = [], mouseX = 0.5, mouseY = 0.5;
  var isMobile = window.innerWidth < 768;
  var COUNT = isMobile ? 25 : 50;

  var COLORS = [
    "rgba(200,165,90,", "rgba(139,184,208,", "rgba(155,142,196,",
    "rgba(232,220,200,", "rgba(122,158,126,"
  ];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    isMobile = W < 768;
    var newCount = isMobile ? 25 : 50;
    if (newCount !== COUNT) {
      COUNT = newCount;
      while (particles.length > COUNT) particles.pop();
      while (particles.length < COUNT) particles.push(createParticle());
    }
  }

  function createParticle() {
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * W, y: Math.random() * H,
      size: 0.8 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -0.08 - Math.random() * 0.18,
      opacity: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.003 + Math.random() * 0.008,
      color: color,
      twinkle: Math.random() * 0.3
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.phase += p.phaseSpeed;
      var parallaxX = (mouseX - 0.5) * 8 * (p.size / 3);
      var parallaxY = (mouseY - 0.5) * 5 * (p.size / 3);
      p.x += p.speedX + (isMobile ? 0 : parallaxX * 0.002);
      p.y += p.speedY + (isMobile ? 0 : parallaxY * 0.002);

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      var flicker = p.opacity + Math.sin(p.phase) * p.twinkle;
      flicker = Math.max(0.05, Math.min(flicker, 0.7));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + flicker + ")";
      ctx.fill();

      if (p.size > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (flicker * 0.12) + ")";
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  if (!isMobile) {
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX / W;
      mouseY = e.clientY / H;
    }, { passive: true });
  }

  init();
  setTimeout(draw, 500);
})();
