import { useState, useRef, useEffect } from 'react';

const DrawingCanvas = () => {
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const [drawing, setDrawing] = useState(false);
	const [shapes, setShapes] = useState([]);
	const [startPos, setStartPos] = useState(null);
	const [currentShape, setCurrentShape] = useState(null);
	const [selectedShapeType, setSelectedShapeType] = useState('rectangle'); // Default shape
	const [selectedIndex, setSelectedIndex] = useState(null); // Track selected shape index
	const [dragging, setDragging] = useState(false); // Track if dragging is active
	const [resizing, setResizing] = useState(false); // Track if resizing is active
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Track mouse offset for dragging

	// Setup canvas on mount
	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = 800;
		canvas.height = 500;
		ctxRef.current = canvas.getContext('2d');
		redrawCanvas();
	}, [shapes]);

	// Handle keydown events (e.g., delete key)
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Delete' && selectedIndex !== null) {
				// Remove the selected shape
				const updatedShapes = shapes.filter((_, index) => index !== selectedIndex);
				setShapes(updatedShapes);
				setSelectedIndex(null);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [selectedIndex, shapes]);

	// Start drawing, dragging, or resizing
	const handleMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;

		// Check if clicking on an existing shape
		const clickedShapeIndex = shapes.findIndex((shape) => {
			if (shape.type === 'rectangle') {
				return (
					offsetX >= shape.x &&
					offsetX <= shape.x + shape.width &&
					offsetY >= shape.y &&
					offsetY <= shape.y + shape.height
				);
			} else if (shape.type === 'circle') {
				const distance = Math.sqrt((offsetX - shape.x) ** 2 + (offsetY - shape.y) ** 2);
				return distance <= shape.radius;
			}
			return false;
		});

		if (clickedShapeIndex !== -1) {
			const shape = shapes[clickedShapeIndex];
			setSelectedIndex(clickedShapeIndex);

			// Check if clicking near the edges for resizing
			if (shape.type === 'rectangle') {
				const isNearRightEdge = Math.abs(offsetX - (shape.x + shape.width)) < 10;
				const isNearBottomEdge = Math.abs(offsetY - (shape.y + shape.height)) < 10;

				if (isNearRightEdge || isNearBottomEdge) {
					setResizing(true);
				} else {
					setDragging(true);
					setDragOffset({
						x: offsetX - shape.x,
						y: offsetY - shape.y,
					});
				}
			} else if (shape.type === 'circle') {
				const isNearEdge =
					Math.abs(Math.sqrt((offsetX - shape.x) ** 2 + (offsetY - shape.y) ** 2) - shape.radius) < 10;
				if (isNearEdge) {
					setResizing(true);
				} else {
					setDragging(true);
					setDragOffset({
						x: offsetX - shape.x,
						y: offsetY - shape.y,
					});
				}
			}
		} else {
			// Start drawing a new shape
			setStartPos({ x: offsetX, y: offsetY });
			setCurrentShape({ type: selectedShapeType, x: offsetX, y: offsetY, width: 0, height: 0 });
			setDrawing(true);
		}
	};

	// Update shape while drawing, dragging, or resizing
	const handleMouseMove = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;

		if (dragging && selectedIndex !== null) {
			// Update the position of the selected shape
			const updatedShapes = [...shapes];
			updatedShapes[selectedIndex] = {
				...updatedShapes[selectedIndex],
				x: offsetX - dragOffset.x,
				y: offsetY - dragOffset.y,
			};
			setShapes(updatedShapes);
			redrawCanvas();
		} else if (resizing && selectedIndex !== null) {
			// Resize the selected shape
			const updatedShapes = [...shapes];
			const shape = updatedShapes[selectedIndex];

			if (shape.type === 'rectangle') {
				shape.width = offsetX - shape.x;
				shape.height = offsetY - shape.y;
			} else if (shape.type === 'circle') {
				shape.radius = Math.sqrt((offsetX - shape.x) ** 2 + (offsetY - shape.y) ** 2);
			}

			setShapes(updatedShapes);
			redrawCanvas();
		} else if (drawing) {
			// Update the current shape being drawn
			let newShape = { ...currentShape, width: offsetX - startPos.x, height: offsetY - startPos.y };

			if (selectedShapeType === 'circle') {
				newShape.radius = Math.sqrt(newShape.width ** 2 + newShape.height ** 2);
			}

			setCurrentShape(newShape);
			redrawCanvas(newShape);
		}
	};

	// Save shape when finished or stop dragging/resizing
	const handleMouseUp = () => {
		if (currentShape) {
			setShapes([...shapes, currentShape]);
			setCurrentShape(null);
		}
		setDrawing(false);
		setDragging(false);
		setResizing(false);
	};

	// Redraw all stored shapes
	const redrawCanvas = (previewShape = null) => {
		const ctx = ctxRef.current;
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;

		[...shapes, previewShape].forEach((shape, index) => {
			if (!shape) return;

			// Draw the shape
			if (shape.type === 'rectangle') {
				ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
			} else if (shape.type === 'circle') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
				ctx.stroke();
			}

			// Highlight the selected shape
			if (index === selectedIndex) {
				ctx.strokeStyle = 'yellow';
				ctx.lineWidth = 4;
				if (shape.type === 'rectangle') {
					ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
				} else if (shape.type === 'circle') {
					ctx.beginPath();
					ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
					ctx.stroke();
				}
				ctx.strokeStyle = 'white';
				ctx.lineWidth = 2;
			}
		});
	};

	return (
		<div style={{ display: 'flex' }}>
			{/* Sidebar */}
			<div style={{ width: '150px', background: '#333', padding: '10px', color: 'white' }}>
				<h3>Shapes</h3>
				<button
					onClick={() => setSelectedShapeType('rectangle')}
					style={{
						width: '100%',
						padding: '10px',
						marginBottom: '10px',
						background: selectedShapeType === 'rectangle' ? '#555' : '#444',
						color: 'white',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Rectangle
				</button>
				<button
					onClick={() => setSelectedShapeType('circle')}
					style={{
						width: '100%',
						padding: '10px',
						background: selectedShapeType === 'circle' ? '#555' : '#444',
						color: 'white',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Circle
				</button>
			</div>

			{/* Canvas */}
			<canvas
				ref={canvasRef}
				style={{ border: '1px solid white', background: '#222', marginLeft: '10px' }}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
			/>
		</div>
	);
};

export default DrawingCanvas;
