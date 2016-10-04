var Manipulator = require("app/3d/Manipulator");
/**
 * Keyboard Listener.
 */

// Object
  var KeyboardListener = {};
  var simulation;

  /**
   * Register keyboard key listners.
   */
  KeyboardListener.load = function (sim) {
    simulation = sim;
    document.addEventListener('keydown', function (event) {
      switch (event.keyCode) {
        case 49: // Key 1
          simulation.changeSpeed(3.0);
          break;
        case 50: // Key 2
          simulation.changeSpeed(2.0);
          break;
        case 51: // Key 3
          simulation.changeSpeed(1.0);
          break;
        case 52: // Key 4
          simulation.changeSpeed(0.75);
          break;
        case 53: // Key 5
          simulation.changeSpeed(0.5);
          break;
        case 54: // Key 6
          simulation.changeSpeed(0.25);
          break;
        case 55: // Key 7
          simulation.changeSpeed(0.08);
          break;
        case 32: // Key Space
          Manipulator.cyclePlayerCamera();
          break;
        case 82: // Key R
          Manipulator.toggleRaceCam();
          break;
      }
    });
  };


/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


// Export object
  module.exports = KeyboardListener;


