import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { EmailComponent } from '../../entries/email-builder/types';

// Base selectors
export const selectComponents = (state: RootState) => state.emailBuilder.components;
export const selectSelectedComponentId = (state: RootState) => state.emailBuilder.selectedComponentId;
export const selectActiveId = (state: RootState) => state.emailBuilder.activeId;
export const selectHistory = (state: RootState) => state.emailBuilder.history;
export const selectHistoryIndex = (state: RootState) => state.emailBuilder.historyIndex;
export const selectIsLoading = (state: RootState) => state.emailBuilder.isLoading;
export const selectError = (state: RootState) => state.emailBuilder.error;

// Memoized selectors
export const selectEmailBuilderState = createSelector(
	[(state: RootState) => state.emailBuilder],
	(emailBuilder) => emailBuilder
);

// Computed selectors
export const selectSelectedComponent = createSelector(
	[selectComponents, selectSelectedComponentId],
	(components, selectedId) => (selectedId ? components.find((c) => c.id === selectedId) || null : null)
);

export const selectCanUndo = createSelector([selectHistoryIndex], (historyIndex) => historyIndex > 0);

export const selectCanRedo = createSelector(
	[selectHistory, selectHistoryIndex],
	(history, historyIndex) => historyIndex < history.length - 1
);

export const selectComponentById = createSelector(
	[selectComponents, (state: RootState, id: string) => id],
	(components, id) => components.find((c) => c.id === id) || null
);

export const selectComponentsByType = createSelector(
	[selectComponents, (state: RootState, type: string) => type],
	(components, type) => components.filter((c) => c.type === type)
);

export const selectComponentsCount = createSelector([selectComponents], (components) => components.length);

export const selectHasComponents = createSelector([selectComponentsCount], (count) => count > 0);
