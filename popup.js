// Grab buttons + status line
const leaderMainBtn   = document.getElementById("btnLeaderMain");
const trailerMainBtn  = document.getElementById("btnTrailerMain");
const leaderAltBtn    = document.getElementById("btnLeaderAlt");
const trailerAltBtn   = document.getElementById("btnTrailerAlt");
const openOptionsLink = document.getElementById("openOptions");
const statusEl        = document.getElementById("status");

// Utility: fetch template + inject
function handleClick(label, key) {
  chrome.storage.sync.get(key).then((data) => {
    const text = data[key];
    injectAndNotify(label, text);
  });
}

// Bind buttons to handlers
leaderMainBtn.addEventListener("click", () => handleClick("Leader (Main)", "leaderMain"));
trailerMainBtn.addEventListener("click", () => handleClick("Trailer (Main)", "trailerMain"));
leaderAltBtn.addEventListener("click", () => handleClick("Leader (Alt)", "leaderAlt"));
trailerAltBtn.addEventListener("click", () => handleClick("Trailer (Alt)", "trailerAlt"));

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
