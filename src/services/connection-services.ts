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
		onSuccess: (response: ResponseType) => {
			toast.success(response.message ?? __('Email configuration saved successfully!', 'trigger'));
		},
		onError: (error: any) => {
			toast.error(error.message ?? __('Failed to save email configuration', 'trigger'));
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

const isGmailConnected = async () => {
	const payload = {
		action: 'trigger_is_gmail_connected',
	};
	const res = await fetchUtil(config.ajax_url, { body: payload });
	return res;
};

export const useIsGmailConnected = () => {
	return useMutation({
		mutationFn: isGmailConnected,
		onSuccess: (response: ResponseType) => {},
		onError: (error: any) => {
			console.log('useIsGmailConnected', error);
			toast.error(error.message || __('Failed to check connection. Please try again.', 'trigger'));
		},
	});
};
