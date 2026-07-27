clearTimeout(window.__siteFallback);
document.documentElement.classList.remove('js-fallback');
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 760;
const canvas = document.querySelector('#experience');
const progressBar = document.querySelector('.page-progress span');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach((element) => element.classList.add('is-visible'));
});

const updateProgress = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / max));
  progressBar.style.transform = `scaleX(${progress})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
} catch (error) {
  document.documentElement.classList.add('no-webgl');
  console.warn('WebGL unavailable', error);
}

if (renderer) {
  const pixelRatio = () => Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.2 : 1.6);
  renderer.setPixelRatio(pixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050607, 0.052);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, isMobile ? 12.4 : 10.8);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
  keyLight.position.set(4, 5, 7);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x5267b9, 2.8);
  rimLight.position.set(-5, 2, 4);
  scene.add(rimLight);

  const signalLight = new THREE.PointLight(0xff6426, 26, 11, 1.8);
  signalLight.position.set(0, 0, 1.4);
  scene.add(signalLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.46));

  const engine = new THREE.Group();
  engine.position.x = isMobile ? 0 : 2.65;
  scene.add(engine);

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0x11141a,
    metalness: 0.96,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.75
  });

  const sculpture = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.05, 0.32, isMobile ? 150 : 260, 28, 2, 3),
    chrome
  );
  sculpture.rotation.set(0.46, -0.32, 0.12);
  engine.add(sculpture);

  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, isMobile ? 36 : 64, isMobile ? 24 : 44),
    new THREE.MeshPhysicalMaterial({
      color: 0x15191f,
      metalness: 0.1,
      roughness: 0.08,
      transmission: 0.72,
      thickness: 1.4,
      transparent: true,
      opacity: 0.38,
      envMapIntensity: 1.2
    })
  );
  engine.add(glass);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff6426,
    emissive: 0xff3a08,
    emissiveIntensity: 3.4,
    metalness: 0.12,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.04
  });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 4), coreMaterial);
  engine.add(core);

  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x343941,
    metalness: 0.92,
    roughness: 0.2,
    transparent: true,
    opacity: 0.54,
    side: THREE.DoubleSide
  });

  const rings = [2.85, 3.55].map((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 0 ? 0.022 : 0.012, 8, 160),
      ringMaterial.clone()
    );
    ring.rotation.set(Math.PI / 2 + index * 0.42, index * 0.36, index * 0.2);
    engine.add(ring);
    return ring;
  });

  const particleCount = isMobile ? 360 : 820;
  const positions = new Float32Array(particleCount * 3);
  const targets = new Float32Array(particleCount * 3);
  const seeds = new Float32Array(particleCount * 4);

  const seeded = (index, salt) => {
    const value = Math.sin(index * 157.31 + salt * 67.91) * 43758.5453;
    return value - Math.floor(value);
  };

  for (let index = 0; index < particleCount; index += 1) {
    const s0 = seeded(index, 1);
    const s1 = seeded(index, 2);
    const s2 = seeded(index, 3);
    const s3 = seeded(index, 4);
    seeds.set([s0, s1, s2, s3], index * 4);

    const radius = 2.5 + s0 * 2.8;
    const angle = s1 * Math.PI * 2;
    const polar = Math.acos(2 * s2 - 1);
    positions[index * 3] = Math.sin(polar) * Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(polar) * Math.sin(angle) * radius;
    positions[index * 3 + 2] = Math.cos(polar) * radius;
  }
  targets.set(positions);

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(0xbfc4cf) },
      uSize: { value: isMobile ? 1.3 : 1.05 },
      uOpacity: { value: 0.66 }
    },
    vertexShader: `
      uniform float uSize;
      varying float vDepth;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        gl_PointSize = uSize * (110.0 / max(1.0, -viewPosition.z));
        vDepth = clamp(1.0 - (-viewPosition.z / 18.0), 0.25, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vDepth;
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = 1.0 - smoothstep(0.12, 0.5, distanceToCenter);
        gl_FragColor = vec4(uColor, alpha * uOpacity * vDepth);
      }
    `
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  engine.add(particles);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio());
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    isMobile ? 0.22 : 0.32,
    0.62,
    0.9
  );
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const setPoint = (array, index, x, y, z) => {
    array[index * 3] = x;
    array[index * 3 + 1] = y;
    array[index * 3 + 2] = z;
  };

  const buildTarget = (state) => {
    const array = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const t = index / Math.max(1, particleCount - 1);
      const s0 = seeds[index * 4];
      const s1 = seeds[index * 4 + 1];
      const s2 = seeds[index * 4 + 2];

      if (state === 0) {
        const radius = 2.45 + s0 * 2.9;
        const angle = s1 * Math.PI * 2;
        const polar = Math.acos(2 * s2 - 1);
        setPoint(
          array,
          index,
          Math.sin(polar) * Math.cos(angle) * radius,
          Math.sin(polar) * Math.sin(angle) * radius,
          Math.cos(polar) * radius
        );
      } else if (state === 1) {
        const angle = t * Math.PI * 13;
        const radius = 2.2 + Math.sin(t * Math.PI * 5) * 0.55 + (s0 - 0.5) * 0.18;
        setPoint(array, index, Math.cos(angle) * radius, (t - 0.5) * 6.4, Math.sin(angle) * radius * 0.55);
      } else if (state === 2) {
        const ring = index % 5;
        const angle = t * Math.PI * 30 + ring * 0.22;
        const radius = 1.18 + ring * 0.67 + (s0 - 0.5) * 0.08;
        setPoint(array, index, Math.cos(angle) * radius, Math.sin(angle) * radius, (ring - 2) * 0.15);
      } else if (state === 3) {
        const x = (t - 0.5) * 9.5;
        const y = Math.sin(t * Math.PI * 13 + s0 * 0.8) * (0.72 + s1 * 1.1);
        setPoint(array, index, x, y, (s2 - 0.5) * 1.7);
      } else if (state === 4) {
        const columns = Math.ceil(Math.sqrt(particleCount));
        const row = Math.floor(index / columns);
        const column = index % columns;
        setPoint(array, index, (column - columns / 2) * 0.19, (row - columns / 2) * 0.19, Math.sin(index * 0.19) * 0.08);
      } else if (state === 5) {
        const angle = t * Math.PI * 12;
        const radius = 1.75 + Math.sin(t * Math.PI * 6) * 0.9;
        setPoint(array, index, Math.cos(angle) * radius, (t - 0.5) * 6.1, Math.sin(angle) * radius * 0.65);
      } else {
        const ring = index % 3;
        const angle = t * Math.PI * 24 + ring * 0.4;
        const radius = 1.5 + ring * 1.15 + (s0 - 0.5) * 0.1;
        setPoint(array, index, Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 2) * 0.32);
      }
    }
    return array;
  };

  const stateTargets = Array.from({ length: 7 }, (_, state) => buildTarget(state));
  const stateConfig = [
    { core: 0.96, ring: 0.92, bloom: 0.30, color: 0xbfc4cf },
    { core: 0.92, ring: 0.78, bloom: 0.26, color: 0xc4c8d1 },
    { core: 1.12, ring: 1.08, bloom: 0.38, color: 0xff9b73 },
    { core: 0.92, ring: 0.72, bloom: 0.29, color: 0xbcc4d8 },
    { core: 0.78, ring: 0.54, bloom: 0.22, color: 0xaeb4bf },
    { core: 0.88, ring: 0.68, bloom: 0.27, color: 0xc2c6cf },
    { core: 1.05, ring: 0.9, bloom: 0.34, color: 0xffa07b }
  ];

  let activeState = 0;
  let targetState = 0;

  const applyState = (state) => {
    if (state === targetState) return;
    targetState = state;
    targets.set(stateTargets[state]);
    const config = stateConfig[state];
    particleMaterial.uniforms.uColor.value.setHex(config.color);
    activeState = state;
  };

  const sections = [...document.querySelectorAll('.scene')];
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const state = Number(visible.target.dataset.state || 0);
      applyState(state);
    },
    { threshold: [0.3, 0.5, 0.7], rootMargin: '-12% 0px -12% 0px' }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.targetX = event.clientX / window.innerWidth * 2 - 1;
      pointer.targetY = -(event.clientY / window.innerHeight * 2 - 1);
    },
    { passive: true }
  );

  const clock = new THREE.Clock();
  const coreScale = new THREE.Vector3();
  const ringScale = new THREE.Vector3();

  const render = () => {
    const elapsed = clock.getElapsedTime();
    const positionAttribute = particleGeometry.attributes.position;
    const positionArray = positionAttribute.array;

    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3;
      const drift = reducedMotion ? 0 : Math.sin(elapsed * 0.42 + index * 0.031) * 0.003;
      positionArray[offset] += (targets[offset] + drift - positionArray[offset]) * 0.026;
      positionArray[offset + 1] += (targets[offset + 1] - positionArray[offset + 1]) * 0.026;
      positionArray[offset + 2] += (targets[offset + 2] - positionArray[offset + 2]) * 0.026;
    }
    positionAttribute.needsUpdate = true;

    pointer.x += (pointer.targetX - pointer.x) * 0.035;
    pointer.y += (pointer.targetY - pointer.y) * 0.035;

    const config = stateConfig[activeState];
    const desiredX = window.innerWidth < 760 ? 0 : 2.65;
    engine.position.x += (desiredX - engine.position.x) * 0.045;
    engine.rotation.y += (pointer.x * 0.08 - engine.rotation.y) * 0.022;
    engine.rotation.x += (-pointer.y * 0.045 - engine.rotation.x) * 0.022;

    const desiredCoreScale = config.core + (reducedMotion ? 0 : Math.sin(elapsed * 1.6) * 0.015);
    coreScale.set(desiredCoreScale, desiredCoreScale, desiredCoreScale);
    core.scale.lerp(coreScale, 0.045);
    rings.forEach((ring, index) => {
      const scale = config.ring * (1 + index * 0.018);
      ringScale.set(scale, scale, scale);
      ring.scale.lerp(ringScale, 0.045);
      if (!reducedMotion) ring.rotation.z += (index === 0 ? 0.0007 : -0.0005);
    });
    bloom.strength += ((isMobile ? config.bloom * 0.72 : config.bloom) - bloom.strength) * 0.04;

    if (!reducedMotion) {
      sculpture.rotation.z += 0.00065;
      core.rotation.x += 0.0026;
      core.rotation.y -= 0.002;
      signalLight.intensity = 24 + Math.sin(elapsed * 1.9) * 2.5;
    }

    composer.render();
    requestAnimationFrame(render);
  };

  applyState(0);
  requestAnimationFrame(render);

  window.addEventListener('resize', () => {
    renderer.setPixelRatio(pixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(pixelRatio());
    composer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
