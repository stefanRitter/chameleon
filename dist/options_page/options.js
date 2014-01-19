
(function () {
  'use strict';

  // Saves options to localStorage.
  function save_options() {
    var select = document.getElementById("color");
    var color = select.children[select.selectedIndex].value;
    localStorage["favorite_color"] = color;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
      status.innerHTML = "";
    }, 750);
  }

  // Restores previously created devices from localStorage.
  function restore_options() {
    var json = localStorage['cameleon_devices'];
    if (!json) {
      return;
    }

    var devices = JSON.parse(json);
    
    var select = document.getElementById("color");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == favorite) {
        child.selected = "true";
        break;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.querySelector('#save').addEventListener('click', save_options);
})();
