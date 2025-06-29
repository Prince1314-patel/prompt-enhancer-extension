const promptView = document.getElementById('prompt-view');
const settingsView = document.getElementById('settings-view');
const settingsIcon = document.getElementById('settings-icon');
const backToHomeIcon = document.getElementById('back-to-home-icon');
const historyIcon = document.getElementById('history-icon');
const historyView = document.getElementById('history-view');
const backToHomeFromHistory = document.getElementById('back-to-home-from-history');

// Prompt Enhancer Elements
const enhanceBtn = document.getElementById('enhance-btn');
const copyBtn = document.getElementById('copy-btn');
const promptInput = document.getElementById('prompt-input');
const enhancementType = document.getElementById('enhancement-type');
const outputArea = document.getElementById('output-area');
const spinner = document.getElementById('spinner');
const outputText = document.getElementById('output-text');
const copyBtnText = document.getElementById('copy-btn-text');
const copyCheckmark = document.getElementById('copy-checkmark');
const funFact = document.getElementById('fun-fact');
const confettiCanvas = document.getElementById('confetti-canvas');

// API Key Management Elements
const apiKeyInput = document.getElementById('api-key');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const deleteApiKeyBtn = document.getElementById('delete-api-key-btn');
const statusDiv = document.getElementById('status');

// Fun facts/tips
const funFacts = [
  "💡 Tip: Use 'Clarity' to make your prompt easier to understand!",
  "🤖 Fun Fact: Llama-3.3-70b is one of the most advanced AI models!",
  "✨ Try 'Creative Enhancement' for more engaging prompts!",
  "🔒 Your API key is stored securely in your browser.",
  "🎉 Did you know? You can copy the enhanced prompt with one click!",
  "🪄 Magic happens when you enhance your prompt!"
];
function showRandomFunFact() {
  funFact.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
}

// Add tooltips to enhancement options
const enhancementOptions = [
  { value: 'clarity', text: 'Clarity Improvement', title: 'Make your prompt clearer and easier to understand.' },
  { value: 'context', text: 'Context Expansion', title: 'Add more context and detail to your prompt.' },
  { value: 'professional', text: 'Professional Formatting', title: 'Format your prompt in a professional tone.' },
  { value: 'creative', text: 'Creative Enhancement', title: 'Make your prompt more creative and engaging.' }
];
if (enhancementType.options.length === enhancementOptions.length) {
  for (let i = 0; i < enhancementOptions.length; i++) {
    enhancementType.options[i].title = enhancementOptions[i].title;
  }
}

function showSpinner(show) {
  if (show) {
    spinner.classList.add('active');
    outputText.textContent = '';
  } else {
    spinner.classList.remove('active');
  }
}

// Confetti animation
function launchConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  const W = confettiCanvas.width = confettiCanvas.offsetWidth;
  const H = confettiCanvas.height = confettiCanvas.offsetHeight;
  const confettiCount = 42;
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 6 + Math.random() * 8,
      d: 2 + Math.random() * 2,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
    }
    update();
    frame++;
    if (frame < 60) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }
  function update() {
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      c.y += c.d;
      c.tiltAngle += c.tiltAngleIncremental;
      c.tilt = Math.sin(c.tiltAngle) * 10;
      c.x += Math.sin(c.tiltAngle) * 2;
      if (c.y > H) {
        c.x = Math.random() * W;
        c.y = Math.random() * -20;
      }
    }
  }
  draw();
}

// --- View Management ---
function showView(viewId) {
  promptView.style.display = 'none';
  settingsView.style.display = 'none';
  document.getElementById(viewId).style.display = 'flex';
}

// Initial check for API key and set view
chrome.storage.sync.get(['groqApiKey'], (result) => {
  if (result.groqApiKey) {
    showView('prompt-view');
    showRandomFunFact(); // Only show fun fact on prompt view
  } else {
    showView('settings-view');
  }
});

// Event Listeners for view switching
settingsIcon.addEventListener('click', () => {
  showView('settings-view');
  // Load API key in settings view when opened
  chrome.storage.sync.get(['groqApiKey'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
  });
});

backToHomeIcon.addEventListener('click', () => {
  showView('prompt-view');
  showRandomFunFact(); // Show new fun fact when returning to prompt view
});

historyIcon.addEventListener('click', () => {
  promptView.style.display = 'none';
  settingsView.style.display = 'none';
  historyView.style.display = 'flex';
  renderHistoryList();
});

backToHomeFromHistory.addEventListener('click', () => {
  historyView.style.display = 'none';
  promptView.style.display = 'flex';
});

let lastOriginalPrompt = '';
let lastEnhancedPrompt = '';

// --- Prompt Enhancement Logic ---
enhanceBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  const type = enhancementType.value;

  chrome.storage.sync.get(['groqApiKey'], (result) => {
    const apiKey = result.groqApiKey;
    if (!apiKey) {
      outputText.textContent = 'API key not set. Please go to settings.';
      showSpinner(false);
      return;
    }

    if (!prompt) {
      outputText.textContent = 'Please enter a prompt.';
      showSpinner(false);
      return;
    }

    enhanceBtn.disabled = true;
    showSpinner(true);
    // Store the original prompt for comparison
    lastOriginalPrompt = prompt;
    chrome.runtime.sendMessage({ action: 'enhance', prompt, type }, (response) => {
      enhanceBtn.disabled = false;
      showSpinner(false);
      if (response.error) {
        outputText.textContent = response.error;
      } else {
        lastEnhancedPrompt = (response.enhancedPrompt || 'No response.').trim();
        outputText.textContent = lastEnhancedPrompt;
        savePromptHistory(lastOriginalPrompt, lastEnhancedPrompt);
        launchConfetti();
        showRandomFunFact();
      }
    });
  });
});

copyBtn.addEventListener('click', () => {
  const text = outputText.textContent;
  if (text) {
    navigator.clipboard.writeText(text);
    copyBtn.classList.add('copied');
    copyCheckmark.style.display = 'inline';
    copyBtnText.textContent = '';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyCheckmark.style.display = 'none';
      copyBtnText.textContent = 'Copy';
    }, 1200);
  }
});

// --- API Key Management Logic ---
saveApiKeyBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    statusDiv.textContent = 'Please enter an API key.';
    statusDiv.classList.remove('success');
    statusDiv.classList.add('error');
    return;
  }
  chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
    statusDiv.textContent = 'API key saved!';
    statusDiv.classList.remove('error');
    statusDiv.classList.add('success');
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
});

deleteApiKeyBtn.addEventListener('click', () => {
  chrome.storage.sync.remove(['groqApiKey'], () => {
    apiKeyInput.value = '';
    statusDiv.textContent = 'API key deleted!';
    statusDiv.classList.remove('error');
    statusDiv.classList.add('success');
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
});

// --- Prompt History Storage ---
function savePromptHistory(original, enhanced) {
  const entry = {
    original,
    enhanced,
    time: Date.now()
  };
  chrome.storage.local.get(['promptHistory'], (result) => {
    const history = Array.isArray(result.promptHistory) ? result.promptHistory : [];
    history.unshift(entry); // newest first
    // Limit history to 10 entries
    if (history.length > 10) history.length = 10;
    chrome.storage.local.set({ promptHistory: history });
  });
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function renderHistoryList() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-light);">Loading...</div>';
  chrome.storage.local.get(['promptHistory'], (result) => {
    const history = Array.isArray(result.promptHistory) ? result.promptHistory : [];
    if (!history.length) {
      historyList.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-light);">No history yet.</div>';
      return;
    }
    historyList.innerHTML = history.map((entry, idx) => `
      <div class="history-entry" style="border-bottom:1px solid var(--border);padding:12px 0;position:relative;">
        <div style="font-size:0.93em;color:var(--text-light);margin-bottom:4px;">${formatTime(entry.time)}</div>
        <div style="display:flex;gap:10px;position:relative;">
          <div style="flex:1;min-width:0;position:relative;">
            <button class="copy-history-btn" data-type="original" data-idx="${idx}" aria-label="Copy original prompt" title="Copy original prompt">
              <span class="copy-icon">📋</span>
            </button>
            <div style="font-weight:600;font-size:0.97em;">Original</div>
            <div style="white-space:pre-wrap;overflow:hidden;text-overflow:ellipsis;max-height:3.5em;line-height:1.2;font-size:0.97em;">${entry.original.slice(0, 180)}</div>
          </div>
          <div style="flex:1;min-width:0;position:relative;">
            <button class="copy-history-btn" data-type="enhanced" data-idx="${idx}" aria-label="Copy enhanced prompt" title="Copy enhanced prompt">
              <span class="copy-icon">📋</span>
            </button>
            <div style="font-weight:600;font-size:0.97em;">Enhanced</div>
            <div style="white-space:pre-wrap;overflow:hidden;text-overflow:ellipsis;max-height:3.5em;line-height:1.2;font-size:0.97em;">${entry.enhanced.slice(0, 180)}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Add copy event listeners
    const copyBtns = historyList.querySelectorAll('.copy-history-btn');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const idx = btn.getAttribute('data-idx');
        const type = btn.getAttribute('data-type');
        const prompt = history[idx][type];
        try {
          await navigator.clipboard.writeText(prompt);
          const icon = btn.querySelector('.copy-icon');
          const old = icon.textContent;
          icon.textContent = '✔️';
          setTimeout(() => { icon.textContent = old; }, 1000);
        } catch {}
      });
    });
  });
}

// --- Compare Modal Logic ---
const compareBtn = document.getElementById('compare-btn');
const compareModal = document.getElementById('compare-modal');
const closeCompareModal = document.getElementById('close-compare-modal');
const compareOriginal = document.getElementById('compare-original');
const compareEnhanced = document.getElementById('compare-enhanced');

function diffWords(oldStr, newStr) {
  // Simple word diff, returns array of {value, added, removed}
  const o = oldStr.split(/(\s+)/);
  const n = newStr.split(/(\s+)/);
  let outOld = '', outNew = '';
  let i = 0, j = 0;
  while (i < o.length || j < n.length) {
    if (o[i] === n[j]) {
      outOld += o[i] || '';
      outNew += n[j] || '';
      i++; j++;
    } else if (n[j] && !o.includes(n[j])) {
      outNew += `<span class='diff-added'>${n[j]}</span>`;
      j++;
    } else if (o[i] && !n.includes(o[i])) {
      outOld += `<span class='diff-removed'>${o[i]}</span>`;
      i++;
    } else {
      outOld += o[i] || '';
      outNew += n[j] || '';
      i++; j++;
    }
  }
  return { old: outOld, new: outNew };
}

compareBtn.addEventListener('click', () => {
  if (!lastOriginalPrompt || !lastEnhancedPrompt) return;
  const diff = diffWords(lastOriginalPrompt, lastEnhancedPrompt);
  compareOriginal.innerHTML = diff.old;
  compareEnhanced.innerHTML = diff.new;
  compareModal.style.display = 'flex';
});

closeCompareModal.addEventListener('click', () => {
  compareModal.style.display = 'none';
});

// Close modal on overlay click
compareModal.addEventListener('click', (e) => {
  if (e.target === compareModal || e.target.classList.contains('compare-modal-overlay')) {
    compareModal.style.display = 'none';
  }
});

// Always use dark theme
if (!document.body.classList.contains('dark-theme')) {
  document.body.classList.add('dark-theme');
}