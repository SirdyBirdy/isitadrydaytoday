/* ============================================
   IS IT A DRY DAY TODAY — DATA v3
   Google Sheet is primary source.
   Static rules are fallback only.
   ============================================ */

// ---- SASSY COPY ----
var DRY_QUIPS = [
  "Put the bottle down, friend. The government said so.",
  "Not today, Satan. Not today.",
  "The law is dry. So are your hopes.",
  "Your liver just exhaled in relief.",
  "Congratulations! You have been voluntarily sober by decree.",
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
  "The government giveth, and today it taketh away.",
  "Dry day. Not a dry eye in the wine aisle.",
];

var NOT_DRY_QUIPS = [
  "Go forth and imbibe responsibly. The law permits it.",
  "Bottoms up! (Within legal limits. We are watching.)",
  "The liquor store is OPEN. You are welcome.",
  "Today's vibes: legally lubricated.",
  "No dry law today. Your plans are safe.",
  "The universe gave you a free pass. Do not waste it.",
  "Cheers, you beautiful rule-follower.",
  "It is legally a good day to be hydrated with hops.",
  "Your Tuesday afternoon rose is perfectly legal. Enjoy.",
  "Not a dry day. Do with that information what you will.",
  "Today's status: your local bar is very much open.",
  "The government has no notes. Party on.",
  "Legally speaking, you are free to make questionable choices.",
  "No prohibition today. The choice is entirely yours.",
  "Green light. May your evening be as smooth as your drink.",
  "Not dry. The rest is up to you and your bank account.",
];

var CROWDSOURCE_DRY_QUIPS = [
  "Locals are reporting it is dry today. Take that with a grain of salt and a lime.",
  "The crowd has spoken, and apparently so has the law. Allegedly.",
  "Unverified reports say: dry. Proceed with caution and maybe call ahead.",
  "People on the ground say it is dry. We cannot confirm. You have been warned.",
];

// ---- INDIA NATIONAL DRY DAYS [month, day, name] ----
var INDIA_NATIONAL_DRY_DAYS = [
  [1, 26, "Republic Day"],
  [8, 15, "Independence Day"],
  [10, 2, "Gandhi Jayanti"],
];

// ---- HELPERS ----
function matchesDateNamed(arr, date) {
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var found = null;
  arr.forEach(function(item) { if (item[0] === m && item[1] === d) found = item[2]; });
  return found;
}

function checkNationalIndia(date) {
  return matchesDateNamed(INDIA_NATIONAL_DRY_DAYS, date);
}

function isPoyaDay(date) {
  var knownNewMoon = new Date(2000, 0, 6, 18, 14);
  var lunarCycle = 29.53058867;
  var diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
  var phase = ((diff % lunarCycle) + lunarCycle) % lunarCycle;
  return phase >= 13.5 && phase <= 15.5;
}

// ---- STATIC DRY DAY RULES (fallback only) ----
var DRY_DAY_RULES = [

  // INDIA — PROHIBITION STATES
  { country:"IN", state:"GJ", stateLabel:"Gujarat", isDryState:true,
    check:function(){ return true; },
    note:"Gujarat has enforced prohibition since 1960. Every day is a dry day. Permits exist for medical use only." },
  { country:"IN", state:"BR", stateLabel:"Bihar", isDryState:true,
    check:function(){ return true; },
    note:"Bihar banned alcohol statewide in 2016. Fully dry every day. The penalties are not light." },
  { country:"IN", state:"NA", stateLabel:"Nagaland", isDryState:true,
    check:function(){ return true; },
    note:"Nagaland enforces the Liquor Total Prohibition Act. Dry every single day." },
  { country:"IN", state:"MN", stateLabel:"Manipur", isDryState:true,
    check:function(){ return true; },
    note:"Manipur enforces prohibition statewide. Every day is a dry day here." },
  { country:"IN", state:"MZ", stateLabel:"Mizoram", isDryState:true,
    check:function(){ return true; },
    note:"Mizoram enforces the Liquor Prohibition and Control Act. Dry statewide." },
  { country:"IN", state:"LA", stateLabel:"Lakshadweep", isDryState:true,
    check:function(){ return true; },
    note:"Lakshadweep is a dry UT. Alcohol is prohibited on most islands." },

  // INDIA — SELECTIVE DRY DAYS
  { country:"IN", state:"MH", stateLabel:"Maharashtra",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[5,1,"Maharashtra Day"],[4,14,"Dr. Ambedkar Jayanti"]], d);
    },
    note:"Maharashtra observes dry days on Republic Day, Independence Day, Gandhi Jayanti, Maharashtra Day (May 1), and Dr. Ambedkar Jayanti (Apr 14). Election dry days are announced at short notice." },
  { country:"IN", state:"DL", stateLabel:"Delhi",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Delhi observes dry days on Republic Day, Independence Day, and Gandhi Jayanti. Election dry days are announced by the Election Commission." },
  { country:"IN", state:"KA", stateLabel:"Karnataka",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[11,1,"Kannada Rajyotsava"],[4,14,"Dr. Ambedkar Jayanti"]], d);
    },
    note:"Karnataka observes dry days on national holidays, Kannada Rajyotsava (Nov 1), and Dr. Ambedkar Jayanti (Apr 14)." },
  { country:"IN", state:"TN", stateLabel:"Tamil Nadu",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[1,14,"Pongal"],[4,14,"Tamil New Year"]], d);
    },
    note:"Tamil Nadu observes dry days on national holidays, Pongal (Jan 14), and Tamil New Year (Apr 14)." },
  { country:"IN", state:"KL", stateLabel:"Kerala",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[11,1,"Kerala Piravi"]], d);
    },
    note:"Kerala observes dry days on national holidays and Kerala Piravi (Nov 1). Bevco outlets closed on these days." },
  { country:"IN", state:"UP", stateLabel:"Uttar Pradesh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Uttar Pradesh observes dry days on national holidays. Election dry days are common." },
  { country:"IN", state:"WB", stateLabel:"West Bengal",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"West Bengal observes dry days on national holidays. Check locally during Durga Puja." },
  { country:"IN", state:"RJ", stateLabel:"Rajasthan",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[3,30,"Rajasthan Day"]], d);
    },
    note:"Rajasthan observes dry days on national holidays and Rajasthan Day (Mar 30)." },
  { country:"IN", state:"MP", stateLabel:"Madhya Pradesh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Madhya Pradesh observes dry days on national holidays." },
  { country:"IN", state:"GA", stateLabel:"Goa",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Goa observes dry days on national holidays only. One of India's most relaxed states on alcohol." },
  { country:"IN", state:"PB", stateLabel:"Punjab",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[11,1,"Punjab Day"]], d);
    },
    note:"Punjab observes dry days on national holidays and Punjab Day (Nov 1)." },
  { country:"IN", state:"HR", stateLabel:"Haryana",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Haryana observes dry days on national holidays." },
  { country:"IN", state:"HP", stateLabel:"Himachal Pradesh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Himachal Pradesh observes dry days on national holidays." },
  { country:"IN", state:"JK", stateLabel:"Jammu & Kashmir",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"J&K observes dry days on national holidays." },
  { country:"IN", state:"AS", stateLabel:"Assam",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[4,14,"Bohag Bihu"]], d);
    },
    note:"Assam observes dry days on national holidays and Bihu (Apr 14)." },
  { country:"IN", state:"OR", stateLabel:"Odisha",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[4,1,"Odisha Day"],[4,14,"Dr. Ambedkar Jayanti"]], d);
    },
    note:"Odisha observes dry days on national holidays and Utkal Divas (Apr 1)." },
  { country:"IN", state:"CG", stateLabel:"Chhattisgarh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Chhattisgarh observes dry days on national holidays." },
  { country:"IN", state:"JH", stateLabel:"Jharkhand",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Jharkhand observes dry days on national holidays." },
  { country:"IN", state:"UK", stateLabel:"Uttarakhand",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Uttarakhand observes dry days on national holidays." },
  { country:"IN", state:"TR", stateLabel:"Tripura",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Tripura observes dry days on national holidays." },
  { country:"IN", state:"ML", stateLabel:"Meghalaya",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Meghalaya observes dry days on national holidays." },
  { country:"IN", state:"SK", stateLabel:"Sikkim",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Sikkim observes dry days on national holidays." },
  { country:"IN", state:"AR", stateLabel:"Arunachal Pradesh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Arunachal Pradesh observes dry days on national holidays." },
  { country:"IN", state:"AP", stateLabel:"Andhra Pradesh",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[11,1,"AP Formation Day"],[4,14,"Dr. Ambedkar Jayanti"]], d);
    },
    note:"Andhra Pradesh observes dry days on national holidays and AP Formation Day (Nov 1)." },
  { country:"IN", state:"TS", stateLabel:"Telangana",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[6,2,"Telangana Formation Day"],[4,14,"Dr. Ambedkar Jayanti"]], d);
    },
    note:"Telangana observes dry days on national holidays and Telangana Formation Day (Jun 2)." },
  { country:"IN", state:"PY", stateLabel:"Puducherry",
    check:function(d){
      if (checkNationalIndia(d)) return true;
      return !!matchesDateNamed([[8,16,"Puducherry Liberation Day"]], d);
    },
    note:"Puducherry observes dry days on national holidays and Liberation Day (Aug 16)." },
  { country:"IN", state:"CH", stateLabel:"Chandigarh",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Chandigarh observes dry days on national holidays." },
  { country:"IN", state:"DN", stateLabel:"Dadra & Nagar Haveli / Daman & Diu",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Observes dry days on national holidays." },
  { country:"IN", state:"AN", stateLabel:"Andaman & Nicobar Islands",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Observes dry days on national holidays." },
  // India generic fallback
  { country:"IN", stateLabel:"India",
    check:function(d){ return !!checkNationalIndia(d); },
    note:"Most Indian states observe dry days on Republic Day (Jan 26), Independence Day (Aug 15), and Gandhi Jayanti (Oct 2). Your state may have additional ones." },

  // MIDDLE EAST — TOTAL PROHIBITION
  { country:"SA", stateLabel:"Saudi Arabia",
    check:function(){ return true; },
    note:"Saudi Arabia enforces total prohibition. Alcohol is completely illegal. Every day is a dry day — no exceptions." },
  { country:"KW", stateLabel:"Kuwait",
    check:function(){ return true; },
    note:"Kuwait enforces total prohibition. Every day is a dry day." },
  { country:"IR", stateLabel:"Iran",
    check:function(){ return true; },
    note:"Iran enforces total prohibition under Islamic law. Every day is a dry day." },
  { country:"YE", stateLabel:"Yemen",
    check:function(){ return true; },
    note:"Yemen enforces near-total prohibition. Every day is effectively a dry day." },
  { country:"LY", stateLabel:"Libya",
    check:function(){ return true; },
    note:"Libya enforces total prohibition. Every day is a dry day." },
  { country:"AE", stateLabel:"UAE",
    check:function(){ return false; },
    note:"The UAE allows alcohol in licensed venues in Dubai and Abu Dhabi. Sharjah is completely dry. Ramadan may bring public consumption restrictions. Check your specific emirate." },
  { country:"BH", stateLabel:"Bahrain",
    check:function(){ return false; },
    note:"Bahrain allows alcohol in licensed venues. Not a dry day today — though Ramadan brings some public restrictions." },
  { country:"QA", stateLabel:"Qatar",
    check:function(){ return false; },
    note:"Qatar permits alcohol in licensed hotels and the QDC. Ramadan restrictions apply. Always check the specific venue." },
  { country:"OM", stateLabel:"Oman",
    check:function(){ return false; },
    note:"Oman permits alcohol in licensed venues. Restrictions apply during Ramadan." },
  { country:"JO", stateLabel:"Jordan",
    check:function(){ return false; },
    note:"Jordan permits alcohol. Not a dry day today generally — check locally during religious holidays." },
  { country:"IQ", stateLabel:"Iraq",
    check:function(){ return false; },
    note:"Iraq officially allows alcohol but many areas have restrictions. Baghdad has licensed venues; check your specific city." },
  { country:"LB", stateLabel:"Lebanon",
    check:function(){ return false; },
    note:"Lebanon is one of the most permissive countries in the region for alcohol. Not a dry day." },

  // SOUTH ASIA
  { country:"PK", stateLabel:"Pakistan",
    check:function(){ return true; },
    note:"Pakistan enforces prohibition for Muslims. Non-Muslims may access alcohol via licensed outlets, but effectively every day is dry for the vast majority of the population." },
  { country:"BD", stateLabel:"Bangladesh",
    check:function(){ return true; },
    note:"Bangladesh enforces near-total prohibition. Alcohol requires a permit for non-Muslims. Effectively dry every day." },
  { country:"MV", stateLabel:"Maldives",
    check:function(){ return true; },
    note:"The Maldives bans alcohol for citizens and non-resort islands. If you are not at a licensed resort, every day is a dry day." },
  { country:"LK", stateLabel:"Sri Lanka",
    check:function(d){
      if (isPoyaDay(d)) return true;
      return !!matchesDateNamed([[2,4,"Independence Day"]], d);
    },
    note:"Sri Lanka bans alcohol sales on every Poya (full moon) day nationwide. Also dry on Independence Day (Feb 4). Check the lunar calendar." },
  { country:"NP", stateLabel:"Nepal",
    check:function(d){
      return !!matchesDateNamed([[9,20,"Constitution Day"]], d);
    },
    note:"Nepal has limited dry days. Generally permissive, with some election and national holiday restrictions." },
  { country:"AF", stateLabel:"Afghanistan",
    check:function(){ return true; },
    note:"Afghanistan enforces total prohibition. Every day is a dry day." },

  // SOUTHEAST ASIA
  { country:"TH", stateLabel:"Thailand",
    check:function(d){
      var m = d.getMonth() + 1;
      var day = d.getDate();
      // Fixed restricted dates (Buddhist holidays vary — use override sheet for annual updates)
      var restricted = [[1,1],[4,6],[4,13],[4,14],[4,15],[7,28],[10,13],[12,5]];
      return restricted.some(function(r){ return r[0]===m && r[1]===day; });
    },
    note:"Thailand bans alcohol on Buddhist holidays and certain national holidays. Dates vary annually by lunar calendar — use the override sheet for annual updates. Songkran (Apr 13-15) is often dry." },
  { country:"MY", stateLabel:"Malaysia",
    check:function(){ return false; },
    note:"Malaysia permits alcohol in non-Muslim venues. Kelantan and Terengganu are stricter. Not a national dry day today." },
  { country:"ID", stateLabel:"Indonesia",
    check:function(){ return false; },
    note:"Indonesia allows alcohol outside Aceh province (which enforces sharia). Bali is very permissive. Check your specific region." },
  { country:"PH", stateLabel:"Philippines",
    check:function(){ return false; },
    note:"Philippines restricts alcohol during Holy Week and Election Day (dates vary). Not a national dry day today." },
  { country:"SG", stateLabel:"Singapore",
    check:function(){ return false; },
    note:"Singapore restricts outdoor drinking after 10:30pm and on public holidays in certain areas (Little India, Geylang). Not a full dry day." },
  { country:"VN", stateLabel:"Vietnam",
    check:function(){ return false; },
    note:"Vietnam has no national dry days. Alcohol is widely available. Enjoy responsibly." },
  { country:"MM", stateLabel:"Myanmar",
    check:function(d){
      // Thingyan (Water Festival) April 13-16
      var m = d.getMonth() + 1;
      var day = d.getDate();
      return m === 4 && day >= 13 && day <= 16;
    },
    note:"Myanmar has restrictions during Thingyan (Water Festival, Apr 13-16). Otherwise alcohol is generally available." },

  // USA
  { country:"US", stateLabel:"United States",
    check:function(){ return false; },
    note:"The US has no federal dry days. Some counties remain dry by local law. Sunday sales hours vary by state. Check your specific county." },

  // UK & EUROPE
  { country:"GB", stateLabel:"United Kingdom",
    check:function(){ return false; },
    note:"Great Britain has no dry days. God save your liver." },
  { country:"IE", stateLabel:"Ireland",
    check:function(d){
      // Good Friday was a dry day until 2018 — now abolished
      return false;
    },
    note:"Ireland has no mandatory dry days since 2018 (Good Friday restriction was abolished). Have a pint." },
  { country:"DE", stateLabel:"Germany",
    check:function(){ return false; },
    note:"Germany has no national dry days. You are in the right country." },
  { country:"FR", stateLabel:"France",
    check:function(){ return false; },
    note:"France has no national dry days. Wine with everything remains an unspoken government policy." },
  { country:"IT", stateLabel:"Italy",
    check:function(){ return false; },
    note:"Italy has no national dry days. Please have an Aperol Spritz." },
  { country:"ES", stateLabel:"Spain",
    check:function(){ return false; },
    note:"Spain has no national dry days. Regional fiestas may have local restrictions." },
  { country:"NL", stateLabel:"Netherlands",
    check:function(){ return false; },
    note:"Netherlands has no national dry days." },
  { country:"PL", stateLabel:"Poland",
    check:function(){ return false; },
    note:"Poland has no national dry days, though some local municipalities vote themselves dry." },
  { country:"NO", stateLabel:"Norway",
    check:function(d){
      // Norwegian national day May 17
      var m = d.getMonth() + 1;
      var day = d.getDate();
      if (m === 5 && day === 17) return false; // Actually NOT dry — they celebrate loudly
      return false;
    },
    note:"Norway has no mandatory dry days, but alcohol is only sold at state Vinmonopolet stores with restricted hours. Sundays they are closed." },
  { country:"SE", stateLabel:"Sweden",
    check:function(){ return false; },
    note:"Sweden has no national dry days. Systembolaget (state stores) are closed Sundays." },
  { country:"FI", stateLabel:"Finland",
    check:function(){ return false; },
    note:"Finland has no national dry days." },
  { country:"RU", stateLabel:"Russia",
    check:function(){ return false; },
    note:"Russia has no national dry days, though late-night sales are restricted in many regions." },

  // AMERICAS
  { country:"CA", stateLabel:"Canada",
    check:function(){ return false; },
    note:"Canada has no national dry days. Provincial liquor laws apply. Quebec is most permissive." },
  { country:"MX", stateLabel:"Mexico",
    check:function(d){
      // Ley Seca on election days (variable) — use override sheet
      return false;
    },
    note:"Mexico enforces Ley Seca (dry law) during elections. Dates vary by state and federal elections — add to override sheet when announced." },
  { country:"BR", stateLabel:"Brazil",
    check:function(){ return false; },
    note:"Brazil has no national dry days. Some cities restrict sales on election day." },
  { country:"AR", stateLabel:"Argentina",
    check:function(){ return false; },
    note:"Argentina has no national dry days." },
  { country:"CL", stateLabel:"Chile",
    check:function(){ return false; },
    note:"Chile has no national dry days." },
  { country:"CO", stateLabel:"Colombia",
    check:function(){ return false; },
    note:"Colombia has no national dry days, though local Ley Seca rules apply during elections." },

  // AFRICA
  { country:"ZA", stateLabel:"South Africa",
    check:function(){ return false; },
    note:"South Africa has no national dry days. Good Friday and Christmas Day used to be dry — now abolished." },
  { country:"NG", stateLabel:"Nigeria",
    check:function(){ return false; },
    note:"Nigeria has no national dry days, though northern states under sharia law restrict alcohol." },
  { country:"KE", stateLabel:"Kenya",
    check:function(){ return false; },
    note:"Kenya has no national dry days." },
  { country:"MA", stateLabel:"Morocco",
    check:function(){ return false; },
    note:"Morocco allows alcohol in licensed venues and tourist areas. Ramadan brings significant public restrictions." },
  { country:"ET", stateLabel:"Ethiopia",
    check:function(){ return false; },
    note:"Ethiopia has no national dry days." },
  { country:"EG", stateLabel:"Egypt",
    check:function(){ return false; },
    note:"Egypt allows alcohol in licensed hotels and tourist venues. Not a national dry day." },
  { country:"SO", stateLabel:"Somalia",
    check:function(){ return true; },
    note:"Somalia enforces prohibition under Islamic law. Every day is a dry day." },
  { country:"SD", stateLabel:"Sudan",
    check:function(){ return true; },
    note:"Sudan enforces prohibition. Every day is a dry day." },
  { country:"MR", stateLabel:"Mauritania",
    check:function(){ return true; },
    note:"Mauritania enforces prohibition. Every day is a dry day." },
  { country:"DJ", stateLabel:"Djibouti",
    check:function(){ return false; },
    note:"Djibouti allows alcohol in licensed venues." },
  { country:"TZ", stateLabel:"Tanzania",
    check:function(){ return false; },
    note:"Tanzania has no national dry days." },

  // OCEANIA
  { country:"AU", stateLabel:"Australia",
    check:function(){ return false; },
    note:"Australia has no national dry days. Some Aboriginal communities enforce alcohol restrictions — check locally." },
  { country:"NZ", stateLabel:"New Zealand",
    check:function(){ return false; },
    note:"New Zealand has no national dry days." },

  // EAST ASIA
  { country:"CN", stateLabel:"China",
    check:function(){ return false; },
    note:"China has no national dry days. Alcohol is widely available." },
  { country:"JP", stateLabel:"Japan",
    check:function(){ return false; },
    note:"Japan has no national dry days. Vending machines selling beer exist. You are in good hands." },
  { country:"KR", stateLabel:"South Korea",
    check:function(){ return false; },
    note:"South Korea has no national dry days." },

];

// ---- STATE GRID DATA (India summary) ----
var INDIA_STATE_SUMMARY = [
  { code:"MH", name:"Maharashtra", type:"selective" },
  { code:"DL", name:"Delhi", type:"selective" },
  { code:"GJ", name:"Gujarat", type:"prohibited" },
  { code:"BR", name:"Bihar", type:"prohibited" },
  { code:"NA", name:"Nagaland", type:"prohibited" },
  { code:"MN", name:"Manipur", type:"prohibited" },
  { code:"MZ", name:"Mizoram", type:"prohibited" },
  { code:"KA", name:"Karnataka", type:"selective" },
  { code:"TN", name:"Tamil Nadu", type:"selective" },
  { code:"KL", name:"Kerala", type:"selective" },
  { code:"UP", name:"Uttar Pradesh", type:"selective" },
  { code:"WB", name:"West Bengal", type:"selective" },
  { code:"RJ", name:"Rajasthan", type:"selective" },
  { code:"MP", name:"Madhya Pradesh", type:"selective" },
  { code:"GA", name:"Goa", type:"selective" },
  { code:"PB", name:"Punjab", type:"selective" },
  { code:"HR", name:"Haryana", type:"selective" },
  { code:"HP", name:"Himachal Pradesh", type:"selective" },
  { code:"JK", name:"Jammu & Kashmir", type:"selective" },
  { code:"AS", name:"Assam", type:"selective" },
  { code:"OR", name:"Odisha", type:"selective" },
  { code:"CG", name:"Chhattisgarh", type:"selective" },
  { code:"JH", name:"Jharkhand", type:"selective" },
  { code:"UK", name:"Uttarakhand", type:"selective" },
  { code:"TR", name:"Tripura", type:"selective" },
  { code:"ML", name:"Meghalaya", type:"selective" },
  { code:"SK", name:"Sikkim", type:"selective" },
  { code:"AR", name:"Arunachal Pradesh", type:"selective" },
  { code:"AP", name:"Andhra Pradesh", type:"selective" },
  { code:"TS", name:"Telangana", type:"selective" },
  { code:"LA", name:"Lakshadweep", type:"prohibited" },
  { code:"PY", name:"Puducherry", type:"selective" },
  { code:"CH", name:"Chandigarh", type:"selective" },
  { code:"DN", name:"Dadra & Nagar Haveli / Daman & Diu", type:"selective" },
  { code:"AN", name:"Andaman & Nicobar", type:"selective" },
];

// ---- LOOKUP ----
function getDryDayRule(countryCode, stateCode) {
  if (stateCode) {
    var stateRule = null;
    DRY_DAY_RULES.forEach(function(r) {
      if (r.country === countryCode && r.state === stateCode) stateRule = r;
    });
    if (stateRule) return stateRule;
  }
  var countryRule = null;
  DRY_DAY_RULES.forEach(function(r) {
    if (r.country === countryCode && !r.state) countryRule = r;
  });
  return countryRule;
}
