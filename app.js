/* ============================================
   IS IT A DRY DAY TODAY? — APP
   ============================================ */

// ================================================================
// CONFIGURATION — Update these with your own values
// ================================================================
const CONFIG = {
  // STEP 1: Publish your Google Sheet as CSV (File > Share > Publish to web > CSV)
  // The sheet should have columns: COUNTRY, STATE, DATE (YYYY-MM-DD), IS_DRY (true/false), NOTE
  // Leave empty string to disable live overrides
  OVERRIDE_SHEET_URL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0",

  // STEP 2: Your Google Form URL for crowdsource reports
  // Create a Google Form with fields: location_key, is_dry_report, date
  // Leave empty string to disable crowdsource
  CROWDSOURCE_FORM_URL: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
  CROWDSOURCE_FORM_FIELD_LOCATION: "entry.XXXXXXXXX", // replace with your field IDs
  CROWDSOURCE_FORM_FIELD_IS_DRY: "entry.XXXXXXXXX",
  CROWDSOURCE_FORM_FIELD_DATE: "entry.XXXXXXXXX",

  // STEP 3: Publish your count sheet as CSV
  // Second tab of same sheet: LOCATION_KEY, DATE, DRY_COUNT, NOT_DRY_COUNT
  COUNT_SHEET_URL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=1",
};
// ================================================================

// ---- STATE ----
let currentLocationKey = '';
let currentIsDry = null;
let currentLocationLabel = '';
let currentCountry = '';

// ---- UI HELPERS ----
function showState(id) {
  document.querySelectorAll('.state').forEach(el => el.classList.add('hidden'));
  document.getElementById(id)?.classList.remove('hidden');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), duration);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- PARSE CSV ----
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return obj;
  });
}

// ---- LIVE OVERRIDE (Google Sheet) ----
async function checkOverride(locationKey, dateStr) {
  if (!CONFIG.OVERRIDE_SHEET_URL || CONFIG.OVERRIDE_SHEET_URL.includes('YOUR_SHEET_ID')) return null;
  try {
    const res = await fetch(CONFIG.OVERRIDE_SHEET_URL + '&cachebust=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    const rows = parseCSV(text);
    // Find a matching row: country+state match OR location_key match, and date matches today
    const match = rows.find(r => {
      const rowKey = (r.country + (r.state ? '-' + r.state : '')).toUpperCase();
      const keyMatch = rowKey === locationKey || r.location_key?.toUpperCase() === locationKey;
      const dateMatch = r.date === dateStr || r.date === '*'; // '*' means always
      return keyMatch && dateMatch;
    });
    if (!match) return null;
    return {
      isDry: match.is_dry?.toLowerCase() === 'true',
      note: match.note || '',
      source: 'live'
    };
  } catch (e) {
    return null;
  }
}

// ---- CROWDSOURCE COUNT ----
async function getCrowdCount(locationKey, dateStr) {
  if (!CONFIG.COUNT_SHEET_URL || CONFIG.COUNT_SHEET_URL.includes('YOUR_SHEET_ID')) return null;
  try {
    const res = await fetch(CONFIG.COUNT_SHEET_URL + '&cachebust=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    const rows = parseCSV(text);
    const match = rows.find(r =>
      r.location_key?.toUpperCase() === locationKey && r.date === dateStr
    );
    if (!match) return null;
    return {
      dryCount: parseInt(match.dry_count || '0', 10),
      notDryCount: parseInt(match.not_dry_count || '0', 10)
    };
  } catch (e) {
    return null;
  }
}

// ---- SUBMIT CROWDSOURCE ----
async function submitCrowdsource(locationKey, isDry, dateStr) {
  // Check if already submitted today
  const storageKey = `cs_${locationKey}_${dateStr}`;
  if (localStorage.getItem(storageKey)) {
    showToast('You already reported for today. Thanks!');
    return;
  }

  if (!CONFIG.CROWDSOURCE_FORM_URL || CONFIG.CROWDSOURCE_FORM_URL.includes('YOUR_FORM_ID')) {
    showToast('Thanks for the report! (Set up Google Form to enable live tracking)');
    localStorage.setItem(storageKey, '1');
    return;
  }

  try {
    const formData = new FormData();
    formData.append(CONFIG.CROWDSOURCE_FORM_FIELD_LOCATION, locationKey);
    formData.append(CONFIG.CROWDSOURCE_FORM_FIELD_IS_DRY, isDry ? 'true' : 'false');
    formData.append(CONFIG.CROWDSOURCE_FORM_FIELD_DATE, dateStr);
    // Google Forms doesn't support CORS — use no-cors (fire and forget)
    await fetch(CONFIG.CROWDSOURCE_FORM_URL, { method: 'POST', body: formData, mode: 'no-cors' });
    localStorage.setItem(storageKey, '1');
    showToast('✓ Report submitted! Thanks for helping the community.');
  } catch (e) {
    showToast('Couldn't submit right now. Try again later.');
  }
}

// ---- REVERSE GEOCODE ----
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
  const res = await fetch(url, { headers: { 'User-Agent': 'isitadrydaytoday.com/2.0' } });
  if (!res.ok) throw new Error('Geocode failed');
  return await res.json();
}

// ---- EXTRACT CODES FROM GEOCODE ----
function extractCodes(geoData) {
  const addr = geoData.address || {};
  const countryCode = (addr.country_code || '').toUpperCase();
  let stateCode = '';

  if (countryCode === 'IN') {
    const stateMap = {
      'maharashtra': 'MH', 'delhi': 'DL', 'new delhi': 'DL', 'national capital territory of delhi': 'DL',
      'gujarat': 'GJ', 'bihar': 'BR', 'nagaland': 'NA', 'manipur': 'MN', 'mizoram': 'MZ',
      'karnataka': 'KA', 'tamil nadu': 'TN', 'kerala': 'KL',
      'uttar pradesh': 'UP', 'west bengal': 'WB', 'rajasthan': 'RJ',
      'madhya pradesh': 'MP', 'goa': 'GA', 'punjab': 'PB', 'haryana': 'HR',
      'himachal pradesh': 'HP', 'jammu and kashmir': 'JK', 'jammu & kashmir': 'JK',
      'assam': 'AS', 'odisha': 'OR', 'chhattisgarh': 'CG', 'jharkhand': 'JH',
      'uttarakhand': 'UK', 'tripura': 'TR', 'meghalaya': 'ML', 'sikkim': 'SK',
      'arunachal pradesh': 'AR', 'andhra pradesh': 'AP', 'telangana': 'TS',
      'puducherry': 'PY', 'pondicherry': 'PY', 'chandigarh': 'CH',
      'lakshadweep': 'LK', 'andaman and nicobar islands': 'AN',
      'dadra and nagar haveli and daman and diu': 'DN', 'ladakh': 'JK',
    };
    const stateName = (addr.state || '').toLowerCase();
    stateCode = stateMap[stateName] || '';
  } else if (countryCode === 'US') {
    const lvl = addr['ISO3166-2-lvl4'] || addr.ISO3166_2_lvl4 || '';
    stateCode = lvl.replace('US-', '').toUpperCase() || (addr.state_code || '').toUpperCase();
  } else if (countryCode === 'AU') {
    const lvl = addr['ISO3166-2-lvl4'] || addr.ISO3166_2_lvl4 || '';
    stateCode = lvl.replace('AU-', '').toUpperCase();
  }

  const city = addr.city || addr.town || addr.suburb || addr.village || addr.county || addr.state || '';
  const country = addr.country || countryCode;
  const locationLabel = [city, country].filter(Boolean).join(', ');
  const locationKey = (countryCode + (stateCode ? '-' + stateCode : '')).toUpperCase();

  return { countryCode, stateCode, locationLabel, locationKey };
}

// ---- FORMAT DATE ----
function toDateStr(date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// ---- RENDER RESULT ----
async function renderResult(isDry, note, locationLabel, locationKey, date, overrideNote) {
  currentIsDry = isDry;
  currentLocationLabel = locationLabel;
  currentLocationKey = locationKey;

  const dateStr = toDateStr(date);
  const displayNote = overrideNote || note;

  if (isDry) {
    showState('stateDry');
    setText('locationTagDry', locationLabel);
    setText('subtextDry', randomItem(DRY_QUIPS));
    setText('dryNote', displayNote);
  } else {
    showState('stateNotDry');
    setText('locationTagNotDry', locationLabel);
    setText('subtextNotDry', randomItem(NOT_DRY_QUIPS));
  }

  // Show share actions
  document.getElementById('shareActions')?.classList.remove('hidden');
  document.getElementById('crowdDisclaimer')?.classList.remove('hidden');

  // Load crowd counts asynchronously
  const counts = await getCrowdCount(locationKey, dateStr);
  if (counts) {
    if (isDry) {
      const total = counts.dryCount + counts.notDryCount;
      if (total > 0) setText('crowdCountDry', `${counts.dryCount} people confirmed dry today`);
    } else {
      if (counts.dryCount > 0) setText('crowdCountNotDry', `⚠ ${counts.dryCount} people reported it as dry`);
    }
  }

  // Wire share buttons
  wireShareButtons(isDry, locationLabel, locationKey, dateStr);
  wireCrowdsourceButtons(locationKey, isDry, dateStr);
}

// ---- WIRE CROWDSOURCE BUTTONS ----
function wireCrowdsourceButtons(locationKey, isDry, dateStr) {
  const confirmBtn = document.getElementById('confirmDryBtn');
  const reportBtn = document.getElementById('reportDryBtn');

  if (confirmBtn) {
    confirmBtn.onclick = () => submitCrowdsource(locationKey, true, dateStr);
  }
  if (reportBtn) {
    reportBtn.onclick = () => submitCrowdsource(locationKey, true, dateStr);
  }
}

// ---- WIRE SHARE BUTTONS ----
function wireShareButtons(isDry, locationLabel, locationKey, dateStr) {
  const status = isDry ? 'YES — it is a dry day' : 'NOPE — not a dry day';
  const emoji = isDry ? '🚫🍺' : '🍻';
  const text = `${emoji} ${status} in ${locationLabel} today (${dateStr}). Check yours → isitadrydaytoday.com`;
  const url = 'https://isitadrydaytoday.com';

  // WhatsApp
  document.getElementById('btnWhatsapp').onclick = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  };

  // Twitter/X
  document.getElementById('btnTwitter').onclick = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // Save as image
  document.getElementById('btnImage').onclick = () => saveAsImage(isDry);
}

// ---- SAVE AS IMAGE ----
async function saveAsImage(isDry) {
  const cardId = isDry ? 'shareCard' : 'shareCardNo';
  const card = document.getElementById(cardId);
  if (!card || typeof html2canvas === 'undefined') {
    showToast('Image export not ready yet — try again in a moment.');
    return;
  }
  showToast('Generating image…');
  try {
    const canvas = await html2canvas(card, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = `is-it-a-dry-day-${toDateStr(new Date())}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('✓ Image saved!');
  } catch (e) {
    showToast('Couldn't generate image. Try screenshotting instead!');
  }
}

// ---- PROCESS LOCATION ----
async function processLocation(countryCode, stateCode, locationLabel, locationKey) {
  const today = new Date();
  const dateStr = toDateStr(today);

  // 1. Check live overrides first (Google Sheet)
  const override = await checkOverride(locationKey, dateStr);
  if (override !== null) {
    await renderResult(override.isDry, override.note || '', locationLabel, locationKey, today, override.note ? '🔴 LIVE UPDATE: ' + override.note : '');
    return;
  }

  // 2. Fall back to static rules
  const rule = getDryDayRule(countryCode, stateCode);
  if (!rule) {
    showState('stateError');
    return;
  }

  const isDry = rule.check(today);
  if (isDry === null) {
    showState('stateError');
    return;
  }

  await renderResult(isDry, rule.note, locationLabel, locationKey, today, null);
}

// ---- MANUAL CITY SEARCH ----
async function searchCity(query) {
  if (!query.trim()) return;
  showState('stateLoading');
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=en`;
    const res = await fetch(url, { headers: { 'User-Agent': 'isitadrydaytoday.com/2.0' } });
    const data = await res.json();
    if (!data?.length) throw new Error('Not found');
    const geo = await reverseGeocode(data[0].lat, data[0].lon);
    const { countryCode, stateCode, locationLabel, locationKey } = extractCodes(geo);
    await processLocation(countryCode, stateCode, locationLabel, locationKey);
  } catch (e) {
    showState('stateError');
  }
}

function bindManualInput(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  btn.onclick = () => searchCity(input.value);
  input.onkeydown = (e) => { if (e.key === 'Enter') searchCity(input.value); };
}

// ---- STATE GRID ----
function buildStateGrid() {
  const grid = document.getElementById('stateGrid');
  if (!grid || typeof INDIA_STATE_SUMMARY === 'undefined') return;
  grid.innerHTML = INDIA_STATE_SUMMARY.map(s => {
    const today = new Date();
    const rule = getDryDayRule('IN', s.code);
    let status = 'unknown';
    if (rule) {
      if (s.type === 'prohibited') {
        status = 'dry';
      } else {
        const result = rule.check(today);
        status = result ? 'dry' : 'not-dry';
      }
    }
    const icon = status === 'dry' ? '🚫' : status === 'not-dry' ? '✓' : '?';
    return `<div class="state-chip state-chip--${status}">
      <span class="state-chip-icon">${icon}</span>
      <span class="state-chip-name">${s.name}</span>
    </div>`;
  }).join('');
}

// ---- THEME TOGGLE ----
function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);

  document.getElementById('themeToggle').onclick = () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };
}

// ---- INIT ----
async function init() {
  initTheme();

  // Date pill
  const today = new Date();
  const datePill = document.getElementById('datePill');
  if (datePill) {
    datePill.textContent = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  document.getElementById('footerYear').textContent = today.getFullYear();

  // Manual inputs
  bindManualInput('cityInput', 'citySubmit');
  bindManualInput('cityInputError', 'citySubmitError');

  // Sticky ad close
  document.getElementById('adClose')?.addEventListener('click', () => {
    document.getElementById('adSticky')?.remove();
    document.body.style.paddingBottom = '0';
  });

  // State grid
  buildStateGrid();

  // Geolocation
  if (!navigator.geolocation) {
    showState('statePermission');
    return;
  }

  showState('stateLoading');

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocode(latitude, longitude);
        const { countryCode, stateCode, locationLabel, locationKey } = extractCodes(geo);
        await processLocation(countryCode, stateCode, locationLabel, locationKey);
      } catch (e) {
        showState('stateError');
      }
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) showState('statePermission');
      else showState('stateError');
    },
    { timeout: 8000, maximumAge: 300000 }
  );
}

init();
