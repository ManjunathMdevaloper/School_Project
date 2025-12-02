// src/ui/Particles.jsx
import React, { useEffect, useRef } from 'react';
import '../styles/particles.css';

export default function Particles(){
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const particles = [];
    const count = Math.floor((w*h) / 60000) * 12 + 25; // scale to screen

    function rand(min, max){ return Math.random() * (max-min) + min; }

    for (let i=0;i<count;i++){
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.2, 0.2),
        r: rand(0.6, 2.4),
        hue: Math.floor(rand(180, 220)),
        alpha: rand(0.12, 0.45)
      });
    }

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);

    let raf = null;
    function draw(){
      ctx.clearRect(0,0,w,h);
      // faint gradient overlay for depth
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, 'rgba(10,15,30,0.08)');
      g.addColorStop(1, 'rgba(20,30,50,0.08)');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);

      // draw connections
      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        for (let j=i+1; j<particles.length; j++){
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 9000){
            const alpha = 0.06 * (1 - d2/9000);
            ctx.strokeStyle = `rgba(120,190,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(q.x,q.y);
            ctx.stroke();
          }
        }
      }

      // draw particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // full-screen absolute canvas behind content
  return <canvas ref={ref} className="particles-canvas" />;
}
