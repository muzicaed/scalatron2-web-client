/**
 * Board is a 2d representation the Scalatron board.
 */
define([
        "lib/three",
        "app/3d/World",
        "app/3d/MasterBotNode",
        "app/3d/MiniBotNode",
        "app/Simulation/Visitors/Mover",
        "app/Common/Static"
    ],

    function (THREE, World, MasterBotNode, MiniBotNode, Mover, Static) {

        var world = new World();


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
            world.init(boardData);
            world.addStatic(this);
            world.render();

            // TODO: Remove test code
            this.addMasterBot("1", {x: 3, y: 1});
        };

        /**
         * Handle a Scalatron server tick.
         * @param tickCount
         * @param timePerTick - Time for this tick in ms.
         */
        Board.prototype.tick = function (tickCount, timePerTick) {
            // TODO: Test code.
            var testBot = world.findObj("1");
            Mover.apply(testBot, {x: 3, y: 1 + tickCount}, timePerTick, this);
        };

        /**
         * Creates and adds a new master bot.
         * @param initialPos
         * @returns {MasterBotNode}
         */
        Board.prototype.addMasterBot = function (id, initialPos) {
            var botNode = new MasterBotNode(id);
            botNode.movable.setTargetPosition(this.tilePosToWorldPos(initialPos));
            botNode.place();
            world.add(botNode);

            return botNode;
        };

        /**
         * Coverts tile 2d position to world 3d position.
         * @param pos - THREE.Vector2, tile position on board
         * @returns {THREE.Vector3} - Position in 3d space
         */
        Board.prototype.tilePosToWorldPos = function (pos) {
            return new THREE.Vector3(
                (pos.x * Static.TileSize),
                (-(pos.y * Static.TileSize)) + (this.boardData.height * Static.TileSize),
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
        return Board;
    });