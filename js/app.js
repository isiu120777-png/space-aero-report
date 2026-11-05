/**
 * 2026학년도 책만세 최종 보고서
 * 하늘에서 우주로 (Sky to Cosmos)
 * Three.js WebGL 3D 엔진 & Anime.js 비주얼 인터랙션 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initThreeCosmosScene();
  initAnimeVisuals();
  initAmbientAudio();
  initScrollProgress();
  initThemeToggle();
  initFilterTabs();
  initInteractiveDebateVotes();
  initSpectralExplorer();
  initPhotoModal();
  initMobileNav();
});

/* ==========================================================================
   1. Three.js WebGL 3D Cosmic & Stratospheric Interactive Scene
   ========================================================================== */
let threeSceneState = {
  scene: null,
  camera: null,
  renderer: null,
  starField: null,
  nebulaField: null,
  flightStreams: null,
  earthWireframe: null,
  orbitRings: [],
  targetCameraZ: 380,
  targetCameraY: 60,
  targetCameraX: 0,
  mouse: { x: 0, y: 0, targetX: 0, targetY: 0 }
};

function initThreeCosmosScene() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') {
    console.warn('Three.js not loaded or container missing');
    return;
  }

  // Scene & Camera
  const scene = new THREE.Scene();
  threeSceneState.scene = scene;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
  camera.position.set(0, 60, 380);
  threeSceneState.camera = camera;

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);
  threeSceneState.renderer = renderer;

  // 1-A. Deep Space Starfield (3,500 particles with multi-spectrum colors)
  const starCount = 3500;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorPalette = [
    new THREE.Color('#ffffff'), // White
    new THREE.Color('#38bdf8'), // Aero Cyan
    new THREE.Color('#c084fc'), // Astro Purple
    new THREE.Color('#fbbf24')  // Starlight Gold
  ];

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 1600;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 1200;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 1400;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starColors[i3] = chosenColor.r;
    starColors[i3 + 1] = chosenColor.g;
    starColors[i3 + 2] = chosenColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);
  threeSceneState.starField = starField;

  // 1-B. Cosmic Nebula Spiral Vortex (Astronomy motif)
  const nebulaCount = 1200;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPositions = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);
  const nebulaColor1 = new THREE.Color('#9333ea');
  const nebulaColor2 = new THREE.Color('#ec4899');

  for (let i = 0; i < nebulaCount; i++) {
    const i3 = i * 3;
    const r = Math.random() * 280 + 40;
    const theta = Math.random() * Math.PI * 2;
    const spiralOffset = r * 0.05;

    nebulaPositions[i3] = Math.cos(theta + spiralOffset) * r;
    nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 60 + Math.sin(theta) * 20;
    nebulaPositions[i3 + 2] = Math.sin(theta + spiralOffset) * r;

    const mixed = nebulaColor1.clone().lerp(nebulaColor2, Math.random());
    nebulaColors[i3] = mixed.r;
    nebulaColors[i3 + 1] = mixed.g;
    nebulaColors[i3 + 2] = mixed.b;
  }

  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMat = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const nebulaField = new THREE.Points(nebulaGeo, nebulaMat);
  nebulaField.position.set(0, -30, -50);
  scene.add(nebulaField);
  threeSceneState.nebulaField = nebulaField;

  // 1-C. Stratospheric High-Speed Flight Streams (Aviation Jet Streaks)
  const streamCount = 450;
  const streamGeo = new THREE.BufferGeometry();
  const streamPositions = new Float32Array(streamCount * 3);
  const streamVelocities = [];

  for (let i = 0; i < streamCount; i++) {
    const i3 = i * 3;
    streamPositions[i3] = (Math.random() - 0.5) * 800;
    streamPositions[i3 + 1] = Math.random() * 300 - 100;
    streamPositions[i3 + 2] = (Math.random() - 0.5) * 600;

    streamVelocities.push({
      x: (Math.random() * 2 + 1.5) * (Math.random() > 0.5 ? 1 : -1),
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.8
    });
  }

  streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPositions, 3));
  const streamMat = new THREE.PointsMaterial({
    color: 0x00d2ff,
    size: 2.8,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const flightStreams = new THREE.Points(streamGeo, streamMat);
  scene.add(flightStreams);
  threeSceneState.flightStreams = flightStreams;

  // 1-D. Stylized Holographic Celestial Earth & Orbit Rings
  const earthGeo = new THREE.IcosahedronGeometry(75, 2);
  const earthMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const earthWireframe = new THREE.Mesh(earthGeo, earthMat);
  earthWireframe.position.set(0, -40, -100);
  scene.add(earthWireframe);
  threeSceneState.earthWireframe = earthWireframe;

  // Orbital Rings
  const ringGeo1 = new THREE.RingGeometry(110, 111.5, 64);
  const ringMat1 = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35
  });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.8;
  ring1.rotation.y = 0.2;
  earthWireframe.add(ring1);
  threeSceneState.orbitRings.push(ring1);

  const ringGeo2 = new THREE.RingGeometry(135, 136.2, 64);
  const ringMat2 = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = -0.3;
  earthWireframe.add(ring2);
  threeSceneState.orbitRings.push(ring2);

  // Mouse Parallax Listener
  window.addEventListener('mousemove', (e) => {
    threeSceneState.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 80;
    threeSceneState.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 50;
  });

  // Window Resize Listener
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Starfield and Earth
    starField.rotation.y = elapsedTime * 0.02;
    starField.rotation.x = elapsedTime * 0.005;

    nebulaField.rotation.y = -elapsedTime * 0.035;
    nebulaField.rotation.z = Math.sin(elapsedTime * 0.1) * 0.05;

    earthWireframe.rotation.y = elapsedTime * 0.08;
    earthWireframe.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

    ring1.rotation.z = elapsedTime * 0.1;
    ring2.rotation.z = -elapsedTime * 0.08;

    // Animate Flight Streams (Jet velocity)
    const positions = flightStreams.geometry.attributes.position.array;
    for (let i = 0; i < streamCount; i++) {
      const i3 = i * 3;
      positions[i3] += streamVelocities[i].x;
      positions[i3 + 1] += streamVelocities[i].y;
      positions[i3 + 2] += streamVelocities[i].z;

      if (positions[i3] > 500) positions[i3] = -500;
      if (positions[i3] < -500) positions[i3] = 500;
    }
    flightStreams.geometry.attributes.position.needsUpdate = true;

    // Smooth Camera Lerp & Parallax
    threeSceneState.mouse.x += (threeSceneState.mouse.targetX - threeSceneState.mouse.x) * 0.05;
    threeSceneState.mouse.y += (threeSceneState.mouse.targetY - threeSceneState.mouse.y) * 0.05;

    camera.position.x += (threeSceneState.targetCameraX + threeSceneState.mouse.x - camera.position.x) * 0.05;
    camera.position.y += (threeSceneState.targetCameraY - threeSceneState.mouse.y - camera.position.y) * 0.05;
    camera.position.z += (threeSceneState.targetCameraZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, -50);

    renderer.render(scene, camera);
  }
  animate();
}

/**
 * 3D Scene Camera Mode Switcher
 */
window.setThreeCameraMode = function(mode) {
  if (!threeSceneState.camera) return;

  if (mode === 'aero') {
    // Zoom close into the atmospheric flight layer
    threeSceneState.targetCameraZ = 240;
    threeSceneState.targetCameraY = 15;
    threeSceneState.targetCameraX = -50;
    if (threeSceneState.flightStreams) threeSceneState.flightStreams.material.opacity = 1.0;
  } else if (mode === 'astro') {
    // Pull back into the deep galactic cosmos
    threeSceneState.targetCameraZ = 480;
    threeSceneState.targetCameraY = 110;
    threeSceneState.targetCameraX = 60;
    if (threeSceneState.nebulaField) threeSceneState.nebulaField.material.opacity = 0.9;
  } else if (mode === 'convergence') {
    // Nexus angle view
    threeSceneState.targetCameraZ = 320;
    threeSceneState.targetCameraY = 80;
    threeSceneState.targetCameraX = 0;
  } else {
    // Default 'all' panoramic view
    threeSceneState.targetCameraZ = 380;
    threeSceneState.targetCameraY = 60;
    threeSceneState.targetCameraX = 0;
  }
};

/* ==========================================================================
   2. Anime.js Visual Interactions & Micro-Animations
   ========================================================================== */
function initAnimeVisuals() {
  if (typeof anime === 'undefined') {
    console.warn('Anime.js not loaded');
    return;
  }

  // 2-A. Hero Elements Cinematic Stagger Entrance
  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.hero-hud-telemetry',
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 800
    })
    .add({
      targets: '.hero-badge-wrap',
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 700
    }, '-=500')
    .add({
      targets: '.hero-title span',
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1100,
      delay: anime.stagger(150)
    }, '-=400')
    .add({
      targets: '.hero-subtitle',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 900
    }, '-=600')
    .add({
      targets: '.pillar-card',
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      delay: anime.stagger(200)
    }, '-=600');

  // 2-B. Interactive 3D Card Tilt Physics using MouseMove
  const tiltCards = document.querySelectorAll('.pillar-card, .book-feature-card, .debate-card, .member-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      anime({
        targets: card,
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.015,
        duration: 300,
        easing: 'easeOutQuad'
      });
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
      });
    });
  });

  // 2-C. Force Card Staggered Hover Effect
  const forceCards = document.querySelectorAll('.force-card');
  forceCards.forEach(fc => {
    fc.addEventListener('mouseenter', () => {
      anime({
        targets: fc.querySelector('.force-icon'),
        translateY: [-4, -10],
        scale: 1.25,
        duration: 400,
        direction: 'alternate',
        easing: 'easeInOutQuad'
      });
    });
  });
}

/* ==========================================================================
   3. Procedural Web Audio API Ambient Synthesizer (Zero External Assets)
   ========================================================================== */
function initAmbientAudio() {
  const audioBtn = document.getElementById('audio-ambient-btn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let droneOsc1, droneOsc2, droneOsc3;
  let noiseNode, noiseFilter;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startAmbientSound();
      audioBtn.classList.add('active');
      audioBtn.title = '우주 앰비언트 사운드 끄기 (Mute)';
      isPlaying = true;
    } else {
      stopAmbientSound();
      audioBtn.classList.remove('active');
      audioBtn.title = '우주 앰비언트 사운드 켜기 (Play)';
      isPlaying = false;
    }
  });

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 3);
      masterGain.connect(audioCtx.destination);

      // Deep space chords: C2 (65.4Hz), G2 (98.0Hz), E3 (164.8Hz)
      droneOsc1 = audioCtx.createOscillator();
      droneOsc1.type = 'sine';
      droneOsc1.frequency.setValueAtTime(65.4, audioCtx.currentTime);

      droneOsc2 = audioCtx.createOscillator();
      droneOsc2.type = 'triangle';
      droneOsc2.frequency.setValueAtTime(98.0, audioCtx.currentTime);

      droneOsc3 = audioCtx.createOscillator();
      droneOsc3.type = 'sine';
      droneOsc3.frequency.setValueAtTime(164.8, audioCtx.currentTime);

      // Subtle low-pass filter
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, audioCtx.currentTime);

      droneOsc1.connect(filter);
      droneOsc2.connect(filter);
      droneOsc3.connect(filter);
      filter.connect(masterGain);

      droneOsc1.start();
      droneOsc2.start();
      droneOsc3.start();

      // Atmospheric high-altitude wind buffer
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(420, audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(3.0, audioCtx.currentTime);

      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.025, audioCtx.currentTime);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseNode.start();

    } catch (err) {
      console.warn('Web Audio API not supported or user interaction required', err);
    }
  }

  function stopAmbientSound() {
    if (!masterGain || !audioCtx) return;
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
    setTimeout(() => {
      try {
        if (droneOsc1) droneOsc1.stop();
        if (droneOsc2) droneOsc2.stop();
        if (droneOsc3) droneOsc3.stop();
        if (noiseNode) noiseNode.stop();
      } catch {
        // ignore already stopped
      }
    }, 1300);
  }
}

/* ==========================================================================
   4. Top Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   5. Dark / Light Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme-preference') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme-preference', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    toggleBtn.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

/* ==========================================================================
   6. Domain Filter Switcher (Linked to Three.js Camera Swoop)
   ========================================================================== */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections = document.querySelectorAll('section[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Update Three.js 3D Camera Mode
      window.setThreeCameraMode(filter);

      sections.forEach(sec => {
        const secCat = sec.getAttribute('data-category');
        if (filter === 'all' || secCat.includes(filter)) {
          sec.classList.remove('is-hidden');
          if (typeof anime !== 'undefined') {
            anime({
              targets: sec,
              opacity: [0, 1],
              translateY: [25, 0],
              duration: 500,
              easing: 'easeOutCubic'
            });
          }
        } else {
          sec.classList.add('is-hidden');
        }
      });

      // Smooth scroll if specific section selected
      if (filter !== 'all') {
        const targetSection = document.querySelector(`section[data-category*="${filter}"]`);
        if (targetSection) {
          const navOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   7. Interactive Debate Polling (Anime.js Number Counting)
   ========================================================================== */
function initInteractiveDebateVotes() {
  const debateVoteBars = document.querySelectorAll('.vote-interactive-bar');

  debateVoteBars.forEach(bar => {
    const debateId = bar.getAttribute('data-debate-id');
    const proBtn = bar.querySelector('.pro-btn');
    const conBtn = bar.querySelector('.con-btn');
    const statsElem = bar.querySelector('.vote-stats');

    let stats = {
      round1: { pro: 68, con: 32 },
      round2: { pro: 45, con: 55 },
      round3: { pro: 52, con: 48 }
    }[debateId] || { pro: 50, con: 50 };

    const userVote = localStorage.getItem(`debate-vote-${debateId}`);
    if (userVote === 'pro') proBtn.classList.add('voted');
    if (userVote === 'con') conBtn.classList.add('voted');

    function renderStats(animateNumber = false) {
      if (!animateNumber || typeof anime === 'undefined') {
        statsElem.innerHTML = `
          <span style="color: var(--pro-color);">찬성 ${stats.pro}%</span>
          <span style="color: var(--text-dim);">/</span>
          <span style="color: var(--con-color);">반대 ${stats.con}%</span>
        `;
        return;
      }

      // Anime.js counter animation
      const obj = { pro: stats.pro - 5, con: stats.con + 5 };
      anime({
        targets: obj,
        pro: stats.pro,
        con: stats.con,
        round: 1,
        duration: 600,
        easing: 'easeOutQuad',
        update: () => {
          statsElem.innerHTML = `
            <span style="color: var(--pro-color);">찬성 ${obj.pro}%</span>
            <span style="color: var(--text-dim);">/</span>
            <span style="color: var(--con-color);">반대 ${obj.con}%</span>
          `;
        }
      });
    }
    renderStats(false);

    proBtn.addEventListener('click', () => {
      localStorage.setItem(`debate-vote-${debateId}`, 'pro');
      proBtn.classList.add('voted');
      conBtn.classList.remove('voted');
      stats.pro = Math.min(99, stats.pro + 1);
      stats.con = 100 - stats.pro;
      renderStats(true);
    });

    conBtn.addEventListener('click', () => {
      localStorage.setItem(`debate-vote-${debateId}`, 'con');
      conBtn.classList.add('voted');
      proBtn.classList.remove('voted');
      stats.con = Math.min(99, stats.con + 1);
      stats.pro = 100 - stats.con;
      renderStats(true);
    });
  });
}

/* ==========================================================================
   8. Astronomy Spectral Type Interactive Explorer (이시우 학생 후속탐구)
   ========================================================================== */
function initSpectralExplorer() {
  const spectralData = {
    'O': {
      color: '#4fc3f7',
      name: 'O형 (청색 초거성)',
      temp: '30,000K 이상',
      example: '오리온자리 델타 (민타카)',
      desc: '우주에서 가장 뜨겁고 거대한 별. 질량이 태양의 16~100배에 달하며 수명은 수백만 년으로 매우 짧고, 최종적으로 초신성 폭발을 거쳐 블랙홀이나 중성자별이 됩니다.'
    },
    'B': {
      color: '#81d4fa',
      name: 'B형 (청백색 주계열성)',
      temp: '10,000K ~ 30,000K',
      example: '처녀자리 스피카, 플레이아데스 성단',
      desc: '강한 자외선을 방출하며 눈부시게 푸른 빛을 냅니다. 고온의 헬륨 흡수선이 뚜렷하게 관측되며 수명은 1억 년 안팎입니다.'
    },
    'A': {
      color: '#ffffff',
      name: 'A형 (백색 항성)',
      temp: '7,500K ~ 10,000K',
      example: '거문고자리 베가(직녀성), 큰개자리 시리우스',
      desc: '순백색을 띠며 수소 발머 흡수선이 가장 강렬하게 나타납니다. 우리 밤하늘에서 가장 밝게 빛나는 1등성들이 다수 분포합니다.'
    },
    'F': {
      color: '#fff9c4',
      name: 'F형 (황백색 항성)',
      temp: '6,000K ~ 7,500K',
      example: '작은개자리 프로키온, 북극성',
      desc: '태양보다 조금 더 뜨겁고 밝은 별로 이온화된 칼슘 흡수선이 나타나기 시작합니다. 지구형 외계행성 탐사의 주요 후보군입니다.'
    },
    'G': {
      color: '#ffeb3b',
      name: 'G형 (황색 왜성 - 태양형)',
      temp: '5,200K ~ 6,000K',
      example: '우리 태양 (Sun), 센타우루스자리 알파 A',
      desc: '우리 인류가 살고 있는 지구를 품은 태양과 같은 유형입니다. 약 100억 년의 긴 수명을 가지며 적색거성을 거쳐 백색왜성으로 일생을 마칩니다.'
    },
    'K': {
      color: '#ffb74d',
      name: 'K형 (주황색 왜성)',
      temp: '3,700K ~ 5,200K',
      example: '목동자리 아크투루스, 센타우루스자리 알파 B',
      desc: '태양보다 온도가 낮고 주황빛을 발산합니다. 수명이 수백억 년에 달해 안정적인 생명체 서식 가능 구역(Goldilocks zone)을 제공합니다.'
    },
    'M': {
      color: '#e57373',
      name: 'M형 (적색 왜성/적색 초거성)',
      temp: '2,400K ~ 3,700K',
      example: '베텔게우스, 프록시마 센타우리',
      desc: '표면 온도가 낮아 붉은빛을 띱니다. 은하계 별의 약 75% 이상을 차지하는 적색왜성부터, 일생의 마지막 단계에 부풀어 오른 거대한 적색초거성까지 다양합니다.'
    }
  };

  const spectralCards = document.querySelectorAll('.spectral-card');
  const displayBox = document.getElementById('spectral-detail');

  if (!displayBox || spectralCards.length === 0) return;

  spectralCards.forEach(card => {
    card.addEventListener('click', () => {
      spectralCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const type = card.getAttribute('data-type');
      const data = spectralData[type];
      if (data) {
        displayBox.innerHTML = `
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${data.color}; box-shadow:0 0 10px ${data.color};"></span>
            <strong style="font-size:1.05rem; color:var(--text-main);">${data.name}</strong>
            <span style="font-size:0.8rem; background:rgba(255,255,255,0.08); padding:2px 8px; border-radius:4px; font-family:var(--font-mono);">${data.temp}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">
            <strong style="color:var(--text-main);">대표 천체:</strong> ${data.example}
          </div>
          <p style="font-size:0.88rem; color:var(--text-main); line-height:1.6;">${data.desc}</p>
        `;

        if (typeof anime !== 'undefined') {
          anime({
            targets: displayBox,
            opacity: [0.4, 1],
            translateY: [8, 0],
            duration: 350,
            easing: 'easeOutQuad'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   9. Photo Zoom Modal
   ========================================================================== */
function initPhotoModal() {
  const frame = document.querySelector('.photo-frame');
  const modal = document.getElementById('photo-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!frame || !modal) return;

  frame.addEventListener('click', () => {
    modal.classList.add('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

/* ==========================================================================
   10. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  const links = mobileNav.querySelectorAll('a');
  links.forEach(l => {
    l.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}
