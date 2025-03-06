import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Rnd } from 'react-rnd';
import Element from './Element';
import { getSnapLines, resizeHandleCss } from '@utils/builder';
import { CanvasContext } from './Context';
import { useDispatch, useSelector } from 'react-redux';
import { addElement, updateElement, updateSelectedElement } from './store/canvasSlice';

let mousePosition;
let canvasDom;

const Canvas = () => {
	const dispatch = useDispatch();
	const canvasElements = useSelector((state) => state.canvas.elements);
	const selectedElements = useSelector((state) => state.canvas.selectedElements) || [];
	const { setNodeRef, isOver, node, rect, active, over } = useDroppable({
		id: 'canvas',
	});

	const [selectionBox, setSelectionBox] = useState(null);
	const initialDragPosition = useRef(null);
	const snapThreshold = 1; // Distance to snap
	const [snapLines, setSnapLines] = useState([]);

	useDndMonitor({
		onDragEnd: (event) => {
			const { active, over, isOver } = event;
			const { clientX, clientY } = event.activatorEvent;
			if (!isOver && over?.id !== 'canvas') return;
			const canvasRect = document.getElementById('canvas')?.getBoundingClientRect();
			if (!canvasRect) return;
			const newElement = {
				...active.data.current.element,
				position: {
					x: mousePosition.clientX - canvasRect.left - active.data.current.element.size.width / 2,
					y: mousePosition.clientY - canvasRect.top - active.data.current.element.size.height / 2,
				},
			};
			dispatch(addElement(newElement));
			dispatch(updateSelectedElement([canvasElements.length]));
		},
	});

	/**
	 * Handles the mouse down event for the canvas
	 * @param {MouseDownEvent} e - event object
	 * @returns {void} - void
	 */
	const handleMouseDown = (e) => {
		if (e.target !== canvasDom) return;
		initialDragPosition.current = {
			x: e.clientX - canvasDom.getBoundingClientRect().left,
			y: e.clientY - canvasDom.getBoundingClientRect().top,
		};
		setSelectionBox({
			x: initialDragPosition.current.x,
			y: initialDragPosition.current.y,
			width: 0,
			height: 0,
		});
		dispatch(updateSelectedElement([]));
	};

	/**
	 * Handles the mouse move event for the canvas
	 * @param {MouseMoveEvent} e - event object
	 * @returns {void} - void
	 */
	const handleMouseMove = (e) => {
		if (!selectionBox) return;
		const rect = canvasDom.getBoundingClientRect();
		const xpos = e.clientX - rect.left;
		const ypos = e.clientY - rect.top;
		setSelectionBox((prev) => ({
			x: Math.min(initialDragPosition.current.x, xpos),
			y: Math.min(initialDragPosition.current.y, ypos),
			width: Math.abs(xpos - initialDragPosition.current.x),
			height: Math.abs(ypos - initialDragPosition.current.y),
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
		dispatch(updateSelectedElement(selected));
		setSelectionBox(null);
	};

	/**
	 * Handles the mouse up event for the canvas
	 * @param {MouseEvent} e - event object
	 * @returns {void} - void
	 */
	useEffect(() => {
		canvasDom = document.getElementById('canvas');

		const handleMouseMove = (e) => {
			mousePosition = e;
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	/**
	 * Handles the drag event for an element
	 * @param {number} index - index of the element to update
	 * @param {object} data  - data to be applied to the element
	 */
	const handleDrag = (index, data) => {
		let draggedElement = canvasElements[index];
		let newPosition = { x: data.x, y: data.y };
		const updatedObj = { position: newPosition };
		dispatch(updateElement({ index, updatedObj }));
		let canvasWidth = canvasDom ? canvasDom.offsetWidth : 0;
		const snapLines = getSnapLines(canvasElements, draggedElement, index, newPosition, snapThreshold, canvasWidth);
		setSnapLines(snapLines);
	};

	/**
	 * Handles the drag stop event for an element
	 * @param {number} index - index of the element to update
	 * @param {object} data  - data to be applied to the element
	 */
	const handleDragStop = (index, data) => {
		setSnapLines([]);
		const newPosition = { x: data.x, y: data.y };
		const updatedObj = { position: newPosition };
		dispatch(updateElement({ index, updatedObj }));
	};

	/**
	 * Handles the resize stop event for an element
	 * @param {number} index - index of the element to update
	 * @param {string} direction - direction of the resize
	 * @param {object} ref - reference to the element
	 * @param {object} delta - delta of the resize
	 * @param {object} position - position of the resize
	 */
	const handleResizeStop = (index, ref, delta, position) => {
		const updatedObj = { size: { width: ref.offsetWidth, height: ref.offsetHeight }, position: position };
		dispatch(updateElement({ index, updatedObj }));
	};

	/**
	 * Gets the bounding rectangle for the selected elements
	 * @returns {object} - bounding rectangle
	 */
	const getBoundingClientRect = () => {
		if (selectedElements.length < 2) return null;
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

	/**
	 * Handles dragging multiple selected elements simultaneously
	 * @param {number} deltaX - The change in x position from drag movement
	 * @param {number} deltaY - The change in y position from drag movement
	 */
	const handleDragSelected = (deltaX, deltaY) => {
		if (selectedElements.length === 0) return;
		canvasElements.forEach((element, index) => {
			if (selectedElements.includes(index)) {
				const newPosition = {
					x: element.position.x + deltaX,
					y: element.position.y + deltaY,
				};
				const updatedObj = { position: newPosition };
				dispatch(updateElement({ index, updatedObj }));
			}
		});
	};

	return (
		<>
			<div
				id='canvas'
				ref={setNodeRef}
				style={{
					width: '1000px',
					height: '700px',
					background: isOver ? '#aaa' : '#ddd',
					padding: '10px',
					position: 'relative',
				}}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				// onPointerDown={() => {
				// 	dispatch(updateSelectedElement([]));
				// }}
				// onDrop={handleDrop}
			>
				{boundingRect && selectedElements.length > 1 && (
					<Rnd
						size={{ width: boundingRect.width, height: boundingRect.height }}
						position={{ x: boundingRect.x, y: boundingRect.y }}
						bounds='parent'
						enableResizing={false}
						onDrag={(e, data) => handleDragSelected(data.deltaX, data.deltaY)}
						style={{
							border: '1px solid blue',
							backgroundColor: 'rgba(0, 0, 255, 0.1)',
							zIndex: 10,
						}}
					/>
				)}

				{selectionBox && (
					<div
						id='selection-box'
						style={{
							position: 'absolute',
							top: selectionBox.y,
							left: selectionBox.x,
							width: selectionBox.width,
							height: selectionBox.height,
							border: '1px solid blue',
							backgroundColor: 'rgba(0, 0, 255, 0.1)',
							zIndex: 10,
						}}
					/>
				)}

				{(snapLines || []).map((line, index) => (
					<div
						key={index}
						style={{
							position: 'absolute',
							top: line.y !== undefined ? line.y : 0,
							left: line.x !== undefined ? line.x : 0,
							width: line.x !== undefined ? '1px' : '100%',
							height: line.y !== undefined ? '1px' : '100%',
							backgroundColor: '#b32d2e',
						}}
					/>
				))}

				{canvasElements.map((element, index) => (
					<Rnd
						key={index}
						size={{ width: element.size.width, height: element.size.height }}
						position={{ x: element.position.x, y: element.position.y }}
						onMouseDown={(e) => {
							e.stopPropagation();
							if (!selectedElements.includes(index)) {
								dispatch(updateSelectedElement([index]));
							}
						}}
						onDrag={(e, data) => handleDrag(index, data)}
						onDragStop={(e, data) => handleDragStop(index, data)}
						onResizeStop={(e, direction, ref, delta, position) =>
							handleResizeStop(index, ref, delta, position)
						}
						enableResizing={selectedElements.length === 1 && selectedElements[0] === index}
						resizeHandleStyles={resizeHandleCss()}
						style={{
							border: selectedElements.includes(index) ? '1px solid blue' : '1px solid transparent',
							backgroundColor: 'transparent',
							cursor: 'move',
						}}
						bounds='parent'
					>
						<Element {...element} />
					</Rnd>
				))}
			</div>
		</>
	);
};

export default Canvas;
