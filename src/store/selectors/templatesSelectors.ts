import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Base selectors
export const selectTemplatesState = (state: RootState) => state.templates;
export const selectTemplates = (state: RootState) => state.templates.templates;
export const selectTemplatesTotal = (state: RootState) => state.templates.total;
export const selectTemplatesLoading = (state: RootState) => state.templates.isLoading;
export const selectTemplatesError = (state: RootState) => state.templates.error;
export const selectCurrentPage = (state: RootState) => state.templates.currentPage;
export const selectPerPage = (state: RootState) => state.templates.perPage;
export const selectSearchTerm = (state: RootState) => state.templates.searchTerm;

// Memoized selectors
export const selectFilteredTemplates = createSelector(
	[selectTemplates, selectSearchTerm],
	(templates, searchTerm) => {
		if (!searchTerm) return templates;
		
		const lowercaseSearch = searchTerm.toLowerCase();
		return templates.filter(template => 
			template.name.toLowerCase().includes(lowercaseSearch) ||
			template.description.toLowerCase().includes(lowercaseSearch)
		);
	}
);

export const selectPaginatedTemplates = createSelector(
	[selectFilteredTemplates, selectCurrentPage, selectPerPage],
	(templates, currentPage, perPage) => {
		const startIndex = (currentPage - 1) * perPage;
		const endIndex = startIndex + perPage;
		return templates.slice(startIndex, endIndex);
	}
);

export const selectTotalPages = createSelector(
	[selectFilteredTemplates, selectPerPage],
	(templates, perPage) => {
		return Math.ceil(templates.length / perPage);
	}
);

export const selectTemplateById = createSelector(
	[selectTemplates, (state: RootState, templateId: number) => templateId],
	(templates, templateId) => {
		return templates.find(template => template.id === templateId);
	}
);

export const selectHasTemplates = createSelector(
	[selectTemplates],
	(templates) => templates.length > 0
);

export const selectIsFirstPage = createSelector(
	[selectCurrentPage],
	(currentPage) => currentPage === 1
);

export const selectIsLastPage = createSelector(
	[selectCurrentPage, selectTotalPages],
	(currentPage, totalPages) => currentPage >= totalPages
);