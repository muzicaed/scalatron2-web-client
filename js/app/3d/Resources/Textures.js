var THREE = require("lib/three");

/**
* Texture manager.
*/
// Object
var Textures = {};

var noOfTextures = 6;
var textureCount = 0;

var doneCallback = null;

/**
 * Preload all textures
 * @param callback
 */
Textures.preload = function (callback) {
  doneCallback = callback;
  var loader = new THREE.TextureLoader();

  loader.load("textures/floor.jpg", function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(7.5, 7.5);
      Textures.Floor = texture;
      textureCount++;
      __done();
    }
  );

  loader.load("textures/wall.jpg", function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.2, 0.4);
      Textures.Wall = texture;
      textureCount++;
      __done();
    }
  );

  loader.load("textures/mini-bot.jpg", function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1.5, 1);
      Textures.MiniBot = texture;
      textureCount++;
      __done();
    }
  );

  loader.load("textures/bot.jpg", function (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(0.5, 0.5);
      Textures.Bot = texture;
      textureCount++;
      __done();
    }
  );

  loader.load("textures/firetexture.jpg", function (texture) {
      Textures.Explosion = texture;
      textureCount++;
      __done();
    }
  );

  loader.load("textures/plant.jpg", function (texture) {
      Textures.Plant = texture;
      textureCount++;
      __done();
    }
  );
};

/// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Called every time a texture is done loading.
 * @private
 */
function __done() {
  if (textureCount == noOfTextures) {
    doneCallback();
  }
}

// Export object
module.exports = Textures;
