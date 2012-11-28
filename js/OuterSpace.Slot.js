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
        isResultChecked: false,
        icons: [],
        // this.lines[lineNo][reelNo]
        lines: [
          [ 1,1,1,1,1 ],
          [ 2,2,2,2,2 ],
          [ 0,0,0,0,0 ],
          [ 1,1,2,1,1 ],
          [ 1,1,0,1,1 ],
          [ 2,2,1,0,0 ],
          [ 0,0,1,2,2 ],
          [ 2,2,1,2,2 ],
          [ 0,0,1,0,0 ],
          [ 2,1,0,1,2 ],
          [0,1,2,1,0],
          [2,2,1,0,0],
          [0,0,1,2,2]
          ],
        linesBet: 1,
        drawer: null,
        winningVideo: null,
        eventAggregator: null,
        
        // DOM 
        // the drawing canvas
        context: null,
        // div for gif animation
        animationContainer: null,

        // These options will be used as defaults
        options: {
            
            reelUrl: "img/icons.png",
            blurUrl: "img/icons-blur.png",
            iconOffset: 116,
            animationContainer: "win-animation",
            winningVideo: "win-video",
            eventAggregator: null
            // maxSpeed: [],
            // accelerateStep: []

        },

        testSpin: function() {
          var icons = [];

          for (var i = 0; i<5; i++) {
            icons[i] = this._randomIcons();
          }

          this.linesBet = this.lines.length;
          this.spin(icons);
        },

        testWins: function() {
          this.linesBet = this.lines.length;
          // this.spin([[0,5,8],[2,5,10],[0,5,3],[0,5,3],[9,5,3]]);
          this.spin([[3,5,8],[2,5,10],[0,5,3],[0,5,3],[0,5,3]]);
        },

        spin: function(icons) {

          if (!(this.isSpinning || this.isAnimating)) {
            eventAggregator.trigger("slot:spin");
            // this.eventAggregator.trigger("slot:spin");
            // this.options.eventAggregator.trigger("slot:spin");

            var that = this;

            this.isSpinning = true;
            this.isResultChecked = false;
            this.icons = icons;
            
            for (var i = 0; i<5 ; i++) {
              this.reels[i].start(this.icons[i]);
            }

            // draw selected lines
            for (var j = 0; j<this.linesBet; j++) {
              this.drawer.drawLine(this.lines[j]);
            }

            window.setTimeout(function () {that._animate();}, 500);

            window.setTimeout(function () {that._stop();}, 3000);

          }
        },

        maxBet: function() {
          this.linesBet = this.lines.length;
        },

        increaseLine: function() {
          if (this.linesBet<=this.lines.length) {
            this.linesBet += 1;
          }
        },

        decreaseLine: function() {
          if (this.linesBet>1) {
            this.linesBet -= 1;
          }
        },

        // Set up the widget
        _create: function() {

            this._initialize();
            this._setOption("animationContainer", this.options.animationContainer);
            this._setOption("winningVideo", this.options.winningVideo);
            // this._setOption("eventAggregator", this.options.eventAggregator);

        },

        // The _setOption method responds to changes to options
        // It's not called for the options passed in during widget creation
        _setOption: function(key, value) {
            switch(key) {
            case "animationContainer":
              this.animationContainer = $("#" + value);
              break;
            case "winningVideo":
              this.winningVideo = document.getElementById(value);
              break;
            // case "eventAggregator":
            //   this.eventAggregator = this.options.eventAggregator;
            //   break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        // Bind DOM objects as jQuery objects
        _initialize: function() {
          var that = this;
          this.element[0].width = this.element[0].clientWidth;
          this.element[0].height = this.element[0].clientHeight;
          this.context = this.element[0].getContext('2d');
          this.drawer = new OuterSpace.drawer(this.context, {
            origin: { x: 55, y: 58},
            offset: { x: 110, y: 116}
          });
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

        _randomAnimationType: function() {
          var type = Math.floor(Math.random()*2);
          switch (type) {
            case 0:
              return "rotate";
            case 1:
              return "enlarge";
          }
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
            this.isAnimating = true;
            this.isSpinning = false;
            eventAggregator.trigger("slot:stop");
            this._checkResult();
            this._animateResult();         
          }
        },

        _animateResult: function () {
          // if result checked
          if (this.isResultChecked) {
            if (this.element.queue("win").length > 0) {
              eventAggregator.trigger("slot:win");
              this.element.dequeue("win");
            }
            else {
              eventAggregator.trigger("slot:sad");
              this.isAnimating = false;
            }
          }
          else {
            this._animateResult();
          }
        },

        _checkResult: function() {
          var that = this;
          this.isAnimating = true;

          /* check if this bottlenecks performance in the future - 2012.11.19 */
          // var winLines = [];
          // for each line
          for (var i=0; i<this.linesBet; i++) {
            // for each reel
            var matchedCounter;
            var icon;
            for (var j=0; j<5; j++) {
              var line = [{position: this.lines[i][0], win: false},
                        {position: this.lines[i][1], win: false},
                        {position: this.lines[i][2], win: false},
                        {position: this.lines[i][3], win: false},
                        {position: this.lines[i][4], win: false}];
              line[j].win = true;
              matchedCounter = 1;
              for (var k=j+1; k<5; k++) {
                if (this.icons[j][this.lines[i][j]] === this.icons[k][this.lines[i][k]]) {
                  line[k].win = true;
                  matchedCounter += 1;
                }
              }
              if (matchedCounter>2) {
                icon = this.icons[j][this.lines[i][j]];
                // queue winning animations
                (function(line, icon){
                  var type = that._randomAnimationType();
                  that.element.queue("win", function(){
                    that._animateWin(line, type);
                  });
                  that.element.queue("win", function(){
                    that._animateWin(line, type);
                  });
                  that.element.queue("win", function(){
                    that._showIconAnimation(icon);
                  });
                })(line, icon);
                break;
              }
            }

          }

          this.isResultChecked = true;

        },

        _animateWin: function(line, type) {
          if (this.isAnimating) {
            requestAnimationFrame(this._animateWin.bind(this, line, type));
            // clear canvas
            this.context.clearRect(0,0, this.element[0].width, this.element[0].height);
            // draw line
            var l = [];
            for (var j=0; j<5; j++) {
              l[j] = 2 - line[j].position;
            }
            this.drawer.drawLine(l);
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
            // clear canvas
            this.context.clearRect(0,0, this.element[0].width, this.element[0].height);
            for (var i = 0; i<5; i++) {
              this.reels[i].drawResult();
            }
            if (this.element.queue("win").length > 0) {
              this.isAnimating = true;
              this.element.dequeue("win");
            } else {
              eventAggregator.trigger("slot:stop");
            }
          }
        },

        _showIconAnimation: function(icon) {
          var that = this;
          if(this.winningVideo) {
            this.winningVideo.play();
          }
          this.animationContainer.addClass("icon" + icon)
            .show()
            .delay(1500)
            .hide(500, function(){
              that.animationContainer.removeClass("icon" + icon);
              that.element.dequeue("win");

            if (that.element.queue("win").length < 1) {
              that.isAnimating = false;
            }
          });
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);
        }

    });

}(jQuery));