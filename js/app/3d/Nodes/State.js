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
      "WALL_BUMPING": 5,
      "EXPLODE": 6,
      "EXPLODING": 7,
      "REMOVE": 8
    });
  });