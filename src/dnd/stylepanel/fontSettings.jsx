import React, { useState } from 'react';
import fonts from './fonts/webfonts.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement, updateFonts } from '../../dnd/store/canvasSlice.js';

function hasNumber(myString) {
	return new RegExp(/\d/, 'g').test(myString);
}

function parseNumberAndString(str) {
	return {
		number: (str.match(new RegExp(/\d+/, 'g')) && str.match(new RegExp(/\d+/, 'g'))[0]) || 0,
		string: (str.match(new RegExp(/[a-zA-Z]+/, 'g')) && str.match(new RegExp(/[a-zA-Z]+/, 'g'))[0]) || '',
	};
}

export function createURLFromVariant(data) {
	const { family, variants } = data;
	const variantString = variants.join('');
	const hasItalic = variantString.includes('italic');
	const hasWeight = hasNumber(variantString);

	const individualStyles = variants
		.map((variant) => {
			let { number: weight, string: type } = parseNumberAndString(variant);
			if (hasWeight && (type === 'regular' || type === 'italic') && !weight) weight = 400;
			if (hasItalic) {
				if (hasWeight) return `${type === 'italic' ? 1 : 0},${weight}`;
				return `${type === 'italic' ? 1 : 0}`;
			}
			return `${weight}`;
		})
		.sort()
		.join(';');
	// https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap
	return `https://fonts.googleapis.com/css2?family=${family.split(' ').join('+')}${hasItalic ? ':ital' : ''}${
		hasItalic && hasWeight ? ',' : ''
	}${!hasItalic && hasWeight ? ':' : ''}${hasWeight ? 'wght' : ''}${
		(hasWeight || hasItalic) && individualStyles ? `@${individualStyles}` : ''
	}&display=swap`;
}

const FontSettings = () => {
	const dispatch = useDispatch();
	const selectedElements = useSelector((state) => state.canvas.selectedElements);
	const elements = useSelector((state) => state.canvas.elements);
	const [selectedFont, setSelectedFont] = useState('Lexend');
	const [fontWeight, setFontWeight] = useState('Regular');
	const [fontSize, setFontSize] = useState(35);
	const [typeSpacing, setTypeSpacing] = useState(0);
	const [lineHeight, setLineHeight] = useState(1.4);

	const selectedElement = elements[selectedElements[0]];

	const handleClick = (font) => {
		if (!selectedElement) return null;
		const updatedStyle = {
			...selectedElement.style,
			typography: {
				...selectedElement.style.typography,
				family: font.family,
			},
		};
		dispatch(
			updateElement({
				index: selectedElements[0],
				updatedObj: { style: updatedStyle },
			})
		);

		setSelectedFont(font.family);
		const googleFontUrl = `@import url(${createURLFromVariant(font)});`;
		dispatch(updateFonts({ family: font.family, fontUrl: googleFontUrl }));
	};

	return (
		<div className='font-picker'>
			{/* Font List */}
			<div className='font-list'>
				<input type='text' placeholder='Search font' className='search-bar' />
				<div>
					<strong>{selectedFont}</strong>
				</div>
				<div className='font-options'>
					{fonts?.items?.map((font, index) => (
						<div
							key={index}
							className={`font-item ${selectedFont === font ? 'active' : ''}`}
							onClick={() => handleClick(font)}
						>
							{font?.family}
						</div>
					))}
				</div>
			</div>

			{/* Font Controls */}
			<div className='font-controls'>
				<div className='control-group'>
					<label>Font Weight</label>
					<select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
						<option>Regular</option>
						<option>Bold</option>
						<option>Light</option>
					</select>
				</div>

				<div className='control-group'>
					<label>Font Size</label>
					<select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
						{[10, 15, 20, 25, 30, 35, 40].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div>

				<div className='control-group'>
					<label>Type Spacing</label>
					<input
						type='range'
						min='0'
						max='10'
						value={typeSpacing}
						onChange={(e) => setTypeSpacing(e.target.value)}
					/>
				</div>

				<div className='control-group'>
					<label>Line Height</label>
					<input
						type='range'
						min='1'
						max='2'
						step='0.1'
						value={lineHeight}
						onChange={(e) => setLineHeight(e.target.value)}
					/>
					<span>{lineHeight}</span>
				</div>
			</div>
		</div>
	);
};

export default FontSettings;
