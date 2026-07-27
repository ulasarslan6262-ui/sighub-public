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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach((element) => element.classList.add('is-visible'));
});
