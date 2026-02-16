import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  progress: number;
  active: boolean;
}

export function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarRef = useRef<ShootingStar | null>(null);
  const animationFrameRef = useRef<number>();
  const lastShootingStarTime = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize static twinkling stars
    const initStars = () => {
      starsRef.current = [];
      const numStars = 200;
      for (let i = 0; i < numStars; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // Create a shooting star - only one at a time
    const createShootingStar = () => {
      // Only create if no active shooting star exists
      if (shootingStarRef.current?.active) return;
      
      // Randomized angle: can go in various diagonal directions
      // Range from -45° to 135° for variety (avoiding straight up)
      const angleVariation = Math.random() * Math.PI - Math.PI / 4; // -45° to 135°
      const angle = angleVariation;
      
      // Calculate center of screen
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate a point on the trajectory line that passes through center
      // We want the shooting star to pass through center, so we work backwards
      // Start position will be offset from center along the reverse angle
      const distanceFromCenter = 400 + Math.random() * 300; // Distance before center
      
      const startX = centerX - Math.cos(angle) * distanceFromCenter + (Math.random() - 0.5) * 200;
      const startY = centerY - Math.sin(angle) * distanceFromCenter + (Math.random() - 0.5) * 200;
      
      shootingStarRef.current = {
        x: startX,
        y: startY,
        length: Math.random() * 200 + 250, // Length between 250-450px (much longer)
        speed: Math.random() * 1 + 1.5, // Speed between 1.5-2.5 (slower for smoother effect)
        angle: angle,
        opacity: 0,
        progress: 0,
        active: true,
      };
    };

    // Animate
    const animate = () => {
      if (!ctx || !canvas) return;

      const now = Date.now();

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity + twinkle * 0.3;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update shooting star (only one)
      if (shootingStarRef.current?.active) {
        const star = shootingStarRef.current;
        
        // Smooth fade in and out with longer duration
        star.progress += 0.003; // Much slower progress for longer duration
        
        if (star.progress < 0.1) {
          // Fade in
          star.opacity = star.progress / 0.1;
        } else if (star.progress > 0.8) {
          // Fade out
          star.opacity = (1 - star.progress) / 0.2;
        } else {
          star.opacity = 1;
        }

        // Calculate tail end position
        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;

        // Draw the tail with gradient: white center -> yellow -> orange
        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`); // White at head
        gradient.addColorStop(0.2, `rgba(255, 255, 200, ${star.opacity * 0.9})`); // Light yellow
        gradient.addColorStop(0.4, `rgba(255, 220, 100, ${star.opacity * 0.7})`); // Yellow
        gradient.addColorStop(0.6, `rgba(255, 180, 80, ${star.opacity * 0.5})`); // Orange-yellow
        gradient.addColorStop(0.8, `rgba(255, 140, 50, ${star.opacity * 0.3})`); // Orange
        gradient.addColorStop(1, `rgba(255, 100, 30, 0)`); // Deep orange fade out

        // Draw main shooting star trail
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Add intense white glow at the head
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 20);
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.9})`);
        glowGradient.addColorStop(0.3, `rgba(255, 255, 200, ${star.opacity * 0.6})`);
        glowGradient.addColorStop(0.6, `rgba(255, 200, 100, ${star.opacity * 0.3})`);
        glowGradient.addColorStop(1, `rgba(255, 165, 0, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Add secondary glow layer for more impact
        const outerGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 35);
        outerGlow.addColorStop(0, `rgba(255, 220, 150, ${star.opacity * 0.4})`);
        outerGlow.addColorStop(0.5, `rgba(255, 180, 80, ${star.opacity * 0.2})`);
        outerGlow.addColorStop(1, `rgba(255, 140, 50, 0)`);
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 35, 0, Math.PI * 2);
        ctx.fill();

        // Update position smoothly
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Deactivate if animation complete or out of bounds
        if (star.progress >= 1 || star.x > canvas.width + 200 || star.y > canvas.height + 200 || star.x < -200 || star.y < -200) {
          star.active = false;
          lastShootingStarTime.current = now;
        }
      }

      // Create new shooting star after a random delay (8-15 seconds)
      if (!shootingStarRef.current?.active && now - lastShootingStarTime.current > 8000 + Math.random() * 7000) {
        createShootingStar();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: "linear-gradient(to bottom, #000000, #0a0a1a)" }}
    />
  );
}