import React, { useEffect, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import Canvas from './canvas';
import StylePanel from './stylepanel/stylepanel';
import { deSelectElement } from './store/canvasSlice';

function Builder() {
	const dispatch = useDispatch();
	const fonts = useSelector((state) => state.canvas.fonts);

	const selectedElements = useSelector((state) => state.canvas.selectedElements);

	const generateFontUrlString = (fonts) => {
		return Object.values(fonts)?.join(' ');
	};

	useEffect(() => {
		// const handleCanvasOutsideClick = (e) => {
		// 	if (e.target.closest('.builder') === null) {
		// 		dispatch(deSelectElement());
		// 	}
		// };
		// document.addEventListener('click', handleCanvasOutsideClick);
		// return () => {
		// 	document.removeEventListener('click', handleCanvasOutsideClick);
		// };
	}, []);

	return (
		<>
			<style>{generateFontUrlString(fonts)}</style>
			<div className='builder'>
				<Toolbar />
				<div
					className='main'
					style={{
						display: 'grid',
						gridTemplateColumns: '200px 1fr 300px',
					}}
				>
					<DndContext>
						<Sidebar />
						<Canvas />
						<StylePanel />
					</DndContext>
				</div>
			</div>
		</>
	);
}

export default Builder;
