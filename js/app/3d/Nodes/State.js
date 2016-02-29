/**
 * Simulation object state enum.
 */
define([],

  function () {

    // Return object
    return Object.freeze({
      "IDLING": 1,
      "MOVING": 2,
      "SPAWNING": 3,
      "SPAWNED": 4,
      "DYING": 5,
      "WALL_BUMPING": 6,
      "EXPLODE": 7,
      "EXPLODING": 8,
      "REMOVE": 9
    });
  });