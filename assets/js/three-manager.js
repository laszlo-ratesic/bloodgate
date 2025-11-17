/**
 * BLOODGATE THREE.JS MANAGER
 * Epic 3D visual effects inspired by Hearthstone & Elder Scrolls Legends
 * ========================================================================
 */

class BloodgateThreeManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.animationId = null;

    // Particle systems
    this.particleSystems = [];
    this.ambientParticles = [];

    // 3D Card objects
    this.card3DObjects = new Map();

    // Lights
    this.lights = {
      ambient: null,
      directional: null,
      point: [],
      spot: []
    };

    // Animation queues
    this.activeAnimations = [];

    // Performance settings
    this.settings = {
      particleCount: 1000,
      maxParticles: 5000,
      enableShaders: true,
      enablePostProcessing: true,
      quality: 'high' // low, medium, high, ultra
    };
  }

  /**
   * Initialize the Three.js scene and renderer
   */
  init() {
    console.log('🔍 Attempting to initialize Three.js...');
    console.log('🔍 Looking for canvas with id "three-canvas"...');

    this.canvas = document.getElementById('three-canvas');

    if (!this.canvas) {
      console.error('❌ Three.js canvas not found!');
      console.error('🔍 DOM ready state:', document.readyState);
      console.error('🔍 Available elements:', document.querySelectorAll('canvas').length, 'canvas elements found');
      return false;
    }

    console.log('✅ Canvas found!');

    try {
      // Create scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

      // Setup camera
      this.setupCamera();

      // Setup renderer
      this.setupRenderer();

      // Setup lights
      this.setupLights();

      // Create ambient effects
      this.createAmbientParticles();

      // Start animation loop
      this.animate();

      // Handle window resize
      window.addEventListener('resize', () => this.onWindowResize());

      console.log('🎮 Bloodgate 3D Engine initialized successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Three.js:', error);
      return false;
    }
  }

  /**
   * Setup camera with proper perspective
   */
  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 15, 30);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Setup WebGL renderer with anti-aliasing
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  /**
   * Setup dramatic lighting like Hearthstone
   */
  setupLights() {
    // Ambient light for base illumination
    this.lights.ambient = new THREE.AmbientLight(0x404060, 0.4);
    this.scene.add(this.lights.ambient);

    // Main directional light (sun/moon)
    this.lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
    this.lights.directional.position.set(10, 20, 10);
    this.lights.directional.castShadow = true;
    this.lights.directional.shadow.mapSize.width = 2048;
    this.lights.directional.shadow.mapSize.height = 2048;
    this.lights.directional.shadow.camera.near = 0.5;
    this.lights.directional.shadow.camera.far = 500;
    this.scene.add(this.lights.directional);

    // Dramatic rim lights
    const rimLight1 = new THREE.PointLight(0x4488ff, 1.5, 50);
    rimLight1.position.set(-15, 10, 5);
    this.lights.point.push(rimLight1);
    this.scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0xff4444, 1.5, 50);
    rimLight2.position.set(15, 10, 5);
    this.lights.point.push(rimLight2);
    this.scene.add(rimLight2);

    // Atmospheric spot lights
    const spotLight = new THREE.SpotLight(0xffd700, 2);
    spotLight.position.set(0, 30, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 100;
    spotLight.castShadow = true;
    this.lights.spot.push(spotLight);
    this.scene.add(spotLight);
  }

  /**
   * Create ambient floating particles (dust, magic)
   */
  createAmbientParticles() {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      // Random position in visible area
      positions.push(
        (Math.random() - 0.5) * 100,
        Math.random() * 50,
        (Math.random() - 0.5) * 100
      );

      // Color variation (golden, blue, purple magical dust)
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors.push(1, 0.84, 0); // Gold
      } else if (colorChoice < 0.66) {
        colors.push(0.2, 0.5, 1); // Blue
      } else {
        colors.push(0.6, 0.2, 1); // Purple
      }

      sizes.push(Math.random() * 2 + 0.5);

      // Random velocity for floating motion
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.02 + 0.01,
        (Math.random() - 0.5) * 0.02
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData.velocities = velocities;
    this.scene.add(particles);
    this.ambientParticles.push(particles);
  }

  /**
   * Create 3D card mesh for a card element
   */
  create3DCard(cardElement, cardData) {
    const rect = cardElement.getBoundingClientRect();

    // Convert screen coordinates to 3D world coordinates
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;

    // Create card geometry
    const width = 3;
    const height = 4;
    const geometry = new THREE.BoxGeometry(width, height, 0.1, 1, 1, 1);

    // Create material with glow based on rarity
    let glowColor = 0xffffff;
    let emissiveIntensity = 0.2;

    if (cardData.rarity === 'legendary') {
      glowColor = 0xffd700;
      emissiveIntensity = 0.8;
    } else if (cardData.rarity === 'epic') {
      glowColor = 0x9d4edd;
      emissiveIntensity = 0.6;
    } else if (cardData.rarity === 'rare') {
      glowColor = 0x0080ff;
      emissiveIntensity = 0.4;
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: glowColor,
      emissiveIntensity: emissiveIntensity,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9
    });

    const card3D = new THREE.Mesh(geometry, material);
    card3D.position.set(x * 20, y * 15, 0);
    card3D.userData.cardElement = cardElement;
    card3D.userData.cardData = cardData;

    this.scene.add(card3D);
    this.card3DObjects.set(cardElement, card3D);

    // Add glow effect
    this.addCardGlow(card3D, glowColor);

    return card3D;
  }

  /**
   * Add glow effect to 3D card
   */
  addCardGlow(card3D, color) {
    const glowGeometry = new THREE.BoxGeometry(3.2, 4.2, 0.15);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    card3D.add(glow);
  }

  /**
   * Animate card play with epic 3D flip and particles
   */
  playCardAnimation(cardElement, targetPosition) {
    const card3D = this.card3DObjects.get(cardElement);
    if (!card3D) return;

    const duration = 1500;
    const startTime = Date.now();
    const startPos = card3D.position.clone();
    const startRot = card3D.rotation.clone();

    // Target position in 3D space
    const targetRect = targetPosition.getBoundingClientRect();
    const tx = ((targetRect.left + targetRect.width / 2) / window.innerWidth) * 2 - 1;
    const ty = -((targetRect.top + targetRect.height / 2) / window.innerHeight) * 2 + 1;
    const endPos = new THREE.Vector3(tx * 20, ty * 15, 2);

    // Create particle burst
    this.createCardPlayParticles(startPos, card3D.userData.cardData);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);

      // Interpolate position
      card3D.position.lerpVectors(startPos, endPos, eased);

      // Epic flip rotation
      card3D.rotation.y = startRot.y + Math.PI * 2 * eased;
      card3D.rotation.x = Math.sin(eased * Math.PI) * 0.5;

      // Scale effect
      const scale = 1 + Math.sin(eased * Math.PI) * 0.3;
      card3D.scale.set(scale, scale, scale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        card3D.rotation.set(0, 0, 0);
        card3D.scale.set(1, 1, 1);
      }
    };

    animate();
  }

  /**
   * Create particle burst when card is played
   */
  createCardPlayParticles(position, cardData) {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];
    const sizes = [];

    // Determine color based on card type/rarity
    let baseColor = new THREE.Color(0xffd700);
    if (cardData.rarity === 'legendary') {
      baseColor = new THREE.Color(0xffd700);
    } else if (cardData.rarity === 'epic') {
      baseColor = new THREE.Color(0x9d4edd);
    } else if (cardData.rarity === 'rare') {
      baseColor = new THREE.Color(0x0080ff);
    } else {
      baseColor = new THREE.Color(0xffffff);
    }

    for (let i = 0; i < particleCount; i++) {
      positions.push(position.x, position.y, position.z);

      colors.push(baseColor.r, baseColor.g, baseColor.b);

      // Radial velocities
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = Math.random() * 0.5 + 0.3;
      velocities.push(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        (Math.random() - 0.5) * 0.3
      );

      sizes.push(Math.random() * 3 + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      velocities: velocities,
      life: 1.0,
      decay: 0.02
    };

    this.scene.add(particles);
    this.particleSystems.push(particles);
  }

  /**
   * Create attack animation with projectile and impact
   */
  createAttackAnimation(attackerElement, targetElement, damageAmount) {
    const attacker = this.card3DObjects.get(attackerElement);
    const target = this.card3DObjects.get(targetElement);

    if (!attacker || !target) {
      // Fallback to creating temporary 3D objects
      this.createProjectileFromScreen(attackerElement, targetElement, damageAmount);
      return;
    }

    const startPos = attacker.position.clone();
    const endPos = target.position.clone();

    // Create projectile (orb of energy)
    const projectileGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      emissive: 0xff0000,
      emissiveIntensity: 2,
      transparent: true,
      opacity: 0.9
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    projectile.position.copy(startPos);

    // Add glow trail
    const glowGeometry = new THREE.SphereGeometry(0.7, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6666,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    projectile.add(glow);

    this.scene.add(projectile);

    // Animate projectile
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInOutQuad(progress);

      // Interpolate position with arc
      projectile.position.lerpVectors(startPos, endPos, eased);
      projectile.position.y += Math.sin(eased * Math.PI) * 3;

      // Spin projectile
      projectile.rotation.x += 0.2;
      projectile.rotation.y += 0.2;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Impact!
        this.createImpactEffect(endPos, damageAmount);
        this.scene.remove(projectile);

        // Screen shake effect
        this.cameraShake(5, 300);
      }
    };

    animate();
  }

  /**
   * Create projectile from screen coordinates
   */
  createProjectileFromScreen(attackerElement, targetElement, damageAmount) {
    const attackerRect = attackerElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    const startX = ((attackerRect.left + attackerRect.width / 2) / window.innerWidth) * 2 - 1;
    const startY = -((attackerRect.top + attackerRect.height / 2) / window.innerHeight) * 2 + 1;
    const endX = ((targetRect.left + targetRect.width / 2) / window.innerWidth) * 2 - 1;
    const endY = -((targetRect.top + targetRect.height / 2) / window.innerHeight) * 2 + 1;

    const startPos = new THREE.Vector3(startX * 20, startY * 15, 2);
    const endPos = new THREE.Vector3(endX * 20, endY * 15, 2);

    // Create projectile
    const projectileGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      emissive: 0xff0000,
      emissiveIntensity: 2
    });
    const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
    projectile.position.copy(startPos);
    this.scene.add(projectile);

    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInOutQuad(progress);

      projectile.position.lerpVectors(startPos, endPos, eased);
      projectile.position.z += Math.sin(eased * Math.PI) * 2;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.createImpactEffect(endPos, damageAmount);
        this.scene.remove(projectile);
      }
    };

    animate();
  }

  /**
   * Create impact explosion effect
   */
  createImpactEffect(position, intensity = 5) {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
      positions.push(position.x, position.y, position.z);

      // Fire colors (red to orange to yellow)
      const colorRand = Math.random();
      if (colorRand < 0.33) {
        colors.push(1, 0, 0); // Red
      } else if (colorRand < 0.66) {
        colors.push(1, 0.5, 0); // Orange
      } else {
        colors.push(1, 1, 0); // Yellow
      }

      // Explosive velocities
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI - Math.PI / 2;
      const speed = Math.random() * 0.8 + 0.4;

      velocities.push(
        Math.cos(angle) * Math.cos(elevation) * speed,
        Math.sin(elevation) * speed,
        Math.sin(angle) * Math.cos(elevation) * speed
      );

      sizes.push(Math.random() * 4 + 2);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      velocities: velocities,
      life: 1.0,
      decay: 0.03
    };

    this.scene.add(particles);
    this.particleSystems.push(particles);

    // Add flash of light
    const light = new THREE.PointLight(0xff6600, 3, 20);
    light.position.copy(position);
    this.scene.add(light);

    setTimeout(() => {
      this.scene.remove(light);
    }, 200);
  }

  /**
   * Camera shake effect
   */
  cameraShake(intensity = 5, duration = 300) {
    const originalPos = this.camera.position.clone();
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const currentIntensity = intensity * (1 - progress);
        this.camera.position.x = originalPos.x + (Math.random() - 0.5) * currentIntensity * 0.1;
        this.camera.position.y = originalPos.y + (Math.random() - 0.5) * currentIntensity * 0.1;
        requestAnimationFrame(shake);
      } else {
        this.camera.position.copy(originalPos);
      }
    };

    shake();
  }

  /**
   * Create card hover effect (3D lift and glow)
   */
  cardHoverEffect(cardElement, isHovering) {
    const card3D = this.card3DObjects.get(cardElement);
    if (!card3D) return;

    const targetZ = isHovering ? 3 : 0;
    const targetScale = isHovering ? 1.1 : 1.0;
    const duration = 300;
    const startTime = Date.now();
    const startZ = card3D.position.z;
    const startScale = card3D.scale.x;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutQuad(progress);

      card3D.position.z = startZ + (targetZ - startZ) * eased;
      const scale = startScale + (targetScale - startScale) * eased;
      card3D.scale.set(scale, scale, scale);

      // Add rotation tilt
      if (isHovering) {
        card3D.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        card3D.rotation.y = Math.cos(Date.now() * 0.001) * 0.1;
      } else {
        card3D.rotation.x = 0;
        card3D.rotation.y = 0;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Create healing effect (green particles rising)
   */
  createHealingEffect(targetElement, amount) {
    const rect = targetElement.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
    const position = new THREE.Vector3(x * 20, y * 15, 2);

    const particleCount = 30;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const velocities = [];
    const sizes = [];

    for (let i = 0; i < particleCount; i++) {
      positions.push(
        position.x + (Math.random() - 0.5) * 2,
        position.y + (Math.random() - 0.5) * 2,
        position.z
      );

      // Green healing colors
      colors.push(0.2, 1, 0.3);

      // Upward velocities
      velocities.push(
        (Math.random() - 0.5) * 0.1,
        Math.random() * 0.3 + 0.2,
        (Math.random() - 0.5) * 0.1
      );

      sizes.push(Math.random() * 3 + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      velocities: velocities,
      life: 1.0,
      decay: 0.015
    };

    this.scene.add(particles);
    this.particleSystems.push(particles);
  }

  /**
   * Update particle systems
   */
  updateParticleSystems() {
    // Update ambient particles
    for (const ambient of this.ambientParticles) {
      const positions = ambient.geometry.attributes.position.array;
      const velocities = ambient.userData.velocities;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Wrap around
        if (positions[i + 1] > 50) positions[i + 1] = 0;
        if (Math.abs(positions[i]) > 50) positions[i] *= -1;
        if (Math.abs(positions[i + 2]) > 50) positions[i + 2] *= -1;
      }

      ambient.geometry.attributes.position.needsUpdate = true;
    }

    // Update effect particles
    for (let i = this.particleSystems.length - 1; i >= 0; i--) {
      const system = this.particleSystems[i];
      const positions = system.geometry.attributes.position.array;
      const velocities = system.userData.velocities;

      system.userData.life -= system.userData.decay;
      system.material.opacity = system.userData.life;

      for (let j = 0; j < positions.length; j += 3) {
        positions[j] += velocities[j];
        positions[j + 1] += velocities[j + 1];
        positions[j + 2] += velocities[j + 2];

        // Apply gravity
        velocities[j + 1] -= 0.01;
      }

      system.geometry.attributes.position.needsUpdate = true;

      // Remove dead particles
      if (system.userData.life <= 0) {
        this.scene.remove(system);
        this.particleSystems.splice(i, 1);
      }
    }
  }

  /**
   * Update 3D card positions based on DOM elements
   */
  updateCardPositions() {
    for (const [element, card3D] of this.card3DObjects.entries()) {
      if (!document.body.contains(element)) {
        // Card element no longer exists, remove 3D object
        this.scene.remove(card3D);
        this.card3DObjects.delete(element);
        continue;
      }

      const rect = element.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;

      // Smooth follow
      card3D.position.x += (x * 20 - card3D.position.x) * 0.1;
      card3D.position.y += (y * 15 - card3D.position.y) * 0.1;
    }
  }

  /**
   * Animate lighting (pulsing, flickering)
   */
  updateLighting() {
    const time = Date.now() * 0.001;

    // Pulse point lights
    for (let i = 0; i < this.lights.point.length; i++) {
      const light = this.lights.point[i];
      light.intensity = 1.5 + Math.sin(time * 2 + i) * 0.3;
    }

    // Subtle spot light movement
    if (this.lights.spot.length > 0) {
      this.lights.spot[0].position.x = Math.sin(time * 0.5) * 5;
      this.lights.spot[0].position.z = Math.cos(time * 0.5) * 5;
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Update systems
    this.updateParticleSystems();
    this.updateCardPositions();
    this.updateLighting();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Clean up and dispose
   */
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Dispose geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }

  // Easing functions
  easeOutQuad(t) {
    return t * (2 - t);
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

// Global instance - using window to ensure it's truly global
window.bloodgateThree = null;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bloodgateThree = new BloodgateThreeManager();
    console.log('✅ BloodgateThreeManager instance created');
  });
} else {
  window.bloodgateThree = new BloodgateThreeManager();
  console.log('✅ BloodgateThreeManager instance created');
}
