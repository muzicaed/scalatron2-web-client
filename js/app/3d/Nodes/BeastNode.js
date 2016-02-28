/**
 * Represents a Beast.
 * This object represents both Bad and Good beasts.
 */
define([
    "lib/three",
    "app/3d/Nodes/State",
    "app/3d/Resources/MeshFactory",
    "app/3d/Responders/MoveResponder"
  ],

  function (THREE, State, MeshFactory, MoveResponder) {

    /**
     * Create a Mini bot
     * @param id - String, object's id
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param type - BeastNode.Type
     * @constructor
     */
    function BeastNode(id, initialPos, type) {
      this.id = id;
      this.state = State.IDLING;
      this.node = new THREE.Object3D();
      this.type = type;
      if (type == BeastNode.Type.GOOD) {
        this.node.add(MeshFactory.createGoodBeastMesh());
      } else {
        this.node.add(MeshFactory.createBadBeastMesh());
      }
      this.move = new MoveResponder(initialPos);
      this.move.placeOrigin(this.node);
      this.node.position.z = -2;
    }

    /**
     * Calculate beast real time fraction.
     * Master bots only move every 4th tick.
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     * @returns {number}
     */
    BeastNode.prototype.calcTimeFraction = function (tickCount, timeFraction) {
      // TODO: Fix here!
      var frameOffset = tickCount % 4;
      return (timeFraction / 4) + (frameOffset / 4);
    };


    BeastNode.Type = Object.freeze({
      "GOOD": 0,
      "BAD": 1
    });

    // Return "class"
    return BeastNode;
  }
);