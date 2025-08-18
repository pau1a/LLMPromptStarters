// Grab buttons + status line
const leaderMainBtn   = document.getElementById("btnLeaderMain");
const trailerMainBtn  = document.getElementById("btnTrailerMain");
const leaderAltBtn    = document.getElementById("btnLeaderAlt");
const trailerAltBtn   = document.getElementById("btnTrailerAlt");
const openOptionsLink = document.getElementById("openOptions");
const statusEl        = document.getElementById("status");

// Load all templates from storage
let templates = {};
chrome.storage.sync.get(["leaderMain", "trailerMain", "leaderAlt", "trailerAlt"])
  .then((data) => {
    templates = data;
  });

// Event bindings
leaderMainBtn.addEventListener("click", () => {
  injectAndNotify("Leader (Main)", templates.leaderMain);
});

trailerMainBtn.addEventListener("click", () => {
  injectAndNotify("Trailer (Main)", templates.trailerMain);
});

leaderAltBtn.addEventListener("click", () => {
  injectAndNotify("Leader (Alt)", templates.leaderAlt);
});

trailerAltBtn.addEventListener("click", () => {
  injectAndNotify("Trailer (Alt)", templates.trailerAlt);
});

// Open the full options page
openOptionsLink.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// Core: inject into active tab
function injectAndNotify(label, text) {
  if (!text) {
    statusEl.textContent = `${label}: No template saved yet.`;
    statusEl.style.color = "red";
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (injectedText) => {
        const active = document.activeElement;
        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT" || active.isContentEditable)) {
          if (active.isContentEditable) {
            active.innerText += injectedText;
          } else {
            active.value += injectedText;
          }
        } else {
          alert("Click inside a text box first, then try again.");
        }
      },
      args: [text]
    }, () => {
      statusEl.textContent = `${label} injected`;
      statusEl.style.color = "green";
      setTimeout(() => statusEl.textContent = "", 2000);
    });
  });
}
