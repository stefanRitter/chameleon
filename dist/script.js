// Cameleon by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/cameleon

// script.js:
// 1. get page url (test against local file access and x-frame-options)
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


  chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.extension.isAllowedFileSchemeAccess(function (isAllowedAccess) {
      var devices = message.devices || [],
          url = message.url,
          localFile = /file:\/\//,
          xhr = new XMLHttpRequest(),
          i, len;

      if (localFile.test(url) && !isAllowedAccess) {
        // show error if we don't have acces to local files
        url = 'error-file-url.html';
      }

      xhr.onload = function () {
        // show error if we can't display this url in an iframe
        var xfopts = this.getResponseHeader('x-frame-options');
        xfopts = (typeof xfopts === 'string') ? xfopts.toUpperCase() : null;
        if (xfopts === 'SAMEORIGIN' || xfopts === 'DENY') {
          url = 'error-x-frame-options.html';
        }

        if (devices.length > 0) {        
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
      };
      xhr.open('GET', url, true);
      xhr.send();
    });
  });
})();
