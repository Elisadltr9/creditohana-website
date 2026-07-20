const banks = [
  'afirme','mifel','actinver','banco-azteca','bancrea','banco-base','bineo','citi-mexico','banbajio','invex','banregio','ve-por-mas','bansi','monex','compartamos-banco','consubanco','sabadell','openbank','kapital-bank','revolut-bank','hey-banco','banco-plata','nu-mexico','volkswagen-bank','banorte','santander','hsbc','scotiabank','inbursa','banamex','bbva','j-p-morgan','bank-of-america','mufg-bank','barclays','icbc','shinhan-bank','mizuho-bank','bank-of-china-mexico','abc-capital','autofin-mexico','banco-covalto','banco-forjadores','banco-multiva','intercam-banco','banco-finterra','banco-s3','banco-donde','banco-pagatodo','uala'
];
const bankGrid = document.getElementById('bankGrid');
banks.forEach((slug,index)=>{
  const card=document.createElement('div');
  card.className='bank-card'+(index>14?' is-hidden':'');
  const img=document.createElement('img');
  img.src=`assets/banks/${slug}.svg`;
  img.alt=`Institución financiera ${slug.replaceAll('-',' ')}`;
  img.loading='lazy';
  card.appendChild(img);
  bankGrid.appendChild(card);
});
let expanded=false;
document.getElementById('toggleBanks').addEventListener('click',e=>{
  expanded=!expanded;
  document.querySelectorAll('.bank-card').forEach((card,index)=>{if(index>14) card.classList.toggle('is-hidden',!expanded)});
  e.currentTarget.textContent=expanded?'Ver menos instituciones':'Ver más instituciones';
});
const menu=document.querySelector('.nav-links');
document.querySelector('.menu-toggle').addEventListener('click',e=>{
  menu.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded',menu.classList.contains('open'));
});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('whatsappForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const text=`Hola Begoña, soy ${data.get('name')} de ${data.get('city')}. Me interesa: ${data.get('service')}. Monto aproximado: ${data.get('amount')||'por definir'}. ${data.get('message')||''}`;
  window.open(`https://wa.me/528713373335?text=${encodeURIComponent(text)}`,'_blank','noopener');
});
