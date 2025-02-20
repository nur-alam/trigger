import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';

// Resize handle styles
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

const UNDO_LIMIT = 2; // Maximum number of undo states

const Canvas = () => {
	const [items, setItems] = useState([]); // List of draggable items
	const [selectedIndices, setSelectedIndices] = useState([]); // Indices of selected items
	const [selectionBox, setSelectionBox] = useState(null); // Rectangle for multi-selection
	const [snapLines, setSnapLines] = useState([]); // Snap lines
	const [undoStack, setUndoStack] = useState([]); // Stack for undo
	const [redoStack, setRedoStack] = useState([]); // Stack for redo
	const canvasRef = useRef(null);
	const initialDragPosition = useRef(null);

	// Helper function to save the current state to the undo stack
	const saveStateToUndoStack = (currentItems) => {
		setUndoStack((prev) => {
			const newStack = [...prev, currentItems];
			// Remove the oldest state if the stack exceeds the undo limit
			if (newStack.length > UNDO_LIMIT) {
				newStack.shift(); // Remove the first element (oldest state)
			}
			return newStack;
		});
		setRedoStack([]); // Clear redo stack when a new action is performed
	};

	// Handle undo
	const handleUndo = () => {
		if (undoStack.length === 0) return; // Nothing to undo

		const previousState = undoStack[undoStack.length - 1]; // Get the last state
		setRedoStack((prev) => {
			const newRedoStack = [...prev, items];
			// Ensure redo stack does not exceed the undo limit
			if (newRedoStack.length > UNDO_LIMIT) {
				newRedoStack.shift(); // Remove the oldest redo state
			}
			return newRedoStack;
		});
		setItems(previousState); // Restore previous state
		setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state from undo stack
	};

	// Handle redo
	const handleRedo = () => {
		if (redoStack.length === 0) return; // Nothing to redo

		const nextState = redoStack[redoStack.length - 1]; // Get the next state
		setUndoStack((prev) => {
			const newUndoStack = [...prev, items];
			// Ensure undo stack does not exceed the undo limit
			if (newUndoStack.length > UNDO_LIMIT) {
				newUndoStack.shift(); // Remove the oldest undo state
			}
			return newUndoStack;
		});
		setItems(nextState); // Restore next state
		setRedoStack((prev) => prev.slice(0, -1)); // Remove the last state from redo stack
	};

	// Handle drop (add new item)
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

			saveStateToUndoStack(items); // Save current state before updating

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

	// Update item (drag, resize, etc.)
	const updateItem = (index, updates) => {
		setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)));
	};

	// Handle mouse down for selection box
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

	// Handle mouse move for selection box
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

	// Handle mouse up for selection box
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

	// Handle drag of selected items
	const handleDragSelected = (deltaX, deltaY) => {
		saveStateToUndoStack(items); // Save current state before updating
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

	// Handle resize of an item
	const handleResizeStop = (index, ref, position) => {
		saveStateToUndoStack(items); // Save current state before updating
		updateItem(index, {
			size: {
				width: parseInt(ref.style.width, 10),
				height: parseInt(ref.style.height, 10),
			},
			position,
		});
	};

	// Handle drag of an item
	const handleDrag = (index, data) => {
		const draggedItem = items[index];
		const newPosition = { x: data.x, y: data.y };
		const snapThreshold = 1; // Distance to snap

		const newSnapLines = [];

		items.forEach((item, i) => {
			if (i !== index) {
				// Check horizontal snap lines
				if (Math.abs(newPosition.x - item.position.x) < snapThreshold) {
					newPosition.x = item.position.x;
					newSnapLines.push({ x: item.position.x, y1: 0, y2: '100%' });
				}
				if (
					Math.abs(newPosition.x + draggedItem.size.width - (item.position.x + item.size.width)) <
					snapThreshold
				) {
					newPosition.x = item.position.x + item.size.width - draggedItem.size.width;
					newSnapLines.push({ x: item.position.x + item.size.width, y1: 0, y2: '100%' });
				}
				if (
					Math.abs(newPosition.x + draggedItem.size.width / 2 - (item.position.x + item.size.width / 2)) <
					snapThreshold
				) {
					newPosition.x = item.position.x + item.size.width / 2 - draggedItem.size.width / 2;
					newSnapLines.push({ x: item.position.x + item.size.width / 2, y1: 0, y2: '100%' });
				}

				// Check vertical snap lines
				if (Math.abs(newPosition.y - item.position.y) < snapThreshold) {
					newPosition.y = item.position.y;
					newSnapLines.push({ y: item.position.y, x1: 0, x2: '100%' });
				}
				if (
					Math.abs(newPosition.y + draggedItem.size.height - (item.position.y + item.size.height)) <
					snapThreshold
				) {
					newPosition.y = item.position.y + item.size.height - draggedItem.size.height;
					newSnapLines.push({ y: item.position.y + item.size.height, x1: 0, x2: '100%' });
				}
				if (
					Math.abs(newPosition.y + draggedItem.size.height / 2 - (item.position.y + item.size.height / 2)) <
					snapThreshold
				) {
					newPosition.y = item.position.y + item.size.height / 2 - draggedItem.size.height / 2;
					newSnapLines.push({ y: item.position.y + item.size.height / 2, x1: 0, x2: '100%' });
				}
			}
		});

		updateItem(index, { position: newPosition });
		setSnapLines(newSnapLines);
	};

	// Handle drag stop
	const handleDragStop = (index) => {
		setSnapLines([]);
		saveStateToUndoStack(items); // Save the final state after dragging ends
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
			{/* Undo/Redo Buttons */}
			<div
				style={{
					position: 'absolute',
					top: '10px',
					left: '10px',
					zIndex: 100,
					display: 'flex',
					gap: '10px',
				}}
			>
				<button onClick={handleUndo} disabled={undoStack.length === 0}>
					Undo
				</button>
				<button onClick={handleRedo} disabled={redoStack.length === 0}>
					Redo
				</button>
			</div>

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

			{/* Snap Lines */}
			{snapLines.map((line, index) => (
				<div
					key={index}
					style={{
						position: 'absolute',
						top: line.y !== undefined ? line.y : 0,
						left: line.x !== undefined ? line.x : 0,
						width: line.x !== undefined ? '1px' : '100%',
						height: line.y !== undefined ? '1px' : '100%',
						backgroundColor: 'red',
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
					resizeHandleStyles={resizeHandleCss()}
					onDrag={(e, data) => handleDrag(index, data)}
					onDragStop={() => handleDragStop(index)} // Save state only when drag ends
					onResizeStop={(e, direction, ref, delta, position) => {
						handleResizeStop(index, ref, position);
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
