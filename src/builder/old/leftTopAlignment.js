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
		const draggedItem = { ...items[index], position: { x, y } };

		// Check for snapping to other elements
		let horizontalGuide = null;
		let verticalGuide = null;

		items.forEach((item, i) => {
			if (i !== index) {
				const isHorizontallyAligned = Math.abs(draggedItem.position.y - item.position.y) <= 5; // Snap threshold
				const isVerticallyAligned = Math.abs(draggedItem.position.x - item.position.x) <= 5; // Snap threshold

				if (isHorizontallyAligned) {
					horizontalGuide = item.position.y;
					draggedItem.position.y = item.position.y; // Snap to horizontal
				}

				if (isVerticallyAligned) {
					verticalGuide = item.position.x;
					draggedItem.position.x = item.position.x; // Snap to vertical
				}
			}
		});

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
