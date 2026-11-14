window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};
if(!document.querySelector('script[data-vercel-analytics]')){const analyticsScript=document.createElement('script');analyticsScript.defer=true;analyticsScript.src='/_vercel/insights/script.js';analyticsScript.dataset.vercelAnalytics='true';document.head.appendChild(analyticsScript)}
clearTimeout(window.__siteFallback);
document.documentElement.classList.remove('js-fallback');
document.querySelectorAll('.reveal').forEach((element)=>element.classList.add('is-visible'));
const progressBar=document.querySelector('.page-progress span');
const updateProgress=()=>{if(!progressBar)return;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);progressBar.style.transform=`scaleX(${Math.min(1,Math.max(0,window.scrollY/max))})`;};
window.addEventListener('scroll',updateProgress,{passive:true});
updateProgress();
import('/icon-system-20260729.js?v=2');

const motion = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
for (const stage of document.querySelectorAll('[data-depth]')) {
  const surface = stage.querySelector('[data-depth-surface]');

  const reset = () => {
    surface.style.removeProperty('--depth-x');
    surface.style.removeProperty('--depth-y');
  };

  stage.addEventListener('pointermove', (event) => {
    if (!motion.matches || event.pointerType === 'touch') return;

    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    surface.style.setProperty('--depth-x', `${(-y * 7).toFixed(2)}deg`);
    surface.style.setProperty('--depth-y', `${(x * 7).toFixed(2)}deg`);
  }, { passive: true });

  stage.addEventListener('pointerleave', reset);
  stage.addEventListener('pointercancel', reset);
  motion.addEventListener('change', reset);
}

const backgroundMotion = matchMedia('(min-width: 721px) and (prefers-reduced-motion: no-preference)');
function loadParticles() {
  if (!backgroundMotion.matches) return;
  backgroundMotion.removeEventListener('change', loadParticles);
  import('/orange-orbs-20260729.js?v=5');
}
backgroundMotion.addEventListener('change', loadParticles);
loadParticles();
