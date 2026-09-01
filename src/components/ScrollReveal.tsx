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

// Map direction → initial translateX/Y values
const getInitialTransform = (direction: ScrollRevealProps['direction'], distance: number) => {
  switch (direction) {
    case 'up':    return { translateY: distance, translateX: 0, scale: 1 };
    case 'down':  return { translateY: -distance, translateX: 0, scale: 1 };
    case 'left':  return { translateX: distance, translateY: 0, scale: 1 };
    case 'right': return { translateX: -distance, translateY: 0, scale: 1 };
    case 'zoom':  return { translateX: 0, translateY: 0, scale: 0.88 };
    case 'fade':
    default:      return { translateX: 0, translateY: 0, scale: 1 };
  }
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 750,
  distance = 48,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<anime.AnimeInstance | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial = getInitialTransform(direction, distance);

    // Set initial invisible state
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
        opacity: [null, 1],
        translateX: [null, 0],
        translateY: [null, 0],
        scale: [null, 1],
        duration,
        delay,
        easing: 'cubicBezier(0.22, 1, 0.36, 1)',
      });
    };

    const animateOut = () => {
      if (animRef.current) animRef.current.pause();
      animRef.current = anime({
        targets: el,
        opacity: 0,
        translateX: initial.translateX,
        translateY: initial.translateY,
        scale: initial.scale,
        duration: 280,
        easing: 'easeInQuad',
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visibleRef.current) {
          visibleRef.current = true;
          animateIn();
        } else if (!entry.isIntersecting && visibleRef.current) {
          visibleRef.current = false;
          animateOut();
        }
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px 60px 0px',
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
