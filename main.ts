/**
 * Encapsulate a point moving on the screen that looks aims
 * to look like a star
 */
class Star {
	// Position of the star
	x: number;
	y: number;

	// Radius of the star
	private r: number

	// Movement of the star
	private dx: number;
	private dy: number;

	// Bounds of the star
	private maxX: number;
	private maxY: number;

	/**
	 * Create a Star object
	 * @param {number} Maximum width that the star can progress to
	 * @param {number} Maximum height that the star can progress to
	 * @param {number} Radius of the star
	 */
	constructor(width: number, height: number, r: number = 5) {
		// Start with a random x and y position on the field
		this.x = Math.random() * width;
		this.y = Math.random() * height;

		// Set the stars radius
		this.r = r;

		// Give the star a random velocity between 0 and 1
		this.dx = Math.random();
		this.dy = Math.random();

		// Get the maxX and maxY the star can go to
		this.maxX = width;
		this.maxY = height;
	}

	/**
	 * Draw the stars with a gradient around them
	 * @param {CanvasRenderingContext2D} Context of the canvas to draw on
	 */
	draw(ctx: CanvasRenderingContext2D) {
		// Begin the path
		ctx.beginPath();

		// Draw a circle around the star
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

		// Finish the path
		ctx.closePath();

		// Create a gradient around the star from the middle to the radius going from
		// white to the background color
		var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
		grd.addColorStop(0, "white");
		grd.addColorStop(1, "rgb(51, 51, 51)");

		// Fill with gradient
		ctx.fillStyle = grd;
		ctx.fill();
	}

	/**
	 * Update the position of the star according to the dx and dy
	 */
	update() {
		// Check if the star is at an x extreme, if so reverse the dx
		if ((this.x + this.r / 2) >= this.maxX || (this.x - this.r / 2) <= 0) {
			this.dx *= -1;
		}

		// Check if the star is at a y extreme, if so reverse the dy
		if ((this.y + this.r / 2) >= this.maxY || (this.y - this.r / 2) <= 0) {
			this.dy *= -1;
		}

		// Update the position
		this.x += this.dx;
		this.y += this.dy;
	}

	/**
	 * Measure the Euclidian distance between two stars
	 * @param  {Star} Beginning point of the line segment to measure
	 * @param  {Star} Line segment terminal point
	 * @return {number} Distance of the line between two points
	 */
	static dist(p1: Star, p2: Star): number {
	// Calculate the square root of the sum of the squares of the differences
	// between both the x and the y components
	return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2))
}

}


class Constellations {
	// Canvas variables
	private readonly ctx: CanvasRenderingContext2D;
	private readonly canvasWidth: number;
	private readonly canvasHeight: number;

	// Array of stars to draw
	private stars: Array<Star>;

	// Max distance to draw the line
	private threshold: number;

	/**
	 * Creates a new animation and sets properties of the animation
	 * @param canvas the HTML Canvas on which to draw
	 */
	constructor(canvas: HTMLCanvasElement, numStars: number = 10, threshold: number = 100) {
		// Set the canvas variables
		this.ctx = canvas.getContext('2d');
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		
		// Set the threshold
		this.threshold = threshold;

		// Populate the stars array
		this.stars = [];
		for (let i = numStars - 1; i >= 0; i--) {
			this.stars.push(new Star(this.canvasWidth, this.canvasHeight));
		}

		// start the animation when the window is ready
		window.requestAnimationFrame(() => this.draw()); 
	}

	/**
	 * Draw step of the animation
	 */
	draw() {
		// Erase the old frame
		this.ctx.fillStyle = "rgb(51, 51, 51)";
		this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Update and draw each star
		for (var i = this.stars.length - 1; i >= 0; i--) {
			this.stars[i].update();
			this.stars[i].draw(this.ctx);
		}

		// Draw the lines between all the stars
		this.drawLines();

		// repeat the draw step when the window requests a frame
		window.requestAnimationFrame(() => this.draw()); 
	}


	drawLines() {
		for (let i = 0; i < this.stars.length - 1; i++) {
			for (let j = i + 1; j < this.stars.length; j++) {
				if (Star.dist(this.stars[i], this.stars[j]) < this.threshold) {
					// if (true) {
					this.ctx.beginPath();

					this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
					this.ctx.lineTo(this.stars[j].x, this.stars[j].y)

					let alpha = (this.threshold - Star.dist(this.stars[i], this.stars[j])) / this.threshold;

					this.ctx.closePath();
					this.ctx.strokeStyle = "rgb(225, 225, 225, " + String(alpha) + ")";
					this.ctx.stroke();
				}
			}
		}
	}
}


// Get the canvas and start the animation
const canvas = <HTMLCanvasElement>document.getElementById('canvas');
new Constellations(canvas, 50, 50);

