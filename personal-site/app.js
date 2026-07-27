import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const palette = [0xf04232, 0x1746d1, 0xf4d646, 0xf2eadb, 0xb9ff61];
const canvas = document.querySelector('#world');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 11.5);

const key = new THREE.DirectionalLight(0xffffff, 4.5);
key.position.set(2.5, 5, 7);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6b7dff, 3.5);
rim.position.set(-5, -1, 3);
scene.add(rim);
const fill = new THREE.AmbientLight(0xffffff, 1.25);
scene.add(fill);

const world = new THREE.Group();
scene.add(world);

const COUNT = innerWidth < 720 ? 34 : 62;
const shards = [];
const targetPositions = [];
const targetRotations = [];
const baseScales = [];

function seeded(index, salt = 0) {
  const x = Math.sin(index * 999.1 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function geometryFor(i) {
  const type = i % 6;
  if (type === 0) return new THREE.TetrahedronGeometry(.55 + seeded(i, 1) * .75, 0);
  if (type === 1) return new THREE.OctahedronGeometry(.5 + seeded(i, 2) * .65, 0);
  if (type === 2) return new THREE.BoxGeometry(.35 + seeded(i, 3) * .65, .35 + seeded(i, 4) * 1.2, .3 + seeded(i, 5) * .6);
  if (type === 3) return new THREE.ConeGeometry(.35 + seeded(i, 6) * .45, .8 + seeded(i, 7) * 1.1, 3 + (i % 3));
  if (type === 4) return new THREE.IcosahedronGeometry(.45 + seeded(i, 8) * .55, 0);
  return new THREE.CylinderGeometry(.2 + seeded(i, 9) * .35, .45 + seeded(i, 10) * .45, .65 + seeded(i, 11) * 1.1, 3 + (i % 4));
}

for (let i = 0; i < COUNT; i++) {
  const material = new THREE.MeshStandardMaterial({
    color: palette[i % palette.length],
    roughness: .48,
    metalness: .08,
    flatShading: true,
    transparent: true,
    opacity: .93,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometryFor(i), material);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 25),
    new THREE.LineBasicMaterial({ color: 0x090806, transparent: true, opacity: .32 })
  );
  mesh.add(edge);
  mesh.userData.index = i;
  mesh.userData.speed = .2 + seeded(i, 12) * .9;
  mesh.position.set((seeded(i, 13) - .5) * 18, (seeded(i, 14) - .5) * 13, (seeded(i, 15) - .5) * 8);
  mesh.rotation.set(seeded(i, 16) * 6, seeded(i, 17) * 6, seeded(i, 18) * 6);
  const scale = .35 + seeded(i, 19) * .8;
  mesh.scale.setScalar(scale);
  baseScales.push(scale);
  targetPositions.push(mesh.position.clone());
  targetRotations.push(mesh.rotation.clone());
  shards.push(mesh);
  world.add(mesh);
}

const haloGeometry = new THREE.RingGeometry(2.8, 2.84, 128);
const haloMaterial = new THREE.MeshBasicMaterial({ color: 0xf2eadb, transparent: true, opacity: .18, side: THREE.DoubleSide });
const halo = new THREE.Mesh(haloGeometry, haloMaterial);
halo.rotation.x = Math.PI / 2;
world.add(halo);

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (event) => {
  mouse.tx = (event.clientX / innerWidth - .5) * 2;
  mouse.ty = (event.clientY / innerHeight - .5) * 2;
});

function chaos(i) {
  return new THREE.Vector3((seeded(i, 21) - .5) * 18, (seeded(i, 22) - .5) * 12, (seeded(i, 23) - .5) * 7);
}
function figure(i) {
  const t = i / Math.max(1, COUNT - 1);
  if (t < .26) {
    const a = t / .26 * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * 1.6, 2.6 + Math.sin(a) * 1.8, Math.sin(a * 2) * .6);
  }
  if (t < .72) {
    const r = (t - .26) / .46;
    const side = i % 2 ? 1 : -1;
    return new THREE.Vector3(side * (1.0 + r * 1.7), 1.2 - r * 4.4, (seeded(i, 24) - .5) * 1.4);
  }
  const r = (t - .72) / .28;
  const side = i % 2 ? 1 : -1;
  return new THREE.Vector3(side * (1.6 + r * 1.8), -2.7 - r * 2.4, (seeded(i, 25) - .5) * 1.2);
}
function radar(i) {
  const ring = i % 4;
  const a = (i / COUNT) * Math.PI * 10 + ring * .4;
  const radius = 1.2 + ring * 1.15;
  return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, (ring - 1.5) * .42);
}
function wave(i) {
  const x = (i / (COUNT - 1) - .5) * 11;
  const y = Math.sin(i * .7) * (1.1 + seeded(i, 26) * 1.3);
  return new THREE.Vector3(x, y, (seeded(i, 27) - .5) * 2.4);
}
function spiral(i) {
  const t = i / COUNT * Math.PI * 7;
  const radius = .9 + i / COUNT * 3.5;
  return new THREE.Vector3(Math.cos(t) * radius, -4.3 + i / COUNT * 8.6, Math.sin(t) * radius * .7);
}
function grid(i) {
  const cols = Math.ceil(Math.sqrt(COUNT));
  const row = Math.floor(i / cols);
  const col = i % cols;
  return new THREE.Vector3((col - cols / 2) * 1.25, (row - cols / 2) * 1.25, Math.sin(i) * .35);
}
function monogram(i) {
  const t = i / COUNT;
  if (t < .5) {
    const p = t / .5;
    const a = Math.PI + p * Math.PI;
    return new THREE.Vector3(-2.2 + Math.cos(a) * 1.9, .9 + Math.sin(a) * 2.9, (seeded(i, 28) - .5) * .7);
  }
  const p = (t - .5) / .5;
  const side = p < .5 ? -1 : 1;
  const q = p < .5 ? p * 2 : (p - .5) * 2;
  const y = -3.2 + q * 6.2;
  const x = 2.2 + side * (1.8 - q * 1.5);
  return new THREE.Vector3(x, y, (seeded(i, 29) - .5) * .7);
}
function finalBurst(i) {
  const a = i / COUNT * Math.PI * 2;
  const r = 2 + (i % 7) * .6;
  return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, (seeded(i, 30) - .5) * 4.5);
}

const patterns = [chaos, figure, radar, wave, spiral, grid, monogram, finalBurst];
let activeScene = 0;
let scrollProgress = 0;

function setPattern(sceneIndex) {
  activeScene = Math.max(0, Math.min(patterns.length - 1, sceneIndex));
  const pattern = patterns[activeScene];
  shards.forEach((mesh, i) => {
    const p = pattern(i);
    targetPositions[i].copy(p);
    targetRotations[i].set(
      seeded(i, activeScene + 40) * Math.PI * 2,
      seeded(i, activeScene + 60) * Math.PI * 2,
      seeded(i, activeScene + 80) * Math.PI * 2
    );
  });
  halo.visible = activeScene === 2;
  if (gsap) {
    gsap.to(haloMaterial, { opacity: activeScene === 2 ? .34 : 0, duration: .8 });
    gsap.to(camera.position, {
      z: [11.5, 12.5, 10.2, 11.2, 12.8, 12.5, 10.8, 12][activeScene],
      duration: 1.4,
      ease: 'power3.inOut'
    });
  }
}

const toneMap = {
  ink: { color: 0xf2eadb, fog: 0x090806 },
  bone: { color: 0x090806, fog: 0xf2eadb },
  blue: { color: 0xf2eadb, fog: 0x1746d1 },
  red: { color: 0x090806, fog: 0xf04232 },
  yellow: { color: 0x090806, fog: 0xf4d646 }
};

function activateSection(section) {
  const index = Number(section.dataset.scene || 0);
  setPattern(index);
  document.querySelector('.rail-number').textContent = String(index + 1).padStart(2, '0');
  const tone = toneMap[section.dataset.tone] || toneMap.ink;
  key.color.setHex(tone.color);
  rim.color.setHex(index % 2 ? 0xf04232 : 0x1746d1);
}

const sections = [...document.querySelectorAll('.scene')];
sections.forEach((section) => {
  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 48%',
      end: 'bottom 48%',
      onEnter: () => activateSection(section),
      onEnterBack: () => activateSection(section)
    });
  }
});

if (ScrollTrigger) {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      scrollProgress = self.progress;
      gsap.set('.rail-track b', { height: `${self.progress * 100}%` });
      world.rotation.z = self.progress * .36;
    }
  });
}

function intro() {
  const prelude = document.querySelector('#prelude');
  if (!gsap || reduced) {
    prelude?.remove();
    document.querySelectorAll('.hero-line,.hero-thesis,.hero-intro,.overline').forEach(el => el.style.opacity = 1);
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
  tl.from('.prelude-word span', { yPercent: 130, rotate: 25, stagger: .08, duration: 1.1 })
    .from('.prelude-line i', { scaleX: 0, duration: .6 }, '-=.4')
    .from('.prelude-line b', { opacity: 0, y: 10, duration: .5 }, '-=.3')
    .to('.prelude-word span', { yPercent: -140, stagger: .06, duration: .9, delay: .25 })
    .to('#prelude', { clipPath: 'inset(0 0 100% 0)', duration: 1 }, '-=.5')
    .set('#prelude', { display: 'none' })
    .from('.hero-line', { yPercent: 110, rotate: 4, stagger: .12, duration: 1.1 }, '-=.25')
    .from('.hero-thesis > *', { y: 35, opacity: 0, stagger: .08, duration: .7 }, '-=.6')
    .from('.hero-intro,.scroll-cue,.site-nav,.rail', { opacity: 0, y: 18, stagger: .05, duration: .6 }, '-=.45');
}

if (gsap) {
  gsap.utils.toArray('.manifesto-title span').forEach((line, i) => {
    gsap.from(line, { xPercent: i % 2 ? 18 : -18, opacity: 0, scrollTrigger: { trigger: line, start: 'top 82%', end: 'top 46%', scrub: 1 } });
  });
  gsap.utils.toArray('.case-heading h2,.sound-copy h2,.growth-title,.thinking-head h2,.about-copy h2,.contact-copy h2').forEach((el) => {
    gsap.from(el, { yPercent: 24, rotate: 2, opacity: 0, scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 48%', scrub: 1 } });
  });
  gsap.utils.toArray('.essay-panel').forEach((el, i) => {
    gsap.from(el, { y: 100 + i * 35, opacity: 0, scrollTrigger: { trigger: '.essay-strip', start: 'top 78%', end: 'top 42%', scrub: 1 } });
  });
}

const cursor = document.querySelector('.cursor');
if (cursor && !reduced) {
  addEventListener('pointermove', e => {
    cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('pointerenter', () => cursor.classList.add('active'));
    link.addEventListener('pointerleave', () => cursor.classList.remove('active'));
  });
}

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    if (gsap) gsap.to(el, { x: x * .14, y: y * .2, duration: .35 });
  });
  el.addEventListener('pointerleave', () => gsap && gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
});

function animate(time = 0) {
  mouse.x += (mouse.tx - mouse.x) * .035;
  mouse.y += (mouse.ty - mouse.y) * .035;
  camera.position.x += (mouse.x * .7 - camera.position.x) * .03;
  camera.position.y += (-mouse.y * .45 - camera.position.y) * .03;
  camera.lookAt(0, 0, 0);

  shards.forEach((mesh, i) => {
    const target = targetPositions[i];
    const rot = targetRotations[i];
    const speed = .026 + (i % 5) * .0025;
    mesh.position.lerp(target, speed);
    mesh.rotation.x += (rot.x - mesh.rotation.x) * .018;
    mesh.rotation.y += (rot.y - mesh.rotation.y) * .018;
    mesh.rotation.z += (rot.z - mesh.rotation.z) * .018;
    const pulse = 1 + Math.sin(time * .0012 * mesh.userData.speed + i) * .07;
    mesh.scale.setScalar(baseScales[i] * pulse);
    if (activeScene === 2) mesh.rotation.z += .008 * mesh.userData.speed;
    if (activeScene === 3) mesh.position.y += Math.sin(time * .002 + i * .6) * .012;
    if (activeScene === 7) mesh.position.multiplyScalar(1.00015);
  });
  halo.rotation.z += .006;
  world.rotation.y += (mouse.x * .12 - world.rotation.y) * .025;
  world.rotation.x += (-mouse.y * .08 - world.rotation.x) * .025;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

setPattern(0);
if (!reduced) requestAnimationFrame(animate); else renderer.render(scene, camera);
addEventListener('load', intro, { once: true });
setTimeout(intro, 2200);
