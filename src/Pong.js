import React, { Component } from 'react';
import { numbers } from './components/Numbers';
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

class ScoreLight extends Rectangle {
	constructor(left, top) {
		super(20, 20);
		this.position.x = left;
		this.position.y = top;
	}
}

class Player extends Rectangle {
	constructor() {
		super(20, 200); //? Width and height of the player this is drawing a rectangle with dimensions x/y
		this.score = 0;
		this.matrix = numbers[this.score];
	}
}

class Sound {
	constructor(context) {
		this.context = context;
	}

	init() {
		this.oscillator = this.context.createOscillator();
		this.gainNode = this.context.createGain();

		this.oscillator.connect(this.gainNode);
		this.gainNode.connect(this.context.destination);
		this.oscillator.type = 'sine';
	}

	play(value, time) {
		this.init();

		this.oscillator.frequency.value = value;
		this.gainNode.gain.setValueAtTime(1, this.context.currentTime);

		this.oscillator.start(time);
		this.stop(time + 1);
	}

	stop(time) {
		this.gainNode.gain.exponentialRampToValueAtTime(0.000001, time + 1);
		this.oscillator.stop(time + 1);
	}
}
class Pong extends Component {
	state = {
		score: {
			player1: 0,
			player2: 0
		}
	};
	componentDidMount() {
		// Set the back canvas
		this.canvas = this.refs.pong;
		this.context = this.canvas.getContext('2d');

		// Set the Ball
		this.ball = new Ball();

		// Set the ScoreLight
		this.scoreLight = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];
		this.scoreLight[0] = new ScoreLight();
		this.scoreLight[1] = new ScoreLight();
		this.scoreLight[2] = new ScoreLight();
		this.scoreLight[3] = new ScoreLight();
		this.scoreLight[4] = new ScoreLight();
		this.scoreLight[5] = new ScoreLight();
		this.scoreLight[6] = new ScoreLight();
		this.scoreLight[7] = new ScoreLight();
		this.scoreLight[8] = new ScoreLight();
		this.scoreLight[9] = new ScoreLight();
		this.scoreLight[10] = new ScoreLight();
		this.scoreLight[11] = new ScoreLight();
		this.scoreLight[12] = new ScoreLight();
		this.scoreLight[13] = new ScoreLight();
		this.scoreLight[14] = new ScoreLight();
		this.scoreLight[15] = new ScoreLight();
		this.scoreLight[16] = new ScoreLight();
		this.scoreLight[17] = new ScoreLight();
		this.scoreLight[18] = new ScoreLight();
		this.scoreLight[19] = new ScoreLight();
		this.scoreLight[20] = new ScoreLight();
		this.scoreLight[21] = new ScoreLight();
		this.scoreLight[22] = new ScoreLight();
		this.scoreLight[23] = new ScoreLight();
		this.scoreLight[24] = new ScoreLight();
		this.scoreLight[25] = new ScoreLight();
		this.scoreLight[26] = new ScoreLight();
		this.scoreLight[27] = new ScoreLight();
		this.scoreLight[28] = new ScoreLight();
		this.scoreLight[29] = new ScoreLight();
		this.scoreLight[30] = new ScoreLight();
		this.scoreLight[31] = new ScoreLight();

		// ScoreBoard

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

	createSound = (hz, iteration, hzPerIteration) => {
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const note = new Sound(audioContext);
		const now = audioContext.currentTime;
		if (iteration) {
			for (let i = 0; i <= iteration; i++) {
				note.play(hz + i * hzPerIteration, now);
			}
		} else {
			note.play(hz, now);
		}
	};

	collide = (player, ball) => {
		if (
			player.left < ball.right &&
			player.right > ball.left &&
			player.top < ball.bottom &&
			player.bottom > ball.top
		) {
			this.createSound(200);

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

		// Create the ScoreBoard
		this.updateScore();

		// Paint the Players
		this.players.forEach((player) => {
			this.drawRectangle(player);
		});
	}

	drawRectangle(rectangle, color = rectangle.color || 'white') {
		this.context.fillStyle = color;
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
			this.printScore(0, 0);
			this.printScore(1, 0);
			this.createSound(200, 3, 100);

			/* 		note.play(293.66, now + 0.1);
			note.play(329.63, now + 0.2);
			note.play(349.23, now + 0.3);
			note.play(392.0, now + 0.4);
			note.play(440.0, now + 0.5);
			note.play(493.88, now + 0.6);
			note.play(523.25, now + 0.7); */
		}
	};

	printScore = (player, score) => {
		if (score <= 9) {
			numbers[score].forEach((line, index) => {
				let i = 0;
				line.forEach((number, idx) => {
					const left = 300 + 20 * idx + 600 * player;
					const top = 50 + 20 * index;
					this.scoreLight[i].position.x = left;
					this.scoreLight[i].position.y = top;
					this.scoreLight[i].color = 'white';

					if (number === 0) {
						this.scoreLight[i].color = 'black';
					}
					let place = i * (player + 1);
					this.drawRectangle(this.scoreLight[place]);
				});
				i++;
			});
		}
	};

	update(deltaTime) {
		this.ball.position.y += this.ball.velocity.y * deltaTime;
		this.ball.position.x += this.ball.velocity.x * deltaTime;

		// Prevent going outside canvas
		if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
			const playerId = (this.ball.velocity.x < 0) | 0;

			this.players[playerId].score++;
			const score = this.players[playerId].score;

			this.players[playerId].matrix = numbers[score];
			this.updateScore = () => {
				this.printScore(playerId, score);
			};

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
