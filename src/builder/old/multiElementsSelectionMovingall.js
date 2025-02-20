import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

const Canvas = () => {
	const [items, setItems] = useState([]); // List of draggable items
	const [selectedIndices, setSelectedIndices] = useState([]); // Indices of selected items
	const [selectionBox, setSelectionBox] = useState(null); // Rectangle for multi-selection
	const canvasRef = useRef(null);
	const initialDragPosition = useRef(null);

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

	const handleMouseDown = (e) => {
		if (e.target !== canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		initialDragPosition.current = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};

		setSelectionBox({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			width: 0,
			height: 0,
		});
		setSelectedIndices([]); // Clear selection when clicking on canvas
	};

	const handleMouseMove = (e) => {
		if (!selectionBox) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const currentX = e.clientX - rect.left;
		const currentY = e.clientY - rect.top;

		setSelectionBox((prev) => ({
			x: Math.min(initialDragPosition.current.x, currentX),
			y: Math.min(initialDragPosition.current.y, currentY),
			width: Math.abs(currentX - initialDragPosition.current.x),
			height: Math.abs(currentY - initialDragPosition.current.y),
		}));
	};

	const handleMouseUp = () => {
		if (!selectionBox) return;

		const selected = items
			.map((item, index) => {
				const itemRect = {
					x: item.position.x,
					y: item.position.y,
					width: item.size.width,
					height: item.size.height,
				};

				const isWithinSelection =
					itemRect.x < selectionBox.x + selectionBox.width &&
					itemRect.x + itemRect.width > selectionBox.x &&
					itemRect.y < selectionBox.y + selectionBox.height &&
					itemRect.y + itemRect.height > selectionBox.y;

				return isWithinSelection ? index : null;
			})
			.filter((index) => index !== null);

		setSelectedIndices(selected);
		setSelectionBox(null);
	};

	const handleDragSelected = (deltaX, deltaY) => {
		setItems((prev) =>
			prev.map((item, index) =>
				selectedIndices.includes(index)
					? {
							...item,
							position: {
								x: item.position.x + deltaX,
								y: item.position.y + deltaY,
							},
					  }
					: item
			)
		);
	};

	const getBoundingRectangle = () => {
		if (selectedIndices.length === 0) return null;

		const selectedItems = selectedIndices.map((index) => items[index]);
		const minX = Math.min(...selectedItems.map((item) => item.position.x));
		const minY = Math.min(...selectedItems.map((item) => item.position.y));
		const maxX = Math.max(...selectedItems.map((item) => item.position.x + item.size.width));
		const maxY = Math.max(...selectedItems.map((item) => item.position.y + item.size.height));

		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY,
		};
	};

	const boundingRect = getBoundingRectangle();

	const resizeHandleCss = (isLocked = false) => {
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

	return (
		<div
			ref={canvasRef}
			className='canvas'
			onDrop={handleDrop}
			onDragOver={(e) => e.preventDefault()}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			style={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				backgroundColor: '#f5f5f5',
				border: '1px solid #ccc',
			}}
		>
			{/* Selection Box */}
			{selectionBox && (
				<div
					style={{
						position: 'absolute',
						top: selectionBox.y,
						left: selectionBox.x,
						width: selectionBox.width,
						height: selectionBox.height,
						border: '1px dashed blue',
						backgroundColor: 'rgba(0, 0, 255, 0.1)',
					}}
				/>
			)}

			{/* Bounding Rectangle */}
			{boundingRect && selectedIndices.length > 1 && (
				<Rnd
					size={{ width: boundingRect.width, height: boundingRect.height }}
					position={{ x: boundingRect.x, y: boundingRect.y }}
					bounds='parent'
					enableResizing={false}
					onDrag={(e, data) => {
						handleDragSelected(data.deltaX, data.deltaY);
					}}
					style={{
						border: '2px solid blue',
						backgroundColor: 'rgba(0, 0, 255, 0.1)',
						zIndex: 10,
					}}
				/>
			)}

			{/* Canvas Items */}
			{items.map((item, index) => (
				<Rnd
					key={index}
					size={{ width: item.size.width, height: item.size.height }}
					position={{ x: item.position.x, y: item.position.y }}
					bounds='parent'
					enableResizing={selectedIndices.length === 1 && selectedIndices[0] === index}
					resizeHandleStyles={resizeHandleCss()}
					onDragStop={(e, data) => {
						updateItem(index, { position: { x: data.x, y: data.y } });
					}}
					onResizeStop={(e, direction, ref, delta, position) => {
						updateItem(index, {
							size: {
								width: parseInt(ref.style.width, 10),
								height: parseInt(ref.style.height, 10),
							},
							position,
						});
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
