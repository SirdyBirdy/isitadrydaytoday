/* ============================================
   IS IT A DRY DAY TODAY? — DATA
   All Indian states + UTs + International
   ============================================ */

// ---- SASSY COPY ----
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
  "The law has spoken. Your WhatsApp group has not taken it well.",
  "Today you drink water like the legend you are.",
  "Officially: a terrible day to run out of home stock.",
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
  "Legally speaking, you're free to make questionable choices.",
  "No prohibition today. The choice is entirely yours.",
  "Green light. May your evening be as smooth as your drink.",
];

// ---- NATIONAL DRY DAYS (India) ----
// [month, day, name]
const INDIA_NATIONAL_DRY_DAYS = [
  [1, 26, "Republic Day"],
  [8, 15, "Independence Day"],
  [10, 2, "Gandhi Jayanti"],
];

// ---- HELPER ----
function matchesDate(rulesArray, date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return rulesArray.some(([rm, rd]) => rm === m && rd === d);
}

function matchesDateNamed(rulesArray, date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const match = rulesArray.find(([rm, rd]) => rm === m && rd === d);
  return match ? match[2] : null;
}

function checkNationalIndia(date) {
  return matchesDateNamed(INDIA_NATIONAL_DRY_DAYS, date);
}

// ---- DRY DAY RULES DATABASE ----
// Each entry: { country, state (optional), isDryState (optional), check(date) -> bool|null, note, stateLabel }

const DRY_DAY_RULES = [

  // ================================================================
  // INDIA — PROHIBITION STATES (always dry)
  // ================================================================
  {
    country: "IN", state: "GJ", stateLabel: "Gujarat", isDryState: true,
    check: () => true,
    note: "Gujarat has enforced prohibition since 1960. Every single day is a dry day here. Permits are available for medical use. Good luck at parties."
  },
  {
    country: "IN", state: "BR", stateLabel: "Bihar", isDryState: true,
    check: () => true,
    note: "Bihar banned alcohol statewide in April 2016. Fully dry — no exceptions for purchase or consumption. The penalty is no joke either."
  },
  {
    country: "IN", state: "NA", stateLabel: "Nagaland", isDryState: true,
    check: () => true,
    note: "Nagaland enforces prohibition under the Nagaland Liquor Total Prohibition Act. Dry every day, everywhere."
  },
  {
    country: "IN", state: "MN", stateLabel: "Manipur", isDryState: true,
    check: () => true,
    note: "Manipur enforces prohibition. Alcohol sales are banned statewide. Each day is a dry day."
  },
  {
    country: "IN", state: "MZ", stateLabel: "Mizoram", isDryState: true,
    check: () => true,
    note: "Mizoram enforces the Mizoram Liquor (Prohibition and Control) Act. Dry statewide."
  },
  {
    country: "IN", state: "LK", stateLabel: "Lakshadweep", isDryState: true,
    check: () => true,
    note: "Lakshadweep is a dry UT. Alcohol is prohibited on most islands."
  },

  // ================================================================
  // INDIA — STATES WITH DRY DAYS
  // ================================================================
  {
    country: "IN", state: "MH", stateLabel: "Maharashtra",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[5, 1, "Maharashtra Day"], [4, 14, "Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Maharashtra observes dry days on Republic Day, Independence Day, Gandhi Jayanti, Maharashtra Day (May 1), and Dr. Ambedkar Jayanti (Apr 14). Last-minute election dry days are also announced by the state government."
  },
  {
    country: "IN", state: "DL", stateLabel: "Delhi",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      // Election days are announced — we flag these via override sheet
      return false;
    },
    note: "Delhi observes dry days on Republic Day, Independence Day, and Gandhi Jayanti. Election dry days are announced at short notice by the Election Commission."
  },
  {
    country: "IN", state: "KA", stateLabel: "Karnataka",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[11, 1, "Kannada Rajyotsava"], [4, 14, "Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Karnataka observes dry days on national holidays, Kannada Rajyotsava (Nov 1), and Dr. Ambedkar Jayanti (Apr 14)."
  },
  {
    country: "IN", state: "TN", stateLabel: "Tamil Nadu",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[1, 14, "Pongal"], [4, 14, "Tamil New Year / Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Tamil Nadu observes dry days on national holidays, Pongal (Jan 14), and Tamil New Year / Dr. Ambedkar Jayanti (Apr 14)."
  },
  {
    country: "IN", state: "KL", stateLabel: "Kerala",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[11, 1, "Kerala Piravi"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Kerala observes dry days on national holidays and Kerala Piravi (Nov 1). Beverages Corporation (Bevco) outlets are closed on these days."
  },
  {
    country: "IN", state: "UP", stateLabel: "Uttar Pradesh",
    check: (d) => !!checkNationalIndia(d),
    note: "Uttar Pradesh observes dry days on national holidays. Election dry days are announced by the state government."
  },
  {
    country: "IN", state: "WB", stateLabel: "West Bengal",
    check: (d) => !!checkNationalIndia(d),
    note: "West Bengal observes dry days on national holidays. Durga Puja days sometimes have restrictions — check locally."
  },
  {
    country: "IN", state: "RJ", stateLabel: "Rajasthan",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[3, 30, "Rajasthan Day"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Rajasthan observes dry days on national holidays and Rajasthan Day (Mar 30)."
  },
  {
    country: "IN", state: "MP", stateLabel: "Madhya Pradesh",
    check: (d) => !!checkNationalIndia(d),
    note: "Madhya Pradesh observes dry days on national holidays. Election dry days are common."
  },
  {
    country: "IN", state: "GA", stateLabel: "Goa",
    check: (d) => !!checkNationalIndia(d),
    note: "Goa observes dry days on national holidays only. One of India's most relaxed states on alcohol — outside those three days, it's always a good day."
  },
  {
    country: "IN", state: "PB", stateLabel: "Punjab",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[11, 1, "Punjab Day"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Punjab observes dry days on national holidays and Punjab Day (Nov 1)."
  },
  {
    country: "IN", state: "HR", stateLabel: "Haryana",
    check: (d) => !!checkNationalIndia(d),
    note: "Haryana observes dry days on national holidays."
  },
  {
    country: "IN", state: "HP", stateLabel: "Himachal Pradesh",
    check: (d) => !!checkNationalIndia(d),
    note: "Himachal Pradesh observes dry days on national holidays."
  },
  {
    country: "IN", state: "JK", stateLabel: "Jammu & Kashmir",
    check: (d) => !!checkNationalIndia(d),
    note: "J&K observes dry days on national holidays. Some areas have additional restrictions."
  },
  {
    country: "IN", state: "AS", stateLabel: "Assam",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[4, 14, "Bohag Bihu / Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Assam observes dry days on national holidays and Bihu (Apr 14)."
  },
  {
    country: "IN", state: "OR", stateLabel: "Odisha",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[4, 1, "Odisha Day"], [4, 14, "Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Odisha observes dry days on national holidays and Utkal Divas/Odisha Day (Apr 1)."
  },
  {
    country: "IN", state: "CG", stateLabel: "Chhattisgarh",
    check: (d) => !!checkNationalIndia(d),
    note: "Chhattisgarh observes dry days on national holidays."
  },
  {
    country: "IN", state: "JH", stateLabel: "Jharkhand",
    check: (d) => !!checkNationalIndia(d),
    note: "Jharkhand observes dry days on national holidays."
  },
  {
    country: "IN", state: "UK", stateLabel: "Uttarakhand",
    check: (d) => !!checkNationalIndia(d),
    note: "Uttarakhand observes dry days on national holidays."
  },
  {
    country: "IN", state: "TR", stateLabel: "Tripura",
    check: (d) => !!checkNationalIndia(d),
    note: "Tripura observes dry days on national holidays."
  },
  {
    country: "IN", state: "ML", stateLabel: "Meghalaya",
    check: (d) => !!checkNationalIndia(d),
    note: "Meghalaya observes dry days on national holidays."
  },
  {
    country: "IN", state: "SK", stateLabel: "Sikkim",
    check: (d) => !!checkNationalIndia(d),
    note: "Sikkim observes dry days on national holidays."
  },
  {
    country: "IN", state: "AR", stateLabel: "Arunachal Pradesh",
    check: (d) => !!checkNationalIndia(d),
    note: "Arunachal Pradesh observes dry days on national holidays."
  },
  {
    country: "IN", state: "AP", stateLabel: "Andhra Pradesh",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[11, 1, "Andhra Pradesh Formation Day"], [4, 14, "Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Andhra Pradesh observes dry days on national holidays and AP Formation Day (Nov 1)."
  },
  {
    country: "IN", state: "TS", stateLabel: "Telangana",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[6, 2, "Telangana Formation Day"], [4, 14, "Dr. Ambedkar Jayanti"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Telangana observes dry days on national holidays and Telangana Formation Day (Jun 2)."
  },
  // UTs
  {
    country: "IN", state: "PY", stateLabel: "Puducherry",
    check: (d) => {
      const nat = checkNationalIndia(d);
      if (nat) return true;
      const extra = [[8, 16, "Puducherry Liberation Day"]];
      return !!matchesDateNamed(extra, d);
    },
    note: "Puducherry observes dry days on national holidays and Liberation Day (Aug 16)."
  },
  {
    country: "IN", state: "CH", stateLabel: "Chandigarh",
    check: (d) => !!checkNationalIndia(d),
    note: "Chandigarh (UT) observes dry days on national holidays."
  },
  {
    country: "IN", state: "DN", stateLabel: "Dadra & Nagar Haveli / Daman & Diu",
    check: (d) => !!checkNationalIndia(d),
    note: "Observes dry days on national holidays."
  },
  {
    country: "IN", state: "AN", stateLabel: "Andaman & Nicobar Islands",
    check: (d) => !!checkNationalIndia(d),
    note: "Observes dry days on national holidays."
  },
  // Generic India fallback
  {
    country: "IN", stateLabel: "India",
    check: (d) => !!checkNationalIndia(d),
    note: "Most Indian states observe dry days on Republic Day (Jan 26), Independence Day (Aug 15), and Gandhi Jayanti (Oct 2). Your state may have additional ones. Check locally for election dry days."
  },

  // ================================================================
  // MIDDLE EAST
  // ================================================================
  {
    country: "SA", stateLabel: "Saudi Arabia",
    check: () => true,
    note: "Saudi Arabia enforces total prohibition. Alcohol is completely illegal. Every day is a dry day — no exceptions."
  },
  {
    country: "KW", stateLabel: "Kuwait",
    check: () => true,
    note: "Kuwait enforces total prohibition. Alcohol is illegal. Every day is a dry day."
  },
  {
    country: "IR", stateLabel: "Iran",
    check: () => true,
    note: "Iran enforces total prohibition under Islamic law. Every day is a dry day."
  },
  {
    country: "YE", stateLabel: "Yemen",
    check: () => true,
    note: "Yemen enforces near-total prohibition. Every day is a dry day."
  },
  {
    country: "LY", stateLabel: "Libya",
    check: () => true,
    note: "Libya enforces total prohibition. Every day is a dry day."
  },
  {
    country: "AE", stateLabel: "UAE",
    check: () => false,
    note: "The UAE allows alcohol in licensed venues (hotels, clubs, licensed restaurants). Ramadan may bring restrictions on public consumption. Sharjah is completely dry. Dubai and Abu Dhabi are generally permissive."
  },
  {
    country: "BH", stateLabel: "Bahrain",
    check: () => false,
    note: "Bahrain allows alcohol in licensed venues. Not a dry day today in general, but Ramadan may bring some restrictions."
  },
  {
    country: "QA", stateLabel: "Qatar",
    check: () => false,
    note: "Qatar permits alcohol in licensed hotels and the Qatar Distribution Company. Ramadan brings restrictions. Check the specific venue."
  },
  {
    country: "OM", stateLabel: "Oman",
    check: () => false,
    note: "Oman permits alcohol in licensed venues. Restrictions apply during Ramadan."
  },
  {
    country: "JO", stateLabel: "Jordan",
    check: () => false,
    note: "Jordan permits alcohol. Not a dry day today generally — but check locally during religious holidays."
  },

  // ================================================================
  // SOUTH ASIA
  // ================================================================
  {
    country: "PK", stateLabel: "Pakistan",
    check: () => true,
    note: "Pakistan enforces prohibition for Muslims under the Prohibition Order. Non-Muslims may access alcohol through licensed outlets, but effectively every day is a dry day for most of the population."
  },
  {
    country: "BD", stateLabel: "Bangladesh",
    check: () => true,
    note: "Bangladesh enforces near-total prohibition. Alcohol is available only to non-Muslims with a permit. Effectively a dry day every day."
  },
  {
    country: "MV", stateLabel: "Maldives",
    check: () => true,
    note: "The Maldives bans alcohol for citizens. It's only available in resort islands. If you're not at a resort, every day is a dry day."
  },
  {
    country: "LK", stateLabel: "Sri Lanka",
    check: (d) => {
      // Poya (full moon) days are dry days in Sri Lanka
      // Approximate check using lunar phase
      const poya = isPoyaDay(d);
      if (poya) return true;
      const nat = [[2, 4, "Independence Day"]];
      return !!matchesDateNamed(nat, d);
    },
    note: "Sri Lanka observes dry days on every Poya (full moon) day — when alcohol sales are completely banned nationwide. Also dry on Independence Day (Feb 4)."
  },
  {
    country: "NP", stateLabel: "Nepal",
    check: (d) => {
      // Nepal national holidays
      const nat = [[9, 20, "Constitution Day"]];
      return !!matchesDateNamed(nat, d);
    },
    note: "Nepal has limited dry days. Some elections and national holidays bring restrictions. Generally permissive otherwise."
  },

  // ================================================================
  // SOUTHEAST ASIA
  // ================================================================
  {
    country: "TH", stateLabel: "Thailand",
    check: (d) => {
      // Thai Buddhist holidays — approximate dates (vary by lunar calendar)
      // Fixed: Makha Bucha ~Feb, Visakha Bucha ~May, Asanha Bucha ~Jul, start/end of Buddhist Lent
      const m = d.getMonth() + 1;
      const day = d.getDate();
      // New Year's Day and Songkran (Apr 13-15) sometimes have restrictions
      const restricted = [[1, 1], [4, 13], [4, 14], [4, 15]];
      return restricted.some(([rm, rd]) => rm === m && rd === day);
    },
    note: "Thailand bans alcohol sales on major Buddhist holidays (Makha Bucha, Visakha Bucha, Asanha Bucha, Buddhist Lent). Dates change annually by lunar calendar. Songkran and New Year may also see restrictions."
  },
  {
    country: "MY", stateLabel: "Malaysia",
    check: () => false,
    note: "Malaysia permits alcohol in non-Muslim venues. Not a national dry day today. Some states like Kelantan and Terengganu are stricter — check locally."
  },
  {
    country: "ID", stateLabel: "Indonesia",
    check: (d) => {
      // Ramadan-adjacent restrictions and some national holidays
      return false; // Simplified; varies heavily by region
    },
    note: "Indonesia is not a prohibition country, but Aceh province enforces sharia law including alcohol bans. Some local governments restrict sales. Bali is permissive. Check your specific region."
  },
  {
    country: "PH", stateLabel: "Philippines",
    check: (d) => {
      // Holy Week (variable), elections
      return false;
    },
    note: "The Philippines restricts alcohol during Holy Week and on Election Day (date varies). Otherwise not a dry day nationally today."
  },

  // ================================================================
  // USA
  // ================================================================
  {
    country: "US", stateLabel: "United States",
    check: () => false,
    note: "The US has no federal dry days. Some counties remain dry by local law (mostly in the South). Sunday sales hours vary by state. Check your specific county."
  },

  // ================================================================
  // UK / EUROPE
  // ================================================================
  {
    country: "GB", stateLabel: "United Kingdom",
    check: () => false,
    note: "Great Britain has no dry days. Pub hours are regulated but no mandatory closure days exist. God save your liver."
  },
  {
    country: "DE", stateLabel: "Germany",
    check: () => false,
    note: "Germany has no national dry days. You're in the right country."
  },
  {
    country: "FR", stateLabel: "France",
    check: () => false,
    note: "France has no national dry days. Wine with everything remains government policy (unspoken)."
  },

  // ================================================================
  // AUSTRALIA / CANADA
  // ================================================================
  {
    country: "AU", stateLabel: "Australia",
    check: () => false,
    note: "Australia has no national dry days. Some Aboriginal communities enforce alcohol restrictions — check locally."
  },
  {
    country: "CA", stateLabel: "Canada",
    check: () => false,
    note: "Canada has no national dry days. Provincial liquor laws apply. Quebec is most permissive; some Prairie towns less so."
  },
];

// ---- POYA DAY CHECK (Sri Lanka full moon) ----
// Rough lunar phase calculation
function isPoyaDay(date) {
  const knownNewMoon = new Date(2000, 0, 6, 18, 14); // Jan 6, 2000
  const lunarCycle = 29.53058867;
  const diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((diff % lunarCycle) + lunarCycle) % lunarCycle;
  return phase >= 13.5 && phase <= 15.5; // Full moon ± 1 day
}

// ---- STATE GRID DATA (India summary) ----
const INDIA_STATE_SUMMARY = [
  { code: "MH", name: "Maharashtra", type: "selective" },
  { code: "DL", name: "Delhi", type: "selective" },
  { code: "GJ", name: "Gujarat", type: "prohibited" },
  { code: "BR", name: "Bihar", type: "prohibited" },
  { code: "NA", name: "Nagaland", type: "prohibited" },
  { code: "MN", name: "Manipur", type: "prohibited" },
  { code: "MZ", name: "Mizoram", type: "prohibited" },
  { code: "KA", name: "Karnataka", type: "selective" },
  { code: "TN", name: "Tamil Nadu", type: "selective" },
  { code: "KL", name: "Kerala", type: "selective" },
  { code: "UP", name: "Uttar Pradesh", type: "selective" },
  { code: "WB", name: "West Bengal", type: "selective" },
  { code: "RJ", name: "Rajasthan", type: "selective" },
  { code: "MP", name: "Madhya Pradesh", type: "selective" },
  { code: "GA", name: "Goa", type: "selective" },
  { code: "PB", name: "Punjab", type: "selective" },
  { code: "HR", name: "Haryana", type: "selective" },
  { code: "HP", name: "Himachal Pradesh", type: "selective" },
  { code: "JK", name: "Jammu & Kashmir", type: "selective" },
  { code: "AS", name: "Assam", type: "selective" },
  { code: "OR", name: "Odisha", type: "selective" },
  { code: "CG", name: "Chhattisgarh", type: "selective" },
  { code: "JH", name: "Jharkhand", type: "selective" },
  { code: "UK", name: "Uttarakhand", type: "selective" },
  { code: "TR", name: "Tripura", type: "selective" },
  { code: "ML", name: "Meghalaya", type: "selective" },
  { code: "SK", name: "Sikkim", type: "selective" },
  { code: "AR", name: "Arunachal Pradesh", type: "selective" },
  { code: "AP", name: "Andhra Pradesh", type: "selective" },
  { code: "TS", name: "Telangana", type: "selective" },
  { code: "LK", name: "Lakshadweep", type: "prohibited" },
  { code: "PY", name: "Puducherry", type: "selective" },
  { code: "CH", name: "Chandigarh", type: "selective" },
  { code: "DN", name: "Dadra & Nagar Haveli / Daman & Diu", type: "selective" },
  { code: "AN", name: "Andaman & Nicobar", type: "selective" },
];

// ---- LOOKUP FUNCTION ----
function getDryDayRule(countryCode, stateCode) {
  if (stateCode) {
    const stateRule = DRY_DAY_RULES.find(r => r.country === countryCode && r.state === stateCode);
    if (stateRule) return stateRule;
  }
  const countryRule = DRY_DAY_RULES.find(r => r.country === countryCode && !r.state);
  if (countryRule) return countryRule;
  return null;
}
