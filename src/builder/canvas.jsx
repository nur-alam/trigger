import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { resizeHandleCss } from '@utils/builder';

const Canvas = () => {
	const [canvasElements, setCanvasElements] = useState([]); // List of draggable items indices
	const [selectedElements, setSelectedElements] = useState([]); // List of selected items indices
	const [selectionBox, setSelectionBox] = useState(null);
	const canvasRef = useRef(null);
	const initialDragPosition = useRef(null);

	/**
	 * Handles the drop event on the canvas.
	 *
	 * @param {DragEvent} e - The drag event object.
	 * @returns {void}
	 */
	const handleDrop = (e) => {
		e.preventDefault();
		const data = e.dataTransfer.getData('application/json');
		const droppedElement = JSON.parse(data);
		const canvasRect = canvasRef.current.getBoundingClientRect();
		const newCanvasElement = {
			...droppedElement,
			position: {
				x: e.clientX - canvasRect.left,
				y: e.clientY - canvasRect.top,
			},
		};
		setCanvasElements((prev) => [...prev, newCanvasElement]);
		canvasRef.current.style.backgroundColor = '#fff';
	};

	/**
	 *
	 * @param {number} index - index of the element to update
	 * @param {object} updates - updates to be applied to the element
	 */
	const updateElement = (index, updates) => {
		if (index < 0 || index >= canvasElements.length) {
			console.error('Invalid index for updating element');
			return;
		}
		const draggedElement = canvasElements[index];
		setCanvasElements((prev) => {
			const updatedElements = [...prev];
			updatedElements[index] = { ...draggedElement, ...updates };
			return updatedElements;
		});
	};

	/**
	 * Handles the drag event for an element
	 * @param {number} index - index of the element to update
	 * @param {object} data  - data to be applied to the element
	 */
	const handleDrag = (index, data) => {
		updateElement(index, { position: { x: data.x, y: data.y } });
	};

	/**
	 * Handles the drag stop event for an element
	 * @param {number} index - index of the element to update
	 * @param {object} data  - data to be applied to the element
	 */
	const handleDragStop = (index, data) => {
		updateElement(index, { position: { x: data.x, y: data.y } });
	};

	/**
	 * Handles the resize stop event for an element
	 * @param {number} index - index of the element to update
	 * @param {object} ref - reference to the element
	 * @param {object} delta - delta of the resize
	 * @param {object} position - position of the resize
	 */
	const handleResizeStop = (index, ref, delta, position) => {
		updateElement(index, { size: { width: ref.offsetWidth, height: ref.offsetHeight }, position });
	};

	/**
	 * Handles the mouse down event for the canvas
	 * @param {MouseDownEvent} e - event object
	 * @returns {void} - void
	 */
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

		setSelectedElements([]); // clear selection when clicking on canvas
	};

	/**
	 * Handles the mouse move event for the canvas
	 * @param {MouseMoveEvent} e - event object
	 * @returns {void} - void
	 */
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

	/**
	 * Handles the mouse up event for the canvas
	 * @returns {void} - void
	 */
	const handleMouseUp = () => {
		if (!selectionBox) return;
		const selected = canvasElements
			.map((element, index) => {
				const itemRect = {
					x: element.position.x,
					y: element.position.y,
					width: element.size.width,
					height: element.size.height,
				};

				const isWithinSelection =
					itemRect.x < selectionBox.x + selectionBox.width &&
					itemRect.x + itemRect.width > selectionBox.x &&
					itemRect.y < selectionBox.y + selectionBox.height &&
					itemRect.y + itemRect.height > selectionBox.y;

				return isWithinSelection ? index : null;
			})
			.filter((index) => index !== null);
		setSelectedElements(selected);
		setSelectionBox(null);
	};

	const getBoundingClientRect = () => {
		if (selectedElements.length === 0) return null;
		const elementsInBoundingRect = selectedElements.map((index) => canvasElements[index]);
		const minX = Math.min(...elementsInBoundingRect.map((element) => element.position.x));
		const minY = Math.min(...elementsInBoundingRect.map((element) => element.position.y));
		const maxX = Math.max(...elementsInBoundingRect.map((element) => element.position.x + element.size.width));
		const maxY = Math.max(...elementsInBoundingRect.map((element) => element.position.y + element.size.height));
		return {
			x: minX,
			y: minY,
			width: maxX - minX,
			height: maxY - minY,
		};
	};

	const boundingRect = getBoundingClientRect();

	const handleDragSelected = (deltaX, deltaY) => {
		setCanvasElements((prev) =>
			prev.map((item, index) =>
				selectedElements.includes(index)
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

	const renderComponent = (item) => {
		return item.label;
	};

	return (
		<>
			<div
				className='canvas'
				ref={canvasRef}
				onDrop={handleDrop}
				// onDragOver={(e) => e.preventDefault()}
				onDragOver={(e) => {
					e.preventDefault();
					canvasRef.current.style.backgroundColor = '#ddd';
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				style={{
					width: '90%',
					height: '100vh',
					position: 'relative',
					border: '2px solid rgb(221, 221, 221)',
					padding: '8px 0px 8px 10px',
				}}
			>
				{boundingRect && (
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

				{canvasElements.map((canvasElement, index) => (
					<Rnd
						key={index}
						size={{ width: canvasElement.size.width, height: canvasElement.size.height }}
						position={{ x: canvasElement.position.x, y: canvasElement.position.y }}
						onMouseDown={(e) => {
							e.stopPropagation();
							if (!selectedElements.includes(index)) {
								setSelectedElements([index]);
							}
						}}
						onDrag={(e, data) => handleDrag(index, data)}
						onDragStop={(e, data) => handleDragStop(index, data)}
						onResizeStop={(e, direction, ref, delta, position) => {
							handleResizeStop(index, ref, delta, position);
						}}
						enableResizing={selectedElements.length === 1 && selectedElements[0] === index}
						resizeHandleStyles={resizeHandleCss()}
						style={{
							border: selectedElements.includes(index) ? '2px solid blue' : '2px solid transparent',
							backgroundColor: '#fff',
							cursor: 'move',
						}}
						bounds='parent'
					>
						<div
							style={{
								width: '100%',
								height: '100%',
								// position: 'absolute',
								// left: canvasElement.position.x,
								// top: canvasElement.position.y,
								// transform: 'translate(-50%, -50%)', // Center the div
							}}
							dangerouslySetInnerHTML={{ __html: canvasElement.content }}
						>
							{/* {item.content} */}
							{/* {renderComponent(item)} */}
						</div>
					</Rnd>
				))}
			</div>
		</>
	);
};

export default Canvas;
