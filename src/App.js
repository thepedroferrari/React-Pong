import React, { Component } from 'react';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
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
		return this.position.y - this.size.x / 2;
	}
	get bottom() {
		return this.position.y + this.size.x / 2;
	}
}

class Ball extends Rectangle {
	constructor() {
		super(20, 20); // Size of the Rectangle
		this.velocity = new Vector();
	}
}

class App extends Component {
	state = {
		lastTime: null
	};
	componentDidMount() {
		// Set the back canvas
		this.canvas = this.refs.pong;
		this.context = this.canvas.getContext('2d');

		// Set the Ball
		this.ball = new Ball();
		this.ball.velocity.x = -200;
		this.ball.velocity.y = 200;
		this.ball.position.x = this.canvas.width / 2;
		this.ball.position.y = this.canvas.height / 2;

		// Setup the animation
		//this.setState({ lastTime: 0 });
		this.lastTime = null;
		this.callback(1000);
	}

	componentDidUpdate() {}

	update(deltaTime) {
		this.ball.position.y += this.ball.velocity.y * deltaTime;
		this.ball.position.x += this.ball.velocity.x * deltaTime;

		// Prevent going outside canvas
		if (this.ball.left < 0 || this.ball.right > this.canvas.width) {
			this.ball.velocity.x = -this.ball.velocity.x;
		}

		if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
			this.ball.velocity.y = -this.ball.velocity.y;
		}

		// Re-Paint Context
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Re-Paint updated Ball
		this.context.fillStyle = 'white';
		this.context.fillRect(this.ball.position.x, this.ball.position.y, this.ball.size.x, this.ball.size.y);
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

	render() {
		return (
			<React.Fragment>
				<h1>Pong</h1>
				<canvas id="pong" ref="pong" width={1200} height={800} />
			</React.Fragment>
		);
	}
}

export default App;
