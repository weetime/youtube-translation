// 监听安装
chrome.runtime.onInstalled.addListener(() => {
  // 初始化默认设置
  chrome.storage.sync.get(['subtitlesEnabled', 'language'], (result) => {
    if (!result.hasOwnProperty('subtitlesEnabled')) {
      chrome.storage.sync.set({ subtitlesEnabled: false });
    }
    if (!result.hasOwnProperty('language')) {
      chrome.storage.sync.set({ language: 'en' });
    }
  });
});