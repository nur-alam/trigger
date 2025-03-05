import { useState, useRef, useEffect } from 'react';

const DrawingCanvas = () => {
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);
	const [drawing, setDrawing] = useState(false);
	const [shapes, setShapes] = useState([]);
	const [startPos, setStartPos] = useState(null);
	const [currentShape, setCurrentShape] = useState(null);
	const [selectedShape, setSelectedShape] = useState('rectangle'); // Default shape

	// Setup canvas on mount
	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = 800;
		canvas.height = 500;
		ctxRef.current = canvas.getContext('2d');
		redrawCanvas();
	}, [shapes]);

	// Start drawing
	const handleMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;
		setStartPos({ x: offsetX, y: offsetY });
		setCurrentShape({ type: selectedShape, x: offsetX, y: offsetY, width: 0, height: 0 });
		setDrawing(true);
	};

	// Update shape while dragging
	const handleMouseMove = (e) => {
		if (!drawing) return;
		const { offsetX, offsetY } = e.nativeEvent;

		let newShape = { ...currentShape, width: offsetX - startPos.x, height: offsetY - startPos.y };

		if (selectedShape === 'circle') {
			newShape.radius = Math.sqrt(newShape.width ** 2 + newShape.height ** 2);
		}

		setCurrentShape(newShape);
		redrawCanvas(newShape);
	};

	// Save shape when finished
	const handleMouseUp = () => {
		if (currentShape) {
			setShapes([...shapes, currentShape]);
			setCurrentShape(null);
		}
		setDrawing(false);
	};

	// Redraw all stored shapes
	const redrawCanvas = (previewShape = null) => {
		const ctx = ctxRef.current;
		ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		ctx.strokeStyle = 'white';
		ctx.lineWidth = 2;

		[...shapes, previewShape].forEach((shape) => {
			if (!shape) return;
			if (shape.type === 'rectangle') {
				ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
			} else if (shape.type === 'circle') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
				ctx.stroke();
			}
		});
	};

	return (
		<div style={{ display: 'flex' }}>
			{/* Sidebar */}
			<div style={{ width: '150px', background: '#333', padding: '10px', color: 'white' }}>
				<h3>Shapes</h3>
				<button
					onClick={() => setSelectedShape('rectangle')}
					style={{
						width: '100%',
						padding: '10px',
						marginBottom: '10px',
						background: selectedShape === 'rectangle' ? '#555' : '#444',
						color: 'white',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Rectangle
				</button>
				<button
					onClick={() => setSelectedShape('circle')}
					style={{
						width: '100%',
						padding: '10px',
						background: selectedShape === 'circle' ? '#555' : '#444',
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
