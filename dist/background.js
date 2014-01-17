// Cameleon v0.0.1 by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/cameleon

// background.js:
// 1. opens a new tab
// 2. sends page url and devices options
// 3. listens for updates and sends refresh messages


chrome.browserAction.onClicked.addListener(function (tab) {
  var cameleonTab = {id: 0},
      originalTab = tab,
      devices = [{
        type: 'ios',
        title: 'iPhone 4',
        x: 320,
        y: 480
      },
      {
        type: 'ios',
        title: 'iPhone 5',
        x: 320,
        y: 568
      }];


  chrome.tabs.create({'url': chrome.extension.getURL('cameleon.html')}, function (newTab) {
    cameleonTab = newTab;
    chrome.tabs.sendMessage(cameleonTab.id, {
      url: tab.url,
      devices: devices
    }, function (response) {});
  });


  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var updateIframes = function () {
      chrome.tabs.sendMessage(cameleonTab.id, {
        update: true,
        url: originalTab.url
      }, function (response) {});
    };
    
    if (tab.id === originalTab.id) {
      
      if ('url' in changeInfo) {
        originalTab.url = changeInfo.url;
        updateIframes();
      } else if ('status' in changeInfo && changeInfo.status === 'loading') {
        updateIframes();
      }
    }
  });
});

