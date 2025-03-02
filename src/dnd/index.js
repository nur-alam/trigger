import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Provider } from 'react-redux';
import store from './store';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import Canvas from './canvas';
import { CanvasProvider } from './Context';
import Settings from './settings';
import StylePanel from './settings';

function Builder() {
	return (
		<>
			<div className='builder'>
				<Toolbar />
				<div
					className='main'
					style={{
						display: 'grid',
						gridTemplateColumns: '200px 1fr 300px',
						gap: '20px',
					}}
				>
					<DndContext>
						<Provider store={store}>
							<Sidebar />
							<Canvas />
							{/* <Settings /> */}
							<StylePanel />
						</Provider>
					</DndContext>
				</div>
				{/* <div className='main'>
					<DndContext>
						<CanvasProvider>
							<Sidebar />
							<Canvas />
						</CanvasProvider>
					</DndContext>
				</div> */}
			</div>
		</>
	);
}

export default Builder;
