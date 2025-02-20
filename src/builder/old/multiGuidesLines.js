import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const ALIGN_THRESHOLD = 5; // Pixel threshold for snapping

const Canvas = () => {
	const [items, setItems] = useState([]); // Draggable items
	const [selectedIndices, setSelectedIndices] = useState([]); // Selected items
	const [alignmentGuides, setAlignmentGuides] = useState([]); // Alignment lines
	const canvasRef = useRef(null);

	const handleDrop = (e) => {
		e.preventDefault();
		const data = e.dataTransfer.getData('application/json');
		if (!data) return;

		try {
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

	const findAlignmentGuides = (draggedItem, index) => {
		const guides = [];

		items.forEach((item, i) => {
			if (i === index) return; // Skip self

			// Edges of the reference item
			const left = item.position.x;
			const right = item.position.x + item.size.width;
			const bottom = item.position.y + item.size.height;

			// Edges of the dragged item
			const draggedLeft = draggedItem.x;
			const draggedRight = draggedItem.x + draggedItem.width;
			const draggedBottom = draggedItem.y + draggedItem.height;

			// Check left alignment
			if (Math.abs(draggedLeft - left) < ALIGN_THRESHOLD) {
				guides.push({ type: 'vertical', x: left });
				draggedItem.x = left; // Snap to alignment
			}

			// Check right alignment
			if (Math.abs(draggedRight - right) < ALIGN_THRESHOLD) {
				guides.push({ type: 'vertical', x: right });
				draggedItem.x = right - draggedItem.width; // Snap to alignment
			}

			// Check bottom alignment
			if (Math.abs(draggedBottom - bottom) < ALIGN_THRESHOLD) {
				guides.push({ type: 'horizontal', y: bottom });
				draggedItem.y = bottom - draggedItem.height; // Snap to alignment
			}
		});

		setAlignmentGuides(guides);
	};

	return (
		<div
			ref={canvasRef}
			className='canvas'
			onDrop={handleDrop}
			onDragOver={(e) => e.preventDefault()}
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				backgroundColor: '#f5f5f5',
				border: '1px solid #ccc',
			}}
		>
			{/* Alignment Guides */}
			{alignmentGuides.map((guide, index) => (
				<div
					key={index}
					style={{
						position: 'absolute',
						top: guide.type === 'horizontal' ? guide.y : 0,
						left: guide.type === 'vertical' ? guide.x : 0,
						width: guide.type === 'vertical' ? '2px' : '100%',
						height: guide.type === 'horizontal' ? '2px' : '100%',
						backgroundColor: 'red',
						zIndex: 9999,
					}}
				/>
			))}

			{/* Canvas Items */}
			{items.map((item, index) => (
				<Rnd
					key={index}
					size={{ width: item.size.width, height: item.size.height }}
					position={{ x: item.position.x, y: item.position.y }}
					bounds='parent'
					enableResizing={selectedIndices.length === 1 && selectedIndices[0] === index}
					onDrag={(e, data) => {
						const newPosition = { x: data.x, y: data.y, width: item.size.width, height: item.size.height };
						findAlignmentGuides(newPosition, index);
					}}
					onDragStop={(e, data) => {
						updateItem(index, { position: { x: data.x, y: data.y } });
						setAlignmentGuides([]); // Clear guides after stopping
					}}
					style={{
						border: selectedIndices.includes(index) ? '2px solid blue' : 'none',
						backgroundColor: '#fff',
						cursor: 'move',
					}}
					onMouseDown={(e) => {
						e.stopPropagation();
						if (!selectedIndices.includes(index)) {
							setSelectedIndices([index]); // Select only the clicked element
						}
					}}
				>
					<div
						dangerouslySetInnerHTML={{ __html: item.content }}
						style={{
							width: '100%',
							height: '100%',
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
