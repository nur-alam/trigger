import { configureStore } from '@reduxjs/toolkit';
import emailBuilderReducer from './slices/emailBuilderSlice';

export const store = configureStore({
	reducer: {
		emailBuilder: emailBuilderReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST'],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;