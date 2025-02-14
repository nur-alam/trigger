import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const Canvas = () => {
	const [items, setItems] = useState([]); // List of draggable items
	const [selectedIndex, setSelectedIndex] = useState(null); // Index of the selected item
	const [snapGuides, setSnapGuides] = useState({ vertical: null, horizontal: null }); // Rulers for alignment
	const canvasRef = useRef(null);

	const handleDrop = (e) => {
		e.preventDefault();

		try {
			const data = e.dataTransfer.getData('application/json');
			if (!data) return;

			const newItem = JSON.parse(data);

			const rect = canvasRef.current.getBoundingClientRect();
			const newPosition = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};

			setItems((prev) => [
				...prev,
				{
					...newItem,
					position: newPosition,
					size: { width: 200, height: 100 }, // Default size
				},
			]);
		} catch (error) {
			console.error('Error parsing dropped item:', error);
		}
	};

	const updateItem = (index, updates) => {
		setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
	};

	const handleDrag = (index, x, y) => {
		const rect = canvasRef.current.getBoundingClientRect();
		const canvasCenterX = rect.width / 2;
		const canvasCenterY = rect.height / 2;

		const draggedItem = { ...items[index], position: { x, y } };

		let horizontalGuide = null;
		let verticalGuide = null;

		items.forEach((item, i) => {
			if (i !== index) {
				/**
				 * Horizontal alignment
				 * Top of dragItem & Other Items
				 * while dragging top to bottom or bottom to top
				 */
				const isHorizontallyAligned = Math.abs(draggedItem.position.y - item.position.y) <= 2; // Snap threshold
				if (isHorizontallyAligned) {
					horizontalGuide = item.position.y;
					draggedItem.position.y = item.position.y; // Snap to horizontal
				}
				/** ✅
				 * Horizontal alignment
				 * Top of dragItem & bottom other items
				 */
				const isDragItemTopItemBottomAlignment =
					Math.abs(draggedItem.position.y - (item.position.y + item.size.height)) <= 1;
				if (isDragItemTopItemBottomAlignment) {
					horizontalGuide = draggedItem.position.y;
					draggedItem.position.y = item.position.y + item.size.height; // Snap to horizontal
				}
				/** ✅
				 * #Horizontal line
				 * Bottom of dragItem & top of other items
				 */
				const isDragItemTopItemBottomAlignmentEnd =
					Math.abs(draggedItem.position.y + draggedItem.size.height - item.position.y) <= 1;
				if (isDragItemTopItemBottomAlignmentEnd) {
					horizontalGuide = item.position.y;
					draggedItem.position.y = item.position.y - draggedItem.size.height; // Snap to vertical
				}

				/**
				 * Horizontal line
				 * Bottom of dragItem & bottom of other items
				 */
				const isDragItemBottomOtherItemsBottomAlignment =
					Math.abs(draggedItem.position.y + draggedItem.size.height - (item.position.y + item.size.height)) <=
					1;
				if (isDragItemBottomOtherItemsBottomAlignment) {
					horizontalGuide = item.position.y + item.size.height;
					draggedItem.position.y = item.position.y + item.size.height - draggedItem.size.height;
				}

				/** ✅
				 * Vertical alignment
				 * Left of dragItem & Other items
				 * while dragging right to left or left to right
				 */
				const isVerticallyAligned = Math.abs(draggedItem.position.x - item.position.x) <= 2; // Snap threshold
				if (isVerticallyAligned) {
					verticalGuide = item.position.x;
					draggedItem.position.x = item.position.x; // Snap to vertical
				}
				/** ✅
				 * Vertical alignment
				 * left of dragItem & right of other items
				 */
				const isDragItemLeftItemRightAlignment =
					Math.abs(draggedItem.position.x - (item.position.x + item.size.width)) <= 1;
				if (isDragItemLeftItemRightAlignment) {
					verticalGuide = item.position.x + item.size.width;
					draggedItem.position.x = item.position.x + item.size.width;
				}
				/** ✅
				 * Vertical alignment
				 * dragItem right & other items left
				 */
				const isDragItemRightItemLeftAlignment =
					Math.abs(draggedItem.position.x + draggedItem.size.width - item.position.x) <= 1;
				if (isDragItemRightItemLeftAlignment) {
					verticalGuide = item.position.x;
					draggedItem.position.x = item.position.x - draggedItem.size.width;
				}
				/** ✅
				 * Vertical alignment
				 * dragItem right & other items right
				 */
				const isDragItemRightOtherItemsRightAlignment =
					Math.abs(draggedItem.position.x + draggedItem.size.width - (item.position.x + item.size.width)) <=
					1;
				if (isDragItemRightOtherItemsRightAlignment) {
					verticalGuide = item.position.x + item.size.width;
					draggedItem.position.x = item.position.x + item.size.width - draggedItem.size.width;
				}
			}
		});

		// Check for canvas center alignment
		const itemCenterX = x + draggedItem.size.width / 2;
		const itemCenterY = y + draggedItem.size.height / 2;

		if (Math.abs(itemCenterX - canvasCenterX) <= 5) {
			verticalGuide = canvasCenterX; // Snap to vertical center of canvas
			draggedItem.position.x = canvasCenterX - draggedItem.size.width / 2;
		}

		if (Math.abs(itemCenterY - canvasCenterY) <= 5) {
			horizontalGuide = canvasCenterY; // Snap to horizontal center of canvas
			draggedItem.position.y = canvasCenterY - draggedItem.size.height / 2;
		}

		// Update the dragged item's position and snap guides
		updateItem(index, { position: draggedItem.position });
		setSnapGuides({ horizontal: horizontalGuide, vertical: verticalGuide });
	};

	const clearGuides = () => {
		setSnapGuides({ vertical: null, horizontal: null });
	};

	return (
		<div
			ref={canvasRef}
			className='canvas'
			onDrop={handleDrop}
			onDragOver={(e) => e.preventDefault()}
			onClick={() => setSelectedIndex(null)}
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				backgroundColor: '#f5f5f5',
				border: '1px solid #ccc',
			}}
		>
			{/* Render alignment rulers */}
			{snapGuides.horizontal !== null && (
				<div
					style={{
						position: 'absolute',
						top: snapGuides.horizontal,
						left: 0,
						width: '100%',
						height: '1px',
						backgroundColor: 'red',
					}}
				/>
			)}
			{snapGuides.vertical !== null && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: snapGuides.vertical,
						width: '1px',
						height: '100%',
						backgroundColor: 'red',
					}}
				/>
			)}

			{/* Render canvas items */}
			{items.map((item, index) => (
				<Rnd
					key={index}
					size={{ width: item.size.width, height: item.size.height }}
					position={{ x: item.position.x, y: item.position.y }}
					bounds='parent'
					onDrag={(e, data) => {
						handleDrag(index, data.x, data.y);
					}}
					onDragStop={clearGuides} // Clear snap guides on drag stop
					onResizeStop={(e, direction, ref, delta, position) => {
						updateItem(index, {
							size: {
								width: parseInt(ref.style.width, 10),
								height: parseInt(ref.style.height, 10),
							},
							position: position,
						});
					}}
					onClick={(e) => {
						e.stopPropagation(); // Prevent deselection on canvas click
						setSelectedIndex(index); // Select the current element
					}}
					style={{
						border: selectedIndex === index ? '2px solid blue' : 'none',
						backgroundColor: '#fff',
						cursor: 'move',
					}}
				>
					<div
						dangerouslySetInnerHTML={{ __html: item.content }}
						style={{
							width: '100%',
							height: '100%',
							color: item.style.color.textColor,
							fontFamily: item.style.typography.fontFamily,
							fontSize: `${item.style.typography.size}px`,
							lineHeight: item.style.typography.height,
							fontWeight: item.style.typography.weight,
							padding: '10px',
							boxSizing: 'border-box',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					/>
				</Rnd>
			))}
		</div>
	);
};

export default Canvas;
