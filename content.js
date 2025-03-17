// 全局变量
let subtitlesEnabled = false;
let currentLanguage = 'en';
let subtitleContainer = null;
let mockSubtitles = null;
let translatedSubtitles = null;
let videoCheckInterval = null;
let containerCheckInterval = null;
let translationMode = 'simple';
let baiduAppId = '';
let baiduSecretKey = '';

// 初始化
function init() {
  console.log('YouTube Subtitle Helper: 初始化');
  
  // 加载设置
  chrome.storage.sync.get(['subtitlesEnabled', 'language', 'translationMode', 'baiduAppId', 'baiduSecretKey'], function(result) {
    subtitlesEnabled = result.subtitlesEnabled || false;
    currentLanguage = result.language || 'en';
    translationMode = result.translationMode || 'simple';
    baiduAppId = result.baiduAppId || '';
    baiduSecretKey = result.baiduSecretKey || '';
    
    console.log('加载设置:', { 
      subtitlesEnabled, 
      currentLanguage, 
      translationMode,
      hasBaiduApi: !!baiduAppId && !!baiduSecretKey
    });
    
    // 创建模拟字幕
    createMockSubtitles();
    
    // 创建字幕容器
    createSubtitleContainer();
    
    // 如果字幕已启用，显示字幕
    if (subtitlesEnabled) {
      showSubtitles();
    }
    
    // 开始检查视频
    startVideoCheck();
    
    // 开始检查字幕容器
    startContainerCheck();
  });
  
  // 监听设置变化
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync') {
      if (changes.translationMode) {
        translationMode = changes.translationMode.newValue;
        console.log('翻译模式已更改:', translationMode);
        
        // 如果字幕已启用，重新翻译
        if (subtitlesEnabled) {
          translateSubtitles();
        }
      }
      
      if (changes.baiduAppId) {
        baiduAppId = changes.baiduAppId.newValue;
      }
      
      if (changes.baiduSecretKey) {
        baiduSecretKey = changes.baiduSecretKey.newValue;
      }
    }
  });
}

// 创建字幕容器
function createSubtitleContainer() {
  // 如果容器已存在但不在文档中，移除引用
  if (subtitleContainer && !document.body.contains(subtitleContainer)) {
    subtitleContainer = null;
  }
  
  // 如果容器不存在，创建新容器
  if (!subtitleContainer) {
    subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'youtube-subtitle-helper-container';
    subtitleContainer.style.position = 'fixed';
    subtitleContainer.style.bottom = '100px';
    subtitleContainer.style.left = '50%';
    subtitleContainer.style.transform = 'translateX(-50%)';
    subtitleContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    subtitleContainer.style.color = 'white';
    subtitleContainer.style.padding = '8px 16px';
    subtitleContainer.style.borderRadius = '4px';
    subtitleContainer.style.fontSize = '18px';
    subtitleContainer.style.fontWeight = 'bold';
    subtitleContainer.style.zIndex = '9999';
    subtitleContainer.style.textAlign = 'center';
    subtitleContainer.style.maxWidth = '80%';
    subtitleContainer.style.display = 'none';
    
    document.body.appendChild(subtitleContainer);
    console.log('字幕容器已创建');
  }
}

// 开始检查字幕容器
function startContainerCheck() {
  if (containerCheckInterval) {
    clearInterval(containerCheckInterval);
  }
  
  containerCheckInterval = setInterval(() => {
    // 检查容器是否存在于文档中
    if (!subtitleContainer || !document.body.contains(subtitleContainer)) {
      console.log('字幕容器不存在或已从文档中移除，重新创建');
      createSubtitleContainer();
      
      // 如果字幕已启用，更新字幕
      if (subtitlesEnabled) {
        const video = document.querySelector('video');
        if (video) {
          updateSubtitles(video.currentTime);
        }
      }
    }
  }, 1000);
  
  console.log('字幕容器检查已启动');
}

// 创建模拟字幕
function createMockSubtitles() {
  mockSubtitles = [
    { start: 0, duration: 5, text: "Welcome to this video about Model Context Protocol" },
    { start: 5, duration: 5, text: "MCP allows AI to access your files and web searches" },
    { start: 10, duration: 5, text: "It provides a secure way to extend AI capabilities" },
    { start: 15, duration: 5, text: "Let's explore how it works and what you can do with it" },
    { start: 20, duration: 5, text: "MCP enables file access, web searches, and more" },
    { start: 25, duration: 5, text: "It's designed to be secure and privacy-focused" },
    { start: 30, duration: 5, text: "You can control what the AI can access" },
    { start: 35, duration: 5, text: "This makes AI more useful for real-world tasks" },
    { start: 40, duration: 5, text: "With MCP, AI can help you with complex tasks" },
    { start: 45, duration: 5, text: "It can search the web for information" },
    { start: 50, duration: 5, text: "It can read and analyze your documents" },
    { start: 55, duration: 5, text: "And it can help you make better decisions" },
    { start: 60, duration: 5, text: "MCP is the future of AI interaction" },
    { start: 65, duration: 5, text: "Thanks for watching this video" }
  ];
  
  translatedSubtitles = mockSubtitles;
  console.log('模拟字幕已创建');
}

// 开始检查视频
function startVideoCheck() {
  if (videoCheckInterval) {
    clearInterval(videoCheckInterval);
  }
  
  videoCheckInterval = setInterval(() => {
    const video = document.querySelector('video');
    if (video && subtitlesEnabled) {
      updateSubtitles(video.currentTime);
    }
  }, 100);
  
  console.log('视频检查已启动');
}

// 显示字幕
function showSubtitles() {
  subtitlesEnabled = true;
  
  if (currentLanguage !== 'en') {
    translateSubtitles();
  }
  
  console.log('字幕已启用');
}

// 隐藏字幕
function hideSubtitles() {
  subtitlesEnabled = false;
  
  if (subtitleContainer) {
    subtitleContainer.style.display = 'none';
  }
  
  console.log('字幕已禁用');
}

// 更新字幕
function updateSubtitles(currentTime) {
  // 确保容器存在
  if (!subtitleContainer) {
    createSubtitleContainer();
  }
  
  if (!translatedSubtitles || !subtitlesEnabled) return;
  
  // 循环播放字幕（每70秒重复一次）
  const adjustedTime = currentTime % 70;
  
  const currentSubtitle = translatedSubtitles.find(subtitle => 
    adjustedTime >= subtitle.start && 
    adjustedTime < (subtitle.start + subtitle.duration)
  );
  
  if (currentSubtitle) {
    subtitleContainer.textContent = currentSubtitle.text;
    subtitleContainer.style.display = 'block';
  } else {
    subtitleContainer.style.display = 'none';
  }
}

// 翻译字幕
async function translateSubtitles() {
  if (!mockSubtitles || currentLanguage === 'en') {
    translatedSubtitles = mockSubtitles;
    return;
  }
  
  console.log('翻译字幕为:', currentLanguage, '使用模式:', translationMode);
  
  try {
    if (translationMode === 'baidu' && baiduAppId && baiduSecretKey) {
      // 使用百度翻译 API
      translatedSubtitles = await Promise.all(
        mockSubtitles.map(async subtitle => ({
          ...subtitle,
          text: await translateWithBaiduApi(subtitle.text, currentLanguage)
        }))
      );
    } else {
      // 使用简单翻译
      translatedSubtitles = mockSubtitles.map(subtitle => ({
        ...subtitle,
        text: translateWithSimpleDict(subtitle.text, currentLanguage)
      }));
    }
  } catch (error) {
    console.error('翻译字幕失败:', error);
    // 如果翻译失败，回退到简单翻译
    translatedSubtitles = mockSubtitles.map(subtitle => ({
      ...subtitle,
      text: translateWithSimpleDict(subtitle.text, currentLanguage)
    }));
  }
}

// 使用百度翻译 API 翻译文本
async function translateWithBaiduApi(text, targetLang) {
  try {
    // 生成随机数作为 salt
    const salt = Math.random().toString(36).substr(2);
    // 生成签名
    const sign = generateSign(text, salt, baiduAppId, baiduSecretKey);
    
    // 语言代码映射
    const langMap = {
      'zh': 'zh',
      'ja': 'jp',
      'ko': 'kor',
      'es': 'spa',
      'fr': 'fra',
      'de': 'de',
      'ru': 'ru',
      'it': 'it',
      'pt': 'pt'
    };
    
    const targetLanguage = langMap[targetLang] || targetLang;
    
    // 发送翻译请求
    const response = await fetch(`https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(text)}&from=en&to=${targetLanguage}&appid=${baiduAppId}&salt=${salt}&sign=${sign}`);
    const data = await response.json();
    
    if (data.error_code) {
      throw new Error(`翻译错误: ${data.error_msg}`);
    }
    
    return data.trans_result[0].dst;
  } catch (error) {
    console.error('百度翻译 API 调用失败:', error);
    // 如果 API 调用失败，回退到简单翻译
    return translateWithSimpleDict(text, targetLang);
  }
}

// 生成百度翻译 API 签名
function generateSign(query, salt, appId, secretKey) {
  const str = appId + query + salt + secretKey;
  return md5(str);
}

// 简单的 MD5 实现（仅用于演示）
function md5(string) {
  // 实际应用中应使用真正的 MD5 库
  return Array.from(string).reduce(
    (acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0
  ).toString(16);
}

// 使用简单字典翻译文本
function translateWithSimpleDict(text, targetLang) {
  // 简单的翻译映射
  const translations = {
    'zh': {
      'welcome': '欢迎',
      'to': '到',
      'this': '这个',
      'video': '视频',
      'about': '关于',
      'model': '模型',
      'context': '上下文',
      'protocol': '协议',
      'mcp': 'MCP',
      'allows': '允许',
      'ai': '人工智能',
      'access': '访问',
      'your': '你的',
      'files': '文件',
      'and': '和',
      'web': '网络',
      'searches': '搜索',
      'it': '它',
      'provides': '提供',
      'a': '一个',
      'secure': '安全的',
      'way': '方式',
      'to': '来',
      'extend': '扩展',
      'capabilities': '能力',
      'let\'s': '让我们',
      'explore': '探索',
      'how': '如何',
      'works': '工作',
      'what': '什么',
      'you': '你',
      'can': '可以',
      'do': '做',
      'with': '用',
      'enables': '启用',
      'file': '文件',
      'more': '更多',
      'it\'s': '它是',
      'designed': '设计',
      'be': '是',
      'privacy': '隐私',
      'focused': '专注',
      'control': '控制',
      'the': '这个',
      'makes': '使',
      'more': '更',
      'useful': '有用',
      'for': '对于',
      'real': '真实',
      'world': '世界',
      'tasks': '任务',
      'thanks': '谢谢',
      'watching': '观看',
      'future': '未来',
      'interaction': '交互',
      'help': '帮助',
      'complex': '复杂',
      'search': '搜索',
      'information': '信息',
      'read': '阅读',
      'analyze': '分析',
      'documents': '文档',
      'make': '做出',
      'better': '更好的',
      'decisions': '决定'
    },
    'ja': {
      'welcome': 'ようこそ',
      'to': 'へ',
      'this': 'この',
      'video': '動画',
      'about': 'について',
      'model': 'モデル',
      'context': 'コンテキスト',
      'protocol': 'プロトコル',
      'mcp': 'MCP',
      'allows': '可能にする',
      'ai': 'AI',
      'access': 'アクセス',
      'your': 'あなたの',
      'files': 'ファイル',
      'and': 'と',
      'web': 'ウェブ',
      'searches': '検索',
      'it': 'それは',
      'provides': '提供する',
      'a': '一つの',
      'secure': '安全な',
      'way': '方法',
      'to': 'に',
      'extend': '拡張する',
      'capabilities': '能力',
      'let\'s': 'さあ',
      'explore': '探索しましょう',
      'how': 'どのように',
      'works': '動作するか',
      'what': '何が',
      'you': 'あなた',
      'can': 'できるか',
      'do': 'する',
      'with': 'で',
      'enables': '可能にする',
      'file': 'ファイル',
      'more': 'より多く',
      'it\'s': 'それは',
      'designed': '設計されている',
      'be': 'である',
      'privacy': 'プライバシー',
      'focused': '重視',
      'control': '制御',
      'the': 'その',
      'makes': 'する',
      'more': 'より',
      'useful': '役立つ',
      'for': 'のために',
      'real': '実際の',
      'world': '世界',
      'tasks': 'タスク',
      'thanks': 'ありがとう',
      'watching': '視聴',
      'future': '未来',
      'interaction': '対話',
      'help': '助ける',
      'complex': '複雑な',
      'search': '検索する',
      'information': '情報',
      'read': '読む',
      'analyze': '分析する',
      'documents': '文書',
      'make': '作る',
      'better': 'より良い',
      'decisions': '決断'
    }
  };

  // 如果目标语言不在我们的简单翻译映射中，返回原文
  if (!translations[targetLang]) {
    return `[${targetLang}] ${text}`;
  }

  // 将文本分割成单词
  const words = text.split(/\s+/);
  
  // 翻译每个单词
  const translatedWords = words.map(word => {
    // 去除标点符号进行查找
    const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    // 查找翻译
    const translation = translations[targetLang][cleanWord];
    
    // 如果找到翻译，替换原单词，否则保留原单词
    return translation || word;
  });
  
  // 将翻译后的单词重新组合成句子
  return translatedWords.join(' ');
}

// 监听消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('收到消息:', request.action);
  
  switch (request.action) {
    case 'toggleSubtitles':
      subtitlesEnabled = !subtitlesEnabled;
      
      if (subtitlesEnabled) {
        showSubtitles();
      } else {
        hideSubtitles();
      }
      
      sendResponse({ success: true, enabled: subtitlesEnabled });
      break;
      
    case 'changeLanguage':
      currentLanguage = request.language;
      
      if (subtitlesEnabled) {
        translateSubtitles();
      }
      
      sendResponse({ success: true });
      break;
      
    case 'getStatus':
      sendResponse({ status: 'Ready' });
      break;
  }
  
  return true;
});

// 页面卸载时清除定时器
window.addEventListener('beforeunload', function() {
  if (videoCheckInterval) {
    clearInterval(videoCheckInterval);
  }
  if (containerCheckInterval) {
    clearInterval(containerCheckInterval);
  }
});

// 初始化
console.log('YouTube Subtitle Helper: 内容脚本已加载');
init();