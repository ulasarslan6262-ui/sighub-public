const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hero > *', { y: 34, opacity: 0, stagger: .08, duration: .8, ease: 'power3.out' });
  gsap.utils.toArray('.article p,.article h2,.article h3,.article blockquote,.facts,.pull,.author,.timeline>div,.principles>div').forEach((element) => {
    gsap.from(element, { y: 35, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
  });
}
