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
const institutionRateInput=document.getElementById('institutionRate');
const selectedInstitutionNote=document.getElementById('selectedInstitutionNote');
const annualRateInput=document.getElementById('annualRate');
const debtRatioInput=document.getElementById('debtRatio');
const debtRatioButtons=document.querySelectorAll('[data-debt-ratio]');
const lifeInsuranceRateInput=document.getElementById('lifeInsuranceRate');
const propertyInsuranceRateInput=document.getElementById('propertyInsuranceRate');
const monthlyCommissionInput=document.getElementById('monthlyCommission');
const simulatorContactForm=document.getElementById('simulatorContactForm');
const estimatedLoanAmount=document.getElementById('estimatedLoanAmount');
const estimatedMonthlyPayment=document.getElementById('estimatedMonthlyPayment');
const estimatedPrincipalInterest=document.getElementById('estimatedPrincipalInterest');
const estimatedInsuranceTotal=document.getElementById('estimatedInsuranceTotal');
const estimatedLifeInsurance=document.getElementById('estimatedLifeInsurance');
const estimatedPropertyInsurance=document.getElementById('estimatedPropertyInsurance');
const estimatedMonthlyCommission=document.getElementById('estimatedMonthlyCommission');
const estimatedDownPayment=document.getElementById('estimatedDownPayment');
const estimatedPropertyValue=document.getElementById('estimatedPropertyValue');
const estimatedDownPaymentPercent=document.getElementById('estimatedDownPaymentPercent');
const estimatedTerm=document.getElementById('estimatedTerm');
const estimatedPaymentCount=document.getElementById('estimatedPaymentCount');
const estimatedAnnualRate=document.getElementById('estimatedAnnualRate');
const estimatedMonthlyRate=document.getElementById('estimatedMonthlyRate');
const estimatedDebtRatio=document.getElementById('estimatedDebtRatio');
const suggestedIncome=document.getElementById('suggestedIncome');
const estimatorError=document.getElementById('estimatorError');
const estimatorCta=document.getElementById('estimatorCta');
const amortizationTableBody=document.getElementById('amortizationTableBody');
// Tasa ilustrativa configurable. No representa una oferta, aprobación ni tasa autorizada.
const CONFIGURACION_HIPOTECARIA={
  tasaAnualReferencial:10.75,
  porcentajeEndeudamientoReferencia:0.35,
  plazoMaximo:25
};
const OPCIONES_HIPOTECARIAS=[
  {
    id:'referencia-creditohana',
    nombre:'Referencia CREDITOHANA',
    tasaAnual:10.75,
    nota:'Caso base editable para validar capital e intereses a 20 años. No es oferta vinculante.'
  },
  {
    id:'banxico-promedio-jul-2026',
    nombre:'Banxico promedio bancos julio 2026',
    tasaAnual:11.34,
    nota:'Banxico SIE CF303: créditos hipotecarios bancarios en pesos a tasa fija, julio 2026. Mínimo 9.00%, promedio 11.34%, máximo 21.13%.'
  },
  {
    id:'banxico-minimo-jul-2026',
    nombre:'Banxico mínimo bancos julio 2026',
    tasaAnual:9.00,
    nota:'Banxico SIE CF303: tasa mínima bancaria observada para créditos hipotecarios en pesos a tasa fija, julio 2026.'
  },
  {
    id:'banxico-maximo-jul-2026',
    nombre:'Banxico máximo bancos julio 2026',
    tasaAnual:21.13,
    nota:'Banxico SIE CF303: tasa máxima bancaria observada para créditos hipotecarios en pesos a tasa fija, julio 2026.'
  },
  {
    id:'bbva-hipoteca-fija',
    nombre:'BBVA Hipoteca Fija',
    tasaAnual:9.15,
    nota:'BBVA México publica tasa anual fija desde 9.15% y CAT promedio 13.3% sin IVA. La tasa aplicable depende del perfil.'
  },
  {
    id:'banorte-hipoteca-simple',
    nombre:'Banorte Hipoteca Simple',
    tasaAnual:9.20,
    nota:'Banorte publica tasa ordinaria anual fija de 9.20% y CAT promedio 11.4% sin IVA para Hipoteca Simple.'
  },
  {
    id:'santander-hipoteca',
    nombre:'Santander Hipoteca',
    tasaAnual:9.90,
    nota:'Santander publica tasa anual ordinaria fija desde 9.90% y hasta 13.25%, sujeta al perfil del cliente.'
  },
  {
    id:'hsbc-pago-fijo',
    nombre:'HSBC Pago Fijo',
    tasaAnual:9.95,
    nota:'HSBC México publica tasa fija anual de 9.95% a 12.25% para Crédito Hipotecario Pago Fijo.'
  },
  {
    id:'infonavit-tradicional',
    nombre:'Infonavit tradicional',
    tasaAnual:10.45,
    nota:'Infonavit publica tasa diferenciada por nivel salarial, fija durante la vida del crédito, de 3.69% a 10.45%. Se precarga el extremo superior.'
  },
  {
    id:'fovissste-pesos',
    nombre:'FOVISSSTE en pesos',
    tasaAnual:8.00,
    nota:'FOVISSSTE publica tasa fija en pesos del 8% al 11%. Se precarga el extremo inferior.'
  },
  {
    id:'personalizada',
    nombre:'Tasa personalizada',
    tasaAnual:10.75,
    nota:'Captura manualmente la tasa anual nominal que quieras simular.'
  }
];
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
const getSelectedInstitution=()=>OPCIONES_HIPOTECARIAS.find(option=>option.id===institutionRateInput?.value) || OPCIONES_HIPOTECARIAS[0];
const populateInstitutionOptions=()=>{
  if(!institutionRateInput || institutionRateInput.options.length) return;
  institutionRateInput.innerHTML=OPCIONES_HIPOTECARIAS.map(option=>`<option value="${option.id}">${option.nombre} (${formatRate(option.tasaAnual,2)})</option>`).join('');
  institutionRateInput.value=OPCIONES_HIPOTECARIAS[0].id;
};
const updateInstitutionNote=()=>{
  const option=getSelectedInstitution();
  setText(selectedInstitutionNote,option?.nota||'Tasa anual de referencia editable. No representa aprobación ni oferta de crédito.');
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
const formatPercentInput=(input,digits=2)=>{
  if(input) input.value=formatRate(Math.max(parseAmount(input.value),0),digits);
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
const syncDebtRatioButtons=()=>{
  debtRatioButtons.forEach(button=>{
    const isActive=button.dataset.debtRatio===debtRatioInput?.value;
    button.classList.toggle('active',isActive);
    button.setAttribute('aria-pressed',String(isActive));
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
  const tasaAnual=Math.max(parseAmount(annualRateInput?.value)||CONFIGURACION_HIPOTECARIA.tasaAnualReferencial,0);
  const tasaMensual=calcularTasaMensual(tasaAnual);
  const mensualidadCapitalIntereses=calcularMensualidadHipotecaria({
    montoFinanciado,
    tasaAnual,
    numeroDePagos
  });
  const tasaSeguroVidaAnual=Math.max(parseAmount(lifeInsuranceRateInput?.value),0);
  const tasaSeguroDanosAnual=Math.max(parseAmount(propertyInsuranceRateInput?.value),0);
  const seguroVidaMensual=montoFinanciado*(tasaSeguroVidaAnual/100)/12;
  const seguroDanosMensual=valorInmueble*(tasaSeguroDanosAnual/100)/12;
  const comisionMensual=Math.max(parseAmount(monthlyCommissionInput?.value),0);
  const segurosYComisionMensual=seguroVidaMensual+seguroDanosMensual+comisionMensual;
  const pagoMensualTotal=mensualidadCapitalIntereses+segurosYComisionMensual;
  const porcentajeEndeudamiento=Math.max(Number(debtRatioInput?.value)||CONFIGURACION_HIPOTECARIA.porcentajeEndeudamientoReferencia,0.01);
  const ingresoMensualReferencia=pagoMensualTotal/porcentajeEndeudamiento;
  return {
    valorInmueble,
    plazoEnAnios,
    enganchePesos,
    porcentajeEnganche,
    montoFinanciado,
    tasaAnual,
    tasaMensual,
    tasaSeguroVidaAnual,
    tasaSeguroDanosAnual,
    seguroVidaMensual,
    seguroDanosMensual,
    comisionMensual,
    segurosYComisionMensual,
    mensualidadCapitalIntereses,
    pagoMensualTotal,
    porcentajeEndeudamiento,
    numeroDePagos,
    ingresoMensualReferencia
  };
};
const buildAmortizationRows=values=>{
  const rows=[];
  let saldo=Math.max(values.montoFinanciado,0);
  for(let periodo=1;periodo<=values.numeroDePagos && saldo>0.005;periodo+=1){
    const saldoInicial=saldo;
    const interes=saldoInicial*values.tasaMensual;
    const amortizacion=Math.min(Math.max(values.mensualidadCapitalIntereses-interes,0),saldoInicial);
    const saldoFinal=Math.max(saldoInicial-amortizacion,0);
    const seguroVida=saldoInicial*(values.tasaSeguroVidaAnual/100)/12;
    const seguros=seguroVida+values.seguroDanosMensual+values.comisionMensual;
    const pagoCapitalIntereses=interes+amortizacion;
    const pagoTotal=pagoCapitalIntereses+seguros;
    rows.push({
      periodo,
      saldoInicial,
      interes,
      amortizacion,
      seguros,
      pagoTotal,
      saldoFinal
    });
    saldo=saldoFinal;
  }
  return rows;
};
const renderAmortizationTable=(values,errors=[])=>{
  if(!amortizationTableBody) return;
  if(errors.length || values.montoFinanciado<=0){
    amortizationTableBody.innerHTML='<tr><td colspan="7">Captura datos válidos para generar la tabla.</td></tr>';
    return;
  }
  const rows=buildAmortizationRows(values);
  amortizationTableBody.innerHTML=rows.map(row=>`
    <tr>
      <td>${row.periodo}</td>
      <td>${formatCurrency(row.saldoInicial)}</td>
      <td>${formatCurrency(row.interes)}</td>
      <td>${formatCurrency(row.amortizacion)}</td>
      <td>${formatCurrency(row.seguros)}</td>
      <td>${formatCurrency(row.pagoTotal)}</td>
      <td>${formatCurrency(row.saldoFinal)}</td>
    </tr>
  `).join('');
};
const calculateMortgage=()=>{
  const values=getEstimatorValues();
  const errors=[];
  if(values.valorInmueble<=0) errors.push('El valor del inmueble debe ser mayor que cero.');
  if(values.plazoEnAnios>CONFIGURACION_HIPOTECARIA.plazoMaximo) errors.push('El plazo no puede superar 25 años.');
  if(![5,10,15,20,25].includes(values.plazoEnAnios)) errors.push('Selecciona un plazo válido de 5, 10, 15, 20 o 25 años.');
  if(values.enganchePesos>values.valorInmueble) errors.push('El enganche no puede ser mayor al valor del inmueble.');
  if([values.montoFinanciado,values.tasaMensual,values.mensualidadCapitalIntereses,values.pagoMensualTotal,values.ingresoMensualReferencia].some(value=>!Number.isFinite(value) || value<0)) errors.push('Revisa los datos capturados para generar una estimación válida.');
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
  setText(estimatedMonthlyPayment,formatCurrency(errors.length?0:values.pagoMensualTotal));
  setText(estimatedPrincipalInterest,formatCurrency(errors.length?0:values.mensualidadCapitalIntereses));
  setText(estimatedInsuranceTotal,formatCurrency(errors.length?0:values.segurosYComisionMensual));
  setText(estimatedLifeInsurance,formatCurrency(errors.length?0:values.seguroVidaMensual));
  setText(estimatedPropertyInsurance,formatCurrency(errors.length?0:values.seguroDanosMensual));
  setText(estimatedMonthlyCommission,formatCurrency(errors.length?0:values.comisionMensual));
  setText(estimatedDownPayment,formatCurrency(values.enganchePesos));
  setText(estimatedDownPaymentPercent,`${values.porcentajeEnganche.toFixed(2)}%`);
  setText(downPaymentSummaryAmount,formatCurrency(values.enganchePesos));
  setText(downPaymentSummary,`${values.porcentajeEnganche.toFixed(2)}% del valor del inmueble`);
  setText(estimatedTerm,`${values.plazoEnAnios} años`);
  setText(estimatedPaymentCount,`${values.numeroDePagos} mensualidades`);
  setText(estimatedAnnualRate,formatRate(values.tasaAnual,2));
  setText(estimatedMonthlyRate,formatRate(values.tasaMensual*100,4));
  setText(estimatedDebtRatio,formatRate(values.porcentajeEndeudamiento*100,0));
  setText(suggestedIncome,formatCurrency(errors.length?0:values.ingresoMensualReferencia));
  renderAmortizationTable(values,errors);
  if(estimatorCta){
    const message=`Hola Begoña, quiero una asesoría personalizada para mi simulación de crédito hipotecario. Valor del inmueble: ${formatCurrency(values.valorInmueble)}. Enganche: ${formatCurrency(values.enganchePesos)} (${values.porcentajeEnganche.toFixed(2)}%). Monto financiado estimado: ${formatCurrency(values.montoFinanciado)}. Tasa anual referencial utilizada: ${formatRate(values.tasaAnual,2)}. Tasa mensual equivalente: ${formatRate(values.tasaMensual*100,4)}. Plazo: ${values.plazoEnAnios} años. Número de mensualidades: ${values.numeroDePagos}. Capital e intereses: ${formatCurrency(values.mensualidadCapitalIntereses)}. Seguros y comisión mensual: ${formatCurrency(values.segurosYComisionMensual)}. Pago mensual total estimado: ${formatCurrency(values.pagoMensualTotal)}. Ingreso de referencia con ${formatRate(values.porcentajeEndeudamiento*100,0)} de endeudamiento: ${formatCurrency(values.ingresoMensualReferencia)}.`;
    estimatorCta.href=`https://wa.me/528713373335?text=${encodeURIComponent(message)}`;
  }
};
if(estimatorForm){
  populateInstitutionOptions();
  updateInstitutionNote();
  [propertyValueInput,downPaymentInput,loanTermInput,annualRateInput,lifeInsuranceRateInput,propertyInsuranceRateInput,monthlyCommissionInput,debtRatioInput].filter(Boolean).forEach(input=>{
    const updateEstimator=()=>calculateMortgage();
    input.addEventListener('input',updateEstimator);
    input.addEventListener('change',updateEstimator);
    input.addEventListener('blur',()=>{
      if(input===propertyValueInput) formatCurrencyInput(propertyValueInput);
      if(input===downPaymentInput) formatDownPaymentInput();
      if(input===annualRateInput) formatPercentInput(annualRateInput,2);
      if(input===lifeInsuranceRateInput) formatPercentInput(lifeInsuranceRateInput,2);
      if(input===propertyInsuranceRateInput) formatPercentInput(propertyInsuranceRateInput,2);
      if(input===monthlyCommissionInput) formatCurrencyInput(monthlyCommissionInput);
      calculateMortgage();
    });
  });
  institutionRateInput?.addEventListener('change',()=>{
    const option=getSelectedInstitution();
    if(annualRateInput) annualRateInput.value=formatRate(option.tasaAnual,2);
    updateInstitutionNote();
    calculateMortgage();
  });
  annualRateInput?.addEventListener('input',()=>{
    if(institutionRateInput && institutionRateInput.value!=='personalizada'){
      institutionRateInput.value='personalizada';
      updateInstitutionNote();
    }
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
  debtRatioButtons.forEach(button=>{
    button.addEventListener('click',()=>{
      if(!debtRatioInput) return;
      debtRatioInput.value=button.dataset.debtRatio;
      syncDebtRatioButtons();
      calculateMortgage();
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
  debtRatioInput?.addEventListener('change',syncDebtRatioButtons);
  syncDownPaymentModeButtons();
  syncLoanTermButtons();
  syncDebtRatioButtons();
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
      `Tasa mensual equivalente: ${estimatedMonthlyRate?.textContent||'No disponible'}.`,
      `Plazo: ${estimatedTerm?.textContent||'No disponible'}.`,
      `Número de mensualidades: ${estimatedPaymentCount?.textContent||'No disponible'}.`,
      `Capital e intereses: ${estimatedPrincipalInterest?.textContent||'No disponible'}.`,
      `Seguros y comisión mensual: ${estimatedInsuranceTotal?.textContent||'No disponible'}.`,
      `Pago mensual total estimado: ${estimatedMonthlyPayment?.textContent||'No disponible'}.`,
      `Ingreso mensual sugerido: ${suggestedIncome?.textContent||'No disponible'} con endeudamiento máximo de ${estimatedDebtRatio?.textContent||'No disponible'}.`
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
