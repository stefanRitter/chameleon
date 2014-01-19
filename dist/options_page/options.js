
(function () {
  'use strict';
  var $devices = document.getElementById("devices"),
      template = document.getElementById('device-template').querySelector('.device');

  // Saves devices to localStorage.
  function saveOptions() {
    for (var i = 0, len = $devices.children.length; i < len; i++) {
      var device = $devices.children[i];
      console.log(device);
    }


    // Let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
      status.innerHTML = "";
    }, 750);
  }


  // Restores previously created devices from localStorage.
  function restoreOptions() {
    var devices = JSON.parse(localStorage['cameleon_devices']);

    if (!devices) {
      return;
    }
    
    devices.forEach(function (device) {
      var $device = template.cloneNode(true),
          $inputs = $device.querySelectorAll('input'),
          $typeSelect = $device.querySelector('select');

      $inputs[0].value = device.title;
      $inputs[1].value = device.x;
      $inputs[2].value = device.y;

    });
  }


  // remove device
  function removeDevice (event) {
    var device = event.target.parentNode;
    device.parentNode.removeChild(device);
  }


  // add a device to the options list
  function addDevice (event, device) {
    device = device || template.cloneNode(true);
    device.addEventListener('click', removeDevice);
    $devices.appendChild(device);
  }


  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector('#save').addEventListener('click', saveOptions);
  document.querySelector('#add').addEventListener('click', addDevice);
})();
