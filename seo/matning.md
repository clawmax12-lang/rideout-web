# SEO-mätlogg — tablehopp.app

Versionerad mätserie. Syftet är att kunna se **faktisk** effekt av innehållssatsningen i stället för
att gissa. Varje mätpunkt använder samma metod och samma frågeuppsättning, annars är serien värdelös.

## Metod och begränsningar (läs innan du tolkar siffror)

- Mätningen görs med agentens WebSearch, **inte** med Google Search Console eller ett rank-tracking-verktyg.
- **Verktyget är US-lokaliserat.** Resultatordningen är en proxy för google.se, inte en kopia av den.
  "Position" = träffens ordningsnummer i den returnerade listan.
- **Ingen sökvolymdata finns.** Vi ser vem som rankar, inte hur många som söker.
- **`site:`-operatorn honoreras inte fullt ut** av verktyget — svaret blir en luddig matchning.
  Använd `site:`-raden som en indikation, inte som antal indexerade sidor.
- Personalisering och geo-brus är inte kontrollerat.

Slutsatsen: serien är trubbig i absoluta tal men **konsekvent över tid**. Stora rörelser är
meningsfulla; en position upp eller ner är brus.

När Google Search Console är verifierad blir den den primära källan (visningar, klick, faktiska
sökfrågor, indextäckning) och den här loggen degraderas till komplement.

---

## Baslinje — 2026-08-18 (FÖRE utrullning)

Tillstånd vid mätningen: startsidan är sajtens enda indexerbara URL, ~586 ord indexerbar text,
ingen strukturerad data, sitemap med 1 URL. Blogg och teknisk SEO-grund ligger i PR #60, ej mergad.

### Indexering och varumärke

| Mätpunkt | Värde |
|---|---|
| `site:tablehopp.app` — distinkta tablehopp.app-URL:er | **1** (`https://tablehopp.app/`) |
| `tablehopp` — syns domänen? | Ja, ca position 3 |
| Vad som rankar över varumärket | 1) tablehopp.com  2) facebook.com (TableHoppOfficial) |

### De 12 arrangörssökningarna

| Sökning | Tablehopp syns? | Position (ca) | #1 idag | Topp-3 domäner |
|---|---|---|---|---|
| cykelfest | syns ej | — | cykelfest.kk.dk | cykelfest.kk.dk, johannagrek.wixsite.com, nybrocykelfest.se |
| cykelfest app | **ja** | 9 | facebook.com (Cykelfest App) | facebook.com, github.com, facebook.com |
| planera cykelfest | syns ej | — | cykelfester.se | cykelfester.se, helenalyth.se, facebook.com |
| cykelfest regler | syns ej | — | trampavidare.se | trampavidare.se, johannagrek.wixsite.com, cykelfest.online |
| cykelfest inbjudan mall | syns ej | — | skuggslem.se | skuggslem.se, cykelfestenivara.se, planeracykelfest.se |
| cykelfest excel | syns ej | — | trampavidare.se | trampavidare.se, akullsjon.se, planeracykelfest.se |
| cykelfest schema | syns ej | — | trampavidare.se | trampavidare.se, cykelfest.online, sorbybyalag.se |
| cykelfest lekar | syns ej | — | devote.se | devote.se, instagram.com, minhembio.com |
| cykelfest tema | syns ej | — | hembygd.se | hembygd.se, tiktok.com, tiktok.com |
| cykelfest meny | syns ej | — | gourmetmorsan.com | gourmetmorsan.com, pinglansreceptblogg.blogspot.com, pinterest.se |
| hur funkar en cykelfest | syns ej | — | johannagrek.wixsite.com | johannagrek.wixsite.com, cykelfest.wordpress.com, resarocykelfest.se |
| cykelfest ledtrådar | **ja** | 4 | trampavidare.se | trampavidare.se, baaam.se, lofsdalenbike.com |

### Sammanfattning av baslinjen

- **Syns på 2 av 12** arrangörssökningar (`cykelfest app` ca 9, `cykelfest ledtrådar` ca 4).
- **trampavidare.se är #1 på fyra** av tolv (regler, excel, schema, ledtrådar) — och handlar om
  gruppcykling, inte cykelfest. Den är den mest slåbara motståndaren.
- **cykelfest.online** finns i topp-10 på 8 av 12 men tar aldrig #1 i denna mätning.
- Varumärkessökningen delas med två amerikanska aktörer.

### Vad som ska röra sig, och när

De nya sidorna riktar sig direkt mot: regler, inbjudan mall, excel, schema, hur funkar en cykelfest.
Där är vi "syns ej" idag — allt utom noll är framsteg.

| Mätpunkt | Rimlig förväntan |
|---|---|
| +3 dagar | Sidorna upptäckta av Google |
| +2 veckor | Syns i `site:`, första långsvansplaceringarna |
| +6 veckor | Faktisk rörelse på regler/inbjudan/excel |
| +2–6 månader | Rörelse på huvudorden (cykelfest, planera cykelfest) |

---

## Mätpunkt 2 — (fylls i)

*Kör om exakt samma tabell ovan och notera skillnaden mot baslinjen.*
