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
        y = (orientation === 'landscape') ? device.x : device.y;
      
    var xhr = new XMLHttpRequest(); 
    
    xhr.onreadystatechange = function () {
      // test for SAMEORIGIN
      var xfopts = this.getResponseHeader('x-frame-options');
      xfopts = (typeof xfopts === 'string') ? xfopts.toUpperCase() : null;
      
      if (xfopts === 'SAMEORIGIN' || xfopts === 'DENY') {
        url = 'error-x-frame-options.html';
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
    };
    
    xhr.open('GET', url, true);
    xhr.send();
  }


  chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.extension.isAllowedFileSchemeAccess(function (isAllowedAccess) {
      var devices = [],
        url = message.url,
        localFile = /file:\/\//,
        i, len;

      if (localFile.test(url) && !isAllowedAccess) {
        url = 'error-file-url.html';
      }

      if ('devices' in message) {
        devices = message.devices;
        
        for (i = 0, len = devices.length; i < len; i++) {
          constructDevice(devices[i], url, 'portrait');
          constructDevice(devices[i], url, 'landscape');
        }
      
      } else { 
        // update all iframes
        devices = Array.prototype.slice.call(document.getElementsByTagName('iframe'));
        devices.forEach(function (iframe) {
          iframe.src = url;
        });
      }
    });
  });
})();
