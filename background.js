// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings
  chrome.storage.sync.get(['subtitlesEnabled', 'language'], (result) => {
    if (!result.hasOwnProperty('subtitlesEnabled')) {
      chrome.storage.sync.set({ subtitlesEnabled: false });
    }
    if (!result.hasOwnProperty('language')) {
      chrome.storage.sync.set({ language: 'en' });
    }
  });
});