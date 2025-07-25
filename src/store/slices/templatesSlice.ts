import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTemplatesAsync, deleteTemplateAsync, duplicateTemplateAsync, saveTemplateAsync, updateTemplateAsync } from '../thunks/emailBuilderThunks';

interface EmailTemplate {
	id: number;
	name: string;
	description: string;
	components: any[];
	thumbnail: string;
	is_active: boolean;
	created_by: number;
	created_at: string;
	updated_at: string;
}

interface TemplatesState {
	templates: EmailTemplate[];
	total: number;
	isLoading: boolean;
	error: string | null;
	currentPage: number;
	perPage: number;
	searchTerm: string;
}

const initialState: TemplatesState = {
	templates: [],
	total: 0,
	isLoading: false,
	error: null,
	currentPage: 1,
	perPage: 10,
	searchTerm: '',
};

const templatesSlice = createSlice({
	name: 'templates',
	initialState,
	reducers: {
		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},
		setPerPage: (state, action: PayloadAction<number>) => {
			state.perPage = action.payload;
			state.currentPage = 1; // Reset to first page when changing per page
		},
		setSearchTerm: (state, action: PayloadAction<string>) => {
			state.searchTerm = action.payload;
			state.currentPage = 1; // Reset to first page when searching
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch templates
			.addCase(fetchTemplatesAsync.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchTemplatesAsync.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.templates = action.payload.templates || [];
				state.total = action.payload.total || 0;
			})
			.addCase(fetchTemplatesAsync.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || 'Failed to fetch templates';
			})
			// Save template
			.addCase(saveTemplateAsync.fulfilled, (state, action) => {
				// Add the new template to the list
				state.templates.unshift(action.payload);
				state.total += 1;
			})
			// Update template
			.addCase(updateTemplateAsync.fulfilled, (state, action) => {
				// Update the template in the list
				const index = state.templates.findIndex(template => template.id === action.payload.id);
				if (index !== -1) {
					state.templates[index] = action.payload;
				}
			})
			// Delete template
			.addCase(deleteTemplateAsync.fulfilled, (state, action) => {
				// Remove the template from the list
				const templateId = Number(action.meta.arg);
				state.templates = state.templates.filter(template => template.id !== templateId);
				state.total -= 1;
			})
			// Duplicate template
			.addCase(duplicateTemplateAsync.fulfilled, (state, action) => {
				// Add the duplicated template to the list
				state.templates.unshift(action.payload);
				state.total += 1;
			});
	},
});

export const {
	setCurrentPage,
	setPerPage,
	setSearchTerm,
	clearError,
} = templatesSlice.actions;

export default templatesSlice.reducer;