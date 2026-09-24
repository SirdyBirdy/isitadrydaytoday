/* Google Analytics 4. Set your Measurement ID below (Admin > Data streams > Web). */
(function () {
  var GA_ID = "G-XXXXXXXXXX";

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.track = function (name, params) {
    if (!window.GA_ACTIVE) { return; }
    try { window.gtag("event", name, params || {}); } catch (e) {}
  };

  if (GA_ID.indexOf("XXXX") !== -1) { return; }
  window.GA_ACTIVE = true;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
})();
