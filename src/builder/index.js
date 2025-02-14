import React from 'react';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import Canvas from './canvas';

function Builder() {
	return (
		<>
			<div className='app'>
				<Toolbar />
				<div className='main'>
					<Sidebar />
					<Canvas />
				</div>
				builder
			</div>
		</>
	);
}

export default Builder;
