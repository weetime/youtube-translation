document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleSubtitles');
  const languageSelect = document.getElementById('languageSelect');
  const status = document.getElementById('status');
  const videoTitle = document.getElementById('videoTitle');
  const subtitleStatus = document.getElementById('subtitleStatus');
  const openSettingsLink = document.getElementById('openSettings');
  const translationModeDisplay = document.getElementById('translationModeDisplay');

  // 加载设置
  chrome.storage.sync.get(['subtitlesEnabled', 'language', 'translationMode', 'baiduAppId', 'baiduSecretKey'], function(result) {
    if (result.subtitlesEnabled) {
      toggleButton.textContent = 'Disable Subtitles';
      toggleButton.classList.add('active');
    }
    if (result.language) {
      languageSelect.value = result.language;
    }
    
    // 显示翻译模式
    const mode = result.translationMode || 'simple';
    if (mode === 'simple') {
      translationModeDisplay.textContent = '简单翻译';
    } else if (mode === 'baidu') {
      translationModeDisplay.textContent = '百度翻译 API';
    }
  });

  // 获取当前标签页信息
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

  // 切换字幕
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

  // 更改语言
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
  
  // 打开设置页面
  openSettingsLink.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  // 显示状态消息
  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
    status.style.display = 'block';
    
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
});