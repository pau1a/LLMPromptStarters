chrome.commands.onCommand.addListener((command) => {
  if (command === "inject-leader-main") {
    chrome.storage.sync.get("leaderMain").then((data) => {
      injectIntoPage(data.leaderMain || "[MAIN LEADER]");
    });
  }

  if (command === "inject-trailer-main") {
    chrome.storage.sync.get("trailerMain").then((data) => {
      injectIntoPage(data.trailerMain || "[MAIN TRAILER]");
    });
  }

  if (command === "inject-leader-alt") {
    chrome.storage.sync.get("leaderAlt").then((data) => {
      injectIntoPage(data.leaderAlt || "[ALT LEADER]");
    });
  }

  if (command === "inject-trailer-alt") {
    chrome.storage.sync.get("trailerAlt").then((data) => {
      injectIntoPage(data.trailerAlt || "[ALT TRAILER]");
    });
  }
});

function injectIntoPage(text) {
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
        }
      },
      args: [text]
    });
  });
}
