OuterSpace.reel = function (context, options) {
	this.context = context;
  this.reelImg = options.reelImg;
  this.blurImg = options.blurImg;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.step = 5;
  this.speed = options.speed;
  this.iconOffset = options.iconOffset;
  this.currentIcons = [];
  this.nextIcons = [];
  this.keepRolling = false;
  this.rollingPosition = 0;

  this._initialize();
};

OuterSpace.reel.prototype.start = function (icons) {
  this.nextIcons = icons;
  this.keepRolling = true;
  this._bounce();
  this._animate();
};

OuterSpace.reel.prototype.stop = function () {
  this.keepRolling = false;
  this._animateResult();
  this.currentIcons = this.nextIcons;
};

OuterSpace.reel.prototype.speedUp = function () {
  this.speed += 1;
};

OuterSpace.reel.prototype._initialize = function () {
  this._draw(this.reelImg, 0);
};

OuterSpace.reel.prototype._randomIcons = function () {

};

OuterSpace.reel.prototype._draw = function (img, y) {
  this.context.drawImage(img, 0, y, this.width, this.height, this.x, this.y, this.width, this.height);
};

OuterSpace.reel.prototype._bounce = function () {

};

OuterSpace.reel.prototype._animate = function () {
  if (this.keepRolling) {
    requestAnimationFrame(this._animate);

    this._clearBackground();

    this.rollingPosition += this.step * this.speed;
    if (this.rollingPosition >= this.blurImg.height) {
      this.rollingPosition -= this.blurImg.height;
    }
    this._draw(this.blurImg, this.rollingPosition);
  }
};

OuterSpace.reel.prototype._animateResult = function () {
  this.context.drawImage(this.reelImg, 0, this.nextIcons[0] * this.iconOffset, this.width, this.iconOffset, this.x, this.y + this.iconOffset * 2, this.width, this.height);
  this.context.drawImage(this.reelImg, 0, this.nextIcons[1] * this.iconOffset, this.width, this.iconOffset, this.x, this.y + this.iconOffset, this.width, this.height);
  this.context.drawImage(this.reelImg, 0, this.nextIcons[2] * this.iconOffset, this.width, this.iconOffset, this.x, this.y, this.width, this.height);
};

OuterSpace.reel.prototype._clearBackground = function () {
  this.context.clearRect(this.x, this.y, this.width, this.height); 
};

