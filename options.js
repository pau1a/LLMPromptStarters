const leaderMainEl = document.getElementById("leaderMain");
const trailerMainEl = document.getElementById("trailerMain");
const leaderAltEl = document.getElementById("leaderAlt");
const trailerAltEl = document.getElementById("trailerAlt");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

// Load all templates on open
chrome.storage.sync.get(["leaderMain", "trailerMain", "leaderAlt", "trailerAlt"]).then((data) => {
  leaderMainEl.value = data.leaderMain || "";
  trailerMainEl.value = data.trailerMain || "";
  leaderAltEl.value = data.leaderAlt || "";
  trailerAltEl.value = data.trailerAlt || "";
});

// Save all templates
saveBtn.addEventListener("click", () => {
  chrome.storage.sync.set({
    leaderMain: leaderMainEl.value,
    trailerMain: trailerMainEl.value,
    leaderAlt: leaderAltEl.value,
    trailerAlt: trailerAltEl.value
  }).then(() => {
    status.textContent = "Templates saved!";
    setTimeout(() => status.textContent = "", 2000);
  });
});
