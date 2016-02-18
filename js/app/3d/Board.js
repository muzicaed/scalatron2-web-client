define(["lib/three"],
    function (THREE) {

        var TileSize = 10;

        /**
         *  Create the 3d board
         * @constructor
         */
        function Board() {
            this.node = new THREE.Object3D();
        }

        /**
         * Init the board
         * @param boardData - Object containing board/tile data.
         */
        Board.prototype.init = function (boardData) {
            __generateBoardNode(this.node, boardData);
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Generates a 3d board based on boardData.
         * @param node - Object3D
         * @param boardData - Object containing board/tile data.
         * @private
         */
        function __generateBoardNode(node, boardData) {
            for (var x = 0, len = boardData.width; x < len; x++) {
                for (var y = boardData.height - 1; y >= 0; y--) {
                    var pos = x + (y * boardData.height);
                    var tile = (boardData.grid[pos] == 1) ? __createWall() : __createFloor();
                    tile.position.x = (x * TileSize);
                    tile.position.y = (-(y * TileSize)) + (boardData.height * TileSize);
                    node.add(tile);
                }
            }
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