/**
 * Represents a Mini Bot (Spawn)
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
     * @param colorId - Number
     * @constructor
     */
    function MiniBotNode(id, initialPos, colorId) {
      this.id = id;
      this.state = State.IDLING;
      this.node = new THREE.Object3D();
      this.node.add(MeshFactory.createMiniBotMesh(colorId));
      this.node.add(MeshFactory.createMiniBotStripeMesh(colorId));
      this.move = new MoveResponder(initialPos);
      this.move.placeOrigin(this.node);
    }

    // Return "class"
    return MiniBotNode;
  });