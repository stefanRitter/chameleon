
(function () {
  'use strict';

  var devices = document.getElementById('devices'),
      template = document.getElementById('device-template').querySelector('.device'),
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


  function removeDevice (event) {
    var device = event.target.parentNode;
    device.parentNode.removeChild(device);
  }


  function addDevice (event, device) {
    device = device || template.cloneNode(true);
    device.querySelector('.remove').addEventListener('click', removeDevice);
    devices.appendChild(device);
  }


  // Saves devices to localStorage.
  function saveOptions() {
    var savedDevices = [];

    for (var i = 0, len = devices.children.length; i < len; i++) {
      var deviceNode = devices.children[i],
          inputs = deviceNode.querySelectorAll('input'),
          typeSelect = deviceNode.querySelector('select'),
          device = {};

      device.title = inputs[0].value;
      device.x = inputs[1].value;
      device.y = inputs[2].value;

      // select device type (ios or android)
      for (var j = 0, length = typeSelect.children.length; j < length; j++) {
        var option = typeSelect.children[j];
        if (option.selected === true) {
          device.type = option.value;
          break;
        }
      }

      if (device.title !== '' && device.x !== '' && device.y !== '' && device.type) {
        savedDevices.push(device);
        deviceNode.style.background = 'transparent';
      } else {
        deviceNode.style.background = '#EC5216';
      }
    }

    localStorage['chameleon_devices_v3'] = JSON.stringify(savedDevices);

    // Let user know options were saved.
    var status = document.getElementById('status');
    status.innerHTML = 'Options Saved. Please close all Chameleon tabs to update.';
    setTimeout(function() {
      status.innerHTML = '';
    }, 3000);
  }


  // Restores previously created devices from localStorage.
  function restoreOptions() {
    if (!localStorage['chameleon_devices_v3']) {
      localStorage.removeItem('chameleon_devices');
      localStorage.removeItem('chameleon_devices_v2');
      localStorage['chameleon_devices_v3'] = JSON.stringify(defaultDevices);
    }

    var savedDevices = JSON.parse(localStorage['chameleon_devices_v3']);

    savedDevices.forEach(function (device) {
      var deviceNode = template.cloneNode(true),
          inputs = deviceNode.querySelectorAll('input'),
          typeSelect = deviceNode.querySelector('select');

      inputs[0].value = device.title;
      inputs[1].value = device.x;
      inputs[2].value = device.y;

      // select device type (ios or android)
      for (var i = 0, len = typeSelect.children.length; i < len; i++) {
        var option = typeSelect.children[i];
        if (option.value === device.type) {
          option.selected = 'true';
          break;
        }
      }

      addDevice(null, deviceNode);
    });
  }


  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector('#save').addEventListener('click', saveOptions);
  document.querySelector('#add').addEventListener('click', addDevice);
})();
