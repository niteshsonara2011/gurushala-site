(function(){
  const root=document.documentElement;
  const $=id=>document.getElementById(id);
  const form=$('pathwayForm');
  const under18=$('under18');
  const minorNote=$('minorNote');
  const langButtons=[...document.querySelectorAll('[data-lang]')];
  const verifyChecks=[...document.querySelectorAll('[data-verify]')];
  const redFlagChecks=[...document.querySelectorAll('[data-redflag]')];
  const storageKey='gurushala-global-study-pathways-v2';

  const moneyIds=['duration','tuition','housing','living','health','travel','otherAnnual','setup','visaApplication','scholarship','governmentSupport','familyContribution','approvedLoan','partTime'];
  const textIds=['stage','field','destination','annualBudget'];
  const countryIds=['estimateCountry','countryBasis','countryCustomLiving','countryHousing','countryCustomHousing','countryInrRate'];
  const allPersistIds=[...moneyIds,...textIds,...countryIds];

  function t(gu,en,hi){return root.lang==='gu'?gu:root.lang==='hi'?hi:en;}
  function num(id){const el=$(id);const v=parseFloat(el&&el.value?el.value:'0');return Number.isFinite(v)?v:0;}
  function fmtLakh(v){
    const n=Number.isFinite(v)?Math.max(0,v):0;
    const s=n.toLocaleString('en-IN',{maximumFractionDigits:2});
    return root.lang==='gu'?'₹'+s+' લાખ':root.lang==='hi'?'₹'+s+' लाख':'₹'+s+' lakh';
  }
  function fmtMoney(currency,symbol,v){
    const n=Number.isFinite(v)?Math.max(0,v):0;
    return currency+' '+symbol+n.toLocaleString('en-US',{maximumFractionDigits:0});
  }

  const configs={
    'Australia':{
      currency:'AUD',symbol:'$',rate:68.25,fee:2500,housingUnit:'week',
      basis:[
        {value:29710,label:'AUD 29,710 — official financial-capacity benchmark'},
        {value:34167,label:'AUD 34,167 — benchmark + 15% planning buffer'},
        {value:38623,label:'AUD 38,623 — benchmark + 30% planning buffer'},
        {value:'custom',label:'Custom annual living estimate'}
      ],
      housing:[
        {value:200,label:'AUD 200/week — lower-cost shared planning point'},
        {value:300,label:'AUD 300/week — moderate shared planning point'},
        {value:400,label:'AUD 400/week — higher shared / managed / homestay point'},
        {value:500,label:'AUD 500/week — higher-cost / private planning point'},
        {value:'custom',label:'Custom weekly accommodation'}
      ],
      source:'https://www.studyaustralia.gov.au/en/plan-your-move/visa-application-process',
      guidance:{
        gu:'Study Australia હાલમાં એક વિદ્યાર્થી માટે <strong>AUD 29,710</strong> living financial-capacity benchmark દર્શાવે છે. આ actual living-cost promise નથી, અને વાસ્તવિક ખર્ચ વધુ હોઈ શકે છે.',
        en:'Study Australia currently states a <strong>AUD 29,710</strong> living financial-capacity benchmark for one student. This is not an actual-cost promise, and real living costs can be higher.',
        hi:'Study Australia वर्तमान में एक विद्यार्थी के लिए <strong>AUD 29,710</strong> living financial-capacity benchmark बताता है। यह वास्तविक खर्च की गारंटी नहीं है।'
      },
      feeLabel:{
        gu:'Standard primary Student visa application charge AUD 2,500 ઉમેરો, જ્યાં exemption/concession લાગુ ન પડે.',
        en:'Include the standard primary Student visa application charge of AUD 2,500, where no exemption/concession applies.',
        hi:'Standard primary Student visa application charge AUD 2,500 जोड़ें, जहाँ exemption/concession लागू न हो।'
      },
      note:{
        gu:'Official benchmark અને actual living cost અલગ છે. Tuition, OSHC, flights અને course-specific costs અલગ ઉમેરો.',
        en:'The official benchmark and actual living cost are different. Add tuition, OSHC, flights and course-specific costs separately.',
        hi:'Official benchmark और actual living cost अलग हैं। Tuition, OSHC, flights और course-specific costs अलग जोड़ें।'
      }
    },
    'Canada':{
      currency:'CAD',symbol:'$',rate:68.45,fee:150,housingUnit:'month',
      basis:[
        {value:23448,label:'CAD 23,448 — official living requirement from 1 Sep 2026'},
        {value:26965,label:'CAD 26,965 — official amount + 15% planning buffer'},
        {value:30482,label:'CAD 30,482 — official amount + 30% planning buffer'},
        {value:'custom',label:'Custom annual living estimate'}
      ],
      housing:[
        {value:500,label:'CAD 500/month — lower official housing estimate'},
        {value:1000,label:'CAD 1,000/month — moderate planning point'},
        {value:1500,label:'CAD 1,500/month — higher planning point'},
        {value:2000,label:'CAD 2,000/month — upper official general estimate'},
        {value:'custom',label:'Custom monthly accommodation'}
      ],
      source:'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html',
      guidance:{
        gu:'1 સપ્ટેમ્બર 2026થી, Quebec સિવાય Canada માટે એક વિદ્યાર્થીનું official first-year living requirement <strong>CAD 23,448</strong> છે. Tuition અને transportation આમાં સામેલ નથી. Quebec ના નિયમો અલગ છે.',
        en:'From 1 September 2026, Canada requires <strong>CAD 23,448</strong> for one student’s first-year living expenses outside Quebec. Tuition and transportation are excluded. Quebec has separate rules.',
        hi:'1 सितंबर 2026 से, Quebec के बाहर Canada में एक विद्यार्थी के first-year living expenses के लिए <strong>CAD 23,448</strong> आवश्यक है। Tuition और transportation अलग हैं।'
      },
      feeLabel:{
        gu:'Study permit fee CAD 150 ઉમેરો. Biometrics, જો લાગુ પડે, અલગ હોઈ શકે છે.',
        en:'Include the CAD 150 study permit fee. Biometrics, if required, are separate.',
        hi:'CAD 150 study permit fee जोड़ें। Biometrics, यदि लागू हों, अलग हैं।'
      },
      note:{
        gu:'EduCanada housing માટે સામાન્ય રીતે CAD 500–2,000/month planning range દર્શાવે છે. શહેર અને housing type પ્રમાણે ખર્ચ ઘણો બદલાય છે.',
        en:'EduCanada gives a general housing planning range of CAD 500–2,000 per month. Costs vary substantially by city and housing type.',
        hi:'EduCanada सामान्य housing planning range CAD 500–2,000/month बताता है। शहर और housing type के अनुसार खर्च बदलता है।'
      }
    },
    'United Kingdom':{
      currency:'GBP',symbol:'£',rate:127.98,fee:558,housingUnit:'month',
      basis:[
        {value:10800,label:'GBP 10,800/year — lower Rest of UK planning range'},
        {value:15600,label:'GBP 15,600/year — upper Rest of UK / lower London range'},
        {value:16800,label:'GBP 16,800/year — upper London planning range'},
        {value:'custom',label:'Custom annual living estimate'}
      ],
      housing:[
        {value:554,label:'GBP 554/month — private room, Rest of UK average'},
        {value:664,label:'GBP 664/month — student halls, Rest of UK average'},
        {value:750,label:'GBP 750/month — private room, London average'},
        {value:848,label:'GBP 848/month — student halls, London average'},
        {value:'custom',label:'Custom monthly accommodation'}
      ],
      source:'https://www.gov.uk/student-visa/money',
      guidance:{
        gu:'UK Student visa માટે official maintenance requirement હાલમાં Londonમાં <strong>£1,529/month</strong> અને London બહાર <strong>£1,171/month</strong>, વધુમાં વધુ 9 મહિના માટે છે. નીચેના annual presets Study UK ના 12-month living-cost ranges પરથી છે.',
        en:'For the UK Student visa, the official maintenance requirement is currently <strong>£1,529/month in London</strong> and <strong>£1,171/month outside London</strong>, for up to 9 months. The annual presets below use Study UK’s 12-month living-cost ranges.',
        hi:'UK Student visa के लिए official maintenance requirement London में <strong>£1,529/month</strong> और London के बाहर <strong>£1,171/month</strong>, अधिकतम 9 महीनों तक है। नीचे annual presets Study UK के 12-month ranges पर आधारित हैं।'
      },
      feeLabel:{
        gu:'Current Student visa application fee GBP 558 ઉમેરો. Immigration Health Surcharge અલગ છે.',
        en:'Include the current GBP 558 Student visa application fee. The Immigration Health Surcharge is separate.',
        hi:'Current GBP 558 Student visa application fee जोड़ें। Immigration Health Surcharge अलग है।'
      },
      note:{
        gu:'Study UK હાલમાં Londonમાં આશરે £1,300–£1,400/month અને બાકીના UKમાં £900–£1,300/month living budget સૂચવે છે.',
        en:'Study UK currently suggests roughly £1,300–£1,400/month in London and £900–£1,300/month in the rest of the UK for living costs.',
        hi:'Study UK वर्तमान में London के लिए लगभग £1,300–£1,400/month और बाकी UK के लिए £900–£1,300/month living budget बताता है।'
      }
    },
    'United States':{
      currency:'USD',symbol:'$',rate:95.78,fee:535,housingUnit:'month',customBase:true,
      basis:[
        {value:1,label:'Use institution/I-20 annual living estimate'},
        {value:1.15,label:'Institution living estimate + 15% planning buffer'},
        {value:1.30,label:'Institution living estimate + 30% planning buffer'}
      ],
      housing:[
        {value:'custom',label:'Enter institution/local monthly housing estimate'}
      ],
      source:'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
      guidance:{
        gu:'USA માટે એક universal federal living-cost minimum નથી. U.S. State Department કહે છે કે વિદ્યાર્થીએ education, living અને travel costs કેવી રીતે ચૂકવશે તે બતાવવું પડી શકે છે. તમારા school/I-20 પરનો official estimate વાપરો.',
        en:'The United States does not publish one universal federal living-cost minimum. The State Department may require evidence of how you will pay educational, living and travel costs. Use your school/I-20 official estimate.',
        hi:'USA के लिए एक universal federal living-cost minimum नहीं है। State Department educational, living और travel costs की funding का evidence माँग सकता है। अपने school/I-20 का official estimate उपयोग करें।'
      },
      feeLabel:{
        gu:'Typical F/M government fees USD 535 ઉમેરો: USD 185 visa application + USD 350 I-901 SEVIS. Nationality-specific issuance fees, જો હોય, અલગ છે.',
        en:'Include typical F/M government fees of USD 535: USD 185 visa application + USD 350 I-901 SEVIS. Any nationality-specific issuance fee is separate.',
        hi:'Typical F/M government fees USD 535 जोड़ें: USD 185 visa application + USD 350 I-901 SEVIS। Nationality-specific issuance fee अलग हो सकती है।'
      },
      note:{
        gu:'U.S. costs institution અને city પ્રમાણે ખૂબ બદલાય છે. Gurushala કોઈ generic U.S. living amount બનાવતું નથી. Institution ની official cost-of-attendance/I-20 figures તપાસો.',
        en:'U.S. costs vary greatly by institution and city. Gurushala does not invent a generic U.S. living amount. Check the institution’s official cost-of-attendance/I-20 figures.',
        hi:'U.S. costs institution और city के अनुसार बहुत बदलते हैं। Gurushala कोई generic U.S. living amount नहीं बनाता। Institution की official cost-of-attendance/I-20 figures देखें।'
      }
    },
    'New Zealand':{
      currency:'NZD',symbol:'$',rate:54.84,fee:850,housingUnit:'week',
      basis:[
        {value:20000,label:'NZD 20,000 — official annual tertiary living-funds requirement'},
        {value:23000,label:'NZD 23,000 — official amount + 15% planning buffer'},
        {value:26000,label:'NZD 26,000 — official amount + 30% planning buffer'},
        {value:'custom',label:'Custom annual living estimate'}
      ],
      housing:[
        {value:360,label:'NZD 360/week — lower typical 2-bed apartment example'},
        {value:410,label:'NZD 410/week — lower bigger-city 2-bed example'},
        {value:523,label:'NZD 523/week — upper smaller-city 2-bed example'},
        {value:823,label:'NZD 823/week — upper bigger-city 2-bed example'},
        {value:'custom',label:'Custom weekly accommodation'}
      ],
      source:'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/',
      guidance:{
        gu:'Tertiary/non-compulsory study માટે Immigration New Zealand હાલમાં <strong>NZD 20,000/year</strong> living funds માંગે છે, અથવા એક વર્ષથી ઓછા અભ્યાસ માટે NZD 1,667/month.',
        en:'For tertiary or other non-compulsory study, Immigration New Zealand currently requires <strong>NZD 20,000/year</strong> for living costs, or NZD 1,667/month for study under one year.',
        hi:'Tertiary या other non-compulsory study के लिए Immigration New Zealand वर्तमान में <strong>NZD 20,000/year</strong> living funds, या एक वर्ष से कम अध्ययन के लिए NZD 1,667/month माँगता है।'
      },
      feeLabel:{
        gu:'Fee Paying Student Visa base cost from NZD 850 ઉમેરો. Actual fee તમારા application પ્રમાણે ચકાસો.',
        en:'Include the Fee Paying Student Visa base cost from NZD 850. Check the actual fee for your application.',
        hi:'Fee Paying Student Visa base cost from NZD 850 जोड़ें। अपनी application के लिए actual fee जाँचें।'
      },
      note:{
        gu:'NauMai NZ મુજબ typical 2-bedroom whole-apartment rent smaller citiesમાં NZD 360–523/week અને larger citiesમાં NZD 410–823/week હોઈ શકે છે. Sharing હોય તો તમારો actual share custom fieldમાં નાખો.',
        en:'NauMai NZ gives typical whole two-bedroom apartment rents of NZD 360–523/week in smaller cities and NZD 410–823/week in larger cities. If sharing, enter your actual share as a custom amount.',
        hi:'NauMai NZ typical whole two-bedroom apartment rent smaller cities में NZD 360–523/week और larger cities में NZD 410–823/week बताता है। Sharing होने पर अपना actual share custom amount में डालें।'
      }
    },
    'Other':{
      currency:'LOCAL',symbol:'',rate:0,fee:0,housingUnit:'month',customBase:true,
      basis:[{value:1,label:'Enter official annual living estimate for the chosen country'}],
      housing:[{value:'custom',label:'Enter monthly accommodation estimate'}],
      source:'https://education.ec.europa.eu/study-in-europe',
      guidance:{
        gu:'Europe એક જ education અથવા immigration system નથી. ચોક્કસ દેશ પસંદ કરીને તેના official government અને institution sources પરથી amounts દાખલ કરો.',
        en:'Europe is not one education or immigration system. Choose the exact country and enter amounts from its official government and institution sources.',
        hi:'Europe एक ही education या immigration system नहीं है। सही देश चुनें और उसके official government तथा institution sources से amounts दर्ज करें।'
      },
      feeLabel:{gu:'Visa/application fee custom રીતે ઉમેરો.',en:'Add the visa/application fee manually for the chosen country.',hi:'चुने हुए देश की visa/application fee manually जोड़ें।'},
      note:{gu:'આ section custom planning માટે છે.',en:'This section is for custom planning.',hi:'यह section custom planning के लिए है।'}
    }
  };

  function selectedConfig(){
    return configs[$('estimateCountry')?.value]||configs.Australia;
  }

  function populateEstimator(preserve=false){
    const country=$('estimateCountry')?.value||'Australia';
    const cfg=configs[country]||configs.Other;
    const oldBasis=preserve?$('countryBasis')?.value:null;
    const oldHousing=preserve?$('countryHousing')?.value:null;

    if($('countryBasis')){
      $('countryBasis').innerHTML=cfg.basis.map(o=>'<option value="'+o.value+'">'+o.label+'</option>').join('');
      if(oldBasis && [...$('countryBasis').options].some(o=>o.value===oldBasis)) $('countryBasis').value=oldBasis;
    }
    if($('countryHousing')){
      $('countryHousing').innerHTML=cfg.housing.map(o=>'<option value="'+o.value+'">'+o.label+'</option>').join('');
      if(oldHousing && [...$('countryHousing').options].some(o=>o.value===oldHousing)) $('countryHousing').value=oldHousing;
    }

    if($('countryInrRate')) $('countryInrRate').value=cfg.rate||'';
    if($('countryGuidance')) $('countryGuidance').innerHTML=t(cfg.guidance.gu,cfg.guidance.en,cfg.guidance.hi);
    if($('countryVisaFeeLabel')) $('countryVisaFeeLabel').textContent=t(cfg.feeLabel.gu,cfg.feeLabel.en,cfg.feeLabel.hi);
    if($('countrySourceNote')) $('countrySourceNote').textContent=t(cfg.note.gu,cfg.note.en,cfg.note.hi);
    if($('countrySourceLink')) $('countrySourceLink').href=cfg.source;

    if($('countryFxLabel')) $('countryFxLabel').textContent=(cfg.currency==='LOCAL'?'Local currency':cfg.currency)+' → INR reference rate';
    if($('countryFxNote')) $('countryFxNote').textContent=cfg.currency==='LOCAL'
      ? t('તમારો current reference rate નાખો.','Enter a current reference rate.','Current reference rate दर्ज करें।')
      : t('RBA 18 Sep 2026 cross-rate planning reference. Transaction rate નથી; અરજી સમયે update કરો.','Planning cross-rate derived from RBA 18 Sep 2026 reference rates. Not a transaction rate; update when planning.','RBA 18 Sep 2026 reference rates से derived planning rate. Transaction rate नहीं; planning के समय update करें।');

    if($('countryCustomLivingLabel')) $('countryCustomLivingLabel').textContent=country==='United States'
      ? 'Institution annual living estimate (USD, excluding tuition)'
      : country==='Other'?'Official annual living estimate in local currency':'Custom annual living cost ('+cfg.currency+')';
    if($('countryCustomHousingLabel')) $('countryCustomHousingLabel').textContent='Custom accommodation ('+cfg.currency+'/'+cfg.housingUnit+')';

    syncCustomFields();
    renderCountryEstimate();
  }

  function syncCustomFields(){
    const cfg=selectedConfig();
    if($('countryCustomLivingWrap')) $('countryCustomLivingWrap').hidden=!(cfg.customBase||$('countryBasis')?.value==='custom');
    if($('countryCustomHousingWrap')) $('countryCustomHousingWrap').hidden=!($('countryHousing')?.value==='custom');
  }

  function countryValues(){
    const cfg=selectedConfig();
    let annualLiving=0;
    const basis=$('countryBasis')?.value;

    if(cfg.customBase){
      const base=num('countryCustomLiving');
      const multiplier=parseFloat(basis||'1');
      annualLiving=base*(Number.isFinite(multiplier)?multiplier:1);
    }else{
      annualLiving=basis==='custom'?num('countryCustomLiving'):parseFloat(basis||'0');
    }

    let housingUnitValue=0;
    const hv=$('countryHousing')?.value;
    housingUnitValue=hv==='custom'?num('countryCustomHousing'):parseFloat(hv||'0');
    if(!Number.isFinite(housingUnitValue)) housingUnitValue=0;

    const accommodationAnnual=cfg.housingUnit==='week'?housingUnitValue*52:housingUnitValue*12;
    const otherLiving=Math.max(0,annualLiving-accommodationAnnual);
    const fee=$('includeCountryVisaFee')?.checked?cfg.fee:0;
    const rate=num('countryInrRate');
    return {cfg,annualLiving,housingUnitValue,accommodationAnnual,otherLiving,fee,rate};
  }

  function renderCountryEstimate(){
    const out=$('countryEstimateResult');
    if(!out) return;
    const a=countryValues();
    const cfg=a.cfg;

    if(!a.annualLiving){
      out.innerHTML='<p>'+t('Annual living estimate દાખલ કરો.','Enter or select an annual living estimate.','Annual living estimate चुनें या दर्ज करें।')+'</p>';
      return;
    }

    const period=cfg.housingUnit==='week'?52:12;
    const unitLabel=cfg.housingUnit==='week'?'week':'month';
    const tooHigh=a.accommodationAnnual>a.annualLiving;
    const inr=a.rate>0?a.annualLiving*a.rate/100000:0;

    out.innerHTML=
      '<div><span>'+t('વાર્ષિક living budget','Annual living budget','वार्षिक living budget')+'</span><strong>'+fmtMoney(cfg.currency,cfg.symbol,a.annualLiving)+'</strong><small>'+fmtMoney(cfg.currency,cfg.symbol,a.annualLiving/12)+' / month</small></div>'+
      '<div><span>Accommodation</span><strong>'+fmtMoney(cfg.currency,cfg.symbol,a.accommodationAnnual)+'</strong><small>'+fmtMoney(cfg.currency,cfg.symbol,a.housingUnitValue)+' / '+unitLabel+'</small></div>'+
      '<div><span>'+t('અન્ય living costs માટે બાકી','Remaining for other living costs','अन्य living costs के लिए शेष')+'</span><strong>'+fmtMoney(cfg.currency,cfg.symbol,a.otherLiving)+'</strong><small>'+fmtMoney(cfg.currency,cfg.symbol,a.otherLiving/12)+' / month</small></div>'+
      '<div><span>Visa / government fee</span><strong>'+fmtMoney(cfg.currency,cfg.symbol,a.fee)+'</strong><small>'+t('એક વખતનો ખર્ચ','one-time cost','एकमुश्त खर्च')+'</small></div>'+
      (a.rate>0?'<p class="estimate-inr">Reference INR equivalent: '+fmtLakh(inr)+'</p>':'')+
      (tooHigh?'<p class="estimate-warning">'+t('પસંદ કરેલું accommodation annual living amount કરતાં વધુ છે. વધુ વાસ્તવિક budget અથવા custom figures તપાસો.','The selected accommodation exceeds the annual living amount. Review a more realistic budget or custom figures.','चुना गया accommodation annual living amount से अधिक है। अधिक realistic budget या custom figures जाँचें।')+'</p>':'');
  }

  function applyCountryEstimate(){
    const a=countryValues();
    if(a.rate<=0){
      window.alert(t('Currency → INR reference rate ઉમેરો.','Add a currency → INR reference rate first.','पहले currency → INR reference rate जोड़ें।'));
      return;
    }
    if($('housing')) $('housing').value=(a.accommodationAnnual*a.rate/100000).toFixed(2);
    if($('living')) $('living').value=(a.otherLiving*a.rate/100000).toFixed(2);
    if($('visaApplication')) $('visaApplication').value=(a.fee*a.rate/100000).toFixed(2);
    renderBudget();save();renderCountryEstimate();
  }

  function renderBudget(){
    const years=Math.max(.5,num('duration')||0);
    const annual=num('tuition')+num('housing')+num('living')+num('health')+num('travel')+num('otherAnnual');
    const total=annual*years+num('setup')+num('visaApplication');
    const funding=num('scholarship')+num('governmentSupport')+num('familyContribution')+num('approvedLoan');
    const gap=Math.max(0,total-funding);
    if($('totalCost')) $('totalCost').textContent=fmtLakh(total);
    if($('confirmedFunding')) $('confirmedFunding').textContent=fmtLakh(funding);
    if($('fundingGap')) $('fundingGap').textContent=fmtLakh(gap);
    return {years,annual,total,funding,gap};
  }

  function syncDestinationToEstimator(){
    const dest=$('destination')?.value;
    if(!dest||!$('estimateCountry')) return;
    const supported=['Australia','Canada','United Kingdom','United States','New Zealand'];
    const next=supported.includes(dest)?dest:(dest.includes('Europe')?'Other':$('estimateCountry').value);
    if(next && $('estimateCountry').value!==next){
      $('estimateCountry').value=next;
      populateEstimator(false);
    }
  }

  function updateChecks(){
    const count=verifyChecks.filter(c=>c.checked).length;
    if($('verifyCount')) $('verifyCount').textContent=count+' / '+verifyChecks.length;
    const flags=redFlagChecks.filter(c=>c.checked).length;
    if($('flagAlert')) $('flagAlert').hidden=flags===0;
    let completed=0;
    if($('stage')?.value||$('field')?.value||$('destination')?.value||$('annualBudget')?.value) completed++;
    if(renderBudget().total>0) completed++;
    if(count>0) completed++;
    let supportVisited=false;try{supportVisited=localStorage.getItem('gurushala-gsp-support-visited')==='1';}catch(e){}
    if(supportVisited||num('governmentSupport')>0) completed++;
    const pct=Math.round(completed/4*100);
    if($('progressFill')) $('progressFill').style.width=pct+'%';
    if($('progressCopy')) $('progressCopy').textContent=completed+' / 4';
  }

  function collect(){
    return {
      version:3,
      under18:!!under18?.checked,
      includeCountryVisaFee:$('includeCountryVisaFee')?.checked!==false,
      values:Object.fromEntries(allPersistIds.map(id=>[id,$(id)?.value||''])),
      verify:verifyChecks.map(c=>c.checked),
      redFlags:redFlagChecks.map(c=>c.checked)
    };
  }
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(collect()));}catch(e){}}
  function restore(){
    try{
      const raw=localStorage.getItem(storageKey);if(!raw)return;
      const data=JSON.parse(raw);
      if(data.values) Object.entries(data.values).forEach(([id,v])=>{if($(id))$(id).value=v;});
      if(typeof data.under18==='boolean'&&under18)under18.checked=data.under18;
      if(typeof data.includeCountryVisaFee==='boolean'&&$('includeCountryVisaFee'))$('includeCountryVisaFee').checked=data.includeCountryVisaFee;
      (data.verify||[]).forEach((v,i)=>{if(verifyChecks[i])verifyChecks[i].checked=!!v;});
      (data.redFlags||[]).forEach((v,i)=>{if(redFlagChecks[i])redFlagChecks[i].checked=!!v;});
    }catch(e){}
  }

  function setLang(lang){
    root.lang=lang;
    langButtons.forEach(btn=>{const active=btn.dataset.lang===lang;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    try{localStorage.setItem('gurushala-lang',lang);}catch(e){}
    populateEstimator(true);renderBudget();renderSummary(false);
  }
  langButtons.forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));

  function handleFormChange(e){
    if(minorNote&&under18) minorNote.hidden=!under18.checked;
    if(e&&e.target&&e.target.id==='destination') syncDestinationToEstimator();
    syncCustomFields();renderCountryEstimate();updateChecks();save();
  }
  form?.addEventListener('input',handleFormChange);
  form?.addEventListener('change',handleFormChange);

  $('estimateCountry')?.addEventListener('change',()=>{populateEstimator(false);save();});
  $('countryBasis')?.addEventListener('change',()=>{syncCustomFields();renderCountryEstimate();save();});
  $('countryHousing')?.addEventListener('change',()=>{syncCustomFields();renderCountryEstimate();save();});
  ['countryCustomLiving','countryCustomHousing','countryInrRate','includeCountryVisaFee'].forEach(id=>{
    $(id)?.addEventListener('input',()=>{renderCountryEstimate();save();});
    $(id)?.addEventListener('change',()=>{renderCountryEstimate();save();});
  });
  $('previewCountryEstimate')?.addEventListener('click',renderCountryEstimate);
  $('applyCountryEstimate')?.addEventListener('click',applyCountryEstimate);

  [...document.querySelectorAll('#government-support a')].forEach(link=>link.addEventListener('click',()=>{
    try{localStorage.setItem('gurushala-gsp-support-visited','1');}catch(e){} updateChecks();
  }));

  function esc(s){return String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
  function renderSummary(scroll=true){
    const out=$('summaryOutput');if(!out)return;
    const hasAny=$('stage')?.value||$('field')?.value||$('destination')?.value||renderBudget().total>0;
    if(!hasAny){
      out.innerHTML='<p class="empty-summary">'+t('ઉપરની માહિતી ભરો અને “Decision File બનાવો” દબાવો.','Complete the sections above and select “Generate Decision File”.','ऊपर की जानकारी भरें और “Decision File बनाएँ” चुनें।')+'</p>';return;
    }
    const b=renderBudget();
    const verified=verifyChecks.filter(c=>c.checked).length;
    const flags=redFlagChecks.filter(c=>c.checked).length;
    const stage=$('stage')?.value||t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');
    const field=$('field')?.value.trim()||t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');
    const destination=$('destination')?.value||t('હજી નક્કી નથી','Not decided yet','अभी तय नहीं');
    const budget=$('annualBudget')?.value?fmtLakh(num('annualBudget')):t('હજી ઉમેર્યું નથી','Not added yet','अभी नहीं जोड़ा');
    const warning=flags>0
      ?'<div class="summary-warning"><strong>STOP AND VERIFY</strong><br>'+flags+' red flag(s) selected.</div>'
      :'<div class="summary-ok"><strong>'+t('Red flag પસંદ નથી','No red flags selected','कोई red flag चयनित नहीं')+'</strong></div>';
    const minor=under18?.checked?'<div class="summary-warning"><strong>Under-18 check needed</strong><br>'+t('વાલી સંમતિ, accommodation અને welfare/custodianship rules તપાસો.','Check parental consent, accommodation and welfare/custodianship rules.','अभिभावक सहमति, accommodation और welfare/custodianship rules जाँचें।')+'</div>':'';
    out.innerHTML='<h4>'+t('મારો Global Study Decision File','My Global Study Decision File','मेरी Global Study Decision File')+'</h4>'+
      '<div class="summary-grid">'+
      '<div><span>'+t('હાલનો અભ્યાસ','Current stage','वर्तमान स्तर')+'</span><strong>'+esc(stage)+'</strong></div>'+
      '<div><span>'+t('વિષય/ક્ષેત્ર','Field of study','अध्ययन क्षेत्र')+'</span><strong>'+esc(field)+'</strong></div>'+
      '<div><span>'+t('વિચારતો દેશ','Destination being explored','विचाराधीन देश')+'</span><strong>'+esc(destination)+'</strong></div>'+
      '<div><span>'+t('પરિવારનું વાર્ષિક બજેટ','Family annual budget','परिवार वार्षिक बजट')+'</span><strong>'+esc(budget)+'</strong></div>'+
      '<div><span>'+t('અંદાજિત આખો અભ્યાસ ખર્ચ','Estimated whole-study cost','अनुमानित कुल अध्ययन लागत')+'</span><strong>'+fmtLakh(b.total)+'</strong></div>'+
      '<div><span>'+t('પુષ્ટિ થયેલ funding','Confirmed funding','पुष्ट funding')+'</span><strong>'+fmtLakh(b.funding)+'</strong></div>'+
      '<div><span>Funding gap</span><strong>'+fmtLakh(b.gap)+'</strong></div>'+
      '<div><span>Verification checks</span><strong>'+verified+' / '+verifyChecks.length+'</strong></div></div>'+
      '<p class="source-date">'+t('Part-time કમાણી funding gapમાંથી ઘટાડવામાં આવી નથી. આ summary admission, visa અથવા financial assessment નથી.','Estimated part-time earnings are not deducted from the funding gap. This is not an admission, visa or financial assessment.','अनुमानित part-time आय funding gap से नहीं घटाई गई है। यह admission, visa या financial assessment नहीं है।')+'</p>'+minor+warning;
    if(scroll)out.scrollIntoView({behavior:'smooth',block:'start'});
  }

  $('generateSummary')?.addEventListener('click',()=>renderSummary(true));
  $('printSummary')?.addEventListener('click',()=>{renderSummary(false);window.print();});
  $('resetTool')?.addEventListener('click',()=>{
    if(!window.confirm(t('શું તમે entries સાફ કરવા માંગો છો?','Clear your entries from this tool?','क्या आप entries साफ करना चाहते हैं?')))return;
    try{localStorage.removeItem(storageKey);localStorage.removeItem('gurushala-gsp-support-visited');}catch(e){}
    form?.reset();
    if($('duration'))$('duration').value='3';
    if($('estimateCountry'))$('estimateCountry').value='Australia';
    verifyChecks.forEach(c=>c.checked=false);redFlagChecks.forEach(c=>c.checked=false);
    if(minorNote)minorNote.hidden=true;
    populateEstimator(false);updateChecks();renderSummary(false);
  });

  restore();
  if(!$('estimateCountry')?.value)$('estimateCountry').value='Australia';
  populateEstimator(true);
  if(minorNote&&under18)minorNote.hidden=!under18.checked;
  setLang((()=>{try{return localStorage.getItem('gurushala-lang')||'gu';}catch(e){return'gu';}})());
  updateChecks();
})();