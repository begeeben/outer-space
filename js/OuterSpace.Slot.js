(function($) {

    // Declare static members here
    $.widget("OuterSpace.slot", {

        // Private members
        reels: [],
        reelImg: null,
        blurImg: null,
        stopReelCounter: 0,
        isSpinning: false,
        isAnimating: false,   // is playing winning animation
        icons: [],
        winningLines: [],
        
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

        testSpin: function() {
          var icons = [];

          for (var i = 0; i<5; i++) {
            icons[i] = this._randomIcons();
          }

          this.spin(icons);
        },

        testWins: function() {
          this.spin([[2,5,8],[2,5,10],[2,5,3],[6,5,3],[9,5,3]]);
        },

        spin: function(icons) {

          if (!(this.isSpinning && this.isWinning)) {

          var that = this;

          this.isSpinning = true;
          this.icons = icons;
          
          for (var i = 0; i<5 ; i++) {
            this.reels[i].start(this.icons[i]);
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
            this._checkResult();
          }
        },

        _checkResult: function() {
          var that = this;
          this.isAnimating = true;

          this.element.queue("win", function(){
            that._animateWin([
            {position: 0, win: true},
            {position: 0, win: true},
            {position: 0, win: true},
            {position: 0, win: false},
            {position: 0, win: false}
            ], "rotate");
          });

          this.element.queue("win", function(){
            that._animateWin([
              {position: 2, win: false},
              {position: 2, win: false},
              {position: 2, win: true},
              {position: 2, win: true},
              {position: 2, win: true}
              ], "rotate");
          });

          this.element.queue("win", function(){
            that._animateWin([
              {position: 1, win: true},
              {position: 1, win: true},
              {position: 1, win: true},
              {position: 1, win: true},
              {position: 1, win: true}
              ], "enlarge");
          });

          this.element.dequeue("win");
        },

        _animateWin: function(line, type) {
          if (this.isAnimating) {
            requestAnimationFrame(this._animateWin.bind(this, line, type));
            // draw satic icons first
            for (var i = 0; i<5; i++) {
              if (!line[i].win) {
                this.reels[i].drawResult();
              }
            }
            // draw animated icons
            for (i = 0; i<5; i++) {
              if (line[i].win) {
                // this should be moved out of the loop
                switch (type) {
                  case "enlarge":
                    this.reels[i].enlarge(line[i].position);
                    break;
                  case "rotate":
                    this.reels[i].rotate(line[i].position);
                    break;
                }
              }
            }

            if (!(this.reels[0].keepAnimating || this.reels[1].keepAnimating || this.reels[2].keepAnimating)) {
              this.isAnimating = false;
            }
          }
          else {
            for (var i = 0; i<5; i++) {
              this.reels[i].drawResult();
            }
            if (this.element.queue("win").length > 0) {
              this.isAnimating = true;
              this.element.dequeue("win");
            }
          }
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);
        }

    });

}(jQuery));