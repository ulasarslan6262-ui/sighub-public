const canvas=document.querySelector('canvas#experience');
if(canvas){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=window.matchMedia('(max-width:720px)').matches;
  (async()=>{
    try{
      const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js');
      const renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,mobile?1.15:1.5));
      renderer.setSize(window.innerWidth,window.innerHeight);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.18;
      const scene=new THREE.Scene();
      scene.fog=new THREE.FogExp2(0x070808,mobile?.072:.052);
      const camera=new THREE.PerspectiveCamera(42,window.innerWidth/window.innerHeight,.1,100);
      camera.position.set(0,0,mobile?12.8:10.5);
      const group=new THREE.Group();
      group.position.x=mobile?1.1:2.7;
      scene.add(group);
      const count=mobile?260:680;
      const positions=new Float32Array(count*3);
      const targets=new Float32Array(count*3);
      const seeds=new Float32Array(count*3);
      const seeded=(i,s)=>{const v=Math.sin(i*151.37+s*71.13)*43758.5453;return v-Math.floor(v)};
      for(let i=0;i<count;i++){
        const a=seeded(i,1)*Math.PI*2,p=Math.acos(2*seeded(i,2)-1),r=2.2+seeded(i,3)*3.4;
        positions[i*3]=Math.sin(p)*Math.cos(a)*r;
        positions[i*3+1]=Math.sin(p)*Math.sin(a)*r;
        positions[i*3+2]=Math.cos(p)*r;
        seeds[i*3]=seeded(i,4);seeds[i*3+1]=seeded(i,5);seeds[i*3+2]=seeded(i,6);
      }
      targets.set(positions);
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
      const material=new THREE.PointsMaterial({color:0xff6b2c,size:mobile?.072:.058,transparent:true,opacity:mobile?.74:.82,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
      const particles=new THREE.Points(geometry,material);
      group.add(particles);
      const glowGeometry=new THREE.BufferGeometry();
      glowGeometry.setAttribute('position',new THREE.BufferAttribute(positions.slice(),3));
      const glowMaterial=new THREE.PointsMaterial({color:0xff3f08,size:mobile?.16:.13,transparent:true,opacity:.11,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
      const glow=new THREE.Points(glowGeometry,glowMaterial);
      group.add(glow);
      const setPoint=(arr,i,x,y,z)=>{arr[i*3]=x;arr[i*3+1]=y;arr[i*3+2]=z};
      const buildState=(state)=>{
        const arr=new Float32Array(count*3);
        for(let i=0;i<count;i++){
          const t=i/Math.max(1,count-1),s0=seeds[i*3],s1=seeds[i*3+1],s2=seeds[i*3+2];
          if(state===0){const a=s1*Math.PI*2,p=Math.acos(2*s2-1),r=2.35+s0*3.15;setPoint(arr,i,Math.sin(p)*Math.cos(a)*r,Math.sin(p)*Math.sin(a)*r,Math.cos(p)*r)}
          else if(state===1){const a=t*Math.PI*14,r=1.75+Math.sin(t*Math.PI*5)*.72;setPoint(arr,i,Math.cos(a)*r,(t-.5)*6.7,Math.sin(a)*r*.65)}
          else if(state===2){const ring=i%6,a=t*Math.PI*31+ring*.3,r=.9+ring*.58;setPoint(arr,i,Math.cos(a)*r,Math.sin(a)*r,(ring-2.5)*.2)}
          else if(state===3){const x=(t-.5)*10.2,y=Math.sin(t*Math.PI*14+s0*3)*(0.65+s1*1.25);setPoint(arr,i,x,y,(s2-.5)*2.1)}
          else if(state===4){const cols=Math.ceil(Math.sqrt(count)),row=Math.floor(i/cols),col=i%cols;setPoint(arr,i,(col-cols/2)*.24,(row-cols/2)*.24,Math.sin(i*.21)*.18)}
          else if(state===5){const a=t*Math.PI*13,r=1.4+Math.sin(t*Math.PI*7)*1.05;setPoint(arr,i,Math.cos(a)*r,(t-.5)*6.6,Math.sin(a)*r*.72)}
          else{const ring=i%4,a=t*Math.PI*27+ring*.45,r=1.1+ring*.92;setPoint(arr,i,Math.cos(a)*r,Math.sin(a)*r,Math.sin(a*2)*.48)}
        }
        return arr;
      };
      const states=Array.from({length:7},(_,i)=>buildState(i));
      targets.set(states[0]);
      const observer=new IntersectionObserver((entries)=>{
        const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible)return;
        const state=Number(visible.target.dataset.state||0);
        targets.set(states[state]);
        material.color.setHex(state===2||state===6?0xff8a54:0xff6326);
      },{threshold:[.3,.5,.7],rootMargin:'-12% 0px -12% 0px'});
      document.querySelectorAll('[data-state]').forEach(el=>observer.observe(el));
      const pointer={x:0,y:0,tx:0,ty:0};
      window.addEventListener('pointermove',e=>{pointer.tx=e.clientX/window.innerWidth*2-1;pointer.ty=-(e.clientY/window.innerHeight*2-1)},{passive:true});
      const clock=new THREE.Clock();
      const render=()=>{
        const elapsed=clock.getElapsedTime();
        const attr=geometry.attributes.position,arr=attr.array;
        const glowArr=glowGeometry.attributes.position.array;
        for(let i=0;i<count;i++){
          const o=i*3,drift=reduced?0:Math.sin(elapsed*.48+i*.037)*.006;
          arr[o]+=(targets[o]+drift-arr[o])*.03;
          arr[o+1]+=(targets[o+1]-arr[o+1])*.03;
          arr[o+2]+=(targets[o+2]-arr[o+2])*.03;
          glowArr[o]=arr[o];glowArr[o+1]=arr[o+1];glowArr[o+2]=arr[o+2];
        }
        attr.needsUpdate=true;glowGeometry.attributes.position.needsUpdate=true;
        pointer.x+=(pointer.tx-pointer.x)*.035;pointer.y+=(pointer.ty-pointer.y)*.035;
        group.rotation.y+=(pointer.x*.09-group.rotation.y)*.025;
        group.rotation.x+=(-pointer.y*.055-group.rotation.x)*.025;
        if(!reduced){group.rotation.z+=.00025;material.opacity=.76+Math.sin(elapsed*1.3)*.07;}
        renderer.render(scene,camera);
        if(!reduced)requestAnimationFrame(render);
      };
      document.documentElement.classList.add('orbs-ready');
      render();
      window.addEventListener('resize',()=>{
        const isMobile=window.innerWidth<720;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,isMobile?1.15:1.5));
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
        group.position.x=isMobile?1.1:2.7;
      });
    }catch(error){console.warn('Orange orb background unavailable',error)}
  })();
}
