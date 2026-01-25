import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes scroll-bound animations for hero, services, and vision sections.
 * All timelines use pin + scrub to keep motion tied to scroll position.
 */
export default function initScrollAnimations({ heroRef, servicesRef, visionRef }) {
  const triggers = [];

  // Hero: keep completely static and visible
  // No animations - just display the content
  if (heroRef?.current) {
    gsap.set('.hero-title, .hero-sub, .hero-cta, .hero-metrics', {
      opacity: 1,
      y: 0,
    });
  }

  // Services: keep visible until scroll, then animate
  if (servicesRef?.current) {
    // Make sure elements are visible by default
    gsap.set('.section-label, .services-copy p, .services-copy div span', {
      opacity: 1,
      y: 0,
      immediateRender: true,
    });

    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesRef.current,
        start: 'top 80%',
        end: 'top top',
        scrub: true,
      },
    });

    servicesTl.to('.services-copy', { y: -40, opacity: 0.8 }, 0);

    triggers.push(servicesTl);
  }

  // Vision: keep visible until scroll, then animate
  if (visionRef?.current) {
    // Make sure elements are visible by default
    gsap.set('.vision-title, .vision-body, .vision-body + div > div', {
      opacity: 1,
      y: 0,
      immediateRender: true,
    });

    const visionTl = gsap.timeline({
      scrollTrigger: {
        trigger: visionRef.current,
        start: 'top 80%',
        end: 'top top',
        scrub: true,
      },
    });

    visionTl.to('.vision-title, .vision-body', { y: -30, opacity: 0.85 }, 0);

    triggers.push(visionTl);
  }

  // Cleanup
  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    triggers.forEach((tl) => tl.kill());
  };
}
