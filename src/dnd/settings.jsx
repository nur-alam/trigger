import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateElement } from './store/canvasSlice';

const Settings = () => {
	return <>Settings</>;
	const dispatch = useDispatch();
	const selectedElement = useSelector((state) => state.canvas.selectedElement);
	const canvasElements = useSelector((state) => state.canvas.elements);
	// const handleStyleChange = (styleType, value) => {
	// 	dispatch(updateElement({ ...selectedElement, [styleType]: value }));
	// };

	const handleTypographyChange = (typographyType, value) => {
		let index = 0;
		const updatedObj = {
			style: {
				...selectedElement.style,
				typography: {
					...selectedElement.style.typography,
					[typographyType]: value,
				},
			},
		};
		dispatch(updateElement({ index, updatedObj }));
	};

	// const handleColorChange = (colorType, value) => {
	// 	dispatch(
	// 		updateElement({
	// 			...selectedElement,
	// 			style: {
	// 				...selectedElement.style,
	// 				color: {
	// 					...selectedElement.style.color,
	// 					[colorType]: value,
	// 				},
	// 			},
	// 		})
	// 	);
	// };

	if (!selectedElement || Object.keys(selectedElement).length === 0) return <div></div>;
	return (
		<div>
			<h3>Element Style Panel</h3>
			<div>
				<label>Font Family:</label>
				<select
					value={selectedElement.style.typography.family || 'Lexend'}
					onChange={(e) => handleTypographyChange('family', e.target.value)}
				>
					<option value='Lexend'>Lexend</option>
					<option value='Arial'>Arial</option>
					<option value='Times New Roman'>Times New Roman</option>
					{/* Add more fonts as needed */}
				</select>
			</div>
			{/* <div>
				<label>Font Weight:</label>
				<input
					type='number'
					value={selectedElement.style.typography.weight || 400}
					onChange={(e) => handleTypographyChange('weight', e.target.value)}
				/>
			</div>
			<div>
				<label>Font Size:</label>
				<input
					type='number'
					value={selectedElement.style.typography.size || 35}
					onChange={(e) => handleTypographyChange('size', e.target.value)}
				/>
			</div>
			<div>
				<label>Line Height:</label>
				<input
					type='number'
					step='0.1'
					value={selectedElement.style.typography.height || 1.4}
					onChange={(e) => handleTypographyChange('height', parseFloat(e.target.value))}
				/>
			</div>
			<div>
				<label>Letter Spacing:</label>
				<input
					type='number'
					value={selectedElement.style.typography.spacing || 0}
					onChange={(e) => handleTypographyChange('spacing', parseFloat(e.target.value))}
				/>
			</div>
			<div>
				<label>Text Color:</label>
				<input
					type='color'
					value={selectedElement.style.color.textColor || '#000000'}
					onChange={(e) => handleColorChange('textColor', e.target.value)}
				/>
			</div> */}
		</div>
	);
};

export default Settings;
