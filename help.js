var helpData = null;
var loadedLang = null;
var currentHelpSection = 'players';

function loadHelp(sectionKey) {
  currentHelpSection = sectionKey;

  var lang = localStorage.getItem("appLanguage") || "en";

  // Update active button
  document.querySelectorAll('.help-btn')
    .forEach(btn => btn.classList.remove('active'));

  var activeBtn = document.querySelector(
    `.help-btn[onclick="loadHelp('${sectionKey}')"]`
  );
  if (activeBtn) activeBtn.classList.add('active');

  // Reload help JSON if language changed
  if (!helpData || loadedLang !== lang) {
    fetch(`https://samkarikalan.github.io/APP/help_${lang}.json?v=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error("Help file not found");
        return res.json();
      })
      .then(data => {
        helpData = data;
        loadedLang = lang;
        showHelpSection(sectionKey);
      })
      .catch(() => {
        document.getElementById('helpContainer').innerHTML =
          '<p style="color:red;">Help file not available for this language.</p>';
      });
  } else {
    showHelpSection(sectionKey);
  }
}

function showHelpSection(sectionKey) {
  var container = document.getElementById('helpContainer');
  var sectionObj = helpData?.[sectionKey];

  if (!sectionObj) {
    container.innerHTML = '<p>No help found for this section.</p>';
    return;
  }

  var html = '';

  for (var topicKey in sectionObj) {
    var topic = sectionObj[topicKey];
    html += `
      <div class="help-card">
        ${topic.title ? `<h3>${topic.title}</h3>` : ''}
        ${topic.content ? `<p>${topic.content}</p>` : ''}
        ${topic.list
          ? `<ul>${topic.list.map(item => `<li>${item}</li>`).join('')}</ul>`
          : ''}
      </div>
    `;
  }

  container.innerHTML = html;
}

/* ===============================
   LANGUAGE CHANGE HANDLER
   =============================== */
function changeLanguage(lang) {
  localStorage.setItem("appLanguage", lang);

  // 🔥 Instantly refresh help in current section
  loadHelp(currentHelpSection);
}

// Initial load
loadHelp(currentHelpSection);







let tooltipTimer = null;
let mobileTooltipEl = null;

function applyTooltips(lang) {
  if (!window.translations || !translations[lang]) return;

  const tooltips = translations[lang].tooltips;
  if (!tooltips) return;

  document.querySelectorAll("[data-tooltip]").forEach(el => {
    const key = el.dataset.tooltip;
    const text = tooltips[key];

    if (text) {
      el.title = text;               // desktop tooltip
      el.setAttribute("aria-label", text);
    } else {
      el.removeAttribute("title");
    }
  });
}

function showMobileTooltip(target, text) {
  hideMobileTooltip();

  mobileTooltipEl = document.createElement("div");
  mobileTooltipEl.textContent = text;

  Object.assign(mobileTooltipEl.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 9999,
    maxWidth: "90%",
    textAlign: "center"
  });

  document.body.appendChild(mobileTooltipEl);

  setTimeout(hideMobileTooltip, 2000);
}

function hideMobileTooltip() {
  if (mobileTooltipEl) {
    mobileTooltipEl.remove();
    mobileTooltipEl = null;
  }
}

function enableMobileTooltips() {
  document.querySelectorAll("[data-tooltip]").forEach(el => {

    el.addEventListener("touchstart", () => {
      tooltipTimer = setTimeout(() => {
        const text = el.title;
        if (text) showMobileTooltip(el, text);
      }, 500); // long press
    });

    el.addEventListener("touchend", clearTooltipTimer);
    el.addEventListener("touchmove", clearTooltipTimer);
  });
}

function clearTooltipTimer() {
  clearTimeout(tooltipTimer);
  hideMobileTooltip();
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("appLanguage") || "en";

  applyTooltips(lang);
  enableMobileTooltips();
});



