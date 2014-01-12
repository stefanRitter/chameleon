// Cameleon v0.0.1 by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/cameleon

// background.js:
// 1. opens a new tab
// 2. sends page url and devices options
// 3. listens for and sends refresh messages


var cameleonTab = {},
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


chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('cameleon.html')}, function (newTab) {
    cameleonTab = newTab;
    chrome.tabs.sendMessage(cameleonTab.id, {
      url: tab.url,
      devices: devices
    }, function (response) {});
  });
});
