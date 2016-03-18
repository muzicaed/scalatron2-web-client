/**
 * Audio manager.
 */
define([],

  function () {

    // Object
    var Audio = {};

    var SoundFX = {};
    var Music = {};

    /**
     * Load sounds
     * TODO: Check how to preload.
     */
    Audio.load = function () {
      if(hasAudio()) {
        var test = createAudio("audio/music/cuban.mp3");
        test.play();
      }
    };

    /// INTERNAL ///////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * Create an audio element.
     * @param src
     * @param volume
     * @param isLooping
     * @returns {Element} - Audio.js
     */
    function createAudio(src, volume, isLooping) {
      var audio = document.createElement('audio');
      audio.volume = volume || 0.5;
      audio.loop = isLooping;
      audio.src = src;
      return audio;
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


