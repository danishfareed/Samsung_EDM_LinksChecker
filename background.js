chrome.storage.sync.get('enableInspect', function (data) {
    const enableInspect = data.enableInspect !== undefined ? data.enableInspect : false;
    if (enableInspect) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { enableInspect: true });
      });
    }
  });
  
  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'sync' && changes.enableInspect !== undefined) {
      const enableInspect = changes.enableInspect.newValue;
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, { enableInspect: enableInspect });
      });
    }
  });
  