/**
 * Manages data feed and is responsible
 * for creating new simulation objects, and
 * managing their states.
 */
define([
    "lib/three",
    "app/3d/Manipulator",
    "app/3d/Nodes/MasterBotNode",
    "app/3d/Nodes/MiniBotNode",
    "app/3d/Nodes/BeastNode",
    "app/3d/Nodes/FlowerNode",
    "app/3d/Nodes/State"
  ],

  function (THREE, Manipulator, MasterBotNode, MiniBotnode, BeastNode, FlowerNode, State) {


    // Object
    var Instructor = {};

    /**
     * The Scene
     */
    Instructor.scene = null;

    /**
     * Manages the tick data from server.
     * Instructs all simulation objects about changes,
     * and creates/removes objects as needed.
     * @param tickData
     */
    Instructor.handleTick = function (tickData) {
      var hash = __extractHash(tickData);
      Manipulator.clearUnused(hash);
      for (var i = 0, len = tickData.bots.length; i < len; i++) {
        var entity = tickData.bots[i];
        if (__isPlant(entity)) {
          __handlePlant(entity);
        } else if (__isBot(entity)) {
          __handleEntity(entity);
        }
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Handle plant entities.
     * @param entity
     * @private
     */
    function __handlePlant(entity) {
      var id = __createPlantId(entity);
      var obj3d = Manipulator.retrieve(id);

      if (obj3d === undefined) {
        var type = (entity.t == "P") ? FlowerNode.Type.GOOD : FlowerNode.Type.BAD;
        var flowerNode = new FlowerNode(id, new THREE.Vector2(entity.x, entity.y), type);
        flowerNode.state = State.SPAWNED;
        Manipulator.add(flowerNode);
        return;
      }
      obj3d.state = State.IDLING;
    }

    /**
     * Handle moving entities (Beast & Bots)
     * @param entity
     * @private
     */
    function __handleEntity(entity) {
      var entity3d = Manipulator.retrieve(entity.t + entity.id);
      if (entity3d === undefined) {
        entity3d = __createEntity(entity);
      }

      if (entity3d.move !== undefined) {
        entity3d.state = State.MOVING;
        entity3d.move.setTargetPosition(new THREE.Vector2(entity.x, entity.y));
      }
    }

    function __createEntity(entity) {
      var entity3d;
      if (entity.t == "M") {
        entity3d = new MasterBotNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), 6);
      } else if (entity.t == "S") {
        entity3d = new MiniBotnode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), 6)
      } else if (entity.t == "B") {
        entity3d = new BeastNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), BeastNode.Type.GOOD)
      } else if (entity.t == "b") {
        entity3d = new BeastNode(entity.t + entity.id, new THREE.Vector2(entity.x, entity.y), BeastNode.Type.BAD)
      } else {
        throw new Error('Unknowed entity type: ' + entity.t);
      }
      if (entity3d !== null) {
        Manipulator.add(entity3d);
      }
      return entity3d;
    }

    /**
     * Extracts a hash of entity ids.
     * @param tickData
     * @private
     * @returns Object - Hash of ids
     */
    function __extractHash(tickData) {
      var hash = {};
      for (var i = 0, len = tickData.bots.length; i < len; i++) {
        var entity = tickData.bots[i];
        if (__isPlant(entity)) {
          hash[__createPlantId(entity)] = entity;
        } else {
          hash[entity.id] = entity;
        }
      }

      return hash;
    }

    /**
     * Creates id for plant
     * @param entity
     * @private
     * @returns String
     */
    function __createPlantId(entity) {
      return "PLANT-" + entity.x + entity.y;
    }

    /**
     * Checks if entity is a plant.
     * @param entity
     * @private
     * @returns Boolean
     */
    function __isPlant(entity) {
      var t = entity.t;
      return (t == "P" || t == "p");
    }

    /**
     * Checks if entity is a bot or beast.
     * @param entity
     * @private
     * @returns Boolean
     */
    function __isBot(entity) {
      var t = entity.t;
      return (t == "M" || t == "S"|| t == "b" || t == "B");
    }

    /**
     * Creates and adds a new master bot.
     * @param id - String
     * @param initialPos - THREE.Vector2, position on 2d grid
     * @param colorId - Number
     * @returns {MasterBotNode}
     */
    Instructor.addMasterBot = function (id, initialPos, colorId) {
      var botNode = new MasterBotNode(id, initialPos, colorId);
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
      var botNode = new MiniBotNode(id, initialPos, colorId);
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
      var beastNode = new BeastNode(id, initialPos, BeastNode.Type.GOOD);
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
      var beastNode = new BeastNode(id, initialPos, BeastNode.Type.BAD);
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
      var flowerNode = new FlowerNode(id, initialPos, FlowerNode.Type.GOOD);
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
      var flowerNode = new FlowerNode(id, initialPos, FlowerNode.Type.BAD);
      __addObj(flowerNode);
      return flowerNode;
    };


    // Return object
    return Instructor;
  }
);