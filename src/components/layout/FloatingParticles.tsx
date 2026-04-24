"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface FloatingParticlesProps {
  type: 'honey' | 'fruits' | 'spices';
}

const getParticles = (type: string) => {
  if (type === 'honey') return ['🐝', '🍯', '🌼', '🐝', '✨'];
  if (type === 'fruits') return ['🥭', '🍃', '🥭', '🌿', '✨'];
  if (type === 'spices') return ['🌶️', '✨', '🍂', '🌰', '✨'];
  return [];
};

export function FloatingParticles({ type }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const ctx = gsap.context(() => {
      const particles = gsap.utils.toArray('.parallax-particle') as HTMLElement[];

      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        particles.forEach((particle, i) => {
          const speed = (i + 1) * 35; // Increased speed for high reactivity
          gsap.to(particle, {
            x: -x * speed,
            y: -y * speed,
            duration: 1.5,
            ease: 'power2.out',
          });
        });
      };

      // Random slow floating using GSAP
      particles.forEach((particle) => {
        gsap.to(particle, {
          y: '+=30',
          x: '+=25',
          duration: "random(2, 4)",
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: "random(0, 2)"
        });
      });

      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  const particles = getParticles(type);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((icon, i) => {
        const top = `${(i * 17) % 80 + 10}%`;
        const left = `${(i * 23) % 80 + 10}%`;
        const size = (i % 3) * 0.5 + 1.5; // Bigger: 2.5rem to 3.5rem

        return (
          <div
            key={i}
            className="parallax-particle absolute opacity-60 drop-shadow-lg filter blur-[0.75px]"
            style={{
              top,
              left,
              fontSize: `${size}rem`,
            }}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
}
