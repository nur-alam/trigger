import React from 'react';

const Text = (props) => {
	const { label, content, position, size, style } = props;
	const elementStyle = {
		// Typography styles
		fontFamily: `${style.typography.family}, ${style.typography.type}`,
		fontSize: `${style.typography.size}px`,
		lineHeight: style.typography.height,
		fontWeight: style.typography.weight,
		letterSpacing: `${style.typography.spacing}px`,

		// Color styles
		color: style.color.textColor,

		// Border styles
		// borderColor: style.border.borderColor,
		// borderWidth: `${style.border.borderWidth}px`,
		// borderRadius: `${style.border.borderRadius}px`,
		// borderStyle: style.border.borderStyle,
	};

	return <div style={elementStyle}>Text</div>;
};

export default Text;
