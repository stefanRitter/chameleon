// Chameleon by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/chameleon

// background.js:
// 1. opens a new tab
// 2. sends page url and devices options
// 3. listens for updates and sends refresh messages


chrome.browserAction.onClicked.addListener(function (tab) {
  'use strict';

  var chameleonTab = {id: 0},
      originalTab = tab,
      defaultDevices = [
      {
        type: 'ios',
        title: 'iPhone 5',
        x: 320,
        y: 568
      },
      {
        type: 'android',
        title: 'HTC one',
        x: 360,
        y: 640
      },
      {
        type: 'ios',
        title: 'iPhone 7+',
        x: 414,
        y: 736
      },
      {
        type: 'ios',
        title: 'iPad mini',
        x: 768,
        y: 1024
      }];


  if (!localStorage['chameleon_devices_v3']) {
    localStorage.removeItem('chameleon_devices');
    localStorage.removeItem('chameleon_devices_v2');
    localStorage['chameleon_devices_v3'] = JSON.stringify(defaultDevices);
  }


  chrome.tabs.create({'url': chrome.extension.getURL('chameleon_page/chameleon.html')}, function (newTab) {
    var devices = JSON.parse(localStorage['chameleon_devices_v3']);

    chameleonTab = newTab;
    setTimeout( function () {
      chrome.tabs.sendMessage(chameleonTab.id, {
        url: tab.url,
        devices: devices
      }, function (response) {});
    }, 500);
  });


  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var updateIframes = function () {
      chrome.tabs.sendMessage(chameleonTab.id, {
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
