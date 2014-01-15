// Cameleon v0.0.1 by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/cameleon

// script.js:
// 1. get page url
// 2. construct devices' names and viewport sizes from options
// 3. insert devices into portrait and landscape sections
// 4. refresh on request


(function () {
  'use strict';

  function constructDevice(device, url, orientation) {
    var deviceTemplate = '<div class="device"><iframe></iframe><br><span class="title"></span></div>',
        $newDevice = $(deviceTemplate),
        x = (orientation === 'landscape') ? device.y : device.x,
        y = (orientation === 'landscape') ? device.x : device.y,
        localFile = /file:\/\//;

    if (localFile.test(url)) {
      url = 'error.html';
    }

    $newDevice
      .find('iframe')
      .attr({
        src: url,
        width: x,
        height: y
      })
      .addClass(device.type + '-' + orientation)
      .siblings('.title')
      .text(device.title);
    
    $('.' + orientation).append($newDevice);
  }


  chrome.extension.onMessage.addListener(function (message, sender, sendResponse){
    var devices = [],
        url = '',
        i, len;

    if ('devices' in message) {
      devices = message.devices;
      url = message.url;
      
      for (i = 0, len = devices.length; i < len; i++) {
        constructDevice(devices[i], url, 'portrait');
        constructDevice(devices[i], url, 'landscape');
      }
    
    } else { // reload all iframes
      url = message.url;
      $('iframe').each(function (index) {
        this.src = url;
      });
    }
  });
})();
