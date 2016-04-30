/**
 * Keyboard Listener.
 */
define([
    "app/Common/Static"
  ],

  function (Static) {

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
            log("1");
            simulation.changeSpeed(1000);
            break;
          case 50: // Key 2
            log("2");
            simulation.changeSpeed(800);
            break;
          case 51: // Key 3
            simulation.changeSpeed(300);
            break;
          case 52: // Key 4
            simulation.changeSpeed(100);
            break;
          case 53: // Key 5
            simulation.changeSpeed(40);
            break;
        }
      });
    };


    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


    // Return object
    return KeyboardListener;
  });


