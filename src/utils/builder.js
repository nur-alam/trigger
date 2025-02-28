export const getSnapLines = (canvasElements, draggedElement, index, newPosition, snapThreshold, canvasWidth) => {
	const newSnapLines = [];
	const updatedPosition = { ...newPosition }; // Create a copy of newPosition
	canvasElements.forEach((item, i) => {
		if (i !== index) {
			// Check horizontal snap lines
			if (Math.abs(updatedPosition.x - item.position.x) < snapThreshold) {
				updatedPosition.x = item.position.x;
				newSnapLines.push({ x: item.position.x, y1: 0, y2: '100%' });
			}
			if (
				Math.abs(updatedPosition.x + draggedElement.size.width - (item.position.x + item.size.width)) <
				snapThreshold
			) {
				updatedPosition.x = item.position.x + item.size.width - draggedElement.size.width;
				newSnapLines.push({ x: item.position.x + item.size.width, y1: 0, y2: '100%' });
			}
			if (
				Math.abs(updatedPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
				snapThreshold
			) {
				updatedPosition.x = item.position.x + item.size.width / 2 - draggedElement.size.width / 2;
				newSnapLines.push({ x: item.position.x + item.size.width / 2, y1: 0, y2: '100%' });
			}

			// Check vertical snap lines
			if (Math.abs(updatedPosition.y - item.position.y) < snapThreshold) {
				updatedPosition.y = item.position.y;
				newSnapLines.push({ y: item.position.y, x1: 0, x2: '100%' });
			}
			if (
				Math.abs(updatedPosition.y + draggedElement.size.height - (item.position.y + item.size.height)) <
				snapThreshold
			) {
				updatedPosition.y = item.position.y + item.size.height - draggedElement.size.height;
				newSnapLines.push({ y: item.position.y + item.size.height, x1: 0, x2: '100%' });
			}
			if (
				Math.abs(
					updatedPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)
				) < snapThreshold
			) {
				updatedPosition.y = item.position.y + item.size.height / 2 - draggedElement.size.height / 2;
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
			// 	Math.abs(updatedPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(updatedPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(updatedPosition.x + draggedElement.size.width / 2 - (item.position.x + item.size.width / 2)) <
			// 		snapThreshold &&
			// 	Math.abs(updatedPosition.y + draggedElement.size.height / 2 - (item.position.y + item.size.height / 2)) <
			// 		snapThreshold
			// ) {
			// 	updatedPosition.x = item.position.x + item.size.width / 2 - draggedElement.size.width / 2;
			// 	updatedPosition.y = item.position.y + item.size.height / 2 - draggedElement.size.height / 2;
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
			height: 3,
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
			height: 3,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: 'calc(100% - 2px)',
			left: '50%',
			transform: 'translate(-50%, 0px)',
			zIndex: 99,
		},
		left: {
			width: 16,
			height: 3,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: '50%',
			left: '-11px',
			transform: 'translate(0px, -50%) rotate(90deg)',
			zIndex: 99,
		},
		right: {
			width: 16,
			height: 3,
			background: '#fff',
			border: '2px solid #6180E4',
			borderRadius: '32px',
			top: '50%',
			right: '-10px',
			transform: 'translate(0, -50%) rotate(90deg)',
			zIndex: 99,
		},
		bottomRight: {
			width: 10,
			height: 10,
			right: '-10px',
			bottom: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		bottomLeft: {
			width: 10,
			height: 10,
			left: '-10px',
			bottom: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		topLeft: {
			width: 10,
			height: 10,
			left: '-10px',
			top: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
		topRight: {
			width: 10,
			height: 10,
			right: '-10px',
			top: '-10px',
			zIndex: 99,
			border: '3px solid #FFFFFF',
			background: '#3E64DE',
			borderRadius: '50%',
		},
	};
};
