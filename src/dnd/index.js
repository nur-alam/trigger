import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Provider, useSelector } from 'react-redux';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import Canvas from './canvas';
import StylePanel from './stylepanel/stylepanel';

function Builder() {
	const fonts = useSelector((state) => state.canvas.fonts);

	const generateFontUrlString = (fonts) => {
		return Object.values(fonts)?.join(' ');
	};

	console.log('generateFontUrlString', Object.values(fonts).join(' '));

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
						// gap: '20px',
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
