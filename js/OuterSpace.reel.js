OuterSpace.reel = function (context, options) {
	this.context = context;
  this.reelImg = options.reelImg;
  this.blurImg = options.blurImg;
  // http://www.w3schools.com/tags/canvas_drawimage.asp
  this.sx = options.sx;
  this.sy = options.sy;
  this.swidth = options.swidth;
  this.sheight = options.sheight;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.step = 5;
  this.speed = options.speed;
  this.iconOffset = options.iconOffset;
  this.currentIcons = options.icons;
  this.nextIcons = [];
  this.keepSpinning = false;
  this.spinningPosition = this.reelImg.height - 3 * this.iconOffset;

  this._initialize();

  alert(this.currentIcons);
};

OuterSpace.reel.prototype.start = function (icons) {
  this.nextIcons = icons;
  this.keepSpinning = true;
  // this._bounce();
  // this._animate();
};

OuterSpace.reel.prototype.stop = function () {
  this.keepSpinning = false;
  this._animateResult();
  this.currentIcons = this.nextIcons;
};

OuterSpace.reel.prototype.speedUp = function () {
  this.speed += 1;
};

OuterSpace.reel.prototype._initialize = function () {
  // this._draw(this.reelImg, this.reelImg.height - 3 * this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.currentIcons[0] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * 2, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.currentIcons[1] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.currentIcons[2] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y, this.width, this.iconOffset);
};

OuterSpace.reel.prototype._randomIcons = function () {

};

OuterSpace.reel.prototype._draw = function (img, y) {
  this.context.drawImage(img, this.sx, y, this.swidth, this.sheight, this.x, this.y, this.width, this.height);
};

OuterSpace.reel.prototype._bounce = function () {

};

OuterSpace.reel.prototype.update = function () {
  if (this.keepSpinning) {

    this._clearBackground();

    this.spinningPosition -= this.step * this.speed;
    if (this.spinningPosition <= 0) {
      this.spinningPosition += this.blurImg.height - 3 * this.iconOffset;
    }
    this._draw(this.blurImg, this.spinningPosition);
  }
};

// OuterSpace.reel.prototype._animate = function () {
//   if (this.keepRolling) {
//     requestAnimationFrame(this._animate.bind(this));

//     this._clearBackground();

//     this.rollingPosition += this.step * this.speed;
//     if (this.rollingPosition >= this.blurImg.height) {
//       this.rollingPosition -= this.blurImg.height;
//     }
//     this._draw(this.blurImg, this.rollingPosition);
//   }
// };

OuterSpace.reel.prototype._animateResult = function () {  
  this._clearBackground();
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[0] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * 2, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[1] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[2] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y, this.width, this.iconOffset);
};

OuterSpace.reel.prototype._clearBackground = function () {
  this.context.clearRect(this.x, this.y, 110, this.height); 
};

