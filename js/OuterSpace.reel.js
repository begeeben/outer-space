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

  this.keepAnimating = false;
  this.scale = 1;  // for icon scaling animation
  this.scaleStep = 0;
  this.angle = 0;       // for icon rotating animaiton

  this._initialize();

};

OuterSpace.reel.prototype.start = function (icons) {
  this.nextIcons = icons;
  this.keepSpinning = true;
  // this._bounce();
  // this._animate();
};

OuterSpace.reel.prototype.stop = function () {
  this.keepSpinning = false;
  this.drawResult();
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

OuterSpace.reel.prototype.enlarge = function (iconPosition) {
  this.scaleStep += 0.1;
  this.scale = 1 + Math.sin(this.scaleStep);
  if (this.scale > 1) {
    this.keepAnimating = true;
  }
  else {
    this.scale = 1;
    this.scaleStep = 0;
    this.keepAnimating = false;
  }
  if (this.keepAnimating) {
    this._clearBackground();
    for (var i = 0; i<3; i++) {
      if (i !== iconPosition) {
        this.context.drawImage(this.reelImg, this.sx, this.currentIcons[i] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * (2-i), this.width, this.iconOffset);
      }
    }
    this._drawScaledImg(this.reelImg, this.sx, this.currentIcons[iconPosition] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * (2-iconPosition), this.width, this.iconOffset, this.scale);
  }
};

OuterSpace.reel.prototype._drawScaledImg = function (image, sx, sy, swidth, sheight, x, y, width, height, scale) {
  // save the current co-ordinate system
  // before we screw with it
  this.context.save();
  // move to the middle of where we want to draw our image
  this.context.translate(x + swidth/2, y + sheight/2);
  // draw it up and to the left by half the width
  // and height of the image
  this.context.drawImage(image, sx, sy, swidth, sheight, -(swidth/2) * scale, -(sheight/2) * scale, width * scale, height * scale);
  // and restore the co-ords to how they were when we began
  this.context.restore(); 
};

OuterSpace.reel.prototype.rotate = function (iconPosition) {
  if (this.angle !== 360) {
    this.keepAnimating = true;
  }
  else {
    this.angle = 0;
    this.keepAnimating = false;
  }
  if (this.keepAnimating) {
    this._clearBackground();
    for (var i = 0; i<3; i++) {
      if (i !== iconPosition) {
        this.context.drawImage(this.reelImg, this.sx, this.currentIcons[i] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * (2-i), this.width, this.iconOffset);
      }
    }
    this.angle += 10;
    this._drawRotatedImg(this.reelImg, this.sx, this.currentIcons[iconPosition] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * (2-iconPosition), this.width, this.iconOffset, this.angle);
  }
};

OuterSpace.reel.prototype._drawRotatedImg = function (image, sx, sy, swidth, sheight, x, y, width, height, angle) {
  // save the current co-ordinate system
  // before we screw with it
  this.context.save();
  // move to the middle of where we want to draw our image
  this.context.translate(x + swidth/2, y + sheight/2);
  // rotate around that point, converting our
  // angle from degrees to radians
  this.context.rotate(angle * Math.PI/180);
  // draw it up and to the left by half the width
  // and height of the image
  this.context.drawImage(image, sx, sy, swidth, sheight, -(swidth/2), -(sheight/2), width, height);
  // and restore the co-ords to how they were when we began
  this.context.restore(); 
};

OuterSpace.reel.prototype.drawResult = function () {  
  this._clearBackground();
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[0] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset * 2, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[1] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y + this.iconOffset, this.width, this.iconOffset);
  this.context.drawImage(this.reelImg, this.sx, this.nextIcons[2] * this.iconOffset, this.swidth, this.iconOffset, this.x, this.y, this.width, this.iconOffset);
};

OuterSpace.reel.prototype._clearBackground = function () {
  this.context.clearRect(this.x, this.y, 110, this.height); 
};

