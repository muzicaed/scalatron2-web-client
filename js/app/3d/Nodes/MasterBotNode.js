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
     * @constructor
     */
    function MasterBotNode(id, initialPos) {
      this.id = id;
      this.state = State.IDLING;
      this.node = new THREE.Object3D();
      this.node.add(MeshFactory.createBotMesh());
      this.node.scale.z = 0.5;

      this.move = new MoveResponder(initialPos);
      this.move.placeOrigin(this.node);
    }

    // Return "class"
    return MasterBotNode;
  });