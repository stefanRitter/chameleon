
(function () {
  'use strict';
  var devices = document.getElementById("devices"),
      template = document.getElementById('device-template').querySelector('.device');


  function removeDevice (event) {
    var device = event.target.parentNode;
    device.parentNode.removeChild(device);
  }


  function addDevice (event, device) {
    device = device || template.cloneNode(true);
    device.addEventListener('click', removeDevice);
    devices.appendChild(device);
  }


  // Saves devices to localStorage.
  function saveOptions() {
    for (var i = 0, len = devices.children.length; i < len; i++) {
      var device = devices.children[i];
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
    var savedDevices = JSON.parse(localStorage['cameleon_devices']);

    if (!savedDevices) {
      return;
    }
    
    savedDevices.forEach(function (device) {
      var deviceNode = template.cloneNode(true),
          inputs = deviceNode.querySelectorAll('input'),
          typeSelect = deviceNode.querySelector('select');

      inputs[0].value = device.title;
      inputs[1].value = device.x;
      inputs[2].value = device.y;

      addDevice(null, deviceNode);
    });
  }


  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector('#save').addEventListener('click', saveOptions);
  document.querySelector('#add').addEventListener('click', addDevice);
})();
