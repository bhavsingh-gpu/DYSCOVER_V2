import React, { useEffect, useRef } from "react";

const ShootingStars = () => {
    const canvasRef = useRef(null);
    const shootingStarRef = useRef(null);
    const animationFrameRef = useRef();
    const lastShootingStarTime = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createShootingStar = () => {
            if (shootingStarRef.current?.active) return;

            const angleVariation = Math.random() * Math.PI - Math.PI / 4;
            const angle = angleVariation;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const distanceFromCenter = 400 + Math.random() * 300;

            const startX = centerX - Math.cos(angle) * distanceFromCenter + (Math.random() - 0.5) * 200;
            const startY = centerY - Math.sin(angle) * distanceFromCenter + (Math.random() - 0.5) * 200;

            shootingStarRef.current = {
                x: startX,
                y: startY,
                length: Math.random() * 200 + 250,
                speed: Math.random() * 1.5 + 2,
                angle: angle,
                opacity: 0,
                progress: 0,
                active: true,
            };
        };

        const animate = () => {
            if (!ctx || !canvas) return;

            const now = Date.now();

            // Clear canvas for transparency (Overlay mode)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw and update shooting star
            if (shootingStarRef.current?.active) {
                const star = shootingStarRef.current;

                star.progress += 0.005; // Slightly faster for responsiveness

                if (star.progress < 0.1) {
                    star.opacity = star.progress / 0.1;
                } else if (star.progress > 0.8) {
                    star.opacity = (1 - star.progress) / 0.2;
                } else {
                    star.opacity = 1;
                }

                const endX = star.x - Math.cos(star.angle) * star.length;
                const endY = star.y - Math.sin(star.angle) * star.length;

                const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
                gradient.addColorStop(0.2, `rgba(255, 255, 200, ${star.opacity * 0.9})`);
                gradient.addColorStop(0.4, `rgba(255, 220, 100, ${star.opacity * 0.7})`);
                gradient.addColorStop(0.6, `rgba(255, 180, 80, ${star.opacity * 0.5})`);
                gradient.addColorStop(0.8, `rgba(255, 140, 50, ${star.opacity * 0.3})`);
                gradient.addColorStop(1, `rgba(255, 100, 30, 0)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Glow
                const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.9})`);
                glowGradient.addColorStop(1, `rgba(255, 165, 0, 0)`);
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(star.x, star.y, 15, 0, Math.PI * 2);
                ctx.fill();

                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;

                if (star.progress >= 1 || star.x > canvas.width + 300 || star.y > canvas.height + 300 || star.x < -300 || star.y < -300) {
                    star.active = false;
                    lastShootingStarTime.current = now;
                }
            }

            if (!shootingStarRef.current?.active && now - lastShootingStarTime.current > 5000 + Math.random() * 10000) {
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
            className="pointer-events-none fixed inset-0 z-[5] w-full h-full"
        />
    );
};

export default ShootingStars;
