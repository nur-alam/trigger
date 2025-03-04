import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement } from '../store/canvasSlice';
import FontSettings from './fontSettings';
import './font.css';

const StylePanel = () => {
	const dispatch = useDispatch();
	const selectedElements = useSelector((state) => state.canvas.selectedElements);
	const elements = useSelector((state) => state.canvas.elements);

	// Only show panel when a single element is selected
	if (selectedElements.length !== 1) return null;

	const selectedElement = elements[selectedElements[0]];
	if (!selectedElement) return null;

	const handleStyleUpdate = (category, property, value) => {
		const updatedStyle = {
			...selectedElement.style,
			[category]: {
				...selectedElement.style[category],
				[property]: value,
			},
		};
		dispatch(
			updateElement({
				index: selectedElements[0],
				updatedObj: { style: updatedStyle },
			})
		);
	};

	return (
		<div className='style-panel'>
			<h3>Style Settings</h3>

			{/* Typography Section */}
			<div className='style-section'>
				<h4>Typography</h4>
				<div className='control-group'>
					<label>Font Family</label>
					<FontSettings />
					<br />
					{/* <select
						value={selectedElement.style.typography.family}
						onChange={(e) => handleStyleUpdate('typography', 'family', e.target.value)}
					>
						<option value='Lexend'>Lexend</option>
						<option value='Arial'>Arial</option>
						<option value='Helvetica'>Helvetica</option>
					</select> */}
				</div>

				<div className='control-group'>
					<label>Font Size (px)</label>
					<input
						type='number'
						value={selectedElement.style.typography.size}
						onChange={(e) => handleStyleUpdate('typography', 'size', parseInt(e.target.value))}
					/>
				</div>

				<div className='control-group'>
					<label>Line Height</label>
					<input
						type='number'
						step='0.1'
						value={selectedElement.style.typography.height}
						onChange={(e) => handleStyleUpdate('typography', 'height', parseFloat(e.target.value))}
					/>
				</div>

				<div className='control-group'>
					<label>Font Weight</label>
					<input
						type='number'
						step='100'
						min='100'
						max='900'
						value={selectedElement.style.typography.weight}
						onChange={(e) => handleStyleUpdate('typography', 'weight', parseInt(e.target.value))}
					/>
				</div>

				<div className='control-group'>
					<label>Letter Spacing</label>
					<input
						type='number'
						step='0.1'
						value={selectedElement.style.typography.spacing}
						onChange={(e) => handleStyleUpdate('typography', 'spacing', parseFloat(e.target.value))}
					/>
				</div>
			</div>

			{/* Color Section */}
			<div className='style-section'>
				<h4>Colors</h4>
				<div className='control-group'>
					<label>Text Color</label>
					<input
						type='color'
						value={selectedElement.style.color.textColor}
						onChange={(e) => handleStyleUpdate('color', 'textColor', e.target.value)}
					/>
				</div>
			</div>

			{/* Border Section */}
			<div className='style-section'>
				<h4>Border</h4>
				<div className='control-group'>
					<label>Border Color</label>
					<input
						type='color'
						value={selectedElement.style.border?.borderColor}
						onChange={(e) => handleStyleUpdate('border', 'borderColor', e.target.value)}
					/>
				</div>

				<div className='control-group'>
					<label>Border Width (px)</label>
					<input
						type='number'
						min='0'
						value={selectedElement.style.border?.borderWidth}
						onChange={(e) => handleStyleUpdate('border', 'borderWidth', parseInt(e.target.value))}
					/>
				</div>

				<div className='control-group'>
					<label>Border Radius (px)</label>
					<input
						type='number'
						min='0'
						value={selectedElement.style.border?.borderRadius}
						onChange={(e) => handleStyleUpdate('border', 'borderRadius', parseInt(e.target.value))}
					/>
				</div>

				<div className='control-group'>
					<label>Border Style</label>
					<select
						value={selectedElement.style.border?.borderStyle}
						onChange={(e) => handleStyleUpdate('border', 'borderStyle', e.target.value)}
					>
						<option value='solid'>Solid</option>
						<option value='dashed'>Dashed</option>
						<option value='dotted'>Dotted</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default StylePanel;
