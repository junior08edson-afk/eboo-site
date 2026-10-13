(() => {
const config=window.SITE_CONFIG||{};
const safe=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}};
const checkout=safe(config.checkoutUrl);
document.querySelectorAll('[data-checkout]').forEach(a=>{if(checkout){a.href=checkout}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true')}});
const legal=document.querySelector('#legal');
if(config.responsible){const p=document.createElement('p');p.textContent='Responsável: '+config.responsible;legal.append(p)}
if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail||'')){const a=document.createElement('a');a.href='mailto:'+config.supportEmail;a.textContent='Suporte';legal.append(a)}
for(const [key,label] of [['privacyUrl','Privacidade'],['termsUrl','Termos']]){const href=safe(config[key]);if(href){const a=document.createElement('a');a.href=href;a.textContent=label;legal.append(a)}}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('motion');const o=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))}
const sticky=document.querySelector('.sticky-buy'),initial=document.querySelector('#initial-buy'),footer=document.querySelector('footer'),videoFrame=document.querySelector('.video-frame');
const mainBuys=[...document.querySelectorAll('main [data-checkout]')];
let scheduled=false;
const intersects=r=>r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
function refreshSticky(){scheduled=false;const initialGone=initial.getBoundingClientRect().bottom<=0;const buyVisible=mainBuys.some(a=>intersects(a.getBoundingClientRect()));const footerVisible=intersects(footer.getBoundingClientRect());const videoVisible=intersects(videoFrame.getBoundingClientRect());sticky.hidden=!(innerWidth<=700&&initialGone&&!buyVisible&&!footerVisible&&!videoVisible);sticky.inert=sticky.hidden}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(refreshSticky)}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',schedule));refreshSticky();
const video=document.querySelector('#vsl'),start=document.querySelector('#video-start'),status=document.querySelector('#video-status');let hls,loading=false;
function fail(){status.hidden=false;status.textContent='Não foi possível carregar o vídeo. Verifique sua conexão e tente novamente.';start.hidden=false;start.disabled=false;start.querySelector('span:last-child').textContent='Tentar novamente';loading=false}
function loadLibrary(){return new Promise((resolve,reject)=>{if(window.Hls)return resolve();const s=document.createElement('script');s.src='vendor/hls.min.js';s.onload=resolve;s.onerror=reject;document.head.append(s)})}
start.addEventListener('click',async()=>{if(loading)return;loading=true;start.disabled=true;status.hidden=false;status.textContent='Carregando o vídeo…';try{if(video.canPlayType('application/vnd.apple.mpegurl')){video.src='media/vsl/index.m3u8';video.load()}else{await loadLibrary();if(!window.Hls.isSupported())throw Error('unsupported');hls?.destroy();hls=new window.Hls({maxBufferLength:20,maxMaxBufferLength:40,backBufferLength:15});hls.loadSource('media/vsl/index.m3u8');hls.attachMedia(video);hls.on(window.Hls.Events.ERROR,(_,data)=>{if(data.fatal){hls.destroy();fail()}})}
start.hidden=true;video.focus();await video.play();status.hidden=true;loading=false}catch{fail()}});
video.addEventListener('error',fail);video.addEventListener('playing',()=>{status.hidden=true;start.hidden=true});video.addEventListener('pause',schedule);video.addEventListener('play',schedule);
})();
