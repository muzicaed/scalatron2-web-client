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
      "SPAWNED": 3,
      "DYING": 4,
      "EXPLODING": 5,
      "WALL_BUMPING": 6
    });
  });