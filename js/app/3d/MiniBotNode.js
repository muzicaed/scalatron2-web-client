define([
        "lib/three",
        "app/3d/Resources/MeshFactory"
    ],

    function (THREE, MeshFactory) {

        /**
         *  Create a Mini bot
         *  TODO: Refactoring and reuse from MasterBotNode
         * @constructor
         */
        function MiniBotNode() {
            this.targetPosition = new THREE.Vector3(0, 0, 0);
            this.node = new THREE.Object3D();
            this.node.add(MeshFactory.createMiniBotMesh());
            this.node.position.y = 10;
        }

        // Return "class"
        return MiniBotNode;
    });