(function($) {

    // Declare static members here
    $.widget("OuterSpace.slot", {

        // Private members
        reels: [],
        reelImg: null,
        blurImg: null,
        stopReelCounter: 0,
        
        // DOM 
        // the drawing canvas
        context: null,

        // These options will be used as defaults
        options: {
            
            reelUrl: "../img/icons.png",
            blurUrl: "../img/icons-blur.png",
            iconOffset: 100
            // maxSpeed: [],
            // accelerateStep: []

        },

        spin: function() {

          var that = this;
          
          for (reel in this.reels) {
            reel.start(this._randomIcons());
          }

          this.setTimeout(that._stop, 5000);

        },

        maxBet: function() {
            
        },

        // Set up the widget
        _create: function() {

            this._initialize();
            // this._setOption("theme", this.options.theme);

        },

        // The _setOption method responds to changes to options
        // It's not called for the options passed in during widget creation
        _setOption: function(key, value) {
            switch(key) {
            case "theme":
                // this._setTheme(value)
                break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        // Bind DOM objects as jQuery objects
        _initialize: function() {
          var that = this;

          this.context = this.element.getContext('2d');
          this.reelImg = new Image();
          this.reelImg.src = this.options.reelUrl;
          this.blurImg = new Image();
          this.blurImg.src = this.options.blurUrl;

            for (i=0; i<5; i++) {
              reels[i] = new OuterSpace.reel(context, {
                reelImg: that.reelImg,
                blurImg: that.blurImg,
                x: null,
                y: 0,
                width: null,
                height: null,
                speed: 1,
                iconOffset: that.options.iconOffset
              });
            }
        },

        _randomIcons: function() {
          var icons = [];
          for (i=0;i<3;i++) {
            icons[i] = Math.floor(Math.random()*11);
          }
          return icons;
        },

        _stop: function() {
          var that = this;

          if (this.stopReelCounter<5) {
            this.reels[this.stopReelCounter].stop();
            this.stopReel += 1;
            this.setTimeout(that._stop, 1000);
          }
          else {
            this.stopReelCounter = 0;
          }
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);
        }

    });

}(jQuery));