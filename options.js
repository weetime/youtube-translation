document.addEventListener('DOMContentLoaded', function() {
  const appIdInput = document.getElementById('appId');
  const secretKeyInput = document.getElementById('secretKey');
  const saveButton = document.getElementById('saveSettings');
  const testButton = document.getElementById('testApi');
  const statusDiv = document.getElementById('status');
  const translationModeRadios = document.getElementsByName('translationMode');
  
  // 加载保存的设置
  chrome.storage.sync.get(['baiduAppId', 'baiduSecretKey', 'translationMode'], function(result) {
    if (result.baiduAppId) {
      appIdInput.value = result.baiduAppId;
    }
    if (result.baiduSecretKey) {
      secretKeyInput.value = result.baiduSecretKey;
    }
    
    // 设置翻译模式
    const mode = result.translationMode || 'simple';
    for (const radio of translationModeRadios) {
      if (radio.value === mode) {
        radio.checked = true;
      }
    }
    
    // 根据模式启用/禁用输入框
    toggleInputsBasedOnMode(mode);
  });
  
  // 保存设置
  saveButton.addEventListener('click', function() {
    const appId = appIdInput.value.trim();
    const secretKey = secretKeyInput.value.trim();
    let translationMode = 'simple';
    
    // 获取选中的翻译模式
    for (const radio of translationModeRadios) {
      if (radio.checked) {
        translationMode = radio.value;
        break;
      }
    }
    
    // 如果选择了百度翻译但没有填写 API 信息
    if (translationMode === 'baidu' && (!appId || !secretKey)) {
      showStatus('请填写百度翻译 APP ID 和密钥', 'error');
      return;
    }
    
    // 保存设置
    chrome.storage.sync.set({
      baiduAppId: appId,
      baiduSecretKey: secretKey,
      translationMode: translationMode
    }, function() {
      showStatus('设置已保存', 'success');
    });
  });
  
  // 测试 API
  testButton.addEventListener('click', function() {
    const appId = appIdInput.value.trim();
    const secretKey = secretKeyInput.value.trim();
    
    if (!appId || !secretKey) {
      showStatus('请填写百度翻译 APP ID 和密钥', 'error');
      return;
    }
    
    showStatus('正在测试 API...', 'info');
    
    // 生成随机数作为 salt
    const salt = Math.random().toString(36).substr(2);
    // 测试文本
    const query = 'Hello, world!';
    // 生成签名
    const sign = generateSign(query, salt, appId, secretKey);
    
    // 发送测试请求
    fetch(`https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(query)}&from=en&to=zh&appid=${appId}&salt=${salt}&sign=${sign}`)
      .then(response => response.json())
      .then(data => {
        if (data.error_code) {
          showStatus(`API 测试失败: ${data.error_msg}`, 'error');
        } else {
          showStatus(`API 测试成功! 翻译结果: ${data.trans_result[0].dst}`, 'success');
        }
      })
      .catch(error => {
        showStatus(`API 测试失败: ${error.message}`, 'error');
      });
  });
  
  // 翻译模式切换
  for (const radio of translationModeRadios) {
    radio.addEventListener('change', function() {
      toggleInputsBasedOnMode(this.value);
    });
  }
  
  // 根据翻译模式启用/禁用输入框
  function toggleInputsBasedOnMode(mode) {
    const disabled = mode !== 'baidu';
    appIdInput.disabled = disabled;
    secretKeyInput.disabled = disabled;
    testButton.disabled = disabled;
  }
  
  // 显示状态消息
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    if (type !== 'info') {
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 5000);
    }
  }
  
  // 生成百度翻译 API 签名
  function generateSign(query, salt, appId, secretKey) {
    // 注意：在实际应用中，应该使用适当的 MD5 库
    // 这里使用一个简单的模拟函数
    return md5(appId + query + salt + secretKey);
  }
  
  // 简单的 MD5 模拟函数（仅用于演示）
  function md5(string) {
    // 实际应用中应使用真正的 MD5 库
    return Array.from(string).reduce(
      (acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0
    ).toString(16);
  }
});