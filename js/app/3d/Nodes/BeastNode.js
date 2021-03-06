var State = require("app/3d/Nodes/State");
var MeshFactory = require("app/3d/Resources/MeshFactory");
var MoveResponder = require("app/3d/Responders/MoveResponder");

/**
 * Represents a Beast.
 * This object represents both Bad and Good beasts.
 */

/**
 * Create a Beast
 * @param id - String, object's id
 * @param initialPos - THREE.Vector2, position on 2d grid
 * @param type - BeastNode.Type
 * @constructor
 */
function BeastNode(id, initialPos, type) {
  this.id = id;
  this.state = State.IDLING;
  this.type = type;
  if (type == BeastNode.Type.GOOD) {
    this.node = MeshFactory.createGoodBeastMesh();
  } else {
    this.node = MeshFactory.createBadBeastMesh();
  }
  this.move = new MoveResponder(initialPos);
  this.move.placeOrigin(this.node);
  this.move.stepOffset = 4;
  this.node.position.z = -2;
}


BeastNode.Type = Object.freeze({
  "GOOD": 0,
  "BAD": 1
});

// Export "class"
module.exports = BeastNode;