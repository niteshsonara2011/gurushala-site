/* QA remediation layer. Keeps the existing translation file intact while making language state resilient. */
(function(){
  if(typeof translations==='undefined') return;
  Object.assign(translations.gu,{
    whyText:'ગુરુશાળા અનુસૂચિત જાતિની મહિલાઓની માલિકી, નેતૃત્વ અને સંચાલન હેઠળ ઘડાતી પહેલ છે અને દરેક વય, જાતિ, લિંગ, લૈંગિકતા, ધર્મ, શિક્ષણ કે આર્થિક સ્થિતિના લોકોને સન્માનથી આવકારે છે.',
    footerText:'અનુસૂચિત જાતિની મહિલાઓની માલિકી, નેતૃત્વ અને સંચાલન હેઠળની શિક્ષણ અને સાંસ્કૃતિક પહેલ, જે દરેકને સન્માનથી આવકારે છે.',
    pilotDuration:'3 કલાક'
  });
  Object.assign(translations.en,{
    whyText:'Gurushala is being shaped as an education and cultural initiative owned, led and run by Scheduled Caste women, welcoming people of every age, caste, gender, sexuality, religion, education level and financial background with dignity.',
    footerText:'An education and cultural initiative owned, led and run by Scheduled Caste women, welcoming everyone with dignity.',
    pilotDuration:'3h'
  });
  Object.assign(translations.hi,{
    whyText:'गुरुशाला अनुसूचित जाति की महिलाओं के स्वामित्व, नेतृत्व और संचालन में विकसित हो रही शिक्षा और सांस्कृतिक पहल है, जो हर आयु, जाति, लिंग, लैंगिक पहचान, धर्म, शिक्षा स्तर और आर्थिक पृष्ठभूमि के लोगों का सम्मान के साथ स्वागत करती है।',
    footerText:'अनुसूचित जाति की महिलाओं के स्वामित्व, नेतृत्व और संचालन वाली शिक्षा और सांस्कृतिक पहल, जो सभी का सम्मान के साथ स्वागत करती है।',
    pilotDuration:'3 घंटे'
  });

  function safeGet(key){try{return localStorage.getItem(key)}catch(error){return null}}
  function safeSet(key,value){try{localStorage.setItem(key,value)}catch(error){}}
  function safeRemove(key){try{localStorage.removeItem(key)}catch(error){}}

  const userChoseLanguage=safeGet('gurushala-language-chosen')==='1';
  if(!userChoseLanguage) safeRemove('gurushala-language');

  applyLanguage=function(lang,persist=true){
    const selected=translations[lang]||translations.gu;
    document.documentElement.lang=lang;
    document.title=selected.documentTitle;
    const meta=document.getElementById('metaDescription'); if(meta) meta.setAttribute('content',selected.metaDescription);
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(Object.prototype.hasOwnProperty.call(selected,key))el.textContent=selected[key]});
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el=>{const key=el.dataset.i18nAriaLabel;if(Object.prototype.hasOwnProperty.call(selected,key))el.setAttribute('aria-label',selected[key])});
    document.querySelectorAll('[data-lang]').forEach(button=>{const active=button.dataset.lang===lang;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
    if(persist){safeSet('gurushala-language',lang);safeSet('gurushala-language-chosen','1')}
  };

  const stored=userChoseLanguage?safeGet('gurushala-language'):null;
  applyLanguage(stored&&translations[stored]?stored:'gu',false);
})();
