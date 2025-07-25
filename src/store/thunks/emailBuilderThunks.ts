import { createAsyncThunk } from '@reduxjs/toolkit';
import { EmailComponent, EmailTemplate } from '../../entries/email-builder/types';

// Async thunk for saving templates
export const saveTemplateAsync = createAsyncThunk(
	'emailBuilder/saveTemplate',
	async ({ name, components }: { name: string; components: EmailComponent[] }) => {
		// TODO: Implement actual API call to WordPress backend
		try {
			const response = await fetch('/wp-admin/admin-ajax.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'trigger_save_email_template',
					name,
					components: JSON.stringify(components),
					nonce: (window as any).triggerAjax?.nonce || '',
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
	// TODO: Implement actual API call to WordPress backend
	try {
		const response = await fetch('/wp-admin/admin-ajax.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				action: 'trigger_load_email_template',
				template_id: templateId,
				nonce: (window as any).triggerAjax?.nonce || '',
			}),
		});

		if (!response.ok) {
			throw new Error('Failed to load template');
		}

		const data = await response.json();
		return data.components as EmailComponent[];
	} catch (error) {
		throw new Error(`Failed to load template: ${error}`);
	}
});

// Async thunk for fetching all templates
export const fetchTemplatesAsync = createAsyncThunk(
	'emailBuilder/fetchTemplates',
	async () => {
		// TODO: Implement actual API call to WordPress backend
		try {
			const response = await fetch('/wp-admin/admin-ajax.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'trigger_fetch_email_templates',
					nonce: (window as any).triggerAjax?.nonce || '',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to fetch templates');
			}

			const data = await response.json();
			return data.templates as EmailTemplate[];
		} catch (error) {
			throw new Error(`Failed to fetch templates: ${error}`);
		}
	}
);

// Async thunk for deleting templates
export const deleteTemplateAsync = createAsyncThunk(
	'emailBuilder/deleteTemplate',
	async (templateId: string) => {
		// TODO: Implement actual API call to WordPress backend
		try {
			const response = await fetch('/wp-admin/admin-ajax.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					action: 'trigger_delete_email_template',
					template_id: templateId,
					nonce: (window as any).triggerAjax?.nonce || '',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to delete template');
			}

			const data = await response.json();
			return templateId;
		} catch (error) {
			throw new Error(`Failed to delete template: ${error}`);
		}
	}
);
