/* HTML5 audio with buzz.js */
OuterSpace.audio = function (path, eventAggregator) {
  if ( !buzz.isSupported() ) {
    alert("The browser you are using doesn't support HTML5 <audio> element.")
  }
  else {
    buzz.defaults.formats = [ 'ogg', 'mp3' ];

    if (path.charAt(path.length-1) !== "/") {
      path = path + "/";
    }
    this.musics = {
      background: new buzz.sound(path + "music/Deadmau5-The-Veldt")
    };
    this.sounds = {
      spin: new buzz.sound(path + "sound/spin")
    };

    this.eventAggregator = eventAggregator;

    this.bindEvents();
  }
};

OuterSpace.audio.prototype = {

	constructor: OuterSpace.audio,

  // init: function() {
  // },

  bindEvents: function () {    
    var that = this;
    // subscribe to game loading finished event 
    this.eventAggregator.on("game:ready", function(){
      that.musics.background.play().loop();    
    });
    // subscribe to slot start spinning event
    this.eventAggregator.bind("slot:spin", function() {
      that.sounds.spin.play().loop();
    });
    // subscribe to slot end spinning event
    this.eventAggregator.bind("slot:stop", function(){
      that.sounds.spin.stop();
    });
  }
};