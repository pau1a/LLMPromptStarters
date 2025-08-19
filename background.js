chrome.commands.onCommand.addListener((command) => {
  if (command === "inject-leader-main") {
    chrome.storage.sync.get("leaderMain").then((data) => {
      injectIntoPage(data.leaderMain || "[MAIN LEADER]", "leader", "Leader (Main)");
    });
  }

  if (command === "inject-trailer-main") {
    chrome.storage.sync.get("trailerMain").then((data) => {
      injectIntoPage(data.trailerMain || "[MAIN TRAILER]", "trailer", "Trailer (Main)");
    });
  }

  if (command === "inject-leader-alt") {
    chrome.storage.sync.get("leaderAlt").then((data) => {
      injectIntoPage(data.leaderAlt || "[ALT LEADER]", "leader", "Leader (Alt)");
    });
  }

  if (command === "inject-trailer-alt") {
    chrome.storage.sync.get("trailerAlt").then((data) => {
      injectIntoPage(data.trailerAlt || "[ALT TRAILER]", "trailer", "Trailer (Alt)");
    });
  }
});

// --- Core Injection Logic (matches popup.js) ---
function injectIntoPage(text, type, label) {
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
            nodes.push(document.createElement("br"));
          } else if (type === "trailer") {
            nodes.push(document.createElement("br"));
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
    });
  });
}
