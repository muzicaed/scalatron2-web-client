var THREE = require("lib/three");
var State = require("app/3d/Nodes/State");
var MeshFactory = require("app/3d/Resources/MeshFactory");
var MoveResponder = require("app/3d/Responders/MoveResponder");

/**
 * Represents a Mini Bot (Spawn)
 */


/**
 * Create a Mini bot
 * @param id - String, object's id
 * @param mid - String, master bot id
 * @param initialPos - THREE.Vector2, position on 2d grid
 * @constructor
 */
function MiniBotNode(id, mid, initialPos) {
  this.id = id;
  this.mid = mid;
  this.state = State.IDLING;
  this.node = new THREE.Object3D();
  this.node.add(MeshFactory.createMiniBotMesh(this.mid));
  this.node.position.z = 3.5;
  this.move = new MoveResponder(initialPos);
  this.move.placeOrigin(this.node);
  this.move.stepOffset = 1;
  this.explodedTick = -1;

  this.node.rotation.y = 50;
}

// Export "class"
module.exports = MiniBotNode;