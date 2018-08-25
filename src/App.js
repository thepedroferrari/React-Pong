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
}

class Ball extends Rectangle {
	constructor() {
		super(20, 20); // Size of the Rectangle
		this.velocity = new Vector();
	}
}

class App extends Component {
	// state = {
	// 	lastTime: null
	// };
	componentDidMount() {
		// Set the back canvas
		this.canvas = this.refs.pong;
		this.context = this.canvas.getContext('2d');

		// Set the Ball
		this.ball = new Ball();
		this.ball.velocity.x = -200;
		this.ball.velocity.y = 1;
		this.ball.position.x = this.canvas.width / 2;
		this.ball.position.y = this.canvas.height / 2;

		// Setup the animation
		//this.setState({ lastTime: 0 });
		this.callback(100);
	}

	invert(num) {
		return -Math.abs(num);
	}

	componentDidUpdate() {}

	update(deltaTime) {
		this.ball.position.x += this.ball.velocity.x * deltaTime;
		this.ball.position.y += this.ball.velocity.y * deltaTime;

		// Prevent going outside canvas
		/* if (this.ball.position.x < 0) {
			this.ball.velocity.x = -this.ball.velocity.x;
			console.log(this.ball.velocity.x);
		} */
		/* if (this.ball.position.y < 0 || this.ball.position.y > this.canvas.height) {
			console.log(this.ball.velocity.y);
			this.ball.velocity.y = this.ball.velocity.y * -1;
		} */

		// Re-Paint Context
		this.context.fillStyle = 'black';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Re-Paint updated Ball
		this.context.fillStyle = 'white';
		this.context.fillRect(this.ball.position.x, this.ball.position.y, this.ball.size.x, this.ball.size.y);

		this.lastTime = null;
	}

	callback = (milliseconds) => {
		if (this.lastTime) {
			this.update((milliseconds - this.lastTime) / 1000);
		}
		this.lastTime = milliseconds;
		requestAnimationFrame(this.callback);
	};

	render() {
		return (
			<React.Fragment>
				<h1>Pong</h1>
				<canvas id="pong" ref="pong" width={1200} height={800} />
				{this.callback()}
			</React.Fragment>
		);
	}
}

export default App;
