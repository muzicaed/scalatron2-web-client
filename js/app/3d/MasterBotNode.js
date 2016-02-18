define([
        "lib/three",
        "app/3d/Resources/MeshFactory"
    ],

    function (THREE, MeshFactory) {

        /**
         *  Create a Master bot
         * @constructor
         */
        function MasterBotNode() {
            this.position = new THREE.Vector3(0, 0, 0);
            this.node = new THREE.Object3D();
            this.node.add(MeshFactory.createBotMesh());
            this.node.position.y = 10;
        }

        // Return "class"
        return MasterBotNode
    });