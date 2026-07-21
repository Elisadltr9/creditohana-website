const banks = [
  {name:'Afirme', file:'Afirme_logo.svg.png'},
  {name:'Banregio', file:'Logo_de_Banregio.svg.png'},
  {name:'Ve por Más', file:'bpormas.png'},
  {name:'Banorte', file:'Logo_de_Banorte.svg.png'},
  {name:'Santander', file:'Banco_Santander_Logotipo.svg.png'},
  {name:'HSBC', file:'HSBC_logo_(2018).svg.png'},
  {name:'Scotiabank', file:'Scotiabank_logo.svg.png'},
  {name:'Banamex', file:'Banamex.svg.png'},
];
const bankGrid = document.getElementById('bankGrid');
banks.forEach((bank)=>{
  const card=document.createElement('div');
  card.className='bank-card';
  const img=document.createElement('img');
  img.src=`assets/banks/${bank.file}`;
  img.alt=`Institución financiera ${bank.name}`;
  img.loading='lazy';
  card.appendChild(img);
  bankGrid.appendChild(card);
});
const menu=document.querySelector('.nav-links');
document.querySelector('.menu-toggle').addEventListener('click',e=>{
  menu.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded',menu.classList.contains('open'));
});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
document.querySelectorAll('.premium-accordion').forEach(accordion=>{
  const triggers=accordion.querySelectorAll('.accordion-trigger');
  triggers.forEach(trigger=>{
    const panel=document.getElementById(trigger.getAttribute('aria-controls'));
    if(!panel) return;
    if(trigger.getAttribute('aria-expanded')==='true') panel.classList.add('open');
    trigger.addEventListener('click',()=>{
      const isOpen=trigger.getAttribute('aria-expanded')==='true';
      triggers.forEach(other=>{
        const otherPanel=document.getElementById(other.getAttribute('aria-controls'));
        other.setAttribute('aria-expanded','false');
        if(otherPanel) otherPanel.classList.remove('open');
      });
      if(!isOpen){
        trigger.setAttribute('aria-expanded','true');
        panel.classList.add('open');
      }
    });
  });
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const counters=document.querySelectorAll('.counter');
const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const counter=entry.target;
    const target=Number(counter.dataset.target)||0;
    const suffix=counter.dataset.suffix||'';
    const duration=1200;
    const start=performance.now();
    const tick=now=>{
      const progress=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      counter.textContent=`${Math.round(target*eased)}${suffix}`;
      if(progress<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(counter);
  });
},{threshold:.45});
counters.forEach(counter=>counterObserver.observe(counter));
document.getElementById('year').textContent=new Date().getFullYear();
const estimatorForm=document.getElementById('mortgageEstimatorForm');
const propertyValueInput=document.getElementById('propertyValue');
const downPaymentAmountInput=document.getElementById('downPaymentAmount');
const downPaymentPercentInput=document.getElementById('downPaymentPercent');
const loanTermInput=document.getElementById('loanTerm');
const interestRateInput=document.getElementById('interestRate');
const estimatedLoanAmount=document.getElementById('estimatedLoanAmount');
const estimatedMonthlyPayment=document.getElementById('estimatedMonthlyPayment');
const estimatedDownPayment=document.getElementById('estimatedDownPayment');
const totalFinancedAmount=document.getElementById('totalFinancedAmount');
const estimatorCta=document.getElementById('estimatorCta');
const currencyFormat=new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0});
const formatCurrency=value=>currencyFormat.format(Number(value)||0);
const calculateMortgage=()=>{
  const propertyValue=Number(propertyValueInput.value)||0;
  const downPaymentAmount=Number(downPaymentAmountInput.value)||0;
  const downPaymentPercent=Number(downPaymentPercentInput.value)||0;
  const annualRate=Number(interestRateInput.value)||0;
  const termYears=Number(loanTermInput.value)||30;
  const downPayment=downPaymentAmount>0?downPaymentAmount:Math.min(propertyValue*(downPaymentPercent/100),propertyValue);
  const principal=Math.max(propertyValue-downPayment,0);
  const monthlyRate=annualRate/100/12;
  const payments=termYears*12;
  let monthlyPayment=0;
  if(monthlyRate===0){
    monthlyPayment=principal===0?0:principal/payments;
  }else{
    const factor=Math.pow(1+monthlyRate,payments);
    monthlyPayment=principal*monthlyRate*factor/(factor-1);
  }
  estimatedLoanAmount.textContent=formatCurrency(principal);
  estimatedMonthlyPayment.textContent=formatCurrency(monthlyPayment);
  estimatedDownPayment.textContent=formatCurrency(downPayment);
  totalFinancedAmount.textContent=formatCurrency(principal);
  if(estimatorCta){
    const message=`Hola Begoña, quiero una asesoría personalizada para mi simulación de crédito. Valor de la propiedad: ${formatCurrency(propertyValue)}. Enganche estimado: ${formatCurrency(downPayment)}. Plazo: ${termYears} años. Tasa anual estimada: ${annualRate.toFixed(2)}%. Monto estimado del préstamo: ${formatCurrency(principal)}. Pago mensual estimado: ${formatCurrency(monthlyPayment)}.`;
    estimatorCta.href=`https://wa.me/528713373335?text=${encodeURIComponent(message)}`;
  }
};
const syncDownPaymentFields=(source)=>{
  const propertyValue=Number(propertyValueInput.value)||0;
  if(source==='amount' && propertyValue>0){
    downPaymentPercentInput.value=((Number(downPaymentAmountInput.value)||0)/propertyValue*100).toFixed(2);
  }
  if(source==='percent' && propertyValue>0){
    downPaymentAmountInput.value=((Number(downPaymentPercentInput.value)||0)/100*propertyValue).toFixed(0);
  }
};
if(estimatorForm){
  [propertyValueInput,downPaymentAmountInput,downPaymentPercentInput,loanTermInput,interestRateInput].forEach(input=>{
    input.addEventListener('input',()=>{
      if(input===downPaymentAmountInput) syncDownPaymentFields('amount');
      if(input===downPaymentPercentInput) syncDownPaymentFields('percent');
      calculateMortgage();
    });
  });
  calculateMortgage();
}
document.getElementById('whatsappForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const text=`Hola Begoña, soy ${data.get('name')} de ${data.get('city')}. Me interesa: ${data.get('service')}. Monto aproximado: ${data.get('amount')||'por definir'}. ${data.get('message')||''}`;
  window.open(`https://wa.me/528713373335?text=${encodeURIComponent(text)}`,'_blank','noopener');
});
