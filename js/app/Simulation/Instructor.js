/**
 * Manages data feed and is responsible
 * for creating new simulation objects, and
 * managing their states.
 */
define([
    "lib/three"
  ],

  function (THREE) {


    // Object
    var Instructor = {};

    /**
     * The Scene
     */
    Instructor.scene = null;

    /**
     * Handels the tick data from server.
     * Instructs all simulation objects about changes,
     * and creates/removes objcets as needed.
     * @param tickData
     */
    Instructor.handleTick = function (tickData) {

    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates and adds a new master bot.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @returns {MasterBotNode}
     */
    Instructor.addMasterBot = function (id, initialPos, colorId) {
      var botNode = new MasterBotNode("MASTER-" + id, initialPos, colorId);
      __addObj(botNode);
      return botNode;
    };

    /**
     * Creates and adds a new mini bot.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @returns {MiniBotNode}
     */
    Instructor.addMiniBot = function (id, initialPos, colorId) {
      var botNode = new MiniBotNode("MINI-" + id, initialPos, colorId);
      __addObj(botNode);
      return botNode;
    };

    /**
     * Creates and adds a good beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {BeastNode}
     */
    Instructor.addGoodBeast = function (id, initialPos) {
      var beastNode = new BeastNode("G-BEAST-" + id, initialPos, BeastNode.Type.GOOD);
      __addObj(beastNode);
      return beastNode;
    };

    /**
     * Creates and adds a bad beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {BeastNode}
     */
    Instructor.addBadBeast = function (id, initialPos) {
      var beastNode = new BeastNode("B-BEAST-" + id, initialPos, BeastNode.Type.BAD);
      __addObj(beastNode);
      return beastNode;
    };

    /**
     * Creates and adds a good flower.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {FlowerNode}
     */
    Instructor.addGoodFlower = function (id, initialPos) {
      var flowerNode = new FlowerNode("G-FLOWER-" + id, initialPos, FlowerNode.Type.GOOD);
      __addObj(flowerNode);
      return flowerNode;
    };

    /**
     * Creates and adds a bad beast.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @returns {FlowerNode}
     */
    Instructor.addBadFlower = function (id, initialPos) {
      var flowerNode = new FlowerNode("B-FLOWER-" + id, initialPos, FlowerNode.Type.BAD);
      __addObj(flowerNode);
      return flowerNode;
    };


    // Return object
    return Instructor;
  }
);