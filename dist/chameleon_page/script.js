// Chameleon by Stefan Ritter
// MIT License
// https://github.com/stefanRitter/chameleon

// script.js:
// 1. get page url (test against local file access and x-frame-options)
// 2. construct devices' names and viewport sizes from options
// 3. insert devices into portrait and landscape sections
// 4. refresh on request


(function () {
  'use strict';

  $('.js-toggleOrientation').on('click', function (e) {
    e.preventDefault();
    $('.js-toggleOrientation').toggleClass('active');
  });

  $('.js-optionsPage').on('click', function (e) {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  $('.js-helpbutton').on('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'mailto:stefan@stefanritter.com?subject=Chameleon Help' }, function(tab) {
        setTimeout(function() {
            chrome.tabs.remove(tab.id);
        }, 500);
    });
  });


  function constructDevice (device, url, orientation) {
    var deviceTemplate = '<div class="device"><div class="nav-bar"/><div class="top-bar"/><iframe></iframe><div class="bottom-bar" /><span class="button"></span><span class="title"></span></div>',
        $newDevice = $(deviceTemplate),
        x = parseInt((orientation === 'landscape') ? device.y : device.x, 10),
        y = parseInt((orientation === 'landscape') ? device.x : device.y, 10),
        $section = $('.' + orientation);

    $newDevice
      .addClass(device.type + '-' + orientation)
      .css({
        width: x,
        height: y
      })
      .find('iframe')
      .attr({
        src: url,
        height: y - (20+44+(device.type === 'ios' ? 44 : 0))
      })
      .siblings('.title')
      .text(device.title);

    $newDevice
      .find('.topbar')
      .attr({
        width: x
      })

    $section.append($newDevice);

    return x;
  }


  chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    chrome.extension.isAllowedFileSchemeAccess(function (isAllowedAccess) {

      var devices = message.devices || [],
          url = message.url,
          localFile = /file:\/\//,
          chromeUri = /chrome:\/\//,
          xhr = new XMLHttpRequest(),
          i, len;

      if ((localFile.test(url) && !isAllowedAccess) || chromeUri.test(url))  {
        // show error if we don't have acces to local files
        url = 'error-file-url.html';
      }

      xhr.onload = function () {
        // show error if we can't display this url in an iframe
        var xfopts = this.getResponseHeader('x-frame-options'),
            landscapeWidth = 25,
            portraitWidth = 25;

        var $sectionLandscape = $('.landscape'),
            $sectionPortrait = $('.portrait');

        xfopts = (typeof xfopts === 'string') ? xfopts.toUpperCase() : null;
        if (xfopts === 'SAMEORIGIN' || xfopts === 'DENY') {
          url = 'error-x-frame-options.html';
        }

        if (devices.length > 0) {
          for (i = 0, len = devices.length; i < len; i++) {
            portraitWidth += 25;
            landscapeWidth += 25;
            portraitWidth += constructDevice(devices[i], url, 'portrait');
            landscapeWidth += constructDevice(devices[i], url, 'landscape');
          }

          $sectionLandscape
            .css({
              width: landscapeWidth + 200 + 'px'
            });
          $sectionPortrait
            .css({
              width: portraitWidth + 60 + 'px'
            });

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
