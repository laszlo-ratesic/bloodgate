/**
 * BLOODGATE PREMIUM VISUAL EFFECTS MANAGER
 * AAA-Quality TCG Visual Effects System
 * Inspired by Hearthstone, Legends of Runeterra, and Magic: The Gathering Arena
 * ============================================================================
 */

class PremiumEffectsManager {
  constructor() {
    this.draggables = [];
    this.particleTrails = [];
    this.glowElements = new Map();
    this.isInitialized = false;

    // Effect settings
    this.settings = {
      enableDragDrop: true,
      enableParticleTrails: true,
      enableGlowEffects: true,
      enableHoverAnimations: true,
      particleQuality: 'high', // low, medium, high, ultra
      audioVisualFeedback: true
    };

    // Particle trail canvas
    this.trailCanvas = null;
    this.trailCtx = null;
    this.activeTrails = [];
  }

  /**
   * Initialize the premium effects system
   */
  init() {
    console.log('🎨 Initializing Premium Visual Effects Manager...');

    // Create particle trail canvas
    this.createTrailCanvas();

    // Initialize glow system
    this.initGlowSystem();

    // Start animation loop
    this.animate();

    this.isInitialized = true;
    console.log('✅ Premium Effects Manager initialized!');
  }

  /**
   * Create canvas for particle trails
   */
  createTrailCanvas() {
    this.trailCanvas = document.createElement('canvas');
    this.trailCanvas.id = 'particle-trail-canvas';
    this.trailCanvas.width = window.innerWidth;
    this.trailCanvas.height = window.innerHeight;
    this.trailCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;

    this.trailCtx = this.trailCanvas.getContext('2d');
    document.body.appendChild(this.trailCanvas);

    // Handle resize
    window.addEventListener('resize', () => {
      this.trailCanvas.width = window.innerWidth;
      this.trailCanvas.height = window.innerHeight;
    });
  }

  /**
   * Initialize advanced glow system
   */
  initGlowSystem() {
    // Create a style element for dynamic glow effects
    const style = document.createElement('style');
    style.id = 'premium-glow-styles';
    style.textContent = `
      .premium-glow-legendary {
        animation: premiumLegendaryGlow 2s ease-in-out infinite;
        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)) brightness(1.2);
      }

      .premium-glow-epic {
        animation: premiumEpicGlow 2s ease-in-out infinite;
        filter: drop-shadow(0 0 15px rgba(157, 78, 221, 0.9)) brightness(1.15);
      }

      .premium-glow-rare {
        animation: premiumRareGlow 2s ease-in-out infinite;
        filter: drop-shadow(0 0 12px rgba(0, 128, 255, 0.9)) brightness(1.1);
      }

      .premium-glow-hover {
        filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1))
                drop-shadow(0 0 50px rgba(255, 215, 0, 0.6))
                brightness(1.3) saturate(1.2);
        transform: translateY(-10px) scale(1.05);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .premium-card-dragging {
        filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.8))
                drop-shadow(0 0 30px rgba(255, 215, 0, 1))
                brightness(1.4) saturate(1.3);
        transform: rotate(5deg) scale(1.15);
        transition: transform 0.1s ease-out;
        z-index: 10000 !important;
        cursor: grabbing !important;
      }

      .premium-drop-zone-active {
        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
        border: 3px dashed rgba(255, 215, 0, 0.8);
        animation: premiumDropZonePulse 1s ease-in-out infinite;
      }

      @keyframes premiumLegendaryGlow {
        0%, 100% {
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)) brightness(1.2);
        }
        50% {
          filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1))
                  drop-shadow(0 0 60px rgba(255, 215, 0, 0.7))
                  brightness(1.4);
        }
      }

      @keyframes premiumEpicGlow {
        0%, 100% {
          filter: drop-shadow(0 0 15px rgba(157, 78, 221, 0.9)) brightness(1.15);
        }
        50% {
          filter: drop-shadow(0 0 30px rgba(157, 78, 221, 1)) brightness(1.3);
        }
      }

      @keyframes premiumRareGlow {
        0%, 100% {
          filter: drop-shadow(0 0 12px rgba(0, 128, 255, 0.9)) brightness(1.1);
        }
        50% {
          filter: drop-shadow(0 0 25px rgba(0, 128, 255, 1)) brightness(1.2);
        }
      }

      @keyframes premiumDropZonePulse {
        0%, 100% {
          border-color: rgba(255, 215, 0, 0.8);
          background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
        }
        50% {
          border-color: rgba(255, 215, 0, 1);
          background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
        }
      }

      .premium-card-flip {
        animation: premiumCardFlip 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      @keyframes premiumCardFlip {
        0% {
          transform: rotateY(0deg) scale(1);
        }
        50% {
          transform: rotateY(90deg) scale(1.1);
        }
        100% {
          transform: rotateY(0deg) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Enable drag and drop for a card element with premium effects
   */
  enableCardDragDrop(cardElement, options = {}) {
    if (!this.settings.enableDragDrop) return;

    const defaults = {
      dropZones: ['#player-field', '#no-mans-land'],
      onDragStart: null,
      onDrag: null,
      onDragEnd: null,
      onDrop: null,
      snapOnDrop: true,
      returnOnInvalidDrop: true,
      particleColor: 'gold',
      glowIntensity: 'high'
    };

    const config = { ...defaults, ...options };

    // Create GSAP Draggable instance
    const draggable = Draggable.create(cardElement, {
      type: 'x,y',
      bounds: document.body,
      edgeResistance: 0.65,
      cursor: 'grab',
      zIndexBoost: true,

      onDragStart: (e) => {
        this.onCardDragStart(cardElement, config);
        if (config.onDragStart) config.onDragStart(e);
      },

      onDrag: (e) => {
        this.onCardDrag(cardElement, config);
        if (config.onDrag) config.onDrag(e);
      },

      onDragEnd: (e) => {
        this.onCardDragEnd(cardElement, config);
        if (config.onDragEnd) config.onDragEnd(e);
      }
    })[0];

    this.draggables.push({ element: cardElement, draggable, config });

    // Enhanced hover effects
    this.addPremiumHoverEffects(cardElement);
  }

  /**
   * Handle drag start with amazing effects
   */
  onCardDragStart(cardElement, config) {
    // Add dragging class
    cardElement.classList.add('premium-card-dragging');

    // Create pickup burst effect
    this.createPickupBurst(cardElement, config.particleColor);

    // Highlight valid drop zones
    config.dropZones.forEach(zone => {
      const zoneEl = document.querySelector(zone);
      if (zoneEl) {
        zoneEl.classList.add('premium-drop-zone-active');
      }
    });

    // Anime.js scale animation
    anime({
      targets: cardElement,
      scale: [1, 1.15],
      duration: 200,
      easing: 'easeOutElastic(1, .8)'
    });

    // Three.js effect
    if (window.bloodgateThree && window.bloodgateThree.scene) {
      window.bloodgateThree.cardHoverEffect(cardElement, true);
    }

    // Visual feedback pulse
    this.createFeedbackPulse(cardElement, config.particleColor);
  }

  /**
   * Handle drag with continuous effects
   */
  onCardDrag(cardElement, config) {
    if (!this.settings.enableParticleTrails) return;

    // Get card position
    const rect = cardElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Create particle trail
    this.createDragTrail(x, y, config.particleColor);

    // Check if over drop zone
    config.dropZones.forEach(zone => {
      const zoneEl = document.querySelector(zone);
      if (zoneEl && this.isOverElement(cardElement, zoneEl)) {
        // Intensify drop zone glow
        zoneEl.style.transform = 'scale(1.02)';
      } else if (zoneEl) {
        zoneEl.style.transform = 'scale(1)';
      }
    });
  }

  /**
   * Handle drag end with impact effects
   */
  onCardDragEnd(cardElement, config) {
    // Remove dragging class
    cardElement.classList.remove('premium-card-dragging');

    // Remove drop zone highlights
    config.dropZones.forEach(zone => {
      const zoneEl = document.querySelector(zone);
      if (zoneEl) {
        zoneEl.classList.remove('premium-drop-zone-active');
        zoneEl.style.transform = 'scale(1)';
      }
    });

    // Check if dropped in valid zone
    let droppedInZone = false;
    config.dropZones.forEach(zone => {
      const zoneEl = document.querySelector(zone);
      if (zoneEl && this.isOverElement(cardElement, zoneEl)) {
        droppedInZone = true;
        this.createDropImpact(cardElement, config.particleColor);

        if (config.onDrop) {
          config.onDrop(cardElement, zoneEl);
        }
      }
    });

    // Return animation if not dropped in valid zone
    if (!droppedInZone && config.returnOnInvalidDrop) {
      anime({
        targets: cardElement,
        translateX: 0,
        translateY: 0,
        scale: 1,
        rotate: 0,
        duration: 500,
        easing: 'easeOutElastic(1, .6)'
      });
    }

    // Reset Three.js effect
    if (window.bloodgateThree && window.bloodgateThree.scene) {
      window.bloodgateThree.cardHoverEffect(cardElement, false);
    }
  }

  /**
   * Create pickup burst effect
   */
  createPickupBurst(element, color = 'gold') {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${this.getColorFromName(color)};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        box-shadow: 0 0 10px ${this.getColorFromName(color)};
      `;
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 100 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      anime({
        targets: particle,
        translateX: tx,
        translateY: ty,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600 + Math.random() * 400,
        easing: 'easeOutQuad',
        complete: () => particle.remove()
      });
    }

    // Three.js burst effect
    if (window.bloodgateThree && window.bloodgateThree.scene) {
      const position = new THREE.Vector3(
        ((centerX / window.innerWidth) * 2 - 1) * 20,
        -((centerY / window.innerHeight) * 2 - 1) * 15,
        2
      );
      window.bloodgateThree.createCardPlayParticles(position, { rarity: color });
    }
  }

  /**
   * Create drag trail particles
   */
  createDragTrail(x, y, color = 'gold') {
    // Canvas-based trail for performance
    if (this.activeTrails.length > 50) {
      this.activeTrails.shift();
    }

    this.activeTrails.push({
      x,
      y,
      life: 1.0,
      color: this.getColorFromName(color),
      size: 8 + Math.random() * 4
    });
  }

  /**
   * Create drop impact effect
   */
  createDropImpact(element, color = 'gold') {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Impact ripple
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 10px;
      height: 10px;
      border: 3px solid ${this.getColorFromName(color)};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 20px ${this.getColorFromName(color)};
    `;
    document.body.appendChild(ripple);

    anime({
      targets: ripple,
      width: 200,
      height: 200,
      opacity: [1, 0],
      duration: 600,
      easing: 'easeOutQuad',
      complete: () => ripple.remove()
    });

    // Impact particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${this.getColorFromName(color)};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        box-shadow: 0 0 8px ${this.getColorFromName(color)};
      `;
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance + 50; // Gravity effect

      anime({
        targets: particle,
        translateX: tx,
        translateY: ty,
        scale: [1.5, 0],
        opacity: [1, 0],
        duration: 800 + Math.random() * 400,
        easing: 'easeOutCubic',
        complete: () => particle.remove()
      });
    }

    // Screen flash
    this.createScreenFlash(color, 0.15);

    // Camera shake (Three.js)
    if (window.bloodgateThree && window.bloodgateThree.scene) {
      window.bloodgateThree.cameraShake(3, 200);
    }
  }

  /**
   * Create feedback pulse
   */
  createFeedbackPulse(element, color = 'gold') {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pulse = document.createElement('div');
    pulse.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      width: 20px;
      height: 20px;
      border: 2px solid ${this.getColorFromName(color)};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(pulse);

    anime({
      targets: pulse,
      width: 150,
      height: 150,
      opacity: [0.8, 0],
      duration: 400,
      easing: 'easeOutQuad',
      complete: () => pulse.remove()
    });
  }

  /**
   * Create screen flash effect
   */
  createScreenFlash(color = 'gold', intensity = 0.2) {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.getColorFromName(color)};
      opacity: 0;
      pointer-events: none;
      z-index: 9997;
    `;
    document.body.appendChild(flash);

    anime({
      targets: flash,
      opacity: [0, intensity, 0],
      duration: 300,
      easing: 'easeInOutQuad',
      complete: () => flash.remove()
    });
  }

  /**
   * Add premium hover effects to card
   */
  addPremiumHoverEffects(cardElement) {
    if (!this.settings.enableHoverAnimations) return;

    cardElement.addEventListener('mouseenter', () => {
      // Anime.js hover animation
      anime({
        targets: cardElement,
        translateY: -10,
        scale: 1.05,
        duration: 300,
        easing: 'easeOutElastic(1, .8)'
      });

      // Add premium glow
      cardElement.classList.add('premium-glow-hover');

      // Create hover sparkles
      this.createHoverSparkles(cardElement);
    });

    cardElement.addEventListener('mouseleave', () => {
      // Reset animation
      anime({
        targets: cardElement,
        translateY: 0,
        scale: 1,
        duration: 300,
        easing: 'easeOutElastic(1, .8)'
      });

      // Remove premium glow
      cardElement.classList.remove('premium-glow-hover');
    });
  }

  /**
   * Create hover sparkles
   */
  createHoverSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;

      sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
      `;
      document.body.appendChild(sparkle);

      anime({
        targets: sparkle,
        translateY: -30 - Math.random() * 20,
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600 + Math.random() * 400,
        easing: 'easeOutQuad',
        complete: () => sparkle.remove()
      });
    }
  }

  /**
   * Check if element is over another element
   */
  isOverElement(draggedEl, targetEl) {
    const dragRect = draggedEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const dragCenterX = dragRect.left + dragRect.width / 2;
    const dragCenterY = dragRect.top + dragRect.height / 2;

    return (
      dragCenterX >= targetRect.left &&
      dragCenterX <= targetRect.right &&
      dragCenterY >= targetRect.top &&
      dragCenterY <= targetRect.bottom
    );
  }

  /**
   * Get color from name
   */
  getColorFromName(name) {
    const colors = {
      gold: '#FFD700',
      legendary: '#FFD700',
      epic: '#9D4EDD',
      rare: '#0080FF',
      common: '#FFFFFF',
      red: '#FF0000',
      blue: '#0000FF',
      green: '#00FF00',
      purple: '#9D4EDD'
    };
    return colors[name] || colors.gold;
  }

  /**
   * Main animation loop
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.trailCtx) return;

    // Clear canvas with fade effect
    this.trailCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.trailCtx.fillRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

    // Draw and update trails
    for (let i = this.activeTrails.length - 1; i >= 0; i--) {
      const trail = this.activeTrails[i];

      this.trailCtx.save();
      this.trailCtx.globalAlpha = trail.life;
      this.trailCtx.fillStyle = trail.color;
      this.trailCtx.shadowBlur = 15;
      this.trailCtx.shadowColor = trail.color;
      this.trailCtx.beginPath();
      this.trailCtx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
      this.trailCtx.fill();
      this.trailCtx.restore();

      trail.life -= 0.02;
      trail.size *= 0.95;

      if (trail.life <= 0) {
        this.activeTrails.splice(i, 1);
      }
    }
  }

  /**
   * Create epic card play animation
   */
  epicCardPlayAnimation(cardElement, targetElement) {
    const timeline = anime.timeline({
      easing: 'easeOutExpo'
    });

    timeline
      .add({
        targets: cardElement,
        scale: [1, 1.3],
        rotateY: [0, 180],
        duration: 400
      })
      .add({
        targets: cardElement,
        translateX: () => {
          const targetRect = targetElement.getBoundingClientRect();
          const cardRect = cardElement.getBoundingClientRect();
          return targetRect.left - cardRect.left;
        },
        translateY: () => {
          const targetRect = targetElement.getBoundingClientRect();
          const cardRect = cardElement.getBoundingClientRect();
          return targetRect.top - cardRect.top;
        },
        rotateY: [180, 360],
        scale: [1.3, 1],
        duration: 600
      });

    // Create particle trail during animation
    const interval = setInterval(() => {
      const rect = cardElement.getBoundingClientRect();
      this.createDragTrail(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        'gold'
      );
    }, 16);

    setTimeout(() => clearInterval(interval), 1000);
  }

  /**
   * Cleanup
   */
  dispose() {
    // Remove trail canvas
    if (this.trailCanvas) {
      this.trailCanvas.remove();
    }

    // Destroy all draggables
    this.draggables.forEach(({ draggable }) => {
      if (draggable && draggable.kill) {
        draggable.kill();
      }
    });

    this.draggables = [];
    this.activeTrails = [];
  }
}

// Global instance
window.premiumEffects = null;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.premiumEffects = new PremiumEffectsManager();
    console.log('✅ Premium Effects Manager instance created');
  });
} else {
  window.premiumEffects = new PremiumEffectsManager();
  console.log('✅ Premium Effects Manager instance created');
}
