# HANDOFF — superseded

> ⚠️ This early handoff described the **abandoned** static-graft / "Path B (lift the appear
> runtime)" approach. That route was rejected (it produces a frozen mock-up, not a
> pixel-identical section).
>
> **The approved, repeatable method is documented in
> [`FRAMER-SECTION-EMBED-PLAYBOOK.md`](./FRAMER-SECTION-EMBED-PLAYBOOK.md).**
> Read that. It covers: the localize → mask → same-origin iframe → scroll-scrub method,
> the exact shipped code, every hard-won gotcha, the verification checklist, the animation
> internals, the user's definition of done, and the status of the remaining sections.

Still-relevant context that lives elsewhere:
- Source exports: `templates-source/{habitline,appnext}-export.zip`
- Localizer: `tools/localize-template.py` · MIME-correct dev server: `tools/serve.py`
- Shipped CTA embed: `cta-embed/` · Branch `claude/epic-dirac-5TzaV` · draft PR #6
