import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
const UNDO_LIMIT = 50;

const Canvas = () => {
	const [canvasElements, setCanvasElements] = useState([]); // List of draggable items
	const canvasRef = useRef(null);
	const handleDrop = (e) => {
		e.preventDefault();
		const data = e.dataTransfer.getData('application/json');
		console.log(e.clientX, e.clientY);
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
	};

	return (
		<>
			<div
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				ref={canvasRef}
				style={{
					width: '90%',
					height: '100vh',
					position: 'relative',
					border: '2px solid rgb(221, 221, 221)',
					padding: '8px 0px 8px 10px',
				}}
			>
				{canvasElements.map((item, index) => (
					<div
						key={index}
						style={{
							position: 'absolute',
							left: item.position.x,
							top: item.position.y,
							transform: 'translate(-50%, -50%)', // Center the div
						}}
						dangerouslySetInnerHTML={{ __html: item.content }}
					></div>
				))}
			</div>
		</>
	);
};

export default Canvas;
