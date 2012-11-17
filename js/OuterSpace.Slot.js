(function($) {

    // Declare static members here
    $.widget("OuterSpace.slot", {

        // Private members
        reels: [],
        reelImg: null,
        blurImg: null,
        stopReelCounter: 0,
        isSpinning: false,
        
        // DOM 
        // the drawing canvas
        context: null,

        // These options will be used as defaults
        options: {
            
            reelUrl: "img/icons.png",
            blurUrl: "img/icons-blur.png",
            iconOffset: 116
            // maxSpeed: [],
            // accelerateStep: []

        },

        spin: function() {

          if (!this.isSpinning) {

          var that = this;

          this.isSpinning = true;
          
          for (var i = 0; i<5 ; i++) {
            this.reels[i].start(this._randomIcons());
          }

          this._animate();

          window.setTimeout(function () {that._stop();}, 3000);
}
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

          this.element[0].width = this.element[0].clientWidth;
          this.element[0].height = this.element[0].clientHeight;
          this.context = this.element[0].getContext('2d');
          this.reelImg = new Image();
          this.reelImg.src = this.options.reelUrl;
          this.blurImg = new Image();
          this.blurImg.src = this.options.blurUrl;

          if (this.reelImg.complete) {
            this._initializeReels();
          }
          else {
            this.reelImg.onload = function () {
              that._initializeReels();
            };
          }
        },

        _initializeReels: function() {
          var that = this;

          for (var i=4; i>=0; i--) {
              // http://www.w3schools.com/tags/canvas_drawimage.asp
              this.reels[i] = new OuterSpace.reel(this.context, {
                reelImg: that.reelImg,
                blurImg: that.blurImg,
                sx: 0,
                sy: 0,
                swidth: 126,
                sheight: that.element[0].height,
                x: 110 * i,
                y: 0,
                width: 126,
                height: that.element[0].height,
                speed: 5 + i,
                iconOffset: that.options.iconOffset,
                icons: that._randomIcons()
              });
            }
        },

        _randomIcons: function() {
          var icons = [];
          for (var i=0;i<3;i++) {
            icons[i] = Math.floor(Math.random()*11);
          }
          return icons;
        },

        _animate: function () {

          if (this.isSpinning) {
            requestAnimationFrame(this._animate.bind(this));

            for (var i=4; i>=0; i--) {
              if (this.reels[i].keepSpinning) {
                this.reels[i].update();
              }              
            }

          }  

        },

        _stop: function() {
          var that = this;

            this.reels[this.stopReelCounter].stop();
            this.stopReelCounter += 1;

          if (this.stopReelCounter<5) {
            window.setTimeout(function(){that._stop();}, 1000);
          }
          else {
            this.stopReelCounter = 0;
            this.isSpinning = false;
          }
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);
        }

    });

}(jQuery));