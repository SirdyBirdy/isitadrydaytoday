/* ============================================
   IS IT A DRY DAY TODAY — APP v3
   Priority order:
   1. Google Sheet (live overrides by owner)
   2. Crowdsource reports (with disclaimer)
   3. Static rules (fallback)
   ============================================ */

// ================================================================
// CONFIG — fill these in after setting up your Google Sheet
// ================================================================
var CONFIG = {
  // Publish Tab 1 of your sheet as CSV and paste URL here.
  // Tab columns: COUNTRY, STATE, DATE (YYYY-MM-DD or *), IS_DRY (TRUE/FALSE), NOTE
  OVERRIDE_SHEET_URL: "",

  // Publish Tab 2 of your sheet as CSV and paste URL here.
  // Tab columns: LOCATION_KEY, DATE, DRY_COUNT, NOT_DRY_COUNT
  COUNT_SHEET_URL: "",

  // Google Form response URL and entry field IDs for crowdsource submissions.
  // Leave blank to show the button but skip actual posting.
  CROWDSOURCE_FORM_URL: "",
  FIELD_LOCATION: "entry.000000001",
  FIELD_IS_DRY:   "entry.000000002",
  FIELD_DATE:     "entry.000000003",
};
// ================================================================

var currentLocationKey   = "";
var currentLocationLabel = "";
var currentIsDry         = null;

// ---- UI HELPERS ----
function showState(id) {
  var all = document.querySelectorAll(".state");
  for (var i = 0; i < all.length; i++) { all[i].classList.add("hidden"); }
  var el = document.getElementById(id);
  if (el) { el.classList.remove("hidden"); }
}

function setText(id, text) {
  var el = document.getElementById(id);
  if (el) { el.textContent = text; }
}

function setHTML(id, html) {
  var el = document.getElementById(id);
  if (el) { el.innerHTML = html; }
}

function showToast(msg) {
  var t = document.getElementById("toast");
  if (!t) { return; }
  t.textContent = msg;
  t.classList.add("visible");
  setTimeout(function() { t.classList.remove("visible"); }, 3200);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toDateStr(d) {
  var y   = d.getFullYear();
  var m   = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

// ---- CSV PARSER ----
function parseCSV(text) {
  var lines = text.trim().split("\n");
  if (lines.length < 2) { return []; }
  var headers = lines[0].split(",").map(function(h) {
    return h.trim().replace(/"/g, "").toLowerCase();
  });
  var rows = [];
  for (var i = 1; i < lines.length; i++) {
    var vals = lines[i].split(",").map(function(v) { return v.trim().replace(/"/g, ""); });
    var obj = {};
    headers.forEach(function(h, idx) { obj[h] = vals[idx] || ""; });
    rows.push(obj);
  }
  return rows;
}

// ---- GOOGLE SHEET: LIVE OVERRIDES ----
function fetchOverride(locationKey, dateStr) {
  return new Promise(function(resolve) {
    if (!CONFIG.OVERRIDE_SHEET_URL) { resolve(null); return; }
    var url = CONFIG.OVERRIDE_SHEET_URL + "&cb=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function(r) { return r.text(); })
      .then(function(text) {
        var rows = parseCSV(text);
        var match = null;
        rows.forEach(function(r) {
          var rowKey   = (r.country + (r.state ? "-" + r.state : "")).toUpperCase();
          var keyMatch = rowKey === locationKey || (r.location_key || "").toUpperCase() === locationKey;
          var dateMatch = r.date === dateStr || r.date === "*";
          if (keyMatch && dateMatch) { match = r; }
        });
        if (!match) { resolve(null); return; }
        resolve({
          isDry:  match.is_dry.toUpperCase() === "TRUE",
          note:   match.note || "",
          source: "sheet"
        });
      })
      .catch(function() { resolve(null); });
  });
}

// ---- GOOGLE SHEET: CROWD COUNTS ----
function fetchCrowdCounts(locationKey, dateStr) {
  return new Promise(function(resolve) {
    if (!CONFIG.COUNT_SHEET_URL) { resolve(null); return; }
    var url = CONFIG.COUNT_SHEET_URL + "&cb=" + Date.now();
    fetch(url, { cache: "no-store" })
      .then(function(r) { return r.text(); })
      .then(function(text) {
        var rows  = parseCSV(text);
        var match = null;
        rows.forEach(function(r) {
          if ((r.location_key || "").toUpperCase() === locationKey && r.date === dateStr) { match = r; }
        });
        if (!match) { resolve(null); return; }
        resolve({
          dryCount:    parseInt(match.dry_count    || "0", 10),
          notDryCount: parseInt(match.not_dry_count || "0", 10)
        });
      })
      .catch(function() { resolve(null); });
  });
}

// ---- SUBMIT CROWDSOURCE ----
function submitCrowdsource(locationKey, isDry, dateStr) {
  var key = "cs_" + locationKey + "_" + dateStr;
  if (localStorage.getItem(key)) {
    showToast("You already reported for today. Thanks!");
    return;
  }
  if (!CONFIG.CROWDSOURCE_FORM_URL) {
    showToast("Thanks for the report! Connect a Google Form in CONFIG to enable live tracking.");
    localStorage.setItem(key, "1");
    return;
  }
  var fd = new FormData();
  fd.append(CONFIG.FIELD_LOCATION, locationKey);
  fd.append(CONFIG.FIELD_IS_DRY,   isDry ? "true" : "false");
  fd.append(CONFIG.FIELD_DATE,     dateStr);
  fetch(CONFIG.CROWDSOURCE_FORM_URL, { method: "POST", body: fd, mode: "no-cors" })
    .then(function() {
      localStorage.setItem(key, "1");
      showToast("Report submitted! Thanks for helping the community.");
    })
    .catch(function() {
      showToast("Could not submit right now. Try again later.");
    });
}

// ---- SHOW CROWD DISCLAIMER ----
function showCrowdDisclaimer(dryCount) {
  var el = document.getElementById("crowdDisclaimer");
  if (!el) { return; }
  el.innerHTML =
    "<strong>Unverified report:</strong> " + dryCount +
    " visitor" + (dryCount === 1 ? "" : "s") +
    " reported a dry day here today. Not confirmed by official sources. " +
    "Always check with local authorities or your nearest store before making plans.";
  el.classList.remove("hidden");
}

// ---- RENDER RESULT ----
function renderResult(isDry, note, locationLabel, locationKey, dateStr, source, crowdOverride) {
  currentIsDry         = isDry;
  currentLocationLabel = locationLabel;
  currentLocationKey   = locationKey;

  var sourceBadge = "";
  if (source === "sheet")  { sourceBadge = '<span class="source-badge source-live">LIVE</span>'; }
  if (source === "crowd")  { sourceBadge = '<span class="source-badge source-crowd">CROWD REPORT</span>'; }
  // Static badge only shown on dry results — on not-dry it's just clutter

  if (isDry) {
    showState("stateDry");
    setText("locationTagDry", locationLabel);
    if (source === "crowd") {
      setText("subtextDry", randomItem(CROWDSOURCE_DRY_QUIPS));
    } else {
      setText("subtextDry", randomItem(DRY_QUIPS));
    }
    setHTML("dryNoteWrap", sourceBadge + '<span id="dryNote"></span>');
    setText("dryNote", note);
  } else {
    showState("stateNotDry");
    setText("locationTagNotDry", locationLabel);
    setText("subtextNotDry", randomItem(NOT_DRY_QUIPS));
    setHTML("notDrySourceWrap", sourceBadge);
  }

  // Show share buttons
  var shareActions = document.getElementById("shareActions");
  if (shareActions) { shareActions.classList.remove("hidden"); }

  // Crowd disclaimer if result came from crowdsource
  if (source === "crowd" && crowdOverride) {
    showCrowdDisclaimer(crowdOverride.dryCount);
  }

  wireShareButtons(isDry, locationLabel, dateStr);
  wireCrowdsourceButtons(locationKey, isDry, dateStr);
}

// ---- PROCESS LOCATION ----
function processLocation(countryCode, stateCode, locationLabel, locationKey) {
  var today   = new Date();
  var dateStr = toDateStr(today);

  // Step 1: Google Sheet override
  fetchOverride(locationKey, dateStr).then(function(override) {
    if (override !== null) {
      renderResult(override.isDry, override.note, locationLabel, locationKey, dateStr, "sheet", null);
      return;
    }

    // Step 2: Static rule
    var rule       = getDryDayRule(countryCode, stateCode);
    var staticIsDry = rule ? rule.check(today) : null;
    var staticNote  = rule ? rule.note : "We don't have dry day data for your exact location. Check locally.";

    // If static says NOT dry, still check crowd counts for possible override
    fetchCrowdCounts(locationKey, dateStr).then(function(counts) {
      // Crowd override threshold: 5+ reports saying dry when static says not dry
      var crowdSaysDry = counts && counts.dryCount >= 5 && counts.dryCount > (counts.notDryCount * 2);

      if (crowdSaysDry && staticIsDry === false) {
        var crowdNote = "Based on " + counts.dryCount + " visitor reports. Not confirmed by official sources. Verify before you head out.";
        renderResult(true, crowdNote, locationLabel, locationKey, dateStr, "crowd", counts);
        return;
      }

      // Normal static result
      if (staticIsDry === null) {
        showState("stateError");
        return;
      }

      renderResult(staticIsDry, staticNote, locationLabel, locationKey, dateStr, "static", null);

      // Also show crowd count info even when static rule applied
      if (counts) {
        if (staticIsDry && counts.dryCount > 0) {
          setText("crowdCountDry", counts.dryCount + " people also confirmed it is dry today");
        } else if (!staticIsDry && counts.dryCount > 0) {
          var disc = document.getElementById("crowdDisclaimer");
          if (disc) {
            disc.innerHTML =
              "<strong>Note:</strong> " + counts.dryCount +
              " visitor" + (counts.dryCount === 1 ? "" : "s") +
              " reported it as dry today. Our data says otherwise, but you may want to call ahead.";
            disc.classList.remove("hidden");
          }
        }
      }
    });
  });
}

// ---- WIRE SHARE BUTTONS ----
function wireShareButtons(isDry, locationLabel, dateStr) {
  var status  = isDry ? "YES - it IS a dry day" : "NOPE - not a dry day";
  var msg     = (isDry ? "\uD83D\uDEAB\uD83C\uDF7A" : "\uD83C\uDF7A\uD83E\uDD42") +
                " " + status + " in " + locationLabel + " today (" + dateStr +
                "). Check yours at isitadrydaytoday.lol";
  var siteUrl = "https://isitadrydaytoday.lol";

  var wa = document.getElementById("btnWhatsapp");
  var tw = document.getElementById("btnTwitter");
  var im = document.getElementById("btnImage");

  if (wa) {
    wa.onclick = function() {
      window.open("https://wa.me/?text=" + encodeURIComponent(msg + "\n" + siteUrl), "_blank");
    };
  }
  if (tw) {
    tw.onclick = function() {
      window.open("https://x.com/intent/tweet?text=" + encodeURIComponent(msg) + "&url=" + encodeURIComponent(siteUrl), "_blank");
    };
  }
  if (im) {
    im.onclick = function() { saveAsImage(); };
  }
}

// ---- WIRE CROWDSOURCE BUTTONS ----
function wireCrowdsourceButtons(locationKey, isDry, dateStr) {
  var confirmBtn = document.getElementById("confirmDryBtn");
  var reportBtn  = document.getElementById("reportDryBtn");
  if (confirmBtn) {
    confirmBtn.onclick = function() { submitCrowdsource(locationKey, true, dateStr); };
  }
  if (reportBtn) {
    reportBtn.onclick = function() { submitCrowdsource(locationKey, true, dateStr); };
  }
}

// ---- SAVE AS IMAGE ----
function saveAsImage() {
  var cardId = currentIsDry ? "shareCard" : "shareCardNo";
  var card   = document.getElementById(cardId);
  if (!card) { showToast("Card not found."); return; }
  if (typeof html2canvas === "undefined") {
    showToast("Image export loading. Try again in a moment.");
    return;
  }
  showToast("Generating image...");
  html2canvas(card, { backgroundColor: null, scale: 2, useCORS: true, logging: false })
    .then(function(canvas) {
      var link      = document.createElement("a");
      link.download = "is-it-a-dry-day-" + toDateStr(new Date()) + ".png";
      link.href     = canvas.toDataURL("image/png");
      link.click();
      showToast("Image saved!");
    })
    .catch(function() {
      showToast("Could not generate image. Try screenshotting instead!");
    });
}

// ---- REVERSE GEOCODE ----
function reverseGeocode(lat, lon) {
  return fetch(
    "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json&accept-language=en",
    { headers: { "User-Agent": "isitadrydaytoday.lol/3.0" } }
  ).then(function(r) { return r.json(); });
}

// ---- EXTRACT CODES ----
function extractCodes(geo) {
  var addr        = geo.address || {};
  var countryCode = (addr.country_code || "").toUpperCase();
  var stateCode   = "";

  if (countryCode === "IN") {
    var stateMap = {
      "maharashtra": "MH",
      "delhi": "DL",
      "national capital territory of delhi": "DL",
      "gujarat": "GJ",
      "bihar": "BR",
      "nagaland": "NA",
      "manipur": "MN",
      "mizoram": "MZ",
      "karnataka": "KA",
      "tamil nadu": "TN",
      "kerala": "KL",
      "uttar pradesh": "UP",
      "west bengal": "WB",
      "rajasthan": "RJ",
      "madhya pradesh": "MP",
      "goa": "GA",
      "punjab": "PB",
      "haryana": "HR",
      "himachal pradesh": "HP",
      "jammu and kashmir": "JK",
      "jammu & kashmir": "JK",
      "ladakh": "JK",
      "assam": "AS",
      "odisha": "OR",
      "chhattisgarh": "CG",
      "jharkhand": "JH",
      "uttarakhand": "UK",
      "tripura": "TR",
      "meghalaya": "ML",
      "sikkim": "SK",
      "arunachal pradesh": "AR",
      "andhra pradesh": "AP",
      "telangana": "TS",
      "puducherry": "PY",
      "pondicherry": "PY",
      "chandigarh": "CH",
      "lakshadweep": "LA",
      "andaman and nicobar islands": "AN",
      "dadra and nagar haveli and daman and diu": "DN"
    };
    stateCode = stateMap[(addr.state || "").toLowerCase()] || "";
  } else if (countryCode === "US") {
    var lvl = addr["ISO3166-2-lvl4"] || "";
    stateCode = lvl.replace("US-", "").toUpperCase() || (addr.state_code || "").toUpperCase();
  } else if (countryCode === "AU") {
    var lvl2 = addr["ISO3166-2-lvl4"] || "";
    stateCode = lvl2.replace("AU-", "").toUpperCase();
  }

  var city          = addr.city || addr.town || addr.suburb || addr.village || addr.county || addr.state || "";
  var country       = addr.country || countryCode;
  var locationLabel = [city, country].filter(Boolean).join(", ");
  var locationKey   = (countryCode + (stateCode ? "-" + stateCode : "")).toUpperCase();
  return { countryCode: countryCode, stateCode: stateCode, locationLabel: locationLabel, locationKey: locationKey };
}

// ---- CITY SEARCH ----
function searchCity(query) {
  if (!query.trim()) { return; }
  showState("stateLoading");
  fetch(
    "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(query) + "&format=json&limit=1&accept-language=en",
    { headers: { "User-Agent": "isitadrydaytoday.lol/3.0" } }
  )
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data || !data.length) { throw new Error("Not found"); }
      return reverseGeocode(data[0].lat, data[0].lon);
    })
    .then(function(geo) {
      var codes = extractCodes(geo);
      processLocation(codes.countryCode, codes.stateCode, codes.locationLabel, codes.locationKey);
    })
    .catch(function() { showState("stateError"); });
}

function bindInput(inputId, btnId) {
  var inp = document.getElementById(inputId);
  var btn = document.getElementById(btnId);
  if (!inp || !btn) { return; }
  btn.onclick = function() { searchCity(inp.value); };
  inp.onkeydown = function(e) { if (e.key === "Enter") { searchCity(inp.value); } };
}

// ---- STATE GRID ----
function buildStateGrid() {
  var grid = document.getElementById("stateGrid");
  if (!grid) { return; }
  var today = new Date();
  var html  = "";
  INDIA_STATE_SUMMARY.forEach(function(s) {
    var rule    = getDryDayRule("IN", s.code);
    var status  = "unknown";
    if (rule) {
      status = (s.type === "prohibited" || rule.check(today)) ? "dry" : "not-dry";
    }
    var iconChar = status === "dry" ? "\uD83D\uDEAB" : status === "not-dry" ? "\u2713" : "?";
    html += '<div class="state-chip state-chip--' + status + '">' +
            '<span class="state-chip-icon">' + iconChar + '</span>' +
            '<span class="state-chip-name">' + s.name + '</span></div>';
  });
  grid.innerHTML = html;
}

// ---- THEME TOGGLE ----
function initTheme() {
  var html  = document.documentElement;
  var saved = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", saved);

  var btn = document.getElementById("themeToggle");
  if (btn) {
    btn.onclick = function() {
      var next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };
  }
}

// ---- INIT ----
function init() {
  initTheme();

  var today   = new Date();
  var datePill = document.getElementById("datePill");
  if (datePill) {
    datePill.textContent = today.toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
  }

  var fy = document.getElementById("footerYear");
  if (fy) { fy.textContent = today.getFullYear(); }

  bindInput("cityInput",      "citySubmit");
  bindInput("cityInputError", "citySubmitError");

  var adClose = document.getElementById("adClose");
  if (adClose) {
    adClose.onclick = function() {
      var sticky = document.getElementById("adSticky");
      if (sticky) { sticky.remove(); }
      document.body.style.paddingBottom = "0";
    };
  }

  buildStateGrid();

  if (!navigator.geolocation) {
    showState("statePermission");
    return;
  }

  showState("stateLoading");

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      reverseGeocode(pos.coords.latitude, pos.coords.longitude)
        .then(function(geo) {
          var codes = extractCodes(geo);
          processLocation(codes.countryCode, codes.stateCode, codes.locationLabel, codes.locationKey);
        })
        .catch(function() { showState("stateError"); });
    },
    function(err) {
      if (err.code === 1) { showState("statePermission"); }
      else { showState("stateError"); }
    },
    { timeout: 8000, maximumAge: 300000 }
  );
}

init();
