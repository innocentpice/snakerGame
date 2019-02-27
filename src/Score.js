import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

const ScoreBoard = Styled.div`
	margin: 2em auto;
	width: 500px
	color: green;
`;

const Score = props => {
	const { point } = props;
	return <ScoreBoard>Point : {`${point}`}</ScoreBoard>;
};

Score.defaultProps = {
	point: 0
};
Score.propTypes = {
	point: PropTypes.number
};

export default Score;
