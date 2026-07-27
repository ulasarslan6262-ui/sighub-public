import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#experience');
const mobile = innerWidth < 720;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (error) {
  document.documentElement.classList.add('no-webgl');
  console.warn('WebGL unavailable', error);
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050607, 0.055);
  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, mobile ? 11.8 : 10.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 3.3);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3859ff, 5.5);
  rim.position.set(-5, 1, 3);
  scene.add(rim);
  const orangeLight = new THREE.PointLight(0xff5a1f, 38, 12, 1.7);
  orangeLight.position.set(0, 0, 1.2);
  scene.add(orangeLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const engine = new THREE.Group();
  engine.position.x = mobile ? 0 : 2.55;
  scene.add(engine);

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0x111318,
    metalness: 0.96,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.8,
    transparent: true,
    opacity: 1
  });
  const shell = new THREE.Mesh(new THREE.TorusKnotGeometry(2.15, 0.38, mobile ? 180 : 320, 32, 2, 3), chrome);
  shell.rotation.set(0.48, -0.32, 0.15);
  engine.add(shell);

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.17, 0.405, mobile ? 150 : 260, 18, 2, 3),
    new THREE.MeshBasicMaterial({ color: 0xff5a1f, wireframe: true, transparent: true, opacity: 0.13 })
  );
  wire.rotation.copy(shell.rotation);
  engine.add(wire);

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff5a1f,
    emissive: 0xff2e00,
    emissiveIntensity: 4.7,
    metalness: 0.1,
    roughness: 0.18,
    transmission: 0.12,
    thickness: 1.2,
    clearcoat: 1
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 5), coreMaterial);
  engine.add(core);

  const ringMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x252a34,
    metalness: 0.92,
    roughness: 0.2,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide
  });
  const rings = [2.9, 3.55, 4.25].map((radius, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, index === 0 ? 0.025 : 0.014, 8, 180), ringMaterial.clone());
    ring.rotation.set(Math.PI / 2 + index * 0.37, index * 0.45, index * 0.22);
    engine.add(ring);
    return ring;
  });

  const shardMaterial = new THREE.MeshPhysicalMaterial({ color: 0x20242c, metalness: 0.88, roughness: 0.22, flatShading: true });
  const shards = Array.from({ length: 9 }, (_, i) => {
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.18 + (i % 3) * 0.05, 0), shardMaterial.clone());
    const angle = i / 9 * Math.PI * 2;
    shard.position.set(Math.cos(angle) * (3.1 + (i % 2) * 0.8), Math.sin(angle) * (2.2 + (i % 3) * 0.4), (i % 3 - 1) * 0.45);
    shard.rotation.set(i, i * 0.4, i * 0.7);
    engine.add(shard);
    return shard;
  });

  const COUNT = mobile ? 720 : 1550;
  const positions = new Float32Array(COUNT * 3);
  const targets = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    const r = 2.8 + Math.random() * 3.7;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = Math.sin(b) * Math.cos(a) * r;
    positions[i * 3 + 1] = Math.sin(b) * Math.sin(a) * r;
    positions[i * 3 + 2] = Math.cos(b) * r;
    targets.set(positions.subarray(i * 3, i * 3 + 3), i * 3);
    seeds.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xbfc5d2,
    size: mobile ? 0.025 : 0.019,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particlesGeometry, particleMaterial);
  engine.add(particles);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mobile ? 0.42 : 0.66, 0.65, 0.84);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const stateTargets = [];
  const setPoint = (arr, i, x, y, z) => {
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  };
  const buildTargets = (state) => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const s0 = seeds[i * 4], s1 = seeds[i * 4 + 1], s2 = seeds[i * 4 + 2];
      if (state === 0) {
        const r = 2.4 + s0 * 4.2;
        const a = s1 * Math.PI * 2;
        const b = Math.acos(2 * s2 - 1);
        setPoint(arr, i, Math.sin(b) * Math.cos(a) * r, Math.sin(b) * Math.sin(a) * r, Math.cos(b) * r);
      } else if (state === 1) {
        const a = t * Math.PI * 14;
        const r = 1.8 + t * 3.1 + (s0 - .5) * .35;
        setPoint(arr, i, Math.cos(a) * r, (t - .5) * 7.4, Math.sin(a) * r * .55);
      } else if (state === 2) {
        const ring = i % 6;
        const a = t * Math.PI * 34 + ring * .2;
        const r = 1.1 + ring * .63 + (s0 - .5) * .12;
        setPoint(arr, i, Math.cos(a) * r, Math.sin(a) * r, (ring - 2.5) * .16);
      } else if (state === 3) {
        const x = (t - .5) * 12;
        const amp = 1.0 + s0 * 1.9;
        setPoint(arr, i, x, Math.sin(t * Math.PI * 18 + s1 * 1.5) * amp, (s2 - .5) * 2.4);
      } else if (state === 4) {
        const branch = i % 7;
        const p = (i / 7) / Math.ceil(COUNT / 7);
        const a = branch / 7 * Math.PI * 2 + p * 1.4;
        const r = 0.8 + p * 5.2;
        setPoint(arr, i, Math.cos(a) * r, (p - .5) * 8 + Math.sin(a * 2) * .4, Math.sin(a) * r * .5);
      } else if (state === 5) {
        const cols = Math.ceil(Math.sqrt(COUNT));
        const row = Math.floor(i / cols);
        const col = i % cols;
        setPoint(arr, i, (col - cols / 2) * .16, (row - cols / 2) * .16, Math.sin(i * .17) * .12);
      } else if (state === 6) {
        const a = t * Math.PI * 16;
        const r = 2.2 + Math.sin(t * Math.PI * 8) * 1.5;
        setPoint(arr, i, Math.cos(a) * r, Math.sin(a * 1.5) * 2.7, Math.sin(a) * r * .65);
      } else if (state === 7) {
        if (i < COUNT * .52) {
          const p = i / (COUNT * .52);
          const a = Math.PI + p * Math.PI;
          setPoint(arr, i, -1.8 + Math.cos(a) * 1.8 + (s0 - .5) * .12, .9 + Math.sin(a) * 2.7, (s1 - .5) * .35);
        } else {
          const p = (i - COUNT * .52) / (COUNT * .48);
          const side = p < .5 ? -1 : 1;
          const q = p < .5 ? p * 2 : (p - .5) * 2;
          setPoint(arr, i, 2 + side * (1.65 - q * 1.35), -2.9 + q * 5.8, (s2 - .5) * .35);
        }
      } else {
        const a = t * Math.PI * 28;
        const r = 1.5 + s0 * 4.5;
        setPoint(arr, i, Math.cos(a) * r, Math.sin(a) * r, (s2 - .5) * 6);
      }
    }
    return arr;
  };
  for (let state = 0; state < 9; state++) stateTargets.push(buildTargets(state));

  const stateConfig = [
    { x: 2.55, y: 0, z: 0, scale: 1, shell: 1, core: 1, rings: 1, bloom: .66 },
    { x: 2.8, y: 0, z: 0, scale: .95, shell: .82, core: .86, rings: .82, bloom: .52 },
    { x: 2.4, y: 0, z: 0, scale: 1.04, shell: .48, core: 1.18, rings: 1.28, bloom: .78 },
    { x: -2.35, y: 0, z: 0, scale: .88, shell: .2, core: .78, rings: .5, bloom: .6 },
    { x: 2.5, y: 0, z: 0, scale: 1.08, shell: .7, core: .9, rings: .7, bloom: .52 },
    { x: 2.7, y: 0, z: 0, scale: .78, shell: .1, core: .62, rings: .25, bloom: .4 },
    { x: 2.45, y: 0, z: 0, scale: .94, shell: .55, core: .75, rings: .58, bloom: .5 },
    { x: 2.4, y: 0, z: 0, scale: .8, shell: .05, core: .58, rings: .12, bloom: .42 },
    { x: 2.2, y: 0, z: 0, scale: 1.1, shell: .82, core: 1.35, rings: .95, bloom: .88 }
  ];

  let activeState = 0;
  let targetState = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (event) => {
    pointer.tx = event.clientX / innerWidth * 2 - 1;
    pointer.ty = -(event.clientY / innerHeight * 2 - 1);
  });

  const applyState = (state) => {
    targetState = state;
    const cfg = stateConfig[state];
    targets.set(stateTargets[state]);
    const desiredX = mobile ? 0 : cfg.x;
    if (gsap) {
      gsap.to(engine.position, { x: desiredX, y: cfg.y, z: cfg.z, duration: 1.5, ease: 'power3.inOut' });
      gsap.to(engine.scale, { x: cfg.scale, y: cfg.scale, z: cfg.scale, duration: 1.5, ease: 'power3.inOut' });
      gsap.to(shell.material, { opacity: cfg.shell, duration: .9 });
      gsap.to(wire.material, { opacity: cfg.shell * .16, duration: .9 });
      gsap.to(core.scale, { x: cfg.core, y: cfg.core, z: cfg.core, duration: 1.1, ease: 'power3.inOut' });
      rings.forEach((ring, index) => gsap.to(ring.scale, { x: cfg.rings * (1 + index * .02), y: cfg.rings * (1 + index * .02), z: cfg.rings, duration: 1.2, ease: 'power3.inOut' }));
      gsap.to(bloom, { strength: mobile ? cfg.bloom * .72 : cfg.bloom, duration: 1 });
    } else {
      engine.position.x = desiredX;
      engine.scale.setScalar(cfg.scale);
    }
    particleMaterial.color.set(state === 2 || state === 8 ? 0xff8a5f : state === 3 ? 0x8da1ff : 0xbfc5d2);
    activeState = state;
  };

  const scenes = [...document.querySelectorAll('.scene')];
  scenes.forEach((section, index) => {
    if (ScrollTrigger) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 54%',
        end: 'bottom 46%',
        onEnter: () => applyState(index),
        onEnterBack: () => applyState(index)
      });
    } else {
      const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && applyState(index), { threshold: .55 });
      observer.observe(section);
    }
  });

  if (ScrollTrigger) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set('.progress i b', { height: `${self.progress * 100}%` });
        const sectionIndex = Math.min(8, Math.floor(self.progress * 9));
        document.querySelector('.progress__current').textContent = String(sectionIndex + 1).padStart(2, '0');
      }
    });
  }

  const clock = new THREE.Clock();
  const raycaster = new THREE.Raycaster();
  const pointerVector = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const pointerWorld = new THREE.Vector3(999, 999, 999);

  const animate = () => {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * .055;
    pointer.y += (pointer.ty - pointer.y) * .055;
    pointerVector.set(pointer.x, pointer.y);
    raycaster.setFromCamera(pointerVector, camera);
    raycaster.ray.intersectPlane(plane, pointerWorld);

    const attr = particlesGeometry.attributes.position;
    const pos = attr.array;
    for (let i = 0; i < COUNT; i++) {
      const index = i * 3;
      let tx = targets[index];
      let ty = targets[index + 1];
      const tz = targets[index + 2];
      const wave = Math.sin(elapsed * .7 + i * .017) * .006;
      tx += wave * (seeds[i * 4] - .5) * 10;
      ty += wave * (seeds[i * 4 + 1] - .5) * 10;
      const dx = pos[index] + engine.position.x - pointerWorld.x;
      const dy = pos[index + 1] - pointerWorld.y;
      const distanceSq = dx * dx + dy * dy;
      if (!mobile && distanceSq < 1.9) {
        const force = (1.9 - distanceSq) * .035;
        tx += dx * force;
        ty += dy * force;
      }
      pos[index] += (tx - pos[index]) * .035;
      pos[index + 1] += (ty - pos[index + 1]) * .035;
      pos[index + 2] += (tz - pos[index + 2]) * .035;
    }
    attr.needsUpdate = true;

    engine.rotation.y += ((pointer.x * .14) - engine.rotation.y) * .025;
    engine.rotation.x += ((-pointer.y * .08) - engine.rotation.x) * .025;
    shell.rotation.z += .0018;
    wire.rotation.z -= .0012;
    core.rotation.x += .006;
    core.rotation.y -= .004;
    core.scale.multiplyScalar(1 + Math.sin(elapsed * 2.1) * .0008);
    rings.forEach((ring, index) => {
      ring.rotation.z += (index % 2 ? -.0018 : .0014) * (index + 1);
      ring.rotation.y += .0007 * (index + 1);
    });
    shards.forEach((shard, index) => {
      shard.rotation.x += .002 + index * .0002;
      shard.rotation.y -= .0015 + index * .0001;
    });
    orangeLight.intensity = 33 + Math.sin(elapsed * 2.4) * 7 + (activeState === 8 ? 10 : 0);
    composer.render();
  };

  addEventListener('resize', () => {
    const ratio = Math.min(devicePixelRatio, innerWidth < 720 ? 1.25 : 1.75);
    renderer.setPixelRatio(ratio);
    renderer.setSize(innerWidth, innerHeight);
    composer.setPixelRatio(ratio);
    composer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    engine.position.x = innerWidth < 720 ? 0 : stateConfig[targetState].x;
  });

  applyState(0);
  if (!reduced) animate(); else composer.render();
}

const intro = () => {
  const loader = document.querySelector('.preloader');
  if (!loader) return;
  if (!gsap || reduced) {
    loader.remove();
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
  tl.to('.preloader__bar b', { x: '0%', duration: .8 })
    .from('.preloader__center strong', { opacity: 0, y: 8, duration: .4 }, '-=.45')
    .from('.preloader__center i', { scaleX: 0, duration: .5 }, '-=.35')
    .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: .8, delay: .15 })
    .set('.preloader', { display: 'none' })
    .from('.nav,.progress', { opacity: 0, duration: .45 }, '-=.15')
    .from('.hero__copy > *,.engine-label,.scroll', { y: 28, opacity: 0, stagger: .08, duration: .75 }, '-=.35');
};
addEventListener('load', intro, { once: true });
setTimeout(intro, 1800);

if (gsap && ScrollTrigger && !reduced) {
  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    if (element.closest('.hero')) return;
    gsap.from(element, {
      y: 46,
      opacity: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });
}

const cursor = document.querySelector('.cursor');
if (cursor && !reduced) {
  addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px,${event.clientY}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('pointerenter', () => cursor.classList.add('is-link'));
    link.addEventListener('pointerleave', () => cursor.classList.remove('is-link'));
  });
}

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (!gsap || innerWidth < 800) return;
    const rect = element.getBoundingClientRect();
    gsap.to(element, { x: (event.clientX - rect.left - rect.width / 2) * .13, y: (event.clientY - rect.top - rect.height / 2) * .16, duration: .3 });
  });
  element.addEventListener('pointerleave', () => gsap && gsap.to(element, { x: 0, y: 0, duration: .65, ease: 'elastic.out(1,.45)' }));
});
