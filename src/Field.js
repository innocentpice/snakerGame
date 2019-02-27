import React, { Component } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

const Area = Styled.div`
	width: 520px;
	height: 528px;
	border: 2px dashed yellowgreen;
	padding: 4px;
	margin: 0px auto;
	margin-top: 10em;
	position: relative;
`;

const Block = Styled.div`
	display: inline-block;
	background-color: ${props => (props.snake ? "green" : "")};
	margin: 0.5px 2px;
	width: 48px;
	height: 48px;
`;

const Apple = Styled.div`
	display: block;
	background-color: ${props => (props.show ? "red" : "")};
	margin: 22% auto;
	border-radius: 24px;
	width: 28px;
	height: 28px;
`;

const Blocks = (snake: Array = [], apple: Array = []) => {
	const check = ({ x, y }, object) => {
		return object.find(a => {
			if (a.x === x && a.y === y) {
				return true;
			}
			return false;
		});
	};
	let y, x;
	let result = [];
	for (y = 1; y <= 10; y++) {
		for (x = 1; x <= 10; x++) {
			let HaveSnake: boolean = false,
				HaveApple: boolean = false;
			if (check({ x, y }, snake)) HaveSnake = true;
			if (check({ x, y }, apple)) HaveApple = true;
			result.push(
				<Block key={`block_${y}_${x}`} snake={HaveSnake}>
					<Apple show={HaveApple} />
				</Block>
			);
		}
	}
	return result;
};

const AlertGameOver = Styled.h2`	
	display: ${props => (props.show ? "block" : "none")};
	position: absolute;
	width: 50%;
	border: 1px dotted red;
	color: red;
	top: 30%;
	left: 28%;
	text-align: center;
`;

export class Field extends Component {
	constructor(props) {
		super(props);
		const x = Math.floor(Math.random() * 10 + 1);
		const y = Math.floor(Math.random() * 10 + 1);
		this.state = {
			gameRunning: false,
			gameStatus: "start",
			speed: 1,
			moved: false,
			apple: [
				{
					x: x + 5 >= 10 ? 1 + 5 : x + 5,
					y: y + 5 >= 10 ? 1 + 5 : y + 5
				}
			],
			snake: [
				{
					x: x,
					y: y
				},
				{
					x: x >= 10 ? 1 : x + 1,
					y: y
				},
				{
					x: x + 1 >= 10 ? 1 : x + 2,
					y: y
				}
			],
			direction: ""
		};
	}
	static propTypes = {
		handlerScoreIncrease: PropTypes.func.isRequired
	};

	handlerSnakeEat = snakeHead => {
		const apple = this.state.apple[0];
		if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
			const { handlerScoreIncrease } = this.props;
			handlerScoreIncrease(5);
			const checkSnake = ({ AppleX, AppleY }, snake: Array = []) => {
				return (
					snake.find(({ x, y }) => {
						return x === AppleX && y === AppleY;
					}) !== undefined
				);
			};
			let AppleX = Math.floor(Math.random() * 10 + 1);
			let AppleY = Math.floor(Math.random() * 10 + 1);
			let snake = this.state.snake;

			while (checkSnake({ AppleX, AppleY }, snake)) {
				AppleX = Math.floor(Math.random() * 10 + 1);
				AppleY = Math.floor(Math.random() * 10 + 1);
			}

			if (snake.length <= 10) snake.push(apple);
			this.setState({
				apple: [{ x: AppleX, y: AppleY }],
				speed: this.state.speed + (this.state.speed * 5) / 100,
				snake
			});
			return true;
		}
		return false;
	};

	handlerSnakeDie = snakeHead => {
		const { snake } = this.state;
		snake.find(({ x, y }) => {
			if (snakeHead.x === x && snakeHead.y === y) {
				this.setState({
					gameStatus: "gameOver"
				});
			}
			return snakeHead.x === x && snakeHead.y === y;
		});
	};

	handlerSnakeMove = (snake, direction) => {
		snake.pop();
		const snakeHead = () => {
			let snakeHead = { ...snake[0] };
			switch (direction) {
				case "left":
					snakeHead.x -= snakeHead.x <= 1 ? -9 : 1;
					break;
				case "right":
					snakeHead.x += snakeHead.x >= 10 ? -9 : 1;
					break;
				case "up":
					snakeHead.y -= snakeHead.y <= 1 ? -9 : 1;
					break;
				case "down":
					snakeHead.y += snakeHead.y >= 10 ? -9 : 1;
					break;
				default:
			}
			return snakeHead;
		};
		this.handlerSnakeEat(snakeHead()) || this.handlerSnakeDie(snakeHead());

		snake.unshift(snakeHead());
		return snake;
	};

	running = (config = { delay: 1 }, callback: func) => {
		setTimeout(() => {
			let { snake, direction, gameStatus } = this.state;
			if (gameStatus !== "start") return false;
			if (direction !== "") snake = this.handlerSnakeMove(snake, direction);
			this.setState({ snake, moved: true, gameRunning: true });
			this.running();
		}, config.delay * (450 + this.state.speed * -1));
	};

	componentDidMount() {
		window.addEventListener("keydown", ({ code }) => {
			if (this.state.moved === true) {
				switch (code) {
					case "ArrowLeft":
						if (this.state.direction !== "right")
							this.setState({ direction: "left", moved: false });
						break;
					case "ArrowRight":
						if (this.state.direction !== "left")
							this.setState({ direction: "right", moved: false });
						break;
					case "ArrowUp":
						if (this.state.direction !== "down")
							this.setState({ direction: "up", moved: false });
						break;
					case "ArrowDown":
						if (this.state.direction !== "up")
							this.setState({ direction: "down", moved: false });
						break;
					default:
				}
			}
		});
		this.running();
	}

	render() {
		const { snake, apple } = this.state;
		return (
			<Area>
				<AlertGameOver show={this.state.gameStatus === "gameOver"}>
					GAME OVER
				</AlertGameOver>
				{Blocks(snake, apple)}
			</Area>
		);
	}
}

export default Field;
