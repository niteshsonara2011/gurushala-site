const storyGuideCopy={
  gu:{readerTitle:'12 પાનાંની વાર્તા માર્ગદર્શિકા',readerText:'અહીં દરેક પાનાનું શીર્ષક અને વાર્તામાં તેની જગ્યા બતાવવામાં આવે છે. મૂળ પાનાંનું દૃશ્ય પ્રૂફ અંતિમ સંપાદન સુધી જાહેર ડાઉનલોડ તરીકે મૂકવામાં આવ્યું નથી.',visualNote:'મૂળ 12 પાનાંનું કલર પ્રૂફ હાલ સંપાદકીય પુરાવા તરીકે જ રાખવામાં આવ્યું છે. આ વેબ પાનું તેની વાર્તા અને શીખણ યાત્રાનો જાહેર માર્ગદર્શક છે.',proofStatus:'દૃશ્ય પ્રૂફ'},
  en:{readerTitle:'12-page story guide',readerText:'This guide shows each page title and its place in the story. The original page scans remain an editorial visual proof and are not being offered as a public download before final editing.',visualNote:'The original 12-page colour proof is being retained as editorial evidence. This web page is the public guide to its story and learning journey.',proofStatus:'Visual proof'},
  hi:{readerTitle:'12-पृष्ठ कहानी मार्गदर्शिका',readerText:'यह मार्गदर्शिका हर पृष्ठ का शीर्षक और कहानी में उसकी जगह दिखाती है। मूल पृष्ठ-स्कैन अभी संपादकीय दृश्य प्रूफ हैं और अंतिम संपादन से पहले सार्वजनिक डाउनलोड के रूप में उपलब्ध नहीं कराए गए हैं।',visualNote:'मूल 12-पृष्ठ रंगीन प्रूफ अभी संपादकीय प्रमाण के रूप में रखा गया है। यह वेब पृष्ठ उसकी कहानी और सीखने की यात्रा का सार्वजनिक मार्गदर्शक है।',proofStatus:'दृश्य प्रूफ'}
};
function applyStoryGuideCopy(lang){
  const c=storyGuideCopy[lang]||storyGuideCopy.gu;
  ['readerTitle','readerText','visualNote'].forEach(k=>document.querySelectorAll(`[data-i18n="${k}"]`).forEach(el=>el.textContent=c[k]));
  document.querySelectorAll('.proof-status').forEach(el=>el.textContent=c.proofStatus);
}
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>applyStoryGuideCopy(btn.dataset.lang)));
applyStoryGuideCopy(readLanguage());
