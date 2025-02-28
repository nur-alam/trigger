import React from 'react';
import Heading from './elements/Header/Heading';
import Text from './elements/Text/Text';

const componentMap = {
	HEADING: (props) => <Heading {...props} />,
	TEXT: (props) => <Text {...props} />,
};

const Element = (props) => {
	const { type, label } = props;
	const Component = componentMap[type];
	return <Component {...props} />;
};

export default Element;
