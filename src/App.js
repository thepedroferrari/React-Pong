import React, { Component } from 'react';

class App extends Component {
	componentDidMount() {
		const canvas = this.refs.pong;
		const ctx = canvas.getContext('2d');
		ctx.scale(20, 20);
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	render() {
		return (
			<React.Fragment className="test">
				<h1>Pong</h1>
				<canvas id="pong" ref="pong" width={1200} height={800} />
			</React.Fragment>
		);
	}
}

export default App;
