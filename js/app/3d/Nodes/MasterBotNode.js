/**
 * Represents a Master Bot
 */
define([
    "lib/three",
    "app/3d/Nodes/State",
    "app/3d/Resources/MeshFactory",
    "app/3d/Responders/MoveResponder"
  ],

  function (THREE, State, MeshFactory, MoveResponder) {

    /**
     * Create a Master bot
     * @param id - String, object's id
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @constructor
     */
    function MasterBotNode(id, initialPos, colorId) {
      this.id = id;
      this.state = State.IDLING;
      this.node = new THREE.Object3D();
      this.node.add(MeshFactory.createBotBodyMesh(colorId));
      this.node.add(MeshFactory.createBotStripeMesh(colorId));
      this.node.scale.z = 0.55;

      this.move = new MoveResponder(initialPos);
      this.move.placeOrigin(this.node);
    }

    /**
     * Calculate master bot's real time fraction.
     * Master bots only move every other tick.
     * @param tickCount - Current tick count
     * @param timeFraction - Time fraction of current tick (in ms)
     * @returns {number}
     */
    MasterBotNode.prototype.calcTimeFraction = function (tickCount, timeFraction) {
      var mod = ((tickCount % 2) == 0) ? 0 : 0.5;
      return (timeFraction / 2) + mod;
    };

    // Return "class"
    return MasterBotNode;
  });