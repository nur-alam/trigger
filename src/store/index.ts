import { configureStore } from '@reduxjs/toolkit';
import emailBuilderReducer from './slices/emailBuilderSlice';
import templatesReducer from './slices/templatesSlice';

export const store = configureStore({
	reducer: {
		emailBuilder: emailBuilderReducer,
		templates: templatesReducer,
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