/**
 * Simulation object state enum.
 */
define([],

  function () {

    // Return object
    return Object.freeze({
      "IDLING": 0,
      "MOVING": 1,
      "SPAWNING": 2,
      "DYING": 3,
      "EXPLODING": 4,
      "WALL_BUMPING": 5
    });
  });