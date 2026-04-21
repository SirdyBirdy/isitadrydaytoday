# isitadrydaytoday.com

The world's most important website. Find out if today is a dry day — based on your location — instantly. Sassy. Minimal. Viral-ready.

---

## 🗂 File Structure

```
isitadrydaytoday/
├── index.html        # Main page
├── style.css         # All styles (light + dark mode)
├── app.js            # Logic, dry day data, geolocation
├── netlify.toml      # Netlify config (headers, redirects)
└── README.md
```

---

## 🚀 Deploy to Netlify

### Option A — Netlify Drop (Easiest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `isitadrydaytoday/` folder onto the page
3. Done! You'll get a live URL instantly

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
cd isitadrydaytoday
netlify deploy --prod
```

### Option C — GitHub + Netlify (Recommended for ongoing edits)
1. Push this folder to a GitHub repo
2. Go to [app.netlify.com](https://app.netlify.com) → New site from Git
3. Select your repo, set publish directory to `/` (or leave blank)
4. Click Deploy

### Custom Domain
After deploying, go to **Domain Settings** in Netlify and add `isitadrydaytoday.com`. Point your DNS nameservers to Netlify's (they'll tell you which ones).

---

## 💰 Ad Integration

Three ad slots are ready — just replace the `<div class="ad-placeholder">` divs with your ad network code:

| Slot | Location | Desktop Size | Mobile Size |
|------|----------|-------------|-------------|
| `#adTop` | Top of page | 728×90 leaderboard | 320×50 |
| `.ad-middle` | Below fold | 468×60 | 320×100 |
| `#adSticky` | Sticky bottom | Hidden on desktop | 320×50 |

**Google AdSense example** (replace placeholder div):
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true">
</ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

---

## 🌍 Expanding Dry Day Data

Edit the `DRY_DAY_RULES` array in `app.js`. Each rule has:
- `country` — ISO 2-letter code (e.g. `"IN"`, `"US"`)
- `state` — optional sub-region code (e.g. `"MH"` for Maharashtra)
- `check(date)` — function returning `true` (dry), `false` (not dry), or `null` (unknown)
- `dryNote` — sassy/informative string shown to the user

Currently well-covered: **India** (Maharashtra, Delhi, Gujarat, Bihar, Nagaland, Karnataka + generic), **USA**, **UAE**, **UK**, **Australia**, **Canada**, **Germany**.

---

## 🎨 Customisation

- **Fonts**: Bebas Neue (headings) + DM Mono (body) + Instrument Serif (italic subtext)
- **Colors**: Edit CSS variables in `:root` and `[data-theme="dark"]` in `style.css`
- **Quips**: Edit `DRY_QUIPS` and `NOT_DRY_QUIPS` arrays in `app.js`

---

## ⚠️ Disclaimer

This is a satire/entertainment project. Dry day data is based on publicly known legislation and may not reflect emergency government orders or sudden election-day announcements. Always verify locally before making important liquid decisions.

---

Made with questionable sobriety. 🥃
