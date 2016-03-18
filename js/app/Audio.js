/**
 * Audio manager.
 */
define([],

  function () {

    // Object
    var Audio = {};

    var soundFX = {};
    var soundFXCount = {};
    var MaxChannels = 10;
    var music;

    /**
     * Load sounds
     * TODO: Check how to preload.
     */
    Audio.load = function () {
      if(hasAudio()) {
        music = createAudio("audio/music/blipstream.mp3", 0.35, true);
        soundFX["DIE"] = createFxAudio("audio/sound-fx/die.mp3");
        soundFX["EAT"] = createFxAudio("audio/sound-fx/eat.mp3");
        soundFX["EXPLOSION"] = createFxAudio("audio/sound-fx/explosion.mp3");
        soundFX["WALL-HIT"] = createFxAudio("audio/sound-fx/wall-hit.mp3");
        soundFXCount["DIE"] = 0;
        soundFXCount["EAT"] = 0;
        soundFXCount["EXPLOSION"] = 0;
        soundFXCount["WALL-HIT"] = 0;

        music.play();
      }
    };

    /**
     * Play sound effect.
     */
    Audio.playSound = function(key) {
      if(soundFX[key] !== undefined)
      soundFX[key][soundFXCount[key]].play();
      soundFXCount[key]++;
      if(soundFXCount[key] >= MaxChannels) {
        soundFXCount[key] = 0;
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Create an audio element.
     * @param src
     * @param volume
     * @param isLooping
     * @returns {Element} - Audio
     */
    function createAudio(src, volume, isLooping) {
      var audio = document.createElement('audio');
      audio.volume = volume || 0.5;
      audio.loop = isLooping;
      audio.src = src;
      return audio;
    }

    /**
     * Prepares polyphonic channels.
     * @returns {Array} - of Audio elements
     */
    function createFxAudio(src, volume) {
      var audio = createAudio(src, volume, false);
      var audioArr = [];
      for(var i = 0; i < MaxChannels; i++) {
        var copy = audio.cloneNode();
        copy.volume = audio.volume;
        audioArr.push(audio.cloneNode());
      }
      return audioArr;
    }

    /**
     * Check if audio is supported.
     * @returns bool
     */
    function hasAudio() {
      var audio = document.createElement('audio');
      return audio && audio.canPlayType;
    }

    // Return object
    return Audio;
  });


