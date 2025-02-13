declare global {
	interface Window {
		triggerObject: {
			admin_url: string;
			ajax_url: string;
			nonce_key: string;
			nonce_value: string;
			rest_url: string;
			site_url: string;
			user_id: number;
			wp_rest_nonce: string;
		};
	}
}
