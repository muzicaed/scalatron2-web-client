define(["lib/three"],
    function (THREE) {

        var TileSize = 10;

        /**
         *  Create the 3d board
         * @constructor
         */
        function Board() {
            var boardData = __generateTestBoardData();
            this.node = new THREE.Object3D();
            __generateBoardNode(this.node, boardData);

        }

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////


        function __generateBoardNode(node, boardData) {
            for (var x = 0, len = boardData.width; x < len; x++) {
                for (var y = boardData.height; y >= 0; y--) {
                    var pos = x + (y * boardData.height);
                    var tile = (boardData.grid[pos] == 1) ? __createWall() : __createFloor();
                    tile.position.x = (x * TileSize);
                    tile.position.y = (-(y * TileSize)) + (boardData.height * TileSize);
                    node.add(tile);
                }
            }
        }

        /**
         *  TODO: Remove
         *  Generates static test data for a board.
         */
        function __generateTestBoardData() {
            return {
                width: 10,
                height: 10,
                grid: [
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 1, 1, 1, 0, 0, 1, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                ]
            };
        }

        /**
         * Creates a wall cube
         * @returns {THREE.Mesh}
         * @private
         */
        function __createWall() {
            var geometry = new THREE.BoxGeometry(10, 10, 7);
            var material = new THREE.MeshLambertMaterial({color: 0x444444});
            return new THREE.Mesh(geometry, material);
        }

        /**
         * Creates a floor tile
         * @returns {THREE.Mesh}
         * @private
         */
        function __createFloor() {
            var geometry = new THREE.BoxGeometry(9.7, 9.7, 1);
            var material = new THREE.MeshLambertMaterial({color: 0x888888});
            return new THREE.Mesh(geometry, material);
        }

        // Return "class"
        return Board
    });