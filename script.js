// ============================================================
// Hero network-graph animation.
// A quiet nod to the subject: nodes drifting and connecting,
// like a small knowledge graph, with one highlighted "you" node.
// Respects prefers-reduced-motion by freezing on a single frame.
// ============================================================

const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');

let nodes = [];
const LINK_DISTANCE = 160;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  initNodes();
}

function initNodes() {
  const count = canvas.width < 640 ? 14 : 28;
  nodes = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: i === 0 ? 5 : 2 + Math.random() * 1.5,
    highlight: i === 0
  }));
}

function step() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // update positions
  if (!prefersReducedMotion) {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    }
  }

  // draw links
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < LINK_DISTANCE) {
        const opacity = 1 - dist / LINK_DISTANCE;
        ctx.strokeStyle = `rgba(108, 140, 255, ${opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // draw nodes
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = n.highlight ? '#E8A33D' : 'rgba(237, 239, 245, 0.6)';
    ctx.fill();
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }
}

window.addEventListener('resize', resize);
resize();
step();
