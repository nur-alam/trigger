import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

	const [filteredFonts, setFilteredFonts] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedFont, setSelectedFont] = useState('');

	useEffect(() => {
		setSelectedFont(selectedElement.style.typography.family);
		setFilteredFonts(
			fonts.items.filter((font) => {
				return font.family.toLowerCase().includes(searchTerm.toLowerCase());
			})
		);
	}, [searchTerm, selectedElement]);

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
				index: selectedElement,
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
				</div>
			</div>
		</div>
	);
};

export default FontSettings;
