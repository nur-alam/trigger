import config from '@config/index';
import toast from 'react-hot-toast';

export function getSlugFromUrl(url = '', slug = 'page') {
	if (url && slug) {
		const _url = new URL(url);
		return _url.searchParams.get(slug);
	}
}

export async function fetchUtil(apiEndpoint = '', options = {}) {
	const { nonce_value } = config;
	const url = `${config.rest_url}${apiEndpoint}`;

	try {
		const response = await fetch(url, options);

		const data = await response.json();
		if (data.status === 200) {
			// toast.success(data.response);
			return data;
		} else {
			toast.error(`Error ${data?.response}`);
			// throw new Error(data.response);
		}

		// return data;
	} catch (error) {
		throw new Error(error);
	}
}
