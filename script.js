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
if(bankGrid){
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
}
const menu=document.querySelector('.nav-links');
const menuToggle=document.querySelector('.menu-toggle');
if(menu && menuToggle){
  menuToggle.addEventListener('click',e=>{
    menu.classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded',menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
}
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
const yearElement=document.getElementById('year');
if(yearElement) yearElement.textContent=new Date().getFullYear();
const estimatorForm=document.getElementById('mortgageEstimatorForm');
const propertyValueInput=document.getElementById('propertyValue');
const downPaymentInput=document.getElementById('downPayment');
const downPaymentModeInput=document.getElementById('downPaymentMode');
const downPaymentSummary=document.getElementById('downPaymentSummary');
const downPaymentSummaryAmount=document.getElementById('downPaymentSummaryAmount');
const downPaymentModeButtons=document.querySelectorAll('[data-down-payment-mode]');
const loanTermInput=document.getElementById('loanTerm');
const loanTermButtons=document.querySelectorAll('[data-loan-term]');
const simulatorContactForm=document.getElementById('simulatorContactForm');
const estimatedLoanAmount=document.getElementById('estimatedLoanAmount');
const estimatedMonthlyPayment=document.getElementById('estimatedMonthlyPayment');
const estimatedDownPayment=document.getElementById('estimatedDownPayment');
const estimatedPropertyValue=document.getElementById('estimatedPropertyValue');
const estimatedDownPaymentPercent=document.getElementById('estimatedDownPaymentPercent');
const estimatedTerm=document.getElementById('estimatedTerm');
const estimatedPaymentCount=document.getElementById('estimatedPaymentCount');
const estimatedAnnualRate=document.getElementById('estimatedAnnualRate');
const estimatedMonthlyRate=document.getElementById('estimatedMonthlyRate');
const suggestedIncome=document.getElementById('suggestedIncome');
const estimatorError=document.getElementById('estimatorError');
const estimatorCta=document.getElementById('estimatorCta');
// Tasa ilustrativa configurable. No representa una oferta, aprobación ni tasa autorizada.
const CONFIGURACION_HIPOTECARIA={
  tasaAnualReferencial:10.75,
  porcentajeIngresoReferencia:0.30,
  plazoMaximo:25
};
const formatoMoneda=new Intl.NumberFormat("es-MX",{
  style:"currency",
  currency:"MXN",
  maximumFractionDigits:0
});
const formatCurrency=value=>`${formatoMoneda.format(Number.isFinite(value)?value:0)} MXN`;
const formatRate=(value,digits=2)=>`${(Number.isFinite(value)?value:0).toFixed(digits)}%`;
const setText=(element,value)=>{
  if(element) element.textContent=value;
};
let currentDownPaymentMode=downPaymentModeInput?.value||'amount';
const parseAmount=value=>{
  const clean=String(value||'').replace(/[^\d.-]/g,'');
  const number=Number(clean);
  return Number.isFinite(number)?number:0;
};
const formatCurrencyInput=input=>{
  if(input) input.value=formatCurrency(Math.max(parseAmount(input.value),0));
};
const formatDownPaymentInput=()=>{
  if(!downPaymentInput) return;
  const value=parseAmount(downPaymentInput.value);
  downPaymentInput.value=downPaymentModeInput?.value==='percent'
    ? `${Math.min(Math.max(value,0),99).toFixed(2)}%`
    : formatCurrency(Math.max(value,0));
};
const syncDownPaymentModeButtons=()=>{
  downPaymentModeButtons.forEach(button=>{
    const isActive=button.dataset.downPaymentMode===downPaymentModeInput?.value;
    button.classList.toggle('active',isActive);
    button.setAttribute('aria-pressed',String(isActive));
  });
};
const syncLoanTermButtons=()=>{
  loanTermButtons.forEach(button=>{
    const isActive=button.dataset.loanTerm===loanTermInput?.value;
    button.classList.toggle('active',isActive);
    button.setAttribute('aria-checked',String(isActive));
    button.tabIndex=isActive?0:-1;
  });
};
const calcularTasaMensual=tasaAnual=>(Number(tasaAnual)||0)/100/12;
const calcularMensualidadHipotecaria=({montoFinanciado,tasaAnual,numeroDePagos})=>{
  const principal=Math.max(Number(montoFinanciado)||0,0);
  const pagos=Math.max(Number(numeroDePagos)||0,0);
  if(pagos<=0) return 0;
  const tasaMensual=calcularTasaMensual(tasaAnual);
  if(tasaMensual===0) return principal/pagos;
  const factorCapitalizacion=Math.pow(1+tasaMensual,pagos);
  return principal*(tasaMensual*factorCapitalizacion)/(factorCapitalizacion-1);
};
const getEstimatorValues=()=>{
  const valorInmueble=Math.max(parseAmount(propertyValueInput?.value),0);
  const plazoEnAnios=Number(loanTermInput?.value)||20;
  let enganchePesos=0;
  if(downPaymentModeInput?.value==='percent'){
    const porcentaje=Math.min(Math.max(parseAmount(downPaymentInput?.value),0),99);
    enganchePesos=valorInmueble*(porcentaje/100);
  }else{
    enganchePesos=Math.min(Math.max(parseAmount(downPaymentInput?.value),0),valorInmueble);
  }
  const porcentajeEnganche=valorInmueble>0?enganchePesos/valorInmueble*100:0;
  const montoFinanciado=Math.max(valorInmueble-enganchePesos,0);
  const numeroDePagos=plazoEnAnios*12;
  const tasaAnual=CONFIGURACION_HIPOTECARIA.tasaAnualReferencial;
  const tasaMensual=calcularTasaMensual(tasaAnual);
  const mensualidad=calcularMensualidadHipotecaria({
    montoFinanciado,
    tasaAnual,
    numeroDePagos
  });
  const ingresoMensualReferencia=mensualidad/CONFIGURACION_HIPOTECARIA.porcentajeIngresoReferencia;
  return {
    valorInmueble,
    plazoEnAnios,
    enganchePesos,
    porcentajeEnganche,
    montoFinanciado,
    tasaAnual,
    tasaMensual,
    numeroDePagos,
    mensualidad,
    ingresoMensualReferencia
  };
};
const calculateMortgage=()=>{
  const values=getEstimatorValues();
  const errors=[];
  if(values.valorInmueble<=0) errors.push('El valor del inmueble debe ser mayor que cero.');
  if(values.plazoEnAnios>CONFIGURACION_HIPOTECARIA.plazoMaximo) errors.push('El plazo no puede superar 25 años.');
  if(![5,10,15,20,25].includes(values.plazoEnAnios)) errors.push('Selecciona un plazo válido de 5, 10, 15, 20 o 25 años.');
  if(values.enganchePesos>values.valorInmueble) errors.push('El enganche no puede ser mayor al valor del inmueble.');
  if([values.montoFinanciado,values.tasaMensual,values.mensualidad,values.ingresoMensualReferencia].some(value=>!Number.isFinite(value) || value<0)) errors.push('Revisa los datos capturados para generar una estimación válida.');
  if(downPaymentInput && downPaymentModeInput?.value==='amount' && parseAmount(downPaymentInput.value)>values.valorInmueble){
    downPaymentInput.value=formatCurrency(values.valorInmueble);
  }
  setText(estimatorError,errors.join(' '));
  if(errors.length){
    if(estimatorCta) estimatorCta.setAttribute('aria-disabled','true');
  }else if(estimatorCta){
    estimatorCta.removeAttribute('aria-disabled');
  }
  setText(estimatedPropertyValue,formatCurrency(values.valorInmueble));
  setText(estimatedLoanAmount,formatCurrency(values.montoFinanciado));
  setText(estimatedMonthlyPayment,formatCurrency(errors.length?0:values.mensualidad));
  setText(estimatedDownPayment,formatCurrency(values.enganchePesos));
  setText(estimatedDownPaymentPercent,`${values.porcentajeEnganche.toFixed(2)}%`);
  setText(downPaymentSummaryAmount,formatCurrency(values.enganchePesos));
  setText(downPaymentSummary,`${values.porcentajeEnganche.toFixed(2)}% del valor del inmueble`);
  setText(estimatedTerm,`${values.plazoEnAnios} años`);
  setText(estimatedPaymentCount,`${values.numeroDePagos} mensualidades`);
  setText(estimatedAnnualRate,formatRate(values.tasaAnual,2));
  setText(estimatedMonthlyRate,formatRate(values.tasaMensual*100,4));
  setText(suggestedIncome,formatCurrency(errors.length?0:values.ingresoMensualReferencia));
  if(estimatorCta){
    const message=`Hola Begoña, quiero una asesoría personalizada para mi simulación de crédito hipotecario. Valor del inmueble: ${formatCurrency(values.valorInmueble)}. Enganche: ${formatCurrency(values.enganchePesos)} (${values.porcentajeEnganche.toFixed(2)}%). Monto financiado estimado: ${formatCurrency(values.montoFinanciado)}. Tasa anual referencial utilizada: ${formatRate(values.tasaAnual,2)}. Tasa mensual utilizada: ${formatRate(values.tasaMensual*100,4)}. Plazo: ${values.plazoEnAnios} años. Número de mensualidades: ${values.numeroDePagos}. Mensualidad estimada: ${formatCurrency(values.mensualidad)}.`;
    estimatorCta.href=`https://wa.me/528713373335?text=${encodeURIComponent(message)}`;
  }
};
if(estimatorForm){
  [propertyValueInput,downPaymentInput,loanTermInput].forEach(input=>{
    const updateEstimator=()=>calculateMortgage();
    input.addEventListener('input',updateEstimator);
    input.addEventListener('change',updateEstimator);
    input.addEventListener('blur',()=>{
      if(input===propertyValueInput) formatCurrencyInput(propertyValueInput);
      if(input===downPaymentInput) formatDownPaymentInput();
      calculateMortgage();
    });
  });
  downPaymentModeInput.addEventListener('change',()=>{
    const valorInmueble=Math.max(parseAmount(propertyValueInput?.value),0);
    const rawDownPayment=parseAmount(downPaymentInput?.value);
    const enganchePesos=currentDownPaymentMode==='percent'
      ? valorInmueble*(Math.min(Math.max(rawDownPayment,0),99)/100)
      : Math.min(Math.max(rawDownPayment,0),valorInmueble);
    currentDownPaymentMode=downPaymentModeInput.value;
    downPaymentInput.value=currentDownPaymentMode==='percent'
      ? `${(valorInmueble>0?enganchePesos/valorInmueble*100:0).toFixed(2)}%`
      : formatCurrency(enganchePesos);
    calculateMortgage();
    syncDownPaymentModeButtons();
  });
  downPaymentModeButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      if(!downPaymentModeInput || button.dataset.downPaymentMode===downPaymentModeInput.value) return;
      downPaymentModeInput.value=button.dataset.downPaymentMode;
      downPaymentModeInput.dispatchEvent(new Event('change',{bubbles:true}));
    });
  });
  loanTermButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      loanTermInput.value=button.dataset.loanTerm;
      syncLoanTermButtons();
      calculateMortgage();
    });
    button.addEventListener('keydown',event=>{
      if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const buttons=Array.from(loanTermButtons);
      const currentIndex=buttons.indexOf(button);
      const direction=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
      const nextIndex=(currentIndex+direction+buttons.length)%buttons.length;
      buttons[nextIndex].focus();
      buttons[nextIndex].click();
    });
  });
  loanTermInput.addEventListener('change',syncLoanTermButtons);
  syncDownPaymentModeButtons();
  syncLoanTermButtons();
  calculateMortgage();
}
if(simulatorContactForm){
  simulatorContactForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const message=[
      'Hola Begoña, quiero solicitar una asesoría personalizada de CREDITOHANA.',
      `Nombre completo: ${data.get('name')}.`,
      `WhatsApp: ${data.get('whatsapp')}.`,
      `Correo electrónico: ${data.get('email')}.`,
      `Ciudad o estado: ${data.get('city')}.`,
      `Valor aproximado del inmueble capturado: ${data.get('propertyEstimate')||'No especificado'}.`,
      `Mensaje: ${data.get('message')||'Sin mensaje adicional'}.`,
      'Resultado actual del simulador:',
      `Valor del inmueble: ${estimatedPropertyValue?.textContent||'No disponible'}.`,
      `Enganche: ${estimatedDownPayment?.textContent||'No disponible'} (${estimatedDownPaymentPercent?.textContent||'No disponible'}).`,
      `Monto financiado estimado: ${estimatedLoanAmount?.textContent||'No disponible'}.`,
      `Tasa anual utilizada: ${estimatedAnnualRate?.textContent||'No disponible'}.`,
      `Tasa mensual utilizada: ${estimatedMonthlyRate?.textContent||'No disponible'}.`,
      `Plazo: ${estimatedTerm?.textContent||'No disponible'}.`,
      `Número de mensualidades: ${estimatedPaymentCount?.textContent||'No disponible'}.`,
      `Mensualidad estimada: ${estimatedMonthlyPayment?.textContent||'No disponible'}.`,
      `Ingreso mensual sugerido: ${suggestedIncome?.textContent||'No disponible'}.`
    ].join(' ');
    window.open(`https://wa.me/528713373335?text=${encodeURIComponent(message)}`,'_blank','noopener');
  });
}
const whatsappForm=document.getElementById('whatsappForm');
if(whatsappForm){
  whatsappForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const fields=[
      'Hola Begoña, quiero solicitar asesoría personalizada de CREDITOHANA.',
      `Nombre completo: ${data.get('name')}.`,
      data.get('whatsapp')?`WhatsApp: ${data.get('whatsapp')}.`:null,
      data.get('email')?`Correo electrónico: ${data.get('email')}.`:null,
      `Ciudad o estado: ${data.get('city')}.`,
      data.get('service')?`Me interesa: ${data.get('service')}.`:null,
      `Valor aproximado del inmueble: ${data.get('propertyEstimate')||data.get('amount')||'por definir'}.`,
      data.get('message')?`Mensaje: ${data.get('message')}.`:null
    ].filter(Boolean);
    window.open(`https://wa.me/528713373335?text=${encodeURIComponent(fields.join(' '))}`,'_blank','noopener');
  });
}
