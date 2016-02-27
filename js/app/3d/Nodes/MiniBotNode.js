define([
        "lib/three",
        "app/3d/Nodes/State",
        "app/3d/Resources/MeshFactory",
        "app/3d/Behaviours/MoveBehaviour"
    ],

    function (THREE, State, MeshFactory, MoveBehaviour) {

        /**
         * Create a Mini bot
         * @param id - String, object's id
         * @param initialPos - THREE.Vector2, position on 2d grid
         * @constructor
         */
        function MiniBotNode(id, initialPos) {
            this.id = id;
            this.state = State.IDLING;
            this.node = new THREE.Object3D();
            this.node.add(MeshFactory.createMiniBotMesh());

            this.move = new MoveBehaviour(initialPos);
            this.move.placeOrigin(this.node);
        }

        // Return "class"
        return MiniBotNode;
    });