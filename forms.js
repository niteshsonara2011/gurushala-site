(function(){
  const root=document.documentElement;
  const buttons=[...document.querySelectorAll('[data-lang]')];
  const translated=[...document.querySelectorAll('[data-gu][data-en][data-hi]')];
  const setLang=(lang)=>{
    root.lang=lang;
    buttons.forEach(button=>{
      const active=button.dataset.lang===lang;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    translated.forEach(node=>{
      const text=node.dataset[lang];
      if(node.tagName==='OPTION') node.textContent=text;
      else if('placeholder' in node) node.placeholder=text;
    });
    localStorage.setItem('gurushala-lang',lang);
  };
  buttons.forEach(button=>button.addEventListener('click',()=>setLang(button.dataset.lang)));
  setLang(localStorage.getItem('gurushala-lang')||'gu');

  const menu=document.querySelector('.menu');
  const nav=document.getElementById('mobile-navigation');
  if(menu&&nav){
    menu.addEventListener('click',()=>{
      const open=menu.getAttribute('aria-expanded')==='true';
      menu.setAttribute('aria-expanded',String(!open));
      nav.hidden=open;
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      nav.hidden=true;
      menu.setAttribute('aria-expanded','false');
    }));
  }

  document.querySelectorAll('form').forEach(form=>{
    const interests=[...form.querySelectorAll('input[name="Interest"]')];
    if(!interests.length) return;
    const validate=()=>{
      const valid=interests.some(box=>box.checked);
      const messages={gu:'કૃપા કરીને ઓછામાં ઓછું એક ક્ષેત્ર પસંદ કરો.',en:'Please choose at least one area of interest.',hi:'कृपया कम से कम एक रुचि क्षेत्र चुनें।'};
      interests[0].setCustomValidity(valid?'':messages[root.lang]||messages.en);
    };
    interests.forEach(box=>box.addEventListener('change',validate));
    form.addEventListener('submit',event=>{
      validate();
      if(!interests.some(box=>box.checked)){
        event.preventDefault();
        interests[0].reportValidity();
      }
    });
  });
})();
