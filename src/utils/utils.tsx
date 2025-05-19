import config from "@/config";
import { TriggerResponseType } from "./trigger-declaration";

export function getSlugFromUrl(url: string = '', slug: string = 'page'): string {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug) || '';
	}
	return '';
}

type FetchUtilOptions = {
	body?: AnyObject;
	headers?: Record<string, string>;
	method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
};

export async function fetchUtil(
	endpoint: string,
	options: FetchUtilOptions = {}
): Promise<TriggerResponseType> {
	const { wp_rest_nonce, nonce_key, nonce_value } = config;
	const url = `${endpoint}`;

	// Create a new options object that matches RequestInit
	const fetchOptions: RequestInit = {
		method: options.method || 'POST',
		headers: {
			'X-WP-Nonce': wp_rest_nonce,
			...(options.headers || {})
		},
		body: options.body ? JSON.stringify(options.body) : undefined
	};

	if (options.body) {
		const formData = convertToFormData(options.body);
		formData.append(nonce_key, nonce_value);
		fetchOptions.body = formData;
	}

	try {
		const apiResponse = await fetch(url, fetchOptions);

		const response = await apiResponse.json() as TriggerResponseType;

		if (response.status_code === 200) {
			return response;
		} else {
			throw new Error(response.message);
		}
	} catch (error: any) {
		throw new Error(error?.message || 'Unknown fetch error');
	}
}

export interface AnyObject {
	[x: string]: any;
}
type Method = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const isFileOrBlob = (value: unknown): value is File | Blob => {
	return value instanceof File || value instanceof Blob;
};
const isString = (value: unknown): value is string => {
	return typeof value === 'string';
}
const isBoolean = (value: unknown): value is boolean => {
	return typeof value === 'boolean';
};
const isNumber = (value: unknown): value is number => {
	return typeof value === 'number';
}

export const convertToFormData = (values: AnyObject) => {
	const formData = new FormData();

	for (const key of Object.keys(values)) {
		const value = values[key];

		if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (isFileOrBlob(item) || isString(item)) {
					formData.append(`${key}[${index}]`, item);
				} else if (isBoolean(item) || isNumber(item)) {
					formData.append(`${key}[${index}]`, item.toString());
				} else if (typeof item === 'object' && item !== null) {
					formData.append(`${key}[${index}]`, JSON.stringify(item));
				} else {
					formData.append(`${key}[${index}]`, item);
				}
			});
		} else {
			if (isFileOrBlob(value) || isString(value)) {
				formData.append(key, value);
			} else if (isBoolean(value)) {
				formData.append(key, value.toString());
			} else if (isNumber(value)) {
				formData.append(key, `${value}`);
			} else if (typeof value === 'object' && value !== null) {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, value);
			}
		}
	}

	return formData;
};

export const triggerFormData = (data: Object) => {
	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return formData;
}

export const triggerKeyValue = (data: Object) => {
	const obj: Record<string, string> = {};
	for (const [key, value] of Object.entries(data)) {
		obj[key] = value;
	}
	return obj;
}

export const getProviderFullName = (provider: string): string => {
	const providerMap: { [key: string]: string } = {
		'ses': 'Amazon SES',
		'smtp': 'SMTP',
		'sendgrid': 'SendGrid',
		'mailgun': 'Mailgun',
		'postmark': 'Postmark',
		'sparkpost': 'SparkPost',
		'mailchimp': 'Mailchimp',
		'sendinblue': 'Sendinblue',
		'gmail': 'Gmail',
		'outlook': 'Microsoft Outlook',
		'yahoo': 'Yahoo Mail',
	};

	return providerMap[provider.toLowerCase()] || provider;
};