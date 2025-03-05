import React, { useCallback, useState } from 'react';
import fonts from './fonts/googleWebfonts.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement, updateFonts } from '../../dnd/store/canvasSlice.js';
import { Virtuoso } from 'react-virtuoso';

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

const FontSettings = ({ selectedElement }) => {
	const dispatch = useDispatch();
	const selectedElements = useSelector((state) => state.canvas.selectedElements);
	const elements = useSelector((state) => state.canvas.elements);

	const [searchTerm, setSearchTerm] = useState('');

	const [selectedFont, setSelectedFont] = useState(selectedElement.style.typography.family);
	const [fontWeight, setFontWeight] = useState('Regular');
	const [fontSize, setFontSize] = useState(35);
	const [typeSpacing, setTypeSpacing] = useState(0);
	const [lineHeight, setLineHeight] = useState(1.4);

	const getFilteredFonts = useCallback(() => {
		// console.log('fonts', fonts);
		return fonts.items.filter((font) => {
			return font.family.toLowerCase().includes(searchTerm.toLowerCase());
		});
	}, [searchTerm]);

	const filteredFonts = getFilteredFonts();

	// const filteredFonts = fonts.items.filter((font) => {
	// 	return font.family.toLowerCase().includes(searchTerm.toLowerCase());
	// });

	const handleSearch = (e) => {
		setTimeout(() => {
			setSearchTerm(e.target.value);
		}, 500);
	};

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
				<input type='text' placeholder='Search font' className='search-bar' onKeyUp={(e) => handleSearch(e)} />
				<div>
					<strong>{selectedFont}</strong>
				</div>
				<div className='font-options'>
					<Virtuoso
						data={filteredFonts}
						style={{ height: '300px' }}
						data={filteredFonts}
						totalCount={filteredFonts?.length}
						itemContent={(index, font) => {
							return (
								<div
									key={index}
									className={`font-item ${selectedFont === font.family ? 'active' : ''}`}
									onClick={() => handleClick(font)}
								>
									{font.family}
								</div>
							);
						}}
					/>
					{/* {fonts?.items?.map((font, index) => (
						<div
							key={index}
							className={`font-item ${selectedFont === font ? 'active' : ''}`}
							onClick={() => handleClick(font)}
						>
							{font?.family}
						</div>
					))} */}
				</div>
			</div>
		</div>
	);
};

export default FontSettings;
