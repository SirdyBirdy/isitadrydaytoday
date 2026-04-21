/* ============================================
   IS IT A DRY DAY TODAY? — APP LOGIC
   ============================================ */

// ---- SASSY COPY BANKS ----

const DRY_QUIPS = [
  "Put the bottle down, friend. The government said so.",
  "Not today, Satan. Not today.",
  "The law is dry. So are your hopes.",
  "Your liver just exhaled in relief.",
  "Congratulations! You've been voluntarily sober by decree.",
  "Today's forecast: 100% dry with a chance of mild resentment.",
  "The state has spoken. Water it is.",
  "A good day to finally try that kombucha.",
  "Somewhere, a liquor store owner is weeping.",
  "Think of it as a government-sponsored detox.",
  "Even the bar is praying today. Into a glass of juice.",
  "This is your sign to hydrate, bestie.",
];

const NOT_DRY_QUIPS = [
  "Go forth and imbibe responsibly. The law permits it.",
  "Bottoms up! (Within legal limits. We're watching.)",
  "The liquor store is OPEN. You're welcome.",
  "Today's vibes: legally lubricated.",
  "No dry law today. Your plans are safe.",
  "The universe gave you a free pass. Don't waste it.",
  "Cheers, you beautiful rule-follower.",
  "It's legally a good day to be hydrated with hops.",
  "Your Tuesday afternoon rosé is perfectly legal. Enjoy.",
  "Not a dry day. Do with that information what you will.",
  "Today's status: your local bar is very much open.",
  "The government has no notes. Party on.",
];

function randomQuip(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- DRY DAY DATA ----
// A curated, expandable dataset of dry day rules.
// Format: { countryCode, stateCode (optional), rule, notes }

const DRY_DAY_RULES = [
  // INDIA — most comprehensive
  {
    country: "IN", state: "MH", // Maharashtra
    check: (d) => {
      const month = d.getMonth() + 1;
      const day = d.getDate();
      // Republic Day, Independence Day, Gandhi Jayanti, Maharashtra Day
      const nationalDryDays = [
        [1, 26], [8, 15], [10, 2],
      ];
      const stateDryDays = [
        [5, 1], // Maharashtra Day
        [4, 14], // Dr. Ambedkar Jayanti
      ];
      const allDry = [...nationalDryDays, ...stateDryDays];
      return allDry.some(([m, d2]) => m === month && d2 === day);
    },
    dryNote: "Maharashtra observes dry days on national holidays & key state observances. Some dry days are announced at short notice by the state government."
  },
  {
    country: "IN", state: "DL", // Delhi
    check: (d) => {
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dryDays = [[1, 26], [8, 15], [10, 2], [11, 1]]; // Gandhi Jayanti + election days
      return dryDays.some(([m, d2]) => m === month && d2 === day);
    },
    dryNote: "Delhi has dry days on national holidays + election days (announced by EC)."
  },
  {
    country: "IN", state: "GJ", // Gujarat — mostly dry state
    check: () => true,
    dryNote: "Gujarat is a prohibition state. Sale of alcohol is banned unless you hold a permit. Every day is a dry day here."
  },
  {
    country: "IN", state: "BR", // Bihar — dry state
    check: () => true,
    dryNote: "Bihar banned alcohol in 2016. Completely dry state — no exceptions for buying/selling."
  },
  {
    country: "IN", state: "NA", // Nagaland — dry state
    check: () => true,
    dryNote: "Nagaland enforces prohibition. Alcohol sales are banned statewide."
  },
  {
    country: "IN", state: "KA", // Karnataka
    check: (d) => {
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dryDays = [[1, 26], [8, 15], [10, 2], [11, 1]]; // Kannada Rajyotsava
      return dryDays.some(([m, d2]) => m === month && d2 === day);
    },
    dryNote: "Karnataka observes dry days on national holidays and Kannada Rajyotsava (Nov 1)."
  },
  {
    country: "IN", // Generic India fallback
    check: (d) => {
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const nationalDryDays = [[1, 26], [8, 15], [10, 2]];
      return nationalDryDays.some(([m, d2]) => m === month && d2 === day);
    },
    dryNote: "Most Indian states observe dry days on Republic Day (Jan 26), Independence Day (Aug 15), and Gandhi Jayanti (Oct 2). Your state may have additional ones."
  },

  // USA — select states with notable restrictions
  {
    country: "US", state: "UT", // Utah — strict
    check: (d) => {
      const dow = d.getDay();
      // No restrictions on specific days but Sunday hours are limited
      return false; // No full dry days, just hour restrictions
    },
    dryNote: "Utah has no full dry days, but strict alcohol laws limit hours and restrict sales on Sundays until noon. Not a dry day, but pack patience."
  },
  {
    country: "US", state: "AL", // Alabama — some dry counties
    check: () => false,
    dryNote: "Parts of Alabama are still dry counties. Check your specific county. State-level: no full dry days today."
  },
  {
    country: "US", // US generic — no federal dry days
    check: () => false,
    dryNote: "The US has no federal dry days. Your county or state may have local restrictions — we recommend a quick Google for your exact area."
  },

  // UAE
  {
    country: "AE",
    check: (d) => {
      // Ramadan is approximate; would need lunar calendar. Flag as unknown.
      const dow = d.getDay();
      return false; // Simplified — actual Ramadan check needs lunar calendar
    },
    dryNote: "The UAE restricts alcohol sales during Ramadan and certain national holidays. Dubai and Abu Dhabi are more relaxed; more conservative emirates are stricter. Verify locally."
  },

  // UK — no dry days
  {
    country: "GB",
    check: () => false,
    dryNote: "Great Britain has no dry days. Pub hours are regulated but there are no mandatory closure days. God save your liver."
  },

  // Australia — no national dry days
  {
    country: "AU",
    check: () => false,
    dryNote: "Australia has no national dry days. Some territories have community alcohol restrictions. Otherwise: crack on."
  },

  // Canada — no federal dry days
  {
    country: "CA",
    check: () => false,
    dryNote: "Canada has no national dry days. Provincial laws apply. British Columbia, Ontario, Quebec all have different vibes."
  },

  // Germany — no dry days
  {
    country: "DE",
    check: () => false,
    dryNote: "Germany has no dry days. You're in the right country."
  },

  // Generic fallback
  {
    country: "UNKNOWN",
    check: () => null, // null = unknown
    dryNote: "We couldn't determine your exact location's dry day rules. Please check local regulations."
  }
];

// ---- HOLIDAY NAMES ----
const HOLIDAY_NAMES = {
  "IN-01-26": "Republic Day 🇮🇳",
  "IN-08-15": "Independence Day 🇮🇳",
  "IN-10-02": "Gandhi Jayanti 🇮🇳",
  "IN-05-01": "Maharashtra Day (MH)",
  "IN-04-14": "Dr. Ambedkar Jayanti (MH/KA)",
  "IN-11-01": "Kannada Rajyotsava (KA) / All Saints Day",
};

function getHolidayName(countryCode, month, day) {
  const key = `${countryCode}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return HOLIDAY_NAMES[key] || null;
}

// ---- DETERMINE DRY DAY ----
function isDryDay(countryCode, stateCode, date) {
  // Try specific state first
  const stateRule = DRY_DAY_RULES.find(r => r.country === countryCode && r.state === stateCode);
  if (stateRule) {
    return { isDry: stateRule.check(date), note: stateRule.dryNote };
  }
  // Try country-level
  const countryRule = DRY_DAY_RULES.find(r => r.country === countryCode && !r.state);
  if (countryRule) {
    return { isDry: countryRule.check(date), note: countryRule.dryNote };
  }
  // Unknown
  return { isDry: null, note: "We don't have dry day data for your exact location. Check locally!" };
}

// ---- UI HELPERS ----
function showState(id) {
  document.querySelectorAll('.state').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// ---- RENDER RESULT ----
function renderResult(isDry, note, locationLabel, countryCode, date) {
  if (isDry === null) {
    showState('stateError');
    return;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const holidayName = getHolidayName(countryCode, month, day);

  if (isDry) {
    showState('stateDry');
    setText('locationTagDry', locationLabel);
    setText('subtextDry', randomQuip(DRY_QUIPS));
    let noteText = note;
    if (holidayName) noteText = `📅 Today is ${holidayName}. ${note}`;
    setText('dryNote', noteText);
  } else {
    showState('stateNotDry');
    setText('locationTagNotDry', locationLabel);
    setText('subtextNotDry', randomQuip(NOT_DRY_QUIPS));
  }
}

// ---- REVERSE GEOCODE (nominatim) ----
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
  const res = await fetch(url, { headers: { 'User-Agent': 'isitadrydaytoday.com/1.0' } });
  if (!res.ok) throw new Error('Geocode failed');
  return await res.json();
}

// ---- EXTRACT COUNTRY/STATE FROM GEOCODE ----
function extractCodes(geocodeData) {
  const addr = geocodeData.address || {};
  const countryCode = (geocodeData.address?.country_code || '').toUpperCase();

  // state-level code (ISO 3166-2 style, e.g. "IN-MH")
  let stateCode = '';

  // India: use state name mapping
  if (countryCode === 'IN') {
    const stateMap = {
      'maharashtra': 'MH', 'delhi': 'DL', 'new delhi': 'DL',
      'gujarat': 'GJ', 'bihar': 'BR', 'nagaland': 'NA',
      'karnataka': 'KA', 'rajasthan': 'RJ', 'tamil nadu': 'TN',
      'kerala': 'KL', 'uttar pradesh': 'UP', 'west bengal': 'WB',
      'goa': 'GA', 'punjab': 'PB', 'haryana': 'HR',
    };
    const stateName = (addr.state || '').toLowerCase();
    stateCode = stateMap[stateName] || '';
  }

  // US
  if (countryCode === 'US') {
    stateCode = (addr.ISO3166_2_lvl4 || '').replace('US-', '').toUpperCase() ||
                (addr.state_code || '').toUpperCase();
  }

  const city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
  const country = addr.country || countryCode;
  const locationLabel = [city, country].filter(Boolean).join(', ');

  return { countryCode, stateCode, locationLabel };
}

// ---- HANDLE CITY TEXT INPUT ----
function handleCityInput(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  if (!input || !button) return;

  const doSearch = async () => {
    const q = input.value.trim();
    if (!q) return;
    showState('stateLoading');
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=en`;
      const res = await fetch(url, { headers: { 'User-Agent': 'isitadrydaytoday.com/1.0' } });
      const data = await res.json();
      if (!data || !data.length) throw new Error('Not found');
      const { lat, lon } = data[0];
      const geo = await reverseGeocode(lat, lon);
      const { countryCode, stateCode, locationLabel } = extractCodes(geo);
      const today = new Date();
      const result = isDryDay(countryCode, stateCode, today);
      renderResult(result.isDry, result.note, locationLabel, countryCode, today);
    } catch (e) {
      showState('stateError');
    }
  };

  button.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

// ---- MAIN INIT ----
async function init() {
  // Date pill
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('datePill').textContent = today.toLocaleDateString('en-US', options);
  document.getElementById('footerYear').textContent = today.getFullYear();

  // Wire up manual inputs
  handleCityInput('cityInput', 'citySubmit');
  handleCityInput('cityInputError', 'citySubmitError');

  // Try geolocation
  if (!navigator.geolocation) {
    showState('statePermission');
    return;
  }

  showState('stateLoading');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude: lat, longitude: lon } = position.coords;
        const geo = await reverseGeocode(lat, lon);
        const { countryCode, stateCode, locationLabel } = extractCodes(geo);
        const result = isDryDay(countryCode, stateCode, today);
        renderResult(result.isDry, result.note, locationLabel, countryCode, today);
      } catch (e) {
        showState('stateError');
      }
    },
    (err) => {
      if (err.code === err.PERMISSION_DENIED) {
        showState('statePermission');
      } else {
        showState('stateError');
      }
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

// ---- THEME TOGGLE ----
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Persist theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---- STICKY AD CLOSE ----
document.getElementById('adClose')?.addEventListener('click', () => {
  document.getElementById('adSticky')?.remove();
  document.body.style.paddingBottom = '0';
});

// ---- KICK OFF ----
init();
