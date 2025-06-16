const apiKeyInput = document.getElementById('api-key');
const saveBtn = document.getElementById('save-btn');
const statusDiv = document.getElementById('status');

// Load API key on page load
chrome.storage.sync.get(['groqApiKey'], (result) => {
  if (result.groqApiKey) {
    apiKeyInput.value = result.groqApiKey;
  }
});

saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    statusDiv.textContent = 'Please enter an API key.';
    return;
  }
  // TODO: Add encryption for API key before saving
  chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
    statusDiv.textContent = 'API key saved!';
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
}); 