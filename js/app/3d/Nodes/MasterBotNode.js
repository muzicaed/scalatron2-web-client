var THREE = require("lib/three");
var State = require("app/3d/Nodes/State");
var MeshFactory = require("app/3d/Resources/MeshFactory");
var MoveResponder = require("app/3d/Responders/MoveResponder");

/**
 * Represents a Master Bot
 */

/**
 * Create a Master bot
 * @param id - String, object's id
 * @param initialPos - THREE.Vector2, position on 2d grid
 * @constructor
 */
function MasterBotNode(id, initialPos) {
  this.id = id;
  this.state = State.IDLING;
  this.node = new THREE.Object3D();
  this.node.add(MeshFactory.createBotBodyMesh(this.id));
  this.node.add(MeshFactory.createBotStripeMesh(this.id));
  this.node.scale.z = 0.75;
  this.node.position.z = 5.5;

  this.move = new MoveResponder(initialPos);
  this.move.placeOrigin(this.node);
  this.move.stepOffset = 2;
}

// Export "class"
module.exports = MasterBotNode;