# isitadrydaytoday.com — v2

The world's most important website. Check dry days by location, with live overrides, crowdsourcing, and social sharing.

---

## 🗂 File Structure

```
isitadrydaytoday/
├── index.html        # Main page (SEO, structure, ad slots)
├── style.css         # All styles — light + dark mode
├── data.js           # Dry day rules — all Indian states + international
├── app.js            # Logic — geolocation, overrides, sharing, image export
├── netlify.toml      # Netlify headers + www redirect
└── README.md
```

---

## 🚀 Deploy via GitHub → Netlify (free, unlimited)

### One-time setup
1. Push this folder to GitHub (you've already done this)
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Select your GitHub repo
4. Set:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`
5. Click **Deploy site**

### Every future update
```bash
git add .
git commit -m "update dry day data"
git push
```
Netlify picks it up automatically. Live in ~10 seconds. No credits used.

---

## 🔴 Live Override System (Google Sheet)

This lets you add/remove dry days from your phone **without touching code**.

### Step 1 — Create the Google Sheet

Create a new Google Sheet with these two tabs:

**Tab 1: "overrides"** — columns exactly as:
```
COUNTRY | STATE | DATE       | IS_DRY | NOTE
IN      | MH    | 2025-01-26 | true   | Announced dry day - election
IN      | DL    | *          | true   | Always dry (testing)
IN      |       | 2025-08-15 | true   | Independence Day - national
```

- `COUNTRY`: ISO 2-letter code (IN, US, AE, etc.)
- `STATE`: State code (MH, DL, KA, etc.) — leave blank for whole country
- `DATE`: YYYY-MM-DD format, or `*` to always apply
- `IS_DRY`: `true` or `false`
- `NOTE`: Message shown to user (keep it informative/sassy)

**Tab 2: "counts"** — columns for crowdsource tallies:
```
LOCATION_KEY | DATE       | DRY_COUNT | NOT_DRY_COUNT
IN-MH        | 2025-01-26 | 47        | 3
IN-DL        | 2025-08-15 | 120       | 5
```

### Step 2 — Publish the Sheet as CSV

For **Tab 1 (overrides)**:
1. File → Share → Publish to web
2. Choose **Sheet 1 (overrides)** → **Comma-separated values (.csv)**
3. Click Publish → Copy the URL
4. The URL looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID/pub?gid=0&single=true&output=csv`

For **Tab 2 (counts)**:
- Same process, choose Sheet 2 → different `gid` in URL

### Step 3 — Paste URLs into app.js

Open `app.js` and update the CONFIG block at the top:

```javascript
const CONFIG = {
  OVERRIDE_SHEET_URL: "https://docs.google.com/spreadsheets/d/YOUR_REAL_SHEET_ID/pub?gid=0&single=true&output=csv",
  COUNT_SHEET_URL: "https://docs.google.com/spreadsheets/d/YOUR_REAL_SHEET_ID/pub?gid=1&single=true&output=csv",
  // ... crowdsource form fields below
};
```

**That's it.** Now you can add rows to your Google Sheet from your phone and the site updates within minutes (Google caches the published CSV for ~1-5 mins).

### How to add a last-minute dry day

Open Google Sheet on phone → Tab 1 → Add row:
```
IN | MH | 2025-10-15 | true | Election day dry day in Maharashtra
```
Save. Done. The site will pick it up.

---

## 👥 Crowdsource Setup (Google Forms)

### Step 1 — Create a Google Form

Create a form with these 3 short-answer fields:
1. `location_key` (e.g. "IN-MH")
2. `is_dry` (e.g. "true" / "false")
3. `date` (e.g. "2025-01-26")

You can make these hidden fields or text inputs (users don't fill them — the site fills them programmatically).

### Step 2 — Get field entry IDs

1. Open the form → Preview
2. Right-click a field → Inspect Element
3. Look for `name="entry.XXXXXXXXX"` — copy each number

### Step 3 — Link form response to your Sheet (Tab 2)

In the Google Form → Responses → Link to spreadsheet → Select your existing sheet → Tab 2

This means every submission auto-adds to your counts tab. Then you update the `DRY_COUNT` / `NOT_DRY_COUNT` columns from the raw submissions.

### Step 4 — Paste into app.js CONFIG

```javascript
CROWDSOURCE_FORM_URL: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
CROWDSOURCE_FORM_FIELD_LOCATION: "entry.1234567890",
CROWDSOURCE_FORM_FIELD_IS_DRY: "entry.0987654321",
CROWDSOURCE_FORM_FIELD_DATE: "entry.1122334455",
```

> **Note**: Google Forms uses `no-cors` mode for submissions. This means the submission fires silently — you won't get a confirmation from the server, but it works. The `localStorage` check prevents double-submissions per day per user.

---

## 🔗 Social Sharing

Three share buttons are built in and wire up automatically once a result is shown:

| Button | What it does |
|--------|-------------|
| **WhatsApp** | Opens `wa.me` with pre-filled text including location + result |
| **Post (X/Twitter)** | Opens `x.com/intent/tweet` with pre-filled text |
| **Save Image** | Uses `html2canvas` to screenshot the result card → PNG download |

The share text format is:
> 🚫🍺 YES — it is a dry day in Mumbai, India today (2025-01-26). Check yours → isitadrydaytoday.com

---

## 💰 Ad Integration

Three slots are ready. Replace the `<div class="ad-placeholder">` with your ad network's code.

| ID / Class | Location | Size |
|-----------|----------|------|
| `.ad-top` | Top of page | 728×90 desktop / 320×50 mobile |
| `.ad-middle` | Mid-page, below fold | 468×60 |
| `#adSticky` | Sticky mobile bottom | 320×50 (hidden on desktop) |

**Google AdSense snippet** (replace placeholder div):
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

---

## 🌍 Countries Covered

### India (all 28 states + 8 UTs)
| State | Status |
|-------|--------|
| Gujarat, Bihar, Nagaland, Manipur, Mizoram, Lakshadweep | 🚫 Year-round prohibition |
| Maharashtra, Karnataka, Tamil Nadu, Kerala, Delhi, Goa, Punjab, and all others | 🗓 Selective dry days (national holidays + state-specific) |

### International
- **Middle East**: Saudi Arabia, Kuwait, Iran, Libya, Yemen (total prohibition), UAE, Qatar, Bahrain, Oman (licensed venues)
- **South Asia**: Pakistan, Bangladesh, Maldives (near-total prohibition), Sri Lanka (Poya/full moon days), Nepal
- **Southeast Asia**: Thailand (Buddhist holidays), Malaysia, Indonesia (region-specific), Philippines (elections/Holy Week)
- **Western**: USA, UK, Australia, Canada, Germany, France

---

## ✏️ Adding New Dry Days to the Static Database

Edit `data.js` → `DRY_DAY_RULES` array. Each rule:

```javascript
{
  country: "IN",      // ISO 2-letter country code
  state: "TG",        // Optional state code
  stateLabel: "Telangana",
  isDryState: false,  // true = always dry
  check: (date) => {
    // Return true (dry), false (not dry), or null (unknown)
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return [[1, 26], [8, 15], [10, 2]].some(([rm, rd]) => rm === m && rd === d);
  },
  note: "Text shown to user explaining the dry day."
}
```

---

## 🔧 Customisation

- **Quips**: Edit `DRY_QUIPS` and `NOT_DRY_QUIPS` in `data.js`
- **Colors**: Edit CSS variables in `:root` and `[data-theme="dark"]` in `style.css`
- **Fonts**: Currently Bebas Neue + DM Mono + Instrument Serif — all via Google Fonts

---

## ⚠️ Disclaimer

This is an informational/entertainment project. Dry day data is based on publicly known legislation and may not reflect last-minute government orders (use the override sheet for those). We are not responsible for any dry-mouthed disappointments. Always verify locally. Drink responsibly.

---

Made with questionable sobriety. 🥃
