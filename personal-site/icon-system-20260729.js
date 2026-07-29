const SVG_NS='http://www.w3.org/2000/svg';

const style=document.createElement('style');
style.dataset.uaIconSystem='true';
style.textContent=`
.arrow-icon::before,.arrow-icon::after,.down-icon::before,.down-icon::after,.ua-hide-generated-arrow::before,.ua-hide-generated-arrow::after{content:none!important;display:none!important}
.arrow-icon,.ua-inline-icon{display:inline-grid!important;place-items:center;width:17px!important;height:17px!important;flex:0 0 17px!important;line-height:0!important;vertical-align:middle!important;transition:transform .28s var(--ease,cubic-bezier(.2,.75,.2,1)),color .28s ease!important}
.down-icon{display:inline-grid!important;place-items:center!important;line-height:0!important}
.arrow-icon svg,.ua-inline-icon svg{display:block;width:17px;height:17px;overflow:visible}
.down-icon svg{display:block;width:16px;height:16px;overflow:visible}
.ua-icon-path{fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
a:hover .arrow-icon:not(.is-external),a:focus-visible .arrow-icon:not(.is-external),button:hover .arrow-icon:not(.is-external),button:focus-visible .arrow-icon:not(.is-external),a:hover .ua-inline-icon:not(.is-external),a:focus-visible .ua-inline-icon:not(.is-external){transform:translateX(3px)!important}
a:hover .arrow-icon.is-external,a:focus-visible .arrow-icon.is-external,a:hover .ua-inline-icon.is-external,a:focus-visible .ua-inline-icon.is-external{transform:translate(2px,-2px)!important}
a:hover .down-icon,a:focus-visible .down-icon{transform:translateY(2px)!important}
.ua-icon-added{display:inline-flex!important;align-items:center!important;gap:10px!important}
@media (prefers-reduced-motion:reduce){.arrow-icon,.ua-inline-icon,.down-icon{transition:none!important}}
`;
document.head.appendChild(style);

const createSvg=(type)=>{
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('viewBox','0 0 20 20');
  svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  const paths=type==='external'
    ? ['M6 14 14 6','M8.5 6H14v5.5']
    : type==='down'
      ? ['M10 4v11','m5-5-5 5-5-5']
      : ['M4 10h12','m-5-5 5 5-5 5'];
  paths.forEach((data)=>{
    const path=document.createElementNS(SVG_NS,'path');
    path.setAttribute('d',data);
    path.setAttribute('class','ua-icon-path');
    svg.appendChild(path);
  });
  return svg;
};

const isExternal=(element)=>{
  const anchor=element.closest('a[href]');
  if(!anchor)return false;
  if(anchor.target==='_blank')return true;
  try{
    const url=new URL(anchor.href,location.href);
    return /^https?:$/.test(url.protocol)&&url.origin!==location.origin;
  }catch{return false;}
};

const hydrateShell=(shell,type)=>{
  shell.replaceChildren(createSvg(type));
  shell.classList.add('ua-icon-shell');
  shell.classList.toggle('is-external',type==='external');
  shell.setAttribute('aria-hidden','true');
};

document.querySelectorAll('.arrow-icon').forEach((shell)=>hydrateShell(shell,isExternal(shell)?'external':'right'));
document.querySelectorAll('.down-icon').forEach((shell)=>hydrateShell(shell,'down'));

const arrowPattern=/\s*(?:↗|→|➜|➡|⟶|›|»|❯)\s*$/u;
const candidates=document.querySelectorAll('a,button');

candidates.forEach((element)=>{
  if(element.querySelector('.arrow-icon,.down-icon,.ua-inline-icon'))return;

  let generatedArrow=false;
  try{
    const before=getComputedStyle(element,'::before').content||'';
    const after=getComputedStyle(element,'::after').content||'';
    generatedArrow=/[↗→➜➡⟶›»❯]/u.test(`${before}${after}`);
  }catch{}

  const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
  const textNodes=[];
  while(walker.nextNode())textNodes.push(walker.currentNode);
  const trailing=[...textNodes].reverse().find((node)=>arrowPattern.test(node.nodeValue||''));

  if(!generatedArrow&&!trailing)return;
  if(generatedArrow)element.classList.add('ua-hide-generated-arrow');
  if(trailing)trailing.nodeValue=(trailing.nodeValue||'').replace(arrowPattern,'').trimEnd();

  const icon=document.createElement('span');
  const type=isExternal(element)?'external':'right';
  icon.className=`ua-inline-icon ua-icon-shell${type==='external'?' is-external':''}`;
  icon.setAttribute('aria-hidden','true');
  icon.appendChild(createSvg(type));
  element.appendChild(icon);
  element.classList.add('ua-icon-added');
});