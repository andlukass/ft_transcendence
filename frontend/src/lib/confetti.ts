export function launchConfetti() {
  // Simple canvas-based confetti effect
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }> = [];

  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
    });
  }

  function animate() {
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const piece of confetti) {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.3; // gravity

      context.fillStyle = piece.color;
      context.fillRect(piece.x, piece.y, piece.size, piece.size);

      if (piece.y > canvas.height) {
        piece.y = -10;
        piece.x = Math.random() * canvas.width;
      }
    }

    // Remove canvas after 5 seconds
    setTimeout(() => {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }, 2000);
  }

  const interval = setInterval(animate, 20);
  setTimeout(() => clearInterval(interval), 2000);
}
