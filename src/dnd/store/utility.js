export const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('canvasState', serializedState);
	} catch (err) {
		console.error('Could not save state', err);
	}
};

export const loadState = () => {
	try {
		const serializedState = localStorage.getItem('canvasState');
		if (serializedState === null) {
			return undefined;
		}
		const state = JSON.parse(serializedState);
		return {
			...state,
			canvas: {
				...state.canvas,
				selectedElements: [],
			},
		};
	} catch (err) {
		console.error('Could not load state', err);
		return undefined;
	}
};
