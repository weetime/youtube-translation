document.addEventListener('DOMContentLoaded', function() {
  const appIdInput = document.getElementById('appId');
  const secretKeyInput = document.getElementById('secretKey');
  const saveButton = document.getElementById('saveSettings');
  const testButton = document.getElementById('testApi');
  const statusDiv = document.getElementById('status');
  const translationModeRadios = document.getElementsByName('translationMode');
  
  // Load saved settings
  chrome.storage.sync.get(['baiduAppId', 'baiduSecretKey', 'translationMode'], function(result) {
    if (result.baiduAppId) {
      appIdInput.value = result.baiduAppId;
    }
    if (result.baiduSecretKey) {
      secretKeyInput.value = result.baiduSecretKey;
    }
    
    // Set translation mode
    const mode = result.translationMode || 'simple';
    for (const radio of translationModeRadios) {
      if (radio.value === mode) {
        radio.checked = true;
      }
    }
    
    // Enable/disable inputs based on mode
    toggleInputsBasedOnMode(mode);
  });
  
  // Save settings
  saveButton.addEventListener('click', function() {
    const appId = appIdInput.value.trim();
    const secretKey = secretKeyInput.value.trim();
    let translationMode = 'simple';
    
    // Get selected translation mode
    for (const radio of translationModeRadios) {
      if (radio.checked) {
        translationMode = radio.value;
        break;
      }
    }
    
    // If Baidu translation selected but no API info provided
    if (translationMode === 'baidu' && (!appId || !secretKey)) {
      showStatus('Please enter Baidu Translation APP ID and Secret Key', 'error');
      return;
    }
    
    // Save settings
    chrome.storage.sync.set({
      baiduAppId: appId,
      baiduSecretKey: secretKey,
      translationMode: translationMode
    }, function() {
      showStatus('Settings saved', 'success');
    });
  });
  
  // Test API
  testButton.addEventListener('click', function() {
    const appId = appIdInput.value.trim();
    const secretKey = secretKeyInput.value.trim();
    
    if (!appId || !secretKey) {
      showStatus('Please enter Baidu Translation APP ID and Secret Key', 'error');
      return;
    }
    
    showStatus('Testing API...', 'info');
    
    // Generate random number as salt
    const salt = Math.random().toString(36).substr(2);
    // Test text
    const query = 'Hello, world!';
    // Generate signature
    const sign = generateSign(query, salt, appId, secretKey);
    
    // Send test request
    fetch(`https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(query)}&from=en&to=zh&appid=${appId}&salt=${salt}&sign=${sign}`)
      .then(response => response.json())
      .then(data => {
        if (data.error_code) {
          showStatus(`API test failed: ${data.error_msg}`, 'error');
        } else {
          showStatus(`API test successful! Translation result: ${data.trans_result[0].dst}`, 'success');
        }
      })
      .catch(error => {
        showStatus(`API test failed: ${error.message}`, 'error');
      });
  });
  
  // Translation mode switch
  for (const radio of translationModeRadios) {
    radio.addEventListener('change', function() {
      toggleInputsBasedOnMode(this.value);
    });
  }
  
  // Enable/disable inputs based on translation mode
  function toggleInputsBasedOnMode(mode) {
    const disabled = mode !== 'baidu';
    appIdInput.disabled = disabled;
    secretKeyInput.disabled = disabled;
    testButton.disabled = disabled;
  }
  
  // Show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    if (type !== 'info') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
  
  // Generate Baidu translation API signature
  function generateSign(query, salt, appId, secretKey) {
    // Note: In an actual application, you should use an appropriate MD5 library
    // This is using a simple simulation function
    return md5(appId + query + salt + secretKey);
  }
  
  // Simple MD5 simulation function (for demonstration only)
  function md5(string) {
    // In an actual application, you should use a real MD5 library
    return Array.from(string).reduce(
      (acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0
    ).toString(16);
  }
});