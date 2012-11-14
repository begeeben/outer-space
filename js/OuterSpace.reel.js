OuterSpace.reel = function (context, options) {
	this.context = context;
	this.staticImg = new Image();
  this.staticImg.src = options.reelUrl;
  this.blurImg = new Image();
  this.blurImg.src = options.blurUrl;
  this.x = options.x;
  this.y = options.y;
};

OuterSpace.reel.prototype.start = function () {

};

OuterSpace.reel.prototype.stop = function (icon) {

};

OuterSpace.reel.prototype.bounce = function () {

};