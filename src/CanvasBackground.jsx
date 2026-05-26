import { useEffect, useRef } from 'react';

export default function CanvasBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const chars = "⠁⠃⠇⠧⠷⠿";
    const charCount = chars.length;
    let width, height, columns, rows;
    const fontSize = 12;
    let grid = [];
    let animationId;

    const mouse = { x: -1000, y: -1000, radius: 100 };

    function initGrid() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.ceil(width / fontSize);
      rows = Math.ceil(height / fontSize);
      grid = [];

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          grid.push({
            x: i * fontSize, y: j * fontSize,
            baseX: i * fontSize, baseY: j * fontSize,
            offset: Math.random() * Math.PI * 2
          });
        }
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', initGrid);
    window.addEventListener('mousemove', handleMouseMove);

    function getNoise(x, y, t) {
      const n1 = Math.sin(x * 0.003 + t * 0.5) * Math.cos(y * 0.003 - t * 0.3);
      const n2 = Math.sin(x * 0.008 - t * 0.8) * Math.cos(y * 0.005 + t * 0.4);
      const n3 = Math.sin((x + y) * 0.001 + t * 0.2);
      return (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
    }

    function animate(time) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const t = time * 0.001;

      grid.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let forceX = 0, forceY = 0, interactionBoost = 0;

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const power = (mouse.radius - dist) / mouse.radius;
          forceX -= Math.cos(angle) * power * 8;
          forceY -= Math.sin(angle) * power * 8;
          interactionBoost = power * 0.5;
        }

        p.x += (p.baseX + forceX - p.x) * 0.25;
        p.y += (p.baseY + forceY - p.y) * 0.25;

        const rawNoise = getNoise(p.baseX, p.baseY, t);
        const intensity = Math.max(0, (rawNoise + 0.3) * 1.5);
        const charIdx = Math.floor(Math.min(0.99, intensity) * charCount);
        const char = chars[charIdx];
        const opacity = Math.min(1, intensity + interactionBoost);

        if (opacity > 0.05) {
          const r = 150 + (intensity * 105);
          const g = 10 + (intensity * 20);
          const b = 20;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fillText(char, p.x, p.y);
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    initGrid();
    animationId = requestAnimationFrame(animate);

    // Cleanup function to prevent memory leaks in React
    return () => {
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef}></canvas>;
}