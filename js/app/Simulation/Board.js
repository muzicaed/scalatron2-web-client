/**
 * Board is a 2d representation the Scalatron board.
 */
define([
        "lib/three",
        "app/3d/PositionConverter",
        "app/3d/Manipulator",
        "app/3d/World"
    ],

    function (THREE, PositionConverter, Manipulator, World) {

        var world = new World();

        // TODO: Test code
        var bot1;
        var bot2;

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
            PositionConverter.init(boardData.height);
            this.__generateBoardNode();
            world.init(boardData);
            world.addStatic(this);

            // TODO: Remove test code
            bot1 = world.addMasterBot("1", {x: 3, y: 1});
            bot2 = world.addMasterBot("2", {x: 14, y: 8});
        };

        /**
         * Starts the simulation.
         */
        Board.prototype.runSimulation = function () {
            world.render();
        };

        /**
         * Handle a Scalatron server tick.
         * @param tickCount
         * @param targetTime - Target time for tick completion (in ms).
         * @param targetTime - Target time for tick completion (in ms).
         */
        Board.prototype.tick = function (tickCount, targetTime) {
            // TODO: Test code.
            log("Board tick " + new Date().getSeconds());
            bot1.move.setTargetPosition({x: 3, y: 1 + tickCount});
            bot2.move.setTargetPosition({x: 14 - tickCount, y: 8});
            Manipulator.tickStartTime = new Date().getTime();
            Manipulator.nextTargetTime = targetTime;
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
            var vec3d = PositionConverter.convert(vec);
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