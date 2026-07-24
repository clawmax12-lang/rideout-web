/* Tablehopp i18n — embedded SV->EN dictionary applier.
   Runs in the parent page AND inside each same-origin embed (app-embed, cta-embed).
   Why a dictionary instead of Weglot: the feature sections live in iframes that
   Weglot (running only in the parent) could never reach, and Weglot's async pass
   caused a ~10s flash. This applies cached translations instantly, on every frame,
   and re-applies as Framer hydrates/lazy-mounts. Edit DICT below to tweak wording. */
(function(){
  "use strict";
  var DICT={"Hem":"Home","Kontakt":"Contact","/ fest":"/ party","75+ timmar i Excel. Borta i ett knapptryck.":"75+ hours in Excel. Gone with the click of a button.","Allt i Upp till 30, plus:":"Everything in \"Up to 30,\" plus:","Allt i appen":"Everything in the app","Allt sker i Tablehopp-appen – ledtrådar, karta till nästa värd och poäng i realtid. Ladda ner, samla gänget och kör.":"Everything happens in the Tablehopp app—clues, a map to the next host, and real-time scores. Download it, gather your friends, and let's go.","Anpassa lag och värdar":"Customize Teams and Hosts","Att låta vem som helst köra sin egen cykelfest. Appen gör det tunga jobbet, ni tar hand om stämningen.":"Let anyone host their own progressive dinner. The app does the hard work; you take care of the atmosphere.","Billigt, socialt och lagom kaosigt. Kör det kvartersvis.":"Inexpensive, social, and just the right amount of chaos. Do it one neighborhood at a time.","Byggt för den stora festen":"Built for a big party","Cykelfest":"Progressive dinner","Cykla":"Cycle","Äta":"Eat","Cykla till nästa värd, lös ledtråden på vägen och samla poäng. Ingen vet vart kvällen tar er förrän ni är framme.":"Ride your bike to the next host, solve the clue along the way, and earn points. No one knows where the evening will take you until you arrive.","Dataexport ingår":"Data export is included","De bästa stunderna från kvällen":"The best moments from the evening","Det började i Uppsala":"It all started in Uppsala","Det började med en cykelfest mellan grannar i Uppsala – Kaninens Cykelfest. Den blev årets höjdpunkt på gatan.":"It all started with a progressive dinner among neighbors in Uppsala—Kaninens Cykelfest. It became the highlight of the year on the street.","Efterrätt":"Dessert","Egen maskot och färger":"Our own mascot and colors","Egna ledtrådar och teman":"Your own clues and themes","En aktivitet som drar folk, utan att styrelsen planerar ihjäl sig.":"An activity that draws a crowd, without the board having to plan themselves to death.","En kväll räcker för att bli ett gäng.":"One evening is all it takes to become a group.","En kväll, fem hållplatser":"One evening, five stops","En rätt per värd. Ingen lagar allt, alla bjuder på något.":"One dish per host. No one cooks everything; everyone brings something.","Ett pris per fest. Inget abonnemang.":"One price per party. No subscription.","Flera lag och zoner":"Multiple teams and zones","Flera lag och zoner, noll krockar hos värdarna. Kartan till nästa stopp låses upp först när ledtråden är löst.":"Multiple teams and zones, zero crashes for the hosts. The map to the next stop is unlocked only after the clue is solved.","Funkar på gatan, i föreningen och på jobbet":"Works on the street, in the community, and at work","Färdiga teman & maskot":"Ready-made themes & mascot","För vem":"For whom","Förening / BRF":"Association / Homeowners' Association","Företag":"Companies","Förrätt":"Appetizer","Gissa & tävla":"Guess & Enter the Contest","Hela cykelfesten. Planerad i ett knapptryck.":"The whole progressive dinner. Planned with the push of a button.","Hela festen i handen, live.":"The whole party in the palm of your hand, live.","Hela kärnan – progressiv middag på cykel":"The Whole Point – A Progressive Dinner by Bike","Huvudrätten hos ett nytt värdpar. Mätta magar och fulla poäng – och en sista ledtråd innan ni rullar mot efterrätten.":"The main course at a new host couple’s home. Full bellies and full marks—and one last clue before you move on to dessert.","Hämta appen, bjud in gänget, tryck en gång. Resten rullar av sig själv.":"Download the app, invite your friends, tap once. The rest takes care of itself.","Kaninens Cykelfest 2025":"Kaninens Cykelfest 2025","Korta sträckor mellan stoppen. Precis lagom efter en tallrik mat.":"Short distances between stops. Just right after a plate of food.","Kvarteret väntar. Du har knappen.":"The neighborhood is waiting. You have the button.","Kvällen":"The Evening","Ladda ner för Android":"Download for Android","Ladda ner för iPhone":"Download for iPhone","Ledtrådar":"Clues","Ledtrådar avslöjar nästa adress. Poäng plockar ni på vägen.":"Clues reveal the next address. You'll earn points along the way.","Lägg in gänget och tryck en gång. Appen matchar värdpar, fördelar rätterna och bygger rutterna — så att alla möter nya ansikten vid varje stopp.":"Add your group and tap once. The app matches host pairs, assigns dishes, and plans the routes—so everyone meets new people at every stop.","Lär känna folk ni bara nickar åt idag. En kväll räcker.":"Get to know the people you just nod at today. One evening is all it takes.","Läs fler berättelser":"Read more stories","Notiser till deltagarna":"Notifications for Participants","Nästa rätt väntar hos ett nytt värdpar. Ät, snacka och håll koll på topplistan medan kvällen rullar vidare.":"The next course awaits at a new host couple’s home. Eat, chat, and keep an eye on the leaderboard as the evening unfolds.","Okej, men vad är det egentligen?":"Okay, but what is it, exactly?","Poäng":"Points","Quiz & omröstningar":"Quizzes & Polls","Realtidskontroll av kvällen":"Real-Time Update on the Evening's Events","Se var varje lag är i realtid, pusha notiser och flytta ett stopp i sista sekund. Egna ledtrådar, teman, skattjakt och quiz — appen kör kvällen, ni tar äran.":"See where each team is in real time, send push notifications, and move a checkpoint at the last second. Custom clues, themes, scavenger hunts, and quizzes—the app runs the evening, and you get the credit.","Skanna koden — appen i handen på sekunder":"Scan the code — the app is in your hand in seconds","Skapa er cykelfest":"Create Your Own Progressive Dinner","Skattjakt med ledtrådar":"Treasure Hunt with Clues","Snabblänkar":"Quick Links","Sugen? Samla gänget.":"Interested? Round up the gang.","Support i appen":"In-App Support","Så funkar det":"How It Works","Så går kvällen till":"Here's how the evening goes","Tablehopp — cykelfest-plattformen":"Tablehopp — the progressive dinner platform","Teambuilding som folk vill gå på. Byt cykeln mot elsparkcykel om ni vill.":"Team-building events that people actually want to attend. Swap your bike for an electric scooter if you'd like.","Tänk vanlig middag, fast utspridd över kvarteret. Varje rätt äts hemma hos olika värdar, och mellan rätterna tar ni cykeln dit. Ni vet inte var nästa stopp ligger förrän ni löst kvällens ledtråd.":"Imagine a typical dinner, but spread out across the neighborhood. Each course is served at the homes of different hosts, and between courses, you’ll bike to the next location. You won’t know where the next stop is until you’ve solved the evening’s clue.","Upp till 30":"Up to 30","Vad är en cykelfest":"What is a progressive dinner?","Vad är en cykelfest?":"What is a progressive dinner?","Var som helst":"Anywhere","Varmrätt":"Main Course","Vem äter var, med vem, när? Uträknat.":"Who eats where, with whom, and when? It's all figured out.","Välkomna":"Welcome","Vänner & kollegor":"Friends & Colleagues","Värdpar":"Host couple","Vår historia":"Our History","Vårt uppdrag":"Our Mission","— deltagare av cykelfest som arrangerats via appen":"— participants in a progressive dinner organized through the app","”Fantastisk app. Hela festen gick som en väloljad tävlingscykel på vätternrundan.”":"“Amazing app. The whole party ran like a well-oiled racing bike on the Vätternrundan.”","Allt från ett litet kvarter till en riktigt stor fest. Ni betalar ett fast pris per fest, utan abonnemang: 595 kr för upp till 30 personer, 895 kr för 31–60 och 1 395 kr för 61–100. Blir ni ännu fler? Hör av er till hej@tablehopp.app så löser vi det.":"Everything from a small neighborhood gathering to a really big party. You pay a fixed price per party, with no subscription required: 595 SEK for up to 30 people, 895 SEK for 31–60, and 1,395 SEK for 61–100. Will there be even more of you? Contact us at hej@tablehopp.app and we’ll work something out.","Appen är kvällens spelplan. Den släpper ledtrådar, visar vägen till nästa värd, kör quiz och omröstningar och håller poängen live på en gemensam leaderboard – alla ser samma sak samtidigt i sin telefon. Som arrangör styr du hela kvällen därifrån: lag, värdar, teman och notiser. Inga papperslappar, inget krångel – allt i appen.":"The app is the game plan for the evening. It provides clues, shows the way to the next host, runs quizzes and polls, and keeps the scores updated in real time on a shared leaderboard—everyone sees the same thing at the same time on their phones. As the organizer, you manage the entire evening from there: teams, hosts, themes, and announcements. No paper slips, no hassle—everything is in the app.","Behöver alla en cykel – och hur långt cyklar man?":"Does everyone need a bike—and how far do people ride?","Bli bland de första på väntelistan":"Be among the first on the waiting list","Du samlar gänget och anmäler er. Appen delar in alla i lag och värdar och skickar er till den första adressen. Därifrån guidar ledtrådarna er vidare, hållplats för hållplats, tills hela sällskapet möts för en gemensam efterfest. En kväll, fem hållplatser – ni behöver bara dyka upp och trampa.":"Gather your friends and sign up. The app divides everyone into teams and hosts, then sends you to the first location. From there, the clues guide you onward, stop by stop, until the whole group meets up for an after-party. One evening, five stops—all you have to do is show up and pedal.","Du är redan med! 🎉":"You're already part of it! 🎉","En progressiv middag på cykel. Ni äter förrätt hos en värd, cyklar vidare till nästa för varmrätten och avslutar efterrätten hos en tredje. Mellan rätterna trampar ni runt i kvarteret och löser ledtrådar om vart kvällen tar er härnäst.":"A progressive dinner by bike. You’ll enjoy the appetizer at one host’s home, cycle on to the next for the main course, and finish with dessert at a third host’s home. Between courses, you’ll cycle around the neighborhood and solve clues to find out where the evening will take you next.","Gå med i väntelistan":"Join the waiting list","Hur går en kväll till?":"What's an evening like?","Hur många kan vara med och vad kostar det?":"How many people can participate, and how much does it cost?","Huvudrätten hos ett nytt värdpar. Mätta magar, fulla poäng – och en sista ledtråd innan efterfesten.":"The main course at a new host couple’s house. Full bellies, full points—and one last clue before the after-party.","Huvudrätten hos nästa lag. Middag och frågesport medan topplistan avgörs.":"The main course at the next team's place. Dinner and a quiz while the leaderboard is decided.","Leaderboard, quiz och omröstningar inbyggt.":"Built-in leaderboard, quizzes, and polls.","Livekarta över alla lag, hela kvällen.":"Live map of all teams, all evening.","Måste man kunna laga mat?":"Do you have to know how to cook?","Nej. Varje värd bjuder på en enda rätt – förrätt, varmrätt eller efterrätt – aldrig hela middagen. Kan du koka pasta eller breda en riktigt god macka klarar du en cykelfest. Resten är sällskapet.":"No. Each host serves just one course—an appetizer, a main course, or a dessert—never the entire meal. If you can cook pasta or make a really good sandwich, you can pull off a progressive dinner. The rest is all about the company.","Notiser når varje gäst på sekunden.":"Notifications reach every guest instantly.","Något gick fel – försök igen.":"Something went wrong—please try again.","Pasta för hela gänget hos nästa lya. Billigt, mätt och full fart mot efterfesten.":"Pasta for the whole crew at the next place. Cheap, filling, and off to the afterparty.","Rutter anpassade efter ert kvarter.":"Routes tailored to your neighborhood.","Rättvist fördelat: alla är värd för exakt en rätt.":"Fairly distributed: everyone hosts exactly one course.","Schemat klart på minuter — inte veckor.":"The schedule is ready in minutes—not weeks.","Sista ledtråden leder alla till efterfesten.":"The final clue leads everyone to the after-party.","Sista stoppet närmar sig. Lös den klurigaste ledtråden, cykla dit och gör er redo för final och efterfest.":"The final stop is approaching. Solve the trickiest clue, bike there, and get ready for the finale and the afterparty.","Skattjakt mellan stoppen — kvällen blir ett spel.":"Treasure hunt between stops — the evening turns into a game.","Tablehopp är cykelfest-plattformen: en progressiv middag på cykel. Förrätt hos en granne, varmrätt hos nästa, efterrätt hos en tredje – och mellan rätterna cyklar ni runt och löser ledtrådar om vart kvällen tar er.":"Tablehopp is the progressive dinner platform: a dinner on bikes. Starters at one neighbor’s house, the main course at the next, dessert at a third—and between courses, you’ll cycle around and solve clues to find out where the evening will take you.","Vad gör Tablehopp-appen?":"What does the Tablehopp app do?","Vanliga frågor":"Frequently Asked Questions","bli bland de första":"be among the first"};
  function norm(s){return (s||"").replace(/\s+/g," ").trim();}
  var lang=(function(){var l=null;try{l=localStorage.getItem("thlang");}catch(e){}
    if(l==="en"||l==="sv")return l;return (function(){try{if(/bot|crawl|spider|slurp|mediapartners/i.test(navigator.userAgent||""))return"sv";var a=navigator.languages||[navigator.language||""];for(var i=0;i<a.length;i++)if(/^sv/i.test(a[i]||""))return"sv";if((Intl.DateTimeFormat().resolvedOptions().timeZone||"")==="Europe/Stockholm")return"sv";}catch(e){}return"en";})(); /* default EN; Swedish only for Swedish-locale devices */})();
  /* mark <html> so CSS can target EN-only (e.g. the hero shrinks only in English,
     where the copy is longer; Swedish keeps its original big hero). */
  try{if(lang==="en"&&document.documentElement)document.documentElement.classList.add("th-en");document.documentElement.lang=lang;}catch(e){}
  var TOP=(window.top===window.self);

  /* ---- apply dictionary (only in EN) ----
     Translate individual TEXT NODES so loose text (icon+text bullets) and split
     text are covered. SAFE for the animated "manifesto" section: its strings are
     deliberately NOT in DICT, so there is nothing here to match or break. */
  var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,CODE:1};
  function translateNode(n){
    var v=n.nodeValue; if(!v||v.length>600) return;
    var key=norm(v); if(key.length<3) return;
    var t=DICT[key]; if(t===undefined) return;
    var lead=(v.match(/^\s+/)||[""])[0], trail=(v.match(/\s+$/)||[""])[0];
    var nv=lead+t+trail; if(nv!==v) n.nodeValue=nv;
  }
  function applyAll(){
    if(lang!=="en"||!document.body)return;
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){
      var p=n.parentNode; if(!p||SKIP[p.nodeName])continue;
      if(p.closest&&p.closest(".ro-lang,#th-splash,.ro-bullets"))continue;
      translateNode(n);
    }
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
      /* Segmented pill toggle. Translucent blurred backdrop so it stays legible over
         every section (hero blue, white, manifesto blue, green, dark footer) — the bare
         dark text used to vanish over dark sections. */
      var css='.ro-lang{position:fixed;top:14px;right:16px;z-index:2147483000;display:flex;align-items:center;gap:1px;padding:4px;border-radius:999px;background:rgba(255,255,255,.66);-webkit-backdrop-filter:blur(12px) saturate(1.35);backdrop-filter:blur(12px) saturate(1.35);border:1px solid rgba(25,25,25,.10);box-shadow:0 4px 14px rgba(25,25,25,.12);font-family:"Inter",system-ui,-apple-system,sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.02em;transition:opacity .3s ease,transform .3s cubic-bezier(.4,0,.2,1);will-change:transform,opacity}'
        +'.ro-lang button{-webkit-appearance:none;appearance:none;background:none;border:0;margin:0;cursor:pointer;font:inherit;padding:4px 10px;border-radius:999px;line-height:1;color:rgba(25,25,25,.5);transition:color .18s ease,background .18s ease;-webkit-tap-highlight-color:transparent}'
        +'.ro-lang button:hover{color:#191919}.ro-lang button.on{color:#191919;background:#fff;box-shadow:0 1px 3px rgba(25,25,25,.16)}'
        +'.ro-lang.ro-lang--off{opacity:0;transform:translateY(-170%);pointer-events:none}'
        +'@media(max-width:599px){.ro-lang{top:12px;right:12px;font-size:12px}.ro-lang button{padding:4px 9px}}'
        +'@media(prefers-reduced-motion:reduce){.ro-lang{transition:opacity .2s ease}.ro-lang.ro-lang--off{transform:none}}';
      var st=document.createElement("style");st.id="ro-lang-css";st.textContent=css;document.head.appendChild(st);
      var w=document.createElement("div");w.className="ro-lang";w.setAttribute("translate","no");w.setAttribute("aria-label",lang==="en"?"Language":"Språk");
      w.innerHTML='<button type="button" data-l="sv">SV</button><button type="button" data-l="en">EN</button>';
      var bs=w.querySelectorAll("button");for(var i=0;i<bs.length;i++)bs[i].classList.toggle("on",bs[i].getAttribute("data-l")===lang);
      w.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button");if(!b)return;var l=b.getAttribute("data-l");if(l===lang)return;try{localStorage.setItem("thlang",l);}catch(e){}location.reload();});
      document.body.appendChild(w);
      /* Follow the auto-hiding Framer header (data-nce-nav-scroll): when it slides out of
         view on scroll-down, the switcher slides away with it and returns together on
         scroll-up / at the top. We mirror the header's actual rendered position, so it
         stays in sync regardless of Framer's own thresholds, and degrades to
         always-visible if the header never hides. */
      var navEl=document.querySelector('[data-framer-name="Header"]'),q=false;
      function syncNav(){q=false;
        if(navEl&&!navEl.isConnected)navEl=document.querySelector('[data-framer-name="Header"]');
        if(!navEl)return;
        var r=navEl.getBoundingClientRect(),y=window.pageYOffset||document.documentElement.scrollTop||0;
        w.classList.toggle("ro-lang--off", r.bottom<=2 && y>4);
      }
      function onScr(){if(q)return;q=true;requestAnimationFrame(syncNav);}
      addEventListener("scroll",onScr,{passive:true});addEventListener("resize",onScr,{passive:true});
      setTimeout(syncNav,0);
    });
  }
})();