// Grab buttons + status line
const leaderMainBtn   = document.getElementById("btnLeaderMain");
const trailerMainBtn  = document.getElementById("btnTrailerMain");
const leaderAltBtn    = document.getElementById("btnLeaderAlt");
const trailerAltBtn   = document.getElementById("btnTrailerAlt");
const openOptionsLink = document.getElementById("openOptions");
const statusEl        = document.getElementById("status");

// Utility: fetch template + inject
function handleClick(label, key, type) {
  chrome.storage.sync.get(key).then((data) => {
    const text = data[key];
    injectAndNotify(label, text, type);
  });
}

// Bind buttons to handlers
leaderMainBtn.addEventListener("click", () => handleClick("Leader (Main)", "leaderMain", "leader"));
trailerMainBtn.addEventListener("click", () => handleClick("Trailer (Main)", "trailerMain", "trailer"));
leaderAltBtn.addEventListener("click", () => handleClick("Leader (Alt)", "leaderAlt", "leader"));
trailerAltBtn.addEventListener("click", () => handleClick("Trailer (Alt)", "trailerAlt", "trailer"));

// Open the full options page
openOptionsLink.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

// Core: inject into active tab
function injectAndNotify(label, text, type) {
  if (!text) {
    statusEl.textContent = `${label}: No template saved yet.`;
    statusEl.style.color = "red";
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (injectedText, type) => {
        const active = document.activeElement;
        if (!active) {
          alert("Click inside a text box first, then try again.");
          return;
        }

        // --- TEXTAREA / INPUT ---
        if (active.tagName === "TEXTAREA" || active.tagName === "INPUT") {
          const start = active.selectionStart;
          const end = active.selectionEnd;
          let insertText = injectedText;

          if (type === "leader") {
            insertText = injectedText + "\n";
          } else if (type === "trailer") {
            insertText = "\n" + injectedText;
          }

          active.value = active.value.slice(0, start) + insertText + active.value.slice(end);
          const newPos = start + insertText.length;
          active.setSelectionRange(newPos, newPos);
          active.focus();

        // --- CONTENTEDITABLE (ChatGPT, Notion, Gmail, etc.) ---
        } else if (active.isContentEditable) {
          const sel = window.getSelection();
          if (!sel.rangeCount) return;
          const range = sel.getRangeAt(0);

          let nodes = [];
          if (type === "leader") {
            nodes.push(document.createTextNode(injectedText));
            nodes.push(document.createElement("br"));
          } else if (type === "trailer") {
            nodes.push(document.createElement("br"));
            nodes.push(document.createTextNode(injectedText));
          } else {
            nodes.push(document.createTextNode(injectedText));
          }

          range.deleteContents();
          for (let n of nodes) {
            range.insertNode(n);
            range.setStartAfter(n);
          }

          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);

        } else {
          alert("Click inside a text box first, then try again.");
        }
      },
      args: [text, type]
    }, () => {
      statusEl.textContent = `${label} injected`;
      statusEl.style.color = "green";
      setTimeout(() => statusEl.textContent = "", 2000);
    });
  });
}
