# Saved Prompt Injector

A Chrome Extension that allows you to **inject commonly used saved prompt snippets** (leaders and trailers) into any active text input area or contentEditable field (such as ChatGPT, Notion, Gmail, etc.).
You can inject via **popup buttons** or by assigning **custom keyboard shortcuts** through the browser’s Extensions Shortcuts panel.

---

## ✨ Features

* **Popup buttons** for quick injection:

  * Leader (Main)
  * Trailer (Main)
  * Leader (Alt)
  * Trailer (Alt)
* **Custom keyboard shortcuts** (set in `chrome://extensions/shortcuts`).
* **Template storage**:

  * Save/edit four templates (leader main, trailer main, leader alt, trailer alt).
  * Templates are persisted in `chrome.storage.sync` (they sync across Chrome installs signed into the same account).
* **Injection logic**:

  * Works in `<textarea>` and `<input>` elements.
  * Works in `contentEditable` fields (e.g., ChatGPT input box).
  * Correct handling of leaders/trailers:

    * Leaders → snippet inserted with newline(s) after.
    * Trailers → newline(s) before snippet.
* **Options page** for editing templates with a simple form.
* **Lightweight** (no external libraries, just native Chrome APIs).
* **Manifest V3 compliant**.

---

## 📦 Installation (Developer Mode)

1. Clone or download this repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/SavedPromptInjector.git
   cd SavedPromptInjector
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. In the top right, toggle **Developer Mode** to ON.

4. Click **Load unpacked** and select the project folder (the root containing `manifest.json`).

5. The extension icon should now appear in your Chrome toolbar.

---

## 🚀 Usage

### 1. Popup Buttons

* Click the extension icon.
* In the popup, choose:

  * **Leader (Main)** → injects your main leader snippet.
  * **Trailer (Main)** → injects your main trailer snippet.
  * **Leader (Alt)** → injects your alternate leader snippet.
  * **Trailer (Alt)** → injects your alternate trailer snippet.

### 2. Keyboard Shortcuts

* Go to:

  ```
  chrome://extensions/shortcuts
  ```
* Assign key combinations (e.g., `Ctrl+Shift+L` for Leader Main).
* Use the shortcuts while focused inside ChatGPT or any text input.

### 3. Options Page

* Right-click extension icon → **Options**, or click the link in the popup.
* Edit and save your four templates:

  * Leader (Main)
  * Trailer (Main)
  * Leader (Alt)
  * Trailer (Alt)

---

## 🛠 File Overview

* **`manifest.json`**
  Defines extension metadata, permissions, background scripts, popup, options, and command bindings.

* **`background.js`**
  Listens for registered keyboard shortcut commands.
  Fetches the correct template and calls the injection logic (mirrors popup button behaviour).

* **`popup.html` / `popup.js`**
  Renders the popup UI with four buttons + status line.
  Handles button clicks → fetches template → injects into active tab.

* **`options.html` / `options.js`**
  Provides a UI for editing and saving templates.
  Uses `chrome.storage.sync` so templates persist across devices.

* **`icons/`**
  Contains icon assets in required sizes (16px, 48px, 128px).

---

## 🔑 Permissions Explained

This extension requests the following permissions in `manifest.json`:

* **`scripting`**
  Required to run injection scripts into the active page.

* **`activeTab`**
  Needed so the extension can interact with the currently focused tab.

* **`storage`**
  Used for persisting user’s templates (via `chrome.storage.sync`).

---

## ⚙️ Example Workflow

1. Save a leader template in Options:

   ```
   "Please carefully analyse the following text:"
   ```

2. Save a trailer template in Options:

   ```
   "Summarise in three concise bullet points."
   ```

3. While in ChatGPT, click **Leader (Main)** button → text injected, cursor remains ready.

4. Type/paste your input.

5. Use keyboard shortcut for **Trailer (Main)** → trailer text appears neatly after with spacing.

---

## 🧩 Known Behaviours

* Injection spacing differs slightly between `<textarea>` and `contentEditable`:

  * For `<textarea>`: handled with `\n` characters.
  * For `contentEditable`: handled by inserting `<br>` elements.
* Multiple `<br>` are used to simulate blank lines (since raw `\n` won’t render).
* Cursor position is reset immediately after insertion.

---

## 🐛 Troubleshooting

* **Injection doesn’t work:**
  Make sure you’ve clicked inside a text box first before triggering.

* **Keyboard shortcut not responding:**
  Check your assignments in `chrome://extensions/shortcuts`.
  Some combinations may be blocked/reserved by the OS.

* **Templates not saving:**
  Verify you pressed “Save” in the Options page.
  If syncing across Chrome profiles, allow time for `chrome.storage.sync` to propagate.

---

## 📜 License

```
MIT License

Copyright (c) 2025 Paula

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💡 Future Improvements

* Add more template slots.
* Export/import templates (JSON).
* Per-site template sets (ChatGPT vs Gmail vs Notion).
* Rich text injection (bold, italics) for contentEditable.
* Sync with cloud storage beyond `chrome.storage.sync`.

---

## 👩‍💻 Author

Developed by **Paula Livingstone**
Optimist / Engineer / Adventurer, and builder of practical tools.
Newmilns, Scotland
This repo is part of ongoing work to streamline workflows with Chrome extensions.
