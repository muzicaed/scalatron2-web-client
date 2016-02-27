define([
        "lib/three",
        "app/3d/Nodes/State",
        "app/3d/Resources/MeshFactory",
        "app/3d/Behaviours/MoveBehaviour"
    ],

    function (THREE, State, MeshFactory, MoveBehaviour) {

        /**
         *  Create a Mini bot
         *  TODO: Refactoring and reuse from MasterBotNode
         * @constructor
         */
        function MiniBotNode() {
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