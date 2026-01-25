# DEXTORA AI - Premium Website Redesign

> A world-class, Awwwards-worthy frontend experience powered by React, Three.js, GSAP, and modern web technologies.

## 🎨 Design Philosophy

**"Intelligent Depth"** — This redesign embodies AI-powered learning through visual storytelling:

- **Neural Architecture**: 3D particle systems representing neural networks and knowledge connections
- **Depth & Dimensionality**: Glass morphism and z-axis animations reflecting layers of learning
- **Fluid Intelligence**: Smooth scroll-driven animations that feel organic and responsive
- **Trust Through Clarity**: Clean typography, generous whitespace, enterprise-grade polish

### Color System

```css
Deep Navy:      #0a0e27  → Depth of knowledge
Electric Blue:  #00d4ff  → Innovation, AI
Soft Cyan:      #22d3ee  → Clarity, focus
Subtle Violet:  #a78bfa  → Creativity, potential
Neon Purple:    #c084fc  → Energy, engagement
```

## 🚀 Tech Stack

- **React 18** - Modern component architecture
- **Vite** - Lightning-fast dev server and build tool
- **Three.js + @react-three/fiber** - 3D graphics and WebGL
- **GSAP + ScrollTrigger** - Advanced scroll animations
- **Lenis** - Buttery smooth scrolling
- **Tailwind CSS** - Utility-first styling
- **Inter Font** - Premium typography

## 📁 Project Structure

```
dextora-website/
├── public/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx        # Fixed nav with glass morphism
│   │   ├── HeroSection.jsx       # 3D neural network hero
│   │   ├── WorkflowSection.jsx   # Scrollytelling 7-step workflow
│   │   ├── ServicesSection.jsx   # Floating 3D glass cards
│   │   ├── StatsSection.jsx      # Animated counters
│   │   ├── PricingSection.jsx    # Pricing tiers
│   │   ├── CTASection.jsx        # Final conversion
│   │   └── Footer.jsx            # Professional footer
│   ├── App.jsx                   # Main app with smooth scroll
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Key Features

### 1. Hero Section
- **Fullscreen 3D Scene**: Animated neural network with particle system
- **Mouse Parallax**: Interactive 3D rotation based on cursor position
- **Auto-rotation**: Gentle continuous rotation via OrbitControls
- **Text Animations**: Depth-based fade-ins with GSAP
- **Scroll Indicator**: Animated bounce effect

### 2. 7-Step Workflow (Scrollytelling)
- **Pinned Section**: Section stays while user scrolls through steps
- **Sequential Reveals**: Each step fades in from the right with 3D transforms
- **Progress Bar**: Fills as user scrolls through workflow
- **Active State**: Current step glows with electric blue
- **Responsive Scrub**: Smooth scroll-linked animations

### 3. Services Section
- **Floating Cards**: 3D glass morphism cards with depth shadows
- **Parallax Movement**: Cards move at different speeds on scroll
- **Hover Effects**: Lift, glow, and gradient overlays
- **Staggered Animations**: Cards appear sequentially

### 4. Stats Section
- **Animated Counters**: Numbers count up when scrolled into view
- **Glass Cards**: Translucent cards with backdrop blur
- **Responsive Grid**: 1/2/3 columns based on screen size

### 5. Pricing Section
- **Three Tiers**: Basic, Premium (highlighted), Elite
- **3D Hover Effects**: Cards lift and glow on hover
- **Popular Badge**: Visual emphasis on recommended plan
- **Feature Lists**: Clear comparison of plan features

### 6. CTA & Footer
- **Multiple CTAs**: Trial, demo, phone call options
- **Contact Info**: Easy access to all contact methods
- **Legal Links**: Terms, privacy, FAQ
- **Brand Reinforcement**: IIM Lucknow × IIT Kanpur

## 🎬 Animation Details

### Scroll Animations (GSAP ScrollTrigger)

```javascript
// Pinned scrollytelling
ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: '+=700%',
  pin: true,
  scrub: 1,
});

// Parallax effects
gsap.to(element, {
  y: -50,
  scrollTrigger: {
    trigger: element,
    scrub: true,
  },
});
```

### 3D Animations (Three.js)

```javascript
// Particle rotation
useFrame(({ clock }) => {
  particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  // Mouse parallax
  particlesRef.current.rotation.y += mousePosition.x * 0.001;
});
```

### Smooth Scroll (Lenis)

```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Customization Guide

### Changing Colors

Edit [tailwind.config.js](tailwind.config.js):

```javascript
colors: {
  'electric-blue': '#00d4ff',  // Change your accent color
  'soft-cyan': '#22d3ee',      // Change secondary accent
  'subtle-violet': '#a78bfa',  // Change tertiary accent
}
```

### Disabling 3D Effects

If you need to disable 3D for performance:

**In [HeroSection.jsx](src/components/HeroSection.jsx):**

```javascript
// Comment out the Canvas component
{/* <Canvas>...</Canvas> */}

// Add a fallback gradient background
<div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 to-subtle-violet/20" />
```

### Adjusting Animation Speed

**GSAP Animations:**
```javascript
duration: 1,  // Increase for slower (1.5, 2), decrease for faster (0.5, 0.3)
```

**Lenis Smooth Scroll:**
```javascript
duration: 1.2,  // Increase for slower scroll (1.5, 2)
```

### Changing Typography

Edit [index.css](src/index.css) or [tailwind.config.js](tailwind.config.js):

```javascript
fontFamily: {
  sans: ['Your Font', 'Inter', 'sans-serif'],
}
```

Import in [index.html](index.html):
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" rel="stylesheet">
```

## ⚡ Performance Optimization

### Current Optimizations

1. **Lazy Loading**: Components render on scroll
2. **RequestAnimationFrame**: 3D animations use RAF
3. **Debounced Scroll**: ScrollTrigger optimizes scroll events
4. **GPU Acceleration**: CSS transforms use `transform3d`
5. **Code Splitting**: Vite handles automatic code splitting

### Additional Optimizations

For even better performance:

```javascript
// Reduce particle count in HeroSection.jsx
const particleCount = 100; // Down from 200

// Disable auto-rotation in OrbitControls
<OrbitControls autoRotate={false} />

// Use lower quality blur
backdrop-blur-md // Instead of backdrop-blur-xl
```

## 📱 Responsive Design

All sections are fully responsive:

- **Mobile**: Single column, simplified animations
- **Tablet**: 2-column grids, medium animations
- **Desktop**: 3-column grids, full animations

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🐛 Troubleshooting

### Issue: 3D scene not rendering

**Solution**: Check browser WebGL support
```javascript
const gl = document.createElement('canvas').getContext('webgl');
if (!gl) {
  console.error('WebGL not supported');
}
```

### Issue: Animations laggy on scroll

**Solution**: Reduce particle count and disable auto-rotate
```javascript
const particleCount = 50; // Reduce from 200
<OrbitControls autoRotate={false} />
```

### Issue: Smooth scroll not working

**Solution**: Check Lenis initialization in [App.jsx](src/App.jsx)
```javascript
// Make sure Lenis is initialized in useEffect
useEffect(() => {
  const lenis = new Lenis({ /* config */ });
  // ...
}, []);
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: WebGL required for 3D features. Fallback to 2D gradients on unsupported browsers.

## 📄 License

© 2024 Dextora AI. All rights reserved.

## 🤝 Credits

- **Design Inspiration**: Apple, Stripe, Awwwards SOTD
- **3D Graphics**: Three.js community
- **Animations**: GSAP by GreenSock
- **Icons**: Emoji (cross-platform)

## 📞 Support

For questions or support:
- **Email**: info@dextora.ai
- **Phone**: +91 84479 34906
- **Location**: IIM Lucknow Campus, Lucknow

---

**Built with 💙 by a senior creative frontend engineer for Dextora AI**
