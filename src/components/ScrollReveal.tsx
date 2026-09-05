import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom';
  duration?: number;
  distance?: number;
}

// Map direction → initial gentle floating offset
const getInitialTransform = (direction: ScrollRevealProps['direction'], distance: number) => {
  switch (direction) {
    case 'up':    return { translateY: distance, translateX: 0, scale: 1 };
    case 'down':  return { translateY: -distance, translateX: 0, scale: 1 };
    case 'left':  return { translateX: distance, translateY: 0, scale: 1 };
    case 'right': return { translateX: -distance, translateY: 0, scale: 1 };
    case 'zoom':  return { translateX: 0, translateY: 0, scale: 0.96 };
    case 'fade':
    default:      return { translateX: 0, translateY: 0, scale: 1 };
  }
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 950,
  distance = 20,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<anime.AnimeInstance | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial = getInitialTransform(direction, distance);

    // Set initial gentle floating state
    anime.set(el, {
      opacity: 0,
      translateX: initial.translateX,
      translateY: initial.translateY,
      scale: initial.scale,
    });

    const animateIn = () => {
      if (animRef.current) animRef.current.pause();
      animRef.current = anime({
        targets: el,
        opacity: [0, 1],
        translateX: [initial.translateX, 0],
        translateY: [initial.translateY, 0],
        scale: [initial.scale, 1],
        duration,
        delay,
        easing: 'cubicBezier(0.16, 1, 0.3, 1)', // Buttery smooth ease-out deceleration
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          animateIn();
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (animRef.current) animRef.current.pause();
    };
  }, [direction, duration, delay, distance]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};
