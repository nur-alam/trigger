import React from 'react';

const Toolbar = () => {
	return (
		<div
			className='toolbar'
			style={{
				display: 'flex',
				margin: '10px',
				gap: '10px',
			}}
		>
			<button>Preview</button>
			<button>Publish</button>
			<button>Undo</button>
			<button>Redo</button>
		</div>
	);
};

export default Toolbar;
