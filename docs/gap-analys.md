# Gap-analys: vad sajten lovar mot vad som faktiskt säljs

Datum: 2026-09-19. Underlag: tablehopp.app i produktion, verifierad rad för rad.
Status: underlag för beslut. Ingen copy är skriven, ingenting är ändrat på sajten.

> **Internt dokument. Får inte publiceras.** Repots `.md`-filer serveras i dag publikt på
> domänen, se rad F1. Innan den här filen når `main` måste `.md`-filer stängas av, annars
> blir den läsbar på `https://tablehopp.app/docs/gap-analys.md`.

---

## Sammanfattning

Sajten säljer en färdig, självbetjänad app med kunder. Det som finns är en manuellt driven
tjänst utan betalande kunder, och en app som enligt ditt beslut inte ska presenteras som
släppt.

Tre saker är allvarligast, och alla tre är synliga för vem som helst utan att klicka:

1. En hel skärmhög sektion märkt **SOCIALT BEVIS** med ett påhittat kundcitat som uttryckligen
   påstår att en fest **arrangerats via appen**.
2. Hjältesektionen visar **"Gå med 23+ andra på väntelistan"** med tre ansiktsbilder. Siffran 23
   är hårdkodad och läggs ovanpå de verkliga anmälningarna.
3. Två knappar, **LADDA NER FÖR IPHONE** och **LADDA NER FÖR ANDROID**, säger att appen går att
   hämta i dag. Det motsäger väntelistan på samma sida, och Android-appen finns inte alls.

Utöver det ligger två främmande mallsajter publikt på domänen. `/archive/index.original.html`
svarar 200 **utan noindex** och innehåller biljettpriser i dollar, påhittade sponsorer och en
adress i San Diego.

Grundproblemet är inte formuleringar. Det är att fyra olika versioner av produkten samsas på
samma domän: en lanserad app, en väntelista, en prissatt tjänst och en gratis guidesajt.

---

## Metod

Varje påstående nedan är kontrollerat i tre steg, inte lästa ur källkoden enbart.

- **Renderad sida.** Sajten har körts i en riktig webbläsare med svensk locale, skrollad hela
  vägen ner så att alla in-view-animationer utlöses, och med alla sex FAQ-rader öppnade. Det
  skiljer på vad som syns, vad som syns först efter klick, och vad som bara ligger i koden.
- **Produktion mot repo.** Produktionens `index.html` är byte-identisk med repots, så fynden
  gäller det som faktiskt ligger live.
- **Ordlistan som facit.** `assets/i18n.js` innehåller 113 svenska källsträngar och fungerar som
  sajtens copy-inventarium. Varje nyckel är avprickad.

Statuskolumnen i tabellen betyder:

| Status | Innebörd |
|---|---|
| **Synligt** | En besökare ser det utan att göra något särskilt |
| **Efter klick** | Syns när besökaren öppnar en FAQ-rad |
| **Dolt** | Gömt med CSS, men levereras fortfarande i svaret och syns i visa källa, för crawlers och om JS fallerar |

Allvarlighetsgrad:

| Kod | Betydelse |
|---|---|
| **S1** | Falskt. Påstår att något hänt som inte hänt |
| **S2** | Osant i dag. Beskriver förmåga eller tillgänglighet som inte stämmer nu |
| **S3** | Fel mottagare. Talar till fel köpare, eller till gästen i stället för arrangören |
| **S4** | Skräp. Mallrester, trasig markup, motsägelser |

---

## A. Startsidan, synligt för besökaren

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S1, synligt]** Hela sektionen märkt "Socialt bevis": ”Fantastisk app. Hela festen gick som en väloljad tävlingscykel på vätternrundan.” attribuerat "— deltagare av cykelfest som arrangerats via appen" | Noll betalande kunder. Ingen fest har arrangerats via en såld app. Citatet kommer inte från en kund | Det tar en hel skärm och dess enda syfte är att bevisa att andra använt produkten. Påståendet är inte vagt, det säger att en fest arrangerats via appen. Upptäcks det faller allt annat på sajten med, även det som är sant |
| **[S1, synligt]** "Gå med **23**+ andra på väntelistan", med tre ansiktsbilder bredvid | `COUNT_BASE = 23` är hårdkodat och adderas till de verkliga anmälningarna. Repots egna anteckningar anger 6 verkliga anmälningar. Bilderna föreställer inte de som anmält sig | Det är den första siffran en besökare möter. Frågar en kund hur många som står i kön går den inte att svara på ärligt. En kommentar i koden kallar det rakt ut för "social-proof baseline" |
| **[S1, synligt]** Galleriet under rubriken "De bästa stunderna från kvällen" | Bilderna är generiska stockbilder, inte dokumentation av genomförda fester. Den första visar Stockholm, trots att sajten säger Uppsala | Bestämd form, "kvällen", läses som en specifik fest som ägt rum. Det är samma slags påstående som citatet, fast i bildform |
| **[S1, synligt]** "En cykelfest för 60 personer brukade kosta 75+ timmar logistik, 200 meddelanden och en utbränd arrangör. Tills nu." | Ingen källa, ingen mätning, inget datum. Siffrorna är påhittade | Det är sajtens enda kvantifiering av problemet. En arrangör som själv planerat en fest vet att 75 timmar är fel storleksordning, och slutar då lita på resten av sidan |
| **[S2, synligt]** H1: "Hela cykelfesten. Planerad i ett knapptryck." | Du sätter upp varje fest manuellt åt kunden i dag. Det finns inget knapptryck | Det är hela positioneringen, och det första en kund läser. Varje säljsamtal måste börja med att korrigera rubriken |
| **[S2, synligt]** Knapparna "LADDA NER FÖR IPHONE" och "LADDA NER FÖR ANDROID" i CTA-sektionen | Appen ska enligt ditt beslut inte presenteras som släppt. Någon Android-app finns inte | Två knappar säger att produkten finns att hämta nu, tre skärmar under en väntelista som säger motsatsen. Klicket är omdirigerat till väntelistan, men texten är ändå påståendet. Android-löftet går inte att infria alls |
| **[S2, synligt]** Mockupen visar ett app-gränssnitt med "Info om mitt lag", "Info om värdskap & uppdrag", "Info om min förrätt" | Visar en färdig produkt som en kund inte kan få tillgång till | Skärmbilden är det starkaste beviset på att appen finns och är klar. Den motsäger väntelistan mer än någon text gör |
| **[S2, synligt]** "Allt sker i Tablehopp-appen, ledtrådar, karta till nästa värd och poäng i realtid. Ladda ner, samla gänget och kör." | Ingen nedladdning ska erbjudas | En instruktion i imperativ om att ladda ner något som inte ska laddas ner |
| **[S2, synligt]** Sju funktionslöften i presens i mockupsektionen: "Leaderboard, quiz och omröstningar inbyggt.", "Livekarta över alla lag, hela kvällen.", "Notiser når varje gäst på sekunden.", "Rutter anpassade efter ert kvarter.", "Rättvist fördelat: alla är värd för exakt en rätt.", "Schemat klart på minuter, inte veckor.", "Skattjakt mellan stoppen, kvällen blir ett spel." Samt "Lägg in gänget och tryck en gång. Appen matchar värdpar, fördelar rätterna och bygger rutterna" | Beskriver sju färdiga funktioner som om de är i drift. Verkligheten är manuell uppsättning | "Inbyggt", "räknas", "når", "klart" är alla påståenden om nuläget, inte om planer. Tillsammans med skärmbilden är detta den mest detaljerade beskrivningen av en produkt kunden inte kan få. Varje enskilt löfte blir en förväntan som måste hanteras i mötet |
| **[S2, synligt]** FAQ 2: "Vad gör Tablehopp-appen?" besvarad i presens: "Den släpper ledtrådar, visar vägen till nästa värd, kör quiz och omröstningar och håller poängen live" | Beskriver funktioner som om de är i drift hos kunder | Presens är ett tillgänglighetslöfte. Kunden utgår från att allt detta går att använda på sin fest nästa månad |
| **[S2, efter klick]** FAQ 6: "Ni betalar ett fast pris per fest, utan abonnemang: 595 kr för upp till 30 personer, 895 kr för 31–60 och 1 395 kr för 61–100." | Priset är en hypotes, inte beslutat. Modellen ska ha två vägar, och en av dem **är** ett abonnemang | Dubbelt fel. Dels publiceras priser innan tre fester är betalda, dels utesluter texten uttryckligen abonnemanget som är halva den tänkta modellen. Kunden ankras på 595 kr och varje annat förslag blir en prishöjning |
| **[S3, synligt]** "För vem": fem jämnstora målgrupper, Grannskap, Förening/BRF, Företag, Studenter, Vänner & kollegor | Den enda verifierade köparen är studentföreningar och festarrangörer som kör pubrundor, cirka 20 personer per tillfälle | Den verkliga köparen ligger som nummer fyra av fem och beskrivs utifrån, "Billigt, socialt och lagom kaosigt", i stället för att tilltalas. Ingen av de fem känner igen sig helt, och studentföreningen känner sig beskriven, inte förstådd |
| **[S3, synligt]** "Sugen? Samla gänget." och "Skapa er cykelfest" | Köparen är arrangören, en person med ett ansvar, inte gänget | Tilltalet går till deltagaren. Den som faktiskt betalar och gör jobbet tilltalas aldrig som den som bär arbetet |
| **[S3, synligt]** Sidtitel "Tablehopp — cykelfest-plattformen" och meta description "planerar hela cykelfesten i ett knapptryck" | Köparen kör pubrundor och sittningar, inte nödvändigtvis cykelfest | Positioneringen låser produkten till ett format som den kända köparen inte efterfrågar. Samtidigt upprepas knapptryckslöftet i sökresultatet |
| **[S4, synligt]** Kartan i kontaktblocket är en platshållare med sökfrågan `q=Framer%20B.V.` | Adressen är Uppsala | Kartan pekar på Framers huvudkontor i Nederländerna |

---

## B. Startsidan, kvar i koden men dolt

Dolt innehåll är osynligt för en besökare med fungerande JS och CSS, men det levereras i
HTML-svaret. Det syns i visa källa, för crawlers och LLM-botar, och om JS fallerar.

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S2, dolt]** Hela prissektionen: "Upp till 30 / 595 kr / fest", "31–60 / 895 kr", "61–100 / 1 395 kr", med "Välj"-knappar och rubriken "Ett pris per fest. Inget abonnemang." | Priset är inte beslutat, och abonnemanget som förnekas är en av de två tänkta vägarna | Sektionen är gömd men ligger kvar i det levererade svaret. Samma priser är dessutom synliga via FAQ, så borttagningen är ofullständig och ger falsk trygghet |
| **[S1, dolt]** "Kaninens Cykelfest 2025" som attribution till citatet | Namnger ett verkligt evenemang som källa för ett omdöme som inte kommer därifrån | Om sektionen någonsin visas igen namnges ett riktigt arrangemang som referenskund |
| **[S1, dolt]** Knappen "Läs fler berättelser" | Det finns inga berättelser | Antyder en samling kundberättelser bakom länken |
| **[S4, dolt]** "GRAB IT NOW" och "More Templates" | Framers mallreklam, inte Tablehopps text | Engelsk mallreklam i det levererade svaret på en svensk sajt |
| **[S4, i källan]** "Warm regards" i Quote Section, ersätts vid körning av manifestet | Mallrest | Syns i visa källa och för den som läser rå HTML |
| **[S4, dolt]** Hela sektionen "Vår historia / Det började i Uppsala" med Kaninen-berättelsen | Dold, men kvar | Berättelsen finns kvar i koden trots att den tagits bort visuellt |

---

## C. Bloggen, mönster som upprepas på alla 18 sidor

Här tas mönstret upp en gång i stället för arton gånger. Det gäller hubben och samtliga 17
artiklar.

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S2, synligt, 18 sidor]** CTA-blocket: "Tablehopp lottar lagen, fördelar rätterna, bygger rutterna och håller poängen live, hela cykelfesten planerad i ett knapptryck. **Appen lanseras snart.**" | Fyra verb i presens om en produkt som i samma mening beskrivs som inte lanserad | Meningen motsäger sig själv. Läsaren vet inte om produkten finns eller inte. Samtidigt säger startsidan "Ladda ner", vilket ger en tredje version |
| **[S2, synligt, 18 sidor]** Sidfoten: "Tablehopp · cykelfest-plattformen · Byggd i Uppsala" | "Plattformen" påstår en existerande plattform | Upprepas 18 gånger och förstärker bilden av en driftsatt tjänst |
| **[S4, synligt]** Författarraden är inkonsekvent. 7 artiklar har "av Tablehopp", 10 har "av William Svanqvist, grundare av Tablehopp" | En person | Ser slarvigt ut, och skillnaden är godtycklig snarare än motiverad |
| **[S1, synligt]** Blogghubben: "Skrivet av teamet bakom Tablehopp" | Integritetspolicyn säger "Tablehopp (grundare William)", singular | Sajten påstår ett team på en sida och en person på en annan. Antyder en större organisation än den som finns |
| **[S2, synligt, 12 artiklar]** Tipsrutor som garanterar funktion i presens, till exempel "I Tablehopp är ett avhopp ett knapptryck", "Poängen räknas live i appen", "appen samlar automatiskt ihop rätt information till rätt värd" | Funktioner som inte går att använda i dag | Tolv separata funktionslöften utspridda i innehållet. Allergirutan är den känsligaste, eftersom den utlovar att allergiinformation automatiskt når rätt värd |

---

## D. Bloggen, påståenden som är unika för enskilda artiklar

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S2, synligt]** `cykelfest-budget-pris`: "Tablehopp kostar ett fast pris per fest (595–1 395 kr beroende på antal deltagare), betalat av arrangören, inga per-person-avgifter" | Priset är inte beslutat. Fyra rader längre ned står "Appen lanseras snart" | Publicerat pris för en produkt som samma sida säger inte finns. Det är den sida en prismedveten arrangör hittar via sök |
| **[S1, synligt]** `cykelfest-aktivitet-grannar`: "Enligt återkommande undersökningar sker de flesta spontana grannmötena vid ett fåtal tillfällen: grillning (ca 30%), midsommarfirande (ca 18%) och kräftskiva (ca 13%)", renderat som ett stapeldiagram | Ingen undersökning är namngiven, inget årtal, inget urval. Siffrorna har ingen källa | Diagrammet ger siffrorna vetenskaplig tyngd de inte har. Det är den tydligaste överträdelsen mot regeln om statistik utan källa och datum på hela sajten |
| **[S1, synligt]** Samma sida: "Ett vanligt mönster: ett kvarter ... Första året anmäler sig sex par ... År två har ordet spridit sig och gruppen växer till tolv eller femton par" | Hypotetiskt exempel, inte en kund | Läses som en kundberättelse med siffror. Inget markerar det som påhittat |
| **[S1, synligt]** Samma sida: "har du haft ett riktigt samtal ... med tio till tjugo grannar i stället för de fyra du redan kände" | Ingen mätning finns | Kvantifierat utfallslöfte utan grund |
| **[S1, synligt]** `cykelfest-brf-villaforening`: "En stor andel av Sveriges cykelfester arrangeras av bostadsrättsföreningar och villaföreningar" | Ingen källa | Marknadspåstående riktat till en styrelse, alltså till läsare som fattar beslut i grupp och kan komma att citera det vidare |
| **[S1, synligt]** Tre absoluta påståenden: "Ingen svensk sida har skrivit ner cykelfestens regler", "Det finns ingen bra inbjudningsmall för cykelfest på svenska webben, förrän nu", "Ingen svensk sida har samlat svaren på ett ställe" | Ingen kartläggning som styrker det | Lätt att motbevisa med en sökning. Skadar trovärdigheten på sidor som i övrigt är bra |
| **[S1, synligt]** "beprövade lekar", "30 teman som faktiskt använts", "använt på en riktig svensk cykelfest" | Ingen källa till att något är beprövat eller använt | Små ord, men de påstår erfarenhet som inte finns dokumenterad |
| **[S4, synligt]** `cykelfest-excel-mall`: rubriken säger att arket spricker "vid 20 par", brödtexten säger nio respektive tolv par | Motsäger sig själv | Läsaren kan inte lita på sidans egen slutsats |
| **[S4, synligt]** `cykelfest-excel-mall`: citat från "ett av dem", en onämnd konkurrent, utan länk eller datum | Ociterat citat | Citattecken kring ord som tillskrivs någon som inte namnges |
| **[S4, synligt]** `cykelfest-tema`: ett `<li>` stängs aldrig, så två rubriker, en tabell och en tipsruta hamnar inuti en punktlista | Trasig markup | Synligt layoutfel på en sida som ska visa upp kvalitet |
| **[S4, synligt]** Juridiska påståenden om hjälmkrav, promille och ansvar saknar förbehåll i `cykelfest-regler` och `cykelfest-brf-villaforening`. Endast `cykelfest-alkohol-hjalm-ansvar` har ett | Ingen juridisk granskning | Två sidor ger juridiska besked utan reservation, varav en till en styrelse. Dessutom hänvisas "vårdslöshet i trafik" till trafikförordningen, vilket bör kontrolleras |

---

## E. Inbäddade mallsidor

Båda är främmande Framer-mallar med svenskt innehåll inklistrat. De maskeras med JS-överlägg i
föräldrasidan, men allt innehåll levereras.

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S1]** `/cta-embed` innehåller "4.7 rating (based on 125 reviews)", "(Trusted by 1582+ users)", "62,000+ Check-ins logged last month", "87% Weekly consistency", "Get it for FREE" och 13 namngivna påhittade omdömen med yrkestitlar | Noll kunder, noll recensioner | Sidan svarar 200. Innehållet ligger i det levererade svaret och i mallens egna sökindexfiler. Faller JS syns hela mallsidan med betyg och recensioner |
| **[S1]** `/app-embed` innehåller omdömen från "Sarah Lund, Head of Sales", "Daniel Ortiz", "Maya Chen, VP Sales", samt prissättning "Pro $399 / month" | Påhittade personer och ett pris som inte är Tablehopps | Samma exponering. Dessutom ett helt annat pris i dollar |
| **[S4]** `/app-embed` har titeln "Echo | SaaS Website Template" och canonical mot `echoagentai.framer.website` | Sidan är en del av tablehopp.app | Den som öppnar adressen direkt ser en annan produkts mall |

---

## F. Publika och oskyddade filer på domänen

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S1] Allvarligast av allt.** `https://tablehopp.app/AGENT-SESSION-NOTES.md` svarar **200**. Filen är 47 kB intern arbetsdokumentation och innehåller bland annat: "`COUNT_BASE = 23` baseline + real count", lärdom 25 "**Real social-proof count starts at 0 → '0+' looks dead.** Use a `COUNT_BASE` baseline", noteringen om 6 verkliga anmälningar, samt "footer's fake email form ... it POSTed nowhere and showed 'TACK!', silent lead loss" | Intern dokumentation som aldrig var avsedd att publiceras | Det här är värre än siffran i sig. Vem som helst kan på er egen domän läsa en förklaring, på engelska och i klartext, av att väntelistans siffra är uppblåst. Det är ett citerbart erkännande. En konkurrent, journalist eller kund som hittar filen behöver inte bevisa något, dokumentet gör det åt dem. **Inga nycklar läcker**, filen säger korrekt att service_role och RESEND_API_KEY är hemliga och inte incheckade, men projektets Supabase-referens och hela den interna arkitekturen ligger öppet |
| **[S4]** Även `/seo/matning.md` och `/specs/overnight-perf.md` svarar 200 | Intern mätlogg och intern kravspec | Mätloggen redovisar att ni syns på 2 av 12 sökningar och vilka konkurrenter som slår er. Kravspecen redovisar prestandaproblem. Inget av det är avsett för kund |
| **[S1]** `/archive/index.original.html` och `/archive/index.eventin.html` svarar **200 utan noindex**. Innehåller "Basic Plan $19 / Ticket", "Standard Plan $39", "Premium Plan $79", "Supported by Industry Leaders Worldwide", "Platinum Sponsors", tolv påhittade personer, adressen "2362 ocean view blvd, san diego" och "Info@eventin.com" | Ingenting av detta har med Tablehopp att göra | Det här är den enda ytan som Google fritt får indexera med påhittat innehåll. Till skillnad från embed-sidorna finns inget noindex och ingen maskering. En kund eller investerare som söker kan landa på en sida på er domän som visar biljettpriser i dollar och en amerikansk adress |

---

## G. Övrigt

| Vad sajten lovar idag | Vad som faktiskt säljs | Konsekvens om en kund läser detta |
|---|---|---|
| **[S4]** `/integritet`: "Tablehopp är en väntelista inför lanseringen av vår app för cykelfester" | Detta är den enda sidan som beskriver läget korrekt | Rätt i sak, men den motsäger startsidans "Ladda ner" och bloggens priser. Sanningen finns bara på den sida ingen läser |
| **[S4]** `/integritet`: "Uppdaterad 3 juli 2026" | Bloggen är daterad 18 augusti, i dag är det 19 september | Daterad före innehåll som tillkommit sedan dess |
| **[S4]** `/integritet`: "Inga spårningscookies" | Varje bloggsida laddar `/_vercel/insights/script.js`, och embed-sidorna laddar Framer- och Google-resurser som inte nämns | Bör kontrolleras så att policyn stämmer med vad som faktiskt laddas |
| **[S4]** `404.html`: dekalen "Cykelfest 2026" | Årtalsstämpel | Läses som inaktuell från januari 2027 |

---

## Femsekunderstestet

En målkund landar på sidan. Inom fem sekunder ska fyra saker vara klara. Godkänt kräver alla
fyra.

| Sida | 1. Vad är det | 2. Vem är det för | 3. Varför bry sig | 4. Vad gör jag nu | Dom |
|---|---|---|---|---|---|
| **Startsidan** | Oklart. En app att ladda ner, eller en väntelista? Båda påstås | Nej. Fem målgrupper jämnstora | Ja. Problemet är tydligt formulerat | Nej. "Gå med i väntelistan" och "Ladda ner för iPhone" konkurrerar på samma sida | **Underkänd på 1, 2 och 4** |
| **`/blogg` hubb** | Ja. Guider för arrangörer | Ja. Den som arrangerar cykelfest | Ja | Delvis. Väntelistan, men produkten sägs både finnas och inte finnas | **Underkänd på 4** |
| **Bloggartikel** | Ja, som artikel. Nej som produkt | Ja | Ja | Nej. Samma motsägelse, plus pris på en av sidorna | **Underkänd på 4** |
| **`/integritet`** | Ja | Ja | Ej tillämpligt | Ej tillämpligt | Godkänd i sitt syfte |
| **`404.html`** | Ja | Ja | Ja | Ja | Godkänd |
| **`/cta-embed`, `/app-embed`** | Nej. Främmande mall på engelska | Nej | Nej | Nej | **Underkänd på alla fyra** |
| **`/archive/*`** | Nej. Annan produkt, annat land, annan valuta | Nej | Nej | Nej | **Underkänd på alla fyra** |

---

## De fyra frågorna

### 1. Vilket enskilt påstående är mest fel, och vad kostar det

Sektionen märkt "Socialt bevis" med citatet ”Fantastisk app. Hela festen gick som en väloljad
tävlingscykel på vätternrundan.” attribuerat till "deltagare av cykelfest som arrangerats via
appen". Den är mest fel därför att den inte överdriver något som finns, utan hittar på en
händelse och en persons ord om den, i en sektion vars enda funktion är att bevisa att andra
redan använt produkten, samtidigt som antalet kunder är noll. Den är synlig utan att någon
behöver klicka och tar en hel skärmhöjd. Kostnaden är att den inte går att förklara bort i ett
säljsamtal. Ett för högt pris kan förhandlas och ett oklart löfte kan förtydligas, men en kund
som förstår att omdömet är påhittat har inget skäl kvar att tro på resten av sajten, inklusive
det som faktiskt är sant om produkten. Närmast efter kommer "23+ andra på väntelistan", som är
samma sorts fel i sifferform och dessutom det första besökaren ser. Dyrast över tid är dock
rubriken "planerad i ett knapptryck", eftersom den är fel i varje enskilt samtal och tvingar
varje möte att börja med en korrigering.

### 2. Vem sajten säger att köparen är, mot vem köparen faktiskt är

Sajten säger att köparen är ett kvarter. Tilltalet går genomgående till en grupp, "ni", "gänget",
"Sugen? Samla gänget.", och i "För vem" ställs fem målgrupper upp jämnstora, där grannskapet står
först och studenter fjärde av fem. Ingen av de fem tilltalas som den person som bär ansvaret,
lägger tiden och betalar. Den faktiska köparen är en enskild arrangör, i det enda verifierade
fallet en studentförening eller festarrangör som kör pubrundor för omkring 20 personer. Den
personen är inte ute efter en trevlig kväll i kvarteret, utan efter att slippa ett
administrativt arbete som i dag landar på hen. Sajten beskriver dessutom studenter utifrån,
"Billigt, socialt och lagom kaosigt", vilket är hur någon pratar om studenter, inte hur man
talar till en studentföreningsordförande som ska fatta ett inköpsbeslut. Resultatet är att den
enda köpare som är bevisad hittar en sida som varken använder hens ord, hens format eller hens
storlek på sällskap.

### 3. Vad sajten antyder om skala, användning och traction som inte är sant

Sammanlagt elva separata signaler antyder en produkt i drift med användare. Synligt på
startsidan: väntelistans "23+", tre ansiktsbilder bredvid siffran, kundcitatet, attributionen
till "cykelfest som arrangerats via appen", galleriet "De bästa stunderna från kvällen" med
stockbilder, och siffrorna "75+ timmar" och "200 meddelanden". Dolt men levererat: "Kaninens
Cykelfest 2025" och knappen "Läs fler berättelser", som antyder en hel samling kundberättelser.
I bloggen: "En stor andel av Sveriges cykelfester arrangeras av bostadsrättsföreningar",
diagrammet med 30, 18 och 13 procent utan namngiven källa, och det hypotetiska kvarteret som
växer från sex till femton par och läses som en kund. I de inbäddade mallsidorna, levererade
men maskerade: "4.7 rating (based on 125 reviews)", "Trusted by 1582+ users", "62,000+" och
sexton namngivna påhittade personer. Verkligheten bakom allt detta är noll betalande kunder, en
skickad och osignerad offert, och sex verkliga anmälningar på väntelistan.

### 4. Var samtalet spricker när en prospect som läst sajten möter dig

Det spricker på fyra bestämda punkter, i tur och ordning. **Först på tillgängligheten.** Kunden
har sett två nedladdningsknappar och en skärmbild av appen, och kommer till mötet med
förväntningen att kunna hämta den samma dag, kanske till en fest om två veckor. Svaret är att
appen inte kan laddas ner. **Sedan på hur den sätts upp.** Rubriken lovade ett knapptryck och
FAQ:n beskriver ett självbetjänat flöde. Verkligheten är att du sätter upp festen manuellt åt
kunden, vilket är en annan produkt än den som marknadsförts. Det behöver inte vara sämre, men
det är inte det som utlovats, och kunden märker skillnaden direkt när hen frågar var hen loggar
in. **Sedan på priset.** Kunden har läst 595 kr och meningen "utan abonnemang" och har ankrat
där. Den modell du faktiskt vill diskutera innehåller ett abonnemang, alltså exakt det sajten
sagt att det inte finns, och varje avvikelse uppåt uppfattas nu som en prishöjning i stället för
ett förslag. **Sist, och värst, på referenserna.** Kunden har läst ett kundcitat och sett att 23
andra står i kön. Frågan "vilka andra har kört det här?" kommer garanterat. Svaret är ingen. I
det ögonblicket omvärderas de tre tidigare punkterna från optimism till något kunden själv
kommer att kalla vilseledande, och samtalet handlar inte längre om produkten utan om huruvida
det går att lita på dig.

---

## Prioriterad åtgärdsordning

Ingen copy är skriven här. Detta är ordningen jag föreslår, inte formuleringarna.

**Nivå 1, bör bort innan någon mer besökare kommer in. Rena osanningar, synliga.**

1. Sektionen "Socialt bevis" med citatet och attributionen. Ta bort, ersätt inte med något annat
   omdöme.
2. `COUNT_BASE = 23`. Sätt till 0. Under tio anmälningar visar koden redan "Bli bland de första
   på väntelistan", vilket är sant och fungerar bra.
3. Ansiktsbilderna vid väntelistan, om de inte föreställer personer som faktiskt anmält sig och
   sagt ja till det.
4. Siffrorna "75+ timmar" och "200 meddelanden" i manifestet, samt "75+ timmar i Excel".
5. Rubriken "De bästa stunderna från kvällen" över stockbilder. Antingen ny rubrik som inte
   påstår en genomförd fest, eller bort.

**Nivå 2, motsägelsen om att appen finns.**

6. Knapparna "Ladda ner för iPhone" och "Ladda ner för Android" samt "Hämta appen" och QR-kortet
   i CTA-sektionen.
7. "Ladda ner, samla gänget och kör" i FAQ 3.
8. Presensbeskrivningarna i FAQ 2 och i de tolv tipsrutorna i bloggen.
9. Bestäm en enda formulering för läget och använd exakt den överallt. I dag finns tre.

**Nivå 3, priserna.**

10. FAQ 6, priserna och frasen "utan abonnemang".
11. Prisstycket i `cykelfest-budget-pris`.
12. Den dolda prissektionen och navlänken "Priser". Dold räcker inte, eftersom samma priser är
    synliga via FAQ.

**Nivå 4, den publika filexponeringen. Detta är brådskande och oberoende av all copy.**

13. `AGENT-SESSION-NOTES.md` ligger öppet på domänen och förklarar i klartext att väntelistans
    siffra är uppblåst. Stäng åtkomsten först av allt i denna grupp. Notera att filen ligger
    kvar i git-historiken även efter att den slutar serveras.
14. `/seo/matning.md` och `/specs/overnight-perf.md`, samma åtgärd.
15. Stäng generellt: `.vercelignore` eller en regel i `vercel.json` som gör att `.md`-filer,
    `docs/`, `specs/`, `seo/` och `archive/` inte serveras alls. Punktfix per fil kommer att
    missa nästa fil någon lägger till. **Detta gäller även det här dokumentet**, som innehåller
    meningen "noll betalande kunder" och inte får bli publikt.
16. `/archive/*`. Indexerbart utan noindex. Ta bort från deployen eller blockera.
17. `/cta-embed` och `/app-embed`. Noindex finns, men innehållet levereras. Rensa mallens
    recensioner, betyg och priser ur filerna i stället för att bara maskera dem.

**Nivå 5, mottagare och positionering. Detta är steg 3 i ditt upplägg, inte nu.**

15. Vem sidan talar till, och i vilka ord.
16. Om "cykelfest-plattformen" ska vara positioneringen när den kända köparen kör pubrundor.

**Nivå 6, städning.**

17. Ostängt `<li>` i `cykelfest-tema`.
18. Motsägelsen 20 mot 12 par i `cykelfest-excel-mall`, och det ociterade konkurrentcitatet.
19. Juridiska förbehåll på `cykelfest-regler` och `cykelfest-brf-villaforening`.
20. Enhetlig författarrad. "teamet bakom Tablehopp" mot "grundare William".
21. Datum och cookieformulering i `/integritet`. Kartans `q=Framer%20B.V.`.
22. Mallresterna "GRAB IT NOW", "More Templates", "Warm regards".

---

## En öppen fråga som bara du kan avgöra

Ditt eget upplägg säger: beskriv bara det som finns och fungerar i dag, och planerad
funktionalitet får inte synas i någon form, "inklusive coming soon". Samtidigt är beslutet att
väntelistan ska vara kvar, och en väntelista förutsätter per definition något som kommer.

De två reglerna kan samexistera, men bara om gränsen dras uttryckligen. Min tolkning, som jag
vill ha bekräftad innan jag skriver en rad copy:

- Väntelistan får finnas och får säga att den är en väntelista.
- Ingen **funktion** får beskrivas i presens som om den går att använda.
- Ingen nedladdning, inget datum, inget "snart" knutet till en enskild funktion.

Det gör skillnad på "det här är en väntelista", som är sant, och "appen lottar lagen och håller
poängen live", som lovar något ingen kan få. Säg till om du drar gränsen någon annanstans.

---

## Nästa steg

Enligt ditt upplägg stannar jag här. När du godkänt den här analysen ställer jag de fyra
frågorna i avsnitt 6, och först när de är besvarade skrivs copy, en sida i taget.
