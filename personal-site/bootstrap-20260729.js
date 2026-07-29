const mobile=window.matchMedia('(max-width:720px)').matches;
if(mobile){
  clearTimeout(window.__siteFallback);
  document.documentElement.classList.remove('js-fallback');
  document.documentElement.classList.add('mobile-static');
  document.querySelectorAll('.reveal').forEach((element)=>element.classList.add('is-visible'));
  const progressBar=document.querySelector('.page-progress span');
  const updateProgress=()=>{if(!progressBar)return;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);progressBar.style.transform=`scaleX(${Math.min(1,Math.max(0,window.scrollY/max))})`;};
  window.addEventListener('scroll',updateProgress,{passive:true});
  updateProgress();
}else{
  import('/app.js?v=20260729d');
}
