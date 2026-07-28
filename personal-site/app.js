
clearTimeout(window.__siteFallback);
document.documentElement.classList.remove('js-fallback');

const progressBar = document.querySelector('.page-progress span');
const updateProgress = () => {
  if (!progressBar) return;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / max))})`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
requestAnimationFrame(() => document.querySelectorAll('.hero .reveal').forEach((element) => element.classList.add('is-visible')));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#experience');
const mobile = window.innerWidth < 760;

(async () => {
  if (!canvas || new URLSearchParams(location.search).has('no3d')) return;
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.55));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070808, 0.06);
    const camera = new THREE.PerspectiveCamera(39, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, mobile ? 12.6 : 10.7);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(4, 5, 7); scene.add(key);
    const rim = new THREE.DirectionalLight(0x63708e, 2.8); rim.position.set(-5, 2, 4); scene.add(rim);
    const signal = new THREE.PointLight(0xff672b, 28, 12, 1.8); signal.position.set(0, 0, 1.1); scene.add(signal);

    const group = new THREE.Group();
    group.position.x = mobile ? 1.5 : 3.0;
    scene.add(group);

    const shell = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.05, 0.31, mobile ? 150 : 260, 26, 2, 3),
      new THREE.MeshPhysicalMaterial({ color: 0x15191a, metalness: 0.94, roughness: 0.17, clearcoat: 1, clearcoatRoughness: 0.05 })
    );
    shell.rotation.set(.45,-.32,.12);
    group.add(shell);

    const glass = new THREE.Mesh(
      new THREE.SphereGeometry(1.14, mobile ? 34 : 58, mobile ? 22 : 38),
      new THREE.MeshPhysicalMaterial({ color: 0x202424, metalness: .1, roughness: .08, transmission: .68, thickness: 1.2, transparent: true, opacity: .33 })
    );
    group.add(glass);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(.47, 4),
      new THREE.MeshPhysicalMaterial({ color: 0xff672b, emissive: 0xff3a08, emissiveIntensity: 3.2, roughness: .16, clearcoat: 1 })
    );
    group.add(core);

    const ringMaterial = new THREE.MeshPhysicalMaterial({ color: 0x3c4140, metalness: .9, roughness: .2, transparent: true, opacity: .48 });
    const rings = [2.85, 3.55].map((radius,index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, index ? .011 : .02, 8, 150), ringMaterial.clone());
      ring.rotation.set(Math.PI/2 + index*.42, index*.36, index*.18);
      group.add(ring); return ring;
    });

    const count = mobile ? 320 : 720;
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const seeded = (i,s) => { const v = Math.sin(i*151.37+s*71.13)*43758.5453; return v-Math.floor(v); };
    for (let i=0;i<count;i++) {
      const a=seeded(i,1)*Math.PI*2, p=Math.acos(2*seeded(i,2)-1), r=2.5+seeded(i,3)*2.7;
      positions[i*3]=Math.sin(p)*Math.cos(a)*r; positions[i*3+1]=Math.sin(p)*Math.sin(a)*r; positions[i*3+2]=Math.cos(p)*r;
      seeds[i*3]=seeded(i,4); seeds[i*3+1]=seeded(i,5); seeds[i*3+2]=seeded(i,6);
    }
    targets.set(positions);
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material = new THREE.PointsMaterial({ color: 0xbfc3c0, size: mobile ? .024 : .018, transparent:true, opacity:.62, depthWrite:false, blending:THREE.AdditiveBlending });
    const particles = new THREE.Points(geometry,material); group.add(particles);

    const setPoint=(arr,i,x,y,z)=>{arr[i*3]=x;arr[i*3+1]=y;arr[i*3+2]=z};
    const buildState=(state)=>{
      const arr=new Float32Array(count*3);
      for(let i=0;i<count;i++){
        const t=i/Math.max(1,count-1),s0=seeds[i*3],s1=seeds[i*3+1],s2=seeds[i*3+2];
        if(state===0){const a=s1*Math.PI*2,p=Math.acos(2*s2-1),r=2.45+s0*2.8;setPoint(arr,i,Math.sin(p)*Math.cos(a)*r,Math.sin(p)*Math.sin(a)*r,Math.cos(p)*r)}
        else if(state===1){const a=t*Math.PI*13,r=2.0+Math.sin(t*Math.PI*4)*.55;setPoint(arr,i,Math.cos(a)*r,(t-.5)*6.1,Math.sin(a)*r*.52)}
        else if(state===2){const ring=i%5,a=t*Math.PI*28+ring*.2,r=1.15+ring*.65;setPoint(arr,i,Math.cos(a)*r,Math.sin(a)*r,(ring-2)*.15)}
        else if(state===3){const x=(t-.5)*9.4,y=Math.sin(t*Math.PI*12+s0)*(0.7+s1*1.05);setPoint(arr,i,x,y,(s2-.5)*1.6)}
        else if(state===4){const cols=Math.ceil(Math.sqrt(count)),row=Math.floor(i/cols),col=i%cols;setPoint(arr,i,(col-cols/2)*.2,(row-cols/2)*.2,Math.sin(i*.19)*.08)}
        else if(state===5){const a=t*Math.PI*12,r=1.8+Math.sin(t*Math.PI*6)*.85;setPoint(arr,i,Math.cos(a)*r,(t-.5)*6,Math.sin(a)*r*.62)}
        else {const ring=i%3,a=t*Math.PI*24+ring*.4,r=1.5+ring*1.1;setPoint(arr,i,Math.cos(a)*r,Math.sin(a)*r,Math.sin(a*2)*.3)}
      }
      return arr;
    };
    const states=Array.from({length:7},(_,i)=>buildState(i));
    let state=0; let stateTarget=0;
    const stateObserver=new IntersectionObserver((entries)=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return; stateTarget=Number(visible.target.dataset.state||0); targets.set(states[stateTarget]); state=stateTarget;
      material.color.setHex(state===2||state===6?0xffa17d:0xbfc3c0);
    },{threshold:[.3,.5,.7],rootMargin:'-12% 0px -12% 0px'});
    document.querySelectorAll('[data-state]').forEach(el=>stateObserver.observe(el));

    const pointer={x:0,y:0,tx:0,ty:0};
    window.addEventListener('pointermove',(e)=>{pointer.tx=e.clientX/window.innerWidth*2-1;pointer.ty=-(e.clientY/window.innerHeight*2-1)},{passive:true});
    const clock=new THREE.Clock();
    const render=()=>{
      const elapsed=clock.getElapsedTime();
      const attr=geometry.attributes.position,arr=attr.array;
      for(let i=0;i<count;i++){
        const o=i*3,drift=reducedMotion?0:Math.sin(elapsed*.4+i*.031)*.0028;
        arr[o]+=(targets[o]+drift-arr[o])*.028;arr[o+1]+=(targets[o+1]-arr[o+1])*.028;arr[o+2]+=(targets[o+2]-arr[o+2])*.028;
      }
      attr.needsUpdate=true;
      pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;
      group.rotation.y+=(pointer.x*.075-group.rotation.y)*.025;group.rotation.x+=(-pointer.y*.045-group.rotation.x)*.025;
      if(!reducedMotion){shell.rotation.z+=.00055;core.rotation.x+=.0024;core.rotation.y-=.0018;rings[0].rotation.z+=.0006;rings[1].rotation.z-=.00045;signal.intensity=25+Math.sin(elapsed*1.8)*2.2;}
      renderer.render(scene,camera);requestAnimationFrame(render);
    };
    document.documentElement.classList.add('webgl-ready');
    requestAnimationFrame(render);
    window.addEventListener('resize',()=>{renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<760?1.15:1.55));renderer.setSize(window.innerWidth,window.innerHeight);camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();group.position.x=window.innerWidth<760?1.5:3.0});
  } catch (error) {
    console.warn('3D enhancement unavailable', error);
  }
})();
