const canvas=document.querySelector('canvas#experience');
if(canvas){
  const context=canvas.getContext('2d',{alpha:true});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=window.matchMedia('(max-width:720px)').matches;
  let width=0,height=0,dpr=1,scrollTarget=window.scrollY,scrollValue=scrollTarget,pointerX=.5,pointerY=.5,frame=0;
  const count=mobile?38:76;
  const particles=Array.from({length:count},(_,index)=>({
    x:Math.random(),y:Math.random(),depth:.25+Math.random()*.75,
    radius:.7+Math.random()*(mobile?1.7:2.1),
    drift:(Math.random()-.5)*.00065,
    phase:Math.random()*Math.PI*2,
    orange:index%11===0
  }));
  const resize=()=>{
    const rect=canvas.getBoundingClientRect();
    width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
  };
  const onScroll=()=>{scrollTarget=window.scrollY};
  const onPointer=(event)=>{pointerX=event.clientX/window.innerWidth;pointerY=event.clientY/window.innerHeight};
  const draw=()=>{
    frame+=1;scrollValue+=(scrollTarget-scrollValue)*.065;
    context.clearRect(0,0,width,height);
    const progress=scrollValue/Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    for(const particle of particles){
      particle.phase+=particle.drift*(reduced?0:1);
      const wave=reduced?0:Math.sin(particle.phase+progress*8)*18*particle.depth;
      const x=((particle.x*width)+(pointerX-.5)*26*particle.depth+wave+width)%width;
      const y=((particle.y*height)+(scrollValue*.035*particle.depth)+(pointerY-.5)*18*particle.depth+height)%height;
      const alpha=(mobile?.16:.2)+particle.depth*(mobile?.22:.3);
      context.beginPath();context.arc(x,y,particle.radius*(.7+particle.depth*.65),0,Math.PI*2);
      context.fillStyle=particle.orange?`rgba(255,103,43,${alpha*.9})`:`rgba(242,241,236,${alpha})`;
      context.shadowBlur=particle.orange?10:6;context.shadowColor=particle.orange?'rgba(255,103,43,.35)':'rgba(242,241,236,.15)';context.fill();
    }
    context.shadowBlur=0;
    if(!reduced)requestAnimationFrame(draw);
  };
  new ResizeObserver(resize).observe(canvas);resize();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('pointermove',onPointer,{passive:true});
  document.documentElement.classList.add('particles-ready');
  draw();
}
