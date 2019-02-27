import React, { Component } from "react";
import Field from "./Field";
import Score from "./Score";
import "./App.css";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			point: 0
		};
	}

	handlerScoreIncrease = point => {
		this.setState({
			point: this.state.point + point
		});
	};

	render() {
		return (
			<div>
				<Field handlerScoreIncrease={this.handlerScoreIncrease} />
				<Score point={this.state.point} />
			</div>
		);
	}
}

export default App;
