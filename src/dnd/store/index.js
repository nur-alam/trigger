import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice';

const store = configureStore({
	reducer: {
		canvas: canvasReducer,
	},
	// devTools: process.env.NODE_ENV !== 'production',
	devTools: true,
});

export default store;
