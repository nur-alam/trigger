import React from 'react';
import { useSelector } from 'react-redux';

const Settings = (props) => {
	const selectedElement = useSelector((state) => state.canvas.selectedElement);

	if (selectedElement.type === 'HEADING') {
		return 'HEADING';
	}

	if (selectedElement.type === 'TEXT') {
		return 'TEXT';
	}

	return <div>Settings</div>;
};

export default Settings;
