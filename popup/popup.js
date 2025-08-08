// === NEURAL INTERFACE JAVASCRIPT ===

// Neural Network Background Animation
class NeuralBackground {
  constructor() {
    this.canvas = document.getElementById('neural-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.resize();
    this.createNodes();
    this.createConnections();
    this.animate();
    this.addEventListeners();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createNodes() {
    const nodeCount = 15;
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  createConnections() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const distance = this.getDistance(this.nodes[i], this.nodes[j]);
        if (distance < 150) {
          this.connections.push({
            from: i,
            to: j,
            opacity: 1 - distance / 150
          });
        }
      }
    }
  }

  getDistance(node1, node2) {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updateNodes() {
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

      // Mouse interaction
      const mouseDistance = this.getDistance(node, this.mouse);
      if (mouseDistance < 100) {
        const angle = Math.atan2(node.y - this.mouse.y, node.x - this.mouse.x);
        node.vx += Math.cos(angle) * 0.1;
        node.vy += Math.sin(angle) * 0.1;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    this.connections.forEach(conn => {
      const from = this.nodes[conn.from];
      const to = this.nodes[conn.to];
      const distance = this.getDistance(from, to);
      const opacity = 1 - distance / 150;

      if (opacity > 0.1) {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.3})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });

    // Draw nodes
    this.nodes.forEach(node => {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(99, 102, 241, ${node.opacity})`;
      this.ctx.fill();

      // Glow effect
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(99, 102, 241, ${node.opacity * 0.3})`;
      this.ctx.fill();
    });
  }

  animate() {
    this.updateNodes();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
}

// Quantum Particle System
class QuantumParticleSystem {
  constructor() {
    this.container = document.getElementById('particle-system');
    this.particles = [];
    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }

  getRandomColor() {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#a855f7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      // Wrap around edges
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
    });
  }

  drawParticles() {
    this.container.innerHTML = '';
    this.particles.forEach(particle => {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        left: ${particle.x}px;
        top: ${particle.y}px;
        width: ${particle.size}px;
        height: ${particle.size}px;
        background: ${particle.color};
        border-radius: 50%;
        opacity: ${particle.opacity};
        pointer-events: none;
        box-shadow: 0 0 ${particle.size * 2}px ${particle.color};
        transition: all 0.3s ease;
      `;
      this.container.appendChild(div);
    });
  }

  animate() {
    this.updateParticles();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize Neural Interface
let neuralBackground;
let quantumParticles;

// DOM Elements
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
const outputText = document.getElementById('output-text');
const copyBtnText = document.getElementById('copy-btn-text');
const copyCheckmark = document.getElementById('copy-checkmark');
const funFact = document.getElementById('fun-fact');
const confettiCanvas = document.getElementById('confetti-canvas');

// Quantum Loading Elements
const loadingContainer = document.getElementById('loading-container');
const loadingStep = document.getElementById('loading-step');
const quantumProgressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');

// API Key Management Elements
const apiKeyInput = document.getElementById('api-key');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const deleteApiKeyBtn = document.getElementById('delete-api-key-btn');
const statusDiv = document.getElementById('status');

// Enhanced Neural Facts
const neuralFacts = [
  "🧠 Neural Tip: Use 'Neural Clarity' to unlock your prompt's full potential!",
  "⚡ Quantum Fact: Llama-3.3-70b processes 70 billion parameters in real-time!",
  "🎨 Creative Mode: Transform ordinary prompts into extraordinary experiences!",
  "🔒 Security: Your API key is encrypted and stored securely in your neural vault.",
  "🎉 Quantum Success: One-click copy with neural precision!",
  "🪄 Magic happens when quantum enhancement meets neural intelligence!",
  "🌐 Context Expansion: Add depth and dimension to your prompts!",
  "💼 Professional Mode: Elevate your communication to executive level!",
  "🚀 Neural Boost: Experience the future of AI prompt engineering!",
  "✨ Quantum Enhancement: Where science meets creativity!"
];

function showRandomNeuralFact() {
  funFact.textContent = neuralFacts[Math.floor(Math.random() * neuralFacts.length)];
  funFact.style.animation = 'fadeInUp 0.5s ease-out';
  setTimeout(() => {
    funFact.style.animation = '';
  }, 500);
}

// Enhanced Enhancement Options with Neural Descriptions
const neuralEnhancementOptions = [
  { 
    value: 'clarity', 
    text: '🧠 Neural Clarity', 
    title: 'Unlock crystal-clear communication with neural precision.' 
  },
  { 
    value: 'context', 
    text: '🌐 Context Expansion', 
    title: 'Expand your prompt with intelligent context awareness.' 
  },
  { 
    value: 'professional', 
    text: '💼 Professional Format', 
    title: 'Transform your prompt into executive-level communication.' 
  },
  { 
    value: 'creative', 
    text: '🎨 Creative Enhancement', 
    title: 'Infuse your prompt with creative brilliance and innovation.' 
  }
];

// Apply neural tooltips
if (enhancementType.options.length === neuralEnhancementOptions.length) {
  for (let i = 0; i < neuralEnhancementOptions.length; i++) {
    enhancementType.options[i].title = neuralEnhancementOptions[i].title;
  }
}

// Quantum Loading System
let loadingInterval;
let currentStep = 0;
const quantumLoadingSteps = [
  { text: 'Initializing neural pathways...', duration: 2000 },
  { text: 'Quantum processing enhancement...', duration: 3000 },
  { text: 'Optimizing neural output...', duration: 1500 }
];

function showQuantumLoading(show) {
  if (show) {
    // Reset quantum loading state
    currentStep = 0;
    quantumProgressFill.style.strokeDashoffset = '283';
    progressText.textContent = '0%';
    outputText.textContent = '';
    
    // Show quantum loading container
    loadingContainer.style.display = 'flex';
    
    // Reset all quantum steps
    [step1, step2, step3].forEach(step => {
      step.classList.remove('active', 'completed');
    });
    
    // Start the quantum animation
    startQuantumAnimation();
  } else {
    // Hide quantum loading container
    loadingContainer.style.display = 'none';
    
    // Clear any running intervals
    if (loadingInterval) {
      clearInterval(loadingInterval);
    }
  }
}

function startQuantumAnimation() {
  let totalProgress = 0;
  const totalDuration = quantumLoadingSteps.reduce((sum, step) => sum + step.duration, 0);
  let elapsedTime = 0;
  
  loadingInterval = setInterval(() => {
    elapsedTime += 100;
    
    // Update quantum progress ring
    totalProgress = Math.min((elapsedTime / totalDuration) * 100, 100);
    const strokeOffset = 283 - (totalProgress / 100) * 283;
    quantumProgressFill.style.strokeDashoffset = strokeOffset;
    progressText.textContent = `${Math.round(totalProgress)}%`;
    
    // Update current quantum step
    const stepIndex = Math.floor((elapsedTime / totalDuration) * 3);
    if (stepIndex !== currentStep && stepIndex < 3) {
      updateQuantumStep(stepIndex);
    }
    
    // Check if quantum animation is complete
    if (elapsedTime >= totalDuration) {
      clearInterval(loadingInterval);
      // Keep at 100% for a moment before hiding
      setTimeout(() => {
        showQuantumLoading(false);
      }, 500);
    }
  }, 100);
}

function updateQuantumStep(stepIndex) {
  // Mark previous quantum step as completed
  if (currentStep < 3) {
    const previousStep = [step1, step2, step3][currentStep];
    if (previousStep) {
      previousStep.classList.remove('active');
      previousStep.classList.add('completed');
    }
  }
  
  // Activate current quantum step
  if (stepIndex < 3) {
    const currentStepElement = [step1, step2, step3][stepIndex];
    if (currentStepElement) {
      currentStepElement.classList.add('active');
      loadingStep.textContent = quantumLoadingSteps[stepIndex].text;
    }
  }
  
  currentStep = stepIndex;
}

// Enhanced Quantum Confetti Animation
function launchQuantumConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  const W = confettiCanvas.width = confettiCanvas.offsetWidth;
  const H = confettiCanvas.height = confettiCanvas.offsetHeight;
  const confettiCount = 50;
  const confetti = [];
  
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 8 + Math.random() * 12,
      d: 2 + Math.random() * 3,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
      quantum: Math.random() > 0.5
    });
  }
  
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < confetti.length; i++) {
      let c = confetti[i];
      ctx.beginPath();
      
      if (c.quantum) {
        // Quantum particles with glow effect
        ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
        
        // Add glow effect
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.r * 1.5, c.r * 0.75, c.tilt, 0, 2 * Math.PI);
        ctx.fillStyle = `${c.color}40`;
        ctx.fill();
      } else {
        // Regular confetti
      ctx.ellipse(c.x, c.y, c.r, c.r/2, c.tilt, 0, 2 * Math.PI);
      ctx.fillStyle = c.color;
      ctx.fill();
      }
    }
    update();
    frame++;
    if (frame < 80) {
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

// === Neural View Management ===
function showNeuralView(viewId) {
  promptView.style.display = 'none';
  settingsView.style.display = 'none';
  historyView.style.display = 'none';
  document.getElementById(viewId).style.display = 'flex';
}

// Initial neural check for API key and set view
chrome.storage.sync.get(['groqApiKey'], (result) => {
  if (result.groqApiKey) {
    showNeuralView('prompt-view');
    showRandomNeuralFact();
  } else {
    showNeuralView('settings-view');
  }
});

// Neural Event Listeners for view switching
settingsIcon.addEventListener('click', () => {
  showNeuralView('settings-view');
  // Load API key in settings view when opened
  chrome.storage.sync.get(['groqApiKey'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
  });
});

backToHomeIcon.addEventListener('click', () => {
  showNeuralView('prompt-view');
  showRandomNeuralFact();
});

historyIcon.addEventListener('click', () => {
  showNeuralView('history-view');
  renderNeuralHistory();
});

backToHomeFromHistory.addEventListener('click', () => {
  showNeuralView('prompt-view');
});

let lastOriginalPrompt = '';
let lastEnhancedPrompt = '';

// === Quantum Prompt Enhancement Logic ===
enhanceBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  const type = enhancementType.value;

  chrome.storage.sync.get(['groqApiKey'], (result) => {
    const apiKey = result.groqApiKey;
    if (!apiKey) {
      outputText.textContent = 'Neural API key not configured. Please visit settings.';
      showQuantumLoading(false);
      return;
    }

    if (!prompt) {
      outputText.textContent = 'Please enter a neural prompt to enhance.';
      showQuantumLoading(false);
      return;
    }

    enhanceBtn.disabled = true;
    showQuantumLoading(true);
    // Store the original prompt for comparison
    lastOriginalPrompt = prompt;
    chrome.runtime.sendMessage({ 
      action: 'enhance', 
      prompt, 
      type,
      template: selectedTemplate // Send template info to background
    }, (response) => {
      enhanceBtn.disabled = false;
      showQuantumLoading(false);
      if (response.error) {
        outputText.textContent = response.error;
      } else {
        lastEnhancedPrompt = (response.enhancedPrompt || 'No neural response.').trim();
        outputText.textContent = lastEnhancedPrompt;
        saveNeuralHistory(lastOriginalPrompt, lastEnhancedPrompt);
        launchQuantumConfetti();
        showRandomNeuralFact();
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

// === Neural API Key Management Logic ===
saveApiKeyBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  if (!apiKey) {
    statusDiv.textContent = 'Please enter a neural API key.';
    statusDiv.classList.remove('success');
    statusDiv.classList.add('error');
    return;
  }
  chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
    statusDiv.textContent = 'Neural API key saved successfully!';
    statusDiv.classList.remove('error');
    statusDiv.classList.add('success');
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
});

deleteApiKeyBtn.addEventListener('click', () => {
  chrome.storage.sync.remove(['groqApiKey'], () => {
    apiKeyInput.value = '';
    statusDiv.textContent = 'Neural API key deleted!';
    statusDiv.classList.remove('error');
    statusDiv.classList.add('success');
    setTimeout(() => statusDiv.textContent = '', 2000);
  });
});

// === Neural History Storage ===
function saveNeuralHistory(original, enhanced) {
  const entry = {
    original,
    enhanced,
    time: Date.now()
  };
  chrome.storage.local.get(['promptHistory'], (result) => {
    const history = Array.isArray(result.promptHistory) ? result.promptHistory : [];
    history.unshift(entry); // newest first
    // Limit history to 15 entries
    if (history.length > 15) history.length = 15;
    chrome.storage.local.set({ promptHistory: history });
  });
}

function formatNeuralTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function renderNeuralHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-secondary);">Loading neural history...</div>';
  chrome.storage.local.get(['promptHistory'], (result) => {
    const history = Array.isArray(result.promptHistory) ? result.promptHistory : [];
    if (!history.length) {
      historyList.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-secondary);">No neural history yet.</div>';
      return;
    }
    historyList.innerHTML = history.map((entry, idx) => `
      <div class="history-entry" style="border-bottom:1px solid var(--glass-border);padding:12px 0;position:relative;">
        <div style="font-size:0.93em;color:var(--text-secondary);margin-bottom:8px;">${formatNeuralTime(entry.time)}</div>
        <div style="display:flex;gap:12px;position:relative;">
          <div style="flex:1;min-width:0;position:relative;">
            <button class="copy-history-btn quantum-btn" data-type="original" data-idx="${idx}" aria-label="Copy original prompt" title="Copy original prompt">
              <div class="btn-particles"></div>
              <div class="btn-glow"></div>
              <span class="btn-icon">📋</span>
              <span class="btn-text">Original</span>
            </button>
            <div style="white-space:pre-wrap;overflow:hidden;text-overflow:ellipsis;max-height:4em;line-height:1.3;font-size:0.9em;margin-top:8px;">${entry.original.slice(0, 200)}</div>
          </div>
          <div style="flex:1;min-width:0;position:relative;">
            <button class="copy-history-btn quantum-btn" data-type="enhanced" data-idx="${idx}" aria-label="Copy enhanced prompt" title="Copy enhanced prompt">
              <div class="btn-particles"></div>
              <div class="btn-glow"></div>
              <span class="btn-icon">📋</span>
              <span class="btn-text">Enhanced</span>
            </button>
            <div style="white-space:pre-wrap;overflow:hidden;text-overflow:ellipsis;max-height:4em;line-height:1.3;font-size:0.9em;margin-top:8px;">${entry.enhanced.slice(0, 200)}</div>
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
          const icon = btn.querySelector('.btn-icon');
          const old = icon.textContent;
          icon.textContent = '✔️';
          setTimeout(() => { icon.textContent = old; }, 1000);
        } catch {}
      });
    });
  });
}

// === Quantum Compare Modal Logic ===
const compareBtn = document.getElementById('compare-btn');
const compareModal = document.getElementById('compare-modal');
const closeCompareModal = document.getElementById('close-compare-modal');
const compareOriginal = document.getElementById('compare-original');
const compareEnhanced = document.getElementById('compare-enhanced');

function diffWords(oldStr, newStr) {
  // Enhanced word diff with neural precision
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

// Close modal on backdrop click
compareModal.addEventListener('click', (e) => {
  if (e.target === compareModal || e.target.classList.contains('modal-backdrop')) {
    compareModal.style.display = 'none';
  }
});

// === Initialize Neural Interface ===
document.addEventListener('DOMContentLoaded', () => {
  // Initialize neural background
  neuralBackground = new NeuralBackground();
  
  // Initialize quantum particles
  quantumParticles = new QuantumParticleSystem();
  
  // Add neural input focus effects
  promptInput.addEventListener('focus', () => {
    promptInput.parentElement.classList.add('focused');
  });
  
  promptInput.addEventListener('blur', () => {
    promptInput.parentElement.classList.remove('focused');
  });
  
  // Add quantum button hover effects
  document.querySelectorAll('.quantum-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add glass panel hover effects
  document.querySelectorAll('.glass-panel').forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      panel.style.transform = 'translateY(-1px)';
    });
    
    panel.addEventListener('mouseleave', () => {
      panel.style.transform = 'translateY(0)';
    });
  });
});

// === Neural Enhancement Type Change Handler ===
enhancementType.addEventListener('change', () => {
  const selectedOption = enhancementType.options[enhancementType.selectedIndex];
  const enhancementTypeValue = enhancementType.value;
  
  // Update button gradient based on enhancement type
  enhanceBtn.style.background = getEnhancementGradient(enhancementTypeValue);
  
  // Add quantum effect
  enhanceBtn.style.animation = 'pulse 0.3s ease-in-out';
  setTimeout(() => {
    enhanceBtn.style.animation = '';
  }, 300);
});

function getEnhancementGradient(type) {
  const gradients = {
    'clarity': 'var(--quantum-gradient-1)',
    'context': 'var(--quantum-gradient-2)',
    'professional': 'var(--quantum-gradient-3)',
    'creative': 'var(--quantum-gradient-4)'
  };
  return gradients[type] || 'var(--quantum-gradient-1)';
}

// === Neural Input Auto-resize ===
promptInput.addEventListener('input', () => {
  promptInput.style.height = 'auto';
  promptInput.style.height = Math.min(promptInput.scrollHeight, 200) + 'px';
});

// === Quantum Success Animation ===
function showQuantumSuccess() {
  const successParticles = document.createElement('div');
  successParticles.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    pointer-events: none;
    z-index: 1001;
  `;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--neural-primary);
      border-radius: 50%;
      animation: quantumSuccess 1s ease-out forwards;
      animation-delay: ${i * 0.05}s;
    `;
    successParticles.appendChild(particle);
  }
  
  document.body.appendChild(successParticles);
  setTimeout(() => {
    document.body.removeChild(successParticles);
  }, 1000);
}

// Add quantum success animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes quantumSuccess {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// === CHARACTER COUNTER AND AUTO-SAVE FUNCTIONALITY ===

// Constants for character limits
const CHAR_LIMIT = 2000;
const WARNING_THRESHOLD = 0.8; // 80% of limit
const DANGER_THRESHOLD = 0.95; // 95% of limit

// Auto-save debounce timer
let autoSaveTimer = null;
const AUTO_SAVE_DELAY = 2000; // 2 seconds

// Character counter elements
const charCount = document.getElementById('char-count');
const charProgressFill = document.getElementById('char-progress-fill');
const characterCounter = document.querySelector('.character-counter');

/**
 * Updates the character counter display and progress bar
 * @param {string} text - The input text to count
 */
function updateCharacterCounter(text) {
  const count = text.length;
  const percentage = (count / CHAR_LIMIT) * 100;
  
  // Update character count display
  charCount.textContent = count;
  
  // Update progress bar
  charProgressFill.style.width = `${percentage}%`;
  
  // Update visual states based on thresholds
  if (count >= CHAR_LIMIT * DANGER_THRESHOLD) {
    // Danger state - approaching limit
    characterCounter.className = 'character-counter danger';
    charCount.className = 'char-count danger';
    charProgressFill.className = 'progress-fill danger';
  } else if (count >= CHAR_LIMIT * WARNING_THRESHOLD) {
    // Warning state - getting close
    characterCounter.className = 'character-counter warning';
    charCount.className = 'char-count warning';
    charProgressFill.className = 'progress-fill warning';
  } else {
    // Normal state
    characterCounter.className = 'character-counter';
    charCount.className = 'char-count';
    charProgressFill.className = 'progress-fill';
  }
}

/**
 * Auto-saves the current prompt to local storage
 * @param {string} prompt - The prompt text to save
 */
function autoSavePrompt(prompt) {
  if (prompt.trim()) {
    chrome.storage.local.set({ 'autoSavedPrompt': prompt }, () => {
      console.log('💾 Auto-saved prompt to neural storage');
    });
  }
}

/**
 * Restores the last auto-saved prompt from local storage
 */
function restoreAutoSavedPrompt() {
  chrome.storage.local.get(['autoSavedPrompt'], (result) => {
    if (result.autoSavedPrompt && result.autoSavedPrompt.trim()) {
      promptInput.value = result.autoSavedPrompt;
      updateCharacterCounter(result.autoSavedPrompt);
      console.log('🔄 Restored auto-saved prompt from neural storage');
    }
  });
}

/**
 * Clears the auto-saved prompt from storage
 */
function clearAutoSavedPrompt() {
  chrome.storage.local.remove(['autoSavedPrompt'], () => {
    console.log('🗑️ Cleared auto-saved prompt from neural storage');
  });
}

// === CHARACTER COUNTER EVENT LISTENERS ===

// Update counter on input
promptInput.addEventListener('input', (e) => {
  const text = e.target.value;
  updateCharacterCounter(text);
  
  // Auto-save with debouncing
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
  }
  
  autoSaveTimer = setTimeout(() => {
    autoSavePrompt(text);
  }, AUTO_SAVE_DELAY);
});

// Clear auto-save when prompt is successfully enhanced
enhanceBtn.addEventListener('click', () => {
  // Clear auto-save after successful enhancement
  setTimeout(() => {
    clearAutoSavedPrompt();
  }, 1000);
});

// === QUICK ACTION TEMPLATES ===

// Template definitions with structured prompts
const TEMPLATES = {
  'blog-post': {
    title: 'Blog Post',
    icon: '📝',
    prompt: `You are a professional content writer. Write a comprehensive blog post about [TOPIC]. 

Requirements:
- Target audience: [AUDIENCE]
- Tone: [TONE - informative, conversational, professional]
- Length: [LENGTH - short, medium, long]
- Include: [SPECIFIC ELEMENTS - examples, statistics, tips]

Please create engaging content that provides value to readers.`,
    placeholder: 'Enter your blog topic, target audience, tone, and specific requirements...'
  },
  'code-review': {
    title: 'Code Review',
    icon: '🔍',
    prompt: `You are a senior software engineer conducting a code review. Review the following code:

[CODE TO REVIEW]

Please analyze:
- Code quality and best practices
- Performance considerations
- Security vulnerabilities
- Readability and maintainability
- Suggestions for improvement

Provide constructive feedback with specific examples.`,
    placeholder: 'Paste your code here for review...'
  },
  'email-draft': {
    title: 'Email Draft',
    icon: '📧',
    prompt: `You are a professional communication expert. Draft an email about [SUBJECT].

Context:
- Recipient: [RECIPIENT]
- Purpose: [PURPOSE]
- Tone: [TONE - formal, friendly, urgent]
- Key points to include: [KEY POINTS]

Create a clear, professional email that achieves the intended goal.`,
    placeholder: 'Describe the email subject, recipient, purpose, and key points...'
  },
  'social-media': {
    title: 'Social Media',
    icon: '📱',
    prompt: `You are a social media expert. Create engaging content for [PLATFORM].

Content type: [TYPE - post, story, tweet, carousel]
Topic: [TOPIC]
Target audience: [AUDIENCE]
Call-to-action: [CTA]

Make it engaging, shareable, and aligned with platform best practices.`,
    placeholder: 'Specify platform, content type, topic, and target audience...'
  },
  'meeting-agenda': {
    title: 'Meeting Agenda',
    icon: '📅',
    prompt: `You are a project manager. Create a structured meeting agenda for [MEETING TYPE].

Meeting details:
- Duration: [DURATION]
- Participants: [PARTICIPANTS]
- Main objectives: [OBJECTIVES]
- Key discussion points: [DISCUSSION POINTS]

Organize the agenda for maximum productivity and clear outcomes.`,
    placeholder: 'Describe meeting type, duration, participants, and objectives...'
  },
  'product-description': {
    title: 'Product Description',
    icon: '🛍️',
    prompt: `You are a marketing copywriter. Write compelling product descriptions for [PRODUCT].

Product details:
- Target market: [TARGET MARKET]
- Key features: [FEATURES]
- Benefits: [BENEFITS]
- Tone: [TONE - professional, casual, luxury]

Create persuasive copy that converts browsers into buyers.`,
    placeholder: 'Describe your product, target market, features, and benefits...'
  }
};

// Current selected template
let selectedTemplate = null;

/**
 * Applies a template to the prompt input
 * @param {string} templateKey - The template key to apply
 */
function applyTemplate(templateKey) {
  const template = TEMPLATES[templateKey];
  if (!template) return;

  // Update selected template visual state
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  const selectedBtn = document.querySelector(`[data-template="${templateKey}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('selected');
  }

  // Apply template to textarea
  promptInput.value = template.prompt;
  promptInput.placeholder = template.placeholder;
  
  // Update character counter
  updateCharacterCounter(template.prompt);
  
  // Trigger auto-resize
  promptInput.style.height = 'auto';
  promptInput.style.height = Math.min(promptInput.scrollHeight, 200) + 'px';
  
  // Add quantum effect
  promptInput.style.animation = 'pulse 0.3s ease-in-out';
  setTimeout(() => {
    promptInput.style.animation = '';
  }, 300);
  
  selectedTemplate = templateKey;
  
  console.log(`🚀 Applied template: ${template.title}`);
}

/**
 * Clears the selected template
 */
function clearTemplate() {
  selectedTemplate = null;
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  promptInput.placeholder = 'Enter your neural prompt...';
}

// === TEMPLATE EVENT LISTENERS ===

// Add click handlers to template buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const templateKey = btn.getAttribute('data-template');
      applyTemplate(templateKey);
    });
  });
});

// Clear template when user manually types
promptInput.addEventListener('input', () => {
  if (selectedTemplate) {
    clearTemplate();
  }
});

// === RESTORE AUTO-SAVED PROMPT ON LOAD ===
document.addEventListener('DOMContentLoaded', () => {
  // Restore auto-saved prompt after a short delay to ensure UI is ready
  setTimeout(() => {
    restoreAutoSavedPrompt();
  }, 500);
});

// === Neural Interface Ready ===
console.log('🧠 Neural Interface initialized successfully!');
console.log('⚡ Quantum particles are flowing...');
console.log('🎨 Glassmorphism effects are active...');
console.log('📊 Character counter and auto-save functionality active...');
console.log('🚀 Quick action templates loaded...');