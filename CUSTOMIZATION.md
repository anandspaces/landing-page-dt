# ⚡ Quick Customization Cheat Sheet

## 🎨 1-Minute Color Changes

### Change Primary Accent Color
**File:** [tailwind.config.js](tailwind.config.js)
```javascript
'electric-blue': '#YOUR_COLOR',  // Line 12
```

### Change Background Color
**File:** [tailwind.config.js](tailwind.config.js)
```javascript
'deep-navy': '#YOUR_DARK_COLOR',  // Line 10
```

## 🔧 5-Minute Performance Tweaks

### Reduce 3D Particles (Faster Loading)
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)
```javascript
const particleCount = 100;  // Line 21 (was 200)
```

### Disable Auto-Rotation (Save CPU)
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)
```javascript
<OrbitControls
  autoRotate={false}  // Line 177 (was true)
/>
```

### Faster Animations
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)
```javascript
duration: 0.5,  // Throughout file (was 1 or 1.2)
```

## 📝 Content Updates

### Update Phone Number
**Files to update:**
1. [src/components/Navigation.jsx](src/components/Navigation.jsx) - Line 48
2. [src/components/CTASection.jsx](src/components/CTASection.jsx) - Lines 76, 111
3. [src/components/Footer.jsx](src/components/Footer.jsx) - Line 106

**Search & Replace:** `+91 84479 34906` → `YOUR_PHONE`

### Update Email
**File:** [src/components/Footer.jsx](src/components/Footer.jsx)
```javascript
info@dextora.ai  // Line 110 → YOUR_EMAIL
```

### Update Pricing
**File:** [src/components/PricingSection.jsx](src/components/PricingSection.jsx)
```javascript
price: '₹30,999',  // Line 19 - Basic
price: '₹49,999',  // Line 32 - Premium
price: '₹79,999',  // Line 48 - Elite
```

## 🖼️ Visual Adjustments

### Make Glass Cards More Opaque
**File:** [src/index.css](src/index.css)
```css
.glass-card {
  @apply bg-white/10;  /* Line 42 - was bg-white/5 */
}
```

### Increase Blur Effect
**File:** [src/index.css](src/index.css)
```css
.glass-card {
  @apply backdrop-blur-2xl;  /* Line 42 - was backdrop-blur-xl */
}
```

### Slower Smooth Scroll
**File:** [src/App.jsx](src/App.jsx)
```javascript
duration: 1.8,  // Line 25 (was 1.2)
```

## 🚫 Disable Features

### Completely Remove 3D Scene
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)

**Replace lines 150-168 with:**
```javascript
<div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-subtle-violet/10" />
```

### Disable Smooth Scroll
**File:** [src/App.jsx](src/App.jsx)

**Comment out lines 19-34:**
```javascript
// useEffect(() => {
//   const lenis = new Lenis({ ... });
//   ...
// }, []);
```

### Remove Scroll Animations
**In any component:**
```javascript
// Comment out ScrollTrigger sections
// scrollTrigger: {
//   trigger: element,
//   ...
// },
```

## 📱 Mobile Optimizations

### Hide 3D on Mobile
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)

**Replace line 150 with:**
```javascript
<div className="absolute inset-0 z-0 hidden md:block">
```

Add fallback before it:
```javascript
<div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-electric-blue/10 to-subtle-violet/10" />
```

## 🎯 Quick Fixes

### Animation Too Fast?
```javascript
duration: 1.5,  // Increase from 1
delay: 0.5,     // Add delay
```

### Animation Too Slow?
```javascript
duration: 0.5,  // Decrease from 1
```

### Cards Not Hovering Smoothly?
```css
transition-all duration-500  /* Increase from duration-300 */
```

### Text Too Small?
```javascript
className="text-5xl"  // Increase from text-4xl
```

### Section Too Much Padding?
```css
.section-padding {
  @apply px-6 md:px-12 lg:px-24 py-12 md:py-20;
  /* Was py-20 md:py-32 */
}
```

## 🔍 Debug Mode

### See ScrollTrigger Markers
**File:** [src/components/WorkflowSection.jsx](src/components/WorkflowSection.jsx)
```javascript
ScrollTrigger.create({
  trigger: section,
  markers: true,  // Add this line
  // ...
});
```

### Console Log Scroll Position
**File:** [src/App.jsx](src/App.jsx)
```javascript
lenis.on('scroll', (e) => {
  console.log('Scroll:', e.scroll);  // Add this
  ScrollTrigger.update();
});
```

## 🎨 Typography Changes

### Change Font Family
**File:** [index.html](index.html)
```html
<!-- Replace Google Fonts link -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap">
```

**File:** [tailwind.config.js](tailwind.config.js)
```javascript
fontFamily: {
  sans: ['Poppins', 'sans-serif'],  // Line 20
}
```

### Bigger Headlines
**File:** Any component
```javascript
className="text-7xl md:text-9xl"  // Increase size
```

## 🌈 Gradient Customization

### Hero Gradient Text
**File:** [src/components/HeroSection.jsx](src/components/HeroSection.jsx)
```javascript
// Change gradient colors in className
className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
```

### Button Gradient
**File:** [src/index.css](src/index.css)
```css
.btn-primary {
  @apply bg-gradient-to-r from-pink-500 to-purple-600;
}
```

## 💾 Save Your Changes

```bash
# After making changes, test locally
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🆘 Emergency Rollback

If something breaks:

```bash
# Revert a file to original
git checkout -- src/components/HeroSection.jsx

# Or restore all changes
git reset --hard HEAD
```

## 📞 Need Help?

Common issues and solutions:

**White screen?** → Check browser console (F12)
**Slow performance?** → Reduce particleCount to 50
**Animations not working?** → Check GSAP import
**3D not rendering?** → Check WebGL support

---

**Pro Tip:** Make one change at a time and test before continuing!
