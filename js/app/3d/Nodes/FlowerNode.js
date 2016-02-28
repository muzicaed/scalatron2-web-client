/**
 * Represents a Flower.
 * This object represents both Bad and Good flowers.
 */
define([
    "lib/three",
    "app/3d/Nodes/State",
    "app/3d/PositionConverter",
    "app/3d/Resources/MeshFactory"
  ],

  function (THREE, State, PositionConverter, MeshFactory) {

    /**
     * Create a Flower
     * @param id - String, object's id
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param type - BeastNode.Type
     * @constructor
     */
    function FlowerNode(id, initialPos, type) {
      this.id = id;
      this.state = State.IDLING;
      this.node = new THREE.Object3D();
      this.type = type;
      if (type == FlowerNode.Type.GOOD) {
        this.node.add(MeshFactory.createGoodFlowerMesh());
      } else {
        this.node.add(MeshFactory.createBadFlowerMesh());
      }

      var position = PositionConverter.convert(initialPos);
      this.node.position.x = position.x;
      this.node.position.y = position.y;
      this.node.position.z = -3.5;
    }

    FlowerNode.Type = Object.freeze({
      "GOOD": 0,
      "BAD": 1
    });

    // Return "class"
    return FlowerNode;
  }
);