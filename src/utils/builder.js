export const getSnapLines = (canvasElements, draggedElement, index, newPosition, snapThreshold, canvasWidth) => {
	const newSnapLines = [];
	canvasElements.forEach((item, i) => {
		if (i !== index) {
			// Check horizontal snap lines
			if (Math.abs(newPosition.x - item.position.x) < snapThreshold) {
				newPosition.x = item.position.x;
				newSnapLines.push({ x: item.position.x, y1: 0, y2: '100%' });
			}
			if (
				Math.abs(newPosition.x + draggedElement.size.width - (item.position.x + item.size.width)) <
				snapThreshold
			) {
				newPosition.x = item.position.x + item.size.width - draggedElement.size.width;
				newSnapLines.push({ x: item.position.x + item.size.width, y1: 0, y2: '100%' });
			}
			if (
				Math.abs(newPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
				snapThreshold
			) {
				newPosition.x = item.position.x + item.size.width / 2 - draggedElement.size.width / 2;
				newSnapLines.push({ x: item.position.x + item.size.width / 2, y1: 0, y2: '100%' });
			}

			// Check vertical snap lines
			if (Math.abs(newPosition.y - item.position.y) < snapThreshold) {
				newPosition.y = item.position.y;
				newSnapLines.push({ y: item.position.y, x1: 0, x2: '100%' });
			}
			if (
				Math.abs(newPosition.y + draggedElement.size.height - (item.position.y + item.size.height)) <
				snapThreshold
			) {
				newPosition.y = item.position.y + item.size.height - draggedElement.size.height;
				newSnapLines.push({ y: item.position.y + item.size.height, x1: 0, x2: '100%' });
			}
			if (
				Math.abs(newPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)) <
				snapThreshold
			) {
				newPosition.y = item.position.y + item.size.height / 2 - draggedElement.size.height / 2;
				newSnapLines.push({ y: item.position.y + item.size.height / 2, x1: 0, x2: '100%' });
			}

			// Horizontally & vertically center
			// const isHorizontallyAligned = Math.abs(draggedElement.position.y - item.position.y) <= 5; // Snap threshold
			// const isVerticallyAligned = Math.abs(draggedElement.position.x - item.position.x) <= 5; // Snap threshold

			// const isHorizontallyAligned =
			// 	Math.abs(draggedElement.position.x + draggedElement.size.width / 2 - canvasWidth / 2) <= 5; // Snap threshold
			// if (isHorizontallyAligned) {
			// 	console.log('isHorizontallyAligned', isHorizontallyAligned);
			// 	// horizontalGuide = item.position.y;
			// 	draggedElement.position.y = item.position.y; // Snap to horizontal
			// 	newSnapLines.push({ x: item.size.width + item.position.x, y1: 0, y2: '100%' });
			// 	console.log('newSnapLines', newSnapLines);
			// }

			// if (isVerticallyAligned) {
			// 	verticalGuide = item.position.x;
			// 	draggedItem.position.x = item.position.x; // Snap to vertical
			// }
			// if (
			// 	Math.abs(newPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(newPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(newPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(newPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)) <
			// 		snapThreshold
			// ) {
			// 	newPosition.x = item.position.x + item.size.width / 2 - draggedElement.size.width / 2;
			// 	newPosition.y = item.position.y + item.size.height / 2 - draggedElement.size.height / 2;
			// 	newSnapLines.push({ y: item.position.y + item.size.height / 2, x1: 0, x2: '100%' });
			// 	newSnapLines.push({ x: item.position.x + item.size.width / 2, y1: 0, y2: '100%' });
			// }
		}
	});
	return newSnapLines;
};

// Resize handle styles
export const resizeHandleCss = () => {
	return {
		top: {
			width: 26,
			height: 6,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: '-4px',
			left: '50%',
			transform: 'translate(-50%, 0%)',
			zIndex: 99,
		},
		bottom: {
			width: 26,
			height: 6,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: 'calc(100% - 2px)',
			left: '50%',
			transform: 'translate(-50%, 0px)',
			zIndex: 99,
		},
		left: {
			width: 26,
			height: 6,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: '50%',
			left: '-14px',
			transform: 'translate(0px, -50%) rotate(90deg)',
			zIndex: 99,
		},
		right: {
			width: 26,
			height: 6,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: '50%',
			left: 'calc(100% + 1px)',
			transform: 'translate(-50%, 0px) rotate(90deg)',
			zIndex: 99,
		},
		bottomRight: {
			width: 16,
			height: 16,
			right: '-10px',
			bottom: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		bottomLeft: {
			width: 16,
			height: 16,
			left: '-10px',
			bottom: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		topLeft: {
			width: 16,
			height: 16,
			left: '-10px',
			top: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		topRight: {
			width: 16,
			height: 16,
			right: '-10px',
			top: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
	};
};
