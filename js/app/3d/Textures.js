/**
 * Static shared constants.
 */
define([
    "lib/three",
  ],

  function (THREE) {

    THREE.ImageUtils.crossOrigin = '';

    // Return object
    return {
      Wall: THREE.ImageUtils.loadTexture("img/wall.jpg"),
      Floor: THREE.ImageUtils.loadTexture("img/wall.jpg"),
    };

  });