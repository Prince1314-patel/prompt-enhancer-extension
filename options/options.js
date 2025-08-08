// === NEURAL OPTIONS JAVASCRIPT ===

// Quantum Particle System for Options Page
class OptionsParticleSystem {
  constructor() {
    this.container = document.querySelector('.particle-system');
    this.particles = [];
    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
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

// Initialize Neural Options
let optionsParticles;

// DOM Elements
const apiKeyInput = document.getElementById('api-key');
const saveBtn = document.getElementById('save-btn');
const testBtn = document.getElementById('test-btn');
const statusDiv = document.getElementById('status');
const processingMode = document.getElementById('processing-mode');
const interfaceTheme = document.getElementById('interface-theme');
const autoEnhance = document.getElementById('auto-enhance');

// Neural Status Messages
const neuralStatusMessages = {
  success: {
    save: '🎉 Neural API key saved successfully!',
    test: '✅ Neural connection test successful!',
    delete: '🗑️ Neural API key deleted!'
  },
  error: {
    empty: '❌ Please enter a neural API key.',
    invalid: '❌ Invalid neural API key format.',
    test: '❌ Neural connection test failed.',
    save: '❌ Failed to save neural API key.'
  }
};

// === Neural API Key Management ===
saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    showNeuralStatus('error', 'empty');
    return;
  }

  // Validate API key format (basic validation)
  if (!apiKey.startsWith('gsk_')) {
    showNeuralStatus('error', 'invalid');
    return;
  }

  chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
    showNeuralStatus('success', 'save');
    addQuantumEffect(saveBtn);
  });
});

// === Neural Connection Test ===
testBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();
  
  if (!apiKey) {
    showNeuralStatus('error', 'empty');
    return;
  }

  testBtn.disabled = true;
  testBtn.innerHTML = `
    <div class="btn-particles"></div>
    <div class="btn-glow"></div>
    <span class="btn-icon">🧪</span>
    <span class="btn-text">Testing...</span>
  `;

  try {
    // Test the API key with a simple request
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      showNeuralStatus('success', 'test');
      addQuantumEffect(testBtn);
    } else {
      showNeuralStatus('error', 'test');
    }
  } catch (error) {
    showNeuralStatus('error', 'test');
  } finally {
    testBtn.disabled = false;
    testBtn.innerHTML = `
      <div class="btn-particles"></div>
      <div class="btn-glow"></div>
      <span class="btn-icon">🧪</span>
      <span class="btn-text">Test Connection</span>
    `;
  }
});

// === Neural Status Display ===
function showNeuralStatus(type, message) {
  statusDiv.textContent = neuralStatusMessages[type][message];
  statusDiv.className = `status-message ${type}`;
  
  // Add quantum animation
  statusDiv.style.animation = 'fadeInUp 0.5s ease-out';
  setTimeout(() => {
    statusDiv.style.animation = '';
  }, 500);

  // Auto-clear after 3 seconds
  setTimeout(() => {
    statusDiv.textContent = '';
    statusDiv.className = 'status-message';
  }, 3000);
}

// === Quantum Effects ===
function addQuantumEffect(element) {
  element.style.animation = 'pulse 0.3s ease-in-out';
  setTimeout(() => {
    element.style.animation = '';
  }, 300);
}

// === Advanced Settings Management ===
processingMode.addEventListener('change', () => {
  chrome.storage.sync.set({ processingMode: processingMode.value }, () => {
    addQuantumEffect(processingMode);
  });
});

interfaceTheme.addEventListener('change', () => {
  chrome.storage.sync.set({ interfaceTheme: interfaceTheme.value }, () => {
    addQuantumEffect(interfaceTheme);
  });
});

autoEnhance.addEventListener('change', () => {
  chrome.storage.sync.set({ autoEnhance: autoEnhance.checked }, () => {
    addQuantumEffect(autoEnhance);
  });
});

// === Load Neural Settings ===
function loadNeuralSettings() {
  chrome.storage.sync.get(['groqApiKey', 'processingMode', 'interfaceTheme', 'autoEnhance'], (result) => {
    if (result.groqApiKey) {
      apiKeyInput.value = result.groqApiKey;
    }
    
    if (result.processingMode) {
      processingMode.value = result.processingMode;
    }
    
    if (result.interfaceTheme) {
      interfaceTheme.value = result.interfaceTheme;
    }
    
    if (result.autoEnhance !== undefined) {
      autoEnhance.checked = result.autoEnhance;
    }
  });
}

// === Neural Input Effects ===
apiKeyInput.addEventListener('focus', () => {
  apiKeyInput.parentElement.classList.add('focused');
});

apiKeyInput.addEventListener('blur', () => {
  apiKeyInput.parentElement.classList.remove('focused');
});

// === Quantum Button Hover Effects ===
document.querySelectorAll('.quantum-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0) scale(1)';
  });
});

// === Glass Panel Hover Effects ===
document.querySelectorAll('.glass-panel').forEach(panel => {
  panel.addEventListener('mouseenter', () => {
    panel.style.transform = 'translateY(-1px)';
  });
  
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = 'translateY(0)';
  });
});

// === Neural Information Panel Effects ===
document.querySelectorAll('.info-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'translateY(-2px) scale(1.02)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.transform = 'translateY(0) scale(1)';
  });
});

// === Neural Toggle Effects ===
autoEnhance.addEventListener('change', () => {
  const toggleLabel = autoEnhance.nextElementSibling;
  if (autoEnhance.checked) {
    toggleLabel.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
      toggleLabel.style.animation = '';
    }, 300);
  }
});

// === Neural Select Effects ===
document.querySelectorAll('.neural-select').forEach(select => {
  select.addEventListener('change', () => {
    addQuantumEffect(select);
  });
});

// === Neural Success Animation ===
function showNeuralSuccess() {
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
  
  for (let i = 0; i < 15; i++) {
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

// === Initialize Neural Options ===
document.addEventListener('DOMContentLoaded', () => {
  // Initialize quantum particles
  optionsParticles = new OptionsParticleSystem();
  
  // Load neural settings
  loadNeuralSettings();
  
  // Add neural input auto-resize
  apiKeyInput.addEventListener('input', () => {
    apiKeyInput.style.height = 'auto';
    apiKeyInput.style.height = Math.min(apiKeyInput.scrollHeight, 60) + 'px';
  });
  
  // Add neural logo animation
  const logo = document.querySelector('.neural-logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'scale(1) rotate(0deg)';
    });
  }
  
  // Add neural panel entrance animations
  document.querySelectorAll('.glass-panel').forEach((panel, index) => {
    panel.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
  });
});

// === Neural Interface Ready ===
console.log('🧠 Neural Options initialized successfully!');
console.log('⚡ Quantum particles are flowing in options...');
console.log('🎨 Glassmorphism effects are active in settings...'); 