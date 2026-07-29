window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};
if(!document.querySelector('script[data-vercel-analytics]')){const analyticsScript=document.createElement('script');analyticsScript.defer=true;analyticsScript.src='/_vercel/insights/script.js';analyticsScript.dataset.vercelAnalytics='true';document.head.appendChild(analyticsScript)}
clearTimeout(window.__siteFallback);
document.documentElement.classList.remove('js-fallback');
document.querySelectorAll('.reveal').forEach((element)=>element.classList.add('is-visible'));
const progressBar=document.querySelector('.page-progress span');
const updateProgress=()=>{if(!progressBar)return;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);progressBar.style.transform=`scaleX(${Math.min(1,Math.max(0,window.scrollY/max))})`;};
window.addEventListener('scroll',updateProgress,{passive:true});
updateProgress();
import('/orange-orbs-20260729.js?v=3');