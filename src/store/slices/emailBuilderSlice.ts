import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailComponent, HistoryState } from '../../entries/email-builder/types';
import { saveTemplateAsync, loadTemplateAsync, fetchTemplatesAsync, deleteTemplateAsync, duplicateTemplateAsync, updateTemplateAsync } from '../thunks/emailBuilderThunks';
import { generateUniqueId } from '../../entries/email-builder/utils/helpers';

const MAX_HISTORY_SIZE = 50;

interface EmailBuilderState {
	components: EmailComponent[];
	selectedComponentId: string | null;
	activeId: string | null;
	history: HistoryState[];
	historyIndex: number;
	isLoading: boolean;
	error: string | null;
}

const initialState: EmailBuilderState = {
	components: [],
	selectedComponentId: null,
	activeId: null,
	history: [],
	historyIndex: -1,
	isLoading: false,
	error: null,
};

const getDefaultPropsForType = (type: string): Record<string, any> => {
	const defaults: Record<string, Record<string, any>> = {
		text: {
			content: 'Your text here...',
			fontSize: '16px',
			color: '#333333',
			textAlign: 'left',
			fontFamily: 'Arial, sans-serif',
			lineHeight: '1.5',
			padding: '16px',
		},
		heading: {
			content: 'Your heading here',
			level: 'h2',
			fontSize: '24px',
			color: '#333333',
			textAlign: 'left',
			fontFamily: 'Arial, sans-serif',
			fontWeight: 'bold',
			padding: '16px',
		},
		button: {
			text: 'Click Here',
			url: '#',
			backgroundColor: '#007cba',
			textColor: '#ffffff',
			borderRadius: '4px',
			padding: '12px 24px',
			fontSize: '16px',
			textAlign: 'center',
			margin: '16px',
		},
		image: {
			src: '',
			alt: 'Image',
			width: '100%',
			height: 'auto',
			textAlign: 'center',
			padding: '16px',
		},
		divider: {
			height: '1px',
			backgroundColor: '#e0e0e0',
			margin: '20px 0',
		},
		spacer: {
			height: '20px',
		},
		social: {
			platforms: ['facebook', 'twitter', 'instagram'],
			iconSize: '32px',
			spacing: '10px',
			textAlign: 'center',
			padding: '16px',
		},
		footer: {
			content: 'Copyright © 2024 Your Company. All rights reserved.',
			fontSize: '12px',
			color: '#666666',
			textAlign: 'center',
			padding: '20px',
			backgroundColor: '#f8f8f8',
		},
	};

	return defaults[type] || {};
};

const saveToHistory = (state: EmailBuilderState, newComponents: EmailComponent[], newSelectedId: string | null) => {
	const newState: HistoryState = {
		components: JSON.parse(JSON.stringify(newComponents)),
		selectedComponentId: newSelectedId,
	};

	const newHistory = state.history.slice(0, state.historyIndex + 1);
	newHistory.push(newState);

	if (newHistory.length > MAX_HISTORY_SIZE) {
		newHistory.shift();
	}

	state.history = newHistory;
	state.historyIndex = newHistory.length - 1;
};

const emailBuilderSlice = createSlice({
	name: 'emailBuilder',
	initialState,
	reducers: {
		addComponent: (state, action: PayloadAction<{ type: string; insertIndex?: number }>) => {
			const { type, insertIndex } = action.payload;
			const newComponent: EmailComponent = {
				id: generateUniqueId(),
				type,
				props: getDefaultPropsForType(type),
			};

			let newComponents: EmailComponent[];
			if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= state.components.length) {
				// Insert at specific position
				newComponents = [...state.components];
				newComponents.splice(insertIndex, 0, newComponent);
			} else {
				// Add at the end
				newComponents = [...state.components, newComponent];
			}

			saveToHistory(state, newComponents, newComponent.id);
			state.components = newComponents;
			state.selectedComponentId = newComponent.id;
		},

		updateComponent: (state, action: PayloadAction<{ id: string; updates: Partial<EmailComponent> }>) => {
			const { id, updates } = action.payload;
			const newComponents = state.components.map((component) =>
				component.id === id ? { ...component, ...updates } : component
			);

			saveToHistory(state, newComponents, state.selectedComponentId);
			state.components = newComponents;
		},

		deleteComponent: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const newComponents = state.components.filter((component) => component.id !== id);
			const newSelectedId = state.selectedComponentId === id ? null : state.selectedComponentId;

			saveToHistory(state, newComponents, newSelectedId);
			state.components = newComponents;
			state.selectedComponentId = newSelectedId;
		},

		reorderComponents: (state, action: PayloadAction<{ activeIndex: number; overIndex: number }>) => {
			const { activeIndex, overIndex } = action.payload;
			const newComponents = [...state.components];
			const [removed] = newComponents.splice(activeIndex, 1);
			newComponents.splice(overIndex, 0, removed);

			saveToHistory(state, newComponents, state.selectedComponentId);
			state.components = newComponents;
		},

		selectComponent: (state, action: PayloadAction<string | null>) => {
			state.selectedComponentId = action.payload;
		},

		setActiveId: (state, action: PayloadAction<string | null>) => {
			state.activeId = action.payload;
		},

		undo: (state) => {
			if (state.historyIndex > 0) {
				const prevState = state.history[state.historyIndex - 1];
				state.components = prevState.components;
				state.selectedComponentId = prevState.selectedComponentId;
				state.historyIndex = state.historyIndex - 1;
			}
		},

		redo: (state) => {
			if (state.historyIndex < state.history.length - 1) {
				const nextState = state.history[state.historyIndex + 1];
				state.components = nextState.components;
				state.selectedComponentId = nextState.selectedComponentId;
				state.historyIndex = state.historyIndex + 1;
			}
		},

		loadTemplate: (state, action: PayloadAction<EmailComponent[]>) => {
			const components = action.payload;
			saveToHistory(state, components, null);
			state.components = components;
			state.selectedComponentId = null;
		},

		clearComponents: (state) => {
			saveToHistory(state, [], null);
			state.components = [];
			state.selectedComponentId = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Save template
			.addCase(saveTemplateAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(saveTemplateAsync.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(saveTemplateAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to save template';
			})
			// Load template
			.addCase(loadTemplateAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loadTemplateAsync.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				const template = action.payload;
				const components = template.components;
				saveToHistory(state, components, null);
				state.components = components;
				state.selectedComponentId = null;
			})
			.addCase(loadTemplateAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to load template';
			})
			// Fetch templates
			.addCase(fetchTemplatesAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchTemplatesAsync.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(fetchTemplatesAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch templates';
			})
			// Delete template
			.addCase(deleteTemplateAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteTemplateAsync.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(deleteTemplateAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to delete template';
			})
			// Duplicate template
			.addCase(duplicateTemplateAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(duplicateTemplateAsync.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(duplicateTemplateAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to duplicate template';
			})
			// Update template
			.addCase(updateTemplateAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateTemplateAsync.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(updateTemplateAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to update template';
			});
	},
});

export const {
	addComponent,
	updateComponent,
	deleteComponent,
	reorderComponents,
	selectComponent,
	setActiveId,
	undo,
	redo,
	loadTemplate,
	clearComponents,
} = emailBuilderSlice.actions;

export default emailBuilderSlice.reducer;
