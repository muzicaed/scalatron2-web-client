define(["lib/three"],
    function (THREE) {

        // TODO: Refactor in to shared static data object.
        var TileSize = 10;

        /**
         *  Create the 3d board
         * @constructor
         */
        function Board() {
            this.boardData = null;
            this.node = new THREE.Object3D();
        }

        /**
         * Init the board
         * @param boardData - Object containing board/tile data.
         */
        Board.prototype.init = function (boardData) {
            this.boardData = boardData;
            this.__generateBoardNode();
        };

        /**
         *
         * @param pos - THREE.Vector2, tile position on board
         * @returns {THREE.Vector3} - Position in 3d space
         */
        Board.prototype.tilePosToWorldPos = function (pos) {
            return new THREE.Vector3(
                (pos.x * TileSize),
                (-(pos.y * TileSize)) + (this.boardData.height * TileSize),
                0
            );
        };

        /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Generates a 3d board based on boardData.
         * @param node - Object3D
         * @param boardData - Object containing board/tile data.
         * @private
         */
        Board.prototype.__generateBoardNode = function () {
            for (var x = 0, len = this.boardData.width; x < len; x++) {
                for (var y = this.boardData.height - 1; y >= 0; y--) {
                    var index = x + (y * this.boardData.height);
                    var tile = (this.boardData.grid[index] == 1) ? __createWall() : __createFloor();
                    this.__addTile(tile, new THREE.Vector2(x, y));
                }
            }
        };

        /**
         * Adds a tile to the board node.
         * @param tile - THREE.Mesh
         * @param vec - THREE.Vector2
         * @private
         */
        Board.prototype.__addTile = function (tile, vec) {
            var vec3d = this.tilePosToWorldPos(vec);
            tile.position.x = vec3d.x;
            tile.position.y = vec3d.y;
            this.node.add(tile);
        };

        /**
         * Creates a wall cube
         * TODO: Waste: Reuse mesh & materials for each tile, move to resource "package"
         * @returns {THREE.Mesh}
         * @private
         */
        function __createWall() {
            var geometry = new THREE.BoxGeometry(
                __randomWallSize(10, 9.6),
                __randomWallSize(10, 9.7),
                __randomWallSize(7, 6.9));
            var material = new THREE.MeshLambertMaterial({color: 0x444444});
            return new THREE.Mesh(geometry, material);
        }

        /**
         * Creates a floor tile
         * TODO: Waste: Reuse mesh & materials for each tile, move to resource "package"
         * @returns {THREE.Mesh}
         * @private
         */
        function __createFloor() {
            var geometry = new THREE.BoxGeometry(9.7, 9.7, 1);
            var material = new THREE.MeshLambertMaterial({color: 0x888888});
            return new THREE.Mesh(geometry, material);
        }

        /**
         * Generates wall size with slight variation.
         * @param max - number, max wall height
         * @param min - number, min wall height
         * @returns {number}
         * @private
         */
        function __randomWallSize(max, min) {
            return Math.random() * (max - min + 1) + min;
        }

        // Return "class"
        return Board
    });