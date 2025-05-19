import config from '@/config';
import { AnyObject, convertToFormData, fetchUtil, triggerFormData, triggerKeyValue } from '@/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { ResponseType } from '@/utils/trigger-declaration';
import toast from 'react-hot-toast';
import { __ } from '@wordpress/i18n';

const updateProvider = async (payload: AnyObject) => {
	payload.action = 'update_email_config';
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useUpdateProvider = () => {
	return useMutation({
		mutationFn: updateProvider,
		onError: (error: any) => {
			console.log('mutation error', error);
		},
	});
};

const connectWithGmail = async () => {
	const payload = {
		action: 'trigger_connect_with_gmail',
		trigger_nonce: config.nonce_value,
	};
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useConnectGmail = () => {
	return useMutation({
		mutationFn: connectWithGmail,
		onSuccess: (response: ResponseType) => {
			window.location.href = response.data.auth_url;
		},
		onError: (error: any) => {
			toast.error(error.message || __('Failed to connect with Gmail. Please try again.', 'trigger'));
		},
	});
};
