import React, { Component } from 'react';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	set length(value) {
		const factor = value / this.length;
		this.x *= factor;
		this.y *= factor;
	}
}

class Rectangle {
	constructor(w, h) {
		this.position = new Vector();
		this.size = new Vector(w, h);
	}
	get left() {
		return this.position.x - this.size.x / 2;
	}
	get right() {
		return this.position.x + this.size.x / 2;
	}
	get top() {
		return this.position.y - this.size.y / 2;
	}
	get bottom() {
		return this.position.y + this.size.y / 2;
	}
}

class Ball extends Rectangle {
	constructor() {
		super(20, 20); // Size of the Rectangle
		this.velocity = new Vector();
	}
}

class Player extends Rectangle {
	constructor() {
		super(20, 100); //? Width and height of the player this is drawing a rectangle with dimensions x/y
		this.score = 0;
	}
}

class Pong extends Component {
	componentDidMount() {
		// Set the back canvas
		this.canvas = this.refs.pong;
		this.context = this.canvas.getContext('2d');

		// Set the Ball
		this.ball = new Ball();

		// Set the Players
		this.players = [ new Player(), new Player() ];
		this.players[0].position.x = 100;
		this.players[1].position.x = this.canvas.width - 100;
		this.players.forEach((player) => (player.position.y = this.canvas.height / 2 - player.size.y / 2));

		// Setup the animation
		this.lastTime = null;
		this.callback(1000);
		this.reset();
		this.flag = false;

		// Score design (3 by 3 arrays lights on/off)
		this.CHAR_PIXEL = 10;
		this.CHARS = [
			'111101101101111',
			'010010010010010',
			'111001111100111',
			'111001111001111',
			'101101111001001',
			'111100111001111',
			'111100111101111',
			'111001001001001',
			'111101111101111',
			'111101111001111'
		];
	}

	componentDidUpdate() {}

	flagger = () => {
		// Function meant for testing
		this.flag = !this.flag;

		console.log(
			'1PLA:',
			this.players[0]
			// '1PLA Y:',
			// Math.floor(this.players[0].position.y)
		);
		console.log(
			'2PLA:',
			this.players[1]
			// '2PLA Y:',
			// Math.floor(this.players[1].position.y)
		);
		console.log('Ball', this.ball);
	};

	checkCollided(val1, val2) {
		if (val1 - val2 < 20) {
			return true;
		}
	}

	collide = (player, ball) => {
		if (
			player.left < ball.right &&
			player.right > ball.left &&
			player.top < ball.bottom &&
			player.bottom > ball.top
		) {
			this.ball.velocity.x = -this.ball.velocity.x;
			this.ball.velocity.y += 300 * (Math.random() - 0.5);
			this.ball.velocity.length *= 1.1;
		}
	};

	draw() {
		// Paint Context
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Paint updated Ball
		this.drawRectangle(this.ball);

		// Paint the Players
		this.players.forEach((player) => this.drawRectangle(player));
	}

	drawRectangle(rectangle) {
		this.context.fillStyle = 'white';
		this.context.fillRect(rectangle.left, rectangle.top, rectangle.size.x, rectangle.size.y);
	}

	reset() {
		this.ball.velocity.x = 0;
		this.ball.velocity.y = 0;
		this.ball.position.x = this.canvas.width / 2;
		this.ball.position.y = this.canvas.height / 2;
	}

	start = () => {
		if (this.ball.velocity.x === 0) {
			this.reset();
			this.ball.velocity.x = 500 * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 - 1);
			this.ball.velocity.y = 500 * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 - 1);

			this.ball.velocity.length = 500;
		}
	};

	update(deltaTime) {
		this.ball.position.y += this.ball.velocity.y * deltaTime;
		this.ball.position.x += this.ball.velocity.x * deltaTime;

		// Prevent going outside canvas
		if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
			const playerId = (this.ball.velocity.x < 0) | 0;
			this.players[playerId].score++;
			this.reset();
		}

		if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
			this.ball.velocity.y = -this.ball.velocity.y; // invert direction
		}

		// Impossible to beat AI that always follow the ball
		this.players[1].position.y = this.ball.position.y;

		// Adding Collision to each Player
		this.players.forEach((player) => this.collide(player, this.ball));

		// Paint
		this.draw();
	}

	callback = (milliseconds) => {
		let lastTime = this.lastTime || milliseconds;
		if (lastTime) {
			this.update((milliseconds - lastTime) / 1000);
		}
		lastTime = milliseconds;
		this.lastTime = milliseconds;
		requestAnimationFrame(this.callback);
	};

	handleMouseMove = (e) => {
		this.players[0].position.y = e.nativeEvent.offsetY - this.players[0].size.y * 0.36;
	};

	render() {
		return (
			<React.Fragment>
				<h1>Pong</h1>
				<canvas
					id="pong"
					ref="pong"
					width={1200}
					height={800}
					onMouseMove={this.handleMouseMove}
					onClick={this.start}
				/>
			</React.Fragment>
		);
	}
}

export default Pong;
