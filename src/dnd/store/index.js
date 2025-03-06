import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice';
import { loadState, saveState } from './utility';

const preloadedState = loadState();

const store = configureStore({
	reducer: {
		canvas: canvasReducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
	preloadedState,
});

store.subscribe(() => {
	saveState(store.getState());
});

export default store;
