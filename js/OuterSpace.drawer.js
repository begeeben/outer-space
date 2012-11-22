/* draw slot lines */
OuterSpace.drawer = function(context, options) {
	this.context = context;
	// origin: top-left icon center point
	this.origin = {};
  this.origin.x = options.origin.x;
  this.origin.y = options.origin.y;
  this.offset = {};
  this.offset.x = options.offset.x;
  this.offset.y = options.offset.y;
  this.grad = this.context.createLinearGradient(this.origin.x, this.origin.y, this.origin.x + this.offset.x * 4, this.origin.y + this.offset.y * 2);

	this.grad.addColorStop(0, "#cb40ae");
	this.grad.addColorStop(0.2, "#ffbcf7");
	this.grad.addColorStop(0.4, "#cb40ae");
	this.grad.addColorStop(0.7, "#ffbcf7");
	this.grad.addColorStop(1, "#cb40ae");
};

OuterSpace.drawer.prototype = {

	constructor: OuterSpace.line,

	drawSelectedLines: function (lines) {
		for (var i=0; i<lines.length; i++) {
			this.drawLine(lines[i]);
		}
	},

	drawLine: function (line) {

		this.context.strokeStyle = this.grad;

		this.context.beginPath();
		this.context.moveTo(this.origin.x, this.origin.y + this.offset.y * line[0]);
		for (var i = 1; i<5; i++) {
			this.context.lineTo(this.origin.x + this.offset.x * i, this.origin.y + this.offset.y * line[i]);
		}
		this.context.lineWidth = 10;
		this.context.shadowBlur = 10;
		this.context.shadowColor = "#ffffbe";
		this.context.stroke();

		this.context.shadowBlur = 0;
	},

	drawWinningLine: function () {

	},

	drawStars: function (x, y) {

	},

	_drawStar: function (x, y, angle) {

	}
}