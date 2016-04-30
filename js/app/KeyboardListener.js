/**
 * Keyboard Listener.
 */
define([
    "app/3d/Manipulator"
  ],

  function (Manipulator) {

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
            simulation.changeSpeed(800);
            break;
          case 50: // Key 2
            simulation.changeSpeed(200);
            break;
          case 51: // Key 3
            simulation.changeSpeed(100);
            break;
          case 52: // Key 4
            simulation.changeSpeed(60);
            break;
          case 53: // Key 5
            simulation.changeSpeed(35);
            break;
          case 54: // Key 6
            simulation.changeSpeed(18);
            break;
          case 55: // Key 7
            simulation.changeSpeed(5);
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


    // Return object
    return KeyboardListener;
  });


