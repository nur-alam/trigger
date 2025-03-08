/* eslint-disable @typescript-eslint/no-explicit-any */
export type {};

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const wp: any;
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		wp: any;
		ajaxurl: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		tinymce: any;
		_triggerObject: {
			user_id: Int;
			site_url: string;
			admin_url: string;
			ajax_url: string;
			rest_url: string;
			nonce_key: string;
			nonce_value: string;
			wp_rest_nonce: string;
		};
	}
}
