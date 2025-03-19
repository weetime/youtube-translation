document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleSubtitles');
  const languageSelect = document.getElementById('languageSelect');
  const status = document.getElementById('status');
  const videoTitle = document.getElementById('videoTitle');
  const subtitleStatus = document.getElementById('subtitleStatus');
  const openSettingsLink = document.getElementById('openSettings');
  const translationModeDisplay = document.getElementById('translationModeDisplay');

  // Load settings
  chrome.storage.sync.get(['subtitlesEnabled', 'language', 'translationMode', 'baiduAppId', 'baiduSecretKey'], function(result) {
    if (result.subtitlesEnabled) {
      toggleButton.textContent = 'Disable Subtitles';
      toggleButton.classList.add('active');
    }
    if (result.language) {
      languageSelect.value = result.language;
    }
    
    // Display translation mode
    const mode = result.translationMode || 'simple';
    if (mode === 'simple') {
      translationModeDisplay.textContent = 'Simple Translation';
    } else if (mode === 'baidu') {
      translationModeDisplay.textContent = 'Baidu Translation API';
    }
  });

  // Get current tab info
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    if (currentTab.url && currentTab.url.includes('youtube.com/watch')) {
      videoTitle.textContent = currentTab.title.replace(' - YouTube', '');
      subtitleStatus.textContent = 'Ready';
    } else {
      videoTitle.textContent = 'Not a YouTube video';
      subtitleStatus.textContent = 'N/A';
      toggleButton.disabled = true;
      languageSelect.disabled = true;
    }
  });

  // Toggle subtitles
  toggleButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleSubtitles'
      }, function(response) {
        if (response && response.success) {
          const enabled = response.enabled;
          toggleButton.textContent = enabled ? 'Disable Subtitles' : 'Enable Subtitles';
          toggleButton.classList.toggle('active', enabled);
          chrome.storage.sync.set({ subtitlesEnabled: enabled });
          
          showStatus(enabled ? 'Subtitles enabled' : 'Subtitles disabled', 'success');
        } else {
          showStatus('Failed to toggle subtitles', 'error');
        }
      });
    });
  });

  // Change language
  languageSelect.addEventListener('change', function() {
    const language = languageSelect.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'changeLanguage',
        language: language
      }, function(response) {
        if (response && response.success) {
          chrome.storage.sync.set({ language: language });
          showStatus(`Language changed to ${languageSelect.options[languageSelect.selectedIndex].text}`, 'success');
        } else {
          showStatus('Failed to change language', 'error');
        }
      });
    });
  });
  
  // Open settings page
  openSettingsLink.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  // Show status message
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
});