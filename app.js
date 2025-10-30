// Application State
const state = {
  currentMode: 'text',
  sourceLanguage: 'en',
  targetLanguage: 'hi',
  isRecording: false,
  conversationHistory: [],
  isConverseRecording: false,
  converseActiveSide: null
};

// Language Data
const languages = {
  hi: { name: 'Hindi', flag: '🇮🇳' },
  en: { name: 'English', flag: '🇬🇧' },
  sa: { name: 'Sanskrit', flag: '📿' }
};

// Mode Names
const modeNames = {
  text: 'Text Translation',
  voice: 'Voice Translation',
  converse: 'Conversation Mode',
  scene: 'Scene Translation',
  browse: 'Browse Phrases'
};

// DOM Elements
const elements = {
  // Navigation
  menuButton: document.getElementById('menuButton'),
  closeButton: document.getElementById('closeButton'),
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  navMode: document.getElementById('navMode'),
  
  // Bottom Navigation
  navItems: document.querySelectorAll('.nav-item'),
  
  // Mode Containers
  textMode: document.getElementById('textMode'),
  voiceMode: document.getElementById('voiceMode'),
  converseMode: document.getElementById('converseMode'),
  sceneMode: document.getElementById('sceneMode'),
  browseMode: document.getElementById('browseMode'),
  
  // Text Mode
  sourceLanguage: document.getElementById('sourceLanguage'),
  targetLanguage: document.getElementById('targetLanguage'),
  swapButton: document.getElementById('swapButton'),
  sourceText: document.getElementById('sourceText'),
  targetText: document.getElementById('targetText'),
  sourceFlag: document.getElementById('sourceFlag'),
  targetFlag: document.getElementById('targetFlag'),
  sourceLabel: document.getElementById('sourceLabel'),
  targetLabel: document.getElementById('targetLabel'),
  copyButton: document.getElementById('copyButton'),
  shareButton: document.getElementById('shareButton'),
  speakerButton: document.getElementById('speakerButton'),
  thumbsUp: document.getElementById('thumbsUp'),
  thumbsDown: document.getElementById('thumbsDown'),
  
  // Voice Mode
  voiceLanguage: document.getElementById('voiceLanguage'),
  micButton: document.getElementById('micButton'),
  recordingIndicator: document.getElementById('recordingIndicator'),
  voiceResult: document.getElementById('voiceResult'),
  voiceTranslation: document.getElementById('voiceTranslation'),
  
  // Converse Mode
  conversationDisplay: document.getElementById('conversationDisplay'),
  converseMicLeft: document.getElementById('converseMicLeft'),
  converseMicRight: document.getElementById('converseMicRight'),
  
  // Toast
  toast: document.getElementById('toast'),
  
  // Browse Mode
  searchInput: document.getElementById('searchInput'),
  filterChips: document.querySelectorAll('.filter-chip')
};

// Initialize Application
function init() {
  setupEventListeners();
  updateLanguageDisplay();
  switchMode('text');
}

// Event Listeners
function setupEventListeners() {
  // Menu
  elements.menuButton.addEventListener('click', openSidebar);
  elements.closeButton.addEventListener('click', closeSidebar);
  elements.sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Bottom Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const mode = item.getAttribute('data-mode');
      switchMode(mode);
    });
  });
  
  // Text Mode
  elements.sourceLanguage.addEventListener('change', handleSourceLanguageChange);
  elements.targetLanguage.addEventListener('change', handleTargetLanguageChange);
  elements.swapButton.addEventListener('click', swapLanguages);
  elements.sourceText.addEventListener('input', handleTextInput);
  elements.copyButton.addEventListener('click', copyTranslation);
  elements.shareButton.addEventListener('click', shareTranslation);
  elements.speakerButton.addEventListener('click', speakTranslation);
  elements.thumbsUp.addEventListener('click', () => handleFeedback('up'));
  elements.thumbsDown.addEventListener('click', () => handleFeedback('down'));
  
  // Voice Mode
  elements.micButton.addEventListener('click', toggleRecording);
  
  // Converse Mode
  elements.converseMicLeft.addEventListener('click', () => toggleConverseRecording('left'));
  elements.converseMicRight.addEventListener('click', () => toggleConverseRecording('right'));
  
  // Browse Mode
  elements.filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
  
  // Phrase speaker buttons
  document.querySelectorAll('.phrase-speaker').forEach(button => {
    button.addEventListener('click', () => {
      showToast('Playing phrase...');
    });
  });
}

// Sidebar Functions
function openSidebar() {
  elements.sidebar.classList.add('active');
  elements.sidebarOverlay.classList.add('active');
}

function closeSidebar() {
  elements.sidebar.classList.remove('active');
  elements.sidebarOverlay.classList.remove('active');
}

// Mode Switching
function switchMode(mode) {
  state.currentMode = mode;
  
  // Update nav items
  elements.navItems.forEach(item => {
    if (item.getAttribute('data-mode') === mode) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update mode containers
  const containers = [elements.textMode, elements.voiceMode, elements.converseMode, elements.sceneMode, elements.browseMode];
  containers.forEach(container => container.classList.remove('active'));
  
  switch(mode) {
    case 'text':
      elements.textMode.classList.add('active');
      break;
    case 'voice':
      elements.voiceMode.classList.add('active');
      break;
    case 'converse':
      elements.converseMode.classList.add('active');
      break;
    case 'scene':
      elements.sceneMode.classList.add('active');
      break;
    case 'browse':
      elements.browseMode.classList.add('active');
      break;
  }
  
  // Update nav mode text
  elements.navMode.textContent = modeNames[mode];
}

// Text Mode Functions
function handleSourceLanguageChange() {
  state.sourceLanguage = elements.sourceLanguage.value;
  updateLanguageDisplay();
  translateText();
}

function handleTargetLanguageChange() {
  state.targetLanguage = elements.targetLanguage.value;
  updateLanguageDisplay();
  translateText();
}

function updateLanguageDisplay() {
  const sourceLang = languages[state.sourceLanguage];
  const targetLang = languages[state.targetLanguage];
  
  elements.sourceFlag.textContent = sourceLang.flag;
  elements.targetFlag.textContent = targetLang.flag;
  elements.sourceLabel.textContent = sourceLang.name;
  elements.targetLabel.textContent = targetLang.name;
}

function swapLanguages() {
  // Add rotation animation
  elements.swapButton.classList.add('rotating');
  setTimeout(() => {
    elements.swapButton.classList.remove('rotating');
  }, 500);
  
  // Swap language values
  const temp = state.sourceLanguage;
  state.sourceLanguage = state.targetLanguage;
  state.targetLanguage = temp;
  
  // Update UI
  elements.sourceLanguage.value = state.sourceLanguage;
  elements.targetLanguage.value = state.targetLanguage;
  updateLanguageDisplay();
  
  // Swap text content
  const sourceText = elements.sourceText.value;
  const targetText = elements.targetText.textContent;
  
  if (targetText && !targetText.includes('Translation will appear')) {
    elements.sourceText.value = targetText;
    translateText();
  }
  
  showToast('Languages swapped');
}

function handleTextInput() {
  const text = elements.sourceText.value.trim();
  
  if (text) {
    // Simulate translation with a delay
    clearTimeout(window.translationTimeout);
    window.translationTimeout = setTimeout(() => {
      translateText();
    }, 500);
  } else {
    elements.targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
  }
}

function translateText() {
  const text = elements.sourceText.value.trim();
  
  if (!text) {
    elements.targetText.innerHTML = '<span class="placeholder-text">Translation will appear here...</span>';
    return;
  }
  
  // Simulate translation (in real app, this would call an API)
  const translations = {
    'en-hi': {
      'hello': 'नमस्ते',
      'thank you': 'धन्यवाद',
      'good morning': 'सुप्रभात',
      'how are you': 'आप कैसे हैं',
      'goodbye': 'अलविदा'
    },
    'hi-en': {
      'नमस्ते': 'Hello',
      'धन्यवाद': 'Thank you',
      'सुप्रभात': 'Good morning',
      'आप कैसे हैं': 'How are you',
      'अलविदा': 'Goodbye'
    }
  };
  
  const key = `${state.sourceLanguage}-${state.targetLanguage}`;
  const translationMap = translations[key] || {};
  const lowerText = text.toLowerCase();
  const translated = translationMap[lowerText] || `[Translated: ${text}]`;
  
  elements.targetText.textContent = translated;
}

function copyTranslation() {
  const text = elements.targetText.textContent;
  
  if (text && !text.includes('Translation will appear')) {
    // Simulate copying (in sandboxed environment, clipboard API may not work)
    showToast('Translation copied!');
    
    // Visual feedback
    elements.copyButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      elements.copyButton.style.transform = '';
    }, 200);
  }
}

function shareTranslation() {
  const text = elements.targetText.textContent;
  
  if (text && !text.includes('Translation will appear')) {
    showToast('Sharing translation...');
    
    // Visual feedback
    elements.shareButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      elements.shareButton.style.transform = '';
    }, 200);
  }
}

function speakTranslation() {
  const text = elements.targetText.textContent;
  
  if (text && !text.includes('Translation will appear')) {
    showToast('Speaking translation...');
    
    // Visual feedback
    elements.speakerButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      elements.speakerButton.style.transform = '';
    }, 200);
  }
}

function handleFeedback(type) {
  if (type === 'up') {
    elements.thumbsUp.classList.toggle('active');
    elements.thumbsDown.classList.remove('active');
    if (elements.thumbsUp.classList.contains('active')) {
      showToast('Thank you for your feedback!');
    }
  } else {
    elements.thumbsDown.classList.toggle('active');
    elements.thumbsUp.classList.remove('active');
    if (elements.thumbsDown.classList.contains('active')) {
      showToast('Feedback received. We\'ll improve!');
    }
  }
}

// Voice Mode Functions
function toggleRecording() {
  state.isRecording = !state.isRecording;
  
  if (state.isRecording) {
    startRecording();
  } else {
    stopRecording();
  }
}

function startRecording() {
  elements.micButton.classList.add('recording');
  elements.recordingIndicator.classList.add('active');
  elements.voiceResult.innerHTML = '<span style="color: var(--secondary-emerald);">Listening...</span>';
  
  // Simulate recording for 3 seconds
  setTimeout(() => {
    if (state.isRecording) {
      stopRecording();
      simulateVoiceTranslation();
    }
  }, 3000);
}

function stopRecording() {
  state.isRecording = false;
  elements.micButton.classList.remove('recording');
  elements.recordingIndicator.classList.remove('active');
}

function simulateVoiceTranslation() {
  const samplePhrases = [
    { original: 'Hello, how are you?', translated: 'नमस्ते, आप कैसे हैं?' },
    { original: 'Good morning', translated: 'सुप्रभात' },
    { original: 'Thank you very much', translated: 'बहुत धन्यवाद' }
  ];
  
  const phrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
  
  elements.voiceResult.textContent = phrase.original;
  elements.voiceTranslation.textContent = phrase.translated;
  
  showToast('Translation complete!');
}

// Converse Mode Functions
function toggleConverseRecording(side) {
  if (state.isConverseRecording && state.converseActiveSide === side) {
    stopConverseRecording();
  } else {
    startConverseRecording(side);
  }
}

function startConverseRecording(side) {
  state.isConverseRecording = true;
  state.converseActiveSide = side;
  
  const button = side === 'left' ? elements.converseMicLeft : elements.converseMicRight;
  button.classList.add('recording');
  
  // Simulate recording for 2 seconds
  setTimeout(() => {
    if (state.isConverseRecording && state.converseActiveSide === side) {
      stopConverseRecording();
      addConversationBubble(side);
    }
  }, 2000);
}

function stopConverseRecording() {
  state.isConverseRecording = false;
  
  elements.converseMicLeft.classList.remove('recording');
  elements.converseMicRight.classList.remove('recording');
  
  state.converseActiveSide = null;
}

function addConversationBubble(side) {
  const phrases = {
    left: ['Hello!', 'How are you?', 'Nice to meet you', 'Thank you'],
    right: ['नमस्ते!', 'आप कैसे हैं?', 'आपसे मिलकर अच्छा लगा', 'धन्यवाद']
  };
  
  const text = phrases[side][Math.floor(Math.random() * phrases[side].length)];
  const language = side === 'left' ? 'English' : 'Hindi';
  
  // Remove empty state if exists
  const emptyState = elements.conversationDisplay.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  // Create bubble
  const bubble = document.createElement('div');
  bubble.className = `conversation-bubble ${side}`;
  bubble.innerHTML = `
    <div class="bubble-content">
      <div class="bubble-language">${language}</div>
      <div class="bubble-text">${text}</div>
    </div>
  `;
  
  elements.conversationDisplay.appendChild(bubble);
  elements.conversationDisplay.scrollTop = elements.conversationDisplay.scrollHeight;
  
  state.conversationHistory.push({ side, text, language });
}

// Toast Notification
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2000);
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}