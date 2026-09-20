
(function(){
  const root=document.documentElement;
  const langButtons=[...document.querySelectorAll('[data-lang]')];
  const storageKey='gurushala-global-study-pathways-v1';

  const $=id=>document.getElementById(id);
  const form=$('pathwayForm');
  const under18=$('under18');
  const minorNote=$('minorNote');
  const verifyChecks=[...document.querySelectorAll('[data-verify]')];
  const redFlagChecks=[...document.querySelectorAll('[data-redflag]')];
  const moneyIds=['duration','tuition','housing','living','health','travel','otherAnnual','setup','visaApplication','scholarship','governmentSupport','familyContribution','approvedLoan','partTime'];
  const textIds=['stage','field','destination','annualBudget'];
  const australiaPersistIds=['australiaBasis','australiaCustomLiving','australiaHousing','australiaCustomHousing','audInrRate'];
  const allPersistIds=[...moneyIds,...textIds,...australiaPersistIds];

  function num(id){
    const el=$(id);
    const v=parseFloat(el && el.value ? el.value : '0');
    return Number.isFinite(v)?v:0;
  }

  function t(gu,en,hi){
    return root.lang==='gu'?gu:root.lang==='hi'?hi:en;
  }

  function fmtLakh(value){
    const n=Number.isFinite(value)?Math.max(0,value):0;
    const formatted=n.toLocaleString('en-IN',{maximumFractionDigits:2});
    if(root.lang==='gu') return '₹'+formatted+' લાખ';
    if(root.lang==='hi') return '₹'+formatted+' लाख';
    return '₹'+formatted+' lakh';
  }

  function fmtAUD(value){
    const n=Number.isFinite(value)?Math.max(0,value):0;
    return 'AUD $'+n.toLocaleString('en-AU',{maximumFractionDigits:0});
  }

  function setLang(lang){
    root.lang=lang;
    langButtons.forEach(btn=>{
      const active=btn.dataset.lang===lang;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',String(active));
    });
    try{localStorage.setItem('gurushala-lang',lang);}catch(e){}
    renderBudget();
    renderAustraliaEstimate();
    renderSummary(false);
  }

  langButtons.forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));

  function renderBudget(){
    const years=Math.max(.5,num('duration')||0);
    const annual=num('tuition')+num('housing')+num('living')+num('health')+num('travel')+num('otherAnnual');
    const total=annual*years+num('setup')+num('visaApplication');
    const funding=num('scholarship')+num('governmentSupport')+num('familyContribution')+num('approvedLoan');
    const gap=Math.max(0,total-funding);
    if($('totalCost')) $('totalCost').textContent=fmtLakh(total);
    if($('confirmedFunding')) $('confirmedFunding').textContent=fmtLakh(funding);
    if($('fundingGap')) $('fundingGap').textContent=fmtLakh(gap);
    return {years,annual,total,funding,gap,partTime:num('partTime')};
  }

  function australiaValues(){
    const basis=$('australiaBasis');
    const housingSelect=$('australiaHousing');
    const annualLiving=basis && basis.value==='custom'
      ? num('australiaCustomLiving')
      : parseFloat((basis && basis.value)||'0');
    const housingWeekly=housingSelect && housingSelect.value==='custom'
      ? num('australiaCustomHousing')
      : parseFloat((housingSelect && housingSelect.value)||'0');
    const accommodationAnnual=Math.max(0,housingWeekly*52);
    const otherLiving=Math.max(0,annualLiving-accommodationAnnual);
    const visa=$('includeAustraliaVisaFee') && $('includeAustraliaVisaFee').checked ? 2500 : 0;
    const rate=num('audInrRate');
    return {annualLiving,housingWeekly,accommodationAnnual,otherLiving,visa,rate};
  }

  function syncAustraliaPanel(){
    if($('australiaEstimator')) $('australiaEstimator').hidden=false;
    if($('australiaCustomLivingWrap')) $('australiaCustomLivingWrap').hidden=$('australiaBasis')?.value!=='custom';
    if($('australiaCustomHousingWrap')) $('australiaCustomHousingWrap').hidden=$('australiaHousing')?.value!=='custom';
  }

  function renderAustraliaEstimate(){
    const output=$('australiaEstimateResult');
    if(!output) return;
    const a=australiaValues();

    if(!a.annualLiving){
      output.innerHTML='<p>'+t(
        'વાર્ષિક living-cost amount પસંદ કરો.',
        'Choose an annual living-cost amount.',
        'वार्षिक living-cost amount चुनें।'
      )+'</p>';
      return;
    }

    const weekly=a.annualLiving/52;
    const tooHigh=a.accommodationAnnual>a.annualLiving;
    const inrTotal=a.rate>0?a.annualLiving*a.rate/100000:0;

    output.innerHTML=
      '<div><span>'+t('વાર્ષિક living budget','Annual living budget','वार्षिक living budget')+'</span><strong>'+fmtAUD(a.annualLiving)+'</strong><small>'+fmtAUD(weekly)+' / week</small></div>'+
      '<div><span>'+t('Accommodation preset','Accommodation preset','Accommodation preset')+'</span><strong>'+fmtAUD(a.accommodationAnnual)+'</strong><small>'+fmtAUD(a.housingWeekly)+' / week</small></div>'+
      '<div><span>'+t('અન્ય living costs માટે બાકી','Remaining for other living costs','अन्य living costs के लिए शेष')+'</span><strong>'+fmtAUD(a.otherLiving)+'</strong><small>'+fmtAUD(a.otherLiving/52)+' / week</small></div>'+
      '<div><span>'+t('Student visa application charge','Student visa application charge','Student visa application charge')+'</span><strong>'+fmtAUD(a.visa)+'</strong><small>'+t('એક વખતનો ખર્ચ','one-time cost','एकमुश्त खर्च')+'</small></div>'+
      (a.rate>0?'<p class="estimate-inr">'+t('Reference INR equivalent: ','Reference INR equivalent: ','Reference INR equivalent: ')+fmtLakh(inrTotal)+'</p>':'')+
      (tooHigh?'<p class="estimate-warning">'+t(
        'પસંદ કરેલું accommodation જ annual living benchmark કરતાં વધુ છે. આ સંકેત છે કે official minimum આ યોજના માટે પૂરતું નથી.',
        'The selected accommodation alone exceeds the annual living benchmark. That is a sign the official minimum is not enough for this plan.',
        'चुना गया accommodation अकेले annual living benchmark से अधिक है। यह संकेत है कि official minimum इस योजना के लिए पर्याप्त नहीं है।'
      )+'</p>':'');
  }

  function applyAustraliaEstimate(){
    const a=australiaValues();
    if(a.rate<=0){
      window.alert(t(
        'AUD → INR reference rate ઉમેરો.',
        'Add an AUD → INR reference rate first.',
        'पहले AUD → INR reference rate जोड़ें।'
      ));
      return;
    }
    if($('housing')) $('housing').value=(a.accommodationAnnual*a.rate/100000).toFixed(2);
    if($('living')) $('living').value=(a.otherLiving*a.rate/100000).toFixed(2);
    if($('visaApplication')) $('visaApplication').value=(a.visa*a.rate/100000).toFixed(2);
    renderBudget();
    save();
    renderAustraliaEstimate();
  }

  function updateChecks(){
    const count=verifyChecks.filter(c=>c.checked).length;
    if($('verifyCount')) $('verifyCount').textContent=count+' / '+verifyChecks.length;
    const flags=redFlagChecks.filter(c=>c.checked).length;
    if($('flagAlert')) $('flagAlert').hidden=flags===0;

    let completed=0;
    if(($('stage')?.value||$('field')?.value||$('destination')?.value||$('annualBudget')?.value)) completed++;
    const b=renderBudget();
    if(b.total>0) completed++;
    if(count>0) completed++;
    let supportVisited=false;
    try{supportVisited=localStorage.getItem('gurushala-gsp-support-visited')==='1';}catch(e){}
    if(supportVisited||num('governmentSupport')>0) completed++;

    const pct=Math.round((completed/4)*100);
    if($('progressFill')) $('progressFill').style.width=pct+'%';
    if($('progressCopy')) $('progressCopy').textContent=completed+' / 4';
  }

  function collect(){
    return {
      version:2,
      stage:$('stage')?.value||'',
      field:$('field')?.value.trim()||'',
      destination:$('destination')?.value||'',
      annualBudget:$('annualBudget')?.value||'',
      under18:!!under18?.checked,
      includeAustraliaVisaFee:$('includeAustraliaVisaFee')?.checked!==false,
      values:Object.fromEntries(allPersistIds.map(id=>[id,$(id)?.value||''])),
      verify:verifyChecks.map(c=>c.checked),
      redFlags:redFlagChecks.map(c=>c.checked)
    };
  }

  function save(){
    try{localStorage.setItem(storageKey,JSON.stringify(collect()));}catch(e){}
  }

  function restore(){
    try{
      const raw=localStorage.getItem(storageKey);
      if(!raw) return;
      const data=JSON.parse(raw);
      if(data.values){
        Object.entries(data.values).forEach(([id,value])=>{
          if($(id)) $(id).value=value;
        });
      }
      if(typeof data.under18==='boolean' && under18) under18.checked=data.under18;
      if(typeof data.includeAustraliaVisaFee==='boolean' && $('includeAustraliaVisaFee')){
        $('includeAustraliaVisaFee').checked=data.includeAustraliaVisaFee;
      }
      (data.verify||[]).forEach((v,i)=>{if(verifyChecks[i]) verifyChecks[i].checked=!!v;});
      (data.redFlags||[]).forEach((v,i)=>{if(redFlagChecks[i]) redFlagChecks[i].checked=!!v;});
    }catch(e){}
  }

  function handleChange(){
    if(minorNote && under18) minorNote.hidden=!under18.checked;
    syncAustraliaPanel();
    renderAustraliaEstimate();
    updateChecks();
    save();
  }

  if(form){
    form.addEventListener('input',handleChange);
    form.addEventListener('change',handleChange);
  }

  $('previewAustraliaEstimate')?.addEventListener('click',renderAustraliaEstimate);
  $('applyAustraliaEstimate')?.addEventListener('click',applyAustraliaEstimate);

  ['australiaBasis','australiaCustomLiving','australiaHousing','australiaCustomHousing','audInrRate','includeAustraliaVisaFee'].forEach(id=>{
    $(id)?.addEventListener('input',()=>{syncAustraliaPanel();renderAustraliaEstimate();save();});
    $(id)?.addEventListener('change',()=>{syncAustraliaPanel();renderAustraliaEstimate();save();});
  });

  [...document.querySelectorAll('#government-support a')].forEach(link=>{
    link.addEventListener('click',()=>{
      try{localStorage.setItem('gurushala-gsp-support-visited','1');}catch(e){}
      updateChecks();
    });
  });

  function esc(s){
    return String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function renderSummary(scroll=true){
    const output=$('summaryOutput');
    if(!output) return;

    const hasAny=$('stage')?.value||$('field')?.value||$('destination')?.value||renderBudget().total>0;
    if(!hasAny){
      output.innerHTML='<p class="empty-summary">'+t(
        'ઉપરની માહિતી ભરો અને “Decision File બનાવો” દબાવો.',
        'Complete the sections above and select “Generate Decision File”.',
        'ऊपर की जानकारी भरें और “Decision File बनाएँ” चुनें।'
      )+'</p>';
      return;
    }

    const b=renderBudget();
    const verified=verifyChecks.filter(c=>c.checked).length;
    const flags=redFlagChecks.filter(c=>c.checked).length;
    const stage=$('stage')?.value||t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');
    const field=$('field')?.value.trim()||t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');
    const destination=$('destination')?.value||t('હજી નક્કી નથી','Not decided yet','अभी तय नहीं');
    const budget=$('annualBudget')?.value?fmtLakh(num('annualBudget')):t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');

    let warning='';
    if(flags>0){
      warning='<div class="summary-warning"><strong>STOP AND VERIFY</strong><br>'+t(
        flags+' red flag પસંદ થયા છે. પૈસા અથવા documents મોકલતા પહેલાં મૂળ સત્તાવાર સ્ત્રોતથી તપાસો.',
        flags+' red flag(s) are selected. Verify the original official source before sending money or documents.',
        flags+' red flag चुने गए हैं। पैसे या documents भेजने से पहले मूल आधिकारिक स्रोत जाँचें।'
      )+'</div>';
    }else{
      warning='<div class="summary-ok"><strong>'+t('Red flag પસંદ નથી','No red flags selected','कोई red flag चयनित नहीं')+'</strong><br>'+t(
        'તેમ છતાં, દરેક મહત્વપૂર્ણ claim સ્વતંત્ર રીતે ચકાસો.',
        'Continue to verify every important claim independently.',
        'फिर भी हर महत्वपूर्ण claim स्वतंत्र रूप से सत्यापित करें।'
      )+'</div>';
    }

    const minor=under18?.checked?'<div class="summary-warning"><strong>Under-18 check needed</strong><br>'+t(
      'વાલી સંમતિ, accommodation અને welfare/custodianship rules અલગથી તપાસવાના બાકી છે.',
      'Check parental consent, accommodation and welfare/custodianship rules for the destination.',
      'अभिभावक सहमति, accommodation और welfare/custodianship rules अलग से जाँचें।'
    )+'</div>':'';

    output.innerHTML=
      '<h4>'+t('મારો Global Study Decision File','My Global Study Decision File','मेरी Global Study Decision File')+'</h4>'+
      '<div class="summary-grid">'+
        '<div><span>'+t('હાલનો અભ્યાસ','Current stage','वर्तमान स्तर')+'</span><strong>'+esc(stage)+'</strong></div>'+
        '<div><span>'+t('વિષય/ક્ષેત્ર','Field of study','अध्ययन क्षेत्र')+'</span><strong>'+esc(field)+'</strong></div>'+
        '<div><span>'+t('વિચારતો દેશ','Destination being explored','विचाराधीन देश')+'</span><strong>'+esc(destination)+'</strong></div>'+
        '<div><span>'+t('પરિવારનું વાર્ષિક બજેટ','Family annual budget','परिवार वार्षिक बजट')+'</span><strong>'+esc(budget)+'</strong></div>'+
        '<div><span>'+t('અંદાજિત આખો અભ્યાસ ખર્ચ','Estimated whole-study cost','अनुमानित कुल अध्ययन लागत')+'</span><strong>'+fmtLakh(b.total)+'</strong></div>'+
        '<div><span>'+t('પુષ્ટિ થયેલ funding','Confirmed funding','पुष्ट funding')+'</span><strong>'+fmtLakh(b.funding)+'</strong></div>'+
        '<div><span>Funding gap</span><strong>'+fmtLakh(b.gap)+'</strong></div>'+
        '<div><span>Verification checks</span><strong>'+verified+' / '+verifyChecks.length+'</strong></div>'+
      '</div>'+
      '<p class="source-date">'+t(
        'Part-time કમાણી funding gapમાંથી ઘટાડવામાં આવી નથી. આ summary કોઈ admission, visa અથવા financial assessment નથી.',
        'Estimated part-time earnings are not deducted from the funding gap. This summary is not an admission, visa or financial assessment.',
        'अनुमानित part-time आय funding gap से नहीं घटाई गई है। यह summary admission, visa या financial assessment नहीं है।'
      )+'</p>'+minor+warning;

    if(scroll) output.scrollIntoView({behavior:'smooth',block:'start'});
  }

  $('generateSummary')?.addEventListener('click',()=>renderSummary(true));
  $('printSummary')?.addEventListener('click',()=>{
    renderSummary(false);
    window.print();
  });

  $('resetTool')?.addEventListener('click',()=>{
    const msg=t(
      'શું તમે તમારી આ પેજની entries સાફ કરવા માંગો છો?',
      'Clear your entries from this tool?',
      'क्या आप इस tool की entries साफ करना चाहते हैं?'
    );
    if(!window.confirm(msg)) return;

    try{
      localStorage.removeItem(storageKey);
      localStorage.removeItem('gurushala-gsp-support-visited');
    }catch(e){}

    form?.reset();
    if($('duration')) $('duration').value='3';
    if($('audInrRate')) $('audInrRate').value='68.25';
    if($('includeAustraliaVisaFee')) $('includeAustraliaVisaFee').checked=true;
    verifyChecks.forEach(c=>c.checked=false);
    redFlagChecks.forEach(c=>c.checked=false);
    if(minorNote) minorNote.hidden=true;
    syncAustraliaPanel();
    renderAustraliaEstimate();
    updateChecks();
    renderSummary(false);
  });

  restore();
  if(minorNote && under18) minorNote.hidden=!under18.checked;
  syncAustraliaPanel();
  setLang((()=>{try{return localStorage.getItem('gurushala-lang')||'gu';}catch(e){return 'gu';}})());
  renderAustraliaEstimate();
  updateChecks();
})();
