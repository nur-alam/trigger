import React, { useState, useRef } from 'react';
import Moveable from 'react-moveable';

const Canvas = () => {
	const [items, setItems] = useState([]); // List of draggable items
	const [selectedIndex, setSelectedIndex] = useState(null); // Index of the selected item
	const canvasRef = useRef(null);

	const handleDrop = (e) => {
		e.preventDefault();

		try {
			const data = e.dataTransfer.getData('application/json');
			if (!data) return;

			const newItem = JSON.parse(data);

			// Get drop position relative to the canvas
			const rect = canvasRef.current.getBoundingClientRect();
			const newPosition = {
				top: e.clientY - rect.top,
				left: e.clientX - rect.left,
			};

			setItems((prev) => [...prev, { ...newItem, position: newPosition }]);
		} catch (error) {
			console.error('Error parsing dropped item:', error);
		}
	};

	const handleDrag = (index, position) => {
		setItems((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, position: { top: position.top, left: position.left } } : item
			)
		);
	};

	const handleResize = (index, size) => {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, size: { width: size.width, height: size.height } } : item))
		);
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
			{items.map((item, index) => (
				<div
					key={index}
					className='canvas-item'
					style={{
						position: 'absolute',
						top: item.position.top,
						left: item.position.left,
						width: item.size.width,
						height: item.size.height,
						color: item.style.color.textColor,
						fontFamily: item.style.typography.fontFamily,
						fontSize: `${item.style.typography.size}px`,
						lineHeight: item.style.typography.height,
						fontWeight: item.style.typography.weight,
					}}
					onClick={() => setSelectedIndex(index)}
					dangerouslySetInnerHTML={{ __html: item.content }}
				/>
			))}

			{/* Moveable Component */}
			{selectedIndex !== null && (
				<Moveable
					target={document.querySelectorAll('.canvas-item')[selectedIndex]}
					container={canvasRef.current}
					draggable={true}
					resizable={true}
					throttleDrag={0}
					throttleResize={0}
					onDrag={(e) => {
						handleDrag(selectedIndex, {
							top: e.top,
							left: e.left,
						});
					}}
					onResize={(e) => {
						const width = e.width;
						const height = e.height;

						handleResize(selectedIndex, { width, height });

						// Dynamically update the size of the element
						e.target.style.width = `${width}px`;
						e.target.style.height = `${height}px`;
					}}
					keepRatio={false}
					edge={true}
				/>
			)}
		</div>
	);
};

export default Canvas;
