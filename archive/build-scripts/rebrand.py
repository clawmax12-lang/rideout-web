#!/usr/bin/env python3
"""
Rebrand Eventin -> RideOut (Swedish copy) across the three text surfaces that drive
the page: index.html (SSR), the page component chunk (hydration), and the searchIndex JSONs.

Matching is delimiter-aware so short words can't corrupt minified code:
  - JS chunk / shared-lib : backtick literal  `KEY`  ->  `VAL`
  - index.html            : visible text      >KEY<  ->  >VAL<   (& encoded as &amp;)
  - searchIndex JSON      : exact array/string VALUE == KEY -> VAL
Long unique strings (>=24 chars) are replaced raw everywhere (safe, no collisions).
The duplicated heading "Supported by Industry Leaders Worldwide" (sponsor band, then
about band) is replaced positionally: 1st -> Kaninen quote, 2nd -> origin-story heading.
"""
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
CHUNK = "assets/scripts/8GPhkq_ajAaqmVWr1e--kPgfrz0uq8JyBIQFPGNzu9w.C0NccTdT.mjs"
SHARED = "assets/scripts/shared-lib.Cz7fyOg9.mjs"
HTML = "index.html"
JSONS = ["assets/data/searchIndex-PvRd8NEAHG59.json", "assets/data/searchIndex-VdgV1Bemd2Ne.json"]

# --- English (exact stored case) -> Swedish RideOut ---
MAP = {
    # meta / title
    "Eventin": "RideOut",
    "Eventin is a modern and well-structured Framer template designed for event management companies, planners, and production teams. It helps businesses present their event services, planning process, and execution capabilities in a clear and trustworthy way.":
        "RideOut är cykelfest-plattformen: en progressiv middag på cykel. Förrätt hos en granne, varmrätt hos nästa, efterrätt hos en tredje – och mellan rätterna cyklar ni runt och löser ledtrådar om vart kvällen tar er.",

    # hero
    "Innovators Connect Event Live": "Tre middagar. Tre hem. En kväll på cykel.",
    "Corporate Event": "Cykelfest",
    "London, UK": "Var som helst",
    "Book Your Seat": "Skapa er cykelfest",
    # rotating badge phrases
    "Join the Adventure on Two Wheels": "Ge er ut på två hjul",
    "Experience the 2026 Adrenaline Rush": "Årets roligaste kväll 2026",
    "Gravity Has No Limits Here.": "Ingen vet vart kvällen tar er.",
    "Feel the Thrill. Live the Stunt": "Cykla. Ät. Gissa.",
    "learn before earn": "följ ledtråden",

    # top nav + footer quick links
    "buy ticket": "Skapa er cykelfest",
    "Essentials": "Så funkar det",
    "About us": "Vad är en cykelfest",
    "Home": "Hem", "home": "Hem",
    "About": "Vad är en cykelfest",
    "Events": "Så funkar det",
    "Pricing": "Priser",
    "Contact": "Kontakt",
    "Quick links": "Snabblänkar",

    # §2 concept
    "About Event": "Vad är en cykelfest?",
    "AN Exciting and inspiring Event": "Okej, men vad är det egentligen?",
    "Join us at this exciting summit where innovators, leaders, and professionals come together to share anything.":
        "Tänk vanlig middag, fast utspridd över kvarteret. Varje rätt äts hemma hos olika värdar, och mellan rätterna tar ni cykeln dit. Ni vet inte var nästa stopp ligger förrän ni löst kvällens ledtråd.",
    "Get a ticket": "Vad är en cykelfest?",
    "Expert Speakers": "Cykla",
    "Hands-on sessions to boost your professional skills.": "Korta sträckor mellan stoppen. Precis lagom efter en tallrik mat.",
    "Innovative Ideas": "Äta",
    "Strategies and knowledge to advance your career.": "En rätt per värd. Ingen lagar allt, alla bjuder på något.",
    "Business Growth": "Gissa & tävla",
    "Explore the latest trends and breakthroughs with us.": "Ledtrådar avslöjar nästa adress. Poäng plockar ni på vägen.",

    # §3 timeline
    "Our Events": "Så går kvällen till",
    "Join us for events that inspire, connect and celebrate.": "En kväll, fyra hållplatser",
    "Greetings": "Samlas",
    "Seminar : Best of Designs": "Förrätt",
    "Lunch Break": "Cykla vidare",
    "Seminar : Vision of Design": "Final",
    "Seminar : Hands of Design": "Efterfest",
    "Discover how powerful ideas transform into meaningful visuals. Vision of Design is a seminar built for creators, thinkers, and innovators who want to elevate their creative perspective. From understanding user behavior to crafting designs that inspire emotions.":
        "Sista stoppet, vinnarna koras och efterfesten tar vid. Allt avgörs av kvällens poäng – och vem som löste flest ledtrådar på vägen.",
    "Design": "Tema", "Visuals": "Ledtrådar", "Creativity": "Poäng",
    "9:00 am - 10:00 am": "18:00", "10:00 am - 11:45 am": "18:30",
    "12:15 pm - 1:00 pm": "19:30", "2:15 AM – 3:00 PM": "21:00",
    "22 jan, 2026": "Kvällen", "24 jan, 2026": "Kvällen", "26 jan, 2026": "Kvällen",
    "Nichol German": "Värdpar", "Terrell Forrest": "Värdpar",
    "George Simmons": "Värdpar", "James Morris": "Värdpar",

    # §4 sponsors -> Kaninen quote band
    "Sponsors": "Socialt bevis",
    "Platinum Sponsors": "— Anna, Uppsala",
    "Gold Sponsors": "Kaninens Cykelfest 2025",
    "Become a Sponsor": "Läs fler berättelser",

    # §5 speakers -> För vem
    "Our Speakers": "För vem",
    "Meet the Brilliant Minds Shaping the Future": "Funkar på gatan, i föreningen och på jobbet",
    "Kevin Turner": "Grannskap", "CEO / Founder": "Lär känna folk ni bara nickar åt idag. En kväll räcker.",
    "Walter Crosby": "Förening / BRF", "Leadership Coach": "En aktivitet som drar folk, utan att styrelsen planerar ihjäl sig.",
    "Kristy Hopkins": "Företag", "Author": "Teambuilding som folk vill gå på. Byt cykeln mot elsparkcykel om ni vill.",
    "James Olson": "Studenter", "Startup Mentor": "Billigt, socialt och lagom kaosigt. Kör det kvartersvis.",
    "Leota Martinez": "Vänner & kollegor", "Technology Expert": "En kväll räcker för att bli ett gäng.",

    # §6 gallery
    "THE BEST MOMENTS FROM OUR EVENT": "De bästa stunderna från kvällen",
    "gallery": "Galleri",

    # §7 pricing
    "Pricing plans": "Priser",
    "Flexible Pricing Options to Suit Everyone": "Ett pris per fest. Inget abonnemang.",
    "Basic Plan": "Upp till 30", "$19": "595 kr", "/ Ticket": "/ fest",
    "Standard Plan": "31–60", "$39": "895 kr",
    "Premium Plan": "61–100", "$79": "1 395 kr",
    "Get Started Now": "Välj",
    "Entry to all main stage sessions": "Hela kärnan – progressiv middag på cykel",
    "Access to exhibition booths": "Skattjakt med ledtrådar",
    "Community networking access": "Leaderboard i realtid",
    "Mobile-friendly access": "Ingen nedladdning – funkar i webbläsaren",
    "Secure data protection": "Färdiga teman & maskot",
    "Digital event guide": "Quiz & omröstningar",
    "Email notifications enabled": "Support i appen",
    "Priority check-in lane": "Allt i Upp till 30, plus:",
    "Priority customer support": "Fler grundblock",
    "Reserved premium seating": "Egna ledtrådar och teman",
    "Speaker Q&A access": "Realtidskontroll av kvällen",
    "Complimentary refreshments": "Anpassa lag och värdar",
    "Live event recordings access": "Notiser till deltagarna",
    "Social media photo access": "Prioriterad support",
    "Meet & greet with speakers": "Allt i 31–60, plus:",
    "Dedicated VIP lounge access": "Byggt för den stora festen",
    "Front-row seating guarantee": "Avancerad skattjakt",
    "Exclusive networking dinner": "Flera lag och zoner",
    "Personalized event concierge": "Egen maskot och färger",
    "Premium gift package": "Dataexport ingår",
    "Fast-track entry to all sessions": "Prioriterad support",

    # §8 why choose us -> story
    "Why Choose Us": "Vår historia",
    "Our Story": "Vår historia", "Our Mission": "Vårt uppdrag", "Our Vision": "Ingen nedladdning",
    "Every great event begins with a story, and ours is fueled by passion and creativity.":
        "Det började med en cykelfest mellan grannar i Uppsala – Kaninens Cykelfest. Den blev årets höjdpunkt på gatan.",
    "To create seamless, innovative, and memorable events that connect people, inspire.":
        "Att låta vem som helst köra sin egen cykelfest. Appen gör det tunga jobbet, ni tar hand om stämningen.",
    "We envision a world where events are more than just gatherings—they are experiences.":
        "Hela kvällen ligger i webbläsaren. Inget att ladda ner, inget konto behövs för att vara med.",

    # footer / contact / newsletter
    "location": "Plats",
    "2362 ocean view blvd, san diego, ca 63820": "Uppsala, Sverige",
    "Info@eventin.com": "hej@rideout.se",
    "+1 (555) 123-4567": "070-000 00 00",
    "get direction": "Kontakta oss",
    "Let’s Subscribe": "Sugen? Samla gänget.",
    "Subscribe": "Skapa er cykelfest",
    "music": "Cykelfest", "Event 26": "Kaninen", "conference": "Uppsala", "collab": "Instagram",
    "Event 2026": "RideOut",
    "COPYRIGHT & DESIGN BY @TEMPLATEMUNK": "© 2026 RideOut",
    "Create a free website with Framer, the website builder loved by startups, designers and agencies.":
        "RideOut – cykelfest-plattformen. Byggd i Uppsala.",

    # --- §3 schedule: hidden-day tabs (more seminars than the searchIndex listed) ---
    "Seminar : future of ai": "Varmrätt",
    "Seminar : future of crypto": "Cykla vidare",
    "Seminar : Visual fundamentals": "Förrätt",
    "Seminar : Creative strategy": "Efterrätt",
    "Seminar : Web3 application": "Final",
    "Seminer : Hands of Design": "Efterfest",
    "Seminar : blockchain tech": "Efterfest",
    # seminar body variants
    "Uncover how bold ideas evolve into meaningful visual stories. This seminar is crafted for creators, thinkers, and innovators seeking to sharpen their creative mindset. From studying user behavior to building designs and tech that evoke emotion.":
        "Cykla till nästa värd, lös ledtråden på vägen och samla poäng. Ingen vet vart kvällen tar er förrän ni är framme.",
    "Explore how strong concepts turn into impactful visuals. A seminar designed for creators, thinkers, and innovators ready to enhance their creative vision. Learn from user behavior insights to designing technology that sparks emotion.":
        "Nästa rätt väntar hos ett nytt värdpar. Ät, snacka och håll koll på topplistan medan kvällen rullar vidare.",
    "Discover how powerful ideas transform into meaningful visuals. Vision of Design is a seminar built for creators, thinkers, and innovators who want to elevate their creative perspective.":
        "Sista stoppet närmar sig. Lös den klurigaste ledtråden, cykla dit och gör er redo för final och efterfest.",
    # schedule times (am/pm -> evening)
    "08:00 am - 09:00 am": "18:00", "08:00 am - 11:00 am": "18:30",
    "01:00 pm - 3:00 pm": "19:00", "3:00 AM – 5:30 PM": "21:00",
    "12:00 pm - 2:00 pm": "19:30", "2:00 AM – 4:00 PM": "20:30",
    # schedule tags
    "Crypto": "Tema", "Web3": "Ledtrådar", "AI": "Poäng", "Future": "Tema", "Tech": "Poäng",
    # remaining host names -> Värdpar
    "Ethel Russell": "Värdpar", "Janice Hasting": "Värdpar", "Rhonda Hanley": "Värdpar",
    # extra pricing feature fallbacks
    "Basic customization options": "Eget tema och maskot",
    "Standard customer support": "Support i appen",
    "Welcome here": "Välkomna",
}

# duplicated heading: 1st occurrence (sponsor band) -> quote, 2nd (about band) -> story heading
DUP_KEY = "Supported by Industry Leaders Worldwide"
DUP_VALS = ['”Vi ville bara lära känna grannarna. Det blev årets bästa kväll.”', "Det började i Uppsala"]

META_HTML = [
    ("<title>Eventin</title>", "<title>RideOut — cykelfest-plattformen</title>"),
    ('content="Eventin"', 'content="RideOut — cykelfest-plattformen"'),
]

RAW_MIN = 24  # keys >= this many chars are replaced raw everywhere (safe, unique)
def enc(s): return s.replace("&", "&amp;")
def keys_long_first(): return sorted(MAP, key=len, reverse=True)

def replace_ordered(t, lit_key, lit_vals):
    out = t
    for v in lit_vals:
        i = out.find(lit_key)
        if i != -1:
            out = out[:i] + v + out[i+len(lit_key):]
    return out

def do_js(path):
    t = open(path, encoding="utf-8").read(); n = 0
    for k in keys_long_first():
        v = MAP[k]
        if len(k) >= RAW_MIN:
            c = t.count(k); t = t.replace(k, v); n += c
        else:
            a, b = f"`{k}`", f"`{v}`"; c = t.count(a); t = t.replace(a, b); n += c
    # ordered dup (backtick form)
    before = t
    t = replace_ordered(t, f"`{DUP_KEY}`", [f"`{x}`" for x in DUP_VALS])
    n += 0 if t == before else 2
    open(path, "w", encoding="utf-8").write(t); return n

def do_html(path):
    t = open(path, encoding="utf-8").read(); n = 0
    for a, b in META_HTML:
        c = t.count(a); t = t.replace(a, b); n += c
    for k in keys_long_first():
        v = MAP[k]
        if len(k) >= RAW_MIN:
            ek, ev = enc(k), enc(v); c = t.count(ek); t = t.replace(ek, ev); n += c
        else:
            ek, ev = f">{enc(k)}<", f">{enc(v)}<"; c = t.count(ek); t = t.replace(ek, ev); n += c
    t = replace_ordered(t, f">{enc(DUP_KEY)}<", [f">{enc(x)}<" for x in DUP_VALS])
    open(path, "w", encoding="utf-8").write(t); return n

def do_json(path):
    d = json.load(open(path, encoding="utf-8")); cnt = [0]
    def walk(x):
        if isinstance(x, dict): return {k: walk(v) for k, v in x.items()}
        if isinstance(x, list): return [walk(v) for v in x]
        if isinstance(x, str):
            if x in MAP: cnt[0] += 1; return MAP[x]
            if x == DUP_KEY: cnt[0] += 1; return DUP_VALS[1]
            return x
        return x
    d = walk(d)
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False)
    return cnt[0]

def main():
    print(f"  {do_html(HTML):4d} repl  {HTML}")
    print(f"  {do_js(CHUNK):4d} repl  {os.path.basename(CHUNK)}")
    print(f"  {do_js(SHARED):4d} repl  {os.path.basename(SHARED)}")
    for j in JSONS:
        print(f"  {do_json(j):4d} repl  {os.path.basename(j)}")
    # report keys that never matched anywhere (likely a casing miss)
    blob = open(HTML, encoding="utf-8").read() + open(CHUNK, encoding="utf-8").read()
    missing = [k for k in MAP if MAP[k] not in blob]
    if missing:
        print("\n  ⚠ keys whose Swedish value is absent from HTML+chunk (check):")
        for k in missing[:40]:
            print(f"     - {k!r}")
    else:
        print("\n  ✓ every mapped value present in HTML+chunk")

if __name__ == "__main__":
    main()
