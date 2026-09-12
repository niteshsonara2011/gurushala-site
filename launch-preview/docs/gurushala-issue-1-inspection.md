# Gurushala issue 1 inspection report

Issue: https://github.com/niteshsonara2011/gurushala-site/issues/1
Repository: `niteshsonara2011/gurushala-site`
Inspection date: 2026-06-02

## Repository access note

This report is for the correct repository: `niteshsonara2011/gurushala-site`.

## 1. Framework or structure

The website is currently a lightweight static HTML site.

Observed files:

- `index.html` — main homepage file
- `CNAME` — GitHub Pages custom domain file
- `README.md` — short repository description
- `AGENTS.md` — developer/coding-agent instructions

There is no visible Next.js, React, Vite, package.json, build pipeline, or framework configuration in the current simple site structure.

## 2. Homepage control file

The homepage is controlled by:

- `index.html`

This file contains:

- Page language set as Gujarati with `<html lang="gu">`
- Main title: `ગુરુશાળા`
- Subtitle: `ગુરુશાળા અનુસૂચિત જાતિ મહિલા શિક્ષણ ફાઉન્ડેશન`
- Introductory Gujarati and English text
- Inline CSS for layout, colours, spacing, and typography

## 3. Gujarati readability improvements needed

Recommended improvements:

1. Use a Gujarati-friendly font stack instead of only `Arial, sans-serif`.
2. Increase mobile readability using responsive font sizes with `clamp()`.
3. Add `line-height` suitable for Gujarati text.
4. Keep paragraphs shorter and clearer for village/community users.
5. Consider making the website mostly Gujarati, with English only where required.
6. Add accessible contrast and spacing for older users and low-cost mobile screens.

Suggested safe font stack:

```css
font-family: "Noto Sans Gujarati", "Hind Vadodara", "Shruti", "Nirmala UI", Arial, sans-serif;
```

## 4. Safe first changes recommended

Safe first changes should be small and reviewable:

1. Update the footer copyright so ownership belongs to Gurushala Scheduled Caste Women Education Foundation.
2. Replace or reduce English homepage text with Gujarati wording.
3. Improve Gujarati font readability in CSS.
4. Add a short section for:
   - દ્રષ્ટિ
   - હેતુ
   - મહિલા નેતૃત્વ
   - સંપર્ક
5. Keep the site static and lightweight for now.
6. Avoid adding personal names, fake registration details, fake trustees, or unverified addresses.

## 5. Readiness for `gurushala.geyvak.com`

The repository includes a `CNAME` file containing:

```text
gurushala.geyvak.com
```

This means the GitHub Pages repository is configured for the custom domain.

Final readiness also depends on DNS being correctly set with the domain provider and GitHub Pages showing the domain as active/secure.

## Recommended next developer task

Create a small pull request that updates only `index.html` to:

- Improve Gujarati font readability
- Make the homepage more Gujarati-first
- Add clear women-led Gurushala wording
- Add Gurushala-owned copyright in the footer
- Keep all changes simple, static, and safe

Do not make large design or legal-content changes until reviewed.