import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import elements from './elements';
import { DragOverlay, useDndMonitor, useDraggable } from '@dnd-kit/core';
import { CanvasContext } from './Context';
import { useSelector } from 'react-redux';

const DraggableItem = ({ index, elementsKey, label, element }) => {
	const { attributes, setNodeRef, listeners, transform, isDragging } = useDraggable({
		id: label,
		data: {
			element: element,
			index: index, // index of elements list of redux store
			key: elementsKey, // key of elements object from elements list in elements/index.js
		},
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: {};

	if (isDragging)
		return (
			<div
				style={{
					width: 'max-content',
					height: 'max-content',
					padding: '10px',
					backgroundColor: 'blue',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'grab',
					zIndex: 10,
					color: 'white',
					position: 'relative',
				}}
			>
				{label}
			</div>
		);

	return (
		<>
			<div
				ref={setNodeRef}
				{...listeners}
				{...attributes}
				style={{
					...style,
					width: 'max-content',
					height: 'max-content',
					padding: '10px',
					backgroundColor: 'lightblue',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'grab',
					zIndex: 10,
					position: 'relative',
				}}
			>
				{label}
			</div>
		</>
	);
};

const Sidebar = () => {
	const [activeItem, setActiveItem] = useState(null);
	useDndMonitor({
		onDragStart: (event) => {
			setActiveItem(event.active.data.current);
		},
	});

	return (
		<div
			className='sidebar'
			style={{
				background: '#f5f5f5',
				display: 'flex',
				gap: '20px',
				padding: '8px 0px 8px 10px',
				border: '2px solid rgb(221, 221, 221)',
				width: '90%',
			}}
		>
			{Object.keys(elements).map((key, index) => (
				<div
					key={index}
					className={`draggable-item`}
					// onPointerDown={() => handleClick(elements[key])}
				>
					<DraggableItem
						elementsKey={key}
						index={index}
						label={elements[key].label}
						element={elements[key]}
					/>
				</div>
			))}
			{activeItem &&
				createPortal(
					<DragOverlay dropAnimation={null}>
						<DraggableItem
							elementsKey={activeItem.key}
							index={activeItem.index}
							label={elements[activeItem.key].label}
							element={elements[activeItem.key]}
						/>
					</DragOverlay>,
					document.body
				)}
		</div>
	);
};

export default Sidebar;
