const gsap = window.gsap;
if (gsap) {
  gsap.from('.hero h1 > *, .hero h1', { yPercent: 35, opacity: 0, duration: 1.2, ease: 'power4.out' });
  gsap.from('.meta,.deck', { y: 25, opacity: 0, stagger: .12, duration: .8, delay: .35 });
  document.querySelectorAll('.article h2,.article blockquote,.facts,.pull,.timeline div,.principles div').forEach(el => {
    gsap.from(el, { y: 70, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
  });
}
