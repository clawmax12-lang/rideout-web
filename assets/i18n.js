/* Tablehopp i18n — embedded SV->EN dictionary applier.
   Runs in the parent page AND inside each same-origin embed (app-embed, cta-embed).
   Why a dictionary instead of Weglot: the feature sections live in iframes that
   Weglot (running only in the parent) could never reach, and Weglot's async pass
   caused a ~10s flash. This applies cached translations instantly, on every frame,
   and re-applies as Framer hydrates/lazy-mounts. Edit DICT below to tweak wording. */
(function(){
  "use strict";
  var DICT={"/ fest":"/ party","75+ timmar i Excel. Borta i ett knapptryck.":"75+ hours in Excel. Gone with the click of a button.","Allt i Upp till 30, plus:":"Everything in \"Up to 30,\" plus:","Allt i appen":"Everything in the app","Allt sker i Tablehopp-appen – ledtrådar, karta till nästa värd och poäng i realtid. Ladda ner, samla gänget och kör.":"Everything happens in the Tablehopp app—clues, a map to the next host, and real-time scores. Download it, gather your friends, and let's go.","Anpassa lag och värdar":"Customize Teams and Hosts","Att låta vem som helst köra sin egen cykelfest. Appen gör det tunga jobbet, ni tar hand om stämningen.":"Let anyone host their own bike party. The app does the hard work; you take care of the atmosphere.","Billigt, socialt och lagom kaosigt. Kör det kvartersvis.":"Inexpensive, social, and just the right amount of chaos. Do it one neighborhood at a time.","Byggt för den stora festen":"Built for a big party","Cykelfest":"Progressive dinner<br>","Cykla till nästa värd, lös ledtråden på vägen och samla poäng. Ingen vet vart kvällen tar er förrän ni är framme.":"Ride your bike to the next host, solve the clue along the way, and earn points. No one knows where the evening will take you until you arrive.","Dataexport ingår":"Data export is included","De bästa stunderna från kvällen":"The best moments from the evening","Det började i Uppsala":"It all started in Uppsala","Det började med en cykelfest mellan grannar i Uppsala – Kaninens Cykelfest. Den blev årets höjdpunkt på gatan.":"It all started with a bike party among neighbors in Uppsala—Kaninens Cykelfest. It became the highlight of the year on the street.","Efterrätt":"Dessert","Egen maskot och färger":"Our own mascot and colors","Egna ledtrådar och teman":"Your own clues and themes","En aktivitet som drar folk, utan att styrelsen planerar ihjäl sig.":"An activity that draws a crowd, without the board having to plan themselves to death.","En kväll räcker för att bli ett gäng.":"One evening is all it takes to become a group.","En kväll, fem hållplatser":"One evening, five stops","En rätt per värd. Ingen lagar allt, alla bjuder på något.":"One dish per host. No one cooks everything; everyone brings something.","Ett pris per fest. Inget abonnemang.":"One price per party. No subscription.","Flera lag och zoner":"Multiple teams and zones","Flera lag och zoner, noll krockar hos värdarna. Kartan till nästa stopp låses upp först när ledtråden är löst.":"Multiple levels and zones, zero crashes for the hosts. The map to the next stop is unlocked only after the clue is solved.","Funkar på gatan, i föreningen och på jobbet":"Works on the street, in the community, and at work","Färdiga teman & maskot":"Ready-made themes & mascot","För vem":"For whom","Förening / BRF":"Association / Homeowners' Association","Företag":"Companies","Förrätt":"Appetizer","Gissa & tävla":"Guess & Enter the Contest","Hela cykelfesten. Planerad i ett knapptryck.":"The whole progressive dinner. Planned with the push of a button.","Hela festen i handen, live.":"The whole party in the palm of your hand, live.","Hela kärnan – progressiv middag på cykel":"The Whole Point – A Progressive Dinner by Bike","Huvudrätten hos ett nytt värdpar. Mätta magar och fulla poäng – och en sista ledtråd innan ni rullar mot efterrätten.":"The main course at a new host couple’s home. Full bellies and full marks—and one last clue before you move on to dessert.","Hämta appen, bjud in gänget, tryck en gång. Resten rullar av sig själv.":"Download the app, invite your friends, tap once. The rest takes care of itself.","Kaninens Cykelfest 2025":"The Rabbit's Bike Festival 2025","Korta sträckor mellan stoppen. Precis lagom efter en tallrik mat.":"Short distances between stops. Just right after a plate of food.","Kvarteret väntar. Du har knappen.":"The neighborhood is waiting. You have the button.","Kvällen":"The Evening","Ladda ner för Android":"Download for Android","Ladda ner för iPhone":"Download for iPhone","Ledtrådar":"Clues","Ledtrådar avslöjar nästa adress. Poäng plockar ni på vägen.":"Clues reveal the next address. You'll earn points along the way.","Lägg in gänget och tryck en gång. Appen matchar värdpar, fördelar rätterna och bygger rutterna — så att alla möter nya ansikten vid varje stopp.":"Add your group and tap once. The app matches host pairs, assigns dishes, and plans the routes—so everyone meets new people at every stop.","Lär känna folk ni bara nickar åt idag. En kväll räcker.":"Get to know the people you just nod at today. One evening is all it takes.","Läs fler berättelser":"Read more stories","Notiser till deltagarna":"Notes for Participants","Nästa rätt väntar hos ett nytt värdpar. Ät, snacka och håll koll på topplistan medan kvällen rullar vidare.":"The next course awaits at a new host couple’s home. Eat, chat, and keep an eye on the leaderboard as the evening unfolds.","Okej, men vad är det egentligen?":"Okay, but what is it, exactly?","Poäng":"Points","Quiz & omröstningar":"Quizzes & Polls","Realtidskontroll av kvällen":"Real-Time Update on the Evening's Events","Se var varje lag är i realtid, pusha notiser och flytta ett stopp i sista sekund. Egna ledtrådar, teman, skattjakt och quiz — appen kör kvällen, ni tar äran.":"See where each team is in real time, send push notifications, and move a checkpoint at the last second. Custom clues, themes, scavenger hunts, and quizzes—the app runs the evening, and you get the credit.","Skanna koden — appen i handen på sekunder":"Scan the code — the app is in your hand in seconds","Skapa er cykelfest":"Create Your Own Bike Party","Skattjakt med ledtrådar":"Treasure Hunt with Clues","Snabblänkar":"Quick Links","Sugen? Samla gänget.":"Interested? Round up the gang.","Support i appen":"In-App Support","Så funkar det":"How It Works","Så går kvällen till":"Here's how the evening goes","Tablehopp — cykelfest-plattformen":"Tablehopp — the bike festival platform","Teambuilding som folk vill gå på. Byt cykeln mot elsparkcykel om ni vill.":"Team-building events that people actually want to attend. Swap your bike for an electric scooter if you'd like.","Tänk vanlig middag, fast utspridd över kvarteret. Varje rätt äts hemma hos olika värdar, och mellan rätterna tar ni cykeln dit. Ni vet inte var nästa stopp ligger förrän ni löst kvällens ledtråd.":"Imagine a typical dinner, but spread out across the neighborhood. Each course is served at the homes of different hosts, and between courses, you’ll bike to the next location. You won’t know where the next stop is until you’ve solved the evening’s clue.","Upp till 30":"Up to 30","Vad är en cykelfest":"What is a bike festival?","Vad är en cykelfest?":"What is a bike festival?","Var som helst":"Anywhere","Varmrätt":"Main Course","Vem äter var, med vem, när? Uträknat.":"Who eats where, with whom, and when? It's all figured out.","Välkomna":"Welcome","Vänner & kollegor":"Friends & Colleagues","Värdpar":"Host couple","Vår historia":"Our History","Vårt uppdrag":"Our Mission","— deltagare av cykelfest som arrangerats via appen":"— participants in a cycling festival organized through the app","”Fantastisk app. Hela festen gick som en väloljad tävlingscykel på vätternrundan.”":"“Amazing app. The whole party ran like a well-oiled racing bike on the Vätternrundan.”"};
  function norm(s){return (s||"").replace(/\s+/g," ").trim();}
  var lang=(function(){var l=null;try{l=localStorage.getItem("thlang");}catch(e){}
    if(l==="en"||l==="sv")return l;var n=(navigator.language||"sv").toLowerCase();return /^en/.test(n)?"en":"sv";})();
  var TOP=(window.top===window.self);

  /* ---- apply dictionary (only in EN) ---- */
  var SEL="h1,h2,h3,h4,h5,h6,p,span,a,li,button,strong,em,small,label,div,figcaption,blockquote";
  function translateEl(el){
    if(el.children&&el.children.length===0){
      var k=norm(el.textContent);
      if(k){var t=DICT[k];if(t!==undefined&&t!==el.textContent)el.textContent=t;}
    }
  }
  function applyAll(){
    if(lang!=="en"||!document.body)return;
    var els=document.body.querySelectorAll(SEL);
    for(var i=0;i<els.length;i++)translateEl(els[i]);
  }
  var deb;function schedule(){clearTimeout(deb);deb=setTimeout(applyAll,80);}
  function startObserver(){try{var mo=new MutationObserver(schedule);mo.observe(document.body,{childList:true,subtree:true,characterData:true});}catch(e){}}
  function onReady(fn){if(document.readyState!=="loading")fn();else document.addEventListener("DOMContentLoaded",fn);}

  /* ---- anti-FOUC: top frame only, EN only ---- */
  if(lang==="en"&&TOP){
    try{document.documentElement.classList.add("th-hide");
      var s=document.createElement("style");s.textContent=
        "html.th-hide{visibility:hidden!important;background:#98cdea!important}"+
        "html.th-hide #th-splash{visibility:visible!important}"+
        "#th-splash{position:fixed;inset:0;z-index:2147483600;background:#98cdea;display:flex;align-items:center;justify-content:center;transition:opacity .4s ease}"+
        "#th-splash.hide{opacity:0;pointer-events:none}"+
        "#th-splash .d{width:54px;height:54px;border-radius:50%;background:#1a1a1a;animation:thp 1s ease-in-out infinite}"+
        "@keyframes thp{0%,100%{transform:scale(.7);opacity:.55}50%{transform:scale(1);opacity:1}}"+
        "@media(prefers-reduced-motion:reduce){#th-splash .d{animation:none}}";
      document.head.appendChild(s);}catch(e){}
  }

  /* ---- run ---- */
  if(lang==="en"){
    onReady(function(){
      applyAll();startObserver();
      if(TOP){
        if(!document.getElementById("th-splash")){var d=document.createElement("div");d.id="th-splash";d.innerHTML='<div class="d"></div>';document.body.appendChild(d);}
        function reveal(){document.documentElement.classList.remove("th-hide");var x=document.getElementById("th-splash");if(x){x.classList.add("hide");setTimeout(function(){if(x.parentNode)x.parentNode.removeChild(x);},420);}}
        setTimeout(reveal,140);setTimeout(reveal,1600);
      }
    });
  }

  /* ---- SV/EN switcher: top frame only ---- */
  if(TOP){
    onReady(function(){
      if(document.querySelector(".ro-lang"))return;
      var css='.ro-lang{position:fixed;top:20px;right:78px;z-index:2147483000;display:flex;align-items:center;gap:7px;font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:13px;font-weight:600;letter-spacing:.02em}'
        +'.ro-lang button{background:none;border:0;margin:0;padding:2px;cursor:pointer;font:inherit;color:rgba(25,25,25,.42);line-height:1;-webkit-tap-highlight-color:transparent}'
        +'.ro-lang button:hover{color:#191919}.ro-lang button.on{color:#191919}.ro-lang .sep{color:rgba(25,25,25,.28)}'
        +'@media(max-width:599px){.ro-lang{top:16px;right:62px;font-size:12px}}';
      var st=document.createElement("style");st.id="ro-lang-css";st.textContent=css;document.head.appendChild(st);
      var w=document.createElement("div");w.className="ro-lang";w.setAttribute("translate","no");
      w.innerHTML='<button type="button" data-l="sv">SV</button><span class="sep">/</span><button type="button" data-l="en">EN</button>';
      var bs=w.querySelectorAll("button");for(var i=0;i<bs.length;i++)bs[i].classList.toggle("on",bs[i].getAttribute("data-l")===lang);
      w.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button");if(!b)return;var l=b.getAttribute("data-l");if(l===lang)return;try{localStorage.setItem("thlang",l);}catch(e){}location.reload();});
      document.body.appendChild(w);
    });
  }
})();