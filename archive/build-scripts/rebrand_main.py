#!/usr/bin/env python3
"""
Rebrand the nav / footer / badge copy that lives in script_main.BzmOT3jW.mjs.
This chunk is the runtime, so generic words ('Home','Contact') also appear in CODE
(e.g. `_===`Home`?…`). Every replacement here is ANCHORED to the label-prop key so it
only touches rendered labels, never code paths. Whole-phrase badge literals are unique
and replaced directly.
"""
import os

MAIN = "assets/scripts/script_main.BzmOT3jW.mjs"

PAIRS = [
    # --- top nav (desktop + mobile share prop jCPJ6vY2r) ---
    ("jCPJ6vY2r:`Home`",     "jCPJ6vY2r:`Hem`"),
    ("jCPJ6vY2r:`About`",    "jCPJ6vY2r:`Vad är en cykelfest`"),
    ("jCPJ6vY2r:`Contact`",  "jCPJ6vY2r:`Kontakt`"),
    ("jCPJ6vY2r:`Pricing`",  "jCPJ6vY2r:`Priser`"),
    ("DApvjrdfG:`Essentials`", "DApvjrdfG:`Så funkar det`"),
    ("children:`Contact`",   "children:`Kontakt`"),   # Essentials-dropdown item (rendered text)
    # --- footer quick links (prop szo5MLo1v) ---
    ("szo5MLo1v:`Events`",   "szo5MLo1v:`Så funkar det`"),
    ("szo5MLo1v:`Pricing`",  "szo5MLo1v:`Priser`"),
    ("szo5MLo1v:`About us`", "szo5MLo1v:`Vad är en cykelfest`"),
    ("szo5MLo1v:`home`",     "szo5MLo1v:`Hem`"),
    # --- nav CTA + newsletter + footer headings ---
    ("x31YSF4sj:`buy ticket`", "x31YSF4sj:`Skapa er cykelfest`"),
    ("NMun0uRrk:`Subscribe`",  "NMun0uRrk:`Skapa er cykelfest`"),
    ("children:`Let’s Subscribe`", "children:`Sugen? Samla gänget.`"),
    ("children:`Quick links`",     "children:`Snabblänkar`"),
    # --- footer category tags + form success + email placeholder ---
    ("B4Qlw8Rut:`Event 2026`", "B4Qlw8Rut:`Cykelfest 2026`"),
    ("B4Qlw8Rut:`conference`", "B4Qlw8Rut:`Uppsala`"),
    ("children:`conference`", "children:`Uppsala`"),
    ("children:`Thank you`", "children:`Tack!`"),
    ("placeholder:`jane@framer.com`", "placeholder:`din@epost.se`"),
    # --- footer copyright (split literals) ---
    ("`COPYRIGHT & DESIGN BY `", "`© 2026 `"),
    ("`@TEMPLATEMUNK`",          "`RideOut`"),
    # --- rotating-badge phrases (whole unique literals) ---
    ("`Join the Adventure on Two Wheels`",  "`Ge er ut på två hjul`"),
    ("`Experience the 2026 Adrenaline Rush`", "`Årets roligaste kväll 2026`"),
    ("`Gravity Has No Limits Here.`",       "`Ingen vet vart kvällen tar er.`"),
    ("`Feel the Thrill. Live the Stunt`",   "`Cykla. Ät. Gissa.`"),
    ("`learn before earn`",                 "`följ ledtråden`"),
]

def main():
    t = open(MAIN, encoding="utf-8").read()
    total = 0
    for a, b in PAIRS:
        c = t.count(a)
        if c == 0:
            print(f"  ⚠ 0×  {a!r}")
        else:
            t = t.replace(a, b); total += c
            print(f"  {c:2d}×  {a.split(':',1)[0] if ':' in a else a[:30]} -> {b.split('`')[1] if '`' in b else b}")
    open(MAIN, "w", encoding="utf-8").write(t)
    print(f"\n  {total} anchored replacements in {os.path.basename(MAIN)}")

if __name__ == "__main__":
    main()
