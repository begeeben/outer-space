(function($) {

    // Declare static members here
    $.widget("OuterSpace.slot", {

        // Private members
        
        
        // DOM 
        // the drawing canvas
        contex: this.element.getContext('2d'),

        // These options will be used as defaults
        options: {
            
            reelUrl: null,
            blurUrl: null,
            spritePositions: [],
            maxSpeed: [],
            accelerateStep: []

        },

        spin: function() {
          

        },

        maxBet: function() {
            
        },

        // Set up the widget
        _create: function() {

            this._initialize();
            this._setOption("theme", this.options.theme);

        },

        // The _setOption method responds to changes to options
        // It's not called for the options passed in during widget creation
        _setOption: function(key, value) {
            switch(key) {
            case "theme":
                this._setTheme(value)
                break;
            }

            $.Widget.prototype._setOption.apply(this, arguments);
        },

        // Bind DOM objects as jQuery objects
        _initialize: function() {
            for(i = 0; i < 7; i++) {
                this.element.append("<div id='slot" + i + "' class='slot'></div>");
            }

            for(j = 0; j < 7; j++) {
                this.divDigits[j] = new Slot("#slot" + j, 70, 1 + j);
            }
        },

        _getFinalPosition: function() {

        },

        _stopRolling: function(slot) {
            if(this.options.theme === 1) {
                slot[0].stop(Math.round((slot[1] + 1) * 126 * (this.options.scaledHeight / 182)));
                // slot[0].stop(120);
                // $(slot.el).css("background", "url('img/1_numbers.png) repeat-y scroll 0 126px transparent");
            } else if(this.options.theme === 2) {
                slot[0].stop(Math.round((slot[1] + 1) * 100 * (this.options.scaledHeight / 146)));
            } else {
                slot[0].stop(Math.round((slot[1] + 1) * 66 * (this.options.scaledHeight / 158)));
            }
        },

        destroy: function() {
            $.Widget.prototype.destroy.call(this);
        }

    });

}(jQuery));