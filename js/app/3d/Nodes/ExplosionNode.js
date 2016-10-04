var THREE = require("lib/three");
var State = require("app/3d/Nodes/State");
var MeshFactory = require("app/3d/Resources/MeshFactory");
var PositionConverter = require("app/3d/PositionConverter");

/**
 * Represents a Explosion.
 */

/**
 * Create a Explosion
 * @param id - String, object's id
 * @param initialPos - THREE.Vector2, position on 2d grid
 * @param tileRadius - Number, radius in 2d grid tiles.
 * @param birthTick - Tick when this explosion was created
 * @constructor
 */
function ExplosionNode(id, initialPos, tileRadius, birthTick) {
  this.id = id;
  this.birthTick = birthTick;
  this.state = State.EXPLODING;
  this.node = new THREE.Object3D();
  this.node.add(MeshFactory.createExplosion(tileRadius));

  var position = PositionConverter.convert(initialPos);
  this.node.position.x = position.x;
  this.node.position.y = position.y;
  this.node.position.z = 0;

  this.node.scale.x = 0.01;
  this.node.scale.y = 0.01;

  this.node.scale.z = 0.2;
}

// Export "class"
module.exports = ExplosionNode;