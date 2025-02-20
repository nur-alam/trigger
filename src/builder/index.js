import React from 'react';
import Toolbar from './toolbar';
import Sidebar from './sidebar';
import Canvas from './canvas';

function Builder() {
	return (
		<>
			<div className='builder'>
				<Toolbar />
				<div className='main'>
					<Sidebar />
					<Canvas />
				</div>
			</div>
		</>
	);
}

export default Builder;
