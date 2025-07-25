import { createAsyncThunk } from '@reduxjs/toolkit';
import { EmailComponent, EmailTemplate } from '../../entries/email-builder/types';

// Async thunk for saving templates
export const saveTemplateAsync = createAsyncThunk(
	'emailBuilder/saveTemplate',
	async ({
		name,
		components,
		description = '',
		thumbnail = '',
	}: {
		name: string;
		components: EmailComponent[];
		description?: string;
		thumbnail?: string;
	}) => {
		try {
			const response = await fetch(`${window._triggerObject.rest_url}/email-templates`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
				},
				body: JSON.stringify({
					name,
					components,
					description,
					thumbnail,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to save template');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw new Error(`Failed to save template: ${error}`);
		}
	}
);

// Async thunk for loading templates
export const loadTemplateAsync = createAsyncThunk('emailBuilder/loadTemplate', async (templateId: string) => {
	try {
		const response = await fetch(`${window._triggerObject.rest_url}/email-templates/${templateId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to load template');
		}

		const data = await response.json();
		
		// Map the response to match the expected format
		return {
			id: data.id,
			name: data.name,
			description: data.description,
			components: data.components,
			thumbnail: data.thumbnail,
			is_active: data.is_active,
			created_by: data.created_by,
			createdAt: data.created_at,
			updatedAt: data.updated_at,
		};
	} catch (error) {
		throw new Error(`Failed to load template: ${error}`);
	}
});

// Async thunk for fetching all templates
export const fetchTemplatesAsync = createAsyncThunk(
	'emailBuilder/fetchTemplates',
	async ({ page = 1, per_page = 10 }: { page?: number; per_page?: number }) => {
		try {
			const response = await fetch(`${window._triggerObject.rest_url}/email-templates?page=${page}&per_page=${per_page}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch templates');
			}

			const data = await response.json();
			
			// Map the response to match the expected format
			const templates = data.map((item: any) => ({
				id: item.data.id,
				name: item.data.name,
				description: item.data.description,
				components: item.data.components,
				thumbnail: item.data.thumbnail,
				is_active: item.data.is_active,
				created_by: item.data.created_by,
				createdAt: item.data.created_at,
				updatedAt: item.data.updated_at,
			}));

			return {
				templates,
				total: templates.length,
			};
		} catch (error) {
			throw new Error(`Failed to fetch templates: ${error}`);
		}
	}
);

// Async thunk for deleting templates
export const deleteTemplateAsync = createAsyncThunk('emailBuilder/deleteTemplate', async (templateId: string) => {
	try {
		const response = await fetch(`${window._triggerObject.rest_url}/email-templates/${templateId}`, {
			method: 'DELETE',
			headers: {
				'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
			},
		});

		if (!response.ok) {
			throw new Error('Failed to delete template');
		}

		return { templateId };
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : 'Failed to delete template');
	}
});

// Async thunk for duplicating templates
export const duplicateTemplateAsync = createAsyncThunk(
	'emailBuilder/duplicateTemplate',
	async ({ templateId, newName }: { templateId: string; newName?: string }) => {
		try {
			const response = await fetch(`${window._triggerObject.rest_url}/email-templates/${templateId}/duplicate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
				},
				body: JSON.stringify({
					new_name: newName || '',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to duplicate template');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw new Error(`Failed to duplicate template: ${error}`);
		}
	}
);

// Async thunk for updating templates
export const updateTemplateAsync = createAsyncThunk(
	'emailBuilder/updateTemplate',
	async ({
		templateId,
		name,
		components,
		description,
		thumbnail,
	}: {
		templateId: string;
		name?: string;
		components?: EmailComponent[];
		description?: string;
		thumbnail?: string;
	}) => {
		try {
			const response = await fetch(`${window._triggerObject.rest_url}/email-templates/${templateId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window._triggerObject.wp_rest_nonce,
				},
				body: JSON.stringify({
					name,
					components,
					description,
					thumbnail,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update template');
			}

			const data = await response.json();
			return data;
		} catch (error) {
			throw new Error(`Failed to update template: ${error}`);
		}
	}
);
